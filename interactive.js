// Canvas-based Precalculus interactives, one for each course unit.

export function initSandbox(canvas, unitId, controlsContainer) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    controlsContainer.innerHTML = '';
    let params = {};

    const redraw = () => requestAnimationFrame(draw);

    if (unitId === 'unit-1') {
        params = { a: 3, h: -1, k: 2, hole: 2 };
        slider('Factor a', 'a', -6, 6, 3, 0.5);
        slider('Vertical asymptote h', 'h', -4, 4, -1, 0.5);
        slider('Horizontal asymptote k', 'k', -4, 4, 2, 0.5);
        slider('Hole x-coordinate', 'hole', -4, 4, 2, 0.5);
    } else if (unitId === 'unit-2') {
        params = { angle: 60 };
        slider('Angle θ (degrees)', 'angle', 0, 360, 60, 5, 0);
    } else if (unitId === 'unit-3') {
        params = { target: 0.5, frequency: 1 };
        slider('Target value', 'target', -1, 1, 0.5, 0.1);
        slider('Frequency b', 'frequency', 1, 4, 1, 1, 0);
    } else if (unitId === 'unit-4') {
        params = { family: 'sine', a: 2, b: 1, h: 0, k: 0 };
        select('Trig family', 'family', [
            { value: 'sine', label: 'Sine' },
            { value: 'cosine', label: 'Cosine' },
            { value: 'tangent', label: 'Tangent' },
            { value: 'cotangent', label: 'Cotangent' },
            { value: 'secant', label: 'Secant' },
            { value: 'cosecant', label: 'Cosecant' }
        ]);
        slider('Signed coefficient a', 'a', -4, 4, 2, 0.5);
        slider('Input scale b', 'b', 0.5, 4, 1, 0.5);
        slider('Phase shift h', 'h', -3, 3, 0, 0.25);
        slider('Midline k', 'k', -3, 3, 0, 0.5);
    } else if (unitId === 'unit-5') {
        params = { sideA: 4, sideC: 6, angleB: 55 };
        slider('Side a', 'sideA', 2, 8, 4, 0.25);
        slider('Side c', 'sideC', 2, 8, 6, 0.25);
        slider('Included angle B', 'angleB', 20, 140, 55, 5, 0);
    } else if (unitId === 'unit-6') {
        params = { real: -4, imaginary: 3 };
        slider('Real part a', 'real', -6, 6, -4, 0.5);
        slider('Imaginary part b', 'imaginary', -6, 6, 3, 0.5);
    } else if (unitId === 'unit-7') {
        params = { first: 2, change: 1.5, mode: 'arithmetic' };
        select('Sequence type', 'mode', [{ value: 'arithmetic', label: 'Arithmetic' }, { value: 'geometric', label: 'Geometric' }]);
        slider('First term', 'first', -5, 5, 2, 0.5);
        slider('Difference / ratio', 'change', -2, 3, 1.5, 0.25);
    } else if (unitId === 'unit-8') {
        params = { family: 'rose', a: 5, b: 2 };
        select('Polar family', 'family', [{ value: 'rose', label: 'Rose: r = a cos(bθ)' }, { value: 'limacon', label: 'Limaçon: r = b + a sinθ' }, { value: 'circle', label: 'Circle: r = a cosθ' }]);
        slider('Scale a', 'a', 1, 6, 5, 0.5);
        slider('Shape b', 'b', 1, 5, 2, 1, 0);
    } else {
        params = { x: -1.2, delta: 1.5 };
        slider('Tangent point x', 'x', -2.5, 2.5, -1.2, 0.1);
        slider('Secant step h', 'delta', 0.2, 2.5, 1.5, 0.1);
    }

    draw();

    function slider(label, key, min, max, initial, step, digits = 1) {
        const group = document.createElement('div');
        group.className = 'slider-group';
        group.innerHTML = `<div class="slider-label-row"><span class="slider-name">${label}</span><span class="slider-val" data-value>${Number(initial).toFixed(digits)}</span></div>`;
        const input = document.createElement('input');
        input.type = 'range';
        input.className = 'slider-input';
        input.min = min;
        input.max = max;
        input.step = step;
        input.value = initial;
        input.addEventListener('input', () => {
            params[key] = Number(input.value);
            group.querySelector('[data-value]').textContent = params[key].toFixed(digits);
            redraw();
        });
        group.appendChild(input);
        controlsContainer.appendChild(group);
    }

    function select(label, key, options) {
        const group = document.createElement('div');
        group.className = 'slider-group';
        const labelNode = document.createElement('span');
        labelNode.className = 'slider-name';
        labelNode.textContent = label;
        const input = document.createElement('select');
        input.className = 'theme-select select-block';
        options.forEach(option => {
            const node = document.createElement('option');
            node.value = option.value;
            node.textContent = option.label;
            input.appendChild(node);
        });
        input.value = params[key];
        input.addEventListener('change', () => {
            params[key] = input.value;
            redraw();
        });
        group.append(labelNode, input);
        controlsContainer.appendChild(group);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#07111e';
        ctx.fillRect(0, 0, width, height);
        if (unitId === 'unit-2') drawUnitCircle();
        else if (unitId === 'unit-5') drawTriangle();
        else if (unitId === 'unit-6') drawComplex();
        else if (unitId === 'unit-7') drawSequence();
        else if (unitId === 'unit-8') drawPolar();
        else if (unitId === 'unit-9') drawDerivative();
        else {
            grid();
            if (unitId === 'unit-1') drawRational();
            if (unitId === 'unit-3') drawTrigEquation();
            if (unitId === 'unit-4') drawTrigGraph();
        }
    }

    function grid(scale = 38, x0 = width / 2, y0 = height / 2) {
        ctx.strokeStyle = 'rgba(255,255,255,.055)';
        ctx.lineWidth = 1;
        for (let x = x0 % scale; x < width; x += scale) line(x, 0, x, height);
        for (let y = y0 % scale; y < height; y += scale) line(0, y, width, y);
        ctx.strokeStyle = 'rgba(255,255,255,.35)';
        line(0, y0, width, y0);
        line(x0, 0, x0, height);
    }

    function line(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function label(text, x, y, color = '#fff', align = 'left', size = 13) {
        ctx.fillStyle = color;
        ctx.font = `600 ${size}px Inter, sans-serif`;
        ctx.textAlign = align;
        ctx.fillText(text, x, y);
    }

    function plot(fn, color = '#00f5ff', scale = 38, x0 = width / 2, y0 = height / 2, domain = [-6, 6]) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        let active = false;
        for (let px = 0; px <= width; px += 2) {
            const x = (px - x0) / scale;
            if (x < domain[0] || x > domain[1]) { active = false; continue; }
            const y = fn(x);
            const py = y0 - y * scale;
            if (!Number.isFinite(y) || py < -height || py > height * 2) { active = false; continue; }
            if (!active) { ctx.moveTo(px, py); active = true; }
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    function drawRational() {
        const scale = 38, x0 = width / 2, y0 = height / 2;
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = '#ffb703';
        line(x0 + params.h * scale, 0, x0 + params.h * scale, height);
        ctx.strokeStyle = '#00f5d4';
        line(0, y0 - params.k * scale, width, y0 - params.k * scale);
        ctx.setLineDash([]);
        plot(x => params.a / (x - params.h) + params.k, '#ff758f', scale, x0, y0);
        const holeY = params.a / (params.hole - params.h) + params.k;
        if (Number.isFinite(holeY)) {
            ctx.fillStyle = '#07111e';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x0 + params.hole * scale, y0 - holeY * scale, 7, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        }
        label(`VA x=${params.h.toFixed(1)}  HA y=${params.k.toFixed(1)}`, 16, 25);
        label(`hole at x=${params.hole.toFixed(1)}`, 16, 46, '#aeb8c8');
    }

    function drawUnitCircle() {
        const cx = width / 2, cy = height / 2 + 10, r = 135;
        ctx.strokeStyle = 'rgba(255,255,255,.12)';
        ctx.lineWidth = 1;
        line(cx - 180, cy, cx + 180, cy);
        line(cx, cy - 180, cx, cy + 180);
        ctx.strokeStyle = '#9d4edd';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        const theta = params.angle * Math.PI / 180;
        const x = cx + r * Math.cos(theta), y = cy - r * Math.sin(theta);
        ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 3; line(cx, cy, x, y);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = '#00f5d4'; line(x, y, x, cy); line(cx, y, x, y); ctx.setLineDash([]);
        ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
        label(`θ = ${params.angle.toFixed(0)}°`, 18, 27);
        label(`cos θ = ${Math.cos(theta).toFixed(3)}`, 18, 50, '#00f5d4');
        label(`sin θ = ${Math.sin(theta).toFixed(3)}`, 18, 71, '#ff758f');
        label(`tan θ = ${Math.abs(Math.cos(theta)) < .001 ? 'undefined' : Math.tan(theta).toFixed(3)}`, 18, 92, '#b892ff');
    }

    function drawTrigEquation() {
        const x0 = 22, y0 = height / 2, scaleX = (width - 44) / (2 * Math.PI), scaleY = 125;
        ctx.strokeStyle = 'rgba(255,255,255,.35)'; line(x0, y0, width - 14, y0); line(x0, 30, x0, height - 30);
        ctx.strokeStyle = '#ffb703'; ctx.setLineDash([5, 5]); line(x0, y0 - params.target * scaleY, width - 14, y0 - params.target * scaleY); ctx.setLineDash([]);
        ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 3; ctx.beginPath();
        for (let px = x0; px <= width - 14; px += 2) {
            const angle = (px - x0) / scaleX;
            const py = y0 - Math.sin(params.frequency * angle) * scaleY;
            if (px === x0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        const solutions = [];
        for (let i = 0; i < 800; i++) {
            const x = 2 * Math.PI * i / 800;
            const error = Math.abs(Math.sin(params.frequency * x) - params.target);
            if (error < .008 && !solutions.some(s => Math.abs(s - x) < .04)) solutions.push(x);
        }
        solutions.forEach(x => {
            ctx.fillStyle = '#ff758f'; ctx.beginPath(); ctx.arc(x0 + x * scaleX, y0 - params.target * scaleY, 5, 0, Math.PI * 2); ctx.fill();
        });
        label(`sin(${params.frequency.toFixed(0)}x) = ${params.target.toFixed(1)}`, 18, 24);
        label(`${solutions.length} intersection${solutions.length === 1 ? '' : 's'} on [0, 2π)`, 18, height - 15, '#aeb8c8');
    }

    function drawTrigGraph() {
        const scale = 38, x0 = width / 2, y0 = height / 2;
        const trigFunctions = {
            sine: Math.sin,
            cosine: Math.cos,
            tangent: Math.tan,
            cotangent: value => Math.cos(value) / Math.sin(value),
            secant: value => 1 / Math.cos(value),
            cosecant: value => 1 / Math.sin(value)
        };
        const shortNames = { sine: 'sin', cosine: 'cos', tangent: 'tan', cotangent: 'cot', secant: 'sec', cosecant: 'csc' };
        const partnerZero = ['tangent', 'secant'].includes(params.family) ? Math.PI / 2 : 0;
        const hasAsymptotes = ['tangent', 'cotangent', 'secant', 'cosecant'].includes(params.family);
        const shortPeriod = ['tangent', 'cotangent'].includes(params.family);
        const period = (shortPeriod ? Math.PI : 2 * Math.PI) / params.b;

        ctx.strokeStyle = '#00f5d4';
        ctx.setLineDash([5, 5]);
        line(0, y0 - params.k * scale, width, y0 - params.k * scale);
        if (hasAsymptotes) {
            ctx.strokeStyle = 'rgba(255,183,3,.65)';
            for (let n = -10; n <= 10; n++) {
                const asymptote = params.h + (partnerZero + n * Math.PI) / params.b;
                const px = x0 + asymptote * scale;
                if (px >= 0 && px <= width) line(px, 0, px, height);
            }
        }
        ctx.setLineDash([]);

        const trig = trigFunctions[params.family];
        plot(x => params.a * trig(params.b * (x - params.h)) + params.k, '#9d4edd', scale, x0, y0);
        label(`y = ${params.a.toFixed(1)} ${shortNames[params.family]}(${params.b.toFixed(1)}(x - ${params.h.toFixed(2)})) + ${params.k.toFixed(1)}`, 14, 24);
        const feature = ['sine', 'cosine'].includes(params.family)
            ? `amplitude ${Math.abs(params.a).toFixed(1)}`
            : ['secant', 'cosecant'].includes(params.family)
                ? `range outside ${params.k.toFixed(1)} ± ${Math.abs(params.a).toFixed(1)}`
                : `no amplitude`;
        label(`${feature}  •  period ${period.toFixed(2)}`, 14, 46, '#aeb8c8');
        if (hasAsymptotes) label('gold dashed lines: vertical asymptotes', 14, 68, '#ffb703');
    }

    function drawTriangle() {
        const A = { x: 55, y: height - 65 };
        const scale = 36;
        const B = { x: A.x + params.sideC * scale, y: A.y };
        const rad = params.angleB * Math.PI / 180;
        const C = { x: B.x - params.sideA * scale * Math.cos(rad), y: B.y - params.sideA * scale * Math.sin(rad) };
        ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath(); ctx.stroke();
        [A,B,C].forEach((p,i) => { ctx.fillStyle = ['#ff758f','#ffb703','#00f5d4'][i]; ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fill(); });
        const sideB = Math.sqrt(params.sideA ** 2 + params.sideC ** 2 - 2 * params.sideA * params.sideC * Math.cos(rad));
        const area = .5 * params.sideA * params.sideC * Math.sin(rad);
        label('A', A.x - 18, A.y + 4); label('B', B.x + 12, B.y + 4); label('C', C.x, C.y - 12, '#fff', 'center');
        label(`a=${params.sideA.toFixed(2)}  c=${params.sideC.toFixed(2)}  B=${params.angleB.toFixed(0)}°`, 16, 27);
        label(`Law of Cosines: b ≈ ${sideB.toFixed(2)}`, 16, 50, '#00f5d4');
        label(`Area ≈ ${area.toFixed(2)}`, 16, 72, '#ffb703');
    }

    function drawComplex() {
        const scale = 27, x0 = width / 2, y0 = height / 2 + 20;
        grid(scale, x0, y0);
        const x = x0 + params.real * scale, y = y0 - params.imaginary * scale;
        ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 4; line(x0, y0, x, y);
        ctx.fillStyle = '#ff758f'; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
        const modulus = Math.hypot(params.real, params.imaginary);
        let angle = Math.atan2(params.imaginary, params.real);
        if (angle < 0) angle += 2 * Math.PI;
        label(`z = ${params.real.toFixed(1)} ${params.imaginary < 0 ? '−' : '+'} ${Math.abs(params.imaginary).toFixed(1)}i`, 16, 25);
        label(`|z| = ${modulus.toFixed(3)}`, 16, 48, '#00f5d4');
        label(`arg(z) ≈ ${angle.toFixed(3)} rad`, 16, 70, '#ffb703');
    }

    function drawSequence() {
        const terms = Array.from({ length: 8 }, (_, i) => params.mode === 'arithmetic'
            ? params.first + i * params.change
            : params.first * Math.pow(params.change, i));
        const finite = terms.filter(Number.isFinite);
        const min = Math.min(0, ...finite), max = Math.max(1, ...finite);
        const span = Math.max(1, max - min);
        const baseY = height - 45 + min / span * (height - 110);
        ctx.strokeStyle = 'rgba(255,255,255,.3)'; line(34, baseY, width - 20, baseY);
        terms.forEach((value, i) => {
            const x = 55 + i * 50;
            const y = height - 45 - (value - min) / span * (height - 110);
            ctx.strokeStyle = 'rgba(0,245,255,.25)'; line(x, baseY, x, y);
            ctx.fillStyle = '#00f5ff'; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
            label(`${i + 1}`, x, height - 22, '#aeb8c8', 'center', 11);
            label(Number(value).toFixed(1), x, Math.max(92, y - 11), '#fff', 'center', 10);
        });
        const sum = terms.reduce((total, value) => total + value, 0);
        label(`${params.mode === 'arithmetic' ? 'Arithmetic' : 'Geometric'} sequence`, 16, 25);
        label(`S₈ = ${sum.toFixed(2)}`, 16, 48, '#ffb703');
    }

    function drawPolar() {
        const cx = width / 2, cy = height / 2 + 10, scale = 25;
        ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1;
        for (let r = 25; r <= 150; r += 25) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke(); }
        for (let t = 0; t < Math.PI; t += Math.PI/6) line(cx - Math.cos(t)*170, cy + Math.sin(t)*170, cx + Math.cos(t)*170, cy - Math.sin(t)*170);
        const radius = theta => params.family === 'rose' ? params.a * Math.cos(params.b * theta)
            : params.family === 'limacon' ? params.b + params.a * Math.sin(theta)
            : params.a * Math.cos(theta);
        ctx.strokeStyle = '#ff758f'; ctx.lineWidth = 3; ctx.beginPath();
        for (let i = 0; i <= 1000; i++) {
            const theta = i / 1000 * Math.PI * 2;
            const r = radius(theta) * scale;
            const x = cx + r * Math.cos(theta), y = cy - r * Math.sin(theta);
            if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
        const equation = params.family === 'rose' ? `r = ${params.a.toFixed(1)} cos(${params.b.toFixed(0)}θ)`
            : params.family === 'limacon' ? `r = ${params.b.toFixed(0)} + ${params.a.toFixed(1)} sin θ`
            : `r = ${params.a.toFixed(1)} cos θ`;
        label(equation, 16, 25);
    }

    function drawDerivative() {
        const scale = 43, x0 = width / 2, y0 = height / 2;
        grid(scale, x0, y0);
        const f = x => .35 * x ** 3 - 1.4 * x;
        const derivative = x => 1.05 * x ** 2 - 1.4;
        plot(f, '#9d4edd', scale, x0, y0, [-4, 4]);
        const x1 = params.x, x2 = x1 + params.delta;
        const mTan = derivative(x1), mSec = (f(x2) - f(x1)) / params.delta;
        const tangent = x => f(x1) + mTan * (x - x1);
        const secant = x => f(x1) + mSec * (x - x1);
        plot(tangent, '#00f5d4', scale, x0, y0, [-4, 4]);
        plot(secant, '#ffb703', scale, x0, y0, [-4, 4]);
        [[x1,f(x1)],[x2,f(x2)]].forEach(([x,y],i) => { ctx.fillStyle = i ? '#ffb703' : '#ff758f'; ctx.beginPath(); ctx.arc(x0+x*scale,y0-y*scale,6,0,Math.PI*2); ctx.fill(); });
        label(`tangent slope f′(${x1.toFixed(1)}) = ${mTan.toFixed(2)}`, 14, 24, '#00f5d4');
        label(`secant slope = ${mSec.toFixed(2)}`, 14, 46, '#ffb703');
    }
}
