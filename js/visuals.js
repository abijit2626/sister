/* Maths Buddy - reusable visuals (base-ten blocks, number lines, shapes, solids) */
(function () {
  'use strict';
  var MB = window.MB, V = (MB.V = {}), uid = 0;

  /* ---------- base-ten blocks ----------
     h flats (100), t rods (10), o cubes (1). fh/ft/fo = how many of each are crossed out. */
  function many(cls, n, faded) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<i class="' + cls + (i >= n - faded ? ' x' : '') + '"></i>';
    return s;
  }
  V.blocks = function (p) {
    var h = p.h || 0, t = p.t || 0, o = p.o || 0, parts = [];
    if (h || p.empty) parts.push('<div class="bcol bch" title="hundreds">' + many('b-h', h, p.fh || 0) + '</div>');
    if (t || p.empty) parts.push('<div class="bcol bct" title="tens">' + many('b-t', t, p.ft || 0) + '</div>');
    if (o || p.empty) parts.push('<div class="bcol bco" title="ones">' + many('b-o', o, p.fo || 0) + '</div>');
    return '<div class="blocks ' + (p.cls || '') + '" role="img" aria-label="' + h + ' hundreds, ' + t + ' tens, ' + o + ' ones">' +
      (parts.join('') || '<span class="bzero">0</span>') + '</div>';
  };
  V.blocksOf = function (n, cls) {
    var d = MB.digits(n);
    return V.blocks({ h: d[0], t: d[1], o: d[2], cls: cls });
  };

  /* ---------- number line (static) ----------
     from..to every `step`. blanks: values drawn as a "?" bubble. marks: values highlighted. */
  V.numberLine = function (p) {
    var step = p.step || 1, n = Math.floor((p.to - p.from) / step) + 1;
    var gap = p.gap || 40, pad = 26, W = pad * 2 + (n - 1) * gap, H = 72;
    var blanks = p.blanks || [], marks = p.marks || [];
    var s = '<svg class="nline" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="number line">';
    s += '<line class="nl-axis" x1="8" y1="30" x2="' + (W - 8) + '" y2="30"/>';
    s += '<path class="nl-arrow" d="M' + (W - 8) + ' 30 l-8 -5 v10z"/><path class="nl-arrow" d="M8 30 l8 -5 v10z"/>';
    for (var i = 0; i < n; i++) {
      var v = p.from + i * step, x = pad + i * gap, isB = blanks.indexOf(v) >= 0, isM = marks.indexOf(v) >= 0;
      s += '<line class="nl-tick" x1="' + x + '" y1="23" x2="' + x + '" y2="37"/>';
      if (isB) s += '<rect class="nl-q" x="' + (x - 17) + '" y="42" width="34" height="24" rx="8"/><text class="nl-t q" x="' + x + '" y="59" text-anchor="middle">?</text>';
      else s += '<text class="nl-t' + (isM ? ' m' : '') + '" x="' + x + '" y="58" text-anchor="middle">' + v + '</text>';
      if (isM && !isB) s += '<circle class="nl-dot" cx="' + x + '" cy="30" r="6"/>';
    }
    return s + '</svg>';
  };

  /* ---------- flat shapes ---------- */
  V.SHAPES = {
    triangle: { name: 'Triangle', pts: [[50, 12], [90, 86], [10, 86]] },
    square: { name: 'Square', pts: [[20, 20], [80, 20], [80, 80], [20, 80]] },
    rectangle: { name: 'Rectangle', pts: [[8, 28], [92, 28], [92, 72], [8, 72]] },
    circle: { name: 'Circle', pts: [] }
  };
  V.shape = function (name, cls) {
    var sh = V.SHAPES[name], body;
    if (name === 'circle') body = '<circle cx="50" cy="50" r="38"/>';
    else body = '<polygon points="' + sh.pts.map(function (p) { return p.join(','); }).join(' ') + '" stroke-linejoin="round"/>';
    return '<svg class="shp ' + (cls || '') + '" viewBox="0 0 100 100" role="img" aria-label="' + sh.name + '">' + body + '</svg>';
  };
  /* shape + its name, used as an answer option */
  V.shapeOpt = function (name) {
    return V.shape(name) + '<span class="olab">' + V.SHAPES[name].name + '</span>';
  };

  /* ---------- everyday flat objects (simple icons) ---------- */
  var chess = '';
  (function () {
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++)
      chess += '<rect x="' + (8 + c * 8) + '" y="' + (8 + r * 8) + '" width="8" height="8" fill="' + ((r + c) % 2 ? '#f4f6ff' : '#3a4770') + '"/>';
    chess += '<rect x="8" y="8" width="32" height="32" fill="none" stroke="#27304f" stroke-width="2"/>';
  })();
  var OBJ = {
    clock: '<circle cx="24" cy="24" r="20" fill="#fff" stroke="#27304f" stroke-width="3"/><path d="M24 11v13l9 5" fill="none" stroke="#27304f" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="24" r="2" fill="#27304f"/>',
    coin: '<circle cx="24" cy="24" r="20" fill="#ffc83d" stroke="#c98a00" stroke-width="3"/><circle cx="24" cy="24" r="14" fill="none" stroke="#e0a000" stroke-width="2"/><text x="24" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="#a56a00" font-family="sans-serif">1</text>',
    plate: '<circle cx="24" cy="24" r="20" fill="#fff" stroke="#8aa0cf" stroke-width="3"/><circle cx="24" cy="24" r="12" fill="#eef3ff" stroke="#c4d1ee" stroke-width="2"/>',
    wheel: '<circle cx="24" cy="24" r="19" fill="#fff" stroke="#2b2f3a" stroke-width="6"/><circle cx="24" cy="24" r="4" fill="#9aa4b8"/><path d="M24 8v32M8 24h32M13 13l22 22M35 13L13 35" stroke="#9aa4b8" stroke-width="2"/>',
    pizza: '<circle cx="24" cy="24" r="20" fill="#ffc86b" stroke="#d98a1d" stroke-width="3"/><circle cx="17" cy="19" r="4" fill="#d9483b"/><circle cx="30" cy="17" r="3.5" fill="#d9483b"/><circle cx="29" cy="30" r="4" fill="#d9483b"/><circle cx="16" cy="31" r="3" fill="#d9483b"/>',
    sandwich: '<polygon points="5,39 43,39 24,8" fill="#f6dba5" stroke="#c9a15a" stroke-width="3" stroke-linejoin="round"/><path d="M12 31h24" stroke="#4caf50" stroke-width="4" stroke-linecap="round"/>',
    sign: '<polygon points="24,6 44,41 4,41" fill="#fff" stroke="#e5484d" stroke-width="5" stroke-linejoin="round"/><text x="24" y="35" text-anchor="middle" font-size="22" font-weight="800" fill="#27304f" font-family="sans-serif">!</text>',
    flag: '<rect x="8" y="5" width="3" height="40" fill="#8a6a45"/><polygon points="11,8 42,18 11,29" fill="#ff7a1a" stroke="#d65a00" stroke-width="2" stroke-linejoin="round"/>',
    door: '<rect x="11" y="4" width="26" height="41" fill="#b87a42" stroke="#7a4a1d" stroke-width="3"/><rect x="16" y="9" width="16" height="12" fill="none" stroke="#7a4a1d" stroke-width="2"/><rect x="16" y="26" width="16" height="13" fill="none" stroke="#7a4a1d" stroke-width="2"/><circle cx="32" cy="27" r="2" fill="#ffd36b"/>',
    phone: '<rect x="13" y="3" width="22" height="42" rx="3" fill="#2b3350"/><rect x="16" y="8" width="16" height="29" fill="#8fd3ff"/><circle cx="24" cy="41" r="1.8" fill="#8f9ab8"/>',
    board: '<rect x="3" y="9" width="42" height="30" fill="#2f6b4f" stroke="#a9753f" stroke-width="4"/><path d="M11 20h14M11 28h22" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
    chocolate: '<rect x="8" y="5" width="32" height="38" fill="#7a4a2a" stroke="#4d2b14" stroke-width="3"/><path d="M8 18h32M8 30h32M24 5v38" stroke="#4d2b14" stroke-width="2"/>',
    window: '<rect x="6" y="6" width="36" height="36" fill="#bfe6ff" stroke="#8a6a45" stroke-width="4"/><path d="M24 6v36M6 24h36" stroke="#8a6a45" stroke-width="3"/>',
    chess: chess,
    note: '<rect x="6" y="6" width="36" height="36" fill="#ffe66d" stroke="#d9b800" stroke-width="2"/><path d="M12 16h24M12 23h24M12 30h14" stroke="#c9a300" stroke-width="2"/>',
    frame: '<rect x="5" y="5" width="38" height="38" fill="#a9753f"/><rect x="11" y="11" width="26" height="26" fill="#cfe9ff"/><circle cx="24" cy="21" r="5" fill="#ffb74d"/><path d="M13 35c2-6 8-8 11-8s9 2 11 8z" fill="#5aa469"/>'
  };
  V.OBJECTS2D = [
    { id: 'clock', label: 'Clock', shape: 'circle' }, { id: 'coin', label: 'Coin', shape: 'circle' },
    { id: 'plate', label: 'Plate', shape: 'circle' }, { id: 'wheel', label: 'Wheel', shape: 'circle' },
    { id: 'pizza', label: 'Pizza', shape: 'circle' },
    { id: 'sandwich', label: 'Sandwich slice', shape: 'triangle' }, { id: 'sign', label: 'Road sign', shape: 'triangle' },
    { id: 'flag', label: 'Flag', shape: 'triangle' },
    { id: 'door', label: 'Door', shape: 'rectangle' }, { id: 'phone', label: 'Phone', shape: 'rectangle' },
    { id: 'board', label: 'Blackboard', shape: 'rectangle' }, { id: 'chocolate', label: 'Chocolate bar', shape: 'rectangle' },
    { id: 'window', label: 'Window', shape: 'square' }, { id: 'chess', label: 'Chessboard', shape: 'square' },
    { id: 'note', label: 'Sticky note', shape: 'square' }, { id: 'frame', label: 'Photo frame', shape: 'square' }
  ];
  V.obj = function (id) {
    return '<svg class="obj" viewBox="0 0 48 48" aria-hidden="true">' + OBJ[id] + '</svg>';
  };
  V.objCard = function (o) {
    return V.obj(o.id) + '<span class="olab">' + o.label + '</span>';
  };

  /* ---------- solid shapes (flat pictures) ---------- */
  V.solid = function (name) {
    var id = 'g' + (++uid), s = '<svg class="solid" viewBox="0 0 100 100" role="img" aria-label="' + name + '">';
    if (name === 'sphere') {
      s += '<defs><radialGradient id="' + id + '" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffd9b0"/><stop offset="1" stop-color="#e8590c"/></radialGradient></defs>' +
        '<circle cx="50" cy="50" r="40" fill="url(#' + id + ')"/><ellipse cx="37" cy="33" rx="11" ry="6" fill="#fff" opacity=".5" transform="rotate(-30 37 33)"/>';
    } else if (name === 'cone') {
      s += '<defs><linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#ffb74d"/><stop offset=".55" stop-color="#ff8f00"/><stop offset="1" stop-color="#c25e00"/></linearGradient></defs>' +
        '<path d="M50 8 L84 80 A34 11 0 0 1 16 80 Z" fill="url(#' + id + ')"/><path d="M50 8 L40 80" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>';
    } else if (name === 'cube') {
      s += '<rect x="14" y="34" width="52" height="52" fill="#6aa4ff" stroke="#1f4fb0" stroke-width="2"/>' +
        '<polygon points="14,34 32,16 84,16 66,34" fill="#a8c9ff" stroke="#1f4fb0" stroke-width="2" stroke-linejoin="round"/>' +
        '<polygon points="66,34 84,16 84,68 66,86" fill="#3f77d9" stroke="#1f4fb0" stroke-width="2" stroke-linejoin="round"/>';
    } else { /* cuboid */
      s += '<rect x="6" y="44" width="70" height="40" fill="#ffb259" stroke="#a65b00" stroke-width="2"/>' +
        '<polygon points="6,44 22,28 92,28 76,44" fill="#ffd9a3" stroke="#a65b00" stroke-width="2" stroke-linejoin="round"/>' +
        '<polygon points="76,44 92,28 92,68 76,84" fill="#e08a1e" stroke="#a65b00" stroke-width="2" stroke-linejoin="round"/>';
    }
    return s + '</svg>';
  };
  V.SOLIDS = {
    cube: { name: 'Cube', emoji: '🧊' }, cuboid: { name: 'Cuboid', emoji: '📦' },
    cone: { name: 'Cone', emoji: '🍦' }, sphere: { name: 'Sphere', emoji: '⚽' }
  };
  /* solid + name, used as an answer option */
  V.solidOpt = function (k) {
    return V.solid(k) + '<span class="olab">' + V.SOLIDS[k].name + '</span>';
  };

  /* Real 3D box you can spin (CSS 3D). Drag to turn it. */
  V.box3d = function (host, w, h, d, hue) {
    host.innerHTML = '<div class="scene" aria-label="A ' + (w === h && h === d ? 'cube' : 'cuboid') + ' you can spin with your finger" role="img">' +
      '<div class="box3d" style="--w:' + w + 'px;--h:' + h + 'px;--d:' + d + 'px;--hue:' + hue + '">' +
      '<i class="f fr"></i><i class="f bk"></i><i class="f rt"></i><i class="f lf"></i><i class="f tp"></i><i class="f bt"></i></div></div>';
    var scene = host.firstChild, box = scene.firstChild, ry = -32, rx = -22, drag = false, lx = 0, ly = 0;
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function apply() { box.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'; }
    function tick() {
      if (!document.body.contains(box)) return;
      if (!drag && !still) ry += 0.5;
      apply(); requestAnimationFrame(tick);
    }
    scene.addEventListener('pointerdown', function (e) {
      drag = true; lx = e.clientX; ly = e.clientY;
      try { scene.setPointerCapture(e.pointerId); } catch (x) { /* ok */ }
    });
    scene.addEventListener('pointermove', function (e) {
      if (!drag) return;
      ry += (e.clientX - lx) * 0.8; rx = Math.max(-80, Math.min(80, rx - (e.clientY - ly) * 0.8));
      lx = e.clientX; ly = e.clientY; apply();
    });
    function end() { drag = false; }
    scene.addEventListener('pointerup', end); scene.addEventListener('pointercancel', end);
    apply(); tick();
  };

  /* ---------- the hungry chomper (< and > helper) ---------- */
  V.chomper = function (dir) {
    return '<svg class="chomp" viewBox="0 0 100 100" aria-hidden="true"' + (dir === 'left' ? ' style="transform:scaleX(-1)"' : '') + '>' +
      '<path d="M50,50 L84.4,25.9 A42,42 0 1 0 84.4,74.1 Z" fill="#ffc400" stroke="#c98a00" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="54" cy="27" r="5" fill="#27304f"/></svg>';
  };

  /* ---------- vertical sum layout (for addition / subtraction questions) ---------- */
  V.vsum = function (a, b, op) {
    function row(n, sym) {
      var d = MB.digits(n), s = '<div class="vr"><span class="vop">' + (sym || '') + '</span>';
      for (var i = 0; i < 3; i++) {
        var show = (i === 2) || (i === 1 && n >= 10) || (i === 0 && n >= 100);
        s += '<span>' + (show ? d[i] : '') + '</span>';
      }
      return s + '</div>';
    }
    return '<div class="vsum" role="img" aria-label="' + a + ' ' + op + ' ' + b + ' in columns">' + row(a, '') + row(b, op) + '<div class="vline"></div></div>';
  };
})();
