const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');
const { testNotification } = require('../utils/notificationScheduler');

// Get user's notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const notifications = await Notification.find({
      userId: req.user.id,
      createdAt: { $gte: today }
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new notification
router.post('/', async (req, res) => {
  const notification = new Notification({
    userId: req.body.userId,
    message: req.body.message,
    read: req.body.read,
  });

  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { 
        _id: req.params.id,
        userId: req.user.id
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Test notification route (remove in production)
router.post('/test', authMiddleware, async (req, res) => {
  try {
    const { prescriptionId } = req.body;
    const success = await testNotification(req.user.id, prescriptionId);
    if (success) {
      res.json({ message: 'Test notification created' });
    } else {
      res.status(400).json({ message: 'Failed to create test notification' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
