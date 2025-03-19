const User = require('../models/User');
const Prescription = require('../models/Prescription');
const bcrypt = require('bcrypt');  // Changed back to bcrypt
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    // Filter out empty fields based on role
    const userData = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== '')
    );

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate required fields based on role
    if (role === 'doctor' && (!req.body.licenseNumber || !req.body.specialty || !req.body.hospital)) {
      return res.status(400).json({ 
        message: 'Missing required doctor fields: license number, specialty, or hospital name' 
      });
    }

    // Create new user with filtered data
    const user = new User(userData);
    const savedUser = await user.save();

    // Generate token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Send more specific error message
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message,
      details: error.errors // Include mongoose validation errors if any
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send both token and user data
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id).select('-password');
    
    const profile = {
        name: doctor.name,
        email: doctor.email,
        licenseNumber: doctor.licenseNumber || 'Not set',
        specialty: doctor.specialty || 'General Practice'
    };

    res.json(profile);
  } catch (error) {
    console.error('Doctor profile error:', error);
    res.status(500).json({ message: 'Error fetching doctor profile' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getDoctorProfile };
