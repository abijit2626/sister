/* Study Buddy - EVS Chapter 5: Plants and Animals Live Together (Our Wondrous World, Class 3) */
(function () {
  'use strict';
  const MB = window.MB, G = MB.G, UI = MB.UI, W = MB.W;
  const $ = (s, r) => MB.$(s, r);
  const TC = 'tc-pa';
  const card = (e, label) => `<span class="oemo">${e}</span><span class="olab">${label}</span>`;

  /* page 63: animals living together with plants */
  const ANIMALS = [
    { emoji: '🐘', title: 'Elephants', text: 'Elephants are <b>feeding on grass</b>.' },
    { emoji: '🦋', title: 'Moth', text: 'A moth is <b>resting on a leaf</b>.' },
    { emoji: '🐛', title: 'Caterpillar', text: 'A caterpillar is <b>chewing a leaf</b>.' },
    { emoji: '🪱', title: 'Earthworms', text: 'Earthworms live on <b>leaves and soil</b>. They live <b>under the ground</b>.' },
    { emoji: '🐦', title: 'Tailorbird', text: 'A tailorbird is <b>singing</b> in a plant.' },
    { emoji: '🐦', title: 'Woodpecker', text: 'A woodpecker is on a <b>tree trunk</b>.' },
    { emoji: '🐜', title: 'Ants', text: 'Ants are building their <b>nest using leaves</b>.' },
    { emoji: '🪲', title: 'Stink bug', text: 'A colourful stink bug is on a <b>leaf</b>.' },
    { emoji: '🐸', title: 'Frog', text: 'A frog is <b>resting on a leaf</b>.' },
    { emoji: '🦋', title: 'Butterfly', text: 'A butterfly is <b>perched on a leaf</b>.' },
    { emoji: '🐿️', title: 'Squirrels', text: 'Squirrels use <b>tree hollows</b> to hide and rest.' },
    { emoji: '🦜', title: 'Barbet', text: 'A barbet uses a <b>tree hollow</b> for nesting.' }
  ];

  /* page 67-68: how animals use plants */
  const USES = [
    { emoji: '🐪', title: 'Camels', text: 'Camels <b>eat the leaves</b> of plants. (Food)' },
    { emoji: '🐒', title: 'Monkeys', text: 'Monkeys love <b>eating the fruits</b> of plants. (Food)' },
    { emoji: '🐦🦋', title: 'Sunbirds and butterflies', text: 'They <b>drink nectar</b> from different flowers. (Food)' },
    { emoji: '🐛', title: 'Caterpillars', text: 'Caterpillars <b>munch on the leaves</b> of plants. (Food)' },
    { emoji: '🦉', title: 'Owls', text: 'Birds like owls use <b>hollows in the trees</b> to bring up their young ones. (Shelter)' },
    { emoji: '🐿️', title: 'Squirrels and crows', text: 'They use <b>twigs</b> from plants to build their nests and bring up their young. (Shelter)' },
    { emoji: '🧵', title: 'Tailorbirds', text: 'Tailorbirds <b>stitch leaves</b> of plants to build their nests. (Shelter)' },
    { emoji: '🦇', title: 'Bats and leopards', text: 'They use the <b>branches of trees</b> to rest and for shelter. (Resting)' }
  ];

  const USE_ITEMS = [
    { label: 'Camels eat the leaves of plants', emoji: '🐪', cat: 'food', why: 'Leaves are food for camels.' },
    { label: 'Monkeys eat the fruits of plants', emoji: '🐒', cat: 'food', why: 'Fruits are food for monkeys.' },
    { label: 'Sunbirds drink nectar from flowers', emoji: '🌺', cat: 'food', why: 'Nectar is food for sunbirds and butterflies.' },
    { label: 'Caterpillars munch on leaves', emoji: '🐛', cat: 'food', why: 'Caterpillars eat leaves.' },
    { label: 'Owls bring up their young in tree hollows', emoji: '🦉', cat: 'shelter', why: 'Hollows in trees are a home for owls and their young.' },
    { label: 'Squirrels and crows build nests with twigs', emoji: '🪹', cat: 'shelter', why: 'Twigs from plants are used to build nests.' },
    { label: 'Tailorbirds stitch leaves to make a nest', emoji: '🧵', cat: 'shelter', why: 'Leaves are stitched together to make a nest.' },
    { label: 'A barbet nests in a tree hollow', emoji: '🦜', cat: 'shelter', why: 'A tree hollow is a nesting place.' },
    { label: 'Bats rest on the branches of trees', emoji: '🦇', cat: 'rest', why: 'Branches are a place to rest.' },
    { label: 'Leopards rest on tree branches', emoji: '🐆', cat: 'rest', why: 'Leopards use branches to rest.' },
    { label: 'A frog rests on a leaf', emoji: '🐸', cat: 'rest', why: 'A leaf is a place to rest.' },
    { label: 'A moth rests on a leaf', emoji: '🦋', cat: 'rest', why: 'A leaf is a place to rest.' }
  ];
  const USE_CATS = [{ id: 'food', label: 'Food', emoji: '🍽️' }, { id: 'shelter', label: 'Shelter / nest', emoji: '🏠' }, { id: 'rest', label: 'Resting', emoji: '😴' }];

  const SOIL_CARDS = [
    { group: 'What is soil made of?', emoji: '🪨', title: 'Broken rocks', text: 'Soil is made from <b>rocks that have broken up into tiny pieces</b>.' },
    { group: 'What is soil made of?', emoji: '🍂', title: 'Old leaves, roots, stems', text: 'It also has <b>old leaves, roots and stems</b>.' },
    { group: 'What is soil made of?', emoji: '🐛', title: 'Living and dead animals', text: 'And <b>living and dead animals</b> like insects.' },
    { group: 'On the top layer of the soil', emoji: '🐜', title: 'Ants', text: 'Ants move around between the grass and the leaves.' },
    { group: 'On the top layer of the soil', emoji: '🐜', title: 'Termites', text: 'Termites are small insects you may find on the top layer of soil.' },
    { group: 'On the top layer of the soil', emoji: '🪲', title: 'Small beetles', text: 'Small beetles also move around on the soil.' },
    { group: 'On the top layer of the soil', emoji: '🦗', title: 'Grasshoppers', text: 'Grasshoppers hop around between the grass and leaves.' },
    { group: 'When it rains', emoji: '🪱', title: 'Earthworms', text: 'Earthworms may appear when it rains.' },
    { group: 'When it rains', emoji: '🐛', title: 'Millipedes', text: 'Millipedes may appear too.' },
    { group: 'When it rains', emoji: '🌱', title: 'More plants', text: 'You may find <b>more grasses and other plants</b> growing in the soil.' }
  ];

  const RAIN = [
    { emoji: '🌧️', title: 'It rains', text: 'When it rains, the soil gets wet. <b>Soil can change its look, feel and smell after rain.</b> Small animals like <b>earthworms and millipedes</b> may appear.', point: 'After rain the soil changes its look, feel and smell. Earthworms and millipedes may appear.' },
    { emoji: '🌱', title: 'More plants grow', text: 'In the monsoon you may find <b>many more plants and animals</b> around. You may find more grasses and other plants growing in the soil.', point: 'In the monsoon there are more plants and animals.' },
    { emoji: '❓', title: 'Where did they come from?', text: 'Seeds of plants can stay in the soil for a long time. They <b>sprout when it rains</b>. Some insects also <b>wait for the rains</b> to come out of the soil. That is why we could not see them earlier.', point: 'Seeds sprout in the rain. Some insects wait for the rain.' }
  ];

  const SOIL_STEPS = [
    'Stand on the soil next to a plant (take off your footwear if you are comfortable)',
    'Pick up a little soil with your hands',
    'Look at it and feel it: is it dry, damp, rough, smooth, hard or grainy?',
    'Look for leaves or insects in the soil',
    'Smell the soil and remember it'
  ];

  /* bird sounds: only the pigeon is from the book, the rest are everyday extras */
  const BIRDS = [
    { e: '🕊️', name: 'Pigeon', sound: 'Gutru Gu', book: true },
    { e: '🐦', name: 'Crow', sound: 'Caw caw' },
    { e: '🐦', name: 'Sparrow', sound: 'Chirp chirp' },
    { e: '🦆', name: 'Duck', sound: 'Quack quack' },
    { e: '🦉', name: 'Owl', sound: 'Hoo hoo' },
    { e: '🐓', name: 'Rooster', sound: 'Cock-a-doodle-doo' }
  ];
  function birdSounds(box) {
    box.innerHTML = `<div class="birds">${BIRDS.map(b => `<button type="button" class="bird${b.book ? ' book' : ''}" data-say="${MB.esc(b.sound)}" aria-label="${b.name} says ${MB.esc(b.sound)}">
        <span class="oemo" aria-hidden="true">${b.e}</span><b>${b.name}</b><span class="snd">🔊 ${b.sound}</span></button>`).join('')}</div>
      <div class="tablewrap"><table class="ft bt"><thead><tr><th>Name of the bird</th><th>Sound made</th></tr></thead><tbody>${BIRDS.map(b =>
        `<tr><th>${b.name}${b.book ? ' <small>from your book</small>' : ''}</th><td>${b.sound}</td></tr>`).join('')}</tbody></table></div>`;
  }

  /* ---------- question bank ---------- */
  function bank() {
    const q = [], C = G.choice;
    q.push(C('Where there are plants, there are ___ too.', 'animals', ['roads', 'schools', 'buses'], { cols: 2, hint: 'Look at the first page of the chapter.', explain: 'Where there are plants, there are <b>animals</b> too.' }));
    q.push(C('Which of these animals lives under the ground?', 'Earthworm', ['Butterfly', 'Woodpecker', 'Tailorbird'], { cols: 2, hint: 'It lives in the soil.', explain: '<b>Earthworms</b> live in the soil, under the ground.' }));
    q.push(C('Elephants are feeding on …', 'grass', ['a tree trunk', 'a rock', 'a roof'], { cols: 2, hint: 'Look at the picture caption on page 63.', explain: 'Elephants feed on <b>grass</b>.' }));
    q.push(C('A woodpecker is on a tree …', 'trunk', ['hollow', 'root', 'flower'], { cols: 2, hint: 'It taps on the wood.', explain: 'A woodpecker is on a tree <b>trunk</b>.' }));
    q.push(C('Which animals use tree hollows to hide and rest?', 'Squirrels', ['Camels', 'Elephants', 'Frogs'], { cols: 2, hint: 'They are small, furry and climb trees.', explain: '<b>Squirrels</b> use tree hollows to hide and rest.' }));
    q.push(C('A barbet uses a tree hollow for …', 'nesting', ['swimming', 'eating fruit only', 'digging'], { cols: 2, hint: 'It is a place to bring up young birds.', explain: 'A barbet uses a tree hollow for <b>nesting</b>.' }));
    q.push(C('Which animals build their nest using leaves?', 'Ants', ['Elephants', 'Camels', 'Monkeys'], { cols: 2, hint: 'They are tiny insects.', explain: '<b>Ants</b> build their nest using leaves.' }));
    q.push(C('What do camels eat?', 'Leaves of plants', ['Nectar from flowers', 'Twigs', 'Rocks'], { cols: 2, hint: 'Camels are plant-eaters.', explain: 'Camels eat the <b>leaves</b> of plants.' }));
    q.push(C('Which animals love eating the fruits of plants?', 'Monkeys', ['Owls', 'Bats', 'Frogs'], { cols: 2, hint: 'They swing from tree to tree.', explain: '<b>Monkeys</b> love eating fruits.' }));
    q.push(C('Which animals drink nectar from flowers?', 'Sunbirds and butterflies', ['Camels and elephants', 'Owls and bats', 'Frogs and worms'], { cols: 1, hint: 'Nectar is the sweet juice in flowers.', explain: '<b>Sunbirds and butterflies</b> drink nectar.' }));
    q.push(C('Which animals use twigs to build their nests?', 'Squirrels and crows', ['Camels and monkeys', 'Frogs and fish', 'Elephants and leopards'], { cols: 1, hint: 'Twigs are thin branches of plants.', explain: '<b>Squirrels and crows</b> use twigs to build nests.' }));
    q.push(C('Which bird stitches leaves to build its nest?', 'Tailorbird', ['Owl', 'Woodpecker', 'Sunbird'], { cols: 2, hint: 'A tailor stitches clothes.', explain: 'The <b>tailorbird</b> stitches leaves together.' }));
    q.push(C('Which birds use hollows in the trees to bring up their young ones?', 'Owls', ['Sunbirds', 'Camels', 'Butterflies'], { cols: 2, hint: 'They come out at night.', explain: '<b>Owls</b> use tree hollows for their young.' }));
    q.push(C('Which animals use tree branches to rest and for shelter?', 'Bats and leopards', ['Camels and monkeys', 'Frogs and worms', 'Ants and owls'], { cols: 1, hint: 'One of them hangs upside down.', explain: '<b>Bats and leopards</b> rest on branches.' }));
    q.push(C('What does a caterpillar do on a plant?', 'It munches on leaves for food', ['It drinks nectar', 'It builds a nest with twigs', 'It sleeps in the soil only'], { cols: 1, hint: 'Think about what a caterpillar eats.', explain: 'Caterpillars <b>munch on leaves</b> for food.' }));
    q.push(C('Soil is made from …', 'rocks broken into tiny pieces, old leaves, roots, stems and animals', ['plastic, glass and metal', 'water and sand only', 'only dry leaves'], { cols: 1, hint: 'Rocks, plants and animals all help make soil.', explain: 'Soil is made from <b>tiny pieces of rocks</b>, old leaves, roots and stems, and living and dead animals.' }));
    q.push(C('Which small animals may appear in the soil when it rains?', 'Earthworms and millipedes', ['Elephants and camels', 'Owls and crows', 'Leopards and bats'], { cols: 1, hint: 'They live in the soil.', explain: '<b>Earthworms and millipedes</b> may appear.' }));
    q.push(C('How does a pigeon sound?', 'Gutru Gu', ['Quack quack', 'Hoo hoo', 'Meow'], { cols: 2, hint: 'Look at the table on page 69.', explain: 'The pigeon says <b>“Gutru Gu”</b>.' }));
    q.push(C('How can you hear bird sounds more clearly?', 'Cup your ears with your hands and face the sound', ['Cover your ears', 'Close your eyes and sing', 'Clap loudly'], { cols: 1, hint: 'The picture shows a boy with his hand near his ear.', explain: 'Cup your ears with your hands and point your face towards the sound.' }));
    q.push(G.word('Soil is made from ___ that have broken up into tiny pieces.', ['rocks', 'rock'], { hint: 'They are very hard and big at first.', explain: 'Soil is made from <b>rocks</b> broken into tiny pieces.' }));
    q.push(G.word('Birds use plants for food, shelter and ___.', ['resting', 'rest'], { hint: 'It is what you do on a bed.', explain: 'Animals use plants for food, shelter and <b>resting</b>.' }));
    q.push(G.word('Seeds in the soil ___ when it rains.', ['sprout', 'grow'], { hint: 'A tiny plant comes out of the seed.', explain: 'Seeds <b>sprout</b> when it rains.' }));
    q.push(G.word('A pigeon says “Gutru ___”.', ['gu'], { hint: 'It is the last short sound.', explain: 'The pigeon says “Gutru <b>Gu</b>”.' }));
    q.push(G.tf('A frog can rest on a leaf.', true, { hint: 'Look at the picture caption on page 63.', explain: 'Yes, a frog was <b>resting on a leaf</b>.' }));
    q.push(G.tf('Earthworms live high up in the trees.', false, { hint: 'Think about where earthworms live.', explain: 'No. Earthworms live in the <b>soil</b>, under the ground.' }));
    q.push(G.tf('Soil has many insects and other creatures living in it.', true, { hint: 'Some are too small to see.', explain: 'Yes, some you can see and some are <b>too small to see</b>.' }));
    q.push(G.tf('You will not find any new plants or animals in the monsoon.', false, { hint: 'The rain brings things out.', explain: 'In the monsoon you may find <b>many more</b> plants and animals.' }));
    q.push(G.tf('Soil is always the same colour everywhere.', false, { hint: 'Look at the different soil pictures on page 64.', explain: 'Soil can be many different colours.' }));
    q.push(G.tf('Animals use different parts of plants for food, shelter and resting.', true, { hint: 'Read the “Do you know?” box on page 67.', explain: 'Yes, animals use <b>leaves, fruits, flowers, twigs, hollows and branches</b> of plants.' }));

    q.push(G.match('Match each animal with what it does.', [
      ['🐘 Elephants', 'Feed on grass'], ['🐛 Caterpillar', 'Chews a leaf'], ['🐸 Frog', 'Rests on a leaf'], ['🐦 Woodpecker', 'Sits on a tree trunk'], ['🐿️ Squirrels', 'Hide and rest in tree hollows']
    ], { hint: 'Think about the pictures on page 63.', explain: 'Check page 63 of your book again.' }));
    q.push(G.match('Match each animal with how it uses plants.', [
      ['🐪 Camels', 'Eat the leaves'], ['🐒 Monkeys', 'Eat the fruits'], ['🦉 Owls', 'Use hollows in trees to bring up young'], ['🧵 Tailorbirds', 'Stitch leaves to make nests'], ['🦋 Butterflies', 'Drink nectar from flowers']
    ], { hint: 'Read the “Do you know?” box on page 67.', explain: 'Animals use plants for food, shelter and resting.' }));
    q.push(G.sort('Do these animals use plants for FOOD, SHELTER (nest) or RESTING?', USE_CATS, [
      ['Camels eat leaves', 'food'], ['Sunbirds drink nectar', 'food'], ['Tailorbirds stitch leaves for a nest', 'shelter'], ['Owls use tree hollows for their young', 'shelter'], ['Bats rest on branches', 'rest'], ['A frog sits on a leaf', 'rest']
    ], { hint: 'Ask: is it eating, making a home, or taking a rest?', explain: 'Leaves, fruits and nectar are food. Hollows and nests are shelter. Branches and leaves are also places to rest.' }));
    q.push(G.order('Put the steps of the soil activity in order.', SOIL_STEPS, { hint: 'First stand on the soil, last smell it.', explain: 'Stand on the soil, pick some up, look and feel, look for leaves or insects, then smell it.' }));
    {
      const insects = MB.sample([['Ants', '🐜'], ['Termites', '🐜'], ['Small beetles', '🪲'], ['Grasshoppers', '🦗']], 2);
      const others = [['Elephants', '🐘'], ['Camels', '🐪'], ['Owls', '🦉'], ['Leopards', '🐆']];
      const items = MB.shuffle(insects.map((x, i) => ({ id: 'g' + i, html: card(x[1], x[0]) })).concat(others.map((x, i) => ({ id: 'b' + i, html: card(x[1], x[0]) }))));
      q.push({ kind: 'pick', need: 2, good: insects.map((x, i) => 'g' + i), items: items, prompt: 'Tap <b>two</b> small animals you may find on the top layer of the soil.', hint: 'Look for tiny insects, not big animals.', explain: 'On the top layer of soil you may find ants, termites, small beetles and grasshoppers.' });
    }
    {
      const good = MB.sample(['Rough', 'Smooth', 'Hard', 'Grainy', 'Damp', 'Dry'], 3), bad = ['Loud', 'Sweet', 'Flying'];
      const items = MB.shuffle(good.map((x, i) => ({ id: 'g' + i, html: `<span class="olab big">${x}</span>` })).concat(bad.map((x, i) => ({ id: 'b' + i, html: `<span class="olab big">${x}</span>` }))));
      q.push({ kind: 'pick', need: 3, good: good.map((x, i) => 'g' + i), items: items, prompt: 'Tap <b>three</b> words that tell how soil can feel.', hint: 'Soil can be dry, damp, rough, smooth, hard or grainy.', explain: 'Soil can feel dry, damp, rough, smooth, hard or grainy.' });
    }

    q.push(G.self('Why do animals choose to live near plants?', 'Plants give animals <b>food</b> (leaves, fruits, nectar), <b>shelter</b> (hollows, branches, twigs for nests) and a place to <b>rest</b> and bring up their young.'));
    q.push(G.self('Give two examples of how birds or animals use plants.', 'Examples: <b>camels eat leaves</b>; <b>monkeys eat fruits</b>; <b>owls use tree hollows</b> for their young; <b>squirrels and crows use twigs</b> to build nests; <b>tailorbirds stitch leaves</b> to make nests; sunbirds and butterflies drink nectar.'));
    q.push(G.self('In the monsoon you find many new plants and animals. Where did they come from? Why could you not see them earlier?', '<b>Seeds</b> of plants can stay in the soil for a long time and <b>sprout when it rains</b>. Some <b>insects wait for the rains</b> to come out of the soil. So we could not see them earlier.'));
    q.push(G.self('Name four small animals you may find on or in the soil.', 'On the top layer: <b>ants, termites, small beetles and grasshoppers</b>. After rain: <b>earthworms and millipedes</b> may also appear.'));
    q.push(G.self('How can you listen to bird sounds more clearly?', 'Close your eyes and listen. <b>Cup your ears with your hands</b> and <b>point your face towards the direction of the sound</b>.'));
    MB.NB.questions('pa').forEach(x => q.push(x));
    return q;
  }

  /* ---------- the lesson ---------- */
  function learn(root) {
    root.innerHTML =
      UI.step(1, 'Who lives with plants?', '<p>Where there are plants, there are <b>animals</b> too: on the plants, around them and even <b>under the ground</b>. Tap each card.</p><div data-w="animals"></div>') +
      UI.step(2, 'How animals use plants', '<div class="callout">Animals, birds and insects use different parts of plants for <b>food</b>, <b>shelter</b> and <b>resting</b>.</div><div data-w="uses"></div>') +
      UI.step(3, 'Food, shelter or resting?', '<p>Sort each one into the right group.</p><div data-w="usesort"></div>') +
      UI.step(4, 'Life in the soil', '<p>Soil is the <b>topmost layer of the Earth’s surface</b>. Tap the cards to see what is in it.</p><div data-w="soil"></div>' +
        '<div class="callout"><b>How does soil feel?</b> It can be <b>dry, damp, rough, smooth, hard or grainy</b>.<br><b>What might you find in it?</b> Leaves, small stones, insects.</div>') +
      UI.step(5, 'Try the soil activity', '<p>Put the steps of the activity in order.</p><div data-w="soilsteps"></div>') +
      UI.step(6, 'After the rain', '<p>Follow what happens when it rains.</p><div data-w="rain"></div>') +
      UI.step(7, 'Different birds, different sounds', '<p>Close your eyes and listen to the birds. Tap a bird to hear its sound. The pigeon is from your book. The others are extras you may have heard.</p><div data-w="birds"></div>' +
        '<div class="callout"><b>Listen at three times:</b> early morning, afternoon and evening. When do you hear the most bird sounds?</div>') +
      UI.step(8, 'Quick check', '<div data-w="try"></div>');
    W.cards($('[data-w=animals]', root), ANIMALS, {});
    W.cards($('[data-w=uses]', root), USES, {});
    W.sortGame($('[data-w=usesort]', root), { items: USE_ITEMS, cats: USE_CATS, n: 8, noun: 'Animal', ask: 'Food, shelter or resting?' });
    W.cards($('[data-w=soil]', root), SOIL_CARDS, {});
    W.orderGame($('[data-w=soilsteps]', root), { seq: SOIL_STEPS });
    W.story($('[data-w=rain]', root), RAIN);
    birdSounds($('[data-w=birds]', root));
    W.tryIt($('[data-w=try]', root), () => G.pickMix(bank(), 3), TC);
  }

  MB.topics.push({
    id: 'pa', subject: 'evs', title: 'Plants and Animals Live Together', emoji: '🐿️', tc: TC, blurb: 'Chapter 5 · Animals, soil and bird sounds',
    mock: 7, learn: learn, bank: bank, gen: () => G.pickMix(bank(), 8)
  });
})();
