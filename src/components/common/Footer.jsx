import React from 'react';
import { Link } from 'react-router-dom';
import KelaniyaLogo from './KelaniyaLogo';
import { MapPin, Phone, Mail, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1E1E24',
        color: '#FAF9F6',
        borderTop: '4px solid var(--primary)',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max-w)',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand & University Info */}
          <div>
            <KelaniyaLogo size={36} lightMode={true} />
            <p
              style={{
                color: '#C5C1BA',
                fontSize: '0.875rem',
                marginTop: '1.25rem',
                lineHeight: 1.6,
              }}
            >
              The Tutoring Support Center (TSC) at the University of Kelaniya empowers undergraduate students through peer tutoring, verified academic mentorship, and continuous performance feedback.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--secondary-light)', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Official Academic Peer Support Platform</span>
            </div>
          </div>

          {/* Quick Access Portals */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              Academic Portals
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/browse" style={{ color: '#C5C1BA', transition: 'color 0.2s' }}>
                  Explore Sessions
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" style={{ color: '#C5C1BA', transition: 'color 0.2s' }}>
                  Tutor Leaderboard & Awards
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#C5C1BA', transition: 'color 0.2s' }}>
                  Student & Tutor Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#C5C1BA', transition: 'color 0.2s' }}>
                  Join as Peer Tutor / Student
                </Link>
              </li>
            </ul>
          </div>

          {/* Participating Faculties */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              Participating Faculties
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#C5C1BA' }}>
              <li>Faculty of Science</li>
              <li>Faculty of Computing & Technology</li>
              <li>Faculty of Commerce & Management</li>
              <li>Faculty of Humanities & Social Sciences</li>
              <li>Faculty of Medicine</li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              Center Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#C5C1BA' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--secondary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>University of Kelaniya, Kandy Road, Dalugama, Kelaniya 11600, Sri Lanka</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={18} color="var(--secondary-light)" style={{ flexShrink: 0 }} />
                <span>tsc-support@kln.ac.lk</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} color="var(--secondary-light)" style={{ flexShrink: 0 }} />
                <span>+94 11 290 3903 (Ext: 442)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & creators line */}
        <div
          style={{
            borderTop: '1px solid #333238',
            paddingTop: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#8E8E93',
          }}
        >
          {/* Creator Attribution Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(122, 22, 49, 0.3) 0%, rgba(212, 167, 44, 0.15) 100%)',
              border: '1px solid rgba(212, 167, 44, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FAF9F6', fontWeight: 600 }}>
              <Heart size={16} color="#E8C866" fill="#E8C866" style={{ flexShrink: 0 }} />
              <span>
                Engineered & Developed by <strong style={{ color: '#E8C866' }}>RBS Software Solutions</strong>
                <span style={{ color: '#C5C1BA', fontWeight: 500 }}> (Sithija Himantha, Vishan Randima)</span>
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#E8C866', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Academic Tech Innovation
            </div>
          </div>

          {/* Standard Copyright Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              fontSize: '0.8rem',
            }}
          >
            <div>
              © {new Date().getFullYear()} University of Kelaniya. All Rights Reserved. Tutoring Support Center System.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
              <span>Privacy Policy</span>
              <span>Academic Code of Ethics</span>
              <span>System Status: <span style={{ color: 'var(--success)' }}>Operational 🟢</span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
