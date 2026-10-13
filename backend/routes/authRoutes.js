// backend/routes/authRoutes.js
// Login / logout / "who am I" APIs.
const express = require('express');
const { pool } = require('../db');
const { verifyPassword } = require('../password');
const { createSession, destroySession, requireAuth } = require('../auth');
const { labelLog } = require('../labels');  // labels helper

const router = express.Router();

// POST /api/auth/login   body: { role, username, password }
// The user chooses a role on the login page; we check the role matches the account.
router.post('/login', async (req, res) => {
  labelLog('4d', 'authRoutes.js - READ users table (login)');
  try {
    const { role, username, password } = req.body || {};
    if (!role || !username || !password) return res.status(400).json({ error: 'Role, username and password are required' });
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND role = ?', [username, role]);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid username, password or role' });
    }
    const token = createSession(user);
    res.json({ token, user: { id: user.id, name: user.name, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/auth/me  -> returns the logged-in user (used to keep the login after refresh)
router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

// POST /api/auth/logout
router.post('/logout', requireAuth, (req, res) => {
  destroySession(req.token);
  res.json({ ok: true });
});

module.exports = router;
