import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple auth check using localStorage (token or flag)
export default function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/book" replace />;
  }
  return children;
}
