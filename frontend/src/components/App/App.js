import React from 'react';
import './App.css'; // Importing your main CSS file
import List from '../List/List'; // Importing the List component

function App() {
  return (
    <div className="app">
      <h1>Todo List</h1>
      <List/>
    </div>
  );
}

export default App;
