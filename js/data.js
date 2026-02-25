// ABO Question Bank — Enhanced Dynamic Generation System
// Original 75 verified questions + dynamic generators for infinite variety
// Sources: ABO Study Guide, ANSI Z80.1-2022, ANSI Z87.1, 21 CFR 801.410, OSHA 29 CFR 1910.133

// ═══════════════════════════════════════════════════════════════════════════════
// PART 1: ORIGINAL STATIC QUESTION BANK (75 questions)
// ═══════════════════════════════════════════════════════════════════════════════

const BANK_STATIC = [
  {"domain":"geometric_optics","difficulty":"foundation","question":"What is vergence?","options":["The bending of light at a lens surface","The reciprocal of object or image distance in meters","The speed of light in a medium","The angle of incidence"],"correct":1,"explanation":"Vergence (L) = n/l. Describes whether rays converge (+) or diverge (-), in diopters. Object vergence is always negative (diverging from source).","source":"ABO Study Guide: Geometric Optics — Vergence"},
  {"domain":"geometric_optics","difficulty":"foundation","question":"Snell's Law states:","options":["Frequency changes at an interface","n1·sinθ1 = n2·sinθ2","Speed is constant in all media","Wavelength is preserved across boundaries"],"correct":1,"explanation":"n1·sinθ1 = n2·sinθ2. Light bends toward the normal entering a denser medium. Frequency never changes; wavelength and speed do.","source":"ABO: Geometric Optics — Refraction / Snell's Law"},
  {"domain":"geometric_optics","difficulty":"intermediate","question":"A lens has a focal length of 0.25 m. Its power is:","options":["+0.25 D","+2.50 D","+4.00 D","+25.00 D"],"correct":2,"explanation":"Power (D) = 1/f(m) = 1/0.25 = +4.00 D. Fundamental diopter definition.","source":"ABO: Geometric Optics — Lens Power"},
  {"domain":"geometric_optics","difficulty":"intermediate","question":"Prentice's Rule: prism 8 mm below the OC of a +5.00 D lens:","options":["2Δ BU","3Δ BU","4Δ BU","5Δ BU"],"correct":2,"explanation":"P = F × d(cm) = 5.00 × 0.8 = 4Δ. Plus lens displaced below OC = Base Up prism.","source":"ABO: Geometric Optics — Prentice's Rule P=Fd"},
  {"domain":"geometric_optics","difficulty":"advanced","question":"Critical angle for glass (n=1.5) to air (n=1.0) is approximately:","options":["42°","48°","62°","72°"],"correct":0,"explanation":"θc = arcsin(n2/n1) = arcsin(1.0/1.5) ≈ 41.8°. Beyond this, total internal reflection occurs — no light exits the denser medium.","source":"ABO: Geometric Optics — Total Internal Reflection"},
  {"domain":"geometric_optics","difficulty":"intermediate","question":"Prism induced 5 mm temporal to the OC of a -3.00 D lens:","options":["0.5Δ BI","1.5Δ BI","2.5Δ BI","3.5Δ BI"],"correct":1,"explanation":"P = 3.00 × 0.5 = 1.5Δ. Minus lens displaced temporally = Base In (base toward optical center).","source":"ABO: Geometric Optics — Prentice's Rule"},
  {"domain":"geometric_optics","difficulty":"foundation","question":"Index of refraction of air is:","options":["0.75","1.00","1.33","1.52"],"correct":1,"explanation":"Air n ≈ 1.000. Water n ≈ 1.333, crown glass n ≈ 1.523, CR-39 n ≈ 1.498.","source":"ABO: Geometric Optics — Refractive Index"},
  {"domain":"ophthalmic_optics","difficulty":"foundation","question":"A lens clock (Geneva lens measure) directly reads:","options":["Lens thickness","Surface power based on sag measurement","Induced prism","Optical center location"],"correct":1,"explanation":"Lens clock reads surface power in diopters, calibrated for crown glass (n=1.523). Apply index correction factor for other materials.","source":"ABO: Ophthalmic Optics — Lens Clock"},
  {"domain":"ophthalmic_optics","difficulty":"advanced","question":"Chromatic aberration is minimized by selecting materials with:","options":["Higher refractive index","Higher Abbe value (V-number)","Lower Abbe value","Greater center thickness"],"correct":1,"explanation":"Abbe value V = (n_d−1)/(n_F−n_C). Higher V = less dispersion = less chromatic aberration. CR-39 V≈58, Trivex V≈43, Polycarbonate V≈30.","source":"ABO: Ophthalmic Optics — Abbe Value"},
  {"domain":"ophthalmic_optics","difficulty":"foundation","question":"Nominal power: front +8.00 D, back -5.00 D:","options":["-3.00 D","+3.00 D","+5.00 D","+13.00 D"],"correct":1,"explanation":"Nominal (thin lens) power = F1 + F2 = +8.00 + (-5.00) = +3.00 D.","source":"ABO: Ophthalmic Optics — Nominal Power"},
  {"domain":"ophthalmic_optics","difficulty":"intermediate","question":"Moving a minus lens closer to the eye:","options":["Increases effective minus power","Decreases effective minus power","Has no effect on power","Only matters for plus lenses"],"correct":0,"explanation":"Minus lens closer = more minus effective power. Clinically significant when Rx > ±4.00 D. Vertex distance must be recorded and matched.","source":"ABO: Ophthalmic Optics — Vertex Distance Effect"},
  {"domain":"ophthalmic_optics","difficulty":"advanced","question":"The lensometer measures:","options":["Front surface power","Back vertex power of a finished lens","Center thickness","Abbe value"],"correct":1,"explanation":"Lensometer reads back vertex power — the clinically relevant power that matches the refraction. Neutralizes vergence from the back surface.","source":"ABO: Ophthalmic Optics — Lensometer"},
  {"domain":"lens_materials","difficulty":"foundation","question":"Index of refraction of CR-39 plastic:","options":["1.498","1.523","1.586","1.600"],"correct":0,"explanation":"CR-39: n ≈ 1.498, Abbe value ≈ 58, specific gravity ≈ 1.32. Most commonly prescribed ophthalmic lens material worldwide.","source":"ABO: Lens Materials — CR-39"},
  {"domain":"lens_materials","difficulty":"foundation","question":"Highest impact resistance, required for children's eyewear by ANSI:","options":["Crown glass","CR-39","Polycarbonate","High-index 1.74"],"correct":2,"explanation":"Polycarbonate: inherent impact resistance far exceeds glass or CR-39. Inherently blocks UV. Required by ANSI for safety and recommended for pediatric Rx.","source":"ABO: Lens Materials — Polycarbonate; ANSI Z87.1"},
  {"domain":"lens_materials","difficulty":"intermediate","question":"Abbe value of polycarbonate is approximately:","options":["28-30","43-45","58","67"],"correct":0,"explanation":"Polycarbonate Abbe ≈ 28-30 — lowest of common ophthalmic materials. Causes noticeable chromatic aberration (color fringing) at gaze angles away from OC.","source":"ABO: Lens Materials — Polycarbonate Abbe Value"},
  {"domain":"lens_materials","difficulty":"intermediate","question":"Trivex lens material Abbe value is approximately:","options":["28-30","43-45","58","67"],"correct":1,"explanation":"Trivex: n ≈ 1.53, Abbe ≈ 43-45, specific gravity ≈ 1.11 (lightest of all common materials). Impact resistance comparable to polycarbonate with better optical clarity.","source":"ABO: Lens Materials — Trivex Properties"},
  {"domain":"lens_materials","difficulty":"intermediate","question":"For -8.00 DS, thinnest lens material:","options":["CR-39 n=1.50","Crown glass n=1.523","Polycarbonate n=1.586","High-index 1.67"],"correct":3,"explanation":"Higher index = thinner edge for minus lenses. Ranking thinnest to thickest: 1.67 > 1.586 (PC) > 1.523 (glass) > 1.498 (CR-39).","source":"ABO: Lens Materials — High-Index / Edge Thickness"},
  {"domain":"lens_materials","difficulty":"foundation","question":"Inherently blocks 100% UV with no added coating:","options":["CR-39","Crown glass","Trivex","Polycarbonate"],"correct":3,"explanation":"Polycarbonate absorbs UV up to ~380-400nm inherently. CR-39 and glass transmit UV — require UV coating. Trivex also provides good inherent UV protection.","source":"ABO: Lens Materials — UV Properties"},
  {"domain":"lens_designs","difficulty":"foundation","question":"Most commonly prescribed flat-top bifocal segment width:","options":["22 mm","25 mm","28 mm","35 mm"],"correct":2,"explanation":"FT-28 (flat-top 28mm) is the standard bifocal. FT-35 is wider for occupational use. Flat top provides consistent segment height unlike round segs.","source":"ABO: Lens Designs — Bifocal Segments"},
  {"domain":"lens_designs","difficulty":"foundation","question":"In a PAL, the near reading zone is located:","options":["At the top","In the center","At the bottom","Identical to the distance zone"],"correct":2,"explanation":"PAL layout: distance zone (top) → progressive corridor (increasing power) → near zone (bottom). Fitting cross marks the distance reference point at pupil center.","source":"ABO: Lens Designs — Progressive Addition Lenses"},
  {"domain":"lens_designs","difficulty":"intermediate","question":"Executive (Franklin) bifocal differs from flat-top because:","options":["Smaller segment","Segment line spans full lens width","No visible line","Reading only lens"],"correct":1,"explanation":"Executive/Franklin: dividing line runs full horizontal lens width, providing maximum near field. No seg edges limiting peripheral near vision.","source":"ABO: Lens Designs — Executive Bifocal"},
  {"domain":"lens_designs","difficulty":"intermediate","question":"Trifocal adds over a bifocal:","options":["No visible lines","An intermediate zone at arm's length","Less thickness","Lower cost"],"correct":1,"explanation":"Trifocal adds intermediate segment (typically half the near add — e.g., +1.25 if add is +2.50) above the near segment. Useful for computer distance (~50 cm).","source":"ABO: Lens Designs — Trifocals"},
  {"domain":"lens_designs","difficulty":"advanced","question":"In PALs, unwanted astigmatic error is concentrated in the:","options":["Distance zone","Reading zone","Progressive corridor","Lateral peripheral zones"],"correct":3,"explanation":"PAL trade-off: lateral nasal/temporal areas contain unavoidable astigmatic error causing 'swim' and blur. Wider corridor = more peripheral aberration. Cannot be eliminated by design.","source":"ABO: Lens Designs — PAL Optical Performance"},
  {"domain":"coatings","difficulty":"foundation","question":"AR coatings eliminate reflections by:","options":["Absorbing reflected light","Thin-film destructive interference","Thickening the lens surface","Increasing refractive index"],"correct":1,"explanation":"AR coatings use thin-film interference: quarter-wavelength layers create 180° phase shift causing destructive interference. Reduces surface reflections from ~8% to ~0.5%.","source":"ABO: Coatings — Anti-Reflective Physics"},
  {"domain":"coatings","difficulty":"foundation","question":"UV400 protection blocks UV up to:","options":["320 nm","350 nm","380 nm","400 nm"],"correct":3,"explanation":"UV400 blocks all UV up to 400nm: UVB (280-315nm) + UVA (315-400nm). FDA considers a lens UV-blocking if it blocks >99% of UV-A and UV-B.","source":"ABO: Coatings — UV Standards"},
  {"domain":"coatings","difficulty":"intermediate","question":"Photochromic lenses fail to darken while driving because:","options":["Heat deactivates them in summer","Windshields block the UV needed to trigger darkening","They only activate in polarized light","Car glass blocks all visible light"],"correct":1,"explanation":"Modern laminated windshields block most UV (320-380nm). Photochromic molecules require UV to trigger the darkening reaction. No UV = no darkening inside most vehicles.","source":"ABO: Coatings — Photochromic Limitations"},
  {"domain":"coatings","difficulty":"foundation","question":"Polarized lenses primarily reduce:","options":["UV radiation","Horizontally polarized glare from flat surfaces","Chromatic aberration","Peripheral distortion"],"correct":1,"explanation":"Polarized lenses contain a vertical-axis filter that blocks horizontally polarized light — the type of glare from roads, water, and snow. Does not replace UV protection.","source":"ABO: Coatings — Polarized Lenses"},
  {"domain":"frame_selection","difficulty":"foundation","question":"In the boxing system, the 'A' measurement is:","options":["Bridge width","Horizontal lens width","Vertical lens depth","Temple length"],"correct":1,"explanation":"Boxing system (ANSI/ISO): A = horizontal box width, B = vertical box depth, DBL = distance between lens boxes. Frame size: A □ DBL (e.g., 52 □ 18).","source":"ABO: Frame Selection — Boxing System"},
  {"domain":"frame_selection","difficulty":"foundation","question":"DBL stands for:","options":["Distance Between Lenses","Depth of Bridge Length","Diagonal Bridge Line","Datum Base Line"],"correct":0,"explanation":"DBL = Distance Between Lenses. Measured between the inner edges of the two lens boxes. Not the bridge width itself.","source":"ABO: Frame Selection — Boxing System DBL"},
  {"domain":"frame_selection","difficulty":"intermediate","question":"For a round face, the recommended frame shape is:","options":["Round","Oval","Rectangular or angular","Small rimless round"],"correct":2,"explanation":"Frame shape should contrast face shape. Round face → angular/rectangular adds definition. The principle: contrast the predominant face shape.","source":"ABO: Frame Selection — Face Shapes"},
  {"domain":"frame_selection","difficulty":"intermediate","question":"Titanium frames preferred for nickel allergy patients because:","options":["They are lighter","They are hypoallergenic and nickel-free","They are stronger","They adjust more easily"],"correct":1,"explanation":"Titanium is biocompatible and nickel-free. Nickel is the most common metal contact allergen (Type IV hypersensitivity). Beta-titanium and pure titanium are safe alternatives.","source":"ABO: Frame Selection — Materials & Allergies"},
  {"domain":"frame_selection","difficulty":"intermediate","question":"Minimum blank size formula:","options":["A + B + DBL","ED + 2 mm","A + DBL + (2 × largest decentration)","A + B/2 + DBL"],"correct":2,"explanation":"Minimum blank size = A + DBL + (2 × largest decentration). Decentration = |PD − frame PD/2|. Ensures blank covers full lens opening after edging.","source":"ABO: Frame Selection — Blank Size Calculation"},
  {"domain":"measurements","difficulty":"foundation","question":"When measuring distance PD, the patient fixates on:","options":["Examiner's right eye","Examiner's left eye","A target at 20 ft","The floor"],"correct":1,"explanation":"Patient fixates on examiner's left eye → patient's right eye looks straight ahead → right monocular PD measured. Reverse for left PD. Ensures straight-ahead (distance) gaze.","source":"ABO: Measurements — PD Measurement Technique"},
  {"domain":"measurements","difficulty":"foundation","question":"Near PD is typically less than distance PD by:","options":["1-2 mm total","3-4 mm total","5-6 mm total","7-8 mm total"],"correct":1,"explanation":"Near PD ≈ distance PD minus 3-4mm (~1.5-2mm per eye convergence at 40cm working distance). More precise: measure monocular near PD directly.","source":"ABO: Measurements — Near vs Distance PD"},
  {"domain":"measurements","difficulty":"intermediate","question":"Seg height for a flat-top bifocal is measured from:","options":["Top of segment to frame bottom","Lower limbus or pupil center to lowest frame point","Distance OC to segment top","Lower segment edge to frame top"],"correct":1,"explanation":"Seg height = vertical distance from the lower limbus (or pupil center) to the lowest point of the frame. Segment top aligns at this height.","source":"ABO: Measurements — Segment Height"},
  {"domain":"measurements","difficulty":"foundation","question":"Pantoscopic tilt means the frame has:","options":["The top rim tilting left or right","Bottom rim closer to the face than the top","Top rim closer to face than bottom","Bridge rotating laterally"],"correct":1,"explanation":"Pantoscopic tilt: bottom rim closer to cheek, top farther from face. Normal: 8-12°. Each 2° tilt effectively drops the OC by 1mm.","source":"ABO: Measurements — Pantoscopic Tilt"},
  {"domain":"dispensing","difficulty":"foundation","question":"First step when dispensing completed eyewear:","options":["Adjust the frame","Verify Rx matches the work order (lensometer + ANSI check)","Clean the lenses","Explain warranty"],"correct":1,"explanation":"Always verify power, axis, add, prism, PD, seg height, and optical quality before fitting. Catching a lab error before the patient sits down is essential.","source":"ABO: Dispensing — Verification Protocol"},
  {"domain":"dispensing","difficulty":"intermediate","question":"Frame slides down the nose — correct nose pad adjustment:","options":["Add more pantoscopic tilt","Move nose pads inward (closer together)","Move nose pads outward","Extend the temples"],"correct":1,"explanation":"Moving pads inward increases nose contact pressure, preventing downward sliding. First adjustment for metal frames with adjustable nose pads.","source":"ABO: Dispensing — Nose Pad Adjustment"},
  {"domain":"dispensing","difficulty":"intermediate","question":"Each 2° of pantoscopic tilt effectively moves the OC:","options":["0.5mm upward","1mm downward","1mm upward","2mm downward"],"correct":1,"explanation":"Rule: each 2° pantoscopic tilt = OC drops 1mm. For PALs: set the fitting cross 1mm higher per 2° of tilt to maintain proper distance zone and reading access.","source":"ABO: Dispensing — Pantoscopic Tilt & OC Position"},
  {"domain":"dispensing","difficulty":"foundation","question":"Standard vertex distance for ophthalmic dispensing:","options":["5-8 mm","12-14 mm","18-22 mm","25-30 mm"],"correct":1,"explanation":"Standard vertex distance: 12-14mm (lens back to corneal apex). For Rx > ±4.00D, vertex distance used during refraction must be matched during dispensing.","source":"ABO: Dispensing — Vertex Distance"},
  {"domain":"dispensing","difficulty":"intermediate","question":"New PAL patient reports 'swimming' and nausea. Most likely cause:","options":["Wrong monocular PD","Incorrect segment height","Wrong add power","Wrong cylinder axis"],"correct":1,"explanation":"Incorrect seg height is the most common PAL adaptation problem. Too high: patient can't access distance without tilting head. Too low: can't access near zone without exaggerated chin tuck.","source":"ABO: Dispensing — PAL Troubleshooting"},
  {"domain":"prescriptions","difficulty":"foundation","question":"Transpose +2.00 +1.50 x 090 to minus cylinder form:","options":["+3.50 -1.50 x 180","+3.50 -1.50 x 090","+2.00 -1.50 x 090","+0.50 +1.50 x 090"],"correct":0,"explanation":"New sphere = +2.00 + (+1.50) = +3.50. New cylinder = -1.50. New axis = 090 + 90 = 180. Result: +3.50 -1.50 x 180.","source":"ABO: Prescriptions — Rx Transposition"},
  {"domain":"prescriptions","difficulty":"foundation","question":"Spherical equivalent of +2.00 -1.00 x 045:","options":["+1.00 DS","+1.50 DS","+2.00 DS","+2.50 DS"],"correct":1,"explanation":"SE = sphere + (cylinder/2) = +2.00 + (-1.00/2) = +2.00 - 0.50 = +1.50 DS. Used for contact lens power approximation.","source":"ABO: Prescriptions — Spherical Equivalent"},
  {"domain":"prescriptions","difficulty":"intermediate","question":"ANSI Z80.1 power tolerance for Rx up to ±6.50 D:","options":["±0.06 D","±0.12 D","±0.13 D","±0.25 D"],"correct":1,"explanation":"ANSI Z80.1-2022: sphere and cylinder power tolerance = ±0.12 D for powers ≤ ±6.50 D. For powers > ±6.50 D, tolerance = ±2% of the power.","source":"ANSI Z80.1-2022 — Prescription Lens Tolerances"},
  {"domain":"prescriptions","difficulty":"intermediate","question":"Transpose -1.00 -2.00 x 045 to plus cylinder form:","options":["-3.00 +2.00 x 135","-3.00 +2.00 x 045","-1.00 +2.00 x 135","-2.00 +1.00 x 045"],"correct":0,"explanation":"New sphere = -1.00 + (-2.00) = -3.00. New cylinder = +2.00. New axis = 045 + 90 = 135. Result: -3.00 +2.00 x 135.","source":"ABO: Prescriptions — Plus Cylinder Transposition"},
  {"domain":"prescriptions","difficulty":"advanced","question":"For -2.00 -1.00 x 180, power at the 90° meridian:","options":["-1.00 D","-2.00 D","-3.00 D","-4.00 D"],"correct":2,"explanation":"Minus cylinder: sphere acts at axis meridian (180°). Power at 90° = sphere + cylinder = -2.00 + (-1.00) = -3.00 D. Power at 180° = -2.00 D.","source":"ABO: Prescriptions — Meridional Power / Power Cross"},
  {"domain":"prescriptions","difficulty":"intermediate","question":"Spherical equivalent of -3.00 -2.00 x 090:","options":["-1.00 DS","-2.00 DS","-3.00 DS","-4.00 DS"],"correct":3,"explanation":"SE = -3.00 + (-2.00/2) = -3.00 + (-1.00) = -4.00 DS. Represents average power across all meridians.","source":"ABO: Prescriptions — Spherical Equivalent"},
  {"domain":"anatomy","difficulty":"foundation","question":"Transparent, avascular anterior structure providing ~65-75% of total refractive power:","options":["Sclera","Cornea","Conjunctiva","Anterior lens"],"correct":1,"explanation":"Cornea provides ~43-44 D of the total ~60 D ocular power (~72%). Avascular (nourished by tears and aqueous). Injury/edema causes opacity.","source":"ABO: Ocular Anatomy — Cornea"},
  {"domain":"anatomy","difficulty":"foundation","question":"Innermost cellular layer of the cornea:","options":["Epithelium","Bowman's layer","Stroma","Endothelium"],"correct":3,"explanation":"Layers front to back: Epithelium → Bowman's layer → Stroma (90% of thickness) → Descemet's membrane → Endothelium. Endothelium pumps water out, keeping cornea dehydrated and clear.","source":"ABO: Ocular Anatomy — Corneal Layers"},
  {"domain":"anatomy","difficulty":"intermediate","question":"The fovea centralis:","options":["Located at the optic disc","Center of macula, cones only, highest acuity","On nasal retina temporal to the disc","Far peripheral retina"],"correct":1,"explanation":"Fovea: 1.5mm central depression of the macula. Only cones (~6 million). Highest visual acuity (20/20+). Avascular — nourished by underlying choroid.","source":"ABO: Ocular Anatomy — Fovea & Macula"},
  {"domain":"anatomy","difficulty":"intermediate","question":"Aqueous humor is produced by the:","options":["Corneal endothelium","Ciliary body","Iris dilator muscle","Trabecular meshwork"],"correct":1,"explanation":"Ciliary body produces aqueous via ultrafiltration + active secretion. Flow: posterior chamber → pupil → anterior chamber → trabecular meshwork → Schlemm's canal → venous system.","source":"ABO: Ocular Anatomy — Aqueous Humor"},
  {"domain":"anatomy","difficulty":"foundation","question":"Crystalline lens suspended by:","options":["Corneal ligaments","Zonules of Zinn","Aqueous pressure alone","Posterior vitreous"],"correct":1,"explanation":"Zonules of Zinn connect lens capsule to ciliary body. Ciliary muscle contraction → zonules relax → lens thickens (accommodation for near). Relaxed ciliary → taut zonules → flat lens (distance).","source":"ABO: Ocular Anatomy — Crystalline Lens & Accommodation"},
  {"domain":"pathology","difficulty":"foundation","question":"Cataract type most associated with diabetes and corticosteroid use:","options":["Nuclear sclerotic","Anterior cortical","Posterior subcapsular (PSC)","Posterior cortical"],"correct":2,"explanation":"PSC: opacity at posterior lens capsule pole. Associated with: diabetes, corticosteroids (systemic/inhaled/topical), radiation, uveitis. Disproportionately affects near vision and causes severe glare.","source":"ABO: Pathology — Cataract Types & Etiology"},
  {"domain":"pathology","difficulty":"foundation","question":"Glaucoma is characterized by:","options":["Crystalline lens clouding","Progressive optic nerve damage, often from elevated IOP","Macular degeneration","Corneal scarring"],"correct":1,"explanation":"Glaucoma: optic neuropathy with characteristic cupping and visual field loss. Normal IOP: 10-21 mmHg. Primary open-angle glaucoma (POAG) is most common. Risk factors: IOP, family history, thin cornea, age.","source":"ABO: Pathology — Glaucoma"},
  {"domain":"pathology","difficulty":"intermediate","question":"AMD primarily causes loss of:","options":["Peripheral vision","Central (straight-ahead) vision","Color vision only","Night vision only"],"correct":1,"explanation":"AMD destroys macular photoreceptors → central scotoma, metamorphopsia. Peripheral vision preserved. Wet AMD: choroidal neovascularization. Leading cause of legal blindness age >65 in developed countries.","source":"ABO: Pathology — Age-Related Macular Degeneration"},
  {"domain":"pathology","difficulty":"intermediate","question":"Keratoconus is:","options":["Retinal detachment","Progressive corneal thinning and forward bulging (ectasia)","Posterior lens capsule opacity","Elevated IOP with no angle closure"],"correct":1,"explanation":"Keratoconus: stromal thinning → cornea bulges into cone shape → irregular astigmatism, high myopia, reduced BCVA. RGP/scleral CL mask irregularity. Collagen cross-linking (CXL) halts progression.","source":"ABO: Pathology — Keratoconus"},
  {"domain":"pathology","difficulty":"foundation","question":"Myopia is corrected with:","options":["Plus (converging) lenses","Minus (diverging) lenses","Prism lenses","Cylindrical lenses only"],"correct":1,"explanation":"Myopia: parallel rays focus anterior to retina. Minus lens diverges rays before entering eye, moving focal point back to retina. Each -1.00 D corrects ~1mm of excess axial length.","source":"ABO: Pathology — Refractive Errors"},
  {"domain":"pathology","difficulty":"foundation","question":"Presbyopia is caused by:","options":["Corneal flattening with age","Loss of crystalline lens elasticity reducing accommodation","Increasing IOP after 40","Retinal thinning in the macula"],"correct":1,"explanation":"Presbyopia: age-related lens sclerosis reduces elasticity and accommodative amplitude. Manifest ~age 40-45. Amplitude decreases ~0.25D/year. Corrected with reading adds, PALs, or monovision.","source":"ABO: Pathology — Presbyopia & Accommodation"},
  {"domain":"contact_lenses","difficulty":"foundation","question":"Dk/t represents:","options":["Lens diameter / thickness","Oxygen transmissibility through the lens","Water content / thickness","Lens power / diameter"],"correct":1,"explanation":"Dk/t = oxygen transmissibility. D = diffusion coefficient, k = O2 solubility, t = lens thickness. Extended wear requires Dk/t ≥ 87; daily wear ≥ 24.","source":"ABO: Contact Lenses — Oxygen Transmissibility"},
  {"domain":"contact_lenses","difficulty":"intermediate","question":"Contact lens base curve refers to:","options":["Refractive power","Overall lens diameter","Radius of curvature of posterior surface (mm)","Water content percentage"],"correct":2,"explanation":"Base curve (BC): posterior surface radius in mm. Steeper fit = smaller BC number. Wrong BC impairs lens movement and corneal oxygen supply.","source":"ABO: Contact Lenses — Lens Parameters"},
  {"domain":"contact_lenses","difficulty":"intermediate","question":"Most appropriate contact lens for keratoconus:","options":["Daily disposable soft spherical","Standard soft toric","RGP or scleral lens","Cosmetic plano tinted"],"correct":2,"explanation":"RGP/scleral lenses vault over the irregular cornea, creating a tear lens that neutralizes irregular astigmatism. Soft lenses conform to the irregular surface and cannot correct it.","source":"ABO: Contact Lenses — Specialty Fitting"},
  {"domain":"contact_lenses","difficulty":"foundation","question":"Silicone hydrogel lenses were developed to:","options":["Improve moisture retention","Dramatically increase oxygen transmissibility","Reduce manufacturing cost","Correct higher prescriptions"],"correct":1,"explanation":"Traditional hydrogel relies on water for O2 delivery. Silicone hydrogel: silicone matrix allows O2 to diffuse directly — Dk 5-10× higher. Enables safer extended wear and reduces hypoxic complications.","source":"ABO: Contact Lenses — Silicone Hydrogel Materials"},
  {"domain":"regulations","difficulty":"foundation","question":"FDA drop-ball impact test requires:","options":["1-inch ball from 10 inches","5/8-inch ball from 50 inches","5/8-inch ball from 10 inches","1-inch ball from 50 inches"],"correct":1,"explanation":"21 CFR 801.410: 5/8-inch (15.9mm) steel ball from 50 inches. Lens must not fracture, chip, or crack. All finished prescription lenses sold in the US must pass or have an exemption.","source":"21 CFR 801.410 — FDA Impact Resistance"},
  {"domain":"regulations","difficulty":"intermediate","question":"ANSI Z80.1 governs tolerances for:","options":["Safety eyewear","Prescription ophthalmic dress lenses","Non-prescription sunglasses","Contact lenses"],"correct":1,"explanation":"ANSI Z80.1 (2022): tolerances for prescription ophthalmic lenses (power, prism, axis, optical quality). Z87.1 = safety eyewear. Z80.3 = non-prescription sunglasses.","source":"ANSI Z80.1-2022 — Prescription Ophthalmic Lenses"},
  {"domain":"regulations","difficulty":"intermediate","question":"Z87+ marking indicates:","options":["Basic impact only","Passed high-velocity AND high-mass impact tests","UV protection included","Polarized lens"],"correct":1,"explanation":"ANSI Z87.1: Z87+ = passes high-velocity (1-inch ball at 150 fps) AND high-mass (17.6 oz pointed projectile) tests. Z87 alone = basic impact only (FDA drop ball). Critical distinction for industrial environments.","source":"ANSI/ISEA Z87.1-2020 — Occupational Eye Protection"},
  {"domain":"regulations","difficulty":"intermediate","question":"ANSI Z80.1 axis tolerance for a -2.25 D cylinder:","options":["±2°","±3°","±5°","±7°"],"correct":1,"explanation":"Z80.1 axis tolerances: ≤0.12D = ±14°; 0.25D = ±7°; 0.50D = ±5°; 0.75-1.50D = ±3°; >1.50D = ±2°. At -2.25D (>1.50D): ±2°.","source":"ANSI Z80.1-2022 — Axis Tolerance Table"},
  {"domain":"safety_eyewear","difficulty":"foundation","question":"Side shields required when:","options":["Prescription exceeds +4.00D","Hazards can approach from the side","Working outdoors only","Frame material is metal"],"correct":1,"explanation":"OSHA 29 CFR 1910.133 and ANSI Z87.1: side shields required when hazard sources are lateral or overhead. Wrap-around designs may substitute.","source":"OSHA 29 CFR 1910.133; ANSI Z87.1"},
  {"domain":"safety_eyewear","difficulty":"intermediate","question":"OSHA 29 CFR 1910.133 mandates eye protection for:","options":["Any chemical use","Flying particles, molten metal, liquid chemicals, injurious radiation","Driving any vehicle","Computer/VDT work"],"correct":1,"explanation":"1910.133(a)(1): required for flying particles, molten metal, liquid chemicals, acids, caustic liquids, chemical gases/vapors, and injurious radiation. Applies to all employees in those environments.","source":"OSHA 29 CFR 1910.133(a)"},
  {"domain":"safety_eyewear","difficulty":"intermediate","question":"Racquet sports require eye protection rated under:","options":["ANSI Z87.1","ASTM F803","ISO 18369","OSHA 1910.133"],"correct":1,"explanation":"ASTM F803: Standard for eye protection in racquet sports. Z87.1 safety glasses are NOT sufficient — the ball can enter standard frame openings and frames may shatter under ball impact.","source":"ASTM F803 — Eye Protectors for Racket Sports"},
  {"domain":"low_vision","difficulty":"foundation","question":"Low vision is BCVA:","options":["20/20 or better","Worse than 20/40, not improvable with standard Rx","20/200 or worse in better eye","Worse than 20/400"],"correct":1,"explanation":"Low vision: BCVA worse than 20/40 in the better eye after best correction. Legal blindness: BCVA ≤20/200 or visual field ≤20° in the better eye.","source":"ABO: Low Vision — Definitions & Classification"},
  {"domain":"low_vision","difficulty":"intermediate","question":"Patient with 20/200 BCVA needs to read 20/20 print. Required magnification:","options":["2×","5×","10×","20×"],"correct":2,"explanation":"Magnification = denominator of current VA ÷ denominator of target VA = 200 ÷ 20 = 10×.","source":"ABO: Low Vision — Magnification Calculation"},
  {"domain":"low_vision","difficulty":"intermediate","question":"Eccentric viewing teaches patients to:","options":["Use only one eye for reading","Fixate off-center to use healthy retinal cells outside a central scotoma","Use a mirror to redirect images","Tilt reading material"],"correct":1,"explanation":"Eccentric viewing (EV): patients with central scotomas (e.g., AMD) learn to fixate with a Preferred Retinal Locus (PRL) — healthy peripheral retina adjacent to the scotoma.","source":"ABO: Low Vision — Eccentric Viewing & PRL"},
  {"domain":"low_vision","difficulty":"intermediate","question":"Patient with 20/100 BCVA reading at 40 cm. Required add power:","options":["+2.50 D","+5.00 D","+10.00 D","+12.50 D"],"correct":3,"explanation":"Step 1: Magnification needed = 100/20 = 5×. Step 2: Base add for 40cm = 1/0.40 = +2.50D. Step 3: Total add = 5 × 2.50 = +12.50 D.","source":"ABO: Low Vision — Reading Add Calculation"}
];

