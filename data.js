// Honors Precalculus curriculum and final-exam review bank.
// The review questions are adapted from the supplied 108-question packet.

const definitions = {
    "Function fundamentals": "A function assigns exactly one output to each allowed input; its domain is the set of allowed inputs and its range is the set of outputs.",
    "Zeros and multiplicity": "A zero makes a function equal to zero. Its multiplicity is the exponent on the corresponding factor.",
    "Rational functions": "A rational function is a quotient of polynomials; denominator zeros create restrictions.",
    "Exponential functions": "An exponential function has its variable in an exponent.",
    "Logarithms": "A logarithm answers: what exponent on the base produces this number?",
    "Unit circle": "The unit circle has radius 1, so a point at angle theta has coordinates $(\\cos\\theta,\\sin\\theta)$.",
    "Trig equations": "A trigonometric equation asks for every angle in the stated interval that makes the equation true.",
    "Trig identities": "An identity is an equation true for every value in the common domain of both sides.",
    "Trig graphs": "Amplitude, period, phase shift, and midline determine a transformed trigonometric graph.",
    "Triangles": "Use the Law of Sines or Law of Cosines when a right-triangle ratio is not enough.",
    "Complex numbers": "A complex number $a+bi$ corresponds to the point $(a,b)$ and has modulus $\\sqrt{a^2+b^2}$.",
    "Binomial theorem": "The Binomial Theorem uses combination coefficients to expand $(a+b)^n$.",
    "Counting and probability": "Permutations count ordered choices; combinations count unordered choices.",
    "Conic sections": "Circles, parabolas, ellipses, and hyperbolas are curves formed by slicing a double cone.",
    "Sequences": "A sequence is an ordered list; arithmetic sequences have a common difference and geometric sequences have a common ratio.",
    "Series": "A series is a sum of sequence terms.",
    "Parametric equations": "Parametric equations express both $x$ and $y$ in terms of a third variable.",
    "Polar coordinates": "A polar point $(r,\\theta)$ is located $|r|$ units from the pole at angle $\\theta$, reversing direction when $r<0$.",
    "Limits": "A limit describes the value a function approaches as its input approaches a target.",
    "Derivatives": "A derivative is an instantaneous rate of change and the slope of a tangent line."
};

const lesson = (title, purpose, content, takeaways, level = "Core") => ({ title, purpose, content, takeaways, level });
const honorsReviewNumbers = new Set([
    30, 35, 36, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
    80, 81, 82, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 104, 105
]);
const question = (id, topic, text, options, correctIndex, explanation, difficulty = "Final review", source = "", curriculumLevel = "Core") => ({
    id, topic, text, options, correctIndex, explanation, difficulty, source, curriculumLevel, definition: definitions[topic] || ""
});
const rq = (unit, number, topic, text, options, correctIndex, explanation, difficulty = "Final review") =>
    question(`q${unit}_${number}`, topic, text, options, correctIndex, explanation, difficulty, `Final review #${number}`, honorsReviewNumbers.has(number) ? "Honors" : "Core");

const note = (title, body) => `<div class="example-box"><h4>${title}</h4>${body}</div>`;
const warn = body => `<div class="mistake-box"><strong>Common mix-up:</strong> ${body}</div>`;
const check = (prompt, answer) => `<div class="quick-check"><strong>Quick check:</strong> ${prompt}<details><summary>Show answer</summary>${answer}</details></div>`;

