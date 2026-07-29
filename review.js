// Guided lesson and unit overview manager.
import { precalculusData } from './data.js?v=precalculus-5';
import { initSandbox } from './interactive.js?v=precalculus-5';
import {
    isLessonStarred,
    markLessonViewed,
    subscribeProgress,
    toggleLessonStar
} from './progress.js?v=precalculus-5';

const sandboxDescriptions = {
    "unit-1": "Compare a rational function with its asymptotes and removable hole.",
    "unit-2": "Move around the unit circle and connect angle, sine, cosine, and tangent.",
    "unit-3": "Change an equation target and see every solution on one full cycle.",
    "unit-4": "Adjust amplitude, period, phase shift, and midline on a trig graph.",
    "unit-5": "Change triangle sides and angle to compare the Law of Cosines and area.",
    "unit-6": "Move a complex number and watch modulus and argument update.",
    "unit-7": "Switch between arithmetic and geometric sequences and inspect their sums.",
    "unit-8": "Trace a polar curve while changing its family and parameters.",
    "unit-9": "Move the tangent point on a function and compare secant and tangent slopes."
};

const memoryAnchors = {
    "unit-1": ["Domain first → features second", "Compose inside-out; reverse for inverses", "Factor → restrict → cancel → classify", "Logs demand positive arguments"],
    "unit-2": ["$(\\cos\\theta,\\sin\\theta)$", "$360^\\circ=2\\pi$", "$s=r\\theta$ and $v=r\\omega$"],
    "unit-3": ["Rewrite → factor → solve every case", "$\\sin^2x+\\cos^2x=1$", "Sum formulas build unfamiliar angles"],
    "unit-4": ["Family → period → shift → reflection", "Period: $T=\\frac{2\\pi}{|b|}$"],
    "unit-5": ["SSS/SAS: cosine; opposite pair: sine", "SSA can make 0, 1, or 2 triangles", "Area: included angle or semiperimeter"],
    "unit-6": ["$a+bi\\leftrightarrow(a,b)$", "Order matters? permutation : combination", "Union subtracts overlap; independence multiplies"],
    "unit-7": ["Difference → arithmetic; ratio → geometric", "$|r|<1$ for an infinite sum"],
    "unit-8": ["Standard form reveals the conic", "$x=r\\cos\\theta,\\ y=r\\sin\\theta$", "Keep restrictions after eliminating $t$"],
    "unit-9": ["Left limit = right limit → two-sided limit", "Difference quotient → tangent slope", "$0/0$ means simplify", "Point from $f$; slope from $f'$" ]
};

