// ═══════════════════════════════════════════════════════════════
// TOOLS.JS - Study Tools & Calculators
// Interactive calculators for common opticianry formulas
// ═══════════════════════════════════════════════════════════════

function initTools() {
  // Prentice Calculator
  var calcPrentice = el('calc-prentice');
  if (calcPrentice) {
    calcPrentice.addEventListener('click', function() {
      var power = parseFloat(el('prentice-power').value);
      var decentration = parseFloat(el('prentice-dec').value);
      
      if (isNaN(power) || isNaN(decentration)) {
        el('prentice-result').innerHTML = '<div class="calc-error">Please enter valid numbers</div>';
        return;
      }
      
      var prism = Math.abs(power * decentration);
      var direction = power > 0 ? 'Plus lens: ' : 'Minus lens: ';
      var baseDir = '';
      
      if (power > 0) {
        baseDir = 'Above OC = Base Down, Below OC = Base Up<br>Nasal = Base In, Temporal = Base Out';
      } else {
        baseDir = 'Above OC = Base Up, Below OC = Base Down<br>Nasal = Base Out, Temporal = Base In';
      }
      
      var html = '<div class="calc-result-box">';
      html += '<div class="calc-formula">Δ = F × d</div>';
      html += '<div class="calc-work">';
      html += '<div>Δ = ' + Math.abs(power).toFixed(2) + 'D × ' + decentration.toFixed(2) + 'cm</div>';
      html += '<div>Δ = ' + prism.toFixed(2) + ' prism diopters</div>';
      html += '</div>';
      html += '<div class="calc-answer">Prism: <strong>' + prism.toFixed(2) + 'Δ</strong></div>';
      html += '<div class="calc-note">' + direction + baseDir + '</div>';
      html += '</div>';
      
      el('prentice-result').innerHTML = html;
    });
  }
  
  // Transposition Calculator
  var calcTranspose = el('calc-transpose');
  if (calcTranspose) {
    calcTranspose.addEventListener('click', function() {
      var sph = parseFloat(el('transpose-sph').value);
      var cyl = parseFloat(el('transpose-cyl').value);
      var axis = parseFloat(el('transpose-axis').value);
      
      if (isNaN(sph) || isNaN(cyl) || isNaN(axis)) {
        el('transpose-result').innerHTML = '<div class="calc-error">Please enter valid numbers</div>';
        return;
      }
      
      var newSph = sph + cyl;
      var newCyl = -cyl;
      var newAxis = (axis + 90) % 180;
      if (newAxis === 0) newAxis = 180;
      
      var html = '<div class="calc-result-box">';
      html += '<div class="calc-formula">New Sph = Old Sph + Old Cyl<br>New Cyl = -Old Cyl<br>New Axis = Old Axis ± 90°</div>';
      html += '<div class="calc-work">';
      html += '<div>New Sph = ' + sph.toFixed(2) + ' + (' + cyl.toFixed(2) + ') = ' + newSph.toFixed(2) + 'D</div>';
      html += '<div>New Cyl = -(' + cyl.toFixed(2) + ') = ' + newCyl.toFixed(2) + 'D</div>';
      html += '<div>New Axis = ' + axis + '° + 90° = ' + newAxis + '°</div>';
      html += '</div>';
      html += '<div class="calc-answer"><strong>' + 
              (newSph >= 0 ? '+' : '') + newSph.toFixed(2) + ' ' +
              (newCyl >= 0 ? '+' : '') + newCyl.toFixed(2) + ' × ' + newAxis + '°</strong></div>';
      html += '</div>';
      
      el('transpose-result').innerHTML = html;
    });
  }
  
  // Spherical Equivalent Calculator
  var calcSE = el('calc-se');
  if (calcSE) {
    calcSE.addEventListener('click', function() {
      var sph = parseFloat(el('se-sph').value);
      var cyl = parseFloat(el('se-cyl').value);
      
      if (isNaN(sph) || isNaN(cyl)) {
        el('se-result').innerHTML = '<div class="calc-error">Please enter valid numbers</div>';
        return;
      }
      
      var se = sph + (cyl / 2);
      
      var html = '<div class="calc-result-box">';
      html += '<div class="calc-formula">SE = Sphere + (Cylinder ÷ 2)</div>';
      html += '<div class="calc-work">';
      html += '<div>SE = ' + sph.toFixed(2) + ' + (' + cyl.toFixed(2) + ' ÷ 2)</div>';
      html += '<div>SE = ' + sph.toFixed(2) + ' + ' + (cyl/2).toFixed(2) + '</div>';
      html += '<div>SE = ' + se.toFixed(2) + 'D</div>';
      html += '</div>';
      html += '<div class="calc-answer">Spherical Equivalent: <strong>' + (se >= 0 ? '+' : '') + se.toFixed(2) + 'D</strong></div>';
      html += '<div class="calc-note">Used for contact lens over-refraction and best sphere Rx</div>';
      html += '</div>';
      
      el('se-result').innerHTML = html;
    });
  }
  
  // Effective Diameter Calculator
  var calcED = el('calc-ed');
  if (calcED) {
    calcED.addEventListener('click', function() {
      var a = parseFloat(el('ed-a').value);
      var b = parseFloat(el('ed-b').value);
      
      if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        el('ed-result').innerHTML = '<div class="calc-error">Please enter valid positive numbers</div>';
        return;
      }
      
      var ed = 2 * Math.sqrt(a*a + b*b);
      
      var html = '<div class="calc-result-box">';
      html += '<div class="calc-formula">ED = 2 × √(a² + b²)</div>';
      html += '<div class="calc-work">';
      html += '<div>ED = 2 × √(' + a.toFixed(1) + '² + ' + b.toFixed(1) + '²)</div>';
      html += '<div>ED = 2 × √(' + (a*a).toFixed(1) + ' + ' + (b*b).toFixed(1) + ')</div>';
      html += '<div>ED = 2 × √' + (a*a + b*b).toFixed(1) + '</div>';
      html += '<div>ED = 2 × ' + Math.sqrt(a*a + b*b).toFixed(2) + '</div>';
      html += '<div>ED = ' + ed.toFixed(2) + 'mm</div>';
      html += '</div>';
      html += '<div class="calc-answer">Effective Diameter: <strong>' + ed.toFixed(1) + 'mm</strong></div>';
      html += '<div class="calc-note">Minimum lens blank size needed (before decentration)</div>';
      html += '</div>';
      
      el('ed-result').innerHTML = html;
    });
  }
  
  // Vertex Distance Calculator
  var calcVertex = el('calc-vertex');
  if (calcVertex) {
    calcVertex.addEventListener('click', function() {
      var f1 = parseFloat(el('vertex-power').value);
      var d = parseFloat(el('vertex-distance').value);
      
      if (isNaN(f1) || isNaN(d)) {
        el('vertex-result').innerHTML = '<div class="calc-error">Please enter valid numbers</div>';
        return;
      }
      
      var dMeters = d / 1000; // Convert mm to meters
      var f2 = f1 / (1 - dMeters * f1);
      var change = Math.abs(f2 - f1);
      
      var html = '<div class="calc-result-box">';
      html += '<div class="calc-formula">F₂ = F₁ / (1 - d×F₁)</div>';
      html += '<div class="calc-work">';
      html += '<div>d = ' + d.toFixed(1) + 'mm = ' + dMeters.toFixed(4) + 'm</div>';
      html += '<div>F₂ = ' + f1.toFixed(2) + ' / (1 - ' + dMeters.toFixed(4) + ' × ' + f1.toFixed(2) + ')</div>';
      html += '<div>F₂ = ' + f1.toFixed(2) + ' / (1 - ' + (dMeters * f1).toFixed(4) + ')</div>';
      html += '<div>F₂ = ' + f1.toFixed(2) + ' / ' + (1 - dMeters * f1).toFixed(4) + '</div>';
      html += '<div>F₂ = ' + f2.toFixed(2) + 'D</div>';
      html += '</div>';
      html += '<div class="calc-answer">New Power: <strong>' + (f2 >= 0 ? '+' : '') + f2.toFixed(2) + 'D</strong></div>';
      html += '<div class="calc-note">Change: ' + change.toFixed(2) + 'D (' + (d > 0 ? 'moved closer' : 'moved farther') + ')<br>';
      html += 'Significant when power >±4.00D and distance change ≥3mm</div>';
      html += '</div>';
      
      el('vertex-result').innerHTML = html;
    });
  }
}

