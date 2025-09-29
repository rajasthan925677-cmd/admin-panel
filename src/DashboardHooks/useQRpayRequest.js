import { useState } from "react";
import {
  fetchQRPayRequests,
  updateQRPayRequestStatus,
  updateUserBalance,
} from "../DashboardServices/QRpayRequestServices";

const useQRpayRequest = () => {
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState("all");
  const [mobile, setMobile] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeMobile = (input) => {
    // Remove country code (+91), spaces, dashes, or other non-digits
    return input.replace(/^\+91|\D/g, "");
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const normalizedMobile = normalizeMobile(mobile);
     // console.log("Search parameters:", { date: date ? date.toISOString() : null, status, mobile, normalizedMobile });
      const fetchedRequests = await fetchQRPayRequests(date, status, normalizedMobile);
     // console.log("Fetched requests:", fetchedRequests.map(r => ({ id: r.id, mobile: r.mobile, paymentDate: r.paymentDate })));
      setRequests(fetchedRequests);
    } catch (err) {
      console.error("fetchQRPayRequests error:", err);
      setError("Failed to fetch requests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setDate(null);
    setStatus("all");
    setMobile("");
    setRequests([]);
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
    mobile,
    setMobile,
    requests,
    loading,
    error,
    handleSearch,
    handleAccept,
    handleReject,
    clearFilters,
  };
};

export default useQRpayRequest;