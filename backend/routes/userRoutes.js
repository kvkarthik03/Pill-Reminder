const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getDoctorProfile } = require('../controllers/userController');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');  // Use only this auth middleware

// Public routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.get('/patients', auth, async (req, res) => {
    try {
        // Check if the requesting user is a doctor
        const doctor = await User.findById(req.user.id);
        if (doctor.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Get all patients
        const patients = await User.find({ role: 'patient' })
            .select('-password')
            .sort({ name: 1 });

        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/doctor-profile', auth, getDoctorProfile);

module.exports = router;
