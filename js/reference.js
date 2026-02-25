// ═══════════════════════════════════════════════════════════════
// REFERENCE.JS - Quick Reference Tool
// Formulas, standards, and key values for ABO exam prep
// ═══════════════════════════════════════════════════════════════

var REFERENCE_DATA = {
  formulas: [
    {
      category: 'Prism',
      name: "Prentice's Rule",
      formula: 'Δ = F × d',
      variables: 'Δ = prism (diopters), F = lens power (D), d = decentration (cm)',
      example: '+4.00D lens, 3mm (0.3cm) decentration = 4 × 0.3 = 1.2Δ',
      notes: 'Plus lens: below OC=BU, above=BD, nasal=BI, temporal=BO. Minus=opposite.',
    },
    {
      category: 'Prism',
      name: 'Slab-Off Prism',
      formula: 'Δ = (h × F) / (n - 1)',
      variables: 'h = decentration (cm), F = power (D), n = refractive index',
      example: 'Seg height 20mm (2cm), +3.00D, n=1.498: Δ = (2 × 3) / 0.498 = 12.05Δ',
      notes: 'Used to correct vertical imbalance in anisometropia ≥1.50D',
    },
    {
      category: 'Power',
      name: 'Spherical Equivalent',
      formula: 'SE = Sphere + (Cylinder ÷ 2)',
      variables: 'SE = spherical equivalent power',
      example: '+2.00-1.50×90 → SE = 2.00 + (-1.50÷2) = +1.25D',
      notes: 'Used for contact lens over-refraction, best sphere Rx',
    },
    {
      category: 'Power',
      name: 'Transposition',
      formula: 'New Sph = Old Sph + Old Cyl\nNew Cyl = -Old Cyl\nNew Axis = Old Axis ± 90°',
      variables: 'Plus-to-minus or minus-to-plus cylinder form',
      example: '+2.00-1.50×90 → +0.50+1.50×180',
      notes: 'Axis wraps at 180° (e.g., 180+90=270 becomes 90)',
    },
    {
      category: 'Power',
      name: 'Vertex Distance Compensation',
      formula: 'F₂ = F₁ / (1 - d×F₁)',
      variables: 'F₁ = original power, F₂ = new power, d = distance change (meters)',
      example: 'Move +10.00D from 13mm to 10mm (0.003m closer): F₂ = 10/(1-0.003×10) = +10.31D',
      notes: 'Significant when power >±4.00D, distance change ≥3mm',
    },
    {
      category: 'Vergence',
      name: 'Vergence (U)',
      formula: 'U = n / L',
      variables: 'U = vergence (D), n = refractive index, L = distance (meters)',
      example: 'Light at 40cm in air: U = 1.0 / 0.40 = +2.50D',
      notes: 'Positive = converging, negative = diverging, parallel = 0',
    },
    {
      category: 'Vergence',
      name: 'Lens Power Formula',
      formula: 'F = U₂ - U₁',
      variables: 'F = lens power, U₁ = incident vergence, U₂ = emergent vergence',
      example: 'U₁ = -2.50D, U₂ = +5.00D → F = 5.00 - (-2.50) = +7.50D',
      notes: 'Foundation of all lens power calculations',
    },
    {
      category: 'Magnification',
      name: 'Relative Spectacle Magnification',
      formula: 'RSM = 1 / (1 - h×F)',
      variables: 'h = vertex distance (meters), F = lens power (D)',
      example: 'Vertex 12mm (0.012m), +10.00D: RSM = 1/(1-0.012×10) = 1.136 (13.6% magnification)',
      notes: 'Aniseikonia occurs when RSM difference >5% between eyes',
    },
    {
      category: 'Magnification',
      name: 'Angular Magnification (Low Vision)',
      formula: 'M = F / 4',
      variables: 'M = magnification, F = add power (D)',
      example: '+8.00 add = 8/4 = 2× magnification',
      notes: 'Assumes 25cm reference distance (F/4 rule)',
    },
    {
      category: 'Measurements',
      name: 'Effective Diameter',
      formula: 'ED = 2 × √(a² + b²)',
      variables: 'a = longest horizontal, b = longest vertical from geometric center',
      example: 'a=30mm, b=22mm → ED = 2×√(900+484) = 2×37.2 = 74.4mm',
      notes: 'Used to determine minimum blank size needed',
    },
    {
      category: 'Measurements',
      name: 'Minimum Blank Size',
      formula: 'MBS = ED + 2×(decentration)',
      variables: 'ED = effective diameter, decentration in mm',
      example: 'ED=70mm, 3mm dec each side → MBS = 70 + 2×3 = 76mm',
      notes: 'Must have enough material to cut lens and decenter',
    },
    {
      category: 'Optics',
      name: "Snell's Law",
      formula: 'n₁ × sin(θ₁) = n₂ × sin(θ₂)',
      variables: 'n = refractive index, θ = angle from normal',
      example: 'Light from air (n=1.0) at 30° into CR-39 (n=1.498): sin(θ₂) = (1.0×sin30°)/1.498 = 0.334 → θ₂ = 19.5°',
      notes: 'Light bends toward normal when entering denser medium',
    },
    {
      category: 'Optics',
      name: 'Critical Angle',
      formula: 'sin(θc) = n₂ / n₁',
      variables: 'θc = critical angle, n₁ = denser medium, n₂ = less dense',
      example: 'CR-39 to air: sin(θc) = 1.0/1.498 = 0.668 → θc = 41.9°',
      notes: 'Beyond critical angle = total internal reflection',
    },
  ],
  
  materials: [
    { name: 'CR-39', index: '1.498', abbe: '58', sg: '1.32', impact: 'Basic', notes: 'Standard plastic' },
    { name: 'Polycarbonate', index: '1.586', abbe: '30', sg: '1.20', impact: 'High', notes: 'Impact-resistant standard' },
    { name: 'Trivex', index: '1.53', abbe: '43-45', sg: '1.11', impact: 'High', notes: 'Lightest, excellent optics' },
    { name: 'Crown Glass', index: '1.523', abbe: '59', sg: '2.54', impact: 'Low', notes: 'Best optics, discontinued' },
    { name: 'High-Index 1.60', index: '1.60', abbe: '42', sg: '1.34', impact: 'Basic', notes: '20% thinner than CR-39' },
    { name: 'High-Index 1.67', index: '1.67', abbe: '32', sg: '1.43', impact: 'Basic', notes: '40% thinner than CR-39' },
    { name: 'High-Index 1.74', index: '1.74', abbe: '33', sg: '1.47', impact: 'Basic', notes: 'Thinnest, most expensive' },
  ],
  
  tolerances: [
    { spec: 'ANSI Z80.1-2022', parameter: 'Sphere/Cylinder Power', value: '±0.12D (≤6.50D)', notes: '±2% for >6.50D' },
    { spec: 'ANSI Z80.1-2022', parameter: 'Axis (Cyl >1.50D)', value: '±2°', notes: 'Most restrictive' },
    { spec: 'ANSI Z80.1-2022', parameter: 'Axis (Cyl 0.75-1.50D)', value: '±3°', notes: 'Moderate' },
    { spec: 'ANSI Z80.1-2022', parameter: 'Axis (Cyl 0.50D)', value: '±5°', notes: 'Loose' },
    { spec: 'ANSI Z80.1-2022', parameter: 'Axis (Cyl 0.25D)', value: '±7°', notes: 'Very loose' },
    { spec: 'ANSI Z80.1-2022', parameter: 'Axis (Cyl ≤0.12D)', value: '±14°', notes: 'Loosest' },
    { spec: 'ANSI Z80.1-2022', parameter: 'Prism (<2.00D)', value: '0.33Δ', notes: 'Base direction ±3°' },
    { spec: 'ANSI Z80.1-2022', parameter: 'Prism (≥2.00D)', value: '0.25Δ', notes: 'Tighter for high prism' },
    { spec: 'ANSI Z80.1-2022', parameter: 'Seg Height', value: '±1.0mm', notes: 'Vertical position' },
    { spec: 'ANSI Z80.1-2022', parameter: 'Seg Width', value: '±0.5mm', notes: 'Horizontal width' },
  ],
  
  regulations: [
    { standard: 'FDA 21 CFR 801.410', description: 'Drop Ball Test', details: '5/8-inch (16mm) steel ball dropped from 50 inches (127cm). Lens must not fracture.' },
    { standard: 'ANSI Z87.1', description: 'Safety Eyewear', details: 'Industrial/occupational protection. Basic (Z87) and high-impact (Z87+) ratings.' },
    { standard: 'ASTM F803', description: 'Sports Eyewear', details: 'Sport-specific protection (racquetball, basketball, etc.). Different impact velocities.' },
    { standard: 'FTC Eyeglass Rule', description: 'Rx Release', details: 'Must provide Rx to patient immediately after exam, no extra charge, no purchase required.' },
    { standard: 'OSHA 29 CFR 1910.133', description: 'Employer PPE', details: 'Employer must ensure proper eye protection for hazardous environments.' },
  ],
  
  anatomy: [
    { structure: 'Cornea', layers: '5 layers: Epithelium, Bowman\'s, Stroma (90%), Descemet\'s, Endothelium', power: '~43D (2/3 of eye\'s power)', notes: 'Avascular, gets oxygen from tears/aqueous' },
    { structure: 'Crystalline Lens', layers: 'Capsule, Cortex, Nucleus', power: '~15-20D (changes with accommodation)', notes: 'Biconvex, suspended by zonules' },
    { structure: 'Fovea Centralis', layers: 'Central macula', power: 'N/A', notes: '100% cones, NO rods, avascular, sharpest vision' },
    { structure: 'Aqueous Humor', layers: 'Anterior/Posterior chambers', power: 'N/A', notes: 'Produced by ciliary body, drains via trabecular meshwork. Normal IOP: 10-21mmHg' },
    { structure: 'Vitreous Humor', layers: 'Gel filling posterior segment', power: 'N/A', notes: 'Clear, 99% water, maintains eye shape' },
  ],
};

