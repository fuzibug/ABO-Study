// Utility Functions

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Get random questions from array
function getRandomQuestions(arr, count) {
  const shuffled = shuffleArray([...arr]);
  const result = [];
  while (result.length < count) {
    result.push(...shuffled);
  }
  return result.slice(0, count);
}

// Get question key for bookmarking
function getQuestionKey(question) {
  for (const [domain, questions] of Object.entries(questionBank)) {
    const idx = questions.indexOf(question);
    if (idx !== -1) return `${domain}-${idx}`;
  }
  return "";
}

// Get domain from question
function getDomainFromQuestion(question) {
  for (const [domain, questions] of Object.entries(questionBank)) {
    if (questions.includes(question)) return domain;
  }
  return "general";
}

// Format time display
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Format time short (mm:ss)
function formatTimeShort(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// Get all questions from domain(s)
function getQuestionsFromDomain(domain) {
  if (domain === "all") {
    return [
      ...questionBank.general,
      ...questionBank.optics,
      ...questionBank.dispensing,
      ...questionBank.products,
    ];
  }
  return questionBank[domain] || [];
}
