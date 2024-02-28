import React, { useState, useEffect } from 'react';
import Task from './Task';
import api from '../services/api';

function List() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error("There was an error fetching the tasks", error));
  }, []);

  return (
    <div>
      {tasks.map(task => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
}

export default List;
