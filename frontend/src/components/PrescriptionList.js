import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Dashboard.css';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const data = await api.getPrescriptions();
        setPrescriptions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load prescriptions');
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) return <div>Loading prescriptions...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!prescriptions.length) return <div>No prescriptions found</div>;

  return (
    <div className="prescription-container">
      <h2>Prescriptions</h2>
      <div className="prescription-list">
        {prescriptions.map(prescription => (
          <div key={prescription._id} className="prescription-item">
            <h3>{prescription.drugName}</h3>
            <p><strong>Dosage:</strong> {prescription.dosage}</p>
            <p><strong>When to take:</strong> {prescription.whenToTake}</p>
            <p><strong>Duration:</strong> {prescription.howLongToTake}</p>
            <p><strong>Time:</strong> {prescription.timeToTake}</p>
            {prescription.notes && <p><strong>Notes:</strong> {prescription.notes}</p>}
            {prescription.patientId && (
              <p><strong>Patient:</strong> {prescription.patientId.name}</p>
            )}
            {prescription.doctorId && (
              <p><strong>Doctor:</strong> {prescription.doctorId.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionList;
