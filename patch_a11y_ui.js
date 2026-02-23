const fs = require('fs');
let f = fs.readFileSync('js/ui.js', 'utf8');

// Update aria-selected on tab switch
f = f.replace(
  `Object.keys(TAB_MAP).forEach(function (pg) {
TAB_MAP[pg].forEach(function (tid) {
var te = el(tid);
if (te) te.classList.toggle('on', pg === pid);
});
});`,
  `Object.keys(TAB_MAP).forEach(function (pg) {
  TAB_MAP[pg].forEach(function (tid) {
    var te = el(tid);
    if (te) {
      te.classList.toggle('on', pg === pid);
      if (te.getAttribute('role') === 'tab') {
        te.setAttribute('aria-selected', pg === pid ? 'true' : 'false');
      }
    }
  });
});`
);

// Update progressbar aria-valuenow when score updates
f = f.replace(
  `el('prog-fill').style.width`,
  `var pb = document.querySelector('[role="progressbar"]'); if (pb) pb.setAttribute('aria-valuenow', Math.round(parseFloat(el('prog-fill').style.width || 0)));
el('prog-fill').style.width`
);

fs.writeFileSync('js/ui.js', f);
console.log('✅ ui.js a11y patched');
