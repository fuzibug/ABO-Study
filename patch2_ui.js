const fs = require('fs');

// --- index.html: add Quit button to quiz footer ---
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  '<div class="qfoot">',
  '<div class="qfoot"><button class="btn-sec btn-quit" id="btn-quit" title="Quit exam" style="padding:8px 14px;font-size:12px;">✕ Quit</button>'
);
fs.writeFileSync('index.html', html);

// --- ui.js: wire quit button + ring pct + score ring on results ---
let ui = fs.readFileSync('js/ui.js', 'utf8');

// Wire quit button
ui = ui.replace(
  "el('btn-new').addEventListener('click', gotoSetup);",
  `el('btn-new').addEventListener('click', gotoSetup);
el('btn-quit').addEventListener('click', function () {
  if (questions.length === 0 || confirm('Quit this exam? Progress will be lost.')) {
    clearTimer();
    gotoSetup();
  }
});`
);

fs.writeFileSync('js/ui.js', ui);
console.log('✅ UI patched');
