// src/lab/FunctionalCounter.jsx
// 2b - Counter button using a React FUNCTIONAL component.
// 2c - Handling the button click events in a functional component.
// (The count is kept with useState; the hook itself is explained in 3a.)
import { useState } from 'react';
import { Label } from '../labels/labels.js';   // labels helper

export default function FunctionalCounter() {
  const [count, setCount] = useState(0);

  // 2c - click event handler functions
  function handleIncrease() { setCount(count + 1); }
  const handleReset = () => setCount(0);

  return (
    <div className="card">
      <h4>2b. Functional component counter <Label id="2b" /> <Label id="2c" note="two click handlers" /></h4>
      <button className="btn btn-primary" onClick={handleIncrease}>Count: {count}</button>{' '}
      <button className="btn" onClick={handleReset}>Reset</button>
    </div>
  );
}
