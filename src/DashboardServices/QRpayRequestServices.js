import { db } from "../firebase"; // Adjust path to your Firebase config
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { format } from "date-fns";

const fetchQRPayRequests = async (date, status, userId) => {
  try {
    let q = query(collection(db, "QRpayRequest"));

    // Apply status filter (Firestore)
    if (status !== "all") {
      q = query(q, where("requestStatus", "==", status));
    }

    // Apply userId filter (Firestore)
    if (userId) {
      q = query(q, where("userId", "==", userId));
    }

    const snapshot = await getDocs(q);
    let requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Apply date filter (client-side)
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy"); // e.g., "12/09/2025"
      requests = requests.filter(req => req.paymentDateTime.startsWith(formattedDate));
    }

    return requests;
  } catch (error) {
    throw new Error("Error fetching QR Pay Requests: " + error.message);
  }
};

const updateQRPayRequestStatus = async (requestId, status) => {
  try {
    const requestRef = doc(db, "QRpayRequest", requestId);
    await updateDoc(requestRef, { requestStatus: status });
  } catch (error) {
    throw new Error(`Error updating request status to ${status}: ` + error.message);
  }
};

const updateUserBalance = async (userId, amount) => {
  try {
    // Query users collection to find document where mobile field matches userId
    const usersQuery = query(collection(db, "users"), where("mobile", "==", userId));
    const querySnapshot = await getDocs(usersQuery);

    if (querySnapshot.empty) {
      throw new Error(`No user found with mobile: ${userId}`);
    }

    // Assume single user match (mobile should be unique)
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);

    // Update balance
    await updateDoc(userRef, {
      balance: increment(amount),
    });
  } catch (error) {
    throw new Error("Error updating user balance: " + error.message);
  }
};

export { fetchQRPayRequests, updateQRPayRequestStatus, updateUserBalance };