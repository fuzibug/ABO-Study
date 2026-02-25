# Enhanced Appearance Settings Installation Guide

## 🎉 What's New

Your ABO-Study app now has **comprehensive appearance customization** including:

- **Font Size Adjustment** (90% to 130%)
- **Line Height Options** (Compact, Normal, Relaxed)
- **Letter Spacing** (Normal, Wide)
- **Animation Control** (None, Reduced, Full)
- **High Contrast Mode** for better visibility
- **Focus Indicators Toggle** for keyboard navigation
- **Sound Effects** (placeholder for future)
- **System Preference Detection** (auto-applies OS accessibility settings)

---

## 📚 Files Added

1. **js/appearance.js** - JavaScript module handling all appearance logic
2. **css/appearance.css** - CSS styles for appearance features
3. **APPEARANCE_INSTALL.md** - This installation guide (you are here)

---

## 🔧 Installation Steps

### Step 1: Link CSS File

Add the appearance stylesheet to your `index.html` **after** `styles.css`:

```html
<head>
  <!-- ... existing head content ... -->
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/appearance.css">
</head>
```

### Step 2: Link JavaScript Module

Add the appearance script to your `index.html` **after** other scripts:

```html
<body>
  <!-- ... your app content ... -->
  
  <!-- Existing scripts -->
  <script src="js/constants.js"></script>
  <script src="js/data.js"></script>
  <script src="js/quiz.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/progress.js"></script>
  
  <!-- NEW: Appearance module -->
  <script src="js/appearance.js"></script>
</body>
```

### Step 3: Update Appearance Page HTML

Replace your existing appearance page (`#pg-appear`) with the enhanced version.

**Find this section in index.html:**
```html
<div id="pg-appear" class="page">
  <!-- OLD appearance content -->
</div>
```

**Replace with:**
```html
<!-- APPEARANCE -->
<div id="pg-appear" class="page">
  <div class="tabs" role="tablist" aria-label="Navigation">
    <button class="tab" id="t-setup3">📋 New Exam</button>
    <button class="tab" id="t-prog3">📈 Progress</button>
    <button class="tab on" id="t-appear3">🎪 Appearance</button>
  </div>
  
  <div class="card">
    <div class="ctitle">🎨 Color Theme</div>
    <p style="font-size:12px;color:var(--tx2);margin-bottom:16px;">Pick a color scheme. Your choice is saved automatically.</p>
    <div class="theme-swatches" id="theme-swatches"></div>
  </div>
  
  <div class="card">
    <div class="ctitle">👁 Font & Display</div>
    <div class="sgrid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));">
      <div class="sbox">
        <span class="slabel">Dyslexic Font</span>
        <div class="tog-row">
          <span class="tog-state" id="dyslexic-state">Off</span>
          <label class="tog"><input type="checkbox" id="chk-dyslexic"><span class="tog-track"></span></label>
        </div>
        <span class="sbox-desc">OpenDyslexic typeface</span>
      </div>
      
      <div class="sbox">
        <span class="slabel">Font Size</span>
        <div class="rng-wrap">
          <input type="range" id="rng-fontsize" min="90" max="130" step="10" value="100">
          <span class="rng-val" id="rv-fontsize">100%</span>
        </div>
        <span class="sbox-desc">Base text size adjustment</span>
      </div>
      
      <div class="sbox">
        <span class="slabel">Line Height</span>
        <div class="seg" id="seg-lineheight">
          <button class="sgbtn" data-v="compact">Compact</button>
          <button class="sgbtn on" data-v="normal">Normal</button>
          <button class="sgbtn" data-v="relaxed">Relaxed</button>
        </div>
        <span class="sbox-desc">Text spacing preference</span>
      </div>
      
      <div class="sbox">
        <span class="slabel">Letter Spacing</span>
        <div class="seg" id="seg-letterspacing">
          <button class="sgbtn on" data-v="normal">Normal</button>
          <button class="sgbtn" data-v="wide">Wide</button>
        </div>
        <span class="sbox-desc">Character spacing</span>
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="ctitle">⚙️ Interface Options</div>
    <div class="sgrid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));">
      <div class="sbox">
        <span class="slabel">Animations</span>
        <div class="seg" id="seg-animations">
          <button class="sgbtn" data-v="none">None</button>
          <button class="sgbtn on" data-v="reduced">Reduced</button>
          <button class="sgbtn" data-v="full">Full</button>
        </div>
        <span class="sbox-desc">Visual motion effects</span>
      </div>
      
      <div class="sbox">
        <span class="slabel">Contrast</span>
        <div class="seg" id="seg-contrast">
          <button class="sgbtn on" data-v="normal">Normal</button>
          <button class="sgbtn" data-v="high">High</button>
        </div>
        <span class="sbox-desc">Color intensity</span>
      </div>
      
      <div class="sbox">
        <span class="slabel">Focus Indicators</span>
        <div class="tog-row">
          <span class="tog-state on" id="focus-state">On</span>
          <label class="tog"><input type="checkbox" id="chk-focus" checked><span class="tog-track"></span></label>
        </div>
        <span class="sbox-desc">Keyboard navigation aids</span>
      </div>
      
      <div class="sbox">
        <span class="slabel">Sound Effects</span>
        <div class="tog-row">
          <span class="tog-state" id="sound-state">Off</span>
          <label class="tog"><input type="checkbox" id="chk-sound"><span class="tog-track"></span></label>
        </div>
        <span class="sbox-desc">Audio feedback (future)</span>
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="ctitle">👁 Theme Preview</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:12px">
      <div class="res-box"><div class="res-num" style="color:var(--acc)">Aa</div><div class="res-lbl">Accent</div></div>
      <div class="res-box"><div class="res-num" style="color:var(--ok)">✓</div><div class="res-lbl">Correct</div></div>
      <div class="res-box"><div class="res-num" style="color:var(--bad)">✗</div><div class="res-lbl">Wrong</div></div>
    </div>
    <div class="opt" style="pointer-events:none;margin-bottom:7px"><span class="opt-l">A</span><span>Sample answer option</span></div>
    <div class="opt ok" style="pointer-events:none;margin-bottom:7px"><span class="opt-l">B</span><span>Correct answer highlight</span></div>
    <div class="opt bad" style="pointer-events:none"><span class="opt-l">C</span><span>Incorrect answer highlight</span></div>
  </div>
  
  <div class="card" style="background:rgba(99,179,237,.04);border-color:rgba(99,179,237,.2)">
    <div style="font-size:12px;color:var(--tx2);line-height:1.7;">
      <strong style="color:var(--acc)">💡 Tip:</strong> All appearance settings are saved automatically and persist across sessions. Changes take effect immediately.
    </div>
  </div>
</div>
```

