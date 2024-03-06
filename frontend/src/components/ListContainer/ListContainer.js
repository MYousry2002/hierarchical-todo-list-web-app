// Import necessary dependencies
import React, { useState, useEffect } from 'react'; // React and hooks
import api from '../../services/api'; // API service for server requests
import List from '../List/List'; // List component
import './ListContainer.css'; // Styles for this component

// Define the ListContainer component
function ListContainer() {
  // Define state variables
  const [lists, setLists] = useState([]); // State for storing lists
  const [newListTitle, setNewListTitle] = useState(''); // State for storing new list title
  const [newListDescription, setNewListDescription] = useState(''); // State for storing new list description
  const [draggedIndex, setDraggedIndex] = useState(null); // State for storing index of dragged list
  const [refreshFlag, setRefreshFlag] = useState(false); // State for triggering list refresh

  // Use effect hook to fetch lists when component mounts or refreshFlag changes
  useEffect(() => {
    fetchLists();
  }, [refreshFlag]);

  // Function to fetch lists from server
  const fetchLists = () => {
    api.get('/listscontainer/lists')
      .then(response => {
        setLists(response.data); // Update lists state with fetched data
      })
      .catch(error => console.error("Error fetching lists", error));
  };

  // Function to add a new list
  const addList = () => {
    if (!newListTitle.trim()) return; // Prevent adding list with empty title

    const newListData = {
      title: newListTitle,
      description: newListDescription,
    };

    api.post('listscontainer/lists', newListData)
      .then(response => {
        setLists(prevLists => [...prevLists, response.data]); // Add new list to state
        setNewListTitle(''); // Clear title input field
        setNewListDescription(''); // Clear description input field
        toggleRefresh(); // Trigger list refresh
      })
      .catch(error => console.error("Error adding list", error));
  
    toggleRefresh();
  };

  // Function to remove a list
  const removeList = (listId) => {
    api.delete(`/listscontainer/lists/${listId}`)
      .then(() => {
        setLists(prevLists => prevLists.filter(list => list.id !== listId)); // Remove list from state
      })
      .catch(error => console.error("Error removing list", error));
  };

  // Functions for handling drag and drop of lists
  const onDragStart = (e, index) => {
    setDraggedIndex(index); // Store index of dragged list
  };

  const onDragOver = (e) => {
    e.preventDefault(); // Prevent default to allow dropping
  };

  const onDrop = (index) => {
    if (draggedIndex === null) return; // Do nothing if no list is being dragged

    const newListOrder = [...lists];
    const [removed] = newListOrder.splice(draggedIndex, 1); // Remove dragged list from its old position
    newListOrder.splice(index, 0, removed); // Insert dragged list at its new position
    setLists(newListOrder); // Update lists state with new order
    setDraggedIndex(null); // Clear dragged index
  };

  // Function to toggle refresh flag
  const toggleRefresh = () => setRefreshFlag(prevFlag => !prevFlag);

  // Function to handle moving tasks between lists
  const handleMoveTask = (oldListId, newListId) => {
    const updateTasksForList = (listId) => {
      const endpoint = `/taskscontainer/tasks/by_list/${listId}`;
      api.get(endpoint)
        .then(response => {
          setLists(currentLists => currentLists.map(list => {
            if(list.id === listId) {
              return { ...list, tasks: response.data }; // Update tasks for the list
            }
            return list;
          }));
        })
        .catch(error => console.error(`Error fetching tasks for list ${listId}`, error));
    };

    updateTasksForList(oldListId);
    updateTasksForList(newListId);
    toggleRefresh(); // Trigger list refresh
  };

  // Render the component
  return (
    <div className="list-container">
      {lists.map((list, index) => (
        <List
        key={list.id}
        list={list}
        lists={lists}
        removeList={() => removeList(list.id)}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        index={index}
        handleMoveTask={handleMoveTask}
        refreshFlag={refreshFlag}
        toggleRefresh={() => setRefreshFlag(!refreshFlag)}
        />
      ))}

      <div className="add-list-container">
        <input
          className="add-list-input"
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Enter list title"
        />
        
        <textarea
          className="add-list-description"
          value={newListDescription}
          onChange={(e) => setNewListDescription(e.target.value)}
          placeholder="Enter list description"
        />

        <button
          className="add-list-btn"
          onClick={addList}
          disabled={!newListTitle.trim()}
        >
          Add List
        </button>
      </div>

    </div>
  );
}

// Export the component
export default ListContainer;