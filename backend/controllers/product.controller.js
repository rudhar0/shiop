// backend/controllers/product.controller.js
const Product = require('../models/Product.model');

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching products'
    });
  }
};

// Get single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching product'
    });
  }
};

// Create product (Admin only - for now anyone can create)
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting product'
    });
  }
};