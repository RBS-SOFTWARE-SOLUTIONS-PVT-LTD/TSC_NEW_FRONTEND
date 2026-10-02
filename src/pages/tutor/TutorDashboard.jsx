import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sessionApi, feedbackApi, scoreApi } from '../../services/api';
import LiveControlModal from '../../components/session/LiveControlModal';
import { 
  Clock, 
  Calendar, 
  Users, 
  Star, 
  PlusCircle, 
  Radio, 
  ArrowRight, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Video,
  MapPin,
  Trophy,
  Crown,
  Medal,
  MessageSquareQuote,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export const TutorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({ averageRating: 5.0, count: 0, feedbacks: [] });
  const [myScoreData, setMyScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSession, setSelectedSession] = useState(null);
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, feedbackRes, scoreRes] = await Promise.all([
        sessionApi.getTutorSessions().catch(() => ({ data: [] })),
        feedbackApi.getTutorFeedback().catch(() => ({ averageRating: 5.0, count: 0, data: [] })),
        scoreApi.getMyScore().catch(() => ({ data: null })),
      ]);

      setSessions(sessionsRes.data || []);
      
      if (feedbackRes) {
        setFeedbackStats({
          averageRating: feedbackRes.averageRating || 5.0,
          count: feedbackRes.count || feedbackRes.data?.length || 0,
          feedbacks: feedbackRes.data || [],
        });
      }

      if (scoreRes && scoreRes.data) {
        setMyScoreData(scoreRes.data);
      }
    } catch (err) {
      console.error('Error loading tutor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute tutor stats
  const activeSession = sessions.find((s) => s.status === 'active');
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const totalMinutes = completedSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalStudents = completedSessions.reduce((acc, s) => acc + (s.numOfStudents || s.loggedStudents?.length || 0), 0);

  const handleOpenControlRoom = (session) => {
    setSelectedSession(session);
    setIsControlModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Sparkles size={16} />
            Verified Faculty Peer Tutor
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            Tutor Command Center: {user?.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {user?.faculty || 'Faculty of Computing & Technology'} • Academic Year 2026/27
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/leaderboard" className="btn btn-outline-primary">
            <Trophy size={18} />
            View Leaderboard
          </Link>
          <Link to="/tutor/create-session" className="btn btn-primary">
            <PlusCircle size={18} />
            Create New Session
          </Link>
        </div>
      </div>

      {/* =========================================================================
          LIVE SCORE & BENCHMARK HERO CARD
          ========================================================================= */}
      {myScoreData && (
        <div
          className="card card-maroon-accent"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(135deg, rgba(122, 22, 49, 0.05) 0%, rgba(212, 167, 44, 0.08) 100%)',
            border: '1px solid rgba(122, 22, 49, 0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <Trophy size={16} color="var(--secondary-dark)" />
                My Live Performance Score ({myScoreData.period || 'Current Month'})
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.4rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {myScoreData.scores?.monthlyScore_MS?.toFixed(1) || '0.0'}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>/ 100 points</span>

                <span
                  style={{
                    marginLeft: '0.5rem',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    background: myScoreData.rank === 1 ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : 'var(--primary-subtle)',
                    color: myScoreData.rank === 1 ? '#3A2700' : 'var(--primary)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                  }}
                >
                  {myScoreData.rank === 1 ? '🏆 Rank #1 Gold' : `Rank #${myScoreData.rank} of ${myScoreData.totalTutors || 'tutors'}`}
                </span>
              </div>
            </div>

            <Link to="/leaderboard" className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
              <TrendingUp size={16} /> Standings & Awards
            </Link>
          </div>

          {/* Score Formula Visual Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1.25rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(122, 22, 49, 0.1)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Hour Score (40% Weight)
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {myScoreData.scores?.hourScore_HS?.toFixed(1) || '0.0'}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {myScoreData.metrics?.totalHours || 0} hrs / top {myScoreData.metrics?.highestTutorHoursInPeriod || 0} hrs
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Rating Score (60% Weight)
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>
                {myScoreData.scores?.ratingScore_RS?.toFixed(1) || '0.0'}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {myScoreData.metrics?.averageRating || 5.0}★ average ({myScoreData.metrics?.totalFeedbacks || 0} reviews)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Teaching Contribution
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary-dark)', marginTop: '0.2rem' }}>
                {myScoreData.metrics?.totalSessions || 0} Classes
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Officially verified sessions
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Card 1: Verified Tutoring Hours */}
        <div className="card card-gold-accent" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Tutoring Hours
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--secondary-subtle)', color: 'var(--secondary-dark)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary-dark)', margin: '0.4rem 0 0.1rem' }}>
            {totalHours} hrs
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Officially verified teaching duration
          </div>
        </div>

        {/* Card 2: Sessions Hosted */}
        <div className="card card-maroon-accent" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Sessions Completed
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', margin: '0.4rem 0 0.1rem' }}>
            {completedSessions.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Total classes conducted
          </div>
        </div>

        {/* Card 3: Total Students Mentored */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Students Mentored
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--info-light)', color: 'var(--info)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.4rem 0 0.1rem' }}>
            {totalStudents}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Cumulative student attendees
          </div>
        </div>

        {/* Card 4: Quality Rating */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Student Rating
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--secondary-subtle)', color: 'var(--secondary-dark)' }}>
              <Star size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#D97706', margin: '0.4rem 0 0.1rem' }}>
            {feedbackStats.averageRating || '5.0'} ★
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Based on {feedbackStats.count} peer review{feedbackStats.count === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Active Session Live Alert */}
      {activeSession && (
        <div
          style={{
            background: 'linear-gradient(135deg, #7A1631 0%, #5A1024 100%)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-maroon)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <span className="status-dot status-dot-active" /> Live Session In Progress
            </div>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', margin: '0.2rem 0' }}>
              {activeSession.subject}: {activeSession.topic}
            </h3>
            <p style={{ color: '#E8E4DD', fontSize: '0.875rem' }}>
              Attendance OTP Code: <strong style={{ color: 'var(--secondary-light)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>{activeSession.otp}</strong> • {activeSession.loggedStudents?.length || 0} students checked in
            </p>
          </div>

          <button
            onClick={() => handleOpenControlRoom(activeSession)}
            className="btn btn-secondary btn-lg"
          >
            <Radio size={18} />
            Open Live Control Room
          </button>
        </div>
      )}

      {/* Tutor Sessions Management Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              My Scheduled & Conducted Sessions
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Manage active classes, start scheduled sessions, and review attendee counts
            </p>
          </div>
          <Link to="/tutor/my-sessions" className="btn btn-outline-primary btn-sm">
            View All ({sessions.length})
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            Loading session roster...
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-secondary)' }}>
            <Calendar size={40} color="var(--primary)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>You Haven't Scheduled Any Sessions Yet</h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 1.25rem' }}>
              Schedule your first peer tutoring class to start guiding undergraduate students.
            </p>
            <Link to="/tutor/create-session" className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> Create Session
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject & Topic</th>
                  <th>Date & Time</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th>Attendees</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 5).map((session) => (
                  <tr key={session._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{session.subject}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{session.topic}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {session.date ? new Date(session.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </div>
                    </td>
                    <td>
                      {session.type === 'online' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--info)' }}>
                          <Video size={14} /> Online
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} color="var(--primary)" /> {session.location || 'Faculty Room'}
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          session.status === 'active'
                            ? 'badge-success'
                            : session.status === 'scheduled'
                            ? 'badge-info'
                            : session.status === 'completed'
                            ? 'badge-gold'
                            : 'badge-error'
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td>
                      <strong>{session.numOfStudents || session.loggedStudents?.length || 0}</strong> students
                    </td>
                    <td>
                      {session.status === 'active' && (
                        <button
                          onClick={() => handleOpenControlRoom(session)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Radio size={13} /> Control Room
                        </button>
                      )}

                      {session.status === 'scheduled' && (
                        <Link
                          to="/tutor/my-sessions"
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.78rem' }}
                        >
                          Manage Session
                        </Link>
                      )}

                      {session.status === 'completed' && (
                        <button
                          onClick={() => handleOpenControlRoom(session)}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.78rem' }}
                        >
                          View Roster
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          STUDENT REVIEWS & FEEDBACK HIGHLIGHTS
          ========================================================================= */}
      {feedbackStats.feedbacks?.length > 0 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquareQuote size={20} color="var(--primary)" />
                Recent Student Reviews & Comments
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Feedback submitted by students following your completed sessions
              </p>
            </div>
            <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
              {feedbackStats.averageRating}★ Average
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {feedbackStats.feedbacks.slice(0, 4).map((f) => (
              <div
                key={f._id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {f.studentId?.name || 'Undergraduate Student'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#D97706', fontWeight: 800, fontSize: '0.85rem' }}>
                      <Star size={14} fill="#D97706" /> {f.rating}/10
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: f.comment ? 'normal' : 'italic', marginBottom: '0.75rem' }}>
                    "{f.comment || 'Helpful and engaging tutoring session.'}"
                  </p>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                  Session: {f.sessionId?.subject || 'Tutoring Class'} • {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Modal */}
      <LiveControlModal
        session={selectedSession}
        isOpen={isControlModalOpen}
        onClose={() => setIsControlModalOpen(false)}
        onSessionEnded={() => loadData()}
      />
    </div>
  );
};

export default TutorDashboard;
