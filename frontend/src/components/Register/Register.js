// src/components/Register/Register.js
import React, { useState } from 'react';
import api from '../../services/api';
import './Register.css';

function Register({ onRegisterSuccess, onPromptLogin}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { username, password });
      alert('Registration successful!');
      console.log(response.data); // Log the response data from the server
      onRegisterSuccess(); // Navigate to login or auto-login
    } catch (error) {
      // Log the error to the console for debugging
      console.error('Registration error:', error.response);
      
      // Display a more detailed error message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(`Registration failed! Response error: ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('Registration failed! Request error. No response from the server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Error in registration. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
      <div className="register-prompt">
        Already have an account? 
        <button onClick={onPromptLogin} className="prompt-button">
          Log in
        </button>
      </div>
    </div>
  );
}

export default Register;
