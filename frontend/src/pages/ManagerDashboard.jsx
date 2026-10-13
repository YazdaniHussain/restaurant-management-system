// src/pages/ManagerDashboard.jsx
// Manager: manage menu items and staff (full CRUD - 4d), view all orders and sales reports.
import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import OrdersPanel from '../components/OrdersPanel.jsx';
import { api } from '../api.js';
import { Label } from '../labels/labels.js';   // labels helper

const EMPTY_DISH = { id: null, name: '', category: '', description: '', price: '', available: true };
const EMPTY_STAFF = { id: null, name: '', username: '', password: '', role: 'Waiter', phone: '' };
const STAFF_ROLES = ['Manager', 'Counter', 'Cashier', 'Waiter', 'Kitchen'];

// ---------------- Menu management (CRUD) ----------------
function MenuManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_DISH);
  const [message, setMessage] = useState('');

  const load = useCallback(() => api('/api/menu?all=1').then(setItems).catch((e) => setMessage(e.message)), []);
  useEffect(() => { load(); }, [load]);                        // 3b - useEffect fetch

  // 3d - one handler updates any field of the form
  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  // CREATE or UPDATE (4d)
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const body = { ...form, price: Number(form.price) };
      if (form.id) await api(`/api/menu/${form.id}`, { method: 'PUT', body });
      else await api('/api/menu', { method: 'POST', body });
      setMessage(form.id ? 'Dish updated' : 'Dish added');
      setForm(EMPTY_DISH);
      load();
    } catch (err) { setMessage(err.message); }
  }

  // DELETE (4d)
  async function remove(id) {
    if (!window.confirm('Delete this dish?')) return;
    try { const r = await api(`/api/menu/${id}`, { method: 'DELETE' }); setMessage(r.note || 'Dish deleted'); load(); }
    catch (err) { setMessage(err.message); }
  }

  return (
    <section>
      <h3>Menu items (CRUD) <Label id="4d" note="Create / Read / Update / Delete menu" /></h3>
      {message && <p className="success">{message}</p>}

      <form className="card form-grid" onSubmit={handleSubmit}>
        <Label id="3d" note="menu form" />
        <input placeholder="Dish name" value={form.name} onChange={(e) => setField('name', e.target.value)} required />
        <input placeholder="Category" value={form.category} onChange={(e) => setField('category', e.target.value)} required />
        <input placeholder="Description" value={form.description || ''} onChange={(e) => setField('description', e.target.value)} />
        <input type="number" min="0" step="0.5" placeholder="Price" value={form.price} onChange={(e) => setField('price', e.target.value)} required />
        <label className="inline"><input type="checkbox" checked={!!form.available} onChange={(e) => setField('available', e.target.checked)} /> Available</label>
        <div>
          <button className="btn btn-primary" type="submit">{form.id ? 'Save changes' : 'Add dish'}</button>
          {form.id && <button type="button" className="btn" onClick={() => setForm(EMPTY_DISH)}>Cancel</button>}
        </div>
      </form>

      <table className="table">
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th></th></tr></thead>
        <tbody>
          {/* 3e - iterative rendering with map() */}
          {items.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td><td>{m.category}</td><td>{`Rs. ${Number(m.price).toFixed(2)}`}</td><td>{m.available ? 'Yes' : 'No'}</td>
              <td>
                <button className="btn btn-small" onClick={() => setForm({ ...m, available: !!m.available })}>Edit</button>{' '}
                <button className="btn btn-small btn-danger" onClick={() => remove(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Label id="3e" note="map() over menu rows" />
    </section>
  );
}

// ---------------- Staff management (CRUD) ----------------
function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(EMPTY_STAFF);
  const [message, setMessage] = useState('');

  const load = useCallback(() => api('/api/staff').then(setStaff).catch((e) => setMessage(e.message)), []);
  useEffect(() => { load(); }, [load]);                        // 3b

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (form.id) await api(`/api/staff/${form.id}`, { method: 'PUT', body: form });
      else await api('/api/staff', { method: 'POST', body: form });
      setMessage(form.id ? 'Staff updated' : 'Staff added');
      setForm(EMPTY_STAFF);
      load();
    } catch (err) { setMessage(err.message); }
  }

  async function remove(id) {
    if (!window.confirm('Remove this staff member?')) return;
    try { await api(`/api/staff/${id}`, { method: 'DELETE' }); setMessage('Staff removed'); load(); }
    catch (err) { setMessage(err.message); }
  }

  return (
    <section>
      <h3>Staff (CRUD) <Label id="4d" note="Create / Read / Update / Delete staff" /></h3>
      {message && <p className="success">{message}</p>}

      <form className="card form-grid" onSubmit={handleSubmit}>
        <Label id="3d" note="staff form" />
        <input placeholder="Full name" value={form.name} onChange={(e) => setField('name', e.target.value)} required />
        {/* 2d - conditional rendering: username is typed only when adding a new member */}
        {!form.id && <input placeholder="Username" value={form.username} onChange={(e) => setField('username', e.target.value)} required />}
        <input type="password" placeholder={form.id ? 'New password (optional)' : 'Password'} value={form.password} onChange={(e) => setField('password', e.target.value)} required={!form.id} />
        <select value={form.role} onChange={(e) => setField('role', e.target.value)}>
          {STAFF_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <input placeholder="Phone" value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} />
        <div>
          <button className="btn btn-primary" type="submit">{form.id ? 'Save changes' : 'Add staff'}</button>
          {form.id && <button type="button" className="btn" onClick={() => setForm(EMPTY_STAFF)}>Cancel</button>}
        </div>
      </form>

      <table className="table">
        <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Phone</th><th></th></tr></thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td><td>{s.username}</td><td>{s.role}</td><td>{s.phone}</td>
              <td>
                <button className="btn btn-small" onClick={() => setForm({ ...s, password: '' })}>Edit</button>{' '}
                <button className="btn btn-small btn-danger" onClick={() => remove(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Label id="2d" note="username field hidden while editing" />
      <Label id="3e" note="map() over staff rows" />
    </section>
  );
}

// ---------------- Sales reports (uses SQL subqueries - 5c) ----------------
function Reports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {                                            // 3b - useEffect fetch
    api('/api/reports/summary').then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Loading report...</p>;

  return (
    <section>
      <h3>Sales report <Label id="5c" note="report API uses subqueries" /> <Label id="3b" note="useEffect fetch /api/reports/summary" /></h3>
      <div className="grid">
        <div className="card"><div className="muted">Total orders</div><div className="big">{data.totals.orders}</div></div>
        <div className="card"><div className="muted">Total sales</div><div className="big">{`Rs. ${Number(data.totals.sales).toFixed(2)}`}</div></div>
        <div className="card"><div className="muted">Paid sales</div><div className="big">{`Rs. ${Number(data.totals.paid_sales).toFixed(2)}`}</div></div>
      </div>
      <div className="two-col">
        <div className="card">
          <h4>Sales by order type</h4>
          <ul className="plain-list">{data.byType.map((t) => <li key={t.order_type}>{`${t.order_type}: ${t.orders} orders, Rs. ${Number(t.sales).toFixed(2)}`}</li>)}</ul>
        </div>
        <div className="card">
          <h4>Top dishes</h4>
          <ul className="plain-list">{data.topDishes.map((d) => <li key={d.name}>{`${d.name} - ${d.qty} sold`}</li>)}</ul>
        </div>
        <div className="card">
          <h4>Orders above average value</h4>
          <ul className="plain-list">{data.bigOrders.map((o) => <li key={o.id}>{`#${o.id} ${o.order_type} - Rs. ${Number(o.total).toFixed(2)}`}</li>)}</ul>
        </div>
        <div className="card">
          <h4>Orders by status</h4>
          <ul className="plain-list">{data.byStatus.map((s) => <li key={s.status}>{`${s.status}: ${s.orders}`}</li>)}</ul>
        </div>
      </div>
      <Label id="3e" note="map() over report lists" />
    </section>
  );
}

export default function ManagerDashboard() {
  const [tab, setTab] = useState('menu');
  const tabs = [['menu', 'Menu'], ['staff', 'Staff'], ['orders', 'All orders'], ['reports', 'Sales reports']];

  return (
    <div>
      <Navbar title="Manager" />
      <main className="page">
        <div className="chips">
          {tabs.map(([key, text]) => (
            <button key={key} className={'chip' + (tab === key ? ' chip-active' : '')} onClick={() => setTab(key)}>{text}</button>
          ))}
          <Label id="3e" note="map() over tabs" />
        </div>

        {/* 2d - conditional rendering: show one component at a time */}
        {tab === 'menu' && <MenuManager />}
        {tab === 'staff' && <StaffManager />}
        {tab === 'orders' && (
          <OrdersPanel
            title="All orders"
            emptyText="No orders yet."
            renderActions={(o, reload) => (
              // DELETE (4d): Manager can remove an order
              <button className="btn btn-small btn-danger" onClick={async () => {
                if (!window.confirm(`Delete order #${o.id}?`)) return;
                await api(`/api/orders/${o.id}`, { method: 'DELETE' });
                reload();
              }}>Delete order</button>
            )}
          />
        )}
        {tab === 'reports' && <Reports />}
        <Label id="2d" note="tab components rendered conditionally" />
      </main>
    </div>
  );
}
