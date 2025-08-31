const express = require('express');
const router = express.Router();


const db = require('../db');


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
  const { name, email, date, time } = req.body;
  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO appointments (name, email, date, time, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, date, time, 'pending']
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
  const { status } = req.body;
  if (!['accepted', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const [result] = await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
