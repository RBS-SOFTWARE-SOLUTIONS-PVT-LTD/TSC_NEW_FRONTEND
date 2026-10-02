import axios from 'axios';

// Base API URL configuration
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request Interceptor: Attach JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tsc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract meaningful error messages & handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

    // Auto logout on token expiration
    if (status === 401 && localStorage.getItem('tsc_token')) {
      // Don't auto clear if we're on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('tsc_token');
        localStorage.removeItem('tsc_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    return Promise.reject(new Error(message));
  }
);

// ==========================================
// Authentication APIs
// ==========================================
export const authApi = {
  // Student & Tutor Login
  loginUser: async (email, password) => {
    const res = await apiClient.post('/api/user/login', { email, password });
    return res.data;
  },

  // Student & Tutor Signup
  signupUser: async (userData) => {
    const res = await apiClient.post('/api/user/signup', {
      ...userData,
      status: 'active'
    });
    return res.data;
  },

  // Admin Login
  loginAdmin: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  // Register new Admin (Admin only)
  createAdmin: async (email, password) => {
    const res = await apiClient.post('/auth/admin', { email, password });
    return res.data;
  },
};

// ==========================================
// User Directory APIs
// ==========================================
export const userApi = {
  getAllUsers: async () => {
    const res = await apiClient.get('/api/user/users');
    return res.data;
  },
};

// ==========================================
// Session APIs
// ==========================================
export const sessionApi = {
  // Get all sessions (with optional query filters: status, subject, type, search)
  getAllSessions: async (params = {}) => {
    const res = await apiClient.get('/api/session', { params });
    return res.data;
  },

  // Get tutor's own sessions
  getTutorSessions: async () => {
    const res = await apiClient.get('/api/session/tutor/my-sessions');
    return res.data;
  },

  // Get single session details
  getSessionById: async (id) => {
    const res = await apiClient.get(`/api/session/${id}`);
    return res.data;
  },

  // Tutor creates a new session
  createSession: async (sessionData) => {
    const res = await apiClient.post('/api/session/create', sessionData);
    return res.data;
  },

  // Tutor starts session (generates dynamic OTP + QR code)
  startSession: async (id) => {
    const res = await apiClient.patch(`/api/session/${id}/start`);
    return res.data;
  },

  // Tutor ends session (calculates duration and completed status)
  endSession: async (id) => {
    const res = await apiClient.patch(`/api/session/${id}/end`);
    return res.data;
  },

  // Tutor cancels session
  cancelSession: async (id) => {
    const res = await apiClient.patch(`/api/session/${id}/cancel`);
    return res.data;
  },

  // Student attends session via OTP or QR code
  attendSession: async (id, verificationPayload) => {
    // verificationPayload: { otp: "123456" } or { qrCode: "abc..." }
    const res = await apiClient.post(`/api/session/${id}/attend`, verificationPayload);
    return res.data;
  },

  // Tutor or Admin views live attendee list
  getSessionAttendees: async (id) => {
    const res = await apiClient.get(`/api/session/${id}/attendees`);
    return res.data;
  },

  // Student views their verified attendance history
  getMyAttendance: async () => {
    const res = await apiClient.get('/api/session/student/my-attendance');
    return res.data;
  },
};

// ==========================================
// Feedback APIs
// ==========================================
export const feedbackApi = {
  // Student submits feedback for a completed session
  submitFeedback: async ({ sessionId, rating, comment }) => {
    const res = await apiClient.post('/api/feedback/feedback', {
      sessionId,
      rating: Number(rating),
      comment: comment || '',
    });
    return res.data;
  },

  // Get feedback for a specific session
  getSessionFeedback: async (sessionId) => {
    const res = await apiClient.get(`/api/feedback/session/${sessionId}`);
    return res.data;
  },

  // Get feedback for a tutor (average + reviews)
  getTutorFeedback: async (tutorId = '') => {
    const endpoint = tutorId ? `/api/feedback/tutor/${tutorId}` : '/api/feedback/tutor';
    const res = await apiClient.get(endpoint);
    return res.data;
  },

  // Tutor rating details
  getTutorRating: async (tutorId) => {
    const res = await apiClient.get(`/api/feedback/tutor-ratings/${tutorId}`);
    return res.data;
  },

  // Highest rated tutor in system
  getHighestRatedTutor: async () => {
    const res = await apiClient.get('/api/feedback/highest-rated-tutor');
    return res.data;
  },

  // Admin views all feedback
  getAllFeedbacks: async () => {
    const res = await apiClient.get('/api/feedback/all');
    return res.data;
  },
};

// ==========================================
// Tutor Score & Award APIs
// ==========================================
export const scoreApi = {
  // Tutor's own current live score & rank
  getMyScore: async () => {
    const res = await apiClient.get('/api/score/my-score');
    return res.data;
  },

  // Live tutor scores for the current ongoing month
  getLiveScores: async () => {
    const res = await apiClient.get('/api/score/live');
    return res.data;
  },

  // Historical or specific monthly scores
  getMonthlyScores: async (year, month) => {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const res = await apiClient.get('/api/score/monthly', { params });
    return res.data;
  },

  // Annual scores for specified year
  getAnnualScores: async (year) => {
    const params = year ? { year } : {};
    const res = await apiClient.get('/api/score/annual', { params });
    return res.data;
  },

  // Annual awards summary and medalists
  getAnnualAwards: async (year) => {
    const params = year ? { year } : {};
    const res = await apiClient.get('/api/score/annual-awards', { params });
    return res.data;
  },
};

export default apiClient;
