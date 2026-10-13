// src/components/MenuCard.jsx
// One dish card.  It receives the dish and an "onAdd" function through PROPS (3c).
import { useState } from 'react';
import QuantityCounter from './QuantityCounter.jsx';
import { Label } from '../labels/labels.js';   // labels helper

export default function MenuCard({ item, onAdd }) {
  // 3a - counter using the useState hook (the quantity chosen for this dish)
  const [qty, setQty] = useState(1);

  // 2c - click handler: add this dish to the cart
  const handleAdd = () => {
    onAdd(item, qty);
    setQty(1);
  };

  return (
    <div className="card menu-card">
      <div className="menu-title">{item.name}</div>
      <div className="muted">{item.category}</div>
      {item.description && <div className="muted small">{item.description}</div>}
      <div className="price">Rs. {Number(item.price).toFixed(2)}</div>

      {/* 3c - the count (qty) is shared with the child component through props */}
      <QuantityCounter value={qty} onChange={setQty} />
      <button className="btn btn-primary btn-small" onClick={handleAdd}>Add to cart</button>
      <Label id="3a" note="useState quantity" />
      <Label id="3c" note="props: item, onAdd, value, onChange" />
    </div>
  );
}
