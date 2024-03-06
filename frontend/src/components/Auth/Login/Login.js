// Import necessary modules and components
import React, { useState } from 'react'; // Import React and the useState hook
import api from '../../../services/api'; // Import the API service
import './Login.css'; // Import the CSS for this component

// Define the Login component
function Login({ onLoginSuccess, onPromptRegister }) {
  // Define state variables for the username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Define a function for handling the login process
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Send a POST request to the login endpoint with the username and password
      const response = await api.post('/auth/login', { username, password });
      // Store the access token in local storage
      localStorage.setItem('accessToken', response.data.access_token);
      // Call the onLoginSuccess function with the access token
      onLoginSuccess(response.data.access_token);
    } catch (error) {
      // If an error occurs, alert the user that the login failed
      alert('Login failed!');
    }
  };

  // Render the component
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit" disabled={!username.trim() || !password.trim()}>Login</button>
      </form>
      <div className="login-prompt">
        Not registered?  
        <button onClick={onPromptRegister} className="prompt-button">Create an account</button>
      </div>
    </div>
  );
}

// Export the Login component as the default export
export default Login;