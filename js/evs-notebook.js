/* Study Buddy - EVS questions and answers from her notebook (answers her teacher ticked).
   The same questions feed the practice banks and the "Notebook" papers. */
(function () {
  'use strict';
  const MB = window.MB, G = MB.G;
  const NB = (MB.NB = {});
  const QA = 'Questions and answers', FILL = 'Fill in the blanks', TF = 'True or False', SHORT = 'Short answer questions', DIAGRAM = 'Draw and label';

  /* k: self | fill | tf.  fill: s = sentence with {0} {1} blanks, a = accepted words for each blank */
  const D = {
    mela: [
      { sec: QA, k: 'self', q: 'Why did Nita and Radha go to the mela?', m: 'To <b>enjoy with family</b>.' },
      { sec: QA, k: 'fill', p: 'Which community helper keeps people safe at the mela?', s: '{0}', a: [['police officers', 'police officer', 'police', 'the police', 'policemen', 'policeman']], hint: 'They wear a uniform and keep order.', why: '<b>Police officers</b> keep people safe at the mela.' },
      { sec: QA, k: 'fill', p: 'Before eating food at the mela we should …', s: 'We should {0}.', a: [['wash our hands', 'wash hands', 'wash your hands', 'wash the hands']], hint: 'It keeps our hands clean.', why: 'Before eating we should <b>wash our hands</b>.' },
      { sec: QA, k: 'self', q: 'What is the purpose of the “Lost and Found booth”?', m: 'The Lost and Found booth is a place where people can <b>give items they have found</b> and <b>collect items they have lost</b>.' },
      { sec: QA, k: 'self', q: 'What is the role of the police dog?', m: 'The police dog <b>helps the police by finding missing people</b> and <b>tracking criminals</b>.' },
      { sec: FILL, k: 'fill', s: 'A {0} is a large fair.', a: [['mela']] },
      { sec: FILL, k: 'fill', s: 'We should throw waste into a {0}.', a: [['dustbin', 'dust bin']] },
      { sec: FILL, k: 'fill', s: 'An {0} helps sick or injured people.', a: [['ambulance']] },
      { sec: FILL, k: 'fill', s: 'We should follow {0} while travelling.', a: [['traffic rules', 'traffic rule']] },
      { sec: TF, k: 'tf', q: 'We should stay with our family in a crowded mela.', t: true, why: 'Yes. In a crowd we should <b>stay with our family</b> so we do not get lost.' },
      { sec: TF, k: 'tf', q: 'It is safe to push people in a crowd.', t: false, why: 'No. Pushing people in a crowd is <b>not safe</b>.' },
      { sec: TF, k: 'tf', q: 'The police help maintain safety at the mela.', t: true, why: 'Yes. <b>Police officers</b> keep people safe.' },
      { sec: TF, k: 'tf', q: 'Fire engines are present to handle emergencies.', t: true, why: 'Yes. Fire engines are there to <b>handle emergencies</b>.' },
      { sec: SHORT, k: 'self', q: 'Name any four things you can see at a mela.', m: 'We can see <b>shops, rides, games and food stalls</b>. (Also the toy stall, the magic show, the Lost and Found booth and the map.)' },
      { sec: SHORT, k: 'self', q: 'Mention two safety rules to follow while travelling by bus.', m: '<b>1.</b> Do not lean out of the window. <b>2.</b> Do not disturb the driver. (Also: sit on your seat and do not jump around.)' }
    ],
    plants: [
      { sec: QA, k: 'self', q: 'What is a plant?', m: 'Plants are <b>living things</b>. They need <b>air, water, sunlight and nutrients</b> to grow.' },
      { sec: QA, k: 'self', q: 'What are trees? Give examples.', m: 'Trees are <b>big and strong plants with a thick stem</b> (a big trunk of wood) and many branches. Examples: <b>mango tree, apple tree</b>.' },
      { sec: QA, k: 'self', q: 'What are shrubs? Give examples.', m: 'Shrubs are <b>small and bushy plants</b> with several woody stems close to the ground. Examples: <b>tulsi, rose</b>.' },
      { sec: QA, k: 'self', q: 'What are herbs? Give examples.', m: 'Herbs are <b>small plants with a green, soft stem</b> that does not become woody. Examples: <b>mint, tomato</b>.' },
      { sec: QA, k: 'self', q: 'What are climbers? Give examples.', m: 'Climbers are plants that <b>need support to grow upward</b>. Examples: <b>money plant, grape vine</b>.' },
      { sec: QA, k: 'self', q: 'What are creepers? Give examples.', m: 'Creepers are plants that <b>grow along the ground</b>. Examples: <b>pumpkin, watermelon</b>.' },
      { sec: QA, k: 'self', q: 'What is the function of the root?', m: 'Roots <b>hold the plant firmly in the soil</b> and <b>absorb water and minerals</b>.' },
      { sec: QA, k: 'self', q: 'What is the function of leaves?', m: 'Leaves <b>prepare food for the plant</b>.' },
      { sec: QA, k: 'self', q: 'What is the function of a fruit?', m: 'The fruit <b>protects the seeds</b>.' },
      { sec: FILL, k: 'fill', s: 'The {0} holds the plant upright.', a: [['stem']] },
      { sec: FILL, k: 'fill', s: 'The {0} absorbs water and minerals from the soil.', a: [['root', 'roots']] },
      { sec: FILL, k: 'fill', s: 'The {0} prepares food for the plant.', a: [['leaf', 'leaves']] },
      { sec: FILL, k: 'fill', s: 'The colourful part of a plant that attracts insects is the {0}.', a: [['flower']] },
      { sec: FILL, k: 'fill', s: 'The {0} develops into a fruit.', a: [['flower']] },
      { sec: TF, k: 'tf', q: 'Creepers need support to grow upward.', t: false, why: 'No. Creepers <b>grow along the ground</b>. Climbers need support to grow upward.' },
      { sec: TF, k: 'tf', q: 'Mint is an example of a herb.', t: true, why: 'Yes. Mint and tomato are <b>herbs</b>.' },
      { sec: TF, k: 'tf', q: 'Flowers are usually the green part of the plant.', t: false, why: 'No. Flowers are the <b>colourful</b> part. Leaves are green.' },
      { sec: TF, k: 'tf', q: 'Fruits contain seeds.', t: true, why: 'Yes. The fruit <b>protects the seeds</b>.' },
      { sec: DIAGRAM, k: 'self', q: 'Draw a tomato plant. Label the fruit, flower, leaf, stem, root and seed.', m: 'Label: <b>flower</b> (yellow, at the top), <b>leaf</b> (green), <b>fruit</b> (the red tomato), <b>stem</b> (the main stalk), <b>root</b> (under the ground) and <b>seed</b> (inside the fruit).', diagram: true }
    ],
    pa: [
      { sec: FILL, k: 'fill', s: 'Elephants feed on {0}.', a: [['grass']] },
      { sec: FILL, k: 'fill', s: 'A caterpillar chews {0}.', a: [['leaves', 'leaf']] },
      { sec: FILL, k: 'fill', s: 'A woodpecker lives on a {0}.', a: [['tree', 'tree trunk', 'trunk']] },
      { sec: FILL, k: 'fill', s: 'Ants use {0} to build their nests.', a: [['leaves', 'leaf']] },
      { sec: FILL, k: 'fill', s: 'Monkeys love eating the {0} of plants.', a: [['fruits', 'fruit']] },
      { sec: FILL, k: 'fill', s: 'Birds like owls use {0} in trees to bring up their {1}.', a: [['hollow', 'hollows', 'tree hollows'], ['young ones', 'young one', 'young', 'babies']] },
      { sec: FILL, k: 'fill', s: 'Sunbirds and butterflies drink {0} from flowers.', a: [['nectar']] },
      { sec: FILL, k: 'fill', s: 'Squirrels use hollows to {0} and {1}.', a: [['hide'], ['rest']] },
      { sec: FILL, k: 'fill', s: 'Soil is the {0} layer of the Earth’s surface.', a: [['topmost', 'top most', 'top']] },
      { sec: FILL, k: 'fill', s: 'Soil can change its look, feel and {0} after rain.', a: [['smell']] },
      { sec: QA, k: 'self', q: 'What is the soil made of?', m: 'Soil is made from <b>rocks that have broken up into tiny pieces</b> as well as <b>old leaves, roots, stems</b> and <b>living and dead animals</b>.' },
      { sec: QA, k: 'self', q: 'Why do animals depend on plants?', m: 'Animals depend on plants for <b>food, shelter and resting places</b>.' }
    ]
  };

  function mk(d, extra) {
    extra = extra || {};
    if (d.k === 'self') {
      const e = Object.assign({}, extra);
      if (d.diagram && MB.V.plant) e.vis = MB.V.plant({});
      return G.self(d.q, d.m, e);
    }
    if (d.k === 'tf') return G.tf(d.q, d.t, Object.assign({ hint: 'Think about what you wrote in your notebook.', explain: d.why }, extra));
    const n = d.a.length;
    return Object.assign({
      kind: 'fill', prompt: d.p || (n > 1 ? 'Fill in the blanks.' : 'Fill in the blank.'),
      tpl: '<div class="seq">' + d.s + '</div>',
      blanks: d.a.map(a => ({ kind: 'text', ans: a, w: Math.max(8, a[0].length + 2) })),
      hint: d.hint || ('The first word starts with “' + d.a[0][0].charAt(0) + '”.'),
      explain: d.why || d.s.replace(/\{(\d+)\}/g, (m, i) => '<b>' + d.a[+i][0] + '</b>')
    }, extra);
  }

  /* fresh question objects for the practice banks and mock test */
  NB.questions = function (ch) { return D[ch].map(d => mk(d)); };
  /* the full notebook paper for a chapter, numbered and grouped by section */
  NB.paper = function (ch) { return D[ch].map((d, i) => mk(d, { no: i + 1, section: d.sec })); };
})();
