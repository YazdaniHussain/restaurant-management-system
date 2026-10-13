// src/lab/HooksCounter.jsx
// 3a - Counter button using the React useState hook.
import { useState } from 'react';
import { Label } from '../labels/labels.js';   // labels helper

export default function HooksCounter() {
  // useState returns [current value, function to change it]
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <h4>3a. useState counter <Label id="3a" /></h4>
      <button className="btn btn-small" onClick={() => setCount(count - 1)}>-</button>
      <strong className="counter-value">{count}</strong>
      <button className="btn btn-small" onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
