// ─────────────────────────────────────────
//  quiz.js  —  Quiz engine
//  Covers: pool building, question rendering,
//           timer, answer selection, results page
// ─────────────────────────────────────────

/* ── Utility ── */

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// Shuffle answer options, keeping track of which is correct
function shuffleQ(q) {
  var pairs = q.options.map(function (o, i) { return { o: o, ok: i === q.correct }; });
  pairs = shuffle(pairs);
  var nq = JSON.parse(JSON.stringify(q));
  nq.options = pairs.map(function (p) { return p.o; });
  nq.correct = pairs.findIndex(function (p) { return p.ok; });
  return nq;
}

function setCard(html) {
  el('qcard').innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Offline question pool ── */

function buildPool() {
  var pool = BANK.slice();

  // Filter by domain
  if (selDomain !== 'all') {
    pool = pool.filter(function (q) { return q.domain === selDomain; });
  }

  // Filter by difficulty
  if (selDiff === 'calculations') {
    var calcDomains = ['geometric_optics', 'ophthalmic_optics', 'prescriptions', 'measurements', 'low_vision'];
    pool = pool.filter(function (q) { return calcDomains.indexOf(q.domain) !== -1; });
  } else if (selDiff !== 'mixed') {
    pool = pool.filter(function (q) { return q.difficulty === selDiff; });
  }

  // Fallback to full bank if filters returned nothing
  if (!pool.length) pool = BANK.slice();

  return shuffle(pool).slice(0, selCount);
}

/* ── Start / reset quiz ── */

function startQuiz(retryPool) {
  // Reset session state
  questions = []; qi = 0; score = 0; wrongs = 0;
  results = []; totalTime = 0; answered = false;
  clearTimer();

  showPage('pg-quiz');

  // Reset quiz UI elements
  el('live-c').textContent = '0';
  el('live-w').textContent = '0';
  el('live-p').textContent = '0/0';
  el('live-wrap').style.visibility = examMode === 'practice' ? 'visible' : 'hidden';
  el('next-row').style.display  = 'none';
  el('timer-row').style.display = 'none';
  el('prog-fill').style.width   = '0%';

  setCard(
    '<div class="loading"><div class="spinner"></div>' +
    '<div class="load-txt">Preparing questions&hellip;</div></div>'
  );

  if (retryPool && retryPool.length) {
    questions = shuffleMode ? retryPool.map(shuffleQ) : retryPool;
    renderQ();
    return;
  }

  if (offline) {
    questions = buildPool();
    if (shuffleMode) questions = questions.map(shuffleQ);
    renderQ();
  } else {
    loadAI();   // defined in api.js
  }
}

/* ── Render current question ── */

function renderQ() {
  clearTimer();
  answered = false;

  if (qi >= questions.length) {
    showResults();
    return;
  }

  var q     = questions[qi];
  var total = questions.length;

  el('prog-fill').style.width = (qi / total * 100) + '%';

  var meta = DM[q.domain] || { l: q.domain || 'Unknown', i: '&#128208;' };

  // Build tag badges
  var srcTag  = offline
    ? '<span class="qtag qt-off">Offline</span>'
    : '<span class="qtag qt-ai">' + escHtml(selModel.split('/').pop().replace(/:free$/, '').slice(0, 24)) + '</span>';
  var domTag  = showDomainTag
    ? '<span class="qtag qt-d">' + meta.l + '</span>' : '';
  var diffTag = showDiffTag && q.difficulty
    ? '<span class="qtag qt-' + (DIFF_CSS_CLASS[q.difficulty] || 'f') + '">' +
      (DIFF_LABELS[q.difficulty] || q.difficulty) + '</span>' : '';

  // Build answer option buttons
  var optsH = q.options.map(function (o, i) {
    return '<button class="opt" data-idx="' + i + '">' +
      '<span class="opt-l">' + LTR[i] + '</span>' +
      '<span style="flex:1">' + escHtml(String(o)) + '</span>' +
      '<span class="opt-k">' + (i + 1) + '</span>' +
      '</button>';
  }).join('');

  // Build explanation box (hidden until answered)
  var expHtml = q.explanation
    ? '<div class="exp" id="expbox">' +
        '<div class="exp-lbl">Explanation</div>' +
        '<div class="exp-body">' + escHtml(q.explanation) + '</div>' +
        (q.source ? '<div class="exp-src">' + escHtml(q.source) + '</div>' : '') +
      '</div>'
    : '';

  setCard(
    '<div class="qmeta">' +
      '<div class="qnum">Question ' + (qi + 1) + ' / ' + total + '</div>' +
      '<div class="qtags">' + domTag + diffTag + srcTag + '</div>' +
    '</div>' +
    '<div class="qtext">' + escHtml(q.question) + '</div>' +
    '<div class="opts" id="opts-c">' + optsH + '</div>' +
    expHtml
  );

  el('opts-c').addEventListener('click', function (e) {
    var b = e.target.closest('.opt');
    if (b) selectAnswer(parseInt(b.getAttribute('data-idx'), 10));
  });

  el('next-row').style.display = 'none';
  qStart = Date.now();

  if (timedMode) {
    timerLeft = timerDuration;
    el('timer-row').style.display = 'flex';
    updateTimer();
    startTimer();
  }
}

/* ── Timer ── */

function startTimer() {
  timerIv = setInterval(function () {
    timerLeft--;
    updateTimer();
    if (timerLeft <= 0) { clearTimer(); onTimeout(); }
  }, 1000);
}

function updateTimer() {
  var pct = Math.max(0, timerLeft / timerDuration * 100);
  var red = timerLeft <= Math.min(10, timerDuration * 0.2);
  el('tnum').textContent    = timerLeft;
  el('tnum').className      = 'tnum' + (red ? ' red' : '');
  el('tbar-fill').style.width = pct + '%';
  el('tbar-fill').className = 'tbar-fill' + (red ? ' red' : '');
}

function clearTimer() {
  clearInterval(timerIv);
  timerIv = null;
}

function onTimeout() {
  if (answered) return;
  answered = true;
  toast("Time's up!");
  el('opts-c').querySelectorAll('.opt').forEach(function (o) {
    o.disabled = true;
    if (parseInt(o.getAttribute('data-idx'), 10) === questions[qi].correct) {
      o.classList.add('missed');
    }
  });
  record(-1, false);
  if (explainMode === 'immediate') { var ex = el('expbox'); if (ex) ex.classList.add('show'); }
  el('next-row').style.display = 'flex';
}

/* ── Answer selection ── */

function selectAnswer(idx) {
  if (answered) return;
  answered = true;
  clearTimer();

  var q    = questions[qi];
  var isOk = idx === q.correct;

  el('opts-c').querySelectorAll('.opt').forEach(function (o) {
    o.disabled = true;
    var oi = parseInt(o.getAttribute('data-idx'), 10);
    if (oi === q.correct)  o.classList.add('ok');
    else if (oi === idx)   o.classList.add('bad');
  });

  toast(isOk ? 'Correct! \u2713' : 'Incorrect \u2717', isOk);
  record(idx, isOk);

  if (explainMode === 'immediate') { var ex = el('expbox'); if (ex) ex.classList.add('show'); }
  el('next-row').style.display = 'flex';
}

function record(ans, isOk) {
  var t = (Date.now() - qStart) / 1000;
  totalTime += t;
  if (isOk) score++; else wrongs++;
  results.push({ q: JSON.parse(JSON.stringify(questions[qi])), ans: ans, ok: isOk, time: t });
  el('live-c').textContent = score;
  el('live-w').textContent = wrongs;
  el('live-p').textContent = (score + wrongs) + '/' + questions.length;
}

function nextQ() { qi++; renderQ(); }

/* ── Results page ── */

function showResults() {
  clearTimer();
  showPage('pg-results');

  // Reveal score in exam mode
  if (examMode === 'exam') el('live-wrap').style.visibility = 'visible';

  var total  = results.length;
  var pct    = total ? Math.round(score / total * 100) : 0;
  var avgT   = total ? (totalTime / total).toFixed(1) + 's' : '-';

  // Score ring
  var col = pct >= 75 ? 'var(--ok)' : pct >= 55 ? 'var(--wrn)' : 'var(--bad)';
  el('result-ring').style.setProperty('--pct', pct + '%'); el('result-ring').style.background = 'conic-gradient(' + col + ' ' + (pct * 3.6) + 'deg,var(--s2) 0)';
  el('ring-num').textContent = pct + '%';
  el('ring-num').style.color = col;
  el('rs-c').textContent     = score;
  el('rs-w').textContent     = total - score;
  el('rs-t').textContent     = total;
  el('rs-time').textContent  = avgT;

  // Pass/fail message
  var msgs = [
    [90, 'Exceptional &#127881;', 'Outstanding! You are well-prepared for the ABO certification exam.'],
    [75, 'Strong Pass &#10003;',  'You would pass the ABO (75% required). Keep reviewing weaker domains.'],
    [55, 'Almost There &#128293;','ABO passing score is 75%. Keep drilling your weak areas!'],
    [0,  'Needs Work &#128218;',  'Focus on the core ABO domains. The offline bank is great for daily practice.'],
  ];
  var m = msgs.find(function (x) { return pct >= x[0]; });
  el('res-title').innerHTML  = m[1];
  el('res-sub').textContent  = m[2];

  // Domain breakdown
  var ds = {};
  results.forEach(function (r) {
    var d = r.q.domain || 'unknown';
    if (!ds[d]) ds[d] = { c: 0, t: 0 };
    ds[d].t++;
    if (r.ok) ds[d].c++;
  });
  el('res-doms').innerHTML = Object.keys(ds).map(function (d) {
    var v = ds[d], p = Math.round(v.c / v.t * 100), meta = DM[d] || { l: d, i: '' };
    var c = p >= 75 ? 'var(--ok)' : p >= 50 ? 'var(--wrn)' : 'var(--bad)';
    return '<div class="dom-row">' +
      '<div class="dom-icon">' + meta.i + '</div>' +
      '<div class="dom-info">' +
        '<div class="dom-name">' + meta.l + '</div>' +
        '<div class="dom-bar"><div class="dom-fill" style="width:' + p + '%;background:' + c + '"></div></div>' +
        '<div class="dom-stat">' + v.c + '/' + v.t + ' correct</div>' +
      '</div>' +
      '<div class="dom-pct" style="color:' + c + '">' + p + '%</div>' +
    '</div>';
  }).join('');

  // Full question review list
  el('rev-list').innerHTML = results.map(function (r, idx) {
    var cls  = r.ok ? 'ok' : 'bad';
    var icon = r.ok ? '&#10003;' : '&#10007;';
    var yourAns = '';
    if      (r.ans === -1) yourAns = '<div class="rev-ans w">Timed out</div>';
    else if (!r.ok)        yourAns = '<div class="rev-ans w">Your answer: ' + escHtml(r.q.options[r.ans] || '?') + '</div>';

    var expHtml = explainMode !== 'never'
      ? '<div class="rev-exp">' + escHtml(r.q.explanation || '') + '</div>' +
        (r.q.source ? '<div class="rev-src">' + escHtml(r.q.source) + '</div>' : '')
      : '';

    return '<div class="rev-item ' + cls + '">' +
      '<div class="rev-hdr">' +
        '<span class="rev-icon">' + icon + '</span>' +
        '<span class="rev-q">Q' + (idx + 1) + '. ' + escHtml(r.q.question) + '</span>' +
        '<span class="rev-chev">&#9660;</span>' +
      '</div>' +
      '<div class="rev-body">' +
        yourAns +
        '<div class="rev-ans c">&#10003; Correct: ' + escHtml(r.q.options[r.q.correct] || '?') + '</div>' +
        expHtml +
        '<div style="font-family:\'DM Mono\',monospace;font-size:10px;color:var(--mut);margin-top:6px">' +
          r.time.toFixed(1) + 's' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // Wire accordion toggle on each review item
  el('rev-list').querySelectorAll('.rev-item').forEach(function (item) {
    item.querySelector('.rev-hdr').addEventListener('click', function () {
      item.classList.toggle('open');
    });
  });

  var hasWrong = results.some(function (r) { return !r.ok; });
  el('btn-retry').style.display = hasWrong ? 'block' : 'none';

  saveSession(pct, score, total, ds);
}
