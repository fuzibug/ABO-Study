// Formula Calculator - Interactive Optical Calculations

const Calculator = {
  // Prentice's Rule: Prism = Power × Decentration (cm)
  prenticeRule: function(power, decentrationMm) {
    const decentrationCm = decentrationMm / 10;
    const prism = Math.abs(power * decentrationCm);
    
    return {
      prism: prism.toFixed(2),
      direction: power > 0 ? 'Base Out (plus lens)' : 'Base In (minus lens)',
      formula: 'Prism (△) = Power (D) × Decentration (cm)',
      calculation: `${Math.abs(power)} × ${decentrationCm.toFixed(1)} = ${prism.toFixed(2)}△`,
      explanation: `A ${power > 0 ? 'plus' : 'minus'} ${Math.abs(power)}D lens decentered ${decentrationMm}mm induces ${prism.toFixed(2)} prism diopters`
    };
  },
  
  // Vergence Calculation: V = n / d (meters)
  vergence: function(distanceCm, refractiveIndex = 1.0) {
    const distanceMeters = distanceCm / 100;
    const vergence = refractiveIndex / distanceMeters;
    
    return {
      vergence: vergence.toFixed(2),
      unit: 'D (diopters)',
      formula: 'V = n / d',
      calculation: `${refractiveIndex} / ${distanceMeters}m = ${vergence.toFixed(2)}D`,
      explanation: `An object at ${distanceCm}cm has a vergence of ${vergence.toFixed(2)} diopters`,
      reciprocal: `Reciprocal: ${distanceMeters.toFixed(2)}m = ${(1/vergence).toFixed(4)}m`
    };
  },
  
  // Lens Transposition (Plus to Minus or vice versa)
  transpose: function(sphere, cylinder, axis) {
    const newSphere = (sphere + cylinder).toFixed(2);
    const newCylinder = (-cylinder).toFixed(2);
    let newAxis = (axis + 90) % 180;
    if (newAxis === 0) newAxis = 180;
    
    return {
      original: `${this.formatPower(sphere)} ${this.formatPower(cylinder)} × ${axis}`,
      transposed: `${this.formatPower(newSphere)} ${this.formatPower(newCylinder)} × ${newAxis}`,
      steps: [
        `1. New Sphere = ${sphere} + ${cylinder} = ${newSphere}`,
        `2. New Cylinder = -${cylinder} = ${newCylinder}`,
        `3. New Axis = ${axis} + 90 = ${newAxis}`
      ],
      explanation: 'Transposition changes the form but not the optical power'
    };
  },
  
  // Format power with sign
  formatPower: function(power) {
    const num = parseFloat(power);
    return num >= 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
  },
  
  // Segment Height for Bifocals
  segmentHeight: function(eyeSize, bridge, pd, segType = 'FT-28') {
    const segmentHeights = {
      'FT-28': 0.5,  // 50% of B measurement
      'FT-35': 0.5,
      'Round': 0.45,
      'Executive': 0.5
    };
    
    const ratio = segmentHeights[segType] || 0.5;
    const height = eyeSize * ratio;
    
    return {
      height: height.toFixed(1),
      unit: 'mm',
      segmentType: segType,
      eyeSize: eyeSize,
      formula: `Seg Height ≈ ${(ratio * 100)}% of B measurement`,
      calculation: `${eyeSize}mm × ${ratio} = ${height.toFixed(1)}mm`,
      explanation: `For ${segType} bifocals on a ${eyeSize}mm B measurement, typical seg height is ${height.toFixed(1)}mm from bottom of lens`
    };
  },
  
  // Monocular PD from Binocular PD
  monocularPD: function(binocularPD) {
    const monocular = binocularPD / 2;
    
    return {
      binocular: binocularPD,
      monocularOD: monocular.toFixed(1),
      monocularOS: monocular.toFixed(1),
      formula: 'Monocular PD = Binocular PD ÷ 2',
      calculation: `${binocularPD} ÷ 2 = ${monocular.toFixed(1)}mm each eye`,
      note: 'Assumes symmetric face. Measure separately if asymmetric.'
    };
  },
  
  // Effective Power (compensated for vertex distance)
  effectivePower: function(lenspower, oldVertex, newVertex) {
    const vertexChange = (newVertex - oldVertex) / 1000; // mm to meters
    const effectivePower = lenspower / (1 - (lenspower * vertexChange));
    
    return {
      originalPower: this.formatPower(lenspower),
      effectivePower: this.formatPower(effectivePower),
      vertexChange: `${oldVertex}mm → ${newVertex}mm`,
      formula: 'Fe = Fl / (1 - d × Fl)',
      calculation: `${lenspower} / (1 - ${vertexChange.toFixed(3)} × ${lenspower}) = ${effectivePower.toFixed(2)}D`,
      explanation: `Moving the lens ${Math.abs(vertexChange * 1000).toFixed(0)}mm ${vertexChange > 0 ? 'away from' : 'toward'} the eye changes effective power to ${effectivePower.toFixed(2)}D`
    };
  },
  
  // Sag (Center Thickness) Estimation
  sagCalculation: function(power, diameter, refractiveIndex = 1.498) {
    const radius = ((refractiveIndex - 1) / power) * 1000; // in mm
    const radiusMm = Math.abs(radius);
    const diameterRadius = diameter / 2;
    
    // Sag formula: h = r - sqrt(r² - (d/2)²)
    const sag = radiusMm - Math.sqrt(Math.pow(radiusMm, 2) - Math.pow(diameterRadius, 2));
    
    return {
      sag: sag.toFixed(2),
      unit: 'mm',
      power: this.formatPower(power),
      diameter: diameter,
      refractiveIndex: refractiveIndex,
      formula: 'h = r - √(r² - (d/2)²)',
      calculation: `${radiusMm.toFixed(1)} - √(${radiusMm.toFixed(1)}² - ${diameterRadius}²) = ${sag.toFixed(2)}mm`,
      explanation: `A ${this.formatPower(power)}D lens with ${diameter}mm diameter has approximately ${sag.toFixed(2)}mm center thickness difference`
    };
  },
  
  // Minimum Blank Size
  minimumBlankSize: function(eyeSize, bridge, decentration) {
    const effectiveSum = eyeSize + bridge + (2 * decentration);
    
    return {
      minimumBlank: effectiveSum.toFixed(1),
      unit: 'mm',
      eyeSize: eyeSize,
      bridge: bridge,
      decentration: decentration,
      formula: 'MBS = A + B + (2 × decentration)',
      calculation: `${eyeSize} + ${bridge} + (2 × ${decentration}) = ${effectiveSum.toFixed(1)}mm`,
      explanation: `Minimum blank size needed is ${effectiveSum.toFixed(1)}mm to accommodate decentration`
    };
  },
  
  // ANSI Tolerance Check
  ansiTolerance: function(prescribedPower, measuredPower, lensType = 'SV') {
    const tolerances = {
      'SV': {
        '0-2': 0.13,
        '2-3.5': 0.15,
        '3.5-6.5': 0.18,
        '6.5+': 0.25
      },
      'Multifocal': {
        '0-2': 0.16,
        '2-3.5': 0.18,
        '3.5-6.5': 0.20,
        '6.5+': 0.30
      }
    };
    
    const absPower = Math.abs(prescribedPower);
    let tolerance;
    
    if (absPower <= 2) tolerance = tolerances[lensType]['0-2'];
    else if (absPower <= 3.5) tolerance = tolerances[lensType]['2-3.5'];
    else if (absPower <= 6.5) tolerance = tolerances[lensType]['3.5-6.5'];
    else tolerance = tolerances[lensType]['6.5+'];
    
    const difference = Math.abs(measuredPower - prescribedPower);
    const withinTolerance = difference <= tolerance;
    
    return {
      prescribed: this.formatPower(prescribedPower),
      measured: this.formatPower(measuredPower),
      difference: difference.toFixed(2),
      tolerance: `±${tolerance.toFixed(2)}D`,
      withinTolerance: withinTolerance,
      status: withinTolerance ? '✓ PASS' : '✗ FAIL',
      standard: 'ANSI Z80.1-2022',
      explanation: `${lensType} lens with ${this.formatPower(prescribedPower)}D has tolerance of ±${tolerance.toFixed(2)}D. Measured difference is ${difference.toFixed(2)}D`
    };
  },
  
  // Generate calculator UI
  generateUI: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="calculator-tool">
        <h3>📐 Optical Formula Calculator</h3>
        
        <div class="calc-section">
          <h4>Prentice's Rule</h4>
          <input type="number" id="prentice-power" placeholder="Lens Power (D)" step="0.25">
          <input type="number" id="prentice-decentration" placeholder="Decentration (mm)" step="0.5">
          <button onclick="Calculator.calculatePrentice()">Calculate Prism</button>
          <div id="prentice-result" class="calc-result"></div>
        </div>
        
        <div class="calc-section">
          <h4>Vergence</h4>
          <input type="number" id="vergence-distance" placeholder="Distance (cm)" step="1">
          <button onclick="Calculator.calculateVergence()">Calculate Vergence</button>
          <div id="vergence-result" class="calc-result"></div>
        </div>
        
        <div class="calc-section">
          <h4>Lens Transposition</h4>
          <input type="number" id="trans-sphere" placeholder="Sphere" step="0.25">
          <input type="number" id="trans-cylinder" placeholder="Cylinder" step="0.25">
          <input type="number" id="trans-axis" placeholder="Axis" min="1" max="180">
          <button onclick="Calculator.calculateTranspose()">Transpose</button>
          <div id="transpose-result" class="calc-result"></div>
        </div>
        
        <div class="calc-section">
          <h4>Monocular PD</h4>
          <input type="number" id="mono-pd" placeholder="Binocular PD (mm)" step="0.5">
          <button onclick="Calculator.calculateMonoPD()">Calculate</button>
          <div id="mono-result" class="calc-result"></div>
        </div>
      </div>
    `;
  },
  
  // UI calculation methods
  calculatePrentice: function() {
    const power = parseFloat(document.getElementById('prentice-power').value);
    const dec = parseFloat(document.getElementById('prentice-decentration').value);
    const result = this.prenticeRule(power, dec);
    document.getElementById('prentice-result').innerHTML = this.formatResult(result);
  },
  
  calculateVergence: function() {
    const distance = parseFloat(document.getElementById('vergence-distance').value);
    const result = this.vergence(distance);
    document.getElementById('vergence-result').innerHTML = this.formatResult(result);
  },
  
  calculateTranspose: function() {
    const sph = parseFloat(document.getElementById('trans-sphere').value);
    const cyl = parseFloat(document.getElementById('trans-cylinder').value);
    const axis = parseInt(document.getElementById('trans-axis').value);
    const result = this.transpose(sph, cyl, axis);
    document.getElementById('transpose-result').innerHTML = this.formatResult(result);
  },
  
  calculateMonoPD: function() {
    const pd = parseFloat(document.getElementById('mono-pd').value);
    const result = this.monocularPD(pd);
    document.getElementById('mono-result').innerHTML = this.formatResult(result);
  },
  
  // Format result for display
  formatResult: function(result) {
    let html = '<div class="calc-result-content">';
    Object.keys(result).forEach(key => {
      if (key !== 'steps') {
        html += `<p><strong>${key}:</strong> ${result[key]}</p>`;
      } else {
        html += '<p><strong>Steps:</strong></p><ol>';
        result[key].forEach(step => {
          html += `<li>${step}</li>`;
        });
        html += '</ol>';
      }
    });
    html += '</div>';
    return html;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.Calculator = Calculator;
}
