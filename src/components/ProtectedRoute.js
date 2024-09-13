import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element }) {
  const isAuthenticated = localStorage.getItem('secretCode') === 'true';

  return isAuthenticated ? element : <Navigate to="/" />;
}

export default ProtectedRoute;