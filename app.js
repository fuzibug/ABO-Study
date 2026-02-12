// Main Application Initialization and Event Listeners

document.addEventListener("DOMContentLoaded", function () {
  // Initialize theme
  const savedTheme = storage.getTheme();
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.getElementById("themeToggle").textContent = "☀️ Light Mode";
  }

  // Initialize home stats
  ui.updateHomeStats();
  mockExam.updateResumeButton();

  // Theme toggle
  document.getElementById("themeToggle").addEventListener("click", () => {
    ui.toggleTheme();
  });

  // Navigation tabs
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const section = this.getAttribute("data-section");
      ui.showSection(section);
    });
  });

  // Quick action buttons on home page
  document.querySelectorAll("[data-section]").forEach((btn) => {
    if (!btn.classList.contains("nav-tab")) {
      btn.addEventListener("click", function () {
        const section = this.getAttribute("data-section");
        ui.showSection(section);
      });
    }
  });

  // FLASHCARD CONTROLS
  document.querySelectorAll("[data-flashcard-domain]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const domain = this.getAttribute("data-flashcard-domain");
      flashcards.start(domain);
    });
  });

  document.getElementById("flashcard").addEventListener("click", () => {
    flashcards.flip();
  });

  document.getElementById("bookmarkBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    flashcards.toggleBookmark();
  });

  document.getElementById("flashcardPrev").addEventListener("click", () => {
    flashcards.previous();
  });

  document.getElementById("flashcardNext").addEventListener("click", () => {
    flashcards.next();
  });

  document.getElementById("flashcardShuffle").addEventListener("click", () => {
    flashcards.shuffle();
  });

  // QUICK QUIZ CONTROLS
  document.querySelectorAll("[data-quiz-domain]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const domain = this.getAttribute("data-quiz-domain");
      quickQuiz.start(domain);
    });
  });

  document.getElementById("quickQuizNext").addEventListener("click", () => {
    quickQuiz.next();
  });

  document.getElementById("quickQuizEnd").addEventListener("click", () => {
    quickQuiz.end();
  });

  document.getElementById("quickQuizRestart").addEventListener("click", () => {
    location.reload();
  });

  // Delegate quiz option clicks
  document
    .getElementById("quickQuizQuestion")
    .addEventListener("click", function (e) {
      const option = e.target.closest("[data-quiz-option]");
      if (option) {
        const idx = parseInt(option.getAttribute("data-quiz-option"));
        quickQuiz.selectAnswer(idx);
      }
    });

  // MOCK EXAM CONTROLS
  document
    .getElementById("examTimerMode")
    .addEventListener("change", function () {
      const customInput = document.getElementById("customTimerInput");
      customInput.style.display = this.value === "custom" ? "block" : "none";
    });

  document.getElementById("startExamBtn").addEventListener("click", () => {
    mockExam.start();
  });

  document.getElementById("resumeExamBtn").addEventListener("click", () => {
    mockExam.resume();
  });

  document.getElementById("examPrevBtn").addEventListener("click", () => {
    mockExam.previous();
  });

  document.getElementById("examNextBtn").addEventListener("click", () => {
    mockExam.next();
  });

  document.getElementById("markReviewBtn").addEventListener("click", () => {
    mockExam.toggleReview();
  });

  document.getElementById("examSubmitBtn").addEventListener("click", () => {
    mockExam.submit();
  });

  document.getElementById("navToggleBtn").addEventListener("click", () => {
    mockExam.toggleNav();
  });

  document.getElementById("navCloseBtn").addEventListener("click", () => {
    mockExam.toggleNav();
  });

  // Delegate exam option clicks
  document
    .getElementById("examQuestion")
    .addEventListener("click", function (e) {
      const option = e.target.closest("[data-exam-option]");
      if (option) {
        const idx = parseInt(option.getAttribute("data-exam-option"));
        mockExam.selectAnswer(idx);
      }
    });

  document.getElementById("reviewExamBtn").addEventListener("click", () => {
    mockExam.review();
  });

  document.getElementById("closeReviewBtn").addEventListener("click", () => {
    mockExam.closeReview();
  });

  document.getElementById("newExamBtn").addEventListener("click", () => {
    mockExam.returnToSetup();
  });

  document.getElementById("exportResultsBtn").addEventListener("click", () => {
    mockExam.exportResults();
  });

  // PROGRESS CONTROLS
  document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    if (
      confirm(
        "Are you sure you want to clear all exam history? This cannot be undone! 🗑️",
      )
    ) {
      storage.clearExamHistory();
      ui.displayProgress();
      ui.updateHomeStats();
      analytics.update();
    }
  });

  // KEYBOARD SHORTCUTS
  document.addEventListener("keydown", function (e) {
    // Mock exam shortcuts
    if (mockExam.state.active) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        mockExam.next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        mockExam.previous();
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < 4) {
          mockExam.selectAnswer(idx);
        }
      } else if (e.key === "m" || e.key === "M") {
        mockExam.toggleReview();
      } else if (e.key === "n" || e.key === "N") {
        mockExam.toggleNav();
      }
    }

    // Flashcard shortcuts
    if (flashcards.state.questions.length > 0) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        flashcards.next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        flashcards.previous();
      } else if (e.key === " ") {
        e.preventDefault();
        flashcards.flip();
      } else if (e.key === "b" || e.key === "B") {
        flashcards.toggleBookmark();
      }
    }
  });

  console.log(
    "%c🎓 ABO Certification Study Hub",
    "font-size: 20px; color: #86a789; font-weight: bold;",
  );
  console.log(
    "%cApp loaded successfully! Good luck with your studies! 😊",
    "font-size: 14px; color: #6b7280;",
  );
});
