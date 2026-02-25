// ─────────────────────────────────────────
//  api.js  —  AI question generation
//  Covers: file:// detection, CORS proxy fallback,
//           prompt building, response parsing,
//           provider/error handling
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
    'You are an expert ABO (American Board of Opticianry) exam question writer.',
    'Write rigorously accurate multiple-choice questions for opticianry certification students.',
    '',
    'CRITICAL ACCURACY — always use these exact values:',
    '- CR-39: n=1.498, Abbe=58, SG=1.32',
    '- Polycarbonate: n=1.586, Abbe=28-30, SG=1.20',
    '- Trivex: n=1.53, Abbe=43-45, SG=1.11 (lightest)',
    '- Crown glass: n=1.523, Abbe=59',
    '- High-index options: 1.60, 1.67, 1.70, 1.74',
    '- ANSI Z80.1-2022 power tolerance: ±0.12D for |power| ≤6.50D; ±2% for higher',
    '- Axis tolerances by cylinder: >1.50D=±2°; 0.75-1.50D=±3°; 0.50D=±5°; 0.25D=±7°; ≤0.12D=±14°',
    '- Prentice Rule: P(Δ)=F(D)×d(cm). Plus lens: below OC=BU, above=BD, nasal=BI, temporal=BO. Minus=reverse.',
    '- Transposition: new sphere=old sphere+old cyl; new cyl=−old cyl; new axis=old axis±90',
    '- Spherical equivalent=sphere+(cylinder/2)',
    '- Vertex distance standard: 12-14mm; significant when Rx>±4.00D',
    '- FDA drop ball: 5/8-inch steel ball, 50 inches (21 CFR 801.410)',
    '- FT-28 is standard bifocal segment width',
    '- PAL: distance zone top, near zone bottom, corridor middle',
    '- Normal IOP: 10-21 mmHg; Fovea: cones only, avascular',
    '- Corneal layers anterior→posterior: Epithelium, Bowman\'s, Stroma (90%), Descemet\'s, Endothelium',
    '',
    'MAXIMIZE VARIATION:',
    '- Use DIVERSE numerical values — avoid clustering around common values like ±2.00 or 90°',
    '- Prentice\'s Rule: powers from -10.00 to +10.00, decentrations 2-15mm, all directions',
    '- Transposition: use uncommon but valid axes (15°, 35°, 75°, 105°, 165°, not just 90°/180°)',
    '- Prescriptions: combine unusual sphere/cylinder pairs, use full axis range 0-180°',
    '- Low vision: vary working distances (25cm, 33cm, 40cm, 50cm, 67cm)',
    '- Frame measurements: use realistic but varied A measurements (46-60mm), DBL (14-22mm)',
    '- Alternate question formats: direct questions, clinical scenarios, problem-solving, "what if" cases',
    '- Mix calculation-heavy with conceptual/recognition questions in each batch',
    '',
    'RULES:',
    '- Exactly 4 options per question, exactly 1 correct answer',
    '- All wrong options must be clinically plausible (not obviously wrong)',
    '- Vary correct answer position (A/B/C/D) — do not cluster on one letter',
    '- Explanations must reference the specific formula, rule, or standard being tested',
    '- No two questions may test the exact same fact',
    '- source field: format "ABO: Domain — Topic" or cite specific regulation',
    '',
    'Return ONLY raw JSON — NO markdown, NO code fences, NO commentary:',
    '{"questions":[{"domain":"domain_key","difficulty":"foundation|intermediate|advanced|expert","question":"...","options":["A","B","C","D"],"correct":0,"explanation":"detailed explanation","source":"ABO: Domain — Topic"}]}',
  ].join('\n');
}

