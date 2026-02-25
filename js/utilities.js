// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES.JS — Shared Helper Functions & Validation
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ERROR HANDLING & LOGGING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Centralized error logger with console output and optional user notification
 * @param {string} context - Where the error occurred (e.g., "data.js:genPrentice")
 * @param {Error|string} error - The error object or message
 * @param {boolean} notifyUser - Whether to show a toast notification
 */
function logError(context, error, notifyUser = false) {
  const timestamp = new Date().toISOString();
  const errorMsg = error instanceof Error ? error.message : String(error);
  const fullMsg = `[${timestamp}] ERROR in ${context}: ${errorMsg}`;
  
  console.error(fullMsg);
  if (error instanceof Error && error.stack) {
    console.error('Stack trace:', error.stack);
  }
  
  if (notifyUser && typeof toast === 'function') {
    toast(errorMsg, 'error');
  }
  
  // Optional: Could send to analytics/error tracking service here
  return fullMsg;
}

/**
 * Safe try-catch wrapper that logs errors and provides fallback
 * @param {Function} fn - Function to execute
 * @param {*} fallback - Value to return if function fails
 * @param {string} context - Context for error logging
 * @returns {*} Function result or fallback value
 */
function tryCatch(fn, fallback, context = 'unknown') {
  try {
    return fn();
  } catch (error) {
    logError(context, error, false);
    return fallback;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NUMBER VALIDATION & FORMATTING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Validates and clamps a number within a range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {string} name - Parameter name for error messages
 * @returns {number} Clamped valid number
 * @throws {Error} If value is not a number or NaN
 */
function validateNumber(value, min, max, name = 'value') {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${name} must be a valid number, got: ${value}`);
  }
  if (!isFinite(value)) {
    throw new Error(`${name} must be finite, got: ${value}`);
  }
  return Math.max(min, Math.min(max, value));
}

/**
 * Safely divide two numbers with zero-check
 * @param {number} numerator
 * @param {number} denominator
 * @param {number} fallback - Value to return if division is invalid
 * @returns {number}
 */
function safeDivide(numerator, denominator, fallback = 0) {
  if (denominator === 0 || !isFinite(numerator) || !isFinite(denominator)) {
    return fallback;
  }
  return numerator / denominator;
}

/**
 * Rounds a number to specified decimal places
 * @param {number} value
 * @param {number} decimals - Number of decimal places
 * @returns {number}
 */
function roundTo(value, decimals = 2) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Format diopter power with proper sign notation
 * @param {number} power - Power in diopters
 * @param {number} decimals - Decimal places (default 2)
 * @returns {string} Formatted string (e.g., "+2.50", "-4.00")
 */
function formatDiopter(power, decimals = 2) {
  const rounded = roundTo(power, decimals);
  const sign = rounded >= 0 ? '+' : '';
  return `${sign}${rounded.toFixed(decimals)}`;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARRAY & OBJECT UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Fisher-Yates shuffle - randomly shuffles array in place
 * @param {Array} arr - Array to shuffle
 * @returns {Array} Shuffled array (same reference)
 */
function shuffle(arr) {
  if (!Array.isArray(arr)) {
    logError('utils:shuffle', 'Input is not an array', false);
    return arr;
  }
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get random element from array
 * @param {Array} arr - Source array
 * @returns {*} Random element or undefined if array is empty
 */
function randomChoice(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    logError('utils:randomChoice', 'Array is empty or invalid', false);
    return undefined;
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random float between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} decimals - Decimal places
 * @returns {number} Random float
 */
function randomFloat(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return roundTo(value, decimals);
}

/**
 * Deep clone an object (simple version, no functions/dates)
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
function deepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    logError('utils:deepClone', error, false);
    return obj;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STRING & FORMAT UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Format time in seconds to MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time
 */
function formatTime(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Pluralize a word based on count
 * @param {number} count
 * @param {string} singular
 * @param {string} plural - Optional custom plural form
 * @returns {string}
 */
function pluralize(count, singular, plural = null) {
  if (count === 1) return singular;
  return plural || (singular + 's');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DOM UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Safe querySelector with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default document)
 * @returns {Element|null} Found element or null
 */
function $(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    logError('utils:$', `Invalid selector: ${selector}`, false);
    return null;
  }
}

/**
 * Safe querySelectorAll with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default document)
 * @returns {Array} Array of elements (empty if none found or error)
 */
function $$(selector, context = document) {
  try {
    return Array.from(context.querySelectorAll(selector));
  } catch (error) {
    logError('utils:$$', `Invalid selector: ${selector}`, false);
    return [];
  }
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOCALSTORAGE UTILITIES WITH ERROR HANDLING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Safe localStorage.setItem with quota handling
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON.stringified)
 * @returns {boolean} Success status
 */
function safeSetStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      logError('utils:safeSetStorage', 'localStorage quota exceeded', true);
      // Optionally: clear old data or notify user
    } else {
      logError('utils:safeSetStorage', error, false);
    }
    return false;
  }
}

/**
 * Safe localStorage.getItem with JSON parsing
 * @param {string} key - Storage key
 * @param {*} fallback - Fallback value if key not found or invalid
 * @returns {*} Parsed value or fallback
 */
function safeGetStorage(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item);
  } catch (error) {
    logError('utils:safeGetStorage', `Failed to parse ${key}`, false);
    return fallback;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VALIDATION FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Validate question object structure
 * @param {Object} q - Question object
 * @param {number} index - Question index for error messages
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
function validateQuestion(q, index = 0) {
  const errors = [];
  
  if (!q || typeof q !== 'object') {
    throw new Error(`Question ${index}: not an object`);
  }
  
  if (!q.question || typeof q.question !== 'string') {
    errors.push('missing or invalid "question" field');
  }
  
  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push('invalid "options" array (need at least 2)');
  }
  
  if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= (q.options?.length || 0)) {
    errors.push(`invalid "correct" index (${q.correct})`);
  }
  
  if (!q.domain || typeof q.domain !== 'string') {
    errors.push('missing "domain" field');
  }
  
  if (!q.difficulty || typeof q.difficulty !== 'string') {
    errors.push('missing "difficulty" field');
  }
  
  if (errors.length > 0) {
    throw new Error(`Question ${index}: ${errors.join(', ')}`);
  }
  
  return true;
}

/**
 * Validate optical prescription values
 * @param {number} sphere - Sphere power
 * @param {number} cylinder - Cylinder power
 * @param {number} axis - Axis in degrees
 * @returns {Object} Validation result {valid: boolean, errors: string[]}
 */
function validatePrescription(sphere, cylinder, axis) {
  const errors = [];
  
  // Sphere: typically -20.00 to +20.00
  if (Math.abs(sphere) > 20) {
    errors.push(`Sphere out of range: ${sphere}`);
  }
  
  // Cylinder: typically -10.00 to +10.00
  if (Math.abs(cylinder) > 10) {
    errors.push(`Cylinder out of range: ${cylinder}`);
  }
  
  // Axis: 0-180 degrees (but commonly notated 1-180)
  if (axis < 0 || axis > 180) {
    errors.push(`Axis out of range: ${axis}`);
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * OPTICAL CALCULATION HELPERS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calculate prism using Prentice's Rule
 * @param {number} power - Lens power in diopters
 * @param {number} decentrationMM - Decentration in millimeters
 * @returns {number} Prism in prism diopters
 */
function calculatePrism(power, decentrationMM) {
  validateNumber(power, -20, 20, 'power');
  validateNumber(decentrationMM, 0, 20, 'decentrationMM');
  
  const decentrationCM = decentrationMM / 10;
  return Math.abs(power * decentrationCM);
}

/**
 * Determine prism base direction
 * @param {boolean} isPlusPower - Is the lens plus power?
 * @param {string} direction - 'below', 'above', 'temporal', 'nasal'
 * @returns {string} Base direction: 'BU', 'BD', 'BI', 'BO'
 */
function getPrismBase(isPlusPower, direction) {
  const dirMap = {
    'below':    isPlusPower ? 'BU' : 'BD',
    'above':    isPlusPower ? 'BD' : 'BU',
    'temporal': isPlusPower ? 'BO' : 'BI',
    'nasal':    isPlusPower ? 'BI' : 'BO'
  };
  
  const normalized = direction.toLowerCase().replace(/\s+to$/, '');
  return dirMap[normalized] || 'BU';
}

/**
 * Transpose prescription from minus to plus cylinder (or vice versa)
 * @param {number} sphere
 * @param {number} cylinder
 * @param {number} axis
 * @returns {Object} {sphere, cylinder, axis}
 */
function transposePrescription(sphere, cylinder, axis) {
  const validation = validatePrescription(sphere, cylinder, axis);
  if (!validation.valid) {
    throw new Error(`Invalid prescription: ${validation.errors.join(', ')}`);
  }
  
  const newSphere = roundTo(sphere + cylinder, 2);
  const newCylinder = roundTo(-cylinder, 2);
  const newAxis = (axis + 90) % 180 || 180;
  
  return {
    sphere: newSphere,
    cylinder: newCylinder,
    axis: newAxis
  };
}

/**
 * Calculate spherical equivalent
 * @param {number} sphere
 * @param {number} cylinder
 * @returns {number} Spherical equivalent
 */
function sphericalEquivalent(sphere, cylinder) {
  return roundTo(sphere + (cylinder / 2), 2);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PERFORMANCE MONITORING (OPTIONAL)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Simple performance timer
 * @param {string} label - Timer label
 * @returns {Function} Stop function that logs elapsed time
 */
function startTimer(label) {
  const start = performance.now();
  return () => {
    const elapsed = performance.now() - start;
    console.log(`⏱️ ${label}: ${elapsed.toFixed(2)}ms`);
    return elapsed;
  };
}

// Export all utilities for use in other modules
if (typeof window !== 'undefined') {
  window.utils = {
    // Error handling
    logError,
    tryCatch,
    
    // Numbers
    validateNumber,
    safeDivide,
    roundTo,
    formatDiopter,
    
    // Arrays & objects
    shuffle,
    randomChoice,
    randomInt,
    randomFloat,
    deepClone,
    
    // Strings & formatting
    escapeHtml,
    formatTime,
    pluralize,
    
    // DOM
    $,
    $$,
    debounce,
    throttle,
    
    // Storage
    safeSetStorage,
    safeGetStorage,
    
    // Validation
    validateQuestion,
    validatePrescription,
    
    // Optical calculations
    calculatePrism,
    getPrismBase,
    transposePrescription,
    sphericalEquivalent,
    
    // Performance
    startTimer
  };
}

console.log('✅ utilities.js loaded successfully');
