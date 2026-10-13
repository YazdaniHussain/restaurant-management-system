// src/App.jsx
// All the pages (routes) of the app.  The login page is the starting page ("/").
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import CounterDashboard from './pages/CounterDashboard.jsx';
import CashierDashboard from './pages/CashierDashboard.jsx';
import WaiterDashboard from './pages/WaiterDashboard.jsx';
import KitchenDashboard from './pages/KitchenDashboard.jsx';
import LabDemoPage from './pages/LabDemoPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Label } from './labels/labels.js';   // labels helper

export default function App() {
  return (
    <>
      {/* Label: the route list decides which component is rendered for each URL */}
      <div className="label-row"><Label id="2d" note="routes render a component per URL" /></div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/lab" element={<LabDemoPage />} />

        {/* Each dashboard is protected: only its own role can open it */}
        <Route path="/customer" element={<ProtectedRoute role="Customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/manager"  element={<ProtectedRoute role="Manager"><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/counter"  element={<ProtectedRoute role="Counter"><CounterDashboard /></ProtectedRoute>} />
        <Route path="/cashier"  element={<ProtectedRoute role="Cashier"><CashierDashboard /></ProtectedRoute>} />
        <Route path="/waiter"   element={<ProtectedRoute role="Waiter"><WaiterDashboard /></ProtectedRoute>} />
        <Route path="/kitchen"  element={<ProtectedRoute role="Kitchen"><KitchenDashboard /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
