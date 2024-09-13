import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../1_MediaAssets/BrandImages/Logo.png';
import '../1_MediaAssets/Styles/All.css';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('https://startbiztodolistserver.vercel.app/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    axios.post('https://startbiztodolistserver.vercel.app/tasks', { title: newTask })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const deleteTask = (id) => {
    axios.delete(`https://startbiztodolistserver.vercel.app/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div className="maincontainer">
      <div className="container">

        <div className="navbar">
          <img src={Logo} alt="Logo" className="logo" />
          <h2 className="heading">Task Manager</h2>
        </div>

        <div className="inputContainer">
          <input
            className="input"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task"
          />
          <button className="addButton" onClick={addTask}>Add Task</button>
        </div>

        <ul className="taskList">
          {tasks.map(task => (
            <li key={task.id} className="taskItem">
              <span className="taskText">{task.title}</span>
              <button className="deleteButton" onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
        
      </div>
    </div>
  );
};

export default ToDoList;
