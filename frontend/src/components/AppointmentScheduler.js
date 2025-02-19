import React, { useState } from 'react';
import { api } from '../services/api';
import './AppointmentScheduler.css';

const AppointmentScheduler = () => {
  const [appointment, setAppointment] = useState({
    date: '',
    time: '',
    doctorId: '',
    reason: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAppointment(appointment);
      alert('Appointment scheduled successfully!');
    } catch (error) {
      alert('Failed to schedule appointment');
    }
  };

  return (
    <div className="appointment-scheduler">
      <h2>Schedule Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={appointment.date}
          onChange={(e) => setAppointment({...appointment, date: e.target.value})}
        />
        <input
          type="time"
          value={appointment.time}
          onChange={(e) => setAppointment({...appointment, time: e.target.value})}
        />
        <textarea
          placeholder="Reason for visit"
          value={appointment.reason}
          onChange={(e) => setAppointment({...appointment, reason: e.target.value})}
        />
        <button type="submit">Schedule Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentScheduler;
