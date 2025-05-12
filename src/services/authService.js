import api from './api';

// Create axios instance for auth API calls
const authApi = api.createAxiosInstance('auth');

// Custom event for auth state changes
const AUTH_STATE_CHANGED = 'auth_state_changed';

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await authApi.post('/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Dispatch custom event for auth state change
        window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
      }
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await authApi.post('/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Dispatch custom event for auth state change
        window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
      }
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch custom event for auth state change
    window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      // If there's an error parsing the user data, clear it
      localStorage.removeItem('user');
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user from server (validates token)
  validateToken: async () => {
    try {
      // Only make the API call if we have a token
      if (!authService.isAuthenticated()) {
        return null;
      }
      
      const response = await authApi.get('/me');
      if (response.data && response.data.user) {
        // Update local storage with fresh user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch (error) {
      // Clear user data on error
      authService.logout();
      return null;
    }
  },
  
  // Listen for auth state changes
  onAuthStateChanged: (callback) => {
    const handler = () => {
      callback(authService.getCurrentUser());
    };
    
    window.addEventListener(AUTH_STATE_CHANGED, handler);
    
    // Return a function to remove the listener
    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED, handler);
    };
  }
};

export default authService; 