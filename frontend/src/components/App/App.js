// Import necessary modules and components
import React, { useState, useCallback } from 'react'; // Import React and hooks
import api from '../../services/api'; // Import the API service
import Login from '../Auth/Login/Login'; // Import the Login component
import Register from '../Auth/Register/Register'; // Import the Register component
import Logout from '../Auth/Logout/Logout'; // Import the Logout component
import ListContainer from '../ListContainer/ListContainer'; // Import the ListContainer component
import Header from '../Header/Header'; // Import the Header component
import Footer from '../Footer/Footer'; // Import the Footer component
import './App.css'; // Import the CSS for this component

// Define the App component
function App() {
  // Define state variables for authentication status and whether to show the registration form
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Define a callback for handling successful authentication
  const handleAuthSuccess = useCallback((token) => {
    localStorage.setItem('accessToken', token); // Store the access token in local storage
    setIsAuthenticated(true); // Update the authentication status
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set the authorization header for the API
  }, []);

  // Define a callback for handling logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken'); // Remove the access token from local storage
    setIsAuthenticated(false); // Update the authentication status
    delete api.defaults.headers.common['Authorization']; // Remove the authorization header for the API
  }, []);

  // Define functions for showing the registration and login forms
  const promptRegister = () => setShowRegister(true);
  const promptLogin = () => setShowRegister(false);

  // Render the component
  return (
    <div className="app">
      <Header /> {/* Render the Header component */}
      {isAuthenticated ? (
        <>
          <Logout onLogout={handleLogout} /> {/* Render the Logout component */}
          <ListContainer /> {/* Render the ListContainer component */}
        </>
      ) : (
        <>
          {showRegister ? (
            <Register onPromptLogin={promptLogin} /> // Render the Register component
          ) : (
            <Login onLoginSuccess={handleAuthSuccess} onPromptRegister={promptRegister} /> // Render the Login component
          )}
        </>
      )}
      <Footer /> {/* Render the Footer component */}
    </div>
  );
}

// Export the App component as the default export
export default App;