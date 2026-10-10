const cv = document.getElementById('cv'), x = cv.getContext('2d'), $ = id => document.getElementById(id);
let hs = { t: 0, p: 0, f: 0, s: 0, g: 0, b: 0, h: 0, c: 0, m: 0, w: 0, x: 0, k: 0, i: 0, u: 0 };
try { Object.assign(hs, JSON.parse(localStorage.getItem('arc') || '{}')); if (!hs.v2) { hs.t = hs.p = hs.s = 0; hs.v2 = 1 } } catch (e) { }
const save = () => { try { localStorage.setItem('arc', JSON.stringify(hs)) } catch (e) { } };
let cur, score = 0, st = 'ready', overAt = 0;
const bk = k => diff === 1 ? k : k + diff;
function setScore(s) { score = s; $('sc').textContent = s; const b = bk(cur.k); if (s > (hs[b] || 0)) { hs[b] = s; $('hi').textContent = s } }
let ac, on = true, beat = 0, nt = 0, paused = false, mv = hs.mv ?? .7, sv = hs.sv ?? .8, vb = hs.vb ?? 1, diff = hs.d ?? 1;
const SPD = () => [.75, 1, 1.4][diff];
function vib(n) { if (vb && navigator.vibrate) try { navigator.vibrate(n) } catch (e) { } }
const LEAD = [12, 15, 19, 15, 12, 15, 19, 22, 10, 14, 17, 14, 10, 14, 17, 21, 8, 12, 15, 12, 8, 12, 15, 20, 7, 10, 14, 10, 7, 11, 14, 19];
const MEL = [LEAD, [0, 3, 7, 12, 7, 3, 0, 3, 10, 14, 17, 22, 17, 14, 10, 14, 8, 12, 15, 20, 15, 12, 8, 12, 7, 10, 14, 19, 14, 10, 7, 10], [12, 12, 19, 12, 15, 12, 19, 12, 10, 10, 17, 10, 14, 10, 17, 10, 8, 8, 15, 8, 12, 8, 15, 8, 7, 7, 14, 7, 10, 7, 14, 7], [19, 15, 12, 15, 19, 15, 12, 7, 17, 14, 10, 14, 17, 14, 10, 5, 15, 12, 8, 12, 15, 12, 8, 3, 14, 10, 7, 10, 14, 10, 7, 2]];
const TRK = { t: [0, .19, 0, 'square'], p: [1, .15, 2, 'square'], f: [2, .22, 5, 'triangle'], s: [3, .17, -3, 'sawtooth'], g: [1, .25, 3, 'triangle'], b: [2, .16, -2, 'square'], h: [3, .14, 0, 'sawtooth'], c: [0, .13, 4, 'square'], m: [1, .22, -5, 'triangle'], w: [2, .18, 7, 'square'], x: [3, .28, 2, 'triangle'], k: [0, .2, -4, 'sawtooth'], i: [1, .16, 1, 'square'], u: [2, .15, 3, 'triangle'] };
function tone(f, t, d, ty, v) { const o = ac.createOscillator(), g = ac.createGain(); o.type = ty; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d) }
function sfx(f, d, ty) { if (ty === 'sawtooth') vib(70); if (ac && sv > 0) tone(f, ac.currentTime, d || .1, ty || 'square', .08 * sv) }
function tick() { if (!ac) return; const [mi, sp, tr, wv] = TRK[cur.k] || TRK.t; if (nt < ac.currentTime) nt = ac.currentTime; while (nt < ac.currentTime + .3) { if (mv > 0 && st === 'play' && !paused) { const g = wv === 'sawtooth' ? .5 : 1; tone(220 * 2 ** ((MEL[mi][beat % 32] + tr) / 12), nt, sp * .9, wv, .05 * mv * g); if (beat % 2 === 0) tone(110 * 2 ** (([0, -2, -4, -5][beat >> 3 & 3] + tr) / 12), nt, sp * 1.8, 'triangle', .12 * mv) } beat++; nt += sp } }
function audio() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)() } catch (e) { return } nt = ac.currentTime + .1; setInterval(tick, 80) } if (ac.state === 'suspended') ac.resume() }
function over() { if (st === 'over') return; st = 'over'; overAt = Date.now(); save(); sfx(120, .5, 'sawtooth'); vib([80, 50, 160]); setTimeout(showGameOverModal, 650); }
function msg(a, b) { x.fillStyle = 'rgba(21,18,46,.85)'; x.fillRect(0, cv.height / 2 - 40, cv.width, 80); x.textAlign = 'center'; x.shadowColor = '#00f0ff'; x.shadowBlur = 10; x.fillStyle = '#00f0ff'; x.font = 'bold 18px Silkscreen,monospace'; x.fillText(a, cv.width / 2, cv.height / 2 - 4); x.shadowBlur = 0; x.fillStyle = '#f4f1ff'; x.font = '11px Silkscreen,monospace'; x.fillText(b, cv.width / 2, cv.height / 2 + 20) }

/* ---------- Tetris ---------- */
const T = {
    k: 't', name: 'TETRIS', w: 240, h: 480, tip: 'Arrows move, up rotates, tap, click or space drops.',
    P: [[[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]]],
    C: ['#00f0ff', '#fff200', '#bf40ff', '#39ff14', '#ff2bd6', '#2d6bff', '#ff6a00'],
    init() { this.g = Array.from({ length: 20 }, () => Array(10).fill(0)); this.lines = 0; this.acc = 0; this.nx = null; this.bag = null; this.end = 'GAME OVER'; this.spawn(); setScore(0); $('ex').textContent = 'Lines 0' },
    pick() { if (!this.bag || !this.bag.length) this.bag = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - .5); return this.bag.pop() },
    shape(i) { let m = this.P[i].map(r => r.slice()); if (i === 0 && Math.random() < .5) m = m[0].map((_, k) => m.map(r => r[k])); return m },
    prev() { const c = $('nx'), q = c.getContext('2d'); q.clearRect(0, 0, c.width, c.height); const m = this.P[this.nx], s = 12, ox = (c.width - m[0].length * s) / 2, oy = (c.height - m.length * s) / 2; q.fillStyle = this.C[this.nx]; m.forEach((r, j) => r.forEach((v, i) => v && q.fillRect(ox + i * s, oy + j * s, s - 2, s - 2))) },
    spawn() { if (this.nx == null) this.nx = this.pick(); const i = this.nx; this.nx = this.pick(); this.m = this.shape(i); this.i = i + 1; this.px = (10 - this.m[0].length) / 2 | 0; this.py = 0; this.prev(); if (this.hit(this.m, this.px, this.py)) over() },
    hit(m, px, py) { return m.some((r, j) => r.some((v, i) => v && (px + i < 0 || px + i > 9 || py + j > 19 || this.g[py + j][px + i]))) },
    rot() { const m = this.m, n = m[0].map((_, i) => m.map(r => r[i]).reverse()); for (const d of [0, -1, 1, -2, 2]) if (!this.hit(n, this.px + d, this.py)) { this.m = n; this.px += d; return } },
    drop() { if (!this.hit(this.m, this.px, this.py + 1)) { this.py++; return true } this.lock(); return false },
    lock() { this.m.forEach((r, j) => r.forEach((v, i) => { if (v) this.g[this.py + j][this.px + i] = this.i })); const keep = this.g.filter(r => r.some(v => !v)), n = 20 - keep.length; while (keep.length < 20) keep.unshift(Array(10).fill(0)); this.g = keep; this.lines += n; setScore(score + n); if (n) { sfx(600 + n * 120, .25); vib(40 * n) } $('ex').textContent = 'Lines ' + this.lines; this.spawn() },
    update(dt) { this.acc += dt; if (this.acc > Math.max(70, (600 - this.lines * 20) / SPD())) { this.acc = 0; this.drop() } },
    key(k) { if (k === 'left' && !this.hit(this.m, this.px - 1, this.py)) this.px--; else if (k === 'right' && !this.hit(this.m, this.px + 1, this.py)) this.px++; else if (k === 'down') this.drop(); else if (k === 'up') this.rot(); else if (k === 'act') { while (this.drop()); } },
    draw() { x.fillStyle = '#05020c'; x.fillRect(0, 0, 240, 480); x.strokeStyle = 'rgba(255,255,255,.05)'; for (let i = 1; i < 10; i++) { x.beginPath(); x.moveTo(i * 24, 0); x.lineTo(i * 24, 480); x.stroke() } for (let j = 1; j < 20; j++) { x.beginPath(); x.moveTo(0, j * 24); x.lineTo(240, j * 24); x.stroke() } const cell = (i, j, c) => { x.shadowColor = c; x.shadowBlur = 10; x.fillStyle = c; x.fillRect(i * 24 + 1, j * 24 + 1, 22, 22); x.shadowBlur = 0; x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(i * 24 + 1, j * 24 + 1, 22, 4); x.fillRect(i * 24 + 1, j * 24 + 1, 4, 22); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(i * 24 + 1, j * 24 + 19, 22, 4); x.fillRect(i * 24 + 19, j * 24 + 1, 4, 22) }; this.g.forEach((r, j) => r.forEach((v, i) => v && cell(i, j, this.C[v - 1]))); let gy = this.py; while (!this.hit(this.m, this.px, gy + 1)) gy++; x.globalAlpha = .25; this.m.forEach((r, j) => r.forEach((v, i) => v && cell(this.px + i, gy + j, this.C[this.i - 1]))); x.globalAlpha = 1; this.m.forEach((r, j) => r.forEach((v, i) => v && cell(this.px + i, this.py + j, this.C[this.i - 1]))) }
};

