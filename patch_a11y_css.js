const fs = require('fs');
let f = fs.readFileSync('css/styles.css', 'utf8');

f += `
/* ── Accessibility ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}

/* Skip to main content link */
.skip-link{position:absolute;top:-40px;left:8px;background:var(--acc);color:#000;padding:8px 14px;border-radius:0 0 6px 6px;font-size:13px;font-weight:600;z-index:9999;transition:top .15s;}
.skip-link:focus{top:0;}

/* Ensure non-color indicator on correct/wrong (pattern underline) */
.opt.ok::after{content:"✓";margin-left:auto;font-size:12px;}
.opt.bad::after{content:"✗";margin-left:auto;font-size:12px;}
`;

fs.writeFileSync('css/styles.css', f);
console.log('✅ CSS a11y patched');
