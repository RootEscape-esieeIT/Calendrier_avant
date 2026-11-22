/* =========================================================
   NOËL-OS — The 24 puzzles, ENGLISH version (server file)
   Same structure as jours.js. Answers that depend on the
   language have their own SHA-256 fingerprints here:
       npm run empreinte -- 3 "my new answer"
   ========================================================= */

const W = new Proxy({}, { get: (_, type) => (...params) => ({ type, params }) });
// The ASCII table of capital letters (letter + binary code), pinned on the Mail Room wall (day 2).
const tableAscii = () => '<div class="table-ascii">' + [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(l => `<span><b>${l}</b><code>${l.charCodeAt(0).toString(2).padStart(8, '0')}</code></span>`).join('') + '</div>';
// The numbered alphabet (A = 1 … Z = 26), as a reminder under the seal puzzle (day 20).
const tableAlphabet = () => '<div class="table-ascii rangs">' + [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((l, i) => `<span><b>${l}</b><code>${i + 1}</code></span>`).join('') + '</div>';
const FR = require('./jours');
const piece = (n) => FR[n - 1].piece;
const particules = (n) => FR[n - 1].particules;
const couleurs = (n) => FR[n - 1].couleurs;

const JOURS = [

/* ======================= DAY 1 ======================= */
{
  jour: 1, piece: piece(1), particules: particules(1), couleurs: couleurs(1),
  univers: "The Elves' Workshop",
  emoji: '🔨',
  concept: 'Binary',
  givrin: {
    ricane: "I melted a whole gang of snowmen last night. You, I'm saving for breakfast.",
    piques: [
      "Wrong! I'll carve your failure on the door, right next to my melted snowmen.",
      "Wrong again. At this rate, you'll open this door… by Easter.",
      "Keep fiddling with my bulbs, it warms my heart. Figuratively: I don't have one.",
    ],
    fuite: "My bulbs are shining… I'm melting! Tell the snowmen I'm sorry. Just kidding.",
  },
  histoire: `<p>This morning, nobody can get into the workshop: one of Kryos's <b>Keres</b> has replaced the lock with a <b>string of 8 light bulbs</b>. To open it, you have to switch on the right bulbs… in the language of computers: <b>binary</b>!</p>`,
  cours: `<p>To write our numbers, we use <b>10 digits</b> (0 to 9), and the <b>place</b> of a digit changes its value. In <code>352</code>, the 3 is worth 300, the 5 is worth 50 and the 2 is worth 2.</p>
<p>A computer, on the other hand, is full of tiny switches that only have two positions: <b>on</b> or <b>off</b>. So it writes everything with only <b>two digits</b>: <b>1</b> for on, <b>0</b> for off. That's <b>binary</b>.</p>
<p>Picture a string of 8 light bulbs. Each bulb has a value, and each one is worth <b>double</b> its neighbor on the right: 1, 2, 4, 8, 16, 32, 64, 128. The number written is <b>the total of the bulbs that are on</b>:</p>
<div class="defilement"><table class="tableau compact">
<tr><th>128</th><th>64</th><th>32</th><th>16</th><th>8</th><th>4</th><th>2</th><th>1</th><th>Total</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td class="allume">1</td><td>0</td><td class="allume">1</td><td>4 + 1 = <b>5</b></td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td class="allume">1</td><td>0</td><td class="allume">1</td><td>0</td><td>8 + 2 = <b>10</b></td></tr>
<tr><td class="allume">1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td><b>128</b></td></tr>
</table></div>
<p><b>To write a number</b>, it's like giving change with coins worth 128, 64, 32, 16, 8, 4, 2 and 1: take the biggest bulb that doesn't go over your number, switch it on, and start again with what's left.</p>
<p>Example with <b>6</b>: the biggest bulb that doesn't go over 6 is 4. That leaves 6 − 4 = 2: switch on the 2. Nothing left! So 6 = 4 + 2 = <code>00000110</code>.</p>`,
  enigme: `<p>The Ker pinned this note to the workshop door:</p>
<blockquote class="note">“The code for my lock? <b>Christmas Day</b>, simple as that. Well… if Christmas ever comes this year. Hee hee hee!” <br><i>— The workshop's Ker</i></blockquote>
<p>Christmas Day is <b>25 December</b>. Switch on the bulbs so that their total is <b>25</b>, then try to open the door!</p>
<div class="rappel">📌 <b>Reminder</b>: from left to right, the bulbs are worth <code>128 · 64 · 32 · 16 · 8 · 4 · 2 · 1</code>. Each bulb that's on adds its value to the total.</div>`,
  widget: W.ampoules(),
  indices: [
    "Start with the biggest bulb that doesn't go over 25: it's the 16. That leaves 25 − 16 = 9 to find.",
    "9 = 8 + 1. So switch on the bulbs 16, 8 and 1: 16 + 8 + 1 = 25.",
  ],
  lecon: `<p>Well done! Christmas Day, in binary, is written:</p>
<div class="schema"><code>0 0 0 1 1 0 0 1</code> = 16 + 8 + 1 = <b>25</b></div>
<p>Each 0 or 1 is called a <b>bit</b> (short for <i>binary digit</i>). 8 bits make a <b>byte</b>, which can represent 256 values (from 0 to 255). Inside a computer, <b>everything</b> is made of bits: text, photos, music, videos… You'll see it in the next rooms!</p>
<h4>🌍 In real life</h4>
<ul>
<li>A phone photo weighs about 3 MB, which is roughly <b>24 million bits</b>: 24 million light bulbs!</li>
<li>The “GB” in your mobile data plan means a billion bytes.</li>
</ul>`,
  fragment: [15, '01001001'],
},

/* ======================= DAY 2 ======================= */
{
  jour: 2, piece: piece(2), particules: particules(2), couleurs: couleurs(2),
  univers: 'The Mail Room',
  emoji: '✉️',
  concept: 'Character encoding (ASCII)',
  givrin: {
    ricane: "I've turned all the mail into 0s and 1s. This year, the children will get electricity bills.",
    piques: [
      "No. Even the frozen mailman in the yard would have got it.",
      "Wrong! I'm returning your answer to sender. That's you.",
      "You read binary the way I read greeting cards: by tearing them up.",
    ],
    fuite: "My lovely binary mail… read by a human?! I'm sticking a stamp on myself and posting myself far, far away!",
  },
  histoire: `<p>In the chalet's Mail Room, the Ker breathed on the label printer. Frozen down to its circuits, it no longer prints letters… only <b>0s</b> and <b>1s</b>!</p>`,
  cours: `<p>You saw it on day 1: a computer can only store <b>numbers</b>, written in binary. So how does it remember letters, like your name?</p>
<p>The whole world agreed on a big lookup table, the <b>ASCII table</b>: every letter gets a code of 8 binary digits (a <b>byte</b>). It's like a playground secret code, shared by every computer on the planet!</p>
<div class="defilement"><table class="tableau compact">
<tr><th>Letter</th><th>Number</th><th>Binary code</th></tr>
<tr><td><b>A</b></td><td>65</td><td><code>01000001</code></td></tr>
<tr><td><b>B</b></td><td>66</td><td><code>01000010</code></td></tr>
<tr><td><b>C</b></td><td>67</td><td><code>01000011</code></td></tr>
<tr><td colspan="3">… and so on, in alphabetical order, all the way to Z</td></tr>
</table></div>
<p>To read a word written in binary, cut it into groups of 8 digits: <b>one group = one letter</b>. Then look up each group in the table.</p>
<p>Example: <code>01000011 · 01000001 · 01000010</code> → C, A, B → <b>CAB</b>.</p>`,
  enigme: `<p>We absolutely need to know which gift is hidden in this parcel. Here is its label: <b>5 groups of 8 digits, so 5 letters</b>.</p>
<div class="etiquette-colis binaire">01010010 · 01001111 · 01000010 · 01001111 · 01010100</div>
<p>Luckily, the elves' ASCII table is pinned on the wall of the mail room:</p>
${tableAscii()}
<p>Look up each group of the label in the table. <b>What is the gift?</b></p>`,
  reponses: ['1746b0affbe4a8883e44fede0b5d3f7c691c0f93de62516a959119a7466583e2', '481a2a1bc6ecfedc871409b4c92a795186b6ac8e16fa00157e09270ee2247dc0'],
  placeholder: 'The gift…',
  indices: [
    'The first group of the label, 01010010, is in the table next to the letter R. Do the same with the other 4 groups.',
    'R, O, B, O… Only the last letter is missing: look up 01010100 in the table. It\'s a toy that moves all by itself!',
  ],
  lecon: `<p>You just had to look up each group in the table: <code>01010010</code> = R, <code>01001111</code> = O, <code>01000010</code> = B, <code>01001111</code> = O, <code>01010100</code> = T → <b>ROBOT</b>!</p>
<p>Did you notice that every group starts with <code>010</code>? For capital letters, the last 5 digits give the letter's place in the alphabet directly: R = <code>10010</code> = 16 + 2 = 18, the 18th letter. The people who designed the table did it on purpose!</p>
<p>That table giving <b>a number to every character</b> is called an <b>encoding</b>. The most famous one, <b>ASCII</b> (1963), has 128 characters: <code>A</code> = 65, <code>a</code> = 97, a space = 32, the digit <code>0</code> = 48…</p>
<p>The problem: ASCII was designed for English. No “é”, no “ñ”, and certainly no emojis! Today we use <b>Unicode</b>, which numbers nearly <b>160,000 characters</b> from every language in the world. The Christmas tree 🎄 is number <code>U+1F384</code>.</p>
<h4>🌍 In real life</h4>
<ul>
<li>If a website shows “NoÃ«l” instead of “Noël”, that's an encoding bug: the computer read the numbers with the wrong table!</li>
<li>When you send an emoji, your phone only sends a number: your friend's phone draws the picture. That's why the same emoji looks different on an iPhone and on Android.</li>
</ul>
<h4>🧪 Try it yourself</h4>`,
  apresReussite: W.terrainAscii(),
  fragment: [22, '01001001'],
},

/* ======================= DAY 3 ======================= */
{
  jour: 3, piece: piece(3), particules: particules(3), couleurs: couleurs(3),
  univers: 'The Letter Attic',
  emoji: '📜',
  concept: 'Encryption (Caesar cipher)',
  givrin: {
    ricane: "One wheel, one child's letter, zero hope. I adore wishes that never come true.",
    piques: [
      "Wrong. That kid's getting socks. Your fault.",
      "Spin, spin my pretty wheel… and go round in circles.",
      "Even Caesar would give up. Then again, he ended up stabbed: he was used to nasty surprises.",
    ],
    fuite: "My wheel, shattered like glass! I'm off to the cellar to encrypt my will.",
  },
  histoire: `<p>In the Letter Attic, between two old trunks, a child's letter to Santa was found… but the attic's <b>Ker</b> has <b>encrypted</b> it with the Caesar cipher: every letter moved forward by the same number of steps in the alphabet. Nobody can read it anymore!</p>`,
  cours: `<p>To <b>encrypt</b> a message is to transform it so that only people who know the secret can read it again. That secret is called the <b>key</b>.</p>
<p>The Ker's method is one of the oldest: you move every letter forward in the alphabet by the same number of steps. With a key of 3:</p>
<div class="schema"><code>A → D &nbsp; B → E &nbsp; C → F &nbsp; … &nbsp; X → A &nbsp; Y → B &nbsp; Z → C</code></div>
<p>When you reach Z, you go back to the start of the alphabet, like on a <b>wheel</b>. With this key, <code>NOEL</code> becomes <code>QRHO</code>.</p>
<p>To <b>decrypt</b>, you go the other way: you move every letter back by the same number of steps.</p>
<p>And if you don't know the key? You can try all 25 keys one by one… or be clever: if you can guess <b>a single word</b> of the message, you find the key straight away!</p>`,
  enigme: `<p>Here is the letter the Ker encrypted. Good news: we know how letters to Santa begin!</p>
<blockquote class="note">💡 The first word of the letter is <b>DEAR</b>. So the first encrypted L must turn back into a <b>D</b>.</blockquote>
<p>Turn the wheel until the first word becomes <b>DEAR</b>: the whole message will appear. <b>Which gift did the child ask for?</b></p>`,
  widget: W.cesar('LMIZ AIVBI, BPQA GMIZ Q EWCTL TWDM IV MTMKBZQK OCQBIZ BW XTIG ZWKS QV UG JMLZWWU. BPIVS GWC! TWC', 1),
  reponses: ['9931f63314743ab42b1fe91e4ac33bf733eeae407b156f39e5e7146f64668cc9', '25e56a0f2c22de9d8a74118a735bc9b14a057e9aa2a1474c4acc83f09df58067', 'a90c1a0b7a6bae5991b1fc1505ee58e14b68e84fa803ac0163288ec08ccb49fb', '92953085cc639c756a52d65a0d2e5a99be816c17a4818ff319a216fd9809ccf8'],
  placeholder: 'The gift asked for…',
  indices: [
    'The first encrypted word is LMIZ. Turn the wheel until it becomes DEAR: the L must turn back into D.',
    'You have to move every letter back by 8 steps, like Santa\'s 8 reindeer! The gift is written right after “I WOULD LOVE AN”.',
  ],
  lecon: `<p>The key was <b>8</b>, like the reindeer pulling the sleigh! With the Caesar cipher there are only <b>25</b> possible keys: you can try them all in a few minutes. So people invented something better: the <b>Vigenère cipher</b> (1586) uses several keys in turn. It was nicknamed “the indecipherable cipher” for nearly 300 years!</p>
<h4>🕵️ How did you crack it?</h4>
<p>Thanks to a mistake by the Ker: every letter to Santa starts with “DEAR”. Knowing a piece of the message lets you find the key: that's a <b>known-plaintext attack</b>. That's how Alan Turing and his team broke the German <b>Enigma</b> machine during the Second World War: many messages started with the weather report!</p>
<p>Modern ciphers (like <b>AES</b>, which protects your messages and payments) resist this kind of attack, with keys that have 2<sup>256</sup> possibilities: a 78-digit number.</p>
<h4>🌍 In real life</h4>
<ul>
<li>The little padlock 🔒 next to a website's address means the connection is encrypted.</li>
<li>Messaging apps like Signal or WhatsApp use “end-to-end” encryption: even the company can't read your messages.</li>
</ul>`,
  fragment: [18, '01010110'],
},

/* ======================= DAY 4 ======================= */
{
  jour: 4, piece: piece(4), particules: particules(4), couleurs: couleurs(4),
  univers: 'The Paint Workshop',
  emoji: '🎨',
  concept: 'Pixels and colors (RGB)',
  givrin: {
    ricane: "I've drained all the colors out of the machine. Your tree will be grey, your snow grey, and your Christmas… grey as my soul.",
    piques: [
      "Wrong! Another ruined bauble: I'm keeping it for my collection of horrors.",
      "You mix colours like a colour-blind elf. Mind you, they're all frozen now: they can't see a thing.",
      "That colour is called “defeat grey”. Very trendy this year.",
    ],
    fuite: "Too many colours! My eyes! I'm going back to the polar night, at least it's black…",
  },
  histoire: `<p>In the Paint Workshop, the Ker has wiped every setting of the machine that paints the tree baubles: they all come out <b>grey</b>! To restart it, you have to give it the right <b>color code</b>.</p>`,
  cours: `<p>Look at your screen up close (with a magnifying glass, it's even better): it's made of millions of tiny dots, the <b>pixels</b>. Each pixel holds <b>3 tiny lamps</b>: a <span class="r">red</span> one, a <span class="g">green</span> one and a <span class="b">blue</span> one. By turning them up or down, the screen makes every color.</p>
<p>⚠️ Here we're mixing <b>light</b>, not paint: the rules aren't the ones from your poster paints! Here's what you get with the lamps at full power:</p>
<div class="defilement"><table class="tableau compact">
<tr><th>Lamps on</th><th>Color you get</th></tr>
<tr><td><span class="r">red</span> + <span class="g">green</span></td><td>🟡 <b>yellow</b></td></tr>
<tr><td><span class="r">red</span> + <span class="b">blue</span></td><td>🟣 <b>magenta</b> (pinky purple)</td></tr>
<tr><td><span class="g">green</span> + <span class="b">blue</span></td><td>🩵 <b>cyan</b> (sky blue)</td></tr>
<tr><td>all three</td><td>⚪ <b>white</b></td></tr>
<tr><td>none</td><td>⚫ <b>black</b></td></tr>
</table></div>
<p>To set the lamps, the computer uses a <b>color code</b> of 3 pairs of characters, always in the order <span class="r">red</span>, <span class="g">green</span>, <span class="b">blue</span>. No need to calculate: <code>00</code> = lamp <b>off</b> and <code>FF</code> = lamp at <b>full power</b>.</p>
<p>Examples: <code>#0000FF</code> = red off, green off, blue at full power → <b>blue</b>. And <code>#FF00FF</code> = red at full power, green off, blue at full power → <b>magenta</b>.</p>`,
  enigme: `<p>Today's order is pinned on the machine:</p>
<blockquote class="note">🎄 “A nice shiny <b>YELLOW</b> bauble for the top of the tree!” <br><i>— The decorator elves</i></blockquote>
<div class="rappel">📌 <b>Reminder</b>: a color code = 3 pairs, in the order <span class="r">Red</span>, <span class="g">Green</span>, <span class="b">Blue</span>. <code>00</code> = lamp off, <code>FF</code> = lamp at full power.</div>
<p>Type a code in the box: the test bauble takes on the color live. <b>Which code makes a yellow bauble?</b></p>`,
  widget: W.couleur(),
  reponses: ['67bc6c9e0281772c053b894fec941c34e8e09f1a25c618442013a3114b28d6b9', '566f54f819dabdb3f4c66f13bee24db3df0b00a635270a90077e4c8a530512e4'],
  placeholder: '#RRGGBB',
  indices: [
    'Look at the table in the little lesson: with light, yellow comes from switching on red and green.',
    'Red at full power (FF), green at full power (FF), blue off (00): the code is #FFFF00.',
  ],
  lecon: `<p>You had to type <code>#FFFF00</code>: <span class="r">red at full power</span>, <span class="g">green at full power</span>, <span class="b">blue off</span>. Surprising, isn't it? With paint, red + green would make brown; with light, it makes <b>yellow</b>!</p>
<p>It's called <b>additive</b> mixing for light (you add lights: it gets brighter, all the way to white) and <b>subtractive</b> mixing for paint (you mix pigments: it gets darker). This 3-lamp system is called <b>RGB</b>.</p>
<p>The codes are written in <b>hexadecimal</b>: you count with 16 digits, 0 to 9 then A, B, C, D, E, F. <code>FF</code> is worth 255, the biggest number with 2 characters (like 99 for us). So each lamp has 256 levels, one byte just like on day 1! And 256 × 256 × 256 = <b>16,777,216</b> possible colors.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Every website uses these codes: the gold of this page's star is written <code>#F5C542</code> in its code.</li>
<li>Hold a magnifying glass (or a drop of water) up to a screen: you'll see the little red, green and blue lights!</li>
</ul>`,
  fragment: [2, '01010101'],
},

/* ======================= DAY 5 ======================= */
{
  jour: 5, piece: piece(5), particules: particules(5), couleurs: couleurs(5),
  univers: 'The Toy Storeroom',
  emoji: '🔒',
  concept: 'Logic and logic gates',
  givrin: {
    ricane: "Three switches, one circuit, and me in the middle. Touch the wrong wire and we'll laugh. Mostly me.",
    piques: [
      "Bzzzt! Wrong. Can you smell burning? That's your reasoning.",
      "NOT, NOT and NOT again. It's my favourite logic gate.",
      "Keep trying at random. A monkey would get there too… someday.",
    ],
    fuite: "The current's flowing?! Stop, it tickles… it sizzles… I'm short-circuiting!",
  },
  histoire: `<p>In the basement, the armored door of the Toy Storeroom is protected by an <b>electronic circuit</b>. The Ker has rewired it: <b>three switches</b> (A, B and C) send current into <b>three logic gates</b>. All three must light up at the same time for the star to shine and the door to open.</p>`,
  cours: `<p>To make decisions, a computer uses billions of <b>logic gates</b>. A logic gate receives one or two signals, each one <b>on (1)</b> or <b>off (0)</b>, and lets only one signal out, following a very simple rule. You already use these rules every day without knowing it:</p>
<div class="defilement"><table class="tableau">
<tr><th>Gate</th><th>It's on if…</th><th>In everyday life</th></tr>
<tr><td><b>AND</b></td><td class="gauche"><b>both</b> inputs are on</td><td class="gauche">I have my ticket AND the bus is here → I get on.</td></tr>
<tr><td><b>OR</b></td><td class="gauche"><b>at least one</b> input is on (or both)</td><td class="gauche">Someone rings at the front door OR the back door → the bell rings.</td></tr>
<tr><td><b>NOT</b></td><td class="gauche">its input is <b>off</b>: it does the opposite</td><td class="gauche">It is NOT daytime → the night light comes on.</td></tr>
</table></div>
<p>Example: the gate <code>A AND B</code> only lights up if switch A <b>and</b> switch B are both on.</p>`,
  enigme: `<p>Light up all <b>three gates</b> at the same time to switch the star back on! Read each gate carefully: it tells you which switches must be on… or off.</p>`,
  widget: W.portes(),
  indices: [
    'P1 (A AND B) only lights up if A and B are both on. And P2 (NOT C) wants C to be off.',
    'A on, B on, C off: P1, P2 and P3 all light up!',
  ],
  lecon: `<p>The solution was <b>A = 1, B = 1, C = 0</b>. P1 (an AND gate) needed A and B on; P2 (a NOT gate) needed C off; and P3 (an OR gate) was happy with B on.</p>
<p>The AND, OR and NOT gates follow <b>Boolean algebra</b>, invented by George Boole in 1854… almost 100 years before the first computer!</p>
<p>In a processor, each gate is built from <b>transistors</b>: tiny switches controlled by electricity. By combining gates, you build a circuit that adds two binary numbers, then a calculator, then… a whole computer.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your phone's processor contains <b>billions of transistors</b>, each one smaller than a virus.</li>
<li>The same words work for searching the Internet or a database: “cats AND dogs”, “NOT expensive”…</li>
<li>In Minecraft, “redstone” lets you build real logic gates… and even whole computers!</li>
</ul>`,
  fragment: [11, '01000111'],
},

/* ======================= DAY 6 ======================= */
{
  jour: 6, piece: piece(6), particules: particules(6), couleurs: couleurs(6),
  univers: 'The Sleigh Garage',
  emoji: '🎁',
  concept: 'Sorting algorithms',
  givrin: {
    ricane: "I've siphoned off the sleigh's fuel. There's just enough left for someone clever. Not for you.",
    piques: [
      "Out of fuel! The sleigh stays in the garage and the children cry. Delicious.",
      "You swap parcels the way you'd shuffle cards: at random, and losing.",
      "Out of fuel again! I'll end up selling you some… at a very, very steep price.",
    ],
    fuite: "All sorted with fuel to spare?! I'm off, before you pack me in a box too!",
  },
  histoire: `<p>In the Sleigh Garage, the gifts must be loaded onto the sleigh <b>from lightest to heaviest</b>. But the conveyor belt is half frozen: the only thing you can do is <b>swap two neighboring parcels</b>. And every swap uses up precious sleigh fuel…</p>`,
  cours: `<p>An <b>algorithm</b> is a <b>precise method</b>, step by step, for solving a problem. A recipe or the instructions for flat-pack furniture are algorithms!</p>
<p>To sort things from smallest to biggest, there's a very simple method called <b>bubble sort</b>: you go along the row from left to right, and whenever two neighbors are in the wrong order, you swap them. The biggest one then “rises” all the way to the end, like a bubble in lemonade. Then you start again with the others.</p>
<p>Example with 3 parcels <code>3 kg · 1 kg · 2 kg</code>: swap 3 and 1 → <code>1 · 3 · 2</code>, then 3 and 2 → <code>1 · 2 · 3</code>. Sorted in 2 swaps!</p>
<p>Here, only one move is allowed: <b>swapping two neighboring parcels</b>, with the <b>⇄</b> button between them.</p>`,
  enigme: `<p>Sort the parcels from lightest (left) to heaviest (right). There's fuel left for <b>12 swaps</b>: no need to be perfect, but avoid useless swaps!</p>`,
  widget: W.tri([
    { emoji: '🧸', poids: 4 }, { emoji: '🎈', poids: 1 }, { emoji: '🚂', poids: 6 },
    { emoji: '📚', poids: 3 }, { emoji: '🛷', poids: 5 }, { emoji: '🎁', poids: 2 },
  ], 12),
  indices: [
    'Start by moving the heaviest one (the train, 6 kg) all the way to the right: swap it with its right-hand neighbor, again and again.',
    'Then do the same with the next one (the sled, 5 kg), and so on. Never swap two parcels that are already in the right order!',
  ],
  lecon: `<p>You've just used <b>bubble sort</b>: the heavy parcels “rise” to the right like bubbles in lemonade.</p>
<p>The minimum possible was <b>8 swaps</b>: there were 8 pairs of parcels in the wrong order (for example 4 kg placed before 1 kg), and each swap between neighbors only fixes one of them.</p>
<p>The problem: for 1,000 gifts, bubble sort can take nearly <b>500,000 swaps</b>. Computer scientists have invented much smarter sorts, like <b>merge sort</b>: cut the pile in two, sort each half, then merge them. For 1,000 gifts: only about <b>10,000 operations</b>.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Sorting is everywhere: search engine results, your news feed, your playlist, your contacts…</li>
<li>Sorting algorithms are so important that they're taught in every computer science school in the world.</li>
</ul>`,
  fragment: [23, '01010100'],
},

/* ======================= DAY 7 ======================= */
{
  jour: 7, piece: piece(7), particules: particules(7), couleurs: couleurs(7),
  univers: 'The Observatory',
  emoji: '🏠',
  concept: 'Binary search',
  givrin: {
    ricane: "A hundred houses, one waiting chimney, and the sun rising soon. I adore races that are lost in advance.",
    piques: [
      "Wrong! The gift will end up at a dentist who hates Christmas.",
      "Guessing at random? Me too: I throw icicles at the reindeer.",
      "The sun rises, the snow melts, and you go round in circles. It's almost poetic.",
    ],
    fuite: "Found it in so few tries?! You cut everything in half… I'm off before you cut me too!",
  },
  histoire: `<p>In the Observatory, the radio crackles: the Ker has breathed on the sleigh's GPS! Santa is flying over Chimney Avenue: <b>100 houses</b>, numbered from 1 to 100. Only one is waiting for its gift tonight. The radio can only tell you whether the right house has a <b>higher</b> or <b>lower</b> number than the one you suggest.</p>`,
  cours: `<p>You probably know the “higher or lower” game: someone thinks of a number, you suggest one, and they answer “higher” or “lower”.</p>
<p>The simplest method is to try the numbers one by one: 1, 2, 3… It always works in the end, but with 100 houses, it could take up to <b>100 tries</b>!</p>
<p>The clever method: always suggest the number <b>in the middle</b>. Whatever the answer, you get rid of <b>half</b> of the possibilities in one go!</p>
<p>Example with 20 houses: you suggest 10, the answer is “higher”. Houses 11 to 20 are left: you suggest the middle, 15. And so on…</p>`,
  enigme: `<p>Find the right house in <b>10 tries at most</b>, before sunrise. The house changes every game: use the middle method, and watch the golden zone shrink!</p>`,
  widget: W.dichotomie(100, 10),
  indices: [
    'Start with house 50: whatever the answer, you get rid of half the houses in one go.',
    'Always aim for the middle of the houses still possible (the golden zone). For example, if houses 51 to 100 are left, try 75.',
  ],
  lecon: `<p>By always aiming for the middle, you get rid of <b>half the houses</b> with every try:</p>
<div class="schema"><code>100 → 50 → 25 → 13 → 7 → 4 → 2 → 1</code></div>
<p><b>7 tries</b> are always enough for 100 houses! It's called <b>binary search</b> (“cutting in two”).</p>
<p>The craziest part: for <b>a million</b> houses, you'd only need <b>20 tries</b>, and for a billion, <b>30</b>. Trying them one by one, you could need up to a billion…</p>
<p>⚠️ But careful: it only works if the houses are <b>in order</b>. That's why sorting (day 6) is so important!</p>
<h4>🌍 In real life</h4>
<ul>
<li>It's the natural way to look up a word in a paper dictionary.</li>
<li>Databases find one piece of information among billions in a few milliseconds thanks to this idea.</li>
</ul>`,
  fragment: [20, '01001110'],
},

/* ======================= DAY 8 ======================= */
{
  jour: 8, piece: piece(8), particules: particules(8), couleurs: couleurs(8),
  univers: 'The Map Room',
  emoji: '🗺️',
  concept: 'Graphs and shortest paths',
  givrin: {
    ricane: "The reindeer are out of breath. One single detour, and one of them ends up as a bedside rug.",
    piques: [
      "Too long! Rudolph's nose just ran out of battery.",
      "That route? Even a lost penguin would do better. And penguins live at the South Pole.",
      "Another detour. The reindeer are cursing you in Sami.",
    ],
    fuite: "The shortest path? I'm taking it… to run away!",
  },
  histoire: `<p>In the Map Room, the big map of Santa's round is pinned to the wall. Santa has to deliver an urgent gift to <b>Lea's House</b>. On the map, each road shows its flying time in minutes. The reindeer are tired: you need the <b>fastest</b> route… and the Ker has stretched a red thread across the map to suggest a “shortcut”.</p>`,
  cours: `<p>A map like this one, with places linked by roads, is what computer scientists call a <b>graph</b>. Santa can only fly <b>along the roads drawn</b>, and each road shows its flying time in minutes.</p>
<p>The length of a trip is the <b>sum</b> of the times of all the roads taken. For example, if a 3-minute road goes from the Farm to the Bridge, then a 4-minute road from the Bridge to the Church, the trip Farm → Bridge → Church takes 3 + 4 = <b>7 minutes</b>.</p>
<p>To find the fastest route, just compare the different possible paths. Careful: a path with few steps isn't always the shortest!</p>`,
  enigme: `<p>Click the places, one by one, to draw the route from the <b>North Pole</b> to <b>Lea's House</b>. Santa will only accept the fastest route. The total time is shown under the map: compare the routes!</p>`,
  widget: W.graphe(
    {
      A: { nom: 'North Pole', emoji: '🎅', x: 60, y: 190, dxNom: 6 },
      B: { nom: 'Frozen Lake', emoji: '🧊', x: 220, y: 80 },
      C: { nom: 'Forest', emoji: '🌲', x: 220, y: 310 },
      D: { nom: "Trapper's Hut", emoji: '🛖', x: 360, y: 200 },
      E: { nom: 'Frosty Peak', emoji: '🏔️', x: 430, y: 70 },
      I: { nom: "Lea's House", emoji: '🏡', x: 550, y: 200, dxNom: -10 },
    },
    [['A', 'B', 3], ['A', 'C', 2], ['B', 'D', 2], ['C', 'D', 5], ['B', 'E', 6], ['E', 'I', 2], ['D', 'I', 3], ['C', 'I', 9]],
    'A', 'I'
  ),
  indices: [
    'Add up the minutes of each route and compare. Watch out: the shortest road at the start (towards the Forest) doesn\'t necessarily lead to the fastest route!',
    "Compare these three routes: Frozen Lake → Trapper's Hut → House, Forest → Trapper's Hut → House, and the Ker's red thread, the direct road Forest → House.",
  ],
  lecon: `<p>The fastest route was <b>North Pole → Frozen Lake → Trapper's Hut → Lea's House</b>: 3 + 2 + 3 = <b>8 minutes</b>. Through the Forest, the first road is shorter (2 min)… but the rest is costly: 2 + 5 + 3 = 10 minutes. And the Ker's red thread (Forest then the direct road): 2 + 9 = <b>11 minutes</b>!</p>
<p>To a computer scientist, this map is a <b>graph</b>: <b>vertices</b> (the places) linked by <b>edges</b> (the roads), each with a <b>weight</b> (the time).</p>
<p>To find the shortest path on a really big map, we use <b>Dijkstra's algorithm</b>. The idea: start from the departure point and work out, step by step, the minimum time to reach each place. Edsger Dijkstra came up with it in 1956… in 20 minutes, on a café terrace in Amsterdam!</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your GPS does exactly that, on a graph of millions of roads.</li>
<li>On the Internet, “routers” choose the path your data takes with similar algorithms.</li>
<li>In video games, characters find their way with a variant called A* (“A star”).</li>
</ul>`,
  fragment: [17, '01001101'],
},

/* ======================= DAY 9 ======================= */
{
  jour: 9, piece: piece(9), particules: particules(9), couleurs: couleurs(9),
  univers: 'The Ice Cellar',
  emoji: '❄️',
  concept: 'Recursion',
  givrin: {
    ricane: "A snowflake in a snowflake in a snowflake… Your brain will freeze by step 2.",
    piques: [
      "Wrong! Did you count with your mittens on?",
      "Start again. And again. And again… See? That's recursion.",
      "Even my reflection in my reflection in my reflection is laughing at you.",
    ],
    fuite: "You found the way out of my loop?! Impossible… impossi… impo…",
  },
  histoire: `<p>Deep in the Ice Cellar, the Snowflake Master makes every snowflake with a single magic rule, which he repeats again and again…</p>`,
  cours: `<p>A <b>segment</b> is simply a <b>straight line</b> joining two points. A triangle, for example, is made of 3 segments.</p>
<p>The Master's rule turns <b>each segment into 4</b> smaller segments (with a point in the middle). And it isn't applied just once: at each new step, it's applied to <b>all</b> the segments of the drawing, including the ones that have just been created.</p>
<p>A rule that applies to its own result, again and again, is called a <b>recursive</b> rule. It's like two mirrors facing each other: the image contains an image, which contains an image…</p>
<p>Example with another rule: “each branch grows 2 new branches”. 1 branch → 2 branches → 4 → 8… At each step, you <b>multiply by 2</b>. No need to draw: just repeat the multiplication!</p>`,
  enigme: `<div class="note">
<p>❄️ <b>The Master's rule</b></p>
<p>“Take each segment. Cut it into 3 equal parts. Replace the middle part with a point made of two segments.”</p>
<p>So each segment becomes <b>4 segments</b>.</p>
</div>
<p>At step 0, the snowflake is a triangle: <b>3 segments</b>. At step 1, it has <b>12 segments</b>. Watch the steps with the slider.</p>
<p>To decorate the tree, the Master wants to sew an ice bead in the middle of <b>every segment</b> of the <b>step 3</b> snowflake. <b>How many beads does he need?</b></p>
<div class="rappel">📌 <b>Reminder</b>: at each step, the number of segments is <b>multiplied by 4</b>.</div>`,
  widget: W.koch(3),
  reponses: ['36186cbd223297452539e6957db32c6be1d13e472abddac62f6ec1563a77fc69', 'a1ad0dd4a07291049d63ecfceec8aa608bcda77ede50fc55e50f4dd650922d46', 'bbb938f4ab252e849db3ed79efc88513b314c3730f8c10918b4ed12cc6d9adf7'],
  placeholder: 'Number of beads',
  indices: [
    'Step 0: 3 segments. Step 1: 3 × 4 = 12 segments. Keep multiplying by 4 for step 2, then step 3.',
    'Step 2: 12 × 4 = 48 segments. Just one multiplication left for step 3!',
  ],
  lecon: `<p>At each step, every segment becomes 4 segments: 3 → 12 → 48 → <b>192</b>. So he needed <b>192 beads</b>! At step 10, he'd need more than 3 million…</p>
<p>This snowflake is called the <b>Koch snowflake</b> (1904). Its rule applies to itself: that's <b>recursion</b>. In programming, a recursive function is a function that <b>calls itself</b> on a smaller problem:</p>
<pre class="code">function drawSegment(segment, step):
    if step == 0:
        draw the segment           ← stopping condition!
    else:
        cut into 4 small segments (with the point)
        for each small segment:
            drawSegment(small, step − 1)</pre>
<p>The <b>stopping condition</b> is essential: without it, the function would call itself forever and the program would crash.</p>
<p>Amazing fact: if you kept going forever, the snowflake's outline would become <b>infinitely long</b>… while the snowflake still fits on a sheet of paper!</p>
<h4>🌍 In real life</h4>
<ul>
<li>The mountains, clouds and trees in animated films and video games are often generated by recursive fractals.</li>
<li>To search for a file on your computer, the program explores a folder, then its subfolders, then their subfolders… recursively!</li>
</ul>`,
  fragment: [4, '01000001'],
},

/* ======================= DAY 10 ====================== */
{
  jour: 10, piece: piece(10), particules: particules(10), couleurs: couleurs(10),
  univers: "Mrs. Claus's Kitchen",
  emoji: '🍪',
  concept: 'Variables, loops and conditions',
  givrin: {
    ricane: "I've reprogrammed the robot chef. It bakes cookies… and saves some for me whenever there are too many.",
    piques: [
      "Wrong! The robot burnt the batch. And your pride with it.",
      "You skipped a line. Robots never skip lines. That's why people prefer them.",
      "Missed again. I'm eating a cookie to your health. It tastes delicious… it tastes of your failure.",
    ],
    fuite: "I can smell warm cookies… I'm meeeelting!",
  },
  histoire: `<p>In Mrs. Claus's Kitchen, the robot chef bakes the cookies by following a <b>program</b>. But the Ker slipped into its circuits and rewrote it… making sure to help itself along the way.</p>`,
  cours: `<p>A <b>program</b> is a list of instructions that the computer follows to the letter, from top to bottom, without ever thinking for you. To read the robot's program, you need to know 3 things.</p>
<p><b>1. The arrow <code>←</code></b> means “put this value in the box”. <code>cookies</code> is a box (called a <b>variable</b>) that holds a number. Example:</p>
<pre class="code">sweets ← 10
sweets ← sweets + 5</pre>
<p>The box <code>sweets</code> first holds 10, then 10 + 5 = <b>15</b>.</p>
<p><b>2. <code>REPEAT 3 TIMES</code></b> means “do the <b>indented</b> lines just below 3 times in a row”. Each pass is called a <b>round</b> (this is called a <b>loop</b>).</p>
<p><b>3. <code>IF</code></b> means “do the indented lines below <b>only if</b> it's true”. Otherwise, skip them.</p>
<p>A full example:</p>
<pre class="code">sweets ← 2
REPEAT 3 TIMES:
    sweets ← sweets × 3
    IF sweets > 10:
        sweets ← sweets − 4
DISPLAY sweets</pre>
<p>Round 1: 2 × 3 = 6 (not more than 10). Round 2: 6 × 3 = 18, more than 10 → 18 − 4 = 14. Round 3: 14 × 3 = 42 → 42 − 4 = 38. The program displays <b>38</b>.</p>`,
  enigme: `<p>Here is the robot chef's new program:</p>
<pre class="code">cookies ← 3
REPEAT 5 TIMES:
    cookies ← cookies × 2
    IF cookies > 20:
        cookies ← cookies − 10
DISPLAY cookies</pre>
<p class="petit">(That “− 10” is the Ker gobbling 10 cookies every time there are more than 20.)</p>
<p><b>Which number will the robot display at the end?</b></p>
<p class="petit">You can fill in this tracking table to help you (it's your rough work, it isn't marked).</p>`,
  widget: W.tableauSuivi(['round', 'cookies × 2', 'more than 20? (− 10)', 'cookies at end of round'], 5),
  reponses: ['0f682726d71182328e89841c9fbec9494109b9162e63d576966243ab215dcb99', 'bd179ce9cc07d99a40ee2de2544808f34f1d16efa9c5d279c728a37da8cd29aa'],
  placeholder: 'Number displayed',
  indices: [
    "Go round by round, like the robot. Round 1: 3 × 2 = 6, that's not more than 20, so the Ker leaves it alone: 6 cookies.",
    'Round 2: 6 × 2 = 12. Round 3: 12 × 2 = 24, that\'s more than 20 → 24 − 10 = 14. Keep going for rounds 4 and 5!',
  ],
  lecon: `<p>The robot displays <b>26</b>:</p>
<div class="defilement"><table class="tableau"><tr><th>round</th><th>× 2</th><th>more than 20?</th><th>cookies</th></tr>
<tr><td>1</td><td>6</td><td>no</td><td>6</td></tr><tr><td>2</td><td>12</td><td>no</td><td>12</td></tr>
<tr><td>3</td><td>24</td><td>yes (− 10)</td><td>14</td></tr><tr><td>4</td><td>28</td><td>yes (− 10)</td><td>18</td></tr>
<tr><td>5</td><td>36</td><td>yes (− 10)</td><td>26</td></tr></table></div>
<p>You've just used the basic building blocks of <b>every</b> program:</p>
<ul>
<li>a <b>variable</b> (<code>cookies</code>): a labelled box whose content changes;</li>
<li>a <b>loop</b> (<code>REPEAT</code>): repeating instructions;</li>
<li>a <b>condition</b> (<code>IF</code>): making choices.</li>
</ul>
<p>And you did what developers do to understand a program: follow it by hand, step by step. Here is the same program in <b>Python</b>, a real programming language:</p>
<pre class="code">cookies = 3
for round in range(5):
    cookies = cookies * 2
    if cookies &gt; 20:
        cookies = cookies - 10
print(cookies)</pre>
<h4>🌍 In real life</h4>
<ul>
<li>A recipe is already an algorithm: steps, repetitions (“stir for 5 minutes”), conditions (“if the dough is too dry, add milk”).</li>
<li>A video game runs in one big loop, repeated about 60 times per second: read the keys, move the characters, draw the picture.</li>
</ul>`,
  fragment: [3, '01011000'],
},

/* ======================= DAY 11 ====================== */
{
  jour: 11, piece: piece(11), particules: particules(11), couleurs: couleurs(11),
  univers: 'The Dining Room',
  emoji: '🥞',
  concept: 'Stacks and queues',
  givrin: {
    ricane: "I steal the pancakes, I mix up the plates, and I only leave the crumbs. Enjoy your meal!",
    piques: [
      "Wrong! You ate the stack from the wrong end. Like your jumper: inside out.",
      "No. The guests ate your mistakes: now they've got indigestion.",
      "Wrong! I'm keeping the last pancake for myself. And yours too.",
    ],
    fuite: "Last pancake down, first one eaten… and me, first one out!",
  },
  histoire: `<p>In the Dining Room, it's snack time: on each pancake, a chocolate letter. But the Ker, ever greedy, is prowling around the plate…</p>`,
  cours: `<p>Computers spend their time putting information aside until they need it. There are two main ways to store it… and the order in which it comes back out changes everything!</p>
<p>🥞 The <b>stack</b>, like a stack of plates: you can only touch <b>the one on top</b>. So the last one put down is the first one taken out.</p>
<p>🚶 The <b>queue</b>, like the queue at the bakery: you join <b>at the back</b>, you're served <b>at the front</b>. First come, first served.</p>
<p>Example: you stack pancakes <b>A</b>, then <b>B</b>, then <b>C</b>. C is right on top: if you eat them always taking the top one, you eat <b>C</b>, then <b>B</b>, then <b>A</b>. The order is reversed!</p>`,
  enigme: `<p>The cook stacks the pancakes on the plate. Here is what happened, in order:</p>
<ol class="operations">
<li>Put down <b>A</b> (at the very bottom of the plate)</li><li>Put down <b>T</b></li><li>Put down <b>N</b></li><li>Put down <b>A</b></li><li>Put down <b>S</b></li><li>Put down <b>K</b></li><li>😈 The Ker steals the pancake on top of the stack</li>
</ol>
<p>Then the guests eat all the pancakes that are left, always taking <b>the one on top</b>. The letters, in the order they are eaten, spell the password. <b>What is it?</b></p>`,
  reponses: ['72f4c64b7489e5c520ae6c8ef5f4ac819eb2a2caea1015287af84ec7d461f19a'],
  placeholder: 'The word…',
  indices: [
    'The Ker takes the pancake on top: it\'s the last one put down, the K. A, T, N, A, S are left, with S right on top.',
    'The guests eat the top pancake first (S), then the one below it (A)… down to the last one, at the very bottom (A).',
  ],
  lecon: `<p>The Ker pinched the <b>K</b>, the last pancake put down. Then the guests ate <b>S, A, N, T, A</b>: <b>SANTA</b>! In a <b>stack</b>, it's <b>last in, first out</b>: the order is reversed.</p>
<p>In a <b>queue</b>, on the other hand, it's <b>first in, first out</b>: if the pancakes had waited on a conveyor belt, they would have been eaten in the order they were put down.</p>
<h4>🌍 In real life</h4>
<ul>
<li><b>Ctrl+Z</b> (undo) uses a stack: the last action you did is the first one undone.</li>
<li>Your browser's “Back” button is a stack of the pages you've visited.</li>
<li>Documents sent to a printer wait patiently in a <b>queue</b>.</li>
</ul>`,
  fragment: [16, '01000101'],
},

/* ======================= DAY 12 ====================== */
{
  jour: 12, piece: piece(12), particules: particules(12), couleurs: couleurs(12),
  univers: 'The Photo Studio',
  emoji: '📸',
  concept: 'Images and compression',
  givrin: {
    ricane: "I've erased the colours from the code. Only numbers are left. Good luck guessing where the green starts…",
    piques: [
      "Wrong! Your masterpiece looks like a snowflake squashed under a boot.",
      "White, green, white, green… Lost count? I haven't: I'm counting your mistakes.",
      "Wrong. Even a screen smashed with a hammer would display it better.",
    ],
    fuite: "The picture is coming back?! I'm vanishing… into the white…",
  },
  histoire: `<p>In the Photo Studio, the photographer had compressed a secret drawing so it would travel faster. The Ker came by with an eraser: it rubbed out <b>all the letters</b> of the code. Only numbers are left…</p>`,
  cours: `<p>A digital picture is a <b>grid of little colored squares</b>: the <b>pixels</b> (remember day 4). To save it, the computer writes down the color of each pixel, line by line.</p>
<p>The problem: a photo has millions of pixels, and the file quickly gets very heavy. So we <b>compress</b> it: we write the same information <b>more briefly</b>, so it takes up less space and travels faster.</p>
<p>The photographer's trick: instead of saying “white, white, white, green, green”, he says “<b>3 whites, 2 greens</b>”. To get the picture back, you do the opposite: <code>3 whites, 2 greens</code> → ⬜⬜⬜🟩🟩</p>
<p>You can make it even shorter! The picture only has two colors, which <b>have to alternate</b>: every line starts with white, then comes green, then white… No need to write the colors anymore: <code>3 2 1</code> means 3 whites, 2 greens, 1 white → ⬜⬜⬜🟩🟩⬜</p>`,
  enigme: `<div class="note">
<p>📸 <b>The code, after the Ker's visit</b></p>
<p>Every line starts with <b>white</b> pixels, then the numbers alternate: whites, greens, whites, greens… <code>5 1 5</code> = 5 whites, 1 green, 5 whites.</p>
<p>The picture is <b>11 pixels</b> wide and 9 high. Each line of code is one line of the picture.</p>
</div>
<p>Paint the grid (click or drag over the squares) to reveal the secret drawing. <b>What does it show?</b></p>`,
  widget: W.pixels(['5 1 5', '4 3 4', '3 5 3', '4 3 4', '3 5 3', '2 7 2', '1 9 1', '5 1 5', '5 1 5'], 11, 'vert'),
  reponses: ['df15f460dd0e108de2985c48b7fc352e6237495f510f9678ce3bf0da9b372902', '1dcb5501e76b80e22cb30520ade3931443e98a57d69adcd1964b5ef42e362ca9', '8d0082f16f6c1fcf1901dc6d83a65afd2a3f2aa52b447cf2909c1ebd6c8f2f9a', '032d8dad2c847dc3f62d7b5d1aeeafceb55c0d34226c7142b528c81cb87c0f0f', '4a7ef9426a7b0db5bb43abd2c97714bcc73a87a7fbfa5b0318e68f2fd52a6bfe', 'd2a83b1b5f803f6042157d6a506210aacbd01377b247afa3a0d1025aa9d19a93', '76f2a4fe56bb088424f3c5dfb9ae14fc224c5c1e29a3c4162ef8686d91c155ef', 'fd8fbf2b640d174b13257af4a0847526848e22382d0fbd87be5de5e00e56314a', 'daee0dec5e78d2debccabf9a7f03974415be6af0ccea1da0bb848b9bf99fb231', '545d30e6015ea42472240e3f6578bbed869b83719a2090570c2da45f4376486e'],
  placeholder: 'The drawing…',
  indices: [
    'Line 1: 5 whites, 1 green, 5 whites. Line 2: 4 whites, 3 greens, 4 whites. Each line has exactly 11 squares in total.',
    "The drawing is pointy at the top, gets wider towards the bottom, and has a little trunk… It's the star of Christmas!",
  ],
  lecon: `<p>It was a Christmas <b>tree</b> 🎄!</p>
<p>This encoding is called <b>RLE</b> (<i>Run-Length Encoding</i>): instead of writing “white” 5 times, you write <code>5</code>.</p>
<p>The code fit in 27 numbers, while the raw picture has 99 squares (11 × 9): almost <b>4 times shorter</b>! <b>Fax machines</b> used exactly this trick: a page of text is mostly white, with runs of black that alternate.</p>
<p>RLE is excellent for big plain areas (a sky, a blank page), but bad for detailed photos, where the colors change at every pixel. It's a <b>lossless</b> compression: you get the exact picture back. The <b>JPEG</b> format, on the other hand, is a <b>lossy</b> compression: it throws away details the eye barely notices, to get files about 10 times lighter.</p>
<h4>🌍 In real life</h4>
<ul>
<li><b>.zip</b> files and <b>.png</b> images use lossless compressions that are smarter than RLE.</li>
<li>Photos (<b>.jpg</b>), music (<b>.mp3</b>) and streaming videos use lossy compressions.</li>
</ul>`,
  fragment: [19, '01001001'],
},

/* ======================= DAY 13 ====================== */
{
  jour: 13, piece: piece(13), particules: particules(13), couleurs: couleurs(13),
  univers: 'The Chalet Shop',
  emoji: '🧾',
  concept: 'Error detection (check digits)',
  givrin: {
    ricane: "I've tampered with two labels out of three. The third? Maybe. Maybe not. I adore suspense.",
    piques: [
      "Wrong! You've just wrapped a counterfeit gift. Well done, accomplice.",
      "Wrong. Even the till is laughing at you: beep, beep, LOSER.",
      "Count again. Or don't: I love watching you panic.",
    ],
    fuite: "Unmasked by a simple sum?! I'm giving back the change and running!",
  },
  histoire: `<p>At the Chalet Shop, three gifts are waiting to be wrapped. But the Ker came by with a felt-tip pen: it <b>changed one digit</b> on two labels out of three. Only one label is still genuine… and the till can check it!</p>`,
  cours: `<p>A scanner can make mistakes, and a label can get damaged. To spot errors, a special digit is added at the end of the code: the <b>check digit</b>. It says nothing about the product: it's <b>calculated</b> from the other digits.</p>
<p>At the Chalet Shop, the rule is simple:</p>
<div class="schema">The check digit = the <b>last digit</b> of the sum of the other digits</div>
<p>Example with the code <code>2 3 4 | 9</code>: 2 + 3 + 4 = 9, so the check digit must be <b>9</b> ✅.</p>
<p>Another example, <code>5 6 7 | 8</code>: 5 + 6 + 7 = 1<b>8</b>, keep the last digit: the check digit must be <b>8</b> ✅.</p>
<p>If a digit was misread or tampered with, the sum changes and the check digit no longer matches: the till goes “BEEP ✗”!</p>`,
  enigme: `<div class="rappel">📌 <b>The rule</b>: add up the first 4 digits. The <b>last digit</b> of that sum must be equal to the check digit (the 5th digit, in gold).</div>
<p>Check the three labels. <b>Which gift has the only genuine code?</b></p>`,
  widget: W.codesBarres([
    { code: '52714', nom: '🛷 Sled' },
    { code: '36246', nom: '🧩 Puzzle' },
    { code: '43816', nom: '⛸️ Skates' },
  ], true),
  reponses: ['46f059b0523128e8a82242509950eaf2c8ddb6408783d5b76ded1555f584b96b', '33f3339c77c3e371d0d9aa5ee99df2c4e325d9e7f95a39b86931a487cdac4d50', '5ac07a7ba038304006a74e955e7e4bca4e0cd78e56c076f24492a3a275f72895', '2cee097e584af5f2430199ca42d00b311ad4d45ddf1fd6296dcd41e19624d9a2'],
  placeholder: 'The genuine gift…',
  indices: [
    'Sled: 5 + 2 + 7 + 1 = 15. The last digit of 15 is 5… but the Sled\'s check digit is 4. Not the Sled! Do the same for the other two.',
    'Puzzle: 3 + 6 + 2 + 4 = 15, the check digit should be 5, but it\'s 6. Only one label left to check…',
  ],
  lecon: `<p>The only genuine code was the <b>Skates</b>: 4 + 3 + 8 + 1 = 1<b>6</b>, and the check digit is indeed <b>6</b> ✅. The Sled (15 → check digit 4 instead of 5) and the Puzzle (15 → check digit 6 instead of 5) were tampered with ❌.</p>
<p>The check digit is there to <b>detect errors</b>: if a single digit changes, the sum changes, and the check digit no longer matches.</p>
<p>Real barcodes (13 digits, called <b>EAN-13</b>) use a slightly cleverer rule: they multiply every other digit by 3 before adding. Why? To also catch the most common mistake when copying a code by hand: <b>swapping two neighboring digits</b> (with a simple sum, 2 + 8 and 8 + 2 are the same!).</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your <b>bank card</b> number has a last check digit: a website spots a typo straight away.</li>
<li>Social security numbers, <b>IBANs</b> and book numbers (<b>ISBN</b>) also have a check digit.</li>
<li><b>QR codes</b> go even further: they can <b>correct</b> errors. You can damage up to 30% of a QR code and it stays readable!</li>
</ul>`,
  fragment: [9, '01001110'],
},

/* ======================= DAY 14 ====================== */
{
  jour: 14, piece: piece(14), particules: particules(14), couleurs: couleurs(14),
  univers: 'The Sorting Center',
  emoji: '📦',
  concept: 'The Internet and packets',
  givrin: {
    ricane: "I've dropped the packets into a snowstorm. They're all mixed up… Happy puzzling!",
    piques: [
      "Wrong! The South Pole has just received “MIDNIGHT SLEIGH AT”. The penguins didn't get it.",
      "Wrong! You put the packets back in the order they fell. I can do that too.",
      "Missed again! Read the numbers: in binary, 011 isn't eleven, silly.",
    ],
    fuite: "Message sent?! I'm cutting myself into little packets and vanishing!",
  },
  histoire: `<p>Santa is sending a message to the South Pole. But on the Internet, a message never travels in one piece: it's cut into little <b>packets</b>, which each take their own route! The Ker dropped them into a storm: they arrived at the Sorting Center <b>all mixed up</b>.</p>`,
  cours: `<p>On the Internet, a message is never sent in one block: it's cut into little pieces, the <b>packets</b>. Each packet travels on its own, by the least crowded path at that moment… so they don't necessarily arrive in order!</p>
<p>To sort it out, each packet carries a <b>number</b>, like the pages of a book. On arrival, the packets are put back in the order of their numbers, and the message reappears.</p>
<p>Here, the numbers are written in <b>binary</b> with 3 places. Remember day 1: the places are worth 4, 2 and 1, and you just add up the places that have a 1.</p>
<div class="defilement"><table class="tableau compact">
<tr><th>4</th><th>2</th><th>1</th><th>Number</th></tr>
<tr><td>0</td><td>0</td><td class="allume">1</td><td><b>1</b></td></tr>
<tr><td>0</td><td class="allume">1</td><td>0</td><td><b>2</b></td></tr>
<tr><td class="allume">1</td><td>0</td><td class="allume">1</td><td>4 + 1 = <b>5</b></td></tr>
</table></div>`,
  enigme: `<p>Each packet carries its <b>number</b>, written in binary. Click the packets <b>in number order</b> (1, 2, 3…) to rebuild the message, then send it. The ␣ symbol stands for a space.</p>
<div class="rappel">📌 <b>Reminder</b>: in binary with 3 places, the places are worth <code>4 · 2 · 1</code>. Example: <code>110</code> = 4 + 2 = 6.</div>`,
  widget: W.paquets([
    { seq: '011', data: ' AT' }, { seq: '101', data: 'DNI' }, { seq: '001', data: 'SLE' },
    { seq: '110', data: 'GHT' }, { seq: '010', data: 'IGH' }, { seq: '100', data: ' MI' },
  ]),
  indices: [
    'First convert each number: 001 = 1, 010 = 2, 011 = 2 + 1 = 3, 100 = 4… Packet no. 1 is the one marked 001.',
    'In order: 001, 010, 011, 100, 101, 110. The message starts with “SLE”…',
  ],
  lecon: `<p>The message was: <b>“SLEIGH AT MIDNIGHT”</b> 🦌🛷.</p>
<p>On the Internet, all data (messages, photos, videos) is cut into <b>packets</b> of about 1,500 bytes. Each packet carries:</p>
<ul>
<li>the sender's and the recipient's <b>IP address</b> (like on an envelope);</li>
<li>a <b>sequence number</b>, to put the pieces back in order.</li>
</ul>
<p>Packets go through dozens of <b>routers</b> and can take different paths: they sometimes arrive out of order, twice, or get lost. The <b>TCP</b> protocol does exactly what you just did: it puts the packets back in order… and asks again for the ones that got lost.</p>
<h4>🌍 In real life</h4>
<ul>
<li>A streaming video is thousands of packets per second.</li>
<li>Online games and video calls often use another protocol, <b>UDP</b>, which doesn't ask for lost packets again: a picture that skips is better than a conversation that waits! That's where some “lag” comes from.</li>
</ul>`,
  fragment: [8, '01010010'],
},

/* ======================= DAY 15 ====================== */
{
  jour: 15, piece: piece(15), particules: particules(15), couleurs: couleurs(15),
  univers: 'The Server Room',
  emoji: '🖥️',
  concept: 'The Web: clients, servers and HTTP',
  givrin: {
    ricane: "I've turned the North Pole website upside down. Errors everywhere, and me? I'm in great shape.",
    piques: [
      "Wrong! Error 404: intelligence not found.",
      "No, no. Error 403: access to victory forbidden.",
      "Wrong! Error 500: your brain crashed.",
    ],
    fuite: "You understand the codes?! Error 503: Ker unavailable, I'm off!",
  },
  histoire: `<p>In the Server Room, the North Pole website (<code>www.north-pole.xmas</code>) answers with funny <b>3-digit codes</b>. Each code has a precise meaning, understood by every website in the world… and the Ker is having fun triggering them.</p>`,
  cours: `<p>When you open a website, your <b>browser</b> (Chrome, Firefox, Safari…) sends a <b>request</b> to a computer that runs day and night somewhere in the world: the <b>server</b>. That's where the site's pages are kept.</p>
<p>The server answers with the page… and with a <b>3-digit code</b> saying how it went. You've probably already come across the most famous one: “<b>Error 404</b>” (page not found).</p>
<p>These codes are the same for every website in the world. The <b>first digit</b> gives the family:</p>
<div class="defilement"><table class="tableau compact">
<tr><th>Family</th><th>It means…</th></tr>
<tr><td><b>2</b>xx</td><td>✅ it worked</td></tr>
<tr><td><b>3</b>xx</td><td>↪️ the page has moved: look elsewhere</td></tr>
<tr><td><b>4</b>xx</td><td>🙋 it's the visitor's fault (unknown page, access forbidden…)</td></tr>
<tr><td><b>5</b>xx</td><td>🔥 it's the server's fault (it crashed)</td></tr>
</table></div>`,
  enigme: `<p>Match each situation with the right server response code. Read the meaning of each code carefully! (One of them is a real computer scientists' joke: it's no use here.)</p>`,
  widget: W.http(
    [
      'A child opens the page <code>/gift-list</code>: everything works, the page is displayed.',
      'The old page <code>/letters</code> has moved for good to the address <code>/mail</code>.',
      'The Ker tries to open <code>/santas-vault</code>, which is for Santa only: no way!',
      'Someone types <code>/gifts-from-the-year-3000</code>: that page has never existed.',
      'A mistake in the server\'s program makes it crash.',
    ],
    [
      { code: 200, sens: '“OK”: all good, here is the page' },
      { code: 301, sens: '“Moved Permanently”: the page has changed address for good' },
      { code: 403, sens: '“Forbidden”: you\'re not allowed in' },
      { code: 404, sens: '“Not Found”: this page doesn\'t exist' },
      { code: 418, sens: '“I\'m a teapot” ☕ (yes, it really exists!)' },
      { code: 500, sens: '“Internal Server Error”: the server crashed' },
    ]
  ),
  indices: [
    'Read the meaning of each code in the list, then find the matching situation. The 418 (the teapot) doesn\'t go with any situation!',
    'The page that displays normally → 200. The move → 301. Only the forbidden page, the page that doesn\'t exist and the crashing server are left.',
  ],
  lecon: `<p>The answers: <b>200</b> (all good), <b>301</b> (moved), <b>403</b> (forbidden), <b>404</b> (not found) and <b>500</b> (the server crashed).</p>
<p>When you visit a website, your browser (the <b>client</b>) sends a <b>request</b> to a remote computer (the <b>server</b>): “give me the page <code>/gift-list</code>”. The server answers with the page… and a <b>code</b>. This language is called <b>HTTP</b> (the “http” at the start of web addresses).</p>
<p>And code <b>418 “I'm a teapot”</b>? It comes from an April Fool's joke in 1998… which was kept, for the love of the joke!</p>
<p>Even before the request, your computer asks a <b>DNS server</b> for the address of <code>www.north-pole.xmas</code>: DNS is the Internet's phone book, which translates names into numbers.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Some websites' “404” pages are little works of art: go and look for a few!</li>
<li>On sale days or when concert tickets go on sale, lots of websites show errors: too many people at once.</li>
</ul>`,
  fragment: [12, '01001100'],
},

/* ======================= DAY 16 ====================== */
{
  jour: 16, piece: piece(16), particules: particules(16), couleurs: couleurs(16),
  univers: 'The Wrapping Room',
  emoji: '🏷️',
  concept: 'Regular expressions',
  givrin: {
    ricane: "My robot only understands a witch's spell. One crooked tag, and whoosh: the gift goes into the shredder.",
    piques: [
      "Wrong! Your tag has just turned into confetti.",
      "Wrong. You read patterns the way a hen reads the newspaper.",
      "No! Read the pattern again: my robot forgives nothing. It takes after me.",
    ],
    fuite: "You can read regular expressions?! Nobody reads those! I'm running away!",
  },
  histoire: `<p>In the Wrapping Room, a robot sorts the gift tags. The Ker has given it a very strict <b>pattern</b>: tags that don't match it go into the shredder! The pattern is written in a strange language: a <b>regular expression</b>.</p>`,
  cours: `<p>A <b>regular expression</b> is a <b>photofit</b> of a piece of text: it doesn't say which exact text is expected, but what it must <b>look like</b>.</p>
<p>For example, the photofit <code>[0-9][0-9][0-9]</code> means “3 digits”. It accepts <code>007</code> and <code>123</code>, but rejects <code>12</code> (too short) and <code>abc</code> (not digits).</p>
<p>A few pieces to know:</p>
<ul>
<li><code>[A-Z]</code> = one capital letter, <code>[a-z]</code> = one lowercase letter, <code>[0-9]</code> = one digit;</li>
<li><code>+</code> = “the piece before, once or more”: <code>[a-z]+</code> accepts <code>a</code>, <code>snow</code> or <code>sleigh</code>;</li>
<li><code>^</code> = the start and <code>$</code> = the end: nothing may stick out!</li>
</ul>
<p>To check a tag, you move through the pattern and the tag <b>at the same time</b>, piece by piece, from left to right. If a single piece doesn't match, the tag is rejected.</p>`,
  enigme: `<div class="motif"><code>^[A-Z][a-z]+-[0-9][0-9]$</code></div>
<table class="tableau legende-regex">
<tr><td><code>^</code></td><td>start of the tag</td></tr>
<tr><td><code>[A-Z]</code></td><td>one capital letter</td></tr>
<tr><td><code>[a-z]+</code></td><td>one or more lowercase letters</td></tr>
<tr><td><code>-</code></td><td>a hyphen</td></tr>
<tr><td><code>[0-9][0-9]</code></td><td>two digits</td></tr>
<tr><td><code>$</code></td><td>end of the tag (nothing after it!)</td></tr>
</table>
<p>In plain words: <b>a first name starting with a capital letter</b> (and only the first letter), a hyphen, then <b>exactly two digits</b>. Here are the tags, in the order they arrived:</p>
<div class="etiquettes"><span>Finn-06</span><span>amy-09</span><span>Rosa-21</span><span>TED-11</span><span>Omar-15</span><span>Sky-4</span><span>Sven-02</span><span>Tia-24</span></div>
<p>The <b>first letters</b> of the tags accepted by the robot, in order, spell the password.</p>`,
  reponses: ['c228874eced9b802bd4af2bae64dc7b23108d6b874a3865bad13d3fffd45df28'],
  placeholder: 'The word…',
  indices: [
    'Three tags have a flaw: one starts with a lowercase letter, one is all in capitals, and one has only one digit.',
    'amy-09 (no capital), TED-11 (too many capitals) and Sky-4 (only one digit) go into the shredder. Read the first letters of the other 5!',
  ],
  lecon: `<p>The accepted tags were <b>F</b>inn-06, <b>R</b>osa-21, <b>O</b>mar-15, <b>S</b>ven-02 and <b>T</b>ia-24 → <b>FROST</b> ❄️</p>
<p>The rejected ones: <code>amy-09</code> (no capital at the start), <code>TED-11</code> (capitals where the pattern expects lowercase letters) and <code>Sky-4</code> (only one digit instead of two).</p>
<p><b>Regular expressions</b> (or <i>regex</i>) are a mini-language for describing text patterns. They exist in almost every programming language.</p>
<h4>🌍 In real life</h4>
<ul>
<li>When a form tells you “invalid email address”, it's often a regex that checked it.</li>
<li>A US ZIP code is written <code>^[0-9]{5}$</code> (“exactly 5 digits”).</li>
<li>Developers use them to search and replace text in thousands of files at once.</li>
</ul>
<h4>🧪 Try it yourself</h4>`,
  apresReussite: W.terrainRegex('^[A-Z][a-z]+-[0-9][0-9]$', ['Finn-06', 'amy-09', 'Rosa-21', 'TED-11', 'Omar-15', 'Sky-4', 'Sven-02', 'Tia-24']),
  fragment: [13, '01000001'],
},

/* ======================= DAY 17 ====================== */
{
  jour: 17, piece: piece(17), particules: particules(17), couleurs: couleurs(17),
  univers: 'The Library',
  emoji: '📚',
  concept: 'Databases (SQL)',
  givrin: {
    ricane: "I've mixed up the whole list of good and naughty children. Good luck finding your way through it.",
    piques: [
      "Wrong! You've just given marbles to a little horror. I'm starting to like you.",
      "Query error! You read the list upside down, like an elf who's had too much hot chocolate.",
      "No. The database just sighed. Yes it did, I heard it.",
    ],
    fuite: "SELECT exit FROM chalet… I'm vanishing from the database!",
  },
  histoire: `<p>In the Library, the list of children is no longer an old spellbook: it's a <b>database</b>. The Ker has hidden the password in it… and left on the screen the <b>query</b> that finds it.</p>`,
  cours: `<p>A <b>database</b> is a big, tidy table: each <b>row</b> describes one thing (here, a gift) and each <b>column</b> one piece of information about it (a name, a price…).</p>
<p>To ask it a question, you write a <b>query</b> in <b>SQL</b>. Its keywords are plain English:</p>
<div class="defilement"><table class="tableau compact">
<tr><td><code>SELECT</code></td><td class="gauche">choose (the column to show)</td></tr>
<tr><td><code>FROM</code></td><td class="gauche">in (which table)</td></tr>
<tr><td><code>WHERE</code></td><td class="gauche">only the rows where…</td></tr>
<tr><td><code>ORDER BY … DESC</code></td><td class="gauche">sort the result by… from biggest to smallest</td></tr>
</table></div>
<p>Example: <code>SELECT name FROM pupils WHERE class = 'Year 6' ORDER BY age DESC</code> means “give me the names of the Year 6 pupils, from oldest to youngest”.</p>`,
  enigme: `<p>Here is the query the Ker left behind:</p>
<pre class="code sql"><span class="mot">SELECT</span> gift
<span class="mot">FROM</span> list
<span class="mot">WHERE</span> good = 'yes'
<span class="mot">ORDER BY</span> price <span class="mot">DESC</span>;</pre>
<p class="petit">Translation: “In the list table, keep only the gifts of good children, sort them from most to least expensive, and show the names of the gifts.”</p>
<p>Table <code>list</code>:</p>
<div class="defilement"><table class="tableau table-sql">
<tr><th>child</th><th>gift</th><th>price</th><th>good</th></tr>
<tr><td>Zoe</td><td>Crayons</td><td>8</td><td>yes</td></tr>
<tr><td>Hugo</td><td>Marbles</td><td>26</td><td>no</td></tr>
<tr><td>Adam</td><td>Gloves</td><td>18</td><td>yes</td></tr>
<tr><td>Ines</td><td>Atlas</td><td>24</td><td>yes</td></tr>
<tr><td>Malo</td><td>Robot kit</td><td>12</td><td>no</td></tr>
<tr><td>Rose</td><td>Magic set</td><td>27</td><td>yes</td></tr>
<tr><td>Leo</td><td>Igloo tent</td><td>15</td><td>yes</td></tr>
</table></div>
<p>The <b>initials of the gifts</b> you get, in the order of the result, spell the password.</p>`,
  reponses: ['39c71eda91518913a57768c7920995c89eeb8baa2a5c70d6a5103c8fe866b796'],
  placeholder: 'The word…',
  indices: [
    "First cross out the rows of naughty children (good = 'no'): Hugo's Marbles and Malo's Robot kit. 5 gifts are left.",
    'Sort the 5 remaining gifts from most to least expensive: the Magic set (27) first, the Crayons (8) last. Read their initials!',
  ],
  lecon: `<p>The query returns 5 rows: <b>M</b>agic set (27), <b>A</b>tlas (24), <b>G</b>loves (18), <b>I</b>gloo tent (15) and <b>C</b>rayons (8) → <b>MAGIC</b> ✨</p>
<p>A <b>database</b> stores information in <b>tables</b>, and <b>SQL</b> lets you ask them questions: filter (<code>WHERE</code>), sort (<code>ORDER BY</code>), choose the columns (<code>SELECT</code>)… It was invented in the 1970s and is still used everywhere today.</p>
<p>With 7 rows, you can do it by hand. A real database can hold <b>billions</b> of rows: the computer still answers in a fraction of a second.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your social media account, your school grades, your online shopping, your bank account: everything is stored in databases.</li>
<li>A famous attack, <b>SQL injection</b>, consists of slipping SQL code into a form to trick the database. Developers must always protect against it!</li>
</ul>`,
  fragment: [6, '01010100'],
},

/* ======================= DAY 18 ====================== */
{
  jour: 18, piece: piece(18), particules: particules(18), couleurs: couleurs(18),
  univers: 'The Toy Hospital',
  emoji: '🐞',
  concept: 'Bugs and debugging',
  givrin: {
    ricane: "I'm hiding in a single line of this program. Just one. Find me, if you can…",
    piques: [
      "Wrong! That line is innocent. Like me.",
      "You're accusing anyone! You need evidence, inspector.",
      "No. Explain the program to a rubber duck: at least it thinks.",
    ],
    fuite: "Debugged! I've been debugged! Aaaaah!",
  },
  histoire: `<p>On <b>September 9, 1947</b>, computer scientist <b>Grace Hopper</b>'s team found a real moth stuck inside the Mark II computer. They taped it into their logbook with the note: “first actual case of bug being found”. Today, in the Toy Hospital, the sleigh-loading robot has a bug… and the Ker is hiding inside it!</p>`,
  cours: `<p>A <b>bug</b> is a mistake in a program: the computer does exactly what was written… but it's not what we wanted! To find it, you need to be able to read the program. Here's what you need:</p>
<ul>
<li>A <b>list</b> stores several values in numbered boxes. ⚠️ Computer scientists start counting at <b>0</b>! With <code>names = ["Leo", "Ana", "Tom"]</code>: <code>names[0]</code> is "Leo", <code>names[1]</code> is "Ana" and <code>names[2]</code> is "Tom".</li>
<li><code>for i from 0 to 2</code> repeats the <b>indented</b> lines just below, with <code>i</code> being 0, then 1, then 2. A line that isn't indented is done only <b>once</b>, after the loop.</li>
<li>Here, <code>=</code> does the same job as the arrow <code>←</code> on day 10: <code>total = total + 2</code> adds 2 to the total.</li>
<li><code>if …:</code> and <code>else:</code> make a choice, like on day 10. <code>&gt;</code> means “greater than”.</li>
</ul>
<p>The best way to find a bug: <b>play the computer</b>. Follow the program line by line, writing down on paper what each box holds after each line.</p>`,
  enigme: `<p>The robot must add up the weights of the gifts to load onto the sleigh, and warn if they go over 20 kg. There are 5 gifts (4, 1, 5, 2 and 3 kg): the total should be <b>15 kg</b>… but the robot displays <b>3</b>!</p>
<p><b>Click the line that contains the bug.</b></p>`,
  widget: W.debogage([
    'weights = [4, 1, 5, 2, 3]',
    'for i from 0 to 4:',
    '    total = 0',
    '    total = total + weights[i]',
    'if total > 20:',
    '    display("Too heavy!")',
    'else:',
    '    display(total)',
  ]),
  indices: [
    'Play the computer: write down the value of total after each line, round after round. What is total at the end of round 1? And at the end of round 2?',
    'In round 2 (i = 1), total should go from 4 to 5… Look at which line is done just before the addition, in every round. It\'s indented: so it\'s INSIDE the loop.',
  ],
  lecon: `<p>The bug was on <b>line 3</b>: <code>total = 0</code> is indented, so it's <b>inside</b> the loop. In every round, the total is reset to zero before adding the next weight! At the end, it only holds the last weight: 3. The fix: move that line out of the loop, so it's only done once, at the start.</p>
<pre class="code">total = 0
for i from 0 to 4:
    total = total + weights[i]</pre>
<p>It's a very common bug: a line <b>in the wrong place</b>. Each line on its own is correct… it's their position that isn't. And line 2, which many people suspect (it looks as if it skips a box), was perfectly correct: 5 boxes, numbered 0 to 4.</p>
<p><b>Debugging</b> is the art of finding and fixing errors. Developers often spend more time on it than on writing new code. A famous technique: <b>rubber duck debugging</b> 🦆. You explain your program line by line to a rubber duck… and just by saying it out loud, you often find the mistake!</p>
<p>Grace Hopper also created one of the first <b>compilers</b>: a program that translates a language close to English into instructions for the machine.</p>
<h4>🌍 In real life</h4>
<ul>
<li>In 1996, the <b>Ariane 5</b> rocket exploded 37 seconds after lift-off because of a bug: a number too big for the “box” the program wanted to put it in.</li>
<li>Your phone's updates often fix dozens of bugs at once.</li>
</ul>`,
  fragment: [10, '01000001'],
},

/* ======================= DAY 19 ====================== */
{
  jour: 19, piece: piece(19), particules: particules(19), couleurs: couleurs(19),
  univers: 'The Vault',
  emoji: '🔐',
  concept: 'Passwords and brute force',
  givrin: {
    ricane: "My ice computer tests 10 billion passwords per second. Your little secret will last… about as long as a sneeze.",
    piques: [
      "Cracked! Even my granny, frozen since the year 1000, would have guessed it.",
      "Ha! I found that password before you'd finished typing it.",
      "Longer, come on! Your password is as short as your victory will be.",
    ],
    fuite: "A thousand years?! I don't have time to wait, I've got other Christmases to ruin!",
  },
  histoire: `<p>In the Vault, the vault's <b>Ker</b> has plugged in an ice computer that tests <b>10 billion passwords per second</b>! You need to protect the gift vault with a new, really strong password.</p>`,
  cours: `<p>A hacker who doesn't know your password can ask a computer to <b>try them all</b>, one by one, until it hits the right one: that's a <b>brute-force attack</b>.</p>
<p>To resist it, the number of <b>possible combinations</b> must be gigantic. Think of a combination padlock:</p>
<ul>
<li>with 3 wheels of 10 digits: 10 × 10 × 10 = <b>1,000</b> combinations;</li>
<li>with 4 wheels: 10 × 10 × 10 × 10 = <b>10,000</b> combinations.</li>
</ul>
<p>Every extra wheel <b>multiplies</b> the number of combinations. A password works the same way: each character is a “wheel”. Conclusion: <b>length is what matters most!</b></p>`,
  enigme: `<p>Invent a password that the Ker's ice computer would need <b>at least a thousand years</b> to find by trying every combination. The gauge shows you live how long it would hold out!</p>
<p class="alerte">🚫 Never type one of your real passwords here: invent a new one!</p>`,
  widget: W.motDePasse(1e10, 1e3, ['123456', '123456789', '12345678', 'password', 'qwerty', 'azerty', 'letmein', 'iloveyou', 'admin', 'welcome', 'monkey', 'dragon', 'football', 'christmas', 'merrychristmas', 'santa', 'santaclaus', 'noel', 'joyeuxnoel', 'motdepasse', '000000', '111111', 'abc123', 'chocolate', 'sunshine']),
  indices: [
    'Make your password longer: every extra character multiplies the time! About fifteen letters is enough.',
    'Pro tip: a little phrase of 3 or 4 unrelated words, separated by spaces (“penguin volcano sock”). Strong and easy to remember!',
  ],
  lecon: `<p>The number of combinations of a password = <b>(number of possible characters)<sup>length</sup></b>. At 10 billion guesses per second:</p>
<ul>
<li>8 lowercase letters → cracked in <b>21 seconds</b>;</li>
<li>8 characters of every kind (capitals, digits, symbols…) → about <b>8 days</b>;</li>
<li>15 lowercase letters → about <b>5,000 years</b>!</li>
</ul>
<p><b>Length</b> matters far more than complicated symbols. A <b>passphrase</b> of several randomly chosen words (“sock-volcano-penguin-trumpet”) is both very strong and easy to remember.</p>
<p>⚠️ Our calculation is simplified: hackers don't try combinations in just any order. They first test the most common passwords (<code>123456</code>, <code>qwerty</code>…), dictionary words and passwords that have already leaked on the Internet.</p>
<h4>🌍 In real life: the 4 good habits</h4>
<ul>
<li>A <b>different password for every site</b> (otherwise, a single leak is enough to open everything).</li>
<li>A <b>password manager</b> to remember them for you.</li>
<li><b>Two-factor authentication</b>: a code sent to your phone on top of the password.</li>
<li>Never give out your password, not even to a “friend” or a so-called “technical support”.</li>
</ul>`,
  fragment: [14, '01000011'],
},

/* ======================= DAY 20 ====================== */
{
  jour: 20, piece: piece(20), particules: particules(20), couleurs: couleurs(20),
  univers: "Santa's Study",
  emoji: '🕯️',
  concept: 'Hash functions',
  givrin: {
    ricane: "I've slipped fake orders in among the real ones. Your silly seal won't notice a thing.",
    piques: [
      "Wrong! Tom will get a doll. He wanted a dinosaur, but hey.",
      "Wrong. Did you count with your mittens on?",
      "Wrong again! I'm starting to think you wrote my fake orders yourself.",
    ],
    fuite: "Unmasked by a mere number?! I'm puffing… I'm running out of puff…",
  },
  histoire: `<p>In Santa's Study, every order is protected by a <b>magic seal</b>: a number calculated from the name of the gift. The Ker intercepted Tom's order and buried it among fake orders. Luckily, the seal hasn't moved!</p>`,
  cours: `<p>How can you be sure a message hasn't been changed on the way? You can add a <b>fingerprint</b> to it: a small number calculated from the text, a bit like a real fingerprint.</p>
<p>The recipient does the same calculation on the text they received. If they get the same fingerprint, the text is intact. If not, someone has changed it!</p>
<p>Santa's seal recipe is very simple: replace each letter with its <b>position in the alphabet</b> (A = 1, B = 2, C = 3… Z = 26), then <b>add</b> everything up.</p>
<p>Example: <code>SNOW</code> → S = 19, N = 14, O = 15, W = 23 → 19 + 14 + 15 + 23 = <b>71</b>.</p>`,
  enigme: `<p>Tom's original order had <b>seal 56</b>. Here are the orders found on the desk: only one is the real one!</p>
<div class="etiquettes"><span>ROBOT</span><span>TRAIN</span><span>SKATE</span><span>DOLL</span><span>SLED</span><span>BALL</span></div>
<p><b>Which gift did Tom really order?</b></p>
<div class="rappel">📌 <b>Reminder</b>: add up the positions of the letters in the alphabet.</div>
${tableAlphabet()}`,
  reponses: ['86782888cd3cf1005b00935870fbbefc91d257d282794f2d3c590c916d416c38', '3a9c74f483b2438be4fff532928cc1a3903ee6d309f3d0bd301b77b0aee5137b', '1e7066f87048fda51daac423dac34ed4ab0d1ff0c44baf7071709575c9094ab4'],
  placeholder: 'The real gift…',
  indices: [
    'Work out the seal of each gift, like in the SNOW example. For example, SLED = 19 + 12 + 5 + 4 = 40: that\'s not 56, so it isn\'t the sled.',
    'ROBOT = 70, TRAIN = 62, DOLL = 43, BALL = 27… Only one gift left to check!',
  ],
  lecon: `<p>The real gift was the <b>SKATE</b> ⛸️: S + K + A + T + E = 19 + 11 + 1 + 20 + 5 = <b>56</b> ✅.</p>
<p>This seal is a <b>hash function</b>: it turns a text into a <b>fingerprint</b>. But ours has a big flaw… Work out the seal of <code>STEAK</code>: 19 + 20 + 5 + 1 + 11 = <b>56</b> too! With the same letters in a different order, you get the same total. The Ker could have swapped the skate for a steak without anyone noticing! Two different texts with the same fingerprint is called a <b>collision</b>.</p>
<p>Real hash functions, like <b>SHA-256</b>, produce a 256-bit fingerprint and are designed so that:</p>
<ul>
<li>the slightest change to the text <b>completely</b> changes the fingerprint;</li>
<li>it's impossible to get the text back from the fingerprint;</li>
<li>nobody can find two texts with the same fingerprint.</li>
</ul>
<p>🤫 <b>This calendar's secret</b>: the answers are never sent to your browser. They stay on the North Pole server… and even there, they aren't written in plain text: the server only keeps their <b>SHA-256 fingerprints</b>. When you suggest an answer, it computes its fingerprint and compares. Even someone who stole the server couldn't read the answers!</p>
<h4>🌍 In real life</h4>
<ul>
<li>Serious websites never store your password: only its fingerprint (with some added “salt” for extra security).</li>
<li>When you download software, you can compare its fingerprint with the one on the official website to check that a hacker hasn't tampered with it.</li>
<li>Cryptocurrencies like Bitcoin use SHA-256 all the time.</li>
</ul>
<h4>🧪 Try it yourself</h4>`,
  apresReussite: W.terrainHachage(),
  fragment: [5, '01000101'],
},

/* ======================= DAY 21 ====================== */
{
  jour: 21, piece: piece(21), particules: particules(21), couleurs: couleurs(21),
  univers: "The Elves' Lounge",
  emoji: '📧',
  concept: 'Spotting phishing',
  givrin: {
    ricane: "I've written five messages. The fakes are perfect, the real one looks suspicious. You'll love doubting everything.",
    piques: [
      "Hooked! You bit like a trout at breakfast time.",
      "Wrong! Your password? Thanks, I'll keep it safe. In an ice cube.",
      "No. You click on anything shiny, don't you? Like a magpie. A frozen magpie.",
    ],
    fuite: "You spotted my traps?! Nobody takes the bait any more… I'm packing up my fishing rod.",
  },
  histoire: `<p>In the Elves' Lounge, 5 messages have just arrived on the mail computer. But the lounge's <b>Ker</b> has sent <b>fake messages</b> to steal passwords! And it's crafty: its fakes aren't all urgent or full of mistakes… Santa's only real website is <code>santa-claus.xmas</code>.</p>`,
  cours: `<p><b>Phishing</b> is a fake message pretending to come from someone you trust (your bank, a game, your school…) to make you click a link and steal your password or credit card.</p>
<p>The best way to unmask it: <b>read the link's address</b>. A web address breaks down like this:</p>
<div class="schema"><code>https://</code> <code>www.weather-example.com</code> <code>/forecast/london</code><br><span class="petit">the protocol &nbsp;·&nbsp; <b>the website name</b> &nbsp;·&nbsp; the page on the website</span></div>
<p>The <b>website name</b> (everything up to the first “/”) is unique in the world: only its owner can use it. So that's what you need to check, letter by letter!</p>
<p>Careful, it is read <b>starting from the end</b>: in <code>www.weather-example.com</code>, the real website is <code>weather-example.com</code>. What comes in front, separated by dots, are “sub-parts” chosen by the owner: <code>snow.weather-example.com</code> also belongs to weather-example.com. But <code>weather-example.com.hacker.com</code> belongs to… <code>hacker.com</code>!</p>`,
  enigme: `<p>Examine each message like a detective, <b>especially the link's address</b>. Only one is genuine: which one? Don't trust the tone, the politeness or the urgency.</p>`,
  widget: W.phishing([
    { de: 'Santa Claus &lt;<code>security@santa-cIaus.xmas</code>&gt;', objet: '⚠️ URGENT!!! Your account will be deleted in 1 hour', corps: 'Click the link below immediately and enter your password to stop your account being deleted.', lien: 'https://santa-cIaus.xmas/login' },
    { de: 'Elf Services &lt;<code>info@santa-claus.xmas.account-check.com</code>&gt;', objet: 'Confirm your login details to receive your Christmas bonus', corps: 'To receive your bonus of 500 candy canes, simply confirm your username and password on our secure page.', lien: 'https://santa-claus.xmas.account-check.com/bonus' },
    { de: 'North Pole Security &lt;<code>security@santa-claus.xmas</code>&gt;', objet: '🔔 New sign-in to your account… from a glacier', corps: 'Someone signed in to your account last night, from an unknown device. If it was you, ignore this message. If not, go and check the list of your devices in your usual account area. We will never ask for your password in a message.', lien: 'https://account.santa-claus.xmas/my-devices' },
    { de: 'Santa Claus &lt;<code>workshop@santa-claus-xmas.com</code>&gt;', objet: 'Workshop schedule for the week', corps: 'Hello everyone! This week\'s schedule is available: log in to see it. Thanks for your great work. 🎅', lien: 'https://santa-claus-xmas.com/workshop/schedule' },
    { de: 'Official Santa &lt;<code>official.santa@free-mail.net</code>&gt;', objet: 'CONGRATULATIONS!!! You\'ve won an electric sleigh 🎁', corps: 'You are our 1,000,000th visitor! To receive your gift, just pay the delivery fee (£2) with your credit card.', lien: 'http://santa-gifts.com/win' },
  ]),
  indices: [
    'For each link, isolate the website name (up to the first “/”), then read it starting from the end. The real website must end exactly with santa-claus.xmas, with a dot just before it (or nothing at all).',
    'Watch out for letters that look alike (a capital i, I, looks like a lowercase L), hyphens replacing a dot, and names where santa-claus.xmas is only at the beginning. The real message may look worrying… but it never asks for your password.',
  ],
  lecon: `<p>The only genuine message was the <b>sign-in alert</b>: its link leads to <code>account.santa-claus.xmas</code>, which does end with <code>.santa-claus.xmas</code> (“account” is just a sub-part of the real website). And it doesn't ask for a password: it advises you to go and check for yourself.</p>
<p>The sneakiest trap was the <b>schedule</b>: a calm, polite message that still led to <code>santa-claus-xmas.com</code>, a completely different website! A fake message isn't necessarily urgent or full of mistakes.</p>
<p>Fake messages are called <b>phishing</b>: hackers imitate a bank, a game or a friend to make you click and steal your information.</p>
<h4>🔍 How to read an address</h4>
<div class="schema"><code>https://santa-claus.xmas.account-check.com/bonus</code><br>→ the real owner is <b>account-check.com</b> (just before the first “/”)</div>
<h4>🚩 Warning signs</h4>
<ul>
<li><b>Urgency</b> or threats (“your account will be deleted!”)</li>
<li>A gift that is <b>too good</b> to be true</li>
<li>A request for your <b>password</b> or <b>credit card</b></li>
<li>Letters that look alike: l / I, 0 / O, rn / m</li>
</ul>
<p>⚠️ The little padlock 🔒 (https) means the connection is <b>encrypted</b>… not that the website is honest! Hackers can have a padlock too.</p>
<h4>🌍 In real life</h4>
<ul>
<li>When in doubt, don't click: go to the official website by typing its address yourself.</li>
<li>A real bank will never ask for your password in a message.</li>
</ul>`,
  fragment: [7, '01000101'],
},

/* ======================= DAY 22 ====================== */
{
  jour: 22, piece: piece(22), particules: particules(22), couleurs: couleurs(22),
  univers: "The Hacker Elf's Den",
  emoji: '💻',
  concept: 'The terminal and files',
  givrin: {
    ricane: "I've cut the password in two and hidden the pieces. A black screen, no icons… You'll be crying in neon green.",
    piques: [
      "Wrong! Even a mouse lost in this terminal would have found it. Oh wait, there's no mouse.",
      "Wrong! You forgot half the password. Like half your brain?",
      "No. Type “help”, you poor little thing. Or cry. Both work.",
    ],
    fuite: "cd /exit… rm ker… Nooo, not the rm command!",
  },
  histoire: `<p>In the Hacker Elf's Den, under the chalet's roof, there's no mouse, no windows, no icons: just a black screen and green text. It's a <b>terminal</b>! You give the computer orders by typing <b>commands</b>. The <b>Ker</b> lurking under the roof stole today's password, <b>cut it in two</b>… and hid each half in a different corner of the disk.</p>`,
  cours: `<p>In a computer, files (texts, photos…) are stored in <b>folders</b>, which are themselves stored in other folders, like boxes inside boxes.</p>
<p>Usually, you open these folders with the mouse, by double-clicking. In a <b>terminal</b>, there's no mouse: you type <b>commands</b> on the keyboard, then press <b>Enter</b> to run them. The computer answers in writing, just below.</p>
<p>At any moment, you are “inside” a folder, as if you were in a room: you can look at what it contains, go into a subfolder or go back. The <code>help</code> command will give you the list of available commands.</p>
<p>Two terminal secrets: a name starting with a <b>dot</b> (like <code>.secret</code>) is <b>hidden</b>: only the <code>ls -a</code> command shows it. And a path starting with <code>/</code> starts right at the top, from the <b>root</b>: <code>/var/log</code> means “the log folder, inside the var folder, at the root”, wherever you are.</p>`,
  enigme: `<p>Explore the Elf's computer to find the <b>two halves</b> of the password, then type the whole thing in the answer box. Click in the terminal, type <code>help</code> and press <b>Enter</b>.</p>`,
  widget: W.terminal({
    home: {
      elf: {
        'readme.txt': "Hi, it's the Hacker Elf! 👋\n\nThe Ker stole today's password. I tracked it down: it cut the password into TWO halves, and hid each half in a different place.\n\nCommand reminder:\n  ls             → see what's in the folder\n  ls -a          → also see hidden items\n  cd workshop    → go into the “workshop” folder\n  cd ..          → go back up to the parent folder\n  cat file       → read a file\n\nStart by searching my workshop. And remember: that Ker loves HIDDEN things…",
        workshop: {
          'toys.txt': "Toys being made:\n- 120 wooden trains\n- 85 teddy bears\n- 42 robots\n\n(Nothing here… but you're getting warmer!)",
          tools: { 'hammer.txt': 'A hammer. Just a hammer. 🔨', 'screwdriver.txt': 'A Phillips screwdriver. Nothing interesting.' },
          '.hideout': { 'note.txt': "Well done, you found my secret hideout! 🕵️\n\nI saved the 1st half of the password before the Ker could erase it:\n\n    SNOW\n\nFor the 2nd half, the Ker bragged about it in the system log. Logs are kept in the log folder, inside the var folder, right at the top:\n\n    /var/log\n\nTip: a path starting with / starts from the root. And the Ker always signs its files… by hiding them." },
        },
        photos: { 'reindeer.txt': '[Blurry photo of a reindeer pulling a face] 🦌', '.awkward-selfie.txt': '[Selfie of the Elf in a ridiculous hat]\nHidden file… but nothing useful here. 😳' },
      },
    },
    etc: {
      'noel-os.conf': "# NOËL-OS configuration\nsystem        = NOËL-OS v24.12\nstatus        = FROZEN ❄️\nspell         = KRYOS\npassword      = ********  (erased by the Ker, hee hee)\n",
      hosts: "127.0.0.1     localhost\n10.24.12.25   workshop.north-pole.xmas",
    },
    var: {
      log: {
        'system.log': "[22:00] NOËL-OS started\n[22:14] Workshop: 120 trains made\n[23:02] Alert: temperature −42 °C\n[23:58] Unknown sign-in from the glacier…",
        'sleigh.log': "[21:00] Refuelling: done\n[21:30] Rudolph: nose recharged to 100%",
        '.ker.log': "[23:59] Ker: heh heh, nobody will ever read this hidden log.\n[23:59] Ker: the 2nd half of the password? Stashed in my secret icebox:\n            /tmp/.icebox/half.txt\n[00:00] Ker: let them try to find it! ❄️😈",
      },
    },
    tmp: {
      'draft.txt': "The Ker's shopping list: ice cubes, ice cubes, ice cubes, an elf hat (for the collection).",
      '.icebox': { 'half.txt': "Well played, smarty-pants… Here's the 2nd half:\n\n    FLAKE\n\nGlue the two halves back together in order, and type the full password.\n— The Ker (furious)" },
    },
    bin: { ls: '[binary program] 01101100 01110011', cat: '[binary program] 🐱' },
  }, ['home', 'elf']),
  reponses: ['47733ccc89b0acc0fd545acd89d8d4f434538a091ec0b78ffa09a6b81b151977'],
  placeholder: 'The password you found…',
  indices: [
    'Type “cat readme.txt”, then “cd workshop” and “ls -a”: items starting with a dot are hidden. The 1st half is in a hidden folder in the workshop.',
    'For the 2nd half: “ls -a /var/log” shows a hidden log of the Ker\'s; read it with “cat”, it gives you the full path to its hiding place. A path starting with / is typed as it is, wherever you are.',
  ],
  lecon: `<p>The password was <b>SNOWFLAKE</b> ❄️: <code>SNOW</code> in the workshop hideout, <code>FLAKE</code> in the Ker's secret icebox. You used a <b>terminal</b>, like professional computer scientists!</p>
<p>A computer's files are stored in a <b>tree</b>: folders inside folders, like the branches of a tree… upside down 🙃</p>
<pre class="code">/                     ← the root
├── home/
│   └── elf/          ← “~”
│       └── workshop/
│           └── .hideout/
│               └── note.txt
├── var/
│   └── log/
│       └── .ker.log
└── tmp/
    └── .icebox/
        └── half.txt</pre>
<ul>
<li><code>/var/log/.ker.log</code> is an <b>absolute path</b> (it starts from the root); <code>workshop/toys.txt</code> is a <b>relative path</b> (it starts from the folder you're in).</li>
<li><code>..</code> means the parent folder.</li>
<li>Files starting with a dot are <b>hidden</b>: they're often settings you don't want to see all the time… or a Ker's hiding places.</li>
<li>The <code>/var/log</code> folder holds the <b>logs</b>: the logbook where the computer writes down everything that happens. It's the first place computer investigators look!</li>
</ul>
<h4>🌍 In real life</h4>
<ul>
<li>Most of the Internet's servers run on <b>Linux</b>… and are controlled through a terminal.</li>
<li>Your computer has a terminal too: “Terminal” on Mac and Linux, “PowerShell” on Windows. Try <code>ls</code> (or <code>dir</code>)!</li>
<li>The commands <code>ls</code>, <code>cd</code> and <code>cat</code> have existed since the 1970s (the Unix system) and have hardly changed.</li>
</ul>`,
  fragment: [21, '01000011'],
},

/* ======================= DAY 23 ====================== */
{
  jour: 23, piece: piece(23), particules: particules(23), couleurs: couleurs(23),
  univers: "The Robot Elf's Lab",
  emoji: '🤖',
  concept: 'Artificial intelligence (learning from examples)',
  givrin: {
    ricane: "Your robot has no rules. It'll never guess anything… just like you. You'll get on famously.",
    piques: [
      "Wrong! The reindeer are sulking. Sulking very hard. They bite, too.",
      "Wrong. Even a toaster would learn faster than you.",
      "No! Your rule doesn't work for every example. Look harder!",
    ],
    fuite: "It's learning… it's learning all by itself! It even figured me out! I'm off!",
  },
  histoire: `<p>In the Lab, a <b>smart robot</b> has to guess which toys the reindeer like. Nobody gave it a rule: it was only shown <b>examples</b>. Your turn to do what the robot does: find the hidden rule!</p>`,
  cours: `<p>Usually, to get a computer to do something, a human writes precise <b>rules</b> for it. But some rules are almost impossible to write: how do you explain to a machine what makes a photo show a cat?</p>
<p>With <b>machine learning</b>, you do it differently: you show the machine lots of <b>examples with the right answer</b> (“this is a cat”, “this is not a cat”), and the machine itself looks for a rule that works for all those examples. Just like a toddler who learns to recognize dogs after seeing lots of them.</p>
<p>To find a hidden rule, compare the examples: what do <b>all</b> the ones with the same answer have in common? A rule is only good if it works for <b>every</b> example, without exception.</p>`,
  enigme: `<p><b>The examples shown to the robot:</b></p>
<div class="defilement"><table class="tableau table-ia">
<tr><th>Toy</th><th>Color</th><th>Makes noise?</th><th>Size</th><th>The reindeer…</th></tr>
<tr><td>🔔 Little bell</td><td>red</td><td>yes</td><td>small</td><td>❤️ love it</td></tr>
<tr><td>🧸 Teddy bear</td><td>red</td><td>no</td><td>big</td><td>😐 meh</td></tr>
<tr><td>🥁 Drum</td><td>blue</td><td>yes</td><td>big</td><td>❤️ love it</td></tr>
<tr><td>⚽ Ball</td><td>green</td><td>no</td><td>small</td><td>😐 meh</td></tr>
<tr><td>🎺 Trumpet</td><td>green</td><td>yes</td><td>big</td><td>❤️ love it</td></tr>
<tr><td>🧊 Cube</td><td>blue</td><td>no</td><td>small</td><td>😐 meh</td></tr>
<tr><td>🍎 Wooden apple</td><td>red</td><td>no</td><td>small</td><td>😐 meh</td></tr>
<tr><td>🛎️ Jingle bell</td><td>green</td><td>yes</td><td>small</td><td>❤️ love it</td></tr>
</table></div>
<p><b>The new toys</b> (each one has a letter):</p>
<div class="defilement"><table class="tableau table-ia">
<tr><th>Letter</th><th>Toy</th><th>Color</th><th>Makes noise?</th><th>Size</th></tr>
<tr><td><b>S</b></td><td>🎷 Saxophone</td><td>blue</td><td>yes</td><td>small</td></tr>
<tr><td><b>K</b></td><td>🧣 Scarf</td><td>red</td><td>no</td><td>big</td></tr>
<tr><td><b>L</b></td><td>🔔 Big bell</td><td>green</td><td>yes</td><td>big</td></tr>
<tr><td><b>O</b></td><td>📕 Book</td><td>blue</td><td>no</td><td>big</td></tr>
<tr><td><b>E</b></td><td>🎸 Guitar</td><td>red</td><td>yes</td><td>big</td></tr>
<tr><td><b>T</b></td><td>🪀 Yoyo</td><td>red</td><td>no</td><td>small</td></tr>
<tr><td><b>D</b></td><td>📯 Little horn</td><td>green</td><td>yes</td><td>small</td></tr>
</table></div>
<p>Which new toys will the reindeer love? <b>Their letters, in order, spell the password.</b></p>`,
  reponses: ['04c1e076788df781810dc8ce83e92ff675fe47e95c691b2537323addac0a5af2'],
  placeholder: 'The word…',
  indices: [
    'Color? Some red toys are loved and others are “meh”. Size? Same thing. Look at the column that\'s left…',
    'Every loved toy makes noise, and no quiet toy is loved: the reindeer love toys that make noise! Apply that rule to the new toys.',
  ],
  lecon: `<p>The hidden rule: <b>the reindeer love toys that make noise</b> 🔔 (it reminds them of the bells on their harness!). Neither color nor size mattered.</p>
<p>So the loved toys are S (saxophone), L (big bell), E (guitar) and D (little horn) → <b>SLED</b> 🛷.</p>
<p>You've just done what an <b>artificial intelligence</b> does: <b>machine learning</b>. Instead of writing the rule by hand, you show the machine <b>labelled examples</b> (“love it” / “meh”), and it finds a rule that explains them by itself. Then it applies it to cases it has never seen.</p>
<p>The pieces of information about each toy (color, noise, size) are called <b>features</b>. The machine's job is to work out which ones really matter.</p>
<h4>⚠️ The danger of bias</h4>
<p>If the robot had only been shown red, noisy toys, it could never have known whether the reindeer like red or noise. An AI is never better than its examples: if they're incomplete or unfair, it will learn a wrong or unfair rule. That's called <b>bias</b>.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your email's spam filter learned from millions of emails marked “spam” or “not spam”.</li>
<li>Video and music recommendations learn from what you've liked.</li>
<li>Chatbots learned from huge amounts of text, thanks to “neural networks” with billions of parameters.</li>
</ul>`,
  fragment: [1, '01001100'],
},

/* ======================= DAY 24 ====================== */
{
  jour: 24, piece: piece(24), particules: particules(24), couleurs: couleurs(24),
  univers: 'The Great Hall',
  emoji: '⭐',
  concept: 'The grand finale',
  givrin: {
    nom: "Kryos",
    ricane: "My Keres have fled? All the better: I won't have to share. The star is mine… and you'll make a very pretty ice statue in my living room.",
    piques: [
      "Wrong. One more mistake and I'll put you next to the elves, in my freezer.",
      "Trembling? That's normal: it's −80 °C in my heart. Back when I had one.",
      "A thousand years in a glacier only to end up facing you… I'd cry with laughter, if my tears didn't freeze.",
    ],
    fuite: "Nooo! That light… I'll be back… in a thousand years… with a warmer coat!",
  },
  histoire: `<p>It's the big night! Here you are in the Great Hall, in front of the tree. <b>Kryos</b> is standing there, wrapped in a cloak of ice, one hand resting on <b>the dark star</b>. A thousand years ago, a <b>secret spell</b> locked him inside his glacier, the only one that can light the star again. So he cut it into <b>23 fragments</b> and entrusted them to his Keres… without realizing that every Ker, as it fled, left one behind for you!</p>`,
  cours: `<p>Final stretch! Each fragment you won contains a letter and its <b>position</b> in the secret spell, written in <b>binary</b> with 5 places. Just like on day 1, add up the places that have a 1:</p>
<div class="defilement"><table class="tableau compact">
<tr><th>16</th><th>8</th><th>4</th><th>2</th><th>1</th><th>Position</th></tr>
<tr><td>0</td><td class="allume">1</td><td>0</td><td>0</td><td class="allume">1</td><td>8 + 1 = <b>9</b></td></tr>
<tr><td class="allume">1</td><td>0</td><td class="allume">1</td><td>0</td><td>0</td><td>16 + 4 = <b>20</b></td></tr>
</table></div>
<p>Then put each letter in the box with that number. The boxes only hold letters, with no spaces: once everything is in place, it's up to you to spot the words!</p>`,
  enigme: `<p>Each fragment is a letter with its <b>position</b> in the secret spell… written in <b>binary</b> (thanks, day 1!). Put the letters back in order to rebuild the spell, then light up the star.</p>
<div class="rappel">📌 <b>Reminder</b>: the positions are written with 5 places, worth <code>16 · 8 · 4 · 2 · 1</code>. Example: <code>00110</code> = 4 + 2 = 6.</div>`,
  widget: W.finale(23),
  reponses: ['22cbd35071bff0460b8fdd2c952cf7f9d3e2d7ca2fbc10d1dde07b318b647124'],
  sansChamp: true,
  indices: [
    'Convert each binary position into a number: 00001 = 1, 00010 = 2, 00011 = 3, 00100 = 4… (the bulbs are worth 16, 8, 4, 2, 1).',
    "It's a magic spell in Latin, the language of old spellbooks. Four words, and the first one means “light”.",
  ],
  lecon: `<p class="grand">🌟 “Lux aeterna glaciem vincit!” 🌟</p>
<p class="centre petit">“Eternal light conquers the ice”: the Latin spell that already locked Kryos away a thousand years ago ✨</p>
<div class="fin-de-lettre">
<h4>📜 The ice is melting… and the end of Santa's letter reappears!</h4>
<div class="scene-lettre"><div class="lettre-pole-nord lettre-degel">
<p><span class="deja">But above all, whatever happens, never</span> lose heart. Kryos feeds on discouragement: every time someone gives up, winter gains a little ground. But every time someone understands something new, a spark lights up, and the cold retreats.</p>
<p class="appel">I'm counting on you. Every child in the world is counting on you.</p>
<div class="bas-lettre"><div class="sceau" aria-hidden="true">SC</div><div class="signature"><span class="nom-signature">Santa Claus</span>{{PARAPHE}}</div></div>
<p class="ps">P.S. Beware of Kryos. He's cunning… and he hates to lose.</p>
</div></div>
<h4>✉️ And tonight, Santa is writing you one last letter…</h4>
<div class="scene-lettre"><div class="lettre-pole-nord lettre-finale">
<p class="entete-lettre">North Pole, December 24,<br>at the foot of the tree</p>
<p class="salutation">{{PRENOM}},</p>
<p>You did it! The star is shining again at the top of the tree. When it lit up, <b>Kryos</b> let out a terrible howl and fled back into his glacier, which closed over him. For a thousand years, at least!</p>
<p>His Keres melted like snow in the sun, and the walls of our dungeons with them: my elves are free, and so am I! NOËL-OS is purring, the workshop is running at full steam, and my reindeer are stamping their hooves in front of the sleigh.</p>
<p>You never lost heart, not even when Kryos froze the end of my letter. The prophecy was right: you truly are the Savior of Christmas. And along the way, you learned things that the best elves take years to understand.</p>
<p>Tonight, when the sleigh flies over your home, look up: I'll ring my bells just for you.</p>
<p class="appel">Merry Christmas, and thank you for everything!</p>
<div class="bas-lettre"><div class="sceau" aria-hidden="true">SC</div><div class="signature"><span class="nom-signature">Santa Claus</span>{{PARAPHE}}</div></div>
<p class="ps">P.S. The elves voted unanimously: you are now an Honorary Grand Elf of the North Pole! 🎖️</p>
</div></div>
</div>
<p>For this last puzzle, you converted binary (day 1) and put pieces back in order like TCP does (day 14). In 24 days, here is everything you discovered:</p>
{{RECAP}}
<h4>🧑‍🔬 Two pioneers to know</h4>
<ul>
<li><b>Ada Lovelace</b> wrote the first computer program in history in 1843… for a machine that was never built!</li>
<li><b>Alan Turing</b> described in 1936 an imaginary machine able to compute anything that can be computed: the very idea of the computer.</li>
</ul>
<h4>🚀 What's next?</h4>
<ul>
<li><b>Scratch</b> (scratch.mit.edu) to create games by snapping blocks together;</li>
<li><b>Code.org</b> and <b>CS Unplugged</b> (csunplugged.org) to learn computer science step by step, even without a computer;</li>
<li>the <b>Bebras challenge</b>, a fun computational thinking contest;</li>
<li><b>Root-Me</b> (root-me.org) for cybersecurity challenges, when you want to become a real ethical hacker 🕵️</li>
</ul>
<p class="grand">Merry Christmas! 🎄</p>`,
  fragment: null,
},

];

module.exports = JOURS;
