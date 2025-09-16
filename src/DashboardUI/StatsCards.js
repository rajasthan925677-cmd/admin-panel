import React from "react";
import { useNavigate } from "react-router-dom";

const StatsCards = ({ usersCount, gamesCount, totalBidAmount, setActiveCard }) => {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "50px" }}>
      {/* First row with 3 cards */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div style={styles.statsCard} onClick={() => setActiveCard("users")}>
          <h3>Users</h3>
          <p>{usersCount || 0}</p>
        </div>
        <div style={styles.statsCard} onClick={() => setActiveCard("games")}>
          <h3>Games</h3>
          <p>{gamesCount || 0}</p>
        </div>
        <div style={styles.statsCard}>
          <h3>Total Bid Amount Today</h3>
          <p>₹ {totalBidAmount}</p>
        </div>
      </div>

      {/* Second row with Add Fund Requests, Withdraw Requests, and QR Pay Requests cards */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div style={styles.statsCard} onClick={() => setActiveCard("addFundRequests")}>
          <h3>Add Fund Requests</h3>
        </div>
        <div style={styles.statsCard} onClick={() => navigate("/withdraw-requests")}>
          <h3>Withdraw Requests</h3>
        </div>
        <div style={styles.statsCard} onClick={() => setActiveCard("qrPayRequests")}>
          <h3>QR Pay Requests</h3>
        </div>
      </div>

      {/* Third row with Bid History Report and Win History Report cards */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div style={styles.statsCard} onClick={() => setActiveCard("bidHistory")}>
          <h3>Bid History Report</h3>
        </div>
        <div style={styles.statsCard} onClick={() => setActiveCard("winHistory")}>
          <h3>Win History Report</h3>
        </div>
      </div>
    </div>
  );
};

const styles = {
  statsCard: {
    flex: 1,
    minWidth: "200px",
    background: "linear-gradient(135deg, #b55ee4ff, #0ef77eff)",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
};

export default StatsCards;