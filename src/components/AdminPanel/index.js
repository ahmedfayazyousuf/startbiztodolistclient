import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../Firebase';
import Logo from '../1_MediaAssets/BrandImages/Logo.png';
import { signOut } from 'firebase/auth';
import { RxCross1 } from "react-icons/rx";

const AdminPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', taskName: '', taskDescription: '', taskDate: ''
  });
  
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

    return () => {
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
      .then(() => window.location.reload())
      .catch((error) => console.error('Error accepting task:', error));
  };

  const rejectTask = (id) => {
    axios.patch(`https://startbiztodolistserver.vercel.app/tasks/${id}/reject`)
      .then(() => window.location.reload())
      .catch((error) => console.error('Error rejecting task:', error));
  };

  const deleteTask = (id) => {
    axios.delete(`https://startbiztodolistserver.vercel.app/tasks/${id}`)
      .then(() => window.location.reload())
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

  const handleShowPopUp = () => {
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
    setIsEditing(false);
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', taskName: '', taskDescription: '', taskDate: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      editTask();
    } else {
      addTask();
    }
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

  const handleEdit = (task) => {
    setIsEditing(true);
    setEditTaskId(task.id);
    setFormData({
      firstName: task.firstName,
      lastName: task.lastName,
      email: task.email,
      phone: task.phone,
      taskName: task.title,
      taskDescription: task.description,
      taskDate: task.date
    });
    setShowPopUp(true);
  };

  const editTask = () => {
    axios.patch(`https://startbiztodolistserver.vercel.app/tasks/${editTaskId}`, {
      title: formData.taskName,
      description: formData.taskDescription,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      date: formData.taskDate
    })
      .then(() => {
        setShowPopUp(false);
        setIsEditing(false);
        setEditTaskId(null);
        setFormData({
          firstName: '', lastName: '', email: '', phone: '', taskName: '', taskDescription: '', taskDate: ''
        });
        window.location.reload();
      })
      .catch(error => console.error('Error editing task:', error));
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

        <div className="navbar">
          <img src={Logo} alt="Logo" className="logo" />
          <div className="navbar-buttons">
            <button className="navbar-button" onClick={() => navigate('/ToDoList')}>List</button>
            <button className="navbar-button" style={{ marginRight: '5px' }} onClick={handleSignOut}>Sign out</button>
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

        <div className="inputContainer">
          <button className="addButton" onClick={handleShowPopUp}>Add Task</button>
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
                <button className="admin-edit-btn" onClick={() => handleEdit(task)}>Edit</button>
                <button className="admin-delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

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
    </div>
  );
};

export default AdminPanel;
