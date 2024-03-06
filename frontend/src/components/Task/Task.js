import React, { useState } from 'react';
import api from '../../services/api';
import TaskContainer from '../TaskContainer/TaskContainer';
import './Task.css';

function Task({ task, listId, handleDeleteTask, onUpdateTasks }) {
  const [isCollapsed, setIsCollapsed] = useState(true); // for collapsing with start value is true
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [completed, setCompleted] = useState(task.completed);


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


  // Handle the checkbox change
  const handleCheckboxChange = () => {
    const updatedCompletionStatus = !completed;
    setCompleted(updatedCompletionStatus); // Update state

    // Update the task's completion status in the backend
    api.patch(`/taskscontainer/tasks/${task.id}`, { completed: updatedCompletionStatus })
      .then(() => {
        onUpdateTasks(task.id, { ...task, completed: updatedCompletionStatus });
      })
      .catch(error => console.error("Error updating task completion", error));
  };


  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };


  const handleDragStart = (e, task) => {
    e.stopPropagation(); // Prevent the drag event from bubbling up to the list
    // Use JSON.stringify to handle complex data
    e.dataTransfer.setData("text/plain", JSON.stringify({ id: task.id, listId: listId }));
    e.dataTransfer.effectAllowed = "move";
  };


  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
    >
      <div>
        {isEditing ? (
          <div className='edit-task-box'>
            <input className='edit-task-input' value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className='edit-task-description' value={description} onChange={(e) => setDescription(e.target.value)} />
            <button className='save-task-edit-btn' onClick={handleSave}>Save</button>
            <button className='cancel-task-edit-btn' onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <div className="task-header">
              <div className="task-title-check">
                {/* Checkbox for marking task completion */}
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={handleCheckboxChange}
                  className="task-completion-checkbox"
                />

                {/* task title */}
                <h3 onClick={toggleCollapse}>{title}</h3>

              </div>


              <div className="task-del-edit-box">

                {/*Button for editing the task*/}
                <button onClick={handleEdit} className='edit-task-btn'>
                <i className="fas fa-edit"></i> {/* This is the Font Awesome edit icon */}
                </button>

                {/*Button for deleting the task*/}
                <button onClick={() => handleDeleteTask(task.id)} className="delete-task-btn">
                  <i className="fas fa-trash"></i> {/* This is the Font Awesome Trash icon */}
                  </button>
              </div>

            </div>
          </>
        )}
      </div>
      {!isCollapsed && (
        <>
          <p className="task-description">{task.description}</p>
          <TaskContainer listId={listId} parentTaskId={task.id} />
        </>
      )}

    </div>
  );
}

export default Task;