function renderTools() {
  var container = el('tools-content');
  if (!container) return;
  
  var html = '';
  
  // Prentice's Rule
  html += '<div class="tool-section">';
  html += '<h3 class="tool-title">🔶 Prentice\'s Rule Calculator</h3>';
  html += '<p class="tool-desc">Calculate prism induced by decentration</p>';
  html += '<div class="tool-inputs">';
  html += '<div class="tool-input-group">';
  html += '<label>Lens Power (D)</label>';
  html += '<input type="number" id="prentice-power" step="0.25" placeholder="e.g., +4.00 or -2.50">';
  html += '</div>';
  html += '<div class="tool-input-group">';
  html += '<label>Decentration (cm)</label>';
  html += '<input type="number" id="prentice-dec" step="0.1" placeholder="e.g., 0.3 for 3mm">';
  html += '</div>';
  html += '<button id="calc-prentice" class="tool-calc-btn">Calculate</button>';
  html += '</div>';
  html += '<div id="prentice-result" class="tool-result"></div>';
  html += '</div>';
  
  // Transposition
  html += '<div class="tool-section">';
  html += '<h3 class="tool-title">🔄 Transposition Calculator</h3>';
  html += '<p class="tool-desc">Convert plus cylinder to minus (or vice versa)</p>';
  html += '<div class="tool-inputs">';
  html += '<div class="tool-input-group">';
  html += '<label>Sphere (D)</label>';
  html += '<input type="number" id="transpose-sph" step="0.25" placeholder="e.g., +2.00">';
  html += '</div>';
  html += '<div class="tool-input-group">';
  html += '<label>Cylinder (D)</label>';
  html += '<input type="number" id="transpose-cyl" step="0.25" placeholder="e.g., -1.50">';
  html += '</div>';
  html += '<div class="tool-input-group">';
  html += '<label>Axis (°)</label>';
  html += '<input type="number" id="transpose-axis" min="1" max="180" placeholder="e.g., 90">';
  html += '</div>';
  html += '<button id="calc-transpose" class="tool-calc-btn">Transpose</button>';
  html += '</div>';
  html += '<div id="transpose-result" class="tool-result"></div>';
  html += '</div>';
  
  // Spherical Equivalent
  html += '<div class="tool-section">';
  html += '<h3 class="tool-title">🎯 Spherical Equivalent</h3>';
  html += '<p class="tool-desc">Calculate SE for contact lens fitting or best sphere</p>';
  html += '<div class="tool-inputs">';
  html += '<div class="tool-input-group">';
  html += '<label>Sphere (D)</label>';
  html += '<input type="number" id="se-sph" step="0.25" placeholder="e.g., +2.00">';
  html += '</div>';
  html += '<div class="tool-input-group">';
  html += '<label>Cylinder (D)</label>';
  html += '<input type="number" id="se-cyl" step="0.25" placeholder="e.g., -1.50">';
  html += '</div>';
  html += '<button id="calc-se" class="tool-calc-btn">Calculate SE</button>';
  html += '</div>';
  html += '<div id="se-result" class="tool-result"></div>';
  html += '</div>';
  
  // Effective Diameter
  html += '<div class="tool-section">';
  html += '<h3 class="tool-title">📍 Effective Diameter</h3>';
  html += '<p class="tool-desc">Calculate minimum blank size from frame measurements</p>';
  html += '<div class="tool-inputs">';
  html += '<div class="tool-input-group">';
  html += '<label>Longest Horizontal (mm)</label>';
  html += '<input type="number" id="ed-a" step="0.5" placeholder="e.g., 30">';
  html += '</div>';
  html += '<div class="tool-input-group">';
  html += '<label>Longest Vertical (mm)</label>';
  html += '<input type="number" id="ed-b" step="0.5" placeholder="e.g., 22">';
  html += '</div>';
  html += '<button id="calc-ed" class="tool-calc-btn">Calculate ED</button>';
  html += '</div>';
  html += '<div id="ed-result" class="tool-result"></div>';
  html += '</div>';
  
  // Vertex Distance
  html += '<div class="tool-section">';
  html += '<h3 class="tool-title">📎 Vertex Distance Compensation</h3>';
  html += '<p class="tool-desc">Adjust power for vertex distance change</p>';
  html += '<div class="tool-inputs">';
  html += '<div class="tool-input-group">';
  html += '<label>Original Power (D)</label>';
  html += '<input type="number" id="vertex-power" step="0.25" placeholder="e.g., +10.00">';
  html += '</div>';
  html += '<div class="tool-input-group">';
  html += '<label>Distance Change (mm)</label>';
  html += '<input type="number" id="vertex-distance" step="1" placeholder="+3 (closer) or -3 (farther)">';
  html += '<small>Positive = closer to eye, Negative = farther from eye</small>';
  html += '</div>';
  html += '<button id="calc-vertex" class="tool-calc-btn">Calculate</button>';
  html += '</div>';
  html += '<div id="vertex-result" class="tool-result"></div>';
  html += '</div>';
  
  container.innerHTML = html;
  initTools();
}

console.log('✅ Tools module loaded');
