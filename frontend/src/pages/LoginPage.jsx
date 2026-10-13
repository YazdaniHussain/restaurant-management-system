// src/pages/LoginPage.jsx  -  the app starts here.
// The user picks a role, types username + password and is sent to that role's dashboard.
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLE_HOME } from '../components/ProtectedRoute.jsx';
import { Label } from '../labels/labels.js';   // labels helper

const ROLES = ['Customer', 'Manager', 'Counter', 'Cashier', 'Waiter', 'Kitchen'];
// Display names for the roles
const ROLE_TEXT = { Kitchen: 'Kitchen Staff' };

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // 3d - forms in React: every input is controlled by state
  const [role, setRole] = useState('Customer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // 2d - conditional rendering: already logged in -> go straight to the dashboard
  if (user) return <Navigate to={ROLE_HOME[user.role]} replace />;

  // 3d - form submit handler (also a click event handled in a functional component - 2c)
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const u = await login(role, username.trim(), password);
      navigate(ROLE_HOME[u.role]);                 // role-based routing after login
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h2>Spice Garden</h2>
        <p className="muted">Restaurant Management System - please log in</p>
        <Label id="3d" note="login form" />

        <label>Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {/* 3e - iterative rendering with map(): one option per role */}
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_TEXT[r] || r}</option>)}
          </select>
        </label>
        <label>Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
        </label>
        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>

        {/* 2d - conditional rendering: error text only appears after a failed login */}
        {error && <p className="error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Logging in...' : `Login as ${ROLE_TEXT[role] || role}`}{/* 2e - template literal */}
        </button>
        <Label id="2c" note="submit button click" />
        <Label id="3e" note="map() over roles" />
        <Label id="2e" note="template literal on button" />

        <p className="small muted">Demo logins are listed in the README (example: customer / customer123).</p>
        <p className="small"><Link to="/lab">Open the Lab Demo page (1a-5e)</Link></p>
      </form>
    </div>
  );
}
