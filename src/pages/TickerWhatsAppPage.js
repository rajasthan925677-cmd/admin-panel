import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // ✅ tumhara firebase config yahan import karo

const TickerWhatsAppPage = () => {
  const navigate = useNavigate();
  const [adminMessage, setAdminMessage] = useState("");
  const [whatsapp1, setWhatsapp1] = useState("");
  const [whatsapp2, setWhatsapp2] = useState("");

  // ✅ Load existing data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "homeTicker", "info");
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setAdminMessage(data.adminMessage || "");
          setWhatsapp1(data.whatsapp1 || "");
          setWhatsapp2(data.whatsapp2 || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Update ticker message
  const updateTicker = async () => {
    try {
      const docRef = doc(db, "homeTicker", "info");
      await updateDoc(docRef, {
        adminMessage: adminMessage
      });
      alert("Ticker updated successfully!");
    } catch (error) {
      console.error("Error updating ticker:", error);
    }
  };

  // ✅ Update WhatsApp numbers
  const updateWhatsApp = async () => {
    try {
      const docRef = doc(db, "homeTicker", "info");
      await updateDoc(docRef, {
        whatsapp1: whatsapp1,
        whatsapp2: whatsapp2
      });
      alert("WhatsApp numbers updated successfully!");
    } catch (error) {
      console.error("Error updating WhatsApp numbers:", error);
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 style={styles.title}>Ticker and WhatsApp Update</h1>

      {/* Ticker Update Card */}
      <div style={styles.card}>
        <h2>Update Ticker</h2>
        <input
          type="text"
          value={adminMessage}
          onChange={(e) => setAdminMessage(e.target.value)}
          placeholder="Enter ticker message"
          style={styles.input}
        />
        <button style={styles.button} onClick={updateTicker}>
          Update Ticker
        </button>
      </div>

      {/* WhatsApp Update Card */}
      <div style={styles.card}>
        <h2>Update WhatsApp Numbers</h2>
        <input
          type="text"
          value={whatsapp1}
          onChange={(e) => setWhatsapp1(e.target.value)}
          placeholder="WhatsApp Number 1"
          style={styles.input}
        />
        <input
          type="text"
          value={whatsapp2}
          onChange={(e) => setWhatsapp2(e.target.value)}
          placeholder="WhatsApp Number 2"
          style={styles.input}
        />
        <button style={styles.button} onClick={updateWhatsApp}>
          Update Numbers
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto"
  },
  backBtn: {
    marginBottom: "20px",
    padding: "10px 15px",
    fontSize: "26px",
    cursor: "pointer",color: "#23b2efff",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "36px",color: "#7c47edff",
  },
  card: {
    background: "linear-gradient(135deg, #fbc531, #4cd137)",
    padding: "20px",
    borderRadius: "28px",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "30px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "34px",
    cursor: "pointer"
  }
};

export default TickerWhatsAppPage;