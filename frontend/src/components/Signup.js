import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    licenseNumber: '',
    hospitalName: '',
    specialization: '',
    gender: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.signup(formData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        history.push(response.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        
        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          required
        />

        {formData.role === 'doctor' && (
          <>
            <input
              type="text"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={e => setFormData({...formData, licenseNumber: e.target.value})}
            />
            <input
              type="text"
              placeholder="Hospital Name"
              value={formData.hospitalName}
              onChange={e => setFormData({...formData, hospitalName: e.target.value})}
            />
            <input
              type="text"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={e => setFormData({...formData, specialization: e.target.value})}
            />
          </>
        )}

        {formData.role === 'patient' && (
          <>
            <input
              type="text"
              placeholder="Gender"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
            />
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
            />
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
