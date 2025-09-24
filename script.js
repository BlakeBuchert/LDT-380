// Global variables
let currentSection = 'home';
let quizAnswers = {};
let completedSections = new Set(['home']);
let sectionOrder = ['home', 'ai-supported', 'misuse-pitfalls', 'finding-balance', 'sandbox'];
let allSectionsCompleted = false;

// Game variables
let gameScore = 0;
let gameStreak = 0;
let currentQuestionIndex = 0;
let gameLevel = 'Novice';
let unlockedAchievements = new Set();



const gameScenarios = [
    {
        title: "Research Paper Scenario",
        text: "You're working on a research paper about renewable energy. You ask ChatGPT to 'write a 500-word introduction about solar power advantages.' What should you do next?",
        choices: [
            { text: "Use it as inspiration and write your own version, citing AI assistance", points: 10, feedback: "Perfect! You used the AI output as inspiration and wrote your own introduction, properly citing the AI assistance." },
            { text: "Copy and paste it directly into your paper", points: -5, feedback: "This would be plagiarism. AI-generated content should never be submitted as your own work." },
            { text: "Edit it slightly and use it without citation", points: 5, feedback: "Better than copying directly, but you should still write your own version and cite AI assistance." },
            { text: "Ask for a longer version to save time", points: -2, feedback: "This misses the learning opportunity and ethical issues with using AI-generated content." }
        ]
    },
    {
        title: "Study Session Scenario",
        text: "You're struggling with calculus. You want to use AI to help you prepare for an upcoming exam. What's the best approach?",
        choices: [
            { text: "Ask AI to solve all the practice problems for you", points: -5, feedback: "This prevents you from learning and practicing the skills yourself." },
            { text: "Have AI take practice tests for you to see the answers", points: -8, feedback: "This is essentially cheating and defeats the purpose of practice tests." },
            { text: "Ask AI to explain concepts and generate practice problems for you to solve", points: 10, feedback: "Excellent! Using AI to explain concepts and create practice opportunities enhances your learning." },
            { text: "Use AI to write study notes for you to memorize", points: 3, feedback: "While not terrible, writing your own notes helps with comprehension and retention." }
        ]
    },
    {
        title: "Group Project Scenario",
        text: "Your group is behind on a presentation. A teammate suggests using AI to generate the entire slide deck. What do you recommend?",
        choices: [
            { text: "Let AI create everything to save time", points: -7, feedback: "This doesn't demonstrate your team's understanding and may violate academic integrity policies." },
            { text: "Use AI to brainstorm ideas and create an outline for the team to develop", points: 10, feedback: "Great approach! Using AI for brainstorming while having the team develop the content ensures learning and integrity." },
            { text: "Have AI create slides but rewrite them in your own words", points: 5, feedback: "Better than direct copying, but the team should be creating original content based on their research." },
            { text: "Avoid AI completely even though you're behind schedule", points: 2, feedback: "While avoiding misuse, you're missing an opportunity to use AI ethically for brainstorming and organization." }
        ]
    },
    {
        title: "Essay Writing Scenario",
        text: "You have writer's block on your literature essay about Shakespeare's themes. How should you use AI to help?",
        choices: [
            { text: "Ask AI to write the essay and edit it slightly", points: -8, feedback: "This is academic dishonesty. Your essay should reflect your analysis and understanding." },
            { text: "Have AI analyze the themes and use that analysis", points: -3, feedback: "Using AI's analysis as your own doesn't demonstrate your critical thinking skills." },
            { text: "Ask AI to help you brainstorm different angles and questions to explore", points: 10, feedback: "Perfect! Using AI to overcome writer's block through brainstorming maintains your analytical ownership." },
            { text: "Get AI to find quotes and write topic sentences", points: 1, feedback: "Finding your own evidence and developing your own arguments is crucial for learning." }
        ]
    },
    {
        title: "Coding Assignment Scenario",
        text: "You're stuck on a programming assignment. The deadline is tomorrow. What's the most ethical way to use AI?",
        choices: [
            { text: "Copy a complete solution from AI and submit it", points: -10, feedback: "This is plagiarism and prevents you from learning programming concepts." },
            { text: "Ask AI to debug specific errors and explain the solutions", points: 10, feedback: "Excellent! Using AI to understand errors and learn debugging techniques enhances your skills." },
            { text: "Have AI write functions but write the main code yourself", points: 3, feedback: "Partial, but you should try to write and understand all components yourself." },
            { text: "Ask AI for the algorithm but code it yourself", points: 8, feedback: "Good approach! Understanding the logic while implementing it yourself promotes learning." }
        ]
    },
    {
        title: "Research Methods Scenario",
        text: "You need to find sources for your history paper. How should you use AI in your research process?",
        choices: [
            { text: "Ask AI to write a bibliography for you", points: -5, feedback: "You should personally verify and evaluate sources, not rely on AI-generated citations." },
            { text: "Use AI to suggest search terms and research directions", points: 10, feedback: "Great! AI can help you think of research angles you might not have considered." },
            { text: "Have AI summarize sources instead of reading them", points: -3, feedback: "Reading primary sources yourself is essential for deep understanding and accurate analysis." },
            { text: "Ask AI for historical facts to include in your paper", points: 2, feedback: "Always verify AI-provided facts with reliable sources - AI can sometimes provide inaccurate information." }
        ]
    },
    {
        title: "Lab Report Scenario",
        text: "You're writing up a chemistry lab report. The data analysis is complex. How should you approach this with AI?",
        choices: [
            { text: "Have AI interpret your data and write the analysis section", points: -6, feedback: "Data interpretation should reflect your understanding of the experiment and results." },
            { text: "Ask AI to help you understand statistical methods for your data", points: 10, feedback: "Perfect! Learning proper analytical methods enhances your scientific skills." },
            { text: "Use AI to generate graphs and figures from your raw data", points: 7, feedback: "AI can help with visualization, but ensure you understand what the graphs represent." },
            { text: "Have AI write the entire report based on your data", points: -8, feedback: "Lab reports should demonstrate your understanding of scientific processes and results." }
        ]
    },
    {
        title: "Foreign Language Scenario",
        text: "You're learning Spanish and have a conversation assignment. How should you use AI translation tools?",
        choices: [
            { text: "Write in English and translate everything with AI", points: -5, feedback: "This prevents you from practicing the language and developing fluency." },
            { text: "Use AI to check grammar after writing your own responses", points: 8, feedback: "Good! Using AI for grammar checking while creating original content supports learning." },
            { text: "Have conversations with AI to practice before the real assignment", points: 10, feedback: "Excellent! Practicing with AI builds confidence and skills for authentic conversations." },
            { text: "Use AI to generate perfect responses to memorize", points: -2, feedback: "Memorizing responses doesn't build genuine conversational ability in the language." }
        ]
    },
    {
        title: "Final Exam Preparation",
        text: "Your professor allows one page of notes for the final exam. How should you use AI to prepare this cheat sheet?",
        choices: [
            { text: "Ask AI to create the perfect cheat sheet for your exam", points: -4, feedback: "Creating your own cheat sheet helps you process and remember key information." },
            { text: "Use AI to help organize your notes into the most effective format", points: 9, feedback: "Great! AI can help with organization while you determine the essential content." },
            { text: "Have AI summarize all course materials for your sheet", points: 2, feedback: "Better to create your own summaries to reinforce learning and understanding." },
            { text: "Ask AI what topics are most likely to be on the exam", points: 1, feedback: "AI can't predict specific exam content. Focus on course materials and study guides." }
        ]
    },
    {
        title: "Peer Review Scenario",
        text: "You need to peer review a classmate's draft paper. How can AI assist ethically in this process?",
        choices: [
            { text: "Have AI write the peer review comments for you", points: -6, feedback: "Peer reviews should reflect your genuine assessment and provide authentic feedback." },
            { text: "Use AI to help structure your feedback and suggest tactful phrasing", points: 10, feedback: "Excellent! AI can help you give constructive feedback while maintaining your authentic perspective." },
            { text: "Ask AI to identify all the problems with the paper", points: 3, feedback: "Better to develop your own critical reading skills, though AI could supplement your analysis." },
            { text: "Have AI check if the paper has any plagiarism", points: 7, feedback: "While helpful, combine this with your own assessment and use proper plagiarism detection tools." }
        ]
    }
];

// Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentSection = sectionId;
    completedSections.add(sectionId);
    updateProgress();
}

function updateProgress() {
    const totalSections = sectionOrder.length;
    
    // Calculate progress based on current section position
    const currentIndex = sectionOrder.indexOf(currentSection);
    const baseProgress = ((currentIndex + 1) / totalSections) * 100;
    
    // If all sections have been visited, set to 100%
    const completedCount = completedSections.size;
    const isAllCompleted = completedCount >= totalSections;
    
    const progressPercent = isAllCompleted ? 100 : baseProgress;
    document.getElementById('progressFill').style.width = progressPercent + '%';
    
    // Show completion indicator if all sections completed
    const completionIndicator = document.getElementById('completionIndicator');
    if (isAllCompleted && !allSectionsCompleted) {
        allSectionsCompleted = true;
        completionIndicator.style.display = 'block';
    } else if (!isAllCompleted && allSectionsCompleted) {
        allSectionsCompleted = false;
        completionIndicator.style.display = 'none';
    }
}
// Card Expansion
function toggleExpand(card) {
    const content = card.querySelector('.expandable');
    content.classList.toggle('expanded');
}

// Quiz Functions
function selectQuizOption(option, isCorrect) {
    const quiz = option.closest('.quiz-container');
    const quizId = quiz.id;
    
    // Remove previous selections
    quiz.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select current option
    option.classList.add('selected');
    
    // Store answer
    quizAnswers[quizId] = { element: option, correct: isCorrect };
    
    // Enable submit button
    quiz.querySelector('.btn').disabled = false;
}

