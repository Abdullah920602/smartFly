import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/apiService';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    // Redirect based on user role if not authorized
    if (currentUser?.role === 'traveler') {
      return <Navigate to="/home" replace />;
    } else if (currentUser?.role === 'airline') {
      return <Navigate to="/airline-dashboard" replace />;
    } else if (currentUser?.role === 'admin') {
      return <Navigate to="/data-manager" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;
