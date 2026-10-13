// src/pages/LabDemoPage.jsx   (open at http://localhost:5173/lab - no login needed)
// One page where every syllabus item 1a-5e can be seen working on its own.
import { Link } from 'react-router-dom';
import ClassCounter from '../lab/ClassCounter.jsx';
import FunctionalCounter from '../lab/FunctionalCounter.jsx';
import ConditionalDemo from '../lab/ConditionalDemo.jsx';
import StringLiteralDemo from '../lab/StringLiteralDemo.jsx';
import HooksCounter from '../lab/HooksCounter.jsx';
import ApiFetchDemo from '../lab/ApiFetchDemo.jsx';
import PropsDemo from '../lab/PropsDemo.jsx';
import FormDemo from '../lab/FormDemo.jsx';
import MapDemo from '../lab/MapDemo.jsx';
import { Label } from '../labels/labels.js';   // labels helper

// 5a-5e: short copies of the SQL, shown on screen so they can be explained in the viva.
// The full, runnable SQL is in database/database.sql.
const SQL_SAMPLES = [
  { id: '5a', title: '5a. Create database and table (MySQL Command Line Client)',
    code: "CREATE DATABASE restaurant_db;\nUSE restaurant_db;\nCREATE TABLE users (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(80) NOT NULL,\n  username VARCHAR(40) NOT NULL UNIQUE\n);" },
  { id: '5b', title: '5b. Create table, insert data, update data',
    code: "INSERT INTO menu_items (name, category, price) VALUES ('Veg Soup', 'Starters', 80);\nUPDATE menu_items SET price = 90 WHERE name = 'Veg Soup';" },
  { id: '5c', title: '5c. Subqueries',
    code: "SELECT name, price FROM menu_items\nWHERE price > (SELECT AVG(price) FROM menu_items);" },
  { id: '5d', title: '5d. Script file in MySQL Workbench',
    code: "Workbench > File > Open SQL Script > database/database.sql > Execute (lightning icon)" },
  { id: '5e', title: '5e. database folder + database.sql used by the API',
    code: "restaurant-lab/database/database.sql  ->  imported into MySQL  ->  used by backend/db.js" }
];

export default function LabDemoPage() {
  return (
    <div>
      <header className="navbar">
        <div><strong>Lab Demo</strong> &middot; Web Development Lab (Part 2) - items 1a to 5e</div>
        <Link className="btn btn-small" to="/">Back to login</Link>
      </header>

      <main className="page">
        {/* ---------- Section 1 ---------- */}
        <h2>1. JavaScript and the DOM (1a - 1e) <Label id="1a" note="public/lab/index.html" /></h2>
        <p>
          These are plain HTML + JavaScript programs, so they open as their own page:{' '}
          <a href="/lab/index.html" target="_blank" rel="noreferrer">open /lab/index.html</a>. The same page is shown below.
        </p>
        <iframe title="Lab 1a-1e" src="/lab/index.html" className="lab-frame" />

        {/* ---------- Section 2 ---------- */}
        <h2>2. Basics of React (2a - 2e)</h2>
        <div className="grid">
          <ClassCounter />
          <FunctionalCounter />
          <ConditionalDemo />
          <StringLiteralDemo />
        </div>

        {/* ---------- Section 3 ---------- */}
        <h2>3. Important concepts of React (3a - 3e)</h2>
        <div className="grid">
          <HooksCounter />
          <ApiFetchDemo />
          <PropsDemo />
          <FormDemo />
          <MapDemo />
        </div>

        {/* ---------- Section 4 ---------- */}
        <h2>4. Node.js and Express.js (4a - 4e)</h2>
        <div className="card">
          <ul className="plain-list">
            <li><a href="/hello" target="_blank" rel="noreferrer">/hello</a> - 4a: hello world route <Label id="4a" /></li>
            <li><a href="/site" target="_blank" rel="noreferrer">/site</a> (also /site/about, /site/menu, /site/contact) - 4b: small website with multiple routes <Label id="4b" /></li>
            <li><a href="/hello-console" target="_blank" rel="noreferrer">/hello-console</a> - 4c: open it, then press F12 to see "hello world" in the browser console <Label id="4c" /></li>
            <li>4d: CRUD operations - log in as <b>manager</b> and add, edit and delete menu items or staff <Label id="4d" /></li>
            <li>4e: API and MySQL connection - <code>backend/db.js</code> (mysql2) and every page that loads data <Label id="4e" /></li>
          </ul>
        </div>

        {/* ---------- Section 5 ---------- */}
        <h2>5. MySQL (5a - 5e)</h2>
        <div className="grid">
          {/* 3e - map() renders one card per SQL example */}
          {SQL_SAMPLES.map((s) => (
            <div key={s.id} className="card">
              <h4>{s.title} <Label id={s.id} /></h4>
              <pre className="code">{s.code}</pre>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