export const precalculusData = {
    title: "Honors Precalculus",
    subtitle: "Final exam review, guided notes, interactives, and worked practice",
    reference: "Built from the supplied Honors Precalculus final review, answer key, and exam-provided formula sheet.",
    curriculum: {
        title: "Precalculus and Honors Precalculus Curriculum - Grades 10-12 - 2024",
        officialUnits: 6,
        note: "The district marks Honors-only content with an asterisk. This site labels the same material as Honors."
    },
    units: [
        {
            id: "unit-1",
            title: "Functions, Rational Models, Exponents & Logs",
            subtitle: "Function foundations, polynomials, rational functions, exponentials, and logarithms",
            curriculumUnit: "Official Units I-II",
            curriculumLevel: "Core + Honors",
            overview: "Analyze, transform, combine, and invert functions; then connect quadratic, polynomial, rational, exponential, and logarithmic forms to their graphs and models.",
            essentialQuestions: ["How do domain, range, symmetry, and transformations describe a function?", "How do composition and inverses connect functions?", "How do factors and polynomial theorems predict zeros and end behavior?", "How do rational, exponential, and logarithmic forms encode restrictions and models?"],
            vocabulary: [["Multiplicity", "The number of times a zero's factor occurs."], ["End behavior", "What $f(x)$ approaches as $x\\to\\infty$ or $x\\to-\\infty$."], ["Hole", "A removable discontinuity caused by a canceled factor."], ["Asymptote", "A line a graph approaches."], ["Logarithm", "The inverse operation of exponentiation."], ["Extraneous solution", "A proposed answer that fails the original equation or its domain."]],
            lessons: [
                lesson("1. Polynomial zeros and end behavior", "Read a factored polynomial before doing any expansion.", `
                    <p>For $f(x)=a(x-r_1)^{m_1}\\cdots(x-r_k)^{m_k}$, the zeros are the $r_i$ values and the multiplicities are the exponents $m_i$. An odd multiplicity crosses the axis; an even multiplicity touches and turns.</p>
                    <p>For end behavior, multiply only the leading pieces. The sign of the leading coefficient and whether the degree is even or odd determine the two ends.</p>
                    ${note("Worked example", "<p>For $-(x-3)^2(x+1)^3(x+5)$, the zeros are $3,-1,-5$ with multiplicities $2,3,1$. The leading term is $-x^6$, so both ends fall.</p>")}
                    ${warn("Do not confuse a factor's sign with its zero: $x+5=0$ gives $x=-5$.")}
                    ${check("What does multiplicity 2 do at a zero?", "The graph touches the axis and turns instead of crossing.")}
                `, ["Factors reveal zeros and multiplicity.", "Leading term alone controls end behavior.", "Even multiplicity touches; odd multiplicity crosses."]),
                lesson("2. Rational functions: restrictions, holes, and asymptotes", "Factor first, but keep the original restrictions.", `
                    <p>Factor numerator and denominator completely. Every zero of the original denominator is excluded from the domain. A factor that cancels creates a hole; a factor left in the denominator creates a vertical asymptote.</p>
                    <p>For horizontal asymptotes, compare degrees: numerator degree lower gives $y=0$; equal degrees give the ratio of leading coefficients; numerator degree higher gives no horizontal asymptote.</p>
                    ${note("Worked example", "<p>$\\frac{4x^2-8x-12}{x^2+5x-24}=\\frac{4(x-3)(x+1)}{(x+8)(x-3)}$. There is a hole at $x=3$, a vertical asymptote at $x=-8$, and horizontal asymptote $y=4$. Substituting $x=3$ into $\\frac{4(x+1)}{x+8}$ gives the hole $(3,16/11)$.</p>")}
                    ${warn("Canceling a factor does not put that input back into the domain.")}
                    ${check("Equal degrees with leading coefficients 6 and 2 give what horizontal asymptote?", "$y=3$.")}
                `, ["Original denominator zeros stay excluded.", "Canceled factor means hole.", "Uncanceled denominator factor means vertical asymptote."]),
                lesson("3. Exponential and logarithmic graphs", "Use transformations to read domains, ranges, and asymptotes.", `
                    <p>An exponential $b^x$ has domain all real numbers, range $(0,\\infty)$, and horizontal asymptote $y=0$. A logarithm $\\log_b x$ has domain $(0,\\infty)$, range all real numbers, and vertical asymptote $x=0$.</p>
                    <p>Transformations move those features. For $\\ln(x-h)+k$, the vertical asymptote is $x=h$, so the domain is $x>h$. For $a b^{x-h}+k$, the horizontal asymptote is $y=k$.</p>
                    ${note("Worked example", "<p>For $f(x)=\\ln(x+2)+1$, the vertical asymptote is $x=-2$, the domain is $(-2,\\infty)$, and the range is all real numbers. Setting $f(x)=0$ gives $x=e^{-1}-2$.</p>")}
                    ${warn("A logarithm's argument must be strictly positive, not merely nonnegative.")}
                `, ["Exponential and logarithmic functions are inverses.", "A log shift changes its vertical asymptote.", "A transformed exponential approaches its vertical shift."]),
                lesson("4. Log rules and solving equations", "Expand, condense, change bases, and verify domains.", `
                    <div class="math-block">$$\\log_b(MN)=\\log_bM+\\log_bN,\\quad \\log_b(M/N)=\\log_bM-\\log_bN,\\quad \\log_b(M^p)=p\\log_bM$$</div>
                    <p>The change-of-base formula is $\\log_ba=\\frac{\\ln a}{\\ln b}$. When equal logs with the same base appear, their arguments are equal only after confirming every original argument is positive.</p>
                    ${note("Worked example", "<p>$\\ln x+\\ln(x+2)=\\ln15$ becomes $x(x+2)=15$. The candidates are $3$ and $-5$, but $-5$ makes both original logs invalid, so only $x=3$ remains.</p>")}
                    ${warn("A ratio can be positive while its numerator and denominator are both negative, but separate logarithms of those negative quantities are still undefined.")}
                    ${check("Solve $e^{2x}=5$.", "$x=\\frac{\\ln5}{2}$.")}
                `, ["Products become sums and powers become coefficients.", "Change of base works with any common valid log base.", "Check every answer in the original logarithms."])
            ],
            questions: []
        },
        {
            id: "unit-2",
            title: "Trig Foundations & the Unit Circle",
            subtitle: "Angles, exact values, inverse trig, ranges, and applications",
            curriculumUnit: "Official Unit III",
            curriculumLevel: "Core",
            overview: "Move fluently between degrees and radians, connect circular motion to arc length, use exact trig values and inverse trig, and model right-triangle situations.",
            essentialQuestions: ["How does the unit circle encode sine and cosine?", "How are radian measure, arc length, and angular speed connected?", "Why do inverse trig functions use restricted ranges?", "How do angle of elevation and depression create triangles?"],
            vocabulary: [["Radian", "An angle measure based on arc length over radius."], ["Reference angle", "The acute angle between a terminal side and the $x$-axis."], ["Coterminal", "Angles with the same terminal side."], ["Inverse trig", "A function returning a principal angle from a trig ratio."], ["Amplitude", "Half the distance from a sinusoid's maximum to minimum."], ["Angle of depression", "An angle measured downward from a horizontal line."]],
            lessons: [
                lesson("1. Degrees, radians, and the unit circle", "Convert angle units and locate terminal sides.", `
                    <p>One full turn is $360^\\circ=2\\pi$ radians. Multiply degrees by $\\pi/180$ to get radians; multiply radians by $180/\\pi$ to get degrees.</p>
                    <p>On the unit circle, the point at angle $\\theta$ is $(\\cos\\theta,\\sin\\theta)$. Use the reference angle for the magnitude and the quadrant for the sign.</p>
                    ${note("Worked example", "<p>$260^\\circ\\cdot\\frac{\\pi}{180^\\circ}=\\frac{13\\pi}{9}$. For $7\\pi/6$, the reference angle is $\\pi/6$ in Quadrant III, so cosine is $-\\sqrt3/2$.</p>")}
                    ${check("Convert $-5\\pi/12$ to degrees.", "$-75^\\circ$.")}
                `, ["Cancel the old angle unit.", "Coordinates are cosine then sine.", "Quadrant controls the sign."]),
                lesson("2. Exact trig and inverse trig", "Use reciprocal identities and principal-value ranges.", `
                    <p>$\\sec\\theta=1/\\cos\\theta$, $\\csc\\theta=1/\\sin\\theta$, and $\\cot\\theta=\\cos\\theta/\\sin\\theta$. Reduce large angles by whole turns before evaluating.</p>
                    <p>Principal ranges: $\\arcsin x\\in[-\\pi/2,\\pi/2]$, $\\arccos x\\in[0,\\pi]$, and $\\arctan x\\in(-\\pi/2,\\pi/2)$.</p>
                    ${note("Worked example", "<p>$\\tan690^\\circ=\\tan330^\\circ=-\\sqrt3/3$. Also, $\\arccos(-\\sqrt3/2)=5\\pi/6$ because cosine is negative in Quadrant II within arccos's range.</p>")}
                    ${warn("Inverse notation $\\sin^{-1}$ means arcsine, not the reciprocal $\\csc$.")}
                `, ["Reciprocal functions may be undefined.", "Use principal ranges for inverse trig.", "Exact values should stay in radical form."]),
                lesson("3. Basic trig equations and ranges", "Find every solution in the stated interval.", `
                    <p>First find the reference angle. Then use the trig sign to select quadrants, and finally respect interval endpoints. For equations such as $\\sin\\theta=0$, list every axis angle that belongs to the interval.</p>
                    <p>The range of $a\\sin x+k$ or $a\\cos x+k$ is $[k-|a|,k+|a|]$. Tangent has all-real range. For secant and cosecant, transform the outside branches rather than filling the gap.</p>
                    ${note("Worked example", "<p>$\\tan\\theta=-1$ on $(0^\\circ,360^\\circ]$ has reference angle $45^\\circ$ and is negative in Quadrants II and IV, so $\\theta=135^\\circ,315^\\circ$.</p>")}
                    ${warn("Check whether the interval includes $0$, $2\\pi$, both, or neither.")}
                `, ["Reference angle plus quadrant gives the solutions.", "Interval notation controls endpoints.", "Amplitude and midline give sine/cosine range."]),
                lesson("4. Coordinates and right-triangle applications", "Build a triangle from coordinates or a word problem.", `
                    <p>For a terminal point $(x,y)$, $r=\\sqrt{x^2+y^2}$, $\\cos\\theta=x/r$, and $\\sin\\theta=y/r$. Use the signs to choose the quadrant.</p>
                    <p>For an angle of depression, draw the horizontal through the observer. Alternate interior angles make the depression angle equal to the angle of elevation from the ground point.</p>
                    ${note("Worked example", "<p>At a $15^\\circ$ angle of depression from altitude $1450$ ft, the line-of-sight distance $d$ satisfies $\\sin15^\\circ=1450/d$, so $d\\approx5602.37$ ft.</p>")}
                `, ["Compute $r$ before trig ratios.", "A negative radius reverses a polar direction, but Cartesian $r$ is nonnegative.", "Label opposite, adjacent, and hypotenuse from the chosen angle."])
            ],
            questions: []
        },
        {
            id: "unit-3",
            title: "Trig Identities & Equations",
            subtitle: "Pythagorean identities, simplification, and multi-step solving",
            curriculumUnit: "Official Unit III",
            curriculumLevel: "Core + Honors",
            overview: "Use fundamental, sum/difference, and multiple-angle identities to simplify, verify, evaluate, and solve trigonometric expressions and equations.",
            essentialQuestions: ["Which identity changes the expression into a useful form?", "How is an identity verified without solving it?", "How do sum, difference, double-angle, and half-angle formulas create exact values?", "How do factoring and interval checks produce every solution?"],
            vocabulary: [["Pythagorean identity", "One of the three identities derived from $\\sin^2x+\\cos^2x=1$."], ["Reciprocal identity", "An identity connecting sine/cosine with cosecant/secant."], ["Factor", "A quantity multiplied by another; a zero product creates cases."], ["General solution", "A family of all periodic solutions."], ["Restricted interval", "The exact window in which answers must be listed."]],
            lessons: [
                lesson("1. Identity toolkit", "Recognize reciprocal, quotient, and Pythagorean forms.", `
                    <div class="math-block">$$\\sin^2x+\\cos^2x=1,\\quad 1+\\tan^2x=\\sec^2x,\\quad 1+\\cot^2x=\\csc^2x$$</div>
                    <p>Also use $\\tan x=\\sin x/\\cos x$, $\\cot x=\\cos x/\\sin x$, and the reciprocal identities. These are on the provided formula sheet, so the skill is choosing and applying them.</p>
                    ${check("Rewrite $1-\\csc^2x$.", "$-\\cot^2x$.")}
                `, ["The formula sheet supplies the identities.", "Rewrite toward a common function.", "Keep domain restrictions in mind."]),
                lesson("2. Simplifying trig expressions", "Use factoring and common denominators before expanding blindly.", `
                    <p>Convert tangent, cotangent, secant, and cosecant to sine and cosine when a simplification is hidden. For sums of fractions, use a common denominator and look for $\\sin^2x+\\cos^2x$.</p>
                    ${note("Worked example", "<p>$\\frac{\\csc x}{\\tan x+\\cot x}=\\frac{1/\\sin x}{\\sin x/\\cos x+\\cos x/\\sin x}=\\frac{1/\\sin x}{1/(\\sin x\\cos x)}=\\cos x$.</p>")}
                    ${warn("An identity may be true only where both original sides are defined.")}
                `, ["Convert to sine and cosine when stuck.", "Factor perfect-square patterns.", "Simplify only after forming a valid common denominator."]),
                lesson("3. Solving nonlinear trig equations", "Factor, split cases, and use the entire interval.", `
                    <p>Move all terms to one side, factor, then solve each factor. If both $\\tan x$ and $\\sec x$ appear, use $\\tan^2x=\\sec^2x-1$. If a double angle appears, solve for the doubled angle across its doubled interval before dividing.</p>
                    ${note("Worked example", "<p>$2\\sin^2x+\\sin x=0$ factors as $\\sin x(2\\sin x+1)=0$. On $[0,2\\pi)$ this gives $0,\\pi,7\\pi/6,11\\pi/6$.</p>")}
                    ${warn("Dividing by a trig expression can erase solutions where that expression equals zero.")}
                `, ["Zero-product property creates separate cases.", "Double-angle equations may produce twice as many angles.", "Check domain and interval after solving."])
            ],
            questions: []
        },
        {
            id: "unit-4",
            title: "Trigonometric Graphs",
            subtitle: "Sine, cosine, tangent, cotangent, secant, and transformations",
            curriculumUnit: "Official Unit III",
            curriculumLevel: "Core",
            overview: "Read equations from graphs and graphs from equations using period, phase shift, midline, amplitude, zeros, and asymptotes, then build sinusoidal models.",
            essentialQuestions: ["How does the coefficient of $x$ change period?", "How does an inside shift move key points and asymptotes?", "How are secant and cosecant built from cosine and sine?", "How do extrema and cycle time determine a periodic model?"],
            vocabulary: [["Amplitude", "$|a|$ in $a\\sin(b(x-h))+k$ or $a\\cos(b(x-h))+k$."], ["Period", "$2\\pi/|b|$ for sine/cosine and $\\pi/|b|$ for tangent/cotangent."], ["Phase shift", "The horizontal shift $h$."], ["Midline", "The horizontal center line $y=k$."], ["Vertical asymptote", "A vertical line approached by tangent, cotangent, secant, or cosecant branches."]],
            lessons: [
                lesson("1. Sine and cosine transformations", "Plot five key points per cycle.", `
                    <p>For $y=a\\sin(b(x-h))+k$ or cosine, amplitude is $|a|$, period is $2\\pi/|b|$, phase shift is $h$, and midline is $y=k$. Divide a period into four equal steps.</p>
                    ${note("Worked example", "<p>$-\\cos(2(x+\\pi/2))=-\\cos(2x+\\pi)=\\cos2x$, so it starts at a maximum and has period $\\pi$.</p>")}
                    ${warn("Factor $b$ from the entire inside expression before reading the phase shift.")}
                `, ["Period comes from $b$.", "The sign of $a$ reflects the graph.", "A shift moves every key point."]),
                lesson("2. Tangent, cotangent, secant, and cosecant", "Use zeros and asymptotes as the skeleton.", `
                    <p>Tangent and cotangent have period $\\pi/|b|$. Tangent crosses at its phase shift; cotangent has an asymptote there. Secant is the reciprocal of cosine and cosecant is the reciprocal of sine, so their asymptotes occur where the partner function is zero.</p>
                    ${note("Worked example", "<p>For $1+\\sec(2x)$, the secant period is $\\pi$, the midline shift is up 1, and vertical asymptotes occur where $\\cos2x=0$.</p>")}
                `, ["Reciprocal graphs inherit partner extrema.", "Zeros of sine/cosine become reciprocal asymptotes.", "Tangent and cotangent repeat every $\\pi$ before scaling."]),
                lesson("3. Fast graph matching", "Eliminate choices using one feature at a time.", `
                    <p>Start with function family, then period, reflection, phase shift, and midline. A single unmistakable feature—such as a tangent zero or a cosine maximum—often identifies the graph without plotting a full cycle.</p>
                    ${check("What is the period of $-\\cot(2x)$?", "$\\pi/2$.")}
                `, ["Family first, transformation second.", "Use asymptotes for tangent-family graphs.", "Use starts, peaks, and midline crossings for sine-family graphs."])
            ],
            questions: []
        },
        {
            id: "unit-5",
            title: "Oblique Triangles",
            subtitle: "Law of Sines, Law of Cosines, and the ambiguous case",
            curriculumUnit: "Official Unit III",
            curriculumLevel: "Core",
            overview: "Solve non-right triangles from SSS, SAS, ASA/AAS, or SSA data, decide whether zero, one, or two triangles exist, and find area from SAS or SSS information.",
            essentialQuestions: ["Which law matches the information given?", "Why can SSA produce two triangles?", "How do angle and side checks reject impossible triangles?", "When should area use sine or Heron's Formula?"],
            vocabulary: [["Included angle", "The angle between two known sides."], ["SSA", "Two sides and a non-included angle; the ambiguous case."], ["SAS", "Two sides and their included angle."], ["Law of Sines", "$a/\\sin A=b/\\sin B=c/\\sin C$."], ["Law of Cosines", "$c^2=a^2+b^2-2ab\\cos C$."]],
            lessons: [
                lesson("1. Choosing a triangle law", "Match the method to the known parts.", `
                    <p>Use Law of Cosines first for SSS or SAS. Use Law of Sines when you know an angle-opposite side pair, as in ASA, AAS, or SSA.</p>
                    ${note("Worked example", "<p>With sides $13,24,16$, use Law of Cosines to find the largest angle first. Solving gives approximately $A=30.31^\\circ$, $B=111.28^\\circ$, and $C=38.41^\\circ$.</p>")}
                `, ["SSS/SAS starts with cosine.", "A known opposite pair unlocks sine.", "Angles must total $180^\\circ$."]),
                lesson("2. The SSA ambiguous case", "Test the supplement before deciding how many triangles exist.", `
                    <p>When inverse sine gives an angle $A_1$, the second possibility is $A_2=180^\\circ-A_1$. Keep it only if the remaining angle is positive and the side-angle ordering is sensible.</p>
                    ${note("Worked example", "<p>For $a=41,c=32,C=20^\\circ$, Law of Sines gives $A\\approx25.99^\\circ$ or $154.01^\\circ$, so two triangles exist. For $b=49,c=83,B=38^\\circ$, the computed sine exceeds 1, so no triangle exists.</p>")}
                    ${warn("A calculator's inverse-sine result is only the first possible angle in SSA.")}
                `, ["Check both $A$ and $180^\\circ-A$.", "A sine value above 1 means no triangle.", "Largest side must face largest angle."])
            ],
            questions: []
        },
        {
            id: "unit-6",
            title: "Complex Numbers, Binomials & Probability",
            subtitle: "Polar form, sigma notation, combinations, and binomial probability",
            curriculumUnit: "Official Units III-IV",
            curriculumLevel: "Core + Honors",
            overview: "Represent and operate on complex numbers, expand binomials, evaluate factorial expressions, and distinguish counting, general probability, and binomial probability models.",
            essentialQuestions: ["How do rectangular and polar forms simplify different complex operations?", "How do binomial coefficients locate a requested term?", "When does order matter?", "How are complements, unions, intersections, and independence different?"],
            vocabulary: [["Modulus", "Distance of a complex number from the origin."], ["Argument", "The angle of a complex number in the plane."], ["Trigonometric form", "$r(\\cos\\theta+i\\sin\\theta)$."], ["Combination", "An unordered selection."], ["Permutation", "An ordered arrangement."], ["Binomial probability", "$\\binom nkp^k(1-p)^{n-k}$."]],
            lessons: [
                lesson("1. Complex numbers in polar form", "Use a triangle and quadrant to find modulus and argument.", `
                    <p>For $z=a+bi$, plot $(a,b)$, compute $r=\\sqrt{a^2+b^2}$, and choose an argument $\\theta$ in the correct quadrant. Then $z=r(\\cos\\theta+i\\sin\\theta)$.</p>
                    ${note("Worked example", "<p>$-4+4\\sqrt3i$ has modulus $8$ and lies in Quadrant II with reference angle $\\pi/3$, so it is $8(\\cos(2\\pi/3)+i\\sin(2\\pi/3))$.</p>")}
                `, ["Modulus is always nonnegative.", "Use both signs to select the quadrant.", "Coterminal arguments describe the same complex number."]),
                lesson("2. Factorials, sigma notation, and binomial terms", "Read indices carefully and use combinations as coefficients.", `
                    <p>$\\binom nr=\\frac{n!}{r!(n-r)!}$. In $(a+b)^n$, the general term is $\\binom nr a^{n-r}b^r$. Match exponents to locate a requested term.</p>
                    ${note("Worked example", "<p>To get $x^6$ from $(x^3+y)^8$, choose $x^3$ twice and $y$ six times: $\\binom82x^6y^6=28x^6y^6$.</p>")}
                    ${warn("The middle term of an 11-term expansion is the 6th term, corresponding to $r=5$.")}
                `, ["Expansion has $n+1$ terms.", "Combination coefficient counts selections.", "Sigma bounds are inclusive."]),
                lesson("3. Counting and binomial probability", "Decide whether order matters before choosing a formula.", `
                    <p>Use $P(n,r)=n!/(n-r)!$ for ordered arrangements and $C(n,r)=n!/[r!(n-r)!]$ for groups. Independent category choices multiply.</p>
                    <p>Exactly $k$ successes in $n$ independent trials has probability $\\binom nkp^k(1-p)^{n-k}$.</p>
                    ${note("Worked example", "<p>Choosing 2 of 15 novels, 2 of 10 plays, and 1 of 8 stories gives $\\binom{15}{2}\\binom{10}{2}\\binom81=37,800$ reading lists.</p>")}
                `, ["Order matters for seats, not committees.", "Multiply independent category counts.", "The binomial coefficient chooses which trials succeed."])
            ],
            questions: []
        },
        {
            id: "unit-7",
            title: "Sequences & Series",
            subtitle: "Arithmetic, geometric, recursive, finite, and infinite sums",
            curriculumUnit: "Official Unit IV",
            curriculumLevel: "Core",
            overview: "Recognize arithmetic and geometric patterns, move between recursive and explicit rules, and sum finite or convergent infinite series.",
            essentialQuestions: ["Is the pattern driven by a difference or ratio?", "How does an explicit rule encode the first term?", "When does an infinite geometric series converge?"],
            vocabulary: [["Arithmetic sequence", "A sequence with a constant difference $d$."], ["Geometric sequence", "A sequence with a constant ratio $r$."], ["Recursive rule", "Defines a term using earlier terms."], ["Explicit rule", "Defines $a_n$ directly from $n$."], ["Convergent", "Approaches a finite value."], ["Partial sum", "Sum of a finite number of initial terms."]],
            lessons: [
                lesson("1. Arithmetic and geometric rules", "Identify the pattern and write recursive or explicit form.", `
                    <div class="math-block">$$a_n=a_1+(n-1)d,\\qquad a_n=a_1r^{n-1}$$</div>
                    <p>A recursive rule must state the first term and how to get each next term. An explicit rule lets you jump directly to any index.</p>
                    ${note("Worked example", "<p>$120,40,13\\frac13,\\ldots$ is geometric with $r=1/3$, so $d_1=120$ and $d_n=(1/3)d_{n-1}$.</p>")}
                `, ["Constant difference means arithmetic.", "Constant ratio means geometric.", "Use $n-1$ so the first term works."]),
                lesson("2. Finite arithmetic and geometric sums", "Use first term, last term, ratio, and term count accurately.", `
                    <div class="math-block">$$S_n=\\frac n2(a_1+a_n),\\qquad S_n=a_1\\frac{1-r^n}{1-r}$$</div>
                    <p>Before summing, find $n$. For a geometric list, solve $a_n=a_1r^{n-1}$. For a sigma expression, evaluate the first and last indexed terms.</p>
                    ${note("Worked example", "<p>$1+3+9+\\cdots+6561$ has $6561=3^8$, so there are 9 terms and $S_9=(1-3^9)/(1-3)=9841$.</p>")}
                `, ["Count terms, not gaps.", "The arithmetic sum averages first and last.", "Finite geometric sums work for any ratio except 1."]),
                lesson("3. Infinite geometric series", "Test convergence before using the formula.", `
                    <p>An infinite geometric series converges only when $|r|<1$. Then $S_\\infty=a_1/(1-r)$. If $|r|\\ge1$, the terms do not shrink to zero, so the series diverges.</p>
                    ${note("Worked example", "<p>$200-100+50-25+\\cdots$ has $r=-1/2$, so it converges to $200/(1+1/2)=400/3$.</p>")}
                `, ["Find the ratio first.", "Absolute value of ratio must be below 1.", "A negative ratio alternates signs."])
            ],
            questions: []
        },
        {
            id: "unit-8",
            title: "Conics, Parametric & Polar Curves",
            subtitle: "Conic equations, elimination, restrictions, coordinate conversion, and polar sketches",
            curriculumUnit: "Official Unit V",
            curriculumLevel: "Honors only",
            overview: "Analyze circles, parabolas, ellipses, and hyperbolas; eliminate parameters without losing restrictions; and convert and sketch polar forms.",
            essentialQuestions: ["How does standard form reveal a conic's defining features?", "What restrictions remain after eliminating a parameter?", "How does a negative radius affect a polar point?", "How do symmetry and key values reveal a polar curve?"],
            vocabulary: [["Conic section", "A circle, parabola, ellipse, or hyperbola formed by slicing a double cone."], ["Focus", "A fixed point used in the geometric definition of a conic."], ["Parameter", "A third variable controlling both $x$ and $y$."], ["Orientation", "The direction a parametric curve is traced."], ["Pole", "The polar origin."], ["Limaçon", "A polar curve of the form $r=a\\pm b\\sin\\theta$ or $a\\pm b\\cos\\theta$."], ["Rose", "A polar curve $r=a\\sin(n\\theta)$ or $a\\cos(n\\theta)$ with petals."]],
            lessons: [
                lesson("1. Parametric equations and restrictions", "Eliminate the parameter and keep the original range information.", `
                    <p>Solve one equation for $t$ and substitute into the other. Then translate any restriction on $t$ into restrictions on $x$ and $y$.</p>
                    ${note("Worked example", "<p>If $x=\\sqrt{t-4}$ and $y=-2t+3$, then $t=x^2+4$, so $y=-2x^2-5$. Because $t\\ge4$, the original equations also require $x\\ge0$ and $y\\le-5$.</p>")}
                    ${warn("The rectangular equation may describe more points than the parametric equations actually trace.")}
                `, ["Eliminate $t$ algebraically.", "Keep restrictions.", "Use increasing $t$ to determine direction."]),
                lesson("2. Polar and rectangular coordinates", "Convert with sine, cosine, and the Pythagorean relationship.", `
                    <div class="math-block">$$x=r\\cos\\theta,\\quad y=r\\sin\\theta,\\quad r^2=x^2+y^2,\\quad \\tan\\theta=y/x$$</div>
                    <p>When converting rectangular to polar, use the point's quadrant to correct the calculator angle. Polar coordinates are not unique: add full turns or reverse $r$ and add $\\pi$.</p>
                    ${note("Worked example", "<p>$(-4,5\\pi/6)$ gives $x=2\\sqrt3,y=-2$ because the radius is negative. The point $(-8,8)$ has $r=8\\sqrt2$ and principal angle $3\\pi/4$.</p>")}
                `, ["Negative $r$ reverses direction.", "Quadrant matters for arctangent.", "Many polar pairs name the same point."]),
                lesson("3. Sketching polar curves", "Use symmetry, zeros, and maximum radius.", `
                    <p>For $r=a\\cos\\theta$, complete the square after multiplying by $r$ to identify a circle. For $r=a+b\\sin\\theta$, compare $|a|$ and $|b|$ to identify a limaçon with or without an inner loop. A rose $r=a\\cos(n\\theta)$ has $2n$ petals when $n$ is even and $n$ petals when $n$ is odd.</p>
                    ${note("Worked example", "<p>$r=-6\\cos\\theta$ is the circle $(x+3)^2+y^2=9$. $r=5\\cos2\\theta$ is a four-petal rose with petals on the coordinate axes.</p>")}
                `, ["Test axis angles.", "Negative radii plot across the pole.", "Even $n$ creates $2n$ rose petals."])
            ],
            questions: []
        },
        {
            id: "unit-9",
            title: "Limits & Introductory Derivatives",
            subtitle: "Factoring limits, derivative rules, tangents, and horizontal tangents",
            curriculumUnit: "Official Unit VI",
            curriculumLevel: "Core limits + Honors derivatives",
            overview: "Read one-sided and two-sided limits, evaluate limits algebraically, connect difference quotients to derivatives, and use first and second derivatives to describe tangents and concavity.",
            essentialQuestions: ["When do one-sided limits create a two-sided limit?", "When can a removable $0/0$ form be simplified?", "How does a difference quotient become an instantaneous slope?", "Which derivative rule matches the function structure?", "How do first and second derivatives describe a graph?"],
            vocabulary: [["One-sided limit", "The approached value from only the left or only the right."], ["Indeterminate form", "A form such as $0/0$ that signals more work is needed."], ["Difference quotient", "$[f(x+h)-f(x)]/h$, the secant-slope expression used to define a derivative."], ["Derivative", "Instantaneous rate of change."], ["Second derivative", "The rate of change of the first derivative; its sign describes concavity."], ["Horizontal tangent", "A tangent line with slope 0."]],
            lessons: [
                lesson("1. Limits by substitution and algebra", "Diagnose the form before choosing a technique.", `
                    <p>Direct substitution works when the function is continuous at the target. If it produces $0/0$, factor or rationalize, cancel the common factor for nearby inputs, then substitute. A nonzero number over zero signals an infinite or nonexistent two-sided limit.</p>
                    ${note("Worked example", "<p>$\\lim_{x\\to-9}\\frac{x^2+8x-9}{x^2-81}=\\lim\\frac{(x+9)(x-1)}{(x+9)(x-9)}=\\frac{-10}{-18}=\\frac59$.</p>")}
                `, ["$0/0$ is a signal, not an answer.", "Cancel factors, not terms.", "Rationalize square-root differences."]),
                lesson("2. Limits at infinity", "Compare degrees and leading terms.", `
                    <p>For rational functions: lower numerator degree gives 0; equal degrees give the ratio of leading coefficients; higher numerator degree is unbounded unless additional analysis gives opposite infinities.</p>
                    ${note("Worked example", "<p>$\\lim_{x\\to\\infty}\\frac{5x^2+2x-7}{9x^2-100}=5/9$ because the degrees are equal.</p>")}
                `, ["Leading terms dominate.", "Equal degrees give leading-coefficient ratio.", "Unbounded behavior is not a finite real limit."]),
                lesson("3. Derivative rules", "Differentiate powers, trig functions, products, and quotients.", `
                    <div class="math-block">$$\\frac d{dx}x^n=nx^{n-1},\\quad (\\sin x)'=\\cos x,\\quad (\\cos x)'=-\\sin x$$</div>
                    <p>Use the product rule when two variable expressions multiply and the quotient rule when they divide. Rewrite radicals and reciprocal powers before using the power rule when convenient.</p>
                    ${note("Worked example", "<p>For $y=4x^5\\sin x$, $y'=20x^4\\sin x+4x^5\\cos x$.</p>")}
                    ${warn("The derivative of a product is not the product of derivatives.")}
                `, ["Constants differentiate to 0.", "Power rule works for fractional and negative exponents.", "Choose product or quotient rule from the structure."]),
                lesson("4. Tangent lines and horizontal tangents", "Use the derivative as slope and pair it with a point.", `
                    <p>At $x=a$, the tangent line is $y-f(a)=f'(a)(x-a)$. A horizontal tangent occurs where $f'(x)=0$; substitute those $x$-values back into $f$ to get full coordinates.</p>
                    ${note("Worked example", "<p>For $f(x)=2x^3-3x^2-12x+5$, $f'(x)=6(x-2)(x+1)$. Thus horizontal tangents occur at $(2,-15)$ and $(-1,12)$.</p>")}
                `, ["Derivative gives slope.", "Original function gives the point.", "Horizontal tangent means derivative zero, not function zero."])
            ],
            questions: []
        }
    ]
};

