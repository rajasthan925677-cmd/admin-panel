// src/DashboardUI/WithdrawRequests.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { format } from "date-fns";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import useWithdrawRequests from "../DashboardHooks/useWithdrawRequests";

const WithdrawRequests = () => {
  const navigate = useNavigate();
  
  // Local hook call - now standalone
  const {
    requests,
    loadingRequests,
    filterValues,
    setFilterValues,
    applyFilters,
    handleAccept,
    handleReject,
    clearFilters,
  } = useWithdrawRequests();
  
  const [totalWithdrawToday, setTotalWithdrawToday] = useState(0);
  const [fetchError, setFetchError] = useState(null);

  // Fetch total accepted amount for today
  useEffect(() => {
    const fetchTotalWithdrawToday = async () => {
      try {
        const q = query(
          collection(db, "withdraw_requests"),
          where("requestStatus", "==", "accepted")
        );
        const snapshot = await getDocs(q);
        const today = format(new Date(), "dd-MM-yyyy"); // e.g., "12-09-2025"
        const acceptedToday = snapshot.docs
          .map(doc => doc.data())
          .filter(req => req.requestDate === today)
          .reduce((sum, req) => sum + (req.amount || 0), 0);
        setTotalWithdrawToday(acceptedToday);
        setFetchError(null);
      } catch (err) {
        console.error("Error fetching total withdraw today:", err.message);
        setFetchError("Failed to fetch total withdraw amount: " + err.message);
      }
    };

    fetchTotalWithdrawToday();
  }, []);

  if (loadingRequests) return <p>Loading requests...</p>;

  return (
    <div style={{ marginTop: "70px" }}>
      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: "600",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          <FiArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      {/* Title */}
      <h2 style={{ textAlign: "center", marginBottom: "40px", 
        textDecoration: "underline",fontSize: "50px", color: "#f20c0cff" }}>Withdraw Fund Requests</h2>

      {/* Filters and Total Withdraw Today in Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #fbc531, #2104f6ff)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
          marginBottom: "65px",
        }}
      >
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Date input */}
          <input
            type="date"
            value={filterValues.date}
            onChange={(e) => setFilterValues((prev) => ({ ...prev, date: e.target.value }))}
            style={styles.filterInput}
          />

          {/* Status select */}
          <select
            value={filterValues.requestStatus}
            onChange={(e) => setFilterValues((prev) => ({ ...prev, requestStatus: e.target.value }))}
            style={styles.filterInput}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* UserId input + search button */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Search by User ID"
              value={filterValues.userId}
              onChange={(e) => setFilterValues((prev) => ({ ...prev, userId: e.target.value }))}
              style={{ ...styles.filterInput, marginRight: 6 }}
            />
            <button onClick={applyFilters} title="Search" style={styles.iconBtn}>search</button>
          </div>

          {/* Clear button */}
          <button onClick={clearFilters} style={styles.clearBtn}>Clear</button>

          {/* Total Withdraw Today */}
          <div style={{ fontSize: "28px", fontWeight: "600", color: "#8c0808ff" }}>
             Approved Withdraw Today: ₹{totalWithdrawToday.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {fetchError && (
        <div style={{ backgroundColor: "rgba(220, 38, 38, 0.2)", color: "#fca5a5", padding: "16px", borderRadius: "8px", marginBottom: "24px", border: "1px solid #ef4444" }}>
          {fetchError}
        </div>
      )}

      {/* Requests Grid */}
      <div style={styles.grid}>
        {requests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          requests.map((req) => {
            // Helper function to get button styles based on status
            const getButtonStyle = (isDisabled, defaultColor) => ({
              ...styles.button,
              backgroundColor: isDisabled ? "#ccc" : defaultColor,  // Gray when disabled
              opacity: isDisabled ? 0.6 : 1,  // Slightly transparent when disabled
              cursor: isDisabled ? "not-allowed" : "pointer"
            });

            return (
              <div key={req.id} style={styles.card}>
                <p><strong>User:</strong> {req.userId}</p>
                <p><strong>Amount:</strong> ₹ {req.amount}</p>
                <p><strong>Date:</strong> {req.requestDate} </p>
                 <p><strong>Time:</strong> {req.paymentTime} </p>
                <p><strong>UPI Id:</strong> {req.upiId}</p>
                <p><strong>Request Status:</strong> <span style={{ textTransform: "capitalize" }}>{req.requestStatus}</span></p>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    style={getButtonStyle(req.requestStatus !== "pending", "#4caf50")}
                    onClick={() => handleAccept(req.id, req.userId, req.amount)}
                    disabled={req.requestStatus !== "pending"}
                  >
                    Accept
                  </button>
                  <button
                    style={getButtonStyle(req.requestStatus !== "pending", "#e74c3c")}
                    onClick={() => handleReject(req.id)}
                    disabled={req.requestStatus !== "pending"}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "15px",
  },
  card: {
    background: "linear-gradient(135deg, #fbc531, #2104f6ff)",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
    transition: "transform 0.15s ease",
    color: "#333",
  },
  button: {
    flex: 1,
    padding: "8px 10px",
    border: "none",
    borderRadius: "5px",
    color: "white",
    fontWeight: "600",
  },
  filterInput: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #2619a1ff",
    minWidth: "150px",
  },
  iconBtn: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #4539d0ff",
    background: "#3ed03bff",
    cursor: "pointer",
  },
  clearBtn: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #c61919ff",
    background: "#bbcf3cff",
    cursor: "pointer",
  },
};

export default WithdrawRequests;