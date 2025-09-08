const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients ORDER BY id DESC');
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

module.exports = router;
