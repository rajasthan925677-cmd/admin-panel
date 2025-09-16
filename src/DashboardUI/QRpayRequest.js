import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import useQRpayRequest from "../DashboardHooks/useQRpayRequest";
import { format } from "date-fns";
import { db } from "../firebase"; // Adjust path to your Firebase config
import { collection, query, where, getDocs } from "firebase/firestore";

const QRpayRequest = () => {
  const navigate = useNavigate();
  const {
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
  } = useQRpayRequest();

  const [totalApprovedToday, setTotalApprovedToday] = useState(0);
  const [fetchError, setFetchError] = useState(null);

  // Fetch total approved amount for today (client-side filtering)
  useEffect(() => {
    const fetchTotalApprovedToday = async () => {
      try {
        const today = format(new Date(), "dd/MM/yyyy"); // e.g., "12/09/2025"
        const q = query(
          collection(db, "QRpayRequest"),
          where("requestStatus", "==", "approved")
        ); // Only status filter, no date range
        const snapshot = await getDocs(q);
        const approvedToday = snapshot.docs
          .map(doc => doc.data())
          .filter(req => req.paymentDateTime.startsWith(today))
          .reduce((sum, req) => sum + (req.amount || 0), 0);
        setTotalApprovedToday(approvedToday);
        setFetchError(null);
      } catch (err) {
        console.error("Error fetching total approved QR today:", err.message);
        setFetchError("Failed to fetch total approved amount: " + err.message);
      }
    };

    fetchTotalApprovedToday();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-900 to-gray-800 text-white p-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          <FiArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      {/* Page Title */}
      <h2 className="text-3xl font-bold mb-6 tracking-tight">QR Pay Requests</h2>

      {/* Filter Section */}
      <div className="bg-green-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="date"
              value={date ? format(date, "yyyy-MM-dd") : ""}
              onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
              className="bg-light-700 border border-blue-600 text-black rounded-lg p-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Select Date"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-light-700 border border-blue-600 text-black rounded-lg p-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="bg-light-700 border border-gray-600 text-black rounded-lg p-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Search
            </button>
          </div>
          <div className="text-lg font-semibold text-white">
            Total Approved QR TODAY: ₹{totalApprovedToday.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {(error || fetchError) && (
        <div className="bg-red-600 bg-opacity-20 text-red-300 p-4 rounded-lg mb-6 border border-red-500">
          {error || fetchError}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-6">
          <span className="text-gray-300 text-lg">Loading...</span>
        </div>
      )}

      {/* Requests Cards */}
      {!loading && requests.length === 0 && (
        <div className="text-center text-gray-300 text-lg py-6">No requests found.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-gradient-to-r from-pink-700 to-blue-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-lg font-semibold mb-3">User ID: {request.userId}</h3>
            <p className="mb-2">Amount: <span className="font-medium">₹{request.amount}</span></p>
            <p className="mb-2">Date: <span className="font-medium">{request.paymentDateTime}</span></p>
            <p className="mb-2">
              Status: <span className={
                request.requestStatus === "pending" ? "text-yellow-300" :
                request.requestStatus === "approved" ? "text-green-300" :
                "text-red-300"
              }>{request.requestStatus}</span>
            </p>
            <p className="mb-2">Transaction ID: <span className="font-medium">{request.transactionId}</span></p>
            <p className="mb-2">Transaction Ref ID: <span className="font-medium">{request.transactionRefId}</span></p>
            <p className="mb-2">UPI Status: <span className="font-medium">{request.upiStatus}</span></p>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleAccept(request.id, request.amount, request.userId)}
                disabled={request.requestStatus !== "pending"}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                  request.requestStatus !== "pending"
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request.id)}
                disabled={request.requestStatus !== "pending"}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                  request.requestStatus !== "pending"
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRpayRequest;