import React from "react";

const AdminUPI = ({ adminUPI, setAdminUPI, updateAdminUPI, qrPayUPI, setQRPayUPI, updateQRPayUPI }) => {
  return (
    <div style={{ margin: "10px 0", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {/* Admin UPI Input and Save Button */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "200px" }}>
        <input
          style={styles.input}
          type="text"
          value={adminUPI || ""}
          onChange={(e) => setAdminUPI(e.target.value)}
          placeholder="Enter Admin UPI"
        />
        <button style={styles.saveBtn} onClick={updateAdminUPI}>
          Save Intent UPI
        </button>
      </div>
      {/* QR Pay UPI Input and Save Button */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "200px" }}>
        <input
          style={styles.input}
          type="text"
          value={qrPayUPI || ""}
          onChange={(e) => setQRPayUPI(e.target.value)}
          placeholder="Enter QR Pay UPI"
        />
        <button style={styles.saveBtn} onClick={updateQRPayUPI}>
          Save QR UPI
        </button>
      </div>
    </div>
  );
};

const styles = {
  input: { padding: "6px", backgroundColor: "#babbb7ff", borderRadius: "5px", border: "1px solid #dcdde1", width: "100%", boxSizing: "border-box" },
  saveBtn: { backgroundColor: "#00a8ff", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" },
};

export default AdminUPI;