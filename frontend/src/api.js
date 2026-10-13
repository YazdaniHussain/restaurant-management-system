// src/api.js
// Small helper around fetch() used by every page to talk to the Express API (4d / 4e).
// It adds the login token to every request automatically.
const TOKEN_KEY = 'rms_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

// This is used for every API call: api('/api/menu'), api('/api/menu', { method: 'POST', body: {...} })
export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;      // 2e - template (string) literal

  const res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try { data = await res.json(); } catch (e) { /* empty response */ }
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
  return data;
}
