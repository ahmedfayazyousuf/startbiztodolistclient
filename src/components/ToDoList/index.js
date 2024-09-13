import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../1_MediaAssets/BrandImages/Logo.png';

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
    <div style={styles.container}>
      <div style={styles.navbar}>
        <img src={Logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.heading}>Task Manager</h1>
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button style={styles.addButton} onClick={addTask}>Add Task</button>
      </div>
      <ul style={styles.taskList}>
        {tasks.map(task => (
          <li key={task.id} style={styles.taskItem}>
            <span style={styles.taskText}>{task.title}</span>
            <button style={styles.deleteButton} onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#002244',
    minHeight: '100vh',
    padding: '20px',
    color: '#fff',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95vw',
    height: '60px',
    padding: '0 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  logo: {
    height: '40px',
  },
  heading: {
    fontSize: '1.5rem',
    color: '#fff',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    width: '300px',
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginRight: '10px',
    backgroundColor: '#fff',
    color: '#002244',
  },
  addButton: {
    backgroundColor: '#fff',
    color: '#002244',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  addButtonHover: {
    backgroundColor: '#e6e6e6',
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
    width: '100%',
    maxWidth: '400px',
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    color: '#002244',
    padding: '10px 15px',
    marginBottom: '10px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
  },
  taskItemHover: {
    transform: 'scale(1.02)',
  },
  taskText: {
    fontSize: '1.2rem',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  deleteButtonHover: {
    backgroundColor: '#ff1a1a',
  },
  '@media (max-width: 1000px)': {
    navbar: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'auto',
      padding: '10px',
    },
    logo: {
      height: '30px',
    },
    heading: {
      fontSize: '1.2rem',
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'column',
      width: '100%',
    },
    input: {
      width: '100%',
      marginBottom: '10px',
    },
    addButton: {
      width: '100%',
    },
  },
};

export default ToDoList;
