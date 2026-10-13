// src/components/StatusBadge.jsx
// Shows the order status as a coloured badge (Placed, Preparing, Ready, Served, Paid).
import { Label } from '../labels/labels.js';   // labels helper

const COLORS = { Placed: '#2563eb', Preparing: '#d97706', Ready: '#059669', Served: '#7c3aed', Paid: '#475569' };

export default function StatusBadge({ status }) {
  return (
    <span className="badge" style={{ background: COLORS[status] || '#64748b' }}>
      {status}
      <Label id="3c" note="status prop from parent" />
    </span>
  );
}
