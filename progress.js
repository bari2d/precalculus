// Local-first learning progress with Algebra 2-compatible Firebase account sync.

const FIREBASE_VERSION = '12.15.0';
const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyB3JSMeZhd33MVcWtME9h6_QXQ48I4M59c',
    authDomain: 'algebra-2-progress.firebaseapp.com',
    projectId: 'algebra-2-progress',
    storageBucket: 'algebra-2-progress.firebasestorage.app',
    messagingSenderId: '439350981432',
    appId: '1:439350981432:web:5b8fbc3c9aefafdf1f87cd'
};

const GUEST_STORAGE_KEY = 'precalculus_final_progress_v1';
const LEGACY_STATS_KEY = 'precalculus_stats';
const LEGACY_MIGRATED_KEY = 'precalculus_legacy_stats_migrated';
const USER_STORAGE_PREFIX = 'precalculus_progress_user_';
const USER_MIGRATION_PREFIX = 'precalculus_progress_migrated_';
const STATE_VERSION = 2;

export const DEFAULT_STATS = Object.freeze({
    quizzesCompleted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    totalXP: 0,
    topicPoints: {}
});

function createDefaultStats() {
    return {
        quizzesCompleted: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        totalXP: 0,
        topicPoints: {}
    };
}

export function createDefaultProgressState() {
    return {
        version: STATE_VERSION,
        stats: createDefaultStats(),
        starredLessons: [],
        starredQuestions: [],
        lessonHistory: {},
        lastLesson: null,
        activeQuiz: null,
        clientUpdatedAt: 0
    };
}

