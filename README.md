# 👁️ ABO Mock Exam - American Board of Opticianry Study Tool

> **Professional-grade exam preparation app for ABO/NCLE certification**

A comprehensive, full-featured web application for studying toward American Board of Opticianry (ABO) certification. Practice with 90+ verified offline questions or generate unlimited AI-powered questions across all 15 ABO content domains.

🌐 **Live Demo**: [https://fuzibug.github.io/ABO-Study/](https://fuzibug.github.io/ABO-Study/)

---

## ✨ Features

### 🎯 Core Exam Features
- **Dual Question Modes**
  - 📦 **Offline Bank**: 90+ hand-verified questions (works without internet)
  - 🤖 **AI Generated**: Unlimited unique questions via Groq or OpenRouter
- **15 Content Domains**: Full ABO blueprint coverage
  - Geometric Optics, Ophthalmic Optics, Lens Materials, Lens Designs
  - Coatings, Frames, Measurements, Dispensing, Prescriptions
  - Anatomy, Pathology, Contact Lenses, Regulations, Safety, Low Vision
- **5 Difficulty Levels**: Foundation, Intermediate, Advanced, Expert, Calculations
- **Practice & Exam Modes**: Live scoring or hidden until end
- **Timed Mode**: Configurable countdown (15-120s per question)
- **Detailed Explanations**: Immediate, at-end, or off

### 🤖 AI Generation Settings
- **Temperature Control** (0.3-1.2): Adjust creativity vs. consistency
  - Low (0.3-0.5): Factual, predictable questions
  - Medium (0.6-0.8): Balanced variety (recommended)
  - High (0.9-1.2): Maximum creativity and scenario diversity
- **Max Tokens** (2048-16384): Control response length
  - Prevents cut-off for longer question sets
  - Higher = more detailed explanations
- **Model Selection**:
  - 🌿 **Free**: Llama 3.3 70B, Llama 4 Scout, Qwen3 32B, Gemma 3
  - 💵 **Paid**: Claude 3.5 Sonnet, GPT-4o Mini (most accurate)

### 🎨 Customization & Accessibility
- **6 Color Themes**: Ocean, Clinical, Emerald, Crimson, Violet, Slate
- **Font Settings**:
  - OpenDyslexic font toggle
  - Size: 90-130% scaling
  - Line height: Compact / Normal / Relaxed
  - Letter spacing: Normal / Wide
- **Display Options**:
  - Animation control: None / Reduced / Full
  - High contrast mode
  - Focus indicators (keyboard navigation)
  - Answer shuffle toggle
  - Domain/difficulty tag visibility

### 📊 Progress Tracking
- **Overall Statistics**: Total answered, accuracy %, average time
- **Domain Performance**: Per-domain accuracy with visual breakdown
- **Session History**: Recent exam results with retry option
- **LocalStorage Persistence**: All settings & progress saved automatically

### ⌨️ Keyboard Shortcuts
- **1-4** or **A-D**: Select answer
- **Space** / **Right Arrow**: Next question
- **Fully accessible**: ARIA labels, skip links, screen reader support

---

## 🚀 Quick Start

### Option 1: Use Online (Easiest)

1. Visit [https://fuzibug.github.io/ABO-Study/](https://fuzibug.github.io/ABO-Study/)
2. Start with **Offline Bank** (no setup required)
3. Or toggle to **AI mode** and paste your API key

### Option 2: Run Locally

**Prerequisites**: Python 3 or Node.js (for local server)

```bash
# Clone the repository
git clone https://github.com/fuzibug/ABO-Study.git
cd ABO-Study

# Start a local server (choose one):

# Python (built-in, easiest)
python3 -m http.server 8080

# Or Node.js
npx serve .

# Open in browser
open http://localhost:8080
```

⚠️ **Important**: Don't open `index.html` directly (`file://`) — browsers block API calls from local files. Use a local server.

---

## 🔑 AI Mode Setup

### Get a Free API Key

#### Groq (Recommended - Fastest, No Credit Card)
1. Visit [console.groq.com/keys](https://console.groq.com/keys)
2. Sign up (free, no card required)
3. Click **Create API Key**
4. Copy key (starts with `gsk_`)
5. Paste into app → **Save**

#### OpenRouter (Alternative - More Models)
1. Visit [openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up
3. Create API key (starts with `sk-or-`)
4. Many models are free (no credits needed)

### Recommended Models

| Model | Provider | Cost | Best For |
|-------|----------|------|----------|
| **Llama 3.3 70B Versatile** | Groq | Free | Overall best - fast, accurate, reliable JSON |
| Llama 4 Scout 17B | Groq | Free | Backup when 3.3 is rate-limited |
| DeepSeek R1 | OpenRouter | Free | Calculations (Prentice, vergence) |
| Qwen3 32B | Groq | Free | Strong when Llama is rate-limited |
| Claude 3.5 Sonnet | OpenRouter | ~$0.003/q | Most accurate (paid) |
| GPT-4o Mini | OpenRouter | ~$0.0002/q | Consistent, affordable (paid) |

---

## ⚙️ Configuration

### AI Generation Settings

Located in **Setup → AI Generation Settings** card:

**Temperature** (default: 0.8)
- Controls AI creativity and variety
- Low (0.3-0.5): Consistent, predictable questions
- High (0.9-1.2): Creative scenarios, varied numerical values
- Recommended: 0.8 for balanced realism

**Max Tokens** (default: 8192)
- Controls response length capacity
- 2048: Short (5-10 questions, basic explanations)
- 8192: Standard (10-20 questions, detailed explanations)
- 16384: Extended (20+ questions, no truncation risk)

### Exam Settings

| Setting | Options | Description |
|---------|---------|-------------|
| **Questions** | 5-50 | Number per session |
| **Timer** | 15-120s | Per-question countdown (when timed mode on) |
| **Explanations** | Immediate / At End / Off | When to show answer rationale |
| **Mode** | Practice / Exam | Show live score vs. hidden until end |
| **Timed Mode** | On / Off | Enable countdown timer |
| **Shuffle Answers** | On / Off | Randomize option order |
| **Domain Tag** | On / Off | Show domain label on question |
| **Difficulty Tag** | On / Off | Show difficulty badge |

---

## 📦 Offline Question Bank

The included offline bank contains **90+ professionally verified questions** covering all 15 ABO domains:

- Accurate to current ABO Study Guide standards
- ANSI Z80.1-2022 tolerances
- FDA, OSHA, FTC regulations
- Realistic clinical scenarios
- Detailed explanations with formulas

**No internet required** - perfect for studying on the go.

---

## 🐛 Troubleshooting

### “Connection Blocked (CORS)” Error

**Cause**: Opened `index.html` directly from filesystem

**Fix**: Run a local server (see Quick Start)

### “Rate Limit Hit (429)”

**Solutions**:
- Wait 30-60 seconds
- Switch to different model
- Switch to different provider
- Reduce question count (try 5-10 instead of 20+)

### “Generation Failed” / Truncated Questions

**Solutions**:
- Increase **Max Tokens** to 12288 or 16384
- Use Llama 3.3 70B (most reliable)
- Check API key is valid
- Ensure internet connection is stable

### Mobile Display Issues

- App is fully responsive
- Landscape orientation recommended for quiz
- All features work on mobile Safari, Chrome, Firefox

---

## 💻 Architecture

### File Structure

```
ABO-Study/
├── index.html          # Main HTML (SPA structure)
├── css/
│   ├── styles.css      # Core styles, themes, responsive
│   └── appearance.css  # Accessibility settings styles
├── js/
│   ├── constants.js    # Domain maps, themes, lookup tables
│   ├── state.js        # Global state variables
│   ├── data.js         # Offline question bank (90+ questions)
│   ├── ui.js           # DOM manipulation, navigation, settings
│   ├── quiz.js         # Quiz engine, timer, scoring
│   ├── api.js          # AI generation, prompting, parsing
│   ├── progress.js     # LocalStorage, stats, history
│   └── appearance.js   # Accessibility settings module
└── README.md
```

### Technology Stack

- **Vanilla JavaScript** (ES5 compatibility, no framework)
- **CSS3** with CSS variables for theming
- **LocalStorage API** for persistence
- **Fetch API** for AI providers
- **No dependencies** - pure web standards

### Design Principles

1. **Mobile-first**: Responsive, touch-friendly
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Performance**: Instant load, no build step
4. **Offline-capable**: Works without internet
5. **Privacy**: All data stored locally, no tracking

---

## 🎯 ABO Exam Coverage

### Content Domains (from ABO Blueprint)

| Domain | Topics | Sample Questions |
|--------|--------|------------------|
| **Geometric Optics** | Vergence, Snell's Law, refraction | "Calculate vergence at 40cm" |
| **Ophthalmic Optics** | Lens power, prism, Abbe value | "Prentice's Rule: 3mm decentration of +4.00D" |
| **Lens Materials** | CR-39, polycarbonate, Trivex, high-index | "Which material has highest Abbe value?" |
| **Lens Designs** | SV, bifocals, trifocals, PALs | "FT-28 segment width is..." |
| **Coatings** | AR, UV, photochromic, polarized | "Which coating reduces chromatic aberration?" |
| **Frame Selection** | Boxing system, materials, face shapes | "A measurement of 52mm refers to..." |
| **Measurements** | PD, seg height, vertex distance | "Monocular PD for 64mm binocular PD" |
| **Dispensing** | Fitting, adjustment, troubleshooting | "Patient complains of slippage - adjust..." |
| **Prescriptions** | Transposition, tolerances, ANSI | "Transpose +2.00-1.50×90" |
| **Anatomy** | Cornea, retina, macula, lens | "Fovea centralis contains which cells?" |
| **Pathology** | Cataracts, glaucoma, AMD | "Nuclear sclerotic cataract affects..." |
| **Contact Lenses** | Dk/t, base curve, soft vs RGP | "Silicone hydrogel advantage is..." |
| **Regulations** | ANSI Z80.1, FDA, FTC | "Power tolerance for 5.00D lens is..." |
| **Safety Eyewear** | ANSI Z87.1, ASTM F803, OSHA | "Z87+ marking indicates..." |
| **Low Vision** | Magnification, optical devices | "2.5× magnifier working distance?" |

---

## 📝 AI Prompt Engineering

The app uses a sophisticated prompt system to generate high-quality ABO questions:

### Accuracy Requirements
- Exact lens material properties (n, Abbe, SG)
- ANSI Z80.1-2022 tolerance tables
- Prentice's Rule with directional logic
- Transposition formulas
- FDA/OSHA/ANSI regulatory standards

### Variety Enforcement
- Diverse numerical values (not all ±2.00 or 90°)
- Uncommon but valid axis combinations
- Varied patient demographics
- Different question formats (direct, scenario, troubleshooting)
- Rotating emphasis areas per generation

### Quality Control
- JSON schema validation
- 4 options per question, 1 correct
- Plausible distractors (not obviously wrong)
- Detailed explanations with formulas
- Source citations for each question

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] Additional offline questions
- [ ] More AI provider options (Anthropic direct, OpenAI direct)
- [ ] Export results to PDF
- [ ] Spaced repetition algorithm
- [ ] Audio pronunciation for medical terms
- [ ] Spanish translation
- [ ] NCLE (contact lens) specific mode

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details

---

## 📞 Support

**Issues**: [GitHub Issues](https://github.com/fuzibug/ABO-Study/issues)

**Email**: fuzibug@users.noreply.github.com

---

## ⭐ Acknowledgments

- **ABO/NCLE** for certification standards
- **Groq** for lightning-fast LPU inference
- **OpenRouter** for unified model access
- **Meta AI** for Llama models
- **OpenDyslexic** font by Abbie Gonzalez

---

## 📊 Project Stats

- **90+** offline questions
- **15** content domains
- **6** color themes
- **20+** AI models supported
- **100%** vanilla JavaScript
- **0** dependencies
- **WCAG 2.1 AA** accessible

---

**Built with ❤️ for opticians, by an optician**

👁️ *Good luck on your ABO certification!*
