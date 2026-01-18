// frontend/src/api/auth.api.js - Complete Updated Version
import axiosInstance from './axiosInstance';

export const authAPI = {
  // Register user (automatically sends OTP)
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send OTP (for retry or manual sending)
  sendOTP: async (data) => {
    try {
      const response = await axiosInstance.post('/auth/send-otp', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      const response = await axiosInstance.post('/auth/verify', { 
        email, 
        otp 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Forgot password - sends reset link to email
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { 
        email 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.patch('/user/update-me', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user details
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/user/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};