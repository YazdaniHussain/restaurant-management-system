// frontend/vite.config.js
// Vite dev server settings. The proxy forwards API calls to the Express backend (port 5000),
// so the React app can simply call "/api/..." without CORS problems.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api':           'http://localhost:5000',
      '/hello':         'http://localhost:5000',   // 4a
      '/site':          'http://localhost:5000',   // 4b
      '/hello-console': 'http://localhost:5000'    // 4c
    }
  }
});
