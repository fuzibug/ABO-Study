// ─────────────────────────────────────────
//  ui.js  —  DOM helpers, navigation, theming,
//             settings wiring, toast notifications
// ─────────────────────────────────────────

function el(id) { return document.getElementById(id); }

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toast(msg, type) {
  var t = el('toast');
  t.textContent = msg;
  
  // Support string types: 'success', 'error', 'warning', 'info'
  var borderColor;
  if (type === 'success' || type === true) borderColor = 'rgba(104,211,145,.35)';
  else if (type === 'error' || type === false) borderColor = 'rgba(252,129,129,.25)';
  else if (type === 'warning') borderColor = 'rgba(246,173,85,.3)';
  else borderColor = 'var(--bdr)';
  
  t.style.borderColor = borderColor;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(function () { t.classList.remove('show'); }, 2400);
}

function showPage(pid) {
  ALL_PAGES.forEach(function (p) {
    var e = el(p); if (e) e.classList.remove('show');
  });
  var e = el(pid); if (e) e.classList.add('show');
  Object.keys(TAB_MAP).forEach(function (pg) {
    TAB_MAP[pg].forEach(function (tid) {
      var te = el(tid);
      if (te) te.classList.toggle('on', pg === pid);
    });
  });
}

function gotoSetup() { showPage('pg-setup'); }
function gotoProg()  { showPage('pg-prog'); renderProgress(); }
function gotoAppear(){ showPage('pg-appear'); }

function isFileProtocol() { return location.protocol === 'file:'; }

/* ── Theme ── */
function applyTheme(id, skipSave) {
  document.body.className = id || '';
  if (localStorage.getItem('dyslexic') === '1') document.body.classList.add('dyslexic');
  try { if (!skipSave) localStorage.setItem('abo_theme', id); } catch(e) {}
  document.querySelectorAll('.theme-swatch').forEach(function (s, i) {
    var isOn = THEMES[i] && THEMES[i].id === id;
    s.classList.toggle('on', isOn);
    s.style.border = '3px solid ' + (isOn ? 'var(--tx)' : 'transparent');
  });
}

function buildThemeSwatches() {
  var sc = el('theme-swatches'); if (!sc) return;
  var saved = localStorage.getItem('abo_theme') || '';
  THEMES.forEach(function (t) {
    var item = document.createElement('div');
    item.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;';
    var swatch = document.createElement('div');
    swatch.className = 'theme-swatch' + (t.id === saved ? ' on' : '');
    swatch.style.cssText =
      'width:42px;height:42px;border-radius:50%;cursor:pointer;flex-shrink:0;transition:.2s;' +
      'border:3px solid ' + (t.id === saved ? 'var(--tx)' : 'transparent') + ';' +
      'background:linear-gradient(135deg,' + t.c[0] + ' 40%,' + t.c[1] + ' 100%);';
    var lbl = document.createElement('div');
    lbl.style.cssText = "font-size:10px;color:var(--tx2);font-family:'DM Mono',monospace;text-align:center;";
    lbl.textContent = t.label;
    item.appendChild(swatch);
    item.appendChild(lbl);
    item.addEventListener('click', function () { applyTheme(t.id); });
    sc.appendChild(item);
  });
  applyTheme(saved, true);
}

/* ── Segmented controls ── */
function wireSeg(id, cb) {
  var container = el(id); if (!container) return;
  container.addEventListener('click', function (e) {
    var btn = e.target.closest('.sgbtn'); if (!btn) return;
    container.querySelectorAll('.sgbtn').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    cb(btn.getAttribute('data-v'));
  });
}

/* ── Toggle settings ── */
function wireTog(chkId, stateId, cb) {
  var chk = el(chkId); if (!chk) return;
  chk.addEventListener('change', function () {
    var on = this.checked;
    var s = el(stateId);
    if (s) { s.textContent = on ? 'On' : 'Off'; s.classList.toggle('on', on); }
    cb(on);
  });
}

