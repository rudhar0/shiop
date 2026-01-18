// frontend/src/api/order.api.js
import axiosInstance from './axiosInstance';

export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's orders
  getMyOrders: async (status = 'all') => {
    try {
      const params = status !== 'all' ? `?status=${status}` : '';
      const response = await axiosInstance.get(`/orders/my-orders${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single order
  getOrder: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId, cancelReason) => {
    try {
      const response = await axiosInstance.patch(`/orders/${orderId}/cancel`, {
        cancelReason
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all orders (Admin)
  getAllOrders: async () => {
    try {
      const response = await axiosInstance.get('/orders/admin/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};