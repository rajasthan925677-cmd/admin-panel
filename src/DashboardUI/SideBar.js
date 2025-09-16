import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ ResetResult hook import karo (abhi placeholder hai, baad me implement karenge)
import useResetResult from "./ResetResult";

const SideBar = ({ setActiveCard }) => {
  const navigate = useNavigate();

  // ✅ Hook ka use
  const { resetResults } = useResetResult();

  // ✅ Button click handler
  const handleResetClick = () => {
    if (window.confirm("Are you sure you want to reset all game results?")) {
      resetResults();
    }
  };

  return (
    <div style={styles.sidebar}>
      <h3 style={{ color: "#fff", marginBottom: "20px" }}>Admin Panel</h3>
      <button style={styles.sidebarBtn} onClick={() => setActiveCard("users")}>
        User Management
      </button>
      <button style={styles.sidebarBtn} onClick={() => setActiveCard("games")}>
        Games Management
      </button>
      <button style={styles.sidebarBtn}>Wallet Management</button>
      <button style={styles.sidebarBtn} onClick={() => setActiveCard("addFundRequests")}>
        Add Request Management
      </button>
      <button style={styles.sidebarBtn} onClick={() => setActiveCard("withdrawRequests")}>
        Withdraw Requests Management
      </button>
      <button style={styles.sidebarBtn} onClick={() => navigate("/declare-result")}>
        Declare Result
      </button>


      {/* ✅ Naya Reset Results Button */}
      <button style={styles.sidebarBtn} onClick={handleResetClick}>
        Reset Results
      </button>




      <button style={styles.sidebarBtn} onClick={() => setActiveCard("bidHistory")}>
        Bid History
      </button>
      <button style={styles.sidebarBtn} onClick={() => setActiveCard("winHistory")}>
        Win History
      </button>
      <button style={styles.sidebarBtn} onClick={() => navigate("/send-notification")}>
        Send Notification
      </button>
      <button style={styles.sidebarBtn} onClick={() => navigate("/ticker-whatsapp")}>
        Ticker and WhatsApp
      </button>
      <button style={styles.sidebarBtn} onClick={() => navigate("/download-users")}>
        Download Users Excel
      </button>

    </div>
  );
};

const styles = {
  sidebar: {
    width: "280px",
    background: "linear-gradient(135deg, #71fb31ff, #564e8aff)",
    padding: "20px",
    height: "110vh",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxSizing: "border-box",
  },
  sidebarBtn: {
    backgroundColor: "transparent",
    color: "#f5f6fa",
    border: "none",
    padding: "10px 0",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.2s",
  },
};

export default SideBar;
