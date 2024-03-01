// List.js
import React from 'react';
import TaskContainer from '../TaskContainer/TaskContainer';

function List({ list, removeList }) {
  // Only render if `list` prop is defined
  if (!list) {
    return null; // or loading indicator
  }

  return (
    <div className="list">
      <h2>{list.title}</h2>
      {/* TaskContainer will manage tasks for this specific list */}
      <TaskContainer listId={list.id} />
      {/* Button to remove this list */}
      <button onClick={() => removeList(list.id)} className="remove-list-btn">Remove List</button>
    </div>
  );
}

export default List;
