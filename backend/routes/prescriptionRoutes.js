const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get prescriptions based on user role
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let prescriptions;

    if (user.role === 'doctor') {
      prescriptions = await Prescription.find({ doctorId: req.user.id })
        .populate('patientId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      prescriptions = await Prescription.find({ patientId: req.user.id })
        .populate('doctorId', 'name specialization')
        .sort({ createdAt: -1 });
    }

    res.json(prescriptions || []); // Ensure we always send an array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new prescription (doctors only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Received prescription data:', req.body); // Debug log

    // Verify doctor
    const doctor = await User.findById(req.user.id);
    if (doctor.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create prescriptions' });
    }

    // Verify patient exists
    const patient = await User.findById(req.body.patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    // Validate medicines array
    if (!Array.isArray(req.body.medicines) || req.body.medicines.length === 0) {
      return res.status(400).json({ message: 'At least one medicine is required' });
    }

    // Create prescription
    const prescription = new Prescription({
      doctorId: req.user.id,
      patientId: req.body.patientId,
      medicines: req.body.medicines,
      howLongToTake: req.body.howLongToTake,
      notes: req.body.notes
    });

    const savedPrescription = await prescription.save();
    console.log('Saved prescription:', savedPrescription); // Debug log

    const populatedPrescription = await Prescription.findById(savedPrescription._id)
      .populate('patientId', 'name')
      .populate('doctorId', 'name');

    res.status(201).json(populatedPrescription);
  } catch (err) {
    console.error('Prescription creation error:', err); // Debug log
    res.status(400).json({ 
      message: err.message || 'Failed to create prescription',
      details: err.errors // Include validation errors if any
    });
  }
});

// Update a prescription
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this prescription' });
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('patientId', 'name email');

    res.json(updatedPrescription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a prescription
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this prescription' });
    }

    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prescription deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
