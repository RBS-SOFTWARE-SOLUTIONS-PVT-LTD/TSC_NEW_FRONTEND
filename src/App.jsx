import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import MobileBottomNav from './components/common/MobileBottomNav';

// Public Pages

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BrowseSessionsPage from './pages/BrowseSessionsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendanceHistory from './pages/student/StudentAttendanceHistory';

// Tutor Pages
import TutorDashboard from './pages/tutor/TutorDashboard';
import TutorCreateSession from './pages/tutor/TutorCreateSession';
import TutorMySessions from './pages/tutor/TutorMySessions';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserDirectory from './pages/admin/AdminUserDirectory';
import AdminSessionAudit from './pages/admin/AdminSessionAudit';

export const App = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <div className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowseSessionsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Student Workspace */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/sessions" element={<BrowseSessionsPage />} />
                  <Route path="/student/attendance" element={<StudentAttendanceHistory />} />
                </Route>

                {/* Tutor Workspace */}
                <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
                  <Route path="/tutor/dashboard" element={<TutorDashboard />} />
                  <Route path="/tutor/create-session" element={<TutorCreateSession />} />
                  <Route path="/tutor/my-sessions" element={<TutorMySessions />} />
                </Route>

                {/* Admin Workspace */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUserDirectory />} />
                  <Route path="/admin/sessions" element={<AdminSessionAudit />} />
                </Route>

                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <MobileBottomNav />
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;

