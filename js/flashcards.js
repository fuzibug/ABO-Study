// Flashcard Mode - Convert questions to flashcard format

const Flashcards = {
  currentCard: 0,
  cards: [],
  showingAnswer: false,
  
  // Initialize flashcard mode with questions
  init: function(questions) {
    this.cards = questions.map(q => ({
      question: q.question,
      answer: q.correctAnswer,
      explanation: q.explanation,
      domain: q.domain,
      difficulty: q.difficulty,
      allOptions: q.options
    }));
    
    this.currentCard = 0;
    this.showingAnswer = false;
  },
  
  // Shuffle cards
  shuffle: function() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    this.currentCard = 0;
    this.showingAnswer = false;
  },
  
  // Get current card
  getCurrentCard: function() {
    if (this.cards.length === 0) return null;
    return this.cards[this.currentCard];
  },
  
  // Flip card (show/hide answer)
  flip: function() {
    this.showingAnswer = !this.showingAnswer;
    return this.showingAnswer;
  },
  
  // Next card
  next: function() {
    if (this.currentCard < this.cards.length - 1) {
      this.currentCard++;
      this.showingAnswer = false;
      return true;
    }
    return false;
  },
  
  // Previous card
  previous: function() {
    if (this.currentCard > 0) {
      this.currentCard--;
      this.showingAnswer = false;
      return true;
    }
    return false;
  },
  
  // Mark card as known/unknown for review
  markCard: function(known) {
    const card = this.getCurrentCard();
    if (!card) return;
    
    card.known = known;
    card.lastReviewed = new Date().toISOString();
    
    // Save to localStorage for SRS integration
    if (window.SRS) {
      const quality = known ? 5 : 0;
      window.SRS.updateCard(card.question, quality, 0);
    }
  },
  
  // Get progress
  getProgress: function() {
    return {
      current: this.currentCard + 1,
      total: this.cards.length,
      percentage: this.cards.length > 0 ? 
        ((this.currentCard + 1) / this.cards.length * 100).toFixed(0) : 0
    };
  },
  
  // Generate flashcard UI
  generateUI: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="flashcard-container">
        <div class="flashcard-header">
          <h3>🃏 Flashcard Mode</h3>
          <div class="flashcard-progress">
            <span id="flashcard-counter">0 / 0</span>
            <button onclick="Flashcards.shuffle()">Shuffle</button>
          </div>
        </div>
        
        <div class="flashcard" id="flashcard" onclick="Flashcards.flipCard()">
          <div class="flashcard-front" id="flashcard-front">
            <p>Click to start</p>
          </div>
          <div class="flashcard-back" id="flashcard-back" style="display: none;">
            <p>Answer appears here</p>
          </div>
        </div>
        
        <div class="flashcard-controls">
          <button onclick="Flashcards.previousCard()" id="prev-btn">← Previous</button>
          <button onclick="Flashcards.flipCard()" id="flip-btn">Flip Card</button>
          <button onclick="Flashcards.nextCard()" id="next-btn">Next →</button>
        </div>
        
        <div class="flashcard-actions">
          <button class="btn-unknown" onclick="Flashcards.markUnknown()">❌ Don't Know</button>
          <button class="btn-known" onclick="Flashcards.markKnown()">✔️ Know It</button>
        </div>
        
        <div class="flashcard-info" id="flashcard-info"></div>
      </div>
    `;
  },
  
  // Update display
  updateDisplay: function() {
    const card = this.getCurrentCard();
    if (!card) return;
    
    const front = document.getElementById('flashcard-front');
    const back = document.getElementById('flashcard-back');
    const info = document.getElementById('flashcard-info');
    const counter = document.getElementById('flashcard-counter');
    
    // Update counter
    const progress = this.getProgress();
    counter.textContent = `${progress.current} / ${progress.total}`;
    
    // Update card content
    front.innerHTML = `
      <h4>Question</h4>
      <p>${card.question}</p>
    `;
    
    back.innerHTML = `
      <h4>Answer</h4>
      <p class="answer"><strong>${card.answer}</strong></p>
      ${card.explanation ? `<p class="explanation">${card.explanation}</p>` : ''}
    `;
    
    // Show appropriate side
    if (this.showingAnswer) {
      front.style.display = 'none';
      back.style.display = 'block';
    } else {
      front.style.display = 'block';
      back.style.display = 'none';
    }
    
    // Update info
    info.innerHTML = `
      <span class="domain-tag">${card.domain || 'General'}</span>
      <span class="difficulty-tag">${card.difficulty || 'Medium'}</span>
    `;
  },
  
  // UI methods
  flipCard: function() {
    this.flip();
    this.updateDisplay();
  },
  
  nextCard: function() {
    if (this.next()) {
      this.updateDisplay();
    } else {
      alert('End of flashcards! Click Shuffle to review again.');
    }
  },
  
  previousCard: function() {
    if (this.previous()) {
      this.updateDisplay();
    }
  },
  
  markKnown: function() {
    this.markCard(true);
    this.nextCard();
  },
  
  markUnknown: function() {
    this.markCard(false);
    this.nextCard();
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.Flashcards = Flashcards;
}
