require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize App
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sensors', require('./routes/sensorRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AquaPulse Backend running on Port ${PORT}`));