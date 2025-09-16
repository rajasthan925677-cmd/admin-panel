// src/DashboardServices/WithdrawRequestService.js
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, getDoc, query, where } from "firebase/firestore";

const withdrawRequestsCol = collection(db, "withdraw_requests");
const usersCol = collection(db, "users");

// Get all withdraw requests
export const getWithdrawRequests = async () => {
  const snapshot = await getDocs(withdrawRequestsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update requestStatus (accepted/rejected)
export const updateWithdrawRequestStatus = async (id, status) => {
  const docRef = doc(db, "withdraw_requests", id);
  await updateDoc(docRef, { requestStatus: status });
};

// Update user balance on accept
export const deductUserBalance = async (userId, amount) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const currentBalance = userSnap.data().balance || 0;
    const newBalance = currentBalance - amount;
    await updateDoc(userRef, { balance: newBalance });
  }
};
