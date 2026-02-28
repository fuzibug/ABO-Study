// ─────────────────────────────────────────
//  api.js  —  AI question generation
//  Enhanced with better prompting & user controls
// ─────────────────────────────────────────

/* ── Environment detection ── */

function isFileProtocol() {
  return location.protocol === 'file:';
}

/* ── CORS-aware fetch ─────────────────────────────────────────────────────
   When opening the file directly (file://) browsers block cross-origin
   requests. We route through corsproxy.io automatically in that case.
   When served over http(s) the request goes direct.
   ─────────────────────────────────────────────────────────────────────── */

function apiFetch(url, opts) {
  if (!isFileProtocol()) return fetch(url, opts);
  return fetchViaProxy(url, opts);
}

function fetchViaProxy(url, opts) {
  var proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
  return fetch(proxyUrl, opts).catch(function () {
    throw new Error('CORS proxy unreachable. Run a local server instead (see instructions below).');
  });
}

/* ── Prompt builders ── */

function buildSystemPrompt() {
  return [
    'You are an elite ABO (American Board of Opticianry) exam question writer with 20+ years of clinical opticianry experience.',
    'Your questions are used to prepare candidates for the actual ABO certification exam.',
    'Generate RIGOROUSLY ACCURATE, clinically realistic multiple-choice questions that mirror real ABO exam difficulty and style.',
    '',
    '═══════════════════════════════════════════════════════════════',
    'CRITICAL ACCURACY REQUIREMENTS (NON-NEGOTIABLE)',
    '═══════════════════════════════════════════════════════════════',
    '',
    'LENS MATERIALS (exact values):',
    '• CR-39: n=1.498 (NOT 1.49), Abbe=58, specific gravity=1.32',
    '• Polycarbonate: n=1.586, Abbe=30, SG=1.20, impact-resistant standard',
    '• Trivex: n=1.53, Abbe=43-45, SG=1.11 (LIGHTEST common material)',
    '• Crown glass: n=1.523, Abbe=59 (highest Abbe, discontinued for safety)',
    '• High-index plastic: 1.60 (Abbe~42), 1.67 (Abbe~32), 1.70, 1.74 (thinnest)',
    '',
    'ANSI Z80.1-2022 TOLERANCES (memorize these):',
    '• Power tolerance: ±0.12D for sphere/cylinder ≤6.50D; ±2% for >6.50D',
    '• Axis tolerance by cylinder power:',
    '  - Cyl >1.50D: ±2°',
    '  - Cyl 0.75D-1.50D: ±3°',
    '  - Cyl 0.50D: ±5°',
    '  - Cyl 0.25D: ±7°',
    '  - Cyl ≤0.12D: ±14°',
    '• Prism tolerance: 0.33Δ for <2.00D; 0.25Δ for ≥2.00D',
    '',
    'PRENTICE\'S RULE (TEST EVERY PRISM QUESTION AGAINST THESE RULES):',
    '• Formula: Prism (Δ) = Power (D) × Decentration (cm)',
    '',
    'PLUS LENSES (base follows decentration direction):',
    '• Temporal decentration → BI (base IN / toward nose)',
    '• Nasal decentration → BO (base OUT / toward temple)',
    '• Below OC → BU (base UP)',
    '• Above OC → BD (base DOWN)',
    '',
    'MINUS LENSES (base OPPOSITE decentration direction):',
    '• Temporal decentration → BO (base OUT)',
    '• Nasal decentration → BI (base IN)',
    '• Below OC → BD (base DOWN)',
    '• Above OC → BU (base UP)',
    '',
    'Mnemonic: "Plus follows decentration direction, Minus goes opposite"',
    'Example: +4.00D decentered 5mm temporally = 2Δ BI (NOT BO!)',
    'Example: -4.00D decentered 5mm temporally = 2Δ BO (NOT BI!)',
    '',
    '• Vertical prism: use DISTANCE PD for calculations',
    '• Horizontal prism: splits equally between both eyes',
    '',
    'TRANSPOSITION & CALCULATIONS:',
    '• Transpose: new sphere = old sphere + old cyl; new cyl = −old cyl; new axis = old axis ± 90°',
    '• Spherical equivalent = sphere + (cylinder ÷ 2)',
    '• Vertex distance: significant when Rx >±4.00D; standard = 12-14mm',
    '• Compensated power = F / (1 - dF) where d=vertex change in meters',
    '',
    'PROGRESSIVE LENSES (PALs):',
    '• Corridor length: short (11-14mm), standard (14-17mm), long (>17mm)',
    '• Fitting height: measure from bottom of lens to pupil center (typically 18-22mm)',
    '• Minimum fitting height = corridor length + near zone (usually needs 20mm+ for standard PALs)',
    '• Inset: amount near zone shifts nasally (typically 2-3mm per eye)',
    '• Add power: difference between distance and near power (common range +0.75 to +3.50)',
    '',
    'TORIC CONTACT LENS STABILIZATION:',
    '• Prism ballast: adds weight at bottom (1.0-1.5Δ typical)',
    '• Truncation: flat edge at bottom for orientation',
    '• Thin zones: top/bottom thinner than sides (accelerated stabilization)',
    '• Rotation: if lens rotates clockwise (right), ADD to axis; counterclockwise (left), SUBTRACT',
    '• LARS rule: Left Add, Right Subtract',
    '',
    'BLANK SIZE & MINIMUM BLANK:',
    '• Formula: Minimum Blank Diameter = ED + (2 × maximum decentration)',
    '• ED (Effective Diameter) = diagonal measurement of lens shape',
    '• Decentration = |PD/2 - DBL/2 - A/2| for each eye',
    '• Always round UP to nearest standard blank size',
    '',
    'PRISM RESOLUTION:',
    '• Oblique prism resolves into horizontal + vertical components',
    '• Horizontal component = Total Prism × cos(angle)',
    '• Vertical component = Total Prism × sin(angle)',
    '• Combined prism: Total = √(H² + V²)',
    '• Resultant direction: angle = arctan(V/H)',
    '',
    'REGULATORY STANDARDS:',
    '• FDA drop ball test: 5/8-inch steel ball from 50 inches (21 CFR 801.410)',
    '• ANSI Z87.1: safety eyewear (industrial/occupational)',
    '• ANSI Z80.1-2022: prescription ophthalmic lenses (tolerances, testing)',
    '• FTC Eyeglass Rule (16 CFR 315): must provide Rx to patient without extra charge',
    '• OSHA 29 CFR 1910.133: employer must ensure proper PPE',
    '• ASTM F803: sports protective eyewear requirements',
    '',
    'LENS DESIGNS:',
    '• FT-28 = flat-top 28mm segment width (standard bifocal)',
    '• FT-35 = flat-top 35mm segment width (wider field)',
    '• Executive/Franklin: full-width segment line',
    '• Ultex/D-segment: rounded bottom bifocal',
    '• PAL zones: distance (top), intermediate (corridor), near (bottom)',
    '• Seg height measurement: from lowest point of lens to seg line',
    '',
    'PEDIATRIC CONSIDERATIONS:',
    '• Frame sizing: use boxing measurements A, B, DBL appropriate for age',
    '• Children 3-5 years: A~38-42mm, DBL~14-16mm',
    '• Children 6-10 years: A~42-46mm, DBL~16-18mm',
    '• Teens 11-17 years: A~46-52mm, DBL~16-20mm',
    '• Impact resistance mandatory: polycarbonate or Trivex (21 CFR 801.410)',
    '• Strap retention for infants/toddlers',
    '• Shorter temple length (typically 120-130mm vs adult 135-150mm)',
    '',
    'ANATOMY:',
    '• Corneal layers (anterior→posterior): Epithelium, Bowman\'s, Stroma (90% thickness), Descemet\'s, Endothelium',
    '• Fovea centralis: 100% cones, NO rods, avascular, responsible for central/fine vision',
    '• Normal IOP: 10-21 mmHg; elevated IOP = glaucoma risk factor',
    '• Crystalline lens: biconvex, accommodates, zonules attach to ciliary body',
    '',
    '═══════════════════════════════════════════════════════════════',
    'QUESTION GENERATION RULES',
    '═══════════════════════════════════════════════════════════════',
    '',
    'MAXIMIZE VARIETY & REALISM:',
    '• Use DIVERSE numerical values — avoid clustering (not all ±2.00 or 90°)',
    '• Prentice: powers -12.00 to +12.00, decentrations 2-20mm, all prism directions',
    '• Prescriptions: use uncommon but valid combinations',
    '  - Axes across full range: 5°, 15°, 35°, 75°, 105°, 125°, 165° (not just 90°/180°)',
    '  - Sphere/cyl combos: +2.50-1.75×35, -4.25-0.50×165, +0.75-2.25×15',
    '• Frame measurements: realistic variance (A: 46-60mm, DBL: 14-22mm, temple: 135-150mm)',
    '• Patient ages: children (5-12), teens (13-17), adults (18-65), presbyopes (40+), elderly (65+)',
    '• Alternate formats: direct questions, clinical scenarios, troubleshooting, "best option" choices',
    '',
    'NEW QUESTION SUB-TYPES TO USE:',
    '• Multi-step scenarios: patient presents symptoms → determine cause → recommend solution',
    '• Troubleshooting chains: "A patient complains X. What would you check FIRST?"',
    '• Regulation citations: "According to ANSI Z80.1-2022, what is the tolerance for..."',
    '• Comparative analysis: "Which material is better for a [specific scenario]?"',
    '• Calculation verification: "A technician calculated X. Is this correct? If not, what\'s right?"',
    '• "What if" scenarios: "If you change X parameter, what happens to Y?"',
    '',
    'QUESTION STRUCTURE:',
    '• Exactly 4 options (A, B, C, D)',
    '• Exactly 1 correct answer',
    '• All distractors MUST be clinically plausible (not obviously wrong)',
    '• Vary correct answer position evenly — DO NOT favor option A or B',
    '• Each question tests ONE distinct concept/skill',
    '',
    'DIFFICULTY CALIBRATION:',
    '• Foundation: definitions, basic recall, recognition ("What is...", "Which material...")',
    '• Intermediate: applied knowledge, straightforward calculations, clinical scenarios',
    '• Advanced: multi-step problems, integration of concepts, nuanced judgment',
    '• Expert: edge cases, rare exceptions, complex troubleshooting, unusual combinations',
    '',
    'EXPLANATIONS:',
    '• Must cite the specific formula, standard, or rule being tested',
    '• Show calculation steps for math problems',
    '• Explain why other options are incorrect',
    '• Reference ABO Study Guide sections when applicable',
    '',
    'OUTPUT FORMAT (CRITICAL):',
    'Return ONLY raw JSON — absolutely NO markdown fences, NO ```json blocks, NO commentary.',
    'Valid structure:',
    '{',
    '  "questions": [',
    '    {',
    '      "domain": "domain_key",',
    '      "difficulty": "foundation|intermediate|advanced|expert",',
    '      "question": "Full question text with all details",',
    '      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],',
    '      "correct": 0,',
    '      "explanation": "Detailed explanation with formulas and reasoning",',
    '      "source": "ABO: Domain — Specific Topic or Standard"',
    '    }',
    '  ]',
    '}',
    '',
    'Ensure NO duplicate topics across all questions in the batch.',
  ].join('\n');
}

