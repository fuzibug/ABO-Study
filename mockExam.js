// Mock Exam Mode

const mockExam = {
  state: {
    active: false,
    startTime: null,
    timeRemaining: 7200,
    currentQuestion: 0,
    questions: [],
    answers: [],
    markedForReview: [],
    timerInterval: null,
    timerMode: "standard",
    questionCount: 125,
  },

  start() {
    const questionCount = parseInt(
      document.getElementById("examQuestionCount").value,
    );
    const timerMode = document.getElementById("examTimerMode").value;
    const domain = document.getElementById("examDomain").value;

    this.state.questionCount = questionCount;
    this.state.timerMode = timerMode;
    this.state.questions = this.generateQuestions(questionCount, domain);
    this.state.answers = new Array(questionCount).fill(null);
    this.state.markedForReview = new Array(questionCount).fill(false);
    this.state.currentQuestion = 0;
    this.state.startTime = Date.now();
    this.state.active = true;

    if (this.state.timerInterval) clearInterval(this.state.timerInterval);

    if (timerMode === "none") {
      this.state.timeRemaining = null;
      document.getElementById("timerDisplay").style.display = "none";
    } else if (timerMode === "standard") {
      this.state.timeRemaining = 7200;
      document.getElementById("timerDisplay").style.display = "flex";
      this.startTimer();
    } else {
      const customMinutes = parseInt(
        document.getElementById("customTimerMinutes").value,
      );
      this.state.timeRemaining = customMinutes * 60;
      document.getElementById("timerDisplay").style.display = "flex";
      this.startTimer();
    }

    document.getElementById("examSetup").style.display = "none";
    document.getElementById("mockExamContainer").style.display = "block";
    document.getElementById("examResults").style.display = "none";
    document.getElementById("examReview").style.display = "none";
    document.getElementById("totalQuestions").textContent = questionCount;

    this.loadQuestion();
    this.generateNav();
    this.saveState();
    this.updateResumeButton();
    updateStreak();
  },

  generateQuestions(count, domain) {
    let sourceQuestions = [];

    if (domain === "all") {
      const proportions = {
        general: 0.25,
        optics: 0.25,
        dispensing: 0.2,
        products: 0.2,
      };

      Object.entries(proportions).forEach(([key, prop]) => {
        const domainCount = Math.round(count * prop);
        sourceQuestions.push(
          ...getRandomQuestions(questionBank[key], domainCount),
        );
      });

      while (sourceQuestions.length < count) {
        const allQuestions = [
          ...questionBank.general,
          ...questionBank.optics,
          ...questionBank.dispensing,
          ...questionBank.products,
        ];
        sourceQuestions.push(
          allQuestions[Math.floor(Math.random() * allQuestions.length)],
        );
      }
    } else {
      sourceQuestions = getRandomQuestions(questionBank[domain], count);
    }

    return shuffleArray(sourceQuestions).slice(0, count);
  },

  startTimer() {
    if (this.state.timerInterval) clearInterval(this.state.timerInterval);

    this.state.timerInterval = setInterval(() => {
      if (this.state.timeRemaining === null) return;

      this.state.timeRemaining--;
      document.getElementById("pearsonTimer").textContent = formatTime(
        this.state.timeRemaining,
      );

      if (this.state.timeRemaining <= 0) {
        clearInterval(this.state.timerInterval);
        alert("Time is up! ⏰");
        this.submit();
      }
    }, 1000);
  },

  loadQuestion() {
    const q = this.state.questions[this.state.currentQuestion];
    const letters = ["A", "B", "C", "D"];

    document.getElementById("pearsonQuestionNumber").textContent =
      this.state.currentQuestion + 1;

    let html = `<div class="pearson-question-text">${q.q}</div><div class="pearson-options">`;

    q.opts.forEach((opt, idx) => {
      const selected =
        this.state.answers[this.state.currentQuestion] === idx
          ? "selected"
          : "";
      const checked =
        this.state.answers[this.state.currentQuestion] === idx ? "checked" : "";

      html += `
                <label class="pearson-option ${selected}" data-exam-option="${idx}">
                    <input type="radio" name="examQuestion${this.state.currentQuestion}" value="${idx}" ${checked}>
                    <span><strong>${letters[idx]}.</strong> ${opt}</span>
                </label>
            `;
    });

    html += "</div>";
    document.getElementById("examQuestion").innerHTML = html;
    this.updateNav();
    this.saveState();
  },

  selectAnswer(idx) {
    this.state.answers[this.state.currentQuestion] = idx;
    this.loadQuestion();
  },

  previous() {
    if (this.state.currentQuestion > 0) {
      this.state.currentQuestion--;
      this.loadQuestion();
    }
  },

  next() {
    if (this.state.currentQuestion < this.state.questionCount - 1) {
      this.state.currentQuestion++;
      this.loadQuestion();
    }
  },

  generateNav() {
    const nav = document.getElementById("questionNav");
    nav.innerHTML = "";

    for (let i = 0; i < this.state.questionCount; i++) {
      const btn = document.createElement("div");
      btn.className = "question-nav-btn";
      btn.textContent = i + 1;
      btn.onclick = () => this.jumpTo(i);
      nav.appendChild(btn);
    }

    this.updateNav();
  },

  updateNav() {
    const buttons = document.querySelectorAll(".question-nav-btn");
    buttons.forEach((btn, i) => {
      btn.classList.toggle("answered", this.state.answers[i] !== null);
      btn.classList.toggle("current", i === this.state.currentQuestion);
      btn.classList.toggle("review-flag", this.state.markedForReview[i]);
    });
  },

  toggleNav() {
    const container = document.getElementById("questionNavContainer");
    const isVisible = container.style.display === "flex";
    container.style.display = isVisible ? "none" : "flex";
    if (!isVisible) this.updateNav();
  },

  jumpTo(idx) {
    this.state.currentQuestion = idx;
    this.loadQuestion();
  },

  toggleReview() {
    this.state.markedForReview[this.state.currentQuestion] =
      !this.state.markedForReview[this.state.currentQuestion];
    this.updateNav();
    this.saveState();
  },

  submit() {
    const unanswered = this.state.answers.filter((a) => a === null).length;

    if (unanswered > 0) {
      if (
        !confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)
      ) {
        return;
      }
    }

    if (this.state.timerInterval) clearInterval(this.state.timerInterval);

    let correct = 0;
    const domainScores = {
      general: { correct: 0, total: 0 },
      optics: { correct: 0, total: 0 },
      dispensing: { correct: 0, total: 0 },
      products: { correct: 0, total: 0 },
    };

    this.state.questions.forEach((q, idx) => {
      const isCorrect = this.state.answers[idx] === q.correct;
      if (isCorrect) correct++;

      const domain = getDomainFromQuestion(q);
      if (domainScores[domain]) {
        domainScores[domain].total++;
        if (isCorrect) domainScores[domain].correct++;
      }
    });

    const score = ((correct / this.state.questionCount) * 100).toFixed(1);
    const passed = score >= 75;

    let timeUsed = 0;
    if (this.state.timerMode === "none") {
      timeUsed = Math.floor((Date.now() - this.state.startTime) / 1000);
    } else {
      const initialTime =
        this.state.timerMode === "standard"
          ? 7200
          : parseInt(document.getElementById("customTimerMinutes").value) * 60;
      timeUsed = initialTime - this.state.timeRemaining;
    }

    const attempt = {
      date: new Date().toISOString(),
      score: parseFloat(score),
      correct,
      incorrect: this.state.questionCount - correct,
      passed,
      timeUsed,
      domainScores,
      questionCount: this.state.questionCount,
      timerMode: this.state.timerMode,
    };

    const history = storage.getExamHistory();
    history.push(attempt);
    storage.saveExamHistory(history);

    this.showResults(attempt);

    this.state.active = false;
    storage.clearActiveExamState();
    this.updateResumeButton();
  },

  showResults(attempt) {
    document.getElementById("mockExamContainer").style.display = "none";
    document.getElementById("examResults").style.display = "block";

    document.getElementById("passFailMessage").innerHTML = attempt.passed
      ? '<span class="pass">✓ PASSED</span>'
      : '<span class="fail">✗ FAILED</span>';
    document.getElementById("finalScore").textContent = attempt.score + "%";
    document.getElementById("correctCount").textContent = attempt.correct;
    document.getElementById("incorrectCount").textContent = attempt.incorrect;
    document.getElementById("timeUsed").textContent = formatTimeShort(
      attempt.timeUsed,
    );

    let domainHtml = '<div class="stats-grid">';
    Object.entries(attempt.domainScores).forEach(([name, scores]) => {
      if (!scores.total) return;

      const domainPercent = ((scores.correct / scores.total) * 100).toFixed(1);
      const color =
        domainPercent >= 75
          ? "#10b981"
          : domainPercent >= 60
            ? "#f59e0b"
            : "#ef4444";

      domainHtml += `
                <div class="stat-card" style="border-left: 4px solid ${color}">
                    <div class="stat-value" style="color: ${color}">${domainPercent}%</div>
                    <div class="stat-label">${name.charAt(0).toUpperCase() + name.slice(1)}<br>${scores.correct}/${scores.total}</div>
                </div>
            `;
    });
    domainHtml += "</div>";

    document.getElementById("domainBreakdown").innerHTML = domainHtml;
  },

  review() {
    document.getElementById("examResults").style.display = "none";
    document.getElementById("examReview").style.display = "block";

    const container = document.getElementById("reviewQuestions");
    container.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    this.state.questions.forEach((q, idx) => {
      const userAnswer = this.state.answers[idx];
      const isCorrect = userAnswer === q.correct;

      let html = `
                <div class="review-question ${isCorrect ? "correct" : "incorrect"}">
                    <div style="margin-bottom: 15px;">
                        <span class="review-badge ${isCorrect ? "correct" : "incorrect"}">
                            ${isCorrect ? "✓" : "✗"} Q${idx + 1}
                        </span>
                    </div>
                    <h3 style="margin-bottom: 15px;">${q.q}</h3>
                    <div style="margin: 15px 0;">
            `;

      q.opts.forEach((option, optIdx) => {
        const isUserAnswer = userAnswer === optIdx;
        const isCorrectAnswer = q.correct === optIdx;
        let optionClass = "review-option";
        if (isCorrectAnswer) optionClass += " correct-answer";
        if (isUserAnswer && !isCorrectAnswer) optionClass += " user-answer";

        let badge = "";
        if (isCorrectAnswer) {
          badge =
            '<strong style="color: var(--color-success);">✓ Correct</strong>';
        } else if (isUserAnswer) {
          badge =
            '<strong style="color: var(--color-danger);">✗ Your Answer</strong>';
        }

        html += `
                    <div class="${optionClass}">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span><strong>${letters[optIdx]}.</strong> ${option}</span>
                            ${badge}
                        </div>
                    </div>
                `;
      });

      html += `
                    </div>
                    <div class="explanation-box">
                        <strong>📚 Explanation:</strong><br>${q.exp}
                    </div>
                </div>
            `;

      container.innerHTML += html;
    });
  },

  closeReview() {
    document.getElementById("examReview").style.display = "none";
    document.getElementById("examResults").style.display = "block";
  },

  returnToSetup() {
    document.getElementById("examResults").style.display = "none";
    document.getElementById("examReview").style.display = "none";
    document.getElementById("examSetup").style.display = "block";
  },

  exportResults() {
    const history = storage.getExamHistory();
    const latest = history[history.length - 1];

    let csv = "ABO Exam Results\n\n";
    csv += `Date,${new Date(latest.date).toLocaleString()}\n`;
    csv += `Score,${latest.score}%\n`;
    csv += `Correct,${latest.correct}\n`;
    csv += `Incorrect,${latest.incorrect}\n`;
    csv += `Passed,${latest.passed ? "Yes" : "No"}\n\n`;
    csv += "Domain,Correct,Total,Percentage\n";

    Object.entries(latest.domainScores).forEach(([name, scores]) => {
      const pct = ((scores.correct / scores.total) * 100).toFixed(1);
      csv += `${name},${scores.correct},${scores.total},${pct}%\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ABO_Exam_Results_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  saveState() {
    if (!this.state.active) return;
    storage.saveActiveExamState({
      examState: this.state,
      markedForReview: this.state.markedForReview,
    });
  },

  resume() {
    const saved = storage.getActiveExamState();
    if (!saved) return;

    this.state = saved.examState;
    this.state.markedForReview =
      saved.markedForReview || new Array(this.state.questionCount).fill(false);

    document.getElementById("examSetup").style.display = "none";
    document.getElementById("mockExamContainer").style.display = "block";
    document.getElementById("totalQuestions").textContent =
      this.state.questionCount;

    if (this.state.timerMode !== "none") {
      document.getElementById("timerDisplay").style.display = "flex";
      this.startTimer();
    }

    this.loadQuestion();
    this.generateNav();
  },

  updateResumeButton() {
    const btn = document.getElementById("resumeExamBtn");
    const saved = storage.getActiveExamState();
    btn.style.display =
      saved && saved.examState && saved.examState.active
        ? "inline-block"
        : "none";
  },
};