export function initReviewPanel({
    unitSelect,
    lessonSelect,
    overviewContainer,
    lessonMapContainer,
    contentContainer,
    canvas,
    controlsContainer,
    badge,
    sandboxIntro,
    lessonProgress,
    previousButton,
    nextButton,
    lessonLevelBadge
}) {
    let currentUnit = null;
    let currentLessonIndex = 0;

    unitSelect.innerHTML = '';
    precalculusData.units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.id;
        option.innerText = `${unit.id.replace('unit-', 'Unit ')} - ${unit.title}`;
        unitSelect.appendChild(option);
    });

    unitSelect.addEventListener('change', () => loadUnit(unitSelect.value, 0));
    lessonSelect.addEventListener('change', () => renderLesson(Number(lessonSelect.value)));
    previousButton.addEventListener('click', () => renderLesson(currentLessonIndex - 1));
    nextButton.addEventListener('click', () => renderLesson(currentLessonIndex + 1));

    if (precalculusData.units.length) loadUnit(precalculusData.units[0].id, 0);
    const stopProgressSubscription = subscribeProgress(refreshStarUi);

    function loadUnit(unitId, lessonIndex = 0) {
        const unit = precalculusData.units.find(candidate => candidate.id === unitId);
        if (!unit) return;
        currentUnit = unit;
        unitSelect.value = unit.id;
        badge.innerText = unit.id.replace('unit-', 'Unit ');
        sandboxIntro.innerText = sandboxDescriptions[unit.id] || 'Change a value and watch the representation respond.';
        lessonSelect.innerHTML = '';
        unit.lessons.forEach((currentLesson, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.innerText = `${index + 1}. ${withoutNumber(currentLesson.title)}`;
            lessonSelect.appendChild(option);
        });
        renderUnitOverview(unit);
        renderLessonMap(unit);
        renderLesson(Math.min(lessonIndex, unit.lessons.length - 1));
        initSandbox(canvas, unit.id, controlsContainer);
    }

    function renderUnitOverview(unit) {
        overviewContainer.innerHTML = `
            <div class="overview-heading">
                <span class="eyebrow">Unit snapshot</span>
                <strong>${unit.overview}</strong>
                <div class="curriculum-tags" aria-label="Course classification">
                    <span>${unit.curriculumUnit || 'Course topic'}</span>
                    <span class="${unit.curriculumLevel?.toLowerCase().includes('honors') ? 'honors' : ''}">${unit.curriculumLevel || 'Core'}</span>
                </div>
            </div>
            <div class="overview-columns">
                <div>
                    <span class="overview-label">You will learn to</span>
                    <ul class="overview-list">${unit.essentialQuestions.map(item => `<li>${item}</li>`).join('')}</ul>
                </div>
                <details class="vocabulary-details">
                    <summary>Open vocabulary (${unit.vocabulary.length} terms)</summary>
                    <dl>${unit.vocabulary.map(([term, definition]) => `<div><dt>${term}</dt><dd>${definition}</dd></div>`).join('')}</dl>
                </details>
            </div>
        `;
        renderMath(overviewContainer);
    }

    function renderLessonMap(unit) {
        lessonMapContainer.innerHTML = `
            <span class="overview-label">Lessons in this unit</span>
            <ol>${unit.lessons.map((currentLesson, index) => `
                <li>
                    <button type="button" class="lesson-map-button${isLessonStarred(unit.id, index) ? ' starred' : ''}" data-lesson-index="${index}">
                        <span class="lesson-map-number">${index + 1}</span>
                        <span class="lesson-map-title">${withoutNumber(currentLesson.title)}</span>
                        ${currentLesson.level === 'Honors' ? '<span class="lesson-map-level">Honors</span>' : ''}
                        <span class="lesson-map-star" aria-hidden="true"${isLessonStarred(unit.id, index) ? '' : ' hidden'}>★</span>
                    </button>
                </li>
            `).join('')}</ol>
        `;
        lessonMapContainer.querySelectorAll('.lesson-map-button').forEach(button => {
            button.addEventListener('click', () => renderLesson(Number(button.dataset.lessonIndex)));
        });
    }

    function renderLesson(index) {
        if (!currentUnit?.lessons[index]) return;
        currentLessonIndex = index;
        const currentLesson = currentUnit.lessons[index];
        const starred = isLessonStarred(currentUnit.id, index);
        lessonSelect.value = String(index);
        lessonProgress.innerText = `Lesson ${index + 1} of ${currentUnit.lessons.length}`;
        lessonLevelBadge.innerText = currentLesson.level === 'Honors' ? 'Honors' : 'Core';
        lessonLevelBadge.classList.toggle('honors', currentLesson.level === 'Honors');
        previousButton.disabled = index === 0;
        nextButton.disabled = index === currentUnit.lessons.length - 1;
        nextButton.innerText = index === currentUnit.lessons.length - 1 ? 'Last lesson' : 'Next lesson';
        lessonMapContainer.querySelectorAll('.lesson-map-button').forEach(button => {
            const isCurrent = Number(button.dataset.lessonIndex) === index;
            button.classList.toggle('current', isCurrent);
            if (isCurrent) button.setAttribute('aria-current', 'page');
            else button.removeAttribute('aria-current');
        });

        const glossary = currentUnit.vocabulary.slice(index % Math.max(1, currentUnit.vocabulary.length - 2), index % Math.max(1, currentUnit.vocabulary.length - 2) + 3);
        const anchors = memoryAnchors[currentUnit.id] || ["Connect words, symbols, and graphs"];
        contentContainer.innerHTML = `
            <article class="lesson-section active-lesson">
                <div class="lesson-heading-block">
                    <div class="lesson-heading-title-row">
                        <div class="lesson-heading-copy">
                            <span class="lesson-number">Lesson ${index + 1}</span>
                            <h2 tabindex="-1">${withoutNumber(currentLesson.title)}</h2>
                            <p class="lesson-purpose">${currentLesson.purpose}</p>
                        </div>
                        <button type="button" class="lesson-star-button${starred ? ' active' : ''}" aria-pressed="${starred}">
                            <span class="lesson-star-icon" aria-hidden="true">★</span>
                            <span class="lesson-star-label">${starred ? 'Starred' : 'Star lesson'}</span>
                        </button>
                    </div>
                </div>
                <aside class="lesson-glossary" aria-label="Key words for this lesson">
                    <div class="lesson-glossary-heading"><span>Before you start</span><strong>Key words in this lesson</strong></div>
                    <dl>${glossary.map(([term, definition]) => `<div><dt>${term}</dt><dd>${definition}</dd></div>`).join('')}</dl>
                </aside>
                <aside class="memory-anchor" aria-label="Memory anchor">
                    <span class="memory-anchor-label">Memory anchor</span>
                    <div class="memory-anchor-cues">
                        <strong>${anchors[index % anchors.length]}</strong>
                        <span>${anchors[(index + 1) % anchors.length]}</span>
                    </div>
                    <p class="memory-anchor-tip"><strong>Exam move:</strong> Name the function family or formula before doing algebra.</p>
                </aside>
                <div class="lesson-body-copy">${currentLesson.content}</div>
                <div class="takeaways-box"><strong>Remember</strong><ul>${currentLesson.takeaways.map(item => `<li>${item}</li>`).join('')}</ul></div>
                <div class="lesson-end-navigation">
                    <button type="button" class="btn btn-small btn-secondary lesson-end-prev">Previous lesson</button>
                    <span>Page ${index + 1} of ${currentUnit.lessons.length}</span>
                    <button type="button" class="btn btn-small btn-accent lesson-end-next">Next lesson</button>
                </div>
            </article>
        `;
        const endPrevious = contentContainer.querySelector('.lesson-end-prev');
        const endNext = contentContainer.querySelector('.lesson-end-next');
        endPrevious.disabled = index === 0;
        endNext.disabled = index === currentUnit.lessons.length - 1;
        endPrevious.addEventListener('click', () => renderLesson(currentLessonIndex - 1));
        endNext.addEventListener('click', () => renderLesson(currentLessonIndex + 1));
        contentContainer.querySelector('.lesson-star-button').addEventListener('click', () => {
            toggleLessonStar(currentUnit.id, currentLessonIndex);
            refreshStarUi();
        });
        contentContainer.scrollTop = 0;
        renderMath(contentContainer);
        markLessonViewed(currentUnit.id, index);
    }

    function refreshStarUi() {
        if (!currentUnit) return;
        lessonMapContainer.querySelectorAll('.lesson-map-button').forEach(button => {
            const lessonIndex = Number(button.dataset.lessonIndex);
            const starred = isLessonStarred(currentUnit.id, lessonIndex);
            button.classList.toggle('starred', starred);
            const icon = button.querySelector('.lesson-map-star');
            if (icon) icon.hidden = !starred;
        });
        const button = contentContainer.querySelector('.lesson-star-button');
        if (!button) return;
        const starred = isLessonStarred(currentUnit.id, currentLessonIndex);
        button.classList.toggle('active', starred);
        button.setAttribute('aria-pressed', String(starred));
        button.querySelector('.lesson-star-label').textContent = starred ? 'Starred' : 'Star lesson';
    }

    function renderMath(container) {
        if (typeof window.renderMathInElement !== 'function') return;
        window.renderMathInElement(container, {
            delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
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

    function withoutNumber(title) {
        return title.replace(/^\d+\.\s*/, '');
    }

    return {
        openLesson(unitId, lessonIndex = 0) { loadUnit(unitId, lessonIndex); },
        destroy() { stopProgressSubscription(); }
    };
}
