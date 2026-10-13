// src/lab/ConditionalDemo.jsx
// 2d - Conditionally render a component in the browser.
import { useState } from 'react';
import { Label } from '../labels/labels.js';   // labels helper

// A small component that is shown or hidden
function SecretMessage() {
  return <p className="success">This component is rendered only when the condition is true.</p>;
}

export default function ConditionalDemo() {
  const [show, setShow] = useState(false);

  return (
    <div className="card">
      <h4>2d. Conditional rendering <Label id="2d" /></h4>
      <button className="btn" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'} the component</button>
      {/* Here we use the && operator: the component appears only if show is true */}
      {show && <SecretMessage />}
      {/* Another way: the ternary operator chooses between two outputs */}
      <p className="muted small">{show ? 'Status: visible' : 'Status: hidden'}</p>
    </div>
  );
}
