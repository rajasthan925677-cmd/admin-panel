import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { format } from "date-fns";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import useAddFundRequests from "../DashboardHooks/useAddFundRequests";

const AddFundRequests = () => {
  const navigate = useNavigate();
  const {
    requests,
    loadingRequests,
    filterValues,
    setFilterValues,
    applyFilters,
    handleAccept,
    handleReject,
    clearFilters,
  } = useAddFundRequests();
  const [totalAddFundToday, setTotalAddFundToday] = useState(0);
  const [fetchError, setFetchError] = useState(null);

  // Fetch total accepted amount for today
  useEffect(() => {
    const fetchTotalAddFundToday = async () => {
      try {
        const q = query(
          collection(db, "add_requests"),
          where("requestStatus", "==", "accepted")
        ); // Only status filter, no date range
        const snapshot = await getDocs(q);
        const today = format(new Date(), "dd-MM-yyyy"); // e.g., "12-09-2025"
        const acceptedToday = snapshot.docs
          .map(doc => doc.data())
          .filter(req => req.paymentDate === today)
          .reduce((sum, req) => sum + (req.amount || 0), 0);
        setTotalAddFundToday(acceptedToday);
        setFetchError(null);
      } catch (err) {
        console.error("Error fetching total add fund today:", err.message);
        setFetchError("Failed to fetch total add fund amount: " + err.message);
      }
    };

    fetchTotalAddFundToday();
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
      <h2 style={{ textAlign: "center", marginBottom: "40px", textDecoration: "underline", fontSize: "50px", color: "#0ff016ff" }}>
        Add Fund Requests
      </h2>

      {/* Filters and Total Add Fund Today in Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #5b7ae0ff, #dbf658ff)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
          marginBottom: "65px",
        }}
      >
        <div style={{ display: "flex", gap: "50px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="date"
            value={filterValues.date || ""}
            onChange={(e) => setFilterValues((prev) => ({ ...prev, date: e.target.value }))}
            style={styles.filterInput}
          />
          <select
            value={filterValues.requestStatus || ""}
            onChange={(e) => setFilterValues((prev) => ({ ...prev, requestStatus: e.target.value }))}
            style={styles.filterInput}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search by User ID"
              value={filterValues.userId || ""}
              onChange={(e) => setFilterValues((prev) => ({ ...prev, userId: e.target.value }))}
              style={{ ...styles.filterInput, marginRight: 46  }}
            />
            <button onClick={applyFilters} title="Search" style={styles.iconBtn}>
              search
            </button>
          </div>
          <button onClick={clearFilters} style={styles.clearBtn}>
            Clear
          </button>
          <div style={{ fontSize: "28px", fontWeight: "600", color: "#ec0dd6ff" }}>
            Total Add Fund TODAY: ₹{totalAddFundToday.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {fetchError && (
        <div style={{ backgroundColor: "rgba(220, 38, 38, 0.2)", color: "#fca5a5", padding: "16px", borderRadius: "8px", marginBottom: "24px", border: "1px solid #ef4444" }}>
          {fetchError}
        </div>
      )}

      <div style={styles.grid}>
        {requests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          requests.map((req) => {
            // Helper function to get button styles based on status
            const getButtonStyle = (isDisabled, defaultColor) => ({
              ...styles.button,
              backgroundColor: isDisabled ? "#ccc" : defaultColor, // Gray when disabled
              opacity: isDisabled ? 0.6 : 1, // Slightly transparent when disabled
              cursor: isDisabled ? "not-allowed" : "pointer"
            });

            return (
              <div key={req.id} style={styles.card}>
                <p>
                  <strong>User:</strong> {req.userId}
                </p>
                <p>
                  <strong>Amount:</strong> ₹ {req.amount}
                </p>
                <p>
                  <strong>Date:</strong> {req.paymentDate} {req.paymentTime || ""}
                </p>
                <p>
                  <strong>UPI Status:</strong> {req.upiStatus}
                </p>
                <p>
                  <strong>Transaction ID:</strong> {req.transactionId}
                </p>
                <p>
                  <strong>Request Status:</strong>{" "}
                  <span style={{ textTransform: "capitalize" }}>{req.requestStatus}</span>
                </p>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    style={getButtonStyle(req.requestStatus !== "pending", "#048a31ff")}
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
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "15px" },
  card: { background: "linear-gradient(135deg, #5b7ae0ff, #dbf658ff)", padding: "15px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.08)", transition: "transform 0.15s ease", color: "#333" },
  button: { flex: 1, padding: "8px 10px", border: "none", borderRadius: "5px", color: "white", fontWeight: "600" },
  filterInput: { padding: "8px", borderRadius: "6px", border: "1px solid #3e0af8ff", minWidth: "150px" },
  iconBtn: { padding: "8px 10px", borderRadius: "6px", border: "1px solid #3bcdfeff", background: "#81ef66ff", cursor: "pointer" },
  clearBtn: { padding: "8px 10px", borderRadius: "6px", border: "1px solid #f31717ff", background: "#f9e24eff", cursor: "pointer" },
};

export default AddFundRequests;