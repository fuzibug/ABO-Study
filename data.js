// ============================================
// PROCEDURAL QUESTION GENERATOR
// Questions with random values + no repeats
// ============================================

// Question generator functions
const questionGenerators = {
    general: [
        // Static conceptual questions
        () => ({
            q: "Presbyopia typically begins around what age?",
            opts: ["25 years", "35 years", "40 years", "50 years"],
            correct: 2,
            exp: "Presbyopia, the age-related loss of accommodation, typically begins around age 40 as the lens loses flexibility."
        }),
        () => ({
            q: "What is the average refractive power of the cornea?",
            opts: ["+20D", "+43D", "+60D", "+15D"],
            correct: 1,
            exp: "The cornea provides approximately +43 diopters of focusing power, about 2/3 of the eye's total refractive power."
        }),
        () => ({
            q: "What is the condition where light focuses in front of the retina?",
            opts: ["Hyperopia", "Myopia", "Presbyopia", "Astigmatism"],
            correct: 1,
            exp: "Myopia (nearsightedness) occurs when light focuses in front of the retina, requiring minus lenses for correction."
        }),
        () => ({
            q: "Which part of the eye is responsible for central, detailed vision?",
            opts: ["Peripheral retina", "Macula", "Optic disc", "Ciliary body"],
            correct: 1,
            exp: "The macula is the central part of the retina responsible for sharp, detailed central vision."
        }),
        () => ({
            q: "What refractive condition requires cylinder correction?",
            opts: ["Myopia", "Hyperopia", "Astigmatism", "Presbyopia"],
            correct: 2,
            exp: "Astigmatism is caused by irregular corneal curvature and requires cylinder correction in the prescription."
        }),
        () => ({
            q: "What is anisometropia?",
            opts: ["Different prescription in each eye", "Unequal pupil size", "Color blindness", "Double vision"],
            correct: 0,
            exp: "Anisometropia is a condition where the two eyes have significantly different refractive powers, requiring different prescription strengths."
        }),
        () => ({
            q: "The crystalline lens is held in place by:",
            opts: ["Cornea", "Zonules", "Iris", "Vitreous"],
            correct: 1,
            exp: "Zonules (suspensory ligaments) attach the lens to the ciliary body, holding it in position and allowing it to change shape for accommodation."
        }),
        () => ({
            q: "What is the normal range for intraocular pressure (IOP)?",
            opts: ["5-10 mmHg", "10-21 mmHg", "22-30 mmHg", "30-40 mmHg"],
            correct: 1,
            exp: "Normal IOP ranges from 10-21 mmHg. Elevated IOP (>21 mmHg) is a risk factor for glaucoma."
        }),
        () => ({
            q: "Hyperopia is corrected with:",
            opts: ["Minus lenses", "Plus lenses", "Cylinder only", "Prism only"],
            correct: 1,
            exp: "Hyperopia (farsightedness) requires plus (+) lenses to add converging power so light focuses on the retina rather than behind it."
        }),
        () => ({
            q: "The blind spot in the visual field corresponds to:",
            opts: ["Macula", "Fovea", "Optic disc", "Peripheral retina"],
            correct: 2,
            exp: "The optic disc (optic nerve head) has no photoreceptors, creating a blind spot in the visual field where the nerve exits the eye."
        }),
        () => ({
            q: "Which layer of the eye contains rods and cones?",
            opts: ["Cornea", "Sclera", "Retina", "Choroid"],
            correct: 2,
            exp: "The retina contains photoreceptors (rods for low light, cones for color vision) that convert light into neural signals."
        }),
        () => {
            const age = randomChoice([60, 65, 70]);
            const add = age === 60 ? "+2.25D" : age === 65 ? "+2.50D" : "+2.75D";
            const correctIdx = age === 60 ? 2 : age === 65 ? 3 : 3;
            return {
                q: `What is the typical add power for a ${age}-year-old presbyopic patient?`,
                opts: ["+1.00D", "+1.50D", "+2.00D", add],
                correct: correctIdx,
                exp: `By age ${age}, most patients require ${add} add power for near vision as accommodation continues to diminish.`
            };
        },
        () => ({
            q: "Accommodation is controlled by:",
            opts: ["Iris", "Ciliary muscle", "Cornea", "Vitreous"],
            correct: 1,
            exp: "The ciliary muscle contracts to relax zonules, allowing the lens to become more convex for near vision."
        }),
        () => ({
            q: "Emmetropia is defined as:",
            opts: ["Nearsightedness", "Farsightedness", "Normal vision", "Astigmatism"],
            correct: 2,
            exp: "Emmetropia means normal vision where light focuses precisely on the retina without corrective lenses."
        }),
        () => ({
            q: "Which condition causes progressive corneal thinning?",
            opts: ["Cataract", "Glaucoma", "Keratoconus", "AMD"],
            correct: 2,
            exp: "Keratoconus is progressive corneal thinning that produces irregular astigmatism, often requiring specialty contact lenses."
        })
    ],
    
    optics: [
        // Dynamic prism calculations with random values
        () => {
            const power = randomChoice([2, 3, 4, 5, 6, 8]);
            const decentMM = randomChoice([2, 3, 4, 5]);
            const decentCM = (decentMM / 10).toFixed(1);
            const prism = (power * parseFloat(decentCM)).toFixed(1);
            const direction = randomChoice(['in', 'out']);
            const base = direction === 'in' ? 'BI' : 'BO';
            
            return {
                q: `Using Prentice's Rule, what prism is induced by a -${power}.00D lens decentered ${decentMM}mm ${direction}?`,
                opts: [
                    `${prism}Δ BO`,
                    `${prism}Δ BI`,
                    `${(parseFloat(prism) / 10).toFixed(2)}Δ BO`,
                    `${(parseFloat(prism) / 10).toFixed(2)}Δ BI`
                ],
                correct: direction === 'in' ? 1 : 0,
                exp: `Δ = F × d = ${power}.00 × ${decentCM}cm = ${prism}Δ. Minus lens decentered ${direction.toUpperCase()} creates BASE ${direction === 'in' ? 'IN' : 'OUT'} prism (opposite direction).`
            };
        },
        () => {
            const power = randomChoice([2, 4, 5, 8, 10]);
            const focalM = (1 / power).toFixed(2);
            const focalCM = (100 / power).toFixed(0);
            
            return {
                q: `What is the focal length of a +${power}.00D lens?`,
                opts: [
                    `${power} meters`,
                    `${focalM} meters`,
                    `${focalCM} centimeters`,
                    `Both B and C`
                ],
                correct: 3,
                exp: `f = 1/D = 1/${power} = ${focalM} meters = ${focalCM} centimeters. Both answers are equivalent.`
            };
        },
        () => ({
            q: "Which lens material has the highest refractive index?",
            opts: ["CR-39 (1.498)", "Polycarbonate (1.586)", "High-Index 1.67", "High-Index 1.74"],
            correct: 3,
            exp: "High-Index 1.74 has the highest refractive index, making it the thinnest lens material available for any given prescription."
        }),
        () => ({
            q: "For plus lenses, the base direction of induced prism is:",
            opts: ["Opposite to decentration", "Same as decentration", "Always base down", "Independent of decentration"],
            correct: 1,
            exp: "For plus lenses, the base direction is the SAME as the decentration direction. For minus lenses, it's opposite."
        }),
        () => ({
            q: "What happens to lens thickness when refractive index increases?",
            opts: ["Increases", "Decreases", "Stays the same", "Depends on power only"],
            correct: 1,
            exp: "Higher refractive index materials bend light more efficiently, allowing thinner lenses for the same prescription power."
        }),
        () => {
            const power = randomChoice([4, 5, 6, 8]);
            const decentMM = randomChoice([2, 3, 4]);
            const decentCM = (decentMM / 10).toFixed(1);
            const prism = (power * parseFloat(decentCM)).toFixed(1);
            
            return {
                q: `A -${power}.00D lens decentered ${decentMM}mm out creates what prism?`,
                opts: [
                    `${prism}Δ BI`,
                    `${prism}Δ BO`,
                    `${(parseFloat(prism) / 10).toFixed(2)}Δ BI`,
                    `${prism}Δ BD`
                ],
                correct: 0,
                exp: `Δ = ${power}.00 × ${decentCM}cm = ${prism}Δ. Minus lens decentered OUT creates BASE IN prism (opposite direction).`
            };
        },
        () => ({
            q: "The Abbe value measures:",
            opts: ["Lens thickness", "Chromatic aberration", "Impact resistance", "UV protection"],
            correct: 1,
            exp: "Abbe value measures chromatic aberration (color fringing). Higher values mean less aberration and better optical quality."
        }),
        () => {
            const sphere = -randomChoice([1, 2, 3, 4]);
            const cyl = -randomChoice([0.75, 1.00, 1.25, 1.50, 1.75, 2.00]);
            const axis = randomChoice([90, 180, 45, 135]);
            const newSphere = (sphere + cyl).toFixed(2);
            const newCyl = Math.abs(cyl).toFixed(2);
            const newAxis = axis === 90 ? 180 : axis === 180 ? 90 : (axis + 90) % 180;
            
            return {
                q: `Transpose ${sphere.toFixed(2)} ${cyl.toFixed(2)} × ${String(axis).padStart(3, '0')} to plus cylinder form:`,
                opts: [
                    `${newSphere} +${newCyl} × ${String(newAxis).padStart(3, '0')}`,
                    `${newSphere} +${newCyl} × ${String(axis).padStart(3, '0')}`,
                    `${sphere.toFixed(2)} +${newCyl} × ${String(newAxis).padStart(3, '0')}`,
                    `${(sphere + cyl/2).toFixed(2)} +${newCyl} × ${String(axis).padStart(3, '0')}`
                ],
                correct: 0,
                exp: `Transposition: New sphere = ${sphere.toFixed(2)} + (${cyl.toFixed(2)}) = ${newSphere}, New cyl = +${newCyl}, New axis = ${axis} ± 90 = ${newAxis}.`
            };
        },
        () => ({
            q: "A lens with power +2.00 DS has what type of focal point?",
            opts: ["Virtual, in front of lens", "Real, behind lens", "No focal point", "At infinity"],
            correct: 1,
            exp: "Plus lenses converge light to a real focal point behind the lens. Minus lenses have virtual focal points in front."
        }),
        () => {
            const prism1 = randomChoice([1, 2, 3]);
            const prism2 = randomChoice([2, 3, 4]);
            const total = prism1 + prism2;
            
            return {
                q: `Combining ${prism1}Δ BI OD and ${prism2}Δ BI OS results in:`,
                opts: [
                    `${Math.abs(prism1 - prism2)}Δ total`,
                    `${total}Δ total`,
                    `${(total / 2).toFixed(1)}Δ average`,
                    `Cannot combine`
                ],
                correct: 1,
                exp: `Horizontal prism in the same direction (both BI) adds together: ${prism1}Δ + ${prism2}Δ = ${total}Δ total BI prism effect.`
            };
        },
        () => {
            const sphere = randomChoice([1, 2, 3, 4]);
            const cyl = randomChoice([0.50, 1.00, 1.50, 2.00]);
            const se = (sphere + cyl / 2).toFixed(2);
            
            return {
                q: `What is the spherical equivalent of +${sphere.toFixed(2)} +${cyl.toFixed(2)} × 090?`,
                opts: [
                    `+${se}D`,
                    `+${sphere.toFixed(2)}D`,
                    `+${(sphere + cyl).toFixed(2)}D`,
                    `+${(cyl / 2).toFixed(2)}D`
                ],
                correct: 0,
                exp: `Spherical Equivalent = Sphere + (Cylinder ÷ 2) = +${sphere.toFixed(2)} + (+${cyl.toFixed(2)} ÷ 2) = +${se}D.`
            };
        },
        () => ({
            q: "Spherical aberration is reduced by:",
            opts: ["Increasing lens diameter", "Aspheric lens design", "Higher Abbe value", "Thicker lens center"],
            correct: 1,
            exp: "Aspheric designs flatten the lens periphery, reducing spherical aberration where light through lens edges focuses differently than center."
        }),
        () => {
            const baseCurve = randomChoice([4, 6, 8]);
            const index = 1.530;
            const power = (((index - 1) * 1000) / baseCurve).toFixed(2);
            
            return {
                q: `A lens marked ${baseCurve}.00 base curve has approximately what front surface power?`,
                opts: [
                    `+${(parseFloat(power) - 1).toFixed(2)}D`,
                    `+${power}D`,
                    `+${(parseFloat(power) + 1).toFixed(2)}D`,
                    `+${baseCurve}.00D`
                ],
                correct: 1,
                exp: `Base curve relates to power: D ≈ (n-1) × 1000/r. For n=1.530: (0.530 × 1000)/${baseCurve} ≈ +${power}D on front surface.`
            };
        },
        () => {
            const power = randomChoice([-8, -10, -12]);
            const change = randomChoice([0.25, 0.50]);
            return {
                q: `Moving a ${power}.00D lens from 12mm to 14mm vertex distance requires approximately:`,
                opts: [
                    `No change`,
                    `${change}D more minus`,
                    `${change}D less minus`,
                    `${change * 2}D more minus`
                ],
                correct: 1,
                exp: `Moving high minus lenses further from the eye requires more minus power. For ${power}.00D, moving 2mm further requires approximately ${change}D more minus.`
            };
        }
    ],
    
    dispensing: [
        () => ({
            q: "What is the average adult pupillary distance (PD)?",
            opts: ["54-58mm", "60-64mm", "66-70mm", "72-76mm"],
            correct: 1,
            exp: "Average adult PD is 62-64mm. Men typically have slightly larger PDs (63-65mm) than women (60-62mm)."
        }),
        () => ({
            q: "Standard vertex distance is:",
            opts: ["8-10mm", "12-14mm", "16-18mm", "20-22mm"],
            correct: 1,
            exp: "Standard vertex distance is 12-14mm, the distance from the back of the lens to the front of the cornea."
        }),
        () => ({
            q: "Pantoscopic tilt typically ranges from:",
            opts: ["0-4 degrees", "5-7 degrees", "8-12 degrees", "15-20 degrees"],
            correct: 2,
            exp: "Pantoscopic tilt (downward tilt of frame front) typically ranges from 8-12 degrees for optimal optics and appearance."
        }),
        () => ({
            q: "For progressive lenses, the minimum fitting height is typically:",
            opts: ["12mm", "16mm", "18mm", "22mm"],
            correct: 2,
            exp: "Most progressive lenses require a minimum fitting height of 18mm to accommodate the progressive corridor and near zone."
        }),
        () => ({
            q: "When measuring seg height for bifocals, you measure to:",
            opts: ["Center of pupil", "Lower lid margin", "Bottom of frame", "Top of segment"],
            correct: 1,
            exp: "Seg height for bifocals is measured from the bottom of the lens to the lower lid margin (or slightly above for optimal reading position)."
        }),
        () => {
            const eyeSize = randomChoice([50, 52, 54, 56]);
            const bridge = randomChoice([16, 18, 20]);
            const temple = randomChoice([135, 140, 145]);
            
            return {
                q: `A frame marked ${eyeSize}-${bridge}-${temple} has:`,
                opts: [
                    `${eyeSize}mm eye size, ${bridge}mm bridge, ${temple}mm temple`,
                    `${eyeSize}mm bridge, ${bridge}mm eye, ${temple}mm temple`,
                    `${eyeSize}mm temple, ${bridge}mm bridge, ${temple}mm eye`,
                    `${eyeSize}mm total width`
                ],
                correct: 0,
                exp: `Frame measurements follow the format: Eye Size (lens width) - Bridge Width - Temple Length. So ${eyeSize}-${bridge}-${temple} = ${eyeSize}mm eye, ${bridge}mm bridge, ${temple}mm temple.`
            };
        },
        () => ({
            q: "When adjusting plastic (zyl) frames, you should:",
            opts: ["Use cold water", "Heat the adjustment area", "Bend at room temperature", "Never adjust plastic"],
            correct: 1,
            exp: "Plastic (zyl) frames require heat to adjust safely. Use a frame warmer or hot air to soften the material before bending to prevent cracking."
        }),
        () => ({
            q: "The boxing system measures frame size by:",
            opts: ["Inside lens opening", "Smallest rectangle around lens", "Actual lens diameter", "Distance between temples"],
            correct: 1,
            exp: "The boxing system uses the smallest rectangle that completely encloses the lens opening to determine eye size and other frame dimensions."
        }),
        () => {
            const power = -randomChoice([4, 5, 6, 7, 8]);
            return {
                q: `For a patient with ${power}.00D prescription, recommend:`,
                opts: [
                    "Large frame for fashion",
                    "Small frame with high-index",
                    "Any frame style",
                    "Rimless only"
                ],
                correct: 1,
                exp: `High minus lenses (${power}.00D) are thicker at edges. A smaller frame with high-index material minimizes edge thickness and weight for better cosmetics.`
            };
        },
        () => ({
            q: "Proper temple adjustment should have the temple:",
            opts: [
                "Touch behind ear immediately",
                "Follow head contour with bend at ear",
                "Remain straight to temple tip",
                "Angle away from head"
            ],
            correct: 1,
            exp: "Temples should follow the head contour and bend downward at the top of the ear, then extend along the ear without excessive pressure."
        }),
        () => ({
            q: "Monocular PD is measured from:",
            opts: [
                "Pupil to pupil",
                "Center of bridge to each pupil",
                "Outer canthus to pupil",
                "Temporal limbus to bridge"
            ],
            correct: 1,
            exp: "Monocular PD measures from the center of the bridge (nasal midline) to the center of each pupil individually, accounting for facial asymmetry."
        }),
        () => {
            const segWidth = randomChoice([25, 28, 35]);
            return {
                q: `An FT-${segWidth} bifocal segment is:`,
                opts: [
                    `${segWidth}mm wide`,
                    `${segWidth}mm high`,
                    `${segWidth}D add power`,
                    `${segWidth / 10}mm offset`
                ],
                correct: 0,
                exp: `FT-${segWidth} refers to a flat-top bifocal with a segment width of ${segWidth}mm.`
            };
        },
        () => ({
            q: "Face-form (wrap) angle typically ranges from:",
            opts: ["0-2 degrees", "3-7 degrees", "8-12 degrees", "15-20 degrees"],
            correct: 1,
            exp: "Face-form (wrap) angle typically ranges from 3-7 degrees. Excessive wrap can cause unwanted prism effects in higher prescriptions."
        }),
        () => ({
            q: "The optical center (OC) of a lens should be positioned:",
            opts: [
                "At the geometric center",
                "Directly in front of the pupil",
                "2mm below pupil center",
                "At the frame center"
            ],
            correct: 1,
            exp: "The optical center should be positioned directly in front of the pupil to minimize prismatic effects and ensure optimal vision."
        })
    ],
    
    products: [
        () => ({
            q: "Which lens material is most impact-resistant?",
            opts: ["CR-39", "High-Index 1.67", "Polycarbonate", "Glass"],
            correct: 2,
            exp: "Polycarbonate is the most impact-resistant lens material, 10x more resistant than CR-39, making it ideal for children and safety glasses."
        }),
        () => ({
            q: "Anti-reflective coating reduces surface reflections by approximately:",
            opts: ["2-4%", "5-7%", "8-12%", "15-20%"],
            correct: 2,
            exp: "AR coating reduces surface reflections from 8-12% to less than 1%, significantly improving clarity and reducing glare."
        }),
        () => ({
            q: "UV-B wavelengths range from:",
            opts: ["100-280nm", "280-315nm", "315-380nm", "380-500nm"],
            correct: 1,
            exp: "UV-B ranges from 280-315nm (most harmful). UV-A is 315-380nm. Quality lenses should block both ranges."
        }),
        () => ({
            q: "Progressive lens design with the widest intermediate zone is called:",
            opts: ["Soft design", "Hard design", "Aspheric design", "Short corridor"],
            correct: 0,
            exp: "Soft design progressives have wider intermediate zones with more gradual power changes, while hard designs have narrower but longer zones."
        }),
        () => ({
            q: "Photochromic lenses darken in response to:",
            opts: ["Heat", "UV light", "Visible light", "Infrared"],
            correct: 1,
            exp: "Photochromic lenses contain molecules that darken when exposed to UV light and return to clear when UV is removed."
        }),
        () => ({
            q: "What does the first number in frame measurements represent?",
            opts: ["Bridge width", "Eye size", "Temple length", "Total width"],
            correct: 1,
            exp: "Frame measurements (e.g., 52-18-140) follow the format: Eye Size - Bridge Width - Temple Length."
        }),
        () => ({
            q: "Trivex lens material is characterized by:",
            opts: [
                "Highest index available",
                "Good impact resistance and optical quality",
                "Lowest cost",
                "Darkest tint capability"
            ],
            correct: 1,
            exp: "Trivex (n=1.532) combines excellent impact resistance with superior optical quality (high Abbe value ~45) and lighter weight than polycarbonate."
        }),
        () => {
            const segWidth = randomChoice([25, 28, 35]);
            return {
                q: `A flat-top ${segWidth} bifocal has a segment:`,
                opts: [
                    `${segWidth}mm wide`,
                    `${segWidth}mm high`,
                    `${segWidth}D add power`,
                    `${segWidth / 10}mm offset`
                ],
                correct: 0,
                exp: `The number in bifocal names (FT-28, FT-35) refers to segment width in millimeters. FT-${segWidth} has a ${segWidth}mm wide segment.`
            };
        },
        () => ({
            q: "Mirror coating on sunglasses primarily:",
            opts: [
                "Blocks UV radiation",
                "Reduces visible light transmission",
                "Improves scratch resistance",
                "Eliminates all glare"
            ],
            correct: 1,
            exp: "Mirror coatings primarily reflect visible light, reducing transmission. They don't inherently block UV (needs separate UV coating/material)."
        }),
        () => ({
            q: "The minimum center thickness for CR-39 lenses is typically:",
            opts: ["0.5mm", "1.0mm", "2.0mm", "3.0mm"],
            correct: 2,
            exp: "CR-39 lenses typically require 2.0mm minimum center thickness for structural integrity and edging stability, especially in minus prescriptions."
        }),
        () => ({
            q: "Polarized lenses are most beneficial for:",
            opts: [
                "Night driving",
                "Computer use",
                "Water/snow glare reduction",
                "Indoor activities"
            ],
            correct: 2,
            exp: "Polarized lenses eliminate horizontally polarized light (glare) reflected from flat surfaces like water, snow, roads, making them ideal for outdoor activities."
        }),
        () => ({
            q: "High-index 1.67 lenses are approximately what percentage thinner than CR-39?",
            opts: ["10%", "20%", "30%", "40%"],
            correct: 2,
            exp: "High-index 1.67 lenses are approximately 30% thinner than CR-39 (1.498) for the same prescription power and frame size."
        }),
        () => ({
            q: "Blue light filtering lenses reduce wavelengths in what range?",
            opts: ["280-315nm", "315-380nm", "380-500nm", "500-600nm"],
            correct: 2,
            exp: "Blue light filters target high-energy visible (HEV) light in the 380-500nm range, which may cause digital eye strain and sleep disruption."
        }),
        () => {
            const index = randomChoice([1.60, 1.67, 1.74]);
            const abbe = index === 1.60 ? 42 : index === 1.67 ? 32 : 33;
            
            return {
                q: `What is a drawback of high-index ${index} lenses?`,
                opts: [
                    "Poor impact resistance",
                    "Lower Abbe value (more chromatic aberration)",
                    "Cannot take AR coating",
                    "Blocks too much light"
                ],
                correct: 1,
                exp: `High-index materials have lower Abbe values (${index} ≈ ${abbe}), meaning more chromatic aberration. AR coating helps minimize this visual distortion.`
            };
        },
        () => ({
            q: "ANSI Z87.1 is the standard for:",
            opts: [
                "Prescription tolerance",
                "Safety eyewear",
                "Lens material quality",
                "Frame durability"
            ],
            correct: 1,
            exp: "ANSI Z87.1 sets standards for occupational and educational eye protection, specifying impact resistance requirements for safety eyewear."
        })
    ]
};

// Helper functions for random generation
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Build static question bank for compatibility (pre-generated for initial load)
const questionBank = {
    general: Array.from({ length: 15 }, (_, i) => 
        questionGenerators.general[i % questionGenerators.general.length]()
    ),
    optics: Array.from({ length: 15 }, (_, i) => 
        questionGenerators.optics[i % questionGenerators.optics.length]()
    ),
    dispensing: Array.from({ length: 14 }, (_, i) => 
        questionGenerators.dispensing[i % questionGenerators.dispensing.length]()
    ),
    products: Array.from({ length: 15 }, (_, i) => 
        questionGenerators.products[i % questionGenerators.products.length]()
    )
};