function nonNegativeInteger(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function normalizeStats(rawStats) {
    const raw = rawStats && typeof rawStats === 'object' ? rawStats : {};
    const topicPoints = {};

    if (raw.topicPoints && typeof raw.topicPoints === 'object') {
        Object.entries(raw.topicPoints).forEach(([unitId, points]) => {
            if (!points || typeof points !== 'object') return;
            const total = nonNegativeInteger(points.total);
            const correct = Math.min(nonNegativeInteger(points.correct), total);
            if (total > 0) topicPoints[unitId] = { correct, total };
        });
    }

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
    if (!match) return null;
    return { unitId: match[1], lessonIndex: Number(match[2]) };
}

export function normalizeQuestionId(id) {
    const value = String(id);
    return /^q\d+_\d+$/.test(value) ? value : null;
}

function normalizeQuizSession(rawSession) {
    if (!rawSession || typeof rawSession !== 'object') return null;
    const questions = Array.isArray(rawSession.questions)
        ? rawSession.questions.map(item => {
            if (!item || !normalizeQuestionId(item.id) || !Array.isArray(item.optionOrder)) return null;
            const optionOrder = [...new Set(item.optionOrder
                .map(value => Number(value))
                .filter(value => Number.isInteger(value) && value >= 0 && value < 4))];
            return optionOrder.length === 4 ? { id: String(item.id), optionOrder } : null;
        }).filter(Boolean)
        : [];
    if (!questions.length) return null;

    const answerLog = Array.isArray(rawSession.answerLog)
        ? rawSession.answerLog.map(item => normalizeQuestionId(item?.questionId)
            ? { questionId: String(item.questionId), isCorrect: Boolean(item.isCorrect) }
            : null).filter(Boolean)
        : [];
    const currentIndex = Math.min(Math.max(Number(rawSession.currentIndex) || 0, 0), questions.length - 1);
    const selectedOptionIndex = Number(rawSession.selectedOptionIndex);
    return {
        version: 1,
        mode: typeof rawSession.mode === 'string' ? rawSession.mode : 'cumulative',
        sessionLength: rawSession.sessionLength === 'quick' ? 'quick' : 'all',
        questions,
        currentIndex,
        score: Math.min(Math.max(Number(rawSession.score) || 0, 0), answerLog.length),
        selectedOptionIndex: Number.isInteger(selectedOptionIndex) && selectedOptionIndex >= 0 && selectedOptionIndex < 4
            ? selectedOptionIndex
            : -1,
        answerLog,
        currentAnswered: Boolean(rawSession.currentAnswered),
        startedAt: Number(rawSession.startedAt) || 0,
        updatedAt: Number(rawSession.updatedAt) || 0
    };
}

export function normalizeProgressState(rawState) {
    const raw = rawState && typeof rawState === 'object' ? rawState : {};
    const starredLessons = Array.isArray(raw.starredLessons)
        ? [...new Set(raw.starredLessons.filter(key => parseLessonKey(key)))]
        : [];
    const starredQuestions = Array.isArray(raw.starredQuestions)
        ? [...new Set(raw.starredQuestions.filter(id => normalizeQuestionId(id)))]
        : [];
    const lessonHistory = {};

    if (raw.lessonHistory && typeof raw.lessonHistory === 'object') {
        Object.entries(raw.lessonHistory).forEach(([key, timestamp]) => {
            const time = Number(timestamp);
            if (parseLessonKey(key) && Number.isFinite(time) && time > 0) lessonHistory[key] = time;
        });
    }

    let lastLesson = null;
    if (raw.lastLesson && parseLessonKey(getLessonKey(raw.lastLesson.unitId, raw.lastLesson.lessonIndex))) {
        lastLesson = {
            unitId: raw.lastLesson.unitId,
            lessonIndex: Number(raw.lastLesson.lessonIndex),
            viewedAt: Number(raw.lastLesson.viewedAt) || 0
        };
    }

    return {
        version: STATE_VERSION,
        stats: normalizeStats(raw.stats || raw),
        starredLessons,
        starredQuestions,
        lessonHistory,
        lastLesson,
        activeQuiz: normalizeQuizSession(raw.activeQuiz),
        clientUpdatedAt: Number(raw.clientUpdatedAt) || 0
    };
}

function mergeStats(firstStats, secondStats) {
    const first = normalizeStats(firstStats);
    const second = normalizeStats(secondStats);
    const topicPoints = {};
    const unitIds = new Set([...Object.keys(first.topicPoints), ...Object.keys(second.topicPoints)]);

    unitIds.forEach(unitId => {
        const firstPoints = first.topicPoints[unitId] || { correct: 0, total: 0 };
        const secondPoints = second.topicPoints[unitId] || { correct: 0, total: 0 };
        const total = Math.max(firstPoints.total, secondPoints.total);
        topicPoints[unitId] = {
            correct: Math.min(Math.max(firstPoints.correct, secondPoints.correct), total),
            total
        };
    });

    const questionsAnswered = Math.max(first.questionsAnswered, second.questionsAnswered);
    return {
        quizzesCompleted: Math.max(first.quizzesCompleted, second.quizzesCompleted),
        questionsAnswered,
        correctAnswers: Math.min(Math.max(first.correctAnswers, second.correctAnswers), questionsAnswered),
        totalXP: Math.max(first.totalXP, second.totalXP),
        topicPoints
    };
}

export function mergeProgressStates(firstState, secondState) {
    const first = normalizeProgressState(firstState);
    const second = normalizeProgressState(secondState);
    const lessonHistory = { ...first.lessonHistory };

    Object.entries(second.lessonHistory).forEach(([key, timestamp]) => {
        lessonHistory[key] = Math.max(lessonHistory[key] || 0, timestamp);
    });

    const firstLastViewed = first.lastLesson?.viewedAt || 0;
    const secondLastViewed = second.lastLesson?.viewedAt || 0;
    const firstQuiz = normalizeQuizSession(first.activeQuiz);
    const secondQuiz = normalizeQuizSession(second.activeQuiz);
    const activeQuiz = !firstQuiz ? secondQuiz
        : !secondQuiz ? firstQuiz
            : (secondQuiz.updatedAt >= firstQuiz.updatedAt ? secondQuiz : firstQuiz);
    return normalizeProgressState({
        version: STATE_VERSION,
        stats: mergeStats(first.stats, second.stats),
        starredLessons: [...new Set([...first.starredLessons, ...second.starredLessons])],
        starredQuestions: [...new Set([...first.starredQuestions, ...second.starredQuestions])],
        lessonHistory,
        lastLesson: secondLastViewed >= firstLastViewed ? second.lastLesson : first.lastLesson,
        activeQuiz,
        clientUpdatedAt: Math.max(first.clientUpdatedAt, second.clientUpdatedAt)
    });
}

function cloneState(value) {
    return JSON.parse(JSON.stringify(value));
}

function readStorage(key) {
    try {
        const saved = window.localStorage.getItem(key);
        return saved ? normalizeProgressState(JSON.parse(saved)) : null;
    } catch (error) {
        console.warn('Could not read saved Precalculus progress.', error);
        return null;
    }
}

function writeStorage(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        window.localStorage.setItem(LEGACY_STATS_KEY, JSON.stringify(value.stats));
    } catch (error) {
        console.warn('Could not save Precalculus progress locally.', error);
    }
}

