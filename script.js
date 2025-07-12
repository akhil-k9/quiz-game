const fullQuestionPool = [
    // HTML
    {
        question: "What does HTML stand for?",
        options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Tool Markup Language"],
        correct: 1
    },
    {
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<hyper>"],
        correct: 1
    },
    // CSS
    {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"],
        correct: 2
    },
    {
        question: "Which property is used to change text color in CSS?",
        options: ["font-color", "color", "text-color", "fgcolor"],
        correct: 1
    },
    // Python
    {
        question: "What is the correct file extension for Python files?",
        options: [".pt", ".pyt", ".py", ".python"],
        correct: 2
    },
    {
        question: "Which keyword is used for function in Python?",
        options: ["func", "define", "function", "def"],
        correct: 3
    },
    {
        question: "How do you insert comments in Python?",
        options: ["// this is a comment", "# this is a comment", "<!-- comment -->", "/* comment */"],
        correct: 1
    },
    {
        question: "Which of these is a valid variable name in Python?",
        options: ["2name", "name!", "_name", "name#"],
        correct: 2
    },
    {
        question: "How do you create a list in Python?",
        options: ["list = {}", "list = []", "list = ()", "list = <>"],
        correct: 1
    },
    // More HTML/CSS/Python mixed
    {
        question: "Which tag is used for inserting images in HTML?",
        options: ["<image>", "<img>", "<pic>", "<src>"],
        correct: 1
    },
    {
        question: "Which CSS property is used to set background color?",
        options: ["color", "bgcolor", "background-color", "background"],
        correct: 2
    },
    {
        question: "What is the correct way to start a for loop in Python?",
        options: ["for x in range(5):", "for(x=0;x<5;x++)", "foreach x in range(5)", "loop x in range(5)"],
        correct: 0
    },
    {
        question: "Which tag is used to make text bold in HTML?",
        options: ["<b>", "<bold>", "<strong>", "Both <b> and <strong>"],
        correct: 3
    },
    {
        question: "Which symbol is used for IDs in CSS?",
        options: [".", "#", "@", "&"],
        correct: 1
    }
];

// Shuffle array
function getRandomQuestions(pool, count) {
    return pool.sort(() => 0.5 - Math.random()).slice(0, count);
}

class QuizApp {
    constructor() {
        this.questions = getRandomQuestions(fullQuestionPool, 5); // select 5 random
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 10;

        this.elements = {
            question: document.getElementById('question'),
            options: document.querySelectorAll('.option'),
            nextBtn: document.getElementById('next-btn'),
            timerBar: document.querySelector('.timer-bar'),
            timerText: document.querySelector('.timer-text'),
            modal: document.getElementById('result-modal'),
            finalScore: document.getElementById('final-score'),
            retryBtn: document.getElementById('retry-btn'),
            topScores: document.getElementById('top-scores')
        };

        this.bindEvents();
        this.loadQuestion();
    }

    bindEvents() {
        this.elements.nextBtn.addEventListener('click', () => this.handleNext());
        this.elements.retryBtn.addEventListener('click', () => this.resetQuiz());
        this.elements.options.forEach(option => {
            option.addEventListener('click', () => this.enableNextButton());
        });
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        this.elements.question.textContent = question.question;

        this.elements.options.forEach((option, index) => {
            const optionText = option.querySelector('.option-text');
            optionText.textContent = question.options[index];
            option.classList.remove('correct', 'incorrect');
            option.querySelector('input').checked = false;
            option.querySelector('input').value = index;
        });

        this.elements.nextBtn.disabled = true;
        this.startTimer();
    }

    startTimer() {
        this.timeLeft = 10;
        this.elements.timerText.textContent = this.timeLeft;
        this.elements.timerBar.style.transform = 'scaleX(1)';
        clearInterval(this.timer);

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.elements.timerText.textContent = this.timeLeft;
            this.elements.timerBar.style.transform = `scaleX(${this.timeLeft / 10})`;

            if (this.timeLeft === 0) {
                clearInterval(this.timer);
                this.handleNext();
            }
        }, 1000);
    }

    enableNextButton() {
        this.elements.nextBtn.disabled = false;
    }

    handleNext() {
        clearInterval(this.timer);
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            const answer = parseInt(selectedOption.value);
            const correct = this.questions[this.currentQuestion].correct;

            if (answer === correct) {
                this.score++;
                selectedOption.parentElement.classList.add('correct');
            } else {
                selectedOption.parentElement.classList.add('incorrect');
                this.elements.options[correct].classList.add('correct');
            }
        }

        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.questions.length) {
                this.loadQuestion();
            } else {
                this.showResults();
            }
        }, 1000);
    }

    showResults() {
        this.elements.modal.style.display = 'flex';
        this.elements.finalScore.textContent = this.score;

        const stars = document.querySelectorAll('.star');
        const rating = Math.round((this.score / this.questions.length) * 5);
        stars.forEach((star, index) => {
            star.style.color = index < rating ? '#ffd700' : '#ddd';
        });

        this.updateLeaderboard();
    }

    updateLeaderboard() {
        let scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        scores.push(this.score);
        scores.sort((a, b) => b - a);
        scores = scores.slice(0, 5);
        localStorage.setItem('quizScores', JSON.stringify(scores));

        this.elements.topScores.innerHTML = scores
            .map(score => `<li>${score} points</li>`)
            .join('');
    }

    resetQuiz() {
        this.questions = getRandomQuestions(fullQuestionPool, 5); // refresh with new random set
        this.currentQuestion = 0;
        this.score = 0;
        this.elements.modal.style.display = 'none';
        this.loadQuestion();
    }
}

new QuizApp();
