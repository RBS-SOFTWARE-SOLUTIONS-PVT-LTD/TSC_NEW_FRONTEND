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
  MapPin
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Calculate student statistics
  const totalAttended = history.length;
  const totalMinutes = history.reduce((acc, item) => acc + (item.durationMinutes || 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const handleAttend = (session) => {
    setSelectedSession(session);
    setIsAttendModalOpen(true);
  };

  const handleFeedback = (session) => {
    setSelectedSession(session);
    setIsFeedbackModalOpen(true);
  };

  return (
    <div>
      {/* Top Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Sparkles size={16} />
          Student Learning Dashboard
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
          Welcome back, {user?.name || 'Undergraduate Scholar'}!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          {user?.faculty || 'University of Kelaniya'} • ID: <strong>{user?.userId || user?.id}</strong>
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Card 1: Attended Sessions */}
        <div className="card card-maroon-accent" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Verified Sessions
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', margin: '0.4rem 0 0.1rem' }}>
            {totalAttended}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Recorded via OTP / QR codes
          </div>
        </div>

        {/* Card 2: Learning Hours */}
        <div className="card card-gold-accent" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Learning Hours
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--secondary-subtle)', color: 'var(--secondary-dark)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary-dark)', margin: '0.4rem 0 0.1rem' }}>
            {totalHours} hrs
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Academic mentorship time
          </div>
        </div>

        {/* Card 3: Live Classes */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Live Classes
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: activeSessions.length > 0 ? 'var(--success-light)' : 'var(--border-light)', color: 'var(--success)' }}>
              <Radio size={18} className={activeSessions.length > 0 ? 'animate-pulse' : ''} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: activeSessions.length > 0 ? 'var(--success)' : 'var(--text-primary)', margin: '0.4rem 0 0.1rem' }}>
            {activeSessions.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {activeSessions.length > 0 ? 'In-progress check-ins open' : 'No active sessions currently'}
          </div>
        </div>

        {/* Card 4: Peer Mentorship */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Academic Status
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.7rem 0 0.2rem' }}>
            Good Standing 🎓
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            University Peer Support Program
          </div>
        </div>
      </div>

      {/* Live Sessions Check-in Alert */}
      {activeSessions.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1.5px solid var(--secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-gold)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="status-dot status-dot-active" />
            <h3 style={{ color: '#92400E', fontSize: '1.15rem' }}>
              Live Session In Progress! Check-In Available
            </h3>
          </div>
          <p style={{ color: '#78350F', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Your peer tutor has initiated a live class. Enter the 6-digit OTP code or scan the QR code to verify your attendance.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {activeSessions.map((session) => (
              <div
                key={session._id}
                style={{
                  background: '#FFFFFF',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #FCD34D',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>{session.subject}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{session.topic}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Tutor: {session.tutorId?.name || session.tutor || 'Peer Tutor'}
                  </div>
                </div>
                <button
                  onClick={() => handleAttend(session)}
                  className="btn btn-primary btn-sm"
                >
                  <Radio size={14} /> Check In
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Attendance History Table */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Recent Verified Attendance
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Your officially logged attendance history
            </p>
          </div>
          <Link to="/student/attendance" className="btn btn-outline-primary btn-sm">
            Full Log ({history.length})
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
            Loading attendance records...
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={40} color="var(--primary)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>No Attendance Records Yet</h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 1.25rem' }}>
              Explore upcoming sessions and attend peer classes to record verified hours.
            </p>
            <Link to="/student/sessions" className="btn btn-primary btn-sm">
              Browse Upcoming Sessions
            </Link>
          </div>
        ) : (
          <div className="table-container">
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
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.subject}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{item.topic}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.tutor?.name || 'Faculty Tutor'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.tutor?.faculty || '-'}</div>
                    </td>
                    <td>
                      {item.date ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </td>
                    <td>
                      {item.type === 'online' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--info)' }}>
                          <Video size={14} /> Online
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
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
        )}
      </div>

      {/* Modals */}
      <AttendanceModal
        session={selectedSession}
        isOpen={isAttendModalOpen}
        onClose={() => setIsAttendModalOpen(false)}
        onSuccess={() => loadData()}
      />

      <FeedbackModal
        session={selectedSession}
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};

export default StudentDashboard;
