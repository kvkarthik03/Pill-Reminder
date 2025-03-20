import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Dashboard.css';

const DoctorDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prescriptionsData, patientsData] = await Promise.all([
          api.getPrescriptions(),
          api.getPatients()
        ]);
        setPrescriptions(prescriptionsData);
        setPatients(patientsData);
        setError(null);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Doctor's Dashboard</h1>
        <p>Manage your patients and prescriptions</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>My Patients</h2>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {patients.length === 0 ? (
            <div className="empty-state">
              <i className="far fa-user"></i>
              <p>No patients registered</p>
            </div>
          ) : (
            <div className="patients-list">
              {filteredPatients.length === 0 ? (
                <p>No patients found</p>
              ) : (
                filteredPatients.map(patient => (
                  <div key={patient._id} className="patient-item">
                    <h3>{patient.name}</h3>
                    <p>Email: {patient.email}</p>
                    <button 
                      onClick={() => history.push(`/create-prescription?patientId=${patient._id}`)}
                      className="btn-primary"
                    >
                      Create Prescription
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h2>Recent Prescriptions</h2>
          {prescriptions.length === 0 ? (
            <div className="empty-state">
              <i className="far fa-file-medical"></i>
              <p>No prescriptions created yet</p>
            </div>
          ) : (
            <div className="prescription-list">
              {prescriptions.map(prescription => (
                <div key={prescription._id} className="prescription-item">
                  <h3>Patient: {prescription.patientId?.name || 'Unknown'}</h3>
                  <p><strong>Prescribed on:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>
                  <p><strong>Duration:</strong> {prescription.howLongToTake} days</p>
                  <div className="medicines-list">
                    <h4>Medicines:</h4>
                    {prescription.medicines.map((medicine, index) => (
                      <div key={index} className="medicine-details">
                        <p><strong>{index + 1}. {medicine.drugName}</strong></p>
                        <p>Dosage: {medicine.dosage}</p>
                        <p>When: {medicine.whenToTake}</p>
                        <p>Time: {medicine.timeToTake}</p>
                      </div>
                    ))}
                  </div>
                  {prescription.notes && (
                    <p><strong>Notes:</strong> {prescription.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="btn-primary"
              onClick={() => history.push('/create-prescription')}
            >
              Create New Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
