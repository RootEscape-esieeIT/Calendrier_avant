/* =========================================================
   NOËL-OS — The 24 puzzles, ENGLISH version (server file)
   Same structure as jours.js. Answers that depend on the
   language have their own SHA-256 fingerprints here:
       npm run empreinte -- 3 "my new answer"
   ========================================================= */

const W = new Proxy({}, { get: (_, type) => (...params) => ({ type, params }) });
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
  chrono: 900,
  histoire: `<p>This morning, nobody can get into the workshop: one of Kryos's <b>Keres</b> has replaced the lock with a <b>string of 8 light bulbs</b>, and carved a number in binary on the door with the tip of its icy claws.</p>`,
  cours: `<p>To write our numbers, we use <b>10 digits</b> (0 to 9), and the <b>place</b> of a digit changes its value. In <code>352</code>, the 3 is worth 300, the 5 is worth 50 and the 2 is worth 2: each place is worth <b>10 times</b> more than the one to its right.</p>
<p>A computer, on the other hand, is full of tiny switches that only have two positions: <b>on</b> or <b>off</b>. So it writes everything with only <b>two digits</b>: <b>1</b> for on, <b>0</b> for off. That's <b>binary</b>.</p>
<p>With only two digits, each place is worth <b>2 times</b> more than the one to its right: 1, 2, 4, 8, 16, 32, 64, 128. To read a binary number, just <b>add up the places that have a 1</b>:</p>
<div class="defilement"><table class="tableau compact">
<tr><th>128</th><th>64</th><th>32</th><th>16</th><th>8</th><th>4</th><th>2</th><th>1</th><th>Total</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td class="allume">1</td><td>0</td><td class="allume">1</td><td>4 + 1 = <b>5</b></td></tr>
<tr><td class="allume">1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td><b>128</b></td></tr>
<tr><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td><b>255</b></td></tr>
</table></div>
<p>Why is <code>10000000</code> worth 128? Because only the place worth 128 is on. And <code>11111111</code> = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = <b>255</b>: the biggest number you can write with 8 places.</p>
<p class="petit">💡 Why double, exactly? If you switch on every place to the right of a place, you always get 1 less than it (1 + 2 + 4 = 7, just before 8). That way, every number from 0 to 255 can be written in <b>exactly one</b> way, with no gaps and no duplicates.</p>`,
  enigme: `<p>The Ker pinned this note to the workshop door:</p>
<blockquote class="note">“Last night, I melted some snowmen. Their number is carved on the door, in binary of course: <code class="gros">0 0 0 1 0 0 0 1</code><br>To open it, switch on that number <b>plus</b> the number of boxes in this chalet's Advent calendar. Good luck… you'll need it.” <br><i>— The workshop's Ker</i></blockquote>
<p>Click the bulbs to switch them on or off, then try to open the door.</p>`,
  widget: W.ampoules(),
  indices: [
    "First, read the carved number: add up the places where there is a 1 (look at the table in the little lesson). Then count the boxes of the Advent calendar: they are the boxes on the front of the chalet.",
    "0 0 0 1 0 0 0 1 = 16 + 1 = 17 snowmen. The Advent calendar has 24 boxes: 17 + 24 = 41. Write 41 with the bulbs, starting with the biggest one that doesn't go over.",
  ],
  lecon: `<p>Well done! You first had to <b>read</b> binary, then <b>write</b> it:</p>
<div class="schema"><code>0 0 0 1 0 0 0 1</code> = 16 + 1 = <b>17</b> melted snowmen<br>17 + 24 boxes = <b>41</b><br><code>0 0 1 0 1 0 0 1</code> = 32 + 8 + 1 = <b>41</b></div>
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
  chrono: 900,
  histoire: `<p>In the chalet's Mail Room, the Ker breathed on the label printer. Frozen down to its circuits, it no longer prints letters… only <b>0s</b> and <b>1s</b>!</p>`,
  cours: `<p>You saw it on day 1: a computer can only store <b>numbers</b> (written in binary). So how does it remember letters, like your name?</p>
<p>It's simple: the whole world agreed on a big <b>lookup table</b> where every character gets a number. When you type a letter, the computer stores its number. When it has to display it, it looks the number up in the table and draws the matching letter.</p>
<p>It's like a playground secret code where A = 1, B = 2, C = 3… with one difference: in the computer table, the first numbers are already taken by other symbols (space, punctuation, digits…). So the letters start a bit further along, but they always follow the order of the alphabet.</p>
<p>And in memory, each number is stored… in binary, of course, on 8 bulbs (a <b>byte</b>), just like on day 1. For example, number 5 is written <code>00000101</code> there (4 + 1).</p>`,
  enigme: `<p>We absolutely need to know which gift is hidden in this parcel. Here is its label:</p>
<div class="etiquette-colis binaire">01010010 · 01001111 · 01000010 · 01001111 · 01010100</div>
<p>On the side of the printer, a sticker half torn off by the Ker says:</p>
<div class="schema"><code>A = 65 = 01000001</code></div>
<p>What is the gift?</p>`,
  reponses: ['1746b0affbe4a8883e44fede0b5d3f7c691c0f93de62516a959119a7466583e2', '481a2a1bc6ecfedc871409b4c92a795186b6ac8e16fa00157e09270ee2247dc0'],
  placeholder: 'The gift…',
  indices: [
    'Turn each group of 8 digits into a number, like the bulbs on day 1 (128, 64, 32, 16, 8, 4, 2, 1). Then find the matching letter: A = 65, B = 66, C = 67…',
    '01010010 = 64 + 16 + 2 = 82, and 82 − 65 = 17: it is the letter 17 places after A, the 18th of the alphabet. Tip: every group starts with 010, worth 64; only the last 5 digits change.',
  ],
  lecon: `<p>You had to decode <b>twice</b>: binary into numbers (82, 79, 66, 79, 84), then numbers into letters: <b>ROBOT</b>.</p>
<p>Did you notice that every group started with <code>010</code>? Capital letters go from 65 to 90: they all start with 010, and the last 5 digits give their place in the alphabet directly (R = <code>10010</code> = 18, the 18th letter). The people who designed the table did it on purpose!</p>
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
    ricane: "Two keys, one child's letter, zero hope. I adore wishes that never come true.",
    piques: [
      "Wrong. That kid's getting socks. Your fault.",
      "Spin, spin my pretty wheels… and go round in circles.",
      "Even Caesar would give up. Then again, he ended up stabbed: he was used to nasty surprises.",
    ],
    fuite: "Both my keys, shattered like glass! I'm off to the cellar to encrypt my will.",
  },
  chrono: 900,
  histoire: `<p>In the Letter Attic, between two old trunks, a child's letter was found… but the attic's <b>Ker</b> has <b>encrypted</b> it. It knows the Caesar cipher, and it knows that cipher breaks in 25 tries. So it was craftier: it used <b>two keys</b>, taking turns!</p>`,
  cours: `<p>To <b>encrypt</b> a message is to transform it so that only people who know the secret can read it again. That secret is called the <b>key</b>.</p>