// Curriculum additions verified against the district's 2024 Precalculus/Honors Precalculus document.
// The final-review packet is narrower than the full course, so these guided lessons close the gaps
// without inventing additional "official review" questions.
const addLessons = (unitId, position, newLessons) => {
    const unit = precalculusData.units.find(candidate => candidate.id === unitId);
    if (!unit) return;
    unit.lessons = position === "start" ? [...newLessons, ...unit.lessons] : [...unit.lessons, ...newLessons];
};

addLessons("unit-1", "start", [
    lesson("Lines, function notation, domain, and range", "Read a function from an equation, table, or graph and describe where it exists.", `
        <p>A line can be written $y=mx+b$, in point-slope form $y-y_1=m(x-x_1)$, or in standard form $Ax+By=C$. Parallel lines have equal slopes; nonvertical perpendicular lines have slopes whose product is $-1$.</p>
        <p>For a function, each input has exactly one output. Evaluate $f(a)$ by substituting $a$. State domain and range with inequalities or interval notation, using parentheses at excluded endpoints and brackets at included endpoints.</p>
        ${note("Worked example", "<p>For $f(x)=\\sqrt{x-2}$, the radicand requires $x\\ge2$, so the domain is $[2,\\infty)$ and the range is $[0,\\infty)$. A line through $(1,4)$ perpendicular to $y=2x-3$ has slope $-1/2$.</p>")}
        ${warn("A graph can pass the vertical-line test and still fail the horizontal-line test; that means it is a function but not one-to-one.")}
    `, ["Choose the line form that fits the known information.", "Domain describes inputs; range describes outputs.", "One input cannot have two outputs."]),
    lesson("Function behavior, symmetry, transformations, and piecewise rules", "Describe a graph before solving from it.", `
        <p>A function is increasing where outputs rise from left to right, decreasing where they fall, and constant where they stay level. Even functions satisfy $f(-x)=f(x)$ and have $y$-axis symmetry; odd functions satisfy $f(-x)=-f(x)$ and have origin symmetry.</p>
        <p>From $y=f(x)$: $f(x-h)+k$ shifts right $h$ and up $k$; $-f(x)$ reflects across the $x$-axis; $f(-x)$ reflects across the $y$-axis; and $af(bx)$ scales vertically by $|a|$ and horizontally by $1/|b|$.</p>
        ${note("Piecewise check", "<p>At a boundary, use the inequality attached to each rule. For $f(x)=\\begin{cases}x+1,&x<2\\\\x^2,&x\\ge2\\end{cases}$, $f(2)=4$ because the second piece includes 2.</p>")}
        ${check("Is $x^4+2x^2$ even, odd, or neither?", "Even, because replacing $x$ with $-x$ leaves the formula unchanged.")}
    `, ["Intervals describe behavior from left to right.", "Inside transformations act horizontally and appear reversed.", "Piecewise endpoints belong only to rules with an inclusive symbol."]),
    lesson("Operations, composition, and inverse functions", "Combine functions while tracking domain restrictions.", `
        <p>For functions $f$ and $g$, compute $(f+g)(x)$, $(f-g)(x)$, $(fg)(x)$, and $(f/g)(x)$ algebraically; for a quotient also require $g(x)\\ne0$. Composition means $(f\\circ g)(x)=f(g(x))$, so the output of $g$ must lie in the domain of $f$.</p>
        <p>To find an inverse, write $y=f(x)$, interchange $x$ and $y$, and solve for $y$. A function has an inverse function only when it is one-to-one, which a graph checks with the horizontal-line test.</p>
        ${note("Worked example", "<p>If $f(x)=2x-5$ and $g(x)=x^2$, then $(f\\circ g)(x)=2x^2-5$, while $(g\\circ f)(x)=(2x-5)^2$. Also $f^{-1}(x)=(x+5)/2$.</p>")}
        ${warn("$f^{-1}(x)$ means inverse function, not $1/f(x)$.")}
    `, ["Composition order matters.", "Carry domain restrictions through every operation.", "Verify inverses with both compositions when possible."]),
    lesson("Quadratic functions and models", "Move among standard, vertex, and intercept forms.", `
        <p>For $f(x)=ax^2+bx+c$, the axis of symmetry is $x=-b/(2a)$ and the vertex is found by evaluating there. Vertex form $a(x-h)^2+k$ reveals the vertex $(h,k)$; intercept form $a(x-r_1)(x-r_2)$ reveals the zeros.</p>
        <p>A positive $a$ gives a minimum and a negative $a$ gives a maximum. Solve with factoring, completing the square, or $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$.</p>
        ${note("Worked example", "<p>$x^2-6x+5=(x-3)^2-4$, so the vertex is $(3,-4)$, the axis is $x=3$, and the zeros are 1 and 5.</p>")}
    `, ["Each quadratic form exposes different features.", "The discriminant predicts the number and type of roots.", "A vertex gives the maximum or minimum of a quadratic model."]),
    lesson("Polynomial division and zero theorems", "Use division and theorems to locate every polynomial zero.", `
        <p>Polynomial long division works for any divisor. Synthetic division is a shortcut for division by $x-c$. The Remainder Theorem says the remainder is $f(c)$, and the Factor Theorem says $x-c$ is a factor exactly when $f(c)=0$.</p>
        <p>The Rational Zero Theorem lists candidates $\\pm p/q$, where $p$ divides the constant term and $q$ divides the leading coefficient. The Fundamental Theorem of Algebra guarantees exactly $n$ complex zeros for degree $n$, counting multiplicity; nonreal zeros of a real polynomial occur in conjugate pairs.</p>
        ${note("Worked example", "<p>If synthetic division of $f(x)$ by $x-2$ gives remainder 0, then 2 is a zero. If $3+2i$ is a zero of a real polynomial, then $3-2i$ is also a zero.</p>")}
    `, ["Synthetic value $c$ corresponds to divisor $x-c$.", "A zero remainder proves a factor.", "Count real and nonreal zeros with multiplicity."])
]);

