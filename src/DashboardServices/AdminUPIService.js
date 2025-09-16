import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const adminUPICol = collection(db, "admin_upi");
const adminQRPayCol = collection(db, "admin_QRpay");

export const getAdminUPI = async () => {
  const snapshot = await getDocs(adminUPICol);
  const data = snapshot.docs[0]?.data();
  return data?.adminupi ?? "";
};

export const updateAdminUPI = async (upi) => {
  const docRef = doc(db, "admin_upi", "upi_details");
  await updateDoc(docRef, { adminupi: upi ?? null });
};

export const getQRPayUPI = async () => {
  const snapshot = await getDocs(adminQRPayCol);
  const data = snapshot.docs[0]?.data();
  return data?.QRpayUpi ?? "";
};

export const updateQRPayUPI = async (qrUpi) => {
  const snapshot = await getDocs(adminQRPayCol);
  if (snapshot.empty) {
    const newDocRef = doc(adminQRPayCol);
    await updateDoc(newDocRef, { QRpayUpi: qrUpi ?? null });
  } else {
    const docRef = doc(db, "admin_QRpay", snapshot.docs[0].id);
    await updateDoc(docRef, { QRpayUpi: qrUpi ?? null });
  }
};