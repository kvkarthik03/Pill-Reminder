const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const { checkAndCreateNotifications } = require('./utils/notificationScheduler');

const medicationRoutes = require('./routes/medicationRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/medication', medicationRoutes); // Add this line

// Add logging for notification checks
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Running notification check...`);
  checkAndCreateNotifications().catch(err => {
    console.error('Notification check failed:', err);
  });
}, 30000); // Check every 30 seconds

// Run initial check on server start
console.log('Starting initial notification check...');
checkAndCreateNotifications().catch(err => {
  console.error('Initial notification check failed:', err);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
