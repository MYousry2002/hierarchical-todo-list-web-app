// List.js
import React, { useState } from 'react';
import TaskContainer from '../TaskContainer/TaskContainer';
import './List.css';

function List({ list, removeList }) {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };


  // Only render if `list` prop is defined
  if (!list) {
    return null; // or loading indicator
  }

  return (
    <div className={`list ${isCollapsed ? 'collapsed collapsed-content' : ''}`}>
      
      {/* Button to toggle list collapse */}
      <button onClick={toggleCollapse} className="collapse-toggle-btn">
        {isCollapsed ? '>' : '<'} {/* Change icon based on state */}
      </button>

      <h2>{list.title}</h2>

      {/* TaskContainer will manage tasks for this specific list */}
      <TaskContainer listId={list.id} />

      {/* Button to remove this list */}
      <button onClick={() => removeList(list.id)} className="remove-list-btn">
        Remove List
        </button>

    </div>
  );
}

export default List;
