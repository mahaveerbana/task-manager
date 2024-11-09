import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  // Handle Login, Register, and Logout actions
  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/login');
  };

  // Check if the user is logged in and redirect accordingly
  useEffect(() => {
    if (accessToken) {
      // If logged in, redirect to task-manager from login or register route
      if (location.pathname === '/login' || location.pathname === '/register') {
        navigate('/task-manager');
      }
    } else {
      // If not logged in, redirect to login from task-manager route
      if (location.pathname === '/task-manager') {
        navigate('/login');
      }
    }
  }, [accessToken, location, navigate]);

  const getButtonClass = (path) => {
    return location.pathname === path ? 'header-button-selected' : 'header-button';
  };

  return (
    <header className="header">
      <h1 className="header-title">Task Manager</h1>
      <nav className="header-nav">
        {!accessToken ? (
          <>
            <button onClick={handleLogin} className={getButtonClass('/login')}>Login</button>
            <button onClick={handleRegister} className={getButtonClass('/register')}>Register</button>
          </>
        ) : (
          <button onClick={handleLogout} className="header-button-logout">Log Out</button>
        )}
      </nav>
    </header>
  );
}

export default Header;
