// src/lab/StringLiteralDemo.jsx
// 2e - Display text using string literals (single quotes, double quotes and template literals).
import { Label } from '../labels/labels.js';   // labels helper

export default function StringLiteralDemo() {
  const single = 'Single quoted string';
  const double = "Double quoted string";
  const dish = 'Chicken Biryani';
  const price = 250;
  // Template literal: uses back-ticks and ${ } to put variables inside the text
  const template = `Today's special: ${dish} for Rs. ${price} (with GST: Rs. ${(price * 1.05).toFixed(2)})`;

  return (
    <div className="card">
      <h4>2e. String literals <Label id="2e" /></h4>
      <p>{single}</p>
      <p>{double}</p>
      <p>{template}</p>
    </div>
  );
}
