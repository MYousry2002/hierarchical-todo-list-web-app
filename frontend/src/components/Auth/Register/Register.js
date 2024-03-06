// Import necessary modules and components
import React, { useState } from 'react'; // Import React and the useState hook
import api from '../../../services/api'; // Import the API service
import './Register.css'; // Import the CSS for this component

// Define the Register component
function Register({ onRegisterSuccess, onPromptLogin}) {
  // Define state variables for the username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Define a function for handling the registration process
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Send a POST request to the register endpoint with the username and password
      const response = await api.post('/auth/register', { username, password });
      // Alert the user that the registration was successful
      alert('Registration successful!');
      // Log the response data from the server
      console.log(response.data);
      // Call the onPromptLogin function to navigate to the login page
      onPromptLogin();
    } catch (error) {
      // Log the error to the console for debugging
      console.error('Registration error:', error.response);
      // Handle different types of errors and display appropriate error messages
      if (error.response) {
        alert(`Registration failed! Response error: ${error.response.data.message}`);
      } else if (error.request) {
        alert('Registration failed! Request error. No response from the server. Please try again later.');
      } else {
        alert('Error in registration. Please try again.');
      }
    }
  };

  // Render the component
  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit" disabled={!username.trim() || !password.trim()}>Register</button>
      </form>
      <div className="register-prompt">
        Already have an account? 
        <button onClick={onPromptLogin} className="prompt-button">Log in</button>
      </div>
    </div>
  );
}

// Export the Register component as the default export
export default Register;
