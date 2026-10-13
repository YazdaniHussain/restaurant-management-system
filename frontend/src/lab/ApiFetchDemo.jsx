// src/lab/ApiFetchDemo.jsx
// 3b - Fetch data from an API using the React useEffect hook.
// It calls the PUBLIC Express route /api/hello/menu (no login needed).
import { useEffect, useState } from 'react';
import { Label } from '../labels/labels.js';   // labels helper

export default function ApiFetchDemo() {
  const [dishes, setDishes] = useState([]);
  const [status, setStatus] = useState('Loading...');

  // useEffect with [] runs ONE time after the first render: the right place to fetch data
  useEffect(() => {
    fetch('/api/hello/menu')
      .then((res) => res.json())
      .then((data) => { setDishes(data); setStatus(`Loaded ${data.length} dishes from the API`); })
      .catch(() => setStatus('Could not reach the API (is the backend running?)'));
  }, []);

  return (
    <div className="card">
      <h4>3b. useEffect API fetch <Label id="3b" /></h4>
      <p className="muted small">{status}</p>
      <ul className="plain-list small">
        {dishes.slice(0, 5).map((d) => <li key={d.id}>{`${d.name} - Rs. ${d.price}`}</li>)}
      </ul>
    </div>
  );
}