// ═══════════════════════════════════════════════════════════════════════════════
// PART 2: DYNAMIC QUESTION GENERATORS (infinite variations)
// ═══════════════════════════════════════════════════════════════════════════════

// Helper: format diopter power with sign
function fmtD(val) {
  return (val >= 0 ? '+' : '') + val.toFixed(2);
}

// Helper: format distance in cm or m
function fmtDist(cm) {
  return cm >= 100 ? (cm/100).toFixed(2) + ' m' : cm + ' cm';
}

// Helper: shuffle array
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Helper: random choice from array
function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper: random integer between min and max (inclusive)
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: random float
function randFloat(min, max, decimals = 2) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATOR FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// 1. PRENTICE'S RULE GENERATOR — infinite variations
const genPrentice = () => {
  const powers = [-8.00, -6.00, -5.00, -4.00, -3.00, -2.50, 2.50, 3.00, 4.00, 5.00, 6.00, 8.00];
  const power = choice(powers);
  const decentMM = randInt(3, 12);
  const decentCM = decentMM / 10;
  
  const prism = Math.abs(power * decentCM);
  
  // Determine direction based on power sign and decentration direction
  const isPlusPower = power > 0;
  const directions = ['below', 'above', 'temporal to', 'nasal to'];
  const dir = choice(directions);
  
  let baseDir;
  if (dir === 'below') baseDir = isPlusPower ? 'BU' : 'BD';
  else if (dir === 'above') baseDir = isPlusPower ? 'BD' : 'BU';
  else if (dir === 'temporal to') baseDir = isPlusPower ? 'BO' : 'BI';
  else baseDir = isPlusPower ? 'BI' : 'BO';
  
  const correctAnswer = prism.toFixed(1) + 'Δ ' + baseDir;
  
  // Generate plausible wrong answers
  const wrongPrisms = [
    (prism * 0.5).toFixed(1),
    (prism * 1.5).toFixed(1),
    (prism * 2).toFixed(1)
  ];
  const wrongDirs = ['BU', 'BD', 'BI', 'BO'].filter(d => d !== baseDir);
  
  const options = shuffle([
    correctAnswer,
    wrongPrisms[0] + 'Δ ' + baseDir,
    prism.toFixed(1) + 'Δ ' + choice(wrongDirs),
    wrongPrisms[1] + 'Δ ' + choice(wrongDirs)
  ]);
  
  return {
    domain: 'geometric_optics',
    difficulty: 'intermediate',
    question: `Prentice's Rule: prism induced ${decentMM} mm ${dir} the OC of a ${fmtD(power)} D lens:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `P = F × d(cm) = ${Math.abs(power).toFixed(2)} × ${decentCM.toFixed(1)} = ${prism.toFixed(1)}Δ. ${isPlusPower ? 'Plus' : 'Minus'} lens displaced ${dir} = ${baseDir} prism (base ${baseDir === 'BU' ? 'up' : baseDir === 'BD' ? 'down' : baseDir === 'BI' ? 'in' : 'out'}).`,
    source: 'ABO: Geometric Optics — Prentice\'s Rule P=Fd'
  };
};

// 2. TRANSPOSITION GENERATOR — plus to minus and minus to plus
const genTransposition = () => {
  const spheres = [-4.00, -3.00, -2.00, -1.00, -0.50, +0.50, +1.00, +2.00, +3.00, +4.00];
  const cylinders = [-3.00, -2.50, -2.00, -1.50, -1.00, -0.50];
  const axes = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
  
  const sph = choice(spheres);
  const cyl = choice(cylinders);
  const axis = choice(axes);
  
  // Transpose: new sphere = sph + cyl, new cyl = -cyl, new axis = axis ± 90
  const newSph = sph + cyl;
  const newCyl = -cyl;
  const newAxis = (axis + 90) % 180 || 180;
  
  const correctAnswer = `${fmtD(newSph)} ${fmtD(newCyl)} x ${String(newAxis).padStart(3, '0')}`;
  
  // Generate wrong answers
  const wrongOptions = [
    `${fmtD(sph)} ${fmtD(newCyl)} x ${String(newAxis).padStart(3, '0')}`, // forgot to add cyl to sphere
    `${fmtD(newSph)} ${fmtD(cyl)} x ${String(newAxis).padStart(3, '0')}`, // forgot to flip cyl sign
    `${fmtD(newSph)} ${fmtD(newCyl)} x ${String(axis).padStart(3, '0')}` // forgot to rotate axis
  ];
  
  const options = shuffle([correctAnswer, ...wrongOptions]);
  
  return {
    domain: 'prescriptions',
    difficulty: 'foundation',
    question: `Transpose ${fmtD(sph)} ${fmtD(cyl)} x ${String(axis).padStart(3, '0')} to ${cyl < 0 ? 'plus' : 'minus'} cylinder form:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `New sphere = ${fmtD(sph)} + (${fmtD(cyl)}) = ${fmtD(newSph)}. New cylinder = ${fmtD(newCyl)}. New axis = ${axis} ${cyl < 0 ? '+' : '-'} 90 = ${newAxis}. Result: ${correctAnswer}.`,
    source: 'ABO: Prescriptions — Rx Transposition'
  };
};

