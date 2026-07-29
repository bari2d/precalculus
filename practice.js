// Practice section and quiz engine.
import { precalculusData } from './data.js?v=precalculus-4';
import {
    isQuestionStarred,
    recordQuizResult,
    subscribeProgress,
    toggleQuestionStar
} from './progress.js?v=precalculus-4';

export function initPracticePanel(elems, onStatsUpdate) {
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let selectedOptionIndex = -1;
    let answerLog = [];
    let latestProgress = { starredQuestions: [] };

    elems.modeSelect.innerHTML = '<option value="cumulative">Complete final review (packet order)</option>';
    const starredOption = document.createElement('option');
    starredOption.value = 'starred';
    starredOption.innerText = 'Starred questions (0)';
    elems.modeSelect.appendChild(starredOption);
    precalculusData.units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.id;
        option.innerText = `${unit.id.replace('unit-', 'Unit ')} - ${unit.title}`;
        elems.modeSelect.appendChild(option);
    });

    const bankSize = precalculusData.units.reduce((total, unit) => total + unit.questions.length, 0);
    if (elems.lengthSelect) {
        elems.lengthSelect.innerHTML = `
            <option value="all">Full bank (${bankSize} questions)</option>
            <option value="quick">Quick review (16 questions)</option>
        `;
    }
    const bankNote = document.getElementById('practice-bank-note');
    if (bankNote) {
        bankNote.innerText = `Question bank: ${bankSize} supplied review questions across ${precalculusData.units.length} study units. Full review follows packet order; Quick review is balanced and randomized.`;
    }

    elems.btnStart.addEventListener('click', () => startQuiz(elems.modeSelect.value, elems.lengthSelect?.value || 'all'));
    elems.btnSubmit.addEventListener('click', submitAnswer);
    elems.btnNext.addEventListener('click', nextQuestion);
    elems.btnStarQuestion?.addEventListener('click', toggleCurrentQuestionStar);
    elems.btnRetry.addEventListener('click', () => {
        elems.summaryPanel.style.display = 'none';
        elems.setupPanel.style.display = 'block';
    });
    subscribeProgress(progress => {
        latestProgress = progress;
        starredOption.innerText = `Starred questions (${progress.starredQuestions.length})`;
        if (elems.runnerPanel.style.display !== 'none') updateQuestionStarButton();
    });

    function startQuiz(mode, sessionLength) {
        currentIndex = 0;
        score = 0;
        selectedOptionIndex = -1;
        answerLog = [];

        if (mode === 'cumulative') {
            currentQuestions = buildBalancedCumulativeSet(sessionLength === 'quick' ? 16 : null);
        } else if (mode === 'starred') {
            const starredIds = new Set(latestProgress.starredQuestions);
            const starredQuestions = allQuestions().filter(item => starredIds.has(item.id));
            currentQuestions = shuffle(starredQuestions);
            if (sessionLength === 'quick') currentQuestions = currentQuestions.slice(0, 16);
        } else {
            const unit = precalculusData.units.find(candidate => candidate.id === mode);
            const unitQuestions = unit
                ? shuffle(unit.questions).map(item => ({ ...item, unitId: unit.id }))
                : [];
            currentQuestions = sessionLength === 'quick'
                ? unitQuestions.slice(0, 16)
                : unitQuestions;
        }

        currentQuestions = currentQuestions.map(randomizeAnswerOrder);

        if (currentQuestions.length === 0) {
            alert(mode === 'starred'
                ? 'No questions are starred yet. Star a question during practice, then return here to review it.'
                : 'No questions are available for this unit yet.');
            return;
        }

        elems.setupPanel.style.display = 'none';
        elems.summaryPanel.style.display = 'none';
        elems.runnerPanel.style.display = 'block';
        loadQuestion();
    }

    function allQuestions() {
        return precalculusData.units.flatMap(unit => unit.questions.map(item => ({ ...item, unitId: unit.id })));
    }

    function buildBalancedCumulativeSet(limit = null) {
        if (!limit) {
            return allQuestions().sort((a, b) => sourceNumber(a) - sourceNumber(b));
        }
        const firstQuestionFromEachUnit = precalculusData.units.map(unit => {
            const item = shuffle(unit.questions)[0];
            return item ? { ...item, unitId: unit.id } : null;
        }).filter(Boolean);
        const selectedIds = new Set(firstQuestionFromEachUnit.map(item => item.id));
        const remaining = precalculusData.units.flatMap(unit => shuffle(unit.questions)
            .filter(item => !selectedIds.has(item.id))
            .map(item => ({ ...item, unitId: unit.id })));
        const balancedQuestions = shuffle([...firstQuestionFromEachUnit, ...remaining]);
        return limit ? balancedQuestions.slice(0, Math.min(limit, balancedQuestions.length)) : balancedQuestions;
    }

    function sourceNumber(question) {
        return Number(question.source?.match(/#(\d+)/)?.[1] || Number.MAX_SAFE_INTEGER);
    }

    function randomizeAnswerOrder(question) {
        const choices = shuffle(question.options.map((text, index) => ({
            text,
            correct: index === question.correctIndex
        })));
        return {
            ...question,
            options: choices.map(choice => choice.text),
            correctIndex: choices.findIndex(choice => choice.correct)
        };
    }

    function loadQuestion() {
        const currentQuestion = currentQuestions[currentIndex];
        selectedOptionIndex = -1;
        elems.progressText.innerText = `Question ${currentIndex + 1} of ${currentQuestions.length}`;
        elems.progressFill.style.width = `${((currentIndex + 1) / currentQuestions.length) * 100}%`;

        if (elems.questionTopic) {
            elems.questionTopic.innerText = currentQuestion.topic || 'Core skill';
        }
        if (elems.questionDifficulty) {
            const isHonors = currentQuestion.curriculumLevel === 'Honors';
            elems.questionDifficulty.innerText = isHonors ? 'Honors topic' : (currentQuestion.difficulty || 'Core');
            elems.questionDifficulty.classList.toggle('honors', isHonors);
        }
        if (elems.questionSource) {
            elems.questionSource.hidden = !currentQuestion.source;
            elems.questionSource.innerText = currentQuestion.source || '';
        }
        updateQuestionStarButton();

        elems.questionText.innerHTML = currentQuestion.text;
        elems.optionsContainer.innerHTML = '';
        currentQuestion.options.forEach((optionText, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.type = 'button';
            button.innerHTML = optionText;
            button.addEventListener('click', () => selectOption(index));
            elems.optionsContainer.appendChild(button);
        });

        elems.explanationBox.style.display = 'none';
        elems.explanationBox.removeAttribute('data-result');
        if (elems.feedbackHeading) elems.feedbackHeading.innerText = 'Worked solution';
        elems.btnSubmit.style.display = 'block';
        elems.btnSubmit.disabled = true;
        elems.btnNext.style.display = 'none';
        renderMath(elems.runnerPanel);
    }

    function toggleCurrentQuestionStar() {
        const currentQuestion = currentQuestions[currentIndex];
        if (!currentQuestion) return;
        toggleQuestionStar(currentQuestion.id);
        updateQuestionStarButton();
    }

    function updateQuestionStarButton() {
        const currentQuestion = currentQuestions[currentIndex];
        if (!elems.btnStarQuestion || !currentQuestion) return;
        const starred = isQuestionStarred(currentQuestion.id);
        elems.btnStarQuestion.classList.toggle('active', starred);
        elems.btnStarQuestion.setAttribute('aria-pressed', String(starred));
        elems.btnStarQuestion.setAttribute('aria-label', starred ? 'Remove this question from starred review' : 'Star this question for review');
        const icon = elems.btnStarQuestion.querySelector('[aria-hidden="true"]');
        const label = elems.btnStarQuestion.querySelector('.question-star-label');
        if (icon) icon.textContent = starred ? '★' : '☆';
        if (label) label.textContent = starred ? 'Starred' : 'Star question';
    }

    function selectOption(index) {
        selectedOptionIndex = index;
        elems.optionsContainer.querySelectorAll('.option-btn').forEach((button, buttonIndex) => {
            button.classList.toggle('selected', buttonIndex === index);
        });
        elems.btnSubmit.disabled = false;
    }

    function submitAnswer() {
        const currentQuestion = currentQuestions[currentIndex];
        const buttons = elems.optionsContainer.querySelectorAll('.option-btn');
        const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
        if (isCorrect) score += 1;
        answerLog.push({ question: currentQuestion, isCorrect });

        buttons.forEach((button, index) => {
            button.disabled = true;
            if (index === currentQuestion.correctIndex) button.classList.add('correct');
            if (index === selectedOptionIndex && !isCorrect) button.classList.add('incorrect');
        });

        const definitionMarkup = currentQuestion.definition
            ? `<div class="definition-inline"><strong>Definition:</strong> ${currentQuestion.definition}</div>`
            : '';
        const correctAnswer = currentQuestion.options[currentQuestion.correctIndex];
        const selectedAnswer = currentQuestion.options[selectedOptionIndex];
        const selectedMarkup = isCorrect
            ? ''
            : `<span><strong>Your choice:</strong> ${selectedAnswer}</span>`;
        if (elems.feedbackHeading) {
            elems.feedbackHeading.innerText = isCorrect ? 'Correct - here is why' : 'Not quite - here is the answer';
        }
        elems.explanationBox.dataset.result = isCorrect ? 'correct' : 'incorrect';
        elems.explanationContent.innerHTML = `
            <div class="answer-feedback-summary">
                <strong>${isCorrect ? 'You got it.' : 'Good try. Use the correct answer to check the step that changed.'}</strong>
                ${selectedMarkup}
                <span><strong>Correct answer:</strong> ${correctAnswer}</span>
            </div>
            ${definitionMarkup}
            <div class="worked-solution"><strong>Why:</strong> ${currentQuestion.explanation}</div>
        `;
        elems.explanationBox.style.display = 'block';
        renderMath(elems.explanationBox);

        elems.btnSubmit.style.display = 'none';
        elems.btnNext.style.display = 'block';
        elems.btnNext.innerText = currentIndex === currentQuestions.length - 1 ? 'Finish quiz' : 'Next question';
    }

    function nextQuestion() {
        if (currentIndex < currentQuestions.length - 1) {
            currentIndex += 1;
            loadQuestion();
        } else {
            finishQuiz();
        }
    }

    function finishQuiz() {
        elems.runnerPanel.style.display = 'none';
        elems.summaryPanel.style.display = 'block';
        const total = currentQuestions.length;
        const accuracy = Math.round((score / total) * 100);
        const xp = score * 10;
        elems.summaryScore.innerText = `${score}/${total}`;
        elems.summaryPercent.innerText = `${accuracy}% accuracy`;
        elems.summaryXp.innerText = xp;
        saveDiagnosticsData(score, total, xp);
    }

    function saveDiagnosticsData(quizScore, quizTotal, xp) {
        recordQuizResult({
            score: quizScore,
            total: quizTotal,
            xp,
            answers: answerLog.map(({ question, isCorrect }) => ({
                unitId: question.unitId,
                isCorrect
            }))
        });
        if (typeof onStatsUpdate === 'function') onStatsUpdate();
    }

    function shuffle(items) {
        return [...items].sort(() => Math.random() - 0.5);
    }

    function renderMath(container) {
        if (typeof window.renderMathInElement !== 'function') return;
        window.renderMathInElement(container, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false,
            strict: 'ignore'
        });
    }
}
