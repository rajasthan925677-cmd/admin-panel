import { useState, useEffect, useCallback } from "react";
import * as gameService from "../DashboardServices/GamesService";
import * as bidHistoryService from "../DashboardServices/BidHistoryService";

const useBidHistory = () => {
  const [games, setGames] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [editedBids, setEditedBids] = useState({});
  const [editingBidId, setEditingBidId] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterGame, setFilterGame] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearched, setIsSearched] = useState(false);

  // Function to convert YYYY-MM-DD to DD Mon YYYY
  const formatDateToFirestore = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const fetchData = useCallback(async () => {
    try {
      const gamesData = await gameService.getGames();
      setGames(gamesData);
    } catch (err) {
      console.error("Error fetching games:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async () => {
    try {
      // Convert date format for Firestore
      const formattedDate = formatDateToFirestore(filterDate);

      const bidsData = await bidHistoryService.getAllBids(
        formattedDate,
        filterGame || null,
        filterType || null
      );

      setFilteredBids(bidsData);
      setIsSearched(true);

      // Initialize editedBids with the fetched bids
      const editState = {};
      bidsData.forEach((bid) => {
        editState[bid.docId] = { ...bid };
      });
      setEditedBids(editState);
    } catch (err) {
      console.error("Error fetching bids:", err.message);
      setIsSearched(true);
    }
  };

  const clearFilters = () => {
    setFilterDate("");
    setFilterGame("");
    setFilterType("");
    setFilteredBids([]);
    setIsSearched(false);
    setEditingBidId(null);
    setEditedBids({});
  };

  const handleEditToggle = async (docId) => {
    if (editingBidId === docId) {
      // Save
      if (window.confirm("⚠️ Are you sure you want to update this bid?")) {
        try {
          // Verify document exists before updating
          const exists = await bidHistoryService.checkBidExists(docId);
          if (!exists) {
            alert(`Bid with document ID ${docId} does not exist in Firestore.`);
            await handleSearch(); // Refresh bids
            return;
          }

          const updatedBid = { ...editedBids[docId] };
          // Remove fields that should not be updated
          delete updatedBid.docId;
          delete updatedBid.id; // Prevent modifying the custom id field
          delete updatedBid.userId; // Prevent modifying userId
          await bidHistoryService.updateBid(docId, updatedBid);
          setEditingBidId(null);
          await handleSearch(); // Refetch bids with current filters
        } catch (err) {
          console.error("Error updating bid:", err.message);
          alert(`Failed to update bid: ${err.message}`);
        }
      }
    } else {
      // Enter edit mode for the specific bid
      setEditingBidId(docId);
      // Initialize editedBids with current bid data if not already present
      setEditedBids((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId] || {},
          ...filteredBids.find((bid) => bid.docId === docId),
        },
      }));
    }
  };

  const handleBidChange = (docId, field, value) => {
    setEditedBids((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]:
          field === "bidAmount" ||
          field === "bidDigit" ||
          field === "panaDigit" ||
          field === "singleDigit" ||
          field === "closePana" ||
          field === "openPana"
            ? parseFloat(value) || 0
            : value,
      },
    }));
  };

  const deleteBid = async (docId) => {
    if (window.confirm("⚠️ Are you sure you want to DELETE this bid?")) {
      try {
        // Verify document exists before deleting
        const exists = await bidHistoryService.checkBidExists(docId);
        if (!exists) {
          alert(`Bid with document ID ${docId} does not exist in Firestore.`);
          await handleSearch(); // Refresh bids
          return;
        }

        await bidHistoryService.deleteBid(docId);
        setEditingBidId(null); // Reset editing state
        await handleSearch(); // Refetch bids with current filters
      } catch (err) {
        console.error("Error deleting bid:", err.message);
        alert(`Failed to delete bid: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    games,
    filteredBids,
    editedBids,
    editingBidId,
    filterDate,
    setFilterDate,
    filterGame,
    setFilterGame,
    filterType,
    setFilterType,
    handleSearch,
    handleEditToggle,
    handleBidChange,
    deleteBid,
    loading,
    isSearched,
    clearFilters,
  };
};

export default useBidHistory;