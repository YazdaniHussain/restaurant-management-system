// backend/routes/staffRoutes.js
// Manager manages staff (users). Another CRUD example for 4d.
const express = require('express');
const { pool } = require('../db');
const { hashPassword } = require('../password');
const { requireAuth, requireRole } = require('../auth');
const { labelLog } = require('../labels');   // labels helper

const router = express.Router();
router.use(requireAuth);

const ROLES = ['Manager', 'Counter', 'Cashier', 'Waiter', 'Kitchen', 'Customer'];

// READ: Manager lists staff; Counter may list waiters (to assign tables)
router.get('/', requireRole('Manager', 'Counter'), async (req, res) => {
  labelLog('4d', 'staffRoutes.js - READ (GET /api/staff)');
  const onlyWaiters = req.query.role === 'Waiter';
  const [rows] = await pool.query(
    "SELECT id, name, username, role, phone FROM users WHERE role <> 'Customer'" + (onlyWaiters ? " AND role = 'Waiter'" : '') + ' ORDER BY role, name'
  );
  res.json(rows);
});

// CREATE: Manager adds a staff member
router.post('/', requireRole('Manager'), async (req, res) => {
  labelLog('4d', 'staffRoutes.js - CREATE (POST /api/staff)');
  const { name, username, password, role, phone } = req.body || {};
  if (!name || !username || !password || !ROLES.includes(role)) {
    return res.status(400).json({ error: 'Name, username, password and a valid role are required' });
  }
  try {
    const [r] = await pool.query(
      'INSERT INTO users (name, username, password_hash, role, phone) VALUES (?,?,?,?,?)',
      [name, username, hashPassword(password), role, phone || null]
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    res.status(409).json({ error: 'That username already exists' });
  }
});

// UPDATE: Manager edits a staff member (password only changes if a new one is typed)
router.put('/:id', requireRole('Manager'), async (req, res) => {
  labelLog('4d', 'staffRoutes.js - UPDATE (PUT /api/staff/:id)');
  const { name, role, phone, password } = req.body || {};
  if (!name || !ROLES.includes(role)) return res.status(400).json({ error: 'Name and a valid role are required' });
  if (password) {
    await pool.query('UPDATE users SET name=?, role=?, phone=?, password_hash=? WHERE id=?', [name, role, phone || null, hashPassword(password), req.params.id]);
  } else {
    await pool.query('UPDATE users SET name=?, role=?, phone=? WHERE id=?', [name, role, phone || null, req.params.id]);
  }
  res.json({ ok: true });
});

// DELETE: Manager removes a staff member (but not themselves)
router.delete('/:id', requireRole('Manager'), async (req, res) => {
  labelLog('4d', 'staffRoutes.js - DELETE (DELETE /api/staff/:id)');
  if (Number(req.params.id) === req.user.id) return res.status(400).json({ error: 'You cannot delete your own account' });
  await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
