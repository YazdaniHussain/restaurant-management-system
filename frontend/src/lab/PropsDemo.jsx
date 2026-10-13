// src/lab/PropsDemo.jsx
// 3c - Two React components sharing data using Props (Parent -> Child).
import { useState } from 'react';
import { Label } from '../labels/labels.js';   // labels helper

// Child component: it only receives data through props
function DishBadge({ name, price }) {
  return <p className="success">{`${name} costs Rs. ${price}`}</p>;
}

// Parent component: it owns the data and passes it down
export default function PropsDemo() {
  const [dish, setDish] = useState({ name: 'Paneer Butter Masala', price: 220 });

  return (
    <div className="card">
      <h4>3c. Props between two components <Label id="3c" /></h4>
      <button className="btn btn-small" onClick={() => setDish({ name: 'Chicken Biryani', price: 250 })}>Show biryani</button>{' '}
      <button className="btn btn-small" onClick={() => setDish({ name: 'Paneer Butter Masala', price: 220 })}>Show paneer</button>
      {/* Here the parent shares its data with the child using props */}
      <DishBadge name={dish.name} price={dish.price} />
    </div>
  );
}
