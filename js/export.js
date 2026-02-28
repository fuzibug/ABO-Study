// ═══════════════════════════════════════════════════════════════════════════════
// Export Module — Enhanced PDF/CSV Reports with Complete User Data
// ═══════════════════════════════════════════════════════════════════════════════

const Export = {
  // Generate comprehensive study report data
  generateReportData: function() {
    const analytics = window.Analytics ? Analytics.exportData() : null;
    const srs = window.SRS ? SRS.getStatistics() : null;
    const progress = JSON.parse(localStorage.getItem('progress') || '{}');
    const streaks = window.Analytics ? Analytics.getStreakInfo() : null;
    const sessionHistory = this.getSessionHistory();
    const userInfo = this.getUserInfo();
    
    return {
      generatedAt: new Date().toISOString(),
      generatedDate: new Date().toLocaleDateString(),
      studentName: userInfo.name,
      userInfo: userInfo,
      overall: {
        totalQuestions: progress.totalAnswered || 0,
        correct: progress.correct || 0,
        incorrect: (progress.totalAnswered || 0) - (progress.correct || 0),
        accuracy: progress.accuracy || 0,
        avgTime: progress.avgTime || 0,
        totalStudyTime: progress.totalTime || 0,
        sessionsCompleted: sessionHistory.length
      },
      streaks: streaks,
      srs: srs,
      analytics: analytics,
      domains: this.getDomainSummary(),
      weakAreas: this.getWeakAreas(),
      strongAreas: this.getStrongAreas(),
      recommendations: this.getRecommendations(),
      sessionHistory: sessionHistory,
      examReadiness: this.calculateExamReadiness()
    };
  },
  
  // Get user information
  getUserInfo: function() {
    return {
      name: localStorage.getItem('student_name') || 'ABO Student',
      email: localStorage.getItem('student_email') || '',
      examDate: localStorage.getItem('exam_date') || '',
      location: localStorage.getItem('exam_location') || '',
      startedStudying: localStorage.getItem('study_start_date') || new Date().toISOString().split('T')[0],
      daysUntilExam: this.calculateDaysUntilExam()
    };
  },
  
  // Calculate days until exam
  calculateDaysUntilExam: function() {
    const examDate = localStorage.getItem('exam_date');
    if (!examDate) return null;
    
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  },
  
  // Get session history
  getSessionHistory: function() {
    const sessions = JSON.parse(localStorage.getItem('session_history') || '[]');
    return sessions.slice(-20); // Last 20 sessions
  },
  
  // Get domain summary with detailed stats
  getDomainSummary: function() {
    if (!window.Analytics) return [];
    return Analytics.getDomainComparison().map(d => ({
      ...d,
      grade: this.getGrade(parseFloat(d.accuracy)),
      status: this.getStatus(parseFloat(d.accuracy))
    }));
  },
  
  // Get weak areas
  getWeakAreas: function() {
    if (!window.Analytics) return [];
    return Analytics.getWeakDomains(70);
  },
  
  // Get strong areas
  getStrongAreas: function() {
    if (!window.Analytics) return [];
    const domains = Analytics.getDomainComparison();
    return domains
      .filter(d => parseFloat(d.accuracy) >= 85)
      .sort((a, b) => parseFloat(b.accuracy) - parseFloat(a.accuracy))
      .slice(0, 5);
  },
  
  // Calculate exam readiness score
  calculateExamReadiness: function() {
    const progress = JSON.parse(localStorage.getItem('progress') || '{}');
    const accuracy = progress.accuracy || 0;
    const totalAnswered = progress.totalAnswered || 0;
    const domains = this.getDomainSummary();
    
    // Factors: overall accuracy, volume, domain balance
    const accuracyScore = Math.min(accuracy / 75, 1) * 50; // Max 50 points
    const volumeScore = Math.min(totalAnswered / 200, 1) * 25; // Max 25 points
    const domainScore = domains.length > 0 
      ? (domains.filter(d => parseFloat(d.accuracy) >= 70).length / domains.length) * 25
      : 0; // Max 25 points
    
    const totalScore = accuracyScore + volumeScore + domainScore;
    
    return {
      score: Math.round(totalScore),
      level: totalScore >= 90 ? 'Exam Ready' : totalScore >= 75 ? 'Nearly Ready' : totalScore >= 50 ? 'Progressing' : 'Keep Studying',
      breakdown: {
        accuracy: Math.round(accuracyScore),
        volume: Math.round(volumeScore),
        balance: Math.round(domainScore)
      }
    };
  },
  
  // Helper: get letter grade
  getGrade: function(accuracy) {
    if (accuracy >= 90) return 'A';
    if (accuracy >= 80) return 'B';
    if (accuracy >= 70) return 'C';
    if (accuracy >= 60) return 'D';
    return 'F';
  },
  
  // Helper: get status
  getStatus: function(accuracy) {
    if (accuracy >= 85) return 'Mastered';
    if (accuracy >= 75) return 'Strong';
    if (accuracy >= 65) return 'Good';
    if (accuracy >= 50) return 'Needs Work';
    return 'Critical';
  },
  
  // Generate recommendations
  getRecommendations: function() {
    const weak = this.getWeakAreas();
    const srs = window.SRS ? SRS.getStatistics() : null;
    const overall = JSON.parse(localStorage.getItem('progress') || '{}');
    const recommendations = [];
    
    // Weak domains
    if (weak.length > 0) {
      recommendations.push({
        priority: 'High',
        area: 'Weak Domains',
        suggestion: `Focus on: ${weak.slice(0, 3).map(d => d.domain).join(', ')}`,
        action: 'Use Weak Domain Focus Mode for targeted practice',
        icon: '🎯'
      });
    }
    
    // SRS reviews
    if (srs && srs.dueToday > 0) {
      recommendations.push({
        priority: 'Medium',
        area: 'Spaced Repetition',
        suggestion: `${srs.dueToday} cards due for review today`,
        action: 'Complete SRS reviews to maintain retention',
        icon: '🔄'
      });
    }
    
    // Volume
    const total = overall.totalAnswered || 0;
    if (total < 100) {
      recommendations.push({
        priority: 'Medium',
        area: 'Practice Volume',
        suggestion: `Only ${total} questions answered so far`,
        action: 'Complete at least 200 questions for solid preparation',
        icon: '📊'
      });
    }
    
    // Accuracy
    const acc = overall.accuracy || 0;
    if (acc < 75 && total > 50) {
      recommendations.push({
        priority: 'High',
        area: 'Overall Accuracy',
        suggestion: `Current accuracy ${acc}% is below passing threshold`,
        action: 'Review explanations carefully and use flashcards for weak topics',
        icon: '⚠️'
      });
    }
    
    // Study consistency
    const streaks = window.Analytics ? Analytics.getStreakInfo() : null;
    if (streaks && streaks.currentStreak < 3) {
      recommendations.push({
        priority: 'Low',
        area: 'Study Consistency',
        suggestion: 'Build a daily study habit',
        action: 'Study at least 10 questions per day to build momentum',
        icon: '🔥'
      });
    }
    
    return recommendations;
  },
  
  // Export as JSON
  exportJSON: function() {
    const data = this.generateReportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `abo-study-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    if (window.toast) window.toast('Report exported as JSON', 'success');
  },
  
  // Export as CSV
  exportCSV: function() {
    const data = this.generateReportData();
    
    // Create CSV rows
    let csv = 'ABO Study Progress Report\n\n';
    
    // User info
    csv += 'STUDENT INFORMATION\n';
    csv += `Name,${data.userInfo.name}\n`;
    csv += `Exam Date,${data.userInfo.examDate || 'Not set'}\n`;
    csv += `Days Until Exam,${data.userInfo.daysUntilExam || 'N/A'}\n`;
    csv += `Report Generated,${data.generatedDate}\n\n`;
    
    // Overall stats
    csv += 'OVERALL PERFORMANCE\n';
    csv += `Total Questions,${data.overall.totalQuestions}\n`;
    csv += `Correct,${data.overall.correct}\n`;
    csv += `Incorrect,${data.overall.incorrect}\n`;
    csv += `Accuracy,${data.overall.accuracy}%\n`;
    csv += `Average Time,${data.overall.avgTime}s\n\n`;
    
    // Exam readiness
    csv += 'EXAM READINESS\n';
    csv += `Overall Score,${data.examReadiness.score}/100\n`;
    csv += `Level,${data.examReadiness.level}\n\n`;
    
    // Domain breakdown
    csv += 'DOMAIN PERFORMANCE\n';
    csv += 'Domain,Accuracy,Questions,Grade,Status\n';
    data.domains.forEach(d => {
      csv += `${d.domain},${d.accuracy}%,${d.total},${d.grade},${d.status}\n`;
    });
    csv += '\n';
    
    // Recommendations
    if (data.recommendations.length > 0) {
      csv += 'RECOMMENDATIONS\n';
      csv += 'Priority,Area,Suggestion,Action\n';
      data.recommendations.forEach(r => {
        csv += `${r.priority},"${r.area}","${r.suggestion}","${r.action}"\n`;
      });
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `abo-study-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    if (window.toast) window.toast('Report exported as CSV', 'success');
  },
  
  // Generate enhanced HTML report (for printing or PDF)
  generateHTMLReport: function() {
    const data = this.generateReportData();
    
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ABO Study Report — ${data.studentName} — ${data.generatedDate}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #2c3e50;
    }
    h1 { color: #2c3e50; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; }
    h2 { color: #34495e; margin-top: 40px; border-left: 4px solid #3b82f6; padding-left: 15px; }
    h3 { color: #555; margin-top: 20px; }
    .header { text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; }
    .header h1 { color: white; border: none; margin: 0; }
    .user-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #3b82f6; }
    .user-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .user-info-item { display: flex; flex-direction: column; }
    .user-info-label { font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; }
    .user-info-value { font-size: 16px; color: #2c3e50; margin-top: 5px; }
    .stat-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
    .stat-box {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    .stat-label { font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; }
    .stat-value { font-size: 36px; font-weight: bold; color: #3b82f6; margin-top: 5px; }
    .readiness-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 10px;
      text-align: center;
      margin: 20px 0;
    }
    .readiness-score { font-size: 48px; font-weight: bold; }
    .readiness-level { font-size: 24px; margin-top: 10px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th { background: #3b82f6; color: white; font-weight: bold; }
    tr:nth-child(even) { background: #f8f9fa; }
    tr:hover { background: #e9ecef; }
    .recommendation {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 20px;
      margin: 15px 0;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .priority-high { border-left-color: #dc3545; background: #f8d7da; }
    .priority-medium { border-left-color: #ffc107; background: #fff3cd; }
    .priority-low { border-left-color: #28a745; background: #d4edda; }
    .footer {
      text-align: center;
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      color: #666;
      font-size: 12px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    .badge-success { background: #28a745; color: white; }
    .badge-warning { background: #ffc107; color: #333; }
    .badge-danger { background: #dc3545; color: white; }
    .badge-info { background: #17a2b8; color: white; }
    @media print {
      body { margin: 0; padding: 10px; }
      .no-print { display: none !important; }
      .stat-container { page-break-inside: avoid; }
      .recommendation { page-break-inside: avoid; }
      table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>👁️ ABO Certification Study Report</h1>
    <p style="margin: 10px 0 0; font-size: 18px;">Comprehensive Performance Analysis</p>
  </div>
  
  <div class="user-info">
    <h3 style="margin-top: 0; color: #3b82f6;">📋 Student Information</h3>
    <div class="user-info-grid">
      <div class="user-info-item">
        <span class="user-info-label">Student Name</span>
        <span class="user-info-value">${data.studentName}</span>
      </div>
      <div class="user-info-item">
        <span class="user-info-label">Report Generated</span>
        <span class="user-info-value">${data.generatedDate}</span>
      </div>
      <div class="user-info-item">
        <span class="user-info-label">Exam Date</span>
        <span class="user-info-value">${data.userInfo.examDate || 'Not set'}</span>
      </div>
      <div class="user-info-item">
        <span class="user-info-label">Days Until Exam</span>
        <span class="user-info-value">${data.userInfo.daysUntilExam !== null ? data.userInfo.daysUntilExam + ' days' : 'N/A'}</span>
      </div>
    </div>
  </div>
  
  <h2>📊 Overall Performance</h2>
  <div class="stat-container">
    <div class="stat-box">
      <div class="stat-label">Questions Answered</div>
      <div class="stat-value">${data.overall.totalQuestions}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Correct</div>
      <div class="stat-value" style="color: #28a745;">${data.overall.correct}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Incorrect</div>
      <div class="stat-value" style="color: #dc3545;">${data.overall.incorrect}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Accuracy</div>
      <div class="stat-value" style="color: ${data.overall.accuracy >= 75 ? '#28a745' : data.overall.accuracy >= 60 ? '#ffc107' : '#dc3545'};">${data.overall.accuracy}%</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Avg Time</div>
      <div class="stat-value">${data.overall.avgTime}s</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Sessions</div>
      <div class="stat-value">${data.overall.sessionsCompleted}</div>
    </div>
  </div>
  
  <div class="readiness-box">
    <div class="readiness-score">${data.examReadiness.score}/100</div>
    <div class="readiness-level">🎯 ${data.examReadiness.level}</div>
    <p style="margin-top: 15px; font-size: 14px; opacity: 0.9;">Accuracy: ${data.examReadiness.breakdown.accuracy}/50 | Volume: ${data.examReadiness.breakdown.volume}/25 | Balance: ${data.examReadiness.breakdown.balance}/25</p>
  </div>
  
  ${data.streaks ? `
  <h2>🔥 Study Streaks</h2>
  <div class="stat-container">
    <div class="stat-box">
      <div class="stat-label">Current Streak</div>
      <div class="stat-value" style="color: #ff6b6b;">🔥 ${data.streaks.currentStreak}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Longest Streak</div>
      <div class="stat-value" style="color: #ffd93d;">🏆 ${data.streaks.longestStreak}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Total Study Days</div>
      <div class="stat-value">${data.streaks.totalDays || 0}</div>
    </div>
  </div>
  ` : ''}
  
  ${data.domains.length > 0 ? `
  <h2>🎓 Domain Performance</h2>
  <table>
    <thead>
      <tr>
        <th>Domain</th>
        <th>Accuracy</th>
        <th>Questions</th>
        <th>Grade</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
    ${data.domains.map(d => {
      const acc = parseFloat(d.accuracy);
      const badgeClass = d.status === 'Mastered' ? 'success' : d.status === 'Strong' ? 'info' : d.status === 'Good' ? 'warning' : 'danger';
      return `
      <tr>
        <td><strong>${d.domain}</strong></td>
        <td style="color: ${acc >= 80 ? '#28a745' : acc >= 70 ? '#ffc107' : '#dc3545'}; font-weight: bold;">${d.accuracy}%</td>
        <td>${d.total}</td>
        <td><span class="badge badge-${badgeClass}">${d.grade}</span></td>
        <td><span class="badge badge-${badgeClass}">${d.status}</span></td>
      </tr>
      `;
    }).join('')}
    </tbody>
  </table>
  ` : ''}
  
  ${data.strongAreas && data.strongAreas.length > 0 ? `
  <h2>💪 Strong Areas</h2>
  <table>
    <thead>
      <tr>
        <th>Domain</th>
        <th>Accuracy</th>
        <th>Questions</th>
      </tr>
    </thead>
    <tbody>
    ${data.strongAreas.map(d => `
      <tr>
        <td><strong>${d.domain}</strong></td>
        <td style="color: #28a745; font-weight: bold;">${d.accuracy}%</td>
        <td>${d.total}</td>
      </tr>
    `).join('')}
    </tbody>
  </table>
  ` : ''}
  
  ${data.weakAreas && data.weakAreas.length > 0 ? `
  <h2>⚠️ Areas Needing Improvement</h2>
  <table>
    <thead>
      <tr>
        <th>Domain</th>
        <th>Accuracy</th>
        <th>Questions</th>
        <th>Gap to Passing</th>
      </tr>
    </thead>
    <tbody>
    ${data.weakAreas.map(d => {
      const gap = Math.max(0, 75 - parseFloat(d.accuracy));
      return `
      <tr>
        <td><strong>${d.domain}</strong></td>
        <td style="color: #dc3545; font-weight: bold;">${d.accuracy}%</td>
        <td>${d.total}</td>
        <td><span class="badge badge-danger">${gap.toFixed(1)}% below passing</span></td>
      </tr>
      `;
    }).join('')}
    </tbody>
  </table>
  ` : ''}
  
  ${data.recommendations.length > 0 ? `
  <h2>💡 Personalized Recommendations</h2>
  ${data.recommendations.map(rec => `
  <div class="recommendation priority-${rec.priority.toLowerCase()}">
    <div style="display: flex; align-items: center; margin-bottom: 10px;">
      <span style="font-size: 24px; margin-right: 10px;">${rec.icon || '📌'}</span>
      <h3 style="margin: 0; flex: 1;">${rec.area}</h3>
      <span class="badge badge-${rec.priority === 'High' ? 'danger' : rec.priority === 'Medium' ? 'warning' : 'success'}">${rec.priority} Priority</span>
    </div>
    <p style="margin: 10px 0;"><strong>Observation:</strong> ${rec.suggestion}</p>
    <p style="margin: 10px 0 0;"><strong>Action:</strong> ${rec.action}</p>
  </div>
  `).join('')}
  ` : ''}
  
  <div class="footer">
    <p><strong>Generated by ABO Study Tool</strong></p>
    <p>🌐 <a href="https://fuzibug.github.io/ABO-Study/">fuzibug.github.io/ABO-Study</a></p>
    <p style="margin-top: 15px;">Keep up the great work! You're on the path to ABO certification success. 🚀</p>
    <p style="margin-top: 10px; font-size: 10px; color: #999;">Report ID: ${data.generatedAt}</p>
  </div>
  
  <div class="no-print" style="text-align: center; margin: 40px 0; padding: 30px; background: #f8f9fa; border-radius: 10px;">
    <h3>📥 Save This Report</h3>
    <p>Click Print and choose "Save as PDF" to create a permanent record</p>
    <button onclick="window.print()" style="padding: 12px 30px; font-size: 16px; cursor: pointer; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: bold;">🖨️ Print / Save as PDF</button>
  </div>
</body>
</html>
    `;
    
    return html;
  },
  
  // Open report in new window
  viewReport: function() {
    const html = this.generateHTMLReport();
    const newWindow = window.open('', '_blank', 'width=900,height=800');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    } else {
      alert('Please allow popups for this site to view the report');
    }
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.Export = Export;
  console.log('✅ Enhanced Export module loaded');
}
