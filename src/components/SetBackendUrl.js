import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SetBackendUrl = () => {
  const [backendUrl, setBackendUrl] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Load saved URL from local storage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('backendUrl');
    if (savedUrl) {
      setBackendUrl(savedUrl);
    }
  }, []);

  const handleSetUrl = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setLoading(true);

    try {
      // Validate URL by making a test request
     const response = await fetch(`${backendUrl}/send-notification`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Test', body: 'Test Message', topic: 'main_notifications' })
});

      if (response.ok) {
        localStorage.setItem('backendUrl', backendUrl);
        setStatusMsg('Backend URL set successfully!');
      } else {
        setStatusMsg('Error: Invalid backend URL or server not responding.');
      }
    } catch (err) {
      setStatusMsg('Network Error: Unable to connect to the provided URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <Link
          to="/dashboard"
          className="inline-block mb-4 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Set Backend URL
        </h2>
        <form onSubmit={handleSetUrl} className="space-y-4">
          <div>
            <label htmlFor="backendUrl" className="block text-sm font-medium text-gray-700">
              Backend URL
            </label>
            <input
              id="backendUrl"
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="e.g., https://your-backend.vercel.app/api"
              required
              disabled={loading}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white font-semibold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? 'Saving...' : 'Set Backend URL'}
          </button>
        </form>
        {statusMsg && (
          <p
            className={`mt-4 text-center p-3 rounded-lg ${
              statusMsg.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {statusMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default SetBackendUrl;