function readGuestState() {
    const saved = readStorage(GUEST_STORAGE_KEY);
    if (saved) return saved;

    try {
        if (window.localStorage.getItem(LEGACY_MIGRATED_KEY)) return createDefaultProgressState();
        const legacyStats = window.localStorage.getItem(LEGACY_STATS_KEY);
        return legacyStats
            ? normalizeProgressState({ stats: JSON.parse(legacyStats) })
            : createDefaultProgressState();
    } catch (error) {
        return createDefaultProgressState();
    }
}

let activeStorageKey = GUEST_STORAGE_KEY;
let progressState = typeof window === 'undefined' ? createDefaultProgressState() : readGuestState();
let currentUser = null;
let currentProgressDocument = null;
let firebaseApi = null;
let firebaseAuth = null;
let firebaseDatabase = null;
let firebaseInitialization = null;
let remoteSubscription = null;
let saveTimer = null;
let saveInFlight = false;
let saveRequestedWhileBusy = false;
let authChangeVersion = 0;
let remoteInitialized = false;

let syncState = {
    status: 'starting',
    message: 'Preparing cloud sync',
    user: null,
    error: null
};

const progressListeners = new Set();
const syncListeners = new Set();

function publicUser(user) {
    if (!user) return null;
    return {
        uid: user.uid,
        displayName: user.displayName || user.email || 'Google account',
        email: user.email || '',
        photoURL: user.photoURL || ''
    };
}

function notifyProgress() {
    const snapshot = getProgressState();
    progressListeners.forEach(listener => listener(snapshot));
}

function setSyncState(status, message, error = null) {
    syncState = { status, message, user: publicUser(currentUser), error };
    const snapshot = getSyncState();
    syncListeners.forEach(listener => listener(snapshot));
}

function persistCurrentState() {
    if (typeof window === 'undefined') return;
    writeStorage(activeStorageKey, progressState);
}

function applyState(nextState) {
    progressState = normalizeProgressState(nextState);
    persistCurrentState();
    notifyProgress();
}

function updateState(mutator, { sync = true } = {}) {
    const draft = cloneState(progressState);
    mutator(draft);
    draft.clientUpdatedAt = Date.now();
    applyState(draft);
    if (sync) scheduleRemoteSave();
}

function scheduleRemoteSave(delay = 250) {
    if (!currentUser || !currentProgressDocument || !firebaseApi || !remoteInitialized) return;
    if (saveTimer) window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
        saveTimer = null;
        void flushRemoteSave();
    }, delay);
}

async function flushRemoteSave() {
    if (!currentUser || !currentProgressDocument || !firebaseApi || !remoteInitialized) return;
    if (saveInFlight) {
        saveRequestedWhileBusy = true;
        return;
    }

    saveInFlight = true;
    saveRequestedWhileBusy = false;
    const stateToSave = getProgressState();
    setSyncState('syncing', 'Saving progress');

    try {
        await firebaseApi.setDoc(currentProgressDocument, {
            precalculusState: stateToSave,
            updatedAt: firebaseApi.serverTimestamp()
        }, { merge: true });
        setSyncState('synced', 'Progress synced');
    } catch (error) {
        const offline = typeof navigator !== 'undefined' && !navigator.onLine;
        setSyncState(offline ? 'offline' : 'error', offline ? 'Changes saved on this device' : 'Cloud sync needs attention', error);
    } finally {
        saveInFlight = false;
        if (saveRequestedWhileBusy || progressState.clientUpdatedAt > stateToSave.clientUpdatedAt) scheduleRemoteSave(0);
    }
}

function startRemoteSubscription(documentReference, changeVersion) {
    if (remoteSubscription) remoteSubscription();
    remoteSubscription = firebaseApi.onSnapshot(documentReference, snapshot => {
        if (changeVersion !== authChangeVersion) return;

        if (!snapshot.exists()) {
            remoteInitialized = true;
            scheduleRemoteSave(0);
            setSyncState('synced', 'Progress synced');
            return;
        }

        const remote = normalizeProgressState(snapshot.data().precalculusState);
        if (!remoteInitialized) {
            const local = getProgressState();
            const merged = mergeProgressStates(remote, local);
            remoteInitialized = true;
            applyState(merged);
            if (JSON.stringify(merged) !== JSON.stringify(remote)) scheduleRemoteSave(0);
        } else if (remote.clientUpdatedAt > progressState.clientUpdatedAt) {
            applyState(remote);
        }
        setSyncState('synced', 'Progress synced');
    }, error => {
        if (changeVersion !== authChangeVersion) return;
        const offline = !navigator.onLine;
        setSyncState(offline ? 'offline' : 'error', offline ? 'Changes saved on this device' : 'Cloud sync needs attention', error);
    });
}

