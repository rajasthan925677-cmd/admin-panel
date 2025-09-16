// src/DashboardServices/TotalBidAmountTodayServices.js
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const bidsCol = collection(db, "bids");

export const getTodayTotalBid = async () => {
  const snapshot = await getDocs(bidsCol);
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const todayStr = `${day} ${month} ${year}`;

  let sum = 0;
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.date === todayStr && typeof data.bidAmount === "number") {
      sum += data.bidAmount;
    }
  });
  return sum;
};