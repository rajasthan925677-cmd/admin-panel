import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeclareResult } from '../DashboardHooks/useDeclareResult';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function ResultDeclare() {
  const { declareResult, isLoading, resultMessage } = useDeclareResult();
  const navigate = useNavigate();

  const [gameName, setGameName] = useState('');
  const [resultType, setResultType] = useState('openResult');
  const [resultDate, setResultDate] = useState('');
  const [resultValue, setResultValue] = useState('');
  const [games, setGames] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState('');

  // Fetch game names from Firestore
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesQuery = query(collection(db, 'games'));
        const gamesSnapshot = await getDocs(gamesQuery);
        const gameList = gamesSnapshot.docs.map((doc) => doc.data().gameName);
        setGames(gameList);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };
    fetchGames();
  }, []);

  // Handle date change and format to "DD MMM YYYY"
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).replace(/Sept\b/, 'Sep');
      setResultDate(formattedDate);
    } else {
      setResultDate('');
    }
  };

  // Handle back to dashboard navigation
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Validate and submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation: digits only, max 3 digits
    if (!resultValue.match(/^\d{1,3}$/)) {
      setError('Result must be 1-3 digits (e.g., 04, 123)');
      return;
    }
    setError('');
    await declareResult(gameName, resultType, resultDate, resultValue);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafafaff, #f3f5f5ff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    card: {
      background: 'linear-gradient(135deg, #44cbf9ff, #4cd137)',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
      maxWidth: '500px',
      width: '100%',
      color: '#333',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      color: '#3e0af8ff',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    title: {
      textAlign: 'center',
      marginBottom: '40px',
      textDecoration: 'underline',
      fontSize: '40px',
      color: '#0ff016ff',
      fontWeight: 'bold',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
    },
    input: {
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #3e0af8ff',
      fontSize: '14px',
      background: '#f9f9f9',
      color: '#333',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    datePickerWrapper: {
      width: '100%',
    },
    submitButton: {
      padding: '10px',
      border: 'none',
      borderRadius: '6px',
      background: isLoading ? '#ccc' : '#66dfefff',
      color: 'white',
      fontWeight: '600',
      fontSize: '16px',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s ease',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      textAlign: 'center',
    },
    resultMessage: {
      fontSize: '16px',
      textAlign: 'center',
      marginTop: '20px',
      color: resultMessage.includes('failed') ? 'red' : 'green',
      fontWeight: '500',
    },
    spinner: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      animation: 'spin 1s linear infinite',
      margin: '10px auto',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Back Button */}
        <button onClick={handleBackToDashboard} style={styles.backButton}>
          <svg
            style={{ width: '20px', height: '20px', marginRight: '8px' }}
            fill="none"
            stroke="#3e0af8ff"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Title */}
        <h2 style={styles.title}>Declare Matka Result</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Game Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Game Name</label>
            <select
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              required
              style={styles.input}
            >
              <option value="" disabled>Select game</option>
              {games.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Result Type */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Result Type</label>
            <select
              value={resultType}
              onChange={(e) => setResultType(e.target.value)}
              style={styles.input}
            >
              <option value="openResult">Open Result</option>
              <option value="closeResult">Close Result</option>
            </select>
          </div>

          {/* Result Date */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Result Date</label>
            <div style={styles.datePickerWrapper}>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd MMM yyyy"
                placeholderText="Pick date from here"
                required
                wrapperClassName="w-full"
                className="w-full p-2.5 rounded-md border border-[#3e0af8ff] bg-[#f9f9f9] text-[#333] text-sm outline-none"
              />
            </div>
          </div>

          {/* Result Value */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Result Value</label>
            <input
              type="number"
              value={resultValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || value.match(/^\d{0,3}$/)) {
                  setResultValue(value);
                  setError('');
                } else {
                  setError('Result must be 1-3 digits (e.g., 04, 123)');
                }
              }}
              required
              placeholder="Enter result (e.g., 04)"
              style={styles.input}
            />
            {error && <div style={styles.error}>{error}</div>}
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Declare Result'}
          </button>
        </form>

        {/* Result Message */}
        {isLoading && <div style={styles.spinner}></div>}
        {resultMessage && <div style={styles.resultMessage}>{resultMessage}</div>}

        {/* Inline CSS for spinner animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default ResultDeclare;