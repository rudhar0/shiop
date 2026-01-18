// frontend/src/api/admin.api.js
import axiosInstance from './axiosInstance';

export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Orders Management
  getAllOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      
      const response = await axiosInstance.get(`/admin/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await axiosInstance.patch(`/admin/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Products Management
  getAdminProducts: async () => {
    try {
      const response = await axiosInstance.get('/admin/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('/admin/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await axiosInstance.patch(`/admin/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await axiosInstance.delete(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Users Management
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};