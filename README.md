# ABO Mock Exam

Practice tool for the American Board of Opticianry certification exam.  
Covers all 15 official ABO content domains with 75+ verified offline questions and optional AI-generated questions.

---

## Quick Start

### Offline mode (no setup needed)

Open `index.html` in any browser. The offline bank works immediately — no server, no API key.

### AI mode (requires a local server + API key)

Browsers block API calls from `file://` URLs. Serve the project over HTTP first:

```bash
# Python (built-in, works everywhere)
python3 -m http.server 8080

# Node.js
npx serve .
```

Then open **http://localhost:8080** and add your API key in Setup → AI Generated.

---

## Getting an API Key

| Provider | Free tier | Speed | Get key |
|---|---|---|---|
| **Groq** | ✅ Generous free | ⚡ Fastest (~2s) | [console.groq.com/keys](https://console.groq.com/keys) |
| **OpenRouter** | ✅ Many free models | Varies | [openrouter.ai/keys](https://openrouter.ai/keys) |

Keys are saved to `localStorage` — you only need to enter them once.

---

## Project Structure

```
abo-mock-exam/
│
├── index.html          # App shell — markup only, no inline JS or CSS
│
├── css/
│   └── styles.css      # All styles: themes, components, layout
│
├── js/
│   ├── constants.js    # Read-only lookup tables (DM, themes, URLs, tab map)
│   ├── state.js        # All shared mutable state (settings, session vars)
│   ├── data.js         # 75+ offline question bank (BANK array)
│   ├── ui.js           # DOM helpers, navigation, theming, settings wiring
│   ├── quiz.js         # Quiz engine: pool building, rendering, timer, results
│   ├── api.js          # AI fetch: CORS handling, prompt building, error display
│   └── progress.js     # localStorage read/write, progress page rendering
│
└── README.md
```

**Script load order** (declared at bottom of `index.html`):

```
constants → state → data → ui → quiz → api → progress
```

Each file depends only on files loaded before it. There are no circular dependencies.

---

## Features

- **75+ offline questions** across all 15 ABO domains — works with no internet
- **AI-generated questions** via Groq or OpenRouter (9 models to choose from)
- **6 colour themes** — Deep Ocean, Emerald, Crimson, Violet, Clinical (light), Slate
- **Configurable sessions** — 5–50 questions, 15–120s timer, domain/difficulty filters
- **Practice vs Exam mode** — live score or hidden until the end
- **Progress tracking** — cumulative domain stats, session history, pass rate
- **Retry wrong answers** — one click to re-drill only the questions you missed
- **Keyboard shortcuts** — `1–4` / `A–D` to answer, `Space` / `→` to advance

---

## AI Models

### Groq (fastest, all free)
| Model | Best for |
|---|---|
| Llama 3.3 70B Versatile | Default — best overall accuracy |
| Llama 3 70B | Stable backup if 3.3 is rate-limited |
| Mixtral 8x7B | Strong JSON output |
| Gemma 2 9B | Fastest generation |

### OpenRouter
| Model | Cost | Best for |
|---|---|---|
| Llama 3.3 70B Instruct | Free | Best free option |
| DeepSeek R1 | Free | Calculations (chain-of-thought) |
| Gemma 3 27B | Free | Anatomy & pathology |
| Mistral 7B | Free | Quick sessions |
| Claude 3.5 Sonnet | ~$0.003/session | Highest accuracy |
| GPT-4o Mini | ~$0.0002/session | Consistent, good at math |

---

## Adding Questions to the Offline Bank

Edit `js/data.js`. Each question follows this schema:

```js
{
  domain:      "geometric_optics",   // see domain keys in constants.js
  difficulty:  "intermediate",        // foundation | intermediate | advanced | expert
  question:    "Question text here?",
  options:     ["A", "B", "C", "D"], // exactly 4 options
  correct:     1,                     // 0-indexed position of correct answer
  explanation: "Why the answer is correct, with formula/rule cited.",
  source:      "ABO: Domain — Topic"
}
```

**Domain keys:** `geometric_optics`, `ophthalmic_optics`, `lens_materials`, `lens_designs`,
`coatings`, `frame_selection`, `measurements`, `dispensing`, `prescriptions`, `anatomy`,
`pathology`, `contact_lenses`, `regulations`, `safety_eyewear`, `low_vision`
