import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sessionApi } from '../../services/api';
import FeedbackModal from '../../components/session/FeedbackModal';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Star, 
  Search, 
  RefreshCw,
  Sparkles,
  Download
} from 'lucide-react';

export const StudentAttendanceHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await sessionApi.getMyAttendance();
      setHistory(res.data || []);
    } catch (err) {
      console.error('Error fetching attendance history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.subject?.toLowerCase().includes(term) ||
      item.topic?.toLowerCase().includes(term) ||
      item.tutor?.name?.toLowerCase().includes(term)
    );
  });

  const totalMinutes = history.reduce((acc, item) => acc + (item.durationMinutes || 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const handleRate = (item) => {
    setSelectedSession({
      _id: item.sessionId,
      subject: item.subject,
      topic: item.topic,
      tutorId: item.tutor,
    });
    setIsFeedbackModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Sparkles size={16} />
            Verified Records
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            My Attendance History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Official log of all peer tutoring sessions attended and verified at University of Kelaniya.
          </p>
        </div>

        {/* Aggregate Summary Box */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Total Verified
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
              {history.length} Sessions
            </div>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Mentorship Time
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary-dark)', lineHeight: 1.1 }}>
              {totalHours} Hours
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search by subject, topic or tutor name..."
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

        <button
          onClick={fetchHistory}
          className="btn btn-outline"
          title="Refresh table"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* History Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            Loading verified attendance records...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={44} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              No Records Found
            </h3>
            <p style={{ fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto' }}>
              {searchTerm ? 'No sessions match your search query.' : 'You have not attended any tutoring sessions yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View: Touch-Optimized Cards Feed */}

            <div className="mobile-records-feed mobile-only" style={{ padding: '0.75rem' }}>
              {filteredHistory.map((item, idx) => (
                <div key={idx} className="mobile-record-card" style={{ marginBottom: '0.75rem' }}>
                  <div className="mobile-record-top">
                    <span className="record-subject-badge">{item.subject}</span>
                    <span className="badge badge-success">
                      <CheckCircle2 size={11} /> {item.verificationMethod?.toUpperCase() || 'OTP'}
                    </span>
                  </div>

                  <h4 className="mobile-record-topic">{item.topic}</h4>

                  <div className="mobile-record-meta-list">
                    <div className="mobile-record-meta-item">
                      <span className="text-muted font-semibold">Tutor:</span>
                      <span>{item.tutor?.name || 'Faculty Tutor'}</span>
                    </div>
                    <div className="mobile-record-meta-item">
                      <Calendar size={13} className="text-muted" />
                      <span>
                        {item.date ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </span>
                    </div>
                    <div className="mobile-record-meta-item">
                      <Clock size={13} className="text-muted" />
                      <span>
                        {item.joinedAt ? new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </span>
                    </div>
                    <div className="mobile-record-meta-item">
                      {item.type === 'online' ? (
                        <span className="text-info flex items-center gap-1"><Video size={13} /> Online</span>
                      ) : (
                        <span className="text-muted flex items-center gap-1"><MapPin size={13} /> {item.location || 'Room'}</span>
                      )}
                    </div>
                  </div>

                  <div className="mobile-record-footer">
                    <button
                      onClick={() => handleRate(item)}
                      className="btn btn-outline-primary btn-sm w-full"
                    >
                      <Star size={14} /> Rate & Review Tutor
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Wide Data Table */}
            <div className="table-container desktop-only" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject & Topic</th>
                    <th>Peer Tutor</th>
                    <th>Session Date</th>
                    <th>Check-In Time</th>
                    <th>Mode & Venue</th>
                    <th>Method</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{item.subject}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.topic}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.tutor?.name || 'Faculty Tutor'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.tutor?.faculty || 'UOK'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>
                          {item.date ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                        </div>
                        {item.durationMinutes > 0 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Duration: {item.durationMinutes} min
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          {item.joinedAt ? new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </div>
                      </td>
                      <td>
                        {item.type === 'online' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--info)' }}>
                            <Video size={14} /> Online
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <MapPin size={14} color="var(--primary)" /> {item.location || 'Faculty Room'}
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
                          onClick={() => handleRate(item)}
                          className="btn btn-outline-primary btn-sm"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Star size={13} /> Rate Tutor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        session={selectedSession}
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSuccess={() => fetchHistory()}
      />
    </div>
  );
};

export default StudentAttendanceHistory;