function buildUserPrompt() {
  var domMap = {
    all:               'all ABO domains with balanced distribution across geometric optics, ophthalmic optics, lens materials/designs, coatings, frames, measurements, dispensing, prescriptions, anatomy, pathology, contact lenses, regulations, safety, low vision, AND the new specialty domains below',
    geometric_optics:  'Geometric Optics: vergence calculations, Snell\'s Law, refraction, lens power relationships, Prentice\'s Rule, critical angle, optical center location',
    ophthalmic_optics: 'Ophthalmic Optics: effective power, Abbe value/chromatic aberration, vertex distance compensation, base curve selection, lensometer verification',
    lens_materials:    'Lens Materials: CR-39, polycarbonate, Trivex, high-index (1.60-1.74), crown glass properties, refractive index, Abbe value, specific gravity, impact resistance',
    lens_designs:      'Lens Designs: single vision, flat-top bifocals (FT-28, FT-35), trifocals, PALs/progressives, corridor length, blend zones, occupational designs',
    coatings:          'Lens Coatings: anti-reflective (AR), UV protection, photochromic activation, polarization, mirror/flash coatings, scratch resistance, hydrophobic',
    frame_selection:   'Frame Selection & Fitting: boxing system measurements, bridge fit, temple length/style, face shapes, frame materials (metal/plastic/titanium), adjustments',
    measurements:      'Optical Measurements: monocular/binocular PD, seg height, vertex distance, pantoscopic tilt, face form angle, fitting height for PALs, frame tracer usage',
    dispensing:        'Dispensing & Verification: lensometry, prescription verification, frame alignment, temple adjustment, nose pad fitting, troubleshooting complaints',
    prescriptions:     'Prescription Analysis: transposition (plus-to-minus, minus-to-plus), spherical equivalent, ANSI Z80.1 tolerances, valid Rx format, prism notation',
    anatomy:           'Ocular Anatomy: corneal layers, aqueous/vitreous humor, retinal structures, macula/fovea, optic nerve, crystalline lens, ciliary body, iris, sclera',
    pathology:         'Ocular Pathology: cataract types (nuclear/cortical/PSC), glaucoma (open/closed angle), AMD (wet/dry), myopia/hyperopia/astigmatism, keratoconus',
    contact_lenses:    'Contact Lenses: Dk/t (oxygen transmissibility), base curve/diameter, soft vs RGP, toric stabilization, silicone hydrogel, daily vs extended wear',
    regulations:       'Standards & Regulations: ANSI Z80.1-2022 tolerances, FDA drop ball test (21 CFR 801.410), FTC Eyeglass Rule, state dispensing laws',
    safety_eyewear:    'Safety Eyewear: ANSI Z87.1 marking/testing, ASTM F803 sports protection, OSHA 29 CFR 1910.133, side shields, impact ratings, plano safety',
    low_vision:        'Low Vision: magnification calculations, working distance relationship, optical/electronic devices, eccentric viewing, contrast enhancement',
    
    // ═══ NEW SPECIALTY DOMAINS ═══
    multifocal_design:    'Multifocal Lens Design: PAL corridor calculations, fitting height requirements, minimum fitting height formulas, inset values, add power ranges, blend zones, corridor length trade-offs (short/standard/long), near zone width',
    advanced_dispensing:  'Advanced Dispensing & Troubleshooting: complex patient complaints (blur zones in PALs, swim effect, peripheral distortion), remake policies, warranty claims, frame repair techniques, adjustment for specific complaints, material failure diagnosis',
    pediatric_optics:     'Pediatric Optics: children\'s frame sizing by age group, impact resistance requirements for kids (21 CFR 801.410), strap retention systems, developmental visual considerations, school-age accommodation, appropriate lens materials for active children',
    sports_eyewear:       'Sports & Occupational Eyewear: wrap frame base curves, impact protection levels (ASTM F803), lens tint selection by activity (baseball, shooting, cycling, skiing), prescription swim goggles, industrial safety requirements, side shield mandates',
    toric_stabilization:  'Toric Contact Lens Stabilization: prism ballast mechanics (typical 1.0-1.5Δ), truncation orientation, thin zone design, rotation compensation (LARS rule), axis verification on eye, over-refraction techniques, residual astigmatism troubleshooting',
    vertex_effectivity:   'Vertex Distance & Effectivity: compensated power calculations, effectivity formula F/(1-dF), when compensation is required (>±4.00D), frame fit impact on effective power, moving Rx from trial frame to spectacles, high myope considerations',
    blank_size:           'Blank Size & Decentration: minimum blank diameter formula (ED + 2×decentration), effective diameter calculation, maximum decentration limits, standard blank sizes (60-80mm), when to order oversized blanks, lens cutout for wrap frames',
    prism_resolution:     'Prism Resolution & Combination: resolving oblique prism into H/V components, combining horizontal + vertical prism, resultant prism calculation, oblique prism prescription notation, splitting prism between eyes, resultant direction angles',
    regulatory_citations: 'Regulatory Citations & Standards: specific ANSI Z80.1-2022 section references, FDA 21 CFR part numbers, FTC Eyeglass Rule 16 CFR 315 details, state dispensing law differences, OSHA occupational safety requirements, documentation requirements',
  };
  
  var diffMap = {
    mixed:        'a realistic ABO exam difficulty mix (25% foundation, 50% intermediate, 20% advanced, 5% expert)',
    foundation:   'ONLY foundation level — pure recall, definitions, basic recognition, no calculations',
    intermediate: 'ONLY intermediate level — applied clinical knowledge, straightforward single-step calculations, standard scenarios',
    advanced:     'ONLY advanced level — complex multi-step problems, integration of multiple concepts, nuanced clinical judgment',
    expert:       'ONLY expert level — rare edge cases, exception conditions, barely-covered material, highly specialized scenarios',
    calculations: 'ONLY calculation-intensive questions — MUST include Prentice\'s Rule, vergence, transposition, spherical equivalent, magnification, blank size, effectivity, prism resolution, or PAL fitting calculations. Show your calculation work.',
    
    // ═══ NEW SPECIALTY DIFFICULTY MODES ═══
    weak_areas:      'Focus on COMMON WEAK AREAS where students typically struggle: vertex distance compensation, oblique prism resolution, PAL fitting height calculations, toric rotation (LARS), ANSI tolerance edge cases, minus lens prism direction confusion',
    calculation_drills: 'RAPID-FIRE CALCULATION DRILLS: quick computational problems with minimal scenario text. Focus purely on math execution: Prentice with diverse values, spherical equivalent, transposition, blank size, prism resolution, effectivity. Vary numbers extensively.',
    edge_cases:      'EDGE CASES & EXCEPTIONS: unusual but valid scenarios that catch advanced students — extreme prescriptions (>±10.00D), unusual axis values, combined prism, pediatric sizing edge cases, safety standard exceptions, material property trade-offs in rare conditions',
    patient_scenarios: 'COMPLEX PATIENT SCENARIOS: multi-paragraph case studies requiring integration of 2-4 knowledge domains. Include patient age, occupation, lifestyle, visual complaints, current Rx, and require clinical decision-making across multiple factors.',
  };
  
  // Generate unique session seed for variety
  var sessionSeed = Date.now() % 1000;
  
  // Expanded rotation through different emphasis areas (18 options instead of 12)
  var emphasisOptions = [
    'Emphasize real-world clinical troubleshooting with specific patient complaints and symptoms.',
    'Focus on precise numerical calculations using uncommon parameter combinations and irregular values.',
    'Include regulation/standard questions citing specific ANSI Z80.1-2022 or FDA 21 CFR sections with exact section numbers.',
    'Test deep conceptual understanding with "why" and "how" questions requiring multi-step reasoning.',
    'Use detailed patient case studies requiring integration of 3-4 knowledge domains simultaneously.',
    'Challenge with edge cases, exceptions, and scenarios that catch advanced students off guard.',
    'Frame questions as dispensing dilemmas requiring practical judgment calls under time pressure.',
    'Use comparative questions: "Which is better for..." with nuanced trade-offs where 2+ options are partially valid.',
    'Test troubleshooting skills: "A patient complains of X symptoms. What is the MOST LIKELY cause?"',
    'Focus on measurement verification and lensometry interpretation with specific readings.',
    'Include frame selection for highly specific face shapes, lifestyles, or occupational requirements.',
    'Test material property trade-offs in real prescription scenarios with conflicting priorities.',
    'Focus on PAL fitting: corridor length selection, fitting height calculations, minimum FH requirements.',
    'Test pediatric considerations: age-appropriate frame sizing, impact resistance mandates, developmental needs.',
    'Sports/occupational: specific lens tint recommendations, wrap base curves, impact standards by activity.',
    'Advanced prism: oblique prism resolution, combining H+V components, splitting prism between eyes.',
    'Vertex effectivity in high prescriptions: when to compensate, calculation examples, clinical significance.',
    'Regulatory deep-dive: cite exact ANSI sections, FDA CFR parts, state law variations, documentation requirements.',
  ];
  var randomEmphasis = emphasisOptions[Math.floor(Math.random() * emphasisOptions.length)];
  
  // Expanded question format variety (10 options instead of 6)
  var formatOptions = [
    'Use primarily scenario-based questions with patient details (age, occupation, symptoms, lifestyle).',
    'Mix direct factual questions (30%) with applied clinical decision-making (70%).',
    'Include "best option" questions where 2-3 answers are partially correct but one is MOST appropriate.',
    'Use troubleshooting format: "Given this problem, what would you check FIRST?" with priority ordering.',
    'Frame questions as conversations: "A patient asks... how would you explain this concept?"',
    'Include calculation questions with realistic prescription parameters and complete work shown.',
    'Use "what if" conditional questions: "If parameter X changes, what happens to result Y?"',
    'Create verification questions: "A technician calculated X. Is this correct? If not, identify the error."',
    'Multi-step reasoning chains: Present scenario → ask intermediate diagnostic question → require final solution.',
    'Comparative analysis: "Compare options A vs B for this specific patient. Which is superior and why?"',
  ];
  var randomFormat = formatOptions[Math.floor(Math.random() * formatOptions.length)];
  
  // Get AI temperature setting (default 0.8)
  var temp = parseFloat(localStorage.getItem('abo_aiTemp')) || 0.8;
  
  // Enhanced temperature-based variety instructions (5 tiers)
  var varietyNote = temp > 1.0 ? 'MAXIMIZE creativity: use unusual scenarios, rare combinations, unexpected question angles, and unconventional phrasing.' :
                    temp > 0.85 ? 'Use high creativity in phrasing, scenarios, and parameter selection. Avoid predictable patterns at all costs.' :
                    temp > 0.7 ? 'Balance clinical accuracy with creative variety in question structure and numerical values.' :
                    temp < 0.5 ? 'Focus on precise, textbook-style questions with standard parameters and conventional phrasing.' :
                    'Use moderate variation while maintaining strict ABO exam realism and clinical accuracy.';
  
  // Numerical diversity guidance
  var numericGuidance = [
    'Sphere powers: Use values like +1.25, -3.75, +5.50, -7.25, +0.50, +8.75, -11.00',
    'Cylinder powers: Vary between -0.50, -1.25, -2.75, -3.50, -4.75, not just -0.75/-1.50',
    'Axes: Strongly prefer oblique axes: 15°, 35°, 55°, 125°, 165°, 8°, 172° over 90°/180°',
    'Prism: Use diverse directions and magnitudes: 2.5Δ BU, 4Δ BO, 1.25Δ BD, 3.75Δ BI',
    'Measurements: PD from 54-68mm, seg heights 16-24mm, decentration 3-15mm',
    'Add powers: Vary from +0.75 to +3.50 (not always +2.00 or +2.50)',
    'Vertex distances: 10mm, 12mm, 14mm, 16mm (not always standard 13mm)',
    'Frame dimensions: A from 46-58mm, DBL from 14-22mm, B from 38-52mm',
  ].join('\n• ');
  
  return [
    'Generate exactly ' + selCount + ' unique ABO certification exam questions.',
    'Domain focus: ' + (domMap[selDomain] || domMap.all) + '.',
    'Difficulty level: ' + (diffMap[selDiff] || diffMap.mixed) + '.',
    '',
    'Session variation seed: ' + sessionSeed + ' (use this to vary your question generation approach)',
    'Special emphasis for this batch: ' + randomEmphasis,
    'Question format style: ' + randomFormat,
    varietyNote,
    '',
    'NUMERICAL DIVERSITY GUIDANCE:',
    '• ' + numericGuidance,
    '',
    'AVOID THESE PATTERNS (they make questions feel scripted):',
    '• DO NOT use sphere powers like ±2.00, ±4.00, ±6.00 repeatedly',
    '• DO NOT default to 90° or 180° axis — use oblique axes 70%+ of the time',
    '• DO NOT make every bifocal an FT-28 — include FT-35, D-segment, Ultex, Executive',
    '• DO NOT always use standard PD (63mm) — vary between 54-68mm realistically',
    '• DO NOT phrase all questions identically ("What is...", "Which of the following...")',
    '• DO NOT make the correct answer always option B or C — truly randomize across A/B/C/D',
    '• DO NOT use only healthy adults — include children, elderly, high Rx, occupational needs',
    '• DO NOT ignore the new specialty domains — integrate them when generating "all domains" questions',
    '',
    'CRITICAL REQUIREMENTS:',
    '• Each question must be DISTINCT — no overlapping topics within the same batch',
    '• Use diverse numerical values (avoid common numbers like ±2.00, 90°, 63mm PD)',
    '• Vary question formats (direct, scenario, troubleshooting, "best option", "what if")',
    '• Distribute correct answers evenly across A/B/C/D positions (aim for 25% each)',
    '• All calculations must use ABO-accurate formulas and values (see system prompt)',
    '• Explanations must show formulas, cite standards, and explain why wrong answers are wrong',
    '• For multi-step scenarios, include enough detail for complete clinical reasoning',
    '• When using specialty domains, demonstrate deep knowledge of that specific area',
    '',
    'Return ONLY raw JSON with NO markdown, NO code fences, NO commentary.',
  ].join('\n');
}

