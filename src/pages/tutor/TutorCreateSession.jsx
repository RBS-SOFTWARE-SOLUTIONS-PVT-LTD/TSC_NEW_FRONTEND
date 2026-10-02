import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { 
  PlusCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  BookOpen, 
  ArrowLeft, 
  Sparkles,
  Info
} from 'lucide-react';

export const TutorCreateSession = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    type: 'physical', // 'physical' or 'online'
    location: '',
    meetingLink: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.topic || !formData.date || !formData.startTime || !formData.endTime) {
      showError('Please complete all required session fields.');
      return;
    }

    if (formData.type === 'physical' && !formData.location.trim()) {
      showError('Please specify the physical classroom venue / laboratory location.');
      return;
    }

    if (formData.type === 'online' && !formData.meetingLink.trim()) {
      showError('Please provide the virtual meeting link (Google Meet / Zoom / MS Teams).');
      return;
    }

    // Construct full ISO datetime strings
    const scheduledStartTime = new Date(`${formData.date}T${formData.startTime}:00`);
    const scheduledEndTime = new Date(`${formData.date}T${formData.endTime}:00`);

    if (scheduledEndTime <= scheduledStartTime) {
      showError('Session end time must be after the start time.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        subject: formData.subject.trim(),
        topic: formData.topic.trim(),
        type: formData.type,
        location: formData.type === 'physical' ? formData.location.trim() : 'Online Virtual Classroom',
        meetingLink: formData.type === 'online' ? formData.meetingLink.trim() : '',
        date: new Date(formData.date),
        scheduledStartTime: scheduledStartTime.toISOString(),
        scheduledEndTime: scheduledEndTime.toISOString(),
      };

      const res = await sessionApi.createSession(payload);
      showSuccess(res.message || 'Peer tutoring session created successfully!');
      navigate('/tutor/my-sessions');
    } catch (err) {
      showError(err.message || 'Failed to create session. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => navigate('/tutor/dashboard')}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '0.75rem', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Sparkles size={16} />
          Session Scheduler
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
          Schedule New Peer Tutoring Class
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Create an official university session. Students will be able to discover and attend your class.
        </p>
      </div>

      {/* Form Card */}
      <div
        className="card card-maroon-accent"
        style={{ padding: '2.5rem 2rem', backgroundColor: '#FFFFFF' }}
      >
        <form onSubmit={handleSubmit}>
          {/* Subject Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="subject">
              Subject / Course Title:
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              placeholder="e.g. Software Engineering (SENG 21213) or Calculus II"
              value={formData.subject}
              onChange={handleChange}
              className="form-input"
            />
            <span className="form-helper">
              Provide course title or academic discipline name.
            </span>
          </div>

          {/* Topic Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="topic">
              Session Topic / Lesson Focus:
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              required
              placeholder="e.g. Clean Architecture, React Hooks & State Management, or Midterm Revision"
              value={formData.topic}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Delivery Mode Toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Delivery Mode:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'physical' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid',
                  borderColor: formData.type === 'physical' ? 'var(--primary)' : 'var(--border-color)',
                  backgroundColor: formData.type === 'physical' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                  color: formData.type === 'physical' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <MapPin size={18} /> Physical Classroom
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'online' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid',
                  borderColor: formData.type === 'online' ? 'var(--info)' : 'var(--border-color)',
                  backgroundColor: formData.type === 'online' ? 'var(--info-light)' : 'var(--bg-surface)',
                  color: formData.type === 'online' ? 'var(--info-text)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Video size={18} /> Online Virtual Classroom
              </button>
            </div>
          </div>

          {/* Conditional Venue / Meeting Link */}
          {formData.type === 'physical' ? (
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Physical Campus Venue / Room:
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="e.g. FCT Lab 02, Science Lecture Hall A3, or Library Discussion Room"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label" htmlFor="meetingLink">
                Virtual Classroom Meeting URL:
              </label>
              <input
                id="meetingLink"
                name="meetingLink"
                type="url"
                required
                placeholder="e.g. https://meet.google.com/abc-defg-hij or Zoom Link"
                value={formData.meetingLink}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          )}

          {/* Date & Time Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            {/* Session Date */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="date">
                Session Date:
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Scheduled Start Time */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="startTime">
                Start Time:
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Scheduled End Time */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="endTime">
                End Time:
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Academic Invariant Note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.875rem 1rem',
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
            }}
          >
            <Info size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Academic Verification Process:</strong> When you start the session, a dynamic 6-digit OTP and QR code will be generated for student attendance verification. Once you end the session, tutoring hours are calculated automatically based on server timestamps.
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/tutor/dashboard')}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              <PlusCircle size={18} />
              {loading ? 'Creating Session...' : 'Publish Peer Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorCreateSession;
