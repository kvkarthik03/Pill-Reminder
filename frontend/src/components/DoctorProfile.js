import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Profile.css';

const DoctorProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.getDoctorProfile();
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile');
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="loading">Loading profile...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!profile) return <div>No profile data found</div>;

    return (
        <div className="profile-container">
            <h1>Doctor Profile</h1>
            <div className="profile-card">
                <div className="profile-section">
                    <h2>Personal Information</h2>
                    <div className="profile-details">
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>License Number:</strong> {profile.licenseNumber}</p>
                        <p><strong>Specialty:</strong> {profile.specialty}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
