// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

apiKey: "AIzaSyDvd_GJAIONKx-RMfIXVQOjTU5CCfFdRE8",
  authDomain: "mumbaimatka-9b2ba.firebaseapp.com",

  projectId: "mumbaimatka-9b2ba",
  storageBucket: "mumbaimatka-9b2ba.firebasestorage.app",
  messagingSenderId: "607401586790",
  appId: "1:607401586790:web:fc45724fb924e60eac7da7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore export
export const db = getFirestore(app);

