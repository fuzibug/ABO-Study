// Spaced Repetition System (SRS) using SM-2 Algorithm
// Tracks question performance and schedules optimal review intervals

const SRS = {
  // SM-2 Algorithm constants
  MIN_EASE_FACTOR: 1.3,
  DEFAULT_EASE_FACTOR: 2.5,
  
  // Get SRS data for a question
  getQuestionData: function(questionId) {
    const srsData = JSON.parse(localStorage.getItem('srs_data') || '{}');
    return srsData[questionId] || {
      easeFactor: this.DEFAULT_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      nextReview: null,
      lastReview: null,
      totalReviews: 0,
      correctStreak: 0
    };
  },
  
  // Save SRS data for a question
  saveQuestionData: function(questionId, data) {
    const srsData = JSON.parse(localStorage.getItem('srs_data') || '{}');
    srsData[questionId] = data;
    localStorage.setItem('srs_data', JSON.stringify(srsData));
  },
  
  // Update SRS data after answering a question
  // quality: 0-5 (0=complete blackout, 5=perfect recall)
  updateCard: function(questionId, quality, timeTaken) {
    const card = this.getQuestionData(questionId);
    const now = new Date().toISOString();
    
    card.lastReview = now;
    card.totalReviews++;
    
    // SM-2 Algorithm
    if (quality >= 3) {
      // Correct answer
      card.correctStreak++;
      
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      
      card.repetitions++;
    } else {
      // Incorrect answer - reset
      card.repetitions = 0;
      card.interval = 1;
      card.correctStreak = 0;
    }
    
    // Update ease factor
    card.easeFactor = Math.max(
      this.MIN_EASE_FACTOR,
      card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    
    // Calculate next review date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + card.interval);
    card.nextReview = nextDate.toISOString();
    
    this.saveQuestionData(questionId, card);
    
    return card;
  },
  
  // Get questions due for review today
  getDueQuestions: function(allQuestions) {
    const now = new Date();
    const dueQuestions = [];
    
    allQuestions.forEach(q => {
      const card = this.getQuestionData(q.id || q.question);
      
      // New cards or cards due for review
      if (!card.nextReview || new Date(card.nextReview) <= now) {
        dueQuestions.push({
          ...q,
          srsData: card
        });
      }
    });
    
    return dueQuestions;
  },
  
  // Get statistics for SRS
  getStatistics: function() {
    const srsData = JSON.parse(localStorage.getItem('srs_data') || '{}');
    const stats = {
      totalCards: 0,
      newCards: 0,
      learning: 0,
      review: 0,
      mastered: 0,
      dueToday: 0,
      averageEaseFactor: 0,
      totalReviews: 0
    };
    
    const now = new Date();
    let totalEase = 0;
    
    Object.values(srsData).forEach(card => {
      stats.totalCards++;
      stats.totalReviews += card.totalReviews;
      totalEase += card.easeFactor;
      
      if (card.repetitions === 0) {
        stats.newCards++;
      } else if (card.repetitions < 3) {
        stats.learning++;
      } else if (card.repetitions < 6) {
        stats.review++;
      } else {
        stats.mastered++;
      }
      
      if (!card.nextReview || new Date(card.nextReview) <= now) {
        stats.dueToday++;
      }
    });
    
    stats.averageEaseFactor = stats.totalCards > 0 ? (totalEase / stats.totalCards).toFixed(2) : 2.5;
    
    return stats;
  },
  
  // Convert answer correctness to quality rating (0-5)
  convertToQuality: function(isCorrect, confidence) {
    // confidence: 'low', 'medium', 'high' or timeTaken ratio
    if (!isCorrect) {
      return confidence === 'low' ? 0 : 1;
    }
    
    if (confidence === 'low') return 3;
    if (confidence === 'medium') return 4;
    return 5; // high confidence
  },
  
  // Reset all SRS data (use with caution)
  resetAll: function() {
    if (confirm('This will reset all spaced repetition data. Continue?')) {
      localStorage.removeItem('srs_data');
      return true;
    }
    return false;
  },
  
  // Export SRS data
  exportData: function() {
    const srsData = localStorage.getItem('srs_data') || '{}';
    return JSON.parse(srsData);
  },
  
  // Import SRS data
  importData: function(data) {
    localStorage.setItem('srs_data', JSON.stringify(data));
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.SRS = SRS;
}
