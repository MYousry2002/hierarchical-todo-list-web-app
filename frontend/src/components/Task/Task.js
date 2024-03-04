import React, { useState } from 'react';
import api from '../../services/api';
import TaskContainer from '../TaskContainer/TaskContainer';
import './Task.css';

function Task({ task, listId, handleDeleteTask, onUpdateTasks }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);


  // functions for handleEdit, handleDelete, handleSave, etc.

  const handleEdit = () => {
    setIsEditing(true);
  };

  

  const handleSave = () => {
    const updatedTask = { ...task, title, description };
    api.put(`/taskscontainer/tasks/${task.id}`, updatedTask)
      .then(() => {
        if (onUpdateTasks) {
          onUpdateTasks(task.id, updatedTask);
        }
        setIsEditing(false);
      })
      .catch(error => console.error("Error updating task", error));
  };  


  const handleComplete = () => {
    const updatedTask = { ...task, completed: !task.completed };
    api.patch(`/taskscontainer/tasks/${task.id}`, { completed: updatedTask.completed })
      .then(() => {
        if (onUpdateTasks) {
          onUpdateTasks(task.id, updatedTask);
        }
      })
      .catch(error => console.error("Error updating task completion", error));
  };
  
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}>
      <div onClick={toggleCollapse}>
        {isEditing ? (
          <>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h3 onClick={handleComplete}>{title}</h3>
            <p>{description}</p>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)} className="delete-task-btn">
              Delete </button>
          </>
        )}
      </div>
      {!isCollapsed && <TaskContainer listId={listId} parentTaskId={task.id} />}
    </div>
  );
}

export default Task;
