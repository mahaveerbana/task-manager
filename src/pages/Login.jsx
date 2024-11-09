import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { post, setToken } from '../services/sendRequest';
import Loader from '../components/Loader';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // General error for server responses
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required.');
      return;
    }

    setLoading(true);

    const loginData = { email, password };

    try {
      const response = await post('/auth/login', loginData);

      if (response.status === 'SUCCESS') {
        const { token } = response;
        localStorage.setItem('accessToken', token);
        setToken(token)
        navigate('/task-manager');
      } else {
        // Check if response has a readable error message
        setError(response.errorMessage || 'Login failed. Please try again.');
      }
    } catch (error) {
      // Capture error from response, or set default error message
      setError(
        error?.response?.data?.errorMessage || 'An error occurred. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader />} {/* Loader component */}

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
            {emailError && <p className="error-message">{emailError}</p>} {/* Email validation error */}
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            {passwordError && <p className="error-message">{passwordError}</p>} {/* Password validation error */}
          </div>
          {error && <p className="error-message">{error}</p>} {/* Server error message */}
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
        <button className="google-login-button">
          Login with <p style={{ fontWeight: 'bold', display: 'inline' }}>Google</p>
        </button>
      </div>
    </div>
  );
}

export default Login;
