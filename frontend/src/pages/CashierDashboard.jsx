// src/pages/CashierDashboard.jsx
// Cashier: view bills (Served orders), apply a payment and mark the order as Paid.
import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import OrdersPanel from '../components/OrdersPanel.jsx';
import { api } from '../api.js';
import { Label } from '../labels/labels.js';   // labels helper

export default function CashierDashboard() {
  // 3d - payment method kept in state and chosen with a select (form control)
  const [method, setMethod] = useState('Cash');

  async function pay(order, reload) {
    try {
      await api('/api/payments', { method: 'POST', body: { order_id: order.id, method } });   // CREATE - 4d
      reload();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <Navbar title="Cashier" />
      <main className="page">
        <h2>Bills <Label id="3d" note="payment method select" /></h2>
        <div className="card field-row">
          Payment method:{' '}
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {/* 3e - iterative rendering with map() */}
            {['Cash', 'Card', 'UPI'].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <Label id="3e" note="map() over payment methods" />
        </div>

        <OrdersPanel
          title="Orders to bill and recent payments"
          url="/api/payments/bills"
          emptyText="No bills yet. Orders appear here after they are served."
          renderActions={(o, reload) =>
            // 2d - conditional rendering: Pay button for Served orders, text for Paid ones
            o.status === 'Served' ? (
              <button className="btn btn-success btn-small" onClick={() => pay(o, reload)}>{`Receive Rs. ${Number(o.total).toFixed(2)} (${method})`}</button>
            ) : (
              <span className="muted small">{`Paid by ${o.method || 'n/a'}`}</span>
            )
          }
        />
        <Label id="2d" note="Pay button vs Paid text" />
      </main>
    </div>
  );
}
