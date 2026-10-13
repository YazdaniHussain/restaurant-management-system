// backend/routes/orderRoutes.js
// Orders flow through the roles:
//   Customer/Counter/Waiter place it -> Kitchen prepares -> Waiter/Counter serve -> Cashier bills (see paymentRoutes.js)
// Status order:  Placed -> Preparing -> Ready -> Served -> Paid
// 4d - CRUD operations on orders and order_items.
const express = require('express');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../auth');
const { labelLog } = require('../labels');   // labels helper

const router = express.Router();
router.use(requireAuth);

const ORDER_TYPES = ['Dine-in', 'Takeaway', 'Parcel', 'Home Delivery'];

// Here we attach the items to every order in a list (one extra query for all orders)
async function withItems(orders) {
  if (!orders.length) return orders;
  const ids = orders.map(o => o.id);
  const [items] = await pool.query(
    `SELECT oi.order_id, oi.menu_item_id, oi.quantity, oi.unit_price, m.name
     FROM order_items oi JOIN menu_items m ON m.id = oi.menu_item_id WHERE oi.order_id IN (?)`, [ids]);
  return orders.map(o => ({ ...o, items: items.filter(i => i.order_id === o.id) }));
}

const SELECT_ORDERS = `SELECT o.*, t.table_number FROM orders o LEFT JOIN restaurant_tables t ON t.id = o.table_id`;

// ---------------- CREATE: place an order ----------------
// Customer: any type for himself.  Counter: any type (walk-in).  Waiter: dine-in only.
router.post('/', requireRole('Customer', 'Counter', 'Waiter'), async (req, res) => {
  labelLog('4d', 'orderRoutes.js - CREATE (POST /api/orders)');
  const { order_type, table_id, address, customer_name, items } = req.body || {};
  const role = req.user.role;

  if (!ORDER_TYPES.includes(order_type)) return res.status(400).json({ error: 'Choose a valid order type' });
  if (role === 'Waiter' && order_type !== 'Dine-in') return res.status(403).json({ error: 'Waiters take dine-in orders only' });
  if (order_type === 'Dine-in' && !table_id) return res.status(400).json({ error: 'Dine-in orders need a table number' });
  if (order_type === 'Home Delivery' && !String(address || '').trim()) return res.status(400).json({ error: 'Home Delivery needs an address' });
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'The cart is empty' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Prices are read from the database (never trusted from the browser)
    const ids = items.map(i => Number(i.menu_item_id));
    const [menu] = await conn.query('SELECT id, price, available FROM menu_items WHERE id IN (?)', [ids]);
    const byId = new Map(menu.map(m => [m.id, m]));
    let total = 0;
    const lines = [];
    for (const it of items) {
      const m = byId.get(Number(it.menu_item_id));
      const qty = Math.max(1, Math.floor(Number(it.quantity) || 1));
      if (!m || !m.available) throw new Error('A dish in the cart is not available');
      total += m.price * qty;
      lines.push([Number(it.menu_item_id), qty, m.price]);
    }

    if (order_type === 'Dine-in') {
      const [t] = await conn.query('SELECT id FROM restaurant_tables WHERE id = ?', [table_id]);
      if (!t.length) throw new Error('Table not found');
    }

    const customerId = role === 'Customer' ? req.user.id : null;
    const name = role === 'Customer' ? req.user.name : (customer_name || 'Walk-in Guest');
    const [r] = await conn.query(
      `INSERT INTO orders (customer_id, customer_name, order_type, table_id, address, status, total, placed_by)
       VALUES (?,?,?,?,?, 'Placed', ?, ?)`,
      [customerId, name, order_type, order_type === 'Dine-in' ? table_id : null,
       order_type === 'Home Delivery' ? address.trim() : null, total, req.user.id]
    );
    for (const l of lines) {
      await conn.query('INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (?,?,?,?)', [r.insertId, ...l]);
    }
    if (order_type === 'Dine-in') await conn.query("UPDATE restaurant_tables SET status='Occupied' WHERE id = ?", [table_id]);

    await conn.commit();
    res.status(201).json({ id: r.insertId, total });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message || 'Could not place the order' });
  } finally {
    conn.release();
  }
});

// ---------------- READ: list orders (what you see depends on your role) ----------------
router.get('/', async (req, res) => {
  labelLog('4d', 'orderRoutes.js - READ (GET /api/orders)');
  const { role, id } = req.user;
  let where = '';
  let params = [];
  if (role === 'Customer') { where = 'WHERE o.customer_id = ?'; params = [id]; }
  else if (role === 'Kitchen') { where = "WHERE o.status IN ('Placed','Preparing')"; }
  else if (role === 'Waiter') {
    // dine-in orders for the waiter's tables, plus orders the waiter placed himself
    where = "WHERE o.order_type = 'Dine-in' AND (t.waiter_id = ? OR o.placed_by = ?) AND o.status <> 'Paid'";
    params = [id, id];
  }
  else if (role === 'Cashier') { where = "WHERE o.status IN ('Served','Paid')"; }
  // Manager and Counter see all orders
  const [rows] = await pool.query(
    `SELECT o.*, t.table_number FROM orders o
     LEFT JOIN restaurant_tables t ON t.id = o.table_id ${where} ORDER BY o.created_at DESC, o.id DESC`, params);
  res.json(await withItems(rows));
});

// READ one order (customers can only open their own)
router.get('/:id', async (req, res) => {
  labelLog('4d', 'orderRoutes.js - READ one (GET /api/orders/:id)');
  const [rows] = await pool.query(SELECT_ORDERS + ' WHERE o.id = ?', [req.params.id]);
  const order = rows[0];
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (req.user.role === 'Customer' && order.customer_id !== req.user.id) return res.status(403).json({ error: 'Not your order' });
  res.json((await withItems([order]))[0]);
});

// ---------------- UPDATE: move an order to the next status ----------------
// Which role may make which change:
//   Kitchen: Placed -> Preparing, Preparing -> Ready
//   Waiter : Ready -> Served  (dine-in orders)
//   Counter: Ready -> Served  (any order type)
//   Cashier: Served -> Paid   (done in paymentRoutes.js)
const TRANSITIONS = {
  Kitchen: [['Placed', 'Preparing'], ['Preparing', 'Ready']],
  Waiter: [['Ready', 'Served']],
  Counter: [['Ready', 'Served']]
};
router.put('/:id/status', requireRole('Kitchen', 'Waiter', 'Counter'), async (req, res) => {
  labelLog('4d', 'orderRoutes.js - UPDATE (PUT /api/orders/:id/status)');
  const { status } = req.body || {};
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  const order = rows[0];
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const allowed = (TRANSITIONS[req.user.role] || []).some(([from, to]) => from === order.status && to === status);
  if (!allowed) return res.status(400).json({ error: `${req.user.role} cannot change an order from ${order.status} to ${status}` });
  if (req.user.role === 'Waiter' && order.order_type !== 'Dine-in') return res.status(403).json({ error: 'Waiters serve dine-in orders only' });

  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, order.id]);
  res.json({ ok: true });
});

// ---------------- DELETE: Manager removes an order ----------------
router.delete('/:id', requireRole('Manager'), async (req, res) => {
  labelLog('4d', 'orderRoutes.js - DELETE (DELETE /api/orders/:id)');
  await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);   // order_items are removed by ON DELETE CASCADE
  res.json({ ok: true });
});

module.exports = router;
