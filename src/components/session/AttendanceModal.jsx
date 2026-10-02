import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { sessionApi } from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  KeyRound, 
  QrCode, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  AlertCircle,
  Video,
  MapPin,
  ChevronDown
} from 'lucide-react';

export const AttendanceModal = ({ session: initialSession, isOpen, onClose, onSuccess }) => {
  const { showSuccess, showError } = useToast();
  const [session, setSession] = useState(initialSession);
  const [activeSessions, setActiveSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('otp'); // 'otp' or 'qr'
  const [otp, setOtp] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingSessions, setFetchingSessions] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  useEffect(() => {
    if (isOpen && !initialSession) {
      setFetchingSessions(true);
      sessionApi.getAllSessions({ status: 'active' })
        .then((res) => {
          const list = res.data || [];
          setActiveSessions(list);
          if (list.length > 0) {
            setSession(list[0]);
          }
        })
        .catch((err) => console.error('Failed to load active sessions:', err))
        .finally(() => setFetchingSessions(false));
    }
  }, [isOpen, initialSession]);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!session || !session._id) {
      showError('Please select an active tutoring session first.');
      return;
    }

    setLoading(true);

    try {
      const payload = activeTab === 'otp' ? { otp: otp.trim() } : { qrCode: qrCode.trim() };

      if (activeTab === 'otp' && (!otp || otp.trim().length < 4)) {
        throw new Error('Please enter the 6-digit session OTP code shown by your tutor.');
      }

      if (activeTab === 'qr' && !qrCode.trim()) {
        throw new Error('Please paste or scan the QR verification code.');
      }

      const res = await sessionApi.attendSession(session._id, payload);
      setVerifiedData(res.data);
      showSuccess(res.message || 'Attendance verified successfully!');

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7A1631', '#D4A72C', '#16A34A', '#FAF9F6'],
        });
      } catch (e) {
        // Fallback if confetti blocked
      }

      if (onSuccess) {
        onSuccess(session._id);
      }
    } catch (err) {
      showError(err.message || 'Verification failed. Please check your OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOtp('');
    setQrCode('');
    setVerifiedData(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-content modal-responsive"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-main)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>Verify Attendance</h3>
          </div>
          <button
            onClick={handleClose}
            style={{ color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {verifiedData ? (
            /* Success State */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--success-light)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Attendance Recorded!
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                You have been officially checked into <strong>{session?.subject}</strong> ({session?.topic}).
              </p>

              <div
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Verification Method:</span>
                  <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{verifiedData.verificationMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Attendees:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{verifiedData.totalAttendees} students</span>
                </div>
              </div>

              <button onClick={handleClose} className="btn btn-primary" style={{ width: '100%' }}>
                Done
              </button>
            </div>
          ) : (
            /* Verification Form */
            <form onSubmit={handleVerify}>
              {/* Session Selector or Meta Preview */}
              {!initialSession && activeSessions.length > 1 ? (
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Select Active Session:</label>
                  <select
                    className="form-input"
                    value={session?._id || ''}
                    onChange={(e) => {
                      const found = activeSessions.find(s => s._id === e.target.value);
                      if (found) setSession(found);
                    }}
                  >
                    {activeSessions.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.subject}: {s.topic} ({s.tutorId?.name || s.tutor || 'Tutor'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : session ? (
                <div
                  style={{
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem 1rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    {session.subject}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {session.topic}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Tutor: {session.tutorId?.name || session.tutor || 'Faculty Tutor'}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: 'var(--warning-light)',
                    border: '1px solid var(--secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--warning-text)',
                  }}
                >
                  <AlertCircle size={20} style={{ margin: '0 auto 0.4rem' }} />
                  <strong>No Active Session Found</strong>
                  <p style={{ marginTop: '2px', fontSize: '0.8rem' }}>
                    Please wait until your tutor starts the session before checking in.
                  </p>
                </div>
              )}

              {/* Tab Selector: OTP vs QR */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  background: 'var(--border-light)',
                  padding: '4px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  gap: '4px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('otp')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: activeTab === 'otp' ? 700 : 500,
                    backgroundColor: activeTab === 'otp' ? 'var(--bg-surface)' : 'transparent',
                    color: activeTab === 'otp' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: activeTab === 'otp' ? 'var(--shadow-xs)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <KeyRound size={15} /> 6-Digit OTP
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: activeTab === 'qr' ? 700 : 500,
                    backgroundColor: activeTab === 'qr' ? 'var(--bg-surface)' : 'transparent',
                    color: activeTab === 'qr' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: activeTab === 'qr' ? 'var(--shadow-xs)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <QrCode size={15} /> QR Code Token
                </button>
              </div>

              {/* Method Input */}
              {activeTab === 'otp' ? (
                <div className="form-group">
                  <label className="form-label" htmlFor="otp-input">
                    Enter 6-Digit Session OTP:
                  </label>
                  <input
                    id="otp-input"
                    type="tel"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                    autoFocus
                    style={{
                      letterSpacing: '0.3em',
                      textAlign: 'center',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      padding: '0.75rem',
                    }}
                  />
                  <span className="form-helper" style={{ textAlign: 'center', marginTop: '6px' }}>
                    Ask your tutor for the live verification OTP broadcasted on screen.
                  </span>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label" htmlFor="qr-input">
                    QR Verification Token:
                  </label>
                  <input
                    id="qr-input"
                    type="text"
                    placeholder="Paste QR Code token string"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    className="form-input"
                    autoFocus
                    style={{ fontSize: '0.9rem' }}
                  />
                  <span className="form-helper">
                    Scanned code token payload provided in the classroom.
                  </span>
                </div>
              )}

              {/* Submit CTA */}
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !session}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {loading ? 'Verifying...' : 'Confirm Attendance'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
