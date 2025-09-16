import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ExcelJS from "exceljs";

const DownloadUsers = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const exportUsersToExcel = async () => {
      try {
        
        // Fetch all users from Firebase
        const snapshot = await getDocs(collection(db, "users"));
        const usersData = snapshot.docs.map((doc) => doc.data());
       
        

        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users");

        // Add headers
        worksheet.addRow(["Mobile", "Name"]);
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4472C4" },
        };

        // Add data rows
        usersData.forEach((user) => {
          worksheet.addRow([
            user.mobile || "",
            user.name || "",
           
          ]);
        });

        // Auto-fit columns
        worksheet.columns.forEach((column) => {
          column.width = 15;
        });

        // Generate buffer and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users_data.xlsx";
        a.click();
        URL.revokeObjectURL(url);
    
        

        // Navigate back to dashboard after download
        navigate("/dashboard");
      } catch (err) {
        console.error("Error exporting users to Excel:", err.message);
        alert("Failed to export users to Excel: " + err.message);
        navigate("/dashboard");
      }
    };

    exportUsersToExcel();
  }, [navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Downloading Users Excel...</h2>
      <p>Please wait while the file is being generated.</p>
    </div>
  );
};

export default DownloadUsers;