// ListContainer.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import List from '../List/List';
import './ListContainer.css';


function ListContainer() {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState(''); // for list description
  const [draggedIndex, setDraggedIndex] = useState(null); // for dragging and dropping
  const [refreshFlag, setRefreshFlag] = useState(false); // handles when tasks should be refreshed


  useEffect(() => {
    // Fetch all lists for the user when the component mounts
    fetchLists();
  }, [refreshFlag]);

  const fetchLists = () => {

    // Log the current state of Axios default headers
    console.log('Current Axios default headers:', api.defaults.headers);

    api.get('/listscontainer/lists')
      .then(response => {
        setLists(response.data);
      })
      .catch(error => console.error("Error fetching lists", error));
  };

  const addList = () => {
    // Prevent adding empty title lists
    if (!newListTitle.trim()) return;

    const newListData = {
      title: newListTitle,
      description: newListDescription, // Include description in the payload
    };


    api.post('listscontainer/lists', newListData)
      .then(response => {
        setLists(prevLists => [...prevLists, response.data]);
        setNewListTitle(''); // Clear the input field after adding
        setNewListDescription(''); // Clear the description field after adding
        toggleRefresh(); 
      })
      .catch(error => console.error("Error adding list", error));
  
    toggleRefresh();
  };

  const removeList = (listId) => {
    api.delete(`/listscontainer/lists/${listId}`)
      .then(() => {
        // Remove the list from state without needing to re-fetch
        setLists(prevLists => prevLists.filter(list => list.id !== listId));
      })
      .catch(error => console.error("Error removing list", error));
  };


  // drag and drop lists to move them around

  const onDragStart = (e, index) => {
    setDraggedIndex(index);
    // You may want to set some data on the drag event here with e.dataTransfer.setData
  };

  const onDragOver = (e) => {
    e.preventDefault(); // This is necessary to allow dropping
  };

  const onDrop = (index) => {
    if (draggedIndex === null) return;

    const newListOrder = [...lists];
    const [removed] = newListOrder.splice(draggedIndex, 1);
    newListOrder.splice(index, 0, removed);
    setLists(newListOrder);
    setDraggedIndex(null);
  };

  const toggleRefresh = () => setRefreshFlag(prevFlag => !prevFlag);
  // handling moving tasks between lists
  const handleMoveTask = (oldListId, newListId) => {
    // Fetch tasks for both lists involved in the move to update UI without full reload
    const updateTasksForList = (listId) => {
      const endpoint = `/taskscontainer/tasks/by_list/${listId}`;
      api.get(endpoint)
        .then(response => {
          setLists(currentLists => currentLists.map(list => {
            if(list.id === listId) {
              return { ...list, tasks: response.data };
            }
            return list;
          }));
        })
        .catch(error => console.error(`Error fetching tasks for list ${listId}`, error));
      
    };

    updateTasksForList(oldListId);
    updateTasksForList(newListId);
    toggleRefresh(); // This will trigger a refresh in all TaskContainers
  };


  return (
    <div className="list-container">
      {lists.map((list, index) => (
        <List
        key={list.id}
        list={list}
        lists={lists} // Pass down all lists
        removeList={() => removeList(list.id)}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        index={index}
        handleMoveTask={handleMoveTask} // for task movement
        refreshFlag={refreshFlag}
        toggleRefresh={() => setRefreshFlag(!refreshFlag)}
        />
      ))}

      <div className="add-list-container">
        <input
          className="add-list-input" // Apply the class for styling
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Enter list title"
        />
        
        <textarea
          className="add-list-description" // Add a new class for styling
          value={newListDescription}
          onChange={(e) => setNewListDescription(e.target.value)}
          placeholder="Enter list description"
        />

        <button
          className="add-list-btn" // Apply the class for styling
          onClick={addList}
          disabled={!newListTitle.trim()} // Disable button if title input is empty
        >
          Add List
        </button>
      </div>

    </div>
  );
}

export default ListContainer;
