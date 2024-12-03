const express = require('express');
const laundryController = require('../controllers/laundry.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

// Admin routes for managing laundry items
router.get('/items', authenticate, authorize(['admin']), laundryController.getAllItems);
router.post('/items', authenticate, authorize(['admin']), laundryController.addItem);
router.put('/items/:id', authenticate, authorize(['admin']), laundryController.updateItem);

// Public route for finding laundry locations
router.get('/locations/:zipCode', (req, res) => {
  const { zipCode } = req.params;
  res.json({
    name: 'Quick Clean Laundry',
    address: `${zipCode} Main Street`,
    rating: 4.5,
    phone: '555-0123',
    openingHours: '7:00 AM - 10:00 PM'
  });
});

module.exports = router;