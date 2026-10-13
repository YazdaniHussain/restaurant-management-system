// src/components/MenuList.jsx
// Loads the menu from the API and shows one MenuCard for every dish.
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import MenuCard from './MenuCard.jsx';
import { Label } from '../labels/labels.js';   // labels helper

export default function MenuList({ onAdd }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');

  // 3b - useEffect: fetch the data from the API when the component first appears
  useEffect(() => {
    api('/api/menu')
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);

  const categories = ['All', ...new Set(items.map((i) => i.category))];
  const shown = category === 'All' ? items : items.filter((i) => i.category === category);

  return (
    <section>
      <h3>Menu <Label id="3b" note="useEffect fetch /api/menu" /></h3>

      {/* 2d - conditional rendering: error message only appears when there is an error */}
      {error && <p className="error">{error}</p>}

      <div className="chips">
        {/* 3e - iterative rendering with map(): one chip per category */}
        {categories.map((c) => (
          <button key={c} className={'chip' + (c === category ? ' chip-active' : '')} onClick={() => setCategory(c)}>{c}</button>
        ))}
        <Label id="3e" note="map() over categories" />
      </div>

      <div className="grid">
        {/* 3e - iterative rendering with map(): one card per dish */}
        {shown.map((item) => <MenuCard key={item.id} item={item} onAdd={onAdd} />)}
      </div>
      <Label id="3e" note="map() over dishes" />
    </section>
  );
}
