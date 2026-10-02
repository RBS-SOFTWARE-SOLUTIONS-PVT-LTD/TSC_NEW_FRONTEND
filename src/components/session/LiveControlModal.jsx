import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '../../context/ToastContext';
import { sessionApi } from '../../services/api';
import { 
  Radio, 
  X, 
  Users, 
  Copy, 
  Check, 
  StopCircle, 
  RefreshCw, 
  Clock, 
  Sparkles,
  QrCode,
  KeyRound
} from 'lucide-react';

export const LiveControlModal = ({ session, isOpen, onClose, onSessionEnded }) => {
  const { showSuccess, showError, showInfo } = useToast();
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [ending, setEnding] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const fetchAttendees = async () => {
    if (!session?._id) return;
    setLoadingAttendees(true);
    try {
      const res = await sessionApi.getSessionAttendees(session._id);
      setAttendees(res.attendees || []);
    } catch (err) {
      console.error('Error fetching attendees:', err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  useEffect(() => {
    if (isOpen && session?._id) {
      fetchAttendees();
      const interval = setInterval(fetchAttendees, 10000); // Poll roster every 10s

      // Elapsed time counter
      const start = session.actualStartTime ? new Date(session.actualStartTime).getTime() : Date.now();
      const timeInterval = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - start) / 60000);
        setElapsedMinutes(diff >= 0 ? diff : 0);
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(timeInterval);
      };
    }
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const handleCopyOtp = () => {
    if (session.otp) {
      navigator.clipboard.writeText(session.otp);
      setCopiedOtp(true);
      showInfo('OTP copied to clipboard');
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  const handleEndSession = async () => {
    if (!window.confirm('Are you sure you want to conclude this session? This will finalize verified attendance and calculate tutoring duration.')) {
      return;
    }

    setEnding(true);
    try {
      const res = await sessionApi.endSession(session._id);
      showSuccess(res.message || 'Session ended successfully!');
      if (onSessionEnded) onSessionEnded(session._id);
      onClose();
    } catch (err) {
      showError(err.message || 'Failed to conclude session.');
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--primary)',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="status-dot status-dot-active" />
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>Live Session Control Center</h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#FAF9F6', padding: '4px', borderRadius: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Session Header Info */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                {session.subject}
              </span>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {session.topic}
              </h4>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '0.825rem',
              }}
            >
              <Clock size={15} />
              <span>Elapsed: {elapsedMinutes} min</span>
            </div>
          </div>

          {/* Broadcast Codes Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.75rem',
            }}
          >
            {/* 6-Digit OTP Block */}
            <div
              style={{
                background: 'var(--bg-main)',
                border: '2px dashed var(--primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <KeyRound size={15} />
                Live Attendance OTP
              </div>

              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  color: 'var(--primary)',
                  margin: '0.75rem 0',
                  padding: '0.4rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {session.otp || '------'}
              </div>

              <button
                onClick={handleCopyOtp}
                className="btn btn-outline-primary btn-sm"
              >
                {copiedOtp ? <Check size={14} /> : <Copy size={14} />}
                {copiedOtp ? 'Copied' : 'Copy Code'}
              </button>
            </div>

            {/* QR Code Block */}
            <div
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <QrCode size={15} />
                Classroom QR Scan
              </div>

              <div style={{ background: '#FFFFFF', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {session.qrCode ? (
                  <QRCodeSVG
                    value={session.qrCode}
                    size={110}
                    fgColor="#7A1631"
                    bgColor="#FFFFFF"
                    level="M"
                  />
                ) : (
                  <div style={{ width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No QR
                  </div>
                )}
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Students scan directly with mobile
              </span>
            </div>
          </div>

          {/* Attendee Roster Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Verified Attendee Roster ({attendees.length})
                </h4>
              </div>
              <button
                onClick={fetchAttendees}
                disabled={loadingAttendees}
                className="btn btn-ghost btn-sm"
              >
                <RefreshCw size={14} className={loadingAttendees ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            <div
              style={{
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
              }}
            >
              {attendees.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No students checked in yet. Share the OTP or QR code to record attendance.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#F7F5F0', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Student Name</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Faculty / ID</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Method</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>
                          {item.student?.name || 'Verified Student'}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>
                          {item.student?.faculty || item.student?.userId || '-'}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                            {item.verificationMethod || 'OTP'}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {item.joinedAt ? new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              Keep Running in Background
            </button>
            <button
              type="button"
              disabled={ending}
              onClick={handleEndSession}
              className="btn btn-danger"
              style={{ flex: 1.5 }}
            >
              <StopCircle size={16} />
              {ending ? 'Concluing...' : 'Conclude & Save Hours'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveControlModal;
