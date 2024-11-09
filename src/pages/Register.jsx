import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import { post, setToken } from '../services/sendRequest';
import Loader from '../components/Loader';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages
    setError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate email format
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Validate password requirements (minimum length check)
    if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters long.');
      return;
    }

    // Validate matching passwords
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    // Check if all fields are filled
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true); // Start loading state

    const registerData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await post('/auth/register', registerData);

      if (response.status === 'SUCCESS') {
        localStorage.setItem('accessToken', response.token);
        setToken(response.token)
        navigate('/task-manager');
      } else {
        setError(response.errorMessage || 'Registration failed');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {loading && <Loader />} {/* Show loader when loading is true */}

      <h2 className="register-header">Register</h2>
      <div className="register-box">
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder='First Name'
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder='Last Name'
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Email'
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Password'
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <div className="form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder='Confirm Password'
            />
            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>
          Already have an account?{' '}
          <a style={{ color: "#0473f2" }} href="/login">Login</a>
        </p>
        <button className="google-login-button">
          Signup with Google
        </button>
      </div>
    </div>
  );
}

export default Register;
