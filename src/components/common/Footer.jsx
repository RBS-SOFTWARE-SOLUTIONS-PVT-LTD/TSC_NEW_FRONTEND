import React from 'react';
import { Link } from 'react-router-dom';
import KelaniyaLogo from './KelaniyaLogo';
import { MapPin, Phone, Mail, ShieldCheck, Heart, Sparkles, Code } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#18181B',
        color: '#FAF9F6',
        borderTop: '4px solid var(--primary)',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
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
            <KelaniyaLogo size={38} lightMode={true} />
            <p
              style={{
                color: '#A1A1AA',
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
                <Link to="/browse" style={{ color: '#A1A1AA', transition: 'color 0.2s' }}>
                  Explore Sessions
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" style={{ color: '#A1A1AA', transition: 'color 0.2s' }}>
                  Tutor Leaderboard & Awards
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#A1A1AA', transition: 'color 0.2s' }}>
                  Student & Tutor Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#A1A1AA', transition: 'color 0.2s' }}>
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
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#A1A1AA' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#A1A1AA' }}>
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

        {/* =========================================================================
            INDUSTRY-LEVEL BOTTOM BAR: COPYRIGHT & CREATOR SIGNATURE
            ========================================================================= */}
        <div className="footer-industry-bottom">
          <div className="footer-bottom-main-row">
            <div className="footer-copyright-text">
              © {new Date().getFullYear()} <strong>University of Kelaniya</strong>. Tutoring Support Center System.
            </div>
            
            <div className="footer-meta-badges">
              <span className="footer-status-pill">
                <span className="footer-status-dot" /> System Operational
              </span>
              <span className="footer-sep">•</span>
              <span>Academic Integrity</span>
              <span className="footer-sep">•</span>
              <span>Privacy</span>
            </div>
          </div>

          {/* Refined Creator Attribution Signature */}
          <div className="footer-creator-signature-row">
            <div className="footer-signature-pill">
              <span className="signature-prefix">Engineered & Developed by</span>
              <strong className="signature-company">RBS Software Solutions</strong>
              <span className="signature-team">(Sithija Himantha • Vishan Randima)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
