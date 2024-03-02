// Task.js
import React, { useState } from 'react';
import api from '../../services/api';
import './Task.css';

function Task({ task, onTaskUpdate, onTaskDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [completed, setCompleted] = useState(task.completed);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(task.title);
    setDescription(task.description || '');
    setCompleted(task.completed);
  };

  const handleSave = () => {
    const updatedTask = { ...task, title, description, completed };
    api.put(`/tasks/${task.id}`, updatedTask)
      .then(() => {
        onTaskUpdate(updatedTask);
        setIsEditing(false);
      })
      .catch(error => console.error("Error updating task", error));
  };

  const handleDelete = () => {
    api.delete(`/tasks/${task.id}`)
      .then(() => onTaskDelete(task.id))
      .catch(error => console.error("Error deleting task", error));
  };

  const toggleCompleted = () => {
    const updatedTask = { ...task, completed: !completed };
    api.put(`/tasks/${task.id}`, updatedTask)
      .then(() => {
        onTaskUpdate(updatedTask);
        setCompleted(!completed);
      })
      .catch(error => console.error("Error updating task", error));
  };

  return (
    <div className={`task ${completed ? 'completed' : ''}`}>
      {isEditing ? (
        <>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <h3 onClick={toggleCompleted}>{title}</h3>
          <p>{description}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
}

export default Task;