async function connectSignedInUser(user, changeVersion) {
    const guestState = activeStorageKey === GUEST_STORAGE_KEY
        ? getProgressState()
        : createDefaultProgressState();
    const userStorageKey = `${USER_STORAGE_PREFIX}${user.uid}`;
    const userLocalState = readStorage(userStorageKey) || createDefaultProgressState();
    const documentReference = firebaseApi.doc(firebaseDatabase, 'progress', user.uid);
    const migrationKey = `${USER_MIGRATION_PREFIX}${user.uid}`;
    const startingState = mergeProgressStates(userLocalState, guestState);

    // Switch to the account-specific cache immediately. This preserves changes if
    // the first cloud read happens while the device is offline.
    activeStorageKey = userStorageKey;
    currentProgressDocument = documentReference;
    applyState(startingState);

    setSyncState('syncing', 'Loading cloud progress');

    try {
        const remoteSnapshot = await firebaseApi.getDoc(documentReference);
        if (changeVersion !== authChangeVersion) return;
        const remoteState = remoteSnapshot.exists()
            ? normalizeProgressState(remoteSnapshot.data().precalculusState)
            : createDefaultProgressState();
        const mergedState = mergeProgressStates(remoteState, getProgressState());

        remoteInitialized = true;
        applyState(mergedState);

        await firebaseApi.setDoc(documentReference, {
            precalculusState: getProgressState(),
            updatedAt: firebaseApi.serverTimestamp()
        }, { merge: true });
        if (changeVersion !== authChangeVersion) return;

        window.localStorage.setItem(migrationKey, '1');
        window.localStorage.setItem(LEGACY_MIGRATED_KEY, '1');
        writeStorage(GUEST_STORAGE_KEY, createDefaultProgressState());
        startRemoteSubscription(documentReference, changeVersion);

        setSyncState('synced', 'Progress synced');
    } catch (error) {
        if (changeVersion !== authChangeVersion) return;
        startRemoteSubscription(documentReference, changeVersion);
        const offline = !navigator.onLine;
        setSyncState(offline ? 'offline' : 'error', offline ? 'Changes saved on this device' : 'Could not load cloud progress', error);
    }
}

async function initializeFirebase() {
    setSyncState('starting', 'Connecting to cloud sync');

    try {
        const baseUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
        const [appModule, authModule, firestoreModule] = await Promise.all([
            import(`${baseUrl}/firebase-app.js`),
            import(`${baseUrl}/firebase-auth.js`),
            import(`${baseUrl}/firebase-firestore.js`)
        ]);

        const app = appModule.initializeApp(FIREBASE_CONFIG);
        firebaseAuth = authModule.getAuth(app);
        firebaseDatabase = firestoreModule.getFirestore(app);
        firebaseApi = { ...authModule, ...firestoreModule };
        await authModule.setPersistence(firebaseAuth, authModule.browserLocalPersistence);

        authModule.onAuthStateChanged(firebaseAuth, user => {
            authChangeVersion += 1;
            const changeVersion = authChangeVersion;
            if (remoteSubscription) {
                remoteSubscription();
                remoteSubscription = null;
            }

            currentUser = user;
            currentProgressDocument = null;
            remoteInitialized = false;

            if (!user) {
                activeStorageKey = GUEST_STORAGE_KEY;
                applyState(readGuestState());
                setSyncState('local', 'Sign in to sync every device');
                return;
            }

            setSyncState('syncing', 'Loading cloud progress');
            void connectSignedInUser(user, changeVersion);
        });

        await authModule.getRedirectResult(firebaseAuth).catch(error => {
            console.warn('Google sign-in redirect did not complete.', error);
        });
    } catch (error) {
        setSyncState('error', 'Cloud sync unavailable; progress is saved here', error);
    }
}

export function initProgressSync() {
    if (!firebaseInitialization) firebaseInitialization = initializeFirebase();
    return firebaseInitialization;
}

export function getProgressState() {
    return cloneState(progressState);
}

export function getStats() {
    return cloneState(progressState.stats);
}

export function getSyncState() {
    return {
        status: syncState.status,
        message: syncState.message,
        user: syncState.user ? { ...syncState.user } : null,
        error: syncState.error || null
    };
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
    return progressState.starredLessons.includes(getLessonKey(unitId, lessonIndex));
}

