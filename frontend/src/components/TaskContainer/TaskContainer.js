import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import Task from '../Task/Task';
import './TaskContainer.css';

function TaskContainer({ listId }) {
  
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');

  // Memoize fetchTasks to prevent it from being recreated on every render
  const fetchTasks = useCallback(() => {
    api.get(`/taskscontainer/tasks/${listId}`)
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks", error));
  }, [listId]); // Only recreate fetchTasks when listId changes

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // fetchTasks is now stable and won't cause useEffect to re-run unnecessarily

  const addTask = (taskTitle) => {
    if (!newTaskTitle.trim()) return; // Prevent adding empty tasks

    const taskData = {
      title: newTaskTitle,
      description: newTaskDetails,
      list_id: listId
    };

    api.post('/taskscontainer/tasks', taskData)
      .then(response => {
        setTasks(prevTasks => [...prevTasks, response.data]);
        setNewTaskTitle(''); // Clear the input field after adding
        setNewTaskDetails(''); // Clear the details input as well
      })
      .catch(error => console.error("Error adding task", error));
  };


  const deleteTask = (taskId) => {
    api.delete(`/taskscontainer/tasks/${taskId}`)
      .then(fetchTasks) // No need to wrap fetchTasks in an anonymous function
      .catch(error => console.error("Error deleting task", error));
  };

  const toggleTaskCompletion = (taskId, isCompleted) => {
    api.patch(`/taskscontainer/tasks/${taskId}`, { completed: !isCompleted })
      .then(fetchTasks) // No need to wrap fetchTasks in an anonymous function
      .catch(error => console.error("Error updating task", error));
  };

  return (
    <div className="task-container">

      <h3>Tasks for List {listId}</h3>

      {tasks.map(task => (
        <Task
          key={task.id}
          task={task}
          deleteTask={() => deleteTask(task.id)}
          toggleTaskCompletion={() => toggleTaskCompletion(task.id, task.completed)}
        />
      ))}

      
      <div className="add-task-input-container">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
          className="add-task-input"
        />
        <textarea
          value={newTaskDetails}
          onChange={(e) => setNewTaskDetails(e.target.value)}
          placeholder="Enter task details"
          className="add-task-details" // Apply a class for styling
        />
        <button
          onClick={addTask}
          className="add-task-btn"
          disabled={!newTaskTitle.trim()} // Disable button if title input is empty
        >
          Add Task
        </button>
      </div>


    </div>
  );

}

export default TaskContainer;
