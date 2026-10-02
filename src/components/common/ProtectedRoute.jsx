import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Verifying academic credentials...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to proper role dashboard
    const fallbackPath = role === 'admin' ? '/admin/dashboard' : role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-body">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;