addLessons("unit-1", "end", [
    lesson("Rational-expression operations", "Simplify and combine rational expressions without losing restrictions.", `
        <p>Factor every numerator and denominator first. For multiplication, cancel common factors; for division, multiply by the reciprocal. For addition or subtraction, build the least common denominator and combine numerators. A complex fraction can be cleared by multiplying every term by its least common denominator.</p>
        ${note("Worked example", "<p>$\\frac{x}{x-2}-\\frac{2}{x+2}=\\frac{x(x+2)-2(x-2)}{(x-2)(x+2)}=\\frac{x^2+4}{x^2-4}$, with $x\\ne\\pm2$.</p>")}
        ${warn("Only factors cancel. Terms joined by addition or subtraction do not.")}
    `, ["Factor before operating.", "Use a common denominator for addition and subtraction.", "State restrictions from every original denominator."], "Honors"),
    lesson("Exponential and logarithmic models", "Build growth, decay, interest, and logarithmic models from context.", `
        <p>Discrete growth and decay use $A=A_0(1+r)^t$; continuous change uses $A=A_0e^{kt}$. Compound interest uses $A=P(1+r/n)^{nt}$ and continuous interest uses $A=Pe^{rt}$. Solve for time by isolating the exponential and taking a logarithm.</p>
        <p>Logarithmic models are appropriate when equal multiplicative changes in input create equal additive changes in output, as with pH or decibel scales.</p>
        ${note("Worked example", "<p>A population that doubles every 6 years can be modeled by $P(t)=P_0 2^{t/6}=P_0e^{(\\ln2/6)t}$.</p>")}
    `, ["Match the time unit to the rate.", "A negative continuous rate models decay.", "Logs isolate a variable in an exponent."], "Honors")
]);

addLessons("unit-2", "end", [
    lesson("Arc length, sector area, and angular speed", "Connect radian measure to motion on a circle.", `
        <div class="math-block">$$s=r\\theta,\\qquad A=\\frac12r^2\\theta,\\qquad v=r\\omega$$</div>
        <p>These formulas require $\\theta$ in radians. Angular speed $\\omega$ measures angle per unit time; linear speed $v$ measures distance per unit time.</p>
        ${note("Worked example", "<p>A wheel of radius 0.4 m turning at $3\\pi$ radians per second has rim speed $v=(0.4)(3\\pi)=1.2\\pi$ m/s.</p>")}
    `, ["Convert degrees to radians first.", "Arc length is radius times angle.", "Linear speed grows with both radius and angular speed."])
]);

addLessons("unit-3", "end", [
    lesson("Verifying trigonometric identities", "Transform one side into the other with reversible algebra.", `
        <p>Start with the more complicated side. Factor, combine fractions, or rewrite in sine and cosine; then use reciprocal, quotient, and Pythagorean identities. Do not move terms across the equals sign as if solving an equation.</p>
        ${note("Worked example", "<p>$\\frac{1-\\cos^2x}{\\sin x}=\\frac{\\sin^2x}{\\sin x}=\\sin x$ wherever the original expression is defined.</p>")}
    `, ["Work on one side at a time.", "Show the identity used at each structural change.", "Both sides must share a common domain."]),
    lesson("Sum and difference formulas", "Find exact trig values for angles built from known angles.", `
        <div class="math-block">$$\\sin(u\\pm v)=\\sin u\\cos v\\pm\\cos u\\sin v$$</div>
        <div class="math-block">$$\\cos(u\\pm v)=\\cos u\\cos v\\mp\\sin u\\sin v$$</div>
        <p>The tangent formula is $\\tan(u\\pm v)=\\frac{\\tan u\\pm\\tan v}{1\\mp\\tan u\\tan v}$. Choose a decomposition such as $75^\\circ=45^\\circ+30^\\circ$ and preserve the sign pattern carefully.</p>
        ${check("What is $\\cos75^\\circ$?", "$\\frac{\\sqrt6-\\sqrt2}{4}$.")}
    `, ["Cosine uses the opposite sign in the middle.", "Choose angles with known exact values.", "The formula sheet provides these identities."]),
    lesson("Double-angle, half-angle, and product-to-sum formulas", "Apply the Honors multiple-angle identities supplied on the formula sheet.", `
        <p>Use $\\sin2u=2\\sin u\\cos u$, the three equivalent forms of $\\cos2u$, and $\\tan2u=2\\tan u/(1-\\tan^2u)$. Half-angle square roots require a sign chosen from the quadrant of $u/2$.</p>
        <p>Product-to-sum formulas convert products such as $\\sin u\\cos v$ into sums of angles. They are useful for exact evaluation and later calculus work.</p>
        ${warn("The $\\pm$ in a half-angle formula is determined by the output angle's quadrant, not by the original ratio's sign alone.")}
    `, ["Choose the cosine double-angle form that simplifies the given expression.", "Solve a doubled-angle equation over a doubled interval.", "Use the quadrant to select a half-angle sign."], "Honors")
]);

addLessons("unit-4", "end", [
    lesson("Sinusoidal models and harmonic motion", "Translate a periodic situation into amplitude, period, midline, and phase.", `
        <p>For maximum $M$ and minimum $m$, amplitude is $(M-m)/2$ and midline is $(M+m)/2$. If one cycle takes $T$ units, then $b=2\\pi/T$. Use cosine when the model begins at an extreme and sine when it begins on the midline.</p>
        ${note("Worked example", "<p>A Ferris-wheel height varying from 2 m to 34 m every 40 s has amplitude 16, midline 18, and $b=\\pi/20$.</p>")}
    `, ["Amplitude is half the full vertical range.", "Period comes from the physical cycle time.", "A horizontal shift aligns the chosen starting event."])
]);

addLessons("unit-5", "end", [
    lesson("Area of oblique triangles", "Choose the SAS area formula or Heron's Formula from the information given.", `
        <div class="math-block">$$K=\\frac12ab\\sin C,\\qquad K=\\sqrt{s(s-a)(s-b)(s-c)},\\quad s=\\frac{a+b+c}{2}$$</div>
        <p>Use $K=\\frac12ab\\sin C$ when two sides and their included angle are known. Use Heron's Formula when all three sides are known, after checking the triangle inequality.</p>
        ${check("Find the area when $a=8$, $b=11$, and $C=30^\\circ$.", "$K=\\frac12(8)(11)(1/2)=22$ square units.")}
    `, ["The sine formula needs the included angle.", "Heron's $s$ is the semiperimeter.", "Verify that the side lengths form a triangle."])
]);

addLessons("unit-6", "end", [
    lesson("Probability rules", "Distinguish complements, unions, intersections, and independence.", `
        <p>The complement rule is $P(A^c)=1-P(A)$. For any events, $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$. Mutually exclusive events have $P(A\\cap B)=0$; independent events satisfy $P(A\\cap B)=P(A)P(B)$.</p>
        ${note("Worked example", "<p>If $P(A)=0.6$, $P(B)=0.5$, and $P(A\\cap B)=0.3$, the events are independent because $0.6(0.5)=0.3$, and $P(A\\cup B)=0.8$.</p>")}
        ${warn("Mutually exclusive and independent mean different things. Nonzero mutually exclusive events cannot be independent.")}
    `, ["Use a complement for 'at least one'.", "Subtract overlap when adding probabilities.", "Independence is tested with a product."]),
    lesson("Complex-number operations and De Moivre's Theorem", "Multiply, divide, and raise complex numbers in trigonometric form.", `
        <p>In rectangular form, add and subtract real and imaginary parts; multiply with distribution and $i^2=-1$; divide by multiplying by the conjugate. In polar form, multiply moduli and add arguments, or divide moduli and subtract arguments.</p>
        <div class="math-block">$$[r(\\cos\\theta+i\\sin\\theta)]^n=r^n(\\cos n\\theta+i\\sin n\\theta)$$</div>
        ${note("Worked example", "<p>$[2\\,\\mathrm{cis}(\\pi/3)]^3=8\\,\\mathrm{cis}(\\pi)=-8$.</p>")}
    `, ["Conjugates make a real denominator.", "Polar multiplication adds angles.", "De Moivre multiplies the argument by the power."], "Honors")
]);

