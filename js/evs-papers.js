/* Study Buddy - EVS: the questions printed in the book (with model answers) and the revision sheet */
(function () {
  'use strict';
  const MB = window.MB, V = MB.V, G = MB.G;
  const mine = (txt) => 'Your own answer. ' + txt;

  /* n = question number shown, sec = heading (Discuss / Write / Find out) */
  const bq = (sec, no, prompt, model, extra) => G.self(prompt, model, Object.assign({ section: sec, no: no, hint: 'Say your answer out loud first. Then open the model answer.' }, extra || {}));

  function ch2() {
    return [
      bq('Discuss', 1, 'What do you think was in the special bag that Nita and Radha’s family carried?', 'The book does not say, so you can use your imagination. It could have <b>food and snacks, water, extra clothes and a first-aid kit</b>: things the family needed for the day.'),
      bq('Discuss', 2, 'How do you prepare yourself for a trip?', mine('For example: I <b>pack my bag</b> with water, food and clothes, wear comfortable shoes, get ready <b>on time</b> and tell my family where I am going.')),
      bq('Discuss', 3, 'What transport do you take to travel within your city / town / village?', mine('For example: <b>bus, auto-rickshaw, car, bicycle, train</b> or I walk. Write the one you really use.')),
      bq('Discuss', 4, 'Why should safety measures be followed when travelling by bus, car or while riding a bicycle?', 'Safety rules <b>keep us from getting hurt</b>. In a bus we sit on our seats and keep our hands and head inside the window. We also walk carefully and watch the vehicles on the road.'),
      bq('Write', 5, 'Describe briefly any trip that you have taken with your friends, neighbours or family.', mine('Write 3 or 4 short sentences: <b>where</b> you went, <b>who</b> you went with, <b>how</b> you travelled and what you <b>enjoyed</b>. Example: I went to the park with my cousin. We came by van. It was fun and we ate ice cream.')),
      bq('Write', 6, 'What is the purpose of the “Lost and Found” booth?', 'The Lost and Found booth has <b>volunteers</b> who help people who are <b>lost</b> to find their family, and help people get back things they have lost.'),
      bq('Write', 7, 'What is the role of the police dog?', 'The police dog goes with the police officer and <b>helps the police keep everyone safe</b>.'),
      bq('Write', 8, 'Have you ever been to a mela? What are the things you liked most in the mela?', mine('For example: the <b>rides</b> (merry-go-round, giant wheel), the <b>toys</b>, the <b>magic show</b> and the <b>food</b> like jalebi and kulfi.')),
      bq('Discuss', 9, 'Imagine yourself in place of Nita, Radha, Sneha and Rohit. Share with the class the interesting things you would do in the mela.', mine('For example: I would ride the giant wheel, watch the magic show, buy a spinning top and eat chaat. I would wash my hands first and put my waste in the dustbin.')),
      bq('Find out', 10, 'Talk to the elders in the family and find out how melas were different when they were young.', mine('Ask your grandparents or other elders and write what they tell you. They may talk about the rides, the food or how people travelled.')),
      bq('Find out', 11, 'Why are fire engines and ambulances present in a mela?', 'A mela has a very big crowd. If there is a <b>fire</b>, the fire engine can help quickly. If someone is <b>hurt or ill</b>, the ambulance can help them.')
    ];
  }
  function ch4() {
    return [
      bq('Write', 1, 'Write the names of trees that you can recognise. Which of these trees have you seen near your home or on your way to school?', mine('Trees in your book: <b>mango, coconut, banyan, khejri, amaltas, jackfruit, peepal, chinar</b> (and the jamun tree in the story). Write the ones you have really seen.')),
      bq('Write', 2, 'Write the names of some shrubs. Do you know what they are called in your mother tongue?', mine('Shrubs in your book: <b>hibiscus, rose, holy basil (tulsi) and curry leaf</b>. Pulses like toor, masoor, moong and urad are seeds of shrubs too. Ask at home for the names in your mother tongue.')),
      bq('Write', 3, 'Watch for different kinds of grasses around you. How many kinds do you notice?', mine('Grasses include <b>wild grasses, paddy (rice), wheat, bajra, jowar, ragi, sugarcane and bamboo</b>. Count the ones you have seen.')),
      bq('Write', 4, 'Write the names of some herbs that you have seen and where you have seen them.', mine('Herbs in your book: <b>mint, tomato, coriander and mustard</b>. For example: I have seen mint in our kitchen garden.')),
      bq('Write', 5, 'What are the parts of a plant?', 'The parts of a plant are the <b>roots, stem, leaves, flowers, fruits and seeds</b>.'),
      bq('Write', 6, 'Mark different parts of the tomato plant and label them.', 'Label: <b>flower</b> (yellow, at the top), <b>leaf</b> (green, on the branches), <b>fruit</b> (the red tomato), <b>stem</b> (the main thin trunk), <b>roots</b> (under the ground) and <b>seed</b> (inside the fruit).', { vis: V.plant({}) }),
      bq('Activity', 7, 'Get to know barks: how do you make a bark rubbing?', '<b>1.</b> Touch and look carefully at the bark of a tree. <b>2.</b> Press a sheet of paper on the bark. <b>3.</b> Gently move a crayon or pencil again and again on the paper. <b>4.</b> Write the name of your tree on the back. <b>5.</b> Collect your friends’ papers and guess each tree by its bark pattern.'),
      bq('Activity', 8, 'Did you notice any other animals, birds and insects on the plant? What were they doing?', mine('For example: ants were walking up the bark, a bird was sitting on a branch, a butterfly was drinking nectar from a flower.')),
      bq('From the lesson', 9, 'How are climbers different from creepers?', '<b>Climbers</b> climb on other plants for support (money plant, jasmine). <b>Creepers</b> creep along the ground (pumpkin, watermelon). Both have thin, flexible stems.')
    ];
  }
  function ch5() {
    return [
      bq('Discuss', 1, 'Which of the animals shown on page 63 have you seen before? Describe where and how you saw them.', mine('The animals in the pictures are elephants, moths, caterpillars, earthworms, tailorbirds, woodpeckers, ants, stink bugs, frogs, butterflies, squirrels and barbets. Say where you saw one, for example: I saw a squirrel running up a tree.')),
      bq('Find out', 2, 'Why do these animals choose to live near plants?', 'Plants give animals <b>food</b> (leaves, fruits, nectar), <b>shelter</b> (hollows, branches, twigs for nests) and a place to <b>rest</b> and bring up their young.'),
      bq('Activity 1', 3, 'Pick up a little soil near a plant. How does it look and feel? Is it dry, damp, rough, smooth, hard or grainy? Did you find any leaves or insects?', mine('Soil can be <b>dry, damp, rough, smooth, hard or grainy</b>. You may find <b>leaves, small stones or insects</b> in it. Tick what you really found in your table.')),
      bq('Activity 1', 4, 'Repeat the activity a day after it rains. Did you find any differences in the look, feel and smell of the soil?', mine('After rain the soil is often <b>wetter and darker</b> and may smell different. You may also see earthworms or millipedes. Write what you really observed.')),
      bq('Activity 1', 5, 'Pick up some soil from a place far away from any plants. Is it different from the soil you collected earlier? In what ways?', mine('Compare the colour, the feel and what is in it. Soil far from plants often has fewer leaves and roots in it.')),
      bq('Activity 1', 6, 'Examine the soil more carefully. What small things do you notice in it?', 'You may notice <b>tiny pieces of rock, bits of old leaves, roots and stems, and small insects</b>. Soil is made from these.'),
      bq('Discuss', 7, 'In the monsoon you find many more plants and animals around. Where did these new plants and animals come from? Why could you not see them earlier?', '<b>Seeds</b> of plants can stay in the soil for a long time and <b>sprout when it rains</b>. Some <b>insects wait for the rains</b> to come out of the soil. So we could not see them earlier.'),
      bq('Activity 2', 8, 'Stand near your plant friend and look around. How many different animals can you spot? Describe them in words.', mine('Use the table words: <b>I saw … (describe), it was on …, what it was doing</b>. Example: a small hopping insect, on the grass, jumping around.')),
      bq('Activity 3', 9, 'Close your eyes and listen to the sounds of birds. Do you hear any bird sounds? Can you see which birds are making them?', mine('Tip: <b>cup your ears with your hands</b> and point your face towards the direction of the sound. You will hear it more clearly.')),
      bq('Activity 3', 10, 'Write down the sound of any birds you have heard.', mine('From your book: <b>Pigeon – Gutru Gu</b>. Other examples: crow – caw caw, sparrow – chirp chirp, owl – hoo hoo.')),
      bq('Activity 3', 11, 'If you do not hear any sounds of birds, what do you think is the reason?', 'Some ideas: there may be <b>a lot of noise</b>, there may be <b>no trees</b> nearby, or the birds may have <b>gone somewhere else</b>. (The book asks what you think, so give your own reason too.)'),
      bq('Activity 3', 12, 'Do you hear more bird sounds in the early morning, in the afternoon or in the evening?', mine('Listen at all three times and decide. Many people hear <b>the most bird sounds in the early morning</b>.'))
    ];
  }

  MB.evsPapers = [
    { id: 'E2', title: 'Ch 2 · Going to the Mela', sub: 'The Discuss, Write and Find out questions', make: ch2 },
    { id: 'E4', title: 'Ch 4 · Getting to Know Plants', sub: 'The Write and Activity questions', make: ch4 },
    { id: 'E5', title: 'Ch 5 · Plants and Animals Live Together', sub: 'The Discuss, Activity and Find out questions', make: ch5 }
  ];

  /* ---------- quick revision sheet ---------- */
  const card = MB.UI.cheatCard;
  MB.cheat.evs = function () {
    return card('🎪 Going to the Mela', 'tc-mela', `<ul class="ticks">
        <li><b>People:</b> Nita and Radha · <b>Dadiji</b> (her legs hurt) · Sneha and Rohit (neighbours) · <b>Mohan Chacha</b> (paternal uncle, came by train)</li>
        <li><b>Bus number 401.</b> 5 full + 4 half tickets = <b>9</b>. Dadiji sat in a <b>reserved seat</b>.</li>
        <li><b>Bus safety:</b> sit on your seat · do not jump around · no hands or head out of the window · walk carefully and watch the vehicles</li>
        <li><b>Entrance:</b> map · ambulance · police jeep · fire engine · <b>Lost and Found</b> booth · wheelchair for Dadiji</li>
        <li><b>Fun:</b> toy stall (spinning tops, puppets, phirkis, dolls) · merry-go-round · giant wheel · bangles · magic show</li>
        <li><b>Good habits:</b> wash hands properly before eating · put waste in the dustbin</li>
        <li>The <b>police dog</b> was with the police officer.</li>
        <li><b>Kumbh Mela:</b> world’s biggest festival · largest gathering of mankind · rivers Ganga, Yamuna, Godavari, Shipra · once every <b>12 years</b> · Haridwar, Prayagraj, Nashik, Ujjain</li></ul>`) +
      card('🌿 Getting to Know Plants', 'tc-plants', `<div class="tablewrap"><table class="ft cmp3"><thead><tr><th>Kind</th><th>Remember</th><th>Examples</th></tr></thead><tbody>
        <tr><th>🌳 Tree</th><td>Big <u>trunk of wood</u>, many branches, roots go deep</td><td>Mango, Banyan, Peepal, Coconut</td></tr>
        <tr><th>🌹 Shrub</th><td><u>Medium-sized</u>, several woody stems close to the ground</td><td>Rose, Hibiscus, Tulsi, Curry leaf</td></tr>
        <tr><th>🌿 Herb</th><td><u>Smaller</u>, soft stem, not woody</td><td>Mint, Tomato, Coriander, Mustard</td></tr>
        <tr><th>🌾 Grass</th><td>A type of herb: thin flat leaves, hollow stem</td><td>Wheat, Paddy, Bamboo, Sugarcane</td></tr>
        <tr><th>🧗 Climber</th><td>Thin stem, climbs on other plants</td><td>Money plant, Jasmine, Bottle gourd</td></tr>
        <tr><th>🎃 Creeper</th><td>Thin stem, creeps along the ground</td><td>Watermelon, Pumpkin</td></tr></tbody></table></div>
        <ul class="ticks"><li><b>Parts of a plant:</b> roots · stem · leaves · flowers · fruits · seeds</li>
        <li><b>Pulses</b> (toor, masoor, moong, urad) are seeds of <b>shrubs</b>. <b>Grains</b> (paddy, wheat, bajra, jowar, ragi) are seeds of large <b>grasses</b>.</li>
        <li>Sugar comes from <b>sugarcane</b>. <b>Bamboo</b> is the tallest grass. <b>Rafflesia</b> (Mizoram) is the biggest flower, as big as an umbrella.</li>
        <li><b>Bark</b> is the hard outer covering of a tree trunk. Jamun fruit: green → red → purple.</li></ul>`) +
      card('🐿️ Plants and Animals Live Together', 'tc-pa', `<ul class="ticks">
        <li>Where there are plants, there are <b>animals</b> too: on, around and under the plants.</li>
        <li>Animals use plants for <b>food, shelter and resting</b>.</li>
        <li><b>Food:</b> camels eat leaves · monkeys eat fruits · sunbirds and butterflies drink nectar · caterpillars munch leaves</li>
        <li><b>Shelter:</b> owls use tree hollows · squirrels and crows use twigs for nests · tailorbirds stitch leaves · a barbet nests in a hollow</li>
        <li><b>Resting:</b> bats and leopards rest on branches · a frog rests on a leaf · squirrels rest in tree hollows</li>
        <li><b>Soil</b> is the topmost layer of the Earth’s surface. It is made from <b>broken rocks, old leaves, roots, stems and living and dead animals</b>.</li>
        <li>On the top layer: <b>ants, termites, small beetles, grasshoppers</b>. After rain: <b>earthworms and millipedes</b> may appear.</li>
        <li>New plants and animals appear in the monsoon because <b>seeds sprout</b> and some <b>insects wait for the rains</b>.</li>
        <li>Soil can feel <b>dry, damp, rough, smooth, hard or grainy</b>. A pigeon says <b>“Gutru Gu”</b>. Cup your ears to hear birds better.</li></ul>`) +
      card('✅ On exam day', 'tc-exam', `<ul class="ticks"><li>Read every question <b>twice</b>.</li><li>For short answers, write in <b>full sentences</b>.</li><li>Use words from your book, like <b>trunk, woody, hollow, shelter</b>.</li><li>If you are stuck, move on and come back.</li><li>Check your answers at the end. You have got this! 🌟</li></ul>`);
  };
})();
