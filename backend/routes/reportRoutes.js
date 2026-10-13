// backend/routes/reportRoutes.js
// Manager: sales reports. The queries use SUBQUERIES (this is where 5c is used from the API).
const express = require('express');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../auth');
const { labelLog } = require('../labels');   // labels helper

const router = express.Router();
router.use(requireAuth, requireRole('Manager'));

router.get('/summary', async (req, res) => {
  labelLog('5c', 'reportRoutes.js - subqueries in sales report');
  labelLog('4d', 'reportRoutes.js - READ (GET /api/reports/summary)');

  const [[totals]] = await pool.query(
    `SELECT COUNT(*) AS orders,
            COALESCE(SUM(total),0) AS sales,
            COALESCE(SUM(CASE WHEN status='Paid' THEN total END),0) AS paid_sales
     FROM orders`);

  const [byType] = await pool.query(
    'SELECT order_type, COUNT(*) AS orders, COALESCE(SUM(total),0) AS sales FROM orders GROUP BY order_type');

  // Subquery 1 (5c): dishes sold, with the quantity taken from a subquery in FROM
  const [topDishes] = await pool.query(
    `SELECT m.name, t.qty FROM (SELECT menu_item_id, SUM(quantity) AS qty FROM order_items GROUP BY menu_item_id) t
     JOIN menu_items m ON m.id = t.menu_item_id ORDER BY t.qty DESC LIMIT 5`);

  // Subquery 2 (5c): orders bigger than the average order value
  const [bigOrders] = await pool.query(
    'SELECT id, order_type, total FROM orders WHERE total > (SELECT AVG(total) FROM orders) ORDER BY total DESC');

  const [byStatus] = await pool.query('SELECT status, COUNT(*) AS orders FROM orders GROUP BY status');

  res.json({ totals, byType, topDishes, bigOrders, byStatus });
});

module.exports = router;
