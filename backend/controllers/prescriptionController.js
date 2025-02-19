const Prescription = require('../models/Prescription');

// Add a new prescription
const addPrescription = async (req, res) => {
  const { doctorId, patientId, drugName, dosage, whenToTake, howLongToTake, timeToTake } = req.body;
  try {
    const prescription = new Prescription({ doctorId, patientId, drugName, dosage, whenToTake, howLongToTake, timeToTake });
    await prescription.save();
    res.status(201).json({ message: 'Prescription added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get prescriptions for a patient
const getPrescriptions = async (req, res) => {
  const { patientId } = req.params;
  try {
    const prescriptions = await Prescription.find({ patientId });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark prescription as completed
const markPrescriptionCompleted = async (req, res) => {
  const { id } = req.params;
  try {
    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    prescription.completed = true;
    await prescription.save();
    res.json({ message: 'Prescription marked as completed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addPrescription, getPrescriptions, markPrescriptionCompleted };
