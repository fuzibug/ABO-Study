// Analytics and Performance Tracking

const analytics = {
  update() {
    const history = storage.getExamHistory();
    const streak = storage.getStreak();

    if (!history.length) {
      document.getElementById("analyticsAvgScore").textContent = "0%";
      document.getElementById("analyticsExamsTaken").textContent = "0";
      document.getElementById("analyticsStreak").textContent = streak.count;
      document.getElementById("analyticsTotalQuestions").textContent = "0";
      document.getElementById("weakAreas").innerHTML =
        '<p style="color: var(--color-text-secondary);">Take exams to see your weak areas and get personalized recommendations 📊</p>';
      return;
    }

    // Overall stats
    const avgScore = (
      history.reduce((sum, e) => sum + e.score, 0) / history.length
    ).toFixed(1);
    document.getElementById("analyticsAvgScore").textContent = avgScore + "%";
    document.getElementById("analyticsExamsTaken").textContent = history.length;
    document.getElementById("analyticsStreak").textContent = streak.count;

    let totalQ = 0;
    history.forEach((e) => (totalQ += e.questionCount));
    document.getElementById("analyticsTotalQuestions").textContent = totalQ;

    // Domain analysis
    const domainTotals = {
      general: { correct: 0, total: 0 },
      optics: { correct: 0, total: 0 },
      dispensing: { correct: 0, total: 0 },
      products: { correct: 0, total: 0 },
    };

    history.forEach((exam) => {
      Object.entries(exam.domainScores).forEach(([name, scores]) => {
        domainTotals[name].correct += scores.correct;
        domainTotals[name].total += scores.total;
      });
    });

    const domainAvgs = Object.entries(domainTotals)
      .map(([name, scores]) => ({
        name,
        percent: scores.total
          ? ((scores.correct / scores.total) * 100).toFixed(1)
          : 0,
        correct: scores.correct,
        total: scores.total,
      }))
      .sort((a, b) => a.percent - b.percent);

    // Display weak areas
    let weakHtml = '<div class="stats-grid">';
    domainAvgs.forEach((d) => {
      const color =
        d.percent >= 75 ? "#10b981" : d.percent >= 60 ? "#f59e0b" : "#ef4444";
      weakHtml += `
                <div class="stat-card" style="border-left: 4px solid ${color}">
                    <div class="stat-value" style="color: ${color}">${d.percent}%</div>
                    <div class="stat-label">
                        ${d.name.charAt(0).toUpperCase() + d.name.slice(1)}<br>
                        ${d.correct}/${d.total}
                    </div>
                </div>
            `;
    });
    weakHtml += "</div>";

    // Add recommendations
    const weakest = domainAvgs[0];
    if (weakest.percent < 75) {
      weakHtml += `
                <div style="background: var(--color-bg-tertiary); padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid var(--color-warning);">
                    <strong>💡 Recommendation:</strong> Focus on <strong>${weakest.name}</strong> domain.
                    Your score is ${weakest.percent}% - review study materials and practice with flashcards!
                </div>
            `;
    }

    document.getElementById("weakAreas").innerHTML = weakHtml;
  },
};