function submitQuiz(quizId) {
    const answer = quizAnswers[quizId];
    const quiz = document.getElementById(quizId);
    const feedback = document.getElementById(quizId + '-feedback');
    
    if (!answer) return;
    
    // Show correct/incorrect styling
    quiz.querySelectorAll('.quiz-option').forEach(opt => {
        if (opt === answer.element) {
            opt.classList.add(answer.correct ? 'correct' : 'incorrect');
        }
    });
    
    // Show feedback
    feedback.innerHTML = answer.correct 
        ? '<div style="color: #48bb78; margin-top: 1rem;">✅ Correct! This demonstrates ethical AI use.</div>'
        : '<div style="color: #f56565; margin-top: 1rem;">❌ Incorrect. This could lead to academic integrity issues.</div>';
    
    // Disable further interaction
    quiz.querySelector('.btn').disabled = true;
    quiz.querySelectorAll('.quiz-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
}

// Prompt Evaluation
function evaluatePrompt() {
    const prompt = document.getElementById('promptInput').value.trim();
    const result = document.getElementById('promptResult');
    
    if (!prompt) {
        result.innerHTML = '<em>Please enter a prompt to evaluate.</em>';
        return;
    }
    
    // Simple evaluation logic
    const goodIndicators = ['help me understand', 'explain', 'suggest questions', 'practice', 'clarify', 'brainstorm'];
    const badIndicators = ['write my essay', 'complete my assignment', 'do my homework', 'take my exam'];
    
    const isGood = goodIndicators.some(indicator => prompt.toLowerCase().includes(indicator));
    const isBad = badIndicators.some(indicator => prompt.toLowerCase().includes(indicator));
    
    let evaluation;
    if (isBad) {
        evaluation = '<div style="color: #f56565;"><strong>❌ Concerning:</strong> This prompt might lead to academic dishonesty. Consider revising to focus on learning assistance rather than task completion.</div>';
    } else if (isGood) {
        evaluation = '<div style="color: #48bb78;"><strong>✅ Good:</strong> This prompt focuses on learning and understanding, which is an appropriate use of AI tools.</div>';
    } else {
        evaluation = '<div style="color: #ed8936;"><strong>⚠️ Unclear:</strong> This prompt could be improved. Try focusing on how AI can help you learn rather than complete tasks.</div>';
    }
    
    result.innerHTML = evaluation + '<br><br><strong>Tips:</strong> Ethical prompts typically ask for explanations, suggestions, practice materials, or clarification rather than completed work.';
}

// Game Functions
function selectChoice(choiceElement, points, feedback) {
    // Prevent multiple selections
    if (choiceElement.classList.contains('disabled')) return;
    
    const choices = document.querySelectorAll('.choice-btn');
    choices.forEach(choice => {
        choice.classList.add('disabled');
        choice.style.pointerEvents = 'none';
    });
    
    // Style the selected choice
    if (points > 5) {
        choiceElement.classList.add('selected-correct');
    } else {
        choiceElement.classList.add('selected-incorrect');
    }
    
    // Update score and streak
    if (points > 5) {
        gameStreak++;
        checkAchievements();
    } else {
        gameStreak = 0;
    }
    
    gameScore = Math.max(0, gameScore + points);
    updateGameStats();
    
    // Show feedback
    const feedbackElement = document.getElementById('choiceFeedback');
    feedbackElement.textContent = feedback;
    feedbackElement.className = `choice-feedback show ${points > 5 ? 'correct' : 'incorrect'}`;
    
    // Show next button
    document.getElementById('nextBtn').style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= gameScenarios.length) {
        endGame();
        return;
    }
    
    loadQuestion();
    document.getElementById('nextBtn').style.display = 'none';
}

