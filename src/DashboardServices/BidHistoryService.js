import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc } from "firebase/firestore";

const bidsCol = collection(db, "bids");

export const getAllBids = async (date = null, gameId = null, gameType = null) => {
  try {
    let q = query(bidsCol);
    if (date) {
      q = query(q, where("date", "==", date));
    }
    if (gameId) {
      q = query(q, where("gameId", "==", gameId));
    }
    if (gameType) {
      q = query(q, where("gameType", "==", gameType));
    }
   
    const snapshot = await getDocs(q);
    const bids = snapshot.docs.map((doc) => {
      const data = doc.data();
     
      return { docId: doc.id, ...data };
    });
    return bids;
  } catch (err) {
    console.error("Error fetching all bids:", err.message);
    throw err;
  }
};

export const checkBidExists = async (docId) => {
  try {
    const docRef = doc(db, "bids", docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (err) {
    console.error("Error checking bid existence:", err.message);
    throw err;
  }
};

export const updateBid = async (docId, data) => {
  try {
    const docRef = doc(db, "bids", docId);
    await updateDoc(docRef, data);
  } catch (err) {
    console.error("Error updating bid in Firestore:", err.message);
    throw err; // Re-throw to catch in the calling function
  }
};

export const deleteBid = async (docId) => {
  try {
    const docRef = doc(db, "bids", docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting bid in Firestore:", err.message);
    throw err; // Re-throw to catch in the calling function
  }
};