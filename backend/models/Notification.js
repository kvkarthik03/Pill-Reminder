const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['reminder', 'info', 'alert'], default: 'reminder' },
  read: { type: Boolean, default: false },
  scheduledTime: { type: String, required: true }, // Store time as HH:mm
  data: {
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
    drugName: String,
    dosage: String,
    whenToTake: String
  },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ userId: 1, scheduledTime: 1, createdAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