/* ---------- Pac-Man ---------- */
const MAZE = ["###############", "#o.....#.....o#", "#.##.#.#.#.##.#", "#.............#", "#.##.#####.##.#", "#.............#", "#.##.#.#.#.##.#", "#....#...#....#", "#.##.#####.##.#", "#.............#", "#.##.#.#.#.##.#", "#o.....#.....o#", "###############"];
const P = {
    k: 'p', name: 'PAC-MAN', w: 300, h: 260, tip: 'Arrows steer. Eat every dot. Big dots let you eat ghosts.',
    init() { this.lvl = 1; this.loadMaze(); this.lives = 3; this.end = 'GAME OVER'; this.gs = [[6, '#ff2bd6'], [7, '#00f0ff'], [8, '#ff6a00']].map(([c, col]) => ({ c0: c, r0: 7, col })); this.reset(); setScore(0); this.updEx() },
    updEx() { $('ex').textContent = '\u2665'.repeat(this.lives) + (this.lvl > 1 ? ' · L' + this.lvl : '') },
    loadMaze() { this.d = MAZE.map(r => r.split(''));[[6, 7], [7, 7], [8, 7], [7, 9]].forEach(([c, r]) => this.d[r][c] = ' '); this.dots = this.d.flat().filter(v => v === '.' || v === 'o').length },
    nextLevel() { this.lvl++; setScore(score + 50); sfx(880, .25); vib([80, 50, 80]); this.loadMaze(); this.reset(); this.updEx() },
    reset() { if (this.p && st === 'play') vib(120); this.p = { c: 7, r: 9, dc: 0, dr: 0, t: 0, want: null, fd: null }; this.fright = 0; this.gs.forEach((g, i) => { this.rs(g); g.w = 1200 + i * 900 }) },
    rs(g) { g.c = g.c0; g.r = g.r0; g.dc = g.dr = 0; g.t = 0; g.pd = [0, 0]; g.w = 1500 },
    ok(c, r) { return this.d[r] && this.d[r][c] !== '#' },
    mv(e, dt, sp, pick) { if (!e.dc && !e.dr) pick(e); if (!e.dc && !e.dr) return; e.t += dt * sp / 1000; if (e.t >= 1) { e.c += e.dc; e.r += e.dr; e.t = 0; e.dc = e.dr = 0; this.arrive(e); if (st === 'play') pick(e) } },
    pp(e) { const w = e.want; if (w && this.ok(e.c + w[0], e.r + w[1])) { e.dc = w[0]; e.dr = w[1]; e.fd = w } else if (e.fd && this.ok(e.c + e.fd[0], e.r + e.fd[1])) { e.dc = e.fd[0]; e.dr = e.fd[1] } },
    gp(e) { const ds = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(d => this.ok(e.c + d[0], e.r + d[1])); let f = ds.filter(d => !(d[0] === -e.pd[0] && d[1] === -e.pd[1])); if (!f.length) f = ds; const q = this.p, dist = d => Math.hypot(e.c + d[0] - q.c, e.r + d[1] - q.r); const d = (this.fright > 0 || Math.random() < .25) ? f[Math.random() * f.length | 0] : f.sort((a, b) => dist(a) - dist(b))[0]; e.dc = d[0]; e.dr = d[1]; e.pd = d },
    arrive(e) { if (e !== this.p) return; const v = this.d[e.r][e.c]; if (v === '.' || v === 'o') { this.d[e.r][e.c] = ' '; this.dots--; setScore(score + 1); if (v === 'o') { this.fright = Math.max(2500, 6000 - (this.lvl - 1) * 600); sfx(300, .3) } if (!this.dots) this.nextLevel() } },
    update(dt) {
        const p = this.p; this.fright = Math.max(0, this.fright - dt); this.mv(p, dt, 6.5, e => this.pp(e)); if (st !== 'play') return;
        const gSpd = this.fright > 0 ? 3.5 : (5 + Math.min(2.5, (this.lvl - 1) * 0.4)) * SPD();
        for (const g of this.gs) { if (g.w > 0) { g.w -= dt; continue } this.mv(g, dt, gSpd, e => this.gp(e)) }
        const a = p.c + p.dc * p.t, b = p.r + p.dr * p.t;
        for (const g of this.gs) { if (g.w > 0) continue; if (Math.hypot(g.c + g.dc * g.t - a, g.r + g.dr * g.t - b) < .6) { if (this.fright > 0) { setScore(score + 1); sfx(900, .15); this.rs(g) } else { this.lives--; this.updEx(); if (this.lives <= 0) over(); else this.reset(); return } } }
    },
    key(k) { const D = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[k]; if (!D) return; const p = this.p; p.want = D; if ((p.dc || p.dr) && D[0] === -p.dc && D[1] === -p.dr) { p.c += p.dc; p.r += p.dr; p.dc = -p.dc; p.dr = -p.dr; p.t = 1 - p.t; p.fd = D } },
    draw() {
        x.fillStyle = '#05020c'; x.fillRect(0, 0, 300, 260); this.d.forEach((row, r) => row.forEach((v, c) => { if (v === '#') { x.strokeStyle = '#2d6bff'; x.shadowColor = '#00f0ff'; x.shadowBlur = 8; x.lineWidth = 2; x.strokeRect(c * 20 + 3, r * 20 + 3, 14, 14); x.shadowBlur = 0 } else if (v === '.') { x.fillStyle = '#ff9bf0'; x.fillRect(c * 20 + 9, r * 20 + 9, 3, 3) } else if (v === 'o') { x.shadowColor = '#fff200'; x.shadowBlur = 10; x.fillStyle = '#fff200'; x.beginPath(); x.arc(c * 20 + 10, r * 20 + 10, 5, 0, 7); x.fill(); x.shadowBlur = 0 } }));
        const p = this.p, px = (p.c + p.dc * p.t + .5) * 20, py = (p.r + p.dr * p.t + .5) * 20, a = p.fd ? Math.atan2(p.fd[1], p.fd[0]) : 0, m = .12 + .22 * Math.abs(Math.sin(Date.now() / 90)); x.shadowColor = '#fff200'; x.shadowBlur = 10; x.fillStyle = '#fff200'; x.beginPath(); x.moveTo(px, py); x.arc(px, py, 8, a + m * Math.PI, a + (2 - m) * Math.PI); x.fill(); x.shadowBlur = 0;
        for (const g of this.gs) { const gx = (g.c + g.dc * g.t + .5) * 20, gy = (g.r + g.dr * g.t + .5) * 20, fr = this.fright > 0; x.fillStyle = fr ? (this.fright < 2000 && (Date.now() / 200 | 0) % 2 ? '#fff' : '#4d6bff') : g.col; x.beginPath(); x.arc(gx, gy - 1, 8, Math.PI, 0); x.lineTo(gx + 8, gy + 8); x.lineTo(gx - 8, gy + 8); x.fill(); x.fillStyle = '#fff'; x.fillRect(gx - 5, gy - 4, 4, 4); x.fillRect(gx + 1, gy - 4, 4, 4) }
    }
};

/* ---------- Flappy Bird ---------- */
const F = {
    k: 'f', name: 'FLAPPY', w: 320, h: 480, tip: 'Tap, click or press space to flap. Fly through the gaps.',
    init() { this.y = 220; this.v = 0; this.ps = []; this.sp = 0; this.end = 'GAME OVER'; setScore(0); $('ex').textContent = '' },
    update(dt) {
        this.v += .0014 * dt; this.y += this.v * dt; this.sp -= dt; if (this.sp <= 0) { this.ps.push({ x: 320, g: 110 + Math.random() * 250, s: 0 }); this.sp = 1500 }
        this.ps.forEach(p => p.x -= .12 * SPD() * dt); this.ps = this.ps.filter(p => p.x > -60);
        for (const p of this.ps) { if (!p.s && p.x + 52 < 80) { p.s = 1; setScore(score + 1); sfx(880, .1) } if (91 > p.x && 69 < p.x + 52 && (this.y - 11 < p.g - 65 || this.y + 11 > p.g + 65)) return over() }
        if (this.y > 450 || this.y < -20) over()
    },
    key(k) { if (k === 'act' || k === 'up') { this.v = -.4; sfx(520, .08) } },
    draw() {
        x.fillStyle = '#05020c'; x.fillRect(0, 0, 320, 480); x.shadowColor = '#39ff14'; x.shadowBlur = 12; x.fillStyle = '#39ff14'; for (const p of this.ps) { x.fillRect(p.x, 0, 52, p.g - 65); x.fillRect(p.x, p.g + 65, 52, 480); x.fillStyle = '#b8ff9a'; x.fillRect(p.x - 4, p.g - 85, 60, 20); x.fillRect(p.x - 4, p.g + 65, 60, 20); x.fillStyle = '#39ff14' } x.shadowBlur = 0;
        x.fillStyle = '#ff2bd6'; x.fillRect(0, 450, 320, 3); x.fillStyle = '#14062a'; x.fillRect(0, 453, 320, 27); x.shadowColor = '#fff200'; x.shadowBlur = 14; x.fillStyle = '#fff200'; x.beginPath(); x.arc(80, this.y, 12, 0, 7); x.fill(); x.shadowBlur = 0; x.fillStyle = '#fff'; x.beginPath(); x.arc(85, this.y - 4, 4, 0, 7); x.fill(); x.fillStyle = '#15122e'; x.fillRect(85, this.y - 5, 2, 3); x.fillStyle = '#ff5d8f'; x.fillRect(90, this.y + 1, 9, 5)
    }
};

