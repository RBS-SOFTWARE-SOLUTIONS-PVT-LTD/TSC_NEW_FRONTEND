import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  PlusCircle,
  Radio,
  Users,
  ShieldCheck,
  Star,
  Award,
  HelpCircle,
} from 'lucide-react';

export const Sidebar = () => {
  const { role, user } = useAuth();

  const getNavLinks = () => {
    switch (role) {
      case 'student':
        return [
          { to: '/student/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { to: '/student/sessions', label: 'Browse Sessions', icon: Calendar },
          { to: '/student/attendance', label: 'Attendance History', icon: CheckCircle2 },
        ];
      case 'tutor':
        return [
          { to: '/tutor/dashboard', label: 'Tutor Dashboard', icon: LayoutDashboard },
          { to: '/tutor/create-session', label: 'Create New Session', icon: PlusCircle },
          { to: '/tutor/my-sessions', label: 'My Scheduled Sessions', icon: Calendar },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Admin Command', icon: LayoutDashboard },
          { to: '/admin/users', label: 'User Directory', icon: Users },
          { to: '/admin/sessions', label: 'Session Audits', icon: ShieldCheck },
        ];
      default:
        return [];
    }
  };

  const links = getNavLinks();

  return (
    <aside className="dashboard-sidebar">
      {/* User Context Banner */}
      <div
        style={{
          padding: '0.875rem 1rem',
          background: 'var(--bg-main)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
          Active Workspace
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)', marginTop: '2px' }}>
          {role === 'admin' ? 'University Administration' : role === 'tutor' ? 'Verified Tutor Center' : 'Student Portal'}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {user?.faculty || 'University of Kelaniya'}
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                borderLeft: isActive ? '3.5px solid var(--primary)' : '3.5px solid transparent',
                transition: 'all var(--transition-fast)',
              })}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Academic Highlight Badge */}
      <div
        style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(122,22,49,0.05) 0%, rgba(212,167,44,0.12) 100%)',
          border: '1px solid rgba(212,167,44,0.3)',
          borderRadius: 'var(--radius-lg)',
          marginTop: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Award size={16} color="var(--secondary-dark)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary-dark)', textTransform: 'uppercase' }}>
            Academic Standard
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
          UOK Tutoring Support Center ensures verified hours and peer-reviewed excellence.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
