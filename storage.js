// LocalStorage Management

const storage = {
  // Exam history
  getExamHistory() {
    return JSON.parse(localStorage.getItem("aboExamHistory") || "[]");
  },

  saveExamHistory(history) {
    localStorage.setItem("aboExamHistory", JSON.stringify(history));
  },

  clearExamHistory() {
    localStorage.removeItem("aboExamHistory");
  },

  // Active exam state (for resume)
  getActiveExamState() {
    return JSON.parse(localStorage.getItem("aboExamActiveState") || "null");
  },

  saveActiveExamState(state) {
    localStorage.setItem("aboExamActiveState", JSON.stringify(state));
  },

  clearActiveExamState() {
    localStorage.removeItem("aboExamActiveState");
  },

  // Bookmarked questions
  getBookmarks() {
    return JSON.parse(localStorage.getItem("aboBookmarks") || "{}");
  },

  saveBookmarks(bookmarks) {
    localStorage.setItem("aboBookmarks", JSON.stringify(bookmarks));
  },

  // Study streak
  getStreak() {
    return JSON.parse(
      localStorage.getItem("aboStudyStreak") ||
        '{"lastDate": null, "count": 0}',
    );
  },

  saveStreak(streak) {
    localStorage.setItem("aboStudyStreak", JSON.stringify(streak));
  },

  // Theme preference
  getTheme() {
    return localStorage.getItem("aboTheme") || "light";
  },

  saveTheme(theme) {
    localStorage.setItem("aboTheme", theme);
  },
};

// Study streak management
function updateStreak() {
  const streak = storage.getStreak();
  const today = new Date().toDateString();

  if (streak.lastDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (streak.lastDate === yesterday || !streak.lastDate) {
    streak.count++;
  } else {
    streak.count = 1;
  }

  streak.lastDate = today;
  storage.saveStreak(streak);
}