/* ---------- Shell ---------- */
/* Snake */
const S = {
    k: 's', name: 'SNAKE', w: 300, h: 300, tip: 'Arrows or swipe to steer. Eat the dots, avoid walls and yourself.',
    init() { this.b = [[7, 7], [6, 7], [5, 7]]; this.d = [1, 0]; this.nd = [1, 0]; this.acc = 0; this.end = 'GAME OVER'; this.f = this.food(); setScore(0); $('ex').textContent = '' },
    food() { let f; do f = [Math.random() * 15 | 0, Math.random() * 15 | 0]; while (this.b.some(s => s[0] === f[0] && s[1] === f[1])); return f },
    update(dt) { this.acc += dt; if (this.acc < Math.max(50, (130 - score * 6) / SPD())) return; this.acc = 0; this.d = this.nd; const h = [this.b[0][0] + this.d[0], this.b[0][1] + this.d[1]]; if (h[0] < 0 || h[1] < 0 || h[0] > 14 || h[1] > 14 || this.b.some(s => s[0] === h[0] && s[1] === h[1])) return over(); this.b.unshift(h); if (h[0] === this.f[0] && h[1] === this.f[1]) { setScore(score + 1); sfx(700, .1); this.f = this.food() } else this.b.pop() },
    key(k) { const D = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[k]; if (D && !(D[0] === -this.d[0] && D[1] === -this.d[1])) this.nd = D },
    draw() { x.fillStyle = '#05020c'; x.fillRect(0, 0, 300, 300); x.shadowColor = '#ff2bd6'; x.shadowBlur = 12; x.fillStyle = '#ff2bd6'; x.beginPath(); x.arc(this.f[0] * 20 + 10, this.f[1] * 20 + 10, 6, 0, 7); x.fill(); this.b.forEach((s, i) => { const c = i ? '#39ff14' : '#00f0ff'; x.shadowColor = c; x.shadowBlur = 8; x.fillStyle = c; x.fillRect(s[0] * 20 + 2, s[1] * 20 + 2, 16, 16) }); x.shadowBlur = 0 }
};
/* 2048 */
const G = {
    k: 'g', name: '2048', w: 300, h: 300, tip: 'Arrows or swipe slide the tiles. Merge equal numbers to reach 2048.',
    init() { this.g = Array.from({ length: 4 }, () => [0, 0, 0, 0]); this.end = 'GAME OVER'; this.add(); this.add(); setScore(0); $('ex').textContent = '' },
    add() { const e = []; this.g.forEach((r, i) => r.forEach((v, j) => v || e.push([i, j]))); if (!e.length) return; const q = e[Math.random() * e.length | 0]; this.g[q[0]][q[1]] = Math.random() < .9 ? 2 : 4 },
    update() { },
    can() { const g = this.g; for (let i = 0; i < 4; i++)for (let j = 0; j < 4; j++) { if (!g[i][j]) return true; if (g[i][j + 1] === g[i][j] || (g[i + 1] && g[i + 1][j] === g[i][j])) return true } return false },
    key(k) {
        if (!['left', 'right', 'up', 'down'].includes(k)) return; const g = this.g, H = k === 'left' || k === 'right', R = k === 'right' || k === 'down'; let moved = false; const line = a => { const n = a.filter(v => v), r = []; for (let i = 0; i < n.length; i++) { if (n[i] === n[i + 1]) { r.push(n[i] * 2); setScore(score + n[i] * 2); i++ } else r.push(n[i]) } while (r.length < 4) r.push(0); return r };
        for (let i = 0; i < 4; i++) { let a = H ? g[i].slice() : g.map(r => r[i]); if (R) a.reverse(); let r = line(a); if (R) r.reverse(); for (let j = 0; j < 4; j++) { const y = H ? i : j, c = H ? j : i; if (g[y][c] !== r[j]) moved = true; g[y][c] = r[j] } }
        if (moved) { this.add(); sfx(500, .06) } if (!this.can()) over()
    },
    draw() { x.fillStyle = '#05020c'; x.fillRect(0, 0, 300, 300); const C = ['#1a1030', '#00f0ff', '#39ff14', '#fff200', '#ff6a00', '#ff2bd6', '#bf40ff', '#2d6bff', '#00ffa8', '#ff3b3b', '#ffffff', '#ffd1ff']; this.g.forEach((r, i) => r.forEach((v, j) => { const c = C[v ? Math.log2(v) : 0]; x.shadowColor = c; x.shadowBlur = v ? 10 : 0; x.fillStyle = v ? c : '#140a28'; x.fillRect(j * 73 + 6, i * 73 + 6, 67, 67); x.shadowBlur = 0; if (v) { x.fillStyle = '#05020c'; x.font = 'bold ' + (v > 999 ? 18 : v > 99 ? 22 : 28) + 'px Orbitron,ui-sans-serif,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(v, j * 73 + 39.5, i * 73 + 40); x.textBaseline = 'alphabetic' } })) }
};
/* Breakout */
const B = {
    k: 'b', name: 'BREAKOUT', w: 320, h: 420, tip: 'Drag or use arrows to move the paddle. Break every brick.',
    init() { this.lvl = 1; this.setupBricks(); this.pw = 64; this.px = 128; this.bx = 160; this.by = 360; this.vx = .17; this.vy = -.25; this.lives = 3; this.end = 'GAME OVER'; setScore(0); this.updEx() },
    updEx() { $('ex').textContent = '♥'.repeat(this.lives) + (this.lvl > 1 ? ' · L' + this.lvl : '') },
    setupBricks() { this.br = []; for (let r = 0; r < 5; r++)for (let c = 0; c < 8; c++)this.br.push({ x: c * 40 + 2, y: r * 20 + 40, a: 1, r }) },
    nextLevel() { this.lvl++; setScore(score + 100); sfx(880, .25); vib([80, 50, 80]); this.setupBricks(); this.bx = 160; this.by = 360; this.vx = (Math.random() < .5 ? 1 : -1) * (0.17 + Math.min(0.12, (this.lvl - 1) * 0.02)); this.vy = -(0.25 + Math.min(0.15, (this.lvl - 1) * 0.03)); this.updEx() },
    update(dt) {
        this.px = Math.max(0, Math.min(this.w - this.pw, this.px)); const q = SPD(); this.bx += this.vx * q * dt; this.by += this.vy * q * dt;
        if (this.bx < 6) { this.bx = 6; this.vx = Math.abs(this.vx) } if (this.bx > 314) { this.bx = 314; this.vx = -Math.abs(this.vx) } if (this.by < 6) { this.by = 6; this.vy = Math.abs(this.vy) }
        if (this.vy > 0 && this.by >= 386 && this.by <= 402 && this.bx > this.px - 6 && this.bx < this.px + this.pw + 6) { this.vy = -Math.abs(this.vy); this.vx = (this.bx - this.px - this.pw / 2) / (this.pw / 2) * .26; sfx(400, .05) }
        for (const b of this.br) { if (b.a && this.bx > b.x - 6 && this.bx < b.x + 42 && this.by > b.y - 6 && this.by < b.y + 22) { b.a = 0; this.vy = -this.vy; setScore(score + 10); sfx(300 + b.r * 80, .06); if (!this.br.some(q => q.a)) this.nextLevel(); break } }
        if (this.by > 430) { this.lives--; this.updEx(); if (this.lives <= 0) over(); else { this.bx = 160; this.by = 360; this.vx = .17; this.vy = -.25 } }
    },
    key(k) { if (k === 'left') this.px -= 36; else if (k === 'right') this.px += 36 },
    draw() { x.fillStyle = '#05020c'; x.fillRect(0, 0, 320, 420); const R = ['#ff2bd6', '#ff6a00', '#fff200', '#39ff14', '#00f0ff']; for (const b of this.br) if (b.a) { x.shadowColor = R[b.r]; x.shadowBlur = 8; x.fillStyle = R[b.r]; x.fillRect(b.x, b.y, 36, 16) } x.shadowColor = '#00f0ff'; x.shadowBlur = 12; x.fillStyle = '#00f0ff'; x.fillRect(this.px, 396, this.pw, 10); x.shadowColor = '#fff'; x.fillStyle = '#fff'; x.beginPath(); x.arc(this.bx, this.by, 6, 0, 7); x.fill(); x.shadowBlur = 0 }
};
/* Shooter */
const SH = {
    k: 'h', name: 'SHOOTER', w: 320, h: 480, tip: 'Arrows or mouse move the ship. It fires on its own.',
    init() { this.x = 160; this.y = 420; this.bl = []; this.en = []; this.sp = 0; this.fire = 0; this.lives = 3; this.inv = 0; this.t = 0; this.end = 'GAME OVER'; setScore(0); $('ex').textContent = '♥'.repeat(3) },
    hurt() { this.lives--; this.inv = 1500; $('ex').textContent = '♥'.repeat(this.lives); sfx(120, .3, 'sawtooth'); if (this.lives <= 0) over() },
    update(dt) {
        this.t += dt; this.x = Math.max(16, Math.min(304, this.x)); this.y = Math.max(60, Math.min(450, this.y)); this.inv = Math.max(0, this.inv - dt);
        this.fire -= dt; if (this.fire <= 0) { this.bl.push({ x: this.x, y: this.y - 18 }); this.fire = 200 }
        this.sp -= dt; if (this.sp <= 0) { this.en.push({ x: 20 + Math.random() * 280, y: -20, v: .07 + Math.min(.12, this.t / 200000), t: Math.random() < .3 ? 1 : 0 }); this.sp = Math.max(320, 900 - this.t / 60) }
        this.bl.forEach(b => b.y -= .5 * dt); this.en.forEach(e => { e.y += e.v * SPD() * dt; e.x = Math.max(14, Math.min(306, e.x + Math.sin(e.y / 30) * e.t * .8)) });
        for (const e of this.en) {
            for (const b of this.bl) { if (!b.d && !e.dead && Math.abs(b.x - e.x) < 16 && Math.abs(b.y - e.y) < 16) { b.d = 1; e.dead = 1; setScore(score + 1); sfx(240, .08, 'sawtooth') } }
            if (!e.dead && !this.inv && Math.abs(e.x - this.x) < 20 && Math.abs(e.y - this.y) < 20) { e.dead = 1; this.hurt() }
        }
        this.en = this.en.filter(e => !e.dead && e.y < 500); this.bl = this.bl.filter(b => !b.d && b.y > -10)
    },
    key(k) { if (k === 'left') this.x -= 24; else if (k === 'right') this.x += 24; else if (k === 'up') this.y -= 24; else if (k === 'down') this.y += 24 },
    draw() {
        x.fillStyle = '#05020c'; x.fillRect(0, 0, 320, 480); x.fillStyle = '#fff'; for (let i = 0; i < 36; i++) { x.globalAlpha = .25 + (i % 3) * .2; x.fillRect((i * 97) % 320, ((i * 53) + this.t * .04 * (1 + i % 3)) % 480, 2, 2) } x.globalAlpha = 1;
        x.shadowBlur = 10; x.shadowColor = '#ff2bd6'; x.fillStyle = '#ff2bd6'; for (const b of this.bl) x.fillRect(b.x - 2, b.y - 8, 4, 12);
        for (const e of this.en) { const c = e.t ? '#bf40ff' : '#ff6a00'; x.shadowColor = c; x.fillStyle = c; x.beginPath(); x.moveTo(e.x, e.y + 14); x.lineTo(e.x - 14, e.y - 10); x.lineTo(e.x + 14, e.y - 10); x.fill() }
        if (!(this.inv > 0 && (this.t / 100 | 0) % 2)) { x.shadowColor = '#00f0ff'; x.fillStyle = '#00f0ff'; x.beginPath(); x.moveTo(this.x, this.y - 18); x.lineTo(this.x - 16, this.y + 14); x.lineTo(this.x, this.y + 7); x.lineTo(this.x + 16, this.y + 14); x.fill() } x.shadowBlur = 0
    }
};
/* Racer */
const CR = {
    k: 'c', name: 'RACER', w: 320, h: 480, tip: 'Left and right arrows steer. Dodge the traffic.',
    init() { this.x = 160; this.cs = []; this.sp = 0; this.t = 0; this.off = 0; this.end = 'CRASH!'; setScore(0); $('ex').textContent = '' },
    update(dt) {
        this.t += dt; this.x = Math.max(30, Math.min(290, this.x)); const v = (.28 + Math.min(.3, this.t / 150000)) * SPD(); this.off = (this.off + v * dt) % 40; this.sp -= dt;
        if (this.sp <= 0) { this.cs.push({ x: 40 + 80 * (Math.random() * 4 | 0), y: -50, f: .45 + Math.random() * .25, c: ['#ff6a00', '#fff200', '#39ff14', '#ff2bd6', '#bf40ff'][Math.random() * 5 | 0] }); this.sp = Math.max(380, 800 - this.t / 90) }
        for (const c of this.cs) { c.y += v * c.f * dt; if (Math.abs(c.x - this.x) < 28 && Math.abs(c.y - 430) < 54) return over(); if (c.y > 520) { c.d = 1; setScore(score + 1) } }
        this.cs = this.cs.filter(c => !c.d)
    },
    key(k) { if (k === 'left') this.x -= 40; else if (k === 'right') this.x += 40 },
    draw() {
        x.fillStyle = '#0b0618'; x.fillRect(0, 0, 320, 480); x.fillStyle = '#ff2bd6'; x.shadowColor = '#ff2bd6'; x.shadowBlur = 10; x.fillRect(0, 0, 4, 480); x.fillRect(316, 0, 4, 480); x.shadowBlur = 0; x.fillStyle = '#4a3a7a'; for (let l = 1; l < 4; l++)for (let y = -40 + this.off; y < 480; y += 40)x.fillRect(l * 80 - 2, y, 4, 20);
        const car = (cx, cy, c) => { x.shadowColor = c; x.shadowBlur = 12; x.fillStyle = c; x.fillRect(cx - 15, cy - 28, 30, 56); x.shadowBlur = 0; x.fillStyle = '#05020c'; x.fillRect(cx - 11, cy - 14, 22, 10); x.fillRect(cx - 11, cy + 10, 22, 6) };
        for (const c of this.cs) car(c.x, c.y, c.c); car(this.x, 430, '#00f0ff')
    }
};
/* Memory */
const M = {
    k: 'm', name: 'MEMORY', w: 320, h: 400, tip: 'Click two cards to find a matching pair. 10 misses and it is over.',
    C: ['#00f0ff', '#fff200', '#bf40ff', '#39ff14', '#ff2bd6', '#2d6bff', '#ff6a00', '#00ffa8'],
    deal() { const s = [0, 1, 2, 3, 4, 5, 6, 7]; this.c = [...s, ...s].sort(() => Math.random() - .5).map(v => ({ v, o: 0, m: 0 })); this.sel = []; this.lock = 0; this.clear = 0 },
    init() { this.miss = 0; this.end = 'GAME OVER'; this.deal(); setScore(0); $('ex').textContent = 'Misses 0/10' },
    tap(e) {
        if (st !== 'play' || paused || this.lock > 0) return; const r = cv.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 320, py = (e.clientY - r.top) / r.height * 400, c = this.c[(py / 100 | 0) * 4 + (px / 80 | 0)]; if (!c || c.o || c.m) return; c.o = 1; sfx(500, .05); this.sel.push(c);
        if (this.sel.length === 2) { const a = this.sel[0], b = this.sel[1]; if (a.v === b.v) { a.m = b.m = 1; this.sel = []; setScore(score + 1); sfx(800, .15); if (this.c.every(q => q.m)) { this.lock = 700; this.clear = 1 } } else { this.miss++; $('ex').textContent = 'Misses ' + this.miss + '/10'; this.lock = 700; sfx(150, .15, 'sawtooth') } }
    },
    update(dt) { if (this.lock > 0) { this.lock -= dt; if (this.lock <= 0) { if (this.clear) this.deal(); else { this.sel.forEach(q => q.o = 0); this.sel = []; if (this.miss >= 10) over() } } } },
    key() { },
    sym(v, cx, cy, c) {
        x.shadowColor = c; x.shadowBlur = 12; x.fillStyle = c; x.strokeStyle = c; x.lineWidth = 7; x.beginPath();
        if (v === 0) x.arc(cx, cy, 18, 0, 7); else if (v === 1) x.rect(cx - 16, cy - 16, 32, 32); else if (v === 2) { x.moveTo(cx, cy - 20); x.lineTo(cx + 20, cy + 16); x.lineTo(cx - 20, cy + 16); x.closePath() } else if (v === 3) { x.moveTo(cx, cy - 22); x.lineTo(cx + 18, cy); x.lineTo(cx, cy + 22); x.lineTo(cx - 18, cy); x.closePath() }
        else if (v === 4) { x.rect(cx - 5, cy - 20, 10, 40); x.rect(cx - 20, cy - 5, 40, 10) } else if (v === 5) { x.arc(cx, cy, 16, 0, 7); x.stroke(); x.shadowBlur = 0; return }
        else if (v === 6) { for (let i = 0; i < 10; i++) { const r = i % 2 ? 9 : 20, a = -Math.PI / 2 + i * Math.PI / 5; x[i ? 'lineTo' : 'moveTo'](cx + r * Math.cos(a), cy + r * Math.sin(a)) } x.closePath() }
        else { x.moveTo(cx - 16, cy - 16); x.lineTo(cx + 16, cy + 16); x.moveTo(cx + 16, cy - 16); x.lineTo(cx - 16, cy + 16); x.stroke(); x.shadowBlur = 0; return }
        x.fill(); x.shadowBlur = 0
    },
    draw() { x.fillStyle = '#05020c'; x.fillRect(0, 0, 320, 400); this.c.forEach((c, i) => { const cx = i % 4 * 80 + 40, cy = (i / 4 | 0) * 100 + 50, up = c.o || c.m, col = up ? this.C[c.v] : '#ff2bd6'; x.globalAlpha = c.m ? .45 : 1; x.shadowColor = col; x.shadowBlur = 8; x.strokeStyle = col; x.lineWidth = 2; x.fillStyle = '#120a24'; x.fillRect(cx - 34, cy - 44, 68, 88); x.strokeRect(cx - 34, cy - 44, 68, 88); x.shadowBlur = 0; if (up) this.sym(c.v, cx, cy, col); else { x.fillStyle = '#ff2bd6'; x.font = 'bold 26px Orbitron,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('?', cx, cy); x.textBaseline = 'alphabetic' } x.globalAlpha = 1 }) }
};
/* Whack */
const WH = {
    k: 'w', name: 'WHACK', w: 300, h: 300, tip: 'Click the moles before they hide. 3 escapes and it is over.',
    init() { this.m = Array(9).fill(0); this.sp = 500; this.lives = 3; this.end = 'GAME OVER'; setScore(0); $('ex').textContent = '♥'.repeat(3) },
    tap(e) { if (st !== 'play' || paused) return; const r = cv.getBoundingClientRect(), i = ((e.clientY - r.top) / r.height * 3 | 0) * 3 + ((e.clientX - r.left) / r.width * 3 | 0); if (this.m[i] > 0) { this.m[i] = -150; setScore(score + 1); sfx(600, .08) } },
    update(dt) {
        this.sp -= dt; if (this.sp <= 0) { const e = []; this.m.forEach((v, i) => v || e.push(i)); if (e.length) this.m[e[Math.random() * e.length | 0]] = Math.max(450, (1100 - score * 20) / SPD()); this.sp = Math.max(350, 900 - score * 15) }
        this.m.forEach((v, i) => { if (v > 0) { this.m[i] -= dt; if (this.m[i] <= 0) { this.m[i] = 0; this.lives--; $('ex').textContent = '♥'.repeat(this.lives); sfx(120, .25, 'sawtooth'); if (this.lives <= 0) over() } } else if (v < 0) this.m[i] = Math.min(0, v + dt) })
    },
    key() { },
    draw() {
        x.fillStyle = '#05020c'; x.fillRect(0, 0, 300, 300); this.m.forEach((v, i) => {
            const cx = i % 3 * 100 + 50, cy = (i / 3 | 0) * 100 + 56; x.shadowBlur = 0; x.fillStyle = '#14062a'; x.beginPath(); x.ellipse(cx, cy + 16, 38, 14, 0, 0, 7); x.fill(); x.strokeStyle = '#4a3a7a'; x.lineWidth = 3; x.stroke();
            if (v > 0) { x.shadowColor = '#ff9d2e'; x.shadowBlur = 14; x.fillStyle = '#ff9d2e'; x.beginPath(); x.arc(cx, cy - 2, 26, Math.PI, 0); x.lineTo(cx + 26, cy + 14); x.lineTo(cx - 26, cy + 14); x.fill(); x.shadowBlur = 0; x.fillStyle = '#fff'; x.fillRect(cx - 12, cy - 12, 8, 8); x.fillRect(cx + 4, cy - 12, 8, 8); x.fillStyle = '#05020c'; x.fillRect(cx - 9, cy - 9, 4, 4); x.fillRect(cx + 7, cy - 9, 4, 4) }
            else if (v < 0) { x.shadowColor = '#fff200'; x.shadowBlur = 10; x.fillStyle = '#fff200'; x.font = 'bold 22px Orbitron,sans-serif'; x.textAlign = 'center'; x.fillText('+1', cx, cy) } x.shadowBlur = 0
        })
    }
};
/* Tic Tac Toe */
const XO = {
    k: 'x', name: 'TIC TAC TOE', w: 300, h: 300, tip: 'Click a square to place X. Beat the computer to score.',
    L: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
    init() { this.b = Array(9).fill(0); this.turn = 1; this.lock = 0; this.res = 0; this.end = 'YOU LOST'; setScore(0); $('ex').textContent = 'You: X' },
    win(b, p) { return this.L.find(l => l.every(i => b[i] === p)) },
    tap(e) {
        if (st !== 'play' || paused || this.lock > 0 || this.turn !== 1) return; const r = cv.getBoundingClientRect(), i = ((e.clientY - r.top) / r.height * 3 | 0) * 3 + ((e.clientX - r.left) / r.width * 3 | 0); if (this.b[i]) return; this.b[i] = 1; sfx(500, .06);
        if (this.win(this.b, 1)) { setScore(score + 1); sfx(900, .2); this.res = 1; this.lock = 900 } else if (this.b.every(v => v)) { this.res = 3; this.lock = 900 } else { this.turn = 2; this.lock = 450 }
    },
    cpu() {
        const b = this.b, e = []; b.forEach((v, i) => v || e.push(i)); const f = p => e.find(i => { b[i] = p; const w = this.win(b, p); b[i] = 0; return w }); let m = Math.random() < .85 ? (f(2) ?? f(1)) : undefined; if (m === undefined) m = b[4] === 0 && Math.random() < .6 ? 4 : e[Math.random() * e.length | 0]; b[m] = 2; sfx(350, .06);
        if (this.win(b, 2)) { this.res = 2; this.lock = 900; sfx(120, .3, 'sawtooth') } else if (b.every(v => v)) { this.res = 3; this.lock = 900 } else this.turn = 1
    },
    update(dt) { if (this.lock > 0) { this.lock -= dt; if (this.lock <= 0) { if (this.res) { if (this.res === 2) over(); else { this.b = Array(9).fill(0); this.res = 0; this.turn = 1 } } else if (this.turn === 2) this.cpu() } } },
    key() { },
    draw() {
        x.fillStyle = '#05020c'; x.fillRect(0, 0, 300, 300); x.strokeStyle = '#4a3a7a'; x.lineWidth = 3; x.shadowColor = '#2d6bff'; x.shadowBlur = 6;[100, 200].forEach(v => { x.beginPath(); x.moveTo(v, 12); x.lineTo(v, 288); x.moveTo(12, v); x.lineTo(288, v); x.stroke() }); x.lineWidth = 8; x.lineCap = 'round';
        this.b.forEach((v, i) => { const cx = i % 3 * 100 + 50, cy = (i / 3 | 0) * 100 + 50; if (v === 1) { x.strokeStyle = x.shadowColor = '#00f0ff'; x.shadowBlur = 12; x.beginPath(); x.moveTo(cx - 24, cy - 24); x.lineTo(cx + 24, cy + 24); x.moveTo(cx + 24, cy - 24); x.lineTo(cx - 24, cy + 24); x.stroke() } else if (v === 2) { x.strokeStyle = x.shadowColor = '#ff2bd6'; x.shadowBlur = 12; x.beginPath(); x.arc(cx, cy, 26, 0, 7); x.stroke() } });
        const w = this.win(this.b, 1) || this.win(this.b, 2); if (w) { x.strokeStyle = x.shadowColor = '#fff200'; x.lineWidth = 5; x.beginPath(); x.moveTo(w[0] % 3 * 100 + 50, (w[0] / 3 | 0) * 100 + 50); x.lineTo(w[2] % 3 * 100 + 50, (w[2] / 3 | 0) * 100 + 50); x.stroke() } x.shadowBlur = 0; x.lineCap = 'butt'
    }
};
/* Stack */
const SK = {
    k: 'k', name: 'STACK', w: 320, h: 480, tip: 'Tap or press space to drop the sliding block. Line it up to keep the tower wide.',
    init() { this.tw = [{ x: 100, w: 120 }]; this.cx = 0; this.cw = 120; this.dir = 1; this.sp = .18 * SPD(); this.armed = 0; this.end = 'TOWER FELL'; setScore(0); $('ex').textContent = '' },
    update(dt) { this.cx += this.dir * this.sp * dt; if (this.cx < 0) { this.cx = 0; this.dir = 1 } if (this.cx + this.cw > 320) { this.cx = 320 - this.cw; this.dir = -1 } },
    key(k) {
        if (k !== 'act' && k !== 'up') return; if (!this.armed) { this.armed = 1; return } const t = this.tw[this.tw.length - 1]; let l = Math.max(this.cx, t.x), r = Math.min(this.cx + this.cw, t.x + t.w); if (r - l <= 0) { sfx(120, .3, 'sawtooth'); over(); return }
        if (Math.abs(this.cx - t.x) < 5) { l = t.x; r = t.x + t.w } this.tw.push({ x: l, w: r - l }); this.cw = r - l; this.cx = this.dir > 0 ? 0 : 320 - this.cw; setScore(score + 1); sfx(400 + Math.min(score, 30) * 15, .08); this.sp = Math.min(.4, .18 + score * .004) * SPD()
    },
    draw() {
        x.fillStyle = '#05020c'; x.fillRect(0, 0, 320, 480); const n = this.tw.length, sh = Math.max(0, n - 10), Y = i => 440 - (i - sh) * 24; x.shadowBlur = 10;
        this.tw.forEach((b, i) => { const c = 'hsl(' + (i * 25 % 360) + ',100%,60%)'; x.shadowColor = c; x.fillStyle = c; x.fillRect(b.x, Y(i), b.w, 22) });
        if (st === 'play') { const c = 'hsl(' + (n * 25 % 360) + ',100%,60%)'; x.shadowColor = c; x.fillStyle = c; x.fillRect(this.cx, Y(n), this.cw, 22) } x.shadowBlur = 0
    }
};
/* ---------- Inbox Zero Rush ---------- */
const IZ = {
    k: 'i', name: 'INBOX ZERO', w: 320, h: 480, tip: 'Sort emails: Left = Archive, Down = Reply, Right = Spam.',
    SUBJECTS: [
        { c: 0, text: 'CLIENT URGENT' }, { c: 0, text: 'INTERVIEW OFFER' }, { c: 0, text: 'CODE REVIEW' }, { c: 0, text: 'CRITICAL BUG' },
        { c: 1, text: 'WEEKLY DIGEST' }, { c: 1, text: 'ALL-HANDS RECAP' }, { c: 1, text: 'FYI: STATS' }, { c: 1, text: 'NEWSLETTER' },
        { c: 2, text: 'YOU WON $10M!' }, { c: 2, text: 'CRYPTO MOON 🚀' }, { c: 2, text: 'BUY BACKLINKS' }, { c: 2, text: 'INHERITANCE' }
    ],
    init() {
        this.ems = []; this.lives = 3; this.sp = 400; this.t = 0; this.combo = 0;
        this.feedback = null; this.end = 'INBOX OVERFLOW!'; setScore(0); this.updEx();
    },
    updEx() { $('ex').textContent = '♥'.repeat(this.lives) + (this.combo > 1 ? ' · ' + this.combo + 'x' : '') },
    spawn() {
        const item = this.SUBJECTS[Math.random() * this.SUBJECTS.length | 0];
        this.ems.push({ x: 20 + Math.random() * 80, y: -40, c: item.c, text: item.text, w: 200, h: 36 });
    },
    sort(cat) {
        if (st !== 'play' || paused || !this.ems.length) return;
        const sorted = this.ems.reduce((lowest, e) => (!lowest || e.y > lowest.y ? e : lowest), null);
        if (!sorted) return;
        this.ems = this.ems.filter(e => e !== sorted);
        if (sorted.c === cat) {
            this.combo++;
            setScore(score + 1 + (this.combo > 4 ? 1 : 0));
            sfx(650 + Math.min(this.combo, 8) * 50, .08);
            vib(30);
            this.feedback = { text: '✓ NICE!', col: '#39ff14', t: 300, y: sorted.y };
        } else {
            this.combo = 0;
            this.lives--;
            sfx(120, .3, 'sawtooth');
            vib([70, 40, 70]);
            this.feedback = { text: '✗ WRONG BIN!', col: '#ff3b3b', t: 400, y: sorted.y };
            if (this.lives <= 0) over();
        }
        this.updEx();
    },
    update(dt) {
        this.t += dt; this.sp -= dt;
        const rate = Math.max(700, 1600 - score * 20);
        if (this.sp <= 0) { this.spawn(); this.sp = rate; }
        if (this.feedback) { this.feedback.t -= dt; if (this.feedback.t <= 0) this.feedback = null; }
        const v = (0.12 + Math.min(0.25, score * 0.006)) * SPD();
        for (const e of this.ems) {
            e.y += v * dt;
            if (e.y > 385) {
                e.dead = 1; this.combo = 0; this.lives--;
                sfx(120, .3, 'sawtooth'); vib(100);
                this.feedback = { text: 'MISSED DEADLINE!', col: '#ff3b3b', t: 400, y: 380 };
                this.updEx();
                if (this.lives <= 0) { over(); break; }
            }
        }
        this.ems = this.ems.filter(e => !e.dead);
    },
    key(k) {
        if (k === 'left') this.sort(1);
        else if (k === 'down' || k === 'act') this.sort(0);
        else if (k === 'right') this.sort(2);
    },
    draw() {
        x.fillStyle = '#05020c'; x.fillRect(0, 0, 320, 480);
        x.strokeStyle = 'rgba(255, 43, 214, 0.4)'; x.setLineDash([4, 4]);
        x.beginPath(); x.moveTo(0, 385); x.lineTo(320, 385); x.stroke(); x.setLineDash([]);
        const cols = ['#00f0ff', '#39ff14', '#ff2bd6'];
        const tags = ['REPLY', 'ARCHIVE', 'SPAM'];
        for (const e of this.ems) {
            const col = cols[e.c];
            x.shadowColor = col; x.shadowBlur = 8;
            x.fillStyle = '#120a24'; x.strokeStyle = col; x.lineWidth = 2;
            x.fillRect(e.x, e.y, e.w, e.h); x.strokeRect(e.x, e.y, e.w, e.h); x.shadowBlur = 0;
            x.fillStyle = col; x.fillRect(e.x + 4, e.y + 4, 48, 12);
            x.fillStyle = '#05020c'; x.font = 'bold 8px Silkscreen,monospace'; x.textAlign = 'center';
            x.fillText(tags[e.c], e.x + 28, e.y + 13);
            x.fillStyle = '#fff'; x.font = '10px Silkscreen,monospace'; x.textAlign = 'left';
            x.fillText(e.text, e.x + 58, e.y + 22);
        }
        const bins = [
            { x: 8, w: 96, c: '#39ff14', label: '📂 ARCHIVE', sub: '← LEFT' },
            { x: 112, w: 96, c: '#00f0ff', label: '📩 REPLY', sub: '↓ DOWN' },
            { x: 216, w: 96, c: '#ff2bd6', label: '🗑️ SPAM', sub: '→ RIGHT' }
        ];
        bins.forEach(b => {
            x.shadowColor = b.c; x.shadowBlur = 8;
            x.fillStyle = '#0d061c'; x.strokeStyle = b.c; x.lineWidth = 2;
            x.fillRect(b.x, 410, b.w, 60); x.strokeRect(b.x, 410, b.w, 60); x.shadowBlur = 0;
            x.fillStyle = b.c; x.font = 'bold 10px Silkscreen,monospace'; x.textAlign = 'center';
            x.fillText(b.label, b.x + b.w / 2, 434);
            x.fillStyle = 'rgba(255,255,255,0.6)'; x.font = '9px Silkscreen,monospace';
            x.fillText(b.sub, b.x + b.w / 2, 454);
        });
        if (this.feedback) {
            x.fillStyle = this.feedback.col; x.shadowColor = this.feedback.col; x.shadowBlur = 10;
            x.font = 'bold 14px Silkscreen,monospace'; x.textAlign = 'center';
            x.fillText(this.feedback.text, 160, this.feedback.y || 200); x.shadowBlur = 0;
        }
    }
};

/* ---------- Buzzword Catcher ---------- */
const BC = {
    k: 'u', name: 'BUZZWORDS', w: 320, h: 480, tip: 'Move basket: Catch real skills (green), dodge corporate buzzwords (red)!',
    SKILLS: ['PYTHON', 'REACT', 'SQL', 'GIT', 'DOCKER', 'API', 'CSS', 'FASTAPI', 'LOGIC', 'TESTS'],
    BUZZ: ['SYNERGY', 'ROCKSTAR', 'NINJA', 'GURU', 'DISRUPT', '10X DEV', 'PIVOT', 'BOIL OCEAN', 'CIRCLE BACK'],
    init() {
        this.x = 160; this.pw = 72; this.items = []; this.lives = 3; this.sp = 300; this.t = 0; this.streak = 0;
        this.end = 'BURNT OUT!'; setScore(0); this.updEx();
    },
    updEx() { $('ex').textContent = '♥'.repeat(this.lives) + (this.streak > 2 ? ' · ' + this.streak + '★' : '') },
    spawn() {
        const isSkill = Math.random() < 0.6;
        const pool = isSkill ? this.SKILLS : this.BUZZ;
        const text = pool[Math.random() * pool.length | 0];
        this.items.push({ x: 24 + Math.random() * 210, y: -25, isSkill: isSkill, text: text, w: 80, h: 24, v: (0.13 + Math.min(0.24, this.t / 120000)) * SPD() });
    },
    update(dt) {
        this.t += dt; this.sp -= dt;
        if (this.sp <= 0) { this.spawn(); this.sp = Math.max(380, 950 - this.t / 80); }
        this.x = Math.max(this.pw / 2, Math.min(320 - this.pw / 2, this.x));
        for (const item of this.items) {
            item.y += item.v * dt;
            if (item.y + item.h >= 430 && item.y <= 450) {
                if (item.x + item.w > this.x - this.pw / 2 && item.x < this.x + this.pw / 2) {
                    item.dead = 1;
                    if (item.isSkill) {
                        this.streak++;
                        setScore(score + 10 + (this.streak > 4 ? 5 : 0));
                        sfx(600 + Math.min(this.streak, 8) * 40, .09);
                        vib(30);
                    } else {
                        this.streak = 0;
                        this.lives--;
                        sfx(120, .3, 'sawtooth');
                        vib([80, 50, 100]);
                        if (this.lives <= 0) over();
                    }
                    this.updEx();
                }
            }
        }
        this.items = this.items.filter(item => !item.dead && item.y < 500);
    },
    key(k) { if (k === 'left') this.x -= 32; else if (k === 'right') this.x += 32; },
    draw() {
        x.fillStyle = '#05020c'; x.fillRect(0, 0, 320, 480);
        for (const it of this.items) {
            const col = it.isSkill ? '#39ff14' : '#ff3b3b';
            x.shadowColor = col; x.shadowBlur = 8;
            x.fillStyle = it.isSkill ? 'rgba(57, 255, 20, 0.12)' : 'rgba(255, 59, 59, 0.15)';
            x.strokeStyle = col; x.lineWidth = 2;
            x.fillRect(it.x, it.y, it.w, it.h); x.strokeRect(it.x, it.y, it.w, it.h); x.shadowBlur = 0;
            x.fillStyle = col; x.font = 'bold 9px Silkscreen,monospace'; x.textAlign = 'center';
            x.fillText(it.text, it.x + it.w / 2, it.y + 16);
        }
        const bx = this.x - this.pw / 2;
        x.shadowColor = '#00f0ff'; x.shadowBlur = 12;
        x.fillStyle = '#120a24'; x.strokeStyle = '#00f0ff'; x.lineWidth = 3;
        x.fillRect(bx, 432, this.pw, 18); x.strokeRect(bx, 432, this.pw, 18); x.shadowBlur = 0;
        x.fillStyle = '#00f0ff'; x.font = 'bold 9px Orbitron,monospace'; x.textAlign = 'center';
        x.fillText('RESUME', this.x, 445);
    }
};

const games = { t: T, p: P, f: F, s: S, g: G, b: B, h: SH, c: CR, m: M, w: WH, x: XO, k: SK, i: IZ, u: BC };
function fit() { if (!cur) return; const bs = getComputedStyle($('play')), g = parseFloat(bs.rowGap) || 12, pd = parseFloat(bs.paddingTop) * 2; const o = [...$('play').children].reduce((a, e) => e === cv || e.tagName === 'SCRIPT' || !e.offsetHeight ? a : a + e.offsetHeight + g, 0) + pd + g + 6; const s = Math.min(2, Math.max(.3, Math.min((innerWidth - pd - 8) / cur.w, (innerHeight - o) / cur.h))); cv.style.width = cur.w * s + 6 + 'px'; cv.style.height = cur.h * s + 6 + 'px' }
function select(k) { cur = games[k]; cv.width = cur.w; cv.height = cur.h; setPause(false); $('nxw').style.display = k === 't' ? '' : 'none'; fit(); $('hi').textContent = hs[bk(k)] || 0; $('tip').textContent = matchMedia('(pointer:coarse)').matches ? TT[cur.k] : cur.tip; $('gt').textContent = cur.name; cur.init(); st = 'ready'; document.querySelectorAll('nav button').forEach(b => b.setAttribute('aria-pressed', b.dataset.g === k)) }
function setPause(v) { paused = v; pmShow(v ? 'pause' : null) }
function pmShow(m) { const p = $('pm'); if (!m) { p.classList.remove('open'); return } $('pt').textContent = m === 'pause' ? 'Paused · ' + ['Easy', 'Normal', 'Hard'][diff] : 'Settings'; $('pb').style.display = m === 'pause' ? '' : 'none'; $('pc').style.display = m === 'pause' ? 'none' : ''; $('mvs').value = mv; $('svs').value = sv; $('vbb').textContent = vb ? 'On' : 'Off'; p.classList.add('open') }
function press(k) { if (!$('play').classList.contains('open')) return; audio(); if (k === 'pause') { if (st === 'play') setPause(!paused); return } if (paused) { setPause(false); return } if (st !== 'play') { if (Date.now() - overAt < 500) return; cur.init(); st = 'play'; return } cur.key(k) }
document.querySelectorAll('nav button').forEach(b => b.onclick = () => select(b.dataset.g));
document.querySelectorAll('#pad button').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); press(b.dataset.k) }));
const TT = { t: 'Swipe to move. Tap or click to drop. Swipe up to rotate.', p: 'Swipe to steer Pac-Man.', f: 'Tap anywhere to flap.', s: 'Swipe to steer the snake.', g: 'Swipe to slide the tiles.', b: 'Drag your finger to move the paddle.', h: 'Drag your finger to fly. Your ship fires on its own.', c: 'Drag left or right to steer. Dodge the traffic.', m: 'Tap two cards to find a matching pair.', w: 'Tap the moles before they hide.', x: 'Tap a square to place your X.', k: 'Tap to drop the sliding block.', i: 'Tap bottom bins or swipe: Left = Archive, Down = Reply, Right = Spam.', u: 'Drag left or right to move the resume basket.' };
function aim(e) { if ((cur.k === 'h' || cur.k === 'c' || cur.k === 'u') && st === 'play' && !paused) { const r = cv.getBoundingClientRect(); cur.x = (e.clientX - r.left) / r.width * cur.w; if (cur.k === 'h') cur.y = (e.clientY - r.top) / r.height * cur.h - 50 } }
let sw = null; const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
cv.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (cur.k === 'i' && st === 'play' && !paused) {
        const r = cv.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 320;
        if (px < 105) press('left');
        else if (px > 215) press('right');
        else press('down');
        return;
    }
    if (cur.k === 'm' || cur.k === 'w' || cur.k === 'x') { const wp = paused; press('act'); if (!wp) cur.tap(e); return }
    if (cur.k === 'f' || cur.k === 'h' || cur.k === 'c' || cur.k === 'u') { press('act'); aim(e); return }
    sw = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: Date.now(), m: 0 }
});
cv.addEventListener('pointercancel', () => { sw = null });
cv.addEventListener('pointerup', e => {
    if (!sw) return; const s = sw; sw = null; const dx = e.clientX - s.x, dy = e.clientY - s.y, mv = Math.max(Math.abs(dx), Math.abs(dy));
    if (cur.k === 'i') {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 18) {
            press(dx < 0 ? 'left' : 'right');
        } else if (dy > 18 || mv < 16) {
            press('down');
        }
        return;
    }
    if (cur.k === 't') {
        if (!s.m && mv < 16) {
            press('act');
        } else if (dy < -25 && Math.abs(dy) > Math.abs(dx)) {
            press('up');
        } else if (dy > 40 && dy / Math.max(1, Date.now() - s.t) > .6) {
            press('act');
        }
        return;
    }
    if (cur.k === 'g') { press(mv >= 24 ? dirOf(dx, dy) : 'act'); return }
    if (cur.k === 'b' || (!s.m && mv < 20)) press('act')
});
cv.addEventListener('pointermove', e => {
    aim(e); if (cur.k === 'b' && st === 'play' && !paused) { const r = cv.getBoundingClientRect(); cur.px = (e.clientX - r.left) / r.width * cur.w - cur.pw / 2 }
    if (!sw) return; const dx = e.clientX - sw.lx, dy = e.clientY - sw.ly;
    if (cur.k === 't') { const cs = cv.getBoundingClientRect().width / cur.w * 24; if (Math.abs(dx) >= cs) { press(dx > 0 ? 'right' : 'left'); sw.lx = e.clientX; sw.m = 1 } else if (dy >= cs && dy > Math.abs(dx)) { press('down'); sw.ly = e.clientY; sw.m = 1 } }
    else if (cur.k === 'p' || cur.k === 's') { if (Math.max(Math.abs(dx), Math.abs(dy)) >= 20) { press(dirOf(dx, dy)); sw.lx = e.clientX; sw.ly = e.clientY; sw.m = 1 } }
});
addEventListener('keydown', e => { const k = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', ' ': 'act', a: 'left', d: 'right', w: 'up', s: 'down', p: 'pause', Escape: 'pause' }[e.key]; if (!k || !$('play').classList.contains('open')) return; if (document.querySelector('.ov.open')) { if (k === 'pause' && paused) { e.preventDefault(); setPause(false) } return } e.preventDefault(); press(k) });
let last = 0;
function loop(ts) { const dt = Math.min(40, ts - last); last = ts; if (st === 'play' && !paused) cur.update(dt); cur.draw(); if (paused) msg('PAUSED', 'TAP OR PRESS P TO RESUME'); else if (st === 'ready') msg(cur.name, 'PRESS ANY KEY OR TAP'); else if (st === 'over') msg(cur.end, 'TAP TO PLAY AGAIN'); requestAnimationFrame(loop) }
$('pa').onclick = () => press('pause'); addEventListener('resize', fit); addEventListener('load', fit); document.addEventListener('visibilitychange', () => { if (document.hidden && st === 'play' && !paused) press('pause') });
function openGame(k) { audio(); $('play').classList.add('open'); document.body.style.overflow = 'hidden'; select(k); if (!(hs.hp && hs.hp[k])) { $('ht').textContent = 'How to play: ' + games[k].name; $('hx').textContent = matchMedia('(pointer:coarse)').matches ? TT[k] : games[k].tip; $('hp').classList.add('open') } }
function best() { for (const k in games) { const e = $('b-' + k); if (e) e.textContent = 'Best ' + (hs[bk(k)] || 0) } }
function closeGame() { $('play').classList.remove('open'); document.body.style.overflow = ''; st = 'ready'; setPause(false); best() }
document.querySelectorAll('.gc').forEach(b => b.onclick = () => openGame(b.dataset.g));
$('bk').onclick = closeGame;
function setD(d) { diff = d; hs.d = d; save(); document.querySelectorAll('#df [data-d]').forEach(b => b.classList.toggle('on', +b.dataset.d === d)); best() }
document.querySelectorAll('#df [data-d]').forEach(b => b.onclick = () => setD(+b.dataset.d)); setD(diff);
$('st').onclick = () => { audio(); pmShow('set') }; $('pc').onclick = () => pmShow(null);
$('mvs').oninput = e => { mv = +e.target.value; hs.mv = mv; save(); audio() }; $('svs').oninput = e => { sv = +e.target.value; hs.sv = sv; save(); sfx(660, .08) };
$('vbb').onclick = () => { vb = vb ? 0 : 1; hs.vb = vb; save(); $('vbb').textContent = vb ? 'On' : 'Off'; vib(40) };
$('rs').onclick = () => setPause(false); $('rr').onclick = () => { setPause(false); cur.init(); st = 'play' }; $('rm').onclick = () => closeGame();
$('hg').onclick = () => { hs.hp = hs.hp || {}; hs.hp[cur.k] = 1; save(); $('hp').classList.remove('open') }; $('go').onclick = () => $('home').scrollIntoView({ behavior: 'smooth' }); best();
addEventListener('scroll', () => { const p = Math.min(1, scrollY / innerHeight); $('hi2').style.transform = 'scale(' + (1 + p * .35) + ')'; $('hi2').style.opacity = 1 - p * 1.3; $('sd').style.opacity = 1 - p * 3 }, { passive: true });
const hc = $('hc'), hx = hc.getContext('2d'), NC = ['#00f0ff', '#fff200', '#bf40ff', '#39ff14', '#ff2bd6', '#2d6bff', '#ff6a00'], hb = [];
function hr() { hc.width = innerWidth; hc.height = innerHeight } hr(); addEventListener('resize', hr);
for (let i = 0; i < 24; i++)hb.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, s: 14 + Math.random() * 24, v: .3 + Math.random() * .9, c: NC[i % 7], r: Math.random() * 6 });
function hero(t) {
    requestAnimationFrame(hero); if (scrollY > innerHeight || $('play').classList.contains('open')) return; const W = hc.width, H = hc.height; hx.clearRect(0, 0, W, H);
    for (const b of hb) { b.y += b.v; b.r += .004 * b.v; if (b.y > H + 40) { b.y = -40; b.x = Math.random() * W } hx.save(); hx.translate(b.x, b.y); hx.rotate(b.r); hx.shadowColor = b.c; hx.shadowBlur = 14; hx.strokeStyle = b.c; hx.lineWidth = 2; hx.globalAlpha = .65; hx.strokeRect(-b.s / 2, -b.s / 2, b.s, b.s); hx.restore() }
    const y = H * .86, px = (t / 5) % (W + 260) - 130, m = .12 + .22 * Math.abs(Math.sin(t / 110)); hx.fillStyle = '#ff9bf0'; for (let d = 18; d < W; d += 36)if (d > px) hx.fillRect(d, y - 2, 4, 4);
    hx.shadowColor = '#fff200'; hx.shadowBlur = 16; hx.fillStyle = '#fff200'; hx.beginPath(); hx.moveTo(px, y); hx.arc(px, y, 18, m * Math.PI, (2 - m) * Math.PI); hx.fill();
    const gx = px - 64; hx.shadowColor = '#ff2bd6'; hx.fillStyle = '#ff2bd6'; hx.beginPath(); hx.arc(gx, y - 1, 16, Math.PI, 0); hx.lineTo(gx + 16, y + 16); hx.lineTo(gx - 16, y + 16); hx.fill(); hx.shadowBlur = 0; hx.fillStyle = '#fff'; hx.fillRect(gx - 9, y - 6, 7, 7); hx.fillRect(gx + 3, y - 6, 7, 7)
}
requestAnimationFrame(hero);
select('t'); requestAnimationFrame(loop);

/* ---------- Firebase Global Leaderboard & LinkedIn Challenge ---------- */
const firebaseConfig = {
    projectId: "studio-7481561832-42137",
    appId: "1:432376818880:web:778ee81cbf585d9fd4d125",
    storageBucket: "studio-7481561832-42137.firebasestorage.app",
    apiKey: "AIzaSyDk8sOP4kqKkf1hmzt6sgR34ks3VDPyw54",
    authDomain: "studio-7481561832-42137.firebaseapp.com",
    messagingSenderId: "432376818880",
    projectNumber: "432376818880"
};

let db = null;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    }
} catch (e) {
    console.warn('Firebase init:', e);
}

