import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Logo from '../1_MediaAssets/BrandImages/Logo.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

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
        <h2>Welcome to the Dashboard</h2>
        <p>You can access the Admin Panel at <a href="/admin" target="_blank" rel="noopener noreferrer">/admin</a></p>
      </div>
    </div>
  );
};

export default Dashboard;
