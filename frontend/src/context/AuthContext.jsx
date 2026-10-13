// src/context/AuthContext.jsx
// Keeps the logged-in user for the whole app (used by role-based routing).
import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api.js';
import { Label } from '../labels/labels.js';   // labels helper

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);   // true while we check an old login after refresh

  // 3b - useEffect: when the app opens, ask the API "who am I?" if a token was saved
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    api('/api/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  // Called by the login form
  async function login(role, username, password) {
    const data = await api('/api/auth/login', { method: 'POST', body: { role, username, password } });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try { await api('/api/auth/logout', { method: 'POST' }); } catch (e) { /* ignore */ }
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {/* 3b label: the useEffect above fetches /api/auth/me */}
      <div className="label-row"><Label id="3b" note="AuthContext useEffect fetch" /></div>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
