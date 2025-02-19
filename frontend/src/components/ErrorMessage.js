import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <i className="error-icon">⚠️</i>
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
