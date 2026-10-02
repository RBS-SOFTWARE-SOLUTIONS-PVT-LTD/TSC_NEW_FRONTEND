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
  Trophy,
  Home,
  GraduationCap,
  ChevronRight
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

  // Determine role-based default portal path
  const getPortalPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'tutor') return '/tutor/dashboard';
    return '/student/dashboard';
  };

  return (
    <>
      {/* =========================================================================
          TOP STICKY NAVBAR
          ========================================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* University Heritage Gradient Band */}
        <div
          style={{
            height: '3.5px',
            background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 40%, var(--secondary) 80%, var(--secondary-light) 100%)',
          }}
        />

        <div
          style={{
            maxWidth: 'var(--container-max-w)',
            margin: '0 auto',
            padding: '0 1.25rem',
            height: 'var(--nav-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} onClick={() => setMobileMenuOpen(false)}>
            <KelaniyaLogo size={36} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="desktop-nav">
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
                  Leaderboard & Awards
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {!isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                    gap: '0.5rem',
                    padding: '0.35rem 0.65rem',
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
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }} className="desktop-nav">
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, lineHeight: 1.1 }}>
                      {user?.name || user?.email?.split('@')[0]}
                    </span>
                    <span
                      className={`badge ${
                        role === 'admin' ? 'badge-gold' : role === 'tutor' ? 'badge-primary' : 'badge-info'
                      }`}
                      style={{ fontSize: '0.62rem', padding: '1px 5px', marginTop: '2px', width: 'fit-content' }}
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
                          navigate(getPortalPath());
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
                padding: '0.45rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: mobileMenuOpen ? 'var(--primary-subtle)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={22} color="var(--primary)" /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* =========================================================================
            MOBILE SLIDE-DOWN DRAWER
            ========================================================================= */}
        {mobileMenuOpen && (
          <>
            <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
            <div className="mobile-drawer-sheet" style={{ padding: '1.25rem 1.25rem 1.75rem' }}>
              {/* User Header / Welcome Card */}
              {isAuthenticated ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    background: 'linear-gradient(135deg, rgba(122, 22, 49, 0.08) 0%, rgba(212, 167, 44, 0.1) 100%)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(122, 22, 49, 0.15)',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: role === 'admin' ? 'var(--secondary)' : 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.name || user?.email?.split('@')[0]}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.faculty || user?.email}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      role === 'admin' ? 'badge-gold' : role === 'tutor' ? 'badge-primary' : 'badge-info'
                    }`}
                  >
                    {role}
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Sparkles size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary)' }}>
                    University of Kelaniya Peer Tutoring
                  </span>
                </div>
              )}

              {/* Navigation Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-ghost"
                  style={{
                    justifyContent: 'flex-start',
                    padding: '0.75rem 1rem',
                    fontWeight: isActive('/') ? 700 : 500,
                    color: isActive('/') ? 'var(--primary)' : 'var(--text-primary)',
                    background: isActive('/') ? 'var(--primary-subtle)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Home size={18} /> Home
                </Link>

                <Link
                  to="/browse"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-ghost"
                  style={{
                    justifyContent: 'flex-start',
                    padding: '0.75rem 1rem',
                    fontWeight: isActive('/browse') ? 700 : 500,
                    color: isActive('/browse') ? 'var(--primary)' : 'var(--text-primary)',
                    background: isActive('/browse') ? 'var(--primary-subtle)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <BookOpen size={18} /> Explore Tutoring Sessions
                </Link>

                <Link
                  to="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-ghost"
                  style={{
                    justifyContent: 'flex-start',
                    padding: '0.75rem 1rem',
                    fontWeight: isActive('/leaderboard') ? 800 : 600,
                    color: 'var(--secondary-dark)',
                    background: isActive('/leaderboard') ? 'var(--secondary-subtle)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Trophy size={18} color="var(--secondary-dark)" /> Leaderboard & Annual Awards
                </Link>

                {/* Role Specific Sections */}
                {isAuthenticated && (
                  <>
                    <div style={{ height: '1px', background: 'var(--border-light)', margin: '0.5rem 0' }} />
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.25rem' }}>
                      {role} Controls
                    </div>

                    {role === 'student' && (
                      <>
                        <Link to="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                          <GraduationCap size={18} /> Student Hub
                        </Link>
                        <Link to="/student/attendance" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                          <CheckCircle size={18} /> My Attendance Logs
                        </Link>
                      </>
                    )}

                    {role === 'tutor' && (
                      <>
                        <Link to="/tutor/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                          <GraduationCap size={18} /> Tutor Command Center
                        </Link>
                        <Link to="/tutor/create-session" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ justifyContent: 'flex-start', margin: '0.25rem 0' }}>
                          <PlusCircle size={18} /> Create New Session
                        </Link>
                        <Link to="/tutor/my-sessions" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                          <Calendar size={18} /> My Teaching Schedule
                        </Link>
                      </>
                    )}

                    {role === 'admin' && (
                      <>
                        <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                          <ShieldCheck size={18} /> Faculty Admin Console
                        </Link>
                        <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                          <Users size={18} /> User Directory
                        </Link>
                        <Link to="/admin/sessions" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                          <ShieldCheck size={18} /> Session & Feedback Audit
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Bottom Actions in Drawer */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                {!isAuthenticated ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ width: '100%' }}>
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                      Register
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <LogOut size={16} /> Sign Out of System
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* CSS Display rules */}
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

      {/* =========================================================================
          NATIVE-FEELING MOBILE BOTTOM NAVIGATION BAR
          ========================================================================= */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Bottom Navigation">
        {/* Tab 1: Home / Dashboard */}
        <Link
          to={isAuthenticated ? getPortalPath() : '/'}
          className={`mobile-bottom-nav-item ${(isActive('/') || isActive(getPortalPath())) ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrapper">
            <Home size={20} />
          </div>
          <span>{isAuthenticated ? 'Dashboard' : 'Home'}</span>
        </Link>

        {/* Tab 2: Explore Sessions */}
        <Link
          to="/browse"
          className={`mobile-bottom-nav-item ${isActive('/browse') ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrapper">
            <BookOpen size={20} />
          </div>
          <span>Sessions</span>
        </Link>

        {/* Tab 3: Leaderboard & Awards */}
        <Link
          to="/leaderboard"
          className={`mobile-bottom-nav-item gold-active ${isActive('/leaderboard') ? 'active gold-active' : ''}`}
        >
          <div className="mobile-nav-icon-wrapper">
            <Trophy size={20} />
          </div>
          <span>Standings</span>
        </Link>

        {/* Tab 4: Role Quick Action / Portal / Sign In */}
        {!isAuthenticated ? (
          <Link
            to="/login"
            className={`mobile-bottom-nav-item ${isActive('/login') ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrapper">
              <UserIcon size={20} />
            </div>
            <span>Sign In</span>
          </Link>
        ) : role === 'tutor' ? (
          <Link
            to="/tutor/create-session"
            className={`mobile-bottom-nav-item ${isActive('/tutor/create-session') ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrapper">
              <PlusCircle size={20} />
            </div>
            <span>+ Create</span>
          </Link>
        ) : role === 'student' ? (
          <Link
            to="/student/attendance"
            className={`mobile-bottom-nav-item ${isActive('/student/attendance') ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrapper">
              <CheckCircle size={20} />
            </div>
            <span>Attendance</span>
          </Link>
        ) : (
          <Link
            to="/admin/sessions"
            className={`mobile-bottom-nav-item ${isActive('/admin/sessions') ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrapper">
              <ShieldCheck size={20} />
            </div>
            <span>Audit</span>
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navbar;

