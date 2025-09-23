const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'office_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT i.*, c.company_name as client_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      ORDER BY i.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  try {
    const { clientId, amount, dueDate, description, items } = req.body;
    
    const query = `
      INSERT INTO invoices (client_id, amount, due_date, description, items, status)
      VALUES ($1, $2, $3, $4, $5, 'draft')
      RETURNING id, created_at
    `;
    
    const result = await pool.query(query, [
      clientId, amount, dueDate, description, JSON.stringify(items)
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

module.exports = router;