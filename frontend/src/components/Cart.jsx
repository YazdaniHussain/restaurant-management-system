// src/components/Cart.jsx
// Shows the dishes added to the cart with the total price and a remove button.
import { Label } from '../labels/labels.js';   // labels helper

export default function Cart({ cart, onRemove }) {
  const total = cart.reduce((sum, l) => sum + l.item.price * l.qty, 0);

  return (
    <section className="card">
      <h3>Cart <Label id="3e" note="map() over cart lines" /></h3>
      {/* 2d - conditional rendering: different output for an empty cart */}
      {cart.length === 0 ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <ul className="plain-list">
          {/* 3e - iterative rendering with map() */}
          {cart.map((l) => (
            <li key={l.item.id}>
              {`${l.qty} x ${l.item.name}`} {/* 2e - template literal */}
              <span className="right">
                Rs. {(l.item.price * l.qty).toFixed(2)}{' '}
                <button className="btn btn-small" onClick={() => onRemove(l.item.id)}>x</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="total">Total: Rs. {total.toFixed(2)}</div>
    </section>
  );
}
