import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Profile.css';

const DoctorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalPrescriptions: 0,
    activePatients: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileData, prescriptions, patients] = await Promise.all([
          api.getDoctorProfile(),
          api.getPrescriptions(),
          api.getPatients()
        ]);
        
        setProfile(profileData);
        setStats({
          totalPatients: patients.length,
          totalPrescriptions: prescriptions.length,
          activePatients: new Set(prescriptions.map(p => p.patientId)).size
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Doctor Profile</h1>
        <p>Managing patient care with excellence</p>
      </div>

      <div className="profile-card">
        <img 
          src={profile.imageUrl || '/default-doctor.png'} 
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
          </div>

          <div className="info-group">
            <h3>Professional Details</h3>
            <div className="info-item">
              <div className="info-label">License Number</div>
              <div className="info-value">{profile.licenseNumber}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Specialty</div>
              <div className="info-value">{profile.specialty}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Hospital</div>
              <div className="info-value">{profile.hospital}</div>
            </div>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{stats.totalPatients}</div>
            <div className="stat-label">Total Patients</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activePatients}</div>
            <div className="stat-label">Active Patients</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalPrescriptions}</div>
            <div className="stat-label">Prescriptions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
