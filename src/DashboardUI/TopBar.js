import React from "react";

const TopBar = ({ showSidebar, setShowSidebar, showAdminUPI, setShowAdminUPI, handleLogout }) => {
  return (
    <div style={styles.topBar}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="/logo2.png" alt="Logo" style={{ height: "100px", marginRight: "10px", marginLeft: "20px" }} />
        <button style={styles.menuBtn} onClick={() => setShowSidebar(!showSidebar)}>☰</button>
      </div>
      <div style={styles.centerText}>
        Welcome to Admin Panel
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{ marginRight: "15px", cursor: "pointer", color: "#d52196ff", fontWeight: "bold" }}
          onClick={() => setShowAdminUPI(!showAdminUPI)}
        >
          Admin   UPI
        </div>
        <div style={{ cursor: "pointer", color: "#e84118", fontWeight: "bold", marginRight: "30px" }} onClick={handleLogout}>
          ⚙️ Log Out
        </div>
      </div>
    </div>
  );
};

const styles = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "2px solid #2cd060ff",
    paddingBottom: "10px",
    background: "linear-gradient(135deg, #d058beff, #78bbdfff)",
    flexWrap: "wrap",
  },
  menuBtn: {
    fontSize: "40px",
    padding: "10px 12px",
    cursor: "pointer",
    backgroundColor: "#21ddf6ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },
  centerText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1, // Ensures the text takes up available space to stay centered
  },
};

export default TopBar;