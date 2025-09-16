import React from "react";
import { useNavigate } from "react-router-dom"; // for navigation

const UsersTable = ({ users, editedUsers, setEditedUsers, searchMobile, setSearchMobile, saveUser, deleteUser }) => {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: "50px", overflowX: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px",textDecoration: "underline", fontSize: "50px", color: "#0f65f0ff" }}>Users Management</h2>

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
          <tr><th>Name</th><th>Mobile</th><th>Password</th><th>Balance</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.filter(user => user.mobile.includes(searchMobile)).map(user => (
            <tr key={user.id}>
              <td><input style={styles.input} value={editedUsers[user.id]?.name || ""} onChange={(e) => setEditedUsers({...editedUsers, [user.id]: {...editedUsers[user.id], name: e.target.value}})} /></td>
              
              {/* Mobile Column as Button */}
              <td>
                <button style={styles.linkButton} onClick={() => navigate(`/user-detail/${user.mobile}`)}>
                  {user.mobile}
                </button>
              </td>

              <td><input style={styles.input} value={editedUsers[user.id]?.password || ""} onChange={(e) => setEditedUsers({...editedUsers, [user.id]: {...editedUsers[user.id], password: e.target.value}})} /></td>
              
              <td><input style={styles.input} type="number" value={editedUsers[user.id]?.balance || 0} onChange={(e) => setEditedUsers({...editedUsers, [user.id]: {...editedUsers[user.id], balance: Number(e.target.value)}})} /></td>
              
              <td>
                <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
                  <button style={styles.saveBtn} onClick={() => saveUser(user.id)}>Save</button>
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
  deleteBtn: { backgroundColor: "#e84118", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" },
  linkButton: { background: "none", borderRadius: "5px", border: "1px solid #dcdde1",color: "#0f65f0",width: "100%", textDecoration: "underline", cursor: "pointer", padding: "6px", font: "inherit", }
};

export default UsersTable;