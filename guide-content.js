// Curriculum-completion content and durable question-to-guide routing.
// Kept separate from the original question bank so coverage can be audited in one place.

const html = String.raw;

const makeLesson = (title, purpose, content, takeaways, level = 'Core') => ({
    title,
    purpose,
    content,
    takeaways,
    level
});

export function completeGuideCoverage(precalculusData) {
    const findUnit = unitId => {
        const unit = precalculusData.units.find(candidate => candidate.id === unitId);
        if (!unit) throw new Error(`Unknown guide unit: ${unitId}`);
        return unit;
    };

    const findLesson = (unitId, title) => {
        const lesson = findUnit(unitId).lessons.find(candidate => candidate.title === title);
        if (!lesson) throw new Error(`Unknown guide lesson: ${unitId} / ${title}`);
        return lesson;
    };

    const extendLesson = (unitId, title, content, takeaways = []) => {
        const lesson = findLesson(unitId, title);
        lesson.content += content;
        lesson.takeaways.push(...takeaways);
    };

    const addLessons = (unitId, lessons) => {
        findUnit(unitId).lessons.push(...lessons);
    };

    // Unit 1: Functions, rational models, exponentials, and logarithms.
    extendLesson('unit-1', 'Lines, function notation, domain, and range', html`
        <h3>Coordinate-plane toolkit</h3>
        <div class="math-block">$$m=\frac{y_2-y_1}{x_2-x_1},\qquad d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2},\qquad M=\left(\frac{x_1+x_2}{2},\frac{y_1+y_2}{2}\right)$$</div>
        <p>An $x$-intercept occurs where $f(x)=0$; a $y$-intercept occurs at $f(0)$ when defined. Through $(2,5)$ and $(6,13)$, $m=2$, so $y-5=2(x-2)$, or $y=2x+1$. Its intercepts are $(-1/2,0)$ and $(0,1)$. Parallel lines keep slope 2; perpendicular nonvertical lines use slope $-1/2$.</p>
        <div class="example-box"><h4>Interpret a model</h4><p>A taxi cost $C(m)=3+2.25m$ has initial fee $3$, rate $2.25$ dollars per mile, and meaningful domain $m\ge0$. A graph intersection with a budget line tells when the trip reaches that budget.</p></div>
        <div class="quick-check"><strong>Quick check:</strong> Find the line through $(1,-2)$ and $(5,6)$, then name both intercepts.</div>
    `, ['Use intercepts and slope to connect equations, graphs, and contexts.', 'Distance and midpoint formulas compare two coordinate points.']);

    extendLesson('unit-1', 'Function behavior, symmetry, transformations, and piecewise rules', html`
        <h3>Parent-function reference</h3>
        <ul class="formula-facts">
            <li>$\sqrt{x}$: domain and range $[0,\infty)$.</li>
            <li>$x^3$: domain and range all real; origin symmetry.</li>
            <li>$1/x$: domain and range exclude 0; asymptotes $x=0$ and $y=0$.</li>
            <li>$|x|$: vertex $(0,0)$, range $[0,\infty)$, and $y$-axis symmetry.</li>
            <li>Step and piecewise graphs use open dots for excluded endpoints and closed dots for included endpoints.</li>
        </ul>
        <p>For $g(x)=-\sqrt{x-2}+3$, start with $\sqrt{x}$, shift right 2, reflect across the $x$-axis, and move up 3. Thus the endpoint is $(2,3)$, domain is $[2,\infty)$, range is $(-\infty,3]$, and the graph decreases.</p>
        <div class="example-box"><h4>Complete graph checklist</h4><p>Name the family, domain, range, intercepts, endpoints, symmetry, positive/negative intervals, increasing/decreasing intervals, extrema, asymptotes, periodicity, and end behavior. A context may further restrict the domain.</p></div>
    `, ['Know the key features of square-root, cubic, reciprocal, absolute-value, step, and piecewise graphs.', 'Describe every graph with a consistent feature checklist.']);

    extendLesson('unit-1', 'Operations, composition, and inverse functions', html`
        <p>Verify an inverse in both directions. If $f(x)=2x-5$ and $f^{-1}(x)=(x+5)/2$, then $f(f^{-1}(x))=x$ and $f^{-1}(f(x))=x$. On a graph or table, inverse points swap coordinates: $(a,b)$ becomes $(b,a)$, reflecting across $y=x$.</p>
        <p>If a function is not one-to-one, restrict its domain before inverting. For example, $x^2$ restricted to $x\ge0$ has inverse $\sqrt{x}$. In a composition, also require each inner output to lie in the next function's domain.</p>
        <div class="quick-check"><strong>Quick check:</strong> If $f(4)=9$, then which point lies on $f^{-1}$?</div>
    `, ['Verify inverses by composition and by swapping graph or table coordinates.', 'Restrict a domain when needed to make a function one-to-one.']);

    extendLesson('unit-1', 'Quadratic functions and models', html`
        <p>A complete quadratic sketch includes opening direction, axis, vertex, both intercept types, and maximum or minimum. In a model, interpret those features and restrict inputs to meaningful values.</p>
        <div class="example-box"><h4>Model example</h4><p>For $h(t)=-16t^2+64t+5$, the vertex occurs at $t=-64/[2(-16)]=2$. The maximum height is $h(2)=69$. Time requires $t\ge0$, and a physical model ends when the object reaches the ground.</p></div>
    `, ['Interpret a quadratic vertex and domain in context.']);

    extendLesson('unit-1', 'Polynomial division and zero theorems', html`
        <p>Synthetic division of $x^3-4x^2+x+6$ by $x-2$ gives quotient $x^2-2x-3$ and remainder 0. Therefore 2 is a zero; factoring the quotient gives all zeros $2,3,-1$.</p>
        <p>The Intermediate Value Theorem says a continuous polynomial with opposite signs at $a$ and $b$ has at least one zero between them. Since $p(x)=x^3-x-1$ has $p(1)=-1$ and $p(2)=5$, a zero lies in $(1,2)$.</p>
        <p>The Fundamental Theorem of Algebra counts exactly $n$ complex zeros for degree $n$, with multiplicity. For real coefficients, nonreal roots occur in conjugate pairs. Thus $3+2i$ requires $3-2i$, while $x^2+4=0$ gives $\pm2i$.</p>
    `, ['Use sign changes to locate polynomial zeros with the Intermediate Value Theorem.', 'Use degree, multiplicity, and conjugate pairs to account for every zero.']);

    extendLesson('unit-1', '2. Rational functions: restrictions, holes, and asymptotes', html`
        <h3>Complete rational-graph workflow</h3>
        <p>Factor while preserving original restrictions. Then find $x$-intercepts from uncanceled numerator zeros, the $y$-intercept from $f(0)$, holes from canceled factors, vertical asymptotes from uncanceled denominator zeros, horizontal or slant asymptotes from degrees or division, and branch signs from test points. A horizontal asymptote $y=L$ means $f(x)\to L$ as $x\to\pm\infty$ when both ends share that limit.</p>
        <div class="example-box"><h4>Rational model</h4><p>$C(n)=1200/n+50$, $n>0$, can model average unit cost. Its horizontal asymptote $y=50$ is a long-run cost floor; the context restricts $n$ to positive quantities.</p></div>
        <p>For a polynomial or rational inequality, factor, place numerator and denominator zeros on a sign chart, test each interval, include equality zeros when allowed, and always exclude denominator zeros. Do not cross-multiply by an expression whose sign is unknown.</p>
        <div class="quick-check"><strong>Quick check:</strong> For Practice #2, find both intercepts, every restriction, the hole, both asymptotes, and both end limits.</div>
    `, ['A full rational sketch needs intercepts, discontinuities, asymptotes, signs, and end behavior.', 'Interpret asymptotes and restricted domains in models.']);

    extendLesson('unit-1', 'Rational-expression operations', html`
        <p>For a complex fraction, multiply every numerator and denominator term by the least common denominator. Example:</p>
        <div class="math-block">$$\frac{\frac1x+\frac1y}{\frac1x-\frac1y}\cdot\frac{xy}{xy}=\frac{x+y}{y-x},\qquad x\ne0,\ y\ne0,\ x\ne y.$$</div>
        <p>The restrictions come from every original denominator and from the original divisor, even when later algebra cancels a factor.</p>
    `, ['Clear a complex fraction with one least common denominator while preserving all original restrictions.']);

    extendLesson('unit-1', 'Exponential and logarithmic models', html`
        <p>Half-life $H$ uses $A=A_0(1/2)^{t/H}$. If $A_0=800$, $H=6$, and $A=100$, then $1/8=(1/2)^{t/6}$, so $t=18$ years. For compound interest, match the rate and time units before using $A=P(1+r/n)^{nt}$.</p>
        <p>Log scales turn multiplication into addition. For pH, $\mathrm{pH}=-\log[H^+]$; concentration $10^{-3}$ gives pH 3. For $P(t)=1200(1.04)^t$, reaching 1500 takes $t=\ln(1500/1200)/\ln(1.04)\approx5.69$ time units. For monthly compounding, $5000(1+0.06/12)^{12t}=6500$ gives $t=\ln(6500/5000)/[12\ln(1.005)]\approx4.38$ years.</p>
    `, ['Use half-life, compound-interest, and logarithmic models with matching units.', 'Explain model parameters and solve for time with logarithms.']);

    addLessons('unit-1', [
        makeLesson('Exponential transformations, evaluation, and end behavior', 'Read every transformation and both end limits from an exponential formula.', html`
            <p>For $g(x)=ab^{x-h}+k$, where $b>0$ and $b\ne1$, the domain is all real and horizontal asymptote is $y=k$. If $a>0$, range is $(k,\infty)$; if $a<0$, range is $(-\infty,k)$. Base $b>1$ grows; $0<b<1$ decays. A negative input reflects horizontally; a negative outside coefficient reflects vertically.</p>
            <div class="example-box"><h4>Practice transformations</h4><p>$e^{-x}+2$ decreases toward $y=2$ as $x\to\infty$. $-e^x+2$ decreases from the asymptote $y=2$ as $x\to-\infty$ and falls to $-\infty$ as $x\to\infty$. For $-2^x+3$, domain is all real, range is $(-\infty,3)$, $f(x)\to3$ as $x\to-\infty$, and $f(x)\to-\infty$ as $x\to\infty$.</p></div>
            <p>To evaluate, substitute with parentheses around the exponent. To build a model from two points, solve for initial value and growth factor, then interpret whether the domain should be continuous or discrete.</p>
            <div class="quick-check"><strong>Quick check:</strong> Give domain, range, asymptote, and both end limits for $-4(1/2)^x+1$.</div>
        `, ['Domain is all real; vertical shift gives the horizontal asymptote.', 'Use base and reflection signs to determine direction and both end limits.']),
        makeLesson('Logarithm transformations, domains, and end behavior', 'Solve the whole log argument inequality before reading a transformed graph.', html`
            <p>For $y=a\log_b(c(x-h))+k$, require $c(x-h)>0$. The boundary $x=h$ is a vertical asymptote, but the allowed side depends on the full inequality. Logarithms have all-real range before outside restrictions from a model.</p>
            <div class="example-box"><h4>Two reflection cases</h4><p>$-\ln(x-2)$ has domain $x>2$, asymptote $x=2$, and decreases from $+\infty$ to $-\infty$. In contrast, $\ln(2-x)$ has domain $x<2$, asymptote $x=2$, and decreases from $+\infty$ as $x\to-\infty$ to $-\infty$ as $x\to2^-$. For $\ln(x+2)+1$, domain is $x>-2$, and setting $y=0$ gives $x=e^{-1}-2$.</p></div>
            <div class="mistake-box"><strong>Common mix-up:</strong> Do not automatically write $x>h$. Solve the actual argument inequality, especially when the input coefficient is negative.</div>
        `, ['A logarithm requires a strictly positive argument.', 'Input and output reflections determine direction and one-sided end behavior.']),
        makeLesson('Logarithm identities, evaluation, and change of base', 'Evaluate, expand, and condense logarithms without losing domain conditions.', html`
            <p>In this course, $\log$ without a base means base 10. Every base satisfies $b>0$, $b\ne1$, and every logarithm argument must be positive.</p>
            <div class="math-block">$$\log_b(b^u)=u,\quad b^{\log_bM}=M,\quad \log_b1=0,\quad \log_ba=\frac{\ln a}{\ln b}$$</div>
            <div class="math-block">$$\log_b(MN)=\log_bM+\log_bN,\quad \log_b(M/N)=\log_bM-\log_bN,\quad \log_b(M^p)=p\log_bM$$</div>
            <div class="example-box"><h4>Exact evaluation</h4><p>$\log100=2$, $\ln(e^5)=5$, $\log_3(1/9)=-2$, $6^{\log_636}=36$, and $e^{2\ln3}=9$.</p></div>
            <p>On the general real domain, $\log(x^2)=2\log|x|$. If an exercise declares $x>0$, this becomes $2\log x$. Thus $\log(x^2/(5\sqrt y))=2\log x-\log5-(1/2)\log y$ under $x>0,y>0$.</p>
            <p>Condensing reverses the rules but does not erase original restrictions. Move coefficients to exponents before combining products and quotients.</p>
        `, ['Unsubscripted log means common log here.', 'State positivity assumptions before applying a log power rule.', 'Change of base allows calculator evaluation of any valid base.']),
        makeLesson('Domain-first logarithmic equations', 'Solve logarithmic equations and reject every candidate outside the original domain.', html`
            <ol class="overview-list"><li>Write each original log argument $>0$.</li><li>Isolate or condense logarithms.</li><li>Convert equal logs to equal arguments, or exponentiate with the base.</li><li>Solve the resulting equation.</li><li>Check every candidate in the original equation.</li></ol>
            <div class="example-box"><h4>Four equation patterns</h4><p>$5\log_2x+9=-6$ gives $x=2^{-3}=1/8$. $\ln x+\ln(x+2)=\ln15$ gives candidates $3,-5$, but only 3 is in the domain. $\log_3(x-3)-\log_3(x+2)=2$ produces $-21/8$, but the original domain $x>3$ rejects it. $\ln(1-x)=\ln(x^2+4x-23)$ gives $3,-8$, and only $-8$ keeps both arguments positive.</p></div>
            <div class="mistake-box"><strong>Common mix-up:</strong> A positive quotient does not make separate logarithms of two negative quantities legal.</div>
            <div class="quick-check"><strong>Quick check:</strong> Solve $\log_5(x-1)+\log_5(x+3)=1$ and check the domain $x>1$.</div>
        `, ['Write domain restrictions before algebra.', 'Check candidates in every original logarithm.'])
    ]);

    // Unit 2: Trigonometric foundations.
    extendLesson('unit-2', '1. Degrees, radians, and the unit circle', html`
        <p>In standard position, the vertex is at the origin and initial side lies on the positive $x$-axis. Positive angles turn counterclockwise; negative angles turn clockwise. Coterminal angles are $\theta+360^\circ k$ or $\theta+2\pi k$ for integer $k$.</p>
        <h3>First-quadrant exact values</h3>
        <div class="math-block">$$\begin{array}{c|ccccc}\theta&0&\pi/6&\pi/4&\pi/3&\pi/2\\\hline \cos\theta&1&\sqrt3/2&\sqrt2/2&1/2&0\\ \sin\theta&0&1/2&\sqrt2/2&\sqrt3/2&1\\ \tan\theta&0&\sqrt3/3&1&\sqrt3&\text{undefined}\end{array}$$</div>
        <p>Use the reference angle for magnitude and ASTC signs: all are positive in I, sine in II, tangent in III, and cosine in IV. For example, $\sin(-4\pi/3)=\sin(2\pi/3)=\sqrt3/2$.</p>
    `, ['Use standard position, coterminal angles, reference angles, and the exact-value table.']);

    extendLesson('unit-2', '2. Exact trig and inverse trig', html`
        <p>Secant is undefined where cosine is zero; cosecant and cotangent are undefined where sine is zero. Reduce an angle, find its exact sine/cosine pair, then apply reciprocals.</p>
        <p>For decimal equations, set the requested calculator mode, take one inverse-trig value, then use the sign to find every quadrant solution. In degrees, $\arcsin(0.7880)\approx52^\circ$ gives $52^\circ,128^\circ$; $\arctan(-1.3763)\approx-54^\circ$ gives $126^\circ,306^\circ$ on one positive turn.</p>
        <div class="quick-check"><strong>Quick check:</strong> Evaluate $\sec\pi$, $\csc(3\pi/2)$, and $\arccos(1/2)$.</div>
    `, ['Inverse trig returns one principal value; quadrant work finds the other interval solutions.', 'Use degree or radian mode to match the problem.']);

    extendLesson('unit-2', '3. Basic trig equations and ranges', html`
        <ol class="overview-list"><li>Find the reference angle.</li><li>Select quadrants from the sign.</li><li>List every angle in the stated interval.</li><li>Check endpoints and where the original expression is undefined.</li></ol>
        <p>Special cases: $\sec\theta=1$ means $\cos\theta=1$; $\cot\theta$ is undefined where $\sin\theta=0$. Sine/cosine range is $[-1,1]$, tangent range is all real, and secant/cosecant range is $(-\infty,-1]\cup[1,\infty)$.</p>
        <p>Therefore $y=a\sec(u)+k$ or $a\csc(u)+k$ has range $(-\infty,k-|a|]\cup[k+|a|,\infty)$. For $-4\sec(5x-\pi)-10$, it is $(-\infty,-14]\cup[-6,\infty)$.</p>
    `, ['Check interval endpoints and undefined angles after solving.', 'Transform secant and cosecant branches without filling their range gap.']);

    extendLesson('unit-2', '4. Coordinates and right-triangle applications', html`
        <div class="math-block">$$\sin\alpha=\frac{\text{opposite}}{\text{hypotenuse}},\qquad \cos\alpha=\frac{\text{adjacent}}{\text{hypotenuse}},\qquad \tan\alpha=\frac{\text{opposite}}{\text{adjacent}}$$</div>
        <p>Use $a^2+b^2=c^2$ for a missing side and inverse trig for a missing acute angle. For a terminal point, compute nonnegative $r$, derive the ratios, then place the reference angle in the correct quadrant. For $(6\sqrt5,-6\sqrt{15})$, $r=12\sqrt5$, giving cosine $1/2$ and sine $-\sqrt3/2$, so $\theta=5\pi/3$.</p>
        <p>Elevation is measured upward from horizontal; depression is measured downward from horizontal. Parallel horizontal lines transfer the angle to the ground triangle. Label requested distance before choosing a ratio; a line of sight is usually the hypotenuse.</p>
    `, ['Use SOHCAHTOA and the Pythagorean Theorem to solve right triangles.', 'Measure elevation and depression from horizontal.']);

    extendLesson('unit-2', 'Arc length, sector area, and angular speed', html`
        <p>A radian satisfies $\theta=s/r$, so $s=r\theta$. If a turn covers $\theta$ radians in time $t$, then $\omega=\theta/t$ and $v=s/t=r\omega$.</p>
        <div class="example-box"><h4>Circular-motion example</h4><p>For $r=6$ cm and $\theta=5\pi/6$, arc length is $5\pi$ cm and sector area is $15\pi$ cm$^2$. A wheel turning $4\pi$ radians in 10 s has $\omega=2\pi/5$ rad/s.</p></div>
    `, ['Radian measure comes from arc length divided by radius.', 'Distinguish angular speed from linear speed and include units.']);

    // Unit 3: Trigonometric identities and equations.
    extendLesson('unit-3', '1. Identity toolkit', html`
        <div class="math-block">$$\sec^2x-\tan^2x=1,\quad \csc^2x-\cot^2x=1,\quad 1-\csc^2x=-\cot^2x,\quad 1-\sec^2x=-\tan^2x$$</div>
        <p>The unit-circle point $(\cos x,\sin x)$ lies on $X^2+Y^2=1$, which proves $\sin^2x+\cos^2x=1$. Derive $1+\tan^2x=\sec^2x$ by dividing by $\cos^2x$ where $\cos x\ne0$. Given one ratio and a quadrant, draw a reference triangle or use a Pythagorean identity; for $\sin\theta=3/5$ in II, $\cos\theta=-4/5$ and $\tan\theta=-3/4$.</p>
    `, ['Derive related Pythagorean identities and preserve division restrictions.', 'Use a quadrant to choose the sign of a missing trig value.']);

    extendLesson('unit-3', '2. Simplifying trig expressions', html`
        <ol class="overview-list"><li>Record the original domain.</li><li>Rewrite reciprocal or quotient functions in sine and cosine.</li><li>Factor or form a common denominator.</li><li>Use a Pythagorean identity.</li><li>Cancel only factors and keep the original restrictions.</li></ol>
        <div class="example-box"><h4>Common denominator</h4><p>$\frac{1+\cos x}{\sin x}+\frac{\sin x}{1+\cos x}=\frac{(1+\cos x)^2+\sin^2x}{\sin x(1+\cos x)}=2\csc x$ on the original common domain.</p></div>
        <p>Similarly, $\tan x/\csc x+\sin x/\tan x=\sin^2x/\cos x+\cos x=\sec x$ where the original expression is defined.</p>
    `, ['Use a domain-first simplification template for identities and rational trig expressions.']);

    extendLesson('unit-3', '3. Solving nonlinear trig equations', html`
        <h3>Six recurring patterns</h3>
        <p>Practice #30 uses: $\sin x(2\sin x+1)=0$; a double-angle substitution $u=2x$ solved on the doubled interval; $\tan x=\pm\sqrt3$; $\tan^2x=\sec^2x-1$ followed by $(\sec x-1)(\sec x+2)=0$; $3\sin x(2\cos x-1)=0$; and $\tan x(2\cos^2x-1)=0$.</p>
        <p>Never divide away a trig factor that might equal zero. Solve each factor, reject undefined candidates, intersect with the stated interval, and substitute into the original equation.</p>
        <details><summary>Practice #30: six complete interval checks</summary><ul><li>(a) $\sin x=0$ or $-1/2$: $0,\pi,7\pi/6,11\pi/6$.</li><li>(b) Solve $u=2x$ on $[0,4\pi)$: $u=3\pi/4,5\pi/4,11\pi/4,13\pi/4$, then divide by 2.</li><li>(c) $\tan x=\pm\sqrt3$: $\pi/3,2\pi/3,4\pi/3,5\pi/3$.</li><li>(d) $(\sec x-1)(\sec x+2)=0$: $0,2\pi/3,4\pi/3$; all keep cosine nonzero.</li><li>(e) $\sin x=0$ or $\cos x=1/2$: $0,\pi,\pi/3,5\pi/3$.</li><li>(f) $\tan x=0$ or $\cos^2x=1/2$: $0,\pi,\pi/4,3\pi/4,5\pi/4,7\pi/4$; reject no listed point because tangent is defined there.</li></ul></details>
    `, ['Factor first so zero-valued trig factors are not lost.', 'For multiple angles, solve across the expanded interval before dividing.']);

    extendLesson('unit-3', 'Verifying trigonometric identities', html`
        <p>A verification is a proof on the common domain, not an equation to solve. Work on one side with reversible identities, and state excluded values. Check structure algebraically rather than relying on a few numerical substitutions.</p>
    `, ['A valid identity proof preserves the common domain and uses reversible steps.']);

    extendLesson('unit-3', 'Sum and difference formulas', html`
        <p>A rotation through $v$ sends $(\cos u,\sin u)$ to $(\cos u\cos v-\sin u\sin v,\sin u\cos v+\cos u\sin v)$. Comparing this with $(\cos(u+v),\sin(u+v))$ proves the cosine and sine addition formulas; replacing $v$ by $-v$ proves the difference formulas. Dividing the sine sum by the cosine sum, then dividing numerator and denominator by $\cos u\cos v$, proves $\tan(u+v)=(\tan u+\tan v)/(1-\tan u\tan v)$ wherever both sides are defined.</p>
        <p>Cofunction and related-angle identities include $\sin(\pi/2-u)=\cos u$, $\cos(\pi/2-u)=\sin u$, $\sin(\pi/2+u)=\cos u$, and $\cos(\pi/2+u)=-\sin u$. They follow from the sum/difference formulas and explain common phase-equivalent graphs.</p>
        <div class="quick-check"><strong>Quick check:</strong> Use $45^\circ-30^\circ$ to find $\sin15^\circ$, and use $60^\circ+45^\circ$ to find $\cos105^\circ$.</div>
    `, ['Derive and apply cofunction identities from sum/difference formulas.']);

    extendLesson('unit-3', 'Double-angle, half-angle, and product-to-sum formulas', html`
        <div class="math-block">$$\sin\frac u2=\pm\sqrt{\frac{1-\cos u}{2}},\quad \cos\frac u2=\pm\sqrt{\frac{1+\cos u}{2}}$$</div>
        <div class="math-block">$$\tan\frac u2=\frac{\sin u}{1+\cos u}=\frac{1-\cos u}{\sin u}$$</div>
        <div class="math-block">$$\sin u\sin v=\frac{\cos(u-v)-\cos(u+v)}2,\quad \cos u\cos v=\frac{\cos(u-v)+\cos(u+v)}2$$</div>
        <div class="math-block">$$\sin u\cos v=\frac{\sin(u+v)+\sin(u-v)}2,\quad \cos u\sin v=\frac{\sin(u+v)-\sin(u-v)}2$$</div>
        <p>Select a half-angle sign from the quadrant of $u/2$. Example: $\sin75^\circ\cos15^\circ=[\sin90^\circ+\sin60^\circ]/2$.</p>
    `, ['Know all half-angle and product-to-sum forms and select signs from the output quadrant.']);

    // Unit 4: Trigonometric graphs.
    extendLesson('unit-4', '1. Sine and cosine transformations', html`
        <p>Factor the whole input: $Bx+C=B(x+C/B)=B(x-h)$, so $h=-C/B$. Parent inputs $0,\pi/2,\pi,3\pi/2,2\pi$ map to $x=h+u/b$; then multiply outputs by $a$ and add $k$.</p>
        <p>Useful phase identities: $\sin(x+\pi/2)=\cos x$, $\cos(x-\pi)=-\cos x$, and sine/cosine repeat after $2\pi$. These explain Practice #94, #95, #98, and related graph matches without plotting every point.</p>
        <div class="example-box"><h4>Transformation check</h4><p>$\sin(2x+\pi/2)=\sin(2(x+\pi/4))$ has amplitude 1, period $\pi$, and shift left $\pi/4$. $-3\cos(x-\pi)+1$ has amplitude 3, period $2\pi$, shift right $\pi$, reflection, and midline 1.</p></div>
    `, ['Factor the entire input before reading phase shift.', 'Use key points and phase identities to match transformed sine/cosine graphs.']);

    extendLesson('unit-4', '2. Tangent, cotangent, secant, and cosecant', html`
        <div class="math-block">$$T_{\tan,\cot}=\frac\pi{|b|},\qquad T_{\sec,\csc}=\frac{2\pi}{|b|}$$</div>
        <ul class="formula-facts"><li>$a\tan(b(x-h))+k$ crosses its midline at $(h,k)$; asymptotes occur one quarter tangent period away.</li><li>$a\cot(b(x-h))+k$ has an asymptote at $x=h$ and a zero relative to its midline halfway to the next asymptote.</li><li>Secant asymptotes occur where partner cosine is zero; cosecant asymptotes occur where partner sine is zero.</li><li>Secant/cosecant range is $(-\infty,k-|a|]\cup[k+|a|,\infty)$.</li></ul>
        <p>$1+\sec2x$ has period $\pi$, asymptotes $x=\pi/4+n\pi/2$, vertices at $y=2$ and $y=0$, and range $(-\infty,0]\cup[2,\infty)$. Parent tangent increases between its asymptotes; $-\tan x$ reflects it across the $x$-axis, so each branch decreases while retaining period $\pi$ and zero 0. Parent cotangent decreases; $-\cot(2x)$ reflects it into increasing branches and compresses its period to $\pi/2$. Also $\cot(x-\pi/2)=-\tan x$ and $\tan(x-\pi)=\tan x$.</p>
    `, ['Tangent/cotangent have no amplitude; use zeros, midlines, orientation, and asymptotes.', 'Secant/cosecant inherit partner periods, zeros, and extrema.']);

    extendLesson('unit-4', '3. Fast graph matching', html`
        <p>For $\tan(4x-\pi/2)=\tan(4(x-\pi/8))$, period is $\pi/4$ and midline crossing is $x=\pi/8$. Contrast $\tan(4x-\pi/8)$, whose shift is only $\pi/32$. Always factor before comparing a graph.</p>
        <p>Confirm symmetry too: sine and tangent are odd; cosine is even. Translations move the symmetry center or axis with the graph.</p>
    `, ['Use one decisive skeleton feature, then verify period and factored phase shift.']);

    extendLesson('unit-4', 'Sinusoidal models and harmonic motion', html`
        <div class="math-block">$$y(t)=D+A\sin(\omega(t-h))\quad\text{or}\quad y(t)=D+A\cos(\omega(t-h)),\qquad T=\frac{2\pi}{|\omega|},\ f=\frac1T$$</div>
        <p>Use $+A\cos$ at a maximum, $-A\cos$ at a minimum, $+A\sin$ at a rising midline, and $-A\sin$ at a falling midline. Check maximum, minimum, period, units, initial value, and initial direction.</p>
        <div class="example-box"><h4>Ferris wheel</h4><p>Minimum 2 m, maximum 34 m, period 40 s, starting at maximum gives $h(t)=18+16\cos(\pi t/20)$. Starting at minimum would use $18-16\cos(\pi t/20)$.</p></div>
        <p><strong>Honors extension:</strong> $D+Ae^{-ct}\cos(\omega t+\phi)$, $c>0$, models damped motion whose amplitude shrinks over time.</p>
    `, ['Frequency is reciprocal period; angular frequency is $2\pi f$.', 'A model sign and phase must match its initial direction.']);

    // Unit 5: Oblique triangles.
    extendLesson('unit-5', 'Area of oblique triangles', html`
        <div class="example-box"><h4>Heron example</h4><p>For sides $13,24,16$, $s=26.5$ and $K=\sqrt{26.5(13.5)(2.5)(10.5)}\approx96.91$ square units. Sides $2,3,6$ fail the triangle inequality, so Heron's Formula does not apply.</p></div>
    `, ['Check the triangle inequality before Heron and report square units.']);

    addLessons('unit-5', [
        makeLesson('Q34 Decision Lab: Choose, Branch, Check, Report', 'Solve SSS, SAS, and every zero/one/two-triangle SSA case in one workflow.', html`
            <p>Label opposite pairs first: $a\leftrightarrow A$, $b\leftrightarrow B$, $c\leftrightarrow C$. Use Cosines for SSS or SAS; use Sines for ASA/AAS; use Sines plus the supplement test for SSA. Keep calculator in degree mode and retain guard digits until final rounding.</p>
            <div class="math-block">$$\frac a{\sin A}=\frac b{\sin B}=\frac c{\sin C},\qquad A+B+C=180^\circ$$</div>
            <div class="math-block">$$a^2=b^2+c^2-2bc\cos A,\quad b^2=a^2+c^2-2ac\cos B,\quad c^2=a^2+b^2-2ab\cos C$$</div>
            <div class="example-box"><h4>SSS: Practice #34(a)</h4><p>Check triangle inequalities. Use Cosines to obtain $A\approx30.31^\circ$, $B\approx111.28^\circ$, then $C\approx38.40^\circ$. Use unrounded values for the angle sum; the largest side 24 correctly faces the largest angle.</p></div>
            <h3>SSA branch algorithm</h3>
            <ol class="overview-list"><li>Use Law of Sines to compute a sine value. If it is above 1, no triangle exists.</li><li>Find principal angle $A_1=\sin^{-1}(s)$.</li><li>Test supplement $A_2=180^\circ-A_1$.</li><li>For each branch, reject any nonpositive remaining angle.</li><li>Use Law of Sines to find the remaining side and check side-angle order.</li></ol>
            <div class="example-box"><h4>SSA: all three outcomes</h4><p>For #34(b), $\sin A=41\sin20^\circ/32$, so $A_1\approx25.99^\circ$ and $A_2\approx154.01^\circ$. The corresponding $(B,b)$ pairs are approximately $(134.01^\circ,67.29)$ and $(5.99^\circ,9.76)$, so both triangles survive. For #34(c), $\sin C=83\sin38^\circ/49\approx1.043>1$, so no triangle exists. For #34(d), $\sin C=31\sin52^\circ/35$ gives $C_1\approx44.26^\circ$ and $C_2\approx135.74^\circ$; the supplement makes $A+C>180^\circ$, so reject it. The valid branch has $B\approx83.74^\circ$ and $b\approx44.15$.</p></div>
            <p>If the principal angle is $90^\circ$, its supplement is the same angle, so count only one triangle.</p>
            <div class="example-box"><h4>ASA/AAS transfer</h4><p>If $A=45^\circ$, $B=65^\circ$, and $a=10$, first find $C=70^\circ$, then use $c=10\sin70^\circ/\sin45^\circ$. No ambiguous branch occurs because two angles are already known.</p></div>
            <div class="example-box"><h4>SAS: Practice #34(e)</h4><p>First use $b^2=a^2+c^2-2ac\cos B$ to get $b\approx16.21$. Recover an angle with Cosines to avoid an ambiguous inverse-sine branch: $A\approx104.92^\circ$, $C\approx51.08^\circ$. Since $a$ is largest, $A$ must be largest and obtuse.</p></div>
            <p>Surveying and navigation problems create the same data patterns: two sight lines plus a measured baseline often give ASA/AAS or SAS. For two force magnitudes with included angle $\theta$, the resultant magnitude follows the Law of Cosines after drawing vectors head-to-tail and identifying the triangle's included angle.</p>
            <div class="mistake-box"><strong>Final checks:</strong> Angles total $180^\circ$; largest side faces largest angle; no sine exceeds 1; no remaining angle is zero/negative; final values use requested precision. Practice #34 explicitly permits a calculator; keep degree mode and guard digits.</div>
        `, ['Choose a law from the known-data pattern.', 'For SSA, always generate and test the supplementary angle.', 'Keep guard digits and verify angle sum plus side-angle order.'])
    ]);

    // Unit 6: Complex numbers, binomials, and probability.
    extendLesson('unit-6', '1. Complex numbers in polar form', html`
        <p>$\operatorname{cis}\theta$ means $\cos\theta+i\sin\theta$. Reverse conversion is $r\operatorname{cis}\theta=(r\cos\theta)+(r\sin\theta)i$. Axis arguments use $0,\pi/2,\pi,3\pi/2$; for example, $-15i=15\operatorname{cis}(3\pi/2)$.</p>
        <p>Arguments are nonunique. Add $2\pi k$, or reverse the radius and add $\pi$. Modulus is always nonnegative.</p>
    `, ['Convert both directions between rectangular and trigonometric form.', 'Handle axis points and nonunique arguments explicitly.']);

    extendLesson('unit-6', '2. Factorials, sigma notation, and binomial terms', html`
        <div class="math-block">$$n!=n(n-1)\cdots2\cdot1,\quad0!=1,\qquad \sum_{k=m}^{n}f(k)=f(m)+f(m+1)+\cdots+f(n)$$</div>
        <p>Both sigma bounds are included. Thus $\sum_{k=2}^{6}(-1)^k(2k)=4-6+8-10+12=8$. Also $(n+1)!=(n+1)n(n-1)!$, so $n(n-1)!/(n+1)!=1/(n+1)$ for positive integer $n$.</p>
        <div class="math-block">$$(a+b)^n=\sum_{r=0}^n\binom nr a^{n-r}b^r,\\ T_{r+1}=\binom nr a^{n-r}b^r$$</div>
        <p>Combination identities: $\binom n0=\binom nn=1$, $\binom n1=n$, and $\binom nr=\binom n{n-r}$. Thus $\binom{500}{50}=\binom{500}{450}$.</p>
        <p>Pascal's Triangle supplies the same coefficients. An expansion has $n+1$ terms, so its one-based middle-term number must be translated to zero-based $r$. For $(\sqrt{x}/4+y^2)^{10}$, the sixth term uses $r=5$ and $(\sqrt{x})^5=x^{5/2}$.</p>
        <div class="example-box"><h4>Sigma table</h4><p>For $\sum_{n=0}^4(n^2+2)/n!$, the terms are $2,3,3,11/6,3/4$, totaling $127/12$.</p></div>
    `, ['Sigma bounds are inclusive and $0!=1$.', 'Use Pascal coefficients or combinations and distinguish term number from index $r$.']);

    extendLesson('unit-6', '3. Counting and binomial probability', html`
        <p><strong>Fundamental Counting Principle:</strong> multiply the number of choices at each independent stage. Use permutations when positions are distinct and combinations when only the selected group matters.</p>
        <p>For exactly 13 successes in 17 independent attempts with $p=.85$, $\binom{17}{13}(.85)^{13}(.15)^4\approx.1457$. “At least” requires a sum from the threshold through $n$ or a complement; “at most” sums from 0 through the threshold.</p>
    `, ['Name and apply the Fundamental Counting Principle.', 'Distinguish exactly, at least, and at most in binomial probability.']);

    extendLesson('unit-6', 'Probability rules', html`
        <div class="example-box"><h4>Complement and exclusivity</h4><p>If a fair die is rolled, $P(\text{at least one 6 in two rolls})=1-(5/6)^2$. Events “roll a 1” and “roll a 2” on one die are mutually exclusive, so their union probability is $1/6+1/6$.</p></div>
    `, ['Use explicit examples to distinguish complements, mutually exclusive events, and independent events.']);

    addLessons('unit-6', [
        makeLesson('Rectangular form, conjugates, and complex-plane geometry', 'Perform Core complex arithmetic and interpret it geometrically.', html`
            <p>For $z=a+bi$, add and subtract real and imaginary parts, distribute when multiplying, and replace $i^2$ with $-1$. The conjugate of $a+bi$ is $a-bi$; multiplying conjugates gives $a^2+b^2$, a real number, so conjugates clear complex denominators.</p>
            <div class="example-box"><h4>Division</h4><p>$\frac{3+4i}{1-2i}\cdot\frac{1+2i}{1+2i}=\frac{-5+10i}{5}=-1+2i$.</p></div>
            <p>Plot $a+bi$ at $(a,b)$. Addition is vector addition, conjugation reflects across the real axis, distance between $z_1,z_2$ is $|z_1-z_2|$, and midpoint is $(z_1+z_2)/2$. Quadratic equations may have conjugate complex roots.</p>
            <div class="quick-check"><strong>Quick check:</strong> Find the distance and midpoint between $-5-12i$ and $1-4i$.</div>
        `, ['Use $i^2=-1$ and conjugates for arithmetic and quotients.', 'Interpret complex addition, conjugation, distance, and midpoint on the plane.'])
    ]);

    // Unit 7: Sequences and series.
    extendLesson('unit-7', '1. Arithmetic and geometric rules', html`
        <p>A sequence is a function whose integer input is an index. Usually $n=1,2,3,\ldots$; a recursive rule states its starting term and applies for $n\ge2$. The Fibonacci sequence is recursive but neither arithmetic nor geometric: $F_1=1$, $F_2=1$, and $F_n=F_{n-1}+F_{n-2}$ for $n\ge3$.</p>
        <p>If $a_5=38$ and $a_9=21$, then $d=(21-38)/(9-5)=-17/4$, so $a_{25}=38+20d=-47$.</p>
        <p>If an even power determines a geometric ratio, check both signs. From $r^4=0.4096$, $r=\pm0.8$ unless the problem states a positive ratio or gives enough intervening terms.</p>
        <div class="example-box"><h4>Models</h4><p>An amount increasing by 25 each month is arithmetic. Equipment retaining 80% of its value each year is geometric: $V_n=1200(0.8)^{n-1}$. Define what index 1 represents before evaluating.</p></div>
    `, ['Treat a sequence as a function on integer indices.', 'Use context or given signs before selecting a geometric ratio.']);

    extendLesson('unit-7', '2. Finite arithmetic and geometric sums', html`
        <p>$S_n$ means $a_1+\cdots+a_n$. Sigma bounds are inclusive. The list $5+9.5+\cdots+68$ can be written $\sum_{n=1}^{15}[5+4.5(n-1)]$. Conversely, $\sum_{n=1}^{500}(3n+5)$ has 500 terms from 8 through 1505.</p>
        <div class="quick-check"><strong>Quick check:</strong> Write $4+7+10+13$ in sigma notation, then evaluate it.</div>
    `, ['Translate both directions between sigma notation and a finite series.', 'Use partial sums in arithmetic and geometric applications.']);

    extendLesson('unit-7', '3. Infinite geometric series', html`
        <p>A finite geometric sum never “diverges”; convergence language applies to the infinite continuation. In a model, explain what the limiting sum represents and whether alternating signs are meaningful.</p>
    `, ['Interpret convergence in context and distinguish finite from infinite sums.']);

    // Unit 8: Conics, parametric equations, and polar curves.
    extendLesson('unit-8', 'Circles and parabolas', html`
        <p>Complete the square with $(x^2+Bx)=(x+B/2)^2-(B/2)^2$. For example, $x^2+y^2+4x-6y-3=0$ becomes $(x+2)^2+(y-3)^2=16$.</p>
        <p>The circle formula follows from the distance formula: every point $(x,y)$ at distance $r$ from $(h,k)$ satisfies $(x-h)^2+(y-k)^2=r^2$.</p>
        <p>A parabola is equidistant from focus and directrix. For focus $(h,k+p)$ and directrix $y=k-p$, equate squared distances: $(x-h)^2+(y-k-p)^2=(y-k+p)^2$. Expanding gives $(x-h)^2=4p(y-k)$. Thus focus $(1,-1)$ and directrix $y=-5$ place the vertex halfway at $(1,-3)$, with $p=2$, giving $(x-1)^2=8(y+3)$. In vertex form $y=a(x-h)^2+k$, $(h,k)$ is the vertex and the sign of $a$ gives opening direction.</p>
    `, ['Complete the square to write circle standard form.', 'Build a parabola equation from its focus, directrix, vertex, and direction.']);

    extendLesson('unit-8', 'Ellipses and hyperbolas', html`
        <div class="math-block">$$\text{Horizontal ellipse: }\frac{(x-h)^2}{a^2}+\frac{(y-k)^2}{b^2}=1,\qquad \text{vertical ellipse: }\frac{(x-h)^2}{b^2}+\frac{(y-k)^2}{a^2}=1$$</div>
        <div class="math-block">$$\text{Horizontal hyperbola: }\frac{(x-h)^2}{a^2}-\frac{(y-k)^2}{b^2}=1,\qquad \text{vertical hyperbola: }\frac{(y-k)^2}{a^2}-\frac{(x-h)^2}{b^2}=1$$</div>
        <p>For ellipses $c^2=a^2-b^2$; for hyperbolas $c^2=a^2+b^2$.</p>
        <p>For an ellipse, the larger denominator determines the major axis; swap coordinates for a vertical major axis. For a hyperbola, the positive term determines horizontal versus vertical opening. A horizontal hyperbola has asymptotes $y-k=\pm(b/a)(x-h)$; a vertical one has $y-k=\pm(a/b)(x-h)$.</p>
        <div class="example-box"><h4>Feature example</h4><p>$\frac{(x-2)^2}{9}-\frac{(y+1)^2}{4}=1$ has center $(2,-1)$, vertices $(2\pm3,-1)$, foci $(2\pm\sqrt{13},-1)$, and asymptotes $y+1=\pm\frac23(x-2)$.</p></div>
        <p>For foci $(\pm c,0)$, setting the sum of focal distances to $2a$ and squaring twice yields $x^2/a^2+y^2/b^2=1$ with $b^2=a^2-c^2$. Setting the absolute difference to $2a$ yields $x^2/a^2-y^2/b^2=1$ with $b^2=c^2-a^2$. Translating the center replaces $x,y$ with $x-h,y-k$; swapping axes gives the vertical forms.</p>
    `, ['Write both orientations and locate vertices, co-vertices, foci, and asymptotes.', 'Connect ellipse/hyperbola standard forms to their focal definitions.']);

    extendLesson('unit-8', '1. Parametric equations and restrictions', html`
        <p>Before eliminating $t$, make a table of $t,x,y$, plot in increasing-$t$ order, mark starting/ending points, and add direction arrows. Record whether an interval is bounded and whether the curve retraces.</p>
        <p>For $x=1+2\sin t$, $y=-1+3\cos t$, divide to get $(x-1)/2=\sin t$ and $(y+1)/3=\cos t$; squaring and adding gives $(x-1)^2/4+(y+1)^2/9=1$. A plotting table gives $(1,2)$ at $t=0$, $(3,-1)$ at $\pi/2$, $(1,-4)$ at $\pi$, and $(-1,-1)$ at $3\pi/2$, then returns to $(1,2)$ at $2\pi$. Connecting in that order supplies orientation.</p>
        <p>For $x=3t^2$, $y=1-2t^2$, elimination gives $y=1-2x/3$ with $x\ge0$. As $t$ runs from negative to positive, the ray is traced toward its endpoint and then retraced.</p>
    `, ['Graph parametric curves from tables, intervals, endpoints, and direction.', 'Use Pythagorean identities to eliminate trig parameters without losing orientation.']);

    extendLesson('unit-8', '2. Polar and rectangular coordinates', html`
        <p>To plot $(r,\theta)$, move $|r|$ units on angle $\theta$ when $r>0$, or opposite that ray when $r<0$. Equivalent pairs include $(r,\theta+2\pi k)$ and $(-r,\theta+(2k+1)\pi)$.</p>
        <div class="quick-check"><strong>Quick check:</strong> Explain why $(-3,\pi/2)$ and $(3,3\pi/2)$ name the same point.</div>
    `, ['Plot polar points and generate equivalent coordinate pairs.']);

    extendLesson('unit-8', '3. Sketching polar curves', html`
        <ol class="overview-list"><li>Test symmetry about the axes and pole.</li><li>Find $r=0$ and key axis angles.</li><li>Find largest radii and note negative-radius reversals.</li><li>Build a small $\theta,r$ table.</li><li>Plot in increasing-angle order and connect each loop or petal.</li></ol>
        <p>For positive $a,b$ in $r=a+b\sin\theta$ or $a+b\cos\theta$: $a>2b$ is convex, $a=2b$ is the transition, $a=b$ is a cardioid, $b<a<2b$ is dimpled, and $0<a<b$ has an inner loop. Sine forms have usual $y$-axis symmetry; cosine forms have usual $x$-axis symmetry.</p>
        <p>For $r=3+4\sin\theta$, the table $(\theta,r)=(0,3),(\pi/2,7),(\pi,3),(3\pi/2,-1),(2\pi,3)$ shows the outer bulge and negative-radius inner loop; solving $\sin\theta=-3/4$ gives the two pole crossings. For $r=5\cos2\theta$, zeros occur at odd multiples of $\pi/4$, while $(0,5),(\pi/2,-5),(\pi,5),(3\pi/2,-5)$ place four petal tips on the coordinate axes.</p>
    `, ['Use symmetry, zeros, extrema, and a table to execute a polar sketch.', 'Classify convex, dimpled, cardioid, and inner-loop limaçons.']);

    // Unit 9: Limits and introductory derivatives.
    extendLesson('unit-9', 'Graphical, one-sided, and piecewise limits', html`
        <div class="example-box"><h4>Point value versus limit</h4><p>Let $f(x)=x+1$ for $x<2$, $f(2)=5$, and $f(x)=x^2-1$ for $x>2$. Both one-sided limits are 3, so $\lim_{x\to2}f(x)=3$ even though the filled point is $(2,5)$. A graph shows an open circle at $(2,3)$ and filled point at $(2,5)$.</p></div>
        <p>When a denominator approaches zero with nonzero numerator, inspect signs from both sides before reporting $+\infty$, $-\infty$, or a nonexistent two-sided limit.</p>
    `, ['Read open/closed points and one-sided approach values independently.']);

    extendLesson('unit-9', 'Difference quotient and average rate of change', html`
        <p>For $f(x)=x^2$, average rate on $[1,3]$ is $(9-1)/(3-1)=4$. Instantaneous rate at 3 is $f'(3)=6$, so the tangent line through $(3,9)$ is $y-9=6(x-3)$. Keep $h\ne0$ while canceling in a difference quotient; only then take $h\to0$.</p>
    `, ['Connect average rate, derivative limit, tangent slope, and tangent equation in one example.']);

    extendLesson('unit-9', '1. Limits by substitution and algebra', html`
        <p>Use $a^3+b^3=(a+b)(a^2-ab+b^2)$ and $a^3-b^3=(a-b)(a^2+ab+b^2)$ for cubic $0/0$ forms. For radicals, multiply by the conjugate; $\frac{\sqrt{x+4}-3}{x-5}$ becomes $1/(\sqrt{x+4}+3)$ near $x=5$, so its limit is $1/6$.</p>
        <p>For a complex fractional numerator, combine it first. In Practice #79, $6/(x-3)-4/x=2(x+6)/[x(x-3)]$, allowing the factor $x+6$ to cancel before substitution.</p>
    `, ['Recognize sum/difference of cubes, conjugates, and complex-fraction simplification as limit tools.']);

    extendLesson('unit-9', '2. Limits at infinity', html`
        <p>When numerator degree is higher, inspect the leading-term quotient for sign and power. $(x^4+1)/(x^2+5)$ behaves like $x^2$, so it diverges to $+\infty$. Infinity describes unbounded behavior, not a finite real limit.</p>
    `, ['State the sign of unbounded end behavior and distinguish it from a finite limit.']);

    extendLesson('unit-9', '3. Derivative rules', html`
        <div class="math-block">$$(uv)'=u'v+uv',\qquad \left(\frac uv\right)'=\frac{u'v-uv'}{v^2},\quad v\ne0$$</div>
        <p>For $4x^5\sin x$, Product Rule gives $20x^4\sin x+4x^5\cos x$. For $\cos x/x^3$, Quotient Rule gives $[-x^3\sin x-3x^2\cos x]/x^6=(-x\sin x-3\cos x)/x^4$.</p>
        <p>Fractional and negative powers use the same Power Rule on differentiable domain intervals. Constants such as $\pi^3$ have derivative 0.</p>
    `, ['Write and apply Product and Quotient Rule formulas.', 'Respect the original function and derivative domains.']);

    extendLesson('unit-9', '4. Tangent lines and horizontal tangents', html`
        <p>For a trig product such as $g(x)=\cos x\sin x$, Product Rule gives $g'(x)=\cos^2x-\sin^2x=\cos2x$. Solve $\cos2x=0$ over the full doubled interval, divide back, then substitute each angle into $g$ for complete horizontal-tangent coordinates.</p>
    `, ['Horizontal-tangent problems may require a trig equation after differentiation.']);

    extendLesson('unit-9', 'Higher-order derivatives and concavity', html`
        <p>$f'''=(f'')'$ and $f^{(n)}=d^nf/dx^n$. For $f(x)=x^4$, successive derivatives are $4x^3$, $12x^2$, $24x$, and 24. In motion, position differentiates to velocity, velocity to acceleration, and acceleration to jerk.</p>
    `, ['Compute third and higher derivatives and interpret repeated rates of change.']);

    // Explicit, validated routing. Every question must resolve to exactly one lesson.
    const questionByNumber = new Map();
    precalculusData.units.forEach(unit => {
        unit.questions.forEach(question => {
            const number = Number(question.source.match(/#(\d+)/)?.[1]);
            if (!number || questionByNumber.has(number)) throw new Error(`Invalid or duplicate practice number: ${question.source}`);
            questionByNumber.set(number, question);
        });
    });

    const assignments = [
        ['unit-1', '1. Polynomial zeros and end behavior', [1, 72]],
        ['unit-1', '2. Rational functions: restrictions, holes, and asymptotes', [2, 3]],
        ['unit-1', 'Exponential transformations, evaluation, and end behavior', [4, 68, 69]],
        ['unit-1', 'Logarithm transformations, domains, and end behavior', [5, 70, 71]],
        ['unit-1', 'Logarithm identities, evaluation, and change of base', [6, 7, 8, 9]],
        ['unit-1', 'Domain-first logarithmic equations', [10, 12, 13, 14, 15]],
        ['unit-1', '4. Log rules and solving equations', [11]],
        ['unit-2', '1. Degrees, radians, and the unit circle', [16, 17]],
        ['unit-2', '2. Exact trig and inverse trig', [18, 21, 24]],
        ['unit-2', '3. Basic trig equations and ranges', [19, 22]],
        ['unit-3', '1. Identity toolkit', [20]],
        ['unit-2', '4. Coordinates and right-triangle applications', [23, 25]],
        ['unit-3', '2. Simplifying trig expressions', [26, 27, 28, 29]],
        ['unit-3', '3. Solving nonlinear trig equations', [30]],
        ['unit-4', '3. Fast graph matching', [31]],
        ['unit-4', '1. Sine and cosine transformations', [32, 73, 74, 94, 95, 98, 99, 101]],
        ['unit-4', '2. Tangent, cotangent, secant, and cosecant', [33, 96, 97, 100, 102]],
        ['unit-5', 'Q34 Decision Lab: Choose, Branch, Check, Report', [34]],
        ['unit-6', '1. Complex numbers in polar form', [35, 36, 104, 105]],
        ['unit-6', '2. Factorials, sigma notation, and binomial terms', [37, 38, 39, 40, 41, 42, 43, 44, 103]],
        ['unit-6', '3. Counting and binomial probability', [54, 55, 56]],
        ['unit-7', '1. Arithmetic and geometric rules', [45, 46, 47, 48, 49, 50]],
        ['unit-7', '2. Finite arithmetic and geometric sums', [51, 52, 53, 106, 107]],
        ['unit-7', '3. Infinite geometric series', [108]],
        ['unit-8', '1. Parametric equations and restrictions', [57, 58, 59, 60]],
        ['unit-8', '2. Polar and rectangular coordinates', [61, 62]],
        ['unit-8', '3. Sketching polar curves', [63, 64, 65]],
        ['unit-8', 'Circles and parabolas', [66, 67]],
        ['unit-9', '1. Limits by substitution and algebra', [75, 76, 77, 78, 79]],
        ['unit-9', '2. Limits at infinity', [80, 81, 82]],
        ['unit-9', 'Difference quotient and average rate of change', [83]],
        ['unit-9', '3. Derivative rules', [84, 85, 86, 87, 88, 89]],
        ['unit-9', '4. Tangent lines and horizontal tangents', [90, 91, 92, 93]]
    ];

    const assignedNumbers = new Set();
    assignments.forEach(([guideUnitId, guideLesson, numbers]) => {
        findLesson(guideUnitId, guideLesson);
        numbers.forEach(number => {
            const question = questionByNumber.get(number);
            if (!question) throw new Error(`Guide assignment references missing Practice #${number}`);
            if (assignedNumbers.has(number)) throw new Error(`Practice #${number} has multiple guide assignments`);
            question.guideUnitId = guideUnitId;
            question.guideLesson = guideLesson;
            assignedNumbers.add(number);
        });
    });

    if (assignedNumbers.size !== questionByNumber.size) {
        const missing = [...questionByNumber.keys()].filter(number => !assignedNumbers.has(number));
        throw new Error(`Practice questions missing guide assignments: ${missing.join(', ')}`);
    }
}
