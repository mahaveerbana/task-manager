import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/login');
  };

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