function showGameOverModal() {
    if (st !== 'over' || !cur) return;
    $('go-title').textContent = cur.end || 'GAME OVER';
    $('go-final-score').textContent = score;
    const b = bk(cur.k);
    const best = hs[b] || 0;
    $('go-best-badge').textContent = (score >= best && score > 0) ? '★ NEW PERSONAL BEST!' : ('Personal Best: ' + best);
    $('go-player-name').value = localStorage.getItem('arc_player_name') || '';
    $('go-status').textContent = '';
    $('go-submit-btn').disabled = false;
    $('go-submit-btn').textContent = 'Save';
    $('gom').classList.add('open');
}

function closeGameOverModal() {
    $('gom').classList.remove('open');
}

async function submitScore() {
    if (!cur) return;
    const nameInput = $('go-player-name');
    let name = (nameInput.value || '').trim().toUpperCase();
    if (!name) name = 'PLAYER';
    localStorage.setItem('arc_player_name', name);
    $('go-submit-btn').disabled = true;
    $('go-submit-btn').textContent = '...';
    $('go-status').textContent = 'Saving to leaderboard...';

    if (!db) {
        $('go-status').textContent = '✓ Saved locally!';
        $('go-submit-btn').textContent = 'Saved';
        return;
    }

    try {
        await db.collection('pocket_arcade').doc(cur.k).collection('scores').add({
            name: name.slice(0, 12),
            score: Number(score),
            diff: diff,
            created: firebase.firestore.FieldValue.serverTimestamp()
        });
        $('go-status').textContent = '✓ Global score submitted!';
        $('go-submit-btn').textContent = 'Saved';
    } catch (err) {
        console.error('Score submit error:', err);
        $('go-status').textContent = '✓ Saved locally!';
        $('go-submit-btn').textContent = 'Saved';
    }
}

