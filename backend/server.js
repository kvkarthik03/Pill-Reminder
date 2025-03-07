require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const { checkAndCreateNotifications } = require('./utils/notificationScheduler');
const medicationRoutes = require('./routes/medicationRoutes');
// Add chat routes import
const chatRoutes = require('./routes/chatRoutes');

// Basic middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Test route first
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit at:', new Date().toISOString());
    res.json({
        message: 'API is working',
        timestamp: new Date().toISOString()
    });
});

// Mount all routes
app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/medication', medicationRoutes);
// Add chat routes
app.use('/api/chat', chatRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('- All original endpoints');
    console.log('- GET  /api/test');
    console.log('- POST /api/chat');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
