import React, { useState } from 'react';
import { addUser } from '../api';
import './AddUser.css';

function AddUser({ onUserAdded }) {
  const [name, setName] = useState('');

  const handleAdd = async () => {
    try {
      if (!name.trim()) return;
      await addUser({ name });
      setName('');
      onUserAdded();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="add-user-container">
      <h2>Add New User</h2>
      <input
        type="text"
        placeholder="Enter user name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddUser;
