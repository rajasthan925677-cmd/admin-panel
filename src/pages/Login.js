import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Convert mobile to email format
  const mobileToEmail = (mobile) => `${mobile}@myapp.com`;

  const handleLogin = async () => {
    setError("");
    if (!mobile || !password) {
      setError("Enter both fields");
      return;
    }

    try {
      const email = mobileToEmail(mobile);

      // Firebase Auth sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Role check from Firestore using UID
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User data not found");
        await auth.signOut();
        return;
      }

      const role = userSnap.data().role || "user";

      if (role !== "admin") {
        setError("Not an Admin");
        await auth.signOut();
        return;
      }

      // Successful admin login
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      // Specific error handling for Firebase Auth errors
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        setError("Mobile Number Not Found");
      } else if (err.code === "auth/wrong-password") {
        setError("Wrong Password");
      } else {
        setError(err.message || "Authentication failed");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Login</h2>
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={e => setMobile(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    width: 300,
    margin: "100px auto",
    padding: 30,
    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
    borderRadius: 10,
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: 10,
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer"
  },
  error: {
    color: "red",
    marginTop: 10
  }
};

export default Login;