/* ── API key status ── */
function setStatus(sid, msg, cls) {
  var s = el(sid);
  if (s) { s.innerHTML = msg; s.className = 'api-status ' + (cls || ''); }
}

window.copyCmd = function (txt) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt)
      .then(function () { toast('Copied!', 'success'); })
      .catch(function () { toast('Copy: ' + txt); });
  } else { toast('Copy: ' + txt); }
};

/* ── Settings persistence ── */
function saveSettings() {
  try {
    localStorage.setItem('abo_cfg', JSON.stringify({
      domain: selDomain, diff: selDiff, count: selCount,
      timer: timerDuration, timed: timedMode, shuffle: shuffleMode,
      dtag: showDomainTag, dftag: showDiffTag,
      explain: explainMode, examMode: examMode,
      model: selModel, offline: offline
    }));
  } catch(e) {}
}

function loadSettings() {
  try {
    var c = JSON.parse(localStorage.getItem('abo_cfg') || '{}');
    if (c.domain) { selDomain = c.domain; var db = document.querySelector('[data-d="'+c.domain+'"]'); if(db){ document.querySelectorAll('.dbtn').forEach(function(b){b.classList.remove('on');}); db.classList.add('on'); } }
    if (c.diff)   { selDiff = c.diff;     var dfb = document.querySelector('[data-df="'+c.diff+'"]'); if(dfb){ document.querySelectorAll('.dfbtn').forEach(function(b){b.classList.remove('on');}); dfb.classList.add('on'); } }
    if (c.count)  { selCount = c.count; el('rng-count').value = c.count; el('rv-count').textContent = c.count; }
    if (c.timer)  { timerDuration = c.timer; el('rng-timer').value = c.timer; el('rv-timer').textContent = c.timer+'s'; }
    if (c.timed)  { timedMode = true; el('chk-timer').checked = true; var ts = el('timer-state'); if(ts){ts.textContent='On';ts.classList.add('on');} }
    if (c.shuffle===false) { shuffleMode = false; el('chk-shuffle').checked = false; var ss = el('shuffle-state'); if(ss){ss.textContent='Off';ss.classList.remove('on');} }
    if (c.dtag===false)  { showDomainTag = false; el('chk-dtag').checked = false; }
    if (c.dftag===false) { showDiffTag = false; el('chk-dftag').checked = false; }
    if (c.explain)  { explainMode = c.explain; var eb = el('seg-explain') ? el('seg-explain').querySelector('[data-v="'+c.explain+'"]') : null; if(eb){ el('seg-explain').querySelectorAll('.sgbtn').forEach(function(b){b.classList.remove('on');}); eb.classList.add('on'); } }
    if (c.examMode) { examMode = c.examMode; var xb = el('seg-exammode') ? el('seg-exammode').querySelector('[data-v="'+c.examMode+'"]') : null; if(xb){ el('seg-exammode').querySelectorAll('.sgbtn').forEach(function(b){b.classList.remove('on');}); xb.classList.add('on'); } }
    if (c.model)  { selModel = c.model; var mb = document.querySelector('[data-mid="'+c.model+'"]'); if(mb){ document.querySelectorAll('.mc').forEach(function(m){m.classList.remove('on');}); mb.classList.add('on'); } }
    if (c.offline===false) { offline = false; el('mode-chk').checked = true; el('lbl-off').classList.remove('active'); el('lbl-ai').classList.add('active'); el('ai-panel').classList.add('show'); }
  } catch(e) {}
}

/* ── Load AI Settings ── */
function loadAISettings() {
  // Load temperature setting (default 0.8)
  var tempSlider = el('rng-ai-temp');
  var tempValue = el('rv-ai-temp');
  if (tempSlider && tempValue) {
    var savedTemp = parseFloat(localStorage.getItem('abo_aiTemp')) || 0.8;
    tempSlider.value = savedTemp;
    tempValue.textContent = savedTemp.toFixed(1);
  }
  
  // Load max tokens setting (default 8192)
  var tokensSlider = el('rng-ai-tokens');
  var tokensValue = el('rv-ai-tokens');
  if (tokensSlider && tokensValue) {
    var savedTokens = parseInt(localStorage.getItem('abo_aiMaxTokens')) || 8192;
    tokensSlider.value = savedTokens;
    tokensValue.textContent = savedTokens;
  }
}

