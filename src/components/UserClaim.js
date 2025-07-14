import React, { useEffect, useState } from 'react';
import { getUsers, claimPoints } from '../api';
import './UserClaim.css';

function UserClaim({ onClaim }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [claimMessage, setClaimMessage] = useState('');

  useEffect(() => {
    getUsers().then(res => {
      setUsers(res.data);
      if (res.data.length) setSelectedUser(res.data[0]._id);
    });
  }, []);

  const handleClaim = async () => {
    try {
      if (!selectedUser) return;
      const res = await claimPoints(selectedUser);
      setClaimMessage(`${res.data.claim.points} points claimed!`);
      onClaim();
      setTimeout(() => setClaimMessage(''), 2000);
    } catch (err) {
      setClaimMessage(err.response?.data?.error || 'Error');
      setTimeout(() => setClaimMessage(''), 2000);
    }
  };

  return (
    <div className="user-claim-container">
      <h2>Claim Points</h2>
      <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
        {users.map(u => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>
      <button onClick={handleClaim}>Claim</button>
      {claimMessage && <p className="claim-message">{claimMessage}</p>}
    </div>
  );
}

export default UserClaim;
