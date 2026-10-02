import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import KelaniyaLogo from './KelaniyaLogo';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  PlusCircle, 
  Radio, 
  Users, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Sparkles,
  Trophy
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Top University Heritage Band */}
      <div
        style={{
          height: '4px',
          background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 40%, var(--secondary) 80%, var(--secondary-light) 100%)',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--container-max-w)',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
          <KelaniyaLogo size={38} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
          {!isAuthenticated && (
            <>
              <Link
                to="/"
                className={`btn btn-ghost ${isActive('/') ? 'btn-outline' : ''}`}
                style={isActive('/') ? { color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className={`btn btn-ghost ${isActive('/browse') ? 'btn-outline' : ''}`}
                style={isActive('/browse') ? { color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <BookOpen size={16} />
                Explore Sessions
              </Link>
              <Link
                to="/leaderboard"
                className={`btn btn-ghost ${isActive('/leaderboard') ? 'btn-outline' : ''}`}
                style={isActive('/leaderboard') ? { color: 'var(--secondary-dark)', fontWeight: 700 } : {}}
              >
                <Trophy size={16} color="var(--secondary-dark)" />
                Leaderboard & Awards
              </Link>
            </>
          )}

          {/* Student Links */}
          {isAuthenticated && role === 'student' && (
            <>
              <Link
                to="/student/dashboard"
                className="btn btn-ghost"
                style={isActive('/student/dashboard') ? { color: 'var(--primary)', background: 'var(--primary-subtle)', fontWeight: 700 } : {}}
              >
                Dashboard
              </Link>
              <Link
                to="/student/sessions"
                className="btn btn-ghost"
                style={isActive('/student/sessions') ? { color: 'var(--primary)', background: 'var(--primary-subtle)', fontWeight: 700 } : {}}
              >
                <Calendar size={16} />
                Browse Sessions
              </Link>
              <Link
                to="/student/attendance"
                className="btn btn-ghost"
                style={isActive('/student/attendance') ? { color: 'var(--primary)', background: 'var(--primary-subtle)', fontWeight: 700 } : {}}
              >
                <CheckCircle size={16} />
                My Attendance
              </Link>
              <Link
                to="/leaderboard"
                className="btn btn-ghost"
                style={isActive('/leaderboard') ? { color: 'var(--secondary-dark)', background: 'var(--secondary-subtle)', fontWeight: 700 } : {}}
              >
                <Trophy size={16} color="var(--secondary-dark)" />
                Leaderboard
              </Link>
            </>
          )}

          {/* Tutor Links */}
          {isAuthenticated && role === 'tutor' && (
            <>
              <Link
                to="/tutor/dashboard"
                className="btn btn-ghost"
                style={isActive('/tutor/dashboard') ? { color: 'var(--primary)', background: 'var(--primary-subtle)', fontWeight: 700 } : {}}
              >
                Dashboard
              </Link>
              <Link
                to="/tutor/create-session"
                className="btn btn-primary btn-sm"
              >
                <PlusCircle size={16} />
                New Session
              </Link>
              <Link
                to="/tutor/my-sessions"
                className="btn btn-ghost"
                style={isActive('/tutor/my-sessions') ? { color: 'var(--primary)', background: 'var(--primary-subtle)', fontWeight: 700 } : {}}
              >
                <Calendar size={16} />
                My Schedule
              </Link>
              <Link
                to="/leaderboard"
                className="btn btn-ghost"
                style={isActive('/leaderboard') ? { color: 'var(--secondary-dark)', background: 'var(--secondary-subtle)', fontWeight: 700 } : {}}
              >
                <Trophy size={16} color="var(--secondary-dark)" />
                Leaderboard & Awards
              </Link>
            </>
          )}

          {/* Admin Links */}
          {isAuthenticated && role === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                className="btn btn-ghost"
                style={isActive('/admin/dashboard') ? { color: 'var(--primary)', background: 'var(--primary-subtle)', fontWeight: 700 } : {}}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="btn btn-ghost"
                style={isActive('/admin/users') ? { color: 'var(--primary)', background: 'var(--primary-subtle)', fontWeight: 700 } : {}}
              >
                <Users size={16} />
                User Directory
              </Link>
              <Link
                to="/admin/sessions"
                className="btn btn-ghost"
                style={isActive('/admin/sessions') ? { color: 'var(--primary)', background: 'var(--primary-subtle)', fontWeight: 700 } : {}}
              >
                <ShieldCheck size={16} />
                Audit Logs
              </Link>
              <Link
                to="/leaderboard"
                className="btn btn-ghost"
                style={isActive('/leaderboard') ? { color: 'var(--secondary-dark)', background: 'var(--secondary-subtle)', fontWeight: 700 } : {}}
              >
                <Trophy size={16} color="var(--secondary-dark)" />
                Leaderboard
              </Link>
            </>
          )}
        </nav>

        {/* Right CTA / User Profile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: role === 'admin' ? 'var(--secondary)' : 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.1 }}>
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                  <span
                    className={`badge ${
                      role === 'admin' ? 'badge-gold' : role === 'tutor' ? 'badge-primary' : 'badge-info'
                    }`}
                    style={{ fontSize: '0.65rem', padding: '1px 5px', marginTop: '2px', width: 'fit-content' }}
                  >
                    {role}
                  </span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.75rem',
                    zIndex: 200,
                    animation: 'scaleUp 180ms ease-out',
                  }}
                >
                  <div style={{ padding: '0.5rem 0.5rem 0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name || 'Academic User'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
                    {user?.faculty && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--primary)', marginTop: '4px', fontWeight: 600 }}>
                        {user.faculty}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate(role === 'admin' ? '/admin/dashboard' : role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard');
                      }}
                      className="btn btn-ghost btn-sm"
                      style={{ justifyContent: 'flex-start', width: '100%' }}
                    >
                      <UserIcon size={15} />
                      Portal Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="btn btn-ghost btn-sm"
                      style={{ justifyContent: 'flex-start', width: '100%', color: 'var(--error)' }}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {!isAuthenticated ? (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                Home
              </Link>
              <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                Explore Sessions
              </Link>
              <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--secondary-dark)', fontWeight: 700 }}>
                <Trophy size={16} color="var(--secondary-dark)" /> Leaderboard & Awards
              </Link>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
                  Register
                </Link>
              </div>
            </>
          ) : (
            <>
              {role === 'student' && (
                <>
                  <Link to="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    Dashboard
                  </Link>
                  <Link to="/student/sessions" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    Browse Sessions
                  </Link>
                  <Link to="/student/attendance" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    My Attendance
                  </Link>
                  <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--secondary-dark)' }}>
                    <Trophy size={16} color="var(--secondary-dark)" /> Leaderboard
                  </Link>
                </>
              )}
              {role === 'tutor' && (
                <>
                  <Link to="/tutor/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    Dashboard
                  </Link>
                  <Link to="/tutor/create-session" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                    <PlusCircle size={16} /> Create Session
                  </Link>
                  <Link to="/tutor/my-sessions" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    My Sessions
                  </Link>
                  <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--secondary-dark)' }}>
                    <Trophy size={16} color="var(--secondary-dark)" /> Leaderboard & Awards
                  </Link>
                </>
              )}
              {role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    Dashboard
                  </Link>
                  <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    User Directory
                  </Link>
                  <Link to="/admin/sessions" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    Audit Logs
                  </Link>
                  <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--secondary-dark)' }}>
                    <Trophy size={16} color="var(--secondary-dark)" /> Leaderboard
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          )}
        </div>
      )}

      {/* Embedded CSS for responsive nav display */}
      <style>{`
        @media (max-width: 868px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 869px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
