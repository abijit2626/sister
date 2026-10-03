/* Maths Buddy - topics 5-7: number patterns, add & subtract, story problems */
(function () {
  'use strict';
  const MB = window.MB, V = MB.V, G = MB.G, UI = MB.UI;
  const $ = (s, r) => MB.$(s, r);
  const MINUS = G.minus;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* =====================================================================
     5. NUMBER PATTERNS
     ===================================================================== */
  const RULES = [
    { k: '+5', label: 'Add 5', op: 1, s: 5, tip: 'The ones digit goes 5, 0, 5, 0, 5, 0 … (or 0, 5, 0, 5 …). Count in 5s like on a clock.' },
    { k: '+10', label: 'Add 10', op: 1, s: 10, tip: 'The ones digit never changes. The tens digit goes up by 1 each time.' },
    { k: '+50', label: 'Add 50', op: 1, s: 50, tip: 'Two jumps of 50 make 100. The hundreds digit goes up every second number.' },
    { k: MINUS + '5', label: 'Subtract 5', op: -1, s: 5, tip: 'Going backwards. Each number is 5 smaller, so the ones digit goes 5, 0, 5, 0 …' },
    { k: MINUS + '10', label: 'Subtract 10', op: -1, s: 10, tip: 'Going backwards. The ones digit stays the same. The tens digit goes down by 1.' }
  ];
  const seqOf = (start, r, len) => Array.from({ length: len }, (_, i) => start + r.op * r.s * i);
  function randStart(r, len) {
    const span = r.s * (len - 1);
    const lo = r.op > 0 ? 5 : span + 5, hi = r.op > 0 ? 990 - span : 995;
    return Math.round(MB.rand(lo, hi) / 5) * 5;
  }

  function genPatterns() {
    const qs = [], R = (k) => RULES[k];
    let r = R(1), s = MB.pick([100, 25, 110, 310, 45]);
    qs.push(G.seq('Complete the pattern:', seqOf(s, r, 5), [3, 4], { hint: 'Look at how much the numbers go up each time. Subtract two neighbours to find out.', explain: `The rule is <b>+10</b>: ${seqOf(s, r, 5).join(', ')}.` }));
    r = R(0); s = MB.pick([25, 40, 105, 55, 150]);
    qs.push(G.seq('Complete the pattern:', seqOf(s, r, 5), [3, 4], { hint: 'Count on in 5s.', explain: `The rule is <b>+5</b>: ${seqOf(s, r, 5).join(', ')}.` }));
    r = R(4); s = MB.pick([290, 200, 150, 95]);
    qs.push(G.seq('Complete the pattern:', seqOf(s, r, 5), [3, 4], { hint: 'The numbers are going down. What is the difference between two neighbours?', explain: `The rule is <b>${MINUS}10</b>: ${seqOf(s, r, 5).join(', ')}.` }));
    r = R(1); s = MB.pick([150, 120, 80, 230]);
    qs.push(G.seq('Complete the pattern:', seqOf(s, r, 5), [2, 3], { hint: 'Find the rule from the first two numbers.', explain: `The rule is <b>+10</b>: ${seqOf(s, r, 5).join(', ')}.` }));
    r = R(2); s = MB.pick([100, 50, 200, 300]);
    qs.push(G.seq('Complete the pattern:', seqOf(s, r, 5), [3, 4], { hint: 'Find how much the numbers jump each time.', explain: `The rule is <b>+50</b>: ${seqOf(s, r, 5).join(', ')}.` }));
    s = MB.rand(100, 996);
    qs.push(G.seq('Write the missing number:', [s, s + 1, s + 2, s + 3], [2], { hint: 'Count on by 1.', explain: `${s}, ${s + 1}, <b>${s + 2}</b>, ${s + 3}.` }));
    r = MB.pick([R(0), R(1), R(2)]); s = r.s === 50 ? 100 : MB.pick([30, 45, 60, 120]);
    const sq = seqOf(s, r, 4), opts = ['Add 5', 'Add 10', 'Add 50', 'Add 20'];
    qs.push(G.choice(`What is the rule? <div class="seq big">${sq.join('<span class="sc">,</span> ')}</div>`, 'Add ' + r.s, opts.filter(o => o !== 'Add ' + r.s).slice(0, 3), { cols: 2, hint: 'Subtract the first number from the second number.', explain: `${sq[1]} − ${sq[0]} = ${r.s}, so the rule is <b>add ${r.s}</b>.` }));
    r = R(MB.pick([0, 1])); s = MB.pick([30, 40, 50, 60]);
    const q8 = seqOf(s, r, 4);
    qs.push(G.seq('Write the missing number:', q8, [0], { hint: 'The numbers go up by the same amount each time. What comes before the second number?', explain: `The rule is <b>+${r.s}</b>, so go back one step: ${q8[1]} − ${r.s} = <b>${q8[0]}</b>.` }));
    return qs;
  }

  function patternMachine(box) {
    let r = RULES[1], start = 100, shown = 3;
    const LEN = 7;
    function draw() {
      const sq = seqOf(start, r, LEN), done = shown >= LEN;
      box.innerHTML = `<div class="pm">
        <div class="presets" role="group" aria-label="Choose a rule">${RULES.map((x, i) => `<button type="button" class="chip${x === r ? ' on' : ''}" data-r="${i}">${x.k}</button>`).join('')}</div>
        <div class="pm-row">${sq.map((v, i) => (i ? `<span class="pm-hop" aria-hidden="true">${r.k}</span>` : '') +
          (i < shown ? `<span class="pm-b show">${v}</span>` : i === shown ? `<button type="button" class="pm-b next" data-a="reveal" aria-label="reveal the next number">?</button>` : `<span class="pm-b">?</span>`)).join('')}</div>
        <p class="pm-say" aria-live="polite">${done ? `<b>Rule: ${r.label} each time.</b> ${r.tip}` : `Rule: <b>${r.label}</b>. Tap the glowing <b>?</b> to find the next number.`}</p>
        <div class="row"><button type="button" class="btn small" data-a="reveal" ${done ? 'disabled' : ''}>Next number ▶</button><button type="button" class="btn small ghost" data-a="new">New start ↻</button></div></div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.r) { r = RULES[+b.dataset.r]; start = randStart(r, LEN); shown = 3; }
      else if (b.dataset.a === 'reveal') shown = Math.min(LEN, shown + 1);
      else if (b.dataset.a === 'new') { start = randStart(r, LEN); shown = 3; }
      else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function ruleDetective(box) {
    let r, start, solved, tried;
    function fresh() { r = MB.pick(RULES); start = randStart(r, 5); solved = false; tried = []; }
    function draw() {
      const sq = seqOf(start, r, 5);
      box.innerHTML = `<div class="rd">
        <div class="pm-row">${sq.map((v, i) => (i ? '<span class="pm-hop" aria-hidden="true">?</span>' : '') + (i < 3 || solved ? `<span class="pm-b show">${v}</span>` : '<span class="pm-b">?</span>')).join('')}</div>
        <p class="pm-say" aria-live="polite">${solved ? `Yes! The rule is <b>${r.label}</b>. The next numbers are <b>${sq[3]}</b> and <b>${sq[4]}</b>.`
          : tried.length ? `Not that one. Check: ${sq[1]} − ${sq[0]} = ${sq[1] - sq[0]}. Try again!` : `What is the rule? Look at the first two numbers: how far did we jump?`}</p>
        <div class="presets">${RULES.map((x, i) => `<button type="button" class="chip${tried.includes(i) ? ' bad' : ''}${solved && x === r ? ' on' : ''}" data-r="${i}" ${solved ? 'disabled' : ''}>${x.k}</button>`).join('')}</div>
        <button type="button" class="btn small ghost" data-a="new">Another one ↻</button></div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.a === 'new') fresh();
      else if (b.dataset.r) {
        const i = +b.dataset.r;
        if (RULES[i] === r) { solved = true; MB.sfx.ok(); } else { tried.push(i); MB.sfx.no(); }
      } else return;
      draw();
    });
    fresh(); draw();
  }

  function learnPatterns(root) {
    root.innerHTML =
      UI.step(1, 'Pattern machine', `<p>A <b>number pattern</b> follows a rule. Pick a rule and watch the numbers hop along.</p><div data-w="pm"></div>`) +
      UI.step(2, 'Be a rule detective', `<p>To find the rule, <b>subtract</b> two neighbours (bigger − smaller). Going up means <b>add</b>. Going down means <b>subtract</b>.</p><div data-w="rd"></div>`) +
      UI.step(3, 'Quick tricks', `<div class="facts">
        <div class="fact"><small>+10</small><b>tens digit ↑</b></div><div class="fact"><small>${MINUS}10</small><b>tens digit ↓</b></div>
        <div class="fact"><small>+5</small><b>ends in 5 or 0</b></div><div class="fact"><small>+50</small><b>hundreds every 2</b></div></div>
        <div class="callout">Always <b>check your rule</b> on the last two numbers too before you write the missing numbers.</div>`);
    patternMachine($('[data-w=pm]', root)); ruleDetective($('[data-w=rd]', root));
  }

  /* =====================================================================
     6. ADD & SUBTRACT
     ===================================================================== */
  const PL = ['ones', 'tens', 'hundreds'];

  /* Work out every column step of a + b or a - b. Used by the lesson and by the question hints. */
  function colSteps(a, b, op) {
    const A = MB.digits(a), B = MB.digits(b), len = String(op === '+' ? Math.max(a, b) : a).length, steps = [];
    if (op === '+') {
      let carry = 0;
      for (let p = 0; p < len; p++) {
        const i = 2 - p, x = A[i], y = B[i], s = x + y + carry, dg = s % 10, co = s >= 10 ? 1 : 0;
        let text = `${cap(PL[p])}: ${x} + ${y}` + (carry ? ` + ${carry} (carried)` : '') + ` = ${s}. `;
        text += co ? `${s} ${PL[p]} is too many for one box. Write <b>${dg}</b> and carry <b>1</b> to the ${PL[p + 1]}.` : `Write <b>${dg}</b>.`;
        steps.push({ p, i, x, y, carry, s, dg, co, text });
        carry = co;
      }
    } else {
      const T = A.slice();
      for (let p = 0; p < len; p++) {
        const i = 2 - p, y = B[i], x = T[i]; let text, borrow = false;
        if (T[i] < y) {
          borrow = true; let casc = false;
          if (T[i - 1] === 0) { casc = true; T[i - 2] -= 1; T[i - 1] += 10; }
          T[i - 1] -= 1; T[i] += 10;
          text = `${cap(PL[p])}: ${x} is smaller than ${y}, so we cannot take ${y} away. ` +
            (casc ? `The ${PL[p + 1]} digit is 0, so first trade 1 ${PL[p + 2].replace(/s$/, '')} for 10 ${PL[p + 1]}, then trade 1 ${PL[p + 1].replace(/s$/, '')} for 10 ${PL[p]}. ` : `Trade 1 ${PL[p + 1].replace(/s$/, '')} for 10 ${PL[p]}. `) +
            `Now ${T[i]} ${MINUS} ${y} = ${T[i] - y}. Write <b>${T[i] - y}</b>.`;
        } else text = `${cap(PL[p])}: ${x} ${MINUS} ${y} = ${x - y}. Write <b>${x - y}</b>.`;
        steps.push({ p, i, x: T[i], orig: x, y, borrow, dg: T[i] - y, text, top: T.slice() });
      }
    }
    return { steps, len, ans: op === '+' ? a + b : a - b };
  }
  const explainCol = (a, b, op) => { const c = colSteps(a, b, op); return c.steps.map(s => s.text.replace(/<\/?b>/g, '')).join(' ') + ` So ${a} ${op === '+' ? '+' : MINUS} ${b} = ${c.ans}.`; };

  /* number pairs of different kinds */
  const dg3 = (n) => MB.digits(n);
  const pairs = {
    addPlain3: () => G.pair([101, 799], [101, 799], (a, b) => { const x = dg3(a), y = dg3(b); return [0, 1, 2].every(i => x[i] + y[i] <= 9) && x[0] > 0 && y[0] > 0; }),
    subPlain3: () => G.pair([201, 989], [101, 799], (a, b) => { const x = dg3(a), y = dg3(b); return a > b && [0, 1, 2].every(i => x[i] >= y[i]) && (x[1] - y[1] + x[2] - y[2]) > 0; }),
    addCarry2: () => G.pair([12, 79], [12, 79], (a, b) => { const x = dg3(a), y = dg3(b); return x[2] + y[2] >= 10 && x[1] + y[1] + 1 <= 9 && a % 10 && b % 10; }),
    subBorrow2: () => G.pair([31, 98], [12, 79], (a, b) => { const x = dg3(a), y = dg3(b); return x[2] < y[2] && x[1] - 1 >= y[1] && y[1] >= 1; }),
    addCarry3: () => G.pair([121, 789], [121, 789], (a, b) => { const x = dg3(a), y = dg3(b); return x[2] + y[2] >= 10 && x[1] + y[1] + 1 <= 9 && x[0] + y[0] <= 9; }),
    subBorrow3: () => G.pair([221, 989], [111, 799], (a, b) => { const x = dg3(a), y = dg3(b); return x[2] < y[2] && x[1] >= 1 && x[1] - 1 >= y[1] && x[0] >= y[0]; })
  };

  const addQ = (a, b, label) => G.num(`${label || 'Add'}: <b>${a} + ${b}</b>`, a + b, { vis: V.vsum(a, b, '+'), hint: 'Line up the columns. Start with the ones, then tens, then hundreds.', explain: explainCol(a, b, '+') });
  const subQ = (a, b, label) => G.num(`${label || 'Subtract'}: <b>${a} ${MINUS} ${b}</b>`, a - b, { vis: V.vsum(a, b, MINUS), hint: 'Line up the columns. Start with the ones. If the top digit is smaller, trade from the next place.', explain: explainCol(a, b, '-') });

  function genAddSub() {
    const qs = []; let p;
    p = pairs.addPlain3(); qs.push(addQ(p[0], p[1]));
    p = pairs.subPlain3(); qs.push(subQ(p[0], p[1]));
    p = pairs.addCarry2(); qs.push(addQ(p[0], p[1]));
    p = pairs.subBorrow2(); qs.push(subQ(p[0], p[1]));
    p = pairs.addCarry3(); qs.push(addQ(p[0], p[1]));
    p = pairs.subBorrow3(); qs.push(subQ(p[0], p[1]));
    p = pairs.addPlain3();
    qs.push({ kind: 'fill', prompt: 'Find the missing number.', tpl: `<div class="seq">${p[0]} + {0} = ${p[0] + p[1]}</div>`, blanks: [{ kind: 'num', ans: p[1], w: 3 }], hint: `Subtract: ${p[0] + p[1]} ${MINUS} ${p[0]}.`, explain: `${p[0] + p[1]} ${MINUS} ${p[0]} = <b>${p[1]}</b>.` });
    p = pairs.subPlain3(); const d = p[0] - p[1];
    qs.push(G.choice(`<b>${p[0]} ${MINUS} ${p[1]}</b> = ?`, String(d), [String(p[0] + p[1]), String(d + 10), String(d - 10 > 0 ? d - 10 : d + 20)], { cols: 2, big: true, hint: 'Subtract each column. Do not add!', explain: explainCol(p[0], p[1], '-') }));
    return qs;
  }

  function columnStepper(box) {
    const EX = {
      '+': [[126, 143, 'no carry'], [25, 15, 'carry'], [248, 135, 'carry'], [38, 27, 'carry']],
      '-': [[285, 132, 'no borrow'], [52, 27, 'borrow'], [346, 158, '2 borrows'], [305, 128, 'zero tens']]
    };
    let op = '+', a = 126, b = 143, k = 0, calc = colSteps(a, b, op);
    function setEx(x) { a = x[0]; b = x[1]; k = 0; calc = colSteps(a, b, op); }
    function topCell(i, T, A) {
      const c = 2 - i; if (c >= calc.len) return '';
      if (T[i] === A[i]) return A[i];
      if (T[i] - 10 === A[i]) return `<span class="bw">1</span>${A[i]}`;
      return `<s>${A[i]}</s><span class="nd">${T[i]}</span>`;
    }
    function draw() {
      const A = MB.digits(a), B = MB.digits(b), done = k === calc.steps.length, cur = k > 0 ? calc.steps[k - 1] : null;
      const T = op === '-' ? (k > 0 ? cur.top : A) : A, ans = calc.ans;
      const cellCls = (i) => (cur && cur.i === i ? ' hl' : '');
      const showD = (n, i) => ((2 - i) < calc.len ? MB.digits(n)[i] : '');
      let carryRow = '', topRow = '', botRow = '', resRow = '';
      for (let i = 0; i < 3; i++) {
        const c = 2 - i;
        const cy = op === '+' && c >= 1 && k > c - 1 && calc.steps[c - 1] && calc.steps[c - 1].co ? '1' : '';
        carryRow += `<span class="cy${cellCls(i)}">${cy}</span>`;
        topRow += `<span class="${cellCls(i).trim()}">${op === '-' ? topCell(i, T, A) : showD(a, i)}</span>`;
        botRow += `<span class="${cellCls(i).trim()}">${showD(b, i)}</span>`;
        let r = '';
        if (c < calc.len && k > c) { const dg = calc.steps[c].dg; r = (c > 0 && ans < Math.pow(10, c)) ? '' : dg; }
        resRow += `<span class="res${cellCls(i)}${r === '' && k <= c ? ' empty' : ''}">${r === '' ? (k > c ? '' : '?') : r}</span>`;
      }
      // blocks
      let blocks;
      if (op === '+') {
        const part = { h: 0, t: 0, o: 0 };
        calc.steps.forEach((s, j) => { if (k > j) part['hto'[s.i]] = s.dg; });
        blocks = `<div class="cs-blk"><div><small>${a}</small>${V.blocksOf(a, 'xs')}</div><span class="cs-op">+</span><div><small>${b}</small>${V.blocksOf(b, 'xs')}</div><span class="cs-op">=</span><div><small>so far</small>${V.blocks(Object.assign({ cls: 'xs', empty: k === 0 }, part))}</div></div>`;
      } else {
        const f = { fo: k >= 1 ? B[2] : 0, ft: k >= 2 ? B[1] : 0, fh: k >= 3 ? B[0] : 0 };
        blocks = `<div class="cs-blk"><div><small>${a} → take away ${b}</small>${V.blocks(Object.assign({ h: T[0], t: T[1], o: T[2], cls: 'xs' }, f))}</div></div>`;
      }
      const msg = k === 0 ? `Line up the digits: ones under ones, tens under tens. We start with the <b>ones</b>, the right-hand column.`
        : cur.text + (done ? ` <br><b>🎉 ${a} ${op === '+' ? '+' : MINUS} ${b} = ${ans}</b>` : '');
      box.innerHTML = `<div class="cs">
        <div class="presets seg" role="group"><button type="button" class="chip${op === '+' ? ' on' : ''}" data-op="+">➕ Add</button><button type="button" class="chip${op === '-' ? ' on' : ''}" data-op="-">➖ Subtract</button></div>
        <div class="presets">${EX[op].map((x, i) => `<button type="button" class="chip${x[0] === a && x[1] === b ? ' on' : ''}" data-i="${i}">${x[0]} ${op === '+' ? '+' : MINUS} ${x[1]}<small>${x[2]}</small></button>`).join('')}<button type="button" class="chip" data-a="rand">🎲</button></div>
        <div class="cs-col" role="img" aria-label="${a} ${op === '+' ? 'plus' : 'minus'} ${b} in columns">
          <div class="cs-head"><span></span><span class="ch">H</span><span class="ct">T</span><span class="co">O</span></div>
          ${op === '+' ? `<div class="cs-r carry"><span></span>${carryRow}</div>` : ''}
          <div class="cs-r"><span></span>${topRow}</div>
          <div class="cs-r"><span class="sg">${op === '+' ? '+' : MINUS}</span>${botRow}</div>
          <div class="cs-line"></div>
          <div class="cs-r"><span></span>${resRow}</div>
        </div>
        ${blocks}
        <p class="cs-msg" aria-live="polite">${msg}</p>
        <div class="row"><button type="button" class="btn small ghost" data-a="back" ${k === 0 ? 'disabled' : ''}>◀ Back</button><button type="button" class="btn small" data-a="next" ${done ? 'disabled' : ''}>Next step ▶</button></div></div>`;
    }
    box.addEventListener('click', e => {
      const bt = e.target.closest('button'); if (!bt || bt.disabled) return;
      if (bt.dataset.op) { op = bt.dataset.op; setEx(EX[op][0]); }
      else if (bt.dataset.i) setEx(EX[op][+bt.dataset.i]);
      else if (bt.dataset.a === 'rand') { const p = op === '+' ? MB.pick([pairs.addCarry2, pairs.addCarry3, pairs.addPlain3])() : MB.pick([pairs.subBorrow2, pairs.subBorrow3, pairs.subPlain3])(); setEx([p[0], p[1]]); }
      else if (bt.dataset.a === 'next') { k++; if (k === calc.steps.length) { MB.sfx.ok(); } }
      else if (bt.dataset.a === 'back') k--;
      else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function learnAddSub(root) {
    root.innerHTML =
      UI.step(1, 'Add and subtract in columns', `<p>Line up the digits. Always start with the <b>ones</b>. Press <b>Next step</b> and watch the blocks. Try the <i>carry</i> and <i>borrow</i> examples too.</p><div data-w="cs"></div>`) +
      UI.step(2, 'Carry and borrow', `<div class="two">
        <div class="callout"><b>Adding: carry</b><br>If a column adds up to <b>10 or more</b>, write the ones digit and <b>carry 1</b> to the next column.<br><i>Example: 5 + 5 = 10 → write 0, carry 1.</i></div>
        <div class="callout"><b>Subtracting: borrow</b><br>If the top digit is <b>smaller</b>, trade 1 from the next column. It becomes <b>10</b> in this column.<br><i>Example: 2 − 7? Borrow! 12 − 7 = 5.</i></div></div>`) +
      UI.step(3, 'Check your answer', `<p>Add and subtract are <b>opposites</b>. Use one to check the other:</p>
        <div class="checkrow"><span>126 + 143 = <b>269</b></span><span>→</span><span>269 ${MINUS} 143 = <b>126</b> ✔</span></div>
        <div class="checkrow"><span>285 ${MINUS} 132 = <b>153</b></span><span>→</span><span>153 + 132 = <b>285</b> ✔</span></div>`);
    columnStepper($('[data-w=cs]', root));
  }

  /* =====================================================================
     7. STORY PROBLEMS
     ===================================================================== */
  const KIDS = ['Riya', 'Aarav', 'Meera', 'Kabir', 'Anaya', 'Vihaan', 'Diya', 'Arjun'];
  const THINGS = ['toy blocks', 'marbles', 'stickers', 'pencils', 'balloons', 'beads', 'stamps', 'crayons'];

  function story(kind, a, b) {
    const n = MB.pick(KIDS), m = MB.pick(KIDS.filter(x => x !== n)), t = MB.pick(THINGS), A = `<b>${a}</b>`, B = `<b>${b}</b>`;
    if (kind === 'add') {
      const T = MB.pick([
        [`${n} has ${A} ${t}. ${n}’s friend gives ${n} ${B} more. How many ${t} does ${n} have <u>altogether</u>?`, 'altogether', n],
        [`There are ${A} ${t} in one box and ${B} ${t} in another box. How many ${t} are there <u>in all</u>?`, 'in all', null],
        [`A shop sold ${A} ${t} on Monday and ${B} ${t} on Tuesday. How many ${t} were sold <u>in total</u>?`, 'in total', null]
      ]);
      return { text: T[0], key: T[1], op: '+', ans: a + b, who: T[2], t };
    }
    if (kind === 'sub') {
      const T = MB.pick([
        [`${n} had ${A} ${t}. ${n} gave ${B} to a friend. How many ${t} are <u>left</u>?`, 'left', n],
        [`There were ${A} ${t} in a box. ${B} ${t} were taken out. How many ${t} are <u>left</u> in the box?`, 'left', null]
      ]);
      return { text: T[0], key: T[1], op: '-', ans: a - b, who: T[2], t };
    }
    return { text: `${n} has ${A} ${t}. ${m} has ${B} ${t}. <u>How many more</u> ${t} does ${n} have than ${m}?`, key: 'how many more', op: '-', ans: a - b, who: n, t };
  }
  const storyNumQ = (s, a, b) => G.num(s.text, s.ans, {
    hint: `The clue word is “${s.key}”. That means ${s.op === '+' ? 'add (+)' : 'subtract (' + MINUS + ')'}.`,
    explain: `Number sentence: ${a} ${s.op === '+' ? '+' : MINUS} ${b} = <b>${s.ans}</b>.`
  });
  const storyOpQ = (s, a, b) => G.choice(`${s.text}<br><br>Do we <b>add</b> or <b>subtract</b>?`, s.op === '+' ? '➕ Add' : '➖ Subtract', [s.op === '+' ? '➖ Subtract' : '➕ Add'], {
    cols: 2, big: true, hint: `Look at the clue word: “${s.key}”.`, explain: `“${s.key}” tells us to ${s.op === '+' ? '<b>add</b>' : '<b>subtract</b>'}: ${a} ${s.op === '+' ? '+' : MINUS} ${b}.`
  });

  function genStory() {
    const qs = []; let p, s;
    p = G.pair([11, 48], [11, 40], (a, b) => a % 10 + b % 10 <= 9);
    s = story('add', p[0], p[1]); qs.push(storyNumQ(s, p[0], p[1]));
    p = [MB.rand(20, 60), MB.rand(10, 35)]; s = story('add', p[0], p[1]); qs.push(storyOpQ(s, p[0], p[1]));
    p = G.pair([40, 98], [11, 38], (a, b) => a % 10 >= b % 10);
    s = story('sub', p[0], p[1]); qs.push(storyNumQ(s, p[0], p[1]));
    p = pairs.addCarry2(); s = story('add', p[0], p[1]); qs.push(storyNumQ(s, p[0], p[1]));
    p = [MB.rand(40, 90), MB.rand(11, 35)]; s = story('sub', p[0], p[1]); qs.push(storyOpQ(s, p[0], p[1]));
    p = pairs.subBorrow2(); s = story('sub', p[0], p[1]); qs.push(storyNumQ(s, p[0], p[1]));
    p = [MB.rand(60, 99), MB.rand(21, 55)]; s = story('diff', p[0], p[1]); qs.push(storyNumQ(s, p[0], p[1]));
    p = pairs.addPlain3(); s = story('add', p[0], p[1]); qs.push(storyNumQ(s, p[0], p[1]));
    return qs;
  }

  function clueGame(box) {
    const WORDS = [['altogether', '+'], ['in all', '+'], ['total', '+'], ['together', '+'], ['gets 15 more', '+'], ['sum', '+'],
      ['left', '-'], ['gave away', '-'], ['lost', '-'], ['taken out', '-'], ['how many more', '-'], ['fewer', '-']];
    let queue, i, score, answered;
    function fresh() { queue = MB.sample(WORDS, 8); i = 0; score = 0; answered = null; }
    function draw() {
      if (i >= queue.length) {
        box.innerHTML = `<div class="cg"><p class="cg-end">You got <b>${score}</b> out of ${queue.length}! ${score >= 7 ? '🌟' : 'Play again to get better!'}</p><button type="button" class="btn small" data-a="again">Play again ↻</button></div>`;
        return;
      }
      const w = queue[i];
      box.innerHTML = `<div class="cg"><div class="cg-n">Word ${i + 1} of ${queue.length}</div><div class="cg-word">“${w[0]}”</div>
        <div class="row"><button type="button" class="btn opt-add" data-v="+" ${answered ? 'disabled' : ''}>➕ Add</button><button type="button" class="btn opt-sub" data-v="-" ${answered ? 'disabled' : ''}>➖ Subtract</button></div>
        <p class="cg-fb" aria-live="polite">${answered ? (answered === w[1] ? '✅ Yes!' : '❌ Not quite.') + ` “${w[0]}” means <b>${w[1] === '+' ? 'add' : 'subtract'}</b>.` : 'Does this word tell us to add or subtract?'}</p>
        ${answered ? '<button type="button" class="btn small" data-a="next">Next ▶</button>' : ''}</div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.v) { answered = b.dataset.v; if (answered === queue[i][1]) { score++; MB.sfx.ok(); } else MB.sfx.no(); }
      else if (b.dataset.a === 'next') { i++; answered = null; }
      else if (b.dataset.a === 'again') fresh();
      else return;
      draw();
    });
    fresh(); draw();
  }

  function storyWalk(box) {
    let st = 0;
    const STAGES = [
      { h: 'Read', t: '<b>Riya has 25 toy blocks.</b> Her friend gives her <b>15 more</b> blocks. How many blocks does Riya have altogether?', v: () => '' },
      { h: 'Draw', t: 'Draw what you know. Riya has <b>25</b> blocks (2 tens and 5 ones).', v: () => `<div class="sw-blk">${V.blocks({ t: 2, o: 5, cls: 'sm' })}</div>` },
      { h: 'Draw', t: 'Her friend gives <b>15 more</b> (1 ten and 5 ones). “More” and “altogether” tell us to <b>add</b>.', v: () => `<div class="sw-blk">${V.blocks({ t: 2, o: 5, cls: 'sm' })}<span class="cs-op">+</span>${V.blocks({ t: 1, o: 5, cls: 'sm' })}</div>` },
      { h: 'Solve', t: 'Put them together: 3 tens and <b>10 ones</b>. 10 ones make 1 ten, so we have <b>4 tens</b>.', v: () => `<div class="sw-blk">${V.blocks({ t: 3, o: 10, cls: 'sm' })}<span class="cs-op">→</span>${V.blocks({ t: 4, cls: 'sm' })}</div>` },
      { h: 'Write', t: 'Write a number sentence and a full-sentence answer.', v: () => `<div class="sw-write"><div><small>Number sentence</small><b>25 + 15 = 40</b></div><div><small>Answer</small><b>Riya has 40 blocks altogether.</b></div></div>` }
    ];
    function draw() {
      const s = STAGES[st];
      box.innerHTML = `<div class="sw"><div class="sw-steps">${['Read', 'Draw', 'Solve', 'Write'].map(x => `<span class="${x === s.h ? 'on' : ''}">${x}</span>`).join('')}</div>
        <p class="sw-t">${s.t}</p>${s.v()}
        <div class="row"><button type="button" class="btn small ghost" data-a="back" ${st === 0 ? 'disabled' : ''}>◀ Back</button><button type="button" class="btn small" data-a="next" ${st === STAGES.length - 1 ? 'disabled' : ''}>Next ▶</button></div></div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.a === 'next') st++; else if (b.dataset.a === 'back') st--; else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function learnStory(root) {
    root.innerHTML =
      UI.step(1, 'Clue words', `<div class="two">
        <div class="callout good"><b>➕ Add</b><br>altogether · in all · total<br>together · sum · gets more</div>
        <div class="callout warn"><b>➖ Subtract</b><br>left · gave away · lost<br>taken out · how many more</div></div>
        <p>Play the game. Is it an add word or a subtract word?</p><div data-w="cg"></div>`) +
      UI.step(2, 'Read, Draw, Solve, Write', `<p>Follow Riya’s story step by step.</p><div data-w="sw"></div>`) +
      UI.step(3, 'Before you answer', `<ul class="ticks"><li>Read the story <b>twice</b>.</li><li>Circle the numbers and the clue word.</li><li>Write the <b>number sentence</b> (like 25 + 15 = 40).</li><li>Write the answer in a <b>full sentence</b>.</li></ul>`);
    clueGame($('[data-w=cg]', root)); storyWalk($('[data-w=sw]', root));
  }

  /* ---------- register ---------- */
  MB.topics.push(
    { id: 'patterns', title: 'Number Patterns', emoji: '🔁', tc: 'tc-patterns', blurb: 'Skip counting and missing numbers', mock: 2, learn: learnPatterns, gen: genPatterns },
    { id: 'addsub', title: 'Add & Subtract', emoji: '➕', tc: 'tc-addsub', blurb: 'Columns, carrying and borrowing', mock: 2, learn: learnAddSub, gen: genAddSub },
    { id: 'story', title: 'Story Problems', emoji: '📖', tc: 'tc-story', blurb: 'Read it, draw it, solve it', mock: 1, learn: learnStory, gen: genStory }
  );
  MB.colSteps = colSteps;
  MB.QB = Object.assign(MB.QB || {}, { addQ, subQ });
})();