addLessons("unit-8", "start", [
    lesson("Circles and parabolas", "Identify centers, radii, vertices, foci, and directrices from standard form.", `
        <p>A circle has form $(x-h)^2+(y-k)^2=r^2$. A vertical parabola has $(x-h)^2=4p(y-k)$ with focus $(h,k+p)$ and directrix $y=k-p$; a horizontal parabola has $(y-k)^2=4p(x-h)$.</p>
        ${note("Worked example", "<p>$(x+2)^2+y^2=9$ is centered at $(-2,0)$ with radius 3. For $(x-1)^2=8(y+3)$, $p=2$, so the vertex is $(1,-3)$ and focus is $(1,-1)$.</p>")}
    `, ["Complete the square to reach standard form.", "The sign of $p$ gives the opening direction.", "A parabola is equidistant from its focus and directrix."], "Honors"),
    lesson("Ellipses and hyperbolas", "Read vertices, foci, and asymptotes from conic standard forms.", `
        <p>For an ellipse, the larger denominator is $a^2$ and $c^2=a^2-b^2$. For a hyperbola, the positive term identifies the transverse axis, $c^2=a^2+b^2$, and center-relative asymptotes come from the matching rise/run ratio.</p>
        <div class="math-block">$$\\frac{(x-h)^2}{a^2}+\\frac{(y-k)^2}{b^2}=1,\\qquad \\frac{(x-h)^2}{a^2}-\\frac{(y-k)^2}{b^2}=1$$</div>
        ${warn("In an ellipse, $a^2$ is the larger denominator. In a hyperbola, $a^2$ is under the positive term.")}
    `, ["The center comes from $(h,k)$.", "Ellipse foci lie inside; hyperbola foci lie beyond the vertices.", "Translate asymptotes through the center."], "Honors")
]);

addLessons("unit-9", "start", [
    lesson("Graphical, one-sided, and piecewise limits", "Decide what a function approaches from each side.", `
        <p>$\\lim_{x\\to a^-}f(x)$ approaches from inputs below $a$ and $\\lim_{x\\to a^+}f(x)$ approaches from above. A two-sided limit exists only when these one-sided limits agree. The actual value $f(a)$ may be different or undefined.</p>
        <p>For a piecewise function, use the piece active on each side of the boundary. An open circle can still reveal a limit; a jump gives unequal one-sided limits and therefore no two-sided limit.</p>
        ${check("If the left-hand limit is 2 and the right-hand limit is 5, what is the two-sided limit?", "It does not exist because the one-sided limits disagree.")}
    `, ["Approach direction matters.", "A limit is not necessarily the function value.", "Two matching one-sided limits create a two-sided limit."]),
    lesson("Difference quotient and average rate of change", "Connect secant slopes to the derivative definition.", `
        <p>The average rate of change on $[a,b]$ is $[f(b)-f(a)]/(b-a)$. The difference quotient $[f(x+h)-f(x)]/h$ is a secant slope; its limit as $h\\to0$ is the derivative $f'(x)$.</p>
        ${note("Worked example", "<p>For $f(x)=x^2$, $\\frac{(x+h)^2-x^2}{h}=2x+h$, so the limiting slope is $f'(x)=2x$.</p>")}
        ${warn("Expand $f(x+h)$ with parentheses around the entire input.")}
    `, ["Average rate uses two distinct inputs.", "The derivative is the limiting secant slope.", "Cancel $h$ only after factoring the numerator."])
]);

addLessons("unit-9", "end", [
    lesson("Higher-order derivatives and concavity", "Use the second derivative to describe how slope changes.", `
        <p>The second derivative $f''(x)$ is the derivative of $f'(x)$. Where $f''(x)>0$, slopes increase and the graph is concave up; where $f''(x)<0$, slopes decrease and the graph is concave down. A possible inflection point occurs where concavity actually changes.</p>
        ${note("Worked example", "<p>For $f(x)=x^3-3x$, $f''(x)=6x$. The graph is concave down for $x<0$, concave up for $x>0$, and has an inflection point at $(0,0)$.</p>")}
        ${warn("Solving $f''(x)=0$ finds candidates; verify a sign change before calling one an inflection point.")}
    `, ["Differentiate again for the second derivative.", "The sign of $f''$ determines concavity.", "Inflection requires a concavity change."], "Honors")
]);

// Apply the district's asterisk convention to lessons already present in the packet-driven site.
precalculusData.units.forEach(unit => {
    unit.lessons.forEach(currentLesson => {
        if (unit.id === "unit-8"
            || (unit.id === "unit-6" && currentLesson.title.includes("Complex"))
            || (unit.id === "unit-9" && /Limits at infinity|Derivative rules|Tangent lines/.test(currentLesson.title))) {
            currentLesson.level = "Honors";
        }
    });
});

// Unit 1: final review 1-15.
precalculusData.units[0].questions.push(
    rq(1,1,"Zeros and multiplicity","For $f(x)=-(x-3)^2(x+1)^3(x+5)$, which statement gives all zeros, multiplicities, and end behavior?",["$3(2),-1(3),-5(1)$; both ends down","$-3(2),1(3),5(1)$; both ends up","$3(2),-1(3),-5(1)$; left down, right up","$3(3),-1(2),-5(1)$; both ends down"],0,"The zeros reverse the signs inside the factors. The leading term is $-x^6$, an even degree with negative leading coefficient, so both ends approach $-\\infty$.","Core"),
    rq(1,2,"Rational functions","For $f(x)=\\frac{4x^2-8x-12}{x^2+5x-24}$, which complete description is correct?",["HA $y=4$; VA $x=-8$; domain excludes $-8,3$; hole $(3,16/11)$","HA $y=0$; VA $x=3$; domain excludes only $3$","HA $y=4$; VA $x=3$; hole $(-8,4)$","No asymptotes; domain is all real numbers"],0,"Factor to $\\frac{4(x-3)(x+1)}{(x+8)(x-3)}$. The canceled $x-3$ makes the hole; $x+8$ makes the VA; equal degrees give HA $y=4$.","Challenge"),
    rq(1,3,"Rational functions","Find the horizontal asymptote of $y=\\frac{2x^3+5x-7}{x^4-1}$.",["$y=0$","$y=2$","$y=1/2$","No horizontal asymptote"],0,"The numerator degree, 3, is less than the denominator degree, 4, so the ratio approaches 0."),
    rq(1,4,"Exponential functions","For $f(x)=-2^{-x}+3$, which domain, range, and end behavior are correct?",["Domain $(-\\infty,\\infty)$; range $(-\\infty,3)$; $f(x)\\to3$ as $x\\to\\infty$","Domain $(0,\\infty)$; range $(3,\\infty)$","Domain all real; range $(3,\\infty)$; $f(x)\\to-\\infty$ as $x\\to\\infty$","Domain $(-\\infty,3)$; range all real"],0,"$2^{-x}$ is always positive, so $-2^{-x}+3<3$. As $x\\to\\infty$, $2^{-x}\\to0$ and the graph approaches $y=3$."),
    rq(1,5,"Logarithms","For $f(x)=\\ln(x+2)+1$, which statement is correct?",["Domain $(-2,\\infty)$, range all real, x-intercept $e^{-1}-2$","Domain $[-2,\\infty)$, range $[1,\\infty)$, x-intercept $-1$","Domain all real, range $(-2,\\infty)$","Domain $(2,\\infty)$, x-intercept $e-2$"],0,"The argument requires $x+2>0$. Set $0=\\ln(x+2)+1$ to get $x+2=e^{-1}$."),
    rq(1,6,"Logarithms","Evaluate: $\\log100,\\ \\ln(e^5),\\ \\log_3(1/9),\\ 6^{\\log_6 36},\\ e^{2\\ln3}$.",["$2,5,-2,36,9$","$100,5,2,6,6$","$2,e^5,-3,36,6$","$10,5,-2,216,9$"],0,"Apply inverse properties and exponent rules: $e^{2\\ln3}=e^{\\ln9}=9$.","Core"),
    rq(1,7,"Logarithms","Expand $\\log\\left(\\frac{x^2}{5\\sqrt y}\\right)$ completely.",["$2\\log x-\\log5-\\frac12\\log y$","$\\log x^2-5\\log y$","$2\\log x+\\log5+\\frac12\\log y$","$\\frac{2\\log x}{5\\log y}$"],0,"A quotient becomes subtraction and powers become coefficients."),
    rq(1,8,"Logarithms","Condense $\\frac13\\ln z-2\\ln(5x)-3\\ln(y^2)$.",["$\\ln\\left(\\frac{\\sqrt[3]z}{25x^2y^6}\\right)$","$\\ln\\left(\\frac{z^3}{10xy^2}\\right)$","$\\ln(\\sqrt[3]z-25x^2-y^6)$","$\\ln\\left(\\frac{25x^2y^6}{\\sqrt[3]z}\\right)$"],0,"Move coefficients to powers, then combine subtraction as division."),
    rq(1,9,"Logarithms","Use change of base to rewrite $\\log_3 100$ with natural logs.",["$\\frac{\\ln100}{\\ln3}$","$\\frac{\\ln3}{\\ln100}$","$\\ln(100/3)$","$3\\ln100$"],0,"Change of base is $\\log_ba=\\ln a/\\ln b$."),
    rq(1,10,"Logarithms","Solve $\\ln(2x+8)=\\ln(x-5)$.",["No real solution","$x=-13$","$x=13$","$x=5$"],0,"Equating arguments gives $x=-13$, but both original arguments are negative there, so the candidate is extraneous."),
    rq(1,11,"Exponential functions","Solve $6e^{2x}=30$.",["$x=\\frac{\\ln5}{2}$","$x=\\ln5$","$x=\\frac52$","$x=\\ln30$"],0,"Divide by 6 to get $e^{2x}=5$, take natural logs, and divide by 2."),
    rq(1,12,"Logarithms","Solve $5\\log_2x+9=-6$.",["$x=1/8$","$x=-3$","$x=8$","No real solution"],0,"$5\\log_2x=-15$, so $\\log_2x=-3$ and $x=2^{-3}=1/8$."),
    rq(1,13,"Logarithms","Solve $\\ln x+\\ln(x+2)=\\ln15$.",["$x=3$","$x=-5$","$x=3$ or $-5$","No real solution"],0,"The product equation gives candidates 3 and -5, but the log domain requires $x>0$."),
    rq(1,14,"Logarithms","Solve $\\log_3(x-3)-\\log_3(x+2)=2$.",["No real solution","$x=-21/8$","$x=21/8$","$x=3$"],0,"Combining gives candidate $-21/8$, but the original separate logs require $x-3>0$ and $x+2>0$, so it is extraneous."),
    rq(1,15,"Logarithms","Solve $\\ln(1-x)=\\ln(x^2+4x-23)$.",["$x=-8$","$x=3$","$x=-8$ or $3$","No real solution"],0,"Equating arguments gives $(x+8)(x-3)=0$. Only $x=-8$ keeps $1-x>0$ and the other log argument positive.")
);

