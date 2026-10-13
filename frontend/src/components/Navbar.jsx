// src/components/Navbar.jsx
// Top bar shown on every dashboard: restaurant name, welcome text and logout button.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Label } from '../labels/labels.js';   // labels helper

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 2c - click handler inside a functional component
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // 2e - string literals (template literal) used to build the welcome text
  const welcome = `Welcome, ${user.name} (${user.role})`;

  return (
    <header className="navbar">
      <div>
        <strong>Spice Garden</strong> &middot; {title}
        <Label id="2e" note="template literal in welcome text" />
      </div>
      <div className="navbar-right">
        <span>{welcome}</span>
        <button className="btn btn-small" onClick={handleLogout}>Logout</button>
        <Label id="2c" note="logout button onClick" />
      </div>
    </header>
  );
}
