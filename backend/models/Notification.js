const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['reminder', 'info', 'alert'], default: 'reminder' },
  read: { type: Boolean, default: false },
  scheduledTime: { type: String, required: true }, // HH:mm format
  timeCategory: { type: String, enum: ['morning', 'afternoon', 'evening'] },
  data: {
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
    drugName: String,
    dosage: String,
    whenToTake: String,
    // Adding additional fields for better tracking
    timingId: String, // To prevent duplicate notifications
    date: { type: Date, required: true } // The date this notification is for
  },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for efficient notification lookup
notificationSchema.index({ 
  userId: 1, 
  'data.timingId': 1, 
  'data.date': 1,
  scheduledTime: 1 
});

module.exports = mongoose.model('Notification', notificationSchema);
