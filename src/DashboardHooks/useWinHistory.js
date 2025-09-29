import { useState, useEffect, useCallback } from "react";
import * as gameService from "../DashboardServices/GamesService";
import * as winHistoryService from "../DashboardServices/WinHistoryService";

const useWinHistory = () => {
  const [games, setGames] = useState([]);
  const [filteredWinBids, setFilteredWinBids] = useState([]);
  const [editedBids, setEditedBids] = useState({});
  const [editingBidId, setEditingBidId] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterGame, setFilterGame] = useState("");
  const [filterType, setFilterType] = useState("");
  const [gamesLoading, setGamesLoading] = useState(true);
  const [totalWinLoading, setTotalWinLoading] = useState(true);
  const [totalWinAmount, setTotalWinAmount] = useState(0);
  const [isSearched, setIsSearched] = useState(false);

  // Function to convert YYYY-MM-DD to DD Mon YYYY
  const formatDateToFirestore = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      const day = String(date.getDate()).padStart(2, "0");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (err) {
      console.error("Error formatting date:", err.message);
      return null;
    }
  };

  // Function to get current server date in DD Mon YYYY format
  const getCurrentServerDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const fetchData = useCallback(async () => {
    try {
      const gamesData = await Promise.race([
        gameService.getGames(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching games")), 5000)),
      ]);
      setGames(gamesData || []);
    } catch (err) {
      console.error("Error fetching games:", err.message);
      setGames([]);
    } finally {
      setGamesLoading(false);
    }
  }, []);

  const fetchTotalWinAmount = useCallback(async () => {
    try {
      const currentDate = getCurrentServerDate();
      const winBidsData = await winHistoryService.getWinBids(currentDate, null, null);
      const total = winBidsData.reduce((sum, bid) => sum + (Number(bid.payoutAmount) || 0), 0);
      setTotalWinAmount(total);
    } catch (err) {
      console.error("Error fetching total win amount:", err.message);
      setTotalWinAmount(0);
    } finally {
      setTotalWinLoading(false);
    }
  }, []);

  const handleSearch = async () => {
    try {
      const formattedDate = formatDateToFirestore(filterDate);
      const winBidsData = await winHistoryService.getWinBids(
        formattedDate,
        filterGame || null,
        filterType || null
      );
      setFilteredWinBids(winBidsData);
      setIsSearched(true);
      const editState = {};
      winBidsData.forEach((bid) => {
        editState[bid.docId] = { ...bid };
      });
      setEditedBids(editState);
    } catch (err) {
      console.error("Error fetching winning bids:", err.message);
      setIsSearched(true);
      setFilteredWinBids([]);
    }
  };

  const clearFilters = () => {
    setFilterDate("");
    setFilterGame("");
    setFilterType("");
    setFilteredWinBids([]);
    setIsSearched(false);
    setEditingBidId(null);
    setEditedBids({});
  };

  const handleEditToggle = async (docId) => {
    if (editingBidId === docId) {
      if (window.confirm("⚠️ Are you sure you want to update this bid?")) {
        try {
          const exists = await winHistoryService.checkBidExists(docId);
          if (!exists) {
            alert(`Bid with document ID ${docId} does not exist in Firestore.`);
            await handleSearch();
            await fetchTotalWinAmount();
            return;
          }
          const updatedBid = { ...editedBids[docId] };
          delete updatedBid.docId;
          delete updatedBid.id;
          delete updatedBid.userId;
          await winHistoryService.updateBid(docId, updatedBid);
          setEditingBidId(null);
          await handleSearch();
          await fetchTotalWinAmount();
        } catch (err) {
          console.error("Error updating bid:", err.message);
          alert(`Failed to update bid: ${err.message}`);
        }
      }
    } else {
      setEditingBidId(docId);
      setEditedBids((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId] || {},
          ...filteredWinBids.find((bid) => bid.docId === docId),
        },
      }));
    }
  };

  const handleBidChange = (docId, field, value) => {
    setEditedBids((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: value,
      },
    }));
  };

  const deleteBid = async (docId) => {
    if (window.confirm("⚠️ Are you sure you want to DELETE this bid?")) {
      try {
        const exists = await winHistoryService.checkBidExists(docId);
        if (!exists) {
          alert(`Bid with document ID ${docId} does not exist in Firestore.`);
          await handleSearch();
          await fetchTotalWinAmount();
          return;
        }
        await winHistoryService.deleteBid(docId);
        setEditingBidId(null);
        await handleSearch();
        await fetchTotalWinAmount();
      } catch (err) {
        console.error("Error deleting bid:", err.message);
        alert(`Failed to delete bid: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchTotalWinAmount();
  }, [fetchData, fetchTotalWinAmount]);

  const loading = gamesLoading || totalWinLoading;

  return {
    games,
    filteredWinBids,
    editedBids,
    editingBidId,
    filterDate,
    setFilterDate,
    filterGame,
    setFilterGame,
    filterType,
    setFilterType,
    handleSearch,
    clearFilters,
    handleEditToggle,
    handleBidChange,
    deleteBid,
    loading,
    isSearched,
    totalWinAmount,
  };
};

export default useWinHistory;