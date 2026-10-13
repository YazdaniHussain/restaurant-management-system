// backend/server.js
// Main Express server: connects all route files and starts listening.
// 4a / 4b / 4c routes are in routes/helloRoutes.js, CRUD (4d) in the other route files,
// and the MySQL connection (4e) in db.js.
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./db');
const { labelLog } = require('./labels');   // labels helper

const app = express();

// Here we allow the React app (Vite dev server) to call this API and read JSON bodies.
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// ---- Routes ----
app.use('/', require('./routes/helloRoutes'));                 // 4a, 4b, 4c (+ public menu JSON)
app.use('/api/auth', require('./routes/authRoutes'));          // login / logout
app.use('/api/menu', require('./routes/menuRoutes'));          // 4d CRUD - menu items
app.use('/api/staff', require('./routes/staffRoutes'));        // 4d CRUD - staff
app.use('/api/tables', require('./routes/tableRoutes'));       // tables
app.use('/api/orders', require('./routes/orderRoutes'));       // 4d CRUD - orders
app.use('/api/payments', require('./routes/paymentRoutes'));   // billing
app.use('/api/reports', require('./routes/reportRoutes'));     // sales reports (subqueries - 5c)

// Unknown API path -> JSON 404
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

const PORT = Number(process.env.PORT || 5000);

// Start the server first, then test the database connection (4e).
app.listen(PORT, async () => {
  console.log('Restaurant API running on http://localhost:' + PORT);
  labelLog('4a', 'server.js - Express server started');
  try {
    await testConnection();
    console.log('MySQL connected to database "' + (process.env.DB_NAME || 'restaurant_db') + '"');
  } catch (err) {
    console.error('MySQL connection failed: ' + err.message);
    console.error('Check backend/.env and make sure database/database.sql was imported.');
  }
});