// 3. SPHERICAL EQUIVALENT GENERATOR
const genSphericalEquiv = () => {
  const spheres = [-4.00, -3.00, -2.00, -1.00, +1.00, +2.00, +3.00, +4.00];
  const cylinders = [-3.00, -2.50, -2.00, -1.50, -1.00, -0.50, +0.50, +1.00, +1.50];
  const axes = [45, 90, 135, 180];
  
  const sph = choice(spheres);
  const cyl = choice(cylinders);
  const axis = choice(axes);
  
  const se = sph + (cyl / 2);
  const correctAnswer = `${fmtD(se)} DS`;
  
  // Generate wrong answers
  const wrongOptions = [
    `${fmtD(sph)} DS`, // forgot to add cyl/2
    `${fmtD(sph + cyl)} DS`, // added full cyl instead of half
    `${fmtD(se + 0.50)} DS` // off by common error
  ];
  
  const options = shuffle([correctAnswer, ...wrongOptions]);
  
  return {
    domain: 'prescriptions',
    difficulty: 'foundation',
    question: `Spherical equivalent of ${fmtD(sph)} ${fmtD(cyl)} x ${String(axis).padStart(3, '0')}:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `SE = sphere + (cylinder/2) = ${fmtD(sph)} + (${fmtD(cyl)}/2) = ${fmtD(sph)} + ${fmtD(cyl/2)} = ${fmtD(se)} DS. Used for contact lens power approximation.`,
    source: 'ABO: Prescriptions — Spherical Equivalent'
  };
};

// 4. FOCAL LENGTH TO POWER GENERATOR
const genFocalLength = () => {
  const focalLengths = [0.125, 0.20, 0.25, 0.33, 0.40, 0.50, 0.67, 1.00, 2.00];
  const f = choice(focalLengths);
  const power = 1 / f;
  
  const correctAnswer = `${fmtD(power)} D`;
  
  // Generate wrong answers
  const wrongOptions = [
    `${fmtD(f)} D`, // inverted formula
    `${fmtD(power * 2)} D`, // doubled
    `${fmtD(power / 2)} D` // halved
  ];
  
  const options = shuffle([correctAnswer, ...wrongOptions]);
  
  return {
    domain: 'geometric_optics',
    difficulty: 'intermediate',
    question: `A lens has a focal length of ${f.toFixed(2)} m. Its power is:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `Power (D) = 1/f(m) = 1/${f.toFixed(2)} = ${fmtD(power)} D. Fundamental diopter definition.`,
    source: 'ABO: Geometric Optics — Lens Power'
  };
};

