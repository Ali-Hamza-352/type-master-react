
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API URL on port 5000
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add an interceptor to include authentication token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Clear tokens on authentication error
      clearTokens();
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Token management functions
export const setToken = (token: string) => {
  const decodedToken: any = jwtDecode(token);
  
  // Set expiration to 7 days from now
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  
  // Create cookie string
  const cookieValue = `authToken=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
  document.cookie = cookieValue;
};

export const getToken = (): string | null => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('authToken=')) {
      const token = cookie.substring('authToken='.length);
      
      // Validate token isn't expired
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp < currentTime) {
          clearTokens(); // Token expired
          return null;
        }
        
        return token;
      } catch (error) {
        clearTokens();
        return null;
      }
    }
  }
  return null;
};

export const clearTokens = () => {
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export default axiosInstance;
