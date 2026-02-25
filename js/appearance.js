// ═══════════════════════════════════════════════════════════════
// APPEARANCE.JS - Enhanced Appearance Settings Module
// ═══════════════════════════════════════════════════════════════

/**
 * Load and apply appearance settings from localStorage
 */
function loadAppearanceSettings() {
  const settings = {
    fontSize: localStorage.getItem('abo_fontSize') || '100',
    lineHeight: localStorage.getItem('abo_lineHeight') || 'normal',
    letterSpacing: localStorage.getItem('abo_letterSpacing') || 'normal',
    animations: localStorage.getItem('abo_animations') || 'reduced',
    contrast: localStorage.getItem('abo_contrast') || 'normal',
    focusIndicators: localStorage.getItem('abo_focusIndicators') || 'on',
    soundEffects: localStorage.getItem('abo_soundEffects') || 'off',
    dyslexic: localStorage.getItem('abo_dyslexic') === 'true'
  };
  
  // Apply settings
  applyFontSize(settings.fontSize);
  applyLineHeight(settings.lineHeight);
  applyLetterSpacing(settings.letterSpacing);
  applyAnimations(settings.animations);
  applyContrast(settings.contrast);
  applyFocusIndicators(settings.focusIndicators);
  applyDyslexicFont(settings.dyslexic);
  
  // Update UI controls
  updateAppearanceUI(settings);
  
  return settings;
}

/**
 * Apply font size setting
 */
function applyFontSize(size) {
  document.body.classList.remove('font-90', 'font-100', 'font-110', 'font-120', 'font-130');
  document.body.classList.add(`font-${size}`);
}

/**
 * Apply line height setting
 */
function applyLineHeight(height) {
  document.body.classList.remove('lineheight-compact', 'lineheight-normal', 'lineheight-relaxed');
  document.body.classList.add(`lineheight-${height}`);
}

/**
 * Apply letter spacing setting
 */
function applyLetterSpacing(spacing) {
  document.body.classList.remove('letterspacing-normal', 'letterspacing-wide');
  document.body.classList.add(`letterspacing-${spacing}`);
}

/**
 * Apply animations setting
 */
function applyAnimations(level) {
  document.body.classList.remove('animations-none', 'animations-reduced', 'animations-full');
  document.body.classList.add(`animations-${level}`);
}

/**
 * Apply contrast setting
 */
function applyContrast(level) {
  document.body.classList.remove('contrast-normal', 'contrast-high');
  document.body.classList.add(`contrast-${level}`);
}

/**
 * Apply focus indicators setting
 */
function applyFocusIndicators(state) {
  document.body.classList.remove('focus-on', 'focus-off');
  document.body.classList.add(`focus-${state}`);
}

/**
 * Apply dyslexic font setting
 */
function applyDyslexicFont(enabled) {
  if (enabled) {
    document.body.classList.add('dyslexic');
  } else {
    document.body.classList.remove('dyslexic');
  }
}

/**
 * Update UI controls to reflect current settings
 */
function updateAppearanceUI(settings) {
  // Font size slider
  const fontSizeSlider = document.getElementById('rng-fontsize');
  const fontSizeValue = document.getElementById('rv-fontsize');
  if (fontSizeSlider && fontSizeValue) {
    fontSizeSlider.value = settings.fontSize;
    fontSizeValue.textContent = settings.fontSize + '%';
  }
  
  // Line height segmented control
  updateSegmentedControl('seg-lineheight', settings.lineHeight);
  
  // Letter spacing segmented control
  updateSegmentedControl('seg-letterspacing', settings.letterSpacing);
  
  // Animations segmented control
  updateSegmentedControl('seg-animations', settings.animations);
  
  // Contrast segmented control
  updateSegmentedControl('seg-contrast', settings.contrast);
  
  // Focus indicators toggle
  const focusToggle = document.getElementById('chk-focus');
  const focusState = document.getElementById('focus-state');
  if (focusToggle && focusState) {
    focusToggle.checked = settings.focusIndicators === 'on';
    focusState.textContent = settings.focusIndicators === 'on' ? 'On' : 'Off';
    focusState.classList.toggle('on', settings.focusIndicators === 'on');
  }
  
  // Sound effects toggle
  const soundToggle = document.getElementById('chk-sound');
  const soundState = document.getElementById('sound-state');
  if (soundToggle && soundState) {
    soundToggle.checked = settings.soundEffects === 'on';
    soundState.textContent = settings.soundEffects === 'on' ? 'On' : 'Off';
    soundState.classList.toggle('on', settings.soundEffects === 'on');
  }
  
  // Dyslexic font toggle
  const dyslexicToggle = document.getElementById('chk-dyslexic');
  const dyslexicState = document.getElementById('dyslexic-state');
  if (dyslexicToggle && dyslexicState) {
    dyslexicToggle.checked = settings.dyslexic;
    dyslexicState.textContent = settings.dyslexic ? 'On' : 'Off';
    dyslexicState.classList.toggle('on', settings.dyslexic);
  }
}

/**
 * Update segmented control active state
 */
function updateSegmentedControl(segId, value) {
  const seg = document.getElementById(segId);
  if (!seg) return;
  
  const buttons = seg.querySelectorAll('.sgbtn');
  buttons.forEach(btn => {
    const isActive = btn.getAttribute('data-v') === value;
    btn.classList.toggle('on', isActive);
  });
}