// 5. CRITICAL ANGLE GENERATOR
const genCriticalAngle = () => {
  const materials = [
    {name: 'crown glass', n: 1.523},
    {name: 'CR-39', n: 1.498},
    {name: 'polycarbonate', n: 1.586},
    {name: 'high-index 1.67', n: 1.67}
  ];
  
  const mat = choice(materials);
  const n1 = mat.n;
  const n2 = 1.0; // air
  
  const criticalAngle = Math.asin(n2 / n1) * (180 / Math.PI);
  const roundedAngle = Math.round(criticalAngle);
  
  const correctAnswer = `${roundedAngle}°`;
  
  // Generate wrong answers
  const wrongAngles = [
    roundedAngle - 10,
    roundedAngle + 8,
    roundedAngle + 18
  ].map(a => `${a}°`);
  
  const options = shuffle([correctAnswer, ...wrongAngles]);
  
  return {
    domain: 'geometric_optics',
    difficulty: 'advanced',
    question: `Critical angle for ${mat.name} (n=${mat.n.toFixed(3)}) to air (n=1.0) is approximately:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `θc = arcsin(n2/n1) = arcsin(1.0/${mat.n.toFixed(3)}) ≈ ${criticalAngle.toFixed(1)}°. Beyond this, total internal reflection occurs — no light exits the denser medium.`,
    source: 'ABO: Geometric Optics — Total Internal Reflection'
  };
};

// 6. MINIMUM BLANK SIZE GENERATOR
const genBlankSize = () => {
  const A = randInt(48, 58);
  const DBL = randInt(14, 20);
  const decentPerEye = randFloat(0.5, 6.0, 1);
  
  const minBlank = A + DBL + (2 * decentPerEye);
  const correctAnswer = `${minBlank.toFixed(1)} mm`;
  
  // Generate wrong answers
  const wrongOptions = [
    `${(A + DBL).toFixed(1)} mm`, // forgot decentration
    `${(A + decentPerEye).toFixed(1)} mm`, // forgot DBL
    `${(minBlank + 5).toFixed(1)} mm` // added arbitrary buffer
  ];
  
  const options = shuffle([correctAnswer, ...wrongOptions]);
  
  return {
    domain: 'frame_selection',
    difficulty: 'intermediate',
    question: `Frame with A=${A}mm, DBL=${DBL}mm, and largest decentration ${decentPerEye.toFixed(1)}mm. Minimum blank size:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `Minimum blank size = A + DBL + (2 × largest decentration) = ${A} + ${DBL} + (2 × ${decentPerEye.toFixed(1)}) = ${minBlank.toFixed(1)} mm. Ensures blank covers full lens opening after edging.`,
    source: 'ABO: Frame Selection — Blank Size Calculation'
  };
};

