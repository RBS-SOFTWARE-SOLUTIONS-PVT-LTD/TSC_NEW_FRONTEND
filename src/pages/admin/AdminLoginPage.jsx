import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import KelaniyaLogo from '../../components/common/KelaniyaLogo';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  AlertTriangle,
  Building,
  KeyRound
} from 'lucide-react';

export const AdminLoginPage = () => {
  const { loginAdmin, isAuthenticated, role } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please enter administrative email and password.');
      return;
    }

    setLoading(true);
    try {
      const adminUser = await loginAdmin(email, password);
      showSuccess(`Welcome back, ${adminUser.name || 'Administrator'}!`);
      navigate('/admin/dashboard');
    } catch (err) {
      showError(err.message || 'Administrative authentication failed. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - var(--nav-height))',
        backgroundColor: '#0F0307',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        backgroundImage: `radial-gradient(circle at 50% 20%, rgba(122, 22, 49, 0.35) 0%, transparent 60%),
                          radial-gradient(circle at 80% 80%, rgba(212, 167, 44, 0.15) 0%, transparent 50%)`,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(25, 6, 12, 0.88)',
          border: '1px solid rgba(212, 167, 44, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2.25rem',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 30px rgba(122, 22, 49, 0.3)',
          backdropFilter: 'blur(20px)',
          color: '#FAF9F6',
        }}
      >
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <KelaniyaLogo size={52} lightMode={true} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(212, 167, 44, 0.18)',
              color: '#FDE68A',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
              border: '1px solid rgba(212, 167, 44, 0.35)',
            }}
          >
            <ShieldCheck size={14} color="#FDE68A" />
            Restricted Staff Access
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
            Faculty Administration Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(250, 249, 246, 0.7)', marginTop: '0.4rem' }}>
            University of Kelaniya • Tutoring Support Center (TSC)
          </p>
        </div>

        {/* Security Warning Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(220, 38, 38, 0.12)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            marginBottom: '1.75rem',
            fontSize: '0.8rem',
            color: '#FCA5A5',
            lineHeight: 1.4,
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#EF4444' }} />
          <div>
            <strong>Authorized Personnel Only:</strong> All administrative sign-in attempts, session audits, and user modifications are strictly logged.
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="admin-email" style={{ color: 'rgba(250, 249, 246, 0.9)' }}>
              Administrative Email:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                required
                placeholder="admin@kln.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '2.5rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                }}
              />
              <Mail
                size={18}
                color="rgba(250, 249, 246, 0.5)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="admin-password" style={{ color: 'rgba(250, 249, 246, 0.9)' }}>
              Security Password:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '2.5rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                }}
              />
              <Lock
                size={18}
                color="rgba(250, 249, 246, 0.5)"
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
                  color: 'rgba(250, 249, 246, 0.5)',
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
            className="btn btn-secondary"
            style={{
              width: '100%',
              padding: '0.85rem',
              marginTop: '0.5rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-gold)',
            }}
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate & Enter Admin Console'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Back to User Portal */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.825rem',
            color: 'rgba(250, 249, 246, 0.65)',
          }}
        >
          Undergraduate student or peer tutor?{' '}
          <Link to="/login" style={{ color: 'var(--secondary-light)', fontWeight: 700 }}>
            Return to Student/Tutor Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
