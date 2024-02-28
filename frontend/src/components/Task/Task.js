import React from 'react';

function Task({ task }) {
  return (
    <div className="task">
      <input
        type="checkbox"
        checked={task.completed}
        // onChange handler to toggle the completed status
      />
      <span className={task.completed ? 'completed' : ''}>{task.title}</span>
      {/* Add more details or buttons for editing/deleting */}
    </div>
  );
}

export default Task;
