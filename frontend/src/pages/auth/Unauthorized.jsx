import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="container">
      <div className="unauthorized-section">
        <h2>Access Denied</h2>
        <div className="error-message">
          <p>You don't have permission to access this page.</p>
          <p>Your current role is: <strong>{currentUser?.role || 'Unknown'}</strong></p>
        </div>
        <div className="action-buttons">
          <Link to="/" className="button">Return to Home</Link>
          <Link to="/jobs" className="button">Browse Jobs</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 