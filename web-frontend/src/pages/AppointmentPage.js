import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import logo from '../PDC Logo Transparent.jpg';
import AppointmentBooking from '../components/AppointmentBooking';
import { DialogContentText } from '@mui/material';

// Replace hard-coded URLs with environment variables
const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/appointments` : 'https://purtollano-dental-app.vercel.app/appointments';
const LOGIN_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/users/login` : 'https://purtollano-dental-app.vercel.app/users/login';

// Ensure viewport meta tag is present for sticky/fixed header to work on all devices
if (typeof document !== 'undefined' && !document.querySelector('meta[name="viewport"]')) {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1';
  document.head.appendChild(meta);
}

// Add sanitization utility
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export default function AppointmentPage() {

  // --- Services Menu State ---
  const [servicesAnchorEl, setServicesAnchorEl] = useState(null);
  const servicesOpen = Boolean(servicesAnchorEl);
  const handleServicesMenu = (event) => {
    setServicesAnchorEl(event.currentTarget);
  };
  const handleServicesClose = () => {
    setServicesAnchorEl(null);
  };

  // --- Locations Menu State ---
  const [locationsAnchorEl, setLocationsAnchorEl] = useState(null);
  const locationsOpen = Boolean(locationsAnchorEl);
  const handleLocationsMenu = (event) => {
    setLocationsAnchorEl(event.currentTarget);
  };
  const handleLocationsClose = () => {
    setLocationsAnchorEl(null);
  };

  // --- Login Dialog State ---
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => {
    setLoginOpen(false);
    setLoginError("");
    setUsername("");
    setPassword("");
  };
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(0);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Simple rate limiting
    const now = Date.now();
    if (loginAttempts >= 3 && now - lastAttempt < 60000) {
      setLoginError("Too many attempts. Please wait 1 minute.");
      return;
    }
    
    setLoginError("");
    setLastAttempt(now);
    
    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username.trim());
    const sanitizedPassword = sanitizeInput(password);
    
    if (!sanitizedUsername || !sanitizedPassword) {
      setLoginError("Please enter both username and password");
      return;
    }
    
    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: sanitizedUsername, 
          password: sanitizedPassword 
        })
      });
      
      // On failed login
      if (!res.ok) {
        setLoginAttempts(prev => prev + 1);
        setLoginError("Invalid username or password");
        return;
      }
      
      // Reset on success
      setLoginAttempts(0);
      localStorage.setItem('isAdmin', 'true');
      setLoginOpen(false);
      window.location.href = '/admin';
    } catch (err) {
      setLoginError("Login failed. Please try again.");
    }
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBook = async (formData) => {
    setPendingFormData(formData);
    setConfirmDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingFormData)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }
      
      alert('Appointment booked successfully! We will contact you for confirmation of booking.');
      setConfirmDialogOpen(false);
      setPendingFormData(null);
      window.location.reload();
    } catch (err) {
      console.error('Booking error:', err);
      alert(`Booking failed: ${err.message}`);
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
      setPendingFormData(null);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      color: '#009688',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      {/* Sticky Header (copied from LandingPage) */}
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
            <img src={logo} alt="PDC Logo" style={{ height: 40, width: 'auto', marginRight: 8, background: 'white', borderRadius: 8, padding: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, fontSize: { xs: 14, sm: 18 } }}>
              📞 09171084488 (Binan) / 09171083285 (Pasig)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 3 }, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <span>
              <Link
                href="#"
                underline="none"
                color="inherit"
                sx={{ fontSize: 18, fontWeight: 500, cursor: 'pointer' }}
                aria-controls={servicesOpen ? 'services-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={servicesOpen ? 'true' : undefined}
                onClick={e => { e.preventDefault(); handleServicesMenu(e); }}
              >
                Services
              </Link>
              <Menu
                id="services-menu"
                anchorEl={servicesAnchorEl}
                open={servicesOpen}
                onClose={handleServicesClose}
                MenuListProps={{ 'aria-labelledby': 'services-button' }}
              >
                <MenuItem onClick={() => { handleServicesClose(); window.location.href = '/#services'; }}>General Dentistry</MenuItem>
                <MenuItem onClick={() => { handleServicesClose(); window.location.href = '/#services'; }}>Cosmetic Dentistry</MenuItem>
                <MenuItem onClick={() => { handleServicesClose(); window.location.href = '/#services'; }}>Orthodontics</MenuItem>
                <MenuItem onClick={() => { handleServicesClose(); window.location.href = '/#services'; }}>Pediatric Dentistry</MenuItem>
              </Menu>
            </span>
            {/*<Link href="/#about" underline="none" color="inherit" sx={{ fontSize: 18, fontWeight: 500, cursor: 'pointer' }}>About</Link>*/}
            <span>
              <Link
                href="#"
                underline="none"
                color="inherit"
                sx={{ fontSize: 18, fontWeight: 500, cursor: 'pointer' }}
                aria-controls={locationsOpen ? 'locations-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={locationsOpen ? 'true' : undefined}
                onClick={e => { e.preventDefault(); handleLocationsMenu(e); }}
              >
                Locations
              </Link>
              <Menu
                id="locations-menu"
                anchorEl={locationsAnchorEl}
                open={locationsOpen}
                onClose={handleLocationsClose}
                MenuListProps={{ 'aria-labelledby': 'locations-button' }}
              >
                <MenuItem onClick={() => { handleLocationsClose(); window.location.href = '/#locations'; }}>Binan</MenuItem>
                <MenuItem onClick={() => { handleLocationsClose(); window.location.href = '/#locations'; }}>Pasig</MenuItem>
              </Menu>
            </span>
            {/*<Link href="/#contact" underline="none" color="inherit" sx={{ fontSize: 18, fontWeight: 500, cursor: 'pointer' }}>Contact</Link>*/}
            <Button href="/book" variant="contained" sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 }, background: '#009688', color: '#fff', fontWeight: 600, fontSize: { xs: 14, sm: 16 } }}>
              Book an Appointment
            </Button>
            {/* Show Admin Login only on booking page */}
            <Button variant="outlined" sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 }, color: '#009688', borderColor: '#009688', fontWeight: 600, fontSize: { xs: 14, sm: 16 } }} onClick={handleLoginOpen}>
              Administrator Login
            </Button>
            {/* Social Media Icons in Header */}
            <Box sx={{ display: 'flex', gap: 1, ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}>
              <Link href="https://www.facebook.com/PuertollanoDC" target="_blank" rel="noopener" color="inherit" aria-label="Facebook">
                <FacebookIcon fontSize="medium" />
              </Link>
              <Link href="https://instagram.com/puertollanodental" target="_blank" rel="noopener" color="inherit" aria-label="Instagram">
                <InstagramIcon fontSize="medium" />
              </Link>
              <Link href="https://twitter.com/puertollanodental" target="_blank" rel="noopener" color="inherit" aria-label="Twitter">
                <TwitterIcon fontSize="medium" />
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Book an Appointment Section - Two Columns */}
      <section style={{ width: '100%', minHeight: 500, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px 16px 48px 16px', marginTop: 80 }}>
        <h2 style={{ fontSize: 44, color: '#009688', marginBottom: 16, textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          Book an Appointment
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%', gap: 40, maxWidth: 1100, margin: '0 auto' }}>
          {/* Left: Appointment Form */}
          <div style={{ minWidth: 320, maxWidth: 420, flex: 1, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 24 }}>
            <AppointmentBooking onSubmit={handleBook} />
          </div>
          {/* Right: Locations/Map (copied from LandingPage) */}
          <div style={{ flex: 2, minWidth: 320, maxWidth: 700, background: '#f4fafd', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LocationsMapPanel />
          </div>
        </div>
        <Dialog open={loginOpen} onClose={handleLoginClose}>
          <>
            <DialogTitle>Administrator Login</DialogTitle>
            <form onSubmit={handleLoginSubmit}>
              <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320 }}>
                {loginError && <Alert severity="error">{loginError}</Alert>}
                <TextField
                  label="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoFocus
                  required
                  autoComplete="username"
                  inputProps={{ 'aria-describedby': loginError ? 'login-error' : undefined }}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  inputProps={{ 'aria-describedby': loginError ? 'login-error' : undefined }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleLoginClose}>Cancel</Button>
                <Button type="submit" variant="contained">Login</Button>
              </DialogActions>
            </form>
          </>

        </Dialog>
        <Dialog open={confirmDialogOpen} onClose={() => !loading && setConfirmDialogOpen(false)}>
          <DialogTitle>Appointment Booking Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please note: Booking an appointment is <b>tentative</b> until an administrator reviews and approves your request.
              You will receive a confirmation email with the details once your appointment is accepted. If you do not agree, you may cancel this booking request now.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => { 
                setConfirmDialogOpen(false); 
                setPendingFormData(null); 
              }} 
              color="error"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmBooking} 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Continue'}
            </Button>
          </DialogActions>
        </Dialog>
      </section>
    {/* Footer */}
    <footer style={{ textAlign: 'center', padding: 32, color: '#009688', fontSize: 18, background: '#fff', borderTop: '2px solid #b2dfdb', marginTop: 48 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>Follow Us:
        <Link href="https://www.facebook.com/PuertollanoDC" target="_blank" rel="noopener" color="inherit" aria-label="Facebook">
          <FacebookIcon fontSize="large" />
        </Link>
        <Link href="https://instagram.com/puertollanodental" target="_blank" rel="noopener" color="inherit" aria-label="Instagram">
          <InstagramIcon fontSize="large" />
        </Link>
        <Link href="https://twitter.com/puertollanodental" target="_blank" rel="noopener" color="inherit" aria-label="Twitter">
          <TwitterIcon fontSize="large" />
        </Link>
      </Box>
      © {new Date().getFullYear()} Puertollano Dental Clinic. All Rights Reserved.
    </footer>
  </div>
  );
}

// --- LocationsMapPanel component (copied/adapted from LandingPage) ---
// -- TestCommit A


// --- LocationsMapPanel component (copied/adapted from LandingPage) ---
function LocationsMapPanel() {
  const [mapCenter, setMapCenter] = React.useState(0); // 0: Binan, 1: Pasig
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [cancelEmail, setCancelEmail] = React.useState("");
  const [cancelBookingId, setCancelBookingId] = React.useState("");
  const [cancelError, setCancelError] = React.useState("");
  const [cancelSuccess, setCancelSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const locations = [
  { name: 'Binan', address: '2nd Flr, Red Commercial Complex, San Francisco Rd, Biñan, 4024 Laguna', phone: '09171084488', clinichours: 'Wed,Fri-Mon: 9am - 6pm' },
  { name: 'Pasig', address: 'Unit 3B 10 MVS 2 Place Bldg, Dr. Sixto Antonio Ave., Pasig, 1609 Metro Manila', phone: '09171083285', clinichours: 'Tue,Thu-Sun: 9am - 6pm' },
  ];

  // Helper to check if appointment is more than 3 days away
  function isMoreThan3Days(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const appt = new Date(dateStr);
    const diff = (appt - today) / (1000 * 60 * 60 * 24);
    return diff > 3;
  }

  // Handler for cancel
  async function handleCancelSubmit(e) {
    e.preventDefault();
    setCancelError("");
    setCancelSuccess("");
    
    // Validate inputs
    const sanitizedEmail = sanitizeInput(cancelEmail.trim());
    const sanitizedBookingId = sanitizeInput(cancelBookingId.trim());
    
    if (!sanitizedEmail || !sanitizedBookingId) {
      setCancelError("Please fill in all required fields.");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setCancelError("Please enter a valid email address.");
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId: sanitizedBookingId, 
          email: sanitizedEmail 
        })
      });
      
      if (!res.ok) {
        setCancelError("No appointment found with that Booking ID and Email.");
        return;
      }
      
      const data = await res.json();
      if (!data.date) {
        setCancelError("Could not verify appointment date.");
        return;
      }
      
    if (!isMoreThan3Days(data.date)) {
      setCancelError("You can only cancel appointments more than 3 days in advance.");
      return;
    }      const cancelRes = await fetch(`${API_URL}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId: sanitizedBookingId, 
          email: sanitizedEmail 
        })
      });
      
      if (!cancelRes.ok) {
        throw new Error("Failed to cancel appointment");
      }
      
      setCancelSuccess("Your appointment has been cancelled.");
      setCancelEmail("");
      setCancelBookingId("");
    } catch (err) {
      console.error('Cancel error:', err);
      setCancelError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ color: '#009688', fontSize: 28, marginBottom: 18, fontWeight: 700 }}>Our Locations</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
        {locations.map((loc, i) => (
          <Button key={loc.name} variant={mapCenter === i ? 'contained' : 'outlined'} sx={{ color: mapCenter === i ? '#fff' : '#1565c0', background: mapCenter === i ? '#1565c0' : 'transparent', borderColor: '#1565c0', fontWeight: 600, fontSize: 16, minWidth: 100 }} onClick={() => setMapCenter(i)}>
            {loc.name}
          </Button>
        ))}
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{locations[mapCenter].name} Clinic</div>
        <div style={{ fontSize: 15, marginBottom: 6 }}>{locations[mapCenter].address}</div>
        <div style={{ fontSize: 14, marginBottom: 6 }}><b>Clinic Hours:</b> {locations[mapCenter].clinichours}</div>
        <div style={{ fontSize: 14, marginBottom: 6 }}><b>Contact: </b>{locations[mapCenter].phone}</div>
        <div style={{ fontSize: 14, marginBottom: 6 }}><b>Email:</b> info@puertollanodental.com</div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <iframe
          title="Clinic Map"
          key={mapCenter}
          src={mapCenter === 0
            ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.54975090994!2d121.06517117577054!3d14.33756628346106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d7452d042db1%3A0x6a9715db439579b5!2sPuertollano%20Dental%20Clinic%20Bi%C3%B1an!5e0!3m2!1sen!2sph!4v1756557952006!5m2!1sen!2sph"
            : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.273330825308!2d121.08131297577341!3d14.58349487749392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c7dba317c11f%3A0xe1920c0e351eb66d!2sPuertollano%20Dental%20Clinic%20-%20Pasig!5e0!3m2!1sen!2sph!4v1756557874958!5m2!1sen!2sph"}
          width="100%"
          height="250"
          style={{ border: 0, borderRadius: 12, minWidth: 220, maxWidth: 600 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      {/* Cancel Appointment Button and Dialog */}
              Got Last Minute Plans? ... Let us know!
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <Button variant="outlined" color="error" onClick={() => setCancelOpen(true)}>
          Cancel An Appointment
        </Button>
      </div>
      <Dialog open={cancelOpen} onClose={() => { setCancelOpen(false); setCancelError(""); setCancelSuccess(""); }}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContentText sx={{ mx: 3, mt: 1 }}>
          To cancel your appointment, please enter the email you used and booking confirmation ID sent to your email. Cancellations are only allowed more than 3 days in advance.
        </DialogContentText>
        {/* Cancel Form */}
        <form onSubmit={handleCancelSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320 }}>
            {cancelError && <Alert severity="error">{cancelError}</Alert>}
            {cancelSuccess && <Alert severity="success">{cancelSuccess}</Alert>}
            <TextField
              label="Email"
              type="email"
              value={cancelEmail}
              onChange={e => setCancelEmail(e.target.value)}
              required
              autoFocus
            />
            <TextField
              label="Booking ID"
              value={cancelBookingId}
              onChange={e => setCancelBookingId(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelOpen(false)}>Close</Button>
            <Button type="submit" variant="contained" color="error" disabled={loading}>Cancel Appointment</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
