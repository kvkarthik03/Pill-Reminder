import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Profile.css';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalPrescriptions: 0,
    activeMedications: 0,
    adherenceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, prescriptions, history] = await Promise.all([
          api.getProfile(),
          api.getPrescriptions(),
          api.getMedicationHistory()
        ]);
        
        setProfile(profileData);
        
        // Calculate stats
        const activeMeds = prescriptions.reduce((acc, curr) => 
          acc + curr.medicines.length, 0);
        
        const adherenceRate = history.length > 0
          ? Math.round((history.length / (activeMeds * prescriptions.length)) * 100)
          : 0;

        setStats({
          totalPrescriptions: prescriptions.length,
          activeMedications: activeMeds,
          adherenceRate
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Patient Profile</h1>
        <p>Your health journey at a glance</p>
      </div>

      <div className="profile-card">
        <img 
          src={profile.imageUrl || '/default-patient.png'} 
          alt="Profile" 
          className="profile-image"
        />
        
        <div className="profile-info">
          <div className="info-group">
            <h3>Personal Information</h3>
            <div className="info-item">
              <div className="info-label">Name</div>
              <div className="info-value">{profile.name}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Email</div>
              <div className="info-value">{profile.email}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Gender</div>
              <div className="info-value">
                {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
              </div>
            </div>
          </div>

          <div className="info-group">
            <h3>Medical Information</h3>
            <div className="info-item">
              <div className="info-label">Date of Birth</div>
              <div className="info-value">
                {new Date(profile.dateOfBirth).toLocaleDateString()}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Age</div>
              <div className="info-value">
                {new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()} years
              </div>
            </div>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{stats.totalPrescriptions}</div>
            <div className="stat-label">Total Prescriptions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activeMedications}</div>
            <div className="stat-label">Active Medications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.adherenceRate}%</div>
            <div className="stat-label">Medication Adherence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
