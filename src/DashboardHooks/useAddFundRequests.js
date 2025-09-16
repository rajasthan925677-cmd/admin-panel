import { useState, useCallback } from "react";
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const useAddFundRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [filterValues, setFilterValues] = useState({ date: "", requestStatus: "", userId: "" });
  const [appliedFilters, setAppliedFilters] = useState({ date: "", requestStatus: "", userId: "" });

  const formatDateForQuery = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const fetchRequests = useCallback(async (filters) => {
    setLoadingRequests(true);
    try {
      const colRef = collection(db, "add_requests");
      const constraints = [];

      if (filters.userId) constraints.push(where("userId", "==", filters.userId));
      if (filters.requestStatus) constraints.push(where("requestStatus", "==", filters.requestStatus));
      if (filters.date) constraints.push(where("paymentDate", "==", filters.date));

      const q = constraints.length ? query(colRef, ...constraints) : query(colRef);
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequests(data);
    } catch (err) {
      console.error("fetchRequests error:", err);
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  const applyFilters = () => {
    const formattedDate = filterValues.date ? formatDateForQuery(filterValues.date) : "";
    const newFilters = { ...filterValues, date: formattedDate };
    setAppliedFilters(newFilters);
    fetchRequests(newFilters); // Pass new filters immediately
  };

  const clearFilters = () => {
    const cleared = { date: "", requestStatus: "", userId: "" };
    setFilterValues(cleared);
    setAppliedFilters(cleared);
    fetchRequests(cleared); // Pass cleared filters immediately
  };

  const handleAccept = async (id, userId, amount) => {
    try {
      const numAmount = Number(amount) || 0;
      await updateDoc(doc(db, "add_requests", id), { requestStatus: "accepted" });

      const userSnap = await getDoc(doc(db, "users", userId));
      const userData = userSnap.exists() ? userSnap.data() : {};
      const newBalance = (userData.balance || 0) + numAmount;
      await updateDoc(doc(db, "users", userId), { balance: newBalance });

      // Optimistic update: Immediately update local state
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, requestStatus: "accepted" } : req
        )
      );

      // Re-fetch to ensure consistency
      fetchRequests(appliedFilters);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, "add_requests", id), { requestStatus: "rejected" });

      // Optimistic update: Immediately update local state
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, requestStatus: "rejected" } : req
        )
      );

      // Re-fetch to ensure consistency
      fetchRequests(appliedFilters);
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

export default useAddFundRequests;