<p>The Ker's method is one of the oldest: you move every letter forward in the alphabet by the same number of steps. With a key of 3:</p>
<div class="schema"><code>A → D &nbsp; B → E &nbsp; C → F &nbsp; … &nbsp; X → A &nbsp; Y → B &nbsp; Z → C</code></div>
<p>When you reach Z, you go back to the start of the alphabet, like on a <b>wheel</b>. With this key, <code>NOEL</code> becomes <code>QRHO</code>.</p>
<p>To <b>decrypt</b>, you go the other way: you move every letter back by the same number of steps.</p>
<p>A crafty Ker can also use <b>two keys</b>, taking turns: the 1st letter with the first key, the 2nd with the second, the 3rd with the first again… (only letters count). With keys 1 and 2, <code>NOEL</code> becomes <code>OQFN</code>. To decrypt, you need to find <b>both</b> keys… and this time, you don't know them.</p>`,
  enigme: `<p>The 1st letter was shifted with the <b>gold key</b>, the 2nd with the <b>silver key</b>, the 3rd with the gold one again, and so on (only letters count, not spaces or punctuation).</p>
<p>Set both wheels to recover the message. <b>Which gift did the child ask for?</b></p>`,
  widget: W.cesar('LDIQ AZVSI, SPHA XMZZ H ENCKL KWUM ZV DTDKSZHK FCHBZZ SW OTZG QWBS HV LG AMCZNWL. BGIMS XWT! TNC', 2),
  reponses: ['9931f63314743ab42b1fe91e4ac33bf733eeae407b156f39e5e7146f64668cc9', '25e56a0f2c22de9d8a74118a735bc9b14a057e9aa2a1474c4acc83f09df58067', 'a90c1a0b7a6bae5991b1fc1505ee58e14b68e84fa803ac0163288ec08ccb49fb', '92953085cc639c756a52d65a0d2e5a99be816c17a4818ff319a216fd9809ccf8'],
  placeholder: 'The gift asked for…',
  indices: [
    'One wheel at a time: set the gold wheel until the gold letters at the start look like English, ignoring the silver ones. Then do the same with the silver wheel.',
    'Every letter to Santa starts with “DEAR SANTA”! The 1st encrypted letter, L, must turn back into D (gold wheel); the 2nd, D, must turn back into E (silver wheel).',
  ],
  lecon: `<p>The keys were <b>8</b> (like the reindeer pulling the sleigh) for the gold letters and <b>25</b> for the silver ones. Encrypting with several keys in turn is the idea behind the <b>Vigenère cipher</b> (1586), nicknamed “the indecipherable cipher” for nearly 300 years!</p>
<p>With a single key, there are only 25 tries. With two, there are 25 × 25 = <b>625</b>. And with a 10-letter key, nearly <b>100 trillion</b>: far too many to try by hand.</p>
<h4>🕵️ How did you crack it?</h4>
<p>Thanks to a mistake by the Ker: every letter to Santa starts with “DEAR SANTA”. Knowing a piece of the message lets you find the keys one by one: that's a <b>known-plaintext attack</b>. That's how Alan Turing and his team broke the German <b>Enigma</b> machine during the Second World War: many messages started with the weather report!</p>
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
  concept: 'Pixels and colors (RGB, hexadecimal)',
  givrin: {
    ricane: "I've switched the machine to negative. Your tree will come out candy pink, and your snow… black as my soul.",
    piques: [
      "Wrong! Another ruined bauble: I'm keeping it for my collection of horrors.",
      "You mix colours like a colour-blind elf. Mind you, they're all frozen now: they can't see a thing.",
      "That colour is called “defeat grey”. Very trendy this year.",
    ],
    fuite: "Too many colours! My eyes! I'm going back to the polar night, at least it's black…",
  },
  chrono: 900,
  histoire: `<p>In the Paint Workshop, the Ker has tampered with the machine that paints the tree's baubles: now it paints everything <b>in negative</b>! Each lamp does the opposite of what you ask.</p>`,
  cours: `<p>Look at your screen very closely (even better with a magnifying glass): it's made of millions of tiny dots, called <b>pixels</b>. Each pixel contains <b>3 tiny lamps</b>: a <span class="r">red</span> one, a <span class="g">green</span> one and a <span class="b">blue</span> one. By setting how bright each one is, the screen makes every color.</p>
<p>⚠️ Here we're mixing <b>light</b>, not paint: the rules aren't the ones from your paint box! For example, all 3 lamps at full power make <b>white</b>, and all 3 lamps off make <b>black</b>.</p>
<p>To set each lamp, the computer uses 2 characters written in <b>hexadecimal</b>: a way of counting with <b>16 digits</b> instead of 10. After 9, since there are no more digits, it carries on with letters:</p>
<div class="schema"><code>0 1 2 3 4 5 6 7 8 9 A B C D E F</code><br><span class="petit">A is 10, B is 11… and F is 15</span></div>
<p>No need to calculate: just remember that <code>00</code> = lamp <b>off</b>, <code>80</code> = lamp at <b>half power</b> and <code>FF</code> = lamp at <b>full power</b> (it's the biggest 2-character number, like 99 for us).</p>
<p><b>Taking a pair away from FF</b> is very easy: replace each digit with “F minus that digit”, counting along the list above. Example: FF − <code>3A</code> = <code>C5</code>, because F − 3 = C (15 − 3 = 12) and F − A = 5 (15 − 10 = 5).</p>
<p>A color code sticks the settings of the 3 lamps together, always in the order <span class="r">red</span>, <span class="g">green</span>, <span class="b">blue</span>. Example: <code>#0000FF</code> = red off, green off, blue at full power → pure blue.</p>`,
  enigme: `<p>The elves had left some instructions… and the Ker added to them:</p>
<div class="note">
<p>📘 <b>Machine instructions</b></p>
<p>A color code = <b>3 pairs</b> of characters: <span class="r">Red</span>, <span class="g">Green</span>, <span class="b">Blue</span>. Each pair goes from <code>00</code> (light off) to <code>FF</code> (light at full power). The machine mixes <b>light</b>, not paint.</p>
<p>✏️ <i>New setting: every pair is inverted. The machine paints <b>FF minus</b> what you type. You type <code>00</code> → it paints <code>FF</code>. You type <code>FF</code> → it paints <code>00</code>. Icy kisses. — The Ker</i></p>
</div>
<p>Urgent order: an <b>ORANGE</b> bauble for the tree, which means <span class="r">red at full power</span>, <span class="g">green at half power</span> (<code>80</code>) and <span class="b">blue off</span>. Which code must you type so that the machine really paints it?</p>`,
  widget: W.couleur(true),
  reponses: ['11d9c66df32acc61307a1733c8b7894db9469a3f448a585da7510f6b334496c2'],
  placeholder: '#RRGGBB',
  indices: [
    'First write the code of the orange you want (red FF, green 80, blue 00), then invert each pair. Check with the test bauble: it shows what the machine really paints.',
    'To invert a pair, replace each digit with F minus that digit: F → 0, 8 → 7, 0 → F. So FF → 00, 80 → 7F, 00 → FF.',
  ],
  lecon: `<p>You had to type <code>#007FFF</code>: the tampered machine paints FF − 00 = <span class="r">FF</span>, FF − 7F = <span class="g">80</span> and FF − FF = <span class="b">00</span>… which is the orange <code>#FF8000</code> that was ordered!</p>
<p>The inverse of a color is called its <b>negative</b>, like on old photo film: orange turns sky blue, green turns pink. Every drawing program has an “Invert colors” button that does exactly this calculation.</p>
<p>When you mix light, red + green = <b>yellow</b>, and red + a little green = <b>orange</b>! (With paint, you'd get something brownish: light mixing is <i>additive</i>, paint mixing is <i>subtractive</i>.) This 3-lamp system is called <b>RGB</b>.</p>
<p>Each lamp has 256 levels (one byte, like on day 1!). In hexadecimal, the first character counts “bundles of 16”: <code>FF</code> = 15 × 16 + 15 = <b>255</b>, <code>80</code> = 8 × 16 = 128 and <code>7F</code> = 7 × 16 + 15 = 127. And 128 + 127 = 255: a pair and its negative always add up to FF.</p>
<p>256 × 256 × 256 = <b>16,777,216</b> possible colors!</p>
<h4>🌍 In real life</h4>
<ul>
<li>Every website uses these codes: the gold of this page's star is written <code>#F5C542</code> in its code.</li>
<li>Hold a magnifying glass (or a drop of water) close to a screen: you'll see the little red, green and blue lights!</li>
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
    ricane: "Five switches, one circuit, and me in the middle. Touch the wrong wire and we'll laugh. Mostly me.",
    piques: [
      "Bzzzt! Wrong. Can you smell burning? That's your reasoning.",
      "NOT, NOT and NOT again. It's my favourite logic gate.",
      "Keep trying at random. A monkey would get there too… in a few million years.",
    ],
    fuite: "The current's flowing?! Stop, it tickles… it sizzles… I'm short-circuiting!",
  },
  chrono: 900,
  histoire: `<p>In the basement, the armoured door of the Toy Storeroom is protected by an <b>electronic circuit</b>. The Ker has rewired it: now <b>five switches</b> (A to E) send current through <b>five logic gates</b>. All five must be on at the same time for the star to light up and the door to open.</p>`,
  cours: `<p>To make decisions, a computer uses billions of <b>logic gates</b>. A logic gate receives one or two signals, each one <b>on (1)</b> or <b>off (0)</b>, and lets only one signal out, following a very simple rule. You already use these rules every day without knowing it:</p>
<div class="defilement"><table class="tableau">
<tr><th>Gate</th><th>It's on if…</th><th>In everyday life</th></tr>
<tr><td><b>AND</b></td><td class="gauche"><b>both</b> inputs are on</td><td class="gauche">I have my ticket AND the bus is here → I get on.</td></tr>
<tr><td><b>OR</b></td><td class="gauche"><b>at least one</b> input is on (or both)</td><td class="gauche">Someone rings at the front door OR the back door → the bell rings.</td></tr>
<tr><td><b>NOT</b></td><td class="gauche">its input is <b>off</b>: it does the opposite</td><td class="gauche">It's NOT daytime → the night light comes on.</td></tr>
<tr><td><b>XOR</b></td><td class="gauche"><b>exactly one</b> of the two inputs is on (not both)</td><td class="gauche">On the menu: cheese OR dessert, but not both!</td></tr>
</table></div>
<p>Just like in maths, you work out what's <b>in brackets</b> first: in <code>(NOT A) OR C</code>, you look at NOT A first, then do the OR with C.</p>`,
  enigme: `<p>Find the <b>only</b> position of the switches that turns on all five gates. There are 32 possible positions: <b>reason it out</b> instead of trying them all, a real engineer reads the circuit! Tip: start with the gate that tells you the most.</p>`,
  widget: W.portes(),
  indices: [
    'Start with P2: it contains “NOT D”, so D must be off. With D off, what do you need to switch on P4?',
    'D = 0 forces E = 1 (for P4). P5 then forbids A being on: A = 0. So for P2 you need C = 1. Only B is left, and P3 decides it.',
  ],
  lecon: `<p>The solution was <b>A = 0, B = 0, C = 1, D = 0, E = 1</b>… the only one out of 32 possible positions! The reasoning: P2 requires D = 0; then P4 needs E = 1; P5 forbids switching on A together with E, so A = 0; P2 then asks for C = 1; finally P3 wants B to be different from C: B = 0.</p>
<p>You worked like a real engineer: start from what is <b>certain</b>, then draw the consequences one by one. That's called <b>deduction</b>.</p>
<p>AND, OR and NOT are called <b>logic gates</b>. They follow <b>Boolean algebra</b>, invented by George Boole in 1854… almost 100 years before the first computer!</p>
<p>Inside a processor, each gate is built from <b>transistors</b>: tiny switches controlled by electricity. By combining gates, you can build a circuit that adds two binary numbers, then a calculator, then… a whole computer.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your phone's processor contains <b>billions of transistors</b>, each smaller than a virus.</li>
<li>The same words are used to search the web or a database: “cats AND dogs”, “NOT expensive”…</li>
<li>In Minecraft, “redstone” lets you build real logic gates… and even entire computers!</li>
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
    ricane: "I've siphoned off the sleigh's fuel. There's exactly enough left for a genius. Not for you.",
    piques: [
      "Out of fuel! The sleigh stays in the garage and the children cry. Delicious.",
      "You swap parcels the way you'd shuffle cards: at random, and losing.",
      "Out of fuel again! I'll end up selling you some… at a very, very steep price.",
    ],
    fuite: "All sorted with fuel to spare?! I'm off, before you pack me in a box too!",
  },
  chrono: 900,
  histoire: `<p>In the Sleigh Garage, the gifts must be loaded <b>from lightest to heaviest</b>. But the conveyor belt is half frozen: the only thing you can do is <b>swap two neighboring parcels</b>. And every swap burns precious sleigh fuel…</p>`,
  cours: `<p>An <b>algorithm</b> is a <b>precise method</b>, step by step, for solving a problem. A cooking recipe or the instructions for flat-pack furniture are algorithms!</p>
