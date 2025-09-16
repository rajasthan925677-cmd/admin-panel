import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc } from "firebase/firestore";

const bidsCol = collection(db, "bids");
const withdrawRequestsCol = collection(db, "withdraw_requests");
const addRequestsCol = collection(db, "add_requests");
const qrAddRequestsCol = collection(db, "QRpayRequest");

export const getBidsByUser = async (userId, date = null, gameId = null, gameType = null) => {
  try {
    let q = query(bidsCol, where("userId", "==", userId));
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
    console.error("Error fetching bids:", err.message);
    throw err;
  }
};

export const getWinBidsByUser = async (userId, date = null) => {
  try {
    let q = query(bidsCol, where("userId", "==", userId), where("status", "==", "win"));
    if (date) {
      q = query(q, where("date", "==", date));
    }
    const snapshot = await getDocs(q);
    const bids = snapshot.docs.map((doc) => {
      const data = doc.data();
      return { docId: doc.id, ...data };
    });
    return bids;
  } catch (err) {
    console.error("Error fetching winning bids:", err.message);
    throw err;
  }
};

export const getWithdrawRequestsByUser = async (userId, fromDate = null, toDate = null) => {
  try {
    let q = query(withdrawRequestsCol, where("userId", "==", userId));
    let requests = [];

    const snapshot = await getDocs(q);
    requests = snapshot.docs.map((doc) => {
      const data = doc.data();
      return { docId: doc.id, ...data };
    });

    // Client-side filtering for requestDate
    if (fromDate || toDate) {
      requests = requests.filter((request) => {
        const requestDate = request.requestDate ? request.requestDate.trim() : null;
        let include = true;
        if (fromDate) {
          include = include && requestDate >= fromDate;
        }
        if (toDate) {
          include = include && requestDate <= toDate;
        }
        return include;
      });
    }

    // Log for debugging
    return requests;
  } catch (err) {
    console.error("Error fetching withdraw requests:", err.message);
    throw err;
  }
};

export const getAddRequestsByUser = async (userId, date = null) => {
  try {
    let q = query(addRequestsCol, where("userId", "==", userId));
    let requests = [];

    const snapshot = await getDocs(q);
    requests = snapshot.docs.map((doc) => {
      const data = doc.data();
      return { docId: doc.id, ...data };
    });

    // Client-side filtering for paymentDate
    if (date) {
      requests = requests.filter((request) => {
        const paymentDate = request.paymentDate ? request.paymentDate.trim() : null;
        return paymentDate === date;
      });
    }

    // Log for debugging
    return requests;
  } catch (err) {
    console.error("Error fetching add fund requests:", err.message);
    throw err;
  }
};

export const getQRAddRequestsByUser = async (userId, date = null) => {
  try {
    let q = query(qrAddRequestsCol, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    let requests = snapshot.docs.map((doc) => {
      const data = doc.data();
      return { docId: doc.id, ...data };
    });

    // Filter data client-side to match only the date part
    if (date) {
      requests = requests.filter((request) => {
        const [datePart] = request.paymentDateTime.split(' ');
        return datePart.trim() === date;
      });
    }

    return requests;
  } catch (err) {
    console.error("Error fetching QR add fund requests:", err.message);
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

export const checkWithdrawRequestExists = async (docId) => {
  try {
    const docRef = doc(db, "withdraw_requests", docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (err) {
    console.error("Error checking withdraw request existence:", err.message);
    throw err;
  }
};

export const checkAddRequestExists = async (docId) => {
  try {
    const docRef = doc(db, "add_requests", docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (err) {
    console.error("Error checking add fund request existence:", err.message);
    throw err;
  }
};

export const checkQRAddRequestExists = async (docId) => {
  try {
    const docRef = doc(db, "QRpayRequest", docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (err) {
    console.error("Error checking QR add fund request existence:", err.message);
    throw err;
  }
};

export const updateBid = async (docId, data) => {
  try {
    const docRef = doc(db, "bids", docId);
    await updateDoc(docRef, data);
  } catch (err) {
    console.error("Error updating bid in Firestore:", err.message);
    throw err;
  }
};

export const updateWithdrawRequest = async (docId, data) => {
  try {
    const docRef = doc(db, "withdraw_requests", docId);
    await updateDoc(docRef, data);
  } catch (err) {
    console.error("Error updating withdraw request in Firestore:", err.message);
    throw err;
  }
};

export const updateAddRequest = async (docId, data) => {
  try {
    const docRef = doc(db, "add_requests", docId);
    await updateDoc(docRef, data);
  } catch (err) {
    console.error("Error updating add fund request in Firestore:", err.message);
    throw err;
  }
};

export const updateQRAddRequest = async (docId, data) => {
  try {
    const docRef = doc(db, "QRpayRequest", docId);
    await updateDoc(docRef, data);
  } catch (err) {
    console.error("Error updating QR add fund request in Firestore:", err.message);
    throw err;
  }
};

export const deleteBid = async (docId) => {
  try {
    const docRef = doc(db, "bids", docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting bid in Firestore:", err.message);
    throw err;
  }
};

export const deleteWithdrawRequest = async (docId) => {
  try {
    const docRef = doc(db, "withdraw_requests", docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting withdraw request in Firestore:", err.message);
    throw err;
  }
};

export const deleteAddRequest = async (docId) => {
  try {
    const docRef = doc(db, "add_requests", docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting add fund request in Firestore:", err.message);
    throw err;
  }
};

export const deleteQRAddRequest = async (docId) => {
  try {
    const docRef = doc(db, "QRpayRequest", docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting QR add fund request in Firestore:", err.message);
    throw err;
  }
};