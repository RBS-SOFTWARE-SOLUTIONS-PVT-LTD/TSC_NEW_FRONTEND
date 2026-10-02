import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import KelaniyaLogo from '../components/common/KelaniyaLogo';
import { 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  BookOpen, 
  Building, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const RegisterPage = () => {
  const { signup, isAuthenticated, role } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    password: '',
    role: 'student', // 'student' or 'tutor'
    faculty: 'Faculty of Computing & Technology',
  });
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      const target = role === 'admin' ? '/admin/dashboard' : role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.name || !formData.email || !formData.password || !formData.faculty) {
      showError('Please fill out all required registration fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(formData);
      showSuccess(res.message || 'Account registered successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      showError(err.message || 'Registration failed. Please try again.');
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
        padding: '2rem 1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          margin: '0 auto',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
        }}
      >
        {/* Header Header Band */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
            color: '#FFFFFF',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <KelaniyaLogo size={40} lightMode={true} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginTop: '0.5rem' }}>
            Academic Center Registration
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#E8E4DD', marginTop: '4px' }}>
            Register as an undergraduate student or faculty peer tutor
          </p>
        </div>

        {/* Registration Form */}
        <div style={{ padding: '2.25rem 2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Role Radio Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
                Select Your Academic Role:
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid',
                    borderColor: formData.role === 'student' ? 'var(--primary)' : 'var(--border-color)',
                    backgroundColor: formData.role === 'student' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                    color: formData.role === 'student' ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <BookOpen size={24} />
                  <span>Student (Mentee)</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    Attend & log sessions
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'tutor' })}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid',
                    borderColor: formData.role === 'tutor' ? 'var(--secondary-dark)' : 'var(--border-color)',
                    backgroundColor: formData.role === 'tutor' ? 'var(--secondary-subtle)' : 'var(--bg-surface)',
                    color: formData.role === 'tutor' ? 'var(--secondary-dark)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <GraduationCap size={24} />
                  <span>Peer Tutor (Mentor)</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    Host & teach classes
                  </span>
                </button>
              </div>
            </div>

            {/* University ID */}
            <div className="form-group">
              <label className="form-label" htmlFor="userId">
                University Registration / Index Number:
              </label>
              <input
                id="userId"
                name="userId"
                type="text"
                required
                placeholder="e.g. SE/2021/042 or IT21088420"
                value={formData.userId}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Academic Name:
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Kasun Jayawardena"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                University Email Address:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="e.g. kasun-se21@kln.ac.lk"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Faculty Dropdown */}
            <div className="form-group">
              <label className="form-label" htmlFor="faculty">
                Faculty Affiliation:
              </label>
              <select
                id="faculty"
                name="faculty"
                required
                value={formData.faculty}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Faculty of Computing & Technology">Faculty of Computing & Technology (FCT)</option>
                <option value="Faculty of Science">Faculty of Science (FOS)</option>
                <option value="Faculty of Commerce & Management">Faculty of Commerce & Management (FCMS)</option>
                <option value="Faculty of Humanities">Faculty of Humanities (FOH)</option>
                <option value="Faculty of Social Sciences">Faculty of Social Sciences (FSS)</option>
                <option value="Faculty of Medicine">Faculty of Medicine (FOM)</option>
              </select>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
            >
              {loading ? 'Registering Account...' : 'Complete Academic Registration'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Switch to Login */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already registered with TSC?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
