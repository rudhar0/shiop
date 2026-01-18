// backend/controllers/admin.controller.js
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const User = require('../models/user');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });
    
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ]);
    
    const pendingRevenue = await Order.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        confirmedOrders,
        cancelledOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingRevenue: pendingRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching dashboard statistics'
    });
  }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, sortBy = '-orderDate' } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name category')
      .sort(sortBy);
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching orders'
    });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, collectionStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, collectionStatus },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email');
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating order status'
    });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password -otp -passwordResetToken')
      .sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching users'
    });
  }
};

// Get All Products (Admin - with more details)
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt');
    
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