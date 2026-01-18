// frontend/src/api/product.api.js
import axiosInstance from './axiosInstance';

export const productAPI = {
  // Get all products with optional filters
  getAllProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.featured) {
        params.append('featured', 'true');
      }
      
      const response = await axiosInstance.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single product by ID
  getProduct: async (productId) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await axiosInstance.get('/products?featured=true');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await axiosInstance.get(`/products?category=${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create product (Admin)
  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update product (Admin)
  updateProduct: async (productId, productData) => {
    try {
      const response = await axiosInstance.patch(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete product (Admin)
  deleteProduct: async (productId) => {
    try {
      const response = await axiosInstance.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};