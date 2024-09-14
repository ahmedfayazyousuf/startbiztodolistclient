import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import CursorTracker from './components/1_MediaAssets/Styles/CursorTracker';
import Home from './components/Registration';
import ToDoList from './components/ToDoList';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <CursorTracker />
      <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/ToDoList" element={<ToDoList />} />
      <Route exact path="/AdminPanel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
