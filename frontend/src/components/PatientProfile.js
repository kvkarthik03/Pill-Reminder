import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Profile.css';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Profile loading error:', err);
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
      <div className="profile-card">
        <h2>Patient Profile</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {profile?.name}</p>
          <p><strong>Email:</strong> {profile?.email}</p>
          <p><strong>Gender:</strong> {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not specified'}</p>
          <p><strong>Date of Birth:</strong> {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not specified'}</p>
          <p><strong>Age:</strong> {profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
};

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default PatientProfile;
