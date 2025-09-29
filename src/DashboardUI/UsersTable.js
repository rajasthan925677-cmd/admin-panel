import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for navigation

const UsersTable = ({ users, editedUsers, setEditedUsers, searchMobile, setSearchMobile, saveUser, deleteUser }) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState({}); // Track edit mode per user

  const handleEditToggle = (id) => {
    setEditMode(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to update this user?")) {
      try {
        await saveUser(id);
        setEditMode(prev => ({ ...prev, [id]: false })); // Turn off edit mode after save
      } catch (err) {
        console.error(err);
        alert("Failed to update user.");
      }
    }
  };

  return (
    <div style={{ marginTop: "50px", overflowX: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px", textDecoration: "underline", fontSize: "50px", color: "#0f65f0ff" }}>Users Management</h2>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by Mobile"
          style={{ padding: "6px", borderRadius: "5px", border: "1px solid #dcdde1", width: "200px", marginBottom: "10px" }}
          value={searchMobile}
          onChange={(e) => setSearchMobile(e.target.value)}
        />
      </div>
      <table style={styles.table}>
        <thead>
          <tr><th>Name</th><th>Mobile</th><th>Role</th><th>Balance</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.filter(user => user.mobile.includes(searchMobile)).map(user => (
            <tr key={user.id}>
              <td><input style={styles.input} value={editedUsers[user.id]?.name || ""} readOnly={!editMode[user.id]} onChange={(e) => setEditedUsers({...editedUsers, [user.id]: {...editedUsers[user.id], name: e.target.value}})} /></td>
              
              {/* Mobile Column as Button */}
              <td>
                <button style={styles.linkButton} onClick={() => navigate(`/user-detail/${user.mobile}`)}>
                  {user.mobile}
                </button>
              </td>

              <td><input style={styles.input} value={editedUsers[user.id]?.role || ""} readOnly={!editMode[user.id]} onChange={(e) => setEditedUsers({...editedUsers, [user.id]: {...editedUsers[user.id], role: e.target.value}})} /></td>
              
              <td><input style={styles.input} type="number" value={editedUsers[user.id]?.balance || 0} readOnly={!editMode[user.id]} onChange={(e) => setEditedUsers({...editedUsers, [user.id]: {...editedUsers[user.id], balance: Number(e.target.value)}})} /></td>
              
              <td>
                <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
                  <button
                    style={editMode[user.id] ? styles.saveBtn : styles.editBtn}
                    onClick={() => editMode[user.id] ? handleSave(user.id) : handleEditToggle(user.id)}
                  >
                    {editMode[user.id] ? "Save" : "Edit"}
                  </button>
                  <button style={styles.deleteBtn} onClick={() => deleteUser(user.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px", minWidth: "700px" },
  input: { padding: "6px", borderRadius: "5px", border: "1px solid #dcdde1", width: "100%", boxSizing: "border-box" },
  saveBtn: { backgroundColor: "#00a8ff", color: "#fff", border: "none", padding: "5px 10px", marginRight: "5px", borderRadius: "5px", cursor: "pointer" },
  editBtn: { backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "5px 10px", marginRight: "5px", borderRadius: "5px", cursor: "pointer" }, // New style for Edit button
  deleteBtn: { backgroundColor: "#e84118", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" },
  linkButton: { background: "none", borderRadius: "5px", border: "1px solid #dcdde1", color: "#0f65f0", width: "100%", textDecoration: "underline", cursor: "pointer", padding: "6px", font: "inherit" }
};

export default UsersTable;