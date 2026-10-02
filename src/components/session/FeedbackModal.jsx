import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { feedbackApi } from '../../services/api';
import confetti from 'canvas-confetti';
import { Star, X, Sparkles, MessageSquare, ThumbsUp } from 'lucide-react';

export const FeedbackModal = ({ session, isOpen, onClose, onSuccess }) => {
  const { showSuccess, showError } = useToast();
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !session) return null;

  const getRatingLabel = (val) => {
    if (val >= 9) return { text: 'Outstanding Peer Tutoring 🌟', color: '#B0881E' };
    if (val >= 7) return { text: 'Very Helpful & Clear 👍', color: 'var(--success)' };
    if (val >= 5) return { text: 'Good Session 🙂', color: 'var(--info)' };
    if (val >= 3) return { text: 'Satisfactory / Needs Improvement ⚠️', color: 'var(--warning)' };
    return { text: 'Unsatisfactory ❗', color: 'var(--error)' };
  };

  const currentLabel = getRatingLabel(rating);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await feedbackApi.submitFeedback({
        sessionId: session._id,
        rating: Number(rating),
        comment: comment.trim(),
      });

      showSuccess(res.message || 'Feedback submitted successfully!');

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4A72C', '#7A1631', '#16A34A'],
      });

      if (onSuccess) onSuccess(session._id);
      onClose();
    } catch (err) {
      showError(err.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px' }}
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
            <Star size={18} color="var(--secondary-dark)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>Tutor Feedback & Evaluation</h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Target Session Meta */}
          <div
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              {session.subject}
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              {session.topic}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Tutor: <strong>{session.tutorId?.name || session.tutor || 'Faculty Peer Tutor'}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Score Selector (1-10) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Academic Rating Score (1 to 10):
              </label>

              {/* Number Buttons Grid */}
              <div className="rating-grid-responsive" style={{ marginBottom: '0.85rem' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setRating(score)}
                    style={{
                      height: '44px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      border: '1.5px solid',
                      borderColor: rating === score ? 'var(--secondary)' : 'var(--border-color)',
                      backgroundColor: rating === score ? 'var(--primary)' : 'var(--bg-surface)',
                      color: rating === score ? '#FFFFFF' : 'var(--text-primary)',
                      boxShadow: rating === score ? 'var(--shadow-maroon)' : 'none',
                      transform: rating === score ? 'scale(1.04)' : 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {score}
                  </button>
                ))}
              </div>

              {/* Score Indicator Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Star size={16} color="var(--secondary)" fill="var(--secondary)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                    Score: {rating}/10
                  </span>
                </div>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: currentLabel.color }}>
                  {currentLabel.text}
                </span>
              </div>
            </div>

            {/* Qualitative Feedback Textarea */}
            <div className="form-group">
              <label className="form-label" htmlFor="feedback-comment">
                Constructive Remarks (Optional):
              </label>
              <textarea
                id="feedback-comment"
                rows={3}
                className="form-textarea"
                placeholder="Share your thoughts on the tutor's explanations, clarity, and session pacing..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Your peer review assists in faculty quality enhancement.</span>
                <span>{comment.length}/500</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-secondary"
                style={{ flex: 2 }}
              >
                {loading ? 'Submitting...' : 'Submit Evaluation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
