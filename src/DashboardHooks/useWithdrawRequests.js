import { useState, useCallback } from "react";
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const useWithdrawRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [filterValues, setFilterValues] = useState({ date: "", requestStatus: "", userId: "" });
  const [appliedFilters, setAppliedFilters] = useState({ date: "", requestStatus: "", userId: "" });

  // convert yyyy-mm-dd -> dd-mm-yyyy
  const formatDateForQuery = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const fetchRequests = useCallback(async (filters) => {
    setLoadingRequests(true);
    try {
      const colRef = collection(db, "withdraw_requests");
      const constraints = [];

      if (filters.userId) constraints.push(where("userId", "==", filters.userId));
      if (filters.requestStatus) constraints.push(where("requestStatus", "==", filters.requestStatus));
      if (filters.date) constraints.push(where("requestDate", "==", filters.date));

      const q = constraints.length ? query(colRef, ...constraints) : query(colRef);
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRequests(data);
    } catch (err) {
      console.error("fetchWithdrawRequests error:", err);
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  // apply filters (format date and fetch data with new filters)
  const applyFilters = () => {
    const formattedDate = filterValues.date ? formatDateForQuery(filterValues.date) : "";
    const newFilters = { ...filterValues, date: formattedDate };
    setAppliedFilters(newFilters);
    fetchRequests(newFilters); // Pass new filters directly
  };

  // clear filters
  const clearFilters = () => {
    const cleared = { date: "", requestStatus: "", userId: "" };
    setFilterValues(cleared);
    setAppliedFilters(cleared);
    setRequests([]); // Clear requests when filters are cleared
  };

  const handleAccept = async (id, userId, amount) => {
    try {
      await updateDoc(doc(db, "withdraw_requests", id), { requestStatus: "accepted" });

      // deduct user balance
      const userSnap = await getDoc(doc(db, "users", userId));
      const userData = userSnap.exists() ? userSnap.data() : {};
      const newBalance = (userData.balance || 0) - Number(amount || 0);
      await updateDoc(doc(db, "users", userId), { balance: newBalance });

      fetchRequests(appliedFilters); // Use current appliedFilters
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, "withdraw_requests", id), { requestStatus: "rejected" });
      fetchRequests(appliedFilters); // Use current appliedFilters
    } catch (err) {
      console.error(err);
    }
  };

  return {
    requests,
    loadingRequests,
    filterValues,
    setFilterValues,
    applyFilters,
    handleAccept,
    handleReject,
    clearFilters,
  };
};

export default useWithdrawRequests;