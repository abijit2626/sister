/* Maths Buddy - topics 1-4: number names, place value, before/after/between, compare & order */
(function () {
  'use strict';
  const MB = window.MB, V = MB.V, G = MB.G, UI = MB.UI;
  const $ = (s, r) => MB.$(s, r);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  /* =====================================================================
     1. NUMBER NAMES
     ===================================================================== */
  const nameHint = (n) =>
    n < 20 ? 'Look at the small number words in the lesson. Which one matches?'
      : n < 100 ? `Split it: ${n} = ${n - n % 10} + ${n % 10}. Say the tens word, then a hyphen, then the ones word.`
        : `Split it: ${n} = ${n - n % 100} + ${n % 100}. Say the hundreds, then “and”, then the rest.`;

  const nameQ = (n) => ({
    kind: 'fill', prompt: `Write the number name of <b>${n}</b>.`,
    blanks: [{ kind: 'text', nameOf: n, w: Math.max(14, MB.words(n).length) }],
    hint: nameHint(n), explain: `<b>${n}</b> = ${MB.words(n)}.`
  });
  const numQ = (n) => ({
    kind: 'fill', prompt: `Write the numeral for <b>“${MB.words(n)}”</b>.`,
    blanks: [{ kind: 'num', ans: n, w: 3 }],
    hint: 'Turn each word into a number, then put them together: ' + MB.wordChips(n).filter(c => c.k !== 'and').map(c => `${c.t} = ${c.v}`).join(', ') + '.',
    explain: MB.wordChips(n).filter(c => c.k !== 'and').map(c => c.v).join(' + ') + ` = <b>${n}</b>.`
  });

  const SPELL = [['forty', 'fourty'], ['fifty', 'fivty'], ['eighty', 'eightty'], ['ninety', 'ninty'], ['fifteen', 'fiveteen'],
    ['eighteen', 'eightteen'], ['thirteen', 'thirten'], ['twelve', 'twelv'], ['sixty', 'sixy'], ['seventy', 'sevinty']];

  function genNames() {
    const two = MB.sample([23, 36, 45, 58, 64, 72, 84, 91, 27, 33, 56, 68, 95], 3);
    const round = MB.pick([120, 150, 200, 250, 300, 350, 400, 500]);
    const reg = () => MB.rand(1, 9) * 100 + MB.rand(2, 9) * 10 + MB.rand(1, 9);
    const sp = MB.pick(SPELL);
    const h = MB.rand(1, 9); let o = MB.rand(1, 9); while (o === h) o = MB.rand(1, 9);
    const z = h * 100 + o;
    const abc = [reg(), MB.pick([150, 250, 350, 450]), MB.pick([100, 200, 300, 400])];
    return [
      nameQ(two[0]),
      numQ(two[1]),
      nameQ(round),
      G.choice('Which spelling is <b>correct</b>?', sp[0], [sp[1]], { cols: 2, hint: 'Say the word slowly and sound out each letter.', explain: `The correct spelling is <b>${sp[0]}</b>.` }),
      nameQ(reg()),
      numQ(reg()),
      G.choice(`Which is the number name of <b>${z}</b>?`, MB.words(z), [MB.words(h * 100 + o * 10), MB.words(o * 100 + h), MB.words(h * 10 + o)],
        { cols: 1, hint: 'Check the tens place. Is there a tens word in the name?', explain: `<b>${z}</b> = ${MB.words(z)}. There are no tens, so we go straight from “and” to the ones.` }),
      {
        kind: 'fill', prompt: 'Write the number names for:',
        tpl: abc.map((v, k) => `<div class="frow">${'abc'[k]}) <b>${v}</b> {${k}}</div>`).join(''),
        blanks: abc.map(v => ({ kind: 'text', nameOf: v, w: 24 })),
        hint: 'Do one at a time. Hundreds first, then “and”, then the rest.',
        explain: abc.map(v => `${v} = ${MB.words(v)}`).join('; ') + '.'
      }
    ];
  }

  function wcClass(c) { return 'wc ' + c.k; }
  /* join chips into html; a chip after a hyphen stays on the same line as the chip before it */
  function chipsHTML(chips, make) {
    let s = '';
    chips.forEach((c, i) => {
      if (c.hy) return;
      const nxt = chips[i + 1];
      s += nxt && nxt.hy ? `<span class="nb">${make(c, i)}<span class="hy">-</span>${make(nxt, i + 1)}</span>` : make(c, i);
    });
    return s;
  }

  function nameMaker(box) {
    let n = 145;
    box.innerHTML = `<div class="nm">
      <div class="nm-ctl">
        <button type="button" class="stepbtn" data-d="-10" aria-label="minus ten">−10</button>
        <button type="button" class="stepbtn" data-d="-1" aria-label="minus one">−1</button>
        <output class="nm-num" aria-live="polite"></output>
        <button type="button" class="stepbtn" data-d="1" aria-label="plus one">+1</button>
        <button type="button" class="stepbtn" data-d="10" aria-label="plus ten">+10</button>
      </div>
      <div class="presets">${[45, 72, 100, 145, 182, 200, 306].map(v => `<button type="button" class="chip" data-n="${v}">${v}</button>`).join('')}</div>
      <div class="nm-blocks"></div>
      <div class="nm-chips"></div>
      <div class="nm-out"><span class="nm-name"></span><span class="nm-spk"></span></div>
    </div>`;
    function draw() {
      $('.nm-num', box).innerHTML = UI.colorNum(n);
      $('.nm-blocks', box).innerHTML = V.blocksOf(n, 'sm');
      $('.nm-chips', box).innerHTML = chipsHTML(MB.wordChips(n), c => `<span class="${wcClass(c)}">${c.t}</span>`);
      $('.nm-name', box).textContent = MB.words(n);
      $('.nm-spk', box).innerHTML = UI.speakBtn(MB.words(n));
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.d) n = clamp(n + (+b.dataset.d), 1, 999);
      else if (b.dataset.n) n = +b.dataset.n;
      else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function wordsToNum(box) {
    const POOL = [182, 245, 367, 450, 119, 306, 575, 728, 999, 214, 633, 840];
    let n = 182, open = {};
    function draw() {
      const chips = MB.wordChips(n), real = chips.filter(c => c.k !== 'and');
      const all = real.every((c, i) => open[chips.indexOf(c)]);
      box.innerHTML = `<div class="w2n">
        <p class="w2n-name">${MB.words(n)}</p>
        <div class="nm-chips">${chipsHTML(chips, (c, i) => c.k === 'and'
          ? `<span class="wc and">and</span>`
          : `<button type="button" class="wc ${c.k} tap${open[i] ? ' open' : ''}" data-i="${i}">${c.t}<small>${open[i] ? '= ' + c.v : 'tap me'}</small></button>`)}</div>
        <p class="w2n-sum">${all ? `${real.map(c => c.v).join(' + ')} = <b>${n}</b> 🎉` : 'Tap every word to see its number.'}</p>
        <button type="button" class="btn small ghost" data-a="new">Try another ↻</button></div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'new') { let m; do { m = MB.pick(POOL); } while (m === n); n = m; open = {}; }
      else if (b.dataset.i) open[b.dataset.i] = true;
      else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function learnNames(root) {
    const small = MB.ONES.map((w, i) => `<button type="button" class="wchip${[12, 13, 15, 18].includes(i) ? ' tricky' : ''}" data-say="${w}"><b>${i}</b><span>${w}</span></button>`).join('');
    const tens = MB.TENS.map((w, i) => i < 2 ? '' : `<button type="button" class="wchip${[4, 5, 8, 9].includes(i) ? ' tricky' : ''}" data-say="${w}"><b>${i * 10}</b><span>${w}</span></button>`).join('');
    root.innerHTML =
      UI.step(1, 'Small number words', `<p>Learn these first. <b>Tap a word to hear it.</b></p><div class="wgrid">${small}</div>
        <p class="note">The thick-edged ones are easy to spell wrongly. Look at them twice.</p>`) +
      UI.step(2, 'The tens words', `<div class="wgrid tens">${tens}</div>
        <div class="callout warn"><b>Careful with spelling!</b><br>4 is <i>four</i> but 40 is <b>forty</b>, with <u>no “u”</u>.<br>Also check: <b>fifty</b> · <b>eighty</b> · <b>ninety</b> · <b>fifteen</b> · <b>eighteen</b>.</div>`) +
      UI.step(3, 'Build a number name', `<p>A name has up to three parts:</p>
        <ol class="rules">
          <li>Say the <span class="pill h">hundreds</span> and the word <i>hundred</i>.</li>
          <li>Say <span class="pill and">and</span>.</li>
          <li>Say the <span class="pill t">tens</span> and the <span class="pill o">ones</span>. Join them with a hyphen.</li>
        </ol><div data-w="nm"></div>`) +
      UI.step(4, 'Read a name backwards', `<p>To go from words to numbers, find the value of each word. Then add them up.</p><div data-w="w2n"></div>`);
    nameMaker($('[data-w=nm]', root)); wordsToNum($('[data-w=w2n]', root));
  }

  /* =====================================================================
     2. PLACE VALUE & EXPANDED FORM
     ===================================================================== */
  const PLACE = ['hundreds', 'tens', 'ones'], PVAL = [100, 10, 1];

  const expQ = (num) => {
    const dd = MB.digits(num);
    return {
      kind: 'fill', prompt: `Write <b>${num}</b> in expanded form.`, tpl: `<div class="seq">${num} = {0} + {1} + {2}</div>`,
      blanks: dd.map((x, i) => ({ kind: 'num', ans: x * PVAL[i], w: 3 })), hint: 'Break it into hundreds, tens and ones.',
      explain: `${num} = ${dd[0] * 100} + ${dd[1] * 10} + ${dd[2]}.`
    };
  };

  function genPlace() {
    const qs = [];
    let n = G.distinct3(), d = MB.digits(n);
    // 1 blocks -> number
    const bn = G.distinct3(), bd = MB.digits(bn);
    qs.push(G.num('What number do these blocks show?', bn, {
      vis: V.blocks({ h: bd[0], t: bd[1], o: bd[2] }), hint: 'Count the flats (100 each), the rods (10 each) and the cubes (1 each).',
      explain: `${bd[0]} hundreds + ${bd[1]} tens + ${bd[2]} ones = <b>${bn}</b>.`
    }));
    // 2 which place
    let p = MB.rand(0, 2);
    qs.push(G.choice(`In <b>${n}</b>, the digit <b>${d[p]}</b> is in the ___ place.`, ['Hundreds', 'Tens', 'Ones'][p], ['Hundreds', 'Tens', 'Ones'].filter((_, i) => i !== p), {
      cols: 1, hint: 'Say the number’s places from the right: ones, tens, hundreds.', explain: `The ${d[p]} is in the ${PLACE[p]} place.`
    }));
    // 3 place value (tens)
    n = G.distinct3(); d = MB.digits(n); p = MB.pick([1, 2]);
    qs.push(G.num(`Write the place value of <b>${d[p]}</b> in <b>${n}</b>.`, d[p] * PVAL[p], {
      hint: `Which place is the ${d[p]} in? Then multiply: ${d[p]} × ${PVAL[p]}.`,
      explain: `The ${d[p]} is in the ${PLACE[p]} place, so its value is ${d[p]} ${PLACE[p]} = <b>${d[p] * PVAL[p]}</b>.`
    }));
    // 4 expanded form
    n = G.distinct3(); d = MB.digits(n);
    qs.push(expQ(n));
    // 5 reverse
    n = G.distinct3(); d = MB.digits(n);
    const parts = [d[0] * 100, d[1] * 10, d[2]], scrambled = Math.random() < 0.4 ? [parts[2], parts[0], parts[1]] : parts;
    qs.push({ kind: 'fill', prompt: 'Add the parts.', tpl: `<div class="seq">${scrambled.join(' + ')} = {0}</div>`, blanks: [{ kind: 'num', ans: n, w: 3 }], hint: 'Hundreds, tens and ones go into their own places.', explain: `${parts.join(' + ')} = <b>${n}</b>.` });
    // 6 make the number
    n = G.distinct3(); d = MB.digits(n);
    qs.push({ kind: 'fill', prompt: `What number is <b>${d[0]} hundreds</b>, <b>${d[1]} tens</b> and <b>${d[2]} ones</b>?`, blanks: [{ kind: 'num', ans: n, w: 3 }], hint: `${d[0]} hundreds is ${d[0] * 100}. ${d[1]} tens is ${d[1] * 10}.`, explain: `${d[0] * 100} + ${d[1] * 10} + ${d[2]} = <b>${n}</b>.` });
    // 7 hundreds place value
    n = G.distinct3(); d = MB.digits(n);
    qs.push(G.num(`What is the value of the digit <b>${d[0]}</b> in <b>${n}</b>?`, d[0] * 100, { hint: 'The first digit of a 3-digit number is in the hundreds place.', explain: `${d[0]} hundreds = <b>${d[0] * 100}</b>.` }));
    // 8 expanded with a zero
    const z = MB.rand(1, 9) * 100 + MB.rand(1, 9);
    qs.push({ kind: 'fill', prompt: `Write <b>${z}</b> in expanded form.`, tpl: `<div class="seq">${z} = {0} + {1} + {2}</div>`, blanks: MB.digits(z).map((x, i) => ({ kind: 'num', ans: x * PVAL[i], w: 3 })), hint: 'There are no tens, so the tens part is 0.', explain: `${z} has 0 tens, so ${z} = ${z - z % 100} + 0 + ${z % 100}.` });
    return qs;
  }

  function placeBuilder(box) {
    let n = 274, target = null;
    box.innerHTML = `<div class="pb">
      <div class="pb-cols">${['Hundreds', 'Tens', 'Ones'].map((nm, i) => `
        <div class="pb-col c${'hto'[i]}">
          <div class="pb-lab">${nm}</div>
          <button type="button" class="stepbtn" data-d="${PVAL[i]}" aria-label="add one ${nm.toLowerCase().replace(/s$/, '')}">+</button>
          <div class="pb-dig"></div>
          <button type="button" class="stepbtn" data-d="${-PVAL[i]}" aria-label="take away one ${nm.toLowerCase().replace(/s$/, '')}">−</button>
          <div class="pb-blk"></div>
        </div>`).join('')}</div>
      <p class="pb-msg" aria-live="polite">Press + and − to add or take away blocks.</p>
      <div class="pb-sum"><div class="pb-big"></div><div class="pb-name"></div><div class="pb-exp"></div></div>
      <div class="pb-chal"></div></div>`;
    function draw() {
      const d = MB.digits(n);
      MB.$$('.pb-col', box).forEach((c, i) => {
        $('.pb-dig', c).textContent = d[i];
        $('.pb-blk', c).innerHTML = V.blocks({ h: i === 0 ? d[0] : 0, t: i === 1 ? d[1] : 0, o: i === 2 ? d[2] : 0, empty: false, cls: 'one' });
      });
      $('.pb-big', box).innerHTML = UI.colorNum(n);
      $('.pb-name', box).innerHTML = (n ? MB.words(n) : 'zero') + ' ' + (n ? UI.speakBtn(MB.words(n)) : '');
      const dd = d.map((x, i) => x * PVAL[i]).filter(x => x > 0);
      $('.pb-exp', box).textContent = n ? `${n} = ${dd.join(' + ')}` : '0';
      const ch = $('.pb-chal', box);
      ch.innerHTML = target === null
        ? '<button type="button" class="btn small ghost" data-a="chal">🎯 Give me a challenge</button>'
        : `<div class="chal ${n === target ? 'won' : ''}">${n === target ? `You made <b>${target}</b>! 🎉` : `Challenge: make <b>${target}</b> with the blocks`}</div><button type="button" class="btn small ghost" data-a="chal">New challenge</button>`;
    }
    function say(msg) { $('.pb-msg', box).textContent = msg; }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'chal') { let t; do { t = MB.rand(11, 99) + MB.rand(1, 4) * 100; } while (t === n); target = t; say('Use + and − until the blocks match the number.'); MB.sfx.tap(); draw(); return; }
      if (!b.dataset.d) return;
      const d = +b.dataset.d, m = n + d;
      if (m < 0 || m > 999) { say(m < 0 ? 'There are no blocks left to take away.' : '999 is the biggest number we can build here.'); MB.sfx.no(); return; }
      if (d === 1 && m % 10 === 0) say('10 ones are now 10 cubes. Trade them for 1 ten rod!');
      else if (d === 10 && Math.floor(m / 10) % 10 === 0 && m > n) say('10 tens make 1 hundred. Trade the 10 rods for 1 flat!');
      else if (d === -1 && m % 10 === 9) say('We had no ones left, so we traded 1 ten rod for 10 cubes.');
      else if (d === -10 && Math.floor(m / 10) % 10 === 9) say('We traded 1 hundred flat for 10 tens.');
      else say(d > 0 ? 'One more ' + ['', 'one', 'ten', '', '', '', '', '', '', '', 'hundred'][d === 1 ? 1 : d === 10 ? 2 : 10] + '.' : 'One taken away.');
      n = m; MB.sfx.tap(); draw();
      if (target !== null && n === target) { MB.sfx.ok(); MB.confetti(); }
    });
    draw();
  }

  function placeChart(box) {
    let n = 274, sel = 1;
    function draw() {
      const d = MB.digits(n);
      const one = { h: 0, t: 0, o: 0 }; one['hto'[sel]] = d[sel];
      box.innerHTML = `<div class="pc">
        <div class="pc-grid">${['Hundreds', 'Tens', 'Ones'].map((nm, i) => `
          <button type="button" class="pc-cell c${'hto'[i]}${i === sel ? ' on' : ''}" data-i="${i}" aria-pressed="${i === sel}">
            <span class="pc-lab">${nm}</span><span class="pc-d">${d[i]}</span></button>`).join('')}</div>
        <p class="pc-say">In <b>${n}</b>, the digit ${UI.dig(d[sel], sel)} is in the <b>${PLACE[sel]}</b> place.<br>
          Its value is ${d[sel]} ${PLACE[sel]} = <b class="d${'hto'[sel]}">${d[sel] * PVAL[sel]}</b>.</p>
        <div class="pc-blk">${V.blocks(Object.assign({ cls: 'sm' }, one))}</div>
        <button type="button" class="btn small ghost" data-a="new">New number ↻</button></div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.i) sel = +b.dataset.i; else if (b.dataset.a === 'new') { n = G.distinct3(); } else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function expandedDemo(box) {
    let n = 296, split = false;
    function draw() {
      const d = MB.digits(n), parts = d.map((x, i) => x * PVAL[i]);
      box.innerHTML = `<div class="ex ${split ? 'split' : ''}">
        <div class="ex-num">${UI.colorNum(n)}</div>
        <div class="ex-parts" aria-live="polite">${parts.map((p, i) => (i ? '<span class="plus">+</span>' : '') + `<span class="expart c${'hto'[i]}">${p}</span>`).join('')}</div>
        <p class="ex-say">${split ? `${n} = ${parts.filter(x => x).join(' + ')}` : 'Press the button to break the number apart.'}</p>
        <div class="row"><button type="button" class="btn small" data-a="toggle">${split ? 'Put it back together 🧩' : 'Break it apart ✂️'}</button>
        <button type="button" class="btn small ghost" data-a="new">New number ↻</button></div></div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'toggle') split = !split;
      else if (b.dataset.a === 'new') { n = MB.rand(1, 9) * 100 + MB.rand(0, 9) * 10 + MB.rand(1, 9); split = false; }
      else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function learnPlace(root) {
    root.innerHTML =
      UI.step(1, 'Meet the blocks', `<p>We use blocks to see numbers. Each kind of block has its own value.</p>
        <div class="legend">
          <div class="lg"><div class="lg-pic">${V.blocks({ o: 1, cls: 'lg' })}</div><b class="do">1 cube</b><span>= 1 one</span></div>
          <div class="lg"><div class="lg-pic">${V.blocks({ t: 1, cls: 'lg' })}</div><b class="dt">1 rod</b><span>= 10 ones = 1 ten</span></div>
          <div class="lg"><div class="lg-pic">${V.blocks({ h: 1, cls: 'lg' })}</div><b class="dh">1 flat</b><span>= 10 tens = 1 hundred</span></div>
        </div><div class="callout">10 cubes make a rod. 10 rods make a flat. That is why we trade when we get to 10!</div>`) +
      UI.step(2, 'Build a number', `<p>Make any number from 0 to 999. See what happens when you reach <b>10</b> of something.</p><div data-w="pb"></div>`) +
      UI.step(3, 'Place value chart', `<p>Every digit has a <b>place</b>. The place tells you the digit’s <b>value</b>. Tap a digit.</p><div data-w="pc"></div>`) +
      UI.step(4, 'Expanded form', `<p>Expanded form shows the value of each digit, added together.</p><div data-w="ex"></div>`);
    placeBuilder($('[data-w=pb]', root)); placeChart($('[data-w=pc]', root)); expandedDemo($('[data-w=ex]', root));
  }

  /* =====================================================================
     3. BEFORE, AFTER & BETWEEN
     ===================================================================== */
  function genLine() {
    const qs = [];
    const lineFor = (n, blank) => V.numberLine({ from: n - 3, to: n + 3, blanks: [blank], marks: [n] });
    qs.push(G.num('What comes just <b>after 99</b>?', 100, {
      vis: V.numberLine({ from: 96, to: 102, blanks: [100], marks: [99] }), hint: '99 has 9 tens and 9 ones. Add one more cube and trade up.', explain: '99 + 1 = <b>100</b>. 10 tens make a new hundred.'
    }));
    let n = MB.pick([200, 300, 400, 500, 600, 700, 800, 900]);
    qs.push(G.num(`What comes just <b>before ${n}</b>?`, n - 1, { vis: lineFor(n, n - 1), hint: 'Just before means 1 less.', explain: `${n} − 1 = <b>${n - 1}</b>.` }));
    let a = MB.rand(21, 97);
    qs.push(G.num(`What number comes <b>between ${a} and ${a + 2}</b>?`, a + 1, { vis: V.numberLine({ from: a - 1, to: a + 3, blanks: [a + 1], marks: [a, a + 2] }), hint: `Count up from ${a}. What is the next number?`, explain: `${a}, <b>${a + 1}</b>, ${a + 2}.` }));
    n = MB.pick([199, 299, 399, 499, 109, 209, 119, 329]);
    qs.push(G.num(`What comes just <b>after ${n}</b>?`, n + 1, { hint: `Add 1 to ${n}. Watch out if the number ends in 9!`, explain: `${n} + 1 = <b>${n + 1}</b>.` }));
    n = MB.rand(111, 898); if (n % 10 === 0) n += 3;
    qs.push(G.num(`What comes just <b>before ${n}</b>?`, n - 1, { hint: 'Just before means 1 less.', explain: `${n} − 1 = <b>${n - 1}</b>.` }));
    n = MB.pick([389, 249, 599, 179, 699, 459]);
    qs.push(G.choice(`Which number is just <b>after ${n}</b>?`, String(n + 1), [String(n - 1), String(n + 10), String(n + 11)], { hint: 'Just after means 1 more.', explain: `${n} + 1 = <b>${n + 1}</b>.` }));
    a = MB.pick([198, 298, 398, 148, 248, 348, 499, 599]);
    qs.push(G.num(`What number comes <b>between ${a} and ${a + 2}</b>?`, a + 1, { hint: `Count up: ${a}, ?, ${a + 2}.`, explain: `${a}, <b>${a + 1}</b>, ${a + 2}.` }));
    n = MB.rand(120, 880); n -= n % 10; n += MB.rand(1, 7);
    qs.push(G.seq('Write the missing numbers:', [n, n + 1, n + 2, n + 3], [1, 3], { hint: 'Each number is 1 more than the one before.', explain: `${n}, <b>${n + 1}</b>, ${n + 2}, <b>${n + 3}</b>.` }));
    return qs;
  }

  function lineExplorer(box) {
    let n = 200;
    function draw() {
      const from = n - 3, gap = 50, pad = 30, W = pad * 2 + 6 * gap;
      let s = `<svg class="nline big" viewBox="0 0 ${W} 112" role="group" aria-label="Number line around ${n}">
        <line class="nl-axis" x1="6" y1="52" x2="${W - 6}" y2="52"/><path class="nl-arrow" d="M${W - 6} 52 l-8 -5 v10z"/><path class="nl-arrow" d="M6 52 l8 -5 v10z"/>`;
      for (let i = 0; i < 7; i++) {
        const v = from + i, x = pad + i * gap, cls = v === n ? 'sel' : v === n - 1 ? 'bef' : v === n + 1 ? 'aft' : '';
        s += `<g class="nl-hit ${cls}" data-n="${v}" tabindex="0" role="button" aria-label="${v}"><rect x="${x - 22}" y="20" width="44" height="86" fill="transparent"/>
          <line class="nl-tick" x1="${x}" y1="42" x2="${x}" y2="62"/><circle class="nl-pin" cx="${x}" cy="52" r="${v === n ? 11 : 6}"/>
          <text class="nl-t" x="${x}" y="90" text-anchor="middle">${v}</text>`;
        if (v === n - 1) s += `<text class="nl-tag" x="${x}" y="30" text-anchor="middle">before</text>`;
        if (v === n + 1) s += `<text class="nl-tag" x="${x}" y="30" text-anchor="middle">after</text>`;
        if (v === n) s += `<text class="nl-tag" x="${x}" y="30" text-anchor="middle">me</text>`;
        s += '</g>';
      }
      s += '</svg>';
      box.innerHTML = `<div class="le">${s}
        <div class="le-tiles"><div class="le-t bef"><small>just before</small><b>${n - 1}</b></div><div class="le-t sel"><small>the number</small><b>${n}</b></div><div class="le-t aft"><small>just after</small><b>${n + 1}</b></div></div>
        <p class="le-say"><b>${n - 1}</b>, <b>${n}</b>, <b>${n + 1}</b>. So <b>${n}</b> is <u>between</u> ${n - 1} and ${n + 1}.</p>
        <div class="presets"><button type="button" class="stepbtn" data-d="-10">−10</button><button type="button" class="stepbtn" data-d="-1">◀</button><button type="button" class="stepbtn" data-d="1">▶</button><button type="button" class="stepbtn" data-d="10">+10</button></div>
        <div class="presets">Jump to: ${[49, 99, 199, 299].map(v => `<button type="button" class="chip" data-n="${v}">${v}</button>`).join('')}</div></div>`;
    }
    function go(v) { n = clamp(v, 4, 996); MB.sfx.tap(); draw(); }
    box.addEventListener('click', e => {
      const g = e.target.closest('.nl-hit'); if (g) return go(+g.dataset.n);
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.d) go(n + (+b.dataset.d)); else if (b.dataset.n) go(+b.dataset.n);
    });
    box.addEventListener('keydown', e => { const g = e.target.closest && e.target.closest('.nl-hit'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(+g.dataset.n); } });
    draw();
  }

  function rollover(box) {
    const EX = [{ n: 99, t: 'From 99 to 100' }, { n: 199, t: 'From 199 to 200' }, { n: 9, t: 'From 9 to 10' }, { n: 299, t: 'From 299 to 300' }];
    let ex = EX[0], st;
    function reset() { const d = MB.digits(ex.n); st = { h: d[0], t: d[1], o: d[2], step: 0, msg: `This is ${ex.n}. What happens if we add one more cube?` }; }
    function value() { return st.h * 100 + st.t * 10 + st.o; }
    function draw() {
      const done = st.o < 10 && st.t < 10 && st.step > 0;
      box.innerHTML = `<div class="ro">
        <div class="presets">${EX.map((e, i) => `<button type="button" class="chip${e === ex ? ' on' : ''}" data-i="${i}">${e.n}</button>`).join('')}</div>
        <div class="ro-blk">${V.blocks({ h: st.h, t: st.t, o: st.o, cls: 'sm' })}</div>
        <p class="ro-msg" aria-live="polite">${st.msg}</p>
        ${done ? `<div class="callout good">${ex.n} + 1 = <b>${value()}</b></div>` : `<button type="button" class="btn small" data-a="go">${st.step === 0 ? '➕ Add 1 cube' : '🔄 Trade up!'}</button>`}
        ${st.step > 0 ? '<button type="button" class="btn small ghost" data-a="reset">Again ↻</button>' : ''}</div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.i) { ex = EX[+b.dataset.i]; reset(); }
      else if (b.dataset.a === 'reset') reset();
      else if (b.dataset.a === 'go') {
        if (st.step === 0) { st.o++; st.step = 1; st.msg = `Now there are ${st.o} cubes. 10 cubes make 1 rod, so we trade!`; }
        else if (st.o >= 10) { st.o -= 10; st.t++; st.step++; st.msg = st.t >= 10 ? '10 rods! 10 rods make 1 flat. Trade again!' : `Now we have ${st.t} tens and ${st.o} ones.`; }
        else if (st.t >= 10) { st.t -= 10; st.h++; st.step++; st.msg = `Now we have ${st.h} hundreds, ${st.t} tens and ${st.o} ones.`; }
      } else return;
      MB.sfx.tap(); draw();
    });
    reset(); draw();
  }

  function betweenDemo(box) {
    let a = 48, shown = false;
    function draw() {
      box.innerHTML = `<div class="bw">
        <div class="bw-row"><span class="bw-n">${a}</span><button type="button" class="bw-q${shown ? ' open' : ''}" data-a="show" aria-label="reveal the middle number">${shown ? a + 1 : '?'}</button><span class="bw-n">${a + 2}</span></div>
        <p class="bw-say">${shown ? `Count up: <b>${a}</b>, <b>${a + 1}</b>, <b>${a + 2}</b>. <b>${a + 1}</b> is between ${a} and ${a + 2}.` : `What number is between ${a} and ${a + 2}? Tap the <b>?</b>`}</p>
        <button type="button" class="btn small ghost" data-a="new">New one ↻</button></div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'show') shown = true; else if (b.dataset.a === 'new') { a = MB.rand(10, 997); shown = false; } else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function learnLine(root) {
    root.innerHTML =
      UI.step(1, 'Walk along the number line', `<p>Numbers sit in order. Going <b>right</b> they get bigger by 1. Going <b>left</b> they get smaller by 1. Tap any number on the line.</p><div data-w="le"></div>
        <div class="callout"><b>Just before</b> = 1 less (− 1)<br><b>Just after</b> = 1 more (+ 1)<br><b>Between</b> = the number in the middle</div>`) +
      UI.step(2, 'Careful at 99 and 199!', `<p>When you add 1 to a number that ends in 9, the digits change. Watch the blocks.</p><div data-w="ro"></div>`) +
      UI.step(3, 'Between two numbers', `<div data-w="bw"></div>`);
    lineExplorer($('[data-w=le]', root)); rollover($('[data-w=ro]', root)); betweenDemo($('[data-w=bw]', root));
  }

  /* =====================================================================
     4. COMPARE & ORDER
     ===================================================================== */
  function cmpWhy(a, b) {
    if (a === b) return `Both numbers are exactly the same, so ${a} = ${b}.`;
    const da = MB.digits(a), db = MB.digits(b), nm = ['hundreds', 'tens', 'ones'], start = (a < 100 && b < 100) ? 1 : 0;
    for (let p = start; p < 3; p++) {
      if (da[p] !== db[p]) {
        const same = nm.slice(start, p);
        return (same.length ? `The ${same.join(' and ')} ${same.length > 1 ? 'are' : 'are'} the same. ` : '') +
          `Look at the ${nm[p]}: ${da[p]} and ${db[p]}. ${Math.max(da[p], db[p])} is bigger, so ${a} ${a > b ? '>' : '<'} ${b}.`;
      }
    }
    return '';
  }
  const symAns = (a, b) => (a > b ? '>' : a < b ? '<' : '=');
  const symQ = (a, b) => ({
    kind: 'fill', prompt: 'Fill in the box with <b>&lt;</b>, <b>&gt;</b> or <b>=</b>.',
    tpl: `<div class="cmp"><span>${a}</span> {0} <span>${b}</span></div>`, blanks: [{ kind: 'sym', ans: symAns(a, b) }],
    hint: 'Compare the hundreds first. If they match, compare the tens, then the ones.', explain: cmpWhy(a, b)
  });

  function swapPair() {
    const n = G.distinct3(), d = MB.digits(n);
    return Math.random() < 0.5 ? [n, d[0] * 100 + d[2] * 10 + d[1]] : [n, d[1] * 100 + d[0] * 10 + d[2]];
  }
  function fourNums() {
    const h = MB.rand(1, 8), set = new Set();
    while (set.size < 4) set.add((Math.random() < 0.6 ? h : MB.rand(1, 9)) * 100 + MB.rand(0, 9) * 10 + MB.rand(0, 9));
    return Array.from(set);
  }

  function genCompare() {
    const qs = [];
    let a = MB.rand(11, 98), b = MB.rand(11, 98); while (a === b) b = MB.rand(11, 98);
    qs.push(symQ(a, b));
    let p = swapPair(); qs.push(symQ(p[0], p[1]));
    p = swapPair();
    qs.push(G.choice(`Which is <b>greater</b>: <b>${p[0]}</b> or <b>${p[1]}</b>?`, String(Math.max(p[0], p[1])), [String(Math.min(p[0], p[1]))], { cols: 2, big: true, hint: 'Compare the hundreds first, then the tens.', explain: cmpWhy(p[0], p[1]) }));
    const e = MB.rand(100, 999); qs.push(symQ(e, e));
    p = swapPair();
    qs.push(G.choice(`Which is <b>smaller</b>: <b>${p[0]}</b> or <b>${p[1]}</b>?`, String(Math.min(p[0], p[1])), [String(Math.max(p[0], p[1]))], { cols: 2, big: true, hint: 'Compare the hundreds first, then the tens.', explain: cmpWhy(p[0], p[1]) }));
    const asc = fourNums();
    qs.push({ kind: 'order', dir: 'asc', items: asc, prompt: 'Arrange these numbers in <b>ascending</b> order.', hint: 'Ascending means smallest to biggest.', explain: 'Smallest to biggest: ' + asc.slice().sort((x, y) => x - y).join(', ') + '.' });
    const desc = fourNums();
    qs.push({ kind: 'order', dir: 'desc', items: desc, prompt: 'Arrange these numbers in <b>descending</b> order.', hint: 'Descending means biggest to smallest.', explain: 'Biggest to smallest: ' + desc.slice().sort((x, y) => y - x).join(', ') + '.' });
    const sg = MB.pick([['Write the <b>smallest 3-digit</b> number.', 100, '100 has 1 hundred, 0 tens and 0 ones. 99 is only a 2-digit number.'],
      ['Write the <b>greatest 3-digit</b> number.', 999, 'Nine is the biggest digit, so use it in every place.'],
      ['Write the <b>greatest 2-digit</b> number.', 99, 'Nine is the biggest digit, so use it in both places.'],
      ['Write the <b>smallest 2-digit</b> number.', 10, '10 has 1 ten and 0 ones. A 2-digit number cannot start with 0.']]);
    qs.push(G.num(sg[0], sg[1], { hint: sg[2], explain: sg[2] }));
    return qs;
  }

  function digitDuel(box) {
    const PRE = [[298, 289], [145, 154], [199, 189], [178, 178]];
    let pair = PRE[0], step = 0;
    function verdict() { return pair[0] === pair[1] ? '=' : pair[0] > pair[1] ? '>' : '<'; }
    function draw() {
      const A = MB.digits(pair[0]), B = MB.digits(pair[1]), nm = ['Hundreds', 'Tens', 'Ones'];
      // find deciding column
      let decide = 3; for (let p = 0; p < 3; p++) if (A[p] !== B[p]) { decide = p; break; }
      const upTo = Math.min(step, decide + 1, 3);
      let msg;
      if (step === 0) msg = 'Press <b>Next step</b>. We always start with the biggest place.';
      else {
        const p = upTo - 1;
        if (A[p] === B[p] && p < 2) msg = `${nm[p]}: ${A[p]} and ${B[p]} are the <b>same</b>. Check the next place.`;
        else if (A[p] === B[p]) msg = `${nm[p]}: ${A[p]} and ${B[p]} are the same. All places match, so the numbers are <b>equal</b>.`;
        else msg = `${nm[p]}: <b>${Math.max(A[p], B[p])}</b> is bigger than ${Math.min(A[p], B[p])}. We can stop. We have our answer!`;
      }
      const finished = step > 0 && (upTo - 1 === decide || (decide === 3 && upTo === 3));
      const v = verdict();
      const cell = (arr, p) => `<td class="${p === upTo - 1 && step > 0 ? 'hl' : ''} ${p < upTo - 1 ? 'same' : ''}">${arr[p]}</td>`;
      box.innerHTML = `<div class="dd">
        <div class="presets">${PRE.map((q, i) => `<button type="button" class="chip${q === pair ? ' on' : ''}" data-i="${i}">${q[0]} vs ${q[1]}</button>`).join('')}<button type="button" class="chip" data-a="rand">🎲 random</button></div>
        <table class="dd-t"><thead><tr><th></th>${nm.map((x, i) => `<th class="c${'hto'[i]}">${x}</th>`).join('')}</tr></thead>
        <tbody><tr><th>${pair[0]}</th>${[0, 1, 2].map(p => cell(A, p)).join('')}</tr><tr><th>${pair[1]}</th>${[0, 1, 2].map(p => cell(B, p)).join('')}</tr></tbody></table>
        <p class="dd-msg" aria-live="polite">${msg}</p>
        ${finished ? `<div class="dd-end">${v === '=' ? '<span class="twins">👯</span>' : V.chomper(v === '<' ? 'right' : 'left')}<div class="dd-sym"><span>${pair[0]}</span><b>${v}</b><span>${pair[1]}</span></div></div>
          <p class="dd-say">${cmpWhy(pair[0], pair[1])}</p>` : ''}
        <div class="row"><button type="button" class="btn small" data-a="next" ${finished ? 'disabled' : ''}>Next step ▶</button><button type="button" class="btn small ghost" data-a="again">Again ↻</button></div></div>`;
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.i) { pair = PRE[+b.dataset.i]; step = 0; }
      else if (b.dataset.a === 'rand') { pair = swapPair(); if (Math.random() < 0.5) pair = pair.reverse(); step = 0; }
      else if (b.dataset.a === 'next') step++;
      else if (b.dataset.a === 'again') step = 0;
      else return;
      MB.sfx.tap(); draw();
    });
    draw();
  }

  function chomperExplain() {
    return `<div class="chomps">
      <div class="chomp-ex">${V.chomper('right')}<div class="cmp-big"><span>3</span><b>&lt;</b><span>8</span></div><small>The mouth opens to the <b>bigger</b> number.</small></div>
      <div class="chomp-ex">${V.chomper('left')}<div class="cmp-big"><span>9</span><b>&gt;</b><span>4</span></div><small>9 is bigger, so the mouth opens to 9.</small></div>
      <div class="chomp-ex"><span class="twins">👯</span><div class="cmp-big"><span>6</span><b>=</b><span>6</span></div><small>Same number? Two lines, like twins.</small></div></div>`;
  }

  function orderGame(box) {
    let dir = 'asc', items = fourNums(), ctl, done = false;
    function start() {
      done = false;
      box.innerHTML = `<div class="og"><div class="presets"><button type="button" class="chip${dir === 'asc' ? ' on' : ''}" data-dir="asc">↗ Ascending</button><button type="button" class="chip${dir === 'desc' ? ' on' : ''}" data-dir="desc">↘ Descending</button></div>
        <div class="og-area"></div><p class="og-msg" aria-live="polite"></p><div class="row"><button type="button" class="btn small" data-a="check" disabled>Check</button><button type="button" class="btn small ghost" data-a="new">New numbers ↻</button></div></div>`;
      ctl = MB.UI.order($('.og-area', box), items, dir, () => { $('[data-a=check]', box).disabled = !ctl.complete(); $('.og-msg', box).textContent = ''; });
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.dir) { dir = b.dataset.dir; start(); }
      else if (b.dataset.a === 'new') { items = fourNums(); start(); }
      else if (b.dataset.a === 'check') {
        const want = items.slice().sort((x, y) => dir === 'desc' ? y - x : x - y), got = ctl.get(), ok = want.every((v, i) => v === got[i]);
        $('.og-msg', box).innerHTML = ok ? '🎉 Perfect! ' + got.join(' ' + (dir === 'asc' ? '<' : '>') + ' ') : 'Not yet. Tap a number to take it back, then try again.';
        if (ok) { MB.sfx.ok(); ctl.lock(); b.disabled = true; } else MB.sfx.no();
      }
    });
    start();
  }

  function learnCompare(root) {
    root.innerHTML =
      UI.step(1, 'The big place wins', `<p>To compare two numbers, start at the <b>left</b> (the biggest place). If the digits are the same, move one place to the right.</p><div data-w="dd"></div>`) +
      UI.step(2, 'The hungry chomper', `<p>The symbols <b>&lt;</b> and <b>&gt;</b> look like a mouth. The mouth always opens toward the <b>bigger</b> number, because it wants the bigger meal!</p>${chomperExplain()}`) +
      UI.step(3, 'Ascending and descending', `<p><b>Ascending</b> = going <b>up</b> like climbing stairs: smallest to biggest.<br><b>Descending</b> = going <b>down</b> like a slide: biggest to smallest.</p><div data-w="og"></div>`) +
      UI.step(4, 'Smallest and greatest', `<div class="facts">
        <div class="fact"><small>smallest 2-digit</small><b>10</b></div><div class="fact"><small>greatest 2-digit</small><b>99</b></div>
        <div class="fact"><small>smallest 3-digit</small><b>100</b></div><div class="fact"><small>greatest 3-digit</small><b>999</b></div></div>
        <div class="callout">Remember: 99 + 1 = 100. A 2-digit number cannot start with 0, so the smallest 3-digit number is 100, not 99.</div>`);
    digitDuel($('[data-w=dd]', root)); orderGame($('[data-w=og]', root));
  }

  /* ---------- register ---------- */
  MB.QB = Object.assign(MB.QB || {}, { nameQ, numQ, symQ, expQ, cmpWhy });
  MB.topics.push(
    { id: 'names', title: 'Number Names', emoji: '🔤', tc: 'tc-names', blurb: 'Write numbers in words', mock: 3, learn: learnNames, gen: genNames },
    { id: 'place', title: 'Place Value', emoji: '🧱', tc: 'tc-place', blurb: 'Hundreds, tens, ones and expanded form', mock: 3, learn: learnPlace, gen: genPlace },
    { id: 'line', title: 'Before, After, Between', emoji: '🧭', tc: 'tc-line', blurb: 'Walk along the number line', mock: 3, learn: learnLine, gen: genLine },
    { id: 'compare', title: 'Compare & Order', emoji: '⚖️', tc: 'tc-compare', blurb: 'Greater, smaller, equal', mock: 3, learn: learnCompare, gen: genCompare }
  );
})();
