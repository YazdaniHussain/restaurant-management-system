// backend/routes/paymentRoutes.js
// Cashier: view bills, apply payments and mark orders as Paid.
const express = require('express');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../auth');
const { labelLog } = require('../labels');   // labels helper

const router = express.Router();
router.use(requireAuth);

// READ: bills = orders that are Served (waiting for payment) and Paid ones (history)
router.get('/bills', requireRole('Cashier', 'Manager'), async (req, res) => {
  labelLog('4d', 'paymentRoutes.js - READ (GET /api/payments/bills)');
  const [orders] = await pool.query(
    `SELECT o.*, t.table_number, p.method, p.paid_at FROM orders o
     LEFT JOIN restaurant_tables t ON t.id = o.table_id
     LEFT JOIN payments p ON p.order_id = o.id
     WHERE o.status IN ('Served','Paid') ORDER BY o.status = 'Served' DESC, o.created_at DESC`);
  if (!orders.length) return res.json([]);
  const [items] = await pool.query(
    `SELECT oi.order_id, oi.quantity, oi.unit_price, m.name FROM order_items oi
     JOIN menu_items m ON m.id = oi.menu_item_id WHERE oi.order_id IN (?)`, [orders.map(o => o.id)]);
  res.json(orders.map(o => ({ ...o, items: items.filter(i => i.order_id === o.id) })));
});

// CREATE: Cashier applies a payment -> order becomes Paid
router.post('/', requireRole('Cashier'), async (req, res) => {
  labelLog('4d', 'paymentRoutes.js - CREATE (POST /api/payments)');
  const { order_id, method } = req.body || {};
  if (!['Cash', 'Card', 'UPI'].includes(method)) return res.status(400).json({ error: 'Choose Cash, Card or UPI' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM orders WHERE id = ? FOR UPDATE', [order_id]);
    const order = rows[0];
    if (!order) throw new Error('Order not found');
    if (order.status !== 'Served') throw new Error('Only Served orders can be billed (current status: ' + order.status + ')');

    await conn.query('INSERT INTO payments (order_id, amount, method, cashier_id) VALUES (?,?,?,?)', [order.id, order.total, method, req.user.id]);
    await conn.query("UPDATE orders SET status = 'Paid' WHERE id = ?", [order.id]);

    // Free the dining table when no other unpaid order is using it
    if (order.table_id) {
      const [open] = await conn.query("SELECT id FROM orders WHERE table_id = ? AND status <> 'Paid'", [order.table_id]);
      if (!open.length) await conn.query("UPDATE restaurant_tables SET status = 'Free' WHERE id = ?", [order.table_id]);
    }
    await conn.commit();
    res.status(201).json({ ok: true, amount: order.total });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
