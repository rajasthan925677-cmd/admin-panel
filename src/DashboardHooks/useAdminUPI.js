import { useState, useEffect } from "react";
import * as adminUPIService from "../DashboardServices/AdminUPIService";

const useAdminUPI = () => {
  const [adminUPI, setAdminUPI] = useState("");
  const [qrPayUPI, setQRPayUPI] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAdminUPI = async () => {
    try {
      const upi = await adminUPIService.getAdminUPI();
      setAdminUPI(upi);
    } catch (err) {
      console.error("Failed to fetch Admin UPI:", err);
    }
  };

  const fetchQRPayUPI = async () => {
    try {
      const qrUpi = await adminUPIService.getQRPayUPI();
      setQRPayUPI(qrUpi);
    } catch (err) {
      console.error("Failed to fetch QR Pay UPI:", err);
    }
  };

  const updateAdminUPI = async () => {
    try {
      await adminUPIService.updateAdminUPI(adminUPI);
      alert("Admin UPI updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update Admin UPI.");
    }
  };

  const updateQRPayUPI = async () => {
    try {
      await adminUPIService.updateQRPayUPI(qrPayUPI);
      alert("QR Pay UPI updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update QR Pay UPI.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAdminUPI(), fetchQRPayUPI()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return { adminUPI, setAdminUPI, updateAdminUPI, qrPayUPI, setQRPayUPI, updateQRPayUPI, loading };
};

export default useAdminUPI;