function loadQuestion() {
    const scenario = gameScenarios[currentQuestionIndex];
    
    document.querySelector('.scenario-title').textContent = `Scenario #${currentQuestionIndex + 1}`;
    document.getElementById('scenarioText').textContent = scenario.text;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = gameScenarios.length;
    
    const choicesContainer = document.getElementById('scenarioChoices');
    choicesContainer.innerHTML = '';
    
    scenario.choices.forEach((choice, index) => {
        const choiceButton = document.createElement('div');
        choiceButton.className = 'choice-btn';
        choiceButton.textContent = choice.text;
        choiceButton.onclick = () => selectChoice(choiceButton, choice.points, choice.feedback);
        choicesContainer.appendChild(choiceButton);
    });
    
    // Clear feedback
    const feedbackElement = document.getElementById('choiceFeedback');
    feedbackElement.className = 'choice-feedback';
    feedbackElement.textContent = '';
    
    // Update progress
    const progress = ((currentQuestionIndex) / gameScenarios.length) * 100;
    document.getElementById('gameProgressFill').style.width = progress + '%';
}

function updateGameStats() {
    document.getElementById('gameScore').textContent = gameScore;
    document.getElementById('gameStreak').textContent = gameStreak;
    
    // Update level based on score
    let newLevel;
    if (gameScore >= 80) newLevel = 'Expert';
    else if (gameScore >= 60) newLevel = 'Advanced';
    else if (gameScore >= 40) newLevel = 'Intermediate';
    else if (gameScore >= 20) newLevel = 'Beginner';
    else newLevel = 'Novice';
    
    if (newLevel !== gameLevel) {
        gameLevel = newLevel;
        document.getElementById('gameLevel').textContent = gameLevel;
        document.getElementById('gameLevel').classList.add('level-up-animation');
        setTimeout(() => {
            document.getElementById('gameLevel').classList.remove('level-up-animation');
        }, 1000);
    }
}

function checkAchievements() {
    // First Try achievement
    if (currentQuestionIndex === 0 && !unlockedAchievements.has('first')) {
        unlockAchievement('achievement-first', 'first');
    }
    
    // Hot Streak achievement
    if (gameStreak >= 3 && !unlockedAchievements.has('streak')) {
        unlockAchievement('achievement-streak', 'streak');
    }
    
    // Perfect Score achievement (check at end)
    if (currentQuestionIndex === gameScenarios.length - 1 && gameScore === 100) {
        unlockAchievement('achievement-perfect', 'perfect');
    }
    
    // Ethics Expert achievement
    if (gameScore >= 80 && !unlockedAchievements.has('expert')) {
        unlockAchievement('achievement-expert', 'expert');
    }
}

function unlockAchievement(elementId, achievementId) {
    unlockedAchievements.add(achievementId);
    const element = document.getElementById(elementId);
    element.classList.add('unlocked');
    
    // Show a brief celebration animation
    element.style.animation = 'levelUp 1s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 1000);
}

function endGame() {
    const feedbackElement = document.getElementById('choiceFeedback');
    let message;
    
    if (gameScore >= 90) {
        message = "🏆 Outstanding! You're an AI Ethics Expert! You demonstrated excellent understanding of responsible AI use.";
    } else if (gameScore >= 70) {
        message = "🌟 Great job! You have a solid grasp of AI ethics. Keep practicing to become an expert.";
    } else if (gameScore >= 50) {
        message = "👍 Good effort! You understand the basics but could benefit from reviewing some concepts.";
    } else {
        message = "📚 Keep learning! Review the module content and try again to improve your understanding.";
    }
    
    feedbackElement.textContent = message;
    feedbackElement.className = 'choice-feedback show correct';
    
    // Check final achievements
    if (gameScore >= 80 && !unlockedAchievements.has('expert')) {
        unlockAchievement('achievement-expert', 'expert');
    }
    
    // Hide next button and show restart
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('restartBtn').style.display = 'block';
    
    // Update progress to 100%
    document.getElementById('gameProgressFill').style.width = '100%';
}

function restartGame() {
    gameScore = 0;
    gameStreak = 0;
    currentQuestionIndex = 0;
    gameLevel = 'Novice';
    unlockedAchievements.clear();
    
    updateGameStats();
    loadQuestion();
    
    // Reset achievements
    document.querySelectorAll('.achievement').forEach(achievement => {
        achievement.classList.remove('unlocked');
    });
    
    document.getElementById('restartBtn').style.display = 'none';
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadQuestion();
    updateGameStats();
    updateProgress();
});