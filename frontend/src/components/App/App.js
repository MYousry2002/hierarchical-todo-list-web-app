// src/components/App/App.js
import React, { useState, useCallback } from 'react';
import api from '../../services/api';
import Login from '../Auth/Login/Login';
import Register from '../Auth/Register/Register';
import Logout from '../Auth/Logout/Logout';
import ListContainer from '../ListContainer/ListContainer'; // Import ListContainer
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
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

      {/* App Header */}
      <Header />

      {isAuthenticated ? (
        
        <>
          <Logout onLogout={handleLogout} />
          <ListContainer /> {/* Render ListContainer here */}
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

    
    {/* App Footer */}
    <Footer />

    </div>
  );
}

export default App;
