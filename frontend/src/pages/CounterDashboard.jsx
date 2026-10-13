// src/pages/CounterDashboard.jsx
// Counter: take walk-in orders, assign tables to waiters, and manage takeaway / parcel / delivery orders.
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import OrderForm from '../components/OrderForm.jsx';
import OrdersPanel from '../components/OrdersPanel.jsx';
import { api } from '../api.js';
import { Label } from '../labels/labels.js';   // labels helper

export default function CounterDashboard() {
  const [tab, setTab] = useState('walkin');       // which section is open
  const [tables, setTables] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [refresh, setRefresh] = useState(0);

  // 3b - useEffect: load tables and waiters from the API
  useEffect(() => {
    api('/api/tables').then(setTables).catch(() => setTables([]));
    api('/api/staff?role=Waiter').then(setWaiters).catch(() => setWaiters([]));
  }, [refresh]);

  // UPDATE (4d): assign a waiter to a table
  async function assignWaiter(tableId, waiterId) {
    await api(`/api/tables/${tableId}`, { method: 'PUT', body: { waiter_id: Number(waiterId) } });
    setRefresh((n) => n + 1);
  }

  // UPDATE (4d): mark a Ready order as Served / handed over
  async function serve(order, reload) {
    try {
      await api(`/api/orders/${order.id}/status`, { method: 'PUT', body: { status: 'Served' } });
      reload();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <Navbar title="Counter" />
      <main className="page">
        <div className="chips">
          {/* 3e - iterative rendering with map(): the tab buttons */}
          {[['walkin', 'Walk-in order'], ['orders', 'Takeaway / Parcel / Delivery'], ['tables', 'Tables']].map(([key, text]) => (
            <button key={key} className={'chip' + (tab === key ? ' chip-active' : '')} onClick={() => setTab(key)}>{text}</button>
          ))}
          <Label id="3e" note="map() over tabs" />
        </div>

        {/* 2d - conditional rendering: only the chosen tab is shown */}
        {tab === 'walkin' && (
          <>
            <h2>Take a walk-in order</h2>
            <OrderForm
              allowedTypes={['Dine-in', 'Takeaway', 'Parcel', 'Home Delivery']}
              askName
              onPlaced={() => setRefresh((n) => n + 1)}
            />
          </>
        )}

        {tab === 'orders' && (
          <OrdersPanel
            key={refresh}
            title="Takeaway, parcel and delivery orders"
            filter={(o) => o.order_type !== 'Dine-in' && o.status !== 'Paid'}
            emptyText="No active takeaway / parcel / delivery orders."
            renderActions={(o, reload) =>
              o.status === 'Ready' ? (
                <button className="btn btn-success btn-small" onClick={() => serve(o, reload)}>
                  {o.order_type === 'Home Delivery' ? 'Hand to delivery' : 'Hand over to customer'}
                </button>
              ) : (
                <span className="muted small">{o.status === 'Served' ? 'Waiting for the cashier' : 'In the kitchen'}</span>
              )
            }
          />
        )}

        {tab === 'tables' && (
          <section>
            <h3>Assign tables to waiters <Label id="3d" note="select inputs update the API" /></h3>
            <div className="grid">
              {tables.map((t) => (
                <div key={t.id} className="card">
                  <strong>{`Table ${t.table_number}`}</strong> <span className="muted small">{`${t.seats} seats - ${t.status}`}</span>
                  <label>Waiter
                    <select value={t.waiter_id || ''} onChange={(e) => assignWaiter(t.id, e.target.value)}>
                      <option value="" disabled>-- choose --</option>
                      {waiters.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </label>
                </div>
              ))}
            </div>
            <Label id="3e" note="map() over tables and waiters" />
          </section>
        )}
        <Label id="2d" note="tab sections rendered conditionally" />
      </main>
    </div>
  );
}
