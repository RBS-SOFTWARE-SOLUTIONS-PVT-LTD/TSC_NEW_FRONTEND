import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  User, 
  CheckCircle2, 
  Radio, 
  Sparkles, 
  Star,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const SessionCard = ({
  session,
  userRole,
  userId,
  onAttend,
  onFeedback,
  onStart,
  onEnd,
  onCancel,
  onManage,
  hasAttended = false,
  hasFeedback = false,
}) => {
  const isOwner = session.tutorId && (session.tutorId._id === userId || session.tutorId === userId || session.tutorId.userId === userId);
  const isOnline = session.type === 'online';
  const isPhysical = session.type === 'physical';

  // Format date and time
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const d = new Date(timeString);
    return isNaN(d.getTime())
      ? timeString
      : d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const tutorName = session.tutorId?.name || (typeof session.tutor === 'string' ? session.tutor : session.tutor?.name) || 'Faculty Tutor';
  const tutorFaculty = session.tutorId?.faculty || session.tutor?.faculty || 'University of Kelaniya';

  // Badge configuration based on status
  const getStatusBadge = () => {
    switch (session.status) {
      case 'active':
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span className="status-dot status-dot-active" />
            Live Now
          </span>
        );
      case 'scheduled':
        return (
          <span className="badge badge-info">
            <span className="status-dot status-dot-scheduled" />
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="badge badge-gold">
            <CheckCircle2 size={12} />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge badge-error">
            Cancelled
          </span>
        );
      default:
        return <span className="badge">{session.status}</span>;
    }
  };

  return (
    <div
      className={`card ${session.status === 'active' ? 'card-gold-accent' : 'card-maroon-accent'}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        backgroundColor: session.status === 'active' ? '#FCFAF5' : 'var(--bg-surface)',
        borderColor: session.status === 'active' ? 'var(--secondary)' : 'var(--border-color)',
      }}
    >
      <div>
        {/* Top Header: Subject & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--primary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              {session.subject}
            </span>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.3 }}>
              {session.topic}
            </h3>
          </div>
          {getStatusBadge()}
        </div>

        {/* Tutor Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-main)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <User size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tutorName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tutorFaculty}
            </div>
          </div>
        </div>

        {/* Schedule & Venue Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} color="var(--primary)" />
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{formatDate(session.date)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={15} color="var(--primary)" />
            <span>
              {formatTime(session.scheduledStartTime)} - {formatTime(session.scheduledEndTime)}
              {session.durationMinutes > 0 && ` (${session.durationMinutes} min)`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isOnline ? (
              <>
                <Video size={15} color="var(--info)" />
                <span style={{ color: 'var(--info-text)', fontWeight: 500 }}>Online Virtual Classroom</span>
              </>
            ) : (
              <>
                <MapPin size={15} color="var(--primary)" />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {session.location || 'Faculty Tutoring Room'}
                </span>
              </>
            )}
          </div>

          {session.numOfStudents !== undefined && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              👥 <strong>{session.numOfStudents}</strong> student{session.numOfStudents === 1 ? '' : 's'} registered / checked-in
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '0.875rem',
          marginTop: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {/* Student Actions */}
        {userRole === 'student' && (
          <>
            {session.status === 'active' && !hasAttended && (
              <button
                onClick={() => onAttend(session)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                <Radio size={15} className="animate-pulse" />
                Check In Now (OTP / QR)
              </button>
            )}

            {hasAttended && session.status === 'active' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success-text)', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--success)" />
                Attendance Verified!
              </div>
            )}

            {session.status === 'completed' && hasAttended && !hasFeedback && (
              <button
                onClick={() => onFeedback(session)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                <Star size={15} />
                Rate Tutor & Session
              </button>
            )}

            {session.status === 'completed' && hasFeedback && (
              <span className="badge badge-success" style={{ flex: 1, justifyContent: 'center' }}>
                <CheckCircle2 size={12} /> Feedback Submitted
              </span>
            )}

            {session.status === 'scheduled' && (
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Session opens when tutor starts the class.
              </div>
            )}
          </>
        )}

        {/* Tutor Actions */}
        {userRole === 'tutor' && (
          <>
            {session.status === 'scheduled' && (
              <>
                <button
                  onClick={() => onStart(session._id)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Radio size={15} /> Start Session
                </button>
                <button
                  onClick={() => onCancel(session._id)}
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--error)' }}
                >
                  Cancel
                </button>
              </>
            )}

            {session.status === 'active' && (
              <button
                onClick={() => onManage(session)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, backgroundColor: '#8F1D3B' }}
              >
                <Radio size={15} /> Open Control Room (OTP / QR)
              </button>
            )}

            {session.status === 'completed' && (
              <button
                onClick={() => onManage(session)}
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
              >
                View Attendee Log ({session.numOfStudents || 0})
              </button>
            )}
          </>
        )}

        {/* Public / Admin view */}
        {(!userRole || userRole === 'admin') && (
          <button
            onClick={() => onManage && onManage(session)}
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
          >
            <span>View Session Details</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
