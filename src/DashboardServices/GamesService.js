// src/DashboardServices/GamesService.js
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";

const gamesCol = collection(db, "games");

export const getGames = async () => {
  const snapshot = await getDocs(gamesCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateGame = async (id, data) => {
  const docRef = doc(db, "games", id);
  await updateDoc(docRef, data);
};

export const deleteGame = async (id) => {
  const docRef = doc(db, "games", id);
  await deleteDoc(docRef);
};

export const addGame = async (data) => {
  await addDoc(gamesCol, data);
};