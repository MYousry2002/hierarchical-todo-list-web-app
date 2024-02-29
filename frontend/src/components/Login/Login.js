// src/components/Login/Login.js
import React, { useState } from 'react';
import api from '../../services/api';
import './Login.css';


function Login({ onLoginSuccess, onPromptRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('accessToken', response.data.access_token); // Store the token
      onLoginSuccess(response.data.access_token); // Handle successful login
    } catch (error) {
      alert('Login failed!');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <div className="login-prompt">
        Not registered?  
        <button onClick={onPromptRegister} className="prompt-button">
          Create an account
        </button>
      </div>
    </div>
  );
}

export default Login;
