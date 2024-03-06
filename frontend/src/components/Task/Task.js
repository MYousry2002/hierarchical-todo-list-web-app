// Import necessary dependencies
import React, { useState } from 'react'; // Importing React and useState hook from 'react'
import api from '../../services/api'; // Importing api from services
import TaskContainer from '../TaskContainer/TaskContainer'; // Importing TaskContainer component
import './Task.css'; // Importing Task styles

// Task component definition
function Task({ task, listId, handleDeleteTask, onUpdateTasks }) {
  // State variables
  const [isCollapsed, setIsCollapsed] = useState(true); // State for task collapse/expand
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [title, setTitle] = useState(task.title); // State for task title
  const [description, setDescription] = useState(task.description); // State for task description
  const [completed, setCompleted] = useState(task.completed); // State for task completion status

  // Handler for edit button
  const handleEdit = () => {
    setIsEditing(true); // Set editing mode to true
  };

  // Handler for save button
  const handleSave = () => {
    const updatedTask = { ...task, title, description }; // Create updated task object
    // Update task in the backend
    api.put(`/taskscontainer/tasks/${task.id}`, updatedTask)
      .then(() => {
        if (onUpdateTasks) {
          onUpdateTasks(task.id, updatedTask); // Update tasks in the parent component
        }
        setIsEditing(false); // Exit editing mode
      })
      .catch(error => console.error("Error updating task", error)); // Log error if any
  };  

  // Handler for checkbox change
  const handleCheckboxChange = () => {
    const updatedCompletionStatus = !completed; // Toggle completion status
    setCompleted(updatedCompletionStatus); // Update completion status in the state

    // Update the task's completion status in the backend
    api.patch(`/taskscontainer/tasks/${task.id}`, { completed: updatedCompletionStatus })
      .then(() => {
        onUpdateTasks(task.id, { ...task, completed: updatedCompletionStatus }); // Update tasks in the parent component
      })
      .catch(error => console.error("Error updating task completion", error)); // Log error if any
  };

  // Handler for collapse/expand
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed); // Toggle collapse state
  };

  // Handler for drag start
  const handleDragStart = (e, task) => {
    e.stopPropagation(); // Prevent the drag event from bubbling up to the list
    // Set drag data
    e.dataTransfer.setData("text/plain", JSON.stringify({ id: task.id, listId: listId }));
    e.dataTransfer.effectAllowed = "move"; // Allow move effect
  };

  // Render
  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
    >
      <div>
        {isEditing ? (
          // If editing, render input fields and save/cancel buttons
          <div className='edit-task-box'>
            <input className='edit-task-input' value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className='edit-task-description' value={description} onChange={(e) => setDescription(e.target.value)} />
            <button className='save-task-edit-btn' onClick={handleSave}>Save</button>
            <button className='cancel-task-edit-btn' onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          // If not editing, render task title, completion checkbox, and edit/delete buttons
          <>
            <div className="task-header">
              <div className="task-title-check">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={handleCheckboxChange}
                  className="task-completion-checkbox"
                />
                <h3 onClick={toggleCollapse}>{title}</h3>
              </div>
              <div className="task-del-edit-box">
                <button onClick={handleEdit} className='edit-task-btn'>
                  <i className="fas fa-edit"></i>
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="delete-task-btn">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {!isCollapsed && (
        // If not collapsed, render task description and subtasks
        <>
          <p className="task-description">{task.description}</p>
          <TaskContainer listId={listId} parentTaskId={task.id} />
        </>
      )}
    </div>
  );
}

export default Task; // Export Task component