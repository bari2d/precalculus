// Local-first progress tracking for the standalone Precalculus review site.

const STORAGE_KEY = 'precalculus_final_progress_v1';
const STATE_VERSION = 1;

export const DEFAULT_STATS = Object.freeze({
    quizzesCompleted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    totalXP: 0,
    topicPoints: {}
});

function defaultStats() {
    return { quizzesCompleted: 0, questionsAnswered: 0, correctAnswers: 0, totalXP: 0, topicPoints: {} };
}

export function createDefaultProgressState() {
    return {
        version: STATE_VERSION,
        stats: defaultStats(),
        starredLessons: [],
        starredQuestions: [],
        lessonHistory: {},
        lastLesson: null,
        clientUpdatedAt: 0
    };
}

function nonNegativeInteger(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function normalizeStats(value) {
    const raw = value && typeof value === 'object' ? value : {};
    const topicPoints = {};
    Object.entries(raw.topicPoints || {}).forEach(([unitId, points]) => {
        const total = nonNegativeInteger(points?.total);
        const correct = Math.min(nonNegativeInteger(points?.correct), total);
        if (total) topicPoints[unitId] = { correct, total };
    });
    const questionsAnswered = nonNegativeInteger(raw.questionsAnswered);
    return {
        quizzesCompleted: nonNegativeInteger(raw.quizzesCompleted),
        questionsAnswered,
        correctAnswers: Math.min(nonNegativeInteger(raw.correctAnswers), questionsAnswered),
        totalXP: nonNegativeInteger(raw.totalXP),
        topicPoints
    };
}

export function getLessonKey(unitId, lessonIndex) {
    return `${unitId}:${Number(lessonIndex)}`;
}

export function parseLessonKey(key) {
    const match = /^(unit-\d+):(\d+)$/.exec(String(key));
    return match ? { unitId: match[1], lessonIndex: Number(match[2]) } : null;
}

export function normalizeQuestionId(id) {
    const value = String(id);
    return /^q\d+_\d+$/.test(value) ? value : null;
}

export function normalizeProgressState(value) {
    const raw = value && typeof value === 'object' ? value : {};
    const starredLessons = Array.isArray(raw.starredLessons)
        ? [...new Set(raw.starredLessons.filter(parseLessonKey))]
        : [];
    const starredQuestions = Array.isArray(raw.starredQuestions)
        ? [...new Set(raw.starredQuestions.filter(normalizeQuestionId))]
        : [];
    const lessonHistory = {};
    Object.entries(raw.lessonHistory || {}).forEach(([key, timestamp]) => {
        const time = Number(timestamp);
        if (parseLessonKey(key) && Number.isFinite(time) && time > 0) lessonHistory[key] = time;
    });
    const lastLesson = raw.lastLesson && parseLessonKey(getLessonKey(raw.lastLesson.unitId, raw.lastLesson.lessonIndex))
        ? {
            unitId: raw.lastLesson.unitId,
            lessonIndex: Number(raw.lastLesson.lessonIndex),
            viewedAt: Number(raw.lastLesson.viewedAt) || 0
        }
        : null;
    return {
        version: STATE_VERSION,
        stats: normalizeStats(raw.stats),
        starredLessons,
        starredQuestions,
        lessonHistory,
        lastLesson,
        clientUpdatedAt: Number(raw.clientUpdatedAt) || 0
    };
}

function readState() {
    if (typeof window === 'undefined') return createDefaultProgressState();
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved ? normalizeProgressState(JSON.parse(saved)) : createDefaultProgressState();
    } catch (error) {
        console.warn('Could not read saved Precalculus progress.', error);
        return createDefaultProgressState();
    }
}

let state = readState();
const progressListeners = new Set();
const syncListeners = new Set();
const syncState = {
    status: 'local',
    message: 'Progress stays on this device',
    user: null,
    error: null
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function persist() {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('Could not save Precalculus progress.', error);
    }
}

function commit(mutator) {
    const next = clone(state);
    mutator(next);
    next.clientUpdatedAt = Date.now();
    state = normalizeProgressState(next);
    persist();
    const snapshot = getProgressState();
    progressListeners.forEach(listener => listener(snapshot));
}

export function initProgressSync() {
    const snapshot = getSyncState();
    syncListeners.forEach(listener => listener(snapshot));
    return Promise.resolve(snapshot);
}

export function getProgressState() {
    return clone(state);
}

export function getStats() {
    return clone(state.stats);
}

export function getSyncState() {
    return { ...syncState };
}

export function subscribeProgress(listener) {
    progressListeners.add(listener);
    listener(getProgressState());
    return () => progressListeners.delete(listener);
}

export function subscribeSyncState(listener) {
    syncListeners.add(listener);
    listener(getSyncState());
    return () => syncListeners.delete(listener);
}

export function isLessonStarred(unitId, lessonIndex) {
    return state.starredLessons.includes(getLessonKey(unitId, lessonIndex));
}

export function setLessonStarred(unitId, lessonIndex, starred) {
    const key = getLessonKey(unitId, lessonIndex);
    commit(draft => {
        const values = new Set(draft.starredLessons);
        if (starred) values.add(key);
        else values.delete(key);
        draft.starredLessons = [...values];
    });
    return starred;
}

export function toggleLessonStar(unitId, lessonIndex) {
    return setLessonStarred(unitId, lessonIndex, !isLessonStarred(unitId, lessonIndex));
}

export function isQuestionStarred(questionId) {
    return state.starredQuestions.includes(String(questionId));
}

export function setQuestionStarred(questionId, starred) {
    const id = normalizeQuestionId(questionId);
    if (!id) return false;
    commit(draft => {
        const values = new Set(draft.starredQuestions);
        if (starred) values.add(id);
        else values.delete(id);
        draft.starredQuestions = [...values];
    });
    return starred;
}

export function toggleQuestionStar(questionId) {
    return setQuestionStarred(questionId, !isQuestionStarred(questionId));
}

export function markLessonViewed(unitId, lessonIndex) {
    const key = getLessonKey(unitId, lessonIndex);
    const now = Date.now();
    if (now - (state.lessonHistory[key] || 0) < 10000) return;
    commit(draft => {
        draft.lessonHistory[key] = now;
        draft.lastLesson = { unitId, lessonIndex: Number(lessonIndex), viewedAt: now };
    });
}

export function recordQuizResult({ score, total, xp, answers = [] }) {
    const quizTotal = nonNegativeInteger(total);
    if (!quizTotal) return;
    commit(draft => {
        const stats = normalizeStats(draft.stats);
        stats.quizzesCompleted += 1;
        stats.questionsAnswered += quizTotal;
        stats.correctAnswers += Math.min(nonNegativeInteger(score), quizTotal);
        stats.totalXP += nonNegativeInteger(xp);
        answers.forEach(answer => {
            if (!answer?.unitId) return;
            if (!stats.topicPoints[answer.unitId]) stats.topicPoints[answer.unitId] = { correct: 0, total: 0 };
            stats.topicPoints[answer.unitId].total += 1;
            if (answer.isCorrect) stats.topicPoints[answer.unitId].correct += 1;
        });
        draft.stats = stats;
    });
}

export async function signInWithGoogle() {
    throw new Error('Cloud sync is not configured for this standalone site.');
}

export async function signOutProgress() {
    return undefined;
}

export async function resetProgress() {
    state = createDefaultProgressState();
    persist();
    const snapshot = getProgressState();
    progressListeners.forEach(listener => listener(snapshot));
}
