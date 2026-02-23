const fs = require('fs');
let f = fs.readFileSync('css/styles.css', 'utf8');

f = f.replace(
  `.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(160px,100%),1fr));gap:9px;}`,
  `.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:9px;}`
);

// Add sgrid override into the existing media query
f = f.replace(
  `.stat-grid{grid-template-columns:repeat(2,1fr);}`,
  `.stat-grid{grid-template-columns:repeat(2,1fr);}
  .sgrid{grid-template-columns:1fr !important;}`
);

fs.writeFileSync('css/styles.css', f);
console.log('✅ Done');
