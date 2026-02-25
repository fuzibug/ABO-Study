// ═══════════════════════════════════════════════════════════════
// FORMULAS.JS - Formula Reference Sheet
// Quick-access popup with all key ABO formulas
// ═══════════════════════════════════════════════════════════════

var FORMULAS = [
  // Geometric Optics
  {
    category: 'Geometric Optics',
    name: 'Vergence Formula',
    formula: 'V = n / d',
    variables: 'V = vergence (D), n = refractive index, d = distance (m)',
    example: 'Object at 40cm in air: V = 1.00 / 0.40 = +2.50D',
    when: 'Calculating vergence at any distance'
  },
  {
    category: 'Geometric Optics',
    name: 'Lens Power Formula',
    formula: 'P = 1 / f',
    variables: 'P = power (D), f = focal length (m)',
    example: '+2.00D lens has focal length: f = 1 / 2.00 = 0.50m (50cm)',
    when: 'Converting between power and focal length'
  },
  {
    category: 'Geometric Optics',
    name: 'Vergence Relationship',
    formula: 'L\' = L + F',
    variables: 'L\' = image vergence, L = object vergence, F = lens power',
    example: 'Object at 50cm, +4.00D lens: L\' = -2.00 + 4.00 = +2.00D',
    when: 'Finding image location through a lens'
  },
  {
    category: 'Geometric Optics',
    name: 'Snell\'s Law',
    formula: 'n₁ sin(θ₁) = n₂ sin(θ₂)',
    variables: 'n = refractive index, θ = angle from normal',
    example: 'Light from air (n=1.00) into CR-39 (n=1.498) at 30°',
    when: 'Calculating refraction at surface interface'
  },

  // Prism & Prentice's Rule
  {
    category: 'Prism',
    name: 'Prentice\'s Rule',
    formula: 'Δ = F × d',
    variables: 'Δ = prism (Δ), F = lens power (D), d = decentration (cm)',
    example: '+4.00D lens, 5mm decentration: Δ = 4.00 × 0.5 = 2.0Δ',
    when: 'Calculating induced prism from decentration'
  },
  {
    category: 'Prism',
    name: 'Prism Direction (Plus Lens)',
    formula: 'Base follows decentration',
    variables: 'Below OC = BU, Above OC = BD, Nasal = BI, Temporal = BO',
    example: 'Plus lens decentered 3mm down → 3mm base-up prism induced',
    when: 'Plus lenses: base direction same as decentration'
  },
  {
    category: 'Prism',
    name: 'Prism Direction (Minus Lens)',
    formula: 'Base opposite decentration',
    variables: 'Below OC = BD, Above OC = BU, Nasal = BO, Temporal = BI',
    example: 'Minus lens decentered 3mm down → 3mm base-down prism induced',
    when: 'Minus lenses: base direction opposite decentration'
  },
  {
    category: 'Prism',
    name: 'Slab-Off Prism',
    formula: 'Δ = (h × F) / (n - 1)',
    variables: 'Δ = prism (Δ), h = decentration (cm), F = power (D), n = refractive index',
    example: '20mm seg height, +3.00D, CR-39: Δ = (2.0 × 3.00) / 0.498 = 12Δ',
    when: 'Calculating vertical imbalance for slab-off'
  },
  {
    category: 'Prism',
    name: 'Resolving Prism',
    formula: 'H = Total × cos(θ), V = Total × sin(θ)',
    variables: 'H = horizontal component, V = vertical component, θ = angle',
    example: '5Δ @ 45° → H = 5×cos(45°) = 3.5Δ, V = 5×sin(45°) = 3.5Δ',
    when: 'Breaking oblique prism into H and V components'
  },

  // Prescription Calculations
  {
    category: 'Prescriptions',
    name: 'Transposition',
    formula: 'New Sph = Old Sph + Old Cyl; New Cyl = -Old Cyl; New Axis = Old Axis ± 90°',
    variables: 'Sphere, cylinder, axis',
    example: '+2.00-1.50×90 → +0.50+1.50×180',
    when: 'Converting minus cylinder to plus cylinder (or vice versa)'
  },
  {
    category: 'Prescriptions',
    name: 'Spherical Equivalent',
    formula: 'SE = Sphere + (Cylinder / 2)',
    variables: 'SE = spherical equivalent, rounded to nearest 0.25D',
    example: '+2.00-1.50×90 → SE = 2.00 + (-1.50/2) = +1.25D',
    when: 'Finding equivalent spherical power'
  },
  {
    category: 'Prescriptions',
    name: 'Vertex Distance Compensation',
    formula: 'F₂ = F₁ / [1 - (d × F₁)]',
    variables: 'F₂ = new power, F₁ = original power, d = vertex change (m)',
    example: '+10.00D at 12mm → 14mm: F₂ = 10 / [1 - (0.002 × 10)] = +10.20D',
    when: 'Adjusting power for vertex distance change (important when |Rx| > 4.00D)'
  },

  // Low Vision & Magnification
  {
    category: 'Magnification',
    name: 'Magnification Formula',
    formula: 'M = F / 4',
    variables: 'M = magnification (×), F = add power (D)',
    example: '+8.00D add → M = 8 / 4 = 2× magnification',
    when: 'Calculating magnification from add power'
  },
  {
    category: 'Magnification',
    name: 'Working Distance',
    formula: 'd = 100 / F',
    variables: 'd = working distance (cm), F = power (D)',
    example: '+10.00D magnifier → d = 100 / 10 = 10cm working distance',
    when: 'Finding working distance for magnifiers'
  },
  {
    category: 'Magnification',
    name: 'Required Magnification',
    formula: 'M = Goal / Current',
    variables: 'M = magnification needed, Goal = target acuity, Current = actual acuity',
    example: 'Current 20/200, want 20/40 → M = 200/40 = 5×',
    when: 'Determining magnification needed for specific task'
  },

  // Frame & Lens Measurements
  {
    category: 'Measurements',
    name: 'Effective Diameter',
    formula: 'ED = 2 × DBC',
    variables: 'ED = effective diameter, DBC = distance to furthest corner',
    example: 'DBC = 28mm → ED = 2 × 28 = 56mm',
    when: 'Finding minimum blank size needed'
  },
  {
    category: 'Measurements',
    name: 'Distance to Furthest Corner',
    formula: 'DBC = √(a² + b²)',
    variables: 'a = horizontal distance to corner, b = vertical distance to corner',
    example: 'a=24mm, b=20mm → DBC = √(576+400) = 31.2mm',
    when: 'Calculating effective diameter for edging'
  },
  {
    category: 'Measurements',
    name: 'Minimum Blank Diameter',
    formula: 'MBS = ED + 2mm',
    variables: 'MBS = minimum blank size, ED = effective diameter',
    example: 'ED = 58mm → MBS = 58 + 2 = 60mm',
    when: 'Ordering uncut lenses'
  },
  {
    category: 'Measurements',
    name: 'Binocular PD to Monocular',
    formula: 'Monocular PD = Binocular PD / 2 (if symmetric)',
    variables: 'Typically 31-33mm per eye for adults',
    example: 'Binocular PD 64mm → 32mm OD, 32mm OS',
    when: 'Converting between binocular and monocular PD'
  },

  // Material Properties
  {
    category: 'Materials',
    name: 'Abbe Value',
    formula: 'V = (nD - 1) / (nF - nC)',
    variables: 'V = Abbe value, n = refractive index at different wavelengths',
    example: 'CR-39 Abbe = 58 (high, less chromatic aberration)',
    when: 'Measuring chromatic aberration resistance'
  },
  {
    category: 'Materials',
    name: 'Critical Angle',
    formula: 'sin(θc) = n₂ / n₁',
    variables: 'θc = critical angle, n₁ = higher index, n₂ = lower index',
    example: 'CR-39 to air: sin(θc) = 1.00/1.498 → θc = 42°',
    when: 'Calculating total internal reflection angle'
  },

  // ANSI Standards
  {
    category: 'Standards',
    name: 'ANSI Z80.1 Power Tolerance (≤6.50D)',
    formula: '±0.12D',
    variables: 'Applies to sphere and cylinder powers ≤6.50D',
    example: 'Prescribed +3.00D, acceptable range: +2.88D to +3.12D',
    when: 'Verifying prescription tolerance for powers ≤6.50D'
  },
  {
    category: 'Standards',
    name: 'ANSI Z80.1 Power Tolerance (>6.50D)',
    formula: '±2%',
    variables: 'Applies to sphere and cylinder powers >6.50D',
    example: 'Prescribed +10.00D, acceptable range: +9.80D to +10.20D',
    when: 'Verifying prescription tolerance for powers >6.50D'
  },
  {
    category: 'Standards',
    name: 'ANSI Axis Tolerance',
    formula: 'Varies by cylinder power (see table)',
    variables: 'Cyl >1.50D: ±2°, 0.75-1.50D: ±3°, 0.50D: ±5°, 0.25D: ±7°, ≤0.12D: ±14°',
    example: 'Rx -1.00×90, tolerance: ±3° (acceptable: 87-93°)',
    when: 'Verifying axis accuracy based on cylinder power'
  }
];

