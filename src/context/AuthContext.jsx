import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tsc_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('tsc_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Helper to decode JWT payload safely
  const parseJwt = (jwtToken) => {
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  };

  // Login for Student & Tutor
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.loginUser(email, password);
      const authToken = data.token;
      const loggedUser = {
        ...data.user,
        role: data.user.role || 'student',
      };

      localStorage.setItem('tsc_token', authToken);
      localStorage.setItem('tsc_user', JSON.stringify(loggedUser));

      setToken(authToken);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  // Login for Admin
  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.loginAdmin(email, password);
      const authToken = data.token;
      const decoded = parseJwt(authToken);

      const adminUser = {
        email: data.user?.email || email,
        name: decoded.name || 'TSC Administrator',
        role: 'admin',
        faculty: 'Faculty Administration',
      };

      localStorage.setItem('tsc_token', authToken);
      localStorage.setItem('tsc_user', JSON.stringify(adminUser));

      setToken(authToken);
      setUser(adminUser);
      return adminUser;
    } finally {
      setLoading(false);
    }
  };

  // Sign up for Students & Tutors
  const signup = async (userData) => {
    setLoading(true);
    try {
      const data = await authApi.signupUser(userData);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('tsc_token');
    localStorage.removeItem('tsc_user');
    setToken(null);
    setUser(null);
  };

  const role = user?.role || null;
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        loading,
        login,
        loginAdmin,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
