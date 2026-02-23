const fs = require('fs');
let f = fs.readFileSync('js/quiz.js', 'utf8');

// Auto-scroll to top of card on each new question
f = f.replace(
  'function setCard(html) { el(\'qcard\').innerHTML = html; }',
  `function setCard(html) {
  el('qcard').innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}`
);

// Animate score ring on results page using conic-gradient --pct var
f = f.replace(
  "el('result-ring').style.background",
  "el('result-ring').style.setProperty('--pct', pct + '%'); el('result-ring').style.background"
);

fs.writeFileSync('js/quiz.js', f);
console.log('✅ quiz.js patched');
