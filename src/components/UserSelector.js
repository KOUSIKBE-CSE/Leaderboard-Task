import React from 'react';

export default function UserSelector({ users, selectedUser, setSelectedUser }) {
  return (
    <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
      <option value="">Select User</option>
      {users.map((u) => (
        <option key={u._id} value={u._id}>
          {u.name}
        </option>
      ))}
    </select>
  );
}