/* ── Response parser ── */

function parseAIResponse(raw) {
  // Strip DeepSeek R1 chain-of-thought blocks
  raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  // Strip markdown fences if model ignored the instruction
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

  console.log('🔍 Response preview:', raw.slice(0, 300));
  console.log('📏 Response length:', raw.length, 'bytes');
  
  var start = raw.indexOf('{');
  var end   = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    console.error('❌ No JSON object found in response');
    throw new Error('Model returned non-JSON response. Try a different model (Llama 3.3 70B recommended).');
  }

  var jsonStr = raw.slice(start, end + 1);
  var parsed;
  
  try {
    parsed = JSON.parse(jsonStr);
  } catch (parseErr) {
    console.error('❌ JSON parse failed:', parseErr.message);
    console.error('Attempted to parse:', jsonStr.slice(0, 500));
    throw new Error('Model returned invalid JSON. Try Llama 3.3 70B or increase max_tokens.');
  }

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error('Response missing "questions" array. Model may need clearer instructions.');
  }
  
  if (parsed.questions.length === 0) {
    throw new Error('Response contained zero questions. Try increasing max_tokens setting.');
  }

  // Validate each question structure
  parsed.questions.forEach(function (q, i) {
    var num = i + 1;
    if (!q.question || typeof q.question !== 'string')
      throw new Error('Question ' + num + ' missing or invalid "question" field');
    if (!q.domain || typeof q.domain !== 'string')
      throw new Error('Question ' + num + ' missing "domain" field');
    if (!Array.isArray(q.options) || q.options.length !== 4)
      throw new Error('Question ' + num + ' must have exactly 4 options (has ' + (q.options ? q.options.length : 0) + ')');
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3)
      throw new Error('Question ' + num + ' has invalid "correct" index: ' + q.correct);
    if (!q.explanation || typeof q.explanation !== 'string')
      throw new Error('Question ' + num + ' missing "explanation" field');
      
    // Optional: normalize difficulty if missing
    if (!q.difficulty) q.difficulty = 'intermediate';
  });

  console.log('✅ Parsed ' + parsed.questions.length + ' valid questions');
  return parsed.questions;
}

