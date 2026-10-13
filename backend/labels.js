// =====================================================================
// backend/labels.js   -   LAB LABELS (console labels for the 25 syllabus items)
//
// WHAT THIS FILE DOES
//   Every backend file calls   labelLog("4d")   when a route/operation runs.
//   When the LABELS BLOCK below is COMMENTED OUT (default) labelLog() does
//   nothing, so the server behaves like a normal project (no extra output).
//   When you UNCOMMENT the block, the console prints, for example:
//        Included here: 4d - CRUD operations
//
// HOW TO TURN LABELS ON  (only this file needs to be edited)
//   1. Find the line   /* ===== LABELS BLOCK START ...
//      Change it to    //* ===== LABELS BLOCK START ...      (add two slashes at the front)
//   2. Restart the backend (npm start).
//
// HOW TO TURN LABELS OFF AGAIN
//   Change   //* ===== LABELS BLOCK START   back to   /* ===== LABELS BLOCK START
//   (the end line "//*/" must stay as it is - it works for both states).
// =====================================================================

// "impl" stays null while the block is commented out -> everything below is a safe no-op.
let impl = null;

/* ===== LABELS BLOCK START (backend) - uncomment by changing the "/*" at the start of this line to "//*" =====

// Here we keep the list of all 25 syllabus items with their names.
const LABELS = {
  '1a': '1a - Linking JS file with HTML',
  '1b': '1b - Selecting elements using selectors',
  '1c': '1c - Event listeners',
  '1d': '1d - Button click events in HTML',
  '1e': '1e - Function declaration / definition / arrow functions',
  '2a': '2a - Counter using React class component',
  '2b': '2b - Counter using React functional component',
  '2c': '2c - Button click event in functional component',
  '2d': '2d - Conditional rendering of a component',
  '2e': '2e - Displaying text using string literals',
  '3a': '3a - Counter using useState hook',
  '3b': '3b - useEffect API fetch',
  '3c': '3c - Two components sharing data using Props',
  '3d': '3d - Forms in React',
  '3e': '3e - Iterative rendering using map()',
  '4a': '4a - Express hello world route',
  '4b': '4b - Small website with multiple routes (Express)',
  '4c': '4c - Hello world printed in browser console (Express)',
  '4d': '4d - CRUD operations',
  '4e': '4e - API and MySQL connection (mysql2)',
  '5a': '5a - Create database and table (MySQL Command Line Client)',
  '5b': '5b - Create table, insert data, update data (MySQL queries)',
  '5c': '5c - Subqueries (MySQL)',
  '5d': '5d - SQL script file for MySQL Workbench',
  '5e': '5e - database.sql integration with the API'
};

// This is the function that prints the label in the console (once per call).
impl = {
  labels: LABELS,
  log(id, where) {
    const text = LABELS[id];
    if (!text) return;                       // unknown id -> ignore quietly
    console.log('Included here: ' + text + (where ? '   [' + where + ']' : ''));
  }
};

// ===== LABELS BLOCK END (backend) - the next line must stay exactly as it is =====
//*/

// Safe public helper used by every backend file.
// It never throws, even when the block above is commented out.
function labelLog(id, where) {
  try {
    if (impl && typeof impl.log === 'function') impl.log(id, where);
  } catch (err) {
    /* labels must never break the server */
  }
}

module.exports = { labelLog };
