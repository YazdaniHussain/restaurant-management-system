// backend/routes/menuRoutes.js
// 4d - CRUD operations using Express.js  (Create, Read, Update, Delete on menu_items)
const express = require('express');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../auth');
const { labelLog } = require('../labels');   // labels helper

const router = express.Router();
router.use(requireAuth);                     // everything below needs a login

// READ (R of CRUD): all roles can read the menu. Manager can also see unavailable items (?all=1).
router.get('/', async (req, res) => {
  labelLog('4d', 'menuRoutes.js - READ (GET /api/menu)');
  const showAll = req.query.all === '1' && req.user.role === 'Manager';
  const sql = 'SELECT * FROM menu_items' + (showAll ? '' : ' WHERE available = 1') + ' ORDER BY category, name';
  const [rows] = await pool.query(sql);
  res.json(rows);
});

// CREATE (C of CRUD): Manager adds a new dish
router.post('/', requireRole('Manager'), async (req, res) => {
  labelLog('4d', 'menuRoutes.js - CREATE (POST /api/menu)');
  const { name, category, description, price, available } = req.body || {};
  if (!name || !category || price === undefined || Number(price) < 0) {
    return res.status(400).json({ error: 'Name, category and a valid price are required' });
  }
  const [result] = await pool.query(
    'INSERT INTO menu_items (name, category, description, price, available) VALUES (?,?,?,?,?)',
    [name, category, description || null, Number(price), available === false || available === 0 ? 0 : 1]
  );
  res.status(201).json({ id: result.insertId });
});

// UPDATE (U of CRUD): Manager edits a dish
router.put('/:id', requireRole('Manager'), async (req, res) => {
  labelLog('4d', 'menuRoutes.js - UPDATE (PUT /api/menu/:id)');
  const { name, category, description, price, available } = req.body || {};
  const [result] = await pool.query(
    'UPDATE menu_items SET name=?, category=?, description=?, price=?, available=? WHERE id=?',
    [name, category, description || null, Number(price), available ? 1 : 0, req.params.id]
  );
  if (!result.affectedRows) return res.status(404).json({ error: 'Menu item not found' });
  res.json({ ok: true });
});

// DELETE (D of CRUD): Manager removes a dish (if it was never ordered)
router.delete('/:id', requireRole('Manager'), async (req, res) => {
  labelLog('4d', 'menuRoutes.js - DELETE (DELETE /api/menu/:id)');
  try {
    const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ ok: true });
  } catch (err) {
    // Foreign key error: the dish is used in old orders, so just hide it instead
    await pool.query('UPDATE menu_items SET available = 0 WHERE id = ?', [req.params.id]);
    res.json({ ok: true, note: 'Dish is used in past orders, so it was marked unavailable instead' });
  }
});

module.exports = router;
