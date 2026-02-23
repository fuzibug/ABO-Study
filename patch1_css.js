const fs = require('fs');
let f = fs.readFileSync('css/styles.css', 'utf8');

// 1. Smooth scroll
f = f.replace('*{margin:0;padding:0;box-sizing:border-box;}', '*{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}');

// 2. Tap highlight off + better touch targets on mobile
f = f.replace(
  'body{background:var(--bg);color:var(--tx);font-family:"DM Sans",sans-serif;min-height:100vh;transition:background .3s,color .3s;}',
  'body{background:var(--bg);color:var(--tx);font-family:"DM Sans",sans-serif;min-height:100vh;transition:background .3s,color .3s;-webkit-tap-highlight-color:transparent;}'
);

// 3. Option buttons — bigger tap area + subtle press effect on mobile
f = f.replace(
  '.opt:hover:not([disabled]){border-color:var(--acc);background:rgba(99,179,237,.06);transform:translateX(2px);}',
  '.opt:hover:not([disabled]){border-color:var(--acc);background:rgba(99,179,237,.06);transform:translateX(2px);}.opt:active:not([disabled]){transform:scale(.98);}'
);

// 4. btn-go press effect
f = f.replace(
  '.btn-go:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(99,179,237,.2);}',
  '.btn-go:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(99,179,237,.2);}.btn-go:active{transform:translateY(0);box-shadow:none;}'
);

// 5. Sticky quiz footer so Next button always visible
f = f.replace(
  '.qfoot{display:flex;justify-content:space-between;align-items:center;margin-top:18px;flex-wrap:wrap;gap:10px;}',
  '.qfoot{display:flex;justify-content:space-between;align-items:center;margin-top:18px;flex-wrap:wrap;gap:10px;position:sticky;bottom:0;background:var(--bg);padding:10px 0 6px;z-index:10;border-top:1px solid var(--bdr);}'
);

// 6. Pulse animation for loading spinner
f = f.replace(
  '@keyframes spin{to{transform:rotate(360deg);}}',
  '@keyframes spin{to{transform:rotate(360deg);}}@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}'
);

// 7. Score ring conic gradient progress
f += `
/* ── Score ring progress ── */
.ring{background:conic-gradient(var(--acc) var(--pct,0%), var(--s3) 0%);}

/* ── Swipe hint on mobile ── */
@media(max-width:600px){
  .qfoot{padding:10px 0 env(safe-area-inset-bottom,8px);}
  .opt{min-height:52px;}
  .btn-go{font-size:15px;padding:17px;border-radius:12px;}
  .tab{font-size:10px;padding:10px 4px;}
}

/* ── Focus visible for keyboard nav ── */
.opt:focus-visible,.btn-go:focus-visible,.btn-sec:focus-visible,.dbtn:focus-visible,.dfbtn:focus-visible{outline:2px solid var(--acc);outline-offset:2px;}
`;

fs.writeFileSync('css/styles.css', f);
console.log('✅ CSS patched');
