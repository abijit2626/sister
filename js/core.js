/* Maths Buddy - core helpers: storage, number words, sound, speech, confetti */
(function () {
  'use strict';
  var MB = (window.MB = { topics: [] });

  /* Subjects. examDate (YYYY-MM-DD) drives the countdown on the home screen; leave it null to hide it. */
  MB.SUBJECTS = [
    {
      id: 'maths', name: 'Maths', emoji: '\u2797', examDate: '2026-10-05', examDay: 'Monday',
      hello: 'I am Ollie the owl. I will help you get ready for your maths exam.',
      mock: '20 questions, like the real exam',
      papers: { label: 'Worksheets', title: 'Your Worksheets', blurb: 'The questions from your papers', emoji: '\uD83D\uDCDD' }
    },
    {
      id: 'evs', name: 'EVS', emoji: '\uD83C\uDF3F', examDate: null, examDay: '',
      hello: 'I am Ollie the owl. Let\u2019s explore the mela, plants and animals from your EVS book.',
      mock: '20 questions from all 3 chapters',
      papers: { label: 'Notebook', title: 'Notebook & Book Questions', blurb: 'Your notebook and textbook questions', emoji: '\uD83D\uDCD3' }
    }
  ];
  MB.subjectOf = function (id) { return MB.SUBJECTS.filter(function (s) { return s.id === id; })[0] || MB.SUBJECTS[0]; };
  MB.topicsOf = function (subject) { return MB.topics.filter(function (t) { return (t.subject || 'maths') === subject; }); };

  /* ---------- tiny helpers ---------- */
  MB.$ = function (s, r) { return (r || document).querySelector(s); };
  MB.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  MB.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  MB.rand = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  MB.pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  MB.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  MB.sample = function (a, n) { return MB.shuffle(a).slice(0, n); };
  MB.digits = function (n) { return [Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10]; };

  /* ---------- storage (localStorage, with an in-memory fallback) ---------- */
  var KEY = 'maths-buddy-v1';
  var mem = null;
  function load() {
    try { var raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : {}; }
    catch (e) { return mem || {}; }
  }
  MB.S = Object.assign({ name: '', stars: {}, seen: {}, mock: { best: 0, total: 0, runs: 0 }, papers: {}, sound: true, subject: 'maths' }, load());
  /* mock-test records are kept per subject (older saves only had the maths one) */
  MB.S.mocks = MB.S.mocks || { maths: MB.S.mock };
  MB.mockRec = function (subject) { return MB.S.mocks[subject] || (MB.S.mocks[subject] = { best: 0, total: 0, runs: 0 }); };
  MB.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(MB.S)); }
    catch (e) { mem = JSON.parse(JSON.stringify(MB.S)); }
  };
  MB.getStars = function (id) { return MB.S.stars[id] || 0; };
  MB.addStars = function (id, n) {
    if (n > MB.getStars(id)) { MB.S.stars[id] = n; MB.save(); }
  };
  MB.totalStars = function (subject) {
    var t = 0;
    for (var k in MB.S.stars) {
      var top = MB.topics.filter(function (x) { return x.id === k; })[0];
      if (!subject || ((top && top.subject) || 'maths') === subject) t += MB.S.stars[k];
    }
    return t;
  };

  /* ---------- number words ---------- */
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  MB.ONES = ONES; MB.TENS = TENS;

  function w99(n) {
    if (n < 20) return ONES[n];
    var t = Math.floor(n / 10), o = n % 10;
    return TENS[t] + (o ? '-' + ONES[o] : '');
  }
  /* 145 -> "one hundred and forty-five" (the "and" after hundred is how her paper writes it) */
  MB.words = function (n) {
    if (n < 100) return w99(n);
    var h = Math.floor(n / 100), r = n % 100;
    return ONES[h] + ' hundred' + (r ? ' and ' + w99(r) : '');
  };
  /* Pieces of a number name, for colouring: k = h (hundreds), and, t (tens), o (ones) */
  MB.wordChips = function (n) {
    var chips = [], h = Math.floor(n / 100), r = n % 100;
    if (!n) return [{ t: 'zero', k: 'o', v: 0 }];
    if (h) chips.push({ t: ONES[h] + ' hundred', k: 'h', v: h * 100 });
    if (h && r) chips.push({ t: 'and', k: 'and', v: 0 });
    if (r) {
      if (r < 20) chips.push({ t: ONES[r], k: r < 10 ? 'o' : 't', v: r });
      else {
        chips.push({ t: TENS[Math.floor(r / 10)], k: 't', v: Math.floor(r / 10) * 10 });
        if (r % 10) chips.push({ t: ONES[r % 10], k: 'o', v: r % 10, hy: true });
      }
    }
    return chips;
  };

  /* Lower-case, drop hyphens/punctuation, squash spaces */
  MB.norm = function (s) {
    return String(s).toLowerCase().replace(/[-–—_]/g, ' ').replace(/[^a-z0-9<>=\s]/g, '').replace(/\s+/g, ' ').trim();
  };
  /* Accepts "one hundred and forty-five", "one hundred forty five", etc. */
  MB.nameOk = function (given, n) {
    var g = MB.norm(given), w = MB.norm(MB.words(n));
    return g === w || g === w.replace(/ and /g, ' ');
  };
  function lev(a, b) {
    var m = [], i, j;
    for (i = 0; i <= a.length; i++) m[i] = [i];
    for (j = 0; j <= b.length; j++) m[0][j] = j;
    for (i = 1; i <= a.length; i++)
      for (j = 1; j <= b.length; j++)
        m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  }
  var DICT = ONES.concat(TENS.filter(Boolean), ['hundred', 'and']);
  /* Gentle spelling help for a wrong number name; '' when nothing to say */
  MB.nameHelp = function (given) {
    var toks = MB.norm(given).split(' ').filter(Boolean);
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (DICT.indexOf(t) >= 0) continue;
      if (t === 'fourty') return 'Careful: forty is spelled with no “u”.';
      var best = '', d = 9;
      DICT.forEach(function (w) { var x = lev(t, w); if (x < d) { d = x; best = w; } });
      if (d <= 2) return 'Check the spelling of “' + MB.esc(t) + '”. Did you mean “' + best + '”?';
      return '“' + MB.esc(t) + '” is not a number word. Check it again.';
    }
    return '';
  };

  /* ---------- sound effects (WebAudio, only after a tap) ---------- */
  var ac = null;
  function ctx() {
    if (!MB.S.sound) return null;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      return ac;
    } catch (e) { return null; }
  }
  function tone(f, at, dur, type, vol) {
    var c = ctx(); if (!c) return;
    try {
      var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + at;
      o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch (e) { /* audio is optional */ }
  }
  MB.sfx = {
    tap: function () { tone(660, 0, 0.06, 'triangle', 0.05); },
    ok: function () { tone(523, 0, 0.12); tone(659, 0.1, 0.12); tone(784, 0.2, 0.22); },
    no: function () { tone(220, 0, 0.18, 'triangle', 0.08); tone(175, 0.14, 0.24, 'triangle', 0.07); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.12, 0.28, 'triangle', 0.12); }); }
  };

  /* Read text aloud (browser voice). Used for number names. */
  MB.speak = function (text) {
    try {
      if (!('speechSynthesis' in window)) { MB.toast('Reading aloud is not available on this device.'); return; }
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85; u.lang = 'en-IN';
      window.speechSynthesis.speak(u);
    } catch (e) { /* optional */ }
  };

  /* ---------- confetti ---------- */
  MB.confetti = function () {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var c = document.createElement('canvas');
      c.className = 'confetti'; c.setAttribute('aria-hidden', 'true');
      document.body.appendChild(c);
      var g = c.getContext('2d'), W = (c.width = window.innerWidth), H = (c.height = window.innerHeight);
      var cols = ['#ff5d5d', '#ffb400', '#2fcf7f', '#4a7bff', '#b266ff', '#ff7ac2'], ps = [], i;
      for (i = 0; i < 150; i++) ps.push({
        x: Math.random() * W, y: -20 - Math.random() * H * 0.5, r: 4 + Math.random() * 6, c: cols[i % cols.length],
        vx: -2 + Math.random() * 4, vy: 2 + Math.random() * 4, rot: Math.random() * 6, vr: -0.2 + Math.random() * 0.4
      });
      var t0 = performance.now();
      (function frame(t) {
        g.clearRect(0, 0, W, H);
        ps.forEach(function (p) {
          p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.rot += p.vr;
          g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.c;
          g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); g.restore();
        });
        if (t - t0 < 2800) requestAnimationFrame(frame); else c.remove();
      })(t0);
    } catch (e) { /* decorative */ }
  };

  /* ---------- toast ---------- */
  var toastTimer = null;
  MB.toast = function (msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('on'); }, 2400);
  };

  /* ---------- exam countdown ---------- */
  MB.daysToExam = function (subject) {
    var d = MB.subjectOf(subject || MB.S.subject).examDate;
    if (!d) return null;
    var p = d.split('-').map(Number);
    var exam = new Date(p[0], p[1] - 1, p[2]);
    var now = new Date(); now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((exam - now) / 86400000);
  };

  /* ---------- small UI helpers shared by topics ---------- */
  MB.UI = {};
  MB.cheat = {};
  /* a card on the quick-revision page */
  MB.UI.cheatCard = function (title, tc, body) {
    return '<section class="card pad cheat ' + tc + '"><h3 class="h3">' + title + '</h3>' + body + '</section>';
  };
  /* Wrap a lesson step in a card */
  MB.UI.step = function (num, title, body) {
    return '<section class="card step"><h3><span class="stepno">' + num + '</span>' + title + '</h3>' + body + '</section>';
  };
  MB.UI.speakBtn = function (text, label) {
    return '<button type="button" class="spk" data-say="' + MB.esc(text) + '" aria-label="' + (label || 'Read aloud') + '">🔊</button>';
  };
  /* Digit coloured by place: 0=hundreds 1=tens 2=ones */
  MB.UI.dig = function (d, place) {
    return '<span class="d' + ['h', 't', 'o'][place] + '">' + d + '</span>';
  };
  MB.UI.colorNum = function (n) {
    var d = MB.digits(n), s = '';
    if (n >= 100) s += MB.UI.dig(d[0], 0);
    if (n >= 10) s += MB.UI.dig(d[1], 1);
    return s + MB.UI.dig(d[2], 2);
  };
})();