function buildUserPrompt() {
  var domMap = {
    all:               'all 15 ABO domains, well-distributed',
    geometric_optics:  'Geometric Optics (vergence, Snell\'s Law, lens power, Prentice\'s Rule, critical angle)',
    ophthalmic_optics: 'Ophthalmic Optics (lens power, Abbe value, vertex distance, lensometer)',
    lens_materials:    'Lens Materials (CR-39, polycarbonate, Trivex, high-index, crown glass)',
    lens_designs:      'Lens Designs (single vision, bifocal, trifocal, PAL/progressive)',
    coatings:          'Coatings (AR, UV, photochromic, polarized, mirror)',
    frame_selection:   'Frame Selection (boxing system, materials, fit, face shapes)',
    measurements:      'Measurements (PD, seg height, vertex distance, pantoscopic tilt)',
    dispensing:        'Dispensing (verification, adjustment, fitting, troubleshooting)',
    prescriptions:     'Prescriptions (transposition, spherical equivalent, ANSI Z80.1 tolerances)',
    anatomy:           'Ocular Anatomy (corneal layers, retina, macula, fovea, aqueous humor, crystalline lens)',
    pathology:         'Ocular Pathology (cataract types, glaucoma, AMD, keratoconus, refractive errors)',
    contact_lenses:    'Contact Lenses (Dk/t, base curve, soft vs RGP, toric, silicone hydrogel)',
    regulations:       'Regulations (ANSI Z80.1, FDA 21 CFR 801.410, FTC Eyeglass Rule)',
    safety_eyewear:    'Safety Eyewear (ANSI Z87.1, ASTM F803, OSHA 29 CFR 1910.133)',
    low_vision:        'Low Vision (magnification calculations, optical devices, eccentric viewing)',
  };
  var diffMap = {
    mixed:        'a realistic ABO exam mix (30% foundation, 45% intermediate, 25% advanced)',
    foundation:   'ONLY foundation level — definitions, recall, basic identification',
    intermediate: 'ONLY intermediate level — applied knowledge, clinical scenarios, straightforward calculations',
    advanced:     'ONLY advanced level — complex multi-step problems, nuanced clinical judgment',
    expert:       'ONLY expert level — edge cases, rarely-tested nuance, exception conditions',
    calculations: 'ONLY calculation-heavy questions — must include Prentice\'s Rule, vergence, transposition, spherical equivalent, magnification, or blank size math',
  };
  
  // Add randomization elements to increase variety each generation
  var emphasisOptions = [
    'Focus on unusual numerical combinations and edge cases.',
    'Emphasize clinical troubleshooting scenarios.',
    'Include questions testing conceptual understanding beyond memorization.',
    'Mix direct calculation problems with applied clinical scenarios.',
    'Use diverse patient demographics and real-world dispensing situations.',
  ];
  var randomEmphasis = emphasisOptions[Math.floor(Math.random() * emphasisOptions.length)];
  
  return [
    'Generate exactly ' + selCount + ' ABO exam questions about ' + (domMap[selDomain] || domMap.all) + ',',
    'at ' + (diffMap[selDiff] || diffMap.mixed) + ' difficulty.',
    randomEmphasis,
    'Ensure this batch is DISTINCT from typical question patterns — vary numerical values widely,',
    'use uncommon but valid parameter combinations, and alternate question presentation styles.',
    'All numerical values must be clinically accurate per the ABO Study Guide.',
    'No duplicate topics. Return raw JSON only.',
  ].join(' ');
}

/* ── Response parser ── */

