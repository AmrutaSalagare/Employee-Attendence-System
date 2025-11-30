import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requireManager = false }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireManager && user?.role !== 'manager') {
    return <Navigate to="/employee/dashboard" />;
  }

  if (!requireManager && user?.role === 'manager') {
    return <Navigate to="/manager/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
