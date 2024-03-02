// ListContainer.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import List from '../List/List';
import './ListContainer.css';


function ListContainer() {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');

  useEffect(() => {
    // Fetch all lists for the user when the component mounts
    fetchLists();
  }, []);

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

    api.post('listscontainer/lists', { title: newListTitle })
      .then(response => {
        setLists(prevLists => [...prevLists, response.data]);
        setNewListTitle(''); // Clear the input field after adding
      })
      .catch(error => console.error("Error adding list", error));
  };

  const removeList = (listId) => {
    api.delete(`/listscontainer/lists/${listId}`)
      .then(() => {
        // Remove the list from state without needing to re-fetch
        setLists(prevLists => prevLists.filter(list => list.id !== listId));
      })
      .catch(error => console.error("Error removing list", error));
  };

  return (
    <div className="list-container">
      {lists.map(list => (
        <List key={list.id} list={list} removeList={() => removeList(list.id)} />
      ))}
      <div>
        <input
          className="add-list-input" // Apply the class for styling
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Enter list title"
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
