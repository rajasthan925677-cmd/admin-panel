// src/DashboardHooks/useTotalBidAmountToday.js
import { useState, useEffect } from "react";
import * as bidService from "../DashboardServices/TotalBidAmountTodayServices";

const useTotalBidAmountToday = () => {
  const [totalBidAmount, setTotalBidAmount] = useState(0);

  const fetchTotalBidAmount = async () => {
    try {
      const sum = await bidService.getTodayTotalBid();
      setTotalBidAmount(sum);
    } catch (err) {
      console.error("Error fetching total bid amount:", err);
      setTotalBidAmount(0);
    }
  };

  useEffect(() => { fetchTotalBidAmount(); }, []);

  return { totalBidAmount, fetchTotalBidAmount };
};

export default useTotalBidAmountToday;