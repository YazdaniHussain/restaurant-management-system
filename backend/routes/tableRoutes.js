// backend/routes/tableRoutes.js
// Dining tables: list, assign a waiter, change status.  (CRUD - 4d)
const express = require('express');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../auth');
const { labelLog } = require('../labels');   // labels helper

const router = express.Router();
router.use(requireAuth);

// READ: everybody logged in can see tables (customers pick a table for dine-in).
// Waiter can ask only for his own tables with ?mine=1
router.get('/', async (req, res) => {
  labelLog('4d', 'tableRoutes.js - READ (GET /api/tables)');
  let sql = `SELECT t.id, t.table_number, t.seats, t.status, t.waiter_id, u.name AS waiter_name
             FROM restaurant_tables t LEFT JOIN users u ON u.id = t.waiter_id`;
  const params = [];
  if (req.query.mine === '1' && req.user.role === 'Waiter') { sql += ' WHERE t.waiter_id = ?'; params.push(req.user.id); }
  sql += ' ORDER BY t.table_number';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// UPDATE: Counter (or Manager) assigns a waiter and/or sets the table status
router.put('/:id', requireRole('Counter', 'Manager'), async (req, res) => {
  labelLog('4d', 'tableRoutes.js - UPDATE (PUT /api/tables/:id)');
  const { waiter_id, status } = req.body || {};
  if (status && !['Free', 'Occupied'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  await pool.query(
    'UPDATE restaurant_tables SET waiter_id = COALESCE(?, waiter_id), status = COALESCE(?, status) WHERE id = ?',
    [waiter_id || null, status || null, req.params.id]
  );
  res.json({ ok: true });
});

// CREATE: Manager adds a table
router.post('/', requireRole('Manager'), async (req, res) => {
  labelLog('4d', 'tableRoutes.js - CREATE (POST /api/tables)');
  const { table_number, seats } = req.body || {};
  if (!table_number) return res.status(400).json({ error: 'Table number is required' });
  try {
    const [r] = await pool.query('INSERT INTO restaurant_tables (table_number, seats) VALUES (?,?)', [table_number, seats || 4]);
    res.status(201).json({ id: r.insertId });
  } catch (err) { res.status(409).json({ error: 'That table number already exists' }); }
});

module.exports = router;
