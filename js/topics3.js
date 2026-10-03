/* Maths Buddy - topics 8-9: flat (2D) shapes and solid (3D) shapes */
(function () {
  'use strict';
  const MB = window.MB, V = MB.V, G = MB.G, UI = MB.UI;
  const $ = (s, r) => MB.$(s, r);

  /* =====================================================================
     8. FLAT SHAPES (2D)
     ===================================================================== */
  const INFO = { triangle: { sides: 3, corners: 3 }, square: { sides: 4, corners: 4 }, rectangle: { sides: 4, corners: 4 }, circle: { sides: 0, corners: 0 } };
  const NAME = (k) => V.SHAPES[k].name;
  const SHAPE_HINT = {
    triangle: 'A triangle has 3 sides and 3 corners.', square: 'A square has 4 equal sides and 4 corners.',
    rectangle: 'A rectangle has 4 sides (2 long, 2 short) and 4 corners.', circle: 'A circle is round. It has no straight sides and no corners.'
  };

  function pickQ(shape) {
    const good = MB.sample(V.OBJECTS2D.filter(o => o.shape === shape), 2);
    const bad = MB.sample(V.OBJECTS2D.filter(o => o.shape !== shape), 4);
    const items = MB.shuffle(good.concat(bad)).map(o => ({ id: o.id, html: V.objCard(o) }));
    return {
      kind: 'pick', need: 2, good: good.map(o => o.id), items,
      prompt: `Tap <b>two</b> objects that look like a <b>${shape}</b>.`,
      hint: SHAPE_HINT[shape], explain: `A ${good[0].label.toLowerCase()} and a ${good[1].label.toLowerCase()} look like a ${shape}.`
    };
  }

  function genShapes2d() {
    const qs = [], three = ['triangle', 'square', 'rectangle'];
    let s = MB.pick(three);
    qs.push(G.num(`How many <b>sides</b> does a <b>${s}</b> have?`, INFO[s].sides, { vis: V.shape(s, 'qshape'), hint: SHAPE_HINT[s], explain: SHAPE_HINT[s] }));
    s = MB.pick(['square', 'rectangle', 'triangle', 'circle']);
    qs.push(G.num(`How many <b>corners</b> does a <b>${s}</b> have?`, INFO[s].corners, { vis: V.shape(s, 'qshape'), hint: SHAPE_HINT[s], explain: SHAPE_HINT[s] }));
    const others = MB.pick([['triangle', 'rectangle'], ['triangle', 'square'], ['rectangle', 'square']]);
    qs.push(G.choice('Which shape has <b>no corners</b>?', V.shapeOpt('circle'), others.map(V.shapeOpt), { cols: 3, hint: 'Corners are the pointy parts. Which shape is smooth and round?', explain: SHAPE_HINT.circle }));
    qs.push({ kind: 'fill', prompt: 'Name a shape that has <b>3 sides</b>.', blanks: [{ kind: 'text', ans: ['triangle'], w: 12 }], hint: 'It has 3 sides and 3 corners. Its name starts with “t”.', explain: 'A <b>triangle</b> has 3 sides.' });
    qs.push(pickQ('circle'));
    qs.push(G.choice('Which shape has <b>4 sides that are all the same length</b>?', V.shapeOpt('square'), ['rectangle', 'triangle', 'circle'].map(V.shapeOpt), { cols: 2, hint: 'A rectangle has 2 long and 2 short sides. Which shape has equal sides?', explain: SHAPE_HINT.square }));
    s = MB.pick(['triangle', 'square', 'rectangle', 'circle']);
    qs.push(G.choice('What is the name of this shape?', NAME(s), Object.keys(INFO).filter(k => k !== s).map(NAME), { vis: V.shape(s, 'qshape'), cols: 2, hint: 'Count the sides and corners.', explain: SHAPE_HINT[s] }));
    qs.push(pickQ(MB.pick(['triangle', 'rectangle', 'square'])));
    return qs;
  }

  function shapeExplorer(box) {
    let shape = 'triangle', mode = 'sides', hits = [], note = '';
    const KEYS = ['triangle', 'square', 'rectangle', 'circle'];
    function centroid(pts) { return [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length]; }
    function away(p, c, d) { const dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * d, p[1] + dy / l * d]; }
    function svg() {
      const pts = V.SHAPES[shape].pts, n = pts.length;
      let s = '<svg viewBox="0 0 100 100" class="shx" role="group" aria-label="' + NAME(shape) + '">';
      if (shape === 'circle') {
        s += `<circle class="shx-fill" cx="50" cy="50" r="38"/><circle class="shx-edge ${hits.length ? 'on' : ''}" cx="50" cy="50" r="38" data-c="1"/>`;
        return s + '</svg>';
      }
      s += `<polygon class="shx-fill" points="${pts.map(p => p.join(',')).join(' ')}" stroke-linejoin="round"/>`;
      const c = centroid(pts);
      if (mode === 'sides') {
        for (let i = 0; i < n; i++) {
          const a = pts[i], b = pts[(i + 1) % n], on = hits.indexOf(i) >= 0;
          s += `<line class="shx-side${on ? ' on' : ''}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" data-i="${i}" stroke-linecap="round"/>`;
        }
        for (let i = 0; i < n; i++) {
          const k = hits.indexOf(i); if (k < 0) continue;
          const a = pts[i], b = pts[(i + 1) % n], m = away([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], c, 9);
          s += `<g class="shx-badge"><circle cx="${m[0]}" cy="${m[1]}" r="6.5"/><text x="${m[0]}" y="${m[1] + 2.6}" text-anchor="middle">${k + 1}</text></g>`;
        }
      } else {
        for (let i = 0; i < n; i++) {
          const p = pts[i], on = hits.indexOf(i) >= 0;
          s += `<circle class="shx-corner${on ? ' on' : ''}" cx="${p[0]}" cy="${p[1]}" r="6.5" data-i="${i}"/>`;
        }
        for (let i = 0; i < n; i++) {
          const k = hits.indexOf(i); if (k < 0) continue;
          const m = away(pts[i], c, 11);
          s += `<g class="shx-badge"><circle cx="${m[0]}" cy="${m[1]}" r="6.5"/><text x="${m[0]}" y="${m[1] + 2.6}" text-anchor="middle">${k + 1}</text></g>`;
        }
      }
      return s + '</svg>';
    }
    function draw() {
      const total = INFO[shape][mode], word = mode, cnt = hits.length;
      let say;
      if (shape === 'circle') say = note || `Tap the edge of the circle. Is it straight or curved? Does it have any ${word}?`;
      else if (cnt === 0) say = `Tap each ${word === 'sides' ? 'side' : 'corner'} to count it.`;
      else if (cnt < total) say = `${cnt} so far… keep tapping!`;
      else say = `🎉 A ${shape} has <b>${total} ${word}</b>!`;
      box.innerHTML = `<div class="sx">
        <div class="presets" role="group" aria-label="Shape">${KEYS.map(k => `<button type="button" class="chip${k === shape ? ' on' : ''}" data-s="${k}">${NAME(k)}</button>`).join('')}</div>
        <div class="presets seg" role="group" aria-label="What to count"><button type="button" class="chip${mode === 'sides' ? ' on' : ''}" data-m="sides">Count sides</button><button type="button" class="chip${mode === 'corners' ? ' on' : ''}" data-m="corners">Count corners</button></div>
        <div class="sx-fig">${svg()}</div>
        <p class="sx-say" aria-live="polite">${say}</p>
        <div class="row"><button type="button" class="btn small ghost" data-a="reset">Start again ↻</button></div></div>`;
    }
    box.addEventListener('click', e => {
      const t = e.target;
      if (t.dataset && t.dataset.c) {
        note = mode === 'sides' ? 'Run your finger around the edge. It is <b>curved</b> all the way round. A circle has <b>0 sides</b>.' : 'Look for pointy corners… there are none! A circle has <b>0 corners</b>.';
        hits = [1]; MB.sfx.ok(); draw(); return;
      }
      if (t.dataset && t.dataset.i !== undefined && t.closest('.shx')) {
        const i = +t.dataset.i; if (hits.indexOf(i) < 0) { hits.push(i); MB.sfx.tap(); if (hits.length === INFO[shape][mode]) { MB.sfx.ok(); } } draw(); return;
      }
      const b = t.closest('button'); if (!b) return;
      if (b.dataset.s) { shape = b.dataset.s; hits = []; note = ''; }
      else if (b.dataset.m) { mode = b.dataset.m; hits = []; note = ''; }
      else if (b.dataset.a === 'reset') { hits = []; note = ''; }
      else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function factsTable() {
    const rows = [['triangle', '3', '3', 'Three straight sides'], ['square', '4', '4', 'All 4 sides are equal'], ['rectangle', '4', '4', '2 long sides and 2 short sides'], ['circle', '0', '0', 'Round and curved, no corners']];
    return `<div class="tablewrap"><table class="ft"><thead><tr><th>Shape</th><th>Sides</th><th>Corners</th></tr></thead><tbody>${rows.map(r =>
      `<tr><th><span class="ft-shape">${V.shape(r[0], 'mini')}</span><span>${NAME(r[0])}<small>${r[3]}</small></span></th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function gallery() {
    return `<div class="gal">${['circle', 'triangle', 'rectangle', 'square'].map(k => `
      <div class="gal-g"><div class="gal-h">${V.shape(k, 'mini')}<b>${NAME(k)}</b></div>
      <div class="gal-i">${V.OBJECTS2D.filter(o => o.shape === k).map(o => `<div class="gal-o">${V.objCard(o)}</div>`).join('')}</div></div>`).join('')}</div>`;
  }

  function learnShapes2d(root) {
    root.innerHTML =
      UI.step(1, 'Sides and corners', `<p>A <b>side</b> is a straight line on the edge of a shape. A <b>corner</b> is where two sides meet.</p><div data-w="sx"></div>`) +
      UI.step(2, 'Shape facts', factsTable() + `<div class="callout">A <b>square</b> is special: all 4 sides are the <b>same</b> length. A <b>rectangle</b> has 2 long sides and 2 short sides.</div>`) +
      UI.step(3, 'Shapes around us', `<p>Look around you. Which of these can you see? Exam tip: if they ask for an object that looks like a <b>circle</b>, you can write <i>clock, coin, plate, wheel</i>.</p>${gallery()}`);
    shapeExplorer($('[data-w=sx]', root));
  }

  /* =====================================================================
     9. SOLID SHAPES (3D)
     ===================================================================== */
  const RUBIK = '<svg class="oemo-svg" viewBox="0 0 30 30" aria-hidden="true">' + ['#e5484d', '#fff', '#2f6bff', '#ff9a1f', '#17a35f', '#ffd400', '#2f6bff', '#e5484d', '#fff']
    .map((c, i) => `<rect x="${1 + (i % 3) * 9.3}" y="${1 + Math.floor(i / 3) * 9.3}" width="8.4" height="8.4" rx="1.2" fill="${c}" stroke="#27304f" stroke-width="1"/>`).join('') + '</svg>';
  const OBJ3 = [
    { id: 'dice', label: 'Dice', e: '🎲', s: 'cube' }, { id: 'book', label: 'Book', e: '📕', s: 'cuboid' },
    { id: 'brick', label: 'Brick', e: '🧱', s: 'cuboid' }, { id: 'matchbox', label: 'Matchbox', e: '📦', s: 'cuboid' },
    { id: 'icecream', label: 'Ice-cream cone', e: '🍦', s: 'cone' }, { id: 'hat', label: 'Party hat', e: '🎉', s: 'cone' },
    { id: 'ball', label: 'Ball', e: '⚽', s: 'sphere' }, { id: 'orange', label: 'Orange', e: '🍊', s: 'sphere' },
    { id: 'globe', label: 'Globe', e: '🌍', s: 'sphere' }
  ];
  const card3 = (o) => `<span class="oemo">${o.e}</span><span class="olab">${o.label}</span>`;
  const SOLID_HINT = {
    cube: 'A cube has 6 faces and every face is a square.', cuboid: 'A cuboid is shaped like a box. Its faces are rectangles.',
    cone: 'A cone has a pointy top and a round, flat bottom.', sphere: 'A sphere is round all over, like a ball.'
  };
  const SKEYS = ['cube', 'cuboid', 'cone', 'sphere'];

  function genShapes3d() {
    const qs = [];
    const four = MB.shuffle(SKEYS.map(k => MB.pick(OBJ3.filter(o => o.s === k))));
    four.forEach(o => qs.push(G.choice(`Which 3D shape does a <b>${o.label.toLowerCase()}</b> look like?`, V.solidOpt(o.s), SKEYS.filter(k => k !== o.s).map(V.solidOpt),
      { vis: `<div class="bigemo" aria-hidden="true">${o.e}</div>`, cols: 2, hint: SOLID_HINT[o.s], explain: `A ${o.label.toLowerCase()} is a <b>${V.SOLIDS[o.s].name.toLowerCase()}</b>. ${SOLID_HINT[o.s]}` })));
    const props = MB.sample([
      ['Which shape is round like a ball and can roll?', 'sphere'], ['Which shape has a pointy top and a round bottom?', 'cone'],
      ['A dice has 6 faces. Every face is a square. Which shape is it?', 'cube'], ['Which shape is like a box? Its faces are rectangles.', 'cuboid']], 3);
    props.forEach(p => qs.push(G.choice(p[0], V.solidOpt(p[1]), SKEYS.filter(k => k !== p[1]).map(V.solidOpt), { cols: 2, hint: SOLID_HINT[p[1]], explain: SOLID_HINT[p[1]] })));
    const tgt = MB.pick(['cone', 'sphere', 'cuboid']), right = MB.pick(OBJ3.filter(o => o.s === tgt));
    const wrong = MB.sample(OBJ3.filter(o => o.s !== tgt), 3);
    qs.splice(MB.rand(2, 5), 0, G.choice(`Which of these looks like a <b>${tgt}</b>?`, card3(right), wrong.map(card3), { cols: 2, hint: SOLID_HINT[tgt], explain: `A ${right.label.toLowerCase()} looks like a ${tgt}.` }));
    return qs;
  }

  const FACTS = {
    cube: { txt: 'A cube has 6 flat faces. <b>Every face is a square</b>, and all the edges are the same length.', ex: [['🎲', 'Dice'], [RUBIK, 'Rubik’s cube']] },
    cuboid: { txt: 'A cuboid is like a box. Its faces are <b>rectangles</b>, so it is longer in some directions.', ex: [['📕', 'Book'], ['🧱', 'Brick'], ['📦', 'Matchbox']] },
    cone: { txt: 'A cone has a <b>pointy top</b> and a <b>round, flat bottom</b>.', ex: [['🍦', 'Ice-cream cone'], ['🎉', 'Party hat']] },
    sphere: { txt: 'A sphere is <b>round all over</b>. It has no flat faces and no corners, so it rolls every way.', ex: [['⚽', 'Ball'], ['🍊', 'Orange'], ['🌍', 'Globe']] }
  };

  function solidViewer(box) {
    let k = 'cube';
    function draw() {
      const f = FACTS[k];
      box.innerHTML = `<div class="sv3">
        <div class="presets" role="group" aria-label="Choose a solid">${SKEYS.map(x => `<button type="button" class="chip${x === k ? ' on' : ''}" data-k="${x}">${V.SOLIDS[x].name}</button>`).join('')}</div>
        <div class="sv3-stage" data-stage></div>
        <p class="sv3-hint">${k === 'cube' || k === 'cuboid' ? '👆 Drag the shape to turn it around.' : ''}</p>
        <p class="sv3-txt">${f.txt}</p>
        <div class="exchips">${f.ex.map(x => `<span class="exchip"><span class="oemo">${x[0]}</span>${x[1]}</span>`).join('')}</div></div>`;
      const stage = $('[data-stage]', box);
      if (k === 'cube') V.box3d(stage, 96, 96, 96, 215);
      else if (k === 'cuboid') V.box3d(stage, 140, 70, 96, 28);
      else stage.innerHTML = `<div class="floaty">${V.solid(k)}</div>`;
    }
    box.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || !b.dataset.k) return; k = b.dataset.k; MB.sfx.tap(); draw(); });
    draw();
  }

  function shapeTable() {
    const rows = [['cube', '🧊', 'Dice, Rubik’s cube'], ['cuboid', '📦', 'Book, brick, matchbox'], ['cone', '🍦', 'Ice-cream cone, party hat'], ['sphere', '⚽', 'Ball, orange, globe']];
    return `<div class="tablewrap"><table class="ft t3"><thead><tr><th>3D Shape</th><th>Example</th></tr></thead><tbody>${rows.map(r =>
      `<tr><th><span class="ft-shape">${V.solid(r[0])}</span><span>${V.SOLIDS[r[0]].name} ${r[1]}</span></th><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function solidSort(box) {
    let queue, i, score, answered;
    function fresh() { queue = MB.sample(OBJ3, 8); i = 0; score = 0; answered = null; }
    function draw() {
      if (i >= queue.length) {
        box.innerHTML = `<div class="cg"><p class="cg-end">You sorted <b>${score}</b> out of ${queue.length}! ${score >= 7 ? '🌟' : 'Play again to get better!'}</p><button type="button" class="btn small" data-a="again">Play again ↻</button></div>`;
        return;
      }
      const o = queue[i];
      box.innerHTML = `<div class="cg"><div class="cg-n">Object ${i + 1} of ${queue.length}</div>
        <div class="cg-obj"><span class="bigemo" aria-hidden="true">${o.e}</span><b>${o.label}</b></div>
        <div class="opts c2 compact">${SKEYS.map(x => `<button type="button" class="opt${answered ? (x === o.s ? ' good' : x === answered ? ' bad' : '') : ''}" data-v="${x}" ${answered ? 'disabled' : ''}>${V.solidOpt(x)}</button>`).join('')}</div>
        <p class="cg-fb" aria-live="polite">${answered ? (answered === o.s ? '✅ Yes! ' : '❌ Not quite. ') + `A ${o.label.toLowerCase()} is a <b>${V.SOLIDS[o.s].name.toLowerCase()}</b>.` : 'Which shape is it?'}</p>
        ${answered ? '<button type="button" class="btn small" data-a="next">Next ▶</button>' : ''}</div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.v) { answered = b.dataset.v; if (answered === queue[i].s) { score++; MB.sfx.ok(); } else MB.sfx.no(); }
      else if (b.dataset.a === 'next') { i++; answered = null; }
      else if (b.dataset.a === 'again') fresh();
      else return;
      draw();
    });
    fresh(); draw();
  }

  function learnShapes3d(root) {
    root.innerHTML =
      UI.step(1, 'Flat or solid?', `<div class="flatsolid">
        <div><div class="fs-pic">${V.shape('square', 'mini')}</div><b>2D = flat</b><span>You can draw it on paper.</span></div>
        <div><div class="fs-pic">${V.solid('cube')}</div><b>3D = solid</b><span>You can hold it in your hand.</span></div></div>`) +
      UI.step(2, 'Turn the shapes around', `<p>Tap a shape to see it and its facts.</p><div data-w="sv"></div>`) +
      UI.step(3, 'The table to remember', shapeTable()) +
      UI.step(4, 'Sorting game', `<p>Which shape does each object look like?</p><div data-w="ss"></div>`);
    solidViewer($('[data-w=sv]', root)); solidSort($('[data-w=ss]', root));
  }

  MB.QB = Object.assign(MB.QB || {}, { pickQ, SHAPE_HINT });
  MB.topics.push(
    { id: 'shapes2d', title: 'Flat Shapes', emoji: '🔷', tc: 'tc-shapes2d', blurb: 'Sides, corners and everyday objects', mock: 2, learn: learnShapes2d, gen: genShapes2d },
    { id: 'shapes3d', title: 'Solid Shapes', emoji: '📦', tc: 'tc-shapes3d', blurb: 'Cube, cuboid, cone and sphere', mock: 1, learn: learnShapes3d, gen: genShapes3d }
  );
})();
