import React, { useState, useEffect } from 'react';
import { sessionApi, feedbackApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { 
  ShieldCheck, 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  RefreshCw, 
  Video, 
  MapPin, 
  Sparkles,
  X,
  CheckCircle2,
  Star,
  MessageSquareQuote,
  Filter
} from 'lucide-react';

export const AdminSessionAudit = () => {
  const { showError } = useToast();
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'feedback'
  const [sessions, setSessions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected session for attendee audit modal
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, feedbacksRes] = await Promise.all([
        sessionApi.getAllSessions().catch(() => ({ data: [] })),
        feedbackApi.getAllFeedbacks().catch(() => ({ data: [] })),
      ]);

      setSessions(sessionsRes.data || []);
      setFeedbacks(feedbacksRes.data || []);
    } catch (err) {
      showError('Failed to fetch audit records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const handleViewAttendees = async (session) => {
    setSelectedSession(session);
    setIsAuditModalOpen(true);
    setLoadingAttendees(true);
    try {
      const res = await sessionApi.getSessionAttendees(session._id);
      setAttendees(res.attendees || []);
    } catch (err) {
      console.error(err);
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.subject?.toLowerCase().includes(term) ||
      s.topic?.toLowerCase().includes(term) ||
      s.tutorId?.name?.toLowerCase().includes(term) ||
      s.location?.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredFeedbacks = feedbacks.filter((f) => {
    const term = searchTerm.toLowerCase();
    return (
      f.studentId?.name?.toLowerCase().includes(term) ||
      f.tutorId?.name?.toLowerCase().includes(term) ||
      f.sessionId?.subject?.toLowerCase().includes(term) ||
      f.comment?.toLowerCase().includes(term)
    );
  });

  const totalCompleted = sessions.filter((s) => s.status === 'completed');
  const totalHours = (totalCompleted.reduce((acc, s) => acc + (s.durationMinutes || 0), 0) / 60).toFixed(1);
  const totalStudentAttendees = sessions.reduce((acc, s) => acc + (s.numOfStudents || s.loggedStudents?.length || 0), 0);

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) 
    : '5.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <ShieldCheck size={16} />
            Academic Quality & Compliance
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            Session & Feedback Auditing Log
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Official records of peer tutoring sessions, verified attendees, OTP timestamps, and authentic student evaluations.
          </p>
        </div>

        {/* Audit Metrics Pill */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Total Sessions
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
              {sessions.length}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Student Logs
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary-dark)', lineHeight: 1.1 }}>
              {totalStudentAttendees}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Avg Rating
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706', lineHeight: 1.1 }}>
              {averageRating} ★
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`btn btn-sm ${activeTab === 'sessions' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Calendar size={15} /> Session & Attendance Audit ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`btn btn-sm ${activeTab === 'feedback' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <MessageSquareQuote size={15} /> Student Feedback & Ratings ({feedbacks.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder={activeTab === 'sessions' ? 'Search session subject, topic, tutor name, or venue...' : 'Search student, tutor, topic, or review comments...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {activeTab === 'sessions' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select"
              style={{ width: 'auto', fontSize: '0.875rem' }}
            >
              <option value="all">All Session Statuses</option>
              <option value="active">Live Active Now</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>

        <button
          onClick={fetchAuditData}
          className="btn btn-outline btn-sm"
          title="Refresh audit log"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* =========================================================================
          TAB 1: SESSION & ATTENDANCE AUDIT TABLE
          ========================================================================= */}
      {activeTab === 'sessions' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
              Loading session audit database...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
              <Calendar size={44} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                No Session Records Found
              </h3>
              <p style={{ fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto' }}>
                No sessions match the current search criteria.
              </p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Session Subject & Topic</th>
                    <th>Peer Tutor</th>
                    <th>Date & Time</th>
                    <th>Delivery & Venue</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Attendees</th>
                    <th>Audit Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.subject}</div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{s.topic}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.tutorId?.name || 'Tutor'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.tutorId?.faculty || '-'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>
                          {s.date ? new Date(s.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                        </div>
                      </td>
                      <td>
                        {s.type === 'online' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--info)' }}>
                            <Video size={14} /> Online
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} color="var(--primary)" /> {s.location || 'Faculty Room'}
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {s.durationMinutes > 0 ? `${s.durationMinutes} min` : '-'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            s.status === 'active'
                              ? 'badge-success'
                              : s.status === 'scheduled'
                              ? 'badge-info'
                              : s.status === 'completed'
                              ? 'badge-gold'
                              : 'badge-error'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <strong>{s.numOfStudents || s.loggedStudents?.length || 0}</strong> students
                      </td>
                      <td>
                        <button
                          onClick={() => handleViewAttendees(s)}
                          className="btn btn-outline-primary btn-sm"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Users size={14} /> Roster ({s.loggedStudents?.length || 0})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: STUDENT FEEDBACK & RATINGS AUDIT TABLE
          ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
              Loading feedback audit records...
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
              <MessageSquareQuote size={44} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                No Student Feedback Records Found
              </h3>
              <p style={{ fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto' }}>
                No student reviews recorded matching your filter query.
              </p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Reviewer</th>
                    <th>Peer Tutor</th>
                    <th>Session Context</th>
                    <th>Rating Given</th>
                    <th>Student Comment & Qualitative Feedback</th>
                    <th>Date Logged</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedbacks.map((fb) => (
                    <tr key={fb._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {fb.studentId?.name || 'Student'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {fb.studentId?.userId ? `ID: ${fb.studentId.userId}` : fb.studentId?.email}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {fb.tutorId?.name || 'Peer Tutor'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {fb.tutorId?.faculty || 'Faculty'}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{fb.sessionId?.subject || 'Tutoring Class'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {fb.sessionId?.topic || ''}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 800, color: '#D97706', padding: '4px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--secondary-subtle)' }}>
                          <Star size={14} fill="#D97706" /> {fb.rating} / 10
                        </div>
                      </td>

                      <td style={{ maxWidth: '340px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                          "{fb.comment || 'Helpful and engaging tutoring session.'}"
                        </p>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Attendee Inspection Modal */}
      {isAuditModalOpen && selectedSession && (
        <div className="modal-overlay" onClick={() => setIsAuditModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '650px', width: '100%', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                  Session Attendee Audit
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  {selectedSession.subject}: {selectedSession.topic}
                </h3>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="btn btn-ghost" style={{ padding: '6px' }}>
                <X size={20} />
              </button>
            </div>

            {loadingAttendees ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                Verifying attendance logs...
              </div>
            ) : attendees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-muted)' }}>
                <Users size={36} style={{ opacity: 0.4, margin: '0 auto 0.5rem' }} />
                <p>No student check-ins recorded for this session.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Method</th>
                      <th>Check-in Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((att, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{att.name || att.studentId?.name || 'Student'}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {att.userId || att.studentId?.userId || '-'}
                        </td>
                        <td>
                          <span className="badge badge-info" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                            {att.verificationMethod || 'OTP'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {att.joinedAt ? new Date(att.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button onClick={() => setIsAuditModalOpen(false)} className="btn btn-primary btn-sm">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessionAudit;
