import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userApi, sessionApi, feedbackApi, scoreApi } from '../../services/api';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2,
  Radio,
  Trophy,
  Award,
  Crown,
  Medal,
  MessageSquareQuote
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [liveScores, setLiveScores] = useState([]);
  const [awardsSummary, setAwardsSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, sessionsRes, feedbacksRes, liveScoreRes, awardsRes] = await Promise.all([
        userApi.getAllUsers().catch(() => ({ data: [] })),
        sessionApi.getAllSessions().catch(() => ({ data: [] })),
        feedbackApi.getAllFeedbacks().catch(() => ({ data: [] })),
        scoreApi.getLiveScores().catch(() => ({ data: { tutorScores: [] } })),
        scoreApi.getAnnualAwards().catch(() => ({ data: null })),
      ]);

      setUsers(usersRes.data || []);
      setSessions(sessionsRes.data || []);
      setFeedbacks(feedbacksRes.data || []);
      setLiveScores(liveScoreRes.data?.tutorScores || []);
      setAwardsSummary(awardsRes.data?.awardSummary || null);
    } catch (err) {
      console.error('Error loading admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Compute analytics
  const studentsCount = users.filter((u) => u.role === 'student').length;
  const tutorsCount = users.filter((u) => u.role === 'tutor').length;
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const activeSessions = sessions.filter((s) => s.status === 'active');
  const scheduledSessions = sessions.filter((s) => s.status === 'scheduled');

  const totalMinutes = completedSessions.reduce((acc, s) => acc + (s.durationMinutes || 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <ShieldCheck size={16} />
            Faculty Administration & Quality Oversight
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            Tutoring Support Center (TSC) Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            University of Kelaniya System Performance, Quality Monitoring & Audit Logs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/leaderboard" className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
            <Trophy size={16} /> Leaderboards & Honors
          </Link>
          <Link to="/admin/users" className="btn btn-outline-primary btn-sm">
            <Users size={16} /> User Directory
          </Link>
          <Link to="/admin/sessions" className="btn btn-primary btn-sm">
            <ShieldCheck size={16} /> Session Audits
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Card 1: Registered Students */}
        <div className="card card-maroon-accent" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Enrolled Students
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', margin: '0.4rem 0 0.1rem' }}>
            {studentsCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Active mentees across faculties
          </div>
        </div>

        {/* Card 2: Peer Tutors */}
        <div className="card card-gold-accent" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Verified Tutors
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--secondary-subtle)', color: 'var(--secondary-dark)' }}>
              <GraduationCap size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary-dark)', margin: '0.4rem 0 0.1rem' }}>
            {tutorsCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Peer educators & mentors
          </div>
        </div>

        {/* Card 3: Total Tutoring Hours */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Delivered Hours
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--info-light)', color: 'var(--info)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.4rem 0 0.1rem' }}>
            {totalHours} hrs
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Completed session durations
          </div>
        </div>

        {/* Card 4: Quality Score */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Quality Index
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--secondary-subtle)', color: '#D97706' }}>
              <Star size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#D97706', margin: '0.4rem 0 0.1rem' }}>
            {avgRating} / 10
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            From {feedbacks.length} student evaluations
          </div>
        </div>
      </div>

      {/* =========================================================================
          LEADERBOARD HIGHLIGHT WIDGET & LIFECYCLES
          ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Live Leaderboard Top Performers Preview */}
        <div className="card card-gold-accent" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={18} color="var(--secondary-dark)" />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Live Tutor Standings (Ongoing Month)
              </h3>
            </div>
            <Link to="/leaderboard" className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>
              Full Board <ArrowRight size={13} />
            </Link>
          </div>

          {liveScores.length === 0 ? (
            <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No scored sessions yet for this month.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {liveScores.slice(0, 3).map((item, idx) => (
                <div
                  key={item.tutorId || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: idx === 0 ? 'rgba(212, 167, 44, 0.12)' : 'var(--bg-surface-alt)',
                    border: idx === 0 ? '1px solid var(--secondary)' : '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: idx === 0 ? '#FFD700' : idx === 1 ? '#E0E0E0' : '#CD7F32',
                        color: idx === 0 ? '#3A2700' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.metrics?.totalHours || 0} hrs • {item.metrics?.averageRating || 5.0}★
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
                      {item.scores?.monthlyScore_MS?.toFixed(1) || 0}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>MS Score</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real-time Status Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Academic Session Lifecycles
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="status-dot status-dot-active" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Currently Live Classes</span>
              </div>
              <span className="badge badge-success">{activeSessions.length} Active</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="status-dot status-dot-scheduled" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Scheduled Upcoming</span>
              </div>
              <span className="badge badge-info">{scheduledSessions.length} Scheduled</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="status-dot status-dot-completed" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Completed & Logged</span>
              </div>
              <span className="badge badge-gold">{completedSessions.length} Completed</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquareQuote size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Student Evaluations</span>
              </div>
              <span className="badge badge-primary">{feedbacks.length} Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions Audit Log */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Recent Academic Sessions Audit Log
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Live and recently completed university sessions
            </p>
          </div>
          <Link to="/admin/sessions" className="btn btn-outline-primary btn-sm">
            View All ({sessions.length})
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            Loading audit records...
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject & Topic</th>
                  <th>Peer Tutor</th>
                  <th>Faculty</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Attendees</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 6).map((session) => (
                  <tr key={session._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{session.subject}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{session.topic}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{session.tutorId?.name || 'Tutor'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.tutorId?.email || '-'}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        {session.tutorId?.faculty || 'Faculty of Computing & Technology'}
                      </span>
                    </td>
                    <td>
                      {session.date ? new Date(session.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '-'}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
