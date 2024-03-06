// Import necessary modules and components
import React, { useState } from 'react'; // Import React and the useState hook
import TaskContainer from '../TaskContainer/TaskContainer'; // Import the TaskContainer component
import api from '../../services/api'; // Import the API service
import './List.css'; // Import the CSS for this component

// Define the List component
function List({ list, removeList, onDragStart, onDragOver, onDrop, index, lists, handleMoveTask, refreshFlag, toggleRefresh}) {
  // Define state variables for editing the list title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);

  // Define a function for saving the list title
  const saveTitle = (e) => {
    e.preventDefault();
    if (!editedTitle.trim()) {
      // If the new title is empty, reset to the original title and exit editing mode
      setEditedTitle(list.title);
      setIsEditingTitle(false);
      return;
    }
    // Call the API to update the list title
    api.put(`/listscontainer/lists/${list.id}`, { title: editedTitle })
      .then(response => {
        // Update the title in the UI
        list.title = editedTitle;
        setIsEditingTitle(false);
      })
      .catch(error => console.error("Error updating title", error));
  };

  // Define state variables for editing the list description
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(list.description || '');

  // Define a function for saving the list description
  const saveDescription = (e) => {
    e.preventDefault();
    // Call the API to update the list description
    api.put(`/listscontainer/lists/${list.id}`, { description: editedDescription })
      .then(response => {
        // Update the description in the UI
        list.description = editedDescription;
        setIsEditingDescription(false);
      })
      .catch(error => console.error("Error updating description", error));
  };

  // Define state variable for collapsing the list
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Define a function for starting the drag operation
  const dragStart = (e) => {
    onDragStart(e, index);
  };

  // Only render if `list` prop is defined
  if (!list) {
    return null; // or loading indicator
  }

  // Render the component
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

      {/* Visible only when list is collapsed */}
      {isCollapsed && <div className="collapsed-title">{list.title}</div>}

      <div className="list-header">

        {/* Editable list title */}
        {isEditingTitle ? (
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyPress={(e) => e.key === 'Enter' && saveTitle(e)}
          />
        ) : (
          <h2 onDoubleClick={() => setIsEditingTitle(true)}>{list.title}</h2>
        )}

        {/* Editable list description */}
        {isEditingDescription ? (
          <textarea
            className="list-description-edit"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onBlur={saveDescription}
          />
        ) : (
          <p className="list-description-view"
            onClick={() => setIsEditingDescription(true)}>
            {list.description || 'Click to add description...'} {/* Provide a placeholder if description is empty */}
            </p>
        )}
      </div>

      {/* TaskContainer will manage tasks for this specific list */}
      <TaskContainer listId={list.id}  lists={lists} onMoveTask={handleMoveTask} refreshFlag={refreshFlag}
      toggleRefresh={toggleRefresh}/>

      {/* Button to remove this list */}
      <button onClick={() => removeList(list.id)} className="remove-list-btn">
        Remove List
        </button>

    </div>
  );
}

// Export the List component as the default export
export default List;