// 7. LOW VISION MAGNIFICATION GENERATOR
const genLowVisionMag = () => {
  const currentVAs = [20, 30, 40, 50, 60, 80, 100, 120, 160, 200, 400];
  const targetVAs = [20, 25, 30, 40];
  
  const current = choice(currentVAs);
  const target = choice(targetVAs.filter(t => t < current));
  
  const mag = current / target;
  const correctAnswer = `${mag.toFixed(1)}×`;
  
  // Generate wrong answers
  const wrongMags = [
    (mag / 2).toFixed(1),
    (mag * 1.5).toFixed(1),
    (target / current).toFixed(1) // inverted
  ].map(m => `${m}×`);
  
  const options = shuffle([correctAnswer, ...wrongMags]);
  
  return {
    domain: 'low_vision',
    difficulty: 'intermediate',
    question: `Patient with 20/${current} BCVA needs to read 20/${target} print. Required magnification:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `Magnification = denominator of current VA ÷ denominator of target VA = ${current} ÷ ${target} = ${mag.toFixed(1)}×.`,
    source: 'ABO: Low Vision — Magnification Calculation'
  };
};

// 8. MERIDIONAL POWER GENERATOR
const genMeridionalPower = () => {
  const spheres = [-5.00, -4.00, -3.00, -2.00, -1.00, +1.00, +2.00, +3.00];
  const cylinders = [-3.00, -2.50, -2.00, -1.50, -1.00];
  const axis = choice([90, 180]);
  
  const sph = choice(spheres);
  const cyl = choice(cylinders);
  
  // Power at axis meridian = sphere
  // Power at 90° from axis = sphere + cylinder
  const queryMeridian = axis === 180 ? 90 : 180;
  const powerAtQuery = queryMeridian === axis ? sph : sph + cyl;
  
  const correctAnswer = `${fmtD(powerAtQuery)} D`;
  
  // Generate wrong answers
  const wrongOptions = [
    `${fmtD(sph)} D`,
    `${fmtD(cyl)} D`,
    `${fmtD(sph + cyl/2)} D`
  ].filter(o => o !== correctAnswer);
  
  const options = shuffle([correctAnswer, ...wrongOptions.slice(0, 3)]);
  
  return {
    domain: 'prescriptions',
    difficulty: 'advanced',
    question: `For ${fmtD(sph)} ${fmtD(cyl)} x ${String(axis).padStart(3, '0')}, power at the ${queryMeridian}° meridian:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `Minus cylinder: sphere acts at axis meridian (${axis}°). Power at ${queryMeridian}° = sphere + cylinder = ${fmtD(sph)} + (${fmtD(cyl)}) = ${fmtD(powerAtQuery)} D. Power at ${axis}° = ${fmtD(sph)} D.`,
    source: 'ABO: Prescriptions — Meridional Power / Power Cross'
  };
};

