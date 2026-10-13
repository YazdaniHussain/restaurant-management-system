// src/lab/MapDemo.jsx
// 3e - Iterative rendering using the map() function.
import { Label } from '../labels/labels.js';   // labels helper

const DISHES = [
  { id: 1, name: 'Gobi Manchurian', price: 140 },
  { id: 2, name: 'Veg Fried Rice', price: 160 },
  { id: 3, name: 'Gulab Jamun', price: 70 }
];

export default function MapDemo() {
  return (
    <div className="card">
      <h4>3e. map() list rendering <Label id="3e" /></h4>
      <ul className="plain-list">
        {/* map() turns every array item into a <li>; "key" must be unique */}
        {DISHES.map((d) => <li key={d.id}>{`${d.name} - Rs. ${d.price}`}</li>)}
      </ul>
    </div>
  );
}
