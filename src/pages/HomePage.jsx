import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionApi, scoreApi, feedbackApi } from '../services/api';
import SessionCard from '../components/session/SessionCard';
import AttendanceModal from '../components/session/AttendanceModal';
import FeedbackModal from '../components/session/FeedbackModal';
import LiveControlModal from '../components/session/LiveControlModal';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  Clock, 
  Users, 
  CheckCircle2, 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  Star,
  Sparkles,
  Calendar,
  Building,
  Trophy,
  Crown
} from 'lucide-react';

export const HomePage = () => {
  const { user, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [topTutor, setTopTutor] = useState(null);
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);

  const fetchHomeData = async () => {
    try {
      // Fetch public/upcoming/active sessions + live leaderboard & top tutor
      const [sessionsRes, topTutorRes, scoresRes] = await Promise.all([
        sessionApi.getAllSessions().catch(() => ({ data: [] })),
        feedbackApi.getHighestRatedTutor().catch(() => ({ data: null })),
        scoreApi.getLiveScores().catch(() => ({ data: { tutorScores: [] } })),
      ]);

      setSessions(sessionsRes.data || []);
      setTopTutor(topTutorRes.data || null);
      setTopScores(scoresRes.data?.tutorScores?.slice(0, 3) || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const activeSessions = sessions.filter((s) => s.status === 'active');
  const upcomingSessions = sessions.filter((s) => s.status === 'scheduled').slice(0, 4);

  const handleAttend = (session) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedSession(session);
    setIsAttendModalOpen(true);
  };

  const handleFeedback = (session) => {
    setSelectedSession(session);
    setIsFeedbackModalOpen(true);
  };

  const handleManage = (session) => {
    if (session.status === 'active' && role === 'tutor') {
      setSelectedSession(session);
      setIsControlModalOpen(true);
    } else {
      navigate(`/browse`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* =========================================================================
          1. HERO SECTION - University of Kelaniya Visual Identity
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, #5A1024 0%, #7A1631 55%, #3A0713 100%)',
          color: '#FAF9F6',
          padding: 'clamp(2.5rem, 6vw, 4.5rem) 1.25rem clamp(3rem, 7vw, 5rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle geometric academic background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(212, 167, 44, 0.15) 0%, transparent 40%),
                              radial-gradient(circle at 80% 70%, rgba(232, 200, 102, 0.1) 0%, transparent 40%)`,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: 'var(--container-max-w)',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Headline & Action */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(212, 167, 44, 0.18)',
                border: '1px solid rgba(212, 167, 44, 0.45)',
                color: 'var(--secondary-light)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={14} />
              <span>Official Academic Peer Support</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.3rem)',
                fontWeight: 800,
                lineHeight: 1.18,
                color: '#FFFFFF',
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Excellence in Tutoring,{' '}
              <span
                style={{
                  color: 'var(--secondary-light)',
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                Peer-Powered
              </span>{' '}
              Success.
            </h1>

            <p
              style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                color: '#E8E4DD',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '540px',
              }}
            >
              Empowering University of Kelaniya undergraduates through structured peer tutoring, verified attendance logging, real-time OTP check-ins, and performance feedback.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn btn-secondary btn-lg" style={{ flex: '1 1 auto', minWidth: '200px' }}>
                    Join as Student / Tutor
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline"
                    style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)', flex: '1 1 auto', minWidth: '130px' }}
                  >
                    Portal Login
                  </Link>
                </>
              ) : (
                <Link
                  to={role === 'admin' ? '/admin/dashboard' : role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard'}
                  className="btn btn-secondary btn-lg"
                  style={{ flex: '1 1 auto', minWidth: '220px' }}
                >
                  Go to {role === 'admin' ? 'Admin Portal' : role === 'tutor' ? 'Tutor Command Center' : 'Student Hub'}
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Hero Metrics Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <GraduationCap size={22} color="var(--secondary-light)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                  Center Metrics
                </span>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                Semester 2026/27
              </span>
            </div>

            <div className="hero-metrics-grid">
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.22)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--secondary-light)', lineHeight: 1 }}>
                  100%
                </div>
                <div style={{ fontSize: '0.78rem', color: '#D5D0C6', marginTop: '0.35rem', fontWeight: 500 }}>
                  Verified Attendance
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.22)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
                  {sessions.length || '24+'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#D5D0C6', marginTop: '0.35rem', fontWeight: 500 }}>
                  Academic Sessions
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.22)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
                  6
                </div>
                <div style={{ fontSize: '0.78rem', color: '#D5D0C6', marginTop: '0.35rem', fontWeight: 500 }}>
                  Active Faculties
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.22)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--secondary-light)', lineHeight: 1 }}>
                  4.9★
                </div>
                <div style={{ fontSize: '0.78rem', color: '#D5D0C6', marginTop: '0.35rem', fontWeight: 500 }}>
                  Peer Quality Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. LIVE SESSIONS ALERT BANNER (If any session is currently active)
          ========================================================================= */}
      {activeSessions.length > 0 && (
        <section
          style={{
            backgroundColor: '#FFFBEB',
            borderBottom: '2px solid var(--secondary)',
            padding: '1rem 1.25rem',
          }}
        >
          <div
            style={{
              maxWidth: 'var(--container-max-w)',
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 260px' }}>
              <span className="status-dot status-dot-active" />
              <div>
                <strong style={{ color: '#92400E', fontSize: '0.925rem' }}>
                  {activeSessions.length} Session{activeSessions.length === 1 ? ' is' : 's are'} Currently LIVE!
                </strong>
                <span style={{ color: '#78350F', fontSize: '0.825rem', display: 'block' }}>
                  Students present in class can verify attendance using OTP or QR code.
                </span>
              </div>
            </div>

            <Link to="/browse?status=active" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
              <Radio size={15} />
              View Live Sessions
            </Link>
          </div>
        </section>
      )}

      {/* =========================================================================
          3. FEATURED SESSIONS PREVIEW
          ========================================================================= */}
      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 1.25rem', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ maxWidth: 'var(--container-max-w)', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Academic Schedule
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                Featured Tutoring Sessions
              </h2>
            </div>
            <Link to="/browse" className="btn btn-outline-primary btn-sm">
              Explore All Sessions ({sessions.length})
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              Loading academic schedule...
            </div>
          ) : sessions.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <Calendar size={36} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Sessions Scheduled Yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                Tutors will post upcoming peer tutoring sessions soon. Check back shortly.
              </p>
              {role === 'tutor' && (
                <Link to="/tutor/create-session" className="btn btn-primary">
                  Create First Session
                </Link>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {sessions.slice(0, 6).map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  userRole={role}
                  userId={user?.id || user?._id || user?.userId}
                  onAttend={handleAttend}
                  onFeedback={handleFeedback}
                  onManage={handleManage}
                  onStart={() => navigate('/tutor/my-sessions')}
                  onCancel={() => navigate('/tutor/my-sessions')}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          4. TUTOR OF THE MONTH ACADEMIC SPOTLIGHT
          ========================================================================= */}
      <section
        style={{
          padding: 'clamp(2.5rem, 5vw, 4rem) 1.25rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ maxWidth: 'var(--container-max-w)', margin: '0 auto' }}>
          <div
            className="card card-gold-accent"
            style={{
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              background: 'linear-gradient(135deg, #FAF9F6 0%, #FFFDF8 100%)',
              borderColor: 'rgba(212, 167, 44, 0.4)',
              boxShadow: 'var(--shadow-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'var(--secondary-subtle)',
                  color: 'var(--secondary-dark)',
                  padding: '0.35rem 0.8rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '1rem',
                  border: '1px solid rgba(212,167,44,0.3)',
                }}
              >
                <Award size={15} />
                <span>Academic Distinction Award</span>
              </div>

              <h3 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', color: 'var(--primary)', marginBottom: '0.65rem' }}>
                Tutor of the Month Spotlight
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                Recognizing outstanding peer tutors who exhibit exceptional dedication, high student rating satisfaction scores, and rigorous verified tutoring hours.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Star size={18} fill="#D4A72C" color="#D4A72C" />
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {topTutor?.averageRating?.toFixed(1) || '5.0'} / 10 Rating
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {topTutor?.totalFeedbacks || 0} Student Reviews
                  </span>
                </div>
              </div>

              <Link to="/leaderboard" className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
                <Trophy size={16} /> View Full Leaderboard & Honors
              </Link>
            </div>

            {/* Tutor Badge Card */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid rgba(212, 167, 44, 0.4)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-gold)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                  color: '#FFFFFF',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.85rem',
                  border: '3px solid #D4A72C',
                }}
              >
                {topTutor?.tutorName ? topTutor.tutorName.charAt(0).toUpperCase() : 'UOK'}
              </div>

              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                {topTutor?.tutorName || 'Verified Faculty Peer Tutor'}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.65rem' }}>
                Faculty of Computing & Technology
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                "Tutoring allows us to reinforce foundational concepts while guiding fellow students to academic excellence."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PARTICIPATING FACULTIES
          ========================================================================= */}
      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 1.25rem', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ maxWidth: 'var(--container-max-w)', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Campus Wide Reach
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--text-primary)', marginTop: '0.2rem', marginBottom: '2rem' }}>
            Supported University Faculties
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              { name: 'Faculty of Science', code: 'FOS', icon: '🔬', desc: 'Mathematics, Physics, Chemistry, Zoology' },
              { name: 'Computing & Tech', code: 'FCT', icon: '💻', desc: 'Software Eng, Data Science, Networks' },
              { name: 'Commerce & Mgmt', code: 'FCMS', icon: '📈', desc: 'Accountancy, Finance, Marketing, HR' },
              { name: 'Humanities', code: 'FOH', icon: '📚', desc: 'Languages, Linguistics, Philosophy' },
              { name: 'Social Sciences', code: 'FSS', icon: '🏛️', desc: 'Economics, Geography, Sociology' },
              { name: 'Faculty of Medicine', code: 'FOM', icon: '🩺', desc: 'Anatomy, Physiology, Biochemistry' },
            ].map((fac, idx) => (
              <div
                key={idx}
                className="card card-interactive"
                style={{
                  padding: '1.25rem 1rem',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{fac.icon}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em' }}>
                    {fac.code}
                  </div>
                  <h4 style={{ fontSize: '0.98rem', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem' }}>
                    {fac.name}
                  </h4>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {fac.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <AttendanceModal
        session={selectedSession}
        isOpen={isAttendModalOpen}
        onClose={() => setIsAttendModalOpen(false)}
        onSuccess={() => {
          fetchHomeData();
        }}
      />

      <FeedbackModal
        session={selectedSession}
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSuccess={() => {
          fetchHomeData();
        }}
      />

      <LiveControlModal
        session={selectedSession}
        isOpen={isControlModalOpen}
        onClose={() => setIsControlModalOpen(false)}
        onSessionEnded={() => {
          fetchHomeData();
        }}
      />
    </div>
  );
};

export default HomePage;
