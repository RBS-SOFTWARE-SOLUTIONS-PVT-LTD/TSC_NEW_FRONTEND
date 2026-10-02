import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sessionApi } from '../../services/api';
import AttendanceModal from '../../components/session/AttendanceModal';
import FeedbackModal from '../../components/session/FeedbackModal';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Star, 
  Calendar, 
  Radio, 
  ArrowRight, 
  Sparkles,
  Award,
  Video,
  MapPin,
  KeyRound,
  Copy,
  Check,
  Zap,
  TrendingUp,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  const [selectedSession, setSelectedSession] = useState(null);
  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [historyRes, sessionsRes] = await Promise.all([
        sessionApi.getMyAttendance(),
        sessionApi.getAllSessions({ status: 'active' }),
      ]);
      setHistory(historyRes.data || []);
      setActiveSessions(sessionsRes.data || []);
    } catch (err) {
      console.error('Error loading student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Student metrics
  const totalAttended = history.length;
  const totalMinutes = history.reduce((acc, item) => acc + (item.durationMinutes || 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Copy ID
  const handleCopyId = () => {
    const id = user?.userId || user?.id || '';
    if (id) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleAttend = (session) => {
    setSelectedSession(session);
    setIsAttendModalOpen(true);
  };

  const handleQuickCheckIn = () => {
    if (activeSessions.length > 0) {
      setSelectedSession(activeSessions[0]);
    } else {
      setSelectedSession(null);
    }
    setIsAttendModalOpen(true);
  };

  const handleFeedback = (session) => {
    setSelectedSession(session);
    setIsFeedbackModalOpen(true);
  };

  return (
    <div className="student-dashboard-wrapper">
      {/* =========================================================================
          HERO STUDENT PROFILE HEADER (SUPER UI/UX ENGINEERED)
          ========================================================================= */}
      <section className="student-hero-banner">
        <div className="student-hero-content">
          <div className="student-avatar-badge-wrap">
            <div className="student-hero-avatar">
              {(user?.name || 'S').charAt(0).toUpperCase()}
              <span className="student-hero-online-dot" />
            </div>
            <div className="student-hero-details">
              <div className="student-hero-greeting">
                <Sparkles size={14} className="text-gold animate-pulse" />
                <span>{getGreeting()}, Scholar</span>
              </div>
              <h1 className="student-hero-name">
                {user?.name || 'Undergraduate'}
              </h1>
              <div className="student-hero-meta-row">
                <span className="student-faculty-pill">
                  <GraduationCap size={13} />
                  {user?.faculty || 'University of Kelaniya'}
                </span>
                <button
                  onClick={handleCopyId}
                  className="student-id-copy-btn"
                  title="Copy Student ID"
                >
                  <span className="student-id-label">ID: {user?.userId || user?.id || 'UOK-STU'}</span>
                  {copiedId ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick OTP Verification CTA in Header */}
          <div className="student-hero-actions">
            {activeSessions.length > 0 ? (
              <button
                onClick={handleQuickCheckIn}
                className="btn btn-gold btn-hero-pulse"
              >
                <Zap size={16} />
                <span>Enter Session OTP</span>
                <span className="badge-live-count">{activeSessions.length} Live</span>
              </button>
            ) : (
              <Link to="/student/sessions" className="btn btn-hero-secondary">
                <Calendar size={16} />
                <span>Browse Schedule</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE CLASS RADAR NOTIFICATION (IF SESSIONS ARE ACTIVE)
          ========================================================================= */}
      {activeSessions.length > 0 && (
        <section className="live-radar-section">
          <div className="live-radar-header">
            <div className="live-radar-indicator">
              <span className="live-radar-dot" />
              <span className="live-radar-title">Live Tutoring In Session</span>
            </div>
            <span className="live-radar-badge">Check-In Open</span>
          </div>

          <div className="live-radar-cards-grid">
            {activeSessions.map((session) => (
              <div key={session._id} className="live-radar-card">
                <div className="live-radar-card-left">
                  <div className="live-session-type-badge">
                    {session.type === 'online' ? (
                      <><Video size={13} /> Online Meeting</>
                    ) : (
                      <><MapPin size={13} /> {session.location || 'Faculty Room'}</>
                    )}
                  </div>
                  <h3 className="live-session-subject">{session.subject}</h3>
                  <p className="live-session-topic">{session.topic}</p>
                  <div className="live-session-tutor">
                    <UserCheck size={13} />
                    <span>Tutor: <strong>{session.tutorId?.name || session.tutor || 'Peer Mentor'}</strong></span>
                  </div>
                </div>

                <div className="live-radar-card-right">
                  <button
                    onClick={() => handleAttend(session)}
                    className="btn btn-primary btn-checkin-action"
                  >
                    <KeyRound size={16} />
                    <span>Verify Attendance</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          BENTO METRIC STATS GRID (MOBILE 2X2 & DESKTOP 4-COL)
          ========================================================================= */}
      <section className="bento-metrics-section">
        <div className="bento-grid">
          {/* Card 1: Verified Sessions */}
          <div className="bento-stat-card card-maroon-accent">
            <div className="bento-stat-top">
              <span className="bento-stat-label">Verified Sessions</span>
              <div className="bento-stat-icon-wrap icon-maroon">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="bento-stat-val text-maroon">{totalAttended}</div>
            <div className="bento-stat-sub">
              <span className="bento-trend-badge">
                <TrendingUp size={12} /> Logged
              </span>
              <span>via OTP / QR Code</span>
            </div>
          </div>

          {/* Card 2: Mentorship Time */}
          <div className="bento-stat-card card-gold-accent">
            <div className="bento-stat-top">
              <span className="bento-stat-label">Mentorship Hours</span>
              <div className="bento-stat-icon-wrap icon-gold">
                <Clock size={18} />
              </div>
            </div>
            <div className="bento-stat-val text-gold">{totalHours} <span className="bento-stat-unit">hrs</span></div>
            <div className="bento-stat-sub">
              <div className="bento-progress-mini">
                <div 
                  className="bento-progress-fill" 
                  style={{ width: `${Math.min((parseFloat(totalHours) / 20) * 100, 100)}%` }} 
                />
              </div>
              <span>20h Goal</span>
            </div>
          </div>

          {/* Card 3: Live Classes */}
          <div className="bento-stat-card">
            <div className="bento-stat-top">
              <span className="bento-stat-label">Live Classes</span>
              <div className={`bento-stat-icon-wrap ${activeSessions.length > 0 ? 'icon-green animate-pulse' : 'icon-muted'}`}>
                <Radio size={18} />
              </div>
            </div>
            <div className={`bento-stat-val ${activeSessions.length > 0 ? 'text-green' : 'text-primary'}`}>
              {activeSessions.length}
            </div>
            <div className="bento-stat-sub">
              {activeSessions.length > 0 ? (
                <span className="text-green font-semibold">● Active right now</span>
              ) : (
                <span>No ongoing classes</span>
              )}
            </div>
          </div>

          {/* Card 4: Academic Rank */}
          <div className="bento-stat-card">
            <div className="bento-stat-top">
              <span className="bento-stat-label">Academic Status</span>
              <div className="bento-stat-icon-wrap icon-gold">
                <Award size={18} />
              </div>
            </div>
            <div className="bento-stat-val font-display" style={{ fontSize: '1.4rem' }}>
              Scholar 🎓
            </div>
            <div className="bento-stat-sub">
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                <ShieldCheck size={11} /> Verified Member
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MOBILE QUICK ACTIONS STRIP
          ========================================================================= */}
      <section className="student-quick-actions-bar">
        <Link to="/student/sessions" className="quick-action-pill">
          <BookOpen size={16} className="text-maroon" />
          <span>Browse All Sessions</span>
          <ChevronRight size={14} className="pill-arrow" />
        </Link>
        <Link to="/student/attendance" className="quick-action-pill">
          <Clock size={16} className="text-gold" />
          <span>Full Attendance History</span>
          <ChevronRight size={14} className="pill-arrow" />
        </Link>
        <Link to="/leaderboard" className="quick-action-pill">
          <Award size={16} className="text-gold" />
          <span>Leaderboard & Tutors</span>
          <ChevronRight size={14} className="pill-arrow" />
        </Link>
      </section>

      {/* =========================================================================
          RECENT VERIFIED ATTENDANCE (DESKTOP TABLE + MOBILE CARDS)
          ========================================================================= */}
      <section className="student-records-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Recent Verified Attendance</h2>
            <p className="section-subtitle">Official peer learning records authenticated on campus</p>
          </div>
          <Link to="/student/attendance" className="btn btn-outline-primary btn-sm desktop-only">
            View All ({history.length})
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="dashboard-loading-box">
            <div className="spinner-primary" />
            <p>Syncing attendance logs...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="dashboard-empty-card">
            <div className="empty-icon-wrap">
              <CheckCircle2 size={40} />
            </div>
            <h3>No Verified Sessions Yet</h3>
            <p>Attend peer-assisted tutoring sessions and verify using tutor OTP codes to build your academic transcript.</p>
            <Link to="/student/sessions" className="btn btn-primary btn-sm">
              <Calendar size={15} /> Find Upcoming Sessions
            </Link>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Touch-Friendly Card Feed */}
            <div className="mobile-records-feed mobile-only">
              {history.slice(0, 5).map((item, idx) => (
                <div key={idx} className="mobile-record-card">
                  <div className="mobile-record-top">
                    <span className="record-subject-badge">{item.subject}</span>
                    <span className="badge badge-success">
                      <CheckCircle2 size={11} /> {item.verificationMethod?.toUpperCase() || 'OTP'}
                    </span>
                  </div>

                  <h4 className="mobile-record-topic">{item.topic}</h4>

                  <div className="mobile-record-meta-list">
                    <div className="mobile-record-meta-item">
                      <UserCheck size={14} className="text-muted" />
                      <span>{item.tutor?.name || 'Faculty Tutor'}</span>
                    </div>
                    <div className="mobile-record-meta-item">
                      <Calendar size={14} className="text-muted" />
                      <span>
                        {item.date ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </span>
                    </div>
                    <div className="mobile-record-meta-item">
                      {item.type === 'online' ? (
                        <span className="text-info flex items-center gap-1"><Video size={13} /> Online</span>
                      ) : (
                        <span className="text-muted flex items-center gap-1"><MapPin size={13} /> Physical</span>
                      )}
                    </div>
                  </div>

                  <div className="mobile-record-footer">
                    <button
                      onClick={() => handleFeedback({ _id: item.sessionId, subject: item.subject, topic: item.topic, tutorId: item.tutor })}
                      className="btn btn-outline-primary btn-sm w-full"
                    >
                      <Star size={14} /> Rate & Review Tutor
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: High Density Table */}
            <div className="table-container desktop-only">
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject & Topic</th>
                    <th>Peer Tutor</th>
                    <th>Session Date</th>
                    <th>Delivery</th>
                    <th>Verification</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="font-bold text-maroon">{item.subject}</div>
                        <div className="text-sm text-secondary">{item.topic}</div>
                      </td>
                      <td>
                        <div className="font-semibold">{item.tutor?.name || 'Faculty Tutor'}</div>
                        <div className="text-xs text-muted">{item.tutor?.faculty || 'UOK'}</div>
                      </td>
                      <td>
                        {item.date ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </td>
                      <td>
                        {item.type === 'online' ? (
                          <span className="inline-flex items-center gap-1 text-info">
                            <Video size={14} /> Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={14} color="var(--primary)" /> Physical
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} />
                          {item.verificationMethod?.toUpperCase() || 'OTP'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleFeedback({ _id: item.sessionId, subject: item.subject, topic: item.topic, tutorId: item.tutor })}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          <Star size={13} /> Rate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      <AttendanceModal
        session={selectedSession}
        isOpen={isAttendModalOpen}
        onClose={() => {
          setIsAttendModalOpen(false);
          setSelectedSession(null);
        }}
        onSuccess={() => loadData()}
      />

      <FeedbackModal
        session={selectedSession}
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setSelectedSession(null);
        }}
        onSuccess={() => loadData()}
      />
    </div>
  );
};

export default StudentDashboard;
