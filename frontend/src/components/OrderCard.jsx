// src/components/OrderCard.jsx
// One order shown as a card.  Dashboards pass action buttons through "children" (props).
import StatusBadge from './StatusBadge.jsx';
import { Label } from '../labels/labels.js';   // labels helper

export default function OrderCard({ order, children }) {
  // 2e - string literal that describes where the order goes
  const where =
    order.order_type === 'Dine-in' ? `Table ${order.table_number}` :
    order.order_type === 'Home Delivery' ? `Deliver to: ${order.address}` : order.order_type;

  return (
    <div className="card order-card">
      <div className="order-head">
        <strong>{`Order #${order.id}`}</strong>
        <StatusBadge status={order.status} />
      </div>
      <div className="muted small">{order.order_type} &middot; {where} &middot; {order.customer_name || 'Customer'}</div>
      <ul className="plain-list small">
        {/* 3e - iterative rendering with map() over the order items */}
        {(order.items || []).map((i) => (
          <li key={i.menu_item_id}>{i.quantity} x {i.name}</li>
        ))}
      </ul>
      <div className="total">Rs. {Number(order.total).toFixed(2)}</div>
      <div className="actions">{children}</div>
      <Label id="3e" note="map() over order items" />
      <Label id="3c" note="order + children props" />
    </div>
  );
}
