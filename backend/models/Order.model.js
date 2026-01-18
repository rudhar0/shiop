// backend/models/Order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    category: String,
    image: String,
    size: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    required: true
  },
  remainingAmount: {
    type: Number,
    required: true
  },
  paymentOption: {
    type: String,
    enum: ['advance', 'full'],
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  collectionStatus: {
    type: String,
    enum: ['pending', 'collected', 'cancelled'],
    default: 'pending'
  },
  cancelledDate: {
    type: Date
  },
  cancelReason: {
    type: String
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate order ID
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = `SAM${Date.now()}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;