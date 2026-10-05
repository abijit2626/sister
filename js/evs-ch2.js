/* Study Buddy - EVS Chapter 2: Going to the Mela (Our Wondrous World, Class 3) */
(function () {
  'use strict';
  const MB = window.MB, G = MB.G, UI = MB.UI, W = MB.W;
  const $ = (s, r) => MB.$(s, r);
  const TC = 'tc-mela';

  const WHO = [
    { emoji: '👧', title: 'Nita and Radha', text: 'They are getting ready for the mela. They ask Dadiji to come with them.' },
    { emoji: '👵', title: 'Dadiji', text: 'The grandmother. Her legs hurt, but she agrees to come. She sits in a <b>seat reserved for older people</b> in the bus and gets a <b>wheelchair</b> at the mela.' },
    { emoji: '🧒', title: 'Sneha and Rohit', text: 'Nita’s <b>neighbours</b> and close friends. They go to the mela with Nita’s family.' },
    { emoji: '👨', title: 'Mohan Chacha', text: 'Nita’s <b>paternal uncle</b> (father’s brother). He and his family come by <b>train</b>, then take a city <b>bus</b> and an <b>autorickshaw</b> to the mela ground.' }
  ];

  const SCENES = [
    { emoji: '🎒💧', title: 'Getting ready', text: 'The mela has come to town! Nita and Radha are very excited. The mela is a little far from home, so they will take a <b>bus</b>. Their special bag is ready and the water bottles are filled.', point: 'The mela is far, so they take a bus.' },
    { emoji: '👵', title: 'Dadiji agrees to come', text: 'Nita and Radha ask Dadiji to come. She says her <b>legs hurt</b>, but Nita’s father promises, “We will take care of you.” Dadiji smiles and agrees.', point: 'Dadiji’s legs hurt. The family promised to take care of her.' },
    { emoji: '🚶', title: 'To the bus stop', text: 'Nita holds Dadiji’s hand and leads her slowly to the bus stop. They walk <b>carefully</b> and keep an eye on the vehicles moving in <b>both directions</b>.', point: 'Walk carefully on the road. Watch the vehicles on both sides.' },
    { emoji: '🚌', title: 'In the bus', text: 'It is <b>bus number 401</b>. The conductor and Nita’s father help Dadiji get on. She sits in a seat <b>reserved for older people</b>. Rohit’s father buys <b>five full and four half tickets</b>.', point: 'Bus 401. 5 full + 4 half tickets = 9 tickets.' },
    { emoji: '🎪', title: 'At the mela', text: 'They reach the big <b>parade ground</b>. At the entrance there is a <b>map</b> of the mela. An <b>ambulance, a police jeep and a fire engine</b> are parked next to it. There is also a <b>Lost and Found</b> booth. Mohan Chacha and Rohit hurry to get a <b>wheelchair</b> for Dadiji.', point: 'Map, ambulance, police jeep, fire engine, Lost and Found booth.' },
    { emoji: '🧸🎡', title: 'Fun at the stalls', text: 'There are stalls with games, toys and sweets. At the toy stall the children buy <b>spinning tops, puppets, phirkis and dolls</b>. They ride the <b>merry-go-round</b> and the <b>giant wheel</b>. Sneha and Radha buy <b>bangles</b>. Then they enjoy the <b>magic show</b>.', point: 'Toys, rides, bangles and a magic show.' },
    { emoji: '🧼🍦', title: 'Time to eat', text: 'Mohan Chacha says, “Before you eat, <b>wash your hands properly</b>.” The children wash at the water point. They eat gol gappas, chaat, chhole kulche, hot jalebis with rabri and kulfi. After eating, they put all the waste in the <b>dustbin</b>.', point: 'Wash hands before eating. Put waste in the dustbin.' },
    { emoji: '🐕👮', title: 'Going home', text: 'As they leave, Dadiji asks, “Who is accompanying the police officer?” All the children answer together, “Dadiji, it is a <b>police dog</b>!”', point: 'The police officer had a police dog with them.' }
  ];

  const SEQ = [
    'Nita and Radha get ready and fill their water bottles',
    'The families walk carefully to the bus stop',
    'Everyone rides bus number 401 to the mela',
    'They reach the big ground and see the map at the entrance',
    'The children enjoy toys, rides and the magic show',
    'They wash their hands and eat delicious food',
    'They put the waste in the dustbin and see the police dog'
  ];

  const SAFETY = [
    { label: 'Sit on your seat in the bus', emoji: '🚌', cat: 'safe', why: 'Children were told to sit on their seats.' },
    { label: 'Jump around inside the bus', emoji: '🤸', cat: 'unsafe', why: 'Nita’s father asked the children not to jump around.' },
    { label: 'Put your head out of the bus window', emoji: '😮', cat: 'unsafe', why: 'They were asked not to put their head or hands out of the window.' },
    { label: 'Keep your hands inside the bus', emoji: '✋', cat: 'safe', why: 'Hands should not go out of the window.' },
    { label: 'Hold Dadiji’s hand and walk slowly', emoji: '👵', cat: 'safe', why: 'Nita led Dadiji slowly to the bus stop.' },
    { label: 'Watch the vehicles on both sides of the road', emoji: '👀', cat: 'safe', why: 'They kept an eye on vehicles moving in both directions.' },
    { label: 'Run across the road without looking', emoji: '🏃', cat: 'unsafe', why: 'We must walk carefully and watch the vehicles.' },
    { label: 'Give the reserved seat to an older person', emoji: '💺', cat: 'safe', why: 'A seat was reserved for older people like Dadiji.' }
  ];

  const PLACES = [
    { emoji: '🗺️', title: 'Map of the mela', text: 'At the entrance. It shows the <b>stalls and where they are</b>.' },
    { emoji: '🚑', title: 'Ambulance', text: 'Parked next to the map. It is there to help people who are hurt or ill.' },
    { emoji: '🚒', title: 'Fire engine', text: 'Parked next to the map too. It is there in case there is a fire.' },
    { emoji: '🚓', title: 'Police jeep', text: 'Parked next to the map. The police keep everyone safe.' },
    { emoji: '🔎', title: 'Lost and Found booth', text: 'It has <b>volunteers</b>. They help people who are lost and help lost things get back to their owners.' },
    { emoji: '♿', title: 'Wheelchair', text: 'Mohan Chacha and Rohit hurried to get one for <b>Dadiji</b>.' },
    { emoji: '🚰', title: 'Water point', text: 'The children <b>washed their hands properly</b> here before eating.' },
    { emoji: '🗑️', title: 'Dustbin', text: 'After eating, the children put <b>all the waste</b> in the dustbin.' },
    { emoji: '🐕', title: 'Police dog', text: 'It was with the police officer as the children left the mela.' }
  ];

  const KUMBH = [
    { emoji: '🌍', title: 'World’s biggest festival', text: 'Kumbh Mela is the <b>world’s biggest festival</b>.' },
    { emoji: '👥', title: 'Biggest gathering', text: 'It is the <b>largest gathering of mankind</b>.' },
    { emoji: '🌊', title: 'Four rivers', text: 'It is held on the banks of the rivers <b>Ganga, Yamuna, Godavari and Shipra</b>.' },
    { emoji: '📅', title: 'How often?', text: 'Once every <b>12 years</b>.' },
    { emoji: '🏙️', title: 'Where?', text: 'In <b>Haridwar, Prayagraj, Nashik and Ujjain</b>.' }
  ];

  /* ---------- question bank ---------- */
  function bank() {
    const q = [], C = G.choice;
    q.push(C('Where did Nita, Radha and their families go?', 'To a mela', ['To a zoo', 'To a wedding', 'To a school picnic'], { cols: 2, hint: 'The name of the chapter tells you.', explain: 'They went to the <b>mela</b>.' }));
    q.push(C('Why did Dadiji say she might not be able to go to the mela?', 'Her legs hurt', ['She had lost her stick', 'She was very sleepy', 'The mela was too near'], { cols: 1, hint: 'Think about what Dadiji said to Nita and Radha.', explain: 'Dadiji said, “You know my legs hurt.”' }));
    q.push(C('Mohan Chacha is Nita’s …', 'paternal uncle (father’s brother)', ['grandfather', 'neighbour', 'bus conductor'], { cols: 1, hint: '“Chacha” means a father’s brother.', explain: 'Chacha is the <b>paternal uncle</b>, the father’s brother.' }));
    q.push(C('Sneha and Rohit are Nita’s …', 'neighbours and friends', ['cousins', 'teachers', 'uncles'], { cols: 1, hint: 'They live next door and are also close friends.', explain: 'Sneha and Rohit are Nita’s <b>neighbours</b> and close friends.' }));
    q.push(G.num('What was the number of the bus that the families took?', 401, { hint: 'Look for the bus number in the story.', explain: 'It was bus number <b>401</b>.' }));
    q.push(G.num('Rohit’s father bought 5 full tickets and 4 half tickets. How many tickets did he buy in all?', 9, { hint: 'Add the full and half tickets: 5 + 4.', explain: '5 + 4 = <b>9</b> tickets.' }));
    q.push(C('How did Mohan Chacha’s family reach the mela?', 'By train, then a city bus, then an autorickshaw', ['By bus only', 'On foot all the way', 'In an ambulance'], { cols: 1, hint: 'They came to the city by train first.', explain: 'They came by <b>train</b>, then took a <b>city bus</b> and an <b>autorickshaw</b>.' }));
    q.push(C('Who helped Dadiji get on the bus?', 'The conductor and Nita’s father', ['Only the police', 'Rohit and Sneha', 'Mohan Chacha'], { cols: 1, hint: 'Two people helped her.', explain: 'The conductor and Nita’s father helped Dadiji.' }));
    q.push(C('Where did Dadiji sit in the bus?', 'In a seat reserved for older people', ['On the roof', 'In the driver’s seat', 'She stood near the door'], { cols: 1, hint: 'Buses keep some seats for older people.', explain: 'There was a seat <b>reserved for older people</b>.' }));
    q.push(C('What was at the entrance of the mela ground?', 'A map showing the stalls and their places', ['A swimming pool', 'A railway track', 'A school'], { cols: 1, hint: 'It helps you find your way around.', explain: 'There was a <b>map</b> of the mela ground.' }));
    q.push(C('Which vehicles were parked next to the map?', 'An ambulance, a police jeep and a fire engine', ['A bus, a train and a bicycle', 'A tractor and a truck', 'A scooter and a car'], { cols: 1, hint: 'They are vehicles that help in an emergency.', explain: 'An <b>ambulance, police jeep and fire engine</b> were parked there.' }));
    q.push(C('Who hurried to get a wheelchair for Dadiji?', 'Mohan Chacha and Rohit', ['Nita and Radha', 'Sneha and the conductor', 'The police officer'], { cols: 1, hint: 'Two of them hurried together.', explain: '<b>Mohan Chacha and Rohit</b> hurried to get a wheelchair.' }));
    q.push(C('Which things did the children buy at the toy stall?', 'Spinning tops, puppets, phirkis and dolls', ['Kites, balloons and balls', 'Bangles and bracelets', 'Books and pencils'], { cols: 1, hint: 'Bangles were bought by Sneha and Radha, not at the toy stall.', explain: 'They bought <b>spinning tops, puppets, phirkis and dolls</b>.' }));
    q.push(C('What did Sneha and Radha buy?', 'Bangles and other trinkets', ['Spinning tops', 'Hot jalebis', 'Bus tickets'], { cols: 1, hint: 'These are things girls wear on their wrists.', explain: 'Sneha and Radha bought <b>bangles and other trinkets</b>.' }));
    q.push(C('Which two rides did the children enjoy?', 'The merry-go-round and the giant wheel', ['A roller coaster and a train', 'A boat and a swing', 'A horse and a camel'], { cols: 1, hint: 'One goes round and round, the other is very tall.', explain: 'They rode the <b>merry-go-round</b> and the <b>giant wheel</b>.' }));
    q.push(C('Who said, “Let us go and see the magic show now”?', 'Nita', ['Radha', 'Dadiji', 'Mohan Chacha'], { cols: 2, hint: 'It was one of the girls.', explain: '<b>Nita</b> said it.' }));
    q.push(C('What did Mohan Chacha ask the children to do before eating?', 'Wash their hands properly', ['Sing a song', 'Buy more tickets', 'Take a nap'], { cols: 1, hint: 'It keeps our hands clean.', explain: 'He asked them to <b>wash their hands properly</b>.' }));
    q.push(C('Which of these did the children eat at the mela?', 'Gol gappas, chaat, jalebis with rabri and kulfi', ['Pizza and burgers', 'Rice and dal only', 'Only fruits'], { cols: 1, hint: 'These are street foods you find at a mela.', explain: 'They ate <b>gol gappas, chaat, chhole kulche, hot jalebis with rabri and kulfi</b>.' }));
    q.push(C('Where did the children put their waste after eating?', 'In the dustbin', ['On the ground', 'Under a stall', 'In the water point'], { cols: 2, hint: 'A clean mela needs everyone’s help.', explain: 'They put all the waste in the <b>dustbin</b>.' }));
    q.push(C('Who was accompanying the police officer?', 'A police dog', ['A horse', 'A cat', 'A goat'], { cols: 2, hint: 'The children all answered together.', explain: 'It was a <b>police dog</b>.' }));
    q.push(C('What did Dadiji ask when she agreed to come?', '“Have you filled up your water bottles?”', ['“Have you bought the tickets?”', '“Where is my stick?”', '“Is the bus late?”'], { cols: 1, hint: 'It is about something to drink on the trip.', explain: 'Dadiji asked, “Have you filled up your <b>water bottles</b>?”' }));
    q.push(C('Who called out to the neighbours to be ready on time?', 'Nita’s father', ['Dadiji', 'Radha', 'The conductor'], { cols: 2, hint: 'He was the head of the family going to the mela.', explain: '<b>Nita’s father</b> called out to the neighbours.' }));
    q.push(C('Who said, “Wow! There are so many of us. What fun we are going to have!”?', 'Radha', ['Nita', 'Sneha', 'Rohit'], { cols: 2, hint: 'It is Nita’s sister.', explain: '<b>Radha</b> said it.' }));
    q.push(G.num('Kumbh Mela is held once in every ___ years.', 12, { hint: 'It is a number of years, more than ten.', explain: 'Kumbh Mela is held once every <b>12 years</b>.' }));
    q.push(G.word('Kumbh Mela is the world’s biggest ___.', ['festival'], { hint: 'It is a big celebration.', explain: 'Kumbh Mela is the world’s biggest <b>festival</b>.' }));
    q.push(G.word('The “Lost and ___” booth had volunteers to help.', ['found'], { hint: 'If you lose something, you hope it will be …', explain: 'It is the “Lost and <b>Found</b>” booth.' }));
    q.push(G.word('Mohan Chacha called to say they would meet Nita’s family directly at the ___.', ['mela', 'mela ground'], { hint: 'It is where everyone was going.', explain: 'They would meet at the <b>mela</b>.' }));
    q.push(G.word('Kumbh Mela is held on the banks of rivers. Name one of them: Ganga, Yamuna, Godavari or ___.', ['shipra'], { hint: 'It is the fourth river in the list.', explain: 'The four rivers are Ganga, Yamuna, Godavari and <b>Shipra</b>.' }));
    q.push(G.tf('It is safe to put your head out of the bus window.', false, { hint: 'The children were asked not to put their hands or head out.', explain: 'It is <b>not safe</b>. They were asked not to put their hands or head out of the window.' }));
    q.push(G.tf('Dadiji sat in a reserved seat in the bus.', true, { hint: 'The bus had seats for older people.', explain: 'Yes, a seat was <b>reserved for older people</b>.' }));
    q.push(G.tf('The children washed their hands at the water point before eating.', true, { hint: 'Mohan Chacha reminded them.', explain: 'Yes, they washed their hands <b>properly</b> before eating.' }));
    q.push(G.tf('The mela was held in a small room.', false, { hint: 'It was held on a big ground.', explain: 'It was held on a <b>big parade ground</b>.' }));
    q.push(G.tf('A police dog was with the police officer.', true, { hint: 'Think about the last part of the story.', explain: 'Yes, the children saw a <b>police dog</b>.' }));
    q.push(C('Which is a safe thing to do in a bus?', 'Sit on your seat', ['Jump around', 'Put your hand out of the window', 'Lean out to wave'], { cols: 1, hint: 'Think about what Rohit’s father told the children.', explain: 'We should <b>sit on our seats</b>.' }));
    q.push(C('How should you walk on the road to the bus stop?', 'Carefully, watching the vehicles on both sides', ['Running ahead quickly', 'With your eyes closed', 'In the middle of the road'], { cols: 1, hint: 'They kept an eye on the vehicles.', explain: 'They walked <b>carefully</b> and watched the vehicles moving in both directions.' }));

    q.push(G.match('Match each place at the mela with what it is for.', [
      ['🗺️ Map', 'Shows the stalls and where they are'], ['🚰 Water point', 'Wash hands before eating'],
      ['🗑️ Dustbin', 'Put the waste here'], ['🔎 Lost and Found booth', 'Helps people who are lost'], ['♿ Wheelchair', 'Helps Dadiji move around']
    ], { hint: 'Tap one on the left, then its partner on the right.', explain: 'Each place at the mela has a job.' }));
    q.push(G.match('Match each person with the right clue.', [
      ['Dadiji', 'Her legs hurt'], ['Mohan Chacha', 'Nita’s paternal uncle'], ['Sneha and Rohit', 'Neighbours and friends'],
      ['Rohit’s father', 'Bought the bus tickets'], ['Nita’s father', 'Asked the neighbours to be ready on time']
    ], { hint: 'Think about who did what in the story.', explain: 'Check each person in the story again.' }));
    q.push(G.sort('Which things at the mela are for FUN and which are for HELP?', [{ id: 'fun', label: 'Fun' }, { id: 'help', label: 'Help' }], [
      ['Merry-go-round', 'fun'], ['Magic show', 'fun'], ['Toy stall', 'fun'], ['Ambulance', 'help'], ['Lost and Found booth', 'help'], ['Fire engine', 'help']
    ], { hint: 'Ask yourself: is it for enjoying, or for helping people?', explain: 'Rides, shows and toys are for fun. The ambulance, fire engine and Lost and Found booth are for help.' }));
    q.push(G.sort('Is it SAFE or NOT SAFE when you travel by bus?', [{ id: 'safe', label: 'Safe' }, { id: 'unsafe', label: 'Not safe' }], [
      ['Sit on your seat', 'safe'], ['Put your head out of the window', 'unsafe'], ['Jump around in the bus', 'unsafe'], ['Keep your hands inside', 'safe']
    ], { hint: 'Think about what keeps you from getting hurt.', explain: 'Sit on your seat and keep your hands inside. Do not jump or put your head or hands out of the window.' }));
    q.push(G.order('Put these parts of the story in the right order.', [SEQ[0], SEQ[2], SEQ[3], SEQ[5], SEQ[6]], { hint: 'Start with getting ready and end with the police dog.', explain: 'They got ready, rode the bus, reached the mela, ate, and then saw the police dog.' }));

    q.push(G.self('What is the purpose of the “Lost and Found” booth?', 'The Lost and Found booth has <b>volunteers</b> who help people who are <b>lost</b> to find their family, and help people get back things they have lost.'));
    q.push(G.self('What is the role of the police dog?', 'The police dog goes with the police officer and <b>helps the police keep everyone safe</b>.'));
    q.push(G.self('Why are fire engines and ambulances present in a mela?', 'A mela has a very big crowd. If there is a <b>fire</b>, the fire engine can help quickly. If someone is <b>hurt or ill</b>, the ambulance can help them.'));
    q.push(G.self('Why should we follow safety rules when travelling by bus, car or bicycle?', 'Safety rules <b>keep us from getting hurt</b>. For example, in a bus we sit on our seats and keep our hands and head inside the window.'));
    q.push(G.self('Why should we wash our hands properly before eating?', 'Our hands can have <b>dirt and germs</b>. Washing them properly keeps us <b>healthy</b> and stops us from falling ill.'));
    q.push(G.self('Write two things that Nita’s family and friends did to keep the mela clean and safe.', 'They <b>washed their hands</b> before eating and put all the <b>waste in the dustbin</b>. They also walked carefully and followed safety rules in the bus.'));
    return q;
  }

  /* ---------- the lesson ---------- */
  function learn(root) {
    root.innerHTML =
      UI.step(1, 'Meet the people', '<p>Tap each card to read about the family and friends.</p><div data-w="who"></div>') +
      UI.step(2, 'The day at the mela', '<p>Follow the story from home to the mela. Tap <b>Next</b>. Tap 🔊 to hear it.</p><div data-w="story"></div>') +
      UI.step(3, 'Put the day in order', '<p>Which happened first? Tap the steps in order.</p><div data-w="seq"></div>') +
      UI.step(4, 'Travel safely', '<p>Nita’s father and Rohit’s father taught the children how to stay safe. Is each thing <b>safe</b> or <b>not safe</b>?</p><div data-w="safe"></div>') +
      UI.step(5, 'Places and helpers at the mela', '<p>Tap each place to find out what it is for.</p><div data-w="places"></div>') +
      UI.step(6, 'Kumbh Mela', '<p>The book tells us about the world’s biggest festival.</p><div data-w="kumbh"></div>') +
      UI.step(7, 'Quick check', '<div data-w="try"></div>');
    W.cards($('[data-w=who]', root), WHO, { cols: 1 });
    W.story($('[data-w=story]', root), SCENES);
    W.orderGame($('[data-w=seq]', root), { seq: SEQ });
    W.sortGame($('[data-w=safe]', root), { items: SAFETY, cats: [{ id: 'safe', label: 'Safe', emoji: '✅' }, { id: 'unsafe', label: 'Not safe', emoji: '⚠️' }], n: 8, noun: 'Rule', ask: 'Is it safe or not safe?' });
    W.cards($('[data-w=places]', root), PLACES, {});
    W.cards($('[data-w=kumbh]', root), KUMBH, { cols: 1 });
    W.tryIt($('[data-w=try]', root), () => G.pickMix(bank(), 3), TC);
  }

  MB.topics.push({
    id: 'mela', subject: 'evs', title: 'Going to the Mela', emoji: '🎪', tc: TC, blurb: 'Chapter 2 · A day out with Nita and Radha',
    mock: 6, learn: learn, bank: bank, gen: () => G.pickMix(bank(), 8)
  });
})();
