import React, { useState, useEffect } from 'react';
import AppointmentBooking from '../components/AppointmentBooking';
import AppointmentList from '../components/AppointmentList';

const API_URL = 'https://purtollano-dental-app.vercel.app/appointments';

export default function HomePage() {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments from backend
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setAppointments)
      .catch(() => setAppointments([]));
  }, []);

  const handleBook = (appt) => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appt)
    })
      .then(res => res.json())
      .then(newAppt => setAppointments(appts => [...appts, newAppt]));
  };

  const handleAccept = (idx) => {
    fetch(`${API_URL}/${idx}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    })
      .then(res => res.json())
      .then(updated => setAppointments(appts => appts.map((a, i) => i === idx ? updated : a)));
  };

  const handleCancel = (idx) => {
    fetch(`${API_URL}/${idx}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    })
      .then(res => res.json())
      .then(updated => setAppointments(appts => appts.map((a, i) => i === idx ? updated : a)));
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Book an Appointment</h2>
      <AppointmentBooking onSubmit={handleBook} />
      <h2 style={{ marginTop: 32 }}>Appointments (Admin/Staff)</h2>
      <AppointmentList appointments={appointments} onAccept={handleAccept} onCancel={handleCancel} />
    </div>
  );
}