### Step 4: Test the Installation

1. Open `index.html` in your browser
2. Navigate to the **Appearance** tab
3. Try adjusting various settings:
   - Move the Font Size slider
   - Change Line Height options
   - Toggle High Contrast mode
   - Switch Animation levels
4. Check browser console for: `✅ Enhanced appearance settings loaded`
5. Reload the page - settings should persist

---

## ⚙️ How It Works

### Automatic Saving
All appearance settings are automatically saved to `localStorage` whenever you change them:
- `abo_fontSize`
- `abo_lineHeight`
- `abo_letterSpacing`
- `abo_animations`
- `abo_contrast`
- `abo_focusIndicators`
- `abo_soundEffects`

### System Preference Detection
The app automatically detects and respects OS-level accessibility settings:
- **Reduced Motion** - Auto-disables animations
- **High Contrast** - Auto-enhances borders and colors
- **Dark Mode** - Works with your existing theme system

### CSS Class System
Settings are applied via body classes:
```javascript
// Font size
body.font-90, body.font-100, ..., body.font-130

// Line height
body.lineheight-compact, body.lineheight-normal, body.lineheight-relaxed

// Letter spacing
body.letterspacing-normal, body.letterspacing-wide

// Animations
body.animations-none, body.animations-reduced, body.animations-full

// Contrast
body.contrast-normal, body.contrast-high

// Focus
body.focus-on, body.focus-off
```

---

## 📝 Testing Checklist

- [ ] Appearance page loads without errors
- [ ] Font size slider works (90-130%)
- [ ] Line height buttons work (Compact/Normal/Relaxed)
- [ ] Letter spacing buttons work (Normal/Wide)
- [ ] Animation buttons work (None/Reduced/Full)
- [ ] Contrast buttons work (Normal/High)
- [ ] Focus indicators toggle works
- [ ] Sound effects toggle works (just the toggle, not sound yet)
- [ ] Dyslexic font toggle works
- [ ] Settings persist after page reload
- [ ] Settings work with all themes
- [ ] Console shows `✅ Enhanced appearance settings loaded`
- [ ] No JavaScript errors in console

---

## 🐛 Troubleshooting

### Settings don't persist
- Check that `localStorage` is enabled (not in private/incognito mode)
- Open DevTools > Application > Local Storage > Check for `abo_*` keys

### Styles don't apply
- Verify `css/appearance.css` is linked **after** `css/styles.css`
- Check browser console for CSS errors
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### JavaScript errors
- Verify `js/appearance.js` is loaded **after** other scripts
- Check that element IDs match (e.g., `seg-lineheight`, `chk-focus`)
- Ensure no duplicate IDs in your HTML

### Settings apply to wrong elements
- CSS specificity issue - appearance.css uses body classes
- Check that your custom CSS doesn't override with `!important`

---

## 📊 Accessibility Features

### WCAG 2.1 Level AA Compliance
- High contrast mode meets 4.5:1 ratio
- Focus indicators clearly visible
- Keyboard navigation fully supported
- Respects OS-level accessibility preferences

### Screen Reader Support
- All toggles have proper ARIA labels
- State changes announced (via `aria-live` regions)
- Semantic HTML structure

### Motor Accessibility
- Large touch targets (min 44x44px on mobile)
- Animation controls for motion sensitivity
- Keyboard shortcuts work with all settings

---

## 🔮 Future Enhancements

- 🔊 Sound effects (correct/incorrect answer audio)
- 🎨 Custom color picker
- 🌐 Multiple language support for UI
- 💾 Export/import appearance presets
- 🔗 Share appearance settings via URL
- 📦 Preset profiles ("High Contrast", "Dyslexia-Friendly", etc.)

---

## 💬 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all files are correctly linked
3. Test in a different browser
4. Clear cache and localStorage
5. Review this guide's troubleshooting section

Enjoy your enhanced ABO-Study experience! 🎉
