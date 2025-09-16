import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { RECAPTCHA_SITE_KEY } from '../config/recaptcha';



// Dynamically load reCAPTCHA v2 script and ensure grecaptcha is ready
function useRecaptchaScript(onReady) {
  React.useEffect(() => {
    function checkGrecaptchaReady() {
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        onReady && onReady();
      } else {
        setTimeout(checkGrecaptchaReady, 100);
      }
    }
    if (!window.grecaptcha && !document.getElementById('recaptcha-script')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      script.onload = checkGrecaptchaReady;
      document.body.appendChild(script);
    } else {
      checkGrecaptchaReady();
    }
  }, [onReady]);
}




export default function AppointmentBooking({ onSubmit }) {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    procedure: '',
    branch: '',
    date: '',
    time: '',
    underHMO: '',
    hmoProvider: '',
    hmoMembershipNumber: '',
    employer: ''
  });
  const [captchaToken, setCaptchaToken] = React.useState('');
  const [captchaError, setCaptchaError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const recaptchaRef = React.useRef(null);
  const [note, setNote] = useState('');
  const [numPatients, setNumPatients] = useState(1);

  // --- New: Booked times state ---
  const [bookedTimes, setBookedTimes] = React.useState([]);

  // Always try to render widget after script loads and grecaptcha is ready
  const renderRecaptcha = React.useCallback(() => {
    if (window.grecaptcha && recaptchaRef.current && !recaptchaRef.current.hasChildNodes()) {
      window.grecaptcha.render(recaptchaRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token) => {
          setCaptchaToken(token);
          setCaptchaError('');
        },
        'expired-callback': () => setCaptchaToken(''),
        'error-callback': () => setCaptchaError('Captcha failed, try again'),
      });
    }
  }, []);
  useRecaptchaScript(renderRecaptcha);

  // Calculate min/max date for date picker
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDateObj = new Date(today);
  maxDateObj.setMonth(today.getMonth() + 1);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- New: Fetch booked times when branch/date changes ---
  React.useEffect(() => {
    async function fetchBookedTimes() {
      if (!form.branch || !form.date) {
        setBookedTimes([]);
        return;
      }
      try {
        const res = await fetch(`https://purtollano-dental-app.vercel.app/appointments/booked?branch=${encodeURIComponent(form.branch)}&date=${encodeURIComponent(form.date)}`);
        if (res.ok) {
          const data = await res.json();
          // API returns { bookedTimes: ["12:00", ...] }
          if (Array.isArray(data.bookedTimes)) {
            setBookedTimes(data.bookedTimes);
          } else {
            setBookedTimes([]);
          }
        } else {
          setBookedTimes([]);
        }
      } catch {
        setBookedTimes([]);
      }
    }
    fetchBookedTimes();
  }, [form.branch, form.date]);

  // If widget is removed (e.g. after form submit), re-render it
  React.useEffect(() => {
    renderRecaptcha();
  }, [renderRecaptcha]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setCaptchaError('Please complete the captcha');
      return;
    }
    if (onSubmit) {
      const result = await onSubmit({ ...form, captchaToken, note, numPatients });
      if (result !== false) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', procedure: '', branch: '', date: '', time: '', underHMO: '', hmoProvider: '', hmoMembershipNumber: '', employer: '' });
        setCaptchaToken('');
        // Reset the captcha widget
        if (window.grecaptcha && recaptchaRef.current) {
          window.grecaptcha.reset();
        }
        setTimeout(() => setSuccess(false), 4000);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      {success && <Alert severity="success">Appointment booked successfully!</Alert>}
  <TextField label="Name" name="name" value={form.name} onChange={handleChange} required />
  <TextField label="Email" name="email" value={form.email} onChange={handleChange} required type="email" />
  <TextField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required type="tel" />
      <TextField
        select
        label="Procedure"
        name="procedure"
        value={form.procedure}
        onChange={handleChange}
        required
      >
        <MenuItem value="">Select Procedure</MenuItem>
        <MenuItem value="Cleaning">Cleaning</MenuItem>
        <MenuItem value="Braces Adjustment">Braces Adjustment</MenuItem>
        <MenuItem value="Tooth Extraction">Tooth Extraction</MenuItem>
        <MenuItem value="Consultation">Consultation</MenuItem>
        <MenuItem value="Others">Others (Please indicate in comments)</MenuItem>
      </TextField>
      <TextField
        select
        label="Branch"
        name="branch"
        value={form.branch}
        onChange={handleChange}
        required
      >
        <MenuItem value="">Select Branch</MenuItem>
        <MenuItem value="Binan">Binan</MenuItem>
        <MenuItem value="Pasig">Pasig</MenuItem>
      </TextField>
      <TextField
        label="Date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        type="date"
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: minDate, max: maxDate }}
        disabled={!form.branch}
        helperText={!form.branch ? 'Select a branch first' : ''}
      />
      <TextField
        label="Time"
        name="time"
        value={form.time}
        onChange={handleChange}
        required
        select
        InputLabelProps={{ shrink: true }}
        disabled={!form.branch}
        helperText={!form.branch ? 'Select a branch first' : ''}
      >
        <MenuItem value="">Select Time</MenuItem>
        {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(t => {
          const isBooked = bookedTimes.includes(t);
          const timeLabel = `${parseInt(t,10) < 12 ? (parseInt(t,10) === 0 ? 12 : parseInt(t,10)) : (parseInt(t,10) === 12 ? 12 : parseInt(t,10)-12)}:${t.slice(3)} ${parseInt(t,10) < 12 ? 'AM' : 'PM'}${isBooked ? ' (Booked)' : ''}`;
          return (
            <MenuItem key={t} value={t} disabled={isBooked}>
              {timeLabel}
            </MenuItem>
          );
        })}
      </TextField>
      <TextField
        select
        label="Under HMO?"
        name="underHMO"
        value={form.underHMO}
        onChange={handleChange}
        required
      >
        <MenuItem value="">Select</MenuItem>
        <MenuItem value="Yes">Yes</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </TextField>
      {form.underHMO === 'Yes' && (
        <>
          <TextField
            select
            label="HMO Provider"
            name="hmoProvider"
            value={form.hmoProvider}
            onChange={handleChange}
            required
          >
            <MenuItem value="">Select Provider</MenuItem>
            <MenuItem value="Intellicare">Intellicare</MenuItem>
            <MenuItem value="Maxicare">Maxicare</MenuItem>
            <MenuItem value="Medicard">Medicard</MenuItem>
            <MenuItem value="EastWest">EastWest</MenuItem>
            <MenuItem value="Cocolife">Cocolife</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            label="Membership Number"
            name="hmoMembershipNumber"
            value={form.hmoMembershipNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Employer/Company"
            name="employer"
            value={form.employer}
            onChange={handleChange}
            required
          />
        </>
      )}
      <TextField
        label="Number of Patient/s"
        type="number"
        value={numPatients}
        onChange={e => {
          const val = Math.max(1, Math.min(3, Number(e.target.value)));
          setNumPatients(val);
        }}
        inputProps={{ min: 1, max: 3 }}
        required
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Notes / Comments"
        value={note}
        onChange={e => setNote(e.target.value)}
        multiline
        minRows={2}
        maxRows={4}
        fullWidth
        sx={{ mt: 2 }}
        placeholder="Any comments or requests?"
      />
      <div ref={recaptchaRef} style={{ margin: '16px 0' }} />
      {captchaError && <div style={{ color: 'red', fontSize: 14 }}>{captchaError}</div>}
      <Button type="submit" variant="contained">Book Appointment</Button>
    </Box>
  );
}