/**
 * Initialize appearance settings event listeners
 */
function initAppearanceSettings() {
  // Font size slider
  const fontSizeSlider = document.getElementById('rng-fontsize');
  const fontSizeValue = document.getElementById('rv-fontsize');
  if (fontSizeSlider) {
    fontSizeSlider.addEventListener('input', (e) => {
      const size = e.target.value;
      fontSizeValue.textContent = size + '%';
      applyFontSize(size);
      localStorage.setItem('abo_fontSize', size);
    });
  }
  
  // Line height segmented control
  setupSegmentedControl('seg-lineheight', 'abo_lineHeight', applyLineHeight);
  
  // Letter spacing segmented control
  setupSegmentedControl('seg-letterspacing', 'abo_letterSpacing', applyLetterSpacing);
  
  // Animations segmented control
  setupSegmentedControl('seg-animations', 'abo_animations', applyAnimations);
  
  // Contrast segmented control
  setupSegmentedControl('seg-contrast', 'abo_contrast', applyContrast);
  
  // Focus indicators toggle
  const focusToggle = document.getElementById('chk-focus');
  const focusState = document.getElementById('focus-state');
  if (focusToggle) {
    focusToggle.addEventListener('change', (e) => {
      const state = e.target.checked ? 'on' : 'off';
      focusState.textContent = state === 'on' ? 'On' : 'Off';
      focusState.classList.toggle('on', state === 'on');
      applyFocusIndicators(state);
      localStorage.setItem('abo_focusIndicators', state);
    });
  }
  
  // Sound effects toggle
  const soundToggle = document.getElementById('chk-sound');
  const soundState = document.getElementById('sound-state');
  if (soundToggle) {
    soundToggle.addEventListener('change', (e) => {
      const state = e.target.checked ? 'on' : 'off';
      soundState.textContent = state === 'on' ? 'On' : 'Off';
      soundState.classList.toggle('on', state === 'on');
      localStorage.setItem('abo_soundEffects', state);
      // Future: Play test sound here
      if (state === 'on') {
        console.log('🔊 Sound effects enabled (coming soon)');
      }
    });
  }
  
  // Dyslexic font toggle
  const dyslexicToggle = document.getElementById('chk-dyslexic');
  const dyslexicState = document.getElementById('dyslexic-state');
  if (dyslexicToggle) {
    dyslexicToggle.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      dyslexicState.textContent = enabled ? 'On' : 'Off';
      dyslexicState.classList.toggle('on', enabled);
      applyDyslexicFont(enabled);
      localStorage.setItem('abo_dyslexic', enabled);
    });
  }
}

/**
 * Setup segmented control event listeners
 */
function setupSegmentedControl(segId, storageKey, applyFn) {
  const seg = document.getElementById(segId);
  if (!seg) return;
  
  const buttons = seg.querySelectorAll('.sgbtn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      buttons.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      
      // Apply setting
      const value = btn.getAttribute('data-v');
      applyFn(value);
      localStorage.setItem(storageKey, value);
    });
  });
}

/**
 * Detect system preferences and suggest settings
 */
function detectSystemPreferences() {
  const preferences = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
  };
  
  // Auto-apply if user hasn't set preferences
  if (preferences.reducedMotion && !localStorage.getItem('abo_animations')) {
    applyAnimations('none');
    localStorage.setItem('abo_animations', 'none');
    console.log('📱 Reduced motion detected - animations disabled');
  }
  
  if (preferences.highContrast && !localStorage.getItem('abo_contrast')) {
    applyContrast('high');
    localStorage.setItem('abo_contrast', 'high');
    console.log('📱 High contrast detected - contrast enhanced');
  }
  
  return preferences;
}

/**
 * Reset all appearance settings to defaults
 */
function resetAppearanceSettings() {
  const defaults = {
    fontSize: '100',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    animations: 'reduced',
    contrast: 'normal',
    focusIndicators: 'on',
    soundEffects: 'off',
    dyslexic: false
  };
  
  // Clear storage
  localStorage.removeItem('abo_fontSize');
  localStorage.removeItem('abo_lineHeight');
  localStorage.removeItem('abo_letterSpacing');
  localStorage.removeItem('abo_animations');
  localStorage.removeItem('abo_contrast');
  localStorage.removeItem('abo_focusIndicators');
  localStorage.removeItem('abo_soundEffects');
  localStorage.removeItem('abo_dyslexic');
  
  // Reapply defaults
  Object.keys(defaults).forEach(key => {
    const value = defaults[key];
    switch(key) {
      case 'fontSize': applyFontSize(value); break;
      case 'lineHeight': applyLineHeight(value); break;
      case 'letterSpacing': applyLetterSpacing(value); break;
      case 'animations': applyAnimations(value); break;
      case 'contrast': applyContrast(value); break;
      case 'focusIndicators': applyFocusIndicators(value); break;
      case 'dyslexic': applyDyslexicFont(value); break;
    }
  });
  
  updateAppearanceUI(defaults);
  if (typeof toast === 'function') {
    toast('Appearance settings reset to defaults', 'info');
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadAppearanceSettings();
    initAppearanceSettings();
    detectSystemPreferences();
  });
} else {
  // DOM already loaded
  loadAppearanceSettings();
  initAppearanceSettings();
  detectSystemPreferences();
}

console.log('✅ Enhanced appearance settings loaded');
