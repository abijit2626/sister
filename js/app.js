/* Maths Buddy - app shell: routing, home screen, topic pages, cheat sheet */
(function () {
  'use strict';
  const MB = window.MB, $ = MB.$, V = MB.V;
  const view = $('#view'), titleEl = $('#title'), backBtn = $('#back'), starsEl = $('#stars'), soundBtn = $('#sound');
  const MINUS = '\u2212';
  const topicById = (id) => MB.topics.filter(t => t.id === id)[0];
  const starsHTML = (n) => '<span class="stars" role="img" aria-label="' + n + ' of 3 stars">' + [1, 2, 3].map(i => `<span class="${i <= n ? 'on' : ''}">★</span>`).join('') + '</span>';

  /* ---------- routing (works from file://, inside frames, and with the back button) ---------- */
  MB.route = 'home';
  MB.go = function (path) {
    MB.route = path || 'home';
    try { if (location.hash.slice(1) !== MB.route) location.hash = MB.route; } catch (e) { /* hash may be blocked */ }
    render();
  };
  window.addEventListener('hashchange', () => {
    const h = (location.hash || '').slice(1);
    if (h && h !== MB.route) { MB.route = h; render(); }
  });
  function parentOf(route) {
    const p = route.split('/');
    if (p[0] === 't' && p[2]) return 't/' + p[1];
    if (p[0] === 'paper') return 'papers';
    return 'home';
  }

  /* ---------- global clicks: navigation, read-aloud, sound toggle ---------- */
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g && !g.disabled) { MB.sfx.tap(); MB.go(g.dataset.go); return; }
    const s = e.target.closest('[data-say]');
    if (s) { MB.speak(s.dataset.say); }
  });
  backBtn.addEventListener('click', () => MB.go(parentOf(MB.route)));
  function paintSound() { soundBtn.textContent = MB.S.sound ? '🔊' : '🔇'; soundBtn.setAttribute('aria-pressed', String(MB.S.sound)); }
  soundBtn.addEventListener('click', () => { MB.S.sound = !MB.S.sound; MB.save(); paintSound(); if (MB.S.sound) MB.sfx.ok(); });

  /* ---------- page chrome ---------- */
  function chrome(title) {
    const home = MB.route === 'home';
    backBtn.hidden = home;
    starsEl.textContent = '⭐ ' + MB.totalStars();
    const key = MB.route.split('/')[0];
    const active = key === 'paper' ? 'papers' : (key === 'mock' || key === 'papers' || key === 'cheat') ? key : 'home';
    document.querySelectorAll('.bottom [data-go]').forEach(b => { const on = b.dataset.go === active; b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    document.title = (home ? 'Maths Buddy' : title + ' · Maths Buddy');
  }

  function render() {
    const p = MB.route.split('/');
    window.scrollTo(0, 0);
    view.className = 'app';
    switch (p[0]) {
      case 't': { const t = topicById(p[1]); if (!t) { MB.go('home'); return; } chrome(t.title); topicView(t, p[2]); break; }
      case 'mock': chrome('Mock Test'); MB.Exam.mock(view); break;
      case 'papers': chrome('Your Worksheets'); MB.Exam.papers(view); break;
      case 'paper': chrome('Paper ' + (p[1] || '')); MB.Exam.paper(view, p[1]); break;
      case 'cheat': chrome('Quick Revision'); cheatView(); break;
      default: MB.route = 'home'; chrome('Maths Buddy'); homeView();
    }
  }

  /* ---------- home ---------- */
  function nextUp() {
    const first0 = MB.topics.filter(t => MB.getStars(t.id) === 0)[0];
    if (first0) return { go: 't/' + first0.id, label: (MB.totalStars() ? 'Next: ' : 'Start: ') + first0.title, say: MB.totalStars() ? 'Let’s keep going!' : 'Let’s learn it together. We will start with the first topic.' };
    const first1 = MB.topics.filter(t => MB.getStars(t.id) < 3)[0];
    if (first1) return { go: 't/' + first1.id + '/practice', label: 'Practise: ' + first1.title, say: 'You have tried every topic! Let’s win more stars.' };
    return { go: 'mock', label: 'Take the mock test', say: 'Three stars everywhere! You are ready for the mock test.' };
  }
  function countdown() {
    const d = MB.daysToExam(), day = MB.config.examDayName;
    if (d > 1) return `<span class="datechip">📅 ${d} days to go until ${day}</span>`;
    if (d === 1) return `<span class="datechip">📅 The exam is tomorrow. You can do it!</span>`;
    if (d === 0) return `<span class="datechip">🍀 Exam day! Take a deep breath. You are ready.</span>`;
    return '';
  }
  function topicCard(t) {
    const st = MB.getStars(t.id);
    return `<button type="button" class="card tcard ${t.tc}" data-go="t/${t.id}">
      <span class="ti" aria-hidden="true">${t.emoji}</span><span class="tt">${t.title}</span><span class="tb">${t.blurb}</span>
      <span class="tstat">${MB.S.seen[t.id] ? starsHTML(st) : '<span class="newtag">New</span>'}</span></button>`;
  }
  function homeView() {
    const nu = nextUp(), name = MB.S.name, tot = MB.topics.length * 3, got = MB.totalStars();
    const hello = name
      ? `<h2 class="h2">Hi ${MB.esc(name)}!</h2><p>${nu.say}</p>`
      : `<h2 class="h2">Hi there!</h2><p>I am Ollie the owl. I will help you get ready for your maths exam.</p>
         <form class="nameform" id="nameform"><label for="nm">What is your name?</label><div class="row"><input id="nm" name="nm" type="text" maxlength="20" autocomplete="given-name" placeholder="Type your name"><button class="btn small" type="submit">That’s me</button></div></form>`;
    view.innerHTML = `
      <section class="card hero"><div class="owl" aria-hidden="true">🦉</div>
        <div class="hero-b">${hello}${countdown()}<button type="button" class="btn big" data-go="${nu.go}">${nu.label} ▶</button></div></section>
      <div class="progress" role="img" aria-label="${got} of ${tot} stars"><span class="pbar"><span style="width:${Math.round(100 * got / tot)}%"></span></span><b>⭐ ${got} / ${tot}</b></div>
      <h2 class="sec">Learn and practise</h2>
      <div class="grid">${MB.topics.map(topicCard).join('')}</div>
      <h2 class="sec">Get ready for the exam</h2>
      <div class="grid three">
        <button type="button" class="card tcard tc-exam" data-go="mock"><span class="ti" aria-hidden="true">🎯</span><span class="tt">Mock Test</span><span class="tb">20 questions, like the real exam</span><span class="tstat">${MB.S.mock.runs ? `<span class="badge on">Best ${MB.S.mock.best}/${MB.S.mock.total}</span>` : '<span class="newtag">Try it</span>'}</span></button>
        <button type="button" class="card tcard tc-exam" data-go="papers"><span class="ti" aria-hidden="true">📝</span><span class="tt">Your Worksheets</span><span class="tb">The questions from your papers</span><span class="tstat">${Object.keys(MB.S.papers).length}/3 done</span></button>
        <button type="button" class="card tcard tc-exam" data-go="cheat"><span class="ti" aria-hidden="true">📒</span><span class="tt">Quick Revision</span><span class="tb">One page of everything to remember</span><span class="tstat"><span class="newtag">Read me</span></span></button>
      </div>
      <p class="foot"><button type="button" class="linkbtn" id="reset">Reset my stars and scores</button></p>`;
    const f = $('#nameform');
    if (f) f.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = $('#nm').value.trim();
      if (v) { MB.S.name = v; MB.save(); MB.sfx.ok(); render(); }
    });
    const r = $('#reset'); let armed = false;
    r.addEventListener('click', () => {
      if (!armed) { armed = true; r.textContent = 'Tap again to erase all stars and scores'; r.classList.add('warn'); return; }
      MB.S.stars = {}; MB.S.seen = {}; MB.S.papers = {}; MB.S.mock = { best: 0, total: 0, runs: 0 }; MB.save(); render();
    });
  }

  /* ---------- a topic: Learn / Practice tabs ---------- */
  function topicView(t, tab) {
    const practice = tab === 'practice', st = MB.getStars(t.id);
    view.innerHTML = `<div class="${t.tc}">
      <div class="thead"><span class="ti" aria-hidden="true">${t.emoji}</span><div><h2 class="h2">${t.title}</h2><p>${t.blurb}</p></div></div>
      <div class="tabs" role="tablist">
        <button type="button" role="tab" aria-selected="${!practice}" data-go="t/${t.id}">📖 Learn</button>
        <button type="button" role="tab" aria-selected="${practice}" data-go="t/${t.id}/practice">✏️ Practise ${starsHTML(st)}</button>
      </div><div id="tbody"></div></div>`;
    const body = $('#tbody');
    if (practice) practiceIntro(t, body);
    else {
      if (!MB.S.seen[t.id]) { MB.S.seen[t.id] = true; MB.save(); }
      t.learn(body);
      body.insertAdjacentHTML('beforeend', `<section class="card pad cta"><h3 class="h3">Ready to practise?</h3><p>8 questions with hints. Win up to 3 stars!</p><button type="button" class="btn big" data-go="t/${t.id}/practice">Let’s practise ▶</button></section>`);
    }
  }
  function practiceIntro(t, body) {
    const st = MB.getStars(t.id);
    body.innerHTML = `<section class="card pad"><h3 class="h3">Practice time</h3>
      <ul class="ticks"><li><b>8 questions</b> about ${t.title.toLowerCase()}.</li><li>You get <b>two tries</b> on each one.</li><li>Tap <b>💡 Hint</b> if you are stuck.</li></ul>
      <p class="note">Your best: ${starsHTML(st)}</p><button type="button" class="btn big" id="go">Start ▶</button></section>`;
    $('#go', body).addEventListener('click', () => runPractice(t, body));
  }
  function runPractice(t, body) {
    const qs = t.gen();
    qs.forEach(q => { q.topic = t.id; });
    MB.Quiz.run(body, qs, { mode: 'practice', tc: t.tc, onDone: (res) => practiceDone(t, res, body) });
  }
  function practiceDone(t, res, body) {
    const total = res.length, first = res.filter(r => r.ok && r.tries === 1).length, got = res.filter(r => r.ok).length;
    const ratio = (first + 0.5 * (got - first)) / total;
    const stars = ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.35 ? 1 : 0;
    const prev = MB.getStars(t.id); MB.addStars(t.id, stars);
    starsEl.textContent = '⭐ ' + MB.totalStars();
    const msg = stars === 3 ? ['🌟', 'Superstar!', 'You really know this topic.']
      : stars === 2 ? ['😊', 'Well done!', 'Practise once more for the third star.']
        : stars === 1 ? ['💪', 'Good try!', 'Read the lesson again, then practise once more.']
          : ['🌱', 'Keep going!', 'Look at the lesson again. It will help you a lot.'];
    if (stars === 3) { MB.sfx.win(); MB.confetti(); } else MB.sfx.ok();
    const idx = MB.topics.indexOf(t), nxt = MB.topics[idx + 1];
    const wrong = res.filter(r => !r.ok);
    body.innerHTML = `<section class="card pad result"><div class="big-emoji" aria-hidden="true">${msg[0]}</div><h2 class="h2">${msg[1]}</h2>
      <div class="bigstars">${starsHTML(stars)}</div>
      <p class="score">You got <b>${got}</b> out of <b>${total}</b> right${first ? ` (<b>${first}</b> on the first try)` : ''}.</p>
      <p>${msg[2]}${stars > prev && prev > 0 ? ' <b>New best!</b>' : ''}</p>
      <div class="row"><button type="button" class="btn" id="again">Practise again ↻</button><button type="button" class="btn ghost" data-go="t/${t.id}">Read the lesson</button>${nxt ? `<button type="button" class="btn ghost" data-go="t/${nxt.id}">Next: ${nxt.title} ▶</button>` : '<button type="button" class="btn ghost" data-go="mock">Try the mock test</button>'}</div></section>
      ${wrong.length ? `<section class="card pad"><h3 class="h3">Let’s look at these again</h3>${MB.Quiz.reviewHTML(wrong)}</section>` : ''}`;
    $('#again', body).addEventListener('click', () => runPractice(t, body));
    window.scrollTo(0, 0);
  }

  /* ---------- quick revision (cheat sheet) ---------- */
  function cheatView() {
    const card = (t, c, body) => `<section class="card pad cheat ${c}"><h3 class="h3">${t}</h3>${body}</section>`;
    view.innerHTML = `<section class="card pad"><h2 class="h2">📒 Quick revision</h2><p>Everything for Monday on one page. Read it slowly, one card at a time.</p></section>` +
      card('🔤 Number names', 'tc-names', `<ul class="ticks"><li><b>Hundreds + “hundred” + “and” + tens-ones</b></li><li>145 = <b>one hundred and forty-five</b></li><li>150 = one hundred and fifty · 200 = two hundred</li><li>Tens and ones get a <b>hyphen</b>: thirty-six, eighty-four</li><li>Spelling: <b>forty</b> (no u) · fifty · eighty · ninety · fifteen · eighteen</li></ul>`) +
      card('🧱 Place value and expanded form', 'tc-place', `<ul class="ticks"><li>Places: <span class="dh">Hundreds</span> · <span class="dt">Tens</span> · <span class="do">Ones</span></li><li>In 274, the <b>7</b> is in the tens place. Its <b>place value is 70</b>.</li><li>Expanded form: 296 = <b>200 + 90 + 6</b></li><li>176 = 100 + 70 + 6</li><li>200 + 60 + 7 = <b>267</b></li></ul>`) +
      card('🧭 Before, after, between', 'tc-line', `<ul class="ticks"><li>Just <b>before</b> = 1 less → before 200 is <b>199</b></li><li>Just <b>after</b> = 1 more → after 199 is <b>200</b>, after 99 is <b>100</b></li><li><b>Between</b> 48 and 50 is <b>49</b></li></ul>`) +
      card('⚖️ Compare and order', 'tc-compare', `<ul class="ticks"><li>Compare from the <b>left</b>: hundreds, then tens, then ones.</li><li>The mouth <b>&lt;</b> <b>&gt;</b> opens to the <b>bigger</b> number. <b>=</b> means the same.</li><li>298 &gt; 289 · 145 &lt; 154 · 178 = 178</li><li><b>Ascending</b> = small to big · <b>Descending</b> = big to small</li><li>Smallest 3-digit number: <b>100</b> · Greatest: <b>999</b></li></ul>`) +
      card('🔁 Number patterns', 'tc-patterns', `<ul class="ticks"><li>Find the rule: <b>subtract two neighbours</b>.</li><li>100, 150, 200, <b>250, 300</b> (+50)</li><li>290, 285, 280, <b>275, 270</b> (${MINUS}5)</li><li>25, 35, 45, <b>55, 65</b> (+10)</li></ul>`) +
      card('➕ Add and subtract', 'tc-addsub', `<ul class="ticks"><li>Start with the <b>ones</b>, then tens, then hundreds.</li><li>Column is 10 or more? Write the ones digit and <b>carry 1</b>.</li><li>Top digit smaller? <b>Borrow</b> 1 from the next place.</li><li>126 + 143 = <b>269</b> · 285 ${MINUS} 132 = <b>153</b> · 25 + 15 = <b>40</b></li><li>Check: add and subtract are opposites.</li></ul>`) +
      card('📖 Story problems', 'tc-story', `<ul class="ticks"><li><b>Add:</b> altogether · in all · total · more</li><li><b>Subtract:</b> left · gave away · how many more</li><li>Write the <b>number sentence</b> and a <b>full-sentence answer</b>.</li></ul>`) +
      card('🔷 Flat shapes', 'tc-shapes2d', `<div class="tablewrap"><table class="ft"><thead><tr><th>Shape</th><th>Sides</th><th>Corners</th></tr></thead><tbody>${[['triangle', 3, 3], ['square', 4, 4], ['rectangle', 4, 4], ['circle', 0, 0]].map(r => `<tr><th><span class="ft-shape">${V.shape(r[0], 'mini')}</span><span>${V.SHAPES[r[0]].name}</span></th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div><p class="note">Circle objects: clock, coin, plate, wheel.</p>`) +
      card('📦 Solid shapes', 'tc-shapes3d', `<div class="tablewrap"><table class="ft t3"><thead><tr><th>3D Shape</th><th>Example</th></tr></thead><tbody>${[['cube', '🧊', 'Dice, Rubik’s cube'], ['cuboid', '📦', 'Book, brick, matchbox'], ['cone', '🍦', 'Ice-cream cone, party hat'], ['sphere', '⚽', 'Ball, orange, globe']].map(r => `<tr><th><span class="ft-shape">${V.solid(r[0])}</span><span>${V.SOLIDS[r[0]].name} ${r[1]}</span></th><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>`) +
      card('✅ On exam day', 'tc-exam', `<ul class="ticks"><li>Read every question <b>twice</b>.</li><li>Number names: hyphen, “and”, and spell <b>forty</b> with no “u”.</li><li>Do the ones column first when you add or subtract.</li><li>If you are stuck, move on and come back.</li><li>Check your answers at the end. You have got this! 🌟</li></ul>`);
  }

  /* ---------- go! ---------- */
  paintSound();
  const h0 = (location.hash || '').slice(1);
  MB.route = h0 || 'home';
  render();
})();
