import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import KelaniyaLogo from '../components/common/KelaniyaLogo';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const LoginPage = () => {
  const { login, isAuthenticated, role } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      const target = role === 'admin' ? '/admin/dashboard' : role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      showSuccess(`Welcome, ${loggedUser.name}!`);
      if (loggedUser.role === 'tutor') {
        navigate('/tutor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      showError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - var(--nav-height))',
        backgroundColor: 'var(--bg-main)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          width: '100%',
          maxWidth: '1100px',
          margin: '2rem auto',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
        }}
      >
        {/* Left Side: Academic Heritage Column */}
        <div
          style={{
            background: 'linear-gradient(145deg, #5A1024 0%, #7A1631 60%, #350510 100%)',
            color: '#FAF9F6',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            <KelaniyaLogo size={44} lightMode={true} />

            <div style={{ marginTop: '2.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(212, 167, 44, 0.2)',
                  color: 'var(--secondary-light)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  border: '1px solid rgba(212, 167, 44, 0.4)',
                }}
              >
                <Sparkles size={14} />
                Official University Portal
              </div>

              <h2 style={{ color: '#FFFFFF', fontSize: '1.85rem', lineHeight: 1.25, marginBottom: '1rem' }}>
                Tutoring Support Center (TSC)
              </h2>

              <p style={{ color: '#D5D0C6', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Sign in with your university student or peer tutor credentials to join live classes, track attendance, and submit session reviews.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#FAF9F6' }}>
                  <ShieldCheck size={18} color="var(--secondary-light)" />
                  <span>Verified Single Sign-On / JWT Security</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#FAF9F6' }}>
                  <UserCheck size={18} color="var(--secondary-light)" />
                  <span>Real-time OTP & QR Code Check-in</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#FAF9F6' }}>
                  <GraduationCap size={18} color="var(--secondary-light)" />
                  <span>Faculty-Accredited Peer Mentorship</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.825rem',
              color: 'rgba(250, 249, 246, 0.75)',
            }}
          >
            Need assistance or new account registration? Contact your department coordinator or the Faculty of Computing & Technology Helpdesk.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div style={{ padding: '3.5rem 2.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              Student & Peer Tutor Sign In
            </span>
            <h3 style={{ fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              Sign In to Your Account
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Enter your university email address and secure password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                Academic Email Address:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder="e.g. yourname@kln.ac.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password-input">
                  Password:
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <Lock
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.75rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Switch to Register */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an academic account yet?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary)' }}>
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
