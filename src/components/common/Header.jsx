import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  
  // Check auth status whenever location changes or component mounts
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };
    
    // Check immediately on component mount or location change
    checkAuthStatus();
    
    // Add event listener for storage changes (for multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="alcatraz-header">
      <div id="content-header" className="alcatraz-header_content">
        <nav id="header-nav" className="header_topnav" role="navigation" aria-label="Primary navigation">
          <div className="alcatraz-header_logo">
            <Link className="alcatraz-header_link" to="/" aria-label="Prison Jobs Homepage">
              <div>
                <img className="attachment-full-size" src="/images/logo.png" alt="" />
                <h1>ALCATRAZ INC</h1>
              </div>
            </Link>
          </div>
          
          <button className="header-mobile" type="button" aria-controls="menu-top-header-menu" aria-expanded="false" hidden></button>
          
          <ul id="menu-top-menu" className="alcatraz-header_nav-list">
            <li id="menu-1" className="menu-1">
              <button className="header-dropdown" aria-expanded="false">
                <span>Roles at Alcatraz</span>
              </button>
              <ul className="submenu">
                <li><Link to="/jobs"><span>All Jobs</span></Link></li>
                <li><Link to="/jobs?category=Security"><span>Security</span></Link></li>
                <li><Link to="/jobs?category=Management"><span>Management</span></Link></li>
                <li><Link to="/jobs?category=Administration"><span>Administration</span></Link></li>
                <li><Link to="/jobs?category=Facilities"><span>Facilities</span></Link></li>
                <li><Link to="/jobs?category=Food Service"><span>Food Service</span></Link></li>
              </ul>
            </li>
            
            {user ? (
              // Show these links when user is logged in
              <>
                <li id="menu-2" className="menu-2">
                  <button className="questionnaire" aria-expanded="false">
                    <Link to="/questionnaire"><span>Questionnaire</span></Link>
                  </button>
                </li>
                
                {user.role === 'recruiter' || user.role === 'admin' ? (
                  <li id="menu-3" className="menu-3">
                    <button className="post-job" aria-expanded="false">
                      <Link to="/post-job"><span>Post Job</span></Link>
                    </button>
                  </li>
                ) : null}
                
                <li id="menu-4" className="menu-4">
                  <button className="profile" aria-expanded="false">
                    <Link to="/profile"><span>My Profile</span></Link>
                  </button>
                </li>
                
                <li id="menu-5" className="menu-5">
                  <button onClick={handleLogout} className="logout" aria-expanded="false">
                    <span>Logout ({user.name})</span>
                  </button>
                </li>
              </>
            ) : (
              // Show these links when user is not logged in
              <li id="menu-2" className="menu-2">
                <button className="login" aria-expanded="false">
                  <Link to="/login"><span>Login/Sign in</span></Link>
                </button>
              </li>
            )}
            
            <li id="menu-6" className="menu-6">
              <button className="about" aria-expanded="false">
                <Link to="/"><span>About Alcatraz Inc.</span></Link>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 