// src/pages/CustomerDashboard.jsx
// Customer: choose order type (Dine-in / Takeaway / Parcel / Home Delivery),
// browse the menu, add to cart, place the order and track its status.
import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import OrderForm from '../components/OrderForm.jsx';
import OrdersPanel from '../components/OrdersPanel.jsx';
import { Label } from '../labels/labels.js';   // labels helper

export default function CustomerDashboard() {
  // Changing this number makes the "My orders" list reload after a new order is placed
  const [refresh, setRefresh] = useState(0);

  return (
    <div>
      <Navbar title="Customer" />
      <main className="page">
        <h2>Order food <Label id="3c" note="onPlaced prop passed to OrderForm" /></h2>
        <OrderForm
          allowedTypes={['Dine-in', 'Takeaway', 'Parcel', 'Home Delivery']}
          onPlaced={() => setRefresh((n) => n + 1)}
        />

        <hr />
        {/* Tracking: the "key" changes after an order so the list reloads at once */}
        <OrdersPanel
          key={refresh}
          title="Track my orders"
          emptyText="You have not placed any orders yet."
        />
      </main>
    </div>
  );
}
