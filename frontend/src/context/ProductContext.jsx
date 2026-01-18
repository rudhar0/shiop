// frontend/src/context/ProductContext.jsx
import { createContext, useState, useEffect } from 'react';
import { productAPI } from '../api/product.api';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productAPI.getAllProducts();
      
      if (response.status === 'success') {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by category and search
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  // Get product by ID
  const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id) || product._id === id);
  };

  // Get featured products
  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
  };

  // Refresh products
  const refreshProducts = () => {
    fetchProducts();
  };

  const value = {
    products,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    getProductById,
    getFeaturedProducts,
    getProductsByCategory,
    refreshProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};