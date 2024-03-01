import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import Task from '../Task/Task';

function TaskContainer({ listId }) {
  const [tasks, setTasks] = useState([]);

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
    api.post('/taskscontainer/tasks', { title: taskTitle, list_id: listId })
      .then(fetchTasks) // No need to wrap fetchTasks in an anonymous function
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
    <div>
      <h3>Tasks for List {listId}</h3>
      {tasks.map(task => (
        <Task key={task.id} task={task} deleteTask={() => deleteTask(task.id)} toggleTaskCompletion={() => toggleTaskCompletion(task.id, task.completed)} />
      ))}
      <button onClick={() => addTask("New Task")}>Add Task</button>
    </div>
  );
}

export default TaskContainer;
