/* Maths Buddy - her worksheets (from the photos), and the mock test */
(function () {
  'use strict';
  const MB = window.MB, V = MB.V, G = MB.G, Q = MB.Quiz, QB = MB.QB;
  const $ = (s, r) => MB.$(s, r);
  const MINUS = G.minus;

  /* ---------- helpers ---------- */
  const tag = (q, no, marks, section) => Object.assign(q, { no: no, marks: marks, section: section });
  const frows = (items) => items.map((t, k) => `<div class="frow">${t.replace('{}', '{' + k + '}')}</div>`).join('');
  const seqRows = (rows, start) => {
    // rows: [{label, values, blankAt}] -> one fill question with all blanks
    const blanks = []; let tpl = '';
    rows.forEach(r => {
      const parts = r.values.map((v, k) => {
        if (r.blankAt.indexOf(k) < 0) return `<span class="sv">${v}</span>`;
        blanks.push({ kind: 'num', ans: v, w: String(v).length }); return '{' + (blanks.length - 1) + '}';
      });
      tpl += `<div class="frow">${r.label}) <span class="seq">${parts.join('<span class="sc">,</span> ')}</span></div>`;
    });
    return { blanks, tpl };
  };
  const symRows = (pairs) => ({
    blanks: pairs.map(p => ({ kind: 'sym', ans: p[0] > p[1] ? '>' : p[0] < p[1] ? '<' : '=' })),
    tpl: pairs.map((p, k) => `<div class="frow">${'abc'[k]}) <span class="cmp"><span>${p[0]}</span> {${k}} <span>${p[1]}</span></span></div>`).join('')
  });
  const namesRows = (nums) => ({
    blanks: nums.map(n => ({ kind: 'text', nameOf: n, w: 26 })),
    tpl: nums.map((n, k) => `<div class="frow">${'abc'[k]}) <b>${n}</b> {${k}}</div>`).join('')
  });
  const triangleQ = () => ({ kind: 'fill', prompt: 'Name a shape that has <b>3 sides</b>.', blanks: [{ kind: 'text', ans: ['triangle'], w: 12 }], hint: 'It has 3 sides and 3 corners.', explain: 'A <b>triangle</b> has 3 sides.' });
  const circleObjQ = () => Object.assign(QB.pickQ('circle'), { prompt: 'Name <b>two objects</b> that look like a circle.' });
  const numberSentence = (a, b, ans, who) => Object.assign(G.num(`${who} has <b>${a} toy blocks</b>. Her friend gives her <b>${b} more blocks</b>.<br>How many blocks does Riya have altogether?`, ans, {
    hint: '“Altogether” means add (+).', explain: `${a} + ${b} = <b>${ans}</b>. Riya has ${ans} blocks altogether.`
  }));

  /* ---------- Paper A: questions 1 to 20 ---------- */
  function paperA() {
    const q = [];
    q.push(tag(QB.nameQ(145), 1));
    q.push(tag(QB.numQ(182), 2));
    q.push(tag({ kind: 'order', dir: 'asc', items: [125, 152, 105, 215], prompt: 'Arrange these numbers in <b>ascending</b> order: 125, 152, 105, 215.', hint: 'Ascending means smallest to biggest.', explain: '105, 125, 152, 215.' }, 3));
    q.push(tag({ kind: 'fill', prompt: 'Add the parts.', tpl: '<div class="seq">200 + 60 + 7 = {0}</div>', blanks: [{ kind: 'num', ans: 267, w: 3 }], hint: 'Hundreds, tens and ones each go in their own place.', explain: '200 + 60 + 7 = <b>267</b>.' }, 4));
    q.push(tag(G.num('What comes just <b>before 200</b>?', 199, { hint: 'Just before means 1 less.', explain: '200 − 1 = <b>199</b>.' }), 5));
    q.push(tag(G.num('What comes just <b>after 199</b>?', 200, { hint: 'Just after means 1 more. 199 ends in 9, so the digits change!', explain: '199 + 1 = <b>200</b>.' }), 6));
    q.push(tag(QB.expQ(176), 7));
    q.push(tag(triangleQ(), 8));
    q.push(tag(G.num('How many <b>sides</b> does a <b>rectangle</b> have?', 4, { hint: QB.SHAPE_HINT.rectangle, explain: QB.SHAPE_HINT.rectangle }), 9));
    q.push(tag(circleObjQ(), 10));
    q.push(tag(G.num('How many <b>corners</b> does a <b>square</b> have?', 4, { hint: QB.SHAPE_HINT.square, explain: QB.SHAPE_HINT.square }), 11));
    q.push(tag(G.choice('Which shape has <b>no corners</b>: circle, triangle or rectangle?', V.shapeOpt('circle'), ['triangle', 'rectangle'].map(V.shapeOpt), { cols: 3, hint: 'Corners are pointy. Which shape is round?', explain: QB.SHAPE_HINT.circle }), 12));
    q.push(tag(G.num('Write the <b>place value</b> of <b>7</b> in <b>274</b>.', 70, { hint: 'Which place is the 7 in? Then say its value.', explain: 'The 7 is in the tens place, so its value is 7 tens = <b>70</b>.' }), 13));
    q.push(tag(QB.expQ(296), 14));
    q.push(tag(G.choice('Which is <b>greater</b>: <b>298</b> or <b>289</b>?', '298', ['289'], { cols: 2, big: true, hint: 'Compare the hundreds, then the tens.', explain: QB.cmpWhy(298, 289) }), 15));
    q.push(tag(G.num('Write the <b>smallest 3-digit</b> number.', 100, { hint: '99 has only 2 digits. What comes after it?', explain: '100 has 3 digits and is the smallest of them.' }), 16));
    q.push(tag(QB.addQ(126, 143), 17));
    q.push(tag(QB.subQ(285, 132), 18));
    q.push(tag(G.seq('Complete:', [100, 150, 200, 250, 300], [3, 4], { hint: 'The numbers go up by 50 each time.', explain: 'The rule is +50: 100, 150, 200, <b>250</b>, <b>300</b>.' }), 19));
    q.push(tag(G.seq('Complete:', [290, 285, 280, 275, 270], [3, 4], { hint: 'The numbers go down by 5 each time.', explain: `The rule is ${MINUS}5: 290, 285, 280, <b>275</b>, <b>270</b>.` }), 20));
    return q;
  }

  /* ---------- Paper B: questions 16 to 20 ---------- */
  function paperB() {
    const q = [], n3 = namesRows([125, 150, 200]);
    q.push(tag({ kind: 'fill', prompt: 'Write the number names for:', tpl: n3.tpl, blanks: n3.blanks, hint: 'Hundreds first, then “and”, then the rest.', explain: '125 = one hundred and twenty-five; 150 = one hundred and fifty; 200 = two hundred.' }, 16));
    q.push(tag(numberSentence(25, 15, 40, 'Riya'), 17));
    const p = seqRows([{ label: 'a', values: [100, 110, 120, 130, 140], blankAt: [3, 4] }, { label: 'b', values: [150, 160, 170, 180, 190], blankAt: [2, 3] }, { label: 'c', values: [200, 190, 180, 170, 160], blankAt: [3, 4] }]);
    q.push(tag({ kind: 'fill', prompt: 'Complete the number patterns:', tpl: p.tpl, blanks: p.blanks, hint: 'Find how much each pattern goes up or down by.', explain: `a) +10: 130, 140. b) +10: 170, 180. c) ${MINUS}10: 170, 160.` }, 18));
    const c = symRows([[145, 154], [178, 178], [199, 189]]);
    q.push(tag({ kind: 'fill', prompt: 'Compare the numbers using <b>&lt;</b>, <b>&gt;</b> or <b>=</b>:', tpl: c.tpl, blanks: c.blanks, hint: 'Compare the hundreds first, then tens, then ones.', explain: '145 < 154; 178 = 178; 199 > 189.' }, 19));
    q.push(tag({
      kind: 'fill', prompt: 'Look at the shapes and answer:',
      tpl: frows(['a) How many sides does a triangle have? {}', 'b) How many sides does a rectangle have? {}', 'c) How many corners does a square have? {}']),
      blanks: [3, 4, 4].map(n => ({ kind: 'num', ans: n, w: 1 })), hint: 'Triangle: 3 sides. Rectangle and square: 4.', explain: 'A triangle has 3 sides, a rectangle has 4 sides, a square has 4 corners.'
    }, 20));
    return q;
  }

  /* ---------- Paper C: questions 1 to 11 ---------- */
  function paperC() {
    const A = 'Section A · 1 mark each', B = 'Section B · 2 marks each', q = [];
    q.push(tag(QB.nameQ(45), 1, 1, A));
    q.push(tag(QB.numQ(72), 2, 1, A));
    q.push(tag(G.seq('Complete the pattern:', [10, 20, 30, 40, 50], [3], { hint: 'Count on in tens.', explain: '10, 20, 30, <b>40</b>, 50.' }), 3, 1, A));
    q.push(tag(G.num('Write the number that comes <b>just after 99</b>.', 100, { hint: '99 + 1. Ten tens make a hundred.', explain: '99 + 1 = <b>100</b>.' }), 4, 1, A));
    q.push(tag(QB.symQ(67, 76), 5, 1, A));
    q.push(tag(G.num('What number comes <b>between 48 and 50</b>?', 49, { hint: 'Count up from 48.', explain: '48, <b>49</b>, 50.' }), 6, 1, A));
    q.push(tag(triangleQ(), 7, 1, A));
    q.push(tag(G.seq('Write the missing number:', [125, 126, 127, 128], [2], { hint: 'Count on by 1.', explain: '125, 126, <b>127</b>, 128.' }), 8, 1, A));
    const n2 = namesRows([36, 84]);
    q.push(tag({ kind: 'fill', prompt: 'Write the number names:', tpl: n2.tpl, blanks: n2.blanks, hint: 'Tens word, a hyphen, then the ones word.', explain: '36 = thirty-six; 84 = eighty-four.' }, 9, 2, B));
    const p = seqRows([{ label: 'a', values: [25, 35, 45, 55, 65], blankAt: [3, 4] }, { label: 'b', values: [100, 110, 120, 130, 140], blankAt: [3, 4] }]);
    q.push(tag({ kind: 'fill', prompt: 'Complete the patterns:', tpl: p.tpl, blanks: p.blanks, hint: 'Both patterns go up by 10.', explain: 'a) 55, 65. b) 130, 140.' }, 10, 2, B));
    const c = symRows([[56, 65], [100, 100]]);
    q.push(tag({ kind: 'fill', prompt: 'Compare using <b>&lt;</b>, <b>&gt;</b> or <b>=</b>:', tpl: c.tpl, blanks: c.blanks, hint: 'Compare the tens first (these are 2-digit numbers).', explain: '56 < 65; 100 = 100.' }, 11, 2, B));
    return q;
  }

  const PAPERS = [
    { id: 'A', title: 'Paper A', sub: 'Questions 1 to 20', make: paperA },
    { id: 'B', title: 'Paper B', sub: 'Questions 16 to 20', make: paperB },
    { id: 'C', title: 'Paper C', sub: 'Questions 1 to 11, Sections A and B', make: paperC }
  ];

  const marksOf = (r) => (r.q.marks || 1);
  function scoreOf(results) {
    let got = 0, total = 0;
    results.forEach(r => { total += marksOf(r); if (r.ok) got += marksOf(r); });
    return { got: got, total: total };
  }
  function verdict(pct) {
    return pct >= 90 ? ['🌟', 'Superstar!', 'You are ready for the exam!']
      : pct >= 70 ? ['😊', 'Great job!', 'A little more practice on the tricky ones and you are set.']
        : pct >= 50 ? ['💪', 'Good start!', 'Look at the answers below, then practise those topics.']
          : ['🌱', 'Keep growing!', 'Go through the lessons once more. They will really help.'];
  }

  const E = (MB.Exam = { PAPERS: PAPERS });
  const subj = () => MB.subjectOf(MB.S.subject);
  /* worksheets/papers for a subject. EVS papers are registered by evs-papers.js */
  E.papersFor = function (subject) { return subject === 'evs' ? (MB.evsPapers || []) : PAPERS; };
  const findPaper = (id) => PAPERS.concat(MB.evsPapers || []).filter(x => x.id === id)[0];

  /* ----- worksheets hub ----- */
  E.papers = function (root) {
    const s = subj(), list = E.papersFor(s.id);
    const intro = s.id === 'evs'
      ? 'The <b>Notebook</b> sets are the questions your teacher has already marked. The <b>Book</b> sets are the Discuss, Write and Find out questions from your textbook. <b>Say or write your own answer first</b>, then check yourself.'
      : 'These are the questions from your own papers. Try each one before you look at the hint. You get two tries on every question.';
    root.innerHTML = `<section class="card pad"><h2 class="h2">${s.papers.emoji} ${s.papers.title}</h2><p>${intro}</p></section>
      <div class="stack">${list.map(p => {
        const best = MB.S.papers[p.id];
        return `<button type="button" class="card link paper" data-go="paper/${p.id}"><span class="pp-t"><b>${p.title}</b><small>${p.sub}</small></span>
          <span class="badge${best ? ' on' : ''}">${best ? 'Best ' + best.got + '/' + best.total : 'Not tried'}</span></button>`;
      }).join('')}</div>`;
  };

  /* ----- one worksheet ----- */
  E.paper = function (root, id) {
    const p = findPaper(id);
    if (!p) { MB.go('papers'); return; }
    const qs = p.make();
    root.innerHTML = `<section class="card pad"><h2 class="h2">${p.title}</h2><p>${p.sub}. ${qs.length} questions. Take your time and read each question twice.</p>
      <button type="button" class="btn" data-a="start">Start the paper ▶</button></section><div id="quizhost"></div>`;
    $('[data-a=start]', root).addEventListener('click', function () {
      $('.card.pad', root).hidden = true;
      Q.run($('#quizhost', root), qs, {
        mode: 'paper', onDone: function (results) {
          const sc = scoreOf(results), best = MB.S.papers[id];
          if (!best || sc.got > best.got) { MB.S.papers[id] = sc; MB.save(); }
          const pct = Math.round(100 * sc.got / sc.total), v = verdict(pct), wrong = results.filter(r => !r.ok);
          if (pct >= 80) { MB.sfx.win(); MB.confetti(); } else MB.sfx.ok();
          $('#quizhost', root).innerHTML = `<section class="card pad result"><div class="big-emoji" aria-hidden="true">${v[0]}</div><h2 class="h2">${v[1]}</h2>
            <p class="score"><b>${sc.got}</b> out of <b>${sc.total}</b> ${qs.some(q => q.marks) ? 'marks' : 'questions'}</p><p>${v[2]}</p>
            <div class="row"><button type="button" class="btn" data-go="paper/${id}">Do it again ↻</button><button type="button" class="btn ghost" data-go="papers">All papers</button></div></section>
            ${wrong.length ? `<section class="card pad"><h3 class="h3">Let’s look at the ones to learn from</h3>${Q.reviewHTML(wrong)}</section>` : '<section class="card pad"><p>🎉 Every question was right. Wonderful!</p></section>'}`;
        }
      });
    });
  };

  /* ----- mock test ----- */
  E.mockCount = function (subject) { return MB.topicsOf(subject).reduce((n, t) => n + t.mock, 0); };
  E.buildMock = function (subject) {
    subject = subject || MB.S.subject;
    const qs = [];
    MB.topicsOf(subject).forEach(t => {
      /* topics with a question bank get a balanced mix; the maths topics sample their 8-question set */
      const pick = t.bank ? MB.G.pickMix(t.bank(), t.mock) : MB.sample(t.gen(), t.mock);
      pick.forEach(q => { q.topic = t.id; q.marks = 1; qs.push(q); });
    });
    return qs;
  };
  E.mock = function (root) {
    const s = subj(), m = MB.mockRec(s.id), n = E.mockCount(s.id);
    root.innerHTML = `<section class="card pad"><h2 class="h2">🎯 Mock test</h2>
      <p>A pretend exam with <b>${n} questions</b> from ${s.id === 'evs' ? 'all three chapters' : 'every topic'}. Just like the real thing:</p>
      <ul class="ticks"><li>No hints and only <b>one try</b> for each question.</li><li>You find out your score at the end.</li><li>You can skip a question if you are stuck.</li>${s.id === 'evs' ? '<li>For short-answer questions, you mark yourself with the model answer.</li>' : ''}</ul>
      ${m.runs ? `<p class="note">Your best so far: <b>${m.best}/${m.total}</b> (${m.runs} ${m.runs === 1 ? 'try' : 'tries'})</p>` : ''}
      <button type="button" class="btn big" data-a="start">I’m ready! Start ▶</button></section><div id="quizhost"></div>`;
    $('[data-a=start]', root).addEventListener('click', function () {
      const qs = E.buildMock(s.id);
      $('.card.pad', root).hidden = true;
      Q.run($('#quizhost', root), qs, { mode: 'mock', onDone: results => mockDone(root, results, s.id) });
    });
  };
  function mockDone(root, results, subject) {
    const sc = scoreOf(results), pct = Math.round(100 * sc.got / sc.total), v = verdict(pct), m = MB.mockRec(subject);
    m.runs = (m.runs || 0) + 1;
    if (sc.got >= (m.best || 0) || !m.total) { m.best = sc.got; m.total = sc.total; }
    MB.save();
    if (pct >= 80) { MB.sfx.win(); MB.confetti(); } else MB.sfx.ok();
    const by = {};
    results.forEach(r => { const t = r.q.topic; by[t] = by[t] || { got: 0, n: 0 }; by[t].n++; if (r.ok) by[t].got++; });
    const wrong = results.filter(r => !r.ok);
    const rows = MB.topicsOf(subject).map(t => {
      const x = by[t.id]; if (!x) return '';
      const full = x.got === x.n;
      return `<li class="${full ? 'ok' : 'no'}"><span>${t.emoji} ${t.title}</span><b>${x.got}/${x.n}</b>${full ? '<span class="ok-tick">✓</span>' : `<button type="button" class="chip" data-go="t/${t.id}">Review</button>`}</li>`;
    }).join('');
    $('#quizhost', root).innerHTML = `<section class="card pad result"><div class="big-emoji" aria-hidden="true">${v[0]}</div><h2 class="h2">${v[1]}</h2>
      <p class="score"><b>${sc.got}</b> out of <b>${sc.total}</b> (${pct}%)</p><p>${v[2]}</p>
      <div class="meter" role="img" aria-label="${pct} percent"><span style="width:${pct}%"></span></div></section>
      <section class="card pad"><h3 class="h3">How did each ${subject === 'evs' ? 'chapter' : 'topic'} go?</h3><ul class="bytopic">${rows}</ul></section>
      ${wrong.length ? `<section class="card pad"><h3 class="h3">Questions to learn from</h3>${Q.reviewHTML(wrong)}
        <button type="button" class="btn" data-a="fix">Practise these again</button></section>` : '<section class="card pad"><p>🎉 Every question was right. Wonderful!</p></section>'}
      <div class="row"><button type="button" class="btn ghost" data-go="mock">Take a new mock test ↻</button></div>`;
    const fix = $('[data-a=fix]', root);
    if (fix) fix.addEventListener('click', function () {
      const redo = wrong.map(r => r.q);
      Q.run($('#quizhost', root), redo, {
        mode: 'practice', onDone: res => {
          const ok = res.filter(r => r.ok).length;
          if (ok === res.length) { MB.sfx.win(); MB.confetti(); }
          $('#quizhost', root).innerHTML = `<section class="card pad result"><div class="big-emoji" aria-hidden="true">${ok === res.length ? '🎉' : '💪'}</div>
            <h2 class="h2">${ok} of ${res.length} fixed!</h2><p>${ok === res.length ? 'You corrected every mistake. That is how we get better!' : 'Nice try. Look at the answers again, then take another mock test.'}</p>
            <div class="row"><button type="button" class="btn" data-go="mock">New mock test</button><button type="button" class="btn ghost" data-go="home">Home</button></div></section>`;
        }
      });
    });
  }
})();
