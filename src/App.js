import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import ToDoList from './components/ToDoList';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ToDoList />} />
      </Routes>
    </Router>
  );
};

export default App;
