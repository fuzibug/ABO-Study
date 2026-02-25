// ═══════════════════════════════════════════════════════════════
// CHAT.JS - AI Optics Chat Assistant
// Ask opticianry and ophthalmic questions, get expert answers
// ═══════════════════════════════════════════════════════════════

var chatHistory = [];
var chatInProgress = false;

var CHAT_SYSTEM_PROMPT = `You are an expert opticianry and ophthalmic optics instructor helping a student prepare for the ABO (American Board of Opticianry) certification exam.

Your expertise includes:
- Geometric and ophthalmic optics (vergence, Snell's law, prism, transposition)
- Lens materials and properties (CR-39, polycarbonate, Trivex, high-index, Abbe value, refractive index)
- Lens designs (single vision, bifocals, trifocals, progressives, seg types)
- Coatings (AR, UV, photochromic, polarized, scratch-resistant)
- Frame materials, measurements, and dispensing (boxing system, PD, seg height, vertex distance)
- Prescription interpretation and ANSI Z80.1-2022 tolerances
- Ocular anatomy and pathology
- Contact lenses (rigid, soft, Dk/t, base curve, parameters)
- Safety standards (ANSI Z87.1, ASTM F803, FDA, OSHA)
- Low vision devices and magnification
- Regulatory requirements (FTC Eyeglass Rule, state laws)

When answering:
1. Be accurate and cite specific standards, formulas, or values
2. Provide step-by-step explanations for calculations
3. Use analogies when helpful for complex concepts
4. Mention ABO exam relevance when applicable
5. Correct any misconceptions gently
6. Be encouraging and supportive

If asked to solve a calculation:
- Show your work clearly
- Explain each step
- Include units and proper notation
- State the final answer clearly

Keep responses concise but thorough (2-4 paragraphs unless calculation requires more).`;

function initChat() {
  var input = el('chat-input');
  var sendBtn = el('chat-send');
  var clearBtn = el('chat-clear');
  var exportBtn = el('chat-export');
  
  if (!input || !sendBtn) return;
  
  // Send message
  sendBtn.addEventListener('click', function() {
    sendChatMessage();
  });
  
  // Enter key to send
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
  
  // Clear chat
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (chatHistory.length === 0 || confirm('Clear entire chat history?')) {
        chatHistory = [];
        renderChatHistory();
        toast('Chat cleared', 'success');
      }
    });
  }
  
  // Export chat
  if (exportBtn) {
    exportBtn.addEventListener('click', exportChat);
  }
  
  // Load from session storage if exists
  try {
    var saved = sessionStorage.getItem('abo_chat');
    if (saved) {
      chatHistory = JSON.parse(saved);
      renderChatHistory();
    }
  } catch(e) {}
}

function sendChatMessage() {
  var input = el('chat-input');
  var question = input.value.trim();
  
  if (!question) {
    toast('Type a question first', 'warning');
    return;
  }
  
  if (chatInProgress) {
    toast('Please wait for current response', 'warning');
    return;
  }
  
  // Check API key
  if (!groqKey) {
    toast('Please set up your API key in Setup tab first', 'error');
    return;
  }
  
  // Add user message
  chatHistory.push({ role: 'user', content: question });
  input.value = '';
  renderChatHistory();
  
  // Show typing indicator
  chatInProgress = true;
  showChatTyping();
  
  // Build messages array
  var messages = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT },
  ];
  
  // Add conversation history (last 10 exchanges to stay under token limit)
  var recentHistory = chatHistory.slice(-20); // 10 exchanges = 20 messages
  messages = messages.concat(recentHistory);
  
  // Get AI settings
  var temperature = parseFloat(localStorage.getItem('abo_aiTemp')) || 0.7; // Slightly lower for chat
  var maxTokens = parseInt(localStorage.getItem('abo_aiMaxTokens')) || 4096; // Lower for chat
  
  // Make API call
  var url = 'https://api.groq.com/openai/v1/chat/completions';
  var model = selModel || 'llama-3.3-70b-versatile';
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + groqKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: Math.min(maxTokens, 4096), // Cap at 4096 for chat
      stream: false,
    })
  })
  .then(function(res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  })
  .then(function(data) {
    chatInProgress = false;
    hideChatTyping();
    
    var answer = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : 'No response received';
    
    // Add assistant message
    chatHistory.push({ role: 'assistant', content: answer });
    renderChatHistory();
    
    // Save to session storage
    try {
      sessionStorage.setItem('abo_chat', JSON.stringify(chatHistory));
    } catch(e) {}
  })
  .catch(function(err) {
    chatInProgress = false;
    hideChatTyping();
    
    var errorMsg = 'Error: ' + err.message + '. Check your API key and try again.';
    chatHistory.push({ role: 'assistant', content: errorMsg, error: true });
    renderChatHistory();
    
    toast('Chat error: ' + err.message, 'error');
  });
}

