import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      // If already logged in, redirect to jobs page or the requested redirect
      const params = new URLSearchParams(location.search);
      const redirectTo = params.get('redirect') || '/jobs';
      navigate(redirectTo);
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await authService.login(formData);
      // Verify we have a valid response
      if (response && response.token) {
        // Get redirect path from URL parameters if present
        const params = new URLSearchParams(location.search);
        const redirectTo = params.get('redirect') || '/jobs';
        
        // Force a page reload to ensure all components update with new auth state
        window.location.href = redirectTo;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="apply-section">
        <h2>Login to Alcatraz Jobs</h2>
      </div>
      
      <div className="cv-section">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              required 
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <p className="form-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login; 