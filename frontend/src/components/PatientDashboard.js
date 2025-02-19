import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Dashboard.css';

const PatientDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [takenMedications, setTakenMedications] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptionsData, remindersData, historyData] = await Promise.all([
          api.getPrescriptions(),
          api.getNotifications(),
          api.getMedicationHistory()
        ]);
        setPrescriptions(prescriptionsData);
        setReminders(remindersData);
        setMedicationHistory(historyData);

        // Create a set of taken medications for today
        const today = new Date().toDateString();
        const takenToday = new Set(
          historyData
            .filter(record => new Date(record.takenAt).toDateString() === today)
            .map(record => `${record.prescriptionId._id || record.prescriptionId}-${record.drugName}`)
        );
        setTakenMedications(takenToday);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Set up reminder check interval
    const interval = setInterval(fetchData, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsTaken = async (prescriptionId, drugName) => {
    try {
      await api.markMedicationTaken(prescriptionId, drugName);
      setTakenMedications(prev => new Set([...prev, `${prescriptionId}-${drugName}`]));
      // Refresh all data after marking as taken
      const [prescriptionsData, remindersData, historyData] = await Promise.all([
        api.getPrescriptions(),
        api.getNotifications(),
        api.getMedicationHistory()
      ]);
      setPrescriptions(prescriptionsData);
      setReminders(remindersData);
      setMedicationHistory(historyData);
    } catch (err) {
      setError('Failed to mark medication as taken');
      console.error('Error marking medication as taken:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markNotificationRead(notificationId);
      // Update the notifications list to reflect the change
      setReminders(reminders.map(reminder =>
        reminder._id === notificationId
          ? { ...reminder, read: true }
          : reminder
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to update notification');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard">
      <h1>My Health Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Active Prescriptions</h2>
          <div className="prescription-list">
            {prescriptions.length === 0 ? (
              <p>No active prescriptions</p>
            ) : (
              prescriptions.map(prescription => (
                <div key={prescription._id} className="prescription-item">
                  <h3>Prescribed on: {new Date(prescription.createdAt).toLocaleDateString()}</h3>
                  <p><strong>Duration:</strong> {prescription.howLongToTake}</p>
                  {prescription.medicines.map((medicine, index) => (
                    <div key={index} className="medicine-item">
                      <h4>{medicine.drugName}</h4>
                      <p><strong>Dosage:</strong> {medicine.dosage}</p>
                      <p><strong>When to take:</strong> {medicine.whenToTake}</p>
                      <p><strong>Time:</strong> {medicine.timeToTake}</p>
                      {!takenMedications.has(`${prescription._id}-${medicine.drugName}`) && (
                        <button 
                          onClick={() => handleMarkAsTaken(prescription._id, medicine.drugName)}
                          className="btn-primary"
                        >
                          Mark as Taken
                        </button>
                      )}
                      {takenMedications.has(`${prescription._id}-${medicine.drugName}`) && (
                        <p className="taken-status">✓ Taken today</p>
                      )}
                    </div>
                  ))}
                  {prescription.notes && (
                    <div className="prescription-notes">
                      <strong>Notes:</strong> {prescription.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="dashboard-card">
          <h2>Medication Reminders</h2>
          <div className="reminder-list">
            {reminders.length === 0 ? (
              <p>No active reminders</p>
            ) : (
              reminders.map(reminder => (
                <div key={reminder._id} className={`reminder-item ${reminder.read ? 'read' : 'unread'}`}>
                  <p>{reminder.message}</p>
                  {!reminder.read && (
                    <button 
                      onClick={() => handleMarkAsRead(reminder._id)}
                      className="mark-read-btn"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="dashboard-card">
          <h2>Medication History</h2>
          <div className="history-list">
            {medicationHistory.map(record => (
              <div key={record._id} className="history-item">
                <p><strong>Medication:</strong> {record.drugName}</p>
                <p><strong>Taken at:</strong> {new Date(record.takenAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
