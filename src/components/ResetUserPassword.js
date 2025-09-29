import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// -------------------------
// Hook for resetting password via backend
// -------------------------
const useResetUserPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resetPassword = async (mobile, newPassword) => {
    if (!mobile || !newPassword) {
      setMessage("Please fill both fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/reset-user-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully");
      } else {
        setMessage(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return { loading, message, resetPassword, setMessage };
};

// -------------------------
// Reset User Password Page
// -------------------------
const ResetUserPassword = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { loading, message, resetPassword, setMessage } = useResetUserPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword(mobile, newPassword);
  };

  return (
    <div style={styles.pageContainer}>
      <button style={styles.backBtn} onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>

      <div style={styles.container}>
        <h2>Reset User Password</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="User Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p
            style={{ color: message.includes("success") ? "green" : "red", marginTop: "10px" }}
            onClick={() => setMessage("")}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// -------------------------
// Styles
// -------------------------
const styles = {
  pageContainer: { position: "relative", minHeight: "100vh", padding: "20px", backgroundColor: "#f5f5f5" },
  backBtn: { position: "fixed", top: "20px", left: "20px", backgroundColor: "transparent", border: "none", color: "#2193b0", fontSize: "16px", cursor: "pointer", zIndex: 1000 },
  container: { maxWidth: "400px", margin: "100px auto 0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", textAlign: "center", backgroundColor: "#fff" },
  form: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" },
  input: { padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "10px", fontSize: "16px", backgroundColor: "#2193b0", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default ResetUserPassword;
