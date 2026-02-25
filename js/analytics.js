// Analytics Module - Performance Tracking, Charts, Study Streaks

const Analytics = {
  // Initialize analytics
  init: function() {
    this.ensureStorageStructure();
  },
  
  // Ensure localStorage has proper structure
  ensureStorageStructure: function() {
    if (!localStorage.getItem('analytics_sessions')) {
      localStorage.setItem('analytics_sessions', JSON.stringify([]));
    }
    if (!localStorage.getItem('analytics_streaks')) {
      localStorage.setItem('analytics_streaks', JSON.stringify({
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        studyDates: []
      }));
    }
  },
  
  // Record a quiz session
  recordSession: function(sessionData) {
    const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
    
    const session = {
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      hour: new Date().getHours(),
      ...sessionData
    };
    
    sessions.push(session);
    
    // Keep last 1000 sessions
    if (sessions.length > 1000) {
      sessions.shift();
    }
    
    localStorage.setItem('analytics_sessions', JSON.stringify(sessions));
    this.updateStreak();
    
    return session;
  },
  
  // Update study streak
  updateStreak: function() {
    const streaks = JSON.parse(localStorage.getItem('analytics_streaks'));
    const today = new Date().toDateString();
    const lastDate = streaks.lastStudyDate ? new Date(streaks.lastStudyDate).toDateString() : null;
    
    if (lastDate === today) {
      // Already studied today
      return streaks;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastDate === yesterdayStr) {
      // Consecutive day
      streaks.currentStreak++;
    } else if (lastDate !== today) {
      // Streak broken
      streaks.currentStreak = 1;
    }
    
    streaks.longestStreak = Math.max(streaks.longestStreak, streaks.currentStreak);
    streaks.lastStudyDate = new Date().toISOString();
    
    if (!streaks.studyDates.includes(today)) {
      streaks.studyDates.push(today);
    }
    
    localStorage.setItem('analytics_streaks', JSON.stringify(streaks));
    return streaks;
  },
  
  // Get streak information
  getStreakInfo: function() {
    return JSON.parse(localStorage.getItem('analytics_streaks'));
  },
  
  // Get time-of-day performance
  getTimeOfDayAnalysis: function() {
    const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
    const hourly = {};
    
    // Initialize hours
    for (let i = 0; i < 24; i++) {
      hourly[i] = { total: 0, correct: 0, avgTime: 0 };
    }
    
    sessions.forEach(session => {
      const hour = session.hour;
      if (hour !== undefined) {
        hourly[hour].total += session.totalQuestions || 0;
        hourly[hour].correct += session.correctAnswers || 0;
        hourly[hour].avgTime += session.avgTimePerQuestion || 0;
      }
    });
    
    // Calculate accuracy for each hour
    const analysis = [];
    for (let hour = 0; hour < 24; hour++) {
      const data = hourly[hour];
      const sessionCount = sessions.filter(s => s.hour === hour).length;
      
      if (sessionCount > 0) {
        analysis.push({
          hour: hour,
          label: this.formatHour(hour),
          accuracy: data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : 0,
          sessions: sessionCount,
          totalQuestions: data.total
        });
      }
    }
    
    return analysis.sort((a, b) => b.accuracy - a.accuracy);
  },
  
  // Format hour for display
  formatHour: function(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    return displayHour + period;
  },
  
  // Get performance trend over time
  getPerformanceTrend: function(days = 30) {
    const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const daily = {};
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.timestamp);
      if (sessionDate >= cutoffDate) {
        const dateKey = session.date;
        
        if (!daily[dateKey]) {
          daily[dateKey] = { total: 0, correct: 0, sessions: 0 };
        }
        
        daily[dateKey].total += session.totalQuestions || 0;
        daily[dateKey].correct += session.correctAnswers || 0;
        daily[dateKey].sessions++;
      }
    });
    
    const trend = [];
    Object.keys(daily).sort().forEach(date => {
      const data = daily[date];
      trend.push({
        date: date,
        accuracy: data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : 0,
        questions: data.total,
        sessions: data.sessions
      });
    });
    
    return trend;
  },
  
  // Get domain performance comparison
  getDomainComparison: function() {
    const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
    const domains = {};
    
    sessions.forEach(session => {
      if (session.domainBreakdown) {
        Object.keys(session.domainBreakdown).forEach(domain => {
          if (!domains[domain]) {
            domains[domain] = { total: 0, correct: 0 };
          }
          domains[domain].total += session.domainBreakdown[domain].total || 0;
          domains[domain].correct += session.domainBreakdown[domain].correct || 0;
        });
      }
    });
    
    const comparison = [];
    Object.keys(domains).forEach(domain => {
      const data = domains[domain];
      comparison.push({
        domain: domain,
        accuracy: data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : 0,
        total: data.total,
        correct: data.correct
      });
    });
    
    return comparison.sort((a, b) => b.accuracy - a.accuracy);
  },
  
  // Get weak domains (below threshold)
  getWeakDomains: function(threshold = 70) {
    const comparison = this.getDomainComparison();
    return comparison.filter(d => parseFloat(d.accuracy) < threshold);
  },
  
  // Draw performance chart using Canvas
  drawPerformanceChart: function(canvasId, days = 30) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const trend = this.getPerformanceTrend(days);
    
    if (trend.length === 0) {
      ctx.fillText('No data yet', canvas.width / 2, canvas.height / 2);
      return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw data points
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const xStep = chartWidth / (trend.length - 1 || 1);
    
    trend.forEach((point, index) => {
      const x = padding + (index * xStep);
      const y = canvas.height - padding - (parseFloat(point.accuracy) / 100 * chartHeight);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw point
      ctx.fillRect(x - 3, y - 3, 6, 6);
    });
    
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.fillText('100%', 5, padding);
    ctx.fillText('0%', 5, canvas.height - padding);
  },
  
  // Export analytics data
  exportData: function() {
    return {
      sessions: JSON.parse(localStorage.getItem('analytics_sessions') || '[]'),
      streaks: JSON.parse(localStorage.getItem('analytics_streaks')),
      timestamp: new Date().toISOString()
    };
  },
  
  // Clear all analytics data
  clearData: function() {
    if (confirm('This will clear all analytics history. Continue?')) {
      localStorage.removeItem('analytics_sessions');
      localStorage.removeItem('analytics_streaks');
      this.ensureStorageStructure();
      return true;
    }
    return false;
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  window.Analytics = Analytics;
  Analytics.init();
}
