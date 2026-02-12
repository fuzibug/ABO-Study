// UI Management and Navigation

const ui = {
  // Show specific section
  showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll(".content-section").forEach((s) => {
      s.classList.remove("active");
    });

    // Remove active from all tabs
    document.querySelectorAll(".nav-tab").forEach((t) => {
      t.classList.remove("active");
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) section.classList.add("active");

    // Activate corresponding tab
    const tab = document.querySelector(`[data-section="${sectionId}"]`);
    if (tab) tab.classList.add("active");

    // Update content for specific sections
    if (sectionId === "home") ui.updateHomeStats();
    if (sectionId === "analytics") analytics.update();
    if (sectionId === "progress") ui.displayProgress();
  },

  // Update home statistics
  updateHomeStats() {
    const streak = storage.getStreak();
    document.getElementById("homeStreak").textContent = streak.count;

    const history = storage.getExamHistory();
    let totalQ = 0;
    history.forEach((e) => (totalQ += e.questionCount));
    document.getElementById("homeTotalQuestions").textContent = totalQ;

    if (history.length) {
      const avgScore = (
        history.reduce((sum, e) => sum + e.score, 0) / history.length
      ).toFixed(1);
      document.getElementById("homeAvgScore").textContent = avgScore + "%";

      const latest = history[history.length - 1];
      const date = new Date(latest.date).toLocaleDateString();
      document.getElementById("homeLastExam").innerHTML =
        `Last exam: <strong>${latest.score}%</strong> on ${date}`;
    } else {
      document.getElementById("homeAvgScore").textContent = "0%";
      document.getElementById("homeLastExam").innerHTML = "";
    }
  },

  // Display exam history
  displayProgress() {
    const history = storage.getExamHistory();
    const container = document.getElementById("attemptHistory");

    if (!history.length) {
      container.innerHTML =
        '<p style="color: var(--color-text-secondary); text-align: center; padding: 20px;">No exams yet! Take your first mock exam to start tracking progress 😊</p>';
      return;
    }

    let html =
      '<div style="display: flex; flex-direction: column; gap: 15px;">';
    const reversedHistory = [...history].reverse();

    reversedHistory.forEach((attempt, idx) => {
      const date = new Date(attempt.date).toLocaleString();
      const color = attempt.passed ? "#10b981" : "#ef4444";

      html += `
                <div class="card" style="border-left: 4px solid ${color}">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                        <div>
                            <h3 style="color: ${color}">Attempt ${history.length - idx} ${attempt.passed ? "✓ PASSED" : "✗ FAILED"}</h3>
                            <p style="color: var(--color-text-secondary); margin: 5px 0;">${date}</p>
                            <p style="color: var(--color-text-secondary); font-size: 0.9em;">${attempt.questionCount} questions</p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 2em; color: ${color}; font-weight: bold;">${attempt.score}%</div>
                            <div style="color: var(--color-text-secondary);">${attempt.correct}/${attempt.questionCount}</div>
                        </div>
                    </div>
                </div>
            `;
    });

    html += "</div>";
    container.innerHTML = html;
  },

  // Theme toggle
  toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    storage.saveTheme(newTheme);

    const btn = document.getElementById("themeToggle");
    btn.textContent = newTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  },
};
