const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients ORDER BY patient_id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error in GET /patients:', {
      message: err.message,
      code: err.code,
      sql: err.sql,
      sqlMessage: err.sqlMessage,
      stack: err.stack
    });
    res.status(500).json({
      error: 'Database error',
      details: err.message,
      code: err.code,
      sql: err.sql,
      sqlMessage: err.sqlMessage,
      stack: err.stack
    });
  }
});

// Get single patient by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM patients WHERE patient_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in GET /patients/:id:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Create new patient
router.post('/', async (req, res) => {
  console.log('POST /patients payload:', req.body);
  const {
    first_name, last_name, date_of_birth, gender, email_address, contact_number,
    address, city, state, zip_code, emergency_contact_name, emergency_contact_phone,
    insurance_provider, insurance_id, medical_history, allergies, medications,
    preferred_dentist, preferred_branch, notes
  } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !email_address || !contact_number) {
    return res.status(400).json({ 
      error: 'Missing required fields: first_name, last_name, email_address, contact_number' 
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO patients (
        first_name, last_name, date_of_birth, gender, email_address, contact_number,
        address, city, state, zip_code, emergency_contact_name, emergency_contact_phone,
        insurance_provider, insurance_id, medical_history, allergies, medications,
        preferred_dentist, preferred_branch, notes, created_date, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        first_name, last_name, date_of_birth, gender, email_address, contact_number,
        address, city, state, zip_code, emergency_contact_name, emergency_contact_phone,
        insurance_provider, insurance_id, medical_history, allergies, medications,
        preferred_dentist, preferred_branch, notes
      ]
    );

    // Get the created patient
    const [rows] = await db.query('SELECT * FROM patients WHERE patient_id = ?', [result[0].insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error in POST /patients:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('PUT /patients/:id payload:', req.body);
  
  const {
    first_name, last_name, date_of_birth, gender, email_address, contact_number,
    address, city, state, zip_code, emergency_contact_name, emergency_contact_phone,
    insurance_provider, insurance_id, medical_history, allergies, medications,
    preferred_dentist, preferred_branch, notes
  } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !email_address || !contact_number) {
    return res.status(400).json({ 
      error: 'Missing required fields: first_name, last_name, email_address, contact_number' 
    });
  }

  try {
    // Check if patient exists
    const [existingRows] = await db.query('SELECT * FROM patients WHERE patient_id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await db.query(
      `UPDATE patients SET 
        first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, 
        email_address = ?, contact_number = ?, address = ?, city = ?, 
        state = ?, zip_code = ?, emergency_contact_name = ?, emergency_contact_phone = ?,
        insurance_provider = ?, insurance_id = ?, medical_history = ?, allergies = ?, 
        medications = ?, preferred_dentist = ?, preferred_branch = ?, notes = ?, 
        last_updated = NOW()
      WHERE patient_id = ?`,
      [
        first_name, last_name, date_of_birth, gender, email_address, contact_number,
        address, city, state, zip_code, emergency_contact_name, emergency_contact_phone,
        insurance_provider, insurance_id, medical_history, allergies, medications,
        preferred_dentist, preferred_branch, notes, id
      ]
    );

    // Get the updated patient
    const [rows] = await db.query('SELECT * FROM patients WHERE patient_id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in PUT /patients/:id:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Delete patient (soft delete by marking as inactive)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if patient exists
    const [existingRows] = await db.query('SELECT * FROM patients WHERE patient_id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Soft delete - you can modify this to actually delete or mark as inactive
    // For now, I'll add an 'is_active' field logic
    await db.query('UPDATE patients SET is_active = 0, last_updated = NOW() WHERE patient_id = ?', [id]);
    
    res.json({ message: 'Patient deleted successfully', patient_id: id });
  } catch (err) {
    console.error('Error in DELETE /patients/:id:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