<p>There are often several methods that give the same result… but some are much faster than others. So computer scientists are always looking for the one that needs <b>as few operations as possible</b>.</p>
<p>Here, only one operation is allowed: <b>swapping two neighboring parcels</b>, with the <b>⇄</b> button between them. Every swap costs fuel: think before you click!</p>`,
  enigme: `<p>Sort the parcels from lightest (left) to heaviest (right) in <b>14 swaps maximum</b>: that's the minimum possible, not one more! Careful: the Ker has slipped two parcels that weigh <b>exactly the same</b> into the row…</p>`,
  widget: W.tri([
    { emoji: '🧸', poids: 5 }, { emoji: '🎈', poids: 2 }, { emoji: '🚂', poids: 7 }, { emoji: '📚', poids: 3 },
    { emoji: '🛷', poids: 8 }, { emoji: '🎁', poids: 3 }, { emoji: '🪀', poids: 1 }, { emoji: '🎸', poids: 6 },
  ], 14),
  indices: [
    'Before clicking, count the pairs in the wrong order (a heavier parcel somewhere to the left of a lighter one): that is the minimum number of swaps. Never swap two parcels that are already in order… nor two parcels of the same weight!',
    'Bubble sort: go along the row from left to right and swap every pair where the heavier one is on the left. The heaviest “bubbles up” to the end. Then start again, never swapping the two 3 kg parcels with each other.',
  ],
  lecon: `<p>You've just used <b>bubble sort</b>: the heavy parcels “bubble up” to the right like bubbles in lemonade.</p>
<p>Why 14 swaps? There were exactly 14 <b>inversions</b>: 14 pairs of parcels in the wrong order (for example 5 kg placed before 2 kg). Swapping two neighbors fixes at most one inversion: you can't do better!</p>
<p>And the two 3 kg parcels? They are never “in the wrong order” compared with each other: swapping them fixes no inversion at all. That was the Ker's trap: fuel thrown out of the window!</p>
<p>The problem: for 1,000 gifts, bubble sort can need nearly <b>500,000 swaps</b>. Computer scientists invented much smarter sorts, like <b>merge sort</b>: split the pile in two, sort each half, then merge them. For 1,000 gifts: only about <b>10,000 operations</b>.</p>
<p>Counting how many operations an algorithm needs is called studying its <b>complexity</b>. It's one of the big questions in computer science.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Sorting is everywhere: search engine results, your news feed, your playlist, your contacts…</li>
<li>Sorting algorithms are so important that they are taught in every computer science school in the world.</li>
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
    ricane: "A million houses, one waiting chimney, and the sun rising soon. I adore races that are lost in advance.",
    piques: [
      "Wrong! The gift will end up at a dentist who hates Christmas.",
      "Guessing at random? Me too: I throw icicles at the reindeer.",
      "The sun rises, the snow melts, and you go round in circles. It's almost poetic.",
    ],
    fuite: "Found it in so few tries?! You cut everything in half… I'm off before you cut me too!",
  },
  chrono: 900,
  histoire: `<p>In the Observatory, the radio is crackling: the Ker has breathed on the sleigh's GPS! Santa is flying over the longest street in the world, Chimney Avenue: <b>a million houses</b>, numbered from 1 to 1,000,000. Only one is waiting for its gift tonight. The radio can only tell you whether the right house has a <b>higher</b> or <b>lower</b> number than the one you suggest.</p>`,
  cours: `<p>You probably know the “higher or lower” game: someone thinks of a number, you suggest one, and they answer “higher” or “lower”.</p>
<p>The simplest method is to try the numbers one by one: 1, 2, 3… It always works in the end, but with a million houses it could take up to <b>a million tries</b>!</p>
<p>With only 20 tries, you have to be much smarter: every answer should let you <b>rule out as many houses as possible</b> in one go. Before each try, ask yourself: “Which number will rule out the most houses, whatever the answer?”</p>
<p>Example with 100 houses: if you suggest 10 and the answer is “higher”, you've only ruled out 10 houses. If the answer is “lower”, you've ruled out 90… but you can't count on luck!</p>`,
  enigme: `<p>Find the right house in <b>20 tries at most</b>, before sunrise. The house changes every game: luck won't be enough, you need a <b>method</b>… and precision. 20 tries is just barely enough, as long as you don't waste a single one!</p>`,
  widget: W.dichotomie(1000000, 20),
  indices: [
    'Start with house 500,000: whatever the answer, you rule out half the houses in one go.',
    'Always aim for the EXACT middle of the houses still possible (the golden zone): (lowest + highest) ÷ 2. For example, if houses 500,001 to 1,000,000 are left, try 750,000. A try that is only “roughly in the middle” can cost you the game!',
  ],
  lecon: `<p>By always aiming for the middle, you get rid of <b>half the houses</b> with every try:</p>
<div class="schema"><code>1,000,000 → 500,000 → 250,000 → 125,000 → 62,500 → 31,250 → 15,625 → 7,813 → 3,907 → 1,954 → 977 → 489 → 245 → 123 → 62 → 31 → 16 → 8 → 4 → 2 → 1</code></div>
<p>20 tries are always enough, because 2<sup>20</sup> = 1,048,576, which is just over a million. There was almost no margin: one badly placed try, and the sun came up! That's <b>binary search</b> (“cut in two”).</p>
<p>The crazy part: for <b>a billion</b> houses, you'd only need <b>30 tries</b>. Checking them one by one could take up to a billion…</p>
<p>⚠️ But careful: it only works if the houses are <b>in order</b>. That's why sorting (day 6) is so important!</p>
<h4>🌍 In real life</h4>
<ul>
<li>It's the natural way to look up a word in a paper dictionary.</li>
<li>Databases find one piece of information among billions in a few milliseconds thanks to this idea.</li>
<li>Developers use the <code>git bisect</code> tool to find, by binary search, the change that introduced a bug.</li>
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
  chrono: 900,
  histoire: `<p>In the Map Room, the big map of the delivery round is pinned to the wall. Santa has to deliver an urgent gift to <b>Lea's House</b>. On the map, each road shows its flying time in minutes. The reindeer are exhausted: you absolutely need the <b>fastest</b> route… and the Ker has stretched a red thread across the map to whisper a “shortcut” to you.</p>`,
  cours: `<p>A map like this one, with places connected by roads, is what computer scientists call a <b>graph</b>. Santa can <b>only fly along the roads drawn</b>, and each road shows its flying time in minutes.</p>
<p>The length of a trip is the <b>sum</b> of the times of all the roads you take. For example, if a 3-min road goes from the Farm to the Bridge, then a 4-min road from the Bridge to the Church, the trip Farm → Bridge → Church takes 3 + 4 = <b>7 minutes</b>.</p>
<p>To find the fastest route, you have to compare the different possible paths… without forgetting any!</p>`,
  enigme: `<p>Click the places, one by one, to draw the route from the <b>North Pole</b> to <b>Lea's House</b>. Santa will only accept the shortest route in time. Don't trust the number of steps, nor the Ker's advice!</p>`,
  widget: W.graphe(
    {
      A: { nom: 'North Pole', emoji: '🎅', x: 60, y: 190, dxNom: 6 },
      B: { nom: 'Frozen Lake', emoji: '🧊', x: 170, y: 70 },
      C: { nom: 'Forest', emoji: '🌲', x: 170, y: 310 },
      D: { nom: 'Trapper\'s Hut', emoji: '🛖', x: 290, y: 190 },
      E: { nom: 'Reindeer Village', emoji: '🦌', x: 400, y: 335 },
      F: { nom: 'Windmill', emoji: '🌬️', x: 330, y: 60 },
      G: { nom: 'Frosty Peak', emoji: '🏔️', x: 470, y: 70 },
      H: { nom: 'Ice Bridge', emoji: '🌉', x: 455, y: 220, dxNom: -38 },
      I: { nom: 'Lea\'s House', emoji: '🏡', x: 560, y: 170, dxNom: -10 },
    },
    [['A', 'B', 3], ['A', 'C', 4], ['A', 'D', 7], ['B', 'D', 3], ['B', 'F', 6], ['C', 'D', 4], ['C', 'E', 5], ['D', 'F', 2], ['D', 'H', 6], ['D', 'E', 2], ['E', 'H', 2], ['F', 'G', 3], ['G', 'I', 6], ['G', 'H', 2], ['H', 'I', 4], ['E', 'I', 9]],
    'A', 'I'
  ),
  indices: [
    'The route with the fewest steps isn\'t necessarily the fastest… and neither is the shortest first road! You have to compare complete routes.',
    'Work out, for each place, the minimum time from the North Pole, starting with the closest places. Example: the Trapper\'s Hut is 7 min away directly… but only 3 + 3 = 6 min via the Frozen Lake. Do the same for the Village, then the Bridge, then Lea\'s House.',
  ],
  lecon: `<p>The fastest route was <b>North Pole → Frozen Lake → Trapper's Hut → Reindeer Village → Ice Bridge → Lea's House</b>: 3 + 3 + 2 + 2 + 4 = <b>14 minutes</b>, in 5 steps. The traps were all a minute longer or more: straight to the Hut (7 + 2 + 2 + 4 = 15), via the Forest and the Bridge (4 + 5 + 2 + 4 = 15)… and the Ker's red thread, via the Forest and the direct road from the Village: 4 + 5 + 9 = <b>18 minutes</b>!</p>
<p>To a computer scientist, this map is a <b>graph</b>: <b>vertices</b> (the places) connected by <b>edges</b> (the roads), each with a <b>weight</b> (the time).</p>
<p>To find the shortest path, we use <b>Dijkstra's algorithm</b>. The idea: start from the departure point and work out, step by step, the minimum time to reach each place, always dealing with the closest place first. Edsger Dijkstra came up with it in 1956… in 20 minutes, on a café terrace in Amsterdam!</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your GPS does exactly this, on a graph of millions of roads.</li>
<li>On the Internet, “routers” choose the path of your data with similar algorithms.</li>
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
      "Wrong! You've just measured your failure: it's infinite.",
      "Start again. And again. And again… See? That's recursion.",
      "Even my reflection in my reflection in my reflection is laughing at you.",
    ],
    fuite: "You found the way out of my loop?! Impossible… impossi… impo…",
  },
  chrono: 900,
  histoire: `<p>Deep in the Ice Cellar, the Snowflake Master makes every snowflake with a single magic rule, which he repeats over and over…</p>`,
  cours: `<p>A <b>segment</b> is simply a <b>straight line</b> joining two points. A triangle, for example, is made of 3 segments.</p>
