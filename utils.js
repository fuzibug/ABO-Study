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

// Random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random choice from array
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Random float with decimals
function randomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Generate unique questions (no repeats within session)
function generateUniqueQuestions(domain, count) {
    let generators = [];
    
    if (domain === 'all') {
        generators = [
            ...questionGenerators.general,
            ...questionGenerators.optics,
            ...questionGenerators.dispensing,
            ...questionGenerators.products
        ];
    } else if (questionGenerators[domain]) {
        generators = questionGenerators[domain];
    } else {
        console.error(`Unknown domain: ${domain}`);
        return [];
    }
    
    const questions = [];
    const usedIndices = new Set();
    
    // First pass: generate unique questions
    while (questions.length < count && usedIndices.size < generators.length) {
        const idx = Math.floor(Math.random() * generators.length);
        
        if (!usedIndices.has(idx)) {
            usedIndices.add(idx);
            questions.push(generators[idx]());
        }
    }
    
    // If we need more questions than unique generators, regenerate with new random values
    while (questions.length < count) {
        const idx = Math.floor(Math.random() * generators.length);
        questions.push(generators[idx]()); // Generates new random values each time
    }
    
    return questions;
}

// Get question key for bookmarking
function getQuestionKey(question) {
    for (const [domain, questions] of Object.entries(questionBank)) {
        const idx = questions.indexOf(question);
        if (idx !== -1) return `${domain}-${idx}`;
    }
    return `${Date.now()}-${Math.random()}`; // Fallback for generated questions
}

// Get domain from question
function getDomainFromQuestion(question) {
    for (const [domain, questions] of Object.entries(questionBank)) {
        if (questions.includes(question)) return domain;
    }
    // Check question text for keywords
    const qText = question.q.toLowerCase();
    if (qText.includes('prism') || qText.includes('lens') || qText.includes('focal')) return 'optics';
    if (qText.includes('frame') || qText.includes('fitting') || qText.includes('adjustment')) return 'dispensing';
    if (qText.includes('coating') || qText.includes('material') || qText.includes('bifocal')) return 'products';
    return 'general';
}

// Format time display (hh:mm:ss)
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Format time short (mm:ss)
function formatTimeShort(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// Get all questions from domain(s) - now generates fresh questions
function getQuestionsFromDomain(domain) {
    if (domain === 'all') {
        return generateUniqueQuestions('all', 40); // Generate 40 mixed questions
    }
    return generateUniqueQuestions(domain, 20); // Generate 20 questions for specific domain
}