function shareOnLinkedIn(gameName, finalScore) {
    const url = 'https://hebafatima2490-gif.github.io/pocket-arcade/';
    const postText = `🕹️ Can you beat my high score of ${finalScore} in ${gameName} on Pocket Arcade?\n\nPlay directly in your browser: ${url}\n\n#WebDevelopment #JavaScript #RetroGaming #PocketArcade #IndieDev`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(postText).catch(() => {});
    }

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
        navigator.share({
            title: 'Pocket Arcade Challenge',
            text: postText,
            url: url
        }).catch(() => {});
        return;
    }

    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=640,height=600');
}

let activeLbGame = 't';

async function openLeaderboard(gameKey) {
    activeLbGame = gameKey || (cur ? cur.k : 't');
    $('lbm').classList.add('open');
    renderLeaderboardTabs();
    await loadLeaderboardScores(activeLbGame);
}

function renderLeaderboardTabs() {
    const bar = $('lb-tabs');
    bar.innerHTML = '';
    for (const k in games) {
        const btn = document.createElement('button');
        btn.textContent = games[k].name;
        if (k === activeLbGame) btn.classList.add('active');
        btn.onclick = () => {
            activeLbGame = k;
            renderLeaderboardTabs();
            loadLeaderboardScores(k);
        };
        bar.appendChild(btn);
    }
    $('lb-game-name').textContent = games[activeLbGame] ? games[activeLbGame].name : 'ARCADE';
}

