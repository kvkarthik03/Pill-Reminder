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
    hospital: '',
    specialty: '',
    gender: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const history = useHistory();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({...formData, password});
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password before submission
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    try {
      // Basic validation only
      if (formData.role === 'doctor') {
        if (!formData.licenseNumber) {
          setError('License Number is required');
          return;
        }
      }

      if (formData.role === 'patient') {
        if (!formData.gender) {
          setError('Please select a gender');
          return;
        }
        if (!formData.dateOfBirth) {
          setError('Please enter date of birth');
          return;
        }
      }

      // Send data directly without mapping/transforming
      const response = await api.signup(formData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.user.role);
        history.push(response.user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Registration failed. Please try again.');
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

        <div className="password-field">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handlePasswordChange}
            required
          />
          {passwordError && <div className="password-requirements">{passwordError}</div>}
        </div>

        {formData.role === 'doctor' && (
          <>
            <input
              type="text"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={e => setFormData({...formData, licenseNumber: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Specialty"
              value={formData.specialty}
              onChange={e => setFormData({...formData, specialty: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Hospital"
              value={formData.hospital}
              onChange={e => setFormData({...formData, hospital: e.target.value})}
              required
            />
          </>
        )}

        {formData.role === 'patient' && (
          <>
            <select
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