function renderReference() {
  var container = el('reference-content');
  if (!container) return;
  
  var html = '';
  
  // Formulas Section
  html += '<div class="ref-section">';
  html += '<h2 class="ref-title">📐 Essential Formulas</h2>';
  html += '<div class="ref-search"><input type="text" id="formula-search" placeholder="Search formulas..." class="search-input"></div>';
  html += '<div id="formulas-list">';
  
  var categories = {};
  REFERENCE_DATA.formulas.forEach(function(f) {
    if (!categories[f.category]) categories[f.category] = [];
    categories[f.category].push(f);
  });
  
  Object.keys(categories).forEach(function(cat) {
    html += '<div class="ref-category">' + escHtml(cat) + '</div>';
    categories[cat].forEach(function(f, i) {
      html += '<div class="ref-card formula-card" data-search="' + escHtml((f.name + ' ' + f.formula + ' ' + f.variables).toLowerCase()) + '">';
      html += '<div class="ref-card-header">';
      html += '<div class="ref-card-name">' + escHtml(f.name) + '</div>';
      html += '<button class="ref-copy-btn" onclick="copyFormula(\'' + escHtml(f.formula.replace(/'/g, "\\'")) + '\')">📋 Copy</button>';
      html += '</div>';
      html += '<div class="ref-formula">' + escHtml(f.formula).replace(/\n/g, '<br>') + '</div>';
      html += '<div class="ref-variables">' + escHtml(f.variables) + '</div>';
      html += '<div class="ref-example"><strong>Example:</strong> ' + escHtml(f.example) + '</div>';
      if (f.notes) html += '<div class="ref-notes">💡 ' + escHtml(f.notes) + '</div>';
      html += '</div>';
    });
  });
  
  html += '</div></div>'; // formulas-list, ref-section
  
  // Materials Section
  html += '<div class="ref-section">';
  html += '<h2 class="ref-title">🔬 Lens Materials</h2>';
  html += '<div class="ref-table-wrap"><table class="ref-table">';
  html += '<thead><tr><th>Material</th><th>Index (n)</th><th>Abbe Value</th><th>Specific Gravity</th><th>Impact</th><th>Notes</th></tr></thead>';
  html += '<tbody>';
  REFERENCE_DATA.materials.forEach(function(m) {
    html += '<tr>';
    html += '<td><strong>' + escHtml(m.name) + '</strong></td>';
    html += '<td>' + escHtml(m.index) + '</td>';
    html += '<td>' + escHtml(m.abbe) + '</td>';
    html += '<td>' + escHtml(m.sg) + '</td>';
    html += '<td>' + escHtml(m.impact) + '</td>';
    html += '<td>' + escHtml(m.notes) + '</td>';
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';
  
  // Tolerances Section
  html += '<div class="ref-section">';
  html += '<h2 class="ref-title">📏 ANSI Z80.1-2022 Tolerances</h2>';
  html += '<div class="ref-table-wrap"><table class="ref-table">';
  html += '<thead><tr><th>Standard</th><th>Parameter</th><th>Tolerance</th><th>Notes</th></tr></thead>';
  html += '<tbody>';
  REFERENCE_DATA.tolerances.forEach(function(t) {
    html += '<tr>';
    html += '<td>' + escHtml(t.spec) + '</td>';
    html += '<td>' + escHtml(t.parameter) + '</td>';
    html += '<td><strong>' + escHtml(t.value) + '</strong></td>';
    html += '<td>' + escHtml(t.notes) + '</td>';
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';
  
  // Regulations Section
  html += '<div class="ref-section">';
  html += '<h2 class="ref-title">⚖️ Regulatory Standards</h2>';
  REFERENCE_DATA.regulations.forEach(function(r) {
    html += '<div class="ref-card">';
    html += '<div class="ref-card-name">' + escHtml(r.standard) + '</div>';
    html += '<div class="ref-subtitle">' + escHtml(r.description) + '</div>';
    html += '<div class="ref-details">' + escHtml(r.details) + '</div>';
    html += '</div>';
  });
  html += '</div>';
  
  // Anatomy Section
  html += '<div class="ref-section">';
  html += '<h2 class="ref-title">👁️ Ocular Anatomy</h2>';
  REFERENCE_DATA.anatomy.forEach(function(a) {
    html += '<div class="ref-card">';
    html += '<div class="ref-card-name">' + escHtml(a.structure) + '</div>';
    html += '<div class="ref-anatomy-row"><strong>Layers:</strong> ' + escHtml(a.layers) + '</div>';
    html += '<div class="ref-anatomy-row"><strong>Power:</strong> ' + escHtml(a.power) + '</div>';
    html += '<div class="ref-notes">💡 ' + escHtml(a.notes) + '</div>';
    html += '</div>';
  });
  html += '</div>';
  
  container.innerHTML = html;
  
  // Wire up search
  var searchInput = el('formula-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      var query = this.value.toLowerCase();
      var cards = document.querySelectorAll('.formula-card');
      cards.forEach(function(card) {
        var searchText = card.getAttribute('data-search');
        card.style.display = searchText.indexOf(query) !== -1 ? 'block' : 'none';
      });
    });
  }
}

function copyFormula(formula) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(formula).then(function() {
      toast('Formula copied!', 'success');
    }).catch(function() {
      toast('Failed to copy', 'error');
    });
  } else {
    // Fallback
    var tmp = document.createElement('textarea');
    tmp.value = formula;
    tmp.style.position = 'fixed';
    tmp.style.opacity = '0';
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    toast('Formula copied!', 'success');
  }
}

console.log('✅ Reference module loaded');
