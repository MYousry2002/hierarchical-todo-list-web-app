import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Task from '../Task/Task';
import './TaskContainer.css';

function TaskContainer({ listId, parentTaskId = null, lists, onMoveTask, refreshFlag, toggleRefresh}) {
  
  
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');


  const fetchTasks = () => {
    const endpoint = parentTaskId
      ? `/taskscontainer/subtasks/${parentTaskId}`
      : `/taskscontainer/tasks/by_list/${listId}`;
    
    api.get(endpoint)
      .then(response => {
        console.log("API response data:", response.data);
        setTasks(response.data);
      })
      .catch(error => console.error("Error fetching tasks", error));
  };


  // Initial fetch of tasks
  useEffect(() => {
    fetchTasks();
  }, [listId, parentTaskId, refreshFlag]);


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
        // Ensure that the new task is added as a task and not as a subtask.
        // The logic here assumes that tasks have no parent_id when they are not subtasks.
        if (!parentTaskId) {
          setTasks(prevTasks => [...prevTasks, response.data]);
        } else {
          // Handle subtask addition logic here
        }
        fetchTasks(); // Re-fetch tasks to update the list
        setNewTaskTitle('');
        setNewTaskDetails('');
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


  // handle dropping the task
  const handleDrop = (e) => {
    e.preventDefault();
    const taskData = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (taskData.listId !== listId) {
      moveTaskToList(taskData.id, listId);
      // Add task to this list's state if it's not already present
      // Note: This might require fetching task details or adjusting based on available data
    }
  };
  
  const moveTaskToList = (taskId, newListId) => {
  api.patch(`/taskscontainer/tasks/move/${taskId}`, { list_id: newListId })
    .then(() => {
      onMoveTask(taskId, listId, newListId); // Assuming this function now also toggles the refreshFlag
      // No need to explicitly call fetchTasks here if refreshFlag change triggers it
    })
    .catch(error => console.error("Error moving task", error));
  };
  
  

  return (
    <div className="task-container" 
      onDragOver={(e) => e.preventDefault()} // Prevent the default to allow dropping
      onDrop={handleDrop}
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

export default TaskContainer;
