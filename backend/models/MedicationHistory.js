const mongoose = require('mongoose');

const medicationHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
  drugName: { type: String, required: true },
  dosage: { type: String, required: true },
  whenToTake: { type: String, required: true },
  takenAt: { type: Date, default: Date.now },
  scheduledTime: { type: String, required: true },
  dateScheduled: { type: Date, required: true }
});

medicationHistorySchema.index({ userId: 1, prescriptionId: 1, drugName: 1, dateScheduled: 1 });

module.exports = mongoose.model('MedicationHistory', medicationHistorySchema);