<p>The Master's rule isn't applied just once: at each new step, it's applied to <b>every</b> segment of the drawing, including the ones that were just created. The drawing gets more and more detailed… always with the same rule.</p>
<p>A rule that applies to its own result, again and again, is called a <b>recursive</b> rule. It's like two mirrors facing each other: the image contains an image, which contains an image…</p>
<p>The Master measures his snowflakes too. When you cut a segment into 3 equal parts, each piece is <b>3 times shorter</b>: a 30 cm segment gives 10 cm pieces. And the total length of an outline is simply the <b>number of segments × the length of one segment</b> (if they are all the same).</p>
<p>To answer, there's no need to draw the next steps (there would be far too many lines!): instead, watch how the <b>number</b> of segments and their <b>length</b> change from one step to the next.</p>`,
  enigme: `<div class="note">
<p>❄️ <b>The Master's rule</b></p>
<p>“Take each segment. Cut it into 3 equal parts. Replace the middle part with a point made of two segments.”</p>
<p>At step 0, the snowflake is just a simple triangle, and each side is <b>243 cm</b> long.</p>
</div>
<p>Watch the first steps with the slider. To decorate the tree, the Master wants to lay a golden ribbon all along the outline of the <b>step 4</b> snowflake. <b>How much ribbon does he need, in centimeters?</b></p>`,
  widget: W.koch(4),
  reponses: ['6bf63f09896f65dab16105d6aff12f2a947c79bcd76082f32c16b6dda9abea79', 'ea874bb366254527ecc224b6c403e162cc188ec2abb96190b144db621393cdb7', 'd1ae83fef8653cd5fef25d76fb891d28576ed57a6015ef8db24f9ce0228cd0b2', '3053505e2ed70bb1cdbcc45def22bcaecbcfd02795466b8183d0a6708d132eb7', '0377f8c2cf2d27f3f993bf83411fa650bbbee66ce2b689d3337a5dd6929271b5'],
  placeholder: 'Length in cm',
  indices: [
    'Two things change at each step: the number of segments (each one is replaced by 4) and the length of each segment (3 times shorter). Work out both for step 4.',
    'Step 4: 3 × 4 × 4 × 4 × 4 = 768 segments. Each segment is 243 ÷ 3 ÷ 3 ÷ 3 ÷ 3 = 3 cm long. Only one multiplication left!',
  ],
  lecon: `<p>At step 4, the snowflake has 3 × 4 × 4 × 4 × 4 = <b>768 segments</b>, and each one is 243 ÷ 81 = <b>3 cm</b> long. So you need 768 × 3 = <b>2,304 cm</b> of ribbon: more than 23 meters! The starting triangle only needed 3 × 243 = 729 cm.</p>
<p>At each step, the number of segments is multiplied by 4 and their length divided by 3: so the outline is multiplied by 4/3, a third more each time (729 → 972 → 1,296 → 1,728 → 2,304).</p>
<p>This snowflake is called the <b>Koch snowflake</b> (1904). Its rule applies to itself: that's <b>recursion</b>. In programming, a recursive function is a function that <b>calls itself</b> on a smaller problem:</p>
<pre class="code">function drawSegment(segment, step):
    if step == 0:
        draw the segment           ← stopping condition!
    else:
        cut into 4 small segments (with the point)
        for each small segment:
            drawSegment(small, step − 1)</pre>
<p>The <b>stopping condition</b> is essential: without it, the function would call itself forever and the program would crash.</p>
<p>Amazing fact: if you kept going forever, the snowflake would have an <b>infinite perimeter</b>… but an area that fits on a sheet of paper!</p>
<h4>🌍 In real life</h4>
<ul>
<li>The mountains, clouds and trees in animated films and video games are often generated with recursive fractals.</li>
<li>To find a file on your computer, the program explores a folder, then its subfolders, then their subfolders… recursively!</li>
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
    ricane: "I've reprogrammed the robot chef. It bakes biscuits… and throws some away whenever I feel like it.",
    piques: [
      "Wrong! The robot burnt the batch. And your pride with it.",
      "You skipped a line. Robots never skip lines. That's why people prefer them.",
      "Missed again. I'm eating a biscuit to your health. It tastes delicious… it tastes of your failure.",
    ],
    fuite: "I can smell warm biscuits… I'm meeeelting!",
  },
  chrono: 1200,
  histoire: `<p>In Mrs. Claus's Kitchen, the robot chef bakes cookies by following a <b>program</b>. But the Ker slipped into its circuits and rewrote it… making sure to help itself along the way.</p>`,
  cours: `<p>A <b>program</b> is a list of instructions that the computer follows to the letter, from top to bottom, without ever thinking for you. To read the robot's program, you need to know 4 things.</p>
<p><b>1. The arrow <code>←</code></b> means “put this value in the box”. <code>cookies</code> is a box (called a <b>variable</b>) holding a number. Example:</p>
<pre class="code">sweets ← 10
sweets ← sweets + 5</pre>
<p>The <code>sweets</code> box first holds 10, then 10 + 5 = <b>15</b>.</p>
<p><b>2. <code>WHILE</code></b> means “repeat the <b>indented</b> lines just below, as long as it's true”. The condition is checked <b>before each round</b>: as soon as it's false, you stop repeating and move on. Example:</p>
<pre class="code">sweets ← 1
WHILE sweets &lt; 10:
    sweets ← sweets × 3
DISPLAY sweets</pre>
<p>1 → 3 → 9 → 27. After 27, the condition “27 &lt; 10” is false: the loop stops and the program displays <b>27</b> (not 9!).</p>
<p><b>3. <code>IF</code> … <code>ELSE</code></b> means “if it's true, do the indented lines under IF; otherwise, do the ones under ELSE”. Only one of the two is done, never both. An <code>IF</code> on its own, without <code>ELSE</code>, does nothing when it's false.</p>
<p><b>4. Quick reminders</b>: an <b>even</b> number splits into two with nothing left over (2, 4, 6…), an <b>odd</b> number doesn't (1, 3, 5…). A <b>multiple of 4</b> is a number in the 4 times table: 4, 8, 12, 16, 20…</p>`,
  enigme: `<p>Here is the robot chef's new program:</p>
<pre class="code">cookies ← 3
round ← 0
WHILE cookies &lt; 60:
    round ← round + 1
    IF round is odd:
        cookies ← cookies × 2
    ELSE:
        cookies ← cookies + round
    IF cookies multiple of 4:
        cookies ← cookies − 5
DISPLAY cookies</pre>
<p class="petit">(That “− 5” is the Ker pinching 5 cookies every time the count lands in the 4 times table.)</p>
<p><b>Which number will the robot display at the end?</b></p>
<p class="petit">You can fill in this tracking table to help you (it's your rough work, it isn't marked).</p>`,
  widget: W.tableauSuivi(['round', 'cookies after × 2 or + round', 'multiple of 4? (− 5)', 'cookies at end of round'], 10),
  reponses: ['579f9b6fccd619b99dcfcc21f07e9388776a9860e45a7802f41d766051f9b582'],
  placeholder: 'Number displayed',
  indices: [
    'Go line by line, exactly like the robot, and write down round and cookies each time. At the start: cookies = 3 and round = 0. Check the condition “cookies < 60” before each new round, never in the middle.',
    'Round 1 (odd): 3 × 2 = 6, not in the 4 times table → 6. Round 2 (even): 6 + 2 = 8, a multiple of 4 → 8 − 5 = 3. Round 3: 3 × 2 = 6. Round 4: 6 + 4 = 10… Keep going until cookies reaches 60 or more at the end of a round!',
  ],
  lecon: `<p>The robot displays <b>95</b>, after 9 rounds:</p>
<div class="defilement"><table class="tableau"><tr><th>round</th><th>× 2 or + round</th><th>4 times table?</th><th>cookies</th></tr>
<tr><td>1</td><td>6</td><td>no</td><td>6</td></tr><tr><td>2</td><td>8</td><td>yes (− 5)</td><td>3</td></tr>
<tr><td>3</td><td>6</td><td>no</td><td>6</td></tr><tr><td>4</td><td>10</td><td>no</td><td>10</td></tr>
<tr><td>5</td><td>20</td><td>yes (− 5)</td><td>15</td></tr><tr><td>6</td><td>21</td><td>no</td><td>21</td></tr>
<tr><td>7</td><td>42</td><td>no</td><td>42</td></tr><tr><td>8</td><td>50</td><td>no</td><td>50</td></tr>
<tr><td>9</td><td>100</td><td>yes (− 5)</td><td>95</td></tr></table></div>
<p>The trap: in round 9 you go past 60… but the loop only stops when the condition is <b>checked again</b>, after finishing the whole round (including the Ker's theft).</p>
<p>You've just used the basic building blocks of <b>every</b> program:</p>
<ul>
<li><b>variables</b> (<code>cookies</code>, <code>round</code>): labelled boxes whose contents change;</li>
<li>a <b>loop</b> (<code>WHILE</code>): repeating instructions as long as a condition is true;</li>
<li><b>conditions</b> (<code>IF</code>, <code>ELSE</code>): making choices.</li>
</ul>
<p>And you did what developers do to understand a program: you <b>traced</b> it by hand, step by step. Here is the same program in <b>Python</b>, a real programming language:</p>
<pre class="code">cookies = 3
rnd = 0
while cookies &lt; 60:
    rnd = rnd + 1
    if rnd % 2 == 1:
        cookies = cookies * 2
    else:
        cookies = cookies + rnd
    if cookies % 4 == 0:
        cookies = cookies - 5
print(cookies)</pre>
<p class="petit"><code>%</code> gives the remainder of a division: <code>rnd % 2 == 1</code> means “the remainder of rnd ÷ 2 is 1”, so “the round is odd”.</p>
<h4>🌍 In real life</h4>
<ul>
<li>A cooking recipe is already an algorithm: steps, repetitions (“stir while it's sticky”), conditions (“if the dough is too dry, add milk, otherwise…”).</li>
<li>A video game runs inside a big “while the game isn't over” loop, repeated about 60 times a second: read the keys, move the characters, draw the picture.</li>
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
      "Wrong! You're mixing up the stack and the queue. Like your jumper: inside out.",
      "No. The guests ate your mistakes: now they've got indigestion.",
      "Wrong! I'm keeping the last pancake for myself. And yours too.",
    ],
    fuite: "Last pancake down, first one eaten… and me, first one out!",
  },
  chrono: 1200,
  histoire: `<p>In the Dining Room, it's snack time, and the service runs like a factory: on each pancake, a chocolate letter. But the Ker, ever greedy, is prowling around the plate…</p>`,
  cours: `<p>Computers spend their time putting information aside until they need it. There are two main ways to store it… and the order in which it comes back out changes everything!</p>
<p>🥞 The <b>stack</b>, like a pile of plates: you can <b>only touch the one on top</b>. The last one put down is the first one out.</p>
<p>🚶 The <b>queue</b>, like the line at the bakery: you join <b>at the back</b>, you're served <b>at the front</b>. First come, first served.</p>
<p>Example: you put down <b>A</b>, then <b>B</b> on a stack, then move the pancakes one by one, always the top one, onto a conveyor belt (a queue). The belt gets <b>B</b> first, then <b>A</b>: so <b>B</b> will reach the end of the belt first.</p>`,
  enigme: `<p>The cook puts the pancakes down on a <b>plate</b> (a stack). To <b>serve</b>, the cook takes the pancake on top of the plate and puts it at the back of a little <b>conveyor belt</b> (a queue). The guests always <b>eat</b> the pancake at the front of the belt. Here is what happened, in order:</p>
<ol class="operations">
<li>Put down <b>P</b></li><li>Put down <b>N</b></li><li>Put down <b>A</b></li><li>Put down <b>C</b></li><li>➡️ Serve</li><li>➡️ Serve</li><li>Put down <b>T</b></li><li>😈 The Ker steals the pancake on top of the plate</li><li>➡️ Serve</li><li>🍴 Eat</li><li>Put down <b>E</b></li><li>Put down <b>L</b></li><li>Put down <b>D</b></li><li>➡️ Serve</li><li>➡️ Serve</li><li>🍴 Eat</li><li>🍴 Eat</li><li>➡️ Serve</li><li>🍴 Eat</li><li>🍴 Eat</li><li>🍴 Eat</li>
</ol>
<p>The letters on the pancakes <b>eaten by the guests</b>, in the order they were eaten, spell the password. What is it?</p>`,
  reponses: ['b66dbce58287f61c2dfb1bfbf29a418009ed20c1445e00116ea68d14edf2af58'],
  placeholder: 'The word…',
  indices: [
    'Draw two things on paper: the plate (a column, from bottom to top) and the belt (a row, from left to right). Update them after every operation, without skipping any.',
    'After the first 4 pancakes are put down, the plate holds (from bottom to top) P, N, A, C. “Serve” sends C to the back of the belt, then A behind it. So the guests will eat C before A.',
  ],
  lecon: `<p>The guests ate <b>C, A, N, D, L, E</b>. Pancake <b>T</b> ended up in the Ker's belly, and pancake <b>P</b> was left alone at the bottom of the plate.</p>
<p>You made the two main ways of storing things work together: the <b>stack</b>, <b>last in, first out</b> (LIFO); and the <b>queue</b>, <b>first in, first served</b> (FIFO). The plate shuffles the order (it reverses it), the belt keeps it.</p>
<h4>🌍 In real life</h4>
<ul>
<li><b>Ctrl+Z</b> (undo) uses a stack: the last action you did is the first one undone.</li>
<li>Your browser's “Back” button is a stack of the pages you visited.</li>
<li>When a function calls another one (like the recursive snowflake on day 9!), the computer stores the calls in a stack: the <b>call stack</b>.</li>
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
    ricane: "I've erased the colours from the code. Only numbers are left. Good luck guessing where the red starts…",
    piques: [
      "Wrong! Your masterpiece looks like a snowflake squashed under a boot.",
      "White, red, white, red… Lost count? I haven't: I'm counting your mistakes.",
      "Wrong. Even a screen smashed with a hammer would display it better.",
    ],
    fuite: "The picture is coming back?! I'm vanishing… into the white…",
  },
  chrono: 1200,
  histoire: `<p>In the Photo Studio, the photographer had compressed a secret picture so it would travel faster. Then the Ker came along, eraser in hand: it rubbed out <b>every letter</b> of the code. Only numbers are left…</p>`,
  cours: `<p>A digital picture is a <b>grid of little colored squares</b>: the <b>pixels</b> (remember day 4). To save it, the computer writes down the color of each pixel, line by line.</p>