function renderChatHistory() {
  var container = el('chat-messages');
  if (!container) return;
  
  if (chatHistory.length === 0) {
    container.innerHTML = '<div class="chat-empty"><div class="chat-empty-icon">💬</div><div class="chat-empty-text">Ask me anything about opticianry!<br><small>Try: "Explain Prentice\'s Rule" or "What\'s the difference between CR-39 and polycarbonate?"</small></div></div>';
    return;
  }
  
  var html = '';
  
  chatHistory.forEach(function(msg, i) {
    var isUser = msg.role === 'user';
    var isError = msg.error === true;
    
    html += '<div class="chat-message ' + (isUser ? 'chat-user' : 'chat-assistant') + (isError ? ' chat-error' : '') + '">';
    html += '<div class="chat-message-header">';
    html += '<span class="chat-message-role">' + (isUser ? '👤 You' : '🤖 AI Tutor') + '</span>';
    html += '<button class="chat-copy-btn" onclick="copyChatMessage(' + i + ')">📋</button>';
    html += '</div>';
    html += '<div class="chat-message-content">' + formatChatMessage(msg.content) + '</div>';
    html += '</div>';
  });
  
  container.innerHTML = html;
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function formatChatMessage(text) {
  // Escape HTML but preserve formatting
  var escaped = escHtml(text);
  
  // Convert **bold** to <strong>
  escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert line breaks
  escaped = escaped.replace(/\n/g, '<br>');
  
  // Convert formulas in format: Δ = F × d
  // (They're already escaped, so just style them)
  
  return escaped;
}

function showChatTyping() {
  var container = el('chat-messages');
  if (!container) return;
  
  var typing = document.createElement('div');
  typing.id = 'chat-typing';
  typing.className = 'chat-message chat-assistant';
  typing.innerHTML = '<div class="chat-message-header"><span class="chat-message-role">🤖 AI Tutor</span></div>' +
                     '<div class="chat-message-content chat-typing-indicator"><span></span><span></span><span></span></div>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function hideChatTyping() {
  var typing = el('chat-typing');
  if (typing) typing.remove();
}

function copyChatMessage(index) {
  if (index < 0 || index >= chatHistory.length) return;
  
  var msg = chatHistory[index];
  var text = msg.content;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      toast('Message copied!', 'success');
    }).catch(function() {
      toast('Copy failed', 'error');
    });
  } else {
    // Fallback
    var tmp = document.createElement('textarea');
    tmp.value = text;
    tmp.style.position = 'fixed';
    tmp.style.opacity = '0';
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    toast('Message copied!', 'success');
  }
}

function exportChat() {
  if (chatHistory.length === 0) {
    toast('No chat history to export', 'warning');
    return;
  }
  
  var text = 'ABO Study - AI Optics Chat Export\n';
  text += 'Date: ' + new Date().toLocaleString() + '\n';
  text += '='.repeat(60) + '\n\n';
  
  chatHistory.forEach(function(msg) {
    text += (msg.role === 'user' ? 'YOU: ' : 'AI TUTOR: ') + '\n';
    text += msg.content + '\n';
    text += '-'.repeat(60) + '\n\n';
  });
  
  // Download as text file
  var blob = new Blob([text], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'abo-chat-export-' + Date.now() + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast('Chat exported!', 'success');
}

console.log('✅ Chat module loaded');
