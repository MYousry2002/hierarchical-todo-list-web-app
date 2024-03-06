// Import necessary modules and components
import React, { useState, useEffect } from 'react'; // Importing React hooks and React itself
import api from '../../services/api'; // Importing the API service
import Task from '../Task/Task'; // Importing the Task component
import './TaskContainer.css'; // Importing the CSS for this component

// The TaskContainer function component
function TaskContainer({ listId, parentTaskId = null, lists, onMoveTask, refreshFlag, toggleRefresh}) {
  
  // State variables for tasks, new task title and new task details
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');

  // Function to fetch tasks from the API
  const fetchTasks = () => {
    // Determine the endpoint based on whether there is a parent task ID
    const endpoint = parentTaskId
      ? `/taskscontainer/subtasks/${parentTaskId}`
      : `/taskscontainer/tasks/by_list/${listId}`;
    
    // Make a GET request to the API
    api.get(endpoint)
      .then(response => {
        console.log("API response data:", response.data); // Log the response data
        setTasks(response.data); // Set the tasks state variable with the response data
      })
      .catch(error => console.error("Error fetching tasks", error)); // Log any errors
  };

  // Use the useEffect hook to fetch tasks when the component mounts or when listId, parentTaskId, or refreshFlag changes
  useEffect(() => {
    fetchTasks();
  }, [listId, parentTaskId, refreshFlag]);

  // Function to add a task
  const addTask = () => {
    if (!newTaskTitle.trim()) return; // If the new task title is empty, return early

    // The data for the new task
    const taskData = {
      title: newTaskTitle,
      description: newTaskDetails,
      list_id: listId,
      parent_id: parentTaskId
    };

    // Make a POST request to the API to add the task
    api.post('/taskscontainer/tasks', taskData)
      .then(response => {
        // If the task is not a subtask, add it to the tasks state variable
        if (!parentTaskId) {
          setTasks(prevTasks => [...prevTasks, response.data]);
        } else {
          // Handle subtask addition logic here
        }
        fetchTasks(); // Re-fetch tasks to update the list
        setNewTaskTitle(''); // Reset the new task title
        setNewTaskDetails(''); // Reset the new task details
        })
      .catch(error => console.error("Error adding task", error)); // Log any errors
  };

  // Function to delete a task
  const handleDeleteTask = (taskId) => {
    // Make a DELETE request to the API to delete the task
    api.delete(`/taskscontainer/tasks/${taskId}`)
      .then(() => {
        // If the delete was successful, filter out the task from the tasks state variable
        setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
      })
      .catch(error => console.error("Error deleting task", error)); // Log any errors
  };

  // Function to update tasks
  const handleUpdateTasks = (taskId, updatedTask) => {
    // Update the tasks state variable with the updated task
    setTasks(currentTasks => currentTasks.map(task => {
      if (task.id === taskId) {
        return updatedTask;
      }
      return task;
    }));
  };

  // Function to handle dropping a task
  const handleDrop = (e) => {
    e.preventDefault(); // Prevent the default action
    const taskData = JSON.parse(e.dataTransfer.getData("text/plain")); // Get the task data from the event
    if (taskData.listId !== listId) {
      moveTaskToList(taskData.id, listId); // Move the task to the list
    }
  };
  
  // Function to move a task to a list
  const moveTaskToList = (taskId, newListId) => {
    // Make a PATCH request to the API to move the task
    api.patch(`/taskscontainer/tasks/move/${taskId}`, { list_id: newListId })
      .then(() => {
        onMoveTask(taskId, listId, newListId); // Call the onMoveTask function
      })
      .catch(error => console.error("Error moving task", error)); // Log any errors
  };

  // The JSX to render
  return (
    <div className="task-container" 
      onDragOver={(e) => e.preventDefault()} // Prevent the default to allow dropping
      onDrop={handleDrop} // Handle dropping a task
    >

      <div className="task-list">

      {Array.isArray(tasks) && tasks.map(task => (
        <Task
        key={task.id}
        task={task}
        onAddSubtask={addTask}
        handleDeleteTask={handleDeleteTask}
        onUpdateTasks={handleUpdateTasks}
        listId={listId}
        lists={lists} // Pass down the lists to Task
      />
      ))}

      </div>
      
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

export default TaskContainer; // Export the TaskContainer component