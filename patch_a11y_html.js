const fs = require('fs');
let f = fs.readFileSync('index.html', 'utf8');

// lang attribute
f = f.replace('<html lang="en">', '<html lang="en">');  // already set, good

// Main landmark
f = f.replace('<div class="wrap">', '<main class="wrap" id="main-content">');
f = f.replace('</div><!-- /wrap -->', '</main><!-- /wrap -->');

// Tab list ARIA
f = f.replace(/<div class="tabs">/g, '<div class="tabs" role="tablist" aria-label="Navigation">');
f = f.replace(/<button class="tab on" id="t-setup">/,  '<button class="tab on" id="t-setup"  role="tab" aria-selected="true"  aria-controls="pg-setup">');
f = f.replace(/<button class="tab" id="t-prog">/,      '<button class="tab"    id="t-prog"   role="tab" aria-selected="false" aria-controls="pg-prog">');
f = f.replace(/<button class="tab" id="t-appear">/,    '<button class="tab"    id="t-appear" role="tab" aria-selected="false" aria-controls="pg-appear">');

// Progress bar ARIA
f = f.replace(
  '<div class="prog"><div class="prog-fill" id="prog-fill" style="width:0%"></div></div>',
  '<div class="prog" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Quiz progress"><div class="prog-fill" id="prog-fill" style="width:0%"></div></div>'
);

// Timer ARIA
f = f.replace(
  '<div class="tnum" id="tnum">60</div>',
  '<div class="tnum" id="tnum" aria-live="polite" aria-label="Time remaining">60</div>'
);

// Live score ARIA
f = f.replace(
  '<div class="live" id="live-wrap">',
  '<div class="live" id="live-wrap" aria-live="polite" aria-atomic="true">'
);

// Toast ARIA
f = f.replace(
  '<div class="toast" id="toast"></div>',
  '<div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>'
);

// Score ring ARIA
f = f.replace(
  '<div class="ring" id="result-ring">',
  '<div class="ring" id="result-ring" role="img" aria-label="Score">'
);

// Answer options — will get aria added dynamically in quiz.js, but give the container a role
f = f.replace(
  '<div class="opts">',
  '<div class="opts" role="group" aria-label="Answer options">'
);

// Begin exam button
f = f.replace(
  '<button class="btn-go" id="btn-start">',
  '<button class="btn-go" id="btn-start" aria-label="Begin Mock Exam">'
);

// Domain grid
f = f.replace(
  '<div class="dgrid" id="domain-grid">',
  '<div class="dgrid" id="domain-grid" role="group" aria-label="Content Domain">'
);

// Difficulty grid
f = f.replace(
  '<div class="dfgrid" id="diff-grid">',
  '<div class="dfgrid" id="diff-grid" role="group" aria-label="Difficulty">'
);

fs.writeFileSync('index.html', f);
console.log('✅ HTML a11y patched');
