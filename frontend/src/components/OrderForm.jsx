// src/components/OrderForm.jsx
// The full "browse menu -> add to cart -> place order" flow.
// Used by Customer (all 4 types), Counter (walk-in, all 4 types) and Waiter (dine-in only).
//   Dine-in       needs a table number
//   Home Delivery needs an address
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import MenuList from './MenuList.jsx';
import Cart from './Cart.jsx';
import GuestCounter from './GuestCounter.jsx';
import { Label } from '../labels/labels.js';   // labels helper

export default function OrderForm({ allowedTypes, askName = false, tablesUrl = '/api/tables', onPlaced }) {
  // 3d - the form values are kept in React state ("controlled inputs")
  const [orderType, setOrderType] = useState(allowedTypes[0]);
  const [tableId, setTableId] = useState('');
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [guests, setGuests] = useState(1);
  const [cart, setCart] = useState([]);
  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 3b - useEffect: load the dining tables from the API
  useEffect(() => {
    api(tablesUrl).then(setTables).catch(() => setTables([]));
  }, [tablesUrl]);

  // Add a dish to the cart (called from MenuCard through props - 3c)
  const addToCart = (item, qty) => {
    setCart((prev) => {
      const found = prev.find((l) => l.item.id === item.id);
      if (found) return prev.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { item, qty }];
    });
  };
  const removeFromCart = (id) => setCart((prev) => prev.filter((l) => l.item.id !== id));

  // 3d - form submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const body = {
        order_type: orderType,
        table_id: orderType === 'Dine-in' ? Number(tableId) : null,
        address: orderType === 'Home Delivery' ? address : null,
        customer_name: askName ? customerName : undefined,
        items: cart.map((l) => ({ menu_item_id: l.item.id, quantity: l.qty }))
      };
      const result = await api('/api/orders', { method: 'POST', body });
      setMessage({ type: 'ok', text: `Order #${result.id} placed. Total Rs. ${result.total.toFixed(2)}` });   // 2e
      setCart([]);
      setAddress('');
      if (onPlaced) onPlaced();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  }

  // Tables with enough seats for the guests chosen with the class-component counter
  const suitableTables = tables.filter((t) => t.seats >= guests);

  return (
    <div className="two-col">
      <MenuList onAdd={addToCart} />

      <div>
        <Cart cart={cart} onRemove={removeFromCart} />

        <form className="card" onSubmit={handleSubmit}>
          <h3>Place order <Label id="3d" note="React form with controlled inputs" /></h3>

          <label>Order type
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              {/* 3e - iterative rendering with map() */}
              {allowedTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          {askName && (
            <label>Customer name
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Walk-in guest" />
            </label>
          )}

          {/* 2d - conditional rendering: table fields only for Dine-in */}
          {orderType === 'Dine-in' && (
            <>
              <div className="field-row">Guests: <GuestCounter initial={1} onChange={setGuests} /> <Label id="2a" note="class component counter" /></div>
              <label>Table number
                <select value={tableId} onChange={(e) => setTableId(e.target.value)} required>
                  <option value="">-- choose a table --</option>
                  {suitableTables.map((t) => (
                    <option key={t.id} value={t.id}>{`Table ${t.table_number} (${t.seats} seats${t.status === 'Occupied' ? ', occupied' : ''})`}</option>
                  ))}
                </select>
              </label>
            </>
          )}

          {/* 2d - conditional rendering: address field only for Home Delivery */}
          {orderType === 'Home Delivery' && (
            <label>Delivery address
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} required />
            </label>
          )}
          <Label id="2d" note="fields appear by order type" />

          {message.text && <p className={message.type === 'error' ? 'error' : 'success'}>{message.text}</p>}
          <button className="btn btn-primary" type="submit" disabled={cart.length === 0}>Place order</button>
        </form>
      </div>
    </div>
  );
}
