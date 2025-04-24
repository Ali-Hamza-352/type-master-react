
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
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`, 
      config.data ? `with data: ${JSON.stringify(config.data)}` : '');
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  async (error) => {
    console.error("Response error:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    
    if (error.response && error.response.status === 401) {
      // Clear tokens on authentication error
      console.warn("Unauthorized access detected, clearing tokens");
      clearTokens();
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Token management functions
export const setToken = (token: string) => {
  try {
    const decodedToken: any = jwtDecode(token);
    console.log("Decoded token:", decodedToken);
    
    // Set expiration to 7 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    // Create cookie string
    const cookieValue = `authToken=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    document.cookie = cookieValue;
    console.log("Token set successfully, expires:", expiryDate.toUTCString());
  } catch (error) {
    console.error("Failed to set token:", error);
    throw error;
  }
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
          console.warn("Token expired, clearing");
          clearTokens(); // Token expired
          return null;
        }
        
        return token;
      } catch (error) {
        console.error("Invalid token found in cookie, clearing");
        clearTokens();
        return null;
      }
    }
  }
  return null;
};

export const clearTokens = () => {
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  console.log("Tokens cleared");
};

export default axiosInstance;
