const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const laundryRoutes = require('./routes/laundry.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/laundry', laundryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});