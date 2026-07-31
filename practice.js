// Practice section and quiz engine.
import { precalculusData } from './data.js?v=precalculus-7';
import {
    clearActiveQuiz,
    isQuestionIgnored,
    isQuestionStarred,
    recordQuizResult,
    setQuestionIgnored,
    setActiveQuiz,
    subscribeProgress,
    toggleQuestionStar
} from './progress.js?v=precalculus-7';

export function initPracticePanel(elems, onStatsUpdate) {
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let selectedOptionIndex = -1;
    let answerLog = [];
    let latestProgress = { starredQuestions: [], ignoredQuestions: [] };
    let currentMode = 'cumulative';
    let currentSessionLength = 'all';
    let currentAnswered = false;
    let startedAt = 0;

    elems.modeSelect.innerHTML = '<option value="cumulative">Complete practice set (numbered order)</option>';
    const starredOption = document.createElement('option');
    starredOption.value = 'starred';
    starredOption.innerText = 'Starred questions (0)';
    elems.modeSelect.appendChild(starredOption);
    const ignoredOption = document.createElement('option');
    ignoredOption.value = 'ignored';
    ignoredOption.innerText = 'Ignored questions (0)';
    ignoredOption.disabled = true;
    elems.modeSelect.appendChild(ignoredOption);
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
        bankNote.innerText = `Question bank: ${bankSize} practice questions across ${precalculusData.units.length} study units. The full set follows numbered order; Quick review is balanced and randomized.`;
    }

    elems.btnStart.addEventListener('click', () => startQuiz(elems.modeSelect.value, elems.lengthSelect?.value || 'all'));
    elems.btnResume?.addEventListener('click', resumeQuiz);
    elems.btnDiscard?.addEventListener('click', discardSavedQuiz);
    elems.btnSubmit.addEventListener('click', submitAnswer);
    elems.btnNext.addEventListener('click', nextQuestion);
    elems.btnStarQuestion?.addEventListener('click', toggleCurrentQuestionStar);
    elems.btnIgnoreQuestion?.addEventListener('click', toggleCurrentQuestionIgnore);
    elems.btnRetry.addEventListener('click', () => {
        elems.summaryPanel.style.display = 'none';
        elems.setupPanel.style.display = 'block';
    });
    subscribeProgress(progress => {
        latestProgress = progress;
        starredOption.innerText = `Starred questions (${progress.starredQuestions.length})`;
        ignoredOption.innerText = `Ignored questions (${progress.ignoredQuestions.length})`;
        ignoredOption.disabled = progress.ignoredQuestions.length === 0;
        if (bankNote) {
            const ignoredNote = progress.ignoredQuestions.length
                ? ` ${progress.ignoredQuestions.length} ignored question${progress.ignoredQuestions.length === 1 ? '' : 's'} will stay out of new sessions.`
                : '';
            bankNote.innerText = `Question bank: ${bankSize} practice questions across ${precalculusData.units.length} study units. The full set follows numbered order; Quick review is balanced and randomized.${ignoredNote}`;
        }
        if (elems.runnerPanel.style.display !== 'none') {
            updateQuestionStarButton();
            updateQuestionIgnoreButton();
        }
        renderResumePrompt(progress);
    });

    function renderResumePrompt(progress) {
        const session = progress.activeQuiz;
        if (!elems.resumeCard || !elems.resumeDetail || !elems.btnResume) return;
        const hasSession = Boolean(session?.questions?.length);
        elems.resumeCard.hidden = !hasSession;
        elems.btnResume.disabled = !hasSession;
        elems.btnStart.innerText = hasSession ? 'Start new practice' : 'Start practice';
        if (!hasSession) return;
        const modeLabel = session.mode === 'cumulative'
            ? 'Complete practice set'
            : session.mode === 'starred'
                ? 'Starred questions'
                : session.mode === 'ignored'
                    ? 'Ignored questions'
                : session.mode.replace(/^unit-/, 'Unit ');
        const answeredLabel = session.currentAnswered ? 'Answer saved' : 'Your current answer is waiting';
        elems.resumeDetail.innerText = `${modeLabel} · Question ${session.currentIndex + 1} of ${session.questions.length} · ${answeredLabel}`;
    }

    function discardSavedQuiz() {
        if (!latestProgress.activeQuiz) return;
        if (!confirm('Discard this unfinished quiz? Your completed quiz history will stay saved.')) return;
        clearActiveQuiz();
    }

    function startQuiz(mode, sessionLength) {
        if (latestProgress.activeQuiz && !confirm('Start a new quiz and replace your saved unfinished quiz?')) return;
        currentIndex = 0;
        score = 0;
        selectedOptionIndex = -1;
        answerLog = [];
        currentMode = mode;
        currentSessionLength = sessionLength;
        currentAnswered = false;
        startedAt = Date.now();
        const ignoredIds = new Set(latestProgress.ignoredQuestions);

        if (mode === 'cumulative') {
            currentQuestions = buildBalancedCumulativeSet(sessionLength === 'quick' ? 16 : null);
        } else if (mode === 'starred') {
            const starredIds = new Set(latestProgress.starredQuestions);
            const starredQuestions = allQuestions().filter(item => starredIds.has(item.id) && !ignoredIds.has(item.id));
            currentQuestions = shuffle(starredQuestions);
            if (sessionLength === 'quick') currentQuestions = currentQuestions.slice(0, 16);
        } else if (mode === 'ignored') {
            currentQuestions = shuffle(allQuestions().filter(item => ignoredIds.has(item.id)));
            if (sessionLength === 'quick') currentQuestions = currentQuestions.slice(0, 16);
        } else {
            const unit = precalculusData.units.find(candidate => candidate.id === mode);
            const unitQuestions = unit
                ? shuffle(unit.questions.filter(item => !ignoredIds.has(item.id))).map(item => ({ ...item, unitId: unit.id }))
                : [];
            currentQuestions = sessionLength === 'quick'
                ? unitQuestions.slice(0, 16)
                : unitQuestions;
        }

        currentQuestions = currentQuestions.map(randomizeAnswerOrder);

        if (currentQuestions.length === 0) {
            alert(mode === 'starred'
                ? 'No available questions are starred yet. Star a question during practice, or restore one from the ignored list.'
                : mode === 'ignored'
                    ? 'Your ignored list is empty. Use Ignore question during practice to put questions here.'
                    : 'No non-ignored questions are available for this selection yet.');
            return;
        }

        elems.setupPanel.style.display = 'none';
        elems.summaryPanel.style.display = 'none';
        elems.runnerPanel.style.display = 'block';
        saveQuizSession();
        loadQuestion();
    }

    function resumeQuiz() {
        const session = latestProgress.activeQuiz;
        if (!session?.questions?.length) return;

        const questionMap = new Map(allQuestions().map(question => [question.id, question]));
        const restoredQuestions = session.questions.map(savedQuestion => {
            const original = questionMap.get(savedQuestion.id);
            if (!original) return null;
            const optionOrder = savedQuestion.optionOrder;
            if (!Array.isArray(optionOrder) || optionOrder.length !== original.options.length) return null;
            return {
                ...original,
                options: optionOrder.map(index => original.options[index]),
                correctIndex: optionOrder.indexOf(original.correctIndex),
                optionOrder
            };
        });
        if (restoredQuestions.some(question => !question || question.correctIndex < 0)) {
            clearActiveQuiz();
            return;
        }

        const restoredById = new Map(restoredQuestions.map(question => [question.id, question]));
        currentQuestions = restoredQuestions;
        currentIndex = Math.min(session.currentIndex, currentQuestions.length - 1);
        score = session.score;
        selectedOptionIndex = session.selectedOptionIndex;
        currentMode = session.mode;
        currentSessionLength = session.sessionLength;
        startedAt = session.startedAt || Date.now();
        answerLog = session.answerLog
            .map(answer => ({ question: restoredById.get(answer.questionId), isCorrect: answer.isCorrect }))
            .filter(answer => answer.question);
        currentAnswered = Boolean(session.currentAnswered);

        elems.setupPanel.style.display = 'none';
        elems.summaryPanel.style.display = 'none';
        elems.runnerPanel.style.display = 'block';
        loadQuestion({ restore: true });
    }

    function allQuestions() {
        return precalculusData.units.flatMap(unit => unit.questions.map(item => ({ ...item, unitId: unit.id })));
    }

    function buildBalancedCumulativeSet(limit = null) {
        const available = availableQuestions();
        if (!limit) {
            return available.sort((a, b) => sourceNumber(a) - sourceNumber(b));
        }
        const availableByUnit = precalculusData.units.map(unit => ({
            unit,
            questions: available.filter(item => item.unitId === unit.id)
        })).filter(group => group.questions.length);
        const firstQuestionFromEachUnit = availableByUnit.map(group => {
            const item = shuffle(group.questions)[0];
            return item ? { ...item, unitId: group.unit.id } : null;
        }).filter(Boolean);
        const selectedIds = new Set(firstQuestionFromEachUnit.map(item => item.id));
        const remaining = availableByUnit.flatMap(group => shuffle(group.questions)
            .filter(item => !selectedIds.has(item.id))
            .map(item => ({ ...item, unitId: group.unit.id })));
        const balancedQuestions = shuffle([...firstQuestionFromEachUnit, ...remaining]);
        return limit ? balancedQuestions.slice(0, Math.min(limit, balancedQuestions.length)) : balancedQuestions;
    }

    function availableQuestions() {
        const ignoredIds = new Set(latestProgress.ignoredQuestions);
        return allQuestions().filter(item => !ignoredIds.has(item.id));
    }

    function sourceNumber(question) {
        return Number(question.source?.match(/#(\d+)/)?.[1] || Number.MAX_SAFE_INTEGER);
    }

    function saveQuizSession() {
        if (!currentQuestions.length) return;
        setActiveQuiz({
            mode: currentMode,
            sessionLength: currentSessionLength,
            questions: currentQuestions.map(question => ({
                id: question.id,
                optionOrder: question.optionOrder || question.options.map((_, index) => index)
            })),
            currentIndex,
            score,
            selectedOptionIndex,
            answerLog: answerLog.map(answer => ({
                questionId: answer.question.id,
                isCorrect: answer.isCorrect
            })),
            currentAnswered,
            startedAt
        });
    }

    function randomizeAnswerOrder(question) {
        const choices = shuffle(question.options.map((text, index) => ({
            text,
            originalIndex: index,
            correct: index === question.correctIndex
        })));
        return {
            ...question,
            options: choices.map(choice => choice.text),
            correctIndex: choices.findIndex(choice => choice.correct),
            optionOrder: choices.map(choice => choice.originalIndex)
        };
    }

    function loadQuestion({ restore = false } = {}) {
        const currentQuestion = currentQuestions[currentIndex];
        if (!restore) {
            selectedOptionIndex = -1;
            currentAnswered = false;
        }
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
        updateQuestionIgnoreButton();

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
        elems.btnSubmit.disabled = selectedOptionIndex < 0;
        elems.btnNext.style.display = 'none';
        renderMath(elems.runnerPanel);

        if (selectedOptionIndex >= 0) applySelectedOption();
        if (currentAnswered) {
            const answer = answerLog.find(item => item.question.id === currentQuestion.id);
            showAnswerFeedback(answer?.isCorrect ?? selectedOptionIndex === currentQuestion.correctIndex);
        }
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

    function updateQuestionIgnoreButton() {
        const currentQuestion = currentQuestions[currentIndex];
        if (!elems.btnIgnoreQuestion || !currentQuestion) return;
        const ignored = isQuestionIgnored(currentQuestion.id);
        elems.btnIgnoreQuestion.classList.toggle('active', ignored);
        elems.btnIgnoreQuestion.setAttribute('aria-pressed', String(ignored));
        elems.btnIgnoreQuestion.setAttribute('aria-label', ignored ? 'Restore this question from the ignored list' : 'Ignore this question');
        elems.btnIgnoreQuestion.title = ignored ? 'Restore this question from the ignored list' : 'Ignore this question and move on';
        elems.btnIgnoreQuestion.disabled = currentAnswered;
        const label = elems.btnIgnoreQuestion.querySelector('.question-ignore-label');
        if (label) label.textContent = ignored ? 'Restore question' : 'Ignore question';
    }

    function toggleCurrentQuestionIgnore() {
        const currentQuestion = currentQuestions[currentIndex];
        if (!currentQuestion || currentAnswered) return;
        setQuestionIgnored(currentQuestion.id, !isQuestionIgnored(currentQuestion.id));
        skipCurrentQuestion();
    }

    function skipCurrentQuestion() {
        if (!currentQuestions.length) return;
        currentQuestions.splice(currentIndex, 1);
        selectedOptionIndex = -1;
        currentAnswered = false;
        if (!currentQuestions.length) {
            finishQuiz();
            return;
        }
        currentIndex = Math.min(currentIndex, currentQuestions.length - 1);
        saveQuizSession();
        loadQuestion();
    }

    function selectOption(index) {
        selectedOptionIndex = index;
        applySelectedOption();
        elems.btnSubmit.disabled = false;
        saveQuizSession();
    }

    function applySelectedOption() {
        elems.optionsContainer.querySelectorAll('.option-btn').forEach((button, buttonIndex) => {
            button.classList.toggle('selected', buttonIndex === selectedOptionIndex);
        });
    }

    function submitAnswer() {
        const currentQuestion = currentQuestions[currentIndex];
        if (currentAnswered || selectedOptionIndex < 0) return;
        const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
        if (isCorrect) score += 1;
        answerLog.push({ question: currentQuestion, isCorrect });
        currentAnswered = true;

        showAnswerFeedback(isCorrect);
        saveQuizSession();
    }

    function showAnswerFeedback(isCorrect) {
        const currentQuestion = currentQuestions[currentIndex];
        const buttons = elems.optionsContainer.querySelectorAll('.option-btn');

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
        updateQuestionIgnoreButton();
    }

    function nextQuestion() {
        if (currentIndex < currentQuestions.length - 1) {
            currentIndex += 1;
            selectedOptionIndex = -1;
            currentAnswered = false;
            saveQuizSession();
            loadQuestion();
        } else {
            finishQuiz();
        }
    }

    function finishQuiz() {
        elems.runnerPanel.style.display = 'none';
        elems.summaryPanel.style.display = 'block';
        const total = currentQuestions.length;
        const accuracy = total ? Math.round((score / total) * 100) : 0;
        const xp = score * 10;
        elems.summaryScore.innerText = `${score}/${total}`;
        elems.summaryPercent.innerText = total ? `${accuracy}% accuracy` : 'No questions answered';
        elems.summaryXp.innerText = xp;
        saveDiagnosticsData(score, total, xp);
        clearActiveQuiz();
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
        markLongInlineMath(container);
    }

    function markLongInlineMath(container) {
        container.querySelectorAll('.katex').forEach(math => {
            if (math.closest('.katex-display') || math.closest('.memory-anchor')) return;
            const source = math.querySelector('annotation[encoding="application/x-tex"]')?.textContent || '';
            if (source.length >= 56) {
                math.classList.add('katex-long-inline');
            }
        });
    }
}
