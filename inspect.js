const fs = require('fs');
['index.html', 'css/style.css'].forEach(f => {
  if (fs.existsSync(f)) {
    console.log('\n=== ' + f + ' ===');
    console.log(fs.readFileSync(f, 'utf8'));
  }
});