/* ── Init ── */
function initUI() {
  buildThemeSwatches();
  loadSettings();
  loadAISettings();

  // Load saved keys
  try {
    groqKey = localStorage.getItem('abo_gk') || '';
    if (groqKey) { el('key-groq').value = groqKey; setStatus('status-groq', '&#10003; Key loaded', 'ok'); }
  } catch(e) {}

  // Save Groq key
  el('save-groq').addEventListener('click', function () {
    var k = el('key-groq').value.trim();
    if (!k) { setStatus('status-groq', 'Paste your Groq key first', 'err'); return; }
    groqKey = k;
    try { localStorage.setItem('abo_gk', k); } catch(e) {}
    setStatus('status-groq', '&#10003; Saved!', 'ok');
    toast('Groq key saved', 'success');
  });
  el('key-groq').addEventListener('keydown', function (e) { if (e.key === 'Enter') el('save-groq').click(); });

  // Mode toggle (offline ↔ AI)
  el('mode-chk').addEventListener('change', function () {
    offline = !this.checked;
    saveSettings();
    el('lbl-off').classList.toggle('active', offline);
    el('lbl-ai').classList.toggle('active', !offline);
    el('mode-label').textContent = offline ? 'Offline Bank' : 'AI Generated';
    el('mode-sub').textContent = offline
      ? '90+ verified questions — works without internet'
      : 'Fresh unique questions from your chosen AI model';
    el('ai-panel').classList.toggle('show', !offline);
    if (!offline) { var fw = el('file-warn'); if (fw) fw.classList.toggle('show', isFileProtocol()); }
  });

  // Provider switch (Groq only)
  el('prov-groq').addEventListener('click', function () {
    provider = 'groq';
    el('prov-groq').classList.add('on');
    el('ms-groq').classList.add('show');
    var on = el('ml-groq').querySelector('.mc.on');
    selModel = on ? on.getAttribute('data-mid') : 'llama-3.3-70b-versatile';
    setStatus('status-groq', groqKey ? '&#10003; Key loaded' : '', 'ok');
  });

  // Model selection
  ['ml-groq'].forEach(function (listId) {
    el(listId).addEventListener('click', function (e) {
      var mc = e.target.closest('.mc'); if (!mc) return;
      el(listId).querySelectorAll('.mc').forEach(function (c) { c.classList.remove('on'); });
      mc.classList.add('on');
      selModel = mc.getAttribute('data-mid');
      saveSettings();
      toast('Model: ' + mc.querySelector('.mc-name').textContent.trim());
    });
  });

  // Domain picker
  el('domain-grid').addEventListener('click', function (e) {
    var btn = e.target.closest('.dbtn'); if (!btn) return;
    document.querySelectorAll('#domain-grid .dbtn').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    selDomain = btn.getAttribute('data-d');
    saveSettings();
  });

  // Difficulty picker
  el('diff-grid').addEventListener('click', function (e) {
    var btn = e.target.closest('.dfbtn'); if (!btn) return;
    document.querySelectorAll('#diff-grid .dfbtn').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    selDiff = btn.getAttribute('data-df');
    saveSettings();
  });

  // Segmented controls
  wireSeg('seg-explain', function (v) { explainMode = v; saveSettings(); });
  wireSeg('seg-exammode', function (v) {
    examMode = v;
    saveSettings();
    var d = el('exammode-desc');
    if (d) d.textContent = v === 'practice' ? 'Live score shown' : 'Score hidden until end';
  });

  // Range sliders - Exam Settings
  el('rng-count').addEventListener('input', function () {
    selCount = parseInt(this.value, 10);
    el('rv-count').textContent = this.value;
    saveSettings();
  });
  el('rng-timer').addEventListener('input', function () {
    timerDuration = parseInt(this.value, 10);
    el('rv-timer').textContent = this.value + 's';
    saveSettings();
  });
  
  // AI Settings - Temperature slider
  var tempSlider = el('rng-ai-temp');
  var tempValue = el('rv-ai-temp');
  if (tempSlider && tempValue) {
    tempSlider.addEventListener('input', function () {
      var temp = parseFloat(this.value);
      tempValue.textContent = temp.toFixed(1);
      localStorage.setItem('abo_aiTemp', temp);
      
      // Give contextual feedback
      var feedback = temp < 0.5 ? 'Very consistent' :
                     temp < 0.7 ? 'Balanced' :
                     temp < 0.9 ? 'Creative' : 'Maximum variety';
      toast('Temperature: ' + temp.toFixed(1) + ' (' + feedback + ')', 'info');
    });
  }
  
  // AI Settings - Max tokens slider
  var tokensSlider = el('rng-ai-tokens');
  var tokensValue = el('rv-ai-tokens');
  if (tokensSlider && tokensValue) {
    tokensSlider.addEventListener('input', function () {
      var tokens = parseInt(this.value, 10);
      tokensValue.textContent = tokens;
      localStorage.setItem('abo_aiMaxTokens', tokens);
      
      // Give contextual feedback
      var feedback = tokens < 4096 ? 'Short responses' :
                     tokens < 8192 ? 'Standard' : 'Extended responses';
      toast('Max tokens: ' + tokens + ' (' + feedback + ')', 'info');
    });
  }

  // Toggle settings
  wireTog('chk-timer',  'timer-state',   function (v) { timedMode = v;      saveSettings(); });
  wireTog('chk-shuffle','shuffle-state', function (v) { shuffleMode = v;    saveSettings(); });
  wireTog('chk-dtag',   'dtag-state',    function (v) { showDomainTag = v;  saveSettings(); });
  wireTog('chk-dftag',  'dftag-state',   function (v) { showDiffTag = v;    saveSettings(); });

  // Dyslexic font toggle
  var dyslexChk = el('chk-dyslexic');
  if (dyslexChk) {
    if (localStorage.getItem('dyslexic') === '1') { document.body.classList.add('dyslexic'); dyslexChk.checked = true; }
    dyslexChk.addEventListener('change', function () {
      document.body.classList.toggle('dyslexic', this.checked);
      localStorage.setItem('dyslexic', this.checked ? '1' : '0');
    });
  }

  // Tab navigation
  ['t-setup','t-setup2','t-setup3'].forEach(function (id) { var e = el(id); if (e) e.addEventListener('click', gotoSetup); });
  ['t-prog', 't-prog2', 't-prog3' ].forEach(function (id) { var e = el(id); if (e) e.addEventListener('click', gotoProg);  });
  ['t-appear','t-appear2','t-appear3'].forEach(function (id) { var e = el(id); if (e) e.addEventListener('click', gotoAppear); });

  // Main action buttons
  el('btn-start').addEventListener('click', function () { startQuiz(null); });
  el('btn-next').addEventListener('click', nextQ);
  el('btn-new').addEventListener('click', gotoSetup);
  el('btn-quit').addEventListener('click', function () {
    if (questions.length === 0 || confirm('Quit this exam? Progress will be lost.')) {
      clearTimer();
      gotoSetup();
    }
  });
  el('btn-retry').addEventListener('click', function () {
    var retryList = results
      .filter(function (r) { return !r.ok; })
      .map(function (r) { return JSON.parse(JSON.stringify(r.q)); });
    startQuiz(retryList);
  });
  el('btn-clear').addEventListener('click', function () {
    if (!confirm('Reset ALL saved progress and session history?\nThis cannot be undone.')) return;
    try { localStorage.removeItem('abo5'); } catch(e) {}
    renderProgress();
    toast('Progress reset', 'success');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    if (!el('pg-quiz').classList.contains('show')) return;
    if (el('next-row').style.display !== 'none') {
      if (e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); nextQ(); }
      return;
    }
    var map = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    var k = map[e.key.toLowerCase()];
    if (k !== undefined) selectAnswer(k);
  });
}
