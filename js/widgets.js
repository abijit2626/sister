/* Study Buddy - reusable lesson widgets for text subjects (EVS) */
(function () {
  'use strict';
  const MB = window.MB, UI = MB.UI, W = (MB.W = {});
  const $ = (s, r) => MB.$(s, r);
  const plain = (h) => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');

  /* ---------- flip cards: tap a card to read it. Items: {emoji, title, text, group?} ---------- */
  W.cards = function (box, items, o) {
    o = o || {};
    const seen = {}, open = {};
    let celebrated = false;
    function draw(focus) {
      const groups = []; let cur = null;
      items.forEach((it, i) => {
        const g = it.group || '';
        if (!cur || cur.g !== g) { cur = { g: g, list: [] }; groups.push(cur); }
        cur.list.push(i);
      });
      const n = Object.keys(seen).length;
      box.innerHTML = '<div class="fc">' + groups.map(gr =>
        (gr.g ? `<h4 class="fc-g">${gr.g}</h4>` : '') +
        `<div class="fc-grid${o.cols === 1 ? ' one' : ''}">` + gr.list.map(i => {
          const it = items[i], isOpen = !!open[i];
          return `<button type="button" class="fcard${isOpen ? ' open' : ''}${seen[i] ? ' seen' : ''}" data-i="${i}" aria-expanded="${isOpen}">
            <span class="fc-e" aria-hidden="true">${it.emoji || ''}</span><b class="fc-t">${it.title}</b>
            ${isOpen ? `<span class="fc-b">${it.text}</span>` : '<span class="fc-hint">tap to read</span>'}</button>`;
        }).join('') + '</div>').join('') +
        `<p class="fc-prog${n === items.length ? ' done' : ''}">${n === items.length ? '✅ You have read every card!' : n + ' of ' + items.length + ' cards read'}</p></div>`;
      if (focus !== undefined) { const b = $('[data-i="' + focus + '"]', box); if (b) b.focus({ preventScroll: true }); }
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('.fcard'); if (!b) return;
      const i = +b.dataset.i; open[i] = !open[i]; seen[i] = true; MB.sfx.tap();
      draw(i);
      if (!celebrated && Object.keys(seen).length === items.length) { celebrated = true; MB.sfx.ok(); }
    });
    draw();
  };

  /* ---------- story stepper: scenes {emoji, title, text, point?} ---------- */
  W.story = function (box, scenes) {
    let i = 0;
    function draw() {
      const s = scenes[i];
      box.innerHTML = `<div class="sty">
        <div class="sty-dots" aria-hidden="true">${scenes.map((_, k) => `<span class="${k === i ? 'cur' : k < i ? 'done' : ''}"></span>`).join('')}</div>
        <div class="sty-pic" aria-hidden="true">${s.emoji}</div>
        <h4 class="sty-t">${s.title}</h4>
        <p class="sty-x">${s.text}</p>
        ${s.point ? `<div class="callout"><b>💡 Remember:</b> ${s.point}</div>` : ''}
        <div class="row"><button type="button" class="btn small ghost" data-a="back" ${i === 0 ? 'disabled' : ''}>◀ Back</button>${UI.speakBtn(plain(s.text), 'Read this aloud')}<button type="button" class="btn small" data-a="next" ${i === scenes.length - 1 ? 'disabled' : ''}>Next ▶</button></div>
        <p class="sty-n">Scene ${i + 1} of ${scenes.length}</p></div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.a === 'next') i = Math.min(scenes.length - 1, i + 1); else if (b.dataset.a === 'back') i = Math.max(0, i - 1); else return;
      MB.sfx.tap(); draw();
    });
    draw();
  };

  /* ---------- sorting game: cfg {items:[{label, emoji?, cat, why}], cats:[{id,label,emoji?}], n, noun, ask} ---------- */
  W.sortGame = function (box, cfg) {
    let items, i, score, ans;
    function fresh() { items = MB.sample(cfg.items, Math.min(cfg.n || 8, cfg.items.length)); i = 0; score = 0; ans = null; }
    function draw() {
      if (i >= items.length) {
        box.innerHTML = `<div class="cg"><p class="cg-end">You got <b>${score}</b> out of ${items.length}! ${score >= items.length - 1 ? '🌟' : 'Play again to get better!'}</p><button type="button" class="btn small" data-a="again">Play again ↻</button></div>`;
        return;
      }
      const it = items[i];
      box.innerHTML = `<div class="cg"><div class="cg-n">${cfg.noun || 'Card'} ${i + 1} of ${items.length}</div>
        <div class="cg-card">${it.emoji ? `<span class="bigemo" aria-hidden="true">${it.emoji}</span>` : ''}<b class="cg-lab">${it.label}</b></div>
        <div class="cg-cats">${cfg.cats.map(c => `<button type="button" class="btn small ${ans ? (c.id === it.cat ? 'good' : c.id === ans ? 'bad' : 'ghost') : 'ghost'}" data-v="${c.id}" ${ans ? 'disabled' : ''}>${c.emoji ? c.emoji + ' ' : ''}${c.label}</button>`).join('')}</div>
        <p class="cg-fb" aria-live="polite">${ans ? (ans === it.cat ? '✅ Yes! ' : '❌ Not quite. ') + (it.why || '') : (cfg.ask || 'Which group does it belong to?')}</p>
        ${ans ? '<button type="button" class="btn small" data-a="next">Next ▶</button>' : ''}</div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.v) { ans = b.dataset.v; if (ans === items[i].cat) { score++; MB.sfx.ok(); } else MB.sfx.no(); }
      else if (b.dataset.a === 'next') { i++; ans = null; }
      else if (b.dataset.a === 'again') fresh();
      else return;
      draw();
    });
    fresh(); draw();
  };

  /* ---------- put the events in order: cfg {seq:[...], help?} ---------- */
  W.orderGame = function (box, cfg) {
    let ctl, items;
    function start() {
      items = MB.shuffle(cfg.seq); let n = 0;
      while (items.every((x, k) => x === cfg.seq[k]) && n++ < 20) items = MB.shuffle(cfg.seq);
      box.innerHTML = '<div class="og"><div class="og-area"></div><p class="og-msg" aria-live="polite"></p><div class="row"><button type="button" class="btn small" data-a="check" disabled>Check</button><button type="button" class="btn small ghost" data-a="new">Shuffle again ↻</button></div></div>';
      ctl = UI.order($('.og-area', box), items, 'asc', () => { $('[data-a=check]', box).disabled = !ctl.complete(); $('.og-msg', box).textContent = ''; },
        { seq: cfg.seq, text: true, help: cfg.help || 'Tap the steps in the order they happen. <b>First step first.</b>' });
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.a === 'new') start();
      else if (b.dataset.a === 'check') {
        const got = ctl.get(), ok = cfg.seq.every((v, k) => v === got[k]);
        $('.og-msg', box).innerHTML = ok ? '🎉 Perfect! That is the right order.' : 'Not yet. Tap a step to take it back, then try again.';
        if (ok) { MB.sfx.ok(); ctl.lock(); b.disabled = true; } else MB.sfx.no();
      }
    });
    start();
  };

  /* ---------- quick check: runs a few questions inside the lesson. makeQs() returns fresh questions ---------- */
  W.tryIt = function (box, makeQs, tc) {
    function run() {
      MB.Quiz.run(box, makeQs(), {
        mode: 'practice', tc: tc, onDone: res => {
          const ok = res.filter(r => r.ok).length;
          box.innerHTML = `<div class="cg"><p class="cg-end">${ok} of ${res.length} right! ${ok === res.length ? '🌟' : 'Good try!'}</p>
            <button type="button" class="btn small" data-a="again">Try new questions ↻</button></div>`;
          if (ok === res.length) { MB.sfx.win(); MB.confetti(); }
          $('[data-a=again]', box).addEventListener('click', run);
        }
      });
    }
    box.innerHTML = '<div class="cg"><p>Check what you remember with 3 quick questions.</p><button type="button" class="btn small" data-a="go">Start the quick check ▶</button></div>';
    $('[data-a=go]', box).addEventListener('click', run);
  };
})();
