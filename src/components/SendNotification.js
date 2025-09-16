import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SendNotification = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [topic, setTopic] = useState('main_notifications');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setLoading(true);

    // Fetch backend URL from local storage
    const backendUrl = localStorage.getItem('backendUrl') || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';

    if (!backendUrl) {
      setStatusMsg('Error: Backend URL not set. Please set it in the "Set Backend URL" page.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, topic }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMsg('Notification sent successfully!');
        setTitle('');
        setBody('');
        setTopic('main_notifications');
      } else {
        setStatusMsg(`Error: ${data.error || 'Failed to send notification'}`);
      }
    } catch (err) {
      setStatusMsg(`Network Error: Unable to connect to backend at ${backendUrl}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-900 via-light-800 to-light-700 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full transform transition-all hover:shadow-3xl">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/dashboard"
            className="inline-block text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Dashboard
          </Link>
          <Link
            to="/set-backend-url"
            className="inline-block text-red-600 hover:text-red-800 font-semibold text-sm"
          >
            Set Backend URL
          </Link>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Send Notification to Users
        </h2>
        <form onSubmit={handleSendNotification} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-md font-medium text-gray-800">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              required
              disabled={loading}
              className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-md font-medium text-gray-800">
              Message
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter notification message"
              required
              disabled={loading}
              className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 min-h-[120px]"
            />
          </div>
          <div>
            <label htmlFor="topic" className="block text-md font-medium text-gray-800">
              Topic
            </label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
              className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
            >
              <option value="main_notifications">Main Notifications (All Users)</option>
              <option value="game_notifications">Game-Related Notifications</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 rounded-xl text-white font-bold ${
              loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } transition-all duration-300 transform hover:scale-105`}
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
        {statusMsg && (
          <p
            className={`mt-6 text-center p-4 rounded-xl ${
              statusMsg.includes('Error')
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            } font-medium`}
          >
            {statusMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default SendNotification;