// Unit 2: final review 16-25.
precalculusData.units[1].questions.push(
    rq(2,16,"Unit circle","Convert $260^\\circ$ to radians.",["$13\\pi/9$","$13\\pi/18$","$26\\pi/9$","$5\\pi/6$"],0,"Multiply by $\\pi/180$ and reduce."),
    rq(2,17,"Unit circle","Convert $-5\\pi/12$ to degrees.",["$-75^\\circ$","$-150^\\circ$","$75^\\circ$","$-24^\\circ$"],0,"Multiply by $180/\\pi$."),
    rq(2,18,"Unit circle","Which list gives the exact values of $\\sin(-4\\pi/3),\\cos(7\\pi/6),\\sec(-\\pi),\\cot(13\\pi/6),\\csc(-5\\pi/4),\\tan690^\\circ,\\csc210^\\circ,\\sec300^\\circ$?",["$\\frac{\\sqrt3}{2},-\\frac{\\sqrt3}{2},-1,\\sqrt3,\\sqrt2,-\\frac{\\sqrt3}{3},-2,2$","$-\\frac{\\sqrt3}{2},\\frac{\\sqrt3}{2},1,\\frac{\\sqrt3}{3},-\\sqrt2,\\sqrt3,2,-2$","$\\frac12,-\\frac12,-1,1,\\sqrt2,\\frac{\\sqrt3}{3},-2,2$","$\\frac{\\sqrt3}{2},-\\frac{\\sqrt3}{2},1,\\sqrt3,-\\sqrt2,-\\frac{\\sqrt3}{3},2,2$"],0,"Reduce each angle, use its quadrant, then apply reciprocal identities where needed.","Challenge"),
    rq(2,19,"Trig equations","Which solution list is correct for the six equations in review #19?",["a) $135^\\circ,315^\\circ$; b) $\\pi/3,2\\pi/3$; c) $120^\\circ,240^\\circ$; d) $0$; e) $0,\\pi,2\\pi$; f) $0,\\pi$","a) $45^\\circ,225^\\circ$; b) $\\pi/6,5\\pi/6$; c) $60^\\circ,300^\\circ$; d) $2\\pi$; e) $\\pi$; f) $\\pi/2,3\\pi/2$","a) $135^\\circ$ only; b) $\\pi/3$ only; c) $240^\\circ$ only; d) $0,2\\pi$; e) $0,\\pi$; f) $0$","All six have no solution"],0,"Use reference angles, quadrant signs, and the exact endpoint rules stated for each equation.","Challenge"),
    rq(2,20,"Unit circle","Which are the three Pythagorean identities?",["$\\sin^2x+\\cos^2x=1$, $1+\\tan^2x=\\sec^2x$, $1+\\cot^2x=\\csc^2x$","$\\sin x+\\cos x=1$, $\\tan x+1=\\sec x$, $\\cot x+1=\\csc x$","$\\sin^2x-\\cos^2x=1$, $\\sec^2x+\\tan^2x=1$, $\\csc^2x+\\cot^2x=1$","$\\sin2x+\\cos2x=1$, $\\tan2x+1=\\sec2x$, $\\cot2x+1=\\csc2x$"],0,"These are the standard Pythagorean identities listed on the provided formula sheet."),
    rq(2,21,"Unit circle","Evaluate $\\arcsin(-1),\\arccos(-\\sqrt3/2),\\arctan(-\\sqrt3/3),\\arctan0$.",["$-\\pi/2,5\\pi/6,-\\pi/6,0$","$3\\pi/2,7\\pi/6,11\\pi/6,0$","$-\\pi/2,-\\pi/6,-\\pi/3,\\pi$","$\\pi/2,5\\pi/6,\\pi/6,0$"],0,"Inverse trig returns principal values in its restricted range."),
    rq(2,22,"Trig graphs","Give the ranges of $y=3\\sin x+1$, $y=\\tan x-2$, and $y=-4\\sec(5x-\\pi)-10$.",["$[-2,4]$; $(-\\infty,\\infty)$; $(-\\infty,-14]\\cup[-6,\\infty)$","$[-3,3]$; $[-2,2]$; $[-14,-6]$","$[-2,4]$; $(-2,\\infty)$; $(-\\infty,-6]$","$[1,4]$; all real; $[-14,\\infty)$"],0,"Sine uses midline plus/minus amplitude; tangent has all-real range; transformed secant leaves the open gap $(-14,-6)$."),
    rq(2,23,"Unit circle","An angle's terminal side passes through $(6\\sqrt5,-6\\sqrt{15})$. Find an angle in $0<\\theta\\le2\\pi$.",["$5\\pi/3$","$\\pi/3$","$4\\pi/3$","$11\\pi/6$"],0,"The ratios are $\\cos\\theta=1/2$ and $\\sin\\theta=-\\sqrt3/2$, placing the angle in Quadrant IV."),
    rq(2,24,"Trig equations","On $0^\\circ<\\theta\\le360^\\circ$, solve a) $\\sin\\theta=0.7880$ and b) $\\tan\\theta=-1.3763$ to the nearest degree.",["a) $52^\\circ,128^\\circ$; b) $126^\\circ,306^\\circ$","a) $52^\\circ,308^\\circ$; b) $54^\\circ,234^\\circ$","a) $38^\\circ,142^\\circ$; b) $126^\\circ,234^\\circ$","a) $128^\\circ,232^\\circ$; b) $54^\\circ,306^\\circ$"],0,"Sine is positive in I and II; tangent is negative in II and IV."),
    rq(2,25,"Unit circle","A plane sights a house at a $15^\\circ$ angle of depression from 1450 ft altitude. How far is the plane from the house?",["About $5602.37$ ft","About $1501.16$ ft","About $388.52$ ft","About $5411.11$ ft"],0,"The line of sight is the hypotenuse: $\\sin15^\\circ=1450/d$.")
);

// Unit 3: final review 26-30.
precalculusData.units[2].questions.push(
    rq(3,26,"Trig identities","Simplify $1-2\\csc^2x+\\csc^4x$.",["$\\cot^4x$","$-\\cot^4x$","$\\csc^4x$","$\\sin^2x$"],0,"It is $(1-\\csc^2x)^2=(-\\cot^2x)^2=\\cot^4x$."),
    rq(3,27,"Trig identities","Simplify $\\frac{\\csc x}{\\tan x+\\cot x}$.",["$\\cos x$","$\\sin x$","$\\sec x$","$1$"],0,"The denominator becomes $1/(\\sin x\\cos x)$; dividing leaves $\\cos x$."),
    rq(3,28,"Trig identities","Simplify $\\frac{1+\\cos x}{\\sin x}+\\frac{\\sin x}{1+\\cos x}$.",["$2\\csc x$","$2\\sec x$","$\\sin2x$","$\\cot x$"],0,"A common denominator gives $2(1+\\cos x)/[(1+\\cos x)\\sin x]=2/\\sin x$."),
    rq(3,29,"Trig identities","Simplify $\\frac{\\tan x}{\\csc x}+\\frac{\\sin x}{\\tan x}$.",["$\\sec x$","$\\csc x$","$2\\sin x$","$1$"],0,"The terms become $\\sin^2x/\\cos x$ and $\\cos x$; combine using $\\sin^2x+\\cos^2x=1$."),
    rq(3,30,"Trig equations","Which list correctly summarizes the solutions on $[0,2\\pi)$ for all six equations in review #30?",["a) $0,\\pi,7\\pi/6,11\\pi/6$; b) $3\\pi/8,5\\pi/8,11\\pi/8,13\\pi/8$; c) $\\pi/3,2\\pi/3,4\\pi/3,5\\pi/3$; d) $0,\\pi/3,5\\pi/3$; e) $0,\\pi,\\pi/3,5\\pi/3$; f) $0,\\pi,\\pi/4,3\\pi/4,5\\pi/4,7\\pi/4$","Every equation has only $0$ and $\\pi$","a) $\\pi/6,5\\pi/6$; b) $3\\pi/4,5\\pi/4$; c) $\\pi/3,4\\pi/3$; d) $\\pi$; e) $\\pi/2,3\\pi/2$; f) $\\pi/4,5\\pi/4$","No equation has a solution at $0$"],0,"Factor each equation and solve every case. In part (d), $\\tan^2x+\\sec x-1=0$ becomes $\\sec^2x+\\sec x-2=0$, so $\\sec x=1$ or $-2$. For the double-angle equation, solve across a $4\\pi$ interval before dividing by 2.","Challenge")
);

// Unit 4: review 31-33, 66-74, and 94-102.
precalculusData.units[3].questions.push(
    rq(4,31,"Trig graphs","The review graph is an increasing tangent curve with period $\\pi/4$ and zero at $x=\\pi/8$. Which equation matches?",["$y=\\tan(4x-\\pi/2)$","$y=-\\cot x$","$y=\\tan x$","$y=\\tan(4x-\\pi/8)$"],0,"Tangent's zero occurs when $4x-\\pi/2=0$, giving $x=\\pi/8$, and $b=4$ gives period $\\pi/4$."),
    rq(4,32,"Trig graphs","Which basic graph matches $y=-\\cos(2(x+\\pi/2))$?",["A cosine graph with period $\\pi$ and a maximum at $x=0$","A sine graph with period $2\\pi$ and zero at $x=0$","A cosine graph with period $2\\pi$ and a minimum at $x=0$","A tangent graph with period $\\pi$"],0,"The expression simplifies to $\\cos2x$, which has period $\\pi$ and value 1 at $x=0$."),
    rq(4,33,"Trig graphs","Which description matches $f(x)=1+\\sec(2x)$?",["Period $\\pi$, upward shift 1, with branches touching $y=2$ and $y=0$","Period $2\\pi$, downward shift 1","Period $\\pi/2$, range all real","A sine wave of amplitude 1"],0,"Secant inherits cosine's period $\\pi$ for input $2x$, then shifts up 1."),
    rq(4,66,"Conic sections","Match $(x+2)^2+y^2=9$ to its graph description.",["Circle centered $(-2,0)$ with radius 3","Circle centered $(2,0)$ with radius 9","Parabola with vertex $(-2,0)$","Ellipse centered at the origin"],0,"Circle standard form is $(x-h)^2+(y-k)^2=r^2$."),
    rq(4,67,"Conic sections","Match $y=(x-3)^2-5$ to its graph description.",["Upward parabola with vertex $(3,-5)$","Downward parabola with vertex $(-3,5)$","Exponential with asymptote $y=-5$","Circle of radius 5"],0,"Vertex form reads directly as $(h,k)=(3,-5)$."),
    rq(4,68,"Exponential functions","Which description matches $y=e^{-x}+2$?",["Decreasing exponential with horizontal asymptote $y=2$","Increasing exponential with vertical asymptote $x=2$","Decreasing logarithm with vertical asymptote $x=2$","Upward parabola shifted 2"],0,"The negative exponent reflects $e^x$ across the $y$-axis and the +2 shifts the horizontal asymptote."),
    rq(4,69,"Exponential functions","Which description matches $y=-e^x+2$?",["Decreases from horizontal asymptote $y=2$ toward $-\\infty$","Increases from $-\\infty$ toward asymptote $y=2$","Has vertical asymptote $x=2$","Is always positive"],0,"The outside negative reflects $e^x$ over the $x$-axis; +2 shifts it upward."),
    rq(4,70,"Logarithms","Which description matches $y=-\\ln(x-2)$?",["Domain $x>2$, vertical asymptote $x=2$, decreasing","Domain $x<2$, vertical asymptote $x=2$, increasing","Domain all real, horizontal asymptote $y=2$","Domain $x>0$, increasing"],0,"The inside shift gives $x>2$ and the outside negative reflects the log vertically."),
    rq(4,71,"Logarithms","Which description matches $y=\\ln(2-x)$?",["Domain $x<2$, vertical asymptote $x=2$, decreasing","Domain $x>2$, vertical asymptote $x=2$, increasing","Domain all real, decreasing","Horizontal asymptote $y=2$"],0,"The argument requires $2-x>0$, and increasing $x$ makes the argument smaller."),
    rq(4,72,"Zeros and multiplicity","For $y=-x^2(x+3)(x-1)$, what key graph features identify it?",["Zeros $-3,0,1$; $0$ has multiplicity 2; both ends down","Zeros $3,0,-1$; all cross; both ends up","Zeros $-3,1$ only; odd degree","No real zeros; both ends down"],0,"The leading term is $-x^4$ and $x=0$ is a double zero."),
    rq(4,73,"Trig graphs","Describe $y=\\sin(2x+\\pi/2)$.",["Amplitude 1, period $\\pi$, phase shift $-\\pi/4$","Amplitude 2, period $2\\pi$, phase shift $\\pi/2$","Amplitude 1, period $4\\pi$, shift $\\pi/4$","Amplitude $\\pi/2$, period 2"],0,"Factor the inside as $2(x+\\pi/4)$; period is $2\\pi/2=\\pi$."),
    rq(4,74,"Trig graphs","Describe $y=-3\\cos(x-\\pi)+1$.",["Amplitude 3, period $2\\pi$, shift right $\\pi$, midline $y=1$, reflected","Amplitude $-3$, period $\\pi$, shift left $\\pi$","Amplitude 1, period $2\\pi$, midline $y=-3$","Amplitude 3, period $\\pi/2$, shift right 1"],0,"Read $a=-3,b=1,h=\\pi,k=1$ from transformation form."),
    rq(4,94,"Trig graphs","In the review's graph bank, $f(x)=-\\cos(x-\\pi)$ matches which equivalent parent behavior?",["$\\cos x$","$-\\cos x$","$\\sin x$","$-\\sin x$"],0,"$\\cos(x-\\pi)=-\\cos x$, and the outside negative makes $\\cos x$."),
    rq(4,95,"Trig graphs","What parent function is equivalent to $\\sin(x+\\pi/2)$?",["$\\cos x$","$-\\cos x$","$\\sin x$","$\\tan x$"],0,"The cofunction/phase-shift identity gives $\\sin(x+\\pi/2)=\\cos x$."),
    rq(4,96,"Trig graphs","Which description matches $f(x)=-\\tan x$?",["Decreasing tangent branches, period $\\pi$, zero at 0","Increasing tangent branches, period $2\\pi$","Decreasing cotangent branches with an asymptote at 0","A bounded wave"],0,"The negative reflects tangent across the $x$-axis."),
    rq(4,97,"Trig graphs","Which description matches $f(x)=\\cot(x-\\pi/2)$?",["Equivalent to $-\\tan x$","Equivalent to $\\tan x$","Equivalent to $\\cos x$","Equivalent to $-\\cot x$"],0,"A $\\pi/2$ shift changes cotangent into negative tangent."),
    rq(4,98,"Trig graphs","Describe $f(x)=\\cos(2x-\\pi)$.",["Equivalent to $-\\cos2x$ with period $\\pi$","Equivalent to $\\cos x$ with period $2\\pi$","Equivalent to $\\sin2x$","Equivalent to $-\\sin x$"],0,"$\\cos(2x-\\pi)=-\\cos2x$ and $b=2$ gives period $\\pi$."),
    rq(4,99,"Trig graphs","Describe $f(x)=-\\sin(2x)$.",["Reflected sine with period $\\pi$","Reflected sine with period $2\\pi$","Cosine with period $\\pi$","Tangent with period $\\pi/2$"],0,"The coefficient 2 halves the sine period; the outside negative reflects it."),
    rq(4,100,"Trig graphs","Describe $f(x)=-\\cot(2x)$.",["Increasing cotangent-style branches with period $\\pi/2$","Decreasing branches with period $\\pi$","A bounded wave with amplitude 2","Secant branches with period $\\pi$"],0,"Cotangent normally decreases; the negative reflects it to increase, and $b=2$ gives period $\\pi/2$."),
    rq(4,101,"Trig graphs","For $f(x)=\\sin(\\frac12(x-\\pi/4))$, what is the period and phase shift?",["Period $4\\pi$, shift right $\\pi/4$","Period $\\pi$, shift left $\\pi/4$","Period $2\\pi$, shift right $\\pi/2$","Period $4\\pi$, shift left $\\pi/2$"],0,"$b=1/2$ gives period $2\\pi/(1/2)=4\\pi$, and the form is $x-\\pi/4$."),
    rq(4,102,"Trig graphs","What is $\\tan(x-\\pi)$ equivalent to?",["$\\tan x$","$-\\tan x$","$\\cot x$","$-\\cot x$"],0,"Tangent has period $\\pi$, so shifting by $\\pi$ produces the same graph.")
);

