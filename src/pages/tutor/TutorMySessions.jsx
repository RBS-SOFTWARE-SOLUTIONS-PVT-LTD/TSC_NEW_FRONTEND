import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SessionCard from '../../components/session/SessionCard';
import LiveControlModal from '../../components/session/LiveControlModal';
import { 
  PlusCircle, 
  Calendar, 
  RefreshCw, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Filter
} from 'lucide-react';

export const TutorMySessions = () => {
  const { showSuccess, showError } = useToast();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedSession, setSelectedSession] = useState(null);
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await sessionApi.getTutorSessions();
      setSessions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch tutor sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleStartSession = async (sessionId) => {
    if (!window.confirm('Are you ready to start this session now? This will generate live OTP and QR verification tokens.')) {
      return;
    }

    try {
      const res = await sessionApi.startSession(sessionId);
      showSuccess(res.message || 'Session started successfully!');
      // Find updated session and open control room
      const targetSession = sessions.find((s) => s._id === sessionId);
      if (targetSession) {
        setSelectedSession({
          ...targetSession,
          status: 'active',
          otp: res.data?.otp,
          qrCode: res.data?.qrCode,
        });
        setIsControlModalOpen(true);
      }
      fetchSessions();
    } catch (err) {
      showError(err.message || 'Failed to start session.');
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled session?')) {
      return;
    }

    try {
      const res = await sessionApi.cancelSession(sessionId);
      showSuccess(res.message || 'Session cancelled.');
      fetchSessions();
    } catch (err) {
      showError(err.message || 'Failed to cancel session.');
    }
  };

  const handleOpenControl = (session) => {
    setSelectedSession(session);
    setIsControlModalOpen(true);
  };

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Sparkles size={16} />
            Academic Roster
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            My Peer Tutoring Sessions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Manage session life-cycles, broadcast attendance codes, and monitor participant check-ins.
          </p>
        </div>

        <Link to="/tutor/create-session" className="btn btn-primary">
          <PlusCircle size={18} /> Schedule New Class
        </Link>
      </div>

      {/* Filter Tabs and Refresh */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${sessions.length})` },
            { id: 'active', label: `Live Now (${sessions.filter((s) => s.status === 'active').length})` },
            { id: 'scheduled', label: `Scheduled (${sessions.filter((s) => s.status === 'scheduled').length})` },
            { id: 'completed', label: `Completed (${sessions.filter((s) => s.status === 'completed').length})` },
            { id: 'cancelled', label: `Cancelled (${sessions.filter((s) => s.status === 'cancelled').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.825rem',
                fontWeight: statusFilter === tab.id ? 700 : 500,
                backgroundColor: statusFilter === tab.id ? 'var(--primary)' : 'var(--bg-main)',
                color: statusFilter === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: statusFilter === tab.id ? 'var(--primary)' : 'var(--border-color)',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={fetchSessions}
          className="btn btn-outline"
          title="Refresh schedule"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Session Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          Loading your tutoring sessions...
        </div>
      ) : filteredSessions.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <Calendar size={44} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Sessions Found in this View
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            {statusFilter === 'all'
              ? 'You have not scheduled any peer tutoring sessions yet.'
              : `No sessions with status '${statusFilter}'.`}
          </p>
          <Link to="/tutor/create-session" className="btn btn-primary btn-sm">
            <PlusCircle size={15} /> Create a Session
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredSessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              userRole="tutor"
              onStart={handleStartSession}
              onCancel={handleCancelSession}
              onManage={handleOpenControl}
            />
          ))}
        </div>
      )}

      {/* Live Control Room Modal */}
      <LiveControlModal
        session={selectedSession}
        isOpen={isControlModalOpen}
        onClose={() => setIsControlModalOpen(false)}
        onSessionEnded={() => fetchSessions()}
      />
    </div>
  );
};

export default TutorMySessions;
