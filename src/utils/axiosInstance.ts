
import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com', // Using Vite's environment variable syntax
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add an interceptor to include authentication token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
