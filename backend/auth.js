// backend/auth.js
// Login sessions + role-based access middleware.
// Role based routing on the server: a user can only call APIs of their own role.
const crypto = require('crypto');
const { labelLog } = require('./labels');   // labels helper

// This Map stores logged-in sessions in memory:  token -> { id, name, role }
const sessions = new Map();

// Here we create a new random token after a successful login
function createSession(user) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { id: user.id, name: user.name, role: user.role, username: user.username });
  return token;
}

function destroySession(token) { sessions.delete(token); }

// This middleware checks that the request has a valid login token
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const user = token && sessions.get(token);
  if (!user) return res.status(401).json({ error: 'Please log in first' });
  req.user = user;
  req.token = token;
  next();
}

// This middleware allows only the listed roles, e.g. requireRole('Manager')
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Your role (' + req.user.role + ') cannot use this API' });
    }
    next();
  };
}

module.exports = { createSession, destroySession, requireAuth, requireRole };
