// backend/password.js
// Password hashing helper using Node's built-in crypto (scrypt) - no extra package needed.
// Stored format: "<salt-hex>:<hash-hex>"
const crypto = require('crypto');
const { labelLog } = require('./labels'); // labels helper (safe no-op when labels block is commented out)

// Here we are creating a salted hash of a plain password
function hashPassword(plain, saltHex) {
  const salt = saltHex ? Buffer.from(saltHex, 'hex') : crypto.randomBytes(16);
  const hash = crypto.scryptSync(plain, salt, 32);
  return salt.toString('hex') + ':' + hash.toString('hex');
}

// This is used to compare a typed password with the stored hash
function verifyPassword(plain, stored) {
  labelLog('4d'); // login uses a DB read (part of CRUD)
  const [saltHex, hashHex] = String(stored).split(':');
  if (!saltHex || !hashHex) return false;
  const test = crypto.scryptSync(plain, Buffer.from(saltHex, 'hex'), 32).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(test, 'hex'), Buffer.from(hashHex, 'hex'));
}

module.exports = { hashPassword, verifyPassword };
