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
  const [nameError, setNameError] = useState('');
  const [licenseError, setLicenseError] = useState('');
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

  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters long';
    if (name.length > 50) return 'Name must be less than 50 characters';
    if (!/^[A-Za-z][A-Za-z\s.]{1,}$/.test(name)) {
      return 'Name can only contain letters, spaces, and dots';
    }
    return '';
  };

  const validateLicenseNumber = (license) => {
    if (!license) return 'License Number is required';
    if (!/^\d+$/.test(license)) return 'License Number must contain only digits';
    if (license.length !== 10) return 'License Number must be exactly 10 digits';
    return '';
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({...formData, password});
    setPasswordError(validatePassword(password));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({...formData, name});
    setNameError(validateName(name));
  };

  const handleLicenseChange = (e) => {
    const license = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setFormData({...formData, licenseNumber: license});
    setLicenseError(validateLicenseNumber(license));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate name first
    const nameValidationError = validateName(formData.name);
    if (nameValidationError) {
      setError(nameValidationError);
      return;
    }

    // Validate password before submission
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    if (formData.role === 'doctor') {
      const licenseValidationError = validateLicenseNumber(formData.licenseNumber);
      if (licenseValidationError) {
        setError(licenseValidationError);
        return;
      }
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

        <div className="input-field">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleNameChange}
            required
          />
          {nameError && <div className="field-error">{nameError}</div>}
        </div>

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
            <div className="input-field">
              <input
                type="text"
                placeholder="License Number (10 digits)"
                value={formData.licenseNumber}
                onChange={handleLicenseChange}
                maxLength={10}
                required
              />
              {licenseError && <div className="field-error">{licenseError}</div>}
            </div>
            <input
              type="text"
              placeholder="Specialization"
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
