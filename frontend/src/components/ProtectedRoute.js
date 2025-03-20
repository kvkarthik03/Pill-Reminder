import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, roleRequired, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  const getDashboardPath = () => {
    return userRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
  };

  return (
    <Route
      {...rest}
      render={props => {
        // Not logged in - redirect to login
        if (!isAuthenticated) {
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
        }

        // Role required but wrong role - redirect to appropriate dashboard
        if (roleRequired && roleRequired !== userRole) {
          return <Redirect to={getDashboardPath()} />;
        }

        // Authorized - render component
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