var FORMULA_CATEGORIES = [
  'All',
  'Geometric Optics',
  'Prism',
  'Prescriptions',
  'Magnification',
  'Measurements',
  'Materials',
  'Standards'
];

// Build formula reference modal
function buildFormulaModal() {
  var modal = document.createElement('div');
  modal.id = 'formula-modal';
  modal.className = 'modal';
  modal.innerHTML = [
    '<div class="modal-content formula-modal-content">',
    '  <div class="modal-header">',
    '    <h2 style="margin:0;font-family:\'Playfair Display\',serif;color:var(--tx)">📐 Formula Reference</h2>',
    '    <button class="modal-close" id="formula-close" aria-label="Close">&times;</button>',
    '  </div>',
    '  <div class="formula-filter">',
    '    <input type="text" id="formula-search" placeholder="Search formulas..." style="flex:1;padding:8px 12px;border:1px solid var(--bdr);border-radius:6px;background:var(--s1);color:var(--tx);font-size:14px">',
    '    <select id="formula-category" style="padding:8px 12px;border:1px solid var(--bdr);border-radius:6px;background:var(--s1);color:var(--tx);font-size:14px">',
    FORMULA_CATEGORIES.map(function(cat) { return '<option value="' + cat + '">' + cat + '</option>'; }).join(''),
    '    </select>',
    '  </div>',
    '  <div class="formula-list" id="formula-list"></div>',
    '</div>'
  ].join('');
  document.body.appendChild(modal);
  
  renderFormulas();
  
  // Event listeners
  document.getElementById('formula-close').addEventListener('click', closeFormulaModal);
  document.getElementById('formula-search').addEventListener('input', filterFormulas);
  document.getElementById('formula-category').addEventListener('change', filterFormulas);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeFormulaModal();
  });
}

