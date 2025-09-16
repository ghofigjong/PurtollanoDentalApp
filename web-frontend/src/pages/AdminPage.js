import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import logo from '../PDC Logo Transparent.jpg';
import AdminCalendar from '../components/AdminCalendar';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';

const API_URL = 'https://purtollano-dental-app.vercel.app/appointments';

export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/book');
  };
  // Sticky header menus (copied from LandingPage)



  // Appointment logic
  const [appointments, setAppointments] = useState([]);
  const [branchFilter, setBranchFilter] = useState('all');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelId, setCancelId] = useState(null);
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setAppointments)
      .catch(() => setAppointments([]));
  }, []);
  const handleAccept = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    })
      .then(res => res.json())
      .then(updated => setAppointments(appts => appts.map((a) => a.id === id ? updated : a)));
  };
  const handleCancelClick = (id) => {
    setCancelId(id);
    setCancelReason('');
    setCancelDialogOpen(true);
  };
  const handleCancelConfirm = () => {
    fetch(`${API_URL}/${cancelId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled', remarks: cancelReason })
    })
      .then(res => res.json())
      .then(updated => {
        setAppointments(appts => appts.map((a) => a.id === cancelId ? updated : a));
        setCancelDialogOpen(false);
        setCancelId(null);
        setCancelReason('');
      });
  };

  // Update appointment in state after edit
  const handleUpdate = (updated) => {
    setAppointments(appts => appts.map(a => a.id === updated.id ? updated : a));
  };

  // Filter appointments by branch
  const filteredAppointments = branchFilter === 'all'
    ? appointments
    : appointments.filter(a => a.branch && a.branch.toLowerCase() === branchFilter);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      color: '#009688',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      {/* Sticky Header */}
      <AppBar position="fixed" sx={{ background: 'rgba(255, 255, 255, 1)', boxShadow: 2, zIndex: 1201 }}>
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            px: { xs: 1, sm: 2 },
            py: { xs: 1, sm: 0 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>
            <img src={logo} alt="PDC Logo" style={{ height: 40, width: 'auto', marginRight: 8, background: 'white', borderRadius: 8, padding: 2, marginTop: 6 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, fontSize: { xs: 14, sm: 18 }, mt: '6px' }}>
              Puertollano Dental Clinic
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Button onClick={handleLogout} variant="outlined" sx={{ color: '#009688', borderColor: '#009688', fontWeight: 600, fontSize: { xs: 14, sm: 16 } }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Appointments List Section */}
      <section style={{ width: '100%', minHeight: 500, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px 16px 48px 16px', marginTop: 80 }}>
        <h2 style={{ fontSize: 44, color: '#009688', marginBottom: 16, textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          Appointments (Admin/Staff)
        </h2>
        <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'flex-end' }}>
            <TextField
              select
              label="Branch"
              value={branchFilter}
              onChange={e => setBranchFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">All Branches</MenuItem>
              <MenuItem value="binan">Binan</MenuItem>
              <MenuItem value="pasig">Pasig</MenuItem>
            </TextField>
          </Box>
          <AdminCalendar appointments={filteredAppointments} onAccept={handleAccept} onCancel={handleCancelClick} onUpdate={handleUpdate} />
        </div>
      </section>
      {/* Cancel Reason Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <Box sx={{ p: 3, minWidth: 320 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Cancel Appointment</Typography>
          <TextField
            label="Reason for cancellation"
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            fullWidth
            multiline
            required
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => setCancelDialogOpen(false)} variant="outlined" sx={{ color: '#009688', borderColor: '#009688' }}>Close</Button>
            <Button
              onClick={handleCancelConfirm}
              variant="contained"
              sx={{ background: '#009688', color: '#fff' }}
              disabled={!cancelReason.trim()}
            >
              Confirm Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}
