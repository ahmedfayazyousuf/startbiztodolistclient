import { signOut } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../Firebase';
import Logo from '../1_MediaAssets/BrandImages/Logo.png';

const socket = io('https://startbiztodolistserver.vercel.app', {
  transports: ['websocket'],
  withCredentials: true
});

const AdminPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
      } else {
        fetchTasks();
        setLoading(false);
      }
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('taskPending', (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    });

    socket.on('taskDeleted', (deletedTaskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletedTaskId));
    });

    return () => {
      socket.off('taskPending');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      unsubscribe();
    };
  }, [navigate, auth]);

  const fetchTasks = () => {
    axios.get('https://startbiztodolistserver.vercel.app/admin/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  const acceptTask = (id) => {
    axios.patch(`https://startbiztodolistserver.vercel.app/tasks/${id}/accept`)
      .catch((error) => console.error('Error accepting task:', error));
  };

  const rejectTask = (id) => {
    axios.patch(`https://startbiztodolistserver.vercel.app/tasks/${id}/reject`)
      .catch((error) => console.error('Error rejecting task:', error));
  };

  const deleteTask = (id) => {
    axios.delete(`https://startbiztodolistserver.vercel.app/tasks/${id}`)
      .catch((error) => console.error('Error deleting task:', error));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const filteredTasks = selectedDate
    ? tasks.filter(task => new Date(task.date).toDateString() === new Date(selectedDate).toDateString())
    : tasks;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="maincontainer">
      <div className="container">
        <video autoPlay muted loop className="background-video">
          <source src='/Videos/BGVideo.mp4' type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="navbar">
          <img src={Logo} alt="Logo" className="logo" />
          <div className="navbar-buttons">
            <button className="navbar-button" onClick={() => navigate('/ToDoList')}>List</button>
            <button className="navbar-button" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>

        <h2 className="admin-header">Admin Panel - Task Management</h2>
        
        <div className="date-filter">
          <p>Search by date</p>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            placeholderText="Select a date"
            className="date-picker"
          />
        </div>

        <ul className="admin-task-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className="admin-task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Added by: {task.firstName} {task.lastName}</p>
              <p>Status: {task.status}</p>
              <p>Date: {new Date(task.date).toLocaleDateString()}</p>

              <div className="admin-task-buttons">
                {task.status === 'pending' && (
                  <>
                    <button className="admin-accept-btn" onClick={() => acceptTask(task.id)}>Accept</button>
                    <button className="admin-reject-btn" onClick={() => rejectTask(task.id)}>Reject</button>
                  </>
                )}
                <button className="admin-delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
