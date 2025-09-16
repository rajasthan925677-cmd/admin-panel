import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import * as userService from "../DashboardServices/UsersService";
import * as gameService from "../DashboardServices/GamesService";
import * as bidsService from "../DashboardServices/UserDetailService";

const useUserDetail = () => {
  const { mobile } = useParams();
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [filteredWinBids, setFilteredWinBids] = useState([]);
  const [filteredWithdrawRequests, setFilteredWithdrawRequests] = useState([]);
  const [filteredAddRequests, setFilteredAddRequests] = useState([]);
  const [filteredQRAddRequests, setFilteredQRAddRequests] = useState([]);
  const [editedBids, setEditedBids] = useState({});
  const [editedWithdrawRequests, setEditedWithdrawRequests] = useState({});
  const [editedAddRequests, setEditedAddRequests] = useState({});
  const [editedQRAddRequests, setEditedQRAddRequests] = useState({});
  const [editingBidId, setEditingBidId] = useState(null);
  const [editingWithdrawRequestId, setEditingWithdrawRequestId] = useState(null);
  const [editingAddRequestId, setEditingAddRequestId] = useState(null);
  const [editingQRAddRequestId, setEditingQRAddRequestId] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterGame, setFilterGame] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterWinDate, setFilterWinDate] = useState("");
  const [filterWithdrawFromDate, setFilterWithdrawFromDate] = useState("");
  const [filterWithdrawToDate, setFilterWithdrawToDate] = useState("");
  const [filterAddDate, setFilterAddDate] = useState("");
  const [filterQRAddDate, setFilterQRAddDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearched, setIsSearched] = useState(false);
  const [isWinSearched, setIsWinSearched] = useState(false);
  const [isWithdrawSearched, setIsWithdrawSearched] = useState(false);
  const [isAddSearched, setIsAddSearched] = useState(false);
  const [isQRAddSearched, setIsQRAddSearched] = useState(false);

  // Function to convert YYYY-MM-DD to DD MMM YYYY for bids, wins, etc.
  const formatDateToFirestore = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const formattedDate = `${parseInt(day, 10)} ${months[month - 1]} ${year}`;
    return formattedDate;
  };

  // Function to convert YYYY-MM-DD to DD-MM-YYYY for add requests
  const formatDateForAdd = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Function to convert YYYY-MM-DD to DD-MM-YYYY for withdraw requests
  const formatDateForWithdraw = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Function to convert YYYY-MM-DD to DD/MM/YYYY for QR
  const formatDateForQR = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Function to extract date part from Firestore paymentDateTime for QR
  const extractDateFromPaymentDateTime = (paymentDateTime) => {
    if (!paymentDateTime) return null;
    // Assuming paymentDateTime is in "DD/MM/YYYY HH:MM:SS" format
    const [datePart] = paymentDateTime.split(' ');
    return datePart.trim(); // Returns "DD/MM/YYYY" and removes any extra spaces
  };

  const fetchData = useCallback(async () => {
    try {
      const userData = await userService.getUserByMobile(mobile);
      setUser(userData);

      const gamesData = await gameService.getGames();
      setGames(gamesData);
    } catch (err) {
      console.error("Error fetching data:", err.message);
    } finally {
      setLoading(false);
    }
  }, [mobile]);

  const handleSearch = async () => {
    try {
      const formattedDate = formatDateToFirestore(filterDate);
      const bidsData = await bidsService.getBidsByUser(
        mobile,
        formattedDate,
        filterGame || null,
        filterType || null
      );
      setFilteredBids(bidsData);
      setIsSearched(true);

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

  const handleWinSearch = async () => {
    try {
      const formattedDate = formatDateToFirestore(filterWinDate);
      const winBidsData = await bidsService.getWinBidsByUser(mobile, formattedDate);
      setFilteredWinBids(winBidsData);
      setIsWinSearched(true);

      const editState = { ...editedBids };
      winBidsData.forEach((bid) => {
        editState[bid.docId] = { ...bid };
      });
      setEditedBids(editState);
    } catch (err) {
      console.error("Error fetching winning bids:", err.message);
      setIsWinSearched(true);
    }
  };

  const handleWithdrawSearch = async () => {
    try {
      // Reset previous state to avoid stale data
      setFilteredWithdrawRequests([]);
      setIsWithdrawSearched(false);

      const formattedFromDate = formatDateForWithdraw(filterWithdrawFromDate);
      const formattedToDate = formatDateForWithdraw(filterWithdrawToDate);
      

      if (formattedFromDate && formattedToDate) {
        const fromDateObj = new Date(filterWithdrawFromDate);
        const toDateObj = new Date(filterWithdrawToDate);
        if (fromDateObj > toDateObj) {
          alert("From date cannot be after To date");
          return;
        }
      }

      let withdrawData = await bidsService.getWithdrawRequestsByUser(mobile, formattedFromDate, formattedToDate);

      // Client-side filtering to ensure exact match for requestDate
      if (formattedFromDate || formattedToDate) {
        withdrawData = withdrawData.filter((request) => {
          const requestDate = request.requestDate ? request.requestDate.trim() : null;
          let include = true;
          if (formattedFromDate) {
            include = include && requestDate >= formattedFromDate;
          }
          if (formattedToDate) {
            include = include && requestDate <= formattedToDate;
          }
         
          return include;
        });
      }


      setFilteredWithdrawRequests(withdrawData);
      setIsWithdrawSearched(true);

      const withdrawEditState = {};
      withdrawData.forEach((request) => {
        withdrawEditState[request.docId] = { ...request };
      });
      setEditedWithdrawRequests(withdrawEditState);
    } catch (err) {
      console.error("Error fetching withdraw requests:", err.message);
      setIsWithdrawSearched(true);
      setFilteredWithdrawRequests([]);
    }
  };

  const handleAddSearch = async () => {
    try {
      // Reset previous state to avoid stale data
      setFilteredAddRequests([]);
      setIsAddSearched(false);

      const formattedDate = formatDateForAdd(filterAddDate);


      let addData = await bidsService.getAddRequestsByUser(mobile, formattedDate);

      // Client-side filtering to ensure exact match for paymentDate
      if (formattedDate) {
        addData = addData.filter((request) => {
          const paymentDate = request.paymentDate ? request.paymentDate.trim() : null;
          const include = paymentDate === formattedDate;
          
          return include;
        });
      }

     

      setFilteredAddRequests(addData);
      setIsAddSearched(true);

      const addEditState = {};
      addData.forEach((request) => {
        addEditState[request.docId] = { ...request };
      });
      setEditedAddRequests(addEditState);
    } catch (err) {
      console.error("Error fetching add fund requests:", err.message);
      setIsAddSearched(true);
      setFilteredAddRequests([]);
    }
  };

  const handleQRAddSearch = async () => {
    try {
      // Reset previous state to avoid stale data
      setFilteredQRAddRequests([]);
      setIsQRAddSearched(false);

      const formattedDate = formatDateForQR(filterQRAddDate);
      let qrAddData = await bidsService.getQRAddRequestsByUser(mobile, formattedDate);

      // Client-side filtering to match only date part
      if (formattedDate) {
        qrAddData = qrAddData.filter((request) => {
          const requestDate = extractDateFromPaymentDateTime(request.paymentDateTime);
          return requestDate === formattedDate;
        });
      }

      setFilteredQRAddRequests(qrAddData);
      setIsQRAddSearched(true);

      const qrAddEditState = {};
      qrAddData.forEach((request) => {
        qrAddEditState[request.docId] = { ...request };
      });
      setEditedQRAddRequests(qrAddEditState);
    } catch (err) {
      console.error("Error fetching QR add fund requests:", err.message);
      setIsQRAddSearched(true);
      setFilteredQRAddRequests([]);
    }
  };

  const handleEditToggle = async (docId) => {
    if (editingBidId === docId) {
      if (window.confirm("⚠️ Are you sure you want to update this bid?")) {
        try {
          const exists = await bidsService.checkBidExists(docId);
          if (!exists) {
            alert(`Bid with document ID ${docId} does not exist in Firestore.`);
            await handleSearch();
            await handleWinSearch();
            return;
          }

          const updatedBid = { ...editedBids[docId] };
          delete updatedBid.docId;
          delete updatedBid.id;
          delete updatedBid.userId;
          await bidsService.updateBid(docId, updatedBid);
          setEditingBidId(null);
          await handleSearch();
          await handleWinSearch();
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
          ...filteredBids.find((bid) => bid.docId === docId) ||
            filteredWinBids.find((bid) => bid.docId === docId),
        },
      }));
    }
  };

  const handleWithdrawEditToggle = async (docId) => {
    if (editingWithdrawRequestId === docId) {
      if (window.confirm("⚠️ Are you sure you want to update this withdraw request?")) {
        try {
          const exists = await bidsService.checkWithdrawRequestExists(docId);
          if (!exists) {
            alert(`Withdraw request with document ID ${docId} does not exist in Firestore.`);
            await handleWithdrawSearch();
            return;
          }

          const updatedRequest = { ...editedWithdrawRequests[docId] };
          delete updatedRequest.docId;
          delete updatedRequest.userId;
          await bidsService.updateWithdrawRequest(docId, updatedRequest);
          setEditingWithdrawRequestId(null);
          await handleWithdrawSearch();
        } catch (err) {
          console.error("Error updating withdraw request:", err.message);
          alert(`Failed to update withdraw request: ${err.message}`);
        }
      }
    } else {
      setEditingWithdrawRequestId(docId);
      setEditedWithdrawRequests((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId] || {},
          ...filteredWithdrawRequests.find((request) => request.docId === docId),
        },
      }));
    }
  };

  const handleAddEditToggle = async (docId) => {
    if (editingAddRequestId === docId) {
      if (window.confirm("⚠️ Are you sure you want to update this add fund request?")) {
        try {
          const exists = await bidsService.checkAddRequestExists(docId);
          if (!exists) {
            alert(`Add fund request with document ID ${docId} does not exist in Firestore.`);
            await handleAddSearch();
            return;
          }

          const updatedRequest = { ...editedAddRequests[docId] };
          delete updatedRequest.docId;
          delete updatedRequest.userId;
          await bidsService.updateAddRequest(docId, updatedRequest);
          setEditingAddRequestId(null);
          await handleAddSearch();
        } catch (err) {
          console.error("Error updating add fund request:", err.message);
          alert(`Failed to update add fund request: ${err.message}`);
        }
      }
    } else {
      setEditingAddRequestId(docId);
      setEditedAddRequests((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId] || {},
          ...filteredAddRequests.find((request) => request.docId === docId),
        },
      }));
    }
  };

  const handleQRAddEditToggle = async (docId) => {
    if (editingQRAddRequestId === docId) {
      if (window.confirm("⚠️ Are you sure you want to update this QR add fund request?")) {
        try {
          const exists = await bidsService.checkQRAddRequestExists(docId);
          if (!exists) {
            alert(`QR add fund request with document ID ${docId} does not exist in Firestore.`);
            await handleQRAddSearch();
            return;
          }

          const updatedRequest = { ...editedQRAddRequests[docId] };
          delete updatedRequest.docId;
          delete updatedRequest.userId;
          await bidsService.updateQRAddRequest(docId, updatedRequest);
          setEditingQRAddRequestId(null);
          await handleQRAddSearch();
        } catch (err) {
          console.error("Error updating QR add fund request:", err.message);
          alert(`Failed to update QR add fund request: ${err.message}`);
        }
      }
    } else {
      setEditingQRAddRequestId(docId);
      setEditedQRAddRequests((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId] || {},
          ...filteredQRAddRequests.find((request) => request.docId === docId),
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

  const handleWithdrawChange = (docId, field, value) => {
    setEditedWithdrawRequests((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: value,
      },
    }));
  };

  const handleAddChange = (docId, field, value) => {
    setEditedAddRequests((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: value,
      },
    }));
  };

  const handleQRAddChange = (docId, field, value) => {
    setEditedQRAddRequests((prev) => ({
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
        const exists = await bidsService.checkBidExists(docId);
        if (!exists) {
          alert(`Bid with document ID ${docId} does not exist in Firestore.`);
          await handleSearch();
          await handleWinSearch();
          return;
        }

        await bidsService.deleteBid(docId);
        setEditingBidId(null);
        await handleSearch();
        await handleWinSearch();
      } catch (err) {
        console.error("Error deleting bid:", err.message);
        alert(`Failed to delete bid: ${err.message}`);
      }
    }
  };

  const deleteWithdrawRequest = async (docId) => {
    if (window.confirm("⚠️ Are you sure you want to DELETE this withdraw request?")) {
      try {
        const exists = await bidsService.checkWithdrawRequestExists(docId);
        if (!exists) {
          alert(`Withdraw request with document ID ${docId} does not exist in Firestore.`);
          await handleWithdrawSearch();
          return;
        }

        await bidsService.deleteWithdrawRequest(docId);
        setEditingWithdrawRequestId(null);
        await handleWithdrawSearch();
      } catch (err) {
        console.error("Error deleting withdraw request:", err.message);
        alert(`Failed to delete withdraw request: ${err.message}`);
      }
    }
  };

  const deleteAddRequest = async (docId) => {
    if (window.confirm("⚠️ Are you sure you want to DELETE this add fund request?")) {
      try {
        const exists = await bidsService.checkAddRequestExists(docId);
        if (!exists) {
          alert(`Add fund request with document ID ${docId} does not exist in Firestore.`);
          await handleAddSearch();
          return;
        }

        await bidsService.deleteAddRequest(docId);
        setEditingAddRequestId(null);
        await handleAddSearch();
      } catch (err) {
        console.error("Error deleting add fund request:", err.message);
        alert(`Failed to delete add fund request: ${err.message}`);
      }
    }
  };

  const deleteQRAddRequest = async (docId) => {
    if (window.confirm("⚠️ Are you sure you want to DELETE this QR add fund request?")) {
      try {
        const exists = await bidsService.checkQRAddRequestExists(docId);
        if (!exists) {
          alert(`QR add fund request with document ID ${docId} does not exist in Firestore.`);
          await handleQRAddSearch();
          return;
        }

        await bidsService.deleteQRAddRequest(docId);
        setEditingQRAddRequestId(null);
        await handleQRAddSearch();
      } catch (err) {
        console.error("Error deleting QR add fund request:", err.message);
        alert(`Failed to delete QR add fund request: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    user,
    games,
    filteredBids,
    filteredWinBids,
    filteredWithdrawRequests,
    filteredAddRequests,
    filteredQRAddRequests,
    editedBids,
    editedWithdrawRequests,
    editedAddRequests,
    editedQRAddRequests,
    editingBidId,
    editingWithdrawRequestId,
    editingAddRequestId,
    editingQRAddRequestId,
    filterDate,
    setFilterDate,
    filterGame,
    setFilterGame,
    filterType,
    setFilterType,
    filterWinDate,
    setFilterWinDate,
    filterWithdrawFromDate,
    setFilterWithdrawFromDate,
    filterWithdrawToDate,
    setFilterWithdrawToDate,
    filterAddDate,
    setFilterAddDate,
    filterQRAddDate,
    setFilterQRAddDate,
    handleSearch,
    handleWinSearch,
    handleWithdrawSearch,
    handleAddSearch,
    handleQRAddSearch,
    handleEditToggle,
    handleWithdrawEditToggle,
    handleAddEditToggle,
    handleQRAddEditToggle,
    handleBidChange,
    handleWithdrawChange,
    handleAddChange,
    handleQRAddChange,
    deleteBid,
    deleteWithdrawRequest,
    deleteAddRequest,
    deleteQRAddRequest,
    loading,
    isSearched,
    isWinSearched,
    isWithdrawSearched,
    isAddSearched,
    isQRAddSearched,
  };
};

export default useUserDetail;