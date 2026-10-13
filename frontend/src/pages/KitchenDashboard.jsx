// src/pages/KitchenDashboard.jsx
// Kitchen Staff: see incoming orders and update the status (Preparing -> Ready).
import Navbar from '../components/Navbar.jsx';
import OrdersPanel from '../components/OrdersPanel.jsx';
import { api } from '../api.js';
import { Label } from '../labels/labels.js';   // labels helper

export default function KitchenDashboard() {
  // 2c - click handler in a functional component: ask the API to change the status (UPDATE - 4d)
  async function changeStatus(order, status, reload) {
    try {
      await api(`/api/orders/${order.id}/status`, { method: 'PUT', body: { status } });
      reload();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <Navbar title="Kitchen" />
      <main className="page">
        <h2>Incoming orders <Label id="2c" note="Preparing / Ready button clicks" /></h2>
        <OrdersPanel
          title="Orders to cook"
          emptyText="No orders waiting in the kitchen."
          renderActions={(o, reload) => (
            <>
              {/* 2d - conditional rendering: show the right button for the current status */}
              {o.status === 'Placed' && (
                <button className="btn btn-primary btn-small" onClick={() => changeStatus(o, 'Preparing', reload)}>Start preparing</button>
              )}
              {o.status === 'Preparing' && (
                <button className="btn btn-success btn-small" onClick={() => changeStatus(o, 'Ready', reload)}>Mark Ready</button>
              )}
            </>
          )}
        />
        <Label id="2d" note="button depends on status" />
      </main>
    </div>
  );
}
