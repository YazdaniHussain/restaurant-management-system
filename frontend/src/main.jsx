// src/main.jsx  -  entry file of the React app.
// It mounts <App /> into the <div id="root"> of index.html.
// 1a - the HTML page (index.html) links THIS JavaScript file with a <script> tag.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Label } from './labels/labels.js';   // labels helper (renders nothing when labels are off)
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* Label for 1a: this file is the JS file linked from index.html */}
        <div className="label-row"><Label id="1a" note="index.html links src/main.jsx" /></div>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
