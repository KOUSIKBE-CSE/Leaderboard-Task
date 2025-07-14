import React, { useEffect, useState } from 'react';
import { getUsers } from '../api';
import './Leaderboard.css';

function Leaderboard({ refreshTrigger }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [refreshTrigger]);

  const fetchLeaderboard = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u._id}>
              <td>{idx + 1}</td>
              <td>{u.name}</td>
              <td>{u.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
