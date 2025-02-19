const express = require('express');
const router = express.Router();
const MedicationHistory = require('../models/MedicationHistory');
const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/mark-taken', authMiddleware, async (req, res) => {
  try {
    const { prescriptionId, drugName } = req.body;
    const prescription = await Prescription.findById(prescriptionId);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    const medicine = prescription.medicines.find(m => m.drugName === drugName);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found in prescription' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const medicationRecord = new MedicationHistory({
      userId: req.user.id,
      prescriptionId,
      drugName: medicine.drugName,
      dosage: medicine.dosage,
      whenToTake: medicine.whenToTake,
      scheduledTime: medicine.timeToTake,
      dateScheduled: today
    });

    await medicationRecord.save();
    
    // Update notification
    await Notification.findOneAndUpdate(
      { 
        userId: req.user.id, 
        'data.prescriptionId': prescriptionId,
        'data.drugName': drugName,
        read: false
      },
      { read: true }
    );

    res.json(medicationRecord);
  } catch (err) {
    console.error('Error marking medication as taken:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get medication history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await MedicationHistory.find({ userId: req.user.id })
      .sort({ takenAt: -1 })
      .populate('prescriptionId', 'drugName dosage');
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
