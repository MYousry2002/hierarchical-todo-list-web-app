// Import necessary modules and components
import React from 'react'; // Import React
import './Logout.css'; // Import the CSS for this component

// Define the Logout component
// This component receives a function 'onLogout' as a prop
const Logout = ({ onLogout }) => {
  // Render the component
  return (
    <div className="logout-container">
      {/* Render a button that calls the 'onLogout' function when clicked */}
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </div>
  );
};

// Export the Logout component as the default export
export default Logout;