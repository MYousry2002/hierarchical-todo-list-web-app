// src/components/LogoutButton/LogoutButton.js
import React from 'react';
import './Logout.css'; // a separate CSS file for styling

const Logout = ({ onLogout }) => {
  return (
    <div className="logout-container">
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Logout;