<p>The problem: a photo has millions of pixels, and the file quickly gets very heavy. So we <b>compress</b> it: we write the same information <b>in a shorter way</b>, so it takes up less space and travels faster.</p>
<p>The photographer's trick: instead of saying “white, white, white, white, red, red”, he says “<b>4 whites, 2 reds</b>”, which he writes <code>4B2R</code> (B for blank, meaning white). To get the picture back, you do the opposite: <code>4B2R</code> → ⬜⬜⬜⬜🟥🟥</p>
<p>You can make it even shorter! If the picture only has two colors that always <b>alternate</b> (after whites come reds, after reds come whites…) and every line starts with white, the letters become useless: <code>4B2R1B</code> is simply written <code>4 2 1</code> (4 whites, 2 reds, 1 white).</p>`,
  enigme: `<div class="note">
<p>📸 <b>The code, after the Ker's visit</b></p>
<p>Every line starts with <b>white</b> pixels, then the numbers alternate: whites, reds, whites, reds… <code>1 2 3</code> = 1 white, 2 reds, 3 whites.</p>
<p>The picture is <b>21 pixels</b> wide and 7 high. Each line of code is one line of the picture.</p>
</div>
<p>Paint the grid (click or drag over the squares) to reveal the secret message. <b>What does it say?</b></p>`,
  widget: W.pixels(['21', '2 3 1 4 2 2 2 3 2', '1 1 5 2 2 1 2 1 1 1 2 1 1', '2 2 3 2 2 4 1 3 2', '4 1 2 2 2 1 2 1 1 1 1 1 2', '1 3 3 2 2 1 2 1 1 1 2 1 1', '21'], 21),
  reponses: ['c1cb4f0fb65482c87672d2e9de3e9507150a6b23e6f8aa7fa63d06000927e6ab'],
  placeholder: 'The message…',
  indices: [
    'Every line starts with white: the 1st number counts white squares, the 2nd red ones, the 3rd white ones, and so on. Check that each line adds up to 21 squares.',
    'Line 2: 2 whites, 3 reds, 1 white, 4 reds, 2 whites… The message has 4 letters. Once the whole grid is painted, step back a little!',
  ],
  lecon: `<p>The message was <b>STAR</b> ⭐!</p>
<p>A digital image is a <b>grid of pixels</b>. This code is called <b>RLE</b> (<i>Run-Length Encoding</i>): instead of writing “white” 21 times, you write <code>21</code>.</p>
<p>By erasing the letters, the Ker actually made the code <b>shorter</b>: 61 digits in all, against 147 squares for the raw picture (21 × 7). <b>Fax machines</b> used exactly this trick: a page of text is mostly white, with alternating runs of black.</p>
<p>Lesson: <b>no compression works on everything</b>. RLE is excellent for big plain areas (a sky, a blank page) and bad for detailed pictures, where the colors change at every pixel.</p>
<p>RLE is <b>lossless</b> compression: you get back the exact picture. The <b>JPEG</b> format, on the other hand, is <b>lossy</b>: it throws away details the eye barely notices, to make files about 10 times lighter.</p>
<h4>🌍 In real life</h4>
<ul>
<li><b>.zip</b> files and <b>.png</b> images use lossless compression, smarter than RLE.</li>
<li>Photos (<b>.jpg</b>), music (<b>.mp3</b>) and streaming videos use lossy compression.</li>
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
  chrono: 1200,
  histoire: `<p>At the Chalet Shop, three gifts are waiting to be wrapped. But the Ker came by with a marker pen: it <b>tampered with the barcodes</b> on two labels out of three. On one, it changed a digit. On another, more sneakily, it <b>swapped two neighboring digits</b>. Only one label is still genuine.</p>`,
  cours: `<p>A barcode is simply <b>13 digits</b> (written under the bars), also drawn as bars so the till can read them in a flash.</p>
<p>But a scanner can make mistakes, and a label can get damaged. To catch errors, the <b>last digit</b> says nothing about the product: it's a <b>check digit</b>, calculated from the others. It's like counting your change again: if the total isn't right, you know there's a mistake somewhere.</p>
<p>The rule uses two simple ideas:</p>
<ul>
<li><b>Multiplying alternately by 1 and by 3</b>: the 1st digit × 1, the 2nd × 3, the 3rd × 1, the 4th × 3… For example, for the digits <code>5 2 7</code>: 5 × 1 + 2 × 3 + 7 × 1 = 5 + 6 + 7 = <b>18</b>.</li>
<li>A <b>multiple of 10</b> is a number that ends in 0: 10, 20, 30… 100, 110, 120…</li>
</ul>
<p>For a <b>valid</b> barcode, when you add up all the digits multiplied alternately by 1 and by 3 (the last one included), you always land on a multiple of 10. If not, a digit was misread… or tampered with!</p>`,
  enigme: `<div class="note">
<p>🧾 <b>The barcode rule (EAN-13)</b></p>
<ol>
<li>Multiply the digits <b>alternately by 1 and by 3</b>: the 1st × 1, the 2nd × 3, the 3rd × 1, etc.</li>
<li>Add up all the results (check digit included).</li>
<li>For a valid barcode, the total is always a <b>multiple of 10</b>.</li>
</ol>
</div>
<p>Check the three labels. <b>Which gift has the only genuine barcode?</b></p>`,
  widget: W.codesBarres([
    { code: '3760147582399', nom: '🛷 Sled' },
    { code: '3760127528399', nom: '🧩 Puzzle' },
    { code: '3760147528399', nom: '⛸️ Skates' },
  ]),
  reponses: ['46f059b0523128e8a82242509950eaf2c8ddb6408783d5b76ded1555f584b96b', '5ac07a7ba038304006a74e955e7e4bca4e0cd78e56c076f24492a3a275f72895', '33f3339c77c3e371d0d9aa5ee99df2c4e325d9e7f95a39b86931a487cdac4d50'],
  placeholder: 'The genuine gift…',
  indices: [
    'Do the full calculation for each label: digits in odd positions × 1, digits in even positions × 3, then add up the 13 products. Only one label gives a multiple of 10.',
    'Careful, the three codes look very alike! The first two labels give 118 and 124. And if you just add up the digits, without the × 3, the Sled looks as good as the real one… that\'s the Ker\'s trap.',
  ],
  lecon: `<p>The only genuine code was on the <b>Skates</b>: its total is <b>130</b>, a multiple of 10 ✅. The Sled gives 118 and the Puzzle 124 ❌.</p>
<div class="schema">Puzzle: one digit changed (the 6th: 4 → 2)<br>Sled: two neighboring digits swapped (… 2 8 … → … 8 2 …)</div>
<p>The check digit is used to <b>detect errors</b>. If the scanner misreads a single digit, the total no longer lands on a multiple of 10: the till rejects the code.</p>
<p>And why multiply every other digit by 3? To catch the most common mistake when copying a code by hand: <b>swapping two neighboring digits</b>. With a simple sum of the digits, the Sled and the Skates give the same total (64): the swap would go unnoticed! With weights 1 and 3, the two swapped digits no longer “weigh” the same, and the total changes.</p>
<p>Little secret: the first 3 digits, <code>376</code>, show the country of the organization that issued the code. From 300 to 379, it's… <b>France</b>!</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your <b>bank card</b> number has a final check digit (the Luhn algorithm): a website spots a typo immediately.</li>
<li>Bank account numbers (<b>IBAN</b>) and book numbers (<b>ISBN</b>) also have check digits.</li>
<li><b>QR codes</b> go even further: they can <b>correct</b> errors. You can damage up to 30% of a QR code and it still works!</li>
<li>On the Internet, every packet of data carries a “checksum” to make sure it wasn't damaged on the way.</li>
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
    ricane: "I've dropped the packets into a snowstorm. Duplicates, crumbs, damaged packets… Happy puzzling!",
    piques: [
      "Wrong! The South Pole has just received “THE REINDEER ARE GOATS”.",
      "You've glued a damaged packet back in. The penguins are rolling on the floor.",
      "Another duplicate! Are you repeating yourself too?",
    ],
    fuite: "Message sent?! I'm cutting myself into little packets and vanishing!",
  },
  chrono: 1200,
  histoire: `<p>Santa is sending a message to the South Pole. But on the Internet, a message never travels in one piece: it's cut into small <b>packets</b>, each taking its own route! The Ker dropped them into a storm: they reached the Sorting Center <b>out of order</b>, one of them <b>twice</b>… and another one <b>damaged</b>, before a brand-new copy arrived.</p>`,
  cours: `<p>On the Internet, a message is never sent in one block: it's cut into small pieces, the <b>packets</b>. Each packet travels alone, along whichever path is least busy at that moment… so they don't necessarily arrive in order, or in good shape.</p>
<p>Each packet carries a little <b>label</b> (called a <b>header</b>) with:</p>
<ul>
<li>a <b>number</b>, like the pages of a book, to put the pieces back in order;</li>
<li>its <b>size</b>: the number of characters it carries (spaces count!). If the contents don't match the announced size, the packet was damaged on the way: you throw it away.</li>
</ul>
<p>Here, these numbers are written in <b>binary</b> with 4 places. Remember day 1: just add up the places that have a 1.</p>
<div class="defilement"><table class="tableau compact">
<tr><th>8</th><th>4</th><th>2</th><th>1</th><th>Number</th></tr>
<tr><td class="allume">1</td><td>0</td><td class="allume">1</td><td>0</td><td>8 + 2 = <b>10</b></td></tr>
</table></div>`,
  enigme: `<p>Each packet carries a <b>sequence number</b> and a <b>size</b>, written in binary. Click the right packets <b>in the right order</b> to rebuild the message, then send it. The ␣ symbol stands for a space.</p>`,
  widget: W.paquets([
    { seq: '0110', taille: '0011', data: 'KE ' }, { seq: '0010', taille: '0011', data: ' RE' }, { seq: '1010', taille: '0011', data: 'DI' },
    { seq: '1000', taille: '0011', data: ' AT' }, { seq: '0001', taille: '0011', data: 'THE' }, { seq: '1011', taille: '0011', data: 'GHT' },
    { seq: '0100', taille: '0011', data: 'EER' }, { seq: '0111', taille: '0011', data: 'OFF' }, { seq: '0011', taille: '0011', data: 'IND' },
    { seq: '0100', taille: '0011', data: 'EER' }, { seq: '1001', taille: '0011', data: ' MI' }, { seq: '0101', taille: '0011', data: ' TA' },
    { seq: '1010', taille: '0011', data: 'DNI' },
  ]),
  indices: [
    'First convert all the numbers: 0001 = 1, 0010 = 2, 0011 = 3… up to 1011 = 11. Two numbers appear twice: for one, both packets are identical (keep just one); for the other, they are different.',
    'When two packets have the same number but different contents, count the characters in each (spaces included) and compare with its announced size (0011 = 3). The damaged packet isn\'t the right size.',
  ],
  lecon: `<p>The message was: <b>“THE REINDEER TAKE OFF AT MIDNIGHT”</b> 🦌. You had to keep just one of the two packets no. 4, and throw away the damaged packet no. 10 (“DI”: 2 characters instead of the 3 announced), replaced by its intact copy “DNI”.</p>
<p>On the Internet, all data (messages, photos, videos) is cut into <b>packets</b> of about 1,500 bytes. Each packet carries:</p>
<ul>
<li>the <b>IP address</b> of the sender and of the recipient (like on an envelope);</li>
<li>a <b>sequence number</b>, to put the pieces back in order.</li>
</ul>
<p>Packets go through dozens of <b>routers</b> and can take different paths: so they sometimes arrive out of order, twice, or get lost. The <b>TCP</b> protocol does exactly what you just did: it puts the packets back in order, throws away duplicates… and asks again for lost packets.</p>
<h4>🌍 In real life</h4>
<ul>
<li>A streaming video is thousands of packets per second.</li>
<li>Online games and video calls often use another protocol, <b>UDP</b>, which doesn't ask again for lost packets: better a picture that skips than a conversation that waits! That's where some “lag” comes from.</li>
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
      "Wrong! Error 429: too many mistakes, calm down a bit.",
    ],
    fuite: "You understand the codes?! Error 503: Ker unavailable, I'm off!",
  },
  chrono: 1200,
  histoire: `<p>In the Server Room, the North Pole website (<code>www.north-pole.xmas</code>) answers with funny <b>3-digit codes</b>. Each code has a precise meaning, understood by every website in the world… and the Ker is having fun triggering all of them.</p>`,
  cours: `<p>When you open a website, your <b>browser</b> (Chrome, Firefox, Safari…) sends a <b>request</b> to a computer that's switched on day and night somewhere in the world: the <b>server</b>. It's the one that keeps the website's pages.</p>
