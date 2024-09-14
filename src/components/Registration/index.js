import React, { useState, useEffect } from 'react';
import Logo from '../1_MediaAssets/BrandImages/Logo.png';
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../Firebase';

const Home = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailSignup, setEmailSignup] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [confirmPasswordSignup, setConfirmPasswordSignup] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        navigate('/ToDoList');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleShowPopUp = () => setShowPopUp(true);
  const handleClosePopUp = () => setShowPopUp(false);

  const handleTabSwitch = (tab) => setActiveTab(tab);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
        setError('All fields are required.');
        return;
      }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/ToDoList');
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!name || !emailSignup || !phone || !state || !passwordSignup || !confirmPasswordSignup) {
      setError('All fields are required.');
      return;
    }
    if (passwordSignup !== confirmPasswordSignup) {
      setError('Passwords do not match.');
      return;
    }
    if (passwordSignup.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, emailSignup, passwordSignup);
      handleTabSwitch('login');
    } catch (err) {
      setError(`Registration failed: ${err.message}`);
    }
  };


  return (
    <div className="maincontainer">
      <div className="container">
        <video autoPlay muted loop className="home-background-video">
          <source src='/Videos/BGVideo.mp4' type="video/mp4" />
          Your browser does not support the video tag.
        </video>
  
        <div className="navbar">
          <img src={Logo} alt="Logo" className="logo" />
          <h2 className="heading">Task Manager</h2>
        </div>

        <button onClick={handleShowPopUp} className="addButton" style={{ width: '90%', maxWidth: '700px'}}>Enter Task System</button>
      </div>
  
      {showPopUp && (
        <div className="home-overlay">
          <RxCross1 className="home-close-icon" onClick={handleClosePopUp} />
          <div className="home-form">
            <div className="home-tab-container">
              <button
                className={activeTab === 'login' ? 'home-active-tab' : 'home-tab'}
                onClick={() => handleTabSwitch('login')}
                style={{width: '50%'}}
              >
                Sign in
              </button>
              <button
                className={activeTab === 'register' ? 'home-active-tab' : 'home-tab'}
                onClick={() => handleTabSwitch('register')}
                style={{width: '50%'}}
              >
                Register
              </button>
            </div>
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="home-input" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="home-input" />
                <div className="home-error">{error}</div>
                <button type="submit" className="home-button-submit">Sign in</button>
              </form>
            )}
            {activeTab === 'register' && (
              <form onSubmit={handleSignupSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="home-input" />
                <input type="email" placeholder="Email" value={emailSignup} onChange={(e) => setEmailSignup(e.target.value)} className="home-input" />
                <input type="number" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="home-input" />
                <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="home-input" />
                <input type="password" placeholder="Password" value={passwordSignup} onChange={(e) => setPasswordSignup(e.target.value)} className="home-input" />
                <input type="password" placeholder="Confirm Password" value={confirmPasswordSignup} onChange={(e) => setConfirmPasswordSignup(e.target.value)} className="home-input" />
                <div className="home-error">{error}</div>
                <button type="submit" className="home-button-submit">Sign up</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
};



export default Home;
