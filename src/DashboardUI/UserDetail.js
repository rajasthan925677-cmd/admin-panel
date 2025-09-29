import React from "react";
import { Link } from "react-router-dom";
import useUserDetail from "../DashboardHooks/useUserDetail";

const FloatingInput = ({ label, value }) => (
  <div style={{ position: "relative", marginBottom: "20px" }}>
    <input
      style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
      value={value || ""}
      readOnly
    />
    <label
      style={{
        position: "absolute",
        left: "10px",
        top: value ? "-10px" : "10px",
        background: "#fff",
        padding: "0 5px",
        transition: "0.2s",
        color: value ? "#aaa" : "#ccc",
        fontSize: value ? "12px" : "16px",
      }}
    >
      {label}
    </label>
  </div>
);

const UserDetail = () => {
  const {
    user,
    games,
    filteredBids,
    filteredWinBids,
    filteredWithdrawRequests,
    filteredAddRequests,
    filteredQRAddRequests,
    editedBids,
    editedWithdrawRequests,
    editedAddRequests,
    editedQRAddRequests,
    editingBidId,
    editingWithdrawRequestId,
    editingAddRequestId,
    editingQRAddRequestId,
    filterDate,
    setFilterDate,
    filterGame,
    setFilterGame,
    filterType,
    setFilterType,
    filterWinDate,
    setFilterWinDate,
    filterWithdrawFromDate,
    setFilterWithdrawFromDate,
    filterWithdrawToDate,
    setFilterWithdrawToDate,
    filterAddDate,
    setFilterAddDate,
    filterQRAddDate,
    setFilterQRAddDate,
    handleSearch,
    handleWinSearch,
    handleWithdrawSearch,
    handleAddSearch,
    handleQRAddSearch,
    handleEditToggle,
    handleWithdrawEditToggle,
    handleAddEditToggle,
    handleQRAddEditToggle,
    handleBidChange,
    handleWithdrawChange,
    handleAddChange,
    handleQRAddChange,
    deleteBid,
    deleteWithdrawRequest,
    deleteAddRequest,
    deleteQRAddRequest,
    loading,
    isSearched,
    isWinSearched,
    isWithdrawSearched,
    isAddSearched,
    isQRAddSearched,
  } = useUserDetail();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Back Button */}
      <Link to="/dashboard" style={styles.backBtn}>
        ← Back to Dashboard
      </Link>

      <h2 style={{ textAlign: "center", fontSize: "40px", color: "#0c74f4ff", textDecoration: "underline", marginBottom: "70px" }}>
        User Detail
      </h2>

      {/* User Personal Info Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>User Personal Info</h3>
        <div style={styles.grid}>
          <FloatingInput label="Name" value={user.name} />
          <FloatingInput label="Mobile" value={user.mobile} />
          <FloatingInput label="Password" value={user.password} />
          <FloatingInput label="Balance" value={user.balance} />
        </div>
      </div>

      {/* User Payment Info Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>User Payment Info</h3>
        <div style={styles.grid}>
          <FloatingInput label="UPI ID" value={user.upiId} />
          <FloatingInput label="Account No" value={user.accountNo} />
          <FloatingInput label="Bank Name" value={user.bankName} />
          <FloatingInput label="Holder" value={user.holder} />
          <FloatingInput label="IFSC" value={user.ifsc} />
        </div>
      </div>

      {/* User Bid History Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>User Bid History</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
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
        </div>

        {isSearched && filteredBids.length === 0 ? (
          <p>No bids found</p>
        ) : isSearched ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.bidTable}>
              <thead>
                <tr>
                  <th>Game ID</th>
                  <th>Game Type</th>
                  <th>Session</th>
                  <th>Bid Digit</th>
                  <th>Open Pana</th>
                  <th>Close Pana</th>
                  <th>Pana Digit</th>
                  <th>Single Digit</th>
                  <th>Bid Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBids.map((bid) => (
                  <tr key={bid.docId}>
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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

      {/* User Win Report Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>User Win Report</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <input
            type="date"
            value={filterWinDate}
            onChange={(e) => setFilterWinDate(e.target.value)}
            style={styles.filterInput}
          />
          <button onClick={handleWinSearch} style={styles.searchBtn}>
            Search
          </button>
        </div>

        {isWinSearched && filteredWinBids.length === 0 ? (
          <p>No winning bids found</p>
        ) : isWinSearched ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.bidTable}>
              <thead>
                <tr>
                  <th>Game ID</th>
                  <th>Game Type</th>
                  <th>Session</th>
                  <th>Bid Digit</th>
                  <th>Open Pana</th>
                  <th>Close Pana</th>
                  <th>Pana Digit</th>
                  <th>Single Digit</th>
                  <th>Bid Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Payout Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWinBids.map((bid) => (
                  <tr key={bid.docId}>
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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

      {/* User Withdraw History Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>User Withdraw History</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <input
            type="date"
            value={filterWithdrawFromDate}
            onChange={(e) => setFilterWithdrawFromDate(e.target.value)}
            style={styles.filterInput}
            placeholder="From Date"
          />
          <input
            type="date"
            value={filterWithdrawToDate}
            onChange={(e) => setFilterWithdrawToDate(e.target.value)}
            style={styles.filterInput}
            placeholder="To Date"
          />
          <button onClick={handleWithdrawSearch} style={styles.searchBtn}>
            Search
          </button>
        </div>

        {isWithdrawSearched && filteredWithdrawRequests.length === 0 ? (
          <p>No withdraw requests found</p>
        ) : isWithdrawSearched ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.bidTable}>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Request Date</th>
                  <th>Payment Time</th>
                  <th>Request Status</th>
                  <th>UPI ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawRequests.map((request) => (
                  <tr key={request.docId}>
                    <td>
                      {editingWithdrawRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedWithdrawRequests[request.docId]?.amount || request.amount}
                          onChange={(e) =>
                            handleWithdrawChange(request.docId, "amount", e.target.value)
                          }
                        />
                      ) : (
                        `₹${request.amount}`
                      )}
                    </td>
                    <td>
                      {editingWithdrawRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedWithdrawRequests[request.docId]?.requestDate || request.requestDate}
                          onChange={(e) =>
                            handleWithdrawChange(request.docId, "requestDate", e.target.value)
                          }
                        />
                      ) : (
                        request.requestDate
                      )}
                    </td>
                    <td>
                      {editingWithdrawRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedWithdrawRequests[request.docId]?.paymentTime || request.paymentTime || ''}
                          onChange={(e) =>
                            handleWithdrawChange(request.docId, "paymentTime", e.target.value)
                          }
                        />
                      ) : (
                        request.paymentTime || '-'
                      )}
                    </td>
                    <td>
                      {editingWithdrawRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedWithdrawRequests[request.docId]?.requestStatus || request.requestStatus}
                          onChange={(e) =>
                            handleWithdrawChange(request.docId, "requestStatus", e.target.value)
                          }
                        />
                      ) : (
                        request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)
                      )}
                    </td>
                    <td>
                      {editingWithdrawRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedWithdrawRequests[request.docId]?.upiId || request.upiId || ''}
                          onChange={(e) =>
                            handleWithdrawChange(request.docId, "upiId", e.target.value)
                          }
                        />
                      ) : (
                        request.upiId || '-'
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          style={
                            editingWithdrawRequestId === request.docId ? styles.saveBtn : styles.editBtn
                          }
                          onClick={() => handleWithdrawEditToggle(request.docId)}
                        >
                          {editingWithdrawRequestId === request.docId ? "Save" : "Edit"}
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteWithdrawRequest(request.docId)}
                        >
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

      {/* User Add Fund History Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>User Add Fund History</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <input
            type="date"
            value={filterAddDate}
            onChange={(e) => setFilterAddDate(e.target.value)}
            style={styles.filterInput}
            placeholder="Select Date"
          />
          <button onClick={handleAddSearch} style={styles.searchBtn}>
            Search
          </button>
        </div>

        {isAddSearched && filteredAddRequests.length === 0 ? (
          <p>No add fund requests found</p>
        ) : isAddSearched ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.bidTable}>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Payment Time</th>
                  <th>Request Status</th>
                  <th>UPI Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAddRequests.map((request) => (
                  <tr key={request.docId}>
                    <td>
                      {editingAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedAddRequests[request.docId]?.amount || request.amount}
                          onChange={(e) =>
                            handleAddChange(request.docId, "amount", e.target.value)
                          }
                        />
                      ) : (
                        `₹${request.amount}`
                      )}
                    </td>
                    <td>
                      {editingAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedAddRequests[request.docId]?.paymentDate || request.paymentDate}
                          onChange={(e) =>
                            handleAddChange(request.docId, "paymentDate", e.target.value)
                          }
                        />
                      ) : (
                        request.paymentDate
                      )}
                    </td>
                    <td>
                      {editingAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedAddRequests[request.docId]?.paymentTime || request.paymentTime || ''}
                          onChange={(e) =>
                            handleAddChange(request.docId, "paymentTime", e.target.value)
                          }
                        />
                      ) : (
                        request.paymentTime || '-'
                      )}
                    </td>
                    <td>
                      {editingAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedAddRequests[request.docId]?.requestStatus || request.requestStatus}
                          onChange={(e) =>
                            handleAddChange(request.docId, "requestStatus", e.target.value)
                          }
                        />
                      ) : (
                        request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)
                      )}
                    </td>
                    <td>
                      {editingAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedAddRequests[request.docId]?.upiStatus || request.upiStatus || ''}
                          onChange={(e) =>
                            handleAddChange(request.docId, "upiStatus", e.target.value)
                          }
                        />
                      ) : (
                        request.upiStatus || '-'
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          style={
                            editingAddRequestId === request.docId ? styles.saveBtn : styles.editBtn
                          }
                          onClick={() => handleAddEditToggle(request.docId)}
                        >
                          {editingAddRequestId === request.docId ? "Save" : "Edit"}
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteAddRequest(request.docId)}
                        >
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

      {/* User QR Add Fund History Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>User QR Add Fund History</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <input
            type="date"
            value={filterQRAddDate}
            onChange={(e) => setFilterQRAddDate(e.target.value)}
            style={styles.filterInput}
            placeholder="Select Date"
          />
          <button onClick={handleQRAddSearch} style={styles.searchBtn}>
            Search
          </button>
        </div>

        {isQRAddSearched && filteredQRAddRequests.length === 0 ? (
          <p>No QR add fund requests found</p>
        ) : isQRAddSearched ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.bidTable}>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Payment DateTime</th>
                  <th>Request Status</th>
                  <th>Transaction ID</th>
                  <th>Transaction Ref ID</th>
                  <th>UPI Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQRAddRequests.map((request) => (
                  <tr key={request.docId}>
                    <td>
                      {editingQRAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedQRAddRequests[request.docId]?.amount || request.amount}
                          onChange={(e) =>
                            handleQRAddChange(request.docId, "amount", e.target.value)
                          }
                        />
                      ) : (
                        `₹${request.amount}`
                      )}
                    </td>
                    <td>
                      {editingQRAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedQRAddRequests[request.docId]?.paymentDateTime || request.paymentDateTime}
                          onChange={(e) =>
                            handleQRAddChange(request.docId, "paymentDateTime", e.target.value)
                          }
                        />
                      ) : (
                        request.paymentDateTime
                      )}
                    </td>
                    <td>
                      {editingQRAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedQRAddRequests[request.docId]?.requestStatus || request.requestStatus}
                          onChange={(e) =>
                            handleQRAddChange(request.docId, "requestStatus", e.target.value)
                          }
                        />
                      ) : (
                        request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)
                      )}
                    </td>
                    <td>
                      {editingQRAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedQRAddRequests[request.docId]?.transactionId || request.transactionId || ''}
                          onChange={(e) =>
                            handleQRAddChange(request.docId, "transactionId", e.target.value)
                          }
                        />
                      ) : (
                        request.transactionId || '-'
                      )}
                    </td>
                    <td>
                      {editingQRAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedQRAddRequests[request.docId]?.transactionRefId || request.transactionRefId || ''}
                          onChange={(e) =>
                            handleQRAddChange(request.docId, "transactionRefId", e.target.value)
                          }
                        />
                      ) : (
                        request.transactionRefId || '-'
                      )}
                    </td>
                    <td>
                      {editingQRAddRequestId === request.docId ? (
                        <input
                          style={styles.bidInput}
                          value={editedQRAddRequests[request.docId]?.upiStatus || request.upiStatus || ''}
                          onChange={(e) =>
                            handleQRAddChange(request.docId, "upiStatus", e.target.value)
                          }
                        />
                      ) : (
                        request.upiStatus || '-'
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          style={
                            editingQRAddRequestId === request.docId ? styles.saveBtn : styles.editBtn
                          }
                          onClick={() => handleQRAddEditToggle(request.docId)}
                        >
                          {editingQRAddRequestId === request.docId ? "Save" : "Edit"}
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteQRAddRequest(request.docId)}
                        >
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
    background: "linear-gradient(135deg, #14f2e7ff, #e934bcff)",
  },
  cardTitle: {
    marginBottom: "10px",
    fontSize: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
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
    borderCollapse: "collapse",
    minWidth: "1100px",
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
};

export default UserDetail;