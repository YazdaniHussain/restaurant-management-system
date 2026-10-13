// public/lab/lab-labels.js
// Links the standalone lab page with the shared labels file (frontend/src/labels/labels.js).
// When the labels block is commented out, domLabel() does nothing and the page stays clean.
// It works with "npm run dev" (Vite serves /src/...).
import { domLabel } from '/src/labels/labels.js';

// Each <section data-lab="1a"> gets its label; 1b-1e sections are labelled too.
document.querySelectorAll('[data-lab]').forEach((section) => {
  const heading = section.querySelector('h2');
  domLabel(section.dataset.lab, heading);
});
