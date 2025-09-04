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
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO appointments (name, email, phone, procedure, date, time, branch, underHMO, hmoProvider, hmoMembershipNumber, employer, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, procedure, date, time, branch, underHMO, hmoProvider, hmoMembershipNumber, employer, 'pending']
    );
    const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


// Accept or cancel an appointment
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, date, time } = req.body;
  console.log('PATCH /appointments/:id', { id, body: req.body });
  if (!['accepted', 'cancelled', 'pending'].includes(status)) {
    console.error('Invalid status:', status);
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    let bookingId = null;
    if (status === 'accepted') {
      // Generate unique booking id
      bookingId = generateBookingId();
      try {
        await db.query('UPDATE appointments SET status = ?, bookingId = ?, date = ?, time = ? WHERE id = ?', [status, bookingId, date, time, id]);
      } catch (dbErr) {
        console.error('DB error (accepted):', dbErr, { status, bookingId, date, time, id });
        return res.status(500).json({ error: 'Database update error (accepted)', details: dbErr.message });
      }
    } else {
      try {
        await db.query('UPDATE appointments SET status = ?, date = ?, time = ? WHERE id = ?', [status, date, time, id]);
      } catch (dbErr) {
        console.error('DB error (other status):', dbErr, { status, date, time, id });
        return res.status(500).json({ error: 'Database update error (other status)', details: dbErr.message });
      }
    }
    let rows;
    try {
      [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
    } catch (dbErr) {
      console.error('DB error (select after update):', dbErr, { id });
      return res.status(500).json({ error: 'Database select error', details: dbErr.message });
    }
    const appt = rows[0];
    // Send email if accepted
    if (status === 'accepted' && appt && appt.email) {
      try {
        await sendMail({
          to: appt.email,
          subject: 'Your Puertollano Dental Appointment is Confirmed',
          text: `Dear ${appt.name},\n\nYour appointment has been accepted. Your booking confirmation ID is ${appt.bookingId}.\n\nDate: ${appt.date}\nTime: ${appt.time}\nBranch: ${appt.branch}\n\nPlease keep this ID for your records.\n\nThank you!`,
          html: `<p>Dear ${appt.name},</p><p>Your appointment has been <b>accepted</b>.</p><p><b>Booking Confirmation ID:</b> <span style='font-size:1.2em'>${appt.bookingId}</span></p><ul><li><b>Date:</b> ${appt.date}</li><li><b>Time:</b> ${appt.time}</li><li><b>Branch:</b> ${appt.branch}</li></ul><p>Please keep this ID for your records.<br>Thank you!</p>`
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

module.exports = router;
