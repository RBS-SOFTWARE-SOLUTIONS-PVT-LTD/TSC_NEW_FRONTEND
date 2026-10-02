import React from 'react';
import { Link } from 'react-router-dom';
import KelaniyaLogo from '../components/common/KelaniyaLogo';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        padding: '2rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <KelaniyaLogo size={50} />
      </div>
      <div
        style={{
          fontSize: '5rem',
          fontWeight: 800,
          color: 'var(--primary)',
          lineHeight: 1,
          fontFamily: 'var(--font-display)',
        }}
      >
        404
      </div>
      <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: '0.75rem 0 0.5rem' }}>
        Academic Page Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', marginBottom: '2rem' }}>
        The requested resource or tutoring room is not available. Please check the URL or return to the main portal.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Return to Home
        </Link>
        <Link to="/browse" className="btn btn-outline">
          Browse Sessions
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
