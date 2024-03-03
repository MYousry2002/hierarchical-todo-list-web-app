import React, { useState } from 'react';
import api from '../../services/api';
import TaskContainer from '../TaskContainer/TaskContainer';
import './Task.css';

function Task({ task, listId }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Include functions for handleEdit, handleDelete, handleSave, etc.

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}>
      <div onClick={toggleCollapse}>
        <h3>{task.title}</h3>
        {/* Buttons for edit, delete, etc. */}
      </div>
      {!isCollapsed && (
        <>
          <p>{task.description}</p>
          <TaskContainer listId={listId} parentTaskId={task.id} />
        </>
      )}
    </div>
  );
}

export default Task;
