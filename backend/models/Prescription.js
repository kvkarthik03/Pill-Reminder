const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  drugName: { type: String, required: true },
  dosage: { type: String, required: true },
  whenToTake: { type: String, required: true },
  timeToTake: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.split(',').every(time => 
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time.trim())
        );
      },
      message: props => `${props.value} contains invalid time format! Use HH:MM`
    }
  }
});

const prescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [medicineSchema],
  howLongToTake: { type: String, required: true },
  notes: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
