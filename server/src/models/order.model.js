const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => nanoid(10).toUpperCase()
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for unregistered users
  },
  customerPhone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  customerName: {
    type: String,
    required: true
  },
  items: [{
    type: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerItem: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'washing', 'ready', 'completed'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);