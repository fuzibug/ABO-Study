// ─────────────────────────────────────────
//  progress.js  —  Session storage and progress page
// ─────────────────────────────────────────

var STORAGE_KEY = 'abo5';

/* ── Read / write ── */

function getStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"sessions":[],"ds":{}}');
  } catch (e) {
    return { sessions: [], ds: {} };
  }
}

function saveSession(pct, correct, total, domBreak) {
  var s    = getStore();
  var mode = offline
    ? 'offline'
    : provider + '/' + selModel.split('/').pop().replace(/:free$/, '').slice(0, 20);

  s.sessions.unshift({
    pct:     pct,
    correct: correct,
    total:   total,
    domain:  selDomain,
    diff:    selDiff,
    mode:    mode,
    date:    new Date().toLocaleDateString(),
  });

  // Keep at most 30 recent sessions
  if (s.sessions.length > 30) s.sessions = s.sessions.slice(0, 30);

  // Accumulate domain stats
  Object.keys(domBreak).forEach(function (d) {
    var v = domBreak[d];
    if (!s.ds[d]) s.ds[d] = { c: 0, t: 0 };
    s.ds[d].c += v.c;
    s.ds[d].t += v.t;
  });

  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
}

/* ── Render the progress page ── */

function renderProgress() {
  var store = getStore();
  var ses   = store.sessions;
  var ds    = store.ds;

  // Overall stats
  var tc     = ses.reduce(function (a, x) { return a + x.correct; }, 0);
  var tt     = ses.reduce(function (a, x) { return a + x.total;   }, 0);
  var op     = tt ? Math.round(tc / tt * 100) : 0;
  var best   = ses.length ? Math.max.apply(null, ses.map(function (x) { return x.pct; })) : 0;
  var rec    = ses.slice(0, 5);
  var ravg   = rec.length ? Math.round(rec.reduce(function (a, x) { return a + x.pct; }, 0) / rec.length) : 0;
  var passes = ses.filter(function (x) { return x.pct >= 75; }).length;

  // Stats grid
  el('stat-grid').innerHTML = !ses.length
    ? '<div class="nodata" style="grid-column:1/-1">No sessions yet — start your first exam!</div>'
    : [
        ['var(--acc)',                               ses.length, 'Sessions'     ],
        [op   >= 75 ? 'var(--ok)' : 'var(--bad)',  op   + '%', 'Overall Acc.' ],
        ['var(--wrn)',                              best  + '%', 'Best Score'  ],
        [ravg >= 75 ? 'var(--ok)' : 'var(--bad)',  ravg  + '%', 'Recent Avg'  ],
        ['var(--ok)',                               passes,      'Passes (75%+)'],
        ['var(--acc)',                              tt,          'Total Qs'    ],
      ].map(function (b) {
        return '<div class="stat-box">' +
          '<div class="stat-val" style="color:' + b[0] + '">' + b[1] + '</div>' +
          '<div class="stat-lbl">' + b[2] + '</div>' +
        '</div>';
      }).join('');

  // Domain breakdown (sorted worst → best so weakest areas appear at the top)
  var dk = Object.keys(ds);
  el('prog-doms').innerHTML = !dk.length
    ? '<div class="nodata">Complete exams to see domain performance</div>'
    : dk
        .sort(function (a, b) { return (ds[a].c / ds[a].t) - (ds[b].c / ds[b].t); })
        .map(function (d) {
          var v = ds[d], p = Math.round(v.c / v.t * 100), meta = DM[d] || { l: d, i: '' };
          var c = p >= 75 ? 'var(--ok)' : p >= 50 ? 'var(--wrn)' : 'var(--bad)';
          return '<div class="dom-row">' +
            '<div class="dom-icon">' + meta.i + '</div>' +
            '<div class="dom-info">' +
              '<div class="dom-name">' + meta.l + '</div>' +
              '<div class="dom-bar"><div class="dom-fill" style="width:' + p + '%;background:' + c + '"></div></div>' +
              '<div class="dom-stat">' + v.c + '/' + v.t + ' correct (all time)</div>' +
            '</div>' +
            '<div class="dom-pct" style="color:' + c + '">' + p + '%</div>' +
          '</div>';
        }).join('');

  // Recent sessions list
  el('ses-list').innerHTML = !ses.length
    ? '<div class="nodata">No sessions yet</div>'
    : ses.slice(0, 15).map(function (s) {
        var dl = s.domain === 'all'
          ? 'All Domains'
          : (DM[s.domain] ? DM[s.domain].l : s.domain);
        return '<div class="ses-item">' +
          '<div class="ses-pct ' + (s.pct >= 75 ? 'p' : 'f') + '">' + s.pct + '%</div>' +
          '<div class="ses-det">' +
            s.correct + '/' + s.total + ' &mdash; ' +
            dl + ' &mdash; ' +
            (DIFF_LABELS[s.diff] || s.diff) + ' &mdash; ' +
            escHtml(s.mode || 'offline') +
          '</div>' +
          '<div class="ses-date">' + s.date + '</div>' +
        '</div>';
      }).join('');
}