function renderFormulas(filter) {
  var list = document.getElementById('formula-list');
  if (!list) return;
  
  var searchTerm = document.getElementById('formula-search') ? document.getElementById('formula-search').value.toLowerCase() : '';
  var category = document.getElementById('formula-category') ? document.getElementById('formula-category').value : 'All';
  
  var filtered = FORMULAS.filter(function(f) {
    var matchesSearch = !searchTerm || 
      f.name.toLowerCase().indexOf(searchTerm) !== -1 ||
      f.formula.toLowerCase().indexOf(searchTerm) !== -1 ||
      f.variables.toLowerCase().indexOf(searchTerm) !== -1;
    var matchesCategory = category === 'All' || f.category === category;
    return matchesSearch && matchesCategory;
  });
  
  if (filtered.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--tx2)">No formulas found</div>';
    return;
  }
  
  list.innerHTML = filtered.map(function(f, i) {
    return [
      '<div class="formula-card">',
      '  <div class="formula-header">',
      '    <div>',
      '      <div class="formula-name">' + escHtml(f.name) + '</div>',
      '      <div class="formula-category-badge">' + escHtml(f.category) + '</div>',
      '    </div>',
      '    <button class="formula-copy" data-formula="' + escHtml(f.formula) + '" title="Copy formula">📋</button>',
      '  </div>',
      '  <div class="formula-formula">' + escHtml(f.formula) + '</div>',
      '  <div class="formula-variables"><strong>Variables:</strong> ' + escHtml(f.variables) + '</div>',
      '  <div class="formula-example"><strong>Example:</strong> ' + escHtml(f.example) + '</div>',
      '  <div class="formula-when"><strong>When to use:</strong> ' + escHtml(f.when) + '</div>',
      '</div>'
    ].join('');
  }).join('');
  
  // Add copy button listeners
  document.querySelectorAll('.formula-copy').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var formula = this.getAttribute('data-formula');
      copyToClipboard(formula);
      toast('Formula copied!', 'success');
    });
  });
}

function filterFormulas() {
  renderFormulas();
}

function openFormulaModal() {
  var modal = document.getElementById('formula-modal');
  if (!modal) buildFormulaModal();
  modal = document.getElementById('formula-modal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Focus search input
  setTimeout(function() {
    var search = document.getElementById('formula-search');
    if (search) search.focus();
  }, 100);
}

function closeFormulaModal() {
  var modal = document.getElementById('formula-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    // Fallback
    var tmp = document.createElement('textarea');
    tmp.value = text;
    tmp.style.position = 'fixed';
    tmp.style.opacity = '0';
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
  }
}

console.log('✅ Formula reference loaded (' + FORMULAS.length + ' formulas)');
