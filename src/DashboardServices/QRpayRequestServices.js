import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { format } from "date-fns";

const fetchQRPayRequests = async (date, status, mobile) => {
  try {
    let q = query(collection(db, "QRpayRequest"));

    // Apply status filter (Firestore)
    if (status !== "all") {
      q = query(q, where("requestStatus", "==", status));
    }

    // Apply mobile filter (Firestore)
    if (mobile) {
      if (!/^\d{10}$/.test(mobile)) {
        console.warn("Invalid mobile format:", mobile);
        return [];
      }
      q = query(q, where("mobile", "==", mobile));
    }

    // Apply date filter (Firestore)
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      q = query(q, where("paymentDate", "==", formattedDate));
    }

   // console.log("Firestore query conditions:", { status, mobile, date: date ? format(date, "dd/MM/yyyy") : null });
    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    //console.log("Firestore query results:", requests.map(r => ({ id: r.id, mobile: r.mobile, paymentDate: r.paymentDate })));
    return requests;
  } catch (error) {
    console.error("Error fetching QR Pay Requests:", error);
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
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      balance: increment(amount),
    });
  } catch (error) {
    throw new Error("Error updating user balance: " + error.message);
  }
};

export { fetchQRPayRequests, updateQRPayRequestStatus, updateUserBalance };