// Flashcard Mode

const flashcards = {
  state: {
    questions: [],
    currentIndex: 0,
    domain: "all",
  },

  start(domain) {
    this.state.domain = domain;
    const bookmarks = storage.getBookmarks();

    let allQ = [];

    if (domain === "bookmarked") {
      Object.keys(bookmarks).forEach((key) => {
        const [dom, idx] = key.split("-");
        if (bookmarks[key]) allQ.push(questionBank[dom][idx]);
      });

      if (allQ.length === 0) {
        alert(
          "No bookmarked questions yet! Bookmark questions while studying to review them later.",
        );
        return;
      }
    } else {
      allQ = getQuestionsFromDomain(domain);
    }

    this.state.questions = shuffleArray([...allQ]);
    this.state.currentIndex = 0;

    document.getElementById("flashcardContainer").style.display = "block";
    this.load();
    updateStreak();
  },

  load() {
    const q = this.state.questions[this.state.currentIndex];
    const bookmarks = storage.getBookmarks();

    document.getElementById("flashcardQuestion").textContent = q.q;
    document.getElementById("flashcardAnswer").textContent = q.opts[q.correct];
    document.getElementById("flashcardNumber").textContent =
      this.state.currentIndex + 1;
    document.getElementById("flashcardTotal").textContent =
      this.state.questions.length;

    const flashcard = document.getElementById("flashcard");
    flashcard.classList.remove("flipped");

    const key = getQuestionKey(q);
    const bookmarkBtn = document.getElementById("bookmarkBtn");
    bookmarkBtn.textContent = bookmarks[key] ? "★" : "☆";
    bookmarkBtn.classList.toggle("bookmarked", bookmarks[key]);
  },

  flip() {
    document.getElementById("flashcard").classList.toggle("flipped");
  },

  next() {
    this.state.currentIndex =
      (this.state.currentIndex + 1) % this.state.questions.length;
    this.load();
  },

  previous() {
    this.state.currentIndex =
      (this.state.currentIndex - 1 + this.state.questions.length) %
      this.state.questions.length;
    this.load();
  },

  shuffle() {
    this.state.questions = shuffleArray(this.state.questions);
    this.state.currentIndex = 0;
    this.load();
  },

  toggleBookmark() {
    const q = this.state.questions[this.state.currentIndex];
    const key = getQuestionKey(q);
    const bookmarks = storage.getBookmarks();

    bookmarks[key] = !bookmarks[key];
    storage.saveBookmarks(bookmarks);
    this.load();
  },
};
