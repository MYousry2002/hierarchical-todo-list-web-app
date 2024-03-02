// List.js
import React, { useState } from 'react';
import TaskContainer from '../TaskContainer/TaskContainer';
import api from '../../services/api';
import './List.css';

function List({ list, removeList, onDragStart, onDragOver, onDrop, index }) {

  // list description updating
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(list.description);

  // updating list description
  const saveDescription = () => {
    setIsEditing(false);
    // Here you would typically send the updated description to your backend
    // For example, using the api service you've defined elsewhere in your application
    api.put(`/listscontainer/lists/${list.id}`, { description })
      .then(response => {
        // Handle the response, e.g., show a success message
      })
      .catch(error => {
        // Handle the error, e.g., show an error message
        console.error("Error updating list description", error);
      });
  };

  // collapsing the list
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // dragging and moving the list
  const dragStart = (e) => {
    onDragStart(e, index);
  };


  // Only render if `list` prop is defined
  if (!list) {
    return null; // or loading indicator
  }

  return (
    <div className={`list ${isCollapsed ? 'collapsed collapsed-content' : ''}`}
    draggable
    onDragStart={dragStart}
    onDragOver={onDragOver}
    onDrop={() => onDrop(index)}>

      {/* Button to toggle list collapse */}
      <button onClick={toggleCollapse} className="collapse-toggle-btn">
        {isCollapsed ? '>' : '<'} {/* Change icon based on state */}
      </button>

      <div className="list-header">
        <h2>{list.title}</h2>

        {/* List Description that allows editing */}
        {isEditing ? (
          <textarea
            className="list-description-edit"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={saveDescription}
          />
        ) : (
          <p className="list-description-view"
            onClick={() => setIsEditing(true)}>
            {description || 'Click to add description...'} {/* Provide a placeholder if description is empty */}
            </p>
        )}
      </div>


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
