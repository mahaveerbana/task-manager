import axios from 'axios';

// Set up base API URL and access token
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const token = localStorage.getItem('accessToken');

// Create Axios instance with default headers
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

// Interceptor to handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem('accessToken');

      // Optionally, redirect to login or display logout message
      window.location.href = '/login'; // Redirect to login page
      console.error('Session expired. Logging out.');

      return Promise.reject(new Error('Unauthorized - Logging out'));
    }

    return Promise.reject(error);
  }
);

// GET request
const get = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('API GET error: ', error);
    throw error;
  }
};

// POST request
const post = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error('API POST error: ', error);
    throw error;
  }
};

// PUT request
const put = async (url, data) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    console.error('API PUT error: ', error);
    throw error;
  }
};

// DELETE request
const remove = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error('API DELETE error: ', error);
    throw error;
  }
};

export const setToken = (newToken) => {
  api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
};

export { get, post, put, remove };
