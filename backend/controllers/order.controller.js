// backend/controllers/order.controller.js
const Order = require('../models/Order.model');
const mailService = require('../services/mailer');

// Create new order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, paidAmount, remainingAmount, paymentOption } = req.body;
    
    // Create order
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      paidAmount,
      remainingAmount,
      paymentOption,
      status: 'confirmed',
      collectionStatus: 'pending'
    });
    
    // Populate user details
    await order.populate('user', 'firstName lastName email');
    
    // Send confirmation email
    try {
      await mailService.sendEmail({
        recipient: req.user.email,
        subject: 'Order Confirmation - Samaira Collection',
        html: `
          <h2>Order Confirmed!</h2>
          <p>Dear ${req.user.firstName},</p>
          <p>Your order has been confirmed successfully.</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <p><strong>Amount Paid:</strong> ₹${paidAmount}</p>
          <p><strong>Remaining Amount:</strong> ₹${remainingAmount}</p>
          <p>Please visit our shop to collect your order.</p>
          <p>Thank you for shopping with Samaira Collection!</p>
        `,
        attachments: []
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }
    
    res.status(201).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get user's orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = { user: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ orderDate: -1 });
    
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

// Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email contact')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this order'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching order'
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const { cancelReason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to cancel this order'
      });
    }
    
    // Check if already cancelled
    if (order.status === 'cancelled') {
      return res.status(400).json({
        status: 'error',
        message: 'Order is already cancelled'
      });
    }
    
    // Update order
    order.status = 'cancelled';
    order.collectionStatus = 'cancelled';
    order.cancelledDate = new Date();
    order.cancelReason = cancelReason;
    
    await order.save();
    
    // Send cancellation email
    try {
      await mailService.sendEmail({
        recipient: req.user.email,
        subject: 'Order Cancelled - Samaira Collection',
        html: `
          <h2>Order Cancelled</h2>
          <p>Dear ${req.user.firstName},</p>
          <p>Your order has been cancelled as requested.</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Refund Amount:</strong> ₹${order.paidAmount}</p>
          <p>Refund will be processed within 5-7 business days.</p>
          <p>Thank you for choosing Samaira Collection!</p>
        `,
        attachments: []
      });
    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError);
    }
    
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error cancelling order'
    });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email contact')
      .populate('items.product')
      .sort({ orderDate: -1 });
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching orders'
    });
  }
};