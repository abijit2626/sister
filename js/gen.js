/* Maths Buddy - small helpers for building questions */
(function () {
  'use strict';
  var MB = window.MB, G = (MB.G = {});

  /* choice: `correct` and `wrongs` are html strings; they are shuffled together */
  G.choice = function (prompt, correct, wrongs, extra) {
    var opts = MB.shuffle([correct].concat(wrongs));
    return Object.assign({ kind: 'choice', prompt: prompt, options: opts, ans: opts.indexOf(correct) }, extra || {});
  };
  /* a single number answer */
  G.num = function (prompt, ans, extra) {
    return Object.assign({ kind: 'fill', prompt: prompt, blanks: [{ kind: 'num', ans: ans, w: String(ans).length }] }, extra || {});
  };
  /* sequence with blanks. values = full list, blankAt = indexes that become inputs (in order) */
  G.seq = function (prompt, values, blankAt, extra) {
    var blanks = [], parts = values.map(function (v, k) {
      var at = blankAt.indexOf(k);
      if (at < 0) return '<span class="sv">' + v + '</span>';
      blanks.push({ kind: 'num', ans: v, w: String(v).length });
      return '{' + (blanks.length - 1) + '}';
    });
    return Object.assign({ kind: 'fill', prompt: prompt, blanks: blanks, tpl: '<div class="seq">' + parts.join('<span class="sc">,</span> ') + '</div>' }, extra || {});
  };
  /* find a pair (a,b) satisfying test; tries random numbers in the given ranges */
  G.pair = function (r1, r2, test) {
    for (var k = 0; k < 8000; k++) {
      var a = MB.rand(r1[0], r1[1]), b = MB.rand(r2[0], r2[1]);
      if (test(a, b)) return [a, b];
    }
    return [r1[0], r2[0]];
  };
  /* n distinct values from a list */
  G.some = function (list, n) { return MB.sample(list, n); };
  /* a 3-digit number with three different non-zero digits */
  G.distinct3 = function () {
    for (var k = 0; k < 500; k++) {
      var n = MB.rand(123, 987), d = MB.digits(n);
      if (d[0] && d[1] && d[2] && d[0] !== d[1] && d[1] !== d[2] && d[0] !== d[2]) return n;
    }
    return 274;
  };
  G.fmt = function (n) { return '<b>' + n + '</b>'; };

  /* ---- helpers for text subjects (EVS) ---- */
  G.tf = function (prompt, truth, extra) {
    return Object.assign({ kind: 'choice', prompt: prompt, options: ['True', 'False'], ans: truth ? 0 : 1, cols: 2, big: true }, extra || {});
  };
  /* fill in one or more accepted words. ans may be a string or an array of accepted spellings */
  G.word = function (prompt, ans, extra) {
    var a = [].concat(ans);
    return Object.assign({ kind: 'fill', prompt: prompt, blanks: [{ kind: 'text', ans: a, w: Math.max(8, a[0].length) }] }, extra || {});
  };
  /* match pairs: pairs = [[leftHtml, rightHtml], ...] */
  G.match = function (prompt, pairs, extra) {
    var left = pairs.map(function (p, i) { return { id: 'm' + i, html: p[0] }; });
    var right = MB.shuffle(pairs.map(function (p, i) { return { id: 'm' + i, html: p[1] }; }));
    return Object.assign({ kind: 'match', prompt: prompt, left: left, right: right }, extra || {});
  };
  /* sort items into groups: cats = [{id,label}], items = [[html, catId], ...] */
  G.sort = function (prompt, cats, items, extra) {
    return Object.assign({
      kind: 'sort', prompt: prompt, cats: cats,
      items: items.map(function (it, i) { return { id: 's' + i, html: it[0], cat: it[1] }; })
    }, extra || {});
  };
  /* put steps in the order they happen. seq is the correct order */
  G.order = function (prompt, seq, extra) {
    var items = MB.shuffle(seq), n = 0;
    while (items.every(function (x, i) { return x === seq[i]; }) && n++ < 20) items = MB.shuffle(seq);
    return Object.assign({ kind: 'order', prompt: prompt, seq: seq, items: items }, extra || {});
  };
  /* short answer you check yourself against a model answer */
  G.self = function (prompt, model, extra) {
    return Object.assign({ kind: 'self', prompt: prompt, model: model, single: true, hint: 'Think about the lesson, then compare with the model answer.' }, extra || {});
  };
  /* choose n questions with a good mix: mostly objective, up to 2 interactive, 1 short answer last */
  G.pickMix = function (bank, n) {
    var obj = [], inter = [], self = [];
    MB.shuffle(bank).forEach(function (q) {
      (q.kind === 'self' ? self : (q.kind === 'match' || q.kind === 'sort' || q.kind === 'order' || q.kind === 'pick') ? inter : obj).push(q);
    });
    var nSelf = n >= 5 && self.length ? 1 : 0, nInter = Math.min(inter.length, n >= 6 ? 2 : (n >= 3 ? 1 : 0));
    var out = obj.slice(0, n - nSelf - nInter);
    var rest = obj.slice(out.length).concat(inter.slice(nInter), self.slice(nSelf));
    out = out.concat(inter.slice(0, nInter));
    while (out.length < n - nSelf && rest.length) out.push(rest.shift());
    return out.concat(self.slice(0, nSelf));
  };
  G.minus = '−';
})();