// Unit 5: review 34.
precalculusData.units[4].questions.push(
    rq(5,34,"Triangles","Which summary correctly solves all five triangles in review #34?",["a) $A\\approx30.31^\\circ,B\\approx111.28^\\circ,C\\approx38.41^\\circ$; b) $(A_1,B_1,b_1)\\approx(25.99^\\circ,134.01^\\circ,67.29)$ or $(154.01^\\circ,5.99^\\circ,9.76)$; c) no triangle; d) $(B,C,b)\\approx(83.74^\\circ,44.26^\\circ,44.15)$; e) $(A,C,b)\\approx(104.94^\\circ,51.06^\\circ,16.21)$","a) no triangle; b) one; c) two; d) none; e) two","All five have exactly one triangle","All five require only right-triangle trig"],0,"SSS in (a) uses the Law of Cosines. SSA in (b) gives two valid angle supplements, while (c) gives an impossible sine value. In (d) only one supplement fits the angle sum; SAS in (e) uses the Law of Cosines first.","Challenge")
);

// Unit 6: review 35-44, 54-56, and 103-105.
precalculusData.units[5].questions.push(
    rq(6,35,"Complex numbers","Find $|-5-12i|$.",["$13$","$17$","$7$","$\\sqrt{119}$"],0,"The modulus is $\\sqrt{(-5)^2+(-12)^2}=\\sqrt{169}=13$."),
    rq(6,36,"Complex numbers","Convert a) $5-5i$ and b) $-4+4\\sqrt3i$ to trigonometric form.",["a) $5\\sqrt2\\,\\text{cis}(7\\pi/4)$; b) $8\\,\\text{cis}(2\\pi/3)$","a) $10\\,\\text{cis}(\\pi/4)$; b) $4\\,\\text{cis}(\\pi/3)$","a) $5\\sqrt2\\,\\text{cis}(\\pi/4)$; b) $8\\,\\text{cis}(5\\pi/3)$","a) $5\\,\\text{cis}(7\\pi/4)$; b) $4\\sqrt3\\,\\text{cis}(2\\pi/3)$"],0,"Use $r=\\sqrt{a^2+b^2}$ and the quadrant of $(a,b)$."),
    rq(6,37,"Binomial theorem","Evaluate $\\sum_{k=2}^{6}(-1)^k(2k)$.",["$8$","$-8$","$42$","$12$"],0,"The terms are $4,-6,8,-10,12$, whose sum is 8."),
    rq(6,38,"Binomial theorem","Simplify $\\frac{n(n-1)!}{(n+1)!}$.",["$\\frac1{n+1}$","$\\frac1{n^2+n}$","$n^2-n$","$n+1$"],0,"$(n+1)!=(n+1)n(n-1)!$, so the common factors cancel."),
    rq(6,39,"Counting and probability","Evaluate $\\binom{16}{14}$.",["$120$","$240$","$16$","$30$"],0,"By symmetry $\\binom{16}{14}=\\binom{16}{2}=16\\cdot15/2=120$."),
    rq(6,40,"Counting and probability","Which is not always equal to 1 for a whole number $x$?",["$\\binom{x}{1}$","$\\binom{x}{x}$","$\\binom{x}{0}$","Both $\\binom{x}{x}$ and $\\binom{x}{0}$"],0,"$\\binom{x}{1}=x$, while choosing all or choosing none each has one way."),
    rq(6,41,"Counting and probability","Find $x\\ne50$ such that $\\binom{500}{50}=\\binom{500}{x}$.",["$450$","$250$","$10$","$500$"],0,"Combination symmetry gives $\\binom nr=\\binom n{n-r}$, so $x=500-50=450$."),
    rq(6,42,"Binomial theorem","Expand $(2x-y)^3$.",["$8x^3-12x^2y+6xy^2-y^3$","$2x^3-6x^2y+6xy^2-y^3$","$8x^3+12x^2y+6xy^2+y^3$","$8x^3-4x^2y+2xy^2-y^3$"],0,"Use coefficients 1,3,3,1 and powers of $2x$ and $-y$."),
    rq(6,43,"Binomial theorem","Find the middle term of $(\\frac{\\sqrt x}{4}+y^2)^{10}$.",["$\\frac{63x^{5/2}y^{10}}{256}$","$252x^5y^5$","$\\frac{63x^{5/2}y^{10}}{1024}$","$\\frac{63x^5y^{10}}{256}$"],0,"There are 11 terms, so use $r=5$: $\\binom{10}{5}(\\sqrt x/4)^5(y^2)^5$."),
    rq(6,44,"Binomial theorem","Find the term containing $x^6$ in $(x^3+y)^8$.",["$28x^6y^6$","$28x^6y^2$","$56x^6y^2$","$8x^6y^6$"],0,"Choose the $x^3$ term twice: $\\binom82(x^3)^2y^6$."),
    rq(6,54,"Counting and probability","Choose 2 of 15 novels, 2 of 10 plays, and 1 of 8 stories. How many reading lists are possible?",["$37,800$","$4,725$","$378,000$","$1,200$"],0,"Multiply $\\binom{15}{2}\\binom{10}{2}\\binom81=105\\cdot45\\cdot8$."),
    rq(6,55,"Counting and probability","A kicker succeeds with probability .85. What is the probability of exactly 13 successes in 17 attempts?",["$\\binom{17}{13}(0.85)^{13}(0.15)^4\\approx0.1457$","$(0.85)^{13}\\approx0.1209$","$\\binom{17}{4}(0.15)^{13}(0.85)^4$","$13/17\\approx0.7647$"],0,"Choose which 13 attempts succeed, then multiply success and failure probabilities."),
    rq(6,56,"Counting and probability","From 20 students, how many ways can a teacher a) arrange 5 front-row seats and b) choose a 5-person team?",["a) $1,860,480$; b) $15,504$","a) $15,504$; b) $1,860,480$","a) $20^5$; b) $20/5$","Both $15,504$"],0,"Seats are ordered, so use $20P5$; a team is unordered, so use $20C5$."),
    rq(6,103,"Binomial theorem","Evaluate $\\sum_{n=0}^{4}\\frac{n^2+2}{n!}$.",["$127/12$","$96/12$","$11$","$127/24$"],0,"The terms are $2,3,3,11/6,3/4$. With denominator 12 their sum is $127/12$."),
    rq(6,104,"Complex numbers","Convert a) $-6+6i$, b) $7\\sqrt3-7i$, c) $-15i$ to trigonometric form.",["a) $6\\sqrt2\\,\\text{cis}(3\\pi/4)$; b) $14\\,\\text{cis}(11\\pi/6)$; c) $15\\,\\text{cis}(3\\pi/2)$","a) $12\\,\\text{cis}(\\pi/4)$; b) $14\\,\\text{cis}(\\pi/6)$; c) $-15\\,\\text{cis}(\\pi/2)$","a) $6\\sqrt2\\,\\text{cis}(5\\pi/4)$; b) $7\\,\\text{cis}(11\\pi/6)$; c) $15\\,\\text{cis}(\\pi/2)$","a) $6\\,\\text{cis}(3\\pi/4)$; b) $14\\sqrt3\\,\\text{cis}(5\\pi/6)$; c) $15\\,\\text{cis}(2\\pi)$"],0,"Find each modulus and choose the argument from the point's quadrant."),
    rq(6,105,"Complex numbers","Find $|3\\sqrt2-8i|$.",["$\\sqrt{82}$","$11$","$\\sqrt{70}$","$82$"],0,"The modulus is $\\sqrt{(3\\sqrt2)^2+(-8)^2}=\\sqrt{18+64}$." )
);

// Unit 7: review 45-53 and 106-108.
precalculusData.units[6].questions.push(
    rq(7,45,"Sequences","Give the recursive definition for $120,40,13\\frac13,\\ldots$.",["$d_1=120,\\ d_n=\\frac13d_{n-1}$","$d_n=120(1/3)^{n-1}$ only","$d_n=d_{n-1}-1/3$","$d_1=120,\\ d_n=3d_{n-1}$"],0,"Each term is one third of the previous term."),
    rq(7,46,"Sequences","Which sequence is arithmetic?",["$3,6,9,12,15,\\ldots$","$2,4,8,16,32,\\ldots$","$-2,4,-8,16,-32,\\ldots$","$2,4,6,10,16,\\ldots$"],0,"Only the first list has a constant difference, $+3$."),
    rq(7,47,"Sequences","In an arithmetic sequence, $a_5=38$ and $a_9=21$. Find $a_{25}$.",["$-47$","$165.5$","$-17.75$","$59.25$"],0,"Four steps change by $-17$, so $d=-17/4$. Then $a_{25}=a_5+20d=38-85=-47$."),
    rq(7,48,"Sequences","Which sequence is geometric?",["$2,4,8,16,32,\\ldots$","$2,\\frac12,\\frac14,\\frac16,\\frac18,\\ldots$","$-2,0,2,4,6,\\ldots$","$2,7,3,8,4,\\ldots$"],0,"The first sequence has constant ratio 2."),
    rq(7,49,"Sequences","A geometric sequence has $g_2=80000$ and $g_6=32768$. Find $g_7$.",["$26214.4$","$13421.8$","$20971.52$","$16777.216$"],0,"$r^4=32768/80000=0.4096$, so $r=0.8$ and $g_7=32768(0.8)$."),
    rq(7,50,"Sequences","Rewrite $A_1=9,\\ A_n=4+A_{n-1}$ explicitly.",["$A_n=4n+5$","$A_n=9+4n$","$A_n=9(4)^{n-1}$","$A_n=5(4)^n$"],0,"$A_n=9+4(n-1)=4n+5$."),
    rq(7,51,"Series","Find the sum of $\\{5,9.5,14,\\ldots,68\\}$.",["$547.5$","$543$","$552$","$556.5$"],0,"The common difference is 4.5 and $68=5+14(4.5)$, so $n=15$. Then $S=15(5+68)/2$."),
    rq(7,52,"Series","Evaluate $\\sum_{n=1}^{500}(3n+5)$.",["$378,250$","$376,250$","$752,500$","$756,500$"],0,"This arithmetic series has first term 8 and last term 1505, so $S=500(8+1505)/2$."),
    rq(7,53,"Series","Find $1+3+9+\\cdots+6561$.",["$9841$","$11327$","$18336$","$29524$"],0,"Since $6561=3^8$, there are 9 terms. Use the finite geometric sum."),
    rq(7,106,"Series","Find the sum of the first 155 terms of $-13,-10,-7,-4,\\ldots$.",["$33,790$","$67,580$","$33,945$","$449$"],0,"$a_{155}=-13+154(3)=449$, so $S_{155}=155(-13+449)/2=33790$."),
    rq(7,107,"Series","Find the sum of the first 20 terms of $189-126+84-56+\\cdots$.",["$189\\frac{1-(-2/3)^{20}}{1+2/3}\\approx113.366$","$567$","$113.4$ exactly","The series diverges"],0,"This finite geometric series has $a_1=189$, $r=-2/3$, and $n=20$."),
    rq(7,108,"Series","Find the infinite sum $200-100+50-25+\\cdots$.",["$400/3$","$100$","$200$","It diverges"],0,"The ratio is $-1/2$, whose absolute value is below 1, so $S_\\infty=200/(1+1/2)=400/3$." )
);

