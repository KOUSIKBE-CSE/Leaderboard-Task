import React, { useState, useEffect } from 'react';
import { getUsers, claimPoints, getClaimHistory, addUser } from './api';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [claimResult, setClaimResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleClaim = async () => {
    if (!selectedUser) return alert('Please select a user!');
    try {
      const res = await claimPoints(selectedUser);
      setClaimResult(res.data);
      fetchUsers();
      fetchHistory(selectedUser);
    } catch (err) {
      alert(err.response?.data?.error || 'Claim failed!');
    }
  };

  const fetchHistory = async (userId) => {
    if (!userId) return setHistory([]);
    try {
      const res = await getClaimHistory(userId);
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch claim history', error);
      setHistory([]);
    }
  };

  const handleAddUser = async () => {
    if (!newUserName.trim()) return;
    try {
      await addUser({ name: newUserName.trim() });
      setNewUserName('');
      fetchUsers();
    } catch (error) {
      console.error('Failed to add user', error);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all scores?")) {
      try {
        await axios.post("http://localhost:5000/api/users/reset");
        fetchUsers();
        setHistory([]);
        setClaimResult(null);
        setSelectedUser('');
        setCurrentPage(1);
      } catch (error) {
        console.error('Reset failed', error);
      }
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="app-container">
      <h1>🏆 Leaderboard System</h1>

      <div className="top-section">
        <div className="add-user">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Add new user"
          />
          <button onClick={handleAddUser}>➕ Add</button>
        </div>

        <div className="controls">
          <select
            onChange={(e) => {
              setSelectedUser(e.target.value);
              fetchHistory(e.target.value);
            }}
            value={selectedUser}
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>

          <button onClick={handleClaim} disabled={!selectedUser || users.length === 0}>
            🎯 Claim Points
          </button>
        </div>
      </div>

      {claimResult && (
        <div className="result">
          🎯 {claimResult.claim.points} points claimed for {claimResult.user.name}
        </div>
      )}

      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                  No users found. Please add a user.
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={user._id === selectedUser ? 'highlight' : ''}
                >
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.totalPoints}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="history">
          <h2>Claim History</h2>
          <ul>
            {history.map(item => (
              <li key={item._id}>
                {new Date(item.claimedAt).toLocaleString()} — {item.points} points
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="reset-button">
        <button onClick={handleReset}>🔄 Reset Leaderboard</button>
      </div>
    </div>
  );
}

export default App;