<p>The server answers with the page… and with a <b>3-digit code</b> that says how things went: all good, the page has moved, you're not allowed in, the server has a problem… You've probably already come across the most famous one: “<b>Error 404</b>”.</p>
<p>These codes are the same for every website in the world: that's what lets any browser understand any server. The <b>first digit</b> gives the family: <b>2</b>xx = it worked, <b>3</b>xx = look elsewhere, <b>4</b>xx = it's the visitor's fault, <b>5</b>xx = it's the server's fault.</p>
<p>Two tricky nuances: being <b>authenticated</b> means you've proved <b>who</b> you are (by logging in); being <b>authorized</b> means you have the <b>right</b> to go in. And an address can move <b>for good</b>… or only <b>for a while</b>.</p>`,
  enigme: `<p>Match each situation with the right server response code. Careful: some codes look very alike, and two codes in the list are no use at all.</p>`,
  widget: W.http(
    [
      "A child sends a letter to Santa: the server creates a new record in their name.",
      "The old page <code>/letters</code> has moved for good to the address <code>/mail</code>.",
      "During stocktaking, the page <code>/shop</code> sends visitors to <code>/closed-for-stocktaking</code> for a few hours.",
      "The Ker, who hasn't logged in, asks for the page <code>/my-account</code>.",
      "The Ker has logged in with an apprentice's account, and tries to open <code>/santas-safe</code>.",
      "Someone types <code>/gifts-of-the-year-3000</code>: this page has never existed.",
      "The Ker sends 10,000 requests per second to bring the site down: the server tells it to slow down.",
      "A mistake in the server's program makes it crash.",
      "On Christmas Eve, millions of children connect at the same time: the server is overwhelmed.",
    ],
    [
      { code: 200, sens: '“OK”: all good, here is the page' },
      { code: 201, sens: '“Created”: done, something new has just been created' },
      { code: 301, sens: '“Moved Permanently”: the page has changed address for good' },
      { code: 302, sens: '“Found”: the page is at another address, for now' },
      { code: 401, sens: '“Unauthorized”: who are you? Log in first' },
      { code: 403, sens: '“Forbidden”: I know who you are, but you\'re not allowed in' },
      { code: 404, sens: '“Not Found”: this page doesn\'t exist' },
      { code: 418, sens: '“I\'m a teapot” ☕ (yes, it really exists!)' },
      { code: 429, sens: '“Too Many Requests”: easy, you\'re asking too much' },
      { code: 500, sens: '“Internal Server Error”: the server crashed' },
      { code: 503, sens: '“Service Unavailable”: the server is overloaded' },
    ]
  ),
  indices: [
    'First put each situation in its family: success (2xx), moving (3xx), visitor\'s fault (4xx) or server\'s fault (5xx). Then only 2 or 3 codes are left each time.',
    '401 = the server doesn\'t know who you are; 403 = it does, but the answer is no. 301 = moved for good; 302 = for a while. 500 = the server has a bug; 503 = it\'s overwhelmed. 201 = something new was created.',
  ],
  lecon: `<p>When you visit a website, your browser (the <b>client</b>) sends a <b>request</b> to a distant computer (the <b>server</b>): “give me the page <code>/good-children-list</code>”. The server answers with the page… and a <b>code</b>.</p>
<table class="tableau"><tr><th>Family</th><th>Meaning</th></tr>
<tr><td><b>2xx</b></td><td>✅ Success</td></tr>
<tr><td><b>3xx</b></td><td>↪️ Redirection: look elsewhere</td></tr>
<tr><td><b>4xx</b></td><td>🙋 Client error (wrong address, access forbidden…)</td></tr>
<tr><td><b>5xx</b></td><td>🔥 Server error</td></tr></table>
<p>The answers: 201, 301, 302, 401, 403, 404, 429, 500, 503. Codes 200 (all good) and 418 were no use here.</p>
<p>This language is called <b>HTTP</b> (the “http” at the start of web addresses). And code <b>418 “I'm a teapot”</b> comes from an April Fools' joke in 1998… which was kept, for the love of the joke.</p>
<p>Code <b>429</b> protects websites against attacks like the Ker's: when someone sends too many requests, the server makes them wait instead of collapsing.</p>
<p>Even before the request, your computer asks a <b>DNS server</b> for the IP address of <code>www.north-pole.xmas</code>: DNS is the Internet's phone book, turning names into numbers.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Some websites' “404” pages are little works of art: go and look for a few!</li>
<li>On sale days or when concert tickets go on sale, many websites return 503 errors: too many people at once.</li>
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
  chrono: 1200,
  histoire: `<p>In the Wrapping Workshop, a robot sorts the gift tags. The Ker has set its <b>pattern</b> so that it rejects almost everything: the tag must carry a name of the right length and a <b>December day before Christmas</b>, from 01 to 24. The pattern is written in a strange language: a <b>regular expression</b>.</p>`,
  cours: `<p>A <b>regular expression</b> is like a <b>police sketch</b> of a text: it doesn't say exactly which text is expected, but what it must <b>look like</b>.</p>
<p>For example, the sketch “exactly 3 digits” accepts <code>007</code> and <code>123</code>, but rejects <code>12</code> (too short), <code>1234</code> (too long) and <code>abc</code> (not digits).</p>
<p>To check a tag, you move <b>at the same time</b> through the pattern and through the tag, piece by piece, from left to right. If a single piece doesn't match, the tag is rejected. The table under the pattern explains what each piece means.</p>
<p>Two extra tools: <code>{2,5}</code> means “between 2 and 5 times” (<code>[0-9]{2,5}</code> accepts <code>12</code> and <code>12345</code>, but not <code>1</code> nor <code>123456</code>). And <code>(cat|dog)</code> means “a choice: cat or dog”: the piece must match one of the options.</p>`,
  enigme: `<div class="motif"><code>^[A-Z][a-z]{2,5}-(0[1-9]|1[0-9]|2[0-4])$</code></div>
<table class="tableau legende-regex">
<tr><td><code>^</code></td><td>start of the tag</td></tr>
<tr><td><code>[A-Z]</code></td><td>one capital letter (A to Z)</td></tr>
<tr><td><code>[a-z]{2,5}</code></td><td>2 to 5 lowercase letters (a to z, no accents)</td></tr>
<tr><td><code>-</code></td><td>a hyphen</td></tr>
<tr><td><code>( … | … | … )</code></td><td>a choice: one of the pieces separated by <code>|</code></td></tr>
<tr><td><code>0[1-9]</code></td><td>a 0 followed by a digit from 1 to 9 (01 to 09)</td></tr>
<tr><td><code>1[0-9]</code></td><td>a 1 followed by a digit from 0 to 9 (10 to 19)</td></tr>
<tr><td><code>2[0-4]</code></td><td>a 2 followed by a digit from 0 to 4 (20 to 24)</td></tr>
<tr><td><code>$</code></td><td>end of the tag (nothing after it!)</td></tr>
</table>
<p>Here are the tags, in the order they arrived:</p>
<div class="etiquettes"><span>Felix-25</span><span>Finn-06</span><span>Ed-10</span><span>Ruth-7</span><span>Rosa-21</span><span>Zoé-14</span><span>Oliviero-11</span><span>Omar-15</span><span>AMY-09</span><span>Sky-00</span><span>Sven-02</span><span>Tom_13</span><span>Ted-32</span><span>Tia-24</span></div>
<p>The <b>first letters</b> of the tags accepted by the robot, in order, spell the password.</p>`,
  reponses: ['c228874eced9b802bd4af2bae64dc7b23108d6b874a3865bad13d3fffd45df28'],
  placeholder: 'The word…',
  indices: [
    'Check each tag piece by piece: 1 capital letter, then 2 to 5 lowercase letters with no accent (so a name of 3 to 6 letters in all), then a hyphen, then a number from 01 to 24 written with 2 digits, then nothing else.',
    'Traps: a name too short (Ed) or too long (Oliviero), an accent (Zoé), an impossible day (00, 25, 32), a single digit (7), an underscore instead of a hyphen (Tom_13), extra capital letters (AMY). 5 tags are accepted.',
  ],
  lecon: `<p>The accepted tags were <b>F</b>inn-06, <b>R</b>osa-21, <b>O</b>mar-15, <b>S</b>ven-02 and <b>T</b>ia-24 → <b>FROST</b> ❄️</p>
