// ─────────────────────────────────────────
//  state.js  —  All shared application state
//  Mutated directly by other modules.
// ─────────────────────────────────────────

// ── Setup options (chosen on the setup page) ──
var offline    = true;
var provider   = 'groq';
var selModel   = 'llama-3.3-70b-versatile';
var selDomain  = 'all';
var selDiff    = 'mixed';
var selCount   = 10;
var explainMode  = 'immediate';   // 'immediate' | 'end' | 'never'
var examMode     = 'practice';    // 'practice'  | 'exam'
var timedMode    = false;
var shuffleMode  = true;
var timerDuration = 60;
var showDomainTag = true;
var showDiffTag   = true;

// ── API keys (loaded from localStorage on init) ──
var groqKey = '';
var orKey   = '';

// ── Active quiz session ──
var questions  = [];
var qi         = 0;       // current question index
var score      = 0;
var wrongs     = 0;
var results    = [];      // array of { q, ans, ok, time }
var qStart     = 0;       // Date.now() when question rendered
var totalTime  = 0;
var timerIv    = null;
var timerLeft  = 60;
var answered   = false;
