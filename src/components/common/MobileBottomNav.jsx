import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  Trophy,
  PlusCircle,
  Users,
  ShieldCheck,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/student/sessions', label: 'Browse', icon: Calendar },
          { to: '/student/attendance', label: 'Attendance', icon: CheckCircle2 },
          { to: '/leaderboard', label: 'Rankings', icon: Trophy },
        ];
      case 'tutor':
        return [
          { to: '/tutor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/tutor/create-session', label: 'Create', icon: PlusCircle, highlight: true },
          { to: '/tutor/my-sessions', label: 'Classes', icon: Calendar },
          { to: '/leaderboard', label: 'Rankings', icon: Trophy },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/admin/users', label: 'Users', icon: Users },
          { to: '/admin/sessions', label: 'Audits', icon: ShieldCheck },
          { to: '/leaderboard', label: 'Rankings', icon: Trophy },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`mobile-nav-item ${isActive ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
            >
              <div className="mobile-nav-icon-wrap">
                <Icon size={20} className="mobile-nav-icon" />
                {isActive && <span className="mobile-nav-active-pill" />}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
