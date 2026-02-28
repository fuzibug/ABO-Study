// ═══════════════════════════════════════════════════════════════════════════════
// Daily Challenge — Unique, Challenging Real-World ABO Scenarios
// One complex question per day with multi-domain integration
// ═══════════════════════════════════════════════════════════════════════════════

const DailyChallenge = {
  // Storage key
  STORAGE_KEY: 'daily_challenge_data',
  
  // Get today's date string (YYYY-MM-DD)
  getTodayString: function() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  },
  
  // Get stored data
  getData: function() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      totalCompleted: 0
    };
  },
  
  // Save data
  saveData: function(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },
  
  // Check if today's challenge is completed
  isCompletedToday: function() {
    const data = this.getData();
    return data.completedDates.includes(this.getTodayString());
  },
  
  // Mark today as completed
  markCompleted: function(correct) {
    const today = this.getTodayString();
    const data = this.getData();
    
    if (!data.completedDates.includes(today)) {
      data.completedDates.push(today);
      data.totalCompleted++;
      
      // Update streaks
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (data.lastCompletedDate === yesterdayStr) {
        data.currentStreak++;
      } else if (data.lastCompletedDate !== today) {
        data.currentStreak = 1;
      }
      
      data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
      data.lastCompletedDate = today;
      
      this.saveData(data);
    }
    
    return data;
  },
  
  // Generate today's question using deterministic seed
  getTodaysQuestion: function() {
    const today = this.getTodayString();
    const seed = this.hashString(today);
    
    // Use seed to select question type
    const questionIndex = seed % this.challengeGenerators.length;
    const generator = this.challengeGenerators[questionIndex];
    
    return generator(seed);
  },
  
  // Simple hash function for deterministic randomness
  hashString: function(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  },
  
  // Seeded random number generator
  seededRandom: function(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  },
  
  // Helper: choice with seed
  choice: function(arr, seed) {
    return arr[Math.floor(this.seededRandom(seed) * arr.length)];
  },
  
  // Helper: random int with seed
  randInt: function(min, max, seed) {
    return Math.floor(this.seededRandom(seed) * (max - min + 1)) + min;
  },
  
  // Helper: random float with seed
  randFloat: function(min, max, decimals, seed) {
    const val = this.seededRandom(seed) * (max - min) + min;
    return parseFloat(val.toFixed(decimals));
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CHALLENGING SCENARIO GENERATORS
  // ═══════════════════════════════════════════════════════════════════════════
  
  challengeGenerators: [
    // 1. Complex Prentice + Frame Selection
    function(seed) {
      const powers = [-6.00, -5.00, -4.50, -4.00, 4.00, 4.50, 5.00, 6.00];
      const power = DailyChallenge.choice(powers, seed);
      const patientPD = DailyChallenge.randInt(58, 66, seed * 2);
      const frameA = DailyChallenge.randInt(50, 56, seed * 3);
      const frameDBL = DailyChallenge.randInt(16, 20, seed * 4);
      
      const framePD = frameA + frameDBL;
      const decentPerEye = Math.abs((patientPD - framePD) / 2);
      const prism = Math.abs(power * (decentPerEye / 10));
      
      const isPlusPower = power > 0;
      const isWider = patientPD > framePD;
      
      let baseDir;
      if (isPlusPower) {
        baseDir = isWider ? 'BO' : 'BI';
      } else {
        baseDir = isWider ? 'BI' : 'BO';
      }
      
      const correctAnswer = `${prism.toFixed(1)}Δ ${baseDir} per eye`;
      
      const fmtD = (v) => (v >= 0 ? '+' : '') + v.toFixed(2);
      
      return {
        domain: 'dispensing',
        difficulty: 'advanced',
        question: `A patient with PD ${patientPD}mm and Rx ${fmtD(power)} DS selects a frame with A=${frameA}mm and DBL=${frameDBL}mm. What horizontal prism will be induced per eye, and what is the base direction?`,
        options: DailyChallenge.shuffleOptions([
          correctAnswer,
          `${(prism * 0.5).toFixed(1)}Δ ${baseDir} per eye`,
          `${prism.toFixed(1)}Δ ${baseDir === 'BO' ? 'BI' : 'BO'} per eye`,
          `${(prism * 1.5).toFixed(1)}Δ ${baseDir} per eye`
        ], seed),
        explanation: `Frame PD = A + DBL = ${frameA} + ${frameDBL} = ${framePD}mm. Patient PD = ${patientPD}mm. Decentration per eye = |${patientPD} - ${framePD}| / 2 = ${decentPerEye.toFixed(1)}mm ${isWider ? 'temporal' : 'nasal'}. Prism = ${Math.abs(power).toFixed(2)} × ${(decentPerEye / 10).toFixed(2)} = ${prism.toFixed(1)}Δ per eye. ${isPlusPower ? 'Plus' : 'Minus'} lens decentered ${isWider ? 'temporally' : 'nasally'} = ${baseDir} (${baseDir === 'BO' ? 'base out' : 'base in'}).`,
        source: 'ABO: Prentice\'s Rule + Frame Selection Integration',
        get correct() { return this.options.indexOf(correctAnswer); }
      };
    },
    
    // 2. PAL Fitting Height Edge Case
    function(seed) {
      const corridorLengths = [
        {type: 'short', min: 11, max: 14, ideal: 16},
        {type: 'standard', min: 14, max: 17, ideal: 20},
        {type: 'long', min: 17, max: 20, ideal: 24}
      ];
      
      const corridor = DailyChallenge.choice(corridorLengths, seed);
      const frameB = DailyChallenge.randInt(36, 48, seed * 2);
      const availableFH = DailyChallenge.randInt(corridor.min - 2, corridor.ideal + 2, seed * 3);
      
      const isAdequate = availableFH >= corridor.ideal;
      const correctAnswer = isAdequate 
        ? `Yes, ${availableFH}mm ≥ ${corridor.ideal}mm minimum for ${corridor.type} corridor`
        : `No, ${availableFH}mm < ${corridor.ideal}mm minimum for ${corridor.type} corridor`;
      
      return {
        domain: 'multifocal_design',
        difficulty: 'expert',
        question: `A presbyope selects a frame with B=${frameB}mm. The measured fitting height is ${availableFH}mm. Can a ${corridor.type}-corridor PAL (requires ${corridor.ideal}mm minimum FH) be safely fit?`,
        options: DailyChallenge.shuffleOptions([
          correctAnswer,
          isAdequate ? `No, need ${corridor.ideal + 4}mm minimum` : `Yes, ${availableFH}mm is sufficient`,
          `Need to remeasure, cannot determine`,
          `Yes, any FH works with modern designs`
        ], seed),
        explanation: `${corridor.type.charAt(0).toUpperCase() + corridor.type.slice(1)}-corridor PALs typically require ${corridor.ideal}mm minimum fitting height (corridor ${corridor.min}-${corridor.max}mm + near zone ~4-6mm). Available FH = ${availableFH}mm. ${isAdequate ? 'This meets the requirement.' : 'This is insufficient — patient would not have adequate access to near zone. Recommend a different frame with deeper B measurement or switch to shorter corridor design.'}`,
        source: 'ABO: Progressive Lens Fitting — Critical Height Calculation',
        get correct() { return this.options.indexOf(correctAnswer); }
      };
    },
    
    // 3. Vertex Distance Compensation
    function(seed) {
      const highPowers = [-10.00, -9.00, -8.50, -8.00, 8.00, 8.50, 9.00, 10.00];
      const power = DailyChallenge.choice(highPowers, seed);
      const oldVD = 12;
      const newVD = DailyChallenge.choice([10, 14, 16], seed * 2);
      const deltaVD = (newVD - oldVD) / 1000; // Convert to meters
      
      // Effectivity formula: F' = F / (1 - d*F)
      const compensatedPower = power / (1 - deltaVD * power);
      const delta = Math.abs(compensatedPower - power);
      
      const needsCompensation = delta >= 0.25;
      const correctAnswer = needsCompensation
        ? `Yes, compensate to ${(compensatedPower >= 0 ? '+' : '')}${compensatedPower.toFixed(2)}D`
        : `No, change <0.25D, clinically insignificant`;
      
      const fmtD = (v) => (v >= 0 ? '+' : '') + v.toFixed(2);
      
      return {
        domain: 'vertex_effectivity',
        difficulty: 'expert',
        question: `Patient refracted at ${oldVD}mm vertex distance: ${fmtD(power)} DS. Final frame fits at ${newVD}mm VD. Is compensation required?`,
        options: DailyChallenge.shuffleOptions([
          correctAnswer,
          needsCompensation ? `No, change <0.25D` : `Yes, compensate to ${fmtD(power + 0.50)}D`,
          `Only if patient complains`,
          `Vertex distance doesn't matter for this power`
        ], seed),
        explanation: `Vertex distance changed by ${Math.abs(deltaVD * 1000).toFixed(0)}mm. For ${fmtD(power)}D, effectivity formula: F' = F / (1 - d×F) = ${power.toFixed(2)} / (1 - ${deltaVD.toFixed(4)} × ${power.toFixed(2)}) = ${compensatedPower.toFixed(2)}D. Change = ${delta.toFixed(2)}D. ${needsCompensation ? 'Clinically significant (≥0.25D), compensation required.' : 'Clinically insignificant (<0.25D), no compensation needed.'}`,
        source: 'ABO: Vertex Distance & Effectivity — High Rx Compensation',
        get correct() { return this.options.indexOf(correctAnswer); }
      };
    },
    
    // 4. ANSI Tolerance Edge Case
    function(seed) {
      const baseRx = [-3.50, -3.00, -2.50, 2.50, 3.00, 3.50];
      const basePower = DailyChallenge.choice(baseRx, seed);
      const tolerance = 0.12;
      const deviations = [-0.15, -0.13, -0.12, -0.06, 0.06, 0.12, 0.13, 0.15];
      const deviation = DailyChallenge.choice(deviations, seed * 2);
      const measuredPower = basePower + deviation;
      
      const withinTolerance = Math.abs(deviation) <= tolerance;
      const correctAnswer = withinTolerance ? 'Accept' : 'Reject and remake';
      
      const fmtD = (v) => (v >= 0 ? '+' : '') + v.toFixed(2);
      
      return {
        domain: 'regulatory_citations',
        difficulty: 'advanced',
        question: `Rx ordered: ${fmtD(basePower)} DS. Lensometer reads: ${fmtD(measuredPower)} DS. ANSI Z80.1-2022 tolerance: ±0.12D for powers ≤±6.50D. Accept or reject?`,
        options: DailyChallenge.shuffleOptions([
          correctAnswer,
          withinTolerance ? 'Reject, outside tolerance' : 'Accept, within tolerance',
          'Warn patient but dispense',
          'Tolerance doesn\'t apply to sphere power'
        ], seed),
        explanation: `Ordered: ${fmtD(basePower)}D. Measured: ${fmtD(measuredPower)}D. Deviation: ${fmtD(deviation)}D. ANSI Z80.1-2022: sphere/cylinder power tolerance = ±0.12D for |power| ≤ 6.50D. ${withinTolerance ? `|${deviation.toFixed(2)}| ≤ 0.12D → PASS` : `|${deviation.toFixed(2)}| > 0.12D → FAIL`}. ${correctAnswer}.`,
        source: 'ANSI Z80.1-2022 — Prescription Lens Power Tolerances',
        get correct() { return this.options.indexOf(correctAnswer); }
      };
    },
    
    // 5. Toric Contact Lens Rotation Compensation (LARS)
    function(seed) {
      const axes = [10, 20, 30, 45, 60, 75, 90, 105, 120, 135, 150, 160, 170];
      const orderedAxis = DailyChallenge.choice(axes, seed);
      const rotationDegrees = DailyChallenge.choice([5, 10, 15, 20, 25], seed * 2);
      const direction = DailyChallenge.choice(['clockwise', 'counterclockwise'], seed * 3);
      
      // LARS: Left Add, Right Subtract
      const newAxis = direction === 'counterclockwise'
        ? orderedAxis - rotationDegrees
        : orderedAxis + rotationDegrees;
      
      // Normalize to 1-180
      let normalizedAxis = newAxis;
      if (normalizedAxis <= 0) normalizedAxis += 180;
      if (normalizedAxis > 180) normalizedAxis -= 180;
      
      const correctAnswer = `Reorder with axis ${normalizedAxis}°`;
      
      return {
        domain: 'toric_stabilization',
        difficulty: 'advanced',
        question: `Toric contact lens ordered with axis ${orderedAxis}° rotates ${rotationDegrees}° ${direction} on the eye. Using LARS rule, what axis should be reordered?`,
        options: DailyChallenge.shuffleOptions([
          correctAnswer,
          `Reorder with axis ${orderedAxis}°`, // No change
          `Reorder with axis ${direction === 'clockwise' ? orderedAxis - rotationDegrees : orderedAxis + rotationDegrees}°`, // Wrong direction
          `Cannot determine without over-refraction`
        ], seed),
        explanation: `LARS rule: Left (counterclockwise) rotation = Add to axis. Right (clockwise) rotation = Subtract from axis. Lens rotated ${rotationDegrees}° ${direction}. ${direction === 'counterclockwise' ? `Subtract ${rotationDegrees}° from ordered axis` : `Add ${rotationDegrees}° to ordered axis`}: ${orderedAxis}° ${direction === 'counterclockwise' ? '-' : '+'} ${rotationDegrees}° = ${normalizedAxis}°. Reorder at ${normalizedAxis}° to compensate.`,
        source: 'ABO: Toric Contact Lens Stabilization — LARS Compensation',
        get correct() { return this.options.indexOf(correctAnswer); }
      };
    },
    
    // 6. Pediatric Safety Compliance
    function(seed) {
      const ages = [3, 5, 7, 9, 11, 14];
      const age = DailyChallenge.choice(ages, seed);
      const materials = [
        {name: 'CR-39', compliant: false},
        {name: 'Crown glass', compliant: false},
        {name: 'Polycarbonate', compliant: true},
        {name: 'Trivex', compliant: true},
        {name: 'High-index 1.67', compliant: false}
      ];
      const material = DailyChallenge.choice(materials, seed * 2);
      
      const correctAnswer = material.compliant 
        ? `Compliant — ${material.name} meets 21 CFR 801.410`
        : `Non-compliant — ${material.name} fails impact requirements`;
      
      return {
        domain: 'pediatric_optics',
        difficulty: 'intermediate',
        question: `${age}-year-old child's Rx filled in ${material.name}. Is this compliant with FDA 21 CFR 801.410 impact resistance for pediatric eyewear?`,
        options: DailyChallenge.shuffleOptions([
          correctAnswer,
          material.compliant ? 'Non-compliant, only polycarbonate allowed' : 'Compliant, passes drop-ball test',
          'Compliant if AR coating applied',
          'Depends on prescription power'
        ], seed),
        explanation: `FDA 21 CFR 801.410 mandates that lenses for children must pass drop-ball impact test OR be made from inherently impact-resistant materials. Polycarbonate and Trivex inherently meet this standard. CR-39, crown glass, and standard high-index require specific impact-resistant treatment. ${material.compliant ? `${material.name} inherently compliant.` : `${material.name} does not inherently meet pediatric impact standards without specific treatment.`}`,
        source: '21 CFR 801.410 — Pediatric Impact Resistance Requirements',
        get correct() { return this.options.indexOf(correctAnswer); }
      };
    },
    
    // 7. Oblique Prism Resolution
    function(seed) {
      const prismMags = [3.0, 3.5, 4.0, 4.5, 5.0];
      const angles = [30, 45, 60];
      const prism = DailyChallenge.choice(prismMags, seed);
      const angle = DailyChallenge.choice(angles, seed * 2);
      
      const radians = angle * (Math.PI / 180);
      const horizontal = prism * Math.cos(radians);
      const vertical = prism * Math.sin(radians);
      
      const correctAnswer = `${horizontal.toFixed(1)}Δ H, ${vertical.toFixed(1)}Δ V`;
      
      return {
        domain: 'prism_resolution',
        difficulty: 'expert',
        question: `Patient prescribed ${prism.toFixed(1)}Δ at ${angle}°. Resolve into horizontal and vertical components:`,
        options: DailyChallenge.shuffleOptions([
          correctAnswer,
          `${vertical.toFixed(1)}Δ H, ${horizontal.toFixed(1)}Δ V`, // Swapped
          `${(prism * 0.5).toFixed(1)}Δ H, ${(prism * 0.5).toFixed(1)}Δ V`, // Wrong calc
          `${prism.toFixed(1)}Δ H, ${prism.toFixed(1)}Δ V` // No resolution
        ], seed),
        explanation: `Oblique prism resolution: Horizontal = Total × cos(angle) = ${prism.toFixed(1)} × cos(${angle}°) = ${horizontal.toFixed(1)}Δ. Vertical = Total × sin(angle) = ${prism.toFixed(1)} × sin(${angle}°) = ${vertical.toFixed(1)}Δ. This allows splitting the prism across horizontal and vertical axes for lens manufacture.`,
        source: 'ABO: Prism Resolution & Combination — Oblique Prism',
        get correct() { return this.options.indexOf(correctAnswer); }
      };
    },
    
    // 8. Multifocal Troubleshooting
    function(seed) {
      const complaints = [
        {complaint: 'blurry near vision', cause: 'Seg height too low', fix: 'Raise bifocal segment 2-3mm'},
        {complaint: 'can\'t see distance clearly', cause: 'Seg height too high', fix: 'Lower segment or switch to progressive'},
        {complaint: 'swim effect in PALs', cause: 'Peripheral astigmatism zones', fix: 'Educate patient; consider short-corridor design if severe'},
        {complaint: 'image jump when reading', cause: 'Executive bifocal with high add', fix: 'Expected with full-aperture segs; educate or switch to PAL'}
      ];
      
      const scenario = DailyChallenge.choice(complaints, seed);
      const correctAnswer = scenario.fix;
      
      const wrongFixes = [
        'Increase add power',
        'Change lens material to polycarbonate',
        'Add AR coating',
        'Adjust nose pads'
      ].filter(f => f !== correctAnswer);
      
      return {
        domain: 'advanced_dispensing',
        difficulty: 'advanced',
        question: `Bifocal patient reports "${scenario.complaint}" after picking up new glasses. Most likely cause and solution?`,
        options: DailyChallenge.shuffleOptions([
          correctAnswer,
          ...DailyChallenge.shuffleArray(wrongFixes, seed).slice(0, 3)
        ], seed),
        explanation: `Complaint: "${scenario.complaint}". Cause: ${scenario.cause}. Solution: ${scenario.fix}. This is a common multifocal dispensing issue that requires understanding of segment positioning and progressive lens optics.`,
        source: 'ABO: Advanced Dispensing & Troubleshooting — Multifocals',
        get correct() { return this.options.indexOf(correctAnswer); }
      };
    }
  ],
  
  // Helper: shuffle array with seed
  shuffleArray: function(arr, seed) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.seededRandom(seed + i) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },
  
  // Helper: shuffle options and set correct index
  shuffleOptions: function(options, seed) {
    return this.shuffleArray(options, seed);
  },
  
  // Get stats
  getStats: function() {
    return this.getData();
  },
  
  // Reset progress (for testing)
  reset: function() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.DailyChallenge = DailyChallenge;
  console.log('✅ Daily Challenge system loaded');
}
