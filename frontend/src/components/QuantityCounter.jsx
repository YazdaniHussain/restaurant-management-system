// src/components/QuantityCounter.jsx
// 2b - A counter button built as a React FUNCTIONAL component (+ and - buttons).
// 2c - The button click events are handled with functions (handleMinus / handlePlus).
// 3c - The count is NOT stored here: it comes from the parent (MenuCard) through props.
import { Label } from '../labels/labels.js';   // labels helper

export default function QuantityCounter({ value, onChange, min = 1, max = 20 }) {
  // 2c - click handlers in a functional component
  const handleMinus = () => onChange(Math.max(min, value - 1));
  const handlePlus = () => onChange(Math.min(max, value + 1));

  return (
    <span className="counter">
      <button type="button" className="btn btn-small" onClick={handleMinus}>-</button>
      <strong className="counter-value">{value}</strong>
      <button type="button" className="btn btn-small" onClick={handlePlus}>+</button>
      <Label id="2b" note="functional counter" />
      <Label id="2c" note="onClick handlers" />
    </span>
  );
}
