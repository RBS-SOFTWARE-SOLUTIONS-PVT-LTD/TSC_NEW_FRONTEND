import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionApi } from '../services/api';
import SessionCard from '../components/session/SessionCard';
import AttendanceModal from '../components/session/AttendanceModal';
import FeedbackModal from '../components/session/FeedbackModal';
import LiveControlModal from '../components/session/LiveControlModal';
import { 
  Search, 
  Filter, 
  Calendar, 
  Radio, 
  CheckCircle2, 
  X, 
  BookOpen,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const BrowseSessionsPage = () => {
  const { user, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [selectedType, setSelectedType] = useState('all');

  // Modals state
  const [selectedSession, setSelectedSession] = useState(null);
  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedType !== 'all') params.type = selectedType;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await sessionApi.getAllSessions(params);
      setSessions(res.data || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedStatus, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSessions();
  };

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
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Sparkles size={16} />
          Academic Course Sessions
        </div>
        <h1 style={{ fontSize: '2.25rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
          Explore Peer Tutoring Sessions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.25rem' }}>
          Discover scheduled academic lectures, live interactive tutorial rooms, and physical workshops.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          backgroundColor: '#FFFFFF',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by subject (e.g. Software Eng, Math, Physics) or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Search size={16} /> Search
            </button>

            <button
              type="button"
              onClick={fetchSessions}
              className="btn btn-outline"
              title="Refresh schedule"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.875rem' }}>
            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Status:
              </span>
              {[
                { id: 'all', label: 'All Sessions' },
                { id: 'active', label: '🔴 Live Now' },
                { id: 'scheduled', label: '📅 Scheduled' },
                { id: 'completed', label: '✅ Completed' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setSelectedStatus(pill.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.8rem',
                    fontWeight: selectedStatus === pill.id ? 700 : 500,
                    backgroundColor: selectedStatus === pill.id ? 'var(--primary)' : 'var(--bg-main)',
                    color: selectedStatus === pill.id ? '#FFFFFF' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: selectedStatus === pill.id ? 'var(--primary)' : 'var(--border-color)',
                    transition: 'all 0.15s',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Delivery:
              </span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="form-select"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem', width: 'auto' }}
              >
                <option value="all">All Modes (Physical & Online)</option>
                <option value="physical">Physical Classroom Only</option>
                <option value="online">Online Virtual Only</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p>Querying University of Kelaniya tutoring sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <BookOpen size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Matching Sessions Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            Try adjusting your search filters or check back later for newly scheduled peer classes.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('all');
              setSelectedType('all');
            }}
            className="btn btn-outline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{sessions.length}</strong> academic session{sessions.length === 1 ? '' : 's'}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {sessions.map((session) => (
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
        </>
      )}

      {/* Modals */}
      <AttendanceModal
        session={selectedSession}
        isOpen={isAttendModalOpen}
        onClose={() => setIsAttendModalOpen(false)}
        onSuccess={() => fetchSessions()}
      />

      <FeedbackModal
        session={selectedSession}
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSuccess={() => fetchSessions()}
      />

      <LiveControlModal
        session={selectedSession}
        isOpen={isControlModalOpen}
        onClose={() => setIsControlModalOpen(false)}
        onSessionEnded={() => fetchSessions()}
      />
    </div>
  );
};

export default BrowseSessionsPage;
