import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      setLoading(true);
      try {
        // Get user from localStorage
        const user = authService.getCurrentUser();
        
        if (user) {
          // Validate token with server if we have a user
          const validUser = await authService.validateToken();
          setCurrentUser(validUser || null);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Initialize immediately
    initAuth();

    // Setup subscription to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Auth context value
  const value = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    login: authService.login,
    logout: authService.logout,
    register: authService.register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 