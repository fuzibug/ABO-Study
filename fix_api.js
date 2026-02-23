const fs = require('fs');
let f = fs.readFileSync('js/api.js', 'utf8');

f = f.replace(
  `console.log('RAW BEFORE PARSE:', JSON.stringify(raw.slice(0, 200)));`,
  `console.log('RAW BEFORE PARSE:', JSON.stringify(raw.slice(0, 500)));
 console.log('RAW TAIL:', JSON.stringify(raw.slice(-200)));
 console.log('RAW LENGTH:', raw.length);`
);

fs.writeFileSync('js/api.js', f);
console.log('✅ Done');
