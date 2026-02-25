# Changelog

## v2.0.0 - Enhanced AI & Accessibility (February 2026)

### 🤖 AI Generation Improvements

#### Enhanced Prompting System
- **Stricter accuracy requirements**: Exact lens material properties, ANSI tolerances, regulatory standards
- **Better variety enforcement**: Diverse numerical values, uncommon axis combinations, varied scenarios
- **Quality validation**: JSON schema checks, structural validation, completion detection
- **Improved error messages**: Specific fixes for each error type with actionable solutions
- **Response time tracking**: Shows generation time in console and toast notifications

#### New AI Settings
- **Temperature control** (0.3-1.2): Adjust creativity vs. consistency
  - Low (0.3-0.5): Factual, predictable
  - Medium (0.6-0.8): Balanced (default)
  - High (0.9-1.2): Maximum creativity
- **Max tokens control** (2048-16384): Prevent response truncation
  - Visual feedback showing recommended values
  - Automatic adjustment based on question count
- **Real-time feedback**: Toast notifications when adjusting settings

#### Prompt Engineering
- Rotating emphasis areas (troubleshooting, calculations, regulations, etc.)
- Temperature-aware variety notes in prompts
- Stricter JSON output requirements
- Better handling of DeepSeek R1 chain-of-thought tags
- More detailed domain-specific instructions

### 🎨 Appearance & Accessibility

#### New Appearance Settings Page
- **Font controls**:
  - Size slider: 90-130% scaling
  - Line height: Compact / Normal / Relaxed
  - Letter spacing: Normal / Wide
  - OpenDyslexic font toggle
- **Display options**:
  - Animation control: None / Reduced / Full
  - High contrast mode (enhanced borders, shadows)
  - Focus indicators toggle (keyboard navigation)
  - Sound effects toggle (placeholder for future)
- **Live preview section**: Shows how colors look before applying
- **System preferences detection**: Auto-applies reduced motion and high contrast

#### Accessibility Enhancements
- All settings save automatically to localStorage
- Respects OS-level accessibility preferences
- Enhanced keyboard navigation support
- Better color contrast in high contrast mode
- Checkmark/X symbols added to answer highlights in high contrast
- Print styles optimized for study materials

### 🛠️ Code Quality & Project Cleanup

#### Improved Error Handling
- Better API error messages with specific solutions
- Copy-to-clipboard for terminal commands
- Visual distinction between error types
- Helpful tips for each error scenario

#### Project Structure
- **Removed 14 obsolete files**:
  - `fix_*.js` (temporary fix scripts)
  - `patch*.js` (development patches)
  - `inspect.js` (debug tool)
  - Duplicate `ui.js` and `styles.css` in root
  - Old documentation files
- **Clean file organization**:
  - All CSS in `css/` directory
  - All JS in `js/` directory
  - Only essential files in root

#### Documentation
- **Comprehensive README.md**:
  - Complete feature list
  - Setup instructions for both modes
  - AI settings documentation
  - Troubleshooting guide
  - Architecture overview
  - Contributing guidelines
- **This CHANGELOG**: Detailed version history

### 🐛 Bug Fixes
- Fixed toast notification to support string types ('success', 'error', 'warning', 'info')
- Fixed AI settings not loading on page refresh
- Improved JSON parsing with better error messages
- Fixed mobile viewport font size overrides

### ⚡ Performance
- Disabled GPU acceleration for animations-none mode
- Optimized CSS transitions
- Better mobile performance with responsive font scaling

---

## v1.5.0 - Full Feature Release (January 2026)

### Features
- 90+ offline questions across all ABO domains
- AI generation with Groq and OpenRouter
- 6 color themes
- Practice and Exam modes
- Timed mode with countdown
- Progress tracking with localStorage
- Domain and difficulty filtering
- Keyboard shortcuts (1-4, A-D, Space, arrows)

---

## v1.0.0 - Initial Release (December 2025)

### Features
- Basic quiz functionality
- Offline question bank
- Simple progress tracking
- Single theme

---

**Semantic Versioning**: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes
