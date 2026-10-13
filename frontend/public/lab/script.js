// public/lab/script.js
// Programs for 1a - 1e (plain JavaScript + DOM, no libraries).

// ---------------------------------------------------------------------
// 1a - This file is linked with index.html using <script src="script.js" defer></script>.
//      If you can read the message below on the page, the link works.
// ---------------------------------------------------------------------
document.getElementById('linkStatus').textContent = 'script.js is linked and running!';
console.log('1a: script.js loaded');

// ---------------------------------------------------------------------
// 1b - Selecting elements in the HTML page using selectors
// ---------------------------------------------------------------------
document.getElementById('btnSelect').addEventListener('click', function () {
  const byId = document.getElementById('uniqueText');                // select by id
  const byClass = document.getElementsByClassName('demo-text');      // select by class name
  const byQuery = document.querySelector('.demo-text');              // first match of a CSS selector
  const all = document.querySelectorAll('#sec-1b p');                // every match of a CSS selector

  byId.classList.toggle('highlight');
  for (const p of byClass) p.classList.toggle('highlight');

  document.getElementById('selectOutput').textContent =
    'getElementById -> "' + byId.textContent + '" | getElementsByClassName -> ' + byClass.length +
    ' elements | querySelector -> "' + byQuery.textContent + '" | querySelectorAll -> ' + all.length + ' paragraphs';
});

// ---------------------------------------------------------------------
// 1c - Event listeners (input, mouseover, mouseout, keydown)
// ---------------------------------------------------------------------
const nameInput = document.getElementById('nameInput');
const hoverBox = document.getElementById('hoverBox');
const listenerOutput = document.getElementById('listenerOutput');

nameInput.addEventListener('input', function (event) {
  listenerOutput.textContent = 'input event: you typed "' + event.target.value + '"';
});
nameInput.addEventListener('keydown', function (event) {
  console.log('1c: key pressed ->', event.key);
});
hoverBox.addEventListener('mouseover', function () { hoverBox.classList.add('highlight'); });
hoverBox.addEventListener('mouseout', function () { hoverBox.classList.remove('highlight'); });

// ---------------------------------------------------------------------
// 1d - Handling click events for HTML button elements (three ways)
// ---------------------------------------------------------------------
const clickOutput = document.getElementById('clickOutput');

// Way 1: inline attribute onclick="inlineClick()" in the HTML button
function inlineClick() { clickOutput.textContent = 'Inline onclick button was clicked'; }

// Way 2: DOM property onclick
document.getElementById('btnProperty').onclick = function () {
  clickOutput.textContent = 'Property onclick button was clicked';
};

// Way 3: addEventListener (the modern way, can add many listeners)
let clickCount = 0;
document.getElementById('btnListener').addEventListener('click', function () {
  clickCount++;
  clickOutput.textContent = 'addEventListener button clicked ' + clickCount + ' time(s)';
});

// ---------------------------------------------------------------------
// 1e - Three types of functions
// ---------------------------------------------------------------------
// i.   Function declaration (hoisted: can be called before this line)
function addDeclaration(a, b) { return a + b; }

// ii.  Function definition / expression (a function stored in a variable)
const multiplyExpression = function (a, b) { return a * b; };

// iii. Arrow function (short syntax)
const subtractArrow = (a, b) => a - b;

document.getElementById('btnFunctions').addEventListener('click', function () {
  const result =
    'Declaration 5 + 3 = ' + addDeclaration(5, 3) +
    ' | Expression 5 x 3 = ' + multiplyExpression(5, 3) +
    ' | Arrow 5 - 3 = ' + subtractArrow(5, 3);
  document.getElementById('functionOutput').textContent = result;
  console.log('1e:', result);
});
