// Main Application Controller Module
import { precalculusData } from './data.js?v=precalculus-6';
import { initReviewPanel } from './review.js?v=precalculus-6';
import { initPracticePanel } from './practice.js?v=precalculus-6';
import {
    getProgressState,
    getStats,
    initProgressSync,
    parseLessonKey,
    resetProgress,
    setLessonStarred,
    signInWithGoogle,
    signOutProgress,
    subscribeProgress,
    subscribeSyncState
} from './progress.js?v=precalculus-6';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation / Routing DOM Elements
    const menuItems = document.querySelectorAll('.menu-item');
    const screens = document.querySelectorAll('.screen-content');
    const screenTitle = document.getElementById('screen-title');

    // 2. Dashboard DOM Elements
    const userXpText = document.getElementById('user-xp');
    const globalProgressCircle = document.getElementById('global-progress-circle');
    const globalProgressPercent = document.getElementById('global-progress-percent');
    const globalAccuracy = document.getElementById('global-accuracy');
    const globalAccuracyLabel = document.getElementById('global-accuracy-label');
    const strongestTopicText = document.getElementById('strongest-topic');
    const weakestTopicText = document.getElementById('weakest-topic');
    const unitGrid = document.getElementById('unit-grid');
    const starredLessonsGrid = document.getElementById('starred-lessons-grid');
    const starredLessonsCount = document.getElementById('starred-lessons-count');

    // Account / sync DOM Elements
    const accountButton = document.getElementById('account-button');
    const accountAvatar = document.getElementById('account-avatar');
    const accountName = document.getElementById('account-name');
    const accountSyncLabel = document.getElementById('account-sync-label');
    const syncStatus = document.getElementById('sync-status');
    const syncStatusTitle = document.getElementById('sync-status-title');
    const syncStatusDetail = document.getElementById('sync-status-detail');

    // 3. Review DOM Elements
    const reviewUnitSelect = document.getElementById('review-unit-select');
    const reviewLessonSelect = document.getElementById('review-lesson-select');
    const unitOverviewContainer = document.getElementById('unit-overview-container');
    const lessonMapContainer = document.getElementById('lesson-map-container');
    const lessonContentContainer = document.getElementById('lesson-content-container');
    const sandboxCanvas = document.getElementById('sandbox-canvas');
    const sandboxControlsContainer = document.getElementById('sandbox-controls-container');
    const sandboxBadge = document.getElementById('sandbox-badge');
    const sandboxIntro = document.getElementById('sandbox-intro');
    const lessonProgress = document.getElementById('lesson-progress-text');
    const previousLessonButton = document.getElementById('btn-previous-lesson');
    const nextLessonButton = document.getElementById('btn-next-lesson');
    const lessonLevelBadge = document.getElementById('lesson-level-badge');

    // 4. Practice DOM Elements
    const practiceElems = {
        setupPanel: document.getElementById('quiz-setup-panel'),
        runnerPanel: document.getElementById('quiz-runner-panel'),
        summaryPanel: document.getElementById('quiz-summary-panel'),
        modeSelect: document.getElementById('quiz-mode-select'),
        lengthSelect: document.getElementById('quiz-length-select'),
        btnStart: document.getElementById('btn-start-quiz'),
        resumeCard: document.getElementById('quiz-resume-card'),
        resumeDetail: document.getElementById('quiz-resume-detail'),
        btnResume: document.getElementById('btn-resume-quiz'),
        btnDiscard: document.getElementById('btn-discard-quiz'),
        progressText: document.getElementById('quiz-progress-text'),
        progressFill: document.getElementById('quiz-progress-fill'),
        questionTopic: document.getElementById('question-topic-label'),
        questionDifficulty: document.getElementById('question-difficulty-label'),
        questionSource: document.getElementById('question-source-label'),
        btnStarQuestion: document.getElementById('btn-star-question'),
        questionText: document.getElementById('question-text-content'),
        optionsContainer: document.getElementById('question-options-container'),
        btnSubmit: document.getElementById('btn-submit-answer'),
        btnNext: document.getElementById('btn-next-question'),
        explanationBox: document.getElementById('question-explanation-box'),
        feedbackHeading: document.getElementById('question-feedback-heading'),
        explanationContent: document.getElementById('question-explanation-content'),
        summaryScore: document.getElementById('summary-score-display'),
        summaryPercent: document.getElementById('summary-percent-display'),
        summaryXp: document.getElementById('summary-xp-display'),
        btnRetry: document.getElementById('btn-quiz-retry'),
        btnReview: document.getElementById('btn-quiz-goto-review')
    };

    // 5. Diagnostics DOM Elements
    const diagQuizzes = document.getElementById('diag-quizzes-count');
    const diagQuestions = document.getElementById('diag-questions-count');
    const diagCorrect = document.getElementById('diag-correct-count');
    const diagXp = document.getElementById('diag-xp-count');
    const topicDiagList = document.getElementById('topic-diagnostics-list');
    const btnResetData = document.getElementById('btn-reset-data');
    let reviewController = null;
    let latestSyncState = null;
    let accountActionBusy = false;

    // --- CLIENT-SIDE ROUTER ---
    menuItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            routeTo(targetId);
        });
    });

    function routeTo(targetId) {
        // Toggle menu class
        menuItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Toggle screens
        screens.forEach(screen => {
            if (screen.id === targetId) {
                screen.classList.add('active');
            } else {
                screen.classList.remove('active');
            }
        });

        // Update header title
        let title = 'Dashboard';
        if (targetId === 'review-screen') title = 'Guided Notes & Interactive Practice';
        if (targetId === 'practice-screen') title = 'Practice Quiz';
        if (targetId === 'profile-screen') title = 'Your Progress';
        screenTitle.innerText = title;

        // Reset quiz setup if leaving practice screen
        if (targetId !== 'practice-screen') {
            practiceElems.runnerPanel.style.display = 'none';
            practiceElems.summaryPanel.style.display = 'none';
            practiceElems.setupPanel.style.display = 'block';
        }
    }

    // Direct quiz review button route
    practiceElems.btnReview.addEventListener('click', () => {
        routeTo('review-screen');
    });

    // --- STATS & PERSISTENCE SYNC ---
    function syncStats() {
        const stats = getStats();
        stats.topicPoints = stats.topicPoints || {};

        // 1. Update XP Header Pill
        userXpText.innerText = stats.totalXP;

        // 2. Global Progress Ring
        // Calculate average completion based on completed units
        let totalMasteryPctSum = 0;
        precalculusData.units.forEach(unit => {
            const mastery = getTopicMastery(stats, unit.id);
            totalMasteryPctSum += mastery;
        });
        const globalProgress = Math.round(totalMasteryPctSum / precalculusData.units.length);

        globalProgressPercent.innerText = `${globalProgress}%`;
        const radius = 50;
        const circumference = 2 * Math.PI * radius; // ~314.16
        const offset = circumference - (globalProgress / 100) * circumference;
        globalProgressCircle.style.strokeDashoffset = offset;

        // 3. Accuracy Panel
        if (stats.questionsAnswered > 0) {
            const acc = Math.round((stats.correctAnswers / stats.questionsAnswered) * 100);
            globalAccuracy.innerText = `${acc}%`;
            globalAccuracyLabel.innerText = `Based on ${stats.questionsAnswered} practice questions`;
        } else {
            globalAccuracy.innerText = '-';
            globalAccuracyLabel.innerText = 'No quizzes taken yet';
        }

        // 4. Topic Insights (Strongest / Weakest)
        let maxPct = -1;
        let minPct = 101;
        let strongest = 'None';
        let weakest = 'None';

        precalculusData.units.forEach(unit => {
            const pct = getTopicMastery(stats, unit.id);
            if (pct > maxPct && pct > 0) {
                maxPct = pct;
                strongest = unit.title;
            }
            if (pct < minPct && stats.topicPoints[unit.id]) {
                minPct = pct;
                weakest = unit.title;
            }
        });

        strongestTopicText.innerText = strongest === 'None' ? 'No practice yet' : strongest;
        weakestTopicText.innerText = weakest === 'None' ? 'No practice yet' : weakest;

        // 5. Populate Dashboard Unit Cards Grid
        unitGrid.innerHTML = '';
        precalculusData.units.forEach(unit => {
            const pct = getTopicMastery(stats, unit.id);
            
            const card = document.createElement('div');
            card.className = 'unit-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Open guided notes for ${unit.title}`);
            card.innerHTML = `
                <div class="unit-card-info">
                    <span class="unit-badge">${unit.id.toUpperCase().replace('-', ' ')}</span>
                    <h4>${unit.title}</h4>
                    <p>${unit.subtitle}</p>
                    <div class="unit-curriculum-meta">
                        <span>${unit.curriculumUnit || 'Course topic'}</span>
                        <span class="${unit.curriculumLevel?.toLowerCase().includes('honors') ? 'honors' : ''}">${unit.curriculumLevel || 'Core'}</span>
                    </div>
                </div>
                <div class="progress-ring-container">
                    <svg width="60" height="60">
                        <circle stroke="rgba(255,255,255,0.05)" stroke-width="4" fill="transparent" r="22" cx="30" cy="30"/>
                        <circle stroke="url(#accent-gradient)" stroke-width="4" stroke-dasharray="138.23" stroke-dashoffset="${138.23 - (pct / 100) * 138.23}" fill="transparent" r="22" cx="30" cy="30" class="progress-ring-bar"/>
                    </svg>
                    <div class="progress-ring-text" style="font-size: 11px;">${pct}%</div>
                </div>
            `;
            // Navigation click event
            const openUnit = () => {
                routeTo('review-screen');
                reviewUnitSelect.value = unit.id;
                reviewUnitSelect.dispatchEvent(new Event('change'));
            };
            card.addEventListener('click', openUnit);
            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openUnit();
                }
            });
            unitGrid.appendChild(card);
        });

        // 6. Diagnostics Tab Data
        diagQuizzes.innerText = stats.quizzesCompleted;
        diagQuestions.innerText = stats.questionsAnswered;
        diagCorrect.innerText = stats.correctAnswers;
        diagXp.innerText = stats.totalXP;

        // 7. Diagnostics Topic Masteries list
        topicDiagList.innerHTML = '';
        precalculusData.units.forEach(unit => {
            const pct = getTopicMastery(stats, unit.id);
            const row = document.createElement('div');
            row.className = 'diag-topic-progress';
            row.innerHTML = `
                <div class="diag-topic-header">
                    <span class="diag-topic-name">${unit.title}</span>
                    <span class="diag-topic-percent">${pct}% Mastery</span>
                </div>
                <div class="progress-bar-bg" style="height: 6px;">
                    <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                </div>
            `;
            topicDiagList.appendChild(row);
        });

        renderStarredLessons(getProgressState());
    }

    // Helper to calculate topic percentage based on correct logs
    function getTopicMastery(stats, unitId) {
        if (!stats.topicPoints || !stats.topicPoints[unitId] || stats.topicPoints[unitId].total === 0) {
            return 0;
        }
        const data = stats.topicPoints[unitId];
        return Math.round((data.correct / data.total) * 100);
    }

    function renderStarredLessons(progress) {
        if (!starredLessonsGrid || !starredLessonsCount) return;
        const lessons = progress.starredLessons.map(key => {
            const location = parseLessonKey(key);
            const unit = location && precalculusData.units.find(candidate => candidate.id === location.unitId);
            const lesson = unit && unit.lessons[location.lessonIndex];
            return location && unit && lesson ? { key, location, unit, lesson } : null;
        }).filter(Boolean);

        starredLessonsCount.innerText = `${lessons.length} ${lessons.length === 1 ? 'lesson' : 'lessons'}`;
        starredLessonsGrid.innerHTML = '';

        if (lessons.length === 0) {
            starredLessonsGrid.innerHTML = `
                <div class="starred-empty-state">
                    <span class="starred-empty-icon" aria-hidden="true">☆</span>
                    <div>
                        <strong>No lessons starred yet</strong>
                        <p>Open a guided lesson and choose “Star lesson” to keep it here for review.</p>
                    </div>
                </div>
            `;
            return;
        }

        lessons.forEach(({ location, unit, lesson }) => {
            const card = document.createElement('article');
            card.className = 'starred-lesson-card';
            card.innerHTML = `
                <button type="button" class="starred-lesson-open">
                    <span class="starred-lesson-meta">${unit.id.replace('unit-', 'Unit ')} · Lesson ${location.lessonIndex + 1}</span>
                    <strong>${lesson.title.replace(/^\d+\.\s*/, '')}</strong>
                    <span class="starred-lesson-action">Review lesson <span aria-hidden="true">→</span></span>
                </button>
                <button type="button" class="starred-lesson-remove" aria-label="Remove ${lesson.title.replace(/^\d+\.\s*/, '')} from starred lessons" title="Remove from review">×</button>
            `;

            card.querySelector('.starred-lesson-open').addEventListener('click', () => {
                routeTo('review-screen');
                reviewController?.openLesson(location.unitId, location.lessonIndex);
            });
            card.querySelector('.starred-lesson-remove').addEventListener('click', () => {
                setLessonStarred(location.unitId, location.lessonIndex, false);
            });
            starredLessonsGrid.appendChild(card);
        });
    }

    function renderSyncState(state) {
        latestSyncState = state;
        const signedIn = Boolean(state.user);
        const isStarting = state.status === 'starting';

        syncStatus.dataset.status = state.status;
        syncStatusTitle.innerText = signedIn ? 'Cloud sync on' : 'Saved on this device';
        syncStatusDetail.innerText = state.message;

        accountButton.disabled = accountActionBusy || isStarting || (state.status === 'error' && !signedIn);
        accountButton.dataset.signedIn = String(signedIn);
        accountName.innerText = signedIn ? state.user.displayName : 'Sign in with Google';
        accountSyncLabel.innerText = signedIn ? state.message : 'Sync phone, PC, and more';
        accountButton.title = signedIn ? `Signed in as ${state.user.email}. Click to sign out.` : 'Sign in to sync progress across devices';

        if (signedIn && state.user.photoURL) {
            accountAvatar.style.backgroundImage = `url("${state.user.photoURL}")`;
            accountAvatar.innerText = '';
        } else {
            accountAvatar.style.backgroundImage = '';
            accountAvatar.innerText = signedIn
                ? (state.user.displayName || state.user.email || 'A').charAt(0).toUpperCase()
                : 'G';
        }
    }

    accountButton.addEventListener('click', async () => {
        if (accountActionBusy || !latestSyncState) return;
        const signedIn = Boolean(latestSyncState.user);
        if (signedIn && !confirm('Sign out of cloud sync on this device? Your cloud progress will not be deleted.')) return;

        accountActionBusy = true;
        renderSyncState(latestSyncState);
        try {
            if (signedIn) await signOutProgress();
            else await signInWithGoogle();
        } catch (error) {
            if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
                alert('Google sign-in could not be completed. Your progress is still saved on this device.');
            }
        } finally {
            accountActionBusy = false;
            if (latestSyncState) renderSyncState(latestSyncState);
        }
    });

    // Reset Data Event
    btnResetData.addEventListener('click', async () => {
        if (confirm('Delete all quiz scores, XP, lesson history, unfinished quiz, and starred lessons and questions from this device and your synced account? This action is permanent.')) {
            await resetProgress();
            alert('Your Precalculus progress has been cleared.');
        }
    });

    // --- MODULE INITIALIZATIONS ---

    // 1. Initialize Review / Lesson Engine
    reviewController = initReviewPanel({
        unitSelect: reviewUnitSelect,
        lessonSelect: reviewLessonSelect,
        overviewContainer: unitOverviewContainer,
        lessonMapContainer,
        contentContainer: lessonContentContainer,
        canvas: sandboxCanvas,
        controlsContainer: sandboxControlsContainer,
        badge: sandboxBadge,
        sandboxIntro,
        lessonProgress,
        previousButton: previousLessonButton,
        nextButton: nextLessonButton,
        lessonLevelBadge
    });

    // 2. Initialize Quiz Engine
    initPracticePanel(practiceElems, syncStats);

    // 3. Keep the coverage summary tied to the data file.
    const courseUnitCount = document.getElementById('course-unit-count');
    const courseLessonCount = document.getElementById('course-lesson-count');
    const courseQuestionCount = document.getElementById('course-question-count');
    if (courseUnitCount) courseUnitCount.innerText = precalculusData.units.length;
    if (courseLessonCount) courseLessonCount.innerText = precalculusData.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
    if (courseQuestionCount) courseQuestionCount.innerText = precalculusData.units.reduce((sum, unit) => sum + unit.questions.length, 0);

    // 4. Keep local and cloud-backed UI in sync.
    subscribeProgress(syncStats);
    subscribeSyncState(renderSyncState);
    void initProgressSync();
});