// Unit 8: review 57-65.
precalculusData.units[7].questions.push(
    rq(8,57,"Parametric equations","For $x=\\sqrt{t-4}$ and $y=-2t+3$, find rectangular form.",["$y=-2x^2-5$","$y=-2x^2-11$","$x=\\sqrt{(y-5)/-2}$","$y=2x^2+5$"],0,"$x^2=t-4$, so $t=x^2+4$; substitute into $y$."),
    rq(8,58,"Parametric equations","What restrictions accompany the equations in #57?",["$t\\ge4,\\ x\\ge0,\\ y\\le-5$","$t\\le4,\\ x\\ge0,\\ y\\ge-5$","$t\\ge4,\\ x\\le0,\\ y\\le-5$","No restrictions"],0,"The square root requires $t\\ge4$ and produces $x\\ge0$; then $y=-2t+3\\le-5$."),
    rq(8,59,"Parametric equations","Describe $x=2\\sin\\theta+1,\\ y=3\\cos\\theta-1$.",["Vertical ellipse centered $(1,-1)$ with horizontal radius 2 and vertical radius 3","Horizontal ellipse centered $(-1,1)$ with radii 3 and 2","Circle centered $(1,-1)$ with radius 3","Parabola with vertex $(1,-1)$"],0,"Eliminating gives $(x-1)^2/4+(y+1)^2/9=1$."),
    rq(8,60,"Parametric equations","Identify the curve $x=3t^2,\\ y=1-2t^2$.",["The ray $y=1-\\frac23x$ with $x\\ge0$","The entire line $y=1-\\frac23x$","The ray $y=1+\\frac23x$ with $x\\le0$","A parabola"],0,"Since $t^2=x/3$, $y=1-2x/3$, and $x=3t^2\\ge0$."),
    rq(8,61,"Polar coordinates","Convert $(-4,5\\pi/6)$ to rectangular form.",["$(2\\sqrt3,-2)$","$(-2\\sqrt3,2)$","$(-2\\sqrt3,-2)$","$(2\\sqrt3,2)$"],0,"Use $x=r\\cos\\theta$ and $y=r\\sin\\theta$; the negative radius reverses both signs."),
    rq(8,62,"Polar coordinates","Convert $(-8,8)$ to polar form with positive radius and $0\\le\\theta<2\\pi$.",["$(8\\sqrt2,3\\pi/4)$","$(8\\sqrt2,\\pi/4)$","$(16,3\\pi/4)$","$(8,-\\pi/4)$"],0,"The point is in Quadrant II, with radius $8\\sqrt2$ and reference angle $\\pi/4$."),
    rq(8,63,"Polar coordinates","Describe $r=-6\\cos\\theta$.",["Circle centered $(-3,0)$ with radius 3","Circle centered $(3,0)$ with radius 6","Four-petal rose","Limaçon with inner loop"],0,"Multiply by $r$: $r^2=-6r\\cos\\theta$, so $x^2+y^2=-6x$ and complete the square."),
    rq(8,64,"Polar coordinates","Describe $r=3+4\\sin\\theta$.",["A y-axis-symmetric limaçon with an inner loop","A circle centered at $(0,3)$","A four-petal rose","A cardioid with no inner loop"],0,"Because $|4|>|3|$, the limaçon has an inner loop; sine gives y-axis symmetry."),
    rq(8,65,"Polar coordinates","Describe $r=5\\cos2\\theta$.",["A four-petal rose with petals on the coordinate axes","A two-petal rose","A circle of radius 5","A four-petal rose rotated $45^\\circ$"],0,"Even $n=2$ gives $2n=4$ petals; cosine places them on the axes.")
);

// Unit 9: review 75-93.
precalculusData.units[8].questions.push(
    rq(9,75,"Limits","Evaluate $\\lim_{\\theta\\to5\\pi/6}\\frac{\\cos\\theta}{\\sin2\\theta}$.",["$1$","$-1$","$\\sqrt3/2$","Does not exist"],0,"Direct substitution gives $(-\\sqrt3/2)/(-\\sqrt3/2)=1$."),
    rq(9,76,"Limits","Evaluate $\\lim_{x\\to-9}\\frac{x^2+8x-9}{x^2-81}$.",["$5/9$","$-5/9$","$0$","Does not exist"],0,"Factor and cancel $x+9$, then evaluate $(x-1)/(x-9)$ at -9."),
    rq(9,77,"Limits","Evaluate $\\lim_{x\\to-2}\\frac{x^3+8}{3x^2+2x-8}$.",["$-6/5$","$6/5$","$0$","Does not exist"],0,"Factor $x^3+8=(x+2)(x^2-2x+4)$ and the denominator $(x+2)(3x-4)$."),
    rq(9,78,"Limits","Evaluate $\\lim_{x\\to5}\\frac{\\sqrt{x+4}-3}{x-5}$.",["$1/6$","$1/3$","$6$","$0$"],0,"Multiply by the conjugate; the remaining denominator approaches $\\sqrt9+3=6$."),
    rq(9,79,"Limits","Evaluate $\\lim_{x\\to-6}\\frac{\\frac6{x-3}-\\frac4x}{x+6}$.",["$1/27$","$-1/27$","$2/9$","Does not exist"],0,"Combine the numerator to $2(x+6)/[x(x-3)]$, cancel $x+6$, then substitute -6."),
    rq(9,80,"Limits","Evaluate $\\lim_{x\\to\\infty}\\frac{5x^2+2x-7}{9x^2-100}$.",["$5/9$","$9/5$","$0$","$\\infty$"],0,"Equal degrees give the ratio of leading coefficients."),
    rq(9,81,"Limits","If a rational function has numerator degree 4 and denominator degree 6, what is its limit as $x\\to-\\infty$?",["$0$","$1$","$\\infty$","It always does not exist"],0,"The denominator grows two powers faster, so the ratio approaches 0."),
    rq(9,82,"Limits","Evaluate $\\lim_{x\\to\\infty}\\frac{x^4+1}{x^2+5}$.",["It is unbounded and tends to $\\infty$","$0$","$1$","$1/5$"],0,"The numerator degree is two higher; the expression behaves like $x^2$."),
    rq(9,83,"Derivatives","Evaluate $\\lim_{h\\to0}\\frac{(x+h)^4-2(x+h)^3+7-x^4+2x^3-7}{h}$.",["$4x^3-6x^2$","$4x^3+6x^2$","$x^4-2x^3+7$","$0$"],0,"This is the difference quotient for $f(x)=x^4-2x^3+7$, so it equals $f'(x)$."),
    rq(9,84,"Derivatives","Differentiate $y=6x^3-10\\sqrt x+\\frac5x$.",["$18x^2-\\frac5{\\sqrt x}-\\frac5{x^2}$","$18x^2-10\\sqrt x+5$","$18x^2-5\\sqrt x+5/x^2$","$6x^2-5/\\sqrt x-5/x$"],0,"Rewrite as $6x^3-10x^{1/2}+5x^{-1}$ and apply the power rule."),
    rq(9,85,"Derivatives","Differentiate $y=2\\sin x+4\\cos x-8$.",["$2\\cos x-4\\sin x$","$2\\cos x+4\\sin x$","$2\\sin x-4\\cos x$","$0$"],0,"Derivative of sine is cosine; derivative of cosine is negative sine."),
    rq(9,86,"Derivatives","Differentiate $y=4x^5\\sin x$.",["$20x^4\\sin x+4x^5\\cos x$","$20x^4\\cos x$","$4x^5\\cos x$","$20x^4\\sin x-4x^5\\cos x$"],0,"Use the product rule."),
    rq(9,87,"Derivatives","Differentiate $y=\\pi^3$.",["$0$","$3\\pi^2$","$\\pi^3x$","$1$"],0,"$\\pi^3$ is a constant."),
    rq(9,88,"Derivatives","Differentiate $f(x)=\\frac{\\cos x}{x^3}$.",["$\\frac{-x\\sin x-3\\cos x}{x^4}$","$\\frac{-\\sin x}{3x^2}$","$\\frac{x\\sin x-3\\cos x}{x^4}$","$\\frac{-x^3\\sin x-3x^2\\cos x}{x^3}$"],0,"Use the quotient rule and simplify by a factor of $x^2$."),
    rq(9,89,"Derivatives","Differentiate $y=x^{3/4}-\\frac7{x^3}$.",["$\\frac3{4x^{1/4}}+\\frac{21}{x^4}$","$\\frac34x^{1/4}-\\frac{21}{x^2}$","$\\frac3{4x^{1/4}}-\\frac{21}{x^4}$","$x^{-1/4}+7x^{-4}$"],0,"Rewrite the second term as $-7x^{-3}$; its derivative is $+21x^{-4}$."),
    rq(9,90,"Derivatives","Find the tangent line to $f(x)=x^4-5x^3-20$ at $x=-2$.",["$y-36=-92(x+2)$","$y+36=92(x-2)$","$y-36=92(x+2)$","$y=-92x+148$"],0,"$f(-2)=36$ and $f'(-2)=4(-2)^3-15(-2)^2=-92$."),
    rq(9,91,"Derivatives","Find the tangent line to $g(\\theta)=6\\cos\\theta$ at $\\theta=5\\pi/3$.",["$y-3=3\\sqrt3(\\theta-5\\pi/3)$","$y+3=-3\\sqrt3(\\theta+5\\pi/3)$","$y-3=-3\\sqrt3(\\theta-5\\pi/3)$","$y=6\\cos(5\\pi/3)$"],0,"The point is $(5\\pi/3,3)$ and $g'(5\\pi/3)=-6\\sin(5\\pi/3)=3\\sqrt3$."),
    rq(9,92,"Derivatives","Where does $f(x)=2x^3-3x^2-12x+5$ have horizontal tangents?",["$(2,-15)$ and $(-1,12)$","$(2,0)$ and $(-1,0)$","$(0,5)$ only","$(-2,-15)$ and $(1,12)$"],0,"Solve $f'(x)=6(x-2)(x+1)=0$, then evaluate the original function."),
    rq(9,93,"Derivatives","Where does $g(x)=\\cos x\\sin x$ have horizontal tangents on $[0,2\\pi)$?",["$(\\pi/4,1/2),(3\\pi/4,-1/2),(5\\pi/4,1/2),(7\\pi/4,-1/2)$","$(0,0),(\\pi,0)$","$(\\pi/2,0),(3\\pi/2,0)$","$(\\pi/4,1),(5\\pi/4,-1)$"],0,"$g'(x)=\\cos^2x-\\sin^2x=\\cos2x$. Set it to zero and substitute into $g$.")
);

// The packet places #66-74 in one graph-matching block, but the district curriculum
// classifies those graphs by family. Move them to their actual instructional homes.
const questionHomes = new Map([
    [66, "unit-8"], [67, "unit-8"],
    [68, "unit-1"], [69, "unit-1"], [70, "unit-1"], [71, "unit-1"], [72, "unit-1"]
]);
const sourceNumber = item => Number(item.source.match(/#(\d+)/)?.[1] || 0);
questionHomes.forEach((targetUnitId, number) => {
    const sourceUnit = precalculusData.units.find(unit => unit.questions.some(item => sourceNumber(item) === number));
    const targetUnit = precalculusData.units.find(unit => unit.id === targetUnitId);
    if (!sourceUnit || !targetUnit || sourceUnit === targetUnit) return;
    const index = sourceUnit.questions.findIndex(item => sourceNumber(item) === number);
    targetUnit.questions.push(sourceUnit.questions.splice(index, 1)[0]);
});
precalculusData.units.forEach(unit => unit.questions.sort((a, b) => sourceNumber(a) - sourceNumber(b)));
