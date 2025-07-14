import React from 'react';

export default function ClaimHistory({ history }) {
  return (
    <div>
      <h2>Claim History</h2>
      <ul>
        {history.slice(0, 10).map((item) => (
          <li key={item._id}>
            {item.userName} claimed {item.claimedPoints} pts on{' '}
            {new Date(item.claimedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
