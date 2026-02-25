// Export Module - PDF Reports and Question Sharing

const Export = {
  // Generate study report data
  generateReportData: function() {
    const analytics = window.Analytics ? Analytics.exportData() : null;
    const srs = window.SRS ? SRS.getStatistics() : null;
    const progress = JSON.parse(localStorage.getItem('progress') || '{}');
    const streaks = window.Analytics ? Analytics.getStreakInfo() : null;
    
    return {
      generatedAt: new Date().toISOString(),
      generatedDate: new Date().toLocaleDateString(),
      studentName: localStorage.getItem('student_name') || 'ABO Student',
      overall: {
        totalQuestions: progress.totalAnswered || 0,
        accuracy: progress.accuracy || 0,
        avgTime: progress.avgTime || 0
      },
      streaks: streaks,
      srs: srs,
      analytics: analytics,
      domains: this.getDomainSummary(),
      weakAreas: this.getWeakAreas(),
      recommendations: this.getRecommendations()
    };
  },
  
  // Get domain summary
  getDomainSummary: function() {
    if (!window.Analytics) return [];
    return Analytics.getDomainComparison();
  },
  
  // Get weak areas
  getWeakAreas: function() {
    if (!window.Analytics) return [];
    return Analytics.getWeakDomains(70);
  },
  
  // Generate recommendations
  getRecommendations: function() {
    const weak = this.getWeakAreas();
    const srs = window.SRS ? SRS.getStatistics() : null;
    const recommendations = [];
    
    if (weak.length > 0) {
      recommendations.push({
        priority: 'High',
        area: 'Weak Domains',
        suggestion: `Focus on: ${weak.slice(0, 3).map(d => d.domain).join(', ')}`,
        action: 'Use Weak Domain Focus Mode for targeted practice'
      });
    }
    
    if (srs && srs.dueToday > 0) {
      recommendations.push({
        priority: 'Medium',
        area: 'Spaced Repetition',
        suggestion: `${srs.dueToday} cards due for review today`,
        action: 'Complete SRS reviews to maintain retention'
      });
    }
    
    if (srs && srs.newCards > 20) {
      recommendations.push({
        priority: 'Medium',
        area: 'New Material',
        suggestion: `${srs.newCards} questions not yet reviewed`,
        action: 'Study new questions to expand coverage'
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
  },
  
  // Generate HTML report (for printing or PDF)
  generateHTMLReport: function() {
    const data = this.generateReportData();
    
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ABO Study Report - ${data.generatedDate}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { color: #2c3e50; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #34495e; margin-top: 30px; border-left: 4px solid #3b82f6; padding-left: 10px; }
    h3 { color: #555; }
    .header { text-align: center; margin-bottom: 40px; }
    .stat-box {
      display: inline-block;
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      padding: 15px 25px;
      margin: 10px;
      text-align: center;
    }
    .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
    .stat-value { font-size: 32px; font-weight: bold; color: #3b82f6; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th { background: #3b82f6; color: white; }
    tr:nth-child(even) { background: #f8f9fa; }
    .recommendation {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .priority-high { border-left-color: #dc3545; }
    .priority-medium { border-left-color: #ffc107; }
    .priority-low { border-left-color: #28a745; }
    .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 12px;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .badge-success { background: #28a745; color: white; }
    .badge-warning { background: #ffc107; color: #333; }
    .badge-danger { background: #dc3545; color: white; }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>👁️ ABO Study Progress Report</h1>
    <p><strong>Student:</strong> ${data.studentName}</p>
    <p><strong>Generated:</strong> ${data.generatedDate}</p>
  </div>
  
  <h2>Overall Performance</h2>
  <div style="text-align: center;">
    <div class="stat-box">
      <div class="stat-label">Questions Answered</div>
      <div class="stat-value">${data.overall.totalQuestions}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Accuracy</div>
      <div class="stat-value">${data.overall.accuracy}%</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Avg Time</div>
      <div class="stat-value">${data.overall.avgTime}s</div>
    </div>
  </div>
  
  ${data.streaks ? `
  <h2>Study Streaks</h2>
  <div style="text-align: center;">
    <div class="stat-box">
      <div class="stat-label">Current Streak</div>
      <div class="stat-value">🔥 ${data.streaks.currentStreak}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Longest Streak</div>
      <div class="stat-value">🏆 ${data.streaks.longestStreak}</div>
    </div>
  </div>
  ` : ''}
  
  ${data.srs ? `
  <h2>Spaced Repetition Progress</h2>
  <table>
    <tr>
      <th>Category</th>
      <th>Count</th>
    </tr>
    <tr>
      <td>New Cards</td>
      <td>${data.srs.newCards}</td>
    </tr>
    <tr>
      <td>Learning</td>
      <td>${data.srs.learning}</td>
    </tr>
    <tr>
      <td>Review</td>
      <td>${data.srs.review}</td>
    </tr>
    <tr>
      <td>Mastered</td>
      <td>${data.srs.mastered}</td>
    </tr>
    <tr style="font-weight: bold; background: #e3f2fd;">
      <td>Due Today</td>
      <td>${data.srs.dueToday}</td>
    </tr>
  </table>
  ` : ''}
  
  ${data.domains.length > 0 ? `
  <h2>Domain Performance</h2>
  <table>
    <tr>
      <th>Domain</th>
      <th>Accuracy</th>
      <th>Questions</th>
      <th>Status</th>
    </tr>
    ${data.domains.map(d => {
      const acc = parseFloat(d.accuracy);
      const badge = acc >= 80 ? 'success' : acc >= 70 ? 'warning' : 'danger';
      return `
    <tr>
      <td>${d.domain}</td>
      <td>${d.accuracy}%</td>
      <td>${d.total}</td>
      <td><span class="badge badge-${badge}">${acc >= 80 ? 'Strong' : acc >= 70 ? 'Good' : 'Needs Work'}</span></td>
    </tr>
      `;
    }).join('')}
  </table>
  ` : ''}
  
  ${data.recommendations.length > 0 ? `
  <h2>Recommendations</h2>
  ${data.recommendations.map(rec => `
  <div class="recommendation priority-${rec.priority.toLowerCase()}">
    <h3>🎯 ${rec.area} <span class="badge badge-${rec.priority === 'High' ? 'danger' : rec.priority === 'Medium' ? 'warning' : 'success'}">${rec.priority} Priority</span></h3>
    <p><strong>Observation:</strong> ${rec.suggestion}</p>
    <p><strong>Action:</strong> ${rec.action}</p>
  </div>
  `).join('')}
  ` : ''}
  
  <div class="footer">
    <p>Generated by ABO Study Tool | <a href="https://fuzibug.github.io/ABO-Study/">fuzibug.github.io/ABO-Study</a></p>
    <p>Keep up the great work! 🚀</p>
  </div>
  
  <div class="no-print" style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Print / Save as PDF</button>
  </div>
</body>
</html>
    `;
    
    return html;
  },
  
  // Open report in new window
  viewReport: function() {
    const html = this.generateHTMLReport();
    const newWindow = window.open('', '_blank');
    newWindow.document.write(html);
    newWindow.document.close();
  },
  
  // Export question as shareable JSON
  exportQuestion: function(question) {
    const data = {
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      domain: question.domain,
      difficulty: question.difficulty,
      source: 'ABO Study Tool',
      sharedAt: new Date().toISOString()
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abo-question.json';
    a.click();
    
    URL.revokeObjectURL(url);
  },
  
  // Generate shareable URL for question
  getQuestionURL: function(question) {
    const encoded = btoa(JSON.stringify({
      q: question.question,
      o: question.options,
      a: question.correctAnswer,
      d: question.domain
    }));
    
    return `${window.location.origin}${window.location.pathname}?shared=${encoded}`;
  },
  
  // Copy URL to clipboard
  copyQuestionURL: function(question) {
    const url = this.getQuestionURL(question);
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('Question URL copied to clipboard!');
      }).catch(err => {
        prompt('Copy this URL:', url);
      });
    } else {
      prompt('Copy this URL:', url);
    }
  },
  
  // Import question from URL parameter
  importSharedQuestion: function() {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('shared');
    
    if (shared) {
      try {
        const decoded = JSON.parse(atob(shared));
        return {
          question: decoded.q,
          options: decoded.o,
          correctAnswer: decoded.a,
          domain: decoded.d,
          explanation: 'Shared question',
          source: 'shared'
        };
      } catch (e) {
        console.error('Failed to import shared question:', e);
        return null;
      }
    }
    
    return null;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.Export = Export;
}
