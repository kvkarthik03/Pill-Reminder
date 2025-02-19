const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get patient profile
router.get('/patient-profile', authMiddleware, async (req, res) => {
  try {
    const patient = await User.findById(req.user.id);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
