const express = require('express');
const router = express.Router();



const db = require('../db');
const { sendMail } = require('../utils/mailer');
const { generateBookingId } = require('../utils/bookingId');


// Get all appointments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM appointments ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get booked times for a branch and date (status = Accepted)
router.get('/booked', async (req, res) => {
  const { branch, date } = req.query;
  if (!branch || !date) {
    return res.status(400).json({ error: 'Missing branch or date' });
  }
  try {
    const [rows] = await db.query(
      'SELECT time FROM appointments WHERE branch = ? AND date = ? AND status = ? ORDER BY time ASC',
      [branch, date, 'accepted']
    );
    // Return array of times
    res.json({ bookedTimes: rows.map(r => r.time) });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


// Book a new appointment
router.post('/', async (req, res) => {
  console.log('POST /appointments payload:', req.body);
  let {
    name, email, phone = null, procedure = null, date, time, branch,
    underHMO = 'No', hmoProvider = null, hmoMembershipNumber = null, employer = null
  } = req.body;
  // Convert empty strings to null for optional fields
  if (hmoProvider === '') hmoProvider = null;
  if (hmoMembershipNumber === '') hmoMembershipNumber = null;
  if (employer === '') employer = null;
  if (!name || !email || !date || !time || !branch || !phone || !procedure) {
    console.error('Missing required fields:', { name, email, date, time, branch, phone, procedure });
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    let result;
    try {
      result = await db.query(
        'INSERT INTO appointments (name, email, phone, `procedure`, date, time, branch, underHMO, hmoProvider, hmoMembershipNumber, employer, status, lastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [name, email, phone, procedure, date, time, branch, underHMO, hmoProvider, hmoMembershipNumber, employer, 'pending']
      );
    } catch (dbErr) {
      console.error('DB error (insert appointment):', dbErr, {
        name, email, phone, procedure, date, time, branch, underHMO, hmoProvider, hmoMembershipNumber, employer
      });
      return res.status(500).json({ error: 'Database insert error', details: dbErr.message });
    }
    let rows;
    try {
      [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [result[0].insertId]);
    } catch (dbErr) {
      console.error('DB error (select after insert):', dbErr, { insertId: result[0].insertId });
      return res.status(500).json({ error: 'Database select error', details: dbErr.message });
    }
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('General error in POST /appointments:', err, { body: req.body });
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


// Accept or cancel an appointment
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  let { status, date, time, remarks } = req.body;
  // Sanitize date to YYYY-MM-DD if it is an ISO string
  if (typeof date === 'string' && date.includes('T')) {
    date = date.split('T')[0];
  }
  console.log('PATCH /appointments/:id', { id, body: { ...req.body, date } });
  if (!['accepted', 'cancelled', 'pending'].includes(status)) {
    console.error('Invalid status:', status);
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    let bookingId = null;
    if (status === 'accepted') {
      // Generate unique booking id
      bookingId = generateBookingId();
      await db.query(
        'UPDATE appointments SET status = ?, bookingId = ?, date = ?, time = ?, lastUpdate = NOW() WHERE id = ?',
        [status, bookingId, date, time, id]
      );
    } else if (status === 'cancelled') {
      // Save cancellation reason in remarks
      await db.query(
        'UPDATE appointments SET status = ?, date = ?, time = ?, remarks = ?, lastUpdate = NOW() WHERE id = ?',
        [status, date, time, remarks || null, id]
      );
    } else {
      await db.query(
        'UPDATE appointments SET status = ?, date = ?, time = ?, lastUpdate = NOW() WHERE id = ?',
        [status, date, time, id]
      );
    }
    let rows;
    [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
    const appt = rows[0];
    // Format date for email: 'Day Mon DD YYYY'
    let formattedDate = appt.date;
    if (appt.date) {
      try {
        const dateObj = new Date(appt.date);
        if (!isNaN(dateObj)) {
          formattedDate = dateObj.toDateString(); // e.g., 'Sat Sep 06 2025'
        }
      } catch (e) {
        // fallback to original
      }
    }
    // Send email if accepted
    if (status === 'accepted' && appt && appt.email) {
      try {
        await sendMail({
          to: appt.email,
          subject: 'Your Puertollano Dental Appointment is Confirmed',
          text: `Dear ${appt.name},\n\nYour appointment has been accepted. Your booking confirmation ID is ${appt.bookingId}.\n\nDate: ${formattedDate}\nTime: ${appt.time}\nBranch: ${appt.branch}\n\nPlease keep this ID for your records.\n\nThank you!`,
          html: `<p>Dear ${appt.name},</p><p>Your appointment has been <b>accepted</b>.</p><p><b>Booking Confirmation ID:</b> <span style='font-size:1.2em'>${appt.bookingId}</span></p><ul><li><b>Date:</b> ${formattedDate}</li><li><b>Time:</b> ${appt.time}</li><li><b>Branch:</b> ${appt.branch}</li></ul><p>Please keep this ID for your records.<br>Thank you!</p>`
        });
      } catch (mailErr) {
        // Log but don't fail the request
        console.error('Failed to send confirmation email:', mailErr);
      }
    }
    res.json(appt);
  } catch (err) {
    console.error('General error in PATCH /appointments/:id:', err, { id, body: req.body });
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


// Lookup appointment by bookingId and email
router.post('/lookup', async (req, res) => {
  const { bookingId, email } = req.body;
  if (!bookingId || !email) {
    return res.status(400).json({ error: 'Missing bookingId or email' });
  }
  try {
    const [rows] = await db.query('SELECT id, date, status FROM appointments WHERE bookingId = ? AND email = ?', [bookingId, email]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ date: rows[0].date, status: rows[0].status });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Cancel appointment by bookingId and email (set status to 'cancelled')
router.post('/cancel', async (req, res) => {
  const { bookingId, email } = req.body;
  if (!bookingId || !email) {
    return res.status(400).json({ error: 'Missing bookingId or email' });
  }
  try {
    // Get appointment
    const [rows] = await db.query('SELECT id, date, status FROM appointments WHERE bookingId = ? AND email = ?', [bookingId, email]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    const appt = rows[0];
    // Check if already cancelled
    if (appt.status === 'cancelled') {
      return res.status(400).json({ error: 'Appointment already cancelled' });
    }
    // Check if more than 3 days away
    const today = new Date();
    const apptDate = new Date(appt.date);
    const diff = (apptDate - today) / (1000 * 60 * 60 * 24);
    if (diff <= 3) {
      return res.status(400).json({ error: 'Cannot cancel less than 3 days before appointment' });
    }
  // Cancel appointment, set remarks
  await db.query('UPDATE appointments SET status = ?, remarks = ?, lastUpdate = NOW() WHERE id = ?', ['cancelled', 'cancelled by patient', appt.id]);
  res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
