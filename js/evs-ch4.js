/* Study Buddy - EVS Chapter 4: Getting to Know Plants (Our Wondrous World, Class 3) */
(function () {
  'use strict';
  const MB = window.MB, V = MB.V, G = MB.G, UI = MB.UI, W = MB.W;
  const $ = (s, r) => MB.$(s, r);
  const TC = 'tc-plants';

  /* ---------- tomato plant diagram ---------- */
  const PARTS = {
    roots: { name: 'Roots', note: 'Roots grow <b>under the ground</b>. They <b>hold the plant firmly in the soil</b> and <b>absorb water and minerals</b>.' },
    stem: { name: 'Stem', note: 'The stem <b>holds the plant upright</b>. Branches grow out of it.' },
    leaf: { name: 'Leaf', note: 'Leaves are green. They <b>prepare food for the plant</b>.' },
    flower: { name: 'Flower', note: 'The flower is the <b>colourful part</b> that <b>attracts insects</b>. It <b>develops into a fruit</b>.' },
    fruit: { name: 'Fruit', note: 'The fruit <b>protects the seeds</b>. The tomato is the fruit of the plant.' },
    seed: { name: 'Seed', note: 'Seeds are <b>inside the fruit</b>. A seed can grow into a new plant.' }
  };
  const RING = {
    roots: '<ellipse cx="150" cy="305" rx="66" ry="46"/>',
    stem: '<rect x="128" y="92" width="44" height="104" rx="22"/>',
    leaf: '<ellipse cx="216" cy="166" rx="36" ry="25"/>',
    flower: '<circle cx="150" cy="58" r="28"/>',
    fruit: '<circle cx="214" cy="212" r="27"/>',
    seed: '<circle cx="248" cy="322" r="28"/>'
  };
  /* hl = part to circle, hot = make every part tappable (data-p) */
  V.plant = function (o) {
    o = o || {};
    let s = '<svg class="plant" viewBox="0 0 300 380" role="img" aria-label="A tomato plant">';
    s += '<rect x="0" y="250" width="300" height="130" class="pl-soil"/><path d="M0 250H300" class="pl-gl"/>';
    s += '<g class="pl-roots"><path d="M150 250 C148 285 150 312 147 350"/><path d="M149 268 C126 284 106 300 92 328"/><path d="M151 270 C176 288 196 300 210 332"/><path d="M148 300 C134 308 122 318 114 342"/><path d="M150 304 C166 314 178 324 184 348"/><path d="M110 296 C100 300 90 302 80 300"/><path d="M190 298 C202 300 212 300 222 296"/></g>';
    s += '<g class="pl-stem"><path d="M150 250 C146 200 154 150 150 70"/><path d="M150 205 C130 195 112 182 96 166"/><path d="M150 175 C172 170 190 168 206 168"/><path d="M150 218 C130 208 112 202 102 203"/><path d="M150 205 C172 196 196 192 212 196"/><path d="M150 130 C136 122 124 112 116 100"/><path d="M150 150 C165 140 176 130 184 122"/></g>';
    s += '<g class="pl-leaves"><ellipse cx="92" cy="158" rx="24" ry="12" transform="rotate(-40 92 158)"/><ellipse cx="216" cy="166" rx="28" ry="14" transform="rotate(-8 216 166)"/><ellipse cx="112" cy="94" rx="22" ry="11" transform="rotate(-55 112 94)"/><ellipse cx="190" cy="116" rx="22" ry="11" transform="rotate(-25 190 116)"/><ellipse cx="130" cy="190" rx="18" ry="9" transform="rotate(20 130 190)"/></g>';
    s += '<g class="pl-fruit"><circle cx="100" cy="218" r="15"/><circle cx="214" cy="212" r="16"/></g>';
    s += '<g class="pl-cap"><path d="M92 206 l8 6 l8 -6"/><path d="M206 200 l8 6 l8 -6"/></g>';
    s += '<g class="pl-flower"><circle cx="150" cy="48" r="7"/><circle cx="160" cy="56" r="7"/><circle cx="156" cy="68" r="7"/><circle cx="144" cy="68" r="7"/><circle cx="140" cy="56" r="7"/><circle class="mid" cx="150" cy="59" r="5"/></g>';
    s += '<g class="pl-flower"><circle cx="190" cy="92" r="4.5"/><circle cx="196" cy="97" r="4.5"/><circle cx="193" cy="104" r="4.5"/><circle cx="187" cy="104" r="4.5"/><circle cx="184" cy="97" r="4.5"/><circle class="mid" cx="190" cy="98" r="3"/></g>';
    s += '<g class="pl-seed"><circle class="slice" cx="248" cy="322" r="22"/><circle class="in" cx="248" cy="322" r="14"/>' +
      '<ellipse cx="242" cy="316" rx="3.4" ry="2.2"/><ellipse cx="253" cy="318" rx="3.4" ry="2.2"/><ellipse cx="246" cy="327" rx="3.4" ry="2.2"/><ellipse cx="256" cy="328" rx="3.4" ry="2.2"/></g>';
    if (o.hl) s += '<g class="pl-ring">' + RING[o.hl] + '</g>';
    if (o.hot) s += '<g class="pl-hots">' + Object.keys(RING).map(k => RING[k].replace('/>', ' class="pl-hit" data-p="' + k + '" tabindex="0" role="button" aria-label="' + PARTS[k].name + '"/>')).join('') + '</g>';
    return s + '</svg>';
  };

  function plantExplorer(box) {
    let mode = 'learn', sel = null, target = null, solved = false, wrong = [];
    const keys = Object.keys(PARTS);
    function newTarget() { target = MB.pick(keys.filter(k => k !== target)); solved = false; wrong = []; }
    function draw() {
      const ring = mode === 'learn' ? sel : target;
      let say;
      if (mode === 'learn') say = sel ? `<b>${PARTS[sel].name}.</b> ${PARTS[sel].note}` : 'Tap a part of the tomato plant, or tap a name.';
      else say = solved ? `✅ Yes, it is the <b>${PARTS[target].name.toLowerCase()}</b>! ${PARTS[target].note}` : (wrong.length ? '❌ Not that one. Try again!' : 'Which part is inside the dotted ring?');
      box.innerHTML = `<div class="px">
        <div class="presets seg" role="group"><button type="button" class="chip${mode === 'learn' ? ' on' : ''}" data-m="learn">📖 Learn the parts</button><button type="button" class="chip${mode === 'quiz' ? ' on' : ''}" data-m="quiz">🎯 Quiz me</button></div>
        <div class="px-fig">${V.plant({ hl: ring, hot: mode === 'learn' })}</div>
        <p class="px-say" aria-live="polite">${say}</p>
        <div class="presets">${keys.map(k => `<button type="button" class="chip${mode === 'learn' && sel === k ? ' on' : ''}${wrong.indexOf(k) >= 0 ? ' bad' : ''}${solved && target === k ? ' on' : ''}" data-k="${k}" ${solved ? 'disabled' : ''}>${PARTS[k].name}</button>`).join('')}</div>
        ${mode === 'quiz' && solved ? '<button type="button" class="btn small" data-a="next">Next part ▶</button>' : ''}</div>`;
    }
    function pickPart(k) {
      if (mode === 'learn') { sel = k; MB.sfx.tap(); }
      else if (!solved) { if (k === target) { solved = true; MB.sfx.ok(); } else { wrong.push(k); MB.sfx.no(); } }
      draw();
    }
    box.addEventListener('click', e => {
      const hit = e.target.closest('.pl-hit'); if (hit) return pickPart(hit.dataset.p);
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.m) { mode = b.dataset.m; sel = null; if (mode === 'quiz') newTarget(); MB.sfx.tap(); draw(); }
      else if (b.dataset.k) pickPart(b.dataset.k);
      else if (b.dataset.a === 'next') { newTarget(); MB.sfx.tap(); draw(); }
    });
    box.addEventListener('keydown', e => { const hit = e.target.closest && e.target.closest('.pl-hit'); if (hit && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pickPart(hit.dataset.p); } });
    draw();
  }

  /* ---------- the six kinds of plants ---------- */
  const KINDS = {
    tree: { label: 'Tree', emoji: '🌳', plants: ['Mango', 'Coconut', 'Banyan', 'Khejri', 'Amaltas', 'Jackfruit', 'Peepal', 'Chinar', 'Jamun', 'Apple'], short: 'It has a big trunk of wood and many branches.' },
    shrub: { label: 'Shrub', emoji: '🌹', plants: ['Hibiscus', 'Rose', 'Holy Basil (tulsi)', 'Curry leaf'], short: 'It is medium-sized with several woody stems close to the ground.' },
    herb: { label: 'Herb', emoji: '🌿', plants: ['Mint', 'Tomato', 'Coriander', 'Mustard'], short: 'It is a smaller plant with a soft stem that does not become woody.' },
    grass: { label: 'Grass', emoji: '🌾', plants: ['Wild grass', 'Paddy (rice)', 'Wheat', 'Bajra', 'Jowar', 'Ragi', 'Sugarcane', 'Bamboo'], short: 'Its leaves are thin and flat and its stem is hollow.' },
    climber: { label: 'Climber', emoji: '🧗', plants: ['Money plant', 'Jasmine', 'Bottle gourd', 'Grape vine'], short: 'It has a thin, flexible stem and climbs on other plants for support.' },
    creeper: { label: 'Creeper', emoji: '🎃', plants: ['Watermelon', 'Pumpkin'], short: 'It has a thin, flexible stem and creeps along the ground.' }
  };
  const EMO = { Apple: '\uD83C\uDF4E', 'Grape vine': '\uD83C\uDF47', Mango: '🥭', Coconut: '🥥', Banyan: '🌳', Peepal: '🌳', Rose: '🌹', Hibiscus: '🌺', Tomato: '🍅', Wheat: '🌾', 'Paddy (rice)': '🌾', Bamboo: '🎋', Sugarcane: '🎋', Jasmine: '🌼', Watermelon: '🍉', Pumpkin: '🎃', Mint: '🌿', Coriander: '🌿', 'Money plant': '🌱' };
  const kindOf = (p) => Object.keys(KINDS).filter(k => KINDS[k].plants.indexOf(p) >= 0)[0];

  const KIND_CARDS = [
    { emoji: '🌳', title: 'Trees', text: '<u>Big and strong plants with a thick stem</u>: a big trunk of wood and many <u>branches</u> that spread out with leaves. Roots go <b>deep down into the soil</b>.<br><i>Mango, Apple, Coconut, Banyan, Khejri, Amaltas, Jackfruit, Peepal, Chinar.</i>' },
    { emoji: '🌹', title: 'Shrubs', text: '<u>Small, bushy plants</u> (medium-sized) with <u>several woody stems</u> and branches growing <u>close to the ground</u>.<br><i>Tulsi (Holy Basil), Rose, Hibiscus, Curry leaf.</i>' },
    { emoji: '🌿', title: 'Herbs', text: '<u>Small plants with a green, soft stem</u> that does <u>not become woody</u>.<br><i>Mint, Tomato, Coriander, Mustard.</i>' },
    { emoji: '🌾', title: 'Grasses', text: 'Grasses are <b>types of herbs</b>. Their leaves are <u>thin and flat</u> and their stems are <u>hollow</u>.<br><i>Wild grasses, paddy, wheat, bajra, jowar, ragi, sugarcane, bamboo.</i>' },
    { emoji: '🧗', title: 'Climbers', text: 'Plants that <u>need support to grow upward</u>. They climb on other plants. Some climbers even take their food from the plant they climb.<br><i>Money plant, Grape vine, Jasmine, Bottle gourd.</i>' },
    { emoji: '🎃', title: 'Creepers', text: 'Plants that <u>grow along the ground</u>. They have thin, flexible stems.<br><i>Pumpkin, Watermelon.</i>' }
  ];

  const WALK = [
    { emoji: '🚶🌸', title: 'A walk to school', text: 'Gopu, Simmi and Raj walk to school every day. On the way they see beautiful <b>flowers, mountains and streams</b>. “Isn’t nature amazing?” says Gopu. “There are so many kinds of plants!”', point: 'Plants come in many sizes and shapes: tiny, small, large, bushy, thin and curvy, straight and tall.' },
    { emoji: '🍃✋', title: 'Rough and smooth leaves', text: 'Gopu loves to touch and smell leaves. “Some leaves are <b>rough</b> and some are <b>smooth</b>,” he says. Simmi shows him the <b>jamun</b> tree. It has thick, <b>shiny</b> leaves.', point: 'Leaves can be rough, smooth, thick or shiny.' },
    { emoji: '🌳🟣', title: 'Raj’s special tree', text: 'The jamun is Raj’s special tree. It has tiny <b>white flowers</b>. The little <b>green</b> fruits turn <b>red</b> and then <b>purple</b>. It is fun to walk under the cool shade of trees.', point: 'Jamun fruit: green → red → purple.' }
  ];

  const FACTS = [
    { emoji: '🌾', title: 'Grains', text: 'Paddy (rice), wheat, bajra, jowar and ragi are <b>seeds of large grasses</b>.' },
    { emoji: '🌱', title: 'Pulses', text: 'Toor (pigeon peas), masoor (red lentils), moong (green gram) and urad (black gram) are <b>seeds of shrubs</b>.' },
    { emoji: '🍬', title: 'Sugar', text: '<b>Sugar</b> is made from the stem of the <b>sugarcane</b>.' },
    { emoji: '🎋', title: 'Bamboo', text: 'Bamboo is the <b>tallest grass</b>. It is a special grass that stays alive for <b>longer than a year</b>.' },
    { emoji: '🌺', title: 'Rafflesia', text: 'The <b>Rafflesia</b> seen in <b>Mizoram</b> is the <b>biggest flower</b>. It is as big as an <b>umbrella</b>!' }
  ];

  const BARK = [
    'Touch the bark of a tree and look at it carefully',
    'Press a sheet of paper on the bark',
    'Gently move a crayon or pencil again and again on the paper',
    'Write the name of your tree on the back of the paper',
    'Collect your friends’ papers and guess each tree from its bark pattern'
  ];

  const KIND_CATS = Object.keys(KINDS).map(k => ({ id: k, label: KINDS[k].label, emoji: KINDS[k].emoji }));
  const CLUES = [
    { label: 'I have a big trunk of wood and many branches.', cat: 'tree', why: 'Trees have a big trunk of wood and many branches.' },
    { label: 'My roots go deep down into the soil and I give cool shade.', cat: 'tree', why: 'Trees have roots that go deep into the soil.' },
    { label: 'I am medium-sized with several woody stems close to the ground.', cat: 'shrub', why: 'That describes a shrub.' },
    { label: 'I look bushy. Our tulsi plant at home is like me.', cat: 'shrub', why: 'Tulsi is a shrub.' },
    { label: 'I am a small plant with a soft stem that is not woody.', cat: 'herb', why: 'Herbs have soft stems that do not become woody.' },
    { label: 'My leaves are long, thin and flat and my stem is hollow.', cat: 'grass', why: 'Grasses have thin, flat leaves and hollow stems.' },
    { label: 'I cannot stand up by myself, so I climb on other plants.', cat: 'climber', why: 'Climbers climb on other plants for support.' },
    { label: 'I spread along the ground because I have a thin stem.', cat: 'creeper', why: 'Creepers creep along the ground.' }
  ];
  const NAME_ITEMS = ['Mango', 'Apple', 'Banyan', 'Peepal', 'Coconut', 'Rose', 'Hibiscus', 'Holy Basil (tulsi)', 'Curry leaf', 'Mint', 'Coriander', 'Wheat', 'Bamboo', 'Money plant', 'Grape vine', 'Jasmine', 'Watermelon', 'Pumpkin']
    .map(p => ({ label: p, emoji: EMO[p] || '', cat: kindOf(p), why: p + ' is a ' + KINDS[kindOf(p)].label.toLowerCase() + '. ' + KINDS[kindOf(p)].short }));

  /* ---------- question bank ---------- */
  function typeQ(kind) {
    const p = MB.pick(KINDS[kind].plants);
    let pool = [];
    /* grasses are a type of herb, so never offer a grass as a wrong answer for "herb" */
    Object.keys(KINDS).forEach(k => { if (k !== kind && !(kind === 'herb' && k === 'grass')) pool = pool.concat(KINDS[k].plants); });
    const wrongs = MB.sample(pool, 3);
    return G.choice(`Which of these is a <b>${KINDS[kind].label.toLowerCase()}</b>?`, p, wrongs, { cols: 2, hint: KINDS[kind].short, explain: `<b>${p}</b> is a ${KINDS[kind].label.toLowerCase()}. ${KINDS[kind].short}` });
  }
  function labelQ(part) {
    const names = Object.keys(PARTS).filter(k => k !== part).map(k => PARTS[k].name);
    return G.choice('Which part of the tomato plant is inside the dotted ring?', PARTS[part].name, MB.sample(names, 3), {
      vis: V.plant({ hl: part }), cols: 2, hint: 'Look at where the ring is on the plant. Is it under the ground? Is it red? Is it yellow?', explain: PARTS[part].note.replace(/<\/?b>/g, '')
    });
  }
  function matchKinds() {
    const ks = Math.random() < 0.5 ? ['tree', 'shrub', 'herb', 'climber', 'creeper'] : ['tree', 'shrub', 'grass', 'climber', 'creeper'];
    return G.match('Match each plant with its kind.', ks.map(k => [MB.pick(KINDS[k].plants), KINDS[k].label]), { hint: 'Remember: trees have a big trunk, shrubs are bushy, herbs are soft, climbers climb, creepers creep.', explain: 'Check the six kinds of plants in the lesson.' });
  }

  function bank() {
    const q = [], C = G.choice;
    ['tree', 'shrub', 'herb', 'climber', 'creeper', 'grass'].forEach(k => q.push(typeQ(k)));
    ['roots', 'leaf', 'flower', 'fruit', 'stem', 'seed'].forEach(p => q.push(labelQ(p)));
    q.push(C('Which sentence describes a <b>tree</b>?', 'It has a big trunk of wood and many branches', ['It has a soft stem that does not become woody', 'It is medium-sized with woody stems close to the ground', 'It creeps along the ground'], { cols: 1, hint: 'Think about the trunk.', explain: 'A tree has a <b>big trunk of wood</b> and many branches.' }));
    q.push(C('Which sentence describes a <b>shrub</b>?', 'A medium-sized plant with several woody stems close to the ground', ['A tall plant with a big trunk', 'A plant with a soft stem that is not woody', 'A plant that climbs on other plants'], { cols: 1, hint: 'Shrubs look bushy.', explain: 'A shrub has <b>several woody stems</b> close to the ground.' }));
    q.push(C('Which sentence describes a <b>herb</b>?', 'A smaller plant with a soft stem that does not become woody', ['A tall plant with a big wooden trunk', 'A bushy plant with woody stems', 'A plant that only grows under water'], { cols: 1, hint: 'Think about the stem: soft or woody?', explain: 'A herb has a <b>soft stem that does not become woody</b>.' }));
    q.push(C('What do climbers do?', 'They climb on other plants for support', ['They creep along the ground', 'They grow a big wooden trunk', 'They live only under the ground'], { cols: 1, hint: 'The name tells you.', explain: 'Climbers <b>climb on other plants</b> for support.' }));
    q.push(C('What do creepers do?', 'They creep along the ground', ['They climb tall trees', 'They grow a big wooden trunk', 'They float on water'], { cols: 1, hint: 'The name tells you.', explain: 'Creepers <b>creep along the ground</b>.' }));
    q.push(C('Which of these is NOT a part of a plant?', 'Wings', ['Roots', 'Stem', 'Flower'], { cols: 2, hint: 'Plants do not fly.', explain: 'Plants have roots, stems, leaves, flowers, fruits and seeds. They do not have wings.' }));
    q.push(C('Bamboo is a special kind of grass. What is special about it?', 'It stays alive for longer than a year', ['It has no leaves', 'It grows only in water', 'It is very short'], { cols: 1, hint: 'Most grasses live for a short time.', explain: 'Bamboo stays alive <b>longer than just a year</b>.' }));
    q.push(G.tf('The roots of a tree go deep down into the soil.', true, { hint: 'Think about what holds a big tree in place.', explain: 'Yes, trees have roots that go <b>deep down into the soil</b>.' }));
    q.push(G.tf('A money plant can stand up by itself.', false, { hint: 'It has a long and thin stem.', explain: 'No. A money plant has a long, thin stem and <b>cannot stand up by itself</b>.' }));
    q.push(G.tf('Some climbers take their food from the plant on which they climb.', true, { hint: 'Read the box about climbers and creepers.', explain: 'Yes, some climbers even take their food from the plant they climb.' }));
    q.push(G.tf('The stems of grasses are hollow.', true, { hint: 'Think about what is inside a grass stem.', explain: 'Yes, grasses have <b>hollow</b> stems and thin, flat leaves.' }));
    q.push(G.tf('Grasses are types of herbs.', true, { hint: 'Both have soft green stems.', explain: 'Yes, <b>grasses are types of herbs</b>.' }));
    q.push(G.tf('Pulses like toor and moong are seeds of large grasses.', false, { hint: 'Pulses and grains come from different plants.', explain: 'No. Pulses are seeds of <b>shrubs</b>. Grains like wheat and rice are seeds of large grasses.' }));
    q.push(G.word('Our tulsi plant at home is a ___.', ['shrub', 'shrubs'], { hint: 'It is medium-sized with woody stems.', explain: 'Tulsi (Holy Basil) is a <b>shrub</b>.' }));
    q.push(G.word('Grasses are types of ___.', ['herbs', 'herb'], { hint: 'They have soft, green stems.', explain: 'Grasses are types of <b>herbs</b>.' }));
    q.push(G.word('Pulses like toor, masoor, moong and urad are seeds of ___.', ['shrubs', 'shrub'], { hint: 'They are not trees and not grasses.', explain: 'Pulses are seeds of <b>shrubs</b>.' }));
    q.push(G.word('Paddy, wheat, bajra, jowar and ragi are seeds of large ___.', ['grasses', 'grass'], { hint: 'They are grains.', explain: 'Grains are seeds of large <b>grasses</b>.' }));
    q.push(G.word('Sugar is produced from the stem of the ___ plant.', ['sugarcane', 'sugar cane'], { hint: 'It is a tall sweet grass.', explain: 'Sugar comes from <b>sugarcane</b>.' }));
    q.push(G.word('The tallest grass is ___.', ['bamboo'], { hint: 'It is used to make sticks and baskets.', explain: '<b>Bamboo</b> is the tallest grass.' }));
    q.push(G.word('The Rafflesia, the biggest flower, is as big as an ___.', ['umbrella'], { hint: 'You use it in the rain.', explain: 'The Rafflesia is as big as an <b>umbrella</b>.' }));
    q.push(G.word('The Rafflesia flower was seen in ___.', ['mizoram'], { hint: 'It is a state in the north-east of India.', explain: 'The Rafflesia was seen in <b>Mizoram</b>.' }));
    q.push(G.word('If a money plant finds nothing to climb on, it creeps and spreads on the ___.', ['ground', 'floor'], { hint: 'Think about where creepers grow.', explain: 'It creeps and spreads on the <b>ground</b>.' }));
    q.push(G.word('Bark is the hard outer covering of a tree ___.', ['trunk'], { hint: 'It is the thick wooden part.', explain: 'Bark covers the tree <b>trunk</b>.' }));
    q.push(G.word('Raj’s special tree is the ___ tree.', ['jamun'], { hint: 'Its fruits turn purple.', explain: 'Raj’s special tree is the <b>jamun</b>.' }));
    q.push(G.order('The jamun fruit changes colour. Put the colours in order.', ['Green', 'Red', 'Purple'], { hint: 'Raj remembered the little green fruits first.', explain: 'The little fruits are green, then turn red and finally purple.' }));
    q.push(G.order('Put the steps of the bark activity in order.', BARK, { hint: 'First touch the bark, last guess the tree.', explain: 'Touch the bark, press paper, rub with a crayon, write the name, and then guess.' }));
    q.push(matchKinds());
    q.push(G.match('Match each pulse with what it is.', [['Toor', 'Pigeon peas'], ['Masoor', 'Red lentils'], ['Moong', 'Green gram'], ['Urad', 'Black gram']], { hint: 'The names in brackets in the book help you.', explain: 'Toor = pigeon peas, masoor = red lentils, moong = green gram, urad = black gram.' }));
    q.push(G.sort('Sort these plants into trees, shrubs and herbs.', [{ id: 'tree', label: 'Tree' }, { id: 'shrub', label: 'Shrub' }, { id: 'herb', label: 'Herb' }],
      [[MB.pick(KINDS.tree.plants.slice(0, 3)), 'tree'], [MB.pick(KINDS.tree.plants.slice(3)), 'tree'], [MB.pick(KINDS.shrub.plants.slice(0, 2)), 'shrub'], [MB.pick(KINDS.shrub.plants.slice(2)), 'shrub'], [MB.pick(KINDS.herb.plants.slice(0, 2)), 'herb'], [MB.pick(KINDS.herb.plants.slice(2)), 'herb']],
      { hint: 'Trees have a trunk, shrubs are bushy, herbs have soft stems.', explain: 'Mango, Banyan, Peepal … are trees. Rose, Hibiscus, tulsi … are shrubs. Mint, Tomato, Coriander … are herbs.' }));
    q.push(G.sort('Which of these are climbers and which are creepers?', [{ id: 'climber', label: 'Climber' }, { id: 'creeper', label: 'Creeper' }],
      [['Money plant', 'climber'], ['Jasmine', 'climber'], ['Bottle gourd', 'climber'], ['Watermelon', 'creeper'], ['Pumpkin', 'creeper']],
      { hint: 'Climbers climb up. Creepers spread along the ground.', explain: 'Money plant, jasmine and bottle gourd are climbers. Watermelon and pumpkin are creepers.' }));

    q.push(G.self('How are climbers different from creepers?', '<b>Climbers</b> climb on other plants for support (money plant, jasmine). <b>Creepers</b> creep along the ground (pumpkin, watermelon). Both have thin, flexible stems.'));
    q.push(G.self('Name the parts of a plant.', 'The parts of a plant are the <b>roots, stem, leaves, flowers, fruits and seeds</b>.'));
    q.push(G.self('Why does a money plant climb on other things?', 'A money plant has a <b>long and thin stem</b> and <b>cannot stand up by itself</b>. If it finds nothing to climb on, it creeps and spreads on the ground.'));
    q.push(G.self('What are grains and pulses? Give examples.', '<b>Grains</b> like paddy (rice), wheat, bajra, jowar and ragi are seeds of large <b>grasses</b>. <b>Pulses</b> like toor, masoor, moong and urad are seeds of <b>shrubs</b>.'));
    q.push(C('What do plants need to grow?', 'Air, water, sunlight and nutrients', ['Only toys and sweets', 'Darkness and ice', 'Only sand'], { cols: 1, hint: 'Plants are living things.', explain: 'Plants are living things. They need <b>air, water, sunlight and nutrients</b> to grow.' }));
    q.push(G.tf('Plants are living things.', true, { hint: 'Plants grow and need food, air and water.', explain: 'Yes, plants are <b>living things</b>.' }));
    const fn = (prompt, right, key) => C(prompt, right, MB.sample(Object.keys(PARTS).filter(k => k !== key).map(k => PARTS[k].name), 3), { cols: 2, hint: 'Think about the job each part of the plant does.', explain: PARTS[key].note.replace(/<\/?b>/g, '') });
    q.push(fn('Which part of the plant holds it upright?', 'Stem', 'stem'));
    q.push(fn('Which part of the plant absorbs water and minerals from the soil?', 'Roots', 'roots'));
    q.push(fn('Which part of the plant holds it firmly in the soil?', 'Roots', 'roots'));
    q.push(fn('Which part of the plant prepares food?', 'Leaf', 'leaf'));
    q.push(fn('Which colourful part of the plant attracts insects?', 'Flower', 'flower'));
    q.push(fn('Which part of the plant develops into a fruit?', 'Flower', 'flower'));
    q.push(fn('Which part of the plant protects the seeds?', 'Fruit', 'fruit'));
    q.push(G.match('Match each part of the plant with its job.', [
      ['Roots', 'Hold the plant in the soil and absorb water'], ['Stem', 'Holds the plant upright'], ['Leaf', 'Prepares food for the plant'],
      ['Flower', 'Attracts insects and becomes a fruit'], ['Fruit', 'Protects the seeds']
    ], { hint: 'Think about what each part does for the plant.', explain: 'Roots absorb water, the stem holds the plant up, leaves make food, flowers attract insects and become fruits, and fruits protect the seeds.' }));
    MB.NB.questions('plants').forEach(x => q.push(x));
    return q;
  }

  /* ---------- the lesson ---------- */
  const NEEDS = [
    { emoji: '💨', title: 'Air', text: 'Plants need <b>air</b> to grow.' },
    { emoji: '💧', title: 'Water', text: 'Plants need <b>water</b> to grow.' },
    { emoji: '☀️', title: 'Sunlight', text: 'Plants need <b>sunlight</b> to grow.' },
    { emoji: '🌱', title: 'Nutrients', text: 'Plants need <b>nutrients</b> from the soil to grow.' }
  ];
  const JOBS = [
    { emoji: '🧬', title: 'Roots', text: 'Roots <b>hold the plant firmly in the soil</b> and <b>absorb water and minerals</b>.' },
    { emoji: '🌿', title: 'Stem', text: 'The stem <b>holds the plant upright</b>.' },
    { emoji: '🍃', title: 'Leaf', text: 'Leaves <b>prepare food for the plant</b>.' },
    { emoji: '🌼', title: 'Flower', text: 'The flower is the <b>colourful part that attracts insects</b>. It <b>develops into a fruit</b>.' },
    { emoji: '🍅', title: 'Fruit', text: 'The fruit <b>protects the seeds</b>. Fruits contain seeds.' }
  ];

  function learn(root) {
    root.innerHTML =
      UI.step(1, 'What is a plant?', '<div class="callout"><b>Plants are living things.</b> They need <b>air, water, sunlight and nutrients</b> to grow.</div><p>Tap each card.</p><div data-w="needs"></div>') +
      UI.step(2, 'A walk with Gopu, Simmi and Raj', '<p>Meet three friends who love plants. Tap <b>Next</b>.</p><div data-w="walk"></div>') +
      UI.step(3, 'Six kinds of plants', '<p>Tap each card. The <u>underlined</u> words are the ones to remember for your exam.</p><div data-w="kinds"></div>') +
      UI.step(4, 'Tree, shrub or herb?', `<div class="tablewrap"><table class="ft cmp3"><thead><tr><th></th><th>🌳 Tree</th><th>🌹 Shrub</th><th>🌿 Herb</th></tr></thead><tbody>
        <tr><th>Size</th><td>Big and strong</td><td>Small, bushy</td><td>Small</td></tr>
        <tr><th>Stem</th><td>Thick stem, big trunk of wood</td><td>Several woody stems</td><td>Soft, green, not woody</td></tr>
        <tr><th>Branches</th><td>Many, spread out</td><td>Close to the ground</td><td>Few or none</td></tr>
        <tr><th>Examples</th><td>Mango, Apple, Banyan</td><td>Tulsi, Rose</td><td>Mint, Tomato</td></tr></tbody></table></div>`) +
      UI.step(5, 'Which kind am I?', '<p>Read the clue. Which kind of plant is it?</p><div data-w="clues"></div>') +
      UI.step(6, 'Sort the plants', '<p>Now sort real plants into their kinds.</p><div data-w="names"></div>') +
      UI.step(7, 'Parts of a plant', '<p>A plant has roots, a stem, leaves, flowers, fruits and seeds. Tap a part of the <b>tomato plant</b> to see its job.</p><div data-w="parts"></div>') +
      UI.step(8, 'The job of each part', '<p>Tap each card. These are the answers for your notebook.</p><div data-w="jobs"></div>') +
      UI.step(9, 'Do you know?', '<div data-w="facts"></div>') +
      UI.step(10, 'Get to know barks', '<p><b>Bark</b> is the hard outer covering of a tree trunk. Here is how to make a bark rubbing. Put the steps in order.</p><div data-w="bark"></div>') +
      UI.step(11, 'Quick check', '<div data-w="try"></div>');
    W.cards($('[data-w=needs]', root), NEEDS, {});
    W.story($('[data-w=walk]', root), WALK);
    W.cards($('[data-w=kinds]', root), KIND_CARDS, { cols: 1 });
    W.sortGame($('[data-w=clues]', root), { items: CLUES, cats: KIND_CATS, n: 6, noun: 'Clue', ask: 'Which kind of plant am I?' });
    W.sortGame($('[data-w=names]', root), { items: NAME_ITEMS, cats: KIND_CATS, n: 8, noun: 'Plant', ask: 'Which kind of plant is this?' });
    plantExplorer($('[data-w=parts]', root));
    W.cards($('[data-w=jobs]', root), JOBS, { cols: 1 });
    W.cards($('[data-w=facts]', root), FACTS, { cols: 1 });
    W.orderGame($('[data-w=bark]', root), { seq: BARK });
    W.tryIt($('[data-w=try]', root), () => G.pickMix(bank(), 3), TC);
  }

  MB.QB = Object.assign(MB.QB || {}, { plantParts: PARTS });
  MB.topics.push({
    id: 'plants', subject: 'evs', title: 'Getting to Know Plants', emoji: '🌿', tc: TC, blurb: 'Chapter 4 · Trees, shrubs, herbs and more',
    mock: 7, learn: learn, bank: bank, gen: () => G.pickMix(bank(), 8)
  });
})();
