import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/CreatePrescription.css';

const calculateTimeRange = (category) => {
  switch (category) {
    case 'morning':
      return { min: '05:00', max: '11:59' };
    case 'afternoon':
      return { min: '12:00', max: '16:59' };
    case 'evening':
      return { min: '17:00', max: '23:59' };
    default:
      return { min: '00:00', max: '23:59' };
  }
};

const CreatePrescription = () => {
  const history = useHistory();
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emptyMedicine = {
    drugName: '',
    dosage: '',
    whenToTake: 'after_meal',
    timeToTake: '',
    newTime: ''
  };

  const [formData, setFormData] = useState({
    patientId: new URLSearchParams(location.search).get('patientId') || '',
    medicines: [{ ...emptyMedicine }],
    howLongToTake: '7',
    notes: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await api.getPatients();
        setPatients(data);
      } catch (err) {
        setError('Failed to load patients');
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate all medicines have times selected
    const isValid = formData.medicines.every(medicine => medicine.timeToTake);
    if (!isValid) {
      setError('Please select times for all medications');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting prescription:', formData); // Debug log
      const response = await api.createPrescription({
        patientId: formData.patientId,
        medicines: formData.medicines,
        howLongToTake: formData.howLongToTake,
        notes: formData.notes
      });

      if (response._id) {
        console.log('Prescription created successfully:', response); // Debug log
        history.push('/doctor-dashboard');
      } else {
        setError('Failed to create prescription. Please try again.');
      }
    } catch (err) {
      console.error('Prescription creation error:', err); // Debug log
      setError(err.message || 'Failed to create prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { ...emptyMedicine }]
    }));
  };

  const handleRemoveMedicine = (index) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map((medicine, i) => 
        i === index ? { ...medicine, [field]: value } : medicine
      )
    }));
  };

  const handleTimeChange = (index, time) => {
    const formattedTime = time.replace('T', ' ').substring(0, 5); // Convert to HH:mm format
    handleMedicineChange(index, 'timeToTake', formattedTime);
  };

  const addTimeToMedicine = (index) => {
    const medicine = formData.medicines[index];
    const currentTimes = medicine.timeToTake ? medicine.timeToTake.split(',').filter(t => t.trim()) : [];
    const timesSet = new Set(currentTimes);
    
    if (medicine.newTime && !timesSet.has(medicine.newTime)) {
      const updatedTimes = [...currentTimes, medicine.newTime].sort();
      handleMedicineChange(index, 'timeToTake', updatedTimes.join(','));
    }
    // Clear the new time input
    handleMedicineChange(index, 'newTime', '');
  };

  const removeTime = (medicineIndex, timeToRemove) => {
    const medicine = formData.medicines[medicineIndex];
    const times = medicine.timeToTake.split(',').filter(t => t.trim() !== timeToRemove);
    handleMedicineChange(medicineIndex, 'timeToTake', times.join(','));
  };

  const whenToTakeOptions = [
    { value: 'before_meal', label: 'Before Meals' },
    { value: 'after_meal', label: 'After Meals' },
    { value: 'with_meal', label: 'With Meals' },
    { value: 'empty_stomach', label: 'On Empty Stomach' }
  ];

  const durationOptions = [
    { value: '3', label: '3 days' },
    { value: '5', label: '5 days' },
    { value: '7', label: '1 week' },
    { value: '14', label: '2 weeks' },
    { value: '30', label: '1 month' }
  ];

  const timeCategories = [
    { id: 'morning', label: 'Morning Time', placeholder: 'Enter morning time' },
    { id: 'afternoon', label: 'Afternoon Time', placeholder: 'Enter afternoon time' },
    { id: 'evening', label: 'Night Time', placeholder: 'Enter night time' }
  ];

  const updateMedicineTime = (index, value, timeCategory) => {
    const medicine = formData.medicines[index];
    const times = medicine.timeToTake ? medicine.timeToTake.split(',').filter(t => t.trim()) : [];
    let updatedTimes = times.filter(t => {
      // Keep times from other categories
      const [hours] = t.split(':').map(Number);
      if (timeCategory === 'morning' && (hours >= 5 && hours < 12)) return false;
      if (timeCategory === 'afternoon' && (hours >= 12 && hours < 17)) return false;
      if (timeCategory === 'evening' && (hours >= 17 || hours < 5)) return false;
      return true;
    });

    if (value) {
      updatedTimes.push(value);
    }

    handleMedicineChange(index, 'timeToTake', updatedTimes.sort().join(','));
  };

  const getTimeCategoryLabel = (category) => {
    const ranges = calculateTimeRange(category);
    return `${category.charAt(0).toUpperCase() + category.slice(1)} (${ranges.min} - ${ranges.max})`;
  };

  return (
    <div className="create-prescription-container">
      <h2>Create New Prescription</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="prescription-form">
        <div className="form-group">
          <label>Patient</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={(e) => setFormData({...formData, patientId: e.target.value})}
            required
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {formData.medicines.map((medicine, index) => (
          <div key={index} className="medicine-container">
            <h3>Medicine {index + 1}</h3>
            <div className="form-group">
              <label>Medication Name</label>
              <input
                type="text"
                value={medicine.drugName}
                onChange={(e) => handleMedicineChange(index, 'drugName', e.target.value)}
                required
                placeholder="Enter medication name"
              />
            </div>

            <div className="form-group">
              <label>Dosage</label>
              <input
                type="text"
                value={medicine.dosage}
                onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                required
                placeholder="e.g., 1 tablet, 5ml, etc."
              />
            </div>

            <div className="form-group">
              <label>When to Take</label>
              <select
                value={medicine.whenToTake}
                onChange={(e) => handleMedicineChange(index, 'whenToTake', e.target.value)}
                required
              >
                {whenToTakeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Time to Take</label>
              <div className="time-inputs-grid">
                {['morning', 'afternoon', 'evening'].map(category => (
                  <div key={category} className="time-input-group">
                    <label>{getTimeCategoryLabel(category)}</label>
                    <input
                      type="time"
                      className="time-input"
                      min={calculateTimeRange(category).min}
                      max={calculateTimeRange(category).max}
                      onChange={(e) => {
                        const time = e.target.value;
                        if (time) {
                          const [hours] = time.split(':').map(Number);
                          const timeCategory = category;
                          const range = calculateTimeRange(timeCategory);
                          
                          if (time >= range.min && time <= range.max) {
                            updateMedicineTime(index, time, timeCategory);
                          } else {
                            alert(`Please select a time between ${range.min} and ${range.max} for ${timeCategory}`);
                            e.target.value = '';
                          }
                        }
                      }}
                      placeholder={`Enter ${category} time`}
                    />
                  </div>
                ))}
              </div>
              {medicine.timeToTake && (
                <div className="selected-times">
                  <p>Selected times: {medicine.timeToTake.split(',').join(', ')}</p>
                </div>
              )}
            </div>

            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveMedicine(index)}
                className="remove-medicine-btn"
              >
                Remove Medicine
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddMedicine}
          className="add-medicine-btn"
        >
          Add Another Medicine
        </button>

        <div className="form-group">
          <label>Duration</label>
          <select
            name="howLongToTake"
            value={formData.howLongToTake}
            onChange={(e) => setFormData({...formData, howLongToTake: e.target.value})}
            required
          >
            {durationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Any special instructions or notes"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Prescription'}
        </button>
      </form>
    </div>
  );
};

export default CreatePrescription;