export function setLessonStarred(unitId, lessonIndex, starred) {
    const key = getLessonKey(unitId, lessonIndex);
    updateState(draft => {
        const lessons = new Set(draft.starredLessons);
        if (starred) lessons.add(key);
        else lessons.delete(key);
        draft.starredLessons = [...lessons];
    });
    return starred;
}

export function toggleLessonStar(unitId, lessonIndex) {
    return setLessonStarred(unitId, lessonIndex, !isLessonStarred(unitId, lessonIndex));
}

export function isQuestionStarred(questionId) {
    return progressState.starredQuestions.includes(String(questionId));
}

export function setQuestionStarred(questionId, starred) {
    const id = normalizeQuestionId(questionId);
    if (!id) return false;

    updateState(draft => {
        const questions = new Set(draft.starredQuestions);
        if (starred) questions.add(id);
        else questions.delete(id);
        draft.starredQuestions = [...questions];
    });
    return starred;
}

export function toggleQuestionStar(questionId) {
    return setQuestionStarred(questionId, !isQuestionStarred(questionId));
}

export function markLessonViewed(unitId, lessonIndex) {
    const key = getLessonKey(unitId, lessonIndex);
    const previousView = progressState.lessonHistory[key] || 0;
    const now = Date.now();
    if (now - previousView < 10000) return;

    updateState(draft => {
        draft.lessonHistory[key] = now;
        draft.lastLesson = { unitId, lessonIndex: Number(lessonIndex), viewedAt: now };
    });
}

export function recordQuizResult({ score, total, xp, answers = [] }) {
    const quizScore = nonNegativeInteger(score);
    const quizTotal = nonNegativeInteger(total);
    const earnedXp = nonNegativeInteger(xp);
    if (quizTotal === 0) return;

    updateState(draft => {
        const stats = normalizeStats(draft.stats);
        stats.quizzesCompleted += 1;
        stats.questionsAnswered += quizTotal;
        stats.correctAnswers += Math.min(quizScore, quizTotal);
        stats.totalXP += earnedXp;

        answers.forEach(answer => {
            const unitId = answer?.unitId;
            if (!unitId) return;
            if (!stats.topicPoints[unitId]) stats.topicPoints[unitId] = { correct: 0, total: 0 };
            stats.topicPoints[unitId].total += 1;
            if (answer.isCorrect) stats.topicPoints[unitId].correct += 1;
        });

        draft.stats = stats;
    });
}

export function setActiveQuiz(session) {
    updateState(draft => {
        draft.activeQuiz = session ? { ...session, updatedAt: Date.now() } : null;
    });
}

export function clearActiveQuiz() {
    if (!progressState.activeQuiz) return;
    updateState(draft => {
        draft.activeQuiz = null;
    });
}

export async function signInWithGoogle() {
    await initProgressSync();
    if (!firebaseAuth || !firebaseApi) throw new Error('Google sign-in is not available right now.');

    const provider = new firebaseApi.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    setSyncState('syncing', 'Opening Google sign-in');

    try {
        return await firebaseApi.signInWithPopup(firebaseAuth, provider);
    } catch (error) {
        if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/operation-not-supported-in-this-environment') {
            await firebaseApi.signInWithRedirect(firebaseAuth, provider);
            return null;
        }
        setSyncState(currentUser ? 'synced' : 'local', currentUser ? 'Progress synced' : 'Sign in to sync every device', error);
        throw error;
    }
}

export async function signOutProgress() {
    await initProgressSync();
    if (firebaseAuth && firebaseApi) await firebaseApi.signOut(firebaseAuth);
}

export async function resetProgress() {
    const emptyState = createDefaultProgressState();
    emptyState.clientUpdatedAt = Date.now();
    applyState(emptyState);

    if (currentUser && currentProgressDocument && firebaseApi) {
        setSyncState('syncing', 'Clearing cloud progress');
        await firebaseApi.setDoc(currentProgressDocument, {
            precalculusState: getProgressState(),
            updatedAt: firebaseApi.serverTimestamp()
        }, { merge: true });
        setSyncState('synced', 'Progress synced');
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        if (currentUser) {
            setSyncState('syncing', 'Reconnecting cloud progress');
            scheduleRemoteSave(0);
        }
    });
    window.addEventListener('offline', () => {
        if (currentUser) setSyncState('offline', 'Changes saved on this device');
    });
}
