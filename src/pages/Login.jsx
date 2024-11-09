import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { post, setToken } from '../services/sendRequest';
import Loader from '../components/Loader';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  const handleGoogleResponse = async (response) => {
    const token = response.credential;
    setLoading(true)
    try {
      const res = await post('/auth/google', { token });
      if (res.status === 'SUCCESS') {
        localStorage.setItem('accessToken', res.token);
        setToken(res.token);
        navigate('/task-manager');
      } else {
        setError(res.errorMessage || 'Google login failed. Please try again.');
      }
      setLoading(false)
    } catch (error) {
      setError('An error occurred. Please try again later.');
      setLoading(false)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setPasswordError('Password is required.');
      return;
    }
    setLoading(true);
    try {
      const response = await post('/auth/login', { email, password });
      if (response.status === 'SUCCESS') {
        localStorage.setItem('accessToken', response.token);
        setToken(response.token);
        navigate('/task-manager');
      } else {
        setError(response.errorMessage || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader />}
      <p className="login-header">Login</p>
      <div className="login-box">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            Login
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <a style={{ color: '#0473f2' }} href="/register">
            Signup
          </a>
        </p>
        <div id="google-login-button" style={{ marginTop: '1em' }}></div>
      </div>
    </div>
  );
}

export default Login;
