// frontend/src/api/axiosInstance.js
import axios from 'axios';
import { getCookie, deleteCookie } from '../utils/cookies';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookie
    const token = getCookie('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear cookies and redirect to login
        deleteCookie('authToken');
        deleteCookie('user');
        
        // Only redirect if not already on login/register page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
      
      // Return error message from server
      return Promise.reject(data.message || 'Something went wrong');
    } else if (error.request) {
      // Request made but no response
      return Promise.reject('Network error. Please check your connection.');
    } else {
      // Something else happened
      return Promise.reject(error.message || 'An error occurred');
    }
  }
);

export default axiosInstance;