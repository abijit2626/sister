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
  G.minus = '−';
})();
