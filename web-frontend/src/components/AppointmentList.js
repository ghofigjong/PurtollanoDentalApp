import React from 'react';
import Button from '@mui/material/Button';

export default function AppointmentList({ appointments, onAccept, onCancel }) {
  if (!appointments.length) return <div>No appointments.</div>;
  return (
    <div>
      {appointments.map((appt) => (
        <div key={appt.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8, borderRadius: 4 }}>
          <div><b>Name:</b> {appt.name}</div>
          <div><b>Email:</b> {appt.email}</div>
          <div><b>Phone:</b> {appt.phone}</div>
          <div><b>Procedure:</b> {appt.procedure}</div>
          <div><b>Branch:</b> {appt.branch}</div>
          <div><b>Date:</b> {appt.date}</div>
          <div><b>Time:</b> {appt.time}</div>
          <div><b>Under HMO:</b> {appt.underHMO}</div>
          {appt.underHMO === 'Yes' && (
            <>
              <div><b>HMO Provider:</b> {appt.hmoProvider}</div>
              <div><b>Membership Number:</b> {appt.hmoMembershipNumber}</div>
              <div><b>Employer/Company:</b> {appt.employer}</div>
            </>
          )}
          <div><b>Status:</b> {appt.status}</div>
          <div style={{ marginTop: 8 }}>
            <Button variant="contained" color="success" onClick={() => onAccept(appt.id)} sx={{ mr: 1 }}>Accept</Button>
            <Button variant="outlined" color="error" onClick={() => onCancel(appt.id)}>Cancel</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
