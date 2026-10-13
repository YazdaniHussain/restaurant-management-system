// src/components/ProtectedRoute.jsx
// Role-based routing: only the allowed role can open a dashboard.
// - not logged in         -> go to the login page
// - logged in, wrong role -> go to the user's OWN dashboard
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Label } from '../labels/labels.js';   // labels helper

// Where each role lands after login
export const ROLE_HOME = {
  Customer: '/customer',
  Manager: '/manager',
  Counter: '/counter',
  Cashier: '/cashier',
  Waiter: '/waiter',
  Kitchen: '/kitchen'
};

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="center-note">Loading...</p>;     // 2d - conditional rendering
  if (!user) return <Navigate to="/" replace />;                      // 2d
  if (user.role !== role) return <Navigate to={ROLE_HOME[user.role]} replace />;   // 2d

  return (
    <>
      <div className="label-row"><Label id="2d" note="ProtectedRoute decides what to render" /></div>
      {children}
    </>
  );
}