function parseAIResponse(raw) {
  // Strip DeepSeek R1 chain-of-thought blocks
  raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  // Strip markdown fences if model ignored the instruction
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

  console.log('RAW BEFORE PARSE:', JSON.stringify(raw.slice(0, 500)));
 console.log('RAW TAIL:', JSON.stringify(raw.slice(-200)));
 console.log('RAW LENGTH:', raw.length);
 var start = raw.indexOf('{');
  var end   = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in model response');
  }

  var parsed = JSON.parse(raw.slice(start, end + 1));

  if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('Response contained no questions array');
  }

  // Validate each question has minimum required fields
  parsed.questions.forEach(function (q, i) {
    if (!q.question)                                    throw new Error('Question ' + (i + 1) + ' missing "question" field');
    if (!Array.isArray(q.options) || q.options.length < 2) throw new Error('Question ' + (i + 1) + ' has invalid options');
    if (typeof q.correct !== 'number')                  throw new Error('Question ' + (i + 1) + ' missing "correct" index');
  });

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

  var body = {
    model:      selModel,
    messages:   [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user',   content: buildUserPrompt()   },
    ],
    temperature: 0.78,
    max_tokens: selModel.includes('llama') ? 8192 : 4096,
    stream:      false,
  };

  var modelShort = selModel.split('/').pop().replace(/:free$/, '');
  setCard(
    '<div class="loading"><div class="spinner"></div>' +
    '<div class="load-txt">Generating ' + selCount + ' questions with ' + escHtml(modelShort) + '&hellip;' +
    '<br><br><span style="font-size:10px;opacity:.6">This may take 5&#8211;20 seconds</span>' +
    (isFileProtocol()
      ? '<br><span style="font-size:10px;opacity:.5;color:var(--wrn)">&#9889; Routing via CORS proxy (file:// mode)</span>'
      : '') +
    '</div></div>'
  );

  apiFetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body) })
    .then(function (resp) {
      if (!resp.ok) {
        return resp.text().then(function (rb) {
          var msg = 'API error ' + resp.status;
          try { var j = JSON.parse(rb); msg = j.error && j.error.message ? j.error.message : msg; } catch (e) {}
          throw new Error(msg);
        });
      }
      return resp.json();
    })
    .then(function (data) {
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

      var choice = data.choices && data.choices[0];
      if (!choice) throw new Error('No response from model — empty choices array returned.');

      var raw = choice.message && choice.message.content;
      if (!raw) throw new Error('Model returned empty content.');

      if (choice.finish_reason === 'length') {
        console.warn('Response truncated (finish_reason: length). Attempting partial parse.');
      }

      var qs = parseAIResponse(raw);
      questions = shuffleMode ? qs.map(shuffleQ) : qs;
      renderQ();
    })
    .catch(function (err) {
      var msg = (err.message || 'Unknown error').toLowerCase();
      if      (msg.indexOf('401') !== -1 || msg.indexOf('invalid api key') !== -1 || msg.indexOf('unauthorized') !== -1) showAIError('bad-key');
      else if (msg.indexOf('403') !== -1)                                                                                 showAIError('forbidden');
      else if (msg.indexOf('429') !== -1)                                                                                 showAIError('rate-limit');
      else if (msg.indexOf('cors') !== -1 || msg.indexOf('failed to fetch') !== -1 ||
               msg.indexOf('networkerror') !== -1 || msg.indexOf('load failed') !== -1)  showAIError('cors');
      else if (msg.indexOf('no json') !== -1 || msg.indexOf('no questions') !== -1 ||
               msg.indexOf('unexpected token') !== -1 || msg.indexOf('missing') !== -1)   showAIError('parse:' + err.message);
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
    title = 'No API Key Saved';
    body  = '<p>Go back to Setup, paste your ' + provName + ' key (starts with <code>' + keyPfx +
            '</code>), and click <strong>Save</strong> before starting.</p>' +
            '<p style="margin-top:8px">Get a free key: <a href="' + keyUrl + '" target="_blank">' + keyUrl + '</a></p>';
  } else if (code === 'bad-key') {
    title = 'Invalid API Key (401)';
    body  = '<p>Your ' + provName + ' key was rejected. Double-check it starts with <code>' + keyPfx + '</code> and was copied fully.</p>' +
            '<p style="margin-top:8px">Generate a fresh key: <a href="' + keyUrl + '" target="_blank">' + keyUrl + '</a></p>';
  } else if (code === 'forbidden') {
    title = 'Access Denied (403)';
    body  = '<p>The selected model requires credits or is restricted. Switch to a <strong>Free</strong>-badged model, or add credits at <a href="' + keyUrl + '" target="_blank">' + keyUrl + '</a>.</p>';
  } else if (code === 'rate-limit') {
    title = 'Rate Limit Hit (429)';
    body  = '<p>Too many requests too quickly. Wait 10&#8211;30 seconds and try again, or switch to a different model.</p>';
  } else if (code === 'cors') {
    title = 'Connection Blocked';
    body  = '<p>Your browser blocked the API call. This happens when opening the file directly (<code>file://</code>). ' +
            'The CORS proxy also failed. Fix it with one of these options:</p>' +
            '<div class="fix-box">' +
              '<div class="fix-title">&#9889; Option 1 — Python (easiest, built-in)</div>' +
              '<p>Open Terminal in the folder containing this file:</p>' +
              '<div class="fix-cmd">python3 -m http.server 8080</div>' +
              '<button class="fix-copy" onclick="copyCmd(\'python3 -m http.server 8080\')">Copy</button>' +
              '<p style="margin-top:8px">Then open <a href="http://localhost:8080" target="_blank">http://localhost:8080</a></p>' +
            '</div>' +
            '<div class="fix-box">' +
              '<div class="fix-title">&#9889; Option 2 — Node.js</div>' +
              '<div class="fix-cmd">npx serve .</div>' +
              '<button class="fix-copy" onclick="copyCmd(\'npx serve .\')">Copy</button>' +
            '</div>' +
            '<div class="fix-box">' +
              '<div class="fix-title">&#9889; Option 3 — VS Code Live Server</div>' +
              '<p>Install the <strong>Live Server</strong> extension → right-click the file → <strong>Open with Live Server</strong></p>' +
            '</div>';
  } else {
    var raw = code.replace(/^(parse:|generic:)/, '');
    title = 'Something Went Wrong';
    body  = '<p style="word-break:break-all">' + escHtml(raw) + '</p>' +
            '<p style="margin-top:8px;font-size:11px;color:var(--mut)">Tip: Llama 3.3 70B Versatile on Groq is the most reliable model for this app.</p>';
  }

  setCard(
    '<div style="padding:4px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' +
      '<span style="font-size:1.6rem">&#9888;&#65039;</span>' +
      '<div style="font-family:\'Playfair Display\',serif;font-size:1.1rem;color:var(--tx)">' + escHtml(title) + '</div>' +
    '</div>' +
    '<div style="font-size:13px;color:var(--tx2);line-height:1.75;margin-bottom:16px">' + body + '</div>' +
    '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
      '<button class="btn-sec" id="btn-ai-back">&#8592; Back to Setup</button>' +
      '<button class="btn-go" id="btn-ai-fallback" style="width:auto;padding:11px 22px;margin-top:0;flex:1;min-width:160px">&#128266; Use Offline Bank</button>' +
    '</div>' +
    '</div>'
  );

  el('btn-ai-back').addEventListener('click', gotoSetup);
  el('btn-ai-fallback').addEventListener('click', goOffline);
}
