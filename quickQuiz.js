// Quick Quiz Mode

const quickQuiz = {
  state: {
    questions: [],
    currentIndex: 0,
    score: 0,
    answered: false,
  },

  start(domain) {
    // Generate 10 unique questions with random values
    const allQ = generateUniqueQuestions(domain === 'all' ? 'all' : domain, 10);
    this.state.questions = shuffleArray([...allQ]);
    this.state.currentIndex = 0;
    this.state.score = 0;
    this.state.answered = false;
    
    document.getElementById('quickQuizContainer').style.display = 'block';
    document.getElementById('quickQuizResults').style.display = 'none';
    
    this.loadQuestion();
    updateStreak();
},

  loadQuestion() {
    const q = this.state.questions[this.state.currentIndex];
    const letters = ["A", "B", "C", "D"];

    let html = `<div class="pearson-question-text">${q.q}</div><div class="pearson-options">`;

    q.opts.forEach((opt, idx) => {
      html += `
                <label class="pearson-option" data-quiz-option="${idx}">
                    <input type="radio" name="quickQuiz${this.state.currentIndex}" value="${idx}">
                    <span><strong>${letters[idx]}.</strong> ${opt}</span>
                </label>
            `;
    });

    html +=
      '</div><div id="quickQuizFeedback" style="margin-top: 20px;"></div>';

    document.getElementById("quickQuizQuestion").innerHTML = html;
    document.getElementById("quickQuizNumber").textContent =
      this.state.currentIndex + 1;
    document.getElementById("quickQuizScore").textContent =
      `${this.state.score}/${this.state.currentIndex}`;

    this.state.answered = false;
  },

  selectAnswer(idx) {
    if (this.state.answered) return;

    const q = this.state.questions[this.state.currentIndex];
    const isCorrect = idx === q.correct;

    if (isCorrect) this.state.score++;

    const feedback = document.getElementById("quickQuizFeedback");
    feedback.style.padding = "15px";
    feedback.style.borderRadius = "8px";
    feedback.style.background = isCorrect
      ? "rgba(16, 185, 129, 0.1)"
      : "rgba(239, 68, 68, 0.1)";
    feedback.innerHTML = `
            <strong style="color: ${isCorrect ? "var(--color-success)" : "var(--color-danger)"};">
                ${isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </strong><br>
            ${q.exp}
        `;

    this.state.answered = true;
  },

  next() {
    if (this.state.currentIndex < 9) {
      this.state.currentIndex++;
      this.loadQuestion();
    } else {
      this.end();
    }
  },

  end() {
    document.getElementById("quickQuizContainer").style.display = "none";
    document.getElementById("quickQuizResults").style.display = "block";

    const score = ((this.state.score / 10) * 100).toFixed(1);
    document.getElementById("quickQuizFinalScore").textContent = score + "%";
    document.getElementById("quickQuizCorrect").textContent =
      `${this.state.score}/10`;
  },
};