async function loadLeaderboardScores(gameKey) {
    const content = $('lb-content');
    content.innerHTML = '<div style="color:var(--mute);padding:24px 0;text-align:center;">Loading global scores...</div>';

    if (!db) {
        content.innerHTML = '<div style="color:var(--mute);padding:20px;text-align:center;">Leaderboard offline.</div>';
        return;
    }

    try {
        let items = [];
        try {
            const snapshot = await db.collection('pocket_arcade').doc(gameKey).collection('scores')
                .orderBy('score', 'desc')
                .limit(10)
                .get();
            snapshot.forEach(doc => items.push(doc.data()));
        } catch (qErr) {
            console.warn('Falling back to direct collection fetch:', qErr);
            const snapshot = await db.collection('pocket_arcade').doc(gameKey).collection('scores').limit(50).get();
            snapshot.forEach(doc => items.push(doc.data()));
            items.sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
            items = items.slice(0, 10);
        }

        if (!items.length) {
            content.innerHTML = '<div style="color:var(--mute);padding:24px 0;text-align:center;">No high scores yet.<br>Be the first to claim #1!</div>';
            return;
        }

        let html = '';
        items.forEach((data, i) => {
            const rank = i + 1;
            const topClass = rank === 1 ? 'top-1' : (rank === 2 ? 'top-2' : (rank === 3 ? 'top-3' : ''));
            const medal = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : (rank === 3 ? '🥉' : `#${rank}`));
            html += `<div class="lb-row ${topClass}">
                <span class="lb-rank">${medal}</span>
                <span class="lb-name">${escapeHtml(data.name || 'ANONYMOUS')}</span>
                <span class="lb-score">${data.score}</span>
            </div>`;
        });
        content.innerHTML = html;
    } catch (err) {
        console.error('Leaderboard load error:', err);
        content.innerHTML = '<div style="color:var(--mute);padding:20px;text-align:center;">Could not load scores right now.</div>';
    }
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

// Modal event listeners
$('btn-open-lb').onclick = () => openLeaderboard(cur ? cur.k : 't');
$('btn-game-lb').onclick = () => openLeaderboard(cur ? cur.k : 't');
$('lb-close').onclick = () => $('lbm').classList.remove('open');
$('lb-post-challenge').onclick = () => shareOnLinkedIn(games[activeLbGame] ? games[activeLbGame].name : 'Pocket Arcade', hs[bk(activeLbGame)] || 0);

$('go-submit-btn').onclick = submitScore;
$('go-linkedin-btn').onclick = () => shareOnLinkedIn(cur ? cur.name : 'Pocket Arcade', score);
$('go-play-again').onclick = () => { closeGameOverModal(); cur.init(); st = 'play'; };
$('go-show-lb').onclick = () => { closeGameOverModal(); openLeaderboard(cur.k); };
$('go-menu-btn').onclick = () => { closeGameOverModal(); closeGame(); };
