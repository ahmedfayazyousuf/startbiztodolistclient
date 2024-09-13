import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import CursorTracker from './components/1_MediaAssets/Styles/CursorTracker';
import ToDoList from './components/ToDoList';

function App() {
  return (
    <Router>
      <CursorTracker />
      <Routes>
        <Route exact path="/" element={<ToDoList />} />
      </Routes>
    </Router>
  );
};

export default App;
