// =====================================================================
// frontend/src/labels/labels.js   -   LAB LABELS for the 25 syllabus items
//
// WHAT THIS FILE DOES
//   Every page/component uses a tiny helper:   <Label id="2c" />
//   While the LABELS BLOCK below is COMMENTED OUT (default) <Label /> renders
//   nothing, so the app looks and behaves like a completely normal project.
//   When you UNCOMMENT the block and refresh, a very small label such as
//        Included here: 2c - Button click event in functional component
//   appears next to the feature.
//
// HOW TO TURN LABELS ON  (only this file needs to be edited)
//   1. Find the line   /* ===== LABELS BLOCK START ...
//      Change it to    //* ===== LABELS BLOCK START ...      (add two slashes at the front)
//   2. Save and refresh the browser.
//
// HOW TO TURN LABELS OFF AGAIN
//   Change   //* ===== LABELS BLOCK START   back to   /* ===== LABELS BLOCK START
//   (the last line of the block, "//*/", must stay as it is).
// =====================================================================
import { createElement } from 'react';

// "impl" stays null while the block is commented out -> everything below is a safe no-op.
let impl = null;

/* ===== LABELS BLOCK START (frontend) - uncomment by changing the "/*" at the start of this line to "//*" =====

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

// Very small, tiny-font style for the label (kept here so all label logic stays in this block).
const LABEL_STYLE = {
  display: 'inline-block',
  fontSize: '9px',
  lineHeight: '1.3',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  color: '#92400e',
  background: '#fef3c7',
  border: '1px solid #fcd34d',
  borderRadius: '3px',
  padding: '0 4px',
  margin: '2px 4px',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap'
};

// This function builds the label element for one item id (used by <Label id="2c" />).
impl = {
  labels: LABELS,
  render(id, note) {
    const text = LABELS[id];
    if (!text) return null;                  // unknown id -> show nothing
    return createElement(
      'span',
      { style: LABEL_STYLE, 'data-lab-label': id, title: text },
      'Included here: ' + text + (note ? ' (' + note + ')' : '')
    );
  },
  // Plain DOM version, used by the standalone HTML lab page (public/lab/index.html).
  dom(id, targetElement, note) {
    const text = LABELS[id];
    if (!text || !targetElement) return;
    const span = document.createElement('span');
    Object.assign(span.style, LABEL_STYLE);
    span.textContent = 'Included here: ' + text + (note ? ' (' + note + ')' : '');
    targetElement.appendChild(span);
  }
};

// ===== LABELS BLOCK END (frontend) - the next line must stay exactly as it is =====
//*/

// Safe React helper used in every page and component:  <Label id="3b" />
// It never throws, and it returns null when the block above is commented out.
export function Label({ id, note }) {
  try {
    return impl ? impl.render(id, note) : null;
  } catch (err) {
    return null;                              // labels must never break the page
  }
}

// Safe DOM helper used by the standalone lab page:  domLabel('1a', someElement)
export function domLabel(id, targetElement, note) {
  try {
    if (impl) impl.dom(id, targetElement, note);
  } catch (err) {
    /* ignore */
  }
}

// Handy for the lab page: tells us whether labels are switched on.
export const labelsEnabled = () => impl !== null;
