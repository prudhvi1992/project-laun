const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes
router.get('/track/:orderId', orderController.getOrderByTrackingId);

// Admin routes
router.post('/', authenticate, authorize(['admin']), orderController.createOrder);
router.get('/all', authenticate, authorize(['admin']), orderController.getAllOrders);
router.patch('/:orderId/status', authenticate, authorize(['admin']), orderController.updateOrderStatus);

// User routes
router.get('/user', authenticate, orderController.getUserOrders);

module.exports = router;