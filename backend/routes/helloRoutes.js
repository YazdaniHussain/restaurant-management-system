// backend/routes/helloRoutes.js
// Section 4 basics: hello world route, small multi-route website, console hello world.
// These routes are PUBLIC (no login) so they can be opened directly in a browser.
const express = require('express');
const { pool } = require('../db');
const { labelLog } = require('../labels');   // labels helper

const router = express.Router();

// ---------------------------------------------------------------------
// 4a - 'hello world' message in a route, opened through the browser
//      Open:  http://localhost:5000/hello
// ---------------------------------------------------------------------
router.get('/hello', (req, res) => {
  labelLog('4a', 'helloRoutes.js - GET /hello');
  res.send('Hello World');
});

// ---------------------------------------------------------------------
// 4b - a small website with multiple routes using Express.js
//      Open:  /site   /site/about   /site/menu   /site/contact
// ---------------------------------------------------------------------
// This small helper builds a simple HTML page with a navigation bar.
function page(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>body{font-family:Arial;max-width:640px;margin:30px auto;padding:0 12px}
  nav a{margin-right:12px}footer{margin-top:30px;color:#777;font-size:12px}</style></head>
  <body><nav><a href="/site">Home</a><a href="/site/about">About</a>
  <a href="/site/menu">Menu</a><a href="/site/contact">Contact</a></nav><h1>${title}</h1>${body}
  <footer>Express multi-route demo (4b)</footer></body></html>`;
}

router.get('/site', (req, res) => {
  labelLog('4b', 'helloRoutes.js - GET /site');
  res.send(page('Welcome to Spice Garden', '<p>This small website is served by Express routes.</p>'));
});
router.get('/site/about', (req, res) => {
  labelLog('4b', 'helloRoutes.js - GET /site/about');
  res.send(page('About Us', '<p>We serve North and South Indian food since 2010.</p>'));
});
router.get('/site/menu', async (req, res) => {
  labelLog('4b', 'helloRoutes.js - GET /site/menu');
  try {
    const [rows] = await pool.query('SELECT name, price FROM menu_items WHERE available = 1 ORDER BY category, name');
    const list = rows.map(r => `<li>${r.name} - Rs. ${r.price}</li>`).join('');
    res.send(page('Our Menu', `<ul>${list}</ul>`));
  } catch (err) {
    res.status(500).send(page('Menu', '<p>Could not load the menu (is MySQL running?).</p>'));
  }
});
router.get('/site/contact', (req, res) => {
  labelLog('4b', 'helloRoutes.js - GET /site/contact');
  res.send(page('Contact', '<p>Phone: 9000000000<br>Email: hello@spicegarden.example</p>'));
});

// ---------------------------------------------------------------------
// 4c - print 'hello world' in the BROWSER console using Express.js
//      Open:  /hello-console   then press F12 -> Console tab.
//      Express sends a tiny page whose script runs console.log in the browser.
// ---------------------------------------------------------------------
router.get('/hello-console', (req, res) => {
  labelLog('4c', 'helloRoutes.js - GET /hello-console');
  res.send(`<!doctype html><html><body>
    <h2>Open the browser console (F12 &rarr; Console)</h2>
    <script>console.log('hello world');</script></body></html>`);
});

// ---------------------------------------------------------------------
// Public JSON APIs used by the React app:
//   GET /api/hello/menu  - public menu list (used by 3b useEffect fetch demo & customer menu)
//   GET /api/hello/info  - small info object for the lab demo page
// ---------------------------------------------------------------------
router.get('/api/hello/menu', async (req, res) => {
  labelLog('4d', 'helloRoutes.js - READ menu_items (public)');
  try {
    const [rows] = await pool.query('SELECT id, name, category, price FROM menu_items WHERE available = 1 ORDER BY category, name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not read the menu' });
  }
});
router.get('/api/hello/info', (req, res) => {
  labelLog('4a', 'helloRoutes.js - GET /api/hello/info');
  res.json({ message: 'Hello World from Express', time: new Date().toISOString() });
});

module.exports = router;
