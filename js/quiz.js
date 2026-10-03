/* Maths Buddy - question engine.
   Question kinds:
     choice  {options:[html], ans:index}
     fill    {blanks:[{ans, kind:'num'|'text'|'sym', nameOf?, w?}], tpl?}   ({0} {1} in tpl become inputs)
     order   {items:[numbers], dir:'asc'|'desc'}
     pick    {items:[{id, html}], need:n, good:[ids]}
   Common: prompt, vis, hint, explain, marks, section, no                                           */
(function () {
  'use strict';
  var MB = window.MB, Q = (MB.Quiz = {});

  function strip(h) { var d = document.createElement('div'); d.innerHTML = h; return (d.textContent || '').trim(); }
  function sortedItems(q) {
    return q.items.slice().sort(function (a, b) { return q.dir === 'desc' ? b - a : a - b; });
  }

  /* ---------- order widget (also used by the "Compare & Order" lesson) ---------- */
  MB.UI.order = function (box, items, dir, onChange) {
    var slots = [], locked = false, pool = MB.shuffle(items.map(function (_, i) { return i; }));
    function render(shake) {
      var s = '<p class="ord-help">Tap the numbers in order: <b>' + (dir === 'desc' ? 'biggest first' : 'smallest first') + '</b></p>';
      s += '<div class="ord-slots' + (shake ? ' shake' : '') + '">';
      for (var i = 0; i < items.length; i++) {
        if (i) s += '<span class="ord-arr" aria-hidden="true">›</span>';
        s += slots[i] !== undefined
          ? '<button type="button" class="tile placed" data-s="' + i + '"' + (locked ? ' disabled' : '') + '>' + items[slots[i]] + '</button>'
          : '<span class="slot">' + (i + 1) + '</span>';
      }
      s += '</div><div class="ord-pool">';
      pool.forEach(function (id) { s += '<button type="button" class="tile" data-p="' + id + '"' + (locked ? ' disabled' : '') + '>' + items[id] + '</button>'; });
      box.innerHTML = s + '</div>';
    }
    box.addEventListener('click', function (e) {
      if (locked) return;
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.p !== undefined) {
        var id = +b.dataset.p; pool.splice(pool.indexOf(id), 1); slots.push(id);
      } else if (b.dataset.s !== undefined) {
        pool.push(slots.splice(+b.dataset.s, 1)[0]);
      } else return;
      MB.sfx.tap(); render(); onChange && onChange();
    });
    render();
    return {
      get: function () { return slots.map(function (id) { return items[id]; }); },
      complete: function () { return slots.length === items.length; },
      wrong: function () { render(true); },
      lock: function () { locked = true; render(); },
      reveal: function () {
        var sorted = items.slice().sort(function (a, b) { return dir === 'desc' ? b - a : a - b; }), used = {};
        slots = sorted.map(function (v) {
          for (var i = 0; i < items.length; i++) if (!used[i] && items[i] === v) { used[i] = 1; return i; }
        });
        pool = []; render();
      }
    };
  };

  /* ---------- checking ---------- */
  function blankOk(b, v) {
    v = (v || '').trim(); if (!v) return false;
    if (b.kind === 'num') { var c = v.replace(/[,\s]/g, ''); return /^\d+$/.test(c) && parseInt(c, 10) === Number(b.ans); }
    if (b.kind === 'sym') return v === b.ans;
    if (b.nameOf !== undefined) return MB.nameOk(v, b.nameOf);
    var g = MB.norm(v).replace(/^(a|an|the) /, '');
    return [].concat(b.ans).some(function (a) { return MB.norm(a) === g; });
  }
  function isCorrect(q, val) {
    if (q.kind === 'choice') return val === q.ans;
    if (q.kind === 'fill') return q.blanks.every(function (b, k) { return blankOk(b, val[k]); });
    if (q.kind === 'order') {
      var s = sortedItems(q); return val.length === s.length && val.every(function (v, k) { return v === s[k]; });
    }
    if (q.kind === 'pick') return val.length === q.need && val.every(function (id) { return q.good.indexOf(id) >= 0; });
    return false;
  }
  function blankAnswer(b) { return b.nameOf !== undefined ? MB.words(b.nameOf) : (Array.isArray(b.ans) ? b.ans[0] : String(b.ans)); }

  Q.answerText = function (q) {
    if (q.show) return q.show;
    if (q.kind === 'choice') return q.optText ? q.optText[q.ans] : strip(q.options[q.ans]);
    if (q.kind === 'fill') return q.blanks.map(blankAnswer).join(', ');
    if (q.kind === 'order') return sortedItems(q).join(', ');
    if (q.kind === 'pick') return q.items.filter(function (i) { return q.good.indexOf(i.id) >= 0; }).slice(0, q.need).map(function (i) { return strip(i.html); }).join(' or ');
    return '';
  };
  Q.valText = function (q, val) {
    if (val === null || val === undefined) return 'skipped';
    if (q.kind === 'choice') return val >= 0 ? (q.optText ? q.optText[val] : strip(q.options[val])) : 'skipped';
    if (q.kind === 'fill') return val.map(function (v) { return v || '–'; }).join(', ');
    if (q.kind === 'order') return val.join(', ') || 'skipped';
    if (q.kind === 'pick') return q.items.filter(function (i) { return val.indexOf(i.id) >= 0; }).map(function (i) { return strip(i.html); }).join(', ') || 'skipped';
    return '';
  };
  Q.promptText = function (q) {
    return q.prompt + (q.tpl ? ' <span class="rv-tpl">' + q.tpl.replace(/\{\d+\}/g, '___') + '</span>' : '');
  };

  /* ---------- answer builders ---------- */
  function buildChoice(q, box, api) {
    var sel = -1, locked = false;
    box.innerHTML = '<div class="opts c' + (q.cols || 2) + (q.big ? ' big' : '') + '">' +
      q.options.map(function (o, k) { return '<button type="button" class="opt" data-k="' + k + '">' + o + '</button>'; }).join('') + '</div>';
    var btns = MB.$$('.opt', box);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.opt'); if (!b || b.disabled || locked) return;
      sel = +b.dataset.k; MB.sfx.tap();
      btns.forEach(function (x) { x.classList.toggle('sel', x === b); });
      api.change();
    });
    return {
      get: function () { return sel; }, complete: function () { return sel >= 0; },
      wrong: function () { var b = btns[sel]; if (b) { b.classList.remove('sel'); b.classList.add('bad'); b.disabled = true; } sel = -1; },
      lock: function (ok) { locked = true; btns.forEach(function (b) { if (b.classList.contains('sel')) b.classList.add(ok ? 'good' : 'bad'); b.disabled = true; }); },
      reveal: function () { btns[q.ans].classList.add('good'); }
    };
  }

  function buildFill(q, box, api) {
    var tpl = q.tpl || q.blanks.map(function (_, k) { return '{' + k + '}'; }).join(' '), locked = false;
    var html = tpl.replace(/\{(\d+)\}/g, function (m, k) {
      var b = q.blanks[+k], n = +k + 1;
      if (b.kind === 'sym') {
        return '<span class="sym" data-k="' + k + '" role="group" aria-label="Answer ' + n + '">' +
          ['<', '>', '='].map(function (c) { return '<button type="button" data-v="' + c + '" aria-label="' + (c === '<' ? 'less than' : c === '>' ? 'greater than' : 'equal to') + '">' + MB.esc(c) + '</button>'; }).join('') + '</span>';
      }
      if (b.kind === 'num') {
        return '<input class="blank num" data-k="' + k + '" name="ans' + k + '" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="Answer ' + n + '" style="width:' + ((b.w || 4) + 1.2) + 'ch">';
      }
      return '<input class="blank txt" data-k="' + k + '" name="ans' + k + '" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="off" aria-label="Answer ' + n + '" style="width:' + ((b.w || 14) + 1.2) + 'ch">';
    });
    box.innerHTML = '<div class="fill">' + html + '</div>';
    var vals = q.blanks.map(function () { return ''; });
    box.addEventListener('input', function (e) {
      var t = e.target; if (!t.classList.contains('blank')) return;
      vals[+t.dataset.k] = t.value; t.classList.remove('bad'); api.change();
    });
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.sym button'); if (!b || locked) return;
      var wrap = b.parentNode, k = +wrap.dataset.k; vals[k] = b.dataset.v; MB.sfx.tap();
      MB.$$('button', wrap).forEach(function (x) { x.classList.toggle('sel', x === b); x.classList.remove('bad'); });
      api.change();
    });
    box.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('blank')) { e.preventDefault(); api.submit(); } });
    function el(k) { return box.querySelector('.blank[data-k="' + k + '"], .sym[data-k="' + k + '"]'); }
    setTimeout(function () { var f = box.querySelector('.blank'); if (f && !('ontouchstart' in window)) f.focus(); }, 30);
    return {
      get: function () { return vals.slice(); },
      complete: function () { return vals.every(function (v) { return v.trim() !== ''; }); },
      wrong: function () {
        q.blanks.forEach(function (b, k) {
          if (blankOk(b, vals[k])) return;
          var e = el(k); if (!e) return;
          if (e.classList.contains('sym')) MB.$$('button.sel', e).forEach(function (x) { x.classList.add('bad'); });
          else e.classList.add('bad');
        });
      },
      lock: function (ok) {
        locked = true;
        MB.$$('.blank', box).forEach(function (i) { i.readOnly = true; if (ok) i.classList.add('good'); });
        if (ok) MB.$$('.sym button.sel', box).forEach(function (x) { x.classList.add('good'); });
      },
      reveal: function () {
        q.blanks.forEach(function (b, k) {
          var e = el(k); if (!e || blankOk(b, vals[k])) return;
          if (e.classList.contains('sym')) {
            MB.$$('button', e).forEach(function (x) { x.classList.remove('sel', 'bad'); if (x.dataset.v === b.ans) x.classList.add('good'); });
          } else { e.value = blankAnswer(b); e.classList.remove('bad'); e.classList.add('revealed'); }
        });
      }
    };
  }

  function buildPick(q, box, api) {
    var sel = [], locked = false;
    box.innerHTML = '<p class="ord-help">Tap <b>' + q.need + '</b> ' + (q.need === 1 ? 'picture' : 'pictures') + '.</p><div class="pickgrid">' +
      q.items.map(function (it) { return '<button type="button" class="pick" data-id="' + it.id + '">' + it.html + '</button>'; }).join('') + '</div>';
    var btns = MB.$$('.pick', box);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.pick'); if (!b || locked) return;
      var id = b.dataset.id, at = sel.indexOf(id);
      if (at >= 0) sel.splice(at, 1); else { sel.push(id); if (sel.length > q.need) sel.shift(); }
      MB.sfx.tap();
      btns.forEach(function (x) { x.classList.toggle('sel', sel.indexOf(x.dataset.id) >= 0); });
      api.change();
    });
    return {
      get: function () { return sel.slice(); }, complete: function () { return sel.length === q.need; },
      wrong: function () {
        btns.forEach(function (x) { if (sel.indexOf(x.dataset.id) >= 0 && q.good.indexOf(x.dataset.id) < 0) { x.classList.remove('sel'); x.classList.add('bad'); x.disabled = true; } });
        sel = sel.filter(function (id) { return q.good.indexOf(id) >= 0; });
      },
      lock: function (ok) { locked = true; btns.forEach(function (x) { x.disabled = true; if (ok && x.classList.contains('sel')) x.classList.add('good'); }); },
      reveal: function () {
        btns.forEach(function (x) { x.classList.remove('sel', 'bad'); if (q.good.indexOf(x.dataset.id) >= 0) x.classList.add('good'); });
      }
    };
  }

  function build(q, box, api) {
    if (q.kind === 'choice') return buildChoice(q, box, api);
    if (q.kind === 'fill') return buildFill(q, box, api);
    if (q.kind === 'pick') return buildPick(q, box, api);
    return MB.UI.order(box, q.items, q.dir, api.change);
  }

  /* ---------- the runner ---------- */
  var GOOD = ['Yes! Brilliant!', 'Super work!', 'You got it!', 'Perfect!', 'Awesome!', 'Correct, well done!', 'Great thinking!'];
  var RETRY = ['Not quite. Try again!', 'Almost! Have one more go.', 'Hmm, look again. You can do it!'];

  Q.run = function (root, qs, opts) {
    opts = opts || {};
    var mode = opts.mode || 'practice', maxTries = mode === 'mock' ? 1 : 2, i = 0, results = [];

    function show() {
      var q = qs[i], tries = 0, ctrl, hintOn = false;
      var dots = qs.map(function (_, k) {
        return '<span class="' + (k < i ? (results[k] && results[k].ok ? 'ok' : (mode === 'mock' ? 'seen' : 'no')) : k === i ? 'cur' : '') + '"></span>';
      }).join('');
      root.innerHTML =
        '<div class="quiz ' + (opts.tc || '') + '">' +
        '<div class="qprog" role="img" aria-label="Question ' + (i + 1) + ' of ' + qs.length + '">' + dots + '</div>' +
        (q.section && (i === 0 || qs[i - 1].section !== q.section) ? '<div class="qsec">' + q.section + '</div>' : '') +
        '<article class="card qcard">' +
        '<div class="qmeta"><span>' + (q.no ? 'Question ' + q.no : 'Question ' + (i + 1) + ' of ' + qs.length) + '</span>' +
        (q.marks ? '<span class="marks">' + q.marks + ' mark' + (q.marks > 1 ? 's' : '') + '</span>' : '') + '</div>' +
        '<div class="qprompt">' + q.prompt + '</div>' +
        (q.vis ? '<div class="qvis">' + q.vis + '</div>' : '') +
        '<div class="qans"></div>' +
        '<div class="qfeed" role="status" aria-live="polite"></div>' +
        '</article><div class="qbtns"></div></div>';
      var box = MB.$('.qans', root), feed = MB.$('.qfeed', root), btns = MB.$('.qbtns', root);
      btns.innerHTML =
        (mode !== 'mock' && q.hint ? '<button type="button" class="btn ghost" data-a="hint">💡 Hint</button>' : '') +
        (mode === 'mock' ? '<button type="button" class="btn ghost" data-a="skip">Skip</button>' : '') +
        '<button type="button" class="btn" data-a="check" disabled>' + (mode === 'mock' ? (i === qs.length - 1 ? 'Finish' : 'Next') : 'Check') + '</button>';
      var checkBtn = MB.$('[data-a=check]', btns);
      var api = {
        change: function () { checkBtn.disabled = !ctrl.complete(); },
        submit: function () { if (!checkBtn.disabled) check(); }
      };
      ctrl = build(q, box, api);
      try { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* ok */ }

      function setFeed(kind, icon, html) {
        feed.className = 'qfeed on ' + kind;
        feed.innerHTML = '<span class="fb-ic" aria-hidden="true">' + icon + '</span><div>' + html + '</div>';
      }
      function conclude(ok, val) {
        results.push({ q: q, ok: ok, tries: tries, val: val });
        var last = i === qs.length - 1;
        btns.innerHTML = '<button type="button" class="btn" data-a="next">' + (last ? 'See my score ✨' : 'Next →') + '</button>';
        var nb = MB.$('[data-a=next]', btns); if (nb) nb.focus({ preventScroll: true });
      }
      function advance() { i++; if (i < qs.length) show(); else if (opts.onDone) opts.onDone(results); }
      function check() {
        var val = ctrl.get(), ok = isCorrect(q, val); tries++;
        if (mode === 'mock') { results.push({ q: q, ok: ok, tries: 1, val: val }); advance(); return; }
        if (ok) {
          MB.sfx.ok(); ctrl.lock(true);
          setFeed('good', '🎉', '<b>' + MB.pick(GOOD) + '</b>' + (q.explain ? ' <span class="why">' + q.explain + '</span>' : ''));
          conclude(true, val);
        } else if (tries < maxTries) {
          MB.sfx.no(); ctrl.wrong(); checkBtn.disabled = true;
          var help = '';
          if (q.kind === 'fill') q.blanks.forEach(function (b, k) { if (!help && b.nameOf !== undefined && !blankOk(b, val[k])) help = MB.nameHelp(val[k]); });
          setFeed('retry', '🤔', '<b>' + MB.pick(RETRY) + '</b> ' + (help ? help + ' ' : '') + (q.hint ? '<span class="why">' + q.hint + '</span>' : ''));
        } else {
          MB.sfx.no(); ctrl.lock(false); ctrl.reveal();
          setFeed('reveal', '📘', '<b>That’s okay, we learn from this.</b> The answer is <b class="ans">' + Q.answerText(q) + '</b>.' + (q.explain ? ' <span class="why">' + q.explain + '</span>' : ''));
          conclude(false, val);
        }
      }
      btns.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b || b.disabled && b.dataset.a !== 'check') return;
        var a = b.dataset.a;
        if (a === 'check') check();
        else if (a === 'next') advance();
        else if (a === 'skip') { results.push({ q: q, ok: false, tries: 0, val: null }); advance(); }
        else if (a === 'hint') {
          hintOn = !hintOn;
          if (hintOn) setFeed('hint', '💡', q.hint); else { feed.className = 'qfeed'; feed.innerHTML = ''; }
        }
      });
    }
    show();
  };

  /* ---------- review list used on result screens ---------- */
  Q.reviewHTML = function (results) {
    return '<ol class="review">' + results.map(function (r) {
      return '<li class="' + (r.ok ? 'ok' : 'no') + '"><span class="rv-ic" aria-label="' + (r.ok ? 'correct' : 'not correct') + '">' + (r.ok ? '✓' : '✗') + '</span>' +
        '<div class="rv-b"><div class="rv-q">' + (r.q.no ? '<b>Q' + r.q.no + '.</b> ' : '') + Q.promptText(r.q) + '</div>' +
        (r.ok ? '' : '<div class="rv-a">Your answer: <span class="mine">' + MB.esc(Q.valText(r.q, r.val)) + '</span><br>Right answer: <b>' + Q.answerText(r.q) + '</b>' + (r.q.explain ? '<br><span class="why">' + r.q.explain + '</span>' : '') + '</div>') +
        '</div></li>';
    }).join('') + '</ol>';
  };
})();
