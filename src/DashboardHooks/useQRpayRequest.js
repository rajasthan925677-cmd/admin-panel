import { useState } from "react";
import {
  fetchQRPayRequests,
  updateQRPayRequestStatus,
  updateUserBalance,
} from "../DashboardServices/QRpayRequestServices";

const useQRpayRequest = () => {
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState("all");
  const [userId, setUserId] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRequests = await fetchQRPayRequests(date, status, userId);
      setRequests(fetchedRequests);
    } catch (err) {
      setError("Failed to fetch requests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId, amount, userId) => {
    try {
      setLoading(true);
      await updateQRPayRequestStatus(requestId, "approved");
      await updateUserBalance(userId, amount);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, requestStatus: "approved" } : req
        )
      );
    } catch (err) {
      setError("Failed to accept request: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setLoading(true);
      await updateQRPayRequestStatus(requestId, "rejected");
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, requestStatus: "rejected" } : req
        )
      );
    } catch (err) {
      setError("Failed to reject request: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    date,
    setDate,
    status,
    setStatus,
    userId,
    setUserId,
    requests,
    loading,
    error,
    handleSearch,
    handleAccept,
    handleReject,
  };
};

export default useQRpayRequest;