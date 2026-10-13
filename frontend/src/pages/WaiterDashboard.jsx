// src/pages/WaiterDashboard.jsx
// Waiter: see assigned tables, take dine-in orders and serve Ready orders.
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import OrderForm from '../components/OrderForm.jsx';
import OrdersPanel from '../components/OrdersPanel.jsx';
import { api } from '../api.js';
import { Label } from '../labels/labels.js';   // labels helper

export default function WaiterDashboard() {
  const [tables, setTables] = useState([]);
  const [refresh, setRefresh] = useState(0);

  // 3b - useEffect: fetch only this waiter's tables (?mine=1)
  useEffect(() => {
    api('/api/tables?mine=1').then(setTables).catch(() => setTables([]));
  }, [refresh]);

  async function serve(order, reload) {
    try {
      await api(`/api/orders/${order.id}/status`, { method: 'PUT', body: { status: 'Served' } });   // UPDATE - 4d
      reload();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <Navbar title="Waiter" />
      <main className="page">
        <h2>My tables <Label id="3b" note="useEffect fetch /api/tables?mine=1" /></h2>
        <div className="grid">
          {/* 3e - iterative rendering with map() */}
          {tables.map((t) => (
            <div key={t.id} className="card">
              <strong>{`Table ${t.table_number}`}</strong>
              <div className="muted small">{`${t.seats} seats`}</div>
              <span className={t.status === 'Free' ? 'badge badge-free' : 'badge badge-busy'}>{t.status}</span>
            </div>
          ))}
          {tables.length === 0 && <p className="muted">No tables are assigned to you yet.</p>}
        </div>
        <Label id="3e" note="map() over tables" />

        <hr />
        <h2>Take a dine-in order</h2>
        <OrderForm
          allowedTypes={['Dine-in']}
          askName
          tablesUrl="/api/tables?mine=1"
          onPlaced={() => setRefresh((n) => n + 1)}
        />

        <hr />
        <OrdersPanel
          key={refresh}
          title="Orders at my tables"
          emptyText="No active dine-in orders."
          renderActions={(o, reload) =>
            // 2d - conditional rendering: Serve button only when the kitchen marked it Ready
            o.status === 'Ready' ? (
              <button className="btn btn-success btn-small" onClick={() => serve(o, reload)}>Serve to table</button>
            ) : (
              <span className="muted small">{o.status === 'Served' ? 'Waiting for the cashier' : 'In the kitchen'}</span>
            )
          }
        />
        <Label id="2c" note="Serve button click" />
        <Label id="2d" note="Serve button only when Ready" />
      </main>
    </div>
  );
}