<p>The rejected ones: <code>Felix-25</code> and <code>Ted-32</code> (days after 24), <code>Ed-10</code> (only one lowercase letter), <code>Ruth-7</code> (only one digit), <code>Zoé-14</code> (“é” is not between a and z!), <code>Oliviero-11</code> (too many lowercase letters: 7), <code>AMY-09</code> (capital letters after the A), <code>Sky-00</code> (00 matches none of the three choices), <code>Tom_13</code> (an underscore instead of a hyphen).</p>
<p><b>Regular expressions</b> (or <i>regex</i>) are a mini-language for describing text patterns. They exist in almost every programming language.</p>
<h4>🌍 In real life</h4>
<ul>
<li>When a form tells you “invalid email address”, a regex often did the checking.</li>
<li>A US ZIP code is <code>^[0-9]{5}$</code>.</li>
<li>Developers use them to search and replace text across thousands of files at once.</li>
</ul>
<h4>🧪 Try it yourself</h4>`,
  apresReussite: W.terrainRegex('^[A-Z][a-z]{2,5}-(0[1-9]|1[0-9]|2[0-4])$', ['Felix-25', 'Finn-06', 'Ed-10', 'Ruth-7', 'Rosa-21', 'Zoé-14', 'Oliviero-11', 'Omar-15', 'AMY-09', 'Sky-00', 'Sven-02', 'Tom_13', 'Ted-32', 'Tia-24']),
  fragment: [13, '01000001'],
},

/* ======================= DAY 17 ====================== */
{
  jour: 17, piece: piece(17), particules: particules(17), couleurs: couleurs(17),
  univers: 'The Library',
  emoji: '📚',
  concept: 'Databases (SQL)',
  givrin: {
    ricane: "I've cut the register in two: the children on one side, their gifts on the other. Good luck gluing the pieces back together.",
    piques: [
      "Wrong! You've just given marbles to a little horror. I'm starting to like you.",
      "Query error! Your join looks like a tangled string of fairy lights.",
      "No. The database just sighed. Yes it did, I heard it.",
    ],
    fuite: "SELECT exit FROM chalet… I'm vanishing from the database!",
  },
  chrono: 1200,
  histoire: `<p>In the Library, the register of children is no longer an old spellbook: it's a <b>database</b>. But the Ker has cut it into <b>two tables</b>: the children on one side, the gifts on the other. To find the password, you need to glue them back together… using the query it left on the screen.</p>`,
  cours: `<p>A <b>database</b> is a set of big, well-organized tables: each <b>row</b> describes one thing (a child, a gift) and each <b>column</b> one piece of information about it (a name, a price…).</p>
<p>To ask it a question, you write a <b>query</b> in <b>SQL</b>. Its keywords are plain English:</p>
<div class="defilement"><table class="tableau compact">
<tr><td><code>SELECT</code></td><td class="gauche">pick (the column to show)</td></tr>
<tr><td><code>FROM</code></td><td class="gauche">from (which table)</td></tr>
<tr><td><code>JOIN … ON …</code></td><td class="gauche">glue on a second table: each row is matched with the rows of the other table that meet the condition after ON</td></tr>
<tr><td><code>WHERE</code></td><td class="gauche">only the rows where…</td></tr>
<tr><td><code>AND</code></td><td class="gauche">and (both conditions must be true)</td></tr>
<tr><td><code>ORDER BY … DESC</code></td><td class="gauche">sort the result by… in descending order (from biggest to smallest)</td></tr>
</table></div>
<p>With two tables, each one is often given a <b>nickname</b> (an <i>alias</i>): <code>FROM kids k</code> means “the kids table, which I'll call k”. Then <code>k.good</code> means the good column of the kids table.</p>
<p>A join example: if a gift has <code>kid_id = 4</code>, it's meant for the child whose <code>id</code> is 4.</p>`,
  enigme: `<p>Here is the query the Ker left behind:</p>
<pre class="code sql"><span class="mot">SELECT</span> g.gift
<span class="mot">FROM</span> kids k
<span class="mot">JOIN</span> gifts g <span class="mot">ON</span> g.kid_id = k.id
<span class="mot">WHERE</span> k.good = 'yes'
  <span class="mot">AND</span> g.price &lt; 30
<span class="mot">ORDER BY</span> g.price <span class="mot">DESC</span>;</pre>
<p class="petit">Translation: “Glue each gift to the child it's meant for. Keep only the gifts of good children that cost less than 30, and sort them from most to least expensive. Show the names of the gifts.”</p>
<div class="deux-tables">
<div><p>Table <code>kids</code> (alias <code>k</code>):</p>
<div class="defilement"><table class="tableau table-sql">
<tr><th>id</th><th>name</th><th>city</th><th>good</th></tr>
<tr><td>1</td><td>Zoe</td><td>York</td><td>yes</td></tr>
<tr><td>2</td><td>Hugo</td><td>London</td><td>no</td></tr>
<tr><td>3</td><td>Adam</td><td>Leeds</td><td>yes</td></tr>
<tr><td>4</td><td>Ines</td><td>Bristol</td><td>yes</td></tr>
<tr><td>5</td><td>Malo</td><td>York</td><td>no</td></tr>
<tr><td>6</td><td>Rose</td><td>London</td><td>yes</td></tr>
</table></div></div>
<div><p>Table <code>gifts</code> (alias <code>g</code>):</p>
<div class="defilement"><table class="tableau table-sql">
<tr><th>id</th><th>kid_id</th><th>gift</th><th>price</th></tr>
<tr><td>1</td><td>3</td><td>Gloves</td><td>18</td></tr>
<tr><td>2</td><td>2</td><td>Marbles</td><td>26</td></tr>
<tr><td>3</td><td>1</td><td>Crayons</td><td>8</td></tr>
<tr><td>4</td><td>6</td><td>Console</td><td>250</td></tr>
<tr><td>5</td><td>4</td><td>Atlas</td><td>24</td></tr>
<tr><td>6</td><td>5</td><td>Ice skates</td><td>12</td></tr>
<tr><td>7</td><td>6</td><td>Magic set</td><td>27</td></tr>
<tr><td>8</td><td>1</td><td>Igloo tent</td><td>15</td></tr>
<tr><td>9</td><td>3</td><td>Robot</td><td>45</td></tr>
</table></div></div>
</div>
<p>The <b>initials of the gifts</b> in the result, in order, spell the password.</p>`,
  reponses: ['39c71eda91518913a57768c7920995c89eeb8baa2a5c70d6a5103c8fe866b796'],
  placeholder: 'The word…',
  indices: [
    'For each gift, find its child using kid_id (it\'s the child\'s id). Cross out the gifts of children who aren\'t good, then the ones that cost 30 or more.',
    '5 gifts are left. Sort them from most to least expensive (DESC), then read their initials. Watch out for the Marbles and the Ice skates: they\'re meant for children who aren\'t good.',
  ],
  lecon: `<p>The query returns 5 rows: <b>M</b>agic set (27, Rose), <b>A</b>tlas (24, Ines), <b>G</b>loves (18, Adam), <b>I</b>gloo tent (15, Zoe) and <b>C</b>rayons (8, Zoe) → <b>MAGIC</b> ✨</p>
<p>Left out: the Marbles and the Ice skates (meant for Hugo and Malo, who aren't good), the Console and the Robot (30 or more).</p>
<p>A <b>database</b> stores information in <b>tables</b>. Rather than writing everything in one huge table (and copying Zoe's city next to each of her gifts), the information is split up and linked by a number: that's a <b>relational</b> database, and the <b>join</b> (<code>JOIN</code>) glues the pieces back together when you ask the question.</p>
<p><b>SQL</b> was invented in the 1970s… and it's still used everywhere today. With 10 rows, you can do it by hand. A real database can hold <b>billions</b> of rows: the computer still answers in a fraction of a second.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your social media account, your school grades, your online orders, your bank account: everything is stored in databases.</li>
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
  chrono: 1200,
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
    ricane: "My ice computer tests 10 trillion passwords per second. Your little secret will last… about as long as a sneeze.",
    piques: [
      "Cracked! Even my granny, frozen since the year 1000, would have guessed it.",
      "Ha! I found that password before you'd finished typing it.",
      "Longer, come on! Your password is as short as your victory will be.",
    ],
    fuite: "A million years?! I don't have time to wait, I've got other Christmases to ruin!",
  },
  chrono: 1200,
  histoire: `<p>In the Vault Room, the vaults' <b>Ker</b> has plugged in an ice computer a thousand times more powerful than an ordinary hacker's: it tests <b>10 trillion passwords per second</b>! The gift vault needs a new password to protect it.</p>`,
  cours: `<p>A hacker who doesn't know your password can ask a computer to <b>try them all</b>, one by one, until it hits the right one: that's a <b>brute-force attack</b> (you already used one against the Caesar cipher on day 3!).</p>
<p>To resist it, the number of <b>possible combinations</b> has to be gigantic. Think of a combination padlock:</p>
<ul>
<li>with 3 wheels of 10 digits: 10 × 10 × 10 = <b>1,000</b> combinations;</li>
<li>with 4 wheels: 10 × 10 × 10 × 10 = <b>10,000</b> combinations.</li>
</ul>
<p>Every extra wheel multiplies the number of combinations. A password works the same way: each character is a “wheel”, and the number of possible symbols (lowercase, capitals, digits, signs…) is the number of notches on each wheel. Now find out what matters most!</p>`,
  enigme: `<p>Invent a password that the Ker's ice computer would need <b>at least a million years</b> to find by trying every combination. Watch carefully what makes the time climb fastest!</p>
<p class="alerte">🚫 Never type one of your real passwords here: invent a new one!</p>`,
  widget: W.motDePasse(1e13, 1e6, ['123456', '123456789', '12345678', 'password', 'qwerty', 'azerty', 'letmein', 'iloveyou', 'admin', 'welcome', 'monkey', 'dragon', 'football', 'christmas', 'merrychristmas', 'santa', 'santaclaus', 'noel', 'joyeuxnoel', 'motdepasse', '000000', '111111', 'abc123', 'chocolate', 'sunshine']),
  indices: [
    'Compare: what increases the time the most? Adding a type of character… or adding characters? You\'ll need well over 12 characters!',
    'A sentence of 4 or 5 unrelated words, separated by spaces, quickly becomes uncrackable, even all in lowercase. But the Ker rejects passwords that are too repetitive (“aaaa”).',
  ],
  lecon: `<p>The number of combinations of a password = <b>(number of possible characters)<sup>length</sup></b>. At 10 trillion tries per second:</p>
