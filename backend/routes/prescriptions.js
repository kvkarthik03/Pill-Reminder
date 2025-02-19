const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// Get all prescriptions
router.get('/', async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new prescription
router.post('/', async (req, res) => {
  const prescription = new Prescription({
    doctorId: req.body.doctorId,
    patientId: req.body.patientId,
    drugName: req.body.drugName,
    dosage: req.body.dosage,
    whenToTake: req.body.whenToTake,
    howLongToTake: req.body.howLongToTake,
    timeToTake: req.body.timeToTake,
    completed: req.body.completed,
    notes: req.body.notes
  });

  try {
    const newPrescription = await prescription.save();
    res.status(201).json(newPrescription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a prescription
router.put('/:id', async (req, res) => {
  try {
    const updatedPrescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPrescription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a prescription
router.delete('/:id', async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prescription deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
