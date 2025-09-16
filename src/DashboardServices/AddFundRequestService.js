import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";

const addRequestsCol = collection(db, "add_requests");
const usersCol = collection(db, "users");

export const getAddFundRequests = async () => {
  const snapshot = await getDocs(addRequestsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateAddFundRequestStatus = async (id, status) => {
  const docRef = doc(db, "add_requests", id);
  await updateDoc(docRef, { requestStatus: status });
};

export const updateUserBalance = async (userId, amount) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const currentBalance = userSnap.data().balance || 0;
    await updateDoc(userRef, { balance: currentBalance + amount });
  }
};
