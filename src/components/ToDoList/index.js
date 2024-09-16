import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../1_MediaAssets/BrandImages/Logo.png';
import '../1_MediaAssets/Styles/All.css';
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../Firebase';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', taskName: '', taskDescription: '', taskDate: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
      } else {
        setIsAuthenticated(true);
        fetchTasks();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate, auth]);

  const fetchTasks = () => {
    axios.get('https://startbiztodolistserver.vercel.app/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const handleShowPopUp = () => {
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  const addTask = () => {
    if (!formData.taskName.trim()) return;

    axios.post('https://startbiztodolistserver.vercel.app/tasks', {
      title: formData.taskName,
      description: formData.taskDescription,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      date: formData.taskDate
    })
      .then(() => {
        setFormData({
          firstName: '', lastName: '', email: '', phone: '', taskName: '', taskDescription: '', taskDate: ''
        });
        setShowPopUp(false);
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const events = tasks.map(task => ({
    title: task.title,
    start: new Date(task.date),
    end: new Date(task.date),
    allDay: true,
    taskData: task
  }));

  const dayPropGetter = (date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return {
        style: {
          backgroundColor: 'red',
          color: 'white'
        }
      };
    }
    return {};
  };

  if (!isAuthenticated) {
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
            <button className="navbar-button" onClick={() => navigate('/AdminPanel')}>Admin</button>
            <button className="navbar-button" style={{marginRight: '5px'}} onClick={handleSignOut}>Sign out</button>
          </div>
        </div>

        <div className="inputContainer">
          <button className="addButton" onClick={handleShowPopUp}>Add Task</button>
        </div>

        <div className='calenderDiv' style={{ height: '500px', marginTop: '20px',display: 'flex', justifyContent: 'center', alignItems: 'center', width: '95vw', maxWidth: '700px', background: '#ddd', borderRadius: '5px'}}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ width: '100%', color: '#000' }}
            dayPropGetter={dayPropGetter}
            defaultView="month"
            views={['month']}
            popup
          />
        </div>

        <ul className="taskList">
          {tasks.map(task => (
            <li key={task.id} className="taskItem">
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column'}}>
                <h3 className="taskTitle">{task.title}</h3>
                <p className="taskDescription">{task.description}</p>
                <p className="taskDetails">
                  <span>Added by: {task.firstName} {task.lastName}</span><br />
                </p>
              </div>
              {/* <button className="deleteButton" onClick={() => deleteTask(task.id)}>Delete</button> */}
            </li>
          ))}
        </ul>

      </div>

      {showPopUp && (
        <div className="popup-overlay">
          <RxCross1 className="popup-close-icon" onClick={handleClosePopUp} />
          <div className="popup-form">
            <form onSubmit={handleSubmit}>
              <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className="home-input" />
              <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className="home-input" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="home-input" />
              <input type="number" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="home-input" />
              <input type="text" name="taskName" placeholder="Task name" value={formData.taskName} onChange={handleChange} className="home-input" />
              <textarea name="taskDescription" placeholder="Task description" value={formData.taskDescription} onChange={handleChange} className="home-input" />
              <input type="date" name="taskDate" placeholder="Task date" value={formData.taskDate} onChange={handleChange} className="home-input" />
              <div id='messageSignup' className="popup-error"></div>
              <button id='buttonRegister' type="submit" className="popup-button">Add task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoList;
