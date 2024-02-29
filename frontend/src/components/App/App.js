// src/components/App/App.js
import React, { useState, useCallback } from 'react';
import api from '../../services/api';
import Login from '../Login/Login';
import Register from '../Register/Register';
import List from '../List/List';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleAuthSuccess = useCallback((token) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  // authentication form button
  const promptRegister = () => setShowRegister(true);
  const promptLogin = () => setShowRegister(false);

  return (
    <div className="app">
      {isAuthenticated ? (
        <>
          <h1>Todo List</h1>
          <List />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          {showRegister ? (
            <Register onRegisterSuccess={handleAuthSuccess} onPromptLogin={promptLogin} />
          ) : (
            <Login onLoginSuccess={handleAuthSuccess} onPromptRegister={promptRegister} />
          )}

        </>
      )}
    </div>
  );
}

export default App;
