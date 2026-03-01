// ═══════════════════════════════════════════════════════════════════
// ABO Exam Prep - Core Application (v2.0)
// ═══════════════════════════════════════════════════════════════════

const App = {
  // Storage
  STORAGE_KEY: 'abo_v2',
  
  // State
  state: {
    mode: 'ai',
    provider: 'groq',
    apiKey: '',
    domain: 'all',
    difficulty: 'intermediate',
    questionCount: 10,
    timedMode: false,
    showExplanations: true,
    shuffleOptions: true,
    
    currentQuiz: null,
    currentQuestionIndex: 0,
    answers: [],
    timer: null,
    timeLeft: 60
  },
  
  // Initialize
  init() {
    console.log('🚀 Initializing ABO Exam Prep v2.0');
    this.loadSettings();
    this.bindEvents();
    this.updateUI();
  },
  
  // Event bindings
  bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.target.dataset.section;
        this.navigateTo(section);
      });
    });
    
    // Setup options
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectOption(e.currentTarget, '[data-mode]');
        this.state.mode = e.currentTarget.dataset.mode;
        document.getElementById('ai-settings').style.display = 
          this.state.mode === 'ai' ? 'block' : 'none';
      });
    });
    
    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectOption(e.currentTarget, '[data-diff]');
        this.state.difficulty = e.currentTarget.dataset.diff;
      });
    });
    
    // Inputs
    document.getElementById('ai-provider').addEventListener('change', (e) => {
      this.state.provider = e.target.value;
    });
    
    document.getElementById('api-key').addEventListener('change', (e) => {
      this.state.apiKey = e.target.value;
      this.saveSettings();
    });
    
    document.getElementById('domain').addEventListener('change', (e) => {
      this.state.domain = e.target.value;
    });
    
    document.getElementById('question-count').addEventListener('input', (e) => {
      this.state.questionCount = parseInt(e.target.value);
      document.getElementById('q-count').textContent = e.target.value;
    });
    
    // Toggles
    document.getElementById('timed-toggle').addEventListener('click', () => {
      this.toggleSwitch('timed-toggle');
      this.state.timedMode = !this.state.timedMode;
    });
    
    document.getElementById('explain-toggle').addEventListener('click', () => {
      this.toggleSwitch('explain-toggle');
      this.state.showExplanations = !this.state.showExplanations;
    });
    
    document.getElementById('shuffle-toggle').addEventListener('click', () => {
      this.toggleSwitch('shuffle-toggle');
      this.state.shuffleOptions = !this.state.shuffleOptions;
    });
    
    // Buttons
    document.getElementById('start-btn').addEventListener('click', () => this.startQuiz());
    document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
    document.getElementById('quit-btn').addEventListener('click', () => this.quitQuiz());
    document.getElementById('export-btn').addEventListener('click', () => this.exportReport());
    document.getElementById('clear-btn').addEventListener('click', () => this.clearData());
    document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
  },
  
  // Navigation
  navigateTo(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(section).classList.add('active');
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    if (section === 'progress') {
      this.updateProgress();
    }
  },
  
  // UI helpers
  selectOption(element, selector) {
    document.querySelectorAll(selector).forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
  },
  
  toggleSwitch(id) {
    const toggle = document.getElementById(id);
    toggle.classList.toggle('active');
  },
  
  updateUI() {
    document.getElementById('ai-settings').style.display = 
      this.state.mode === 'ai' ? 'block' : 'none';
  },
  
  toast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  },
  
  // Quiz functions
  async startQuiz() {
    if (this.state.mode === 'ai' && !this.state.apiKey) {
      this.toast('⚠️ Please enter an API key first');
      return;
    }
    
    this.toast('🔄 Generating questions...');
    
    try {
      const questions = this.state.mode === 'ai' 
        ? await this.generateAIQuestions()
        : this.getOfflineQuestions();
      
      this.state.currentQuiz = questions;
      this.state.currentQuestionIndex = 0;
      this.state.answers = [];
      
      this.navigateTo('quiz');
      this.displayQuestion();
      
    } catch (error) {
      console.error('Quiz start error:', error);
      this.toast('❌ Error starting quiz: ' + error.message);
    }
  },
  
  async generateAIQuestions() {
    const prompt = this.buildAIPrompt();
    
    const providers = {
      groq: {
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.3-70b-versatile'
      },
      openai: {
        url: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4-turbo-preview'
      },
      anthropic: {
        url: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-sonnet-20240229'
      }
    };
    
    const config = providers[this.state.provider];
    
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert ABO (American Board of Opticianry) exam question generator. Generate accurate, clinically relevant questions that match real exam standards.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    return JSON.parse(jsonMatch[0]);
  },
  
  buildAIPrompt() {
    const domainDescriptions = {
      all: 'all ABO content domains',
      geometric_optics: 'geometric optics (light behavior, refraction, vergence)',
      ophthalmic_optics: 'ophthalmic optics (lens power, prism, Prentice\'s rule)',
      lens_materials: 'lens materials (CR-39, polycarbonate, high-index)',
      lens_designs: 'lens designs (single vision, bifocal, progressive)',
      coatings: 'lens coatings and treatments (AR, UV, photochromic)',
      frames: 'frame selection and fitting (materials, sizing, face shapes)',
      measurements: 'optical measurements (PD, seg height, vertex distance)',
      dispensing: 'dispensing and adjustments (fitting, troubleshooting)',
      prescriptions: 'prescriptions and transposition',
      contact_lenses: 'contact lenses (types, parameters, fitting)',
      regulations: 'regulations and standards (ANSI Z80, FDA, OSHA)'
    };
    
    const difficultyGuides = {
      foundation: 'basic recall and definitions',
      intermediate: 'applied knowledge and moderate calculations',
      advanced: 'complex scenarios, multi-step calculations, and edge cases'
    };
    
    return `Generate ${this.state.questionCount} ABO certification exam questions focused on ${domainDescriptions[this.state.domain]}. 

Difficulty: ${this.state.difficulty} (${difficultyGuides[this.state.difficulty]})

Requirements:
1. Each question must be clinically accurate and exam-relevant
2. Use specific numbers and measurements where appropriate
3. Include realistic patient scenarios
4. Provide 4 answer options (A, B, C, D)
5. Only ONE correct answer per question
6. Explanations should cite ABO standards or clinical reasoning

Return ONLY a JSON array with this exact structure:
[
  {
    "question": "Question text",
    "options": ["A option", "B option", "C option", "D option"],
    "correct": 0,
    "explanation": "Why this is correct",
    "domain": "${this.state.domain}",
    "difficulty": "${this.state.difficulty}"
  }
]

Example question formats:
- Calculation: "A patient needs +3.00D add at 12mm vertex. What is the effective power at the eye?"
- Clinical: "A patient complains of peripheral distortion in new progressives. The seg height measures 18mm in a 38mm B measurement. What is the likely issue?"
- Standards: "Per ANSI Z80.1, what is the tolerance for sphere power in a -4.00D lens?"

Generate ${this.state.questionCount} questions now:`;
  },
  
  getOfflineQuestions() {
    // Simplified offline bank - you can expand this
    const bank = [
      {
        question: "What is the index of refraction of CR-39 plastic?",
        options: ["1.498", "1.523", "1.586", "1.661"],
        correct: 0,
        explanation: "CR-39 (Columbia Resin 39) has a refractive index of 1.498, making it the standard baseline for plastic lenses.",
        domain: "lens_materials",
        difficulty: "foundation"
      },
      {
        question: "A lens with -6.00 DS at 12mm vertex needs to be moved to 15mm. What is the new effective power?",
        options: ["-5.87D", "-5.93D", "-6.00D", "-6.07D"],
        correct: 0,
        explanation: "Using vertex formula: F' = F / (1 - dF) where d = 0.003m. Moving away from eye reduces minus power.",
        domain: "ophthalmic_optics",
        difficulty: "intermediate"
      }
    ];
    
    return bank.slice(0, this.state.questionCount);
  },
  
  displayQuestion() {
    const q = this.state.currentQuiz[this.state.currentQuestionIndex];
    const qNum = this.state.currentQuestionIndex + 1;
    const total = this.state.currentQuiz.length;
    
    document.getElementById('q-num').textContent = qNum;
    document.getElementById('q-total').textContent = total;
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('quiz-progress').style.width = `${(qNum / total) * 100}%`;
    
    const optionsHtml = q.options.map((opt, idx) => `
      <div class="option" data-answer="${idx}">
        <div class="option-label">${String.fromCharCode(65 + idx)}</div>
        <div>${opt}</div>
      </div>
    `).join('');
    
    document.getElementById('options').innerHTML = optionsHtml;
    document.getElementById('explanation').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    
    // Bind option clicks
    document.querySelectorAll('#options .option').forEach(opt => {
      opt.addEventListener('click', (e) => this.selectAnswer(e.currentTarget));
    });
    
    // Start timer if enabled
    if (this.state.timedMode) {
      this.startTimer();
    } else {
      document.getElementById('timer').textContent = '';
    }
  },
  
  startTimer() {
    this.state.timeLeft = 60;
    document.getElementById('timer').textContent = '60s';
    
    this.state.timer = setInterval(() => {
      this.state.timeLeft--;
      document.getElementById('timer').textContent = this.state.timeLeft + 's';
      
      if (this.state.timeLeft <= 10) {
        document.getElementById('timer').style.color = 'var(--danger)';
      }
      
      if (this.state.timeLeft === 0) {
        clearInterval(this.state.timer);
        this.selectAnswer(null); // Auto-submit
      }
    }, 1000);
  },
  
  selectAnswer(element) {
    if (this.state.timer) clearInterval(this.state.timer);
    
    const q = this.state.currentQuiz[this.state.currentQuestionIndex];
    const selected = element ? parseInt(element.dataset.answer) : -1;
    const correct = q.correct;
    
    // Record answer
    this.state.answers.push({
      question: q.question,
      selected: selected,
      correct: correct,
      isCorrect: selected === correct,
      domain: q.domain
    });
    
    // Disable all options
    document.querySelectorAll('#options .option').forEach(opt => {
      opt.style.pointerEvents = 'none';
    });
    
    // Show results
    if (element) {
      element.classList.add(selected === correct ? 'correct' : 'incorrect');
    }
    document.querySelectorAll('#options .option')[correct].classList.add('correct');
    
    // Show explanation
    if (this.state.showExplanations) {
      document.getElementById('explanation').innerHTML = `
        <strong>${selected === correct ? '✅ Correct!' : '❌ Incorrect'}</strong><br><br>
        ${q.explanation}
      `;
      document.getElementById('explanation').style.display = 'block';
    }
    
    document.getElementById('next-btn').style.display = 'block';
  },
  
  nextQuestion() {
    this.state.currentQuestionIndex++;
    
    if (this.state.currentQuestionIndex < this.state.currentQuiz.length) {
      this.displayQuestion();
    } else {
      this.finishQuiz();
    }
  },
  
  finishQuiz() {
    const correct = this.state.answers.filter(a => a.isCorrect).length;
    const total = this.state.answers.length;
    const accuracy = Math.round((correct / total) * 100);
    
    // Save to storage
    this.saveQuizResults({
      date: new Date().toISOString(),
      correct,
      total,
      accuracy,
      domain: this.state.domain,
      difficulty: this.state.difficulty,
      answers: this.state.answers
    });
    
    this.toast(`✅ Quiz complete! Score: ${correct}/${total} (${accuracy}%)`);
    this.navigateTo('progress');
  },
  
  quitQuiz() {
    if (confirm('Quit current quiz? Progress will be lost.')) {
      if (this.state.timer) clearInterval(this.state.timer);
      this.navigateTo('setup');
    }
  },
  
  // Storage functions
  saveQuizResults(result) {
    const data = this.loadData();
    data.sessions.push(result);
    
    // Update domain stats
    result.answers.forEach(a => {
      if (!data.domains[a.domain]) {
        data.domains[a.domain] = { correct: 0, total: 0 };
      }
      data.domains[a.domain].total++;
      if (a.isCorrect) data.domains[a.domain].correct++;
    });
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },
  
  loadData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : { sessions: [], domains: {} };
  },
  
  loadSettings() {
    const saved = localStorage.getItem(this.STORAGE_KEY + '_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      this.state.apiKey = settings.apiKey || '';
      this.state.showExplanations = settings.showExplanations !== false;
      this.state.shuffleOptions = settings.shuffleOptions !== false;
      
      document.getElementById('api-key').value = this.state.apiKey;
      document.getElementById('student-name').value = settings.studentName || '';
      document.getElementById('exam-date').value = settings.examDate || '';
    }
  },
  
  saveSettings() {
    const settings = {
      apiKey: this.state.apiKey,
      showExplanations: this.state.showExplanations,
      shuffleOptions: this.state.shuffleOptions,
      studentName: document.getElementById('student-name').value,
      examDate: document.getElementById('exam-date').value
    };
    localStorage.setItem(this.STORAGE_KEY + '_settings', JSON.stringify(settings));
    this.toast('✅ Settings saved');
  },
  
  clearData() {
    if (confirm('Clear ALL progress data? This cannot be undone.')) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.toast('🗑️ Data cleared');
      this.updateProgress();
    }
  },
  
  // Progress display
  updateProgress() {
    const data = this.loadData();
    const sessions = data.sessions;
    
    if (sessions.length === 0) {
      document.getElementById('total-qs').textContent = '0';
      document.getElementById('accuracy').textContent = '0%';
      document.getElementById('sessions').textContent = '0';
      return;
    }
    
    const totalQuestions = sessions.reduce((sum, s) => sum + s.total, 0);
    const totalCorrect = sessions.reduce((sum, s) => sum + s.correct, 0);
    const overallAccuracy = Math.round((totalCorrect / totalQuestions) * 100);
    
    document.getElementById('total-qs').textContent = totalQuestions;
    document.getElementById('accuracy').textContent = overallAccuracy + '%';
    document.getElementById('sessions').textContent = sessions.length;
    
    // Domain stats
    const domainHtml = Object.entries(data.domains).map(([domain, stats]) => {
      const acc = Math.round((stats.correct / stats.total) * 100);
      return `
        <div style="display: flex; justify-content: space-between; padding: 15px; background: var(--surface-light); border-radius: 10px; margin-bottom: 10px;">
          <div>
            <div style="font-weight: 600;">${domain.replace(/_/g, ' ').toUpperCase()}</div>
            <div style="font-size: 0.9rem; color: var(--text-dim);">${stats.correct}/${stats.total} correct</div>
          </div>
          <div style="font-size: 1.5rem; font-weight: 700; color: ${acc >= 75 ? 'var(--success)' : 'var(--danger)'};">${acc}%</div>
        </div>
      `;
    }).join('');
    
    document.getElementById('domain-stats').innerHTML = domainHtml || '<p style="text-align: center; color: var(--text-dim);">No domain data yet</p>';
    
    // Session history
    const sessionHtml = sessions.slice(-10).reverse().map(s => `
      <div style="display: flex; justify-content: space-between; padding: 15px; background: var(--surface-light); border-radius: 10px; margin-bottom: 10px;">
        <div>
          <div style="font-weight: 600;">${new Date(s.date).toLocaleDateString()}</div>
          <div style="font-size: 0.9rem; color: var(--text-dim);">${s.domain} • ${s.difficulty}</div>
        </div>
        <div style="font-size: 1.2rem; font-weight: 700; color: ${s.accuracy >= 75 ? 'var(--success)' : 'var(--danger)'};">${s.correct}/${s.total}</div>
      </div>
    `).join('');
    
    document.getElementById('session-history').innerHTML = sessionHtml;
  },
  
  // Export report
  exportReport() {
    const data = this.loadData();
    if (data.sessions.length === 0) {
      this.toast('⚠️ No data to export yet');
      return;
    }
    
    const report = {
      generatedAt: new Date().toISOString(),
      studentName: document.getElementById('student-name').value || 'ABO Student',
      examDate: document.getElementById('exam-date').value || 'Not set',
      sessions: data.sessions,
      domains: data.domains,
      summary: {
        totalQuestions: data.sessions.reduce((sum, s) => sum + s.total, 0),
        totalCorrect: data.sessions.reduce((sum, s) => sum + s.correct, 0),
        overallAccuracy: Math.round((data.sessions.reduce((sum, s) => sum + s.correct, 0) / data.sessions.reduce((sum, s) => sum + s.total, 0)) * 100),
        totalSessions: data.sessions.length
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abo-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.toast('📥 Report downloaded');
  }
};

// Initialize when DOM loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
