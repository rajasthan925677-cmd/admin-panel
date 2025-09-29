import React from "react";
import { Link } from "react-router-dom";
import useWinHistory from "../DashboardHooks/useWinHistory";

const WinHistory = () => {
  const {
    games,
    filteredWinBids,
    editedBids,
    editingBidId,
    filterDate,
    setFilterDate,
    filterGame,
    setFilterGame,
    filterType,
    setFilterType,
    handleSearch,
    clearFilters,
    handleEditToggle,
    handleBidChange,
    deleteBid,
    loading,
    isSearched,
    totalWinAmount,
  } = useWinHistory();

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Back Button */}
      <Link to="/dashboard" style={styles.backBtn}>
        ← Back to Dashboard
      </Link>

      <h2 style={{ textAlign: "center", textDecoration: "underline", fontSize: "50px",
         color: "#0d06d6ff", marginBottom: "70px"  }}>Win History Report</h2>

      {/* Win History Filters Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Win History Filters</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "60px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={styles.filterInput}
            />
            <select
              value={filterGame}
              onChange={(e) => setFilterGame(e.target.value)}
              style={styles.filterInput}
            >
              <option value="">Select Game</option>
              {games.map((game) => (
                <option key={game.id} value={game.gameName}>
                  {game.gameName}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={styles.filterInput}
            >
              <option value="">Select Game Type</option>
              <option value="Single Ank">Single Ank</option>
              <option value="Jodi">Jodi</option>
              <option value="Single Pana">Single Pana</option>
              <option value="Double Pana">Double Pana</option>
              <option value="Triple Pana">Triple Pana</option>
              <option value="Half Sangam">Half Sangam</option>
              <option value="Full Sangam">Full Sangam</option>
            </select>
            <button onClick={handleSearch} style={styles.searchBtn}>
              Search
            </button>
            <button onClick={clearFilters} style={styles.clearBtn}>
              Clear
            </button>
          </div>
          <div style={styles.totalWin}>
            Total Win Amount Today: ₹{totalWinAmount || 0}
          </div>
        </div>

        {isSearched && filteredWinBids.length === 0 ? (
          <p>No winning bids found</p>
        ) : isSearched ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.bidTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Mobile No</th>
                  <th style={styles.tableHeader}>Game ID</th>
                  <th style={styles.tableHeader}>Game Type</th>
                  <th style={styles.tableHeader}>Session</th>
                  <th style={styles.tableHeader}>Bid Digit</th>
                  <th style={styles.tableHeader}>Open Pana</th>
                  <th style={styles.tableHeader}>Close Pana</th>
                  <th style={styles.tableHeader}>Pana Digit</th>
                  <th style={styles.tableHeader}>Single Digit</th>
                  <th style={styles.tableHeader}>Bid Amount</th>
                  <th style={styles.tableHeader}>Date</th>
                  <th style={styles.tableHeader}>Time</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Payout Amount</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWinBids.map((bid) => (
                  <tr key={bid.docId} style={styles.bidRow}>
                    <td style={styles.bidCell}>
                      <Link
                        to={`/user-detail/${bid.mobile}`}
                        style={{ color: "#00a8ff", textDecoration: "underline" }}
                      >
                        {bid.mobile || "Unknown"}
                      </Link>
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.gameId || bid.gameId}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "gameId", e.target.value)
                          }
                        />
                      ) : (
                        bid.gameId
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.gameType || bid.gameType}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "gameType", e.target.value)
                          }
                        />
                      ) : (
                        bid.gameType
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.session || bid.session}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "session", e.target.value)
                          }
                        />
                      ) : (
                        bid.session
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.bidDigit || bid.bidDigit}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "bidDigit", e.target.value)
                          }
                        />
                      ) : (
                        bid.bidDigit
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.openPana || bid.openPana}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "openPana", e.target.value)
                          }
                        />
                      ) : (
                        bid.openPana
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.closePana || bid.closePana}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "closePana", e.target.value)
                          }
                        />
                      ) : (
                        bid.closePana
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.panaDigit || bid.panaDigit}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "panaDigit", e.target.value)
                          }
                        />
                      ) : (
                        bid.panaDigit
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.singleDigit || bid.singleDigit}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "singleDigit", e.target.value)
                          }
                        />
                      ) : (
                        bid.singleDigit
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.bidAmount || bid.bidAmount}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "bidAmount", e.target.value)
                          }
                        />
                      ) : (
                        bid.bidAmount
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.date || bid.date}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "date", e.target.value)
                          }
                        />
                      ) : (
                        bid.date
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.time || bid.time}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "time", e.target.value)
                          }
                        />
                      ) : (
                        bid.time
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.status || bid.status}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "status", e.target.value)
                          }
                        />
                      ) : (
                        bid.status
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      {editingBidId === bid.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedBids[bid.docId]?.payoutAmount || bid.payoutAmount || ''}
                          onChange={(e) =>
                            handleBidChange(bid.docId, "payoutAmount", e.target.value)
                          }
                        />
                      ) : (
                        bid.payoutAmount ? `₹${bid.payoutAmount}` : '-'
                      )}
                    </td>
                    <td style={styles.bidCell}>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          style={
                            editingBidId === bid.docId ? styles.saveBtn : styles.editBtn
                          }
                          onClick={() => handleEditToggle(bid.docId)}
                        >
                          {editingBidId === bid.docId ? "Save" : "Edit"}
                        </button>
                        <button style={styles.deleteBtn} onClick={() => deleteBid(bid.docId)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #fbc531, #2104f6ff)",
  },
  cardTitle: {
    marginBottom: "30px",
  },
  filterInput: {
    padding: "6px",
    borderRadius: "5px",
    border: "1px solid #dcdde1",
    minWidth: "150px",
  },
  searchBtn: {
    backgroundColor: "#00a8ff",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  clearBtn: {
    backgroundColor: "#e84118",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  backBtn: {
    position: "absolute",
    top: "20px",
    left: "20px",
    backgroundColor: "#00a8ff",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  bidTable: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "1 10px",
    minWidth: "1200px",
  },
  bidRow: {
    backgroundColor: "#acadabff",
  },
  bidCell: {
    border: "2px solid #020200ff",
    borderRadius: "5px",
    padding: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  tableHeader: {
    padding: "10px",
    backgroundColor: "#f1f1f1",
    borderBottom: "4px solid #010d03ff",
    textAlign: "center",
  },
  bidInput: {
    padding: "4px",
    borderRadius: "3px",
    border: "1px solid #dcdde1",
    width: "100%",
    boxSizing: "border-box",
  },
  editBtn: {
    backgroundColor: "#00a8ff",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#44bd32",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#e84118",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  totalWin: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#ff0000ff",
    padding: "6px 12px",
    borderRadius: "5px",
    display: "inline-block",
  },
};

export default WinHistory;