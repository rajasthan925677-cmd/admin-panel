import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Install react-toastify: npm install react-toastify
import "react-toastify/dist/ReactToastify.css";

const AdminForm = ({ onClose }) => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  // Backend URL (update this when deployed)
  const backendUrl = "http://localhost:3001/api/set-custom-claims"; // Change to deployed URL later

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(backendUrl, { userId }, {
        headers: { "Content-Type": "application/json" },
      });

      // Success toast with backend's message
      toast.success(response.data.message || "User successfully set as admin!");

      // Close form after success
      onClose();
    } catch (error) {
      // Error handling with specific messages
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("User not found in Firebase!");
        } else if (error.response.status === 400) {
          toast.error("User ID is required!");
        } else if (error.response.status === 500) {
          toast.error("Failed to set custom claims. Check backend logs!");
        } else {
          toast.error("An unexpected error occurred!");
        }
      } else {
        toast.error("Network error. Check backend status!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.formContainer}>
        <h3>Make Admin</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID (Auth UID)"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Processing..." : "Make Admin"}
          </button>
          <button type="button" style={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  formContainer: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  submitBtn: {
    backgroundColor: "#71fb31",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    marginBottom: "10px",
  },
  closeBtn: {
    backgroundColor: "#ff4444",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
};

export default AdminForm;