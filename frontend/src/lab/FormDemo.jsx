// src/lab/FormDemo.jsx
// 3d - Forms in React (controlled inputs + submit handler).
import { useState } from 'react';
import { Label } from '../labels/labels.js';   // labels helper

export default function FormDemo() {
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(2);
  const [submitted, setSubmitted] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();                          // stop the page from reloading
    setSubmitted(`Table booked for ${name} (${guests} guests)`);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h4>3d. Form in React <Label id="3d" /></h4>
      <label>Name <input value={name} onChange={(e) => setName(e.target.value)} required /></label>
      <label>Guests <input type="number" min="1" max="12" value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></label>
      <button className="btn btn-primary" type="submit">Book table</button>
      {submitted && <p className="success">{submitted}</p>}
    </form>
  );
}
