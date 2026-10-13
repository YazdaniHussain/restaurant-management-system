// src/components/OrdersPanel.jsx
// Reusable list of orders for a dashboard. It fetches /api/orders (the API filters by role)
// and refreshes every 5 seconds so status changes appear without reloading.
// "renderActions(order, reload)" is a function prop: each dashboard decides which buttons to show.
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import OrderCard from './OrderCard.jsx';
import { Label } from '../labels/labels.js';   // labels helper

export default function OrdersPanel({ title, filter, renderActions, emptyText = 'No orders right now.', url = '/api/orders' }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api(url).then(setOrders).catch((e) => setError(e.message));
  }, [url]);

  // 3b - useEffect: fetch orders on load and then every 5 seconds
  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);       // cleanup when the page closes
  }, [load]);

  const shown = filter ? orders.filter(filter) : orders;

  return (
    <section>
      <h3>{title} <Label id="3b" note="useEffect fetch /api/orders" /></h3>
      {error && <p className="error">{error}</p>}
      {shown.length === 0 && !error && <p className="muted">{emptyText}</p>}
      <div className="grid">
        {/* 3e - iterative rendering with map() */}
        {shown.map((o) => (
          <OrderCard key={o.id} order={o}>{renderActions ? renderActions(o, load) : null}</OrderCard>
        ))}
      </div>
    </section>
  );
}
