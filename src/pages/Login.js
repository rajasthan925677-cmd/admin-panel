// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setError("");
    try {
      const q = query(collection(db, "admins"), where("email", "==", email), where("password", "==", password));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} />
      <button onClick={handleLogin} style={styles.button}>Login</button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: { width: 300, margin: "100px auto", padding: 30, boxShadow: "0px 0px 10px rgba(0,0,0,0.2)", borderRadius: 10, textAlign: "center" },
  input: { width: "100%", padding: 10, marginBottom: 15, borderRadius: 5, border: "1px solid #ccc" },
  button: { width: "100%", padding: 10, backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
  error: { color: "red", marginTop: 10 }
};

export default Login;
