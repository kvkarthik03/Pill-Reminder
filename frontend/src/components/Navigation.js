import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Navigation.css';

const Navigation = () => {
  const history = useHistory();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    const getUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const userData = await api.getProfile();
          setUserRole(userData.role);
          setUserName(userData.name);
        } catch (err) {
          console.error('Error fetching user info:', err);
          handleLogout();
        }
      }
    };
    getUserInfo();
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    setUserName('');
    history.push('/login');
  };

  const getProfilePath = () => {
    const role = localStorage.getItem('userRole');
    return role === 'doctor' ? '/doctor-profile' : '/patient-profile';
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">Pill Reminder</Link>
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <span className="welcome-text">Welcome, {userName}!</span>
            <Link to={getProfilePath()}>My Profile</Link>
            <Link to={userRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}>
              Dashboard
            </Link>
            {userRole === 'doctor' && (
              <>
                <Link to="/create-prescription">Create Prescription</Link>
                <Link to="/drug-interactions">Drug Interactions</Link>
              </>
            )}
            {userRole === 'patient' && (
              <Link to="/notifications">Notifications</Link>
            )}
            
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
