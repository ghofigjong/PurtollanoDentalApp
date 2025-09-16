import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DateTime } from 'luxon';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { APPOINTMENTS_API } from '../config/api';
import { sanitizeInput, sanitizeObject, isValidDate, isValidTime } from '../utils/sanitize';
import PropTypes from 'prop-types';

// Color code by status
function getEventColor(status) {
  const sanitizedStatus = sanitizeInput(status);
  if (sanitizedStatus === 'accepted') return '#43a047'; // green
  if (sanitizedStatus === 'cancelled') return '#e53935'; // red
  return '#bdbdbd'; // gray for pending/other
}

export default function AdminCalendar({ appointments, onAccept, onCancel, onUpdate }) {
  // Helper to normalize different date representations to YYYY-MM-DD
  const normalizeDateForInput = (d) => {
    if (!d && d !== 0) return '';
    // If already a string in ISO or containing time, try to extract the date part
    if (typeof d === 'string') {
      if (d.includes('T')) return d.split('T')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
      const parsed = DateTime.fromISO(d);
      if (parsed.isValid) return parsed.toISODate();
      return '';
    }
    // If it's a Date object
    if (d instanceof Date) {
      const parsed = DateTime.fromJSDate(d);
      if (parsed.isValid) return parsed.toISODate();
      return '';
    }
    // If it's a numeric timestamp
    if (typeof d === 'number') {
      const parsed = DateTime.fromMillis(d);
      if (parsed.isValid) return parsed.toISODate();
      return '';
    }
    return '';
  };
  const [selected, setSelected] = useState(null);
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);

  // Add state for cancel dialog and reason
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelId, setCancelId] = useState(null);

  // Cancel button handler
  const handleCancelClick = (id, date, time) => {
    // Validate inputs before proceeding
    if (!id || !isValidDate(date) || !isValidTime(time)) {
      alert('Invalid appointment data. Please refresh and try again.');
      return;
    }
    
    setCancelId({ id, date: sanitizeInput(date), time: sanitizeInput(time) });
    setCancelReason('');
    setCancelDialogOpen(true);
  };

  // Confirm cancel handler with better error handling and input validation
  const handleCancelConfirm = async () => {
    // Validate cancel reason
    const sanitizedReason = sanitizeInput(cancelReason.trim());
    if (sanitizedReason.length < 10) {
      alert('Please provide a detailed reason (minimum 10 characters).');
      return;
    }

    try {
      setSaving(true);
      const { id, date, time } = cancelId;
      
      // Validate all data before sending
      if (!id || !isValidDate(date) || !isValidTime(time)) {
        throw new Error('Invalid appointment data');
      }

      const res = await fetch(`${APPOINTMENTS_API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
          date: sanitizeInput(date),
          time: sanitizeInput(time),
          remarks: sanitizedReason
        })
      });
      
      if (!res.ok) {
        throw new Error(`Failed to cancel appointment: ${res.status}`);
      }
      
      const updated = await res.json();
      setCancelDialogOpen(false);
      setCancelId(null);
      setCancelReason('');
      setSelected(null);
      
      if (onUpdate && updated && updated.id) {
        onUpdate(sanitizeObject(updated));
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Memoize events to prevent unnecessary re-renders with input sanitization
  const events = useMemo(() => {
    return appointments.map(appt => {
      // Sanitize all appointment data
      const sanitizedAppt = sanitizeObject(appt);
      
      let datePart = sanitizedAppt.date;
      if (typeof datePart === 'string' && datePart.includes('T')) {
        datePart = datePart.split('T')[0];
      }
      
      // Validate date format
      if (!isValidDate(datePart)) {
        console.warn('Invalid date format for appointment:', sanitizedAppt.id);
        return null;
      }
      
      // Validate time format
      if (!isValidTime(sanitizedAppt.time)) {
        console.warn('Invalid time format for appointment:', sanitizedAppt.id);
        return null;
      }
      
      // Compose details for alt/title with sanitized data
      const details = [
        `Name: ${sanitizedAppt.name || 'N/A'}`,
        `Email: ${sanitizedAppt.email || 'N/A'}`,
        `Phone: ${sanitizedAppt.phone || 'N/A'}`,
        `Procedure: ${sanitizedAppt.procedure || 'N/A'}`,
        `Branch: ${sanitizedAppt.branch || 'N/A'}`,
        `Date: ${datePart}`,
        `Time: ${sanitizedAppt.time}`,
        `Status: ${sanitizedAppt.status || 'N/A'}`,
        `Booking ID: ${sanitizedAppt.bookingId || 'N/A'}`,
        `Under HMO: ${sanitizedAppt.underHMO || 'No'}`
      ];
      
      if (sanitizedAppt.underHMO === 'Yes') {
        details.push(`HMO Provider: ${sanitizedAppt.hmoProvider || 'N/A'}`);
        details.push(`Membership Number: ${sanitizedAppt.hmoMembershipNumber || 'N/A'}`);
        details.push(`Employer/Company: ${sanitizedAppt.employer || 'N/A'}`);
      }
      
      return {
        id: String(sanitizedAppt.id),
        title: `${sanitizedAppt.name || 'Unknown'} (${sanitizedAppt.time})`,
        start: `${datePart}T${sanitizedAppt.time}`,
        backgroundColor: getEventColor(sanitizedAppt.status),
        borderColor: getEventColor(sanitizedAppt.status),
        extendedProps: sanitizedAppt,
        alt: details.join('\n'),
        details: details.join('\n'),
      };
    }).filter(Boolean); // Remove null entries from invalid data
  }, [appointments]);

  // Show 31 days from today
  const now = DateTime.now();
  const startDate = now.toISODate();
  const endDate = now.plus({ days: 30 }).toISODate();

  // Handle edit form changes with validation
  const handleEditChange = (field, value) => {
    let sanitizedValue = sanitizeInput(value);
    
    // Additional validation for specific fields
    if (field === 'date' && !isValidDate(sanitizedValue)) {
      return; // Don't update if invalid date
    }
    if (field === 'time' && !isValidTime(sanitizedValue)) {
      return; // Don't update if invalid time
    }
    
    setEdit({ ...edit, [field]: sanitizedValue });
  };

  return (
    <>
      {/* Sticky Header Logo (clickable) */}
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 1300, background: 'rgba(255,255,255,0.95)', padding: 8, borderRadius: 8, margin: 8 }}>
        <a href="/">
          <img src={require('../PDC Logo Transparent.jpg')} alt="PDC Logo" style={{ height: 40, width: 'auto', background: 'white', borderRadius: 8, padding: 2, cursor: 'pointer' }} />
        </a>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        height="auto"
        aspectRatio={window.innerWidth < 768 ? 1.2 : 1.8}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: window.innerWidth < 768 ? 'dayGridMonth,timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        validRange={{ start: startDate, end: endDate }}
        eventClick={info => setSelected(sanitizeObject(info.event.extendedProps))}
        eventDisplay="block"
        slotDuration="01:00:00"
        slotLabelInterval="01:00"
        slotMinTime="08:00:00"
        slotMaxTime="19:00:00"
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        allDaySlot={false}
        eventDidMount={info => {
          if (info.el) {
            const sanitizedTitle = sanitizeInput(info.event.extendedProps.details || info.event.title);
            info.el.setAttribute('title', sanitizedTitle);
            info.el.style.borderRadius = '8px';
            info.el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            info.el.style.fontWeight = '500';
            // Set text color for contrast
            const bg = info.event.backgroundColor;
            if (bg === '#e53935') info.el.style.color = '#fff'; // red background, white text
            else info.el.style.color = '#fff'; // green/gray, white text for best contrast
          }
        }}
        dayHeaderClassNames={() => 'fc-day-header'}
        dayCellClassNames={() => 'fc-day-cell'}
        slotEventOverlap={false}
        themeSystem="standard"
        style={{ borderRadius: 16, background: '#f4fafd', padding: 8 }}
      />
      {/* View/Edit Dialog */}
      <Dialog open={!!selected || !!edit} onClose={() => { setSelected(null); setEdit(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent dividers>
          {selected && !edit && (
            <>
              <Typography><b>Name:</b> {selected.name || 'N/A'}</Typography>
              <Typography><b>Email:</b> {selected.email || 'N/A'}</Typography>
              <Typography><b>Phone:</b> {selected.phone || 'N/A'}</Typography>
              <Typography><b>Procedure:</b> {selected.procedure || 'N/A'}</Typography>
              <Typography><b>Branch:</b> {selected.branch || 'N/A'}</Typography>
              <Typography><b>Date:</b> {selected.date || 'N/A'}</Typography>
              <Typography><b>Time:</b> {selected.time || 'N/A'}</Typography>
              <Typography><b>Status:</b> {selected.status || 'N/A'}</Typography>
              <Typography><b>Booking ID:</b> {selected.bookingId || 'N/A'}</Typography>
              <Typography><b>Under HMO:</b> {selected.underHMO || 'No'}</Typography>
              {selected.underHMO === 'Yes' && (
                <>
                  <Typography><b>HMO Provider:</b> {selected.hmoProvider || 'N/A'}</Typography>
                  <Typography><b>Membership Number:</b> {selected.hmoMembershipNumber || 'N/A'}</Typography>
                  <Typography><b>Employer/Company:</b> {selected.employer || 'N/A'}</Typography>
                </>
              )}
              {selected.note && (
                <Typography><b>Notes:</b> {selected.note}</Typography>
              )}
              {selected.numPatients && (
                <Typography><b>Number of Patients:</b> {selected.numPatients}</Typography>
              )}
              {selected.remarks && (
                <Typography><b>Remarks:</b> {selected.remarks}</Typography>
              )}
            </>
          )}
          {edit && (
            <>
              <Typography><b>Name:</b> {edit.name || 'N/A'}</Typography>
              <Typography><b>Email:</b> {edit.email || 'N/A'}</Typography>
              <Typography><b>Phone:</b> {edit.phone || 'N/A'}</Typography>
              <Typography><b>Procedure:</b> {edit.procedure || 'N/A'}</Typography>
              <Typography><b>Branch:</b> {edit.branch || 'N/A'}</Typography>
              <TextField
                label="Date"
                type="date"
                value={normalizeDateForInput(edit.date)}
                onChange={e => handleEditChange('date', e.target.value)}
                sx={{ my: 1, mr: 2 }}
                InputLabelProps={{ shrink: true }}
                error={edit.date && !isValidDate(edit.date)}
                helperText={edit.date && !isValidDate(edit.date) ? 'Invalid date format' : ''}
              />
              <TextField
                label="Time"
                type="time"
                value={edit.time}
                onChange={e => handleEditChange('time', e.target.value)}
                sx={{ my: 1, mr: 2 }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 3600 }}
                error={edit.time && !isValidTime(edit.time)}
                helperText={edit.time && !isValidTime(edit.time) ? 'Invalid time format' : ''}
              />
              <TextField
                select
                label="Status"
                value={edit.status}
                onChange={e => handleEditChange('status', e.target.value)}
                sx={{ my: 1, mr: 2, minWidth: 120 }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => { setSelected(null); setEdit(null); }}
            sx={{ background: '#009688', color: '#fff', '&:hover': { background: '#00796b' } }}
          >
            Close
          </Button>
          {selected && !edit && (
            <>
              <Button 
                onClick={() => {
                  const sanitized = sanitizeObject({ ...selected });
                  // normalize date to YYYY-MM-DD for the date input
                  sanitized.date = normalizeDateForInput(sanitized.date);
                  setEdit(sanitized);
                }}
                sx={{ background: '#009688', color: '#fff', '&:hover': { background: '#00796b' } }}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleCancelClick(selected.id, selected.date, selected.time)}
                variant="outlined"
                color="error"
                sx={{ ml: 2, borderColor: '#e53935', color: '#e53935', fontWeight: 600 }}
                aria-label={`Cancel appointment for ${selected.name || 'Unknown'}`}
              >
                Cancel Appointment
              </Button>
            </>
          )}
          {edit && (
            <Button
              onClick={async () => {
                // Validate edit data before submitting
                if (!isValidDate(edit.date) || !isValidTime(edit.time)) {
                  alert('Please correct the date and time format before saving.');
                  return;
                }

                setSaving(true);
                try {
                  const res = await fetch(`${APPOINTMENTS_API}/${edit.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      date: sanitizeInput(edit.date || (selected && selected.date)),
                      time: sanitizeInput(edit.time || (selected && selected.time)),
                      status: sanitizeInput(edit.status || (selected && selected.status))
                    })
                  });
                  
                  if (!res.ok) {
                    throw new Error(`Failed to update appointment: ${res.status}`);
                  }
                  
                  const updated = await res.json();
                  setEdit(null);
                  setSelected(null);
                  
                  if (onUpdate && updated && updated.id) {
                    onUpdate(sanitizeObject(updated));
                  }
                } catch (error) {
                  console.error('Error updating appointment:', error);
                  alert('Failed to update appointment. Please try again.');
                } finally {
                  setSaving(false);
                }
              }}
              variant="contained"
              sx={{ background: '#009688', color: '#fff', '&:hover': { background: '#00796b' } }}
              disabled={saving || !isValidDate(edit.date) || !isValidTime(edit.time)}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* Cancel Reason Dialog */}
      <Dialog 
        open={cancelDialogOpen} 
        onClose={() => setCancelDialogOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && cancelReason.trim().length >= 10) {
            handleCancelConfirm();
          }
        }}
      >
        <Box sx={{ p: 3, minWidth: 320 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Cancel Appointment</Typography>
          <TextField
            label="Reason for cancellation"
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            fullWidth
            multiline
            required
            helperText={cancelReason.length < 10 ? 'Please provide a detailed reason (min 10 characters)' : ''}
            error={cancelReason.length > 0 && cancelReason.length < 10}
            inputProps={{ maxLength: 500 }} // Limit input length
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => setCancelDialogOpen(false)} variant="outlined" sx={{ color: '#009688', borderColor: '#009688' }}>Close</Button>
            <Button
              onClick={handleCancelConfirm}
              variant="contained"
              sx={{ background: '#009688', color: '#fff' }}
              disabled={!cancelReason.trim() || cancelReason.trim().length < 10 || saving}
            >
              {saving ? 'Cancelling...' : 'Confirm Cancel'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

AdminCalendar.propTypes = {
  appointments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  })).isRequired,
  onAccept: PropTypes.func,
  onCancel: PropTypes.func,
  onUpdate: PropTypes.func.isRequired
};
