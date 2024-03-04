import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Task from '../Task/Task';
import './TaskContainer.css';

function TaskContainer({ listId, parentTaskId = null }) {
  
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');


  useEffect(() => {
    // Fetch tasks or subtasks depending on whether a parentTaskId is provided
    const endpoint = parentTaskId
      ? `/taskscontainer/subtasks/${parentTaskId}`
      : `/taskscontainer/tasks/by_list/${listId}`;
    
    api.get(endpoint)
      .then(response => {
        console.log("API response data:", response.data);
        setTasks(response.data)
      })
      .catch(error => console.error("Error fetching tasks", error));
  }, [listId, parentTaskId]);



  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const taskData = {
      title: newTaskTitle,
      description: newTaskDetails,
      list_id: listId,
      parent_id: parentTaskId
    };


    api.post('/taskscontainer/tasks', taskData)
      .then(response => {
        setTasks(prevTasks => [...prevTasks, response.data]);
        setNewTaskTitle(''); // Clear the input field after adding
        setNewTaskDetails(''); // Clear the details input as well
      })
      .catch(error => console.error("Error adding task", error));
  };


  const handleDeleteTask = (taskId) => {
    api.delete(`/taskscontainer/tasks/${taskId}`)
      .then(() => {
        // If the delete was successful, filter out the task from the tasks state
        setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
      })
      .catch(error => console.error("Error deleting task", error));
  };


  const handleUpdateTasks = (taskId, updatedTask) => {
    setTasks(currentTasks => currentTasks.map(task => {
      if (task.id === taskId) {
        // Update the task with the new data
        return updatedTask;
      }
      return task;
    }));
  };


  return (
    <div className="task-container">

      {/*<h3>Tasks for List {listId}</h3>*/}

      {Array.isArray(tasks) && tasks.map(task => (
        <Task
        key={task.id}
        task={task}
        onAddSubtask={addTask}
        handleDeleteTask={handleDeleteTask}
        onUpdateTasks={handleUpdateTasks}
        listId={listId}
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