<ul>
<li>8 lowercase letters: 26<sup>8</sup> ≈ 200 billion → cracked in <b>2 hundredths of a second</b>;</li>
<li>8 characters of any kind: 95<sup>8</sup> ≈ 6.6 million billion → about <b>11 minutes</b>;</li>
<li>20 lowercase letters: 26<sup>20</sup> → about <b>63 million years</b>!</li>
</ul>
<p>To last a million years, you need about <b>19 lowercase letters</b>… or <b>14 characters</b> of any kind. Each extra character multiplies the time, whereas a new type of character only increases it a little.</p>
<p><b>Length</b> matters much more than complicated symbols. A <b>passphrase</b> made of several random words (“sock-volcano-penguin-trumpet”) is both very strong and easy to remember.</p>
<p>⚠️ Our calculation is simplified: hackers don't try combinations in just any order. They first test the most common passwords (<code>123456</code>, <code>password</code>…), dictionary words, and passwords that have already leaked on the Internet.</p>
<h4>🌍 In real life: 4 good habits</h4>
<ul>
<li>A <b>different password for every site</b> (otherwise a single leak opens everything).</li>
<li>A <b>password manager</b> to remember them for you.</li>
<li><b>Two-factor authentication</b>: a code sent to your phone on top of your password.</li>
<li>Never give your password away, not even to a “friend” or a so-called “tech support”.</li>
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
      "Wrong! Tom will get a steak. Not even cooked.",
      "Wrong. Did you count with your mittens on?",
      "Wrong again! I'm starting to think you wrote my fake orders yourself.",
    ],
    fuite: "Unmasked by a mere number?! I'm puffing… I'm running out of puff…",
  },
  chrono: 1200,
  histoire: `<p>In Santa's Office, every order is protected by a <b>magic seal</b>: a number calculated from the text. It used to be a simple sum of the letters… until the day the Ker found out how to fool that seal. So Santa came up with a smarter recipe.</p>`,
  cours: `<p>How can you be sure a message hasn't been changed on the way? You can add a <b>fingerprint</b> to it: a small number calculated from the text, a bit like a real fingerprint.</p>
<p>The recipient does the same calculation on the text they received. If they get the same fingerprint, the text is intact. If not, someone has changed it!</p>
<p>For the calculation, you'll need each letter's <b>position</b> in the alphabet (A is the 1st letter, B the 2nd…) and the <b>remainder of a division</b>: what's left when you've taken a number away as many times as you can. For example, the remainder of 130 divided by 50: 130 − 50 − 50 = <b>30</b> (you can't take 50 away any more).</p>
<p>A trap: two words with exactly the same letters in a different order (<b>anagrams</b>, like LISTEN and SILENT) give the same total if you just add up the letters. To tell them apart, you can multiply each letter by its <b>position</b> in the word: in LISTEN, the L is 1st (× 1); in SILENT, it's 3rd (× 3).</p>`,
  enigme: `<div class="note">
<p>🕯️ <b>The new seal recipe</b></p>
<ol>
<li>Replace each letter with its position in the alphabet: A = 1, B = 2, … Z = 26.</li>
<li>Multiply each of these numbers by the <b>position</b> of the letter in the word: the 1st letter × 1, the 2nd × 2, the 3rd × 3…</li>
<li>Add everything up, then keep only the <b>remainder of the division by 100</b> (take away 100 as many times as possible).</li>
</ol>
<p>Example: <code>SANTA</code> → 19 × 1 + 1 × 2 + 14 × 3 + 20 × 4 + 1 × 5 = 19 + 2 + 42 + 80 + 5 = 148 → 148 − 100 = <b>48</b>.</p>
</div>
<p>Tom's original order had <b>seal 49</b>. The Ker intercepted it and sent several fake versions, one of which looks terribly like the real one. <b>Which gift did Tom really order?</b></p>
<div class="etiquettes"><span>ROBOT</span><span>STEAK</span><span>TRAIN</span><span>SKATE</span><span>PUPPY</span><span>SLED</span></div>`,
  reponses: ['86782888cd3cf1005b00935870fbbefc91d257d282794f2d3c590c916d416c38', '3a9c74f483b2438be4fff532928cc1a3903ee6d309f3d0bd301b77b0aee5137b'],
  placeholder: 'The real gift…',
  indices: [
    'Work out the seal of each gift, like in the SANTA example. Don\'t forget to multiply each letter by its position!',
    'Reminder: A = 1, B = 2, D = 4, E = 5, I = 9, K = 11, L = 12, N = 14, O = 15, P = 16, R = 18, S = 19, T = 20, U = 21, Y = 25. SKATE and STEAK have the same letters… but not in the same places.',
  ],
  lecon: `<p>The real gift was the <b>SKATE</b> ⛸️: 19 × 1 + 11 × 2 + 1 × 3 + 20 × 4 + 5 × 5 = 19 + 22 + 3 + 80 + 25 = 149 → <b>49</b> ✅. The Ker's STEAK gives 33.</p>
<p>With the old recipe (a simple sum), SKATE and STEAK had the same total (56): the Ker could have swapped the skate for a steak without anyone noticing! By taking the <b>position</b> of the letters into account, you spot the swapped letters.</p>
<p>This seal is a <b>hash function</b>: it turns any text into a <b>fingerprint</b> of fixed size. But ours is still weak: <code>BOAT</code> and <code>FROG</code> both have seal 15! Two different texts with the same fingerprint is called a <b>collision</b>.</p>
<p>Real hash functions, like <b>SHA-256</b>, produce a 256-bit fingerprint and are designed so that:</p>
<ul>
<li>the smallest change to the text <b>completely</b> changes the fingerprint;</li>
<li>it's impossible to get the text back from the fingerprint;</li>
<li>nobody can find two texts with the same fingerprint.</li>
</ul>
<p>🤫 <b>This calendar's secret</b>: the answers are never sent to your browser. They stay on the North Pole server… and even there, they aren't written in plain text: the server only keeps their <b>SHA-256 fingerprints</b>. When you suggest an answer, it calculates its fingerprint and compares. Even someone who stole the server couldn't read the answers!</p>
<h4>🌍 In real life</h4>
<ul>
<li>Serious websites never store your password: only its fingerprint (with a “salt” added for extra security).</li>
<li>When you download software, you can compare its fingerprint with the one on the official website to check a hacker hasn't tampered with it.</li>
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
  chrono: 1200,
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
  chrono: 1200,
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
      "No! Your rule works for half the examples. I'm nice half the time too. Meaning never.",
    ],
    fuite: "It's learning… it's learning all by itself! It even figured me out! I'm off!",
  },
  chrono: 1200,
  histoire: `<p>In the Lab, a <b>smart robot</b> has to guess which toys the reindeer like. Nobody gave it a rule: it was only shown <b>examples</b>. The Ker is sniggering: this time, the rule isn't so simple… Do what the robot does: find the hidden rule!</p>`,
  cours: `<p>Usually, to make a computer do something, a human writes precise <b>rules</b> for it. But some rules are almost impossible to write: how do you explain to a machine what makes a photo show a cat?</p>
<p>With <b>machine learning</b>, we do it differently: we show the machine lots of <b>examples with the right answer</b> (“this is a cat”, “this is not a cat”), and it looks for a rule that works for all those examples by itself. Just like a toddler who learns to recognize dogs after seeing lots of them.</p>
<p>To find a hidden rule, compare the examples: what do the ones with the same answer have in common? And what makes them different from the others?</p>
<p>Sometimes one question isn't enough, and the rule looks like a little chain of questions: “Is it raining? If yes, do I have an umbrella? If no, is it cold?” The second question <b>depends</b> on the answer to the first. A tip: split the examples into two groups according to one feature, then look for a rule <b>in each group</b>.</p>`,
  enigme: `<p><b>The examples shown to the robot:</b></p>
<div class="defilement"><table class="tableau table-ia">
<tr><th>Toy</th><th>Color</th><th>Makes noise?</th><th>Size</th><th>The reindeer…</th></tr>
<tr><td>🔔 Little bell</td><td>red</td><td>yes</td><td>small</td><td>❤️ love it</td></tr>
<tr><td>🥁 Drum</td><td>blue</td><td>yes</td><td>big</td><td>😐 meh</td></tr>
<tr><td>🧸 Teddy bear</td><td>red</td><td>no</td><td>big</td><td>❤️ love it</td></tr>
<tr><td>🛎️ Jingle bell</td><td>green</td><td>yes</td><td>small</td><td>❤️ love it</td></tr>
<tr><td>⚽ Ball</td><td>green</td><td>no</td><td>small</td><td>😐 meh</td></tr>
<tr><td>🎺 Trumpet</td><td>red</td><td>yes</td><td>big</td><td>😐 meh</td></tr>
<tr><td>🎹 Little piano</td><td>blue</td><td>yes</td><td>small</td><td>❤️ love it</td></tr>
<tr><td>🧊 Cube</td><td>blue</td><td>no</td><td>small</td><td>😐 meh</td></tr>
<tr><td>🍎 Wooden apple</td><td>red</td><td>no</td><td>small</td><td>❤️ love it</td></tr>
<tr><td>📯 Big horn</td><td>green</td><td>yes</td><td>big</td><td>😐 meh</td></tr>
</table></div>
<p><b>The new toys</b> (each one has a letter):</p>
<div class="defilement"><table class="tableau table-ia">
<tr><th>Letter</th><th>Toy</th><th>Color</th><th>Makes noise?</th><th>Size</th></tr>
<tr><td><b>S</b></td><td>🎷 Saxophone</td><td>blue</td><td>yes</td><td>small</td></tr>
<tr><td><b>K</b></td><td>🔔 Big bell</td><td>green</td><td>yes</td><td>big</td></tr>
<tr><td><b>L</b></td><td>🪀 Yoyo</td><td>red</td><td>no</td><td>small</td></tr>
<tr><td><b>O</b></td><td>📕 Book</td><td>blue</td><td>no</td><td>big</td></tr>
<tr><td><b>E</b></td><td>🎻 Violin</td><td>red</td><td>yes</td><td>small</td></tr>
<tr><td><b>T</b></td><td>🎸 Guitar</td><td>red</td><td>yes</td><td>big</td></tr>
<tr><td><b>D</b></td><td>🧣 Scarf</td><td>red</td><td>no</td><td>big</td></tr>
</table></div>
<p>Which new toys will the reindeer love? <b>Their letters, in order, spell the password.</b></p>`,
  reponses: ['04c1e076788df781810dc8ce83e92ff675fe47e95c691b2537323addac0a5af2'],
  placeholder: 'The word…',
  indices: [
    'Split the examples into two groups: the ones that make noise and the ones that don\'t. In each of the two groups, look for what separates the ❤️ from the 😐 (it\'s not the same thing in both groups!).',
    'Among the noisy toys, only the small ones are loved. Among the quiet ones, only the red ones are loved. Apply this double rule to the new toys.',
  ],
  lecon: `<p>The hidden rule was a little <b>decision tree</b>:</p>
<pre class="code">Does it make noise?
├── yes → loved if it's SMALL
└── no  → loved if it's RED</pre>
<p>So the loved toys are S (saxophone, noisy and small), L (yoyo, quiet and red), E (violin, noisy and small) and D (scarf, quiet and red) → <b>SLED</b> 🛷. The traps: the guitar is red… but noisy and big; the saxophone is blue… but that doesn't matter for a noisy toy!</p>
<p>You've just done what an <b>artificial intelligence</b> does: <b>machine learning</b>. Instead of writing the rule by hand, you show the machine <b>labelled examples</b> (“love it” / “meh”), and it finds a rule that explains them by itself. Then it applies it to cases it has never seen.</p>
<ul>
<li>The pieces of information about each toy (color, noise, size) are called <b>features</b>.</li>
<li><b>Decision trees</b> like this one are among the most widely used learning methods: you can read them and understand why the machine decided what it did.</li>
</ul>
<h4>⚠️ The danger of bias</h4>
<p>If the robot had only been shown blue, silent toys, it could never have known whether the reindeer dislike blue or silence. An AI is never better than its examples: if they are incomplete or unfair, it will learn a wrong or unfair rule. That's called <b>bias</b>.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your mailbox's spam filter learned from millions of emails marked “spam” or “not spam”.</li>
<li>Video and music recommendations learn from what you liked.</li>
<li>Chat assistants learned from huge amounts of text, thanks to “neural networks” with billions of parameters.</li>
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
  enigme: `<p>Each fragment is a letter with its <b>position</b> in the secret spell… written in <b>binary</b> (thanks, day 1!). Put the letters back in order to rebuild the spell, then light up the star.</p>`,
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
