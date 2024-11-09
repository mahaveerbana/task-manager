import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import TaskManager from './pages/TaskManager';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
      <Router>
        <Header />
        <main>
          <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/task-manager" element={<TaskManager />} />
          </Routes>
        </main>
      </Router>
  );
}

export default App;