/* ── Main AI load function ── */

function loadAI() {
  var key = provider === 'groq' ? groqKey : orKey;

  if (!key) {
    showAIError('no-key');
    return;
  }

  var url     = provider === 'groq' ? GROQ_URL : OR_URL;
  var headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key };
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://abo-exam.app';
    headers['X-Title']      = 'ABO Mock Exam';
  }

  // Get user-configured AI settings (with fallbacks)
  var aiTemp = parseFloat(localStorage.getItem('abo_aiTemp')) || 0.8;
  var aiMaxTokens = parseInt(localStorage.getItem('abo_aiMaxTokens')) || (selModel.includes('llama') ? 8192 : 4096);
  
  var body = {
    model:      selModel,
    messages:   [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user',   content: buildUserPrompt()   },
    ],
    temperature: aiTemp,
    max_tokens: aiMaxTokens,
    stream:      false,
  };

  var modelShort = selModel.split('/').pop().replace(/:free$/, '');
  var startTime = Date.now();
  
  setCard(
    '<div class="loading"><div class="spinner"></div>' +
    '<div class="load-txt">Generating ' + selCount + ' questions with ' + escHtml(modelShort) + '…' +
    '<br><br><span style="font-size:10px;opacity:.6">Temperature: ' + aiTemp.toFixed(2) + ' | Max tokens: ' + aiMaxTokens + '</span>' +
    '<br><span style="font-size:10px;opacity:.5">This may take 5–30 seconds</span>' +
    (isFileProtocol()
      ? '<br><span style="font-size:10px;opacity:.5;color:var(--wrn)">⚡ Routing via CORS proxy (file:// mode)</span>'
      : '') +
    '</div></div>'
  );

  apiFetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body) })
    .then(function (resp) {
      if (!resp.ok) {
        return resp.text().then(function (rb) {
          var msg = 'API error ' + resp.status;
          try { 
            var j = JSON.parse(rb); 
            msg = j.error && j.error.message ? j.error.message : msg; 
          } catch (e) {}
          throw new Error(msg);
        });
      }
      return resp.json();
    })
    .then(function (data) {
      var elapsedMs = Date.now() - startTime;
      console.log('⏱️ Generation time: ' + (elapsedMs / 1000).toFixed(2) + 's');
      
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

      var choice = data.choices && data.choices[0];
      if (!choice) throw new Error('Model returned empty response (no choices array).');

      var raw = choice.message && choice.message.content;
      if (!raw) throw new Error('Model returned empty content field.');

      if (choice.finish_reason === 'length') {
        console.warn('⚠️ Response truncated (finish_reason: length). Increase max_tokens in settings.');
        toast('Response may be incomplete — increase max tokens', 'warning');
      }

      var qs = parseAIResponse(raw);
      questions = shuffleMode ? qs.map(shuffleQ) : qs;
      
      toast('Generated ' + qs.length + ' questions in ' + (elapsedMs / 1000).toFixed(1) + 's', 'success');
      renderQ();
    })
    .catch(function (err) {
      console.error('❌ AI generation failed:', err);
      var msg = (err.message || 'Unknown error').toLowerCase();
      if      (msg.indexOf('401') !== -1 || msg.indexOf('invalid api key') !== -1 || msg.indexOf('unauthorized') !== -1) showAIError('bad-key');
      else if (msg.indexOf('403') !== -1)                                                                                 showAIError('forbidden');
      else if (msg.indexOf('429') !== -1)                                                                                 showAIError('rate-limit');
      else if (msg.indexOf('cors') !== -1 || msg.indexOf('failed to fetch') !== -1 ||
               msg.indexOf('networkerror') !== -1 || msg.indexOf('load failed') !== -1)  showAIError('cors');
      else if (msg.indexOf('json') !== -1 || msg.indexOf('parse') !== -1)                showAIError('parse:' + err.message);
      else                                                                                  showAIError('generic:' + err.message);
    });
}

