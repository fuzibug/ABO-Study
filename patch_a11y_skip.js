const fs = require('fs');
let f = fs.readFileSync('index.html', 'utf8');
f = f.replace('<body>', '<body>\n<a class="skip-link" href="#main-content">Skip to content</a>');
fs.writeFileSync('index.html', f);
console.log('✅ Skip link added');
