// DashboardUI/GamesTable.js
import React from "react";

const GamesTable = ({ games, editedGames, setEditedGames, newGames, addNewGameRow, handleNewGameChange, saveGame, deleteGame, saveNewGame }) => {
  return (
    <div style={{ marginTop: "50px",marginBottom: "30px", overflowX: "auto" }}>
     

 {/* Title */}
      <h2 style={{ textAlign: "center", marginBottom: "40px",textDecoration: "underline", fontSize: "50px", color: "#0f65f0ff" }}>Games Management</h2>



      <table style={styles.table}>
        <thead>
          <tr><th>Game Name</th><th>Open Time</th><th>Close Time</th><th>Open Result</th><th>Close Result</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {games?.map(game => (
            <tr key={game.id}>
              <td><input style={styles.input} value={editedGames[game.id]?.gameName || ""} onChange={(e) => setEditedGames({...editedGames, [game.id]: {...editedGames[game.id], gameName: e.target.value}})} /></td>
              <td><input style={styles.input} value={editedGames[game.id]?.openTime || ""} onChange={(e) => setEditedGames({...editedGames, [game.id]: {...editedGames[game.id], openTime: e.target.value}})} /></td>
              <td><input style={styles.input} value={editedGames[game.id]?.closeTime || ""} onChange={(e) => setEditedGames({...editedGames, [game.id]: {...editedGames[game.id], closeTime: e.target.value}})} /></td>
              <td><input style={styles.input} value={editedGames[game.id]?.openResult || ""} onChange={(e) => setEditedGames({...editedGames, [game.id]: {...editedGames[game.id], openResult: e.target.value}})} /></td>
              <td><input style={styles.input} value={editedGames[game.id]?.closeResult || ""} onChange={(e) => setEditedGames({...editedGames, [game.id]: {...editedGames[game.id], closeResult: e.target.value}})} /></td>
              <td>
                <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
                  <button style={styles.saveBtn} onClick={() => saveGame(game.id)}>Save</button>
                  <button style={styles.deleteBtn} onClick={() => deleteGame(game.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button style={styles.addBtn} onClick={addNewGameRow}>+ Add Game</button>

        {newGames.map((game, index) => (
          <table style={styles.table} key={index}>
            <tbody>
              <tr>
                <td><input style={styles.input} placeholder="Game Name" value={game.gameName} onChange={(e) => handleNewGameChange(index, "gameName", e.target.value)} /></td>
                <td><input style={styles.input} placeholder="Open Time" value={game.openTime} onChange={(e) => handleNewGameChange(index, "openTime", e.target.value)} /></td>
                <td><input style={styles.input} placeholder="Close Time" value={game.closeTime} onChange={(e) => handleNewGameChange(index, "closeTime", e.target.value)} /></td>
                <td><input style={styles.input} placeholder="Open Result" value={game.openResult} onChange={(e) => handleNewGameChange(index, "openResult", e.target.value)} /></td>
                <td><input style={styles.input} placeholder="Close Result" value={game.closeResult} onChange={(e) => handleNewGameChange(index, "closeResult", e.target.value)} /></td>
                <td>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
                    <button style={styles.saveBtn} onClick={() => saveNewGame(index)}>Save</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

const styles = {
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px", minWidth: "700px" },
  input: { padding: "6px", borderRadius: "5px", border: "1px solid #9bc466ff", width: "100%", boxSizing: "border-box" },
  saveBtn: { backgroundColor: "#00a8ff", color: "#fff", border: "none", padding: "5px 10px", marginRight: "5px", borderRadius: "5px", cursor: "pointer" },
  deleteBtn: { backgroundColor: "#e84118", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" },
  addBtn: { backgroundColor: "#44bd32", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", marginTop: "10px" },
};

export default GamesTable;