/* ── Error display ── */

function goOffline() {
  offline = true;
  el('mode-chk').checked = false;
  el('lbl-off').classList.add('active');
  el('lbl-ai').classList.remove('active');
  el('mode-label').textContent = 'Offline Bank';
  el('mode-sub').textContent   = '90+ verified questions — works without internet';
  el('ai-panel').classList.remove('show');
  score = 0; wrongs = 0; results = []; qi = 0; totalTime = 0; answered = false;
  el('live-c').textContent = '0';
  el('live-w').textContent = '0';
  el('live-p').textContent = '0/0';
  el('next-row').style.display  = 'none';
  el('timer-row').style.display = 'none';
  el('live-wrap').style.visibility = 'visible';
  questions = buildPool();
  if (shuffleMode) questions = questions.map(shuffleQ);
  renderQ();
}

function showAIError(code) {
  var provName = provider === 'groq' ? 'Groq' : 'OpenRouter';
  var keyUrl   = provider === 'groq' ? 'https://console.groq.com/keys' : 'https://openrouter.ai/keys';
  var keyPfx   = provider === 'groq' ? 'gsk_' : 'sk-or-';

  var title, body;

  if (code === 'no-key') {
    title = '🔑 No API Key Saved';
    body  = '<p>Go back to <strong>Setup</strong>, paste your ' + provName + ' API key (starts with <code>' + keyPfx +
            '</code>), and click <strong>Save</strong>.</p>' +
            '<p style="margin-top:12px">Get a free key: <a href="' + keyUrl + '" target="_blank" style="color:var(--acc)">' + keyUrl + '</a></p>' +
            '<p style="margin-top:8px;font-size:11px;color:var(--mut)">💡 Tip: Groq offers generous free tier with no credit card required.</p>';
  } else if (code === 'bad-key') {
    title = '🚫 Invalid API Key (401)';
    body  = '<p>Your ' + provName + ' key was rejected by the API.</p>' +
            '<p style="margin-top:8px"><strong>Check:</strong></p>' +
            '<ul style="margin:8px 0 0 20px;font-size:12px;line-height:1.8">' +
            '<li>Key starts with <code>' + keyPfx + '</code></li>' +
            '<li>Entire key was copied (no spaces/truncation)</li>' +
            '<li>Key hasn\'t been revoked or expired</li>' +
            '</ul>' +
            '<p style="margin-top:12px">Generate a new key: <a href="' + keyUrl + '" target="_blank" style="color:var(--acc)">' + keyUrl + '</a></p>';
  } else if (code === 'forbidden') {
    title = '⛔ Access Denied (403)';
    body  = '<p>The selected model requires credits or is restricted to paid tiers.</p>' +
            '<p style="margin-top:8px"><strong>Solutions:</strong></p>' +
            '<ul style="margin:8px 0 0 20px;font-size:12px;line-height:1.8">' +
            '<li>Switch to a <span style="background:rgba(104,211,145,.12);color:#68d391;padding:2px 6px;border-radius:3px;font-family:monospace;font-size:10px">FREE</span> model</li>' +
            '<li>Add credits at <a href="' + keyUrl + '" target="_blank" style="color:var(--acc)">' + provName + '</a></li>' +
            '</ul>';
  } else if (code === 'rate-limit') {
    title = '⏱️ Rate Limit Hit (429)';
    body  = '<p>Too many requests sent too quickly to ' + provName + '.</p>' +
            '<p style="margin-top:8px"><strong>Quick fixes:</strong></p>' +
            '<ul style="margin:8px 0 0 20px;font-size:12px;line-height:1.8">' +
            '<li>Wait 30-60 seconds and try again</li>' +
            '<li>Switch to a different model</li>' +
            '<li>Switch to a different provider</li>' +
            '<li>Reduce question count (try 5-10 instead of 20+)</li>' +
            '</ul>';
  } else if (code === 'cors') {
    title = '🌐 Connection Blocked (CORS)';
    body  = '<p>Your browser blocked the API request. This happens when opening <code>index.html</code> directly from your filesystem (<code>file://</code>).</p>' +
            '<p style="margin-top:12px"><strong>Fix by running a local server:</strong></p>' +
            '<div class="fix-box">' +
              '<div class="fix-title">⚡ Option 1: Python (Built-in, Easiest)</div>' +
              '<p>Open Terminal/Command Prompt in the app folder:</p>' +
              '<div class="fix-cmd">python3 -m http.server 8080</div>' +
              '<button class="fix-copy" onclick="copyCmd(\'python3 -m http.server 8080\')">Copy Command</button>' +
              '<p style="margin-top:8px">Then open: <a href="http://localhost:8080" target="_blank" style="color:var(--acc)">http://localhost:8080</a></p>' +
            '</div>' +
            '<div class="fix-box" style="margin-top:10px">' +
              '<div class="fix-title">⚡ Option 2: Node.js</div>' +
              '<div class="fix-cmd">npx serve .</div>' +
              '<button class="fix-copy" onclick="copyCmd(\'npx serve .\')">Copy Command</button>' +
            '</div>' +
            '<div class="fix-box" style="margin-top:10px">' +
              '<div class="fix-title">⚡ Option 3: VS Code Live Server</div>' +
              '<p>Install <strong>Live Server</strong> extension → right-click <code>index.html</code> → <strong>Open with Live Server</strong></p>' +
            '</div>';
  } else {
    var raw = code.replace(/^(parse:|generic:)/, '');
    title = '❌ Generation Failed';
    body  = '<p style="word-break:break-word;font-family:monospace;font-size:11px;background:var(--s2);padding:10px;border-radius:6px;border:1px solid var(--bdr)">' + escHtml(raw) + '</p>' +
            '<p style="margin-top:12px"><strong>Common causes:</strong></p>' +
            '<ul style="margin:8px 0 0 20px;font-size:12px;line-height:1.8">' +
            '<li>Model returned invalid JSON format</li>' +
            '<li>Response was cut off (increase <strong>max tokens</strong> in AI Settings)</li>' +
            '<li>Model doesn\'t follow instructions well</li>' +
            '</ul>' +
            '<p style="margin-top:12px;padding:10px;background:rgba(99,179,237,.04);border:1px solid rgba(99,179,237,.2);border-radius:6px;font-size:12px"><strong>💡 Recommended:</strong> Use <strong>Llama 3.3 70B Versatile</strong> on Groq — it\'s the most reliable model for this app.</p>';
  }

  setCard(
    '<div style="padding:8px 0">' +
    '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px">' +
      '<span style="font-size:2rem;line-height:1">⚠️</span>' +
      '<div>' +
        '<div style="font-family:\'Playfair Display\',serif;font-size:1.2rem;font-weight:700;color:var(--tx);margin-bottom:4px">' + title + '</div>' +
        '<div style="font-size:13px;color:var(--tx2);line-height:1.7">' + body + '</div>' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:20px">' +
      '<button class="btn-sec" id="btn-ai-back" style="flex:1;min-width:140px">← Back to Setup</button>' +
      '<button class="btn-go" id="btn-ai-fallback" style="flex:2;min-width:180px;margin-top:0">📚 Use Offline Bank Instead</button>' +
    '</div>' +
    '</div>'
  );

  el('btn-ai-back').addEventListener('click', gotoSetup);
  el('btn-ai-fallback').addEventListener('click', goOffline);
}

/* ── Utility: Copy command to clipboard ── */
function copyCmd(cmd) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cmd).then(function() {
      toast('Command copied!', 'success');
    }).catch(function() {
      toast('Failed to copy', 'error');
    });
  } else {
    // Fallback for older browsers
    var tmp = document.createElement('textarea');
    tmp.value = cmd;
    tmp.style.position = 'fixed';
    tmp.style.opacity = '0';
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    toast('Command copied!', 'success');
  }
}
