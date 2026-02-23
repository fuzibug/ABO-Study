// ─────────────────────────────────────────
//  constants.js  —  Read-only lookup tables
// ─────────────────────────────────────────

var DM = {
  geometric_optics:  { l: 'Geometric Optics',   i: '&#128302;' },
  ophthalmic_optics: { l: 'Ophthalmic Optics',  i: '&#128301;' },
  lens_materials:    { l: 'Lens Materials',      i: '&#128142;' },
  lens_designs:      { l: 'Lens Designs',        i: '&#128083;' },
  coatings:          { l: 'Coatings',            i: '&#10024;'  },
  frame_selection:   { l: 'Frame Selection',     i: '&#128246;' },
  measurements:      { l: 'Measurements',        i: '&#128208;' },
  dispensing:        { l: 'Dispensing',          i: '&#128295;' },
  prescriptions:     { l: 'Prescriptions',       i: '&#128203;' },
  anatomy:           { l: 'Ocular Anatomy',      i: '&#129514;' },
  pathology:         { l: 'Ocular Pathology',    i: '&#127973;' },
  contact_lenses:    { l: 'Contact Lenses',      i: '&#128065;' },
  regulations:       { l: 'Regulations',         i: '&#9878;'   },
  safety_eyewear:    { l: 'Safety Eyewear',      i: '&#129366;' },
  low_vision:        { l: 'Low Vision',          i: '&#128270;' },
};

var DIFF_LABELS = {
  mixed:        'Mixed',
  foundation:   'Foundational',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
  expert:       'Expert',
  calculations: 'Calc-Focused',
};

var DIFF_CSS_CLASS = {
  foundation:   'f',
  intermediate: 'i',
  advanced:     'a',
  expert:       'e',
};

var LTR = ['A', 'B', 'C', 'D', 'E'];

var GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
var OR_URL   = 'https://openrouter.ai/api/v1/chat/completions';

var THEMES = [
  { id: '',               label: 'Deep Ocean', c: ['#080c16', '#63b3ed', '#d4a853'] },
  { id: 'theme-emerald',  label: 'Emerald',    c: ['#081610', '#48bb78', '#d4a853'] },
  { id: 'theme-crimson',  label: 'Crimson',    c: ['#160810', '#f56565', '#d4a853'] },
  { id: 'theme-violet',   label: 'Violet',     c: ['#0d0816', '#9f7aea', '#d4a853'] },
  { id: 'theme-clinical', label: 'Clinical',   c: ['#f0f4f8', '#3182ce', '#c27c1a'] },
  { id: 'theme-slate',    label: 'Slate',      c: ['#0f1117', '#a0aec0', '#d4a853'] },
];

// Pages → which tab IDs should be "on" for that page
var TAB_MAP = {
  'pg-setup':  ['t-setup',  't-setup2',  't-setup3'],
  'pg-prog':   ['t-prog',   't-prog2',   't-prog3'],
  'pg-appear': ['t-appear', 't-appear2', 't-appear3'],
};

var ALL_PAGES = ['pg-setup', 'pg-prog', 'pg-appear', 'pg-quiz', 'pg-results'];
