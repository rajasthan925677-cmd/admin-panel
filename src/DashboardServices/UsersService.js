// UsersService.js
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

const usersCol = collection(db, "users");

export const getUsers = async () => {
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserByMobile = async (mobile) => {
  try {
    const q = query(usersCol, where("mobile", "==", mobile));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data(), uid: userDoc.id }; // Fixed: doc.data() to userDoc.data()
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error fetching user by mobile:", err.message);
    throw err;
  }
};

export const updateUser = async (id, data) => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, data);
};

export const deleteUser = async (id) => {
  const docRef = doc(db, "users", id);
  await deleteDoc(docRef);
};