const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get doctor profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id);
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