// 9. LENS MATERIAL THICKNESS COMPARISON
const genLensMaterialThickness = () => {
  const powers = [-8.00, -7.00, -6.00, -5.00, +5.00, +6.00, +7.00, +8.00];
  const power = choice(powers);
  const isMinus = power < 0;
  
  const materials = [
    {name: 'CR-39 n=1.50', n: 1.498, order: 4},
    {name: 'Crown glass n=1.523', n: 1.523, order: 3},
    {name: 'Polycarbonate n=1.586', n: 1.586, order: 2},
    {name: 'High-index 1.67', n: 1.67, order: 1}
  ];
  
  // For minus: higher index = thinner edges (lower order = thinner)
  // For plus: higher index = thinner center (lower order = thinner)
  const sorted = materials.sort((a, b) => a.order - b.order);
  const thinnest = sorted[0];
  
  const correctAnswer = thinnest.name;
  const wrongOptions = materials.filter(m => m.name !== correctAnswer).map(m => m.name);
  
  const options = shuffle([correctAnswer, ...wrongOptions]);
  
  return {
    domain: 'lens_materials',
    difficulty: 'intermediate',
    question: `For ${fmtD(power)} DS, thinnest ${isMinus ? 'edge' : 'center'} lens material:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `Higher index = thinner ${isMinus ? 'edge' : 'center'} for ${isMinus ? 'minus' : 'plus'} lenses. Ranking thinnest to thickest: 1.67 > 1.586 (PC) > 1.523 (glass) > 1.498 (CR-39).`,
    source: 'ABO: Lens Materials — High-Index / Thickness'
  };
};

// 10. LOW VISION READING ADD GENERATOR
const genLowVisionReadingAdd = () => {
  const currentVAs = [60, 80, 100, 120, 160, 200];
  const targetVA = 20;
  const workingDistCM = choice([25, 33, 40, 50]);
  
  const current = choice(currentVAs);
  const mag = current / targetVA;
  const baseAdd = 100 / workingDistCM;
  const totalAdd = mag * baseAdd;
  
  const correctAnswer = `${fmtD(totalAdd)} D`;
  
  // Generate wrong answers
  const wrongAdds = [
    baseAdd.toFixed(2),
    (totalAdd / 2).toFixed(2),
    (mag).toFixed(2)
  ].map(a => fmtD(parseFloat(a)) + ' D');
  
  const options = shuffle([correctAnswer, ...wrongAdds]);
  
  return {
    domain: 'low_vision',
    difficulty: 'intermediate',
    question: `Patient with 20/${current} BCVA reading at ${workingDistCM} cm. Required add power:`,
    options: options,
    correct: options.indexOf(correctAnswer),
    explanation: `Step 1: Magnification needed = ${current}/${targetVA} = ${mag.toFixed(1)}×. Step 2: Base add for ${workingDistCM}cm = 100/${workingDistCM} = ${fmtD(baseAdd)} D. Step 3: Total add = ${mag.toFixed(1)} × ${baseAdd.toFixed(2)} = ${fmtD(totalAdd)} D.`,
    source: 'ABO: Low Vision — Reading Add Calculation'
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATOR REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

const GENERATORS = [
  {weight: 3, fn: genPrentice},
  {weight: 3, fn: genTransposition},
  {weight: 2, fn: genSphericalEquiv},
  {weight: 2, fn: genFocalLength},
  {weight: 1, fn: genCriticalAngle},
  {weight: 2, fn: genBlankSize},
  {weight: 2, fn: genLowVisionMag},
  {weight: 2, fn: genMeridionalPower},
  {weight: 2, fn: genLensMaterialThickness},
  {weight: 2, fn: genLowVisionReadingAdd}
];

// ═══════════════════════════════════════════════════════════════════════════════
// PART 3: INTEGRATION & SMART SELECTION
// ═══════════════════════════════════════════════════════════════════════════════

// Track recently seen questions to avoid immediate repeats
let recentQuestionHashes = [];
const MAX_RECENT_MEMORY = 50;

// Hash function to identify unique question content
function hashQuestion(q) {
  return q.question.substring(0, 50) + q.domain + q.difficulty;
}

// Generate a dynamic question from weighted generator pool
function generateDynamicQuestion() {
  // Calculate total weight
  const totalWeight = GENERATORS.reduce((sum, g) => sum + g.weight, 0);
  let rand = Math.random() * totalWeight;
  
  // Select generator based on weights
  for (const gen of GENERATORS) {
    rand -= gen.weight;
    if (rand <= 0) {
      return gen.fn();
    }
  }
  
  // Fallback
  return GENERATORS[0].fn();
}

// Main bank builder: combines static + dynamic with smart deduplication
function buildQuestionBank(config) {
  const {
    domain = 'all',
    difficulty = 'mixed',
    count = 10,
    dynamicRatio = 0.4 // 40% dynamic, 60% static by default
  } = config;
  
  let pool = [];
  
  // Filter static questions by domain and difficulty
  let staticPool = BANK_STATIC.filter(q => {
    const domainMatch = domain === 'all' || q.domain === domain;
    const diffMatch = difficulty === 'mixed' || 
                      difficulty === 'calculations' ||
                      q.difficulty === difficulty;
    return domainMatch && diffMatch;
  });
  
  // Shuffle static pool
  staticPool = shuffle(staticPool);
  
  // Calculate how many dynamic vs static questions
  const dynamicCount = Math.floor(count * dynamicRatio);
  const staticCount = count - dynamicCount;
  
  // Add static questions
  for (let i = 0; i < Math.min(staticCount, staticPool.length); i++) {
    pool.push(staticPool[i]);
  }
  
  // Generate dynamic questions
  let attempts = 0;
  const maxAttempts = dynamicCount * 5; // prevent infinite loop
  
  while (pool.length < count && attempts < maxAttempts) {
    const dynQ = generateDynamicQuestion();
    
    // Check domain and difficulty filters
    const domainMatch = domain === 'all' || dynQ.domain === domain;
    const diffMatch = difficulty === 'mixed' || 
                      difficulty === 'calculations' ||
                      dynQ.difficulty === difficulty;
    
    if (domainMatch && diffMatch) {
      // Check if this question is too similar to recent ones
      const qHash = hashQuestion(dynQ);
      if (!recentQuestionHashes.includes(qHash)) {
        pool.push(dynQ);
        recentQuestionHashes.push(qHash);
        
        // Trim memory
        if (recentQuestionHashes.length > MAX_RECENT_MEMORY) {
          recentQuestionHashes.shift();
        }
      }
    }
    
    attempts++;
  }
  
  // Fill remaining slots with static if needed
  let staticIdx = staticCount;
  while (pool.length < count && staticIdx < staticPool.length) {
    pool.push(staticPool[staticIdx]);
    staticIdx++;
  }
  
  return shuffle(pool);
}

// Export the main BANK array using the builder
// This maintains compatibility with existing quiz.js code
const BANK = buildQuestionBank({
  domain: 'all',
  difficulty: 'mixed',
  count: 100, // build a large pool
  dynamicRatio: 0.4
});

// Export builder for custom quiz configurations
window.buildQuestionBank = buildQuestionBank;

console.log(`📚 Enhanced Question Bank initialized: ${BANK.length} questions loaded`);
console.log(`   - ${BANK_STATIC.length} static base questions`);
console.log(`   - ${GENERATORS.length} dynamic generators available`);
console.log(`   - Infinite unique questions possible via generators`);
