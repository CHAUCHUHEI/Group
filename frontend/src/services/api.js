import axios from 'axios';

// Base API URL
const BASE_URL = 'http://localhost:5001/api';

// Create a base axios instance with common configuration
const createAxiosInstance = (path, contentType = 'application/json') => {
  const instance = axios.create({
    baseURL: `${BASE_URL}/${path}`,
    headers: {
      'Content-Type': contentType
    }
  });

  // Add request interceptor to include token if available
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle specific error cases
      if (error.response) {
        // Server responded with an error status
        const { status } = error.response;
        
        // Handle authentication errors
        if (status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // If you have global state management, you can update auth state here
        }
        
        // Handle forbidden errors
        if (status === 403) {
          // User doesn't have permission
        }
      } else if (error.request) {
        // Request was made but no response was received
        console.error('Network error, server may be down:', error.request);
      } else {
        // Request setup error
        console.error('Error setting up request:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Helper method to handle HTTP errors
const handleApiError = (error) => {
  const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
  console.error('API Error:', errorMessage);
  return Promise.reject(errorMessage);
};

// Export utility methods
export const api = {
  createAxiosInstance,
  handleApiError,
  BASE_URL
};

export default api; 