import React from 'react';
import '../app.css'; // Importing your main CSS file
import List from './List';

function App() {
  return (
    <div className="app">
      <h1>Todo List</h1>
      <List />
    </div>
  );
}

export default App;
