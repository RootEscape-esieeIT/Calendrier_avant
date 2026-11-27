/* =========================================================
   NOËL-OS — The 24 puzzles, ENGLISH version (server file)
   Same structure as jours.js. Answers that depend on the
   language have their own SHA-256 fingerprints here:
       npm run empreinte -- 3 "my new answer"
   ========================================================= */

const W = new Proxy({}, { get: (_, type) => (...params) => ({ type, params }) });
const { enBinaire, tableAlarme, empreinteCourte } = require('./aides-jours');
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
    ricane: "I froze the label printer and ripped the code chart off the wall. Good luck with your 0s and 1s, hee hee.",
    piques: [
      "No. Even the frozen postman in the yard would have got it.",
      "Wrong! I'm returning your answer to sender. That's you.",
      "You read binary the way I read Christmas cards: by tearing them up.",
    ],
    fuite: "You made my printer talk?! I'm sticking a stamp on myself and posting myself very, very far away!",
  },
  histoire: `<p>In the Mail Room, the Ker blew on the label printer: frozen right down to its circuits, it now only prints <b>0s</b> and <b>1s</b>. And to make things worse, she ripped the code chart off the wall!</p>
<p>Luckily, the printer kept its <b>test mode</b>: type any text, and it shows you how it writes it in binary.</p>`,
  cours: `<p>A computer only stores <b>numbers</b> (in binary, like on day 1). To write text, the whole world agreed on a chart: <b>ASCII</b>. Every character gets a number, written with 8 binary digits (a <b>byte</b>).</p>
<div class="defilement"><table class="tableau compact">
<tr><th>Character</th><th>Number</th><th>Binary code</th></tr>
<tr><td><b>A</b></td><td>65</td><td><code>010 00001</code></td></tr>
<tr><td><b>B</b></td><td>66</td><td><code>010 00010</code></td></tr>
<tr><td><b>a</b></td><td>97</td><td><code>011 00001</code></td></tr>
<tr><td><b>b</b></td><td>98</td><td><code>011 00010</code></td></tr>
<tr><td><b>space</b></td><td>32</td><td><code>001 00000</code></td></tr>
</table></div>
<p>Look closely: the code comes in two parts.</p>
<ul>
<li>the <b>first 3 digits</b> say what kind of character it is: <code>010</code> = a <b>capital letter</b>, <code>011</code> = a <b>lowercase letter</b>, <code>001</code> = a space or a symbol;</li>
<li>the <b>last 5</b> give the <b>letter's place in the alphabet</b>, in binary (16 · 8 · 4 · 2 · 1): <code>00001</code> = 1 = A, <code>00010</code> = 2 = B…</li>
</ul>
<p>Example: <code>011 00011</code> → lowercase, place 2 + 1 = 3 → <b>c</b>.</p>`,
  enigme: `<p>A parcel arrived with this label, printed in binary. <b>What present is inside?</b></p>
<p>Read the groups one by one using the little lesson… or experiment with the printer: when a letter you type gives exactly the same code as the label, in the same place, it turns green.</p>`,
  widget: W.imprimante(enBinaire('Ugly sweater')),
  reponses: ['9feeb2d759fbb91dafecb66101cd24746dd118899e575886080b085e34d1ec4d', '8e832fcf1f1ccdd41a2b8471acbbbdfec6de634cf671f2fae11f527a5a49d9a5'],
  placeholder: 'The present…',
  indices: [
    'First group: 010 10101 → a capital letter (010), place 21 in the alphabet (10101): U. The 5th group, 001 00000, is a space: the present is two words.',
    'U, g, l, y, space, s, w… It\'s something you wear at Christmas, often with a flashing reindeer on it 😄',
  ],
  lecon: `<p>The label said <b>Ugly sweater</b> 🦌: <code>01010101</code> = U (capital, 21st letter), <code>01100111</code> = g (lowercase, 7th letter)… and <code>00100000</code> was the space between the two words!</p>
<p>A chart that gives <b>a number to every character</b> is called an <b>encoding</b>. <b>ASCII</b> (1963) has 128 characters. Its inventors arranged it on purpose so that the last 5 digits give the letter's place, and so that changing <b>a single digit</b> turns “A” into “a”.</p>
<p>The problem: ASCII was invented for English. No “é”, no “ñ”, and certainly no emojis! Today we use <b>Unicode</b>, which numbers nearly <b>160,000 characters</b> from every language in the world. The Christmas tree 🎄 is number <code>U+1F384</code>.</p>
<h4>🌍 In real life</h4>
<ul>
<li>If you see “NoÃ«l” instead of “Noël” on a website, that's an encoding bug: the computer read the numbers with the wrong chart!</li>
<li>When you send an emoji, your phone only sends a number: your friend's phone draws the picture. That's why the same emoji looks different on iPhone and Android.</li>
<li>Going from a capital to a lowercase letter means adding 32: a single digit changes (<code>010</code> → <code>011</code>). Old programs used this trick to turn text into CAPITALS in a flash.</li>
</ul>`,
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
    ricane: "I rewired the Storeroom alarm. Now it rings when an elf walks in with a badge… and stays quiet when I walk in. Handy, right?",
    piques: [
      "Bzzzt! Wrong. Can you smell burning? That's your reasoning.",
      "NOT, NOT and NOT again. It's my favourite logic gate.",
      "Keep plugging things in at random. A monkey would get there too… someday.",
    ],
    fuite: "The alarm rings exactly when it should?! Stop, it tickles… it sizzles… I'm short-circuiting!",
  },
  histoire: `<p>In the basement, the Toy Storeroom is protected by an <b>anti-Ker alarm</b> wired to four sensors. But the Ker rewired everything: the alarm rings when it shouldn't, and stays silent when it should be screaming!</p>
<p>The elves found the original rule, written on the box: it's up to you to rewire the four <b>logic gates</b>… and to <b>test</b> your circuit before approving it.</p>`,
  cours: `<p>To make decisions, a computer uses billions of <b>logic gates</b>. A gate receives signals, each one <b>on (1)</b> or <b>off (0)</b>, and lets a single one out:</p>
<div class="defilement"><table class="tableau">
<tr><th>Gate</th><th>It's on if…</th><th>In everyday life</th></tr>
<tr><td><b>AND</b></td><td class="gauche"><b>both</b> inputs are on</td><td class="gauche">I have my ticket AND the bus is here → I get on.</td></tr>
<tr><td><b>OR</b></td><td class="gauche"><b>at least one</b> input is on</td><td class="gauche">Someone rings at the front OR the back → the bell rings.</td></tr>
<tr><td><b>NOT</b></td><td class="gauche">its input is <b>off</b>: it does the opposite</td><td class="gauche">It is NOT daytime → the night light comes on.</td></tr>
</table></div>
<p>A plain <b>wire</b> simply lets the signal through unchanged. By plugging gates one after another, you can turn any sentence into a circuit: “it's raining AND I do NOT have an umbrella” = <code>rain AND (NOT umbrella)</code>.</p>
<p>Engineers never guess: they <b>test</b> every possible situation. With 4 sensors that can each be 0 or 1, there are 2 × 2 × 2 × 2 = <b>16</b> of them.</p>`,
  enigme: `<div class="note">
<p>🔔 <b>The alarm rule</b> (written on the box)</p>
<p>“The alarm must ring if <b>the door is open without an elf badge</b>, OR if <b>the window is open at night</b>.”</p>
</div>
<p>Click gates P1 to P4 to change their type, and the sensors to watch the current flow. When you think you've got it, run the <b>16 tests</b>: if your alarm reacts like the rule in all 16 situations, the Storeroom is saved!</p>`,
  widget: W.circuit({
    titre: 'The anti-Ker alarm circuit',
    entrees: [
      { k: 'A', emoji: '🚪', nom: 'door open' },
      { k: 'B', emoji: '🪪', nom: 'elf badge' },
      { k: 'C', emoji: '🪟', nom: 'window open' },
      { k: 'D', emoji: '🌙', nom: "it's night" },
    ],
    depart: ['fil', 'OU', 'OU', 'ET'],
    attendu: tableAlarme(),
  }),
  indices: [
    'Split the rule into two parts. “Door open WITHOUT a badge” is: A AND (NOT B). So P1 must invert the badge, and P2 connects the door to that “no badge”.',
    'P1 = NOT, P2 = AND. “Window open at night”: C AND D, so P3 = AND. And the two parts are joined by an OR: P4 = OR.',
  ],
  lecon: `<p>The right circuit was: <b>P1 = NOT</b> (no badge), <b>P2 = AND</b> (door open and no badge), <b>P3 = AND</b> (window open and night), <b>P4 = OR</b> (one or the other). As a formula: <code>(A AND NOT B) OR (C AND D)</code>.</p>
<p>You did exactly what an engineer does: turn a sentence into <b>logic</b>, then <b>test</b> every situation. AND, OR and NOT gates follow <b>Boolean algebra</b>, invented by George Boole in 1854… almost 100 years before the first computer!</p>
<p>In a processor, every gate is made of <b>transistors</b>, tiny switches controlled by electricity. By combining gates, you build a circuit that adds two numbers, then a calculator, then… a whole computer.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Programmers write <b>automated tests</b>: thousands of little situations replayed after every change, to make sure nothing breaks. Exactly like your 16-test table!</li>
<li>The processor in your phone contains <b>billions of transistors</b>, each one smaller than a virus.</li>
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
  concept: 'Algorithms and loops (programming a robot)',
  givrin: {
    ricane: "I froze your robot elf. It only obeys a program now… and you've never programmed, have you? Hee hee.",
    piques: [
      "Boom! Your robot just kissed an ice block. It's almost romantic.",
      "Wrong! Even a blindfolded penguin would find the sleigh.",
      "Repeat after me: I… can't… program. See? You can do loops too!",
    ],
    fuite: "It picked everything up?! With so few lines?! I'm going back to my igloo, and I'm locking the door!",
  },
  histoire: `<p>Deep in the Ice Cellar, the Ker scattered <b>four presents</b> across the ice, among the ice blocks. The only one who can fetch them is <b>the robot elf</b>… but she froze its remote control: now it only obeys a <b>program</b> written in advance.</p>`,
  cours: `<p>A <b>program</b> is a list of instructions the machine carries out <b>in order</b>, one by one, without ever thinking for you. If you make a mistake, so does it!</p>
<p>The robot elf knows three instructions (one per line):</p>
<ul>
<li><code>forward</code>: one square straight ahead, in the direction it's facing (<code>forward 3</code>: three squares);</li>
<li><code>left</code> and <code>right</code>: it turns a quarter turn on the spot, without moving.</li>
</ul>
<p>And one magic instruction: the <b>loop</b>. Everything between <code>repeat</code> and <code>end</code> is repeated several times. For example, to go round a square:</p>
<pre class="code">repeat 4
  forward 2
  right
end</pre>
<p>3 lines instead of 8! When a program doesn't work first time (that's normal!), you look at where the robot goes wrong, fix it, and run it again: that's <b>debugging</b>.</p>`,
  enigme: `<p>Write a program so the robot picks up the <b>4 presents 🎁</b> and finishes <b>on the sleigh 🛷</b>, without crashing into an ice block 🧊. It starts at the bottom left, facing right.</p>
<p>⚠️ The Ker froze almost all of its memory: your program can't be longer than <b>9 lines</b>. You can run it as many times as you like to test it.</p>`,
  widget: W.robot({
    titre: 'The ice of the Ice Cellar',
    grille: [
      '..#.C..',
      '#..C.#.',
      '..C...S',
      '.C..#..',
      'R.....#',
    ],
    maxLignes: 9,
    exemple: "# One instruction per line (lines starting with # are ignored)\nforward\n",
  }),
  indices: [
    'Look where the presents are: they form a staircase! To go from one step to the next, the robot always makes the same little move: forward, left, forward, right. Put it in a loop.',
    'repeat 4 / forward / left / forward / right / end: the robot has all 4 presents and faces right. You have 3 lines left to reach the sleigh (forward how far? then turn which way?).',
  ],
  lecon: `<p>A program that worked:</p>
<pre class="code">repeat 4
  forward
  left
  forward
  right
end
forward 2
right
forward 2</pre>
<p>Without the loop, it would have taken <b>19 lines</b>! Spotting what repeats is the heart of <b>algorithms</b>: a series of precise instructions to solve a problem. The word comes from Al-Khwarizmi, a scholar from Baghdad in the 9th century.</p>
<p>And if your robot bumped into something once or twice before getting there: well done, you <b>debugged</b>. Even the best programmers spend more time testing and fixing than writing!</p>
<h4>🌍 In real life</h4>
<ul>
<li>Robot vacuum cleaners, warehouse robots and the Perseverance rover on Mars follow programs written in advance (Mars is too far for a remote control: an order takes up to 20 minutes to get there!).</li>
<li>In <b>Scratch</b> (scratch.mit.edu), you program exactly like this, with “repeat” blocks.</li>
<li>Your washing machine runs a program too: “repeat 30 times: turn left, turn right”…</li>
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
    ricane: "I messed up the kitchen: the pancakes come out in the wrong order. Your guests will be eating alphabet soup. Enjoy!",
    piques: [
      "Wrong! You took the stack from the wrong end. Like your jumper: inside out.",
      "No. The guests ate your mistakes: now they have indigestion.",
      "Wrong! I'm keeping the last pancake for myself. And yours too.",
    ],
    fuite: "The word is served in order?! Last pancake on, first one eaten… and me, the first one out of here!",
  },
  histoire: `<p>In the Dining Room, it's snack time! On every pancake there's a chocolate letter: the guests want to eat them <b>in order</b>, to read the word of the day. But the Ker messed up the kitchen, and the pancakes come out in the wrong order…</p>
<p>To sort things out, you have two places to put them: <b>the plate</b> and <b>the serving hatch</b>. And they don't work the same way at all.</p>`,
  cours: `<p>In computing, data that's waiting is often stored in one of two ways:</p>
<div class="defilement"><table class="tableau">
<tr><th>Storage</th><th>How it works</th><th>In everyday life</th></tr>
<tr><td><b>Stack</b></td><td class="gauche">you put things <b>on top</b>, you take them <b>from the top</b>: <b>last in, first out</b></td><td class="gauche">a stack of plates, a stack of pancakes</td></tr>
<tr><td><b>Queue</b></td><td class="gauche">you join <b>at the back</b>, you leave <b>at the front</b>: <b>first in, first out</b></td><td class="gauche">the queue at the bakery</td></tr>
</table></div>
<p>Example: pancakes A, then B, then C arrive. On a <b>stack</b>, they come back out C, B, A (the order is <b>reversed</b>). In a <b>queue</b>, they come back out A, B, C (the order is <b>kept</b>).</p>
<p>By combining the two, you can put lots of things back in order… as long as you think carefully before placing each pancake!</p>`,
  enigme: `<p>The pancakes come out of the kitchen one at a time, in the order shown. Each one must go either on <b>the plate</b> (a stack) or into <b>the serving hatch</b> (a queue). You can serve the guests the <b>top of the plate</b> or the <b>first pancake in the hatch</b>, whenever you like.</p>
<p>Serve the pancakes so the guests read the word <b>PANCAKES</b>. You can undo and start again as often as you like.</p>`,
  widget: W.crepes({ arrivee: 'SNKCPAEA', mot: 'PANCAKES' }),
  indices: [
    'A pancake that has to wait a long time while keeping its place among others goes in the hatch (it will come out in the same order). A pancake that must go BEFORE the earlier ones goes on the plate. The S, served last of all, can wait at the bottom of the plate.',
    'Start of the solution: S on the plate; N and K in the hatch; C, then P on the plate. Serve the P (top of the plate). The A arrives: on the plate, and serve it straight away. Then serve the N from the hatch, then the C from the plate…',
  ],
  lecon: `<p>One solution: the <b>S</b> waits at the bottom of the plate, <b>N</b> and <b>K</b> wait in the hatch (in the same order), <b>C</b> and <b>P</b> go on the plate… You serve P, A, N, C, then A, K, E and finally the S: <b>PANCAKES</b> 🥞!</p>
<p>In a <b>stack</b>, it's <b>last in, first out</b>: the order is reversed. In a <b>queue</b>, it's <b>first in, first out</b>: the order is kept. With only one of the two, this word was impossible to serve. With both, anything is possible!</p>
<h4>🌍 In real life</h4>
<ul>
<li><b>Ctrl+Z</b> (undo) uses a stack: the last thing you did is the first thing undone. So does this mini-game's “Undo” button!</li>
<li>Your browser's “Back” button is a stack of the pages you visited.</li>
<li>Documents sent to a printer, messages on a server, players waiting for an online match: they all wait in <b>queues</b>.</li>
</ul>`,
  fragment: [16, '01000101'],
},

/* ======================= DAY 12 ====================== */
{
  jour: 12, piece: piece(12), particules: particules(12), couleurs: couleurs(12),
  univers: 'The Radio Room',
  emoji: '📻',
  concept: 'Morse code',
  givrin: {
    ricane: "I've frozen the radio's microphone: not a single word will come out of this set! All that's left is silly beeps… dit, dah, dit. Nobody understands that gibberish!",
    piques: [
      "Wrong! That reindeer doesn't even exist in your dreams.",
      "Missed. Looks like you're mixing up your dits and dahs.",
      "No! The sleigh is going to stay stuck in the fog…",
    ],
    fuite: "You understand the beeps?! So HE'S the one guiding the sleigh… I'm off before he dazzles me with that nose!",
  },
  histoire: `<p>Tonight, thick fog covers the North Pole, and the sleigh has to make a test flight. Santa has chosen the reindeer who will guide the team… but the Ker has <b>frozen the microphone</b> in the Radio Room: no voice can get through!</p>
<p>Luckily, the old radio set can still do one thing: <b>beep</b>. Santa tapped out his message in <b>Morse code</b>, and the radio printed it on a paper strip.</p>`,
  cours: `<p>Before the telephone, how could you send a message far away, down a simple wire or by radio? In 1838, Samuel Morse and Alfred Vail invented a code with only <b>two signals</b>:</p>
<ul>
<li><b>•</b> a <b>short</b> beep, called a “dit”;</li>
<li><b>—</b> a <b>long</b> beep (three times longer), called a “dah”.</li>
</ul>
<p>Each letter has its own little tune of dits and dahs. Between two letters, you pause.</p>
<div class="schema">S = <code>•••</code> &nbsp; O = <code>———</code><br>SOS = <code>••• ——— •••</code></div>
<p>SOS is the famous distress call of ships: dit dit dit, dah dah dah, dit dit dit. Easy to recognise, even through the noise!</p>
<p>Morse's trick: the letters used most often have the shortest codes. <b>E</b>, the most common letter, is just <code>•</code>. <b>T</b> is just <code>—</code>. That saves time!</p>
<p>Only two signals… does that remind you of something? It's like the <b>binary</b> from day 1, with its 0s and 1s!</p>`,
  enigme: `<p>Here is the strip printed by the radio. Each group of signals is <b>one letter</b>. Find them one by one in the Morse table, and read Santa's message.</p>
<div class="rappel">📌 <b>•</b> = a dit (short), <b>—</b> = a dah (long). Count the signals in each group carefully: <code>••</code> (I) is not <code>•••</code> (S)!</div>
<p><b>Which reindeer will guide the sleigh tonight?</b></p>`,
  widget: W.morse({ message: 'RUDOLPH' }),
  reponses: ['ca6e917aa0c1f1e8b46d60115e3bc4d1535024556f7391ec76f03bb9a2aeeed5', '7d00c5839826c09db5948a05194d8ad184e2ecd75d3f569b442d5ddedc0d5fce'],
  placeholder: 'The reindeer\'s name…',
  indices: [
    "Take the groups one at a time. The first one, • — •, is “dit dah dit”: in the table, that's the letter R. Carry on with the second!",
    "Not sure about a group? Tap it on the telegraph key (short, long…): the radio shows the letter. And count your dits carefully: • • • • (four) is not • • • (three).",
  ],
  lecon: `<p>The message said <b>RUDOLPH</b> 🦌🔴: with his shiny red nose, he's the one who guides the sleigh through the fog!</p>
<p>You've just read <b>Morse code</b>: each letter becomes a series of short and long signals. With only two signals, you can write anything… exactly like the <b>binary</b> used by computers, which only uses 0s and 1s.</p>
<p>And the “common letter = short code” trick is still used today: it's a <b>compression</b> idea, found in ZIP files and JPEG photos.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Morse was the first “Internet”: from the 1840s, the telegraph sent messages from one city to another in minutes, instead of days on horseback.</li>
<li>The <b>Titanic</b> called for help in Morse in 1912. Radio amateurs still use it today: a beep gets through where a voice is lost in the noise.</li>
<li>The radio beacons that guide planes repeat their name in Morse, so pilots can check they're listening to the right one.</li>
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
  univers: 'The Wrapping Room',
  emoji: '🏷️',
  concept: 'Regular expressions',
  givrin: {
    ricane: "I slipped my fake labels in with the real ones. The sorting robot lost its pattern: every present is going to end up in the shredder!",
    piques: [
      "Wrong! A real present just turned into confetti.",
      "No. You read patterns the way a hen reads the newspaper.",
      "No! My KERE_666 label got through. I love that number.",
    ],
    fuite: "You can write regular expressions?! Nobody can write those! I'm out of here!",
  },
  histoire: `<p>In the Wrapping Room, a robot sorts the present labels: real ones go to the sleigh, fake ones to the shredder. But the Ker erased its sorting <b>pattern</b>… and slipped her own labels in with the real ones!</p>
<p>The pattern has to be rewritten in the robot's language: a <b>regular expression</b>.</p>`,
  cours: `<p>A <b>regular expression</b> (or <i>regex</i>) describes what a piece of text should look like. You build it from little bricks:</p>
<div class="defilement"><table class="tableau">
<tr><th>Brick</th><th>Means</th></tr>
<tr><td><code>[A-Z]</code></td><td class="gauche">one <b>capital letter</b> (from A to Z)</td></tr>
<tr><td><code>[a-z]</code></td><td class="gauche">one <b>lowercase letter</b></td></tr>
<tr><td><code>[0-9]</code></td><td class="gauche">one <b>digit</b></td></tr>
<tr><td><code>+</code></td><td class="gauche">the brick before, <b>one or more times</b>: <code>[0-9]+</code> = a number</td></tr>
<tr><td><code>{3}</code></td><td class="gauche">the brick before, <b>exactly 3 times</b>: <code>[a-z]{3}</code> = 3 lowercase letters</td></tr>
<tr><td><code>^</code> and <code>$</code></td><td class="gauche">the <b>start</b> and the <b>end</b> of the text (nothing before, nothing after)</td></tr>
<tr><td><code>-</code> or <code>_</code></td><td class="gauche">other characters are matched as they are</td></tr>
</table></div>
<p>Example: a first name with a capital then lowercase letters is written <code>^[A-Z][a-z]+$</code>. “Lou” passes; “lou” and “LOU” don't.</p>
<p>Watch out for the trap: without <code>^</code> and <code>$</code>, the pattern looks for <b>a piece</b> of the text. <code>[0-9]{2}</code> finds two digits… even inside “12345”!</p>`,
  enigme: `<p>Write a pattern that <b>accepts all the real labels</b> and <b>rejects all the fake ones</b>. The sorting updates with every letter you type: watch which labels get through, and fix your pattern until everything is green. Then run the sorting!</p>`,
  widget: W.trieuse({
    garder: ['ELF-042', 'REINDEER-117', 'SANTA-008', 'SLEIGH-300', 'SNOW-999', 'TREE-024'],
    jeter: ['elf-042', 'REINDEER-17', 'SANTA-0089', 'KERE_666', 'TREE-12A', '-123', 'NOEL-12!', 'ELF-O42'],
    depart: '',
  }),
  indices: [
    'A real label is: CAPITAL LETTERS, a hyphen, then exactly 3 digits. Translate each part into a brick: [A-Z]+ then - then [0-9]{3}.',
    'Without ^ at the start and $ at the end, SANTA-0089 gets through (it does contain “SANTA-008”). The full pattern: ^[A-Z]+-[0-9]{3}$',
  ],
  lecon: `<p>A pattern that worked: <code>^[A-Z]+-[0-9]{3}$</code>, meaning “from start to end: capital letters, a hyphen, exactly three digits”.</p>
<p>All the Ker's fake labels were rejected: <code>elf-042</code> (lowercase), <code>REINDEER-17</code> (2 digits), <code>SANTA-0089</code> (4 digits), <code>KERE_666</code> (an underscore), <code>TREE-12A</code> (a letter at the end), <code>-123</code> (no name), <code>NOEL-12!</code> and <code>ELF-O42</code>… with the <b>letter O</b> instead of a zero. Nice catch, robot!</p>
<p><b>Regular expressions</b> are a mini-language found in almost every programming language. There are often several right patterns: <code>^[A-Z]+-\\d{3}$</code> works too (<code>\\d</code> = a digit).</p>
<h4>🌍 In real life</h4>
<ul>
<li>When a form tells you “invalid email address”, it's often a regex that checked.</li>
<li>A 4-digit PIN code is <code>^[0-9]{4}$</code> (“exactly 4 digits”).</li>
<li>Developers use them to search and replace text in thousands of files at once.</li>
</ul>`,
  fragment: [12, '01001100'],
},

/* ======================= DAY 16 ====================== */
{
  jour: 16, piece: piece(16), particules: particules(16), couleurs: couleurs(16),
  univers: 'The Photo Studio',
  emoji: '🎬',
  concept: 'Images and compression',
  givrin: {
    ricane: "This week, everyone's rushing to the cinema to see the Avengers. Pfft. The REAL film of the winter is my idol's. I made the poster myself… and I compressed it. Good luck seeing it!",
    piques: [
      "Wrong! My idol has never looked like a squashed snowman.",
      "Wrong. Count your squares again. I'm counting your mistakes… and I love it.",
      "No! Even a projector dropped into a frozen lake would show it better.",
    ],
    fuite: "You saw the poster?! Then you know what's waiting for you on the 24th… I'm off to book a front-row seat!",
  },
  histoire: `<p>In the Photo Studio, they were preparing the poster for the big film of the winter: the one hitting cinemas this week that everyone is waiting for. The Ker hacked the photographer's computer. She replaced the poster with one for <b>her idol's</b> film… then <b>compressed</b> it, so nobody can see it without repainting it square by square.</p>`,
  cours: `<p>A digital picture is a <b>grid of little colored squares</b>: the <b>pixels</b> (remember day 4). To save it, the computer writes down the color of each pixel, row by row.</p>
<p>The problem: a photo contains millions of pixels, and the file quickly gets very heavy. So we <b>compress</b> it: we write the same information <b>in a shorter way</b>, so it takes up less space and travels faster.</p>
<p>The simplest trick: instead of saying “white, white, white, red, red”, we say “<b>3 whites, 2 reds</b>”. In short, each color gets a letter: <code>3W 2R</code>. First a <b>number</b> (how many pixels in a row), then a <b>letter</b> (which color).</p>
<p>To get the picture back, we do the opposite: <code>3W 2R 1W</code> → ⬜⬜⬜🟥🟥⬜</p>`,
  enigme: `<div class="note">
<p>🎬 <b>The poster, compressed by the Ker</b></p>
<p>Each line of the code is one row of the picture, read from left to right: <code>7W 1I 7W</code> = 7 white pixels, 1 ice blue, 7 white.</p>
<p>The colors: <b>W</b> = white, <b>I</b> = ice blue, <b>N</b> = navy blue, <b>R</b> = red, <b>B</b> = black. The picture is <b>15 pixels</b> wide and <b>20</b> high, and every square starts out white.</p>
</div>
<p>Repaint the poster. <b>What title is written at the bottom of the poster?</b></p>`,
  widget: W.pixelsCouleurs({
    lignes: [
      '7W 1I 7W',
      '3W 1I 3W 1I 3W 1I 3W',
      '1W 1I 1W 1I 2W 3I 2W 1I 1W 1I 1W',
      '1W 4I 1W 3I 1W 4I 1W',
      '1W 13I 1W',
      '2W 11N 2W',
      '1W 1N 2W 7N 2W 1N 1W',
      '1W 2N 3W 3N 3W 2N 1W',
      '1W 3N 2R 3N 2R 3N 1W',
      '1W 13N 1W',
      '2W 1N 1B 1W 1B 1W 1B 1W 1B 1W 1B 1N 2W',
      '2W 1N 1W 1B 1W 1B 1W 1B 1W 1B 1W 1N 2W',
      '3W 9N 3W',
      '4W 1N 1W 1N 1W 1N 1W 1N 4W',
      '15W',
      '1W 3R 1W 1R 2W 1R 1W 3R 2W',
      '1W 1R 3W 2R 1W 1R 1W 1R 2W 1R 1W',
      '1W 2R 2W 1R 1W 2R 1W 1R 2W 1R 1W',
      '1W 1R 3W 1R 2W 1R 1W 1R 2W 1R 1W',
      '1W 3R 1W 1R 2W 1R 1W 3R 2W',
    ],
    largeur: 15,
    palette: [
      { l: 'W', nom: 'white', c: '#ffffff' },
      { l: 'I', nom: 'ice blue', c: '#8fd3fb' },
      { l: 'N', nom: 'navy blue', c: '#1c2d5a' },
      { l: 'R', nom: 'red', c: '#d62839' },
      { l: 'B', nom: 'black', c: '#111318' },
    ],
  }),
  reponses: ['e16079d82df984a62b5f4ace7933e5e0b7c18da1d2427086c6a531256f91ec17', 'add224d5c309ce50a463682f90a49630555b67768bdf288736ad317b2577b4b0', '3c56ec506225eac14054db49ab6c4f48118282308815fcd1e6f30b65621defcd', '0d0e19dbeb8c6e74084700f87e77d0bb6f7770dbefd461afe64de31201beb9ca', 'afd0b3ea9a5a55880d7bf40dea5de6f166950845918e4f2773c97b9bf985a1bf', '340c71c1b973d85c68e8bd48c3d8f406e6d5bf089870423eb84503f1a6947239'],
  placeholder: 'The title…',
  indices: [
    "Start at the top. Row 2: 3W 1I 3W 1I 3W 1I 3W, that is 3 white, 1 ice blue, 3 white… Each row adds up to 15 squares. Hover over a square: its line lights up in the code, and a correct row gets a ✓.",
    "At the top: an ice crown, red eyes and fangs. It's Kryos, the Ker's idol! The title is painted in red in the last 5 rows: 3 letters, the word you see at the very end of films.",
  ],
  lecon: `<p>“<b>KRYOS: THE END</b>” 🎬! The Ker's idol, of course… See you on the 24th to show him who really writes the end of this story.</p>
<p>This kind of code is called <b>RLE</b> (<i>Run-Length Encoding</i>): instead of writing “white” 7 times, we write <code>7W</code>.</p>
<p>The raw picture has <b>300 pixels</b> (15 × 20). The code only describes <b>148 runs</b>: half as much to write, and the gain is huge on a big picture full of plain areas! And when a picture only has <b>2 colors</b>, you can even drop the letters, since the colors must alternate. <b>Fax machines</b> did exactly that: a page of text is mostly white, with runs of black.</p>
<p>RLE is excellent for big plain areas (a sky, a blank page), but bad for detailed photos, where the color changes at every pixel. It's a <b>lossless</b> compression: you get the exact picture back. The <b>JPEG</b> format compresses <b>with loss</b>: it throws away details the eye barely notices, to get files about 10 times lighter.</p>
<h4>🌍 In real life</h4>
<ul>
<li><b>.zip</b> files and <b>.png</b> pictures use lossless compressions, smarter than RLE.</li>
<li>Photos (<b>.jpg</b>), music (<b>.mp3</b>) and streamed films use lossy compressions.</li>
<li>🍿 And the real film of 16 December? <i>Avengers: Doomsday</i> hits French cinemas that day (18 December in the US). The Ker is boycotting it.</li>
</ul>`,
  fragment: [13, '01000001'],
},

/* ======================= DAY 17 ====================== */
{
  jour: 17, piece: piece(17), particules: particules(17), couleurs: couleurs(17),
  univers: 'The Library',
  emoji: '📚',
  concept: 'Databases (SQL)',
  givrin: {
    ricane: "My accomplice is hiding in the children's list, and he's already stolen a present. Thousands of rows… well, lots. Good luck!",
    piques: [
      "Wrong! That present is still tucked up safe and warm. Look harder.",
      "Error! You read the list backwards, like an elf who's had too much hot chocolate.",
      "No. The database sighed. Yes, yes, I heard it.",
    ],
    fuite: "SELECT exit FROM chalet WHERE ker = 'me'… I'm vanishing from the database!",
  },
  histoire: `<p>In the Library, the big list of children isn't an old spellbook any more: it's a <b>database</b>. The Ker slipped an <b>accomplice</b> into it… who has already stolen a present! On the desk, she left a little note to taunt the elves.</p>
<p>There's only one way to question the database: the elves' <b>SQL console</b>.</p>`,
  cours: `<p>A <b>database</b> stores information in <b>tables</b>, like a spreadsheet: one row per child, one column per piece of information. To ask it a question, you write a <b>query</b> in <b>SQL</b>. Examples with the <code>reindeer</code> table:</p>
<pre class="code">SELECT * FROM reindeer</pre>
<p>“Show all the columns (<code>*</code>) of the reindeer table.”</p>
<pre class="code">SELECT name, speed FROM reindeer
WHERE speed > 60 AND red_nose = 'no'</pre>
<p>“Only the name and speed, of the reindeer faster than 60 <b>and</b> without a red nose.” Text goes in quotes: <code>'no'</code>.</p>
<pre class="code">SELECT * FROM reindeer
ORDER BY speed DESC LIMIT 1</pre>
<p>“Sort from fastest to slowest (<code>DESC</code>), and keep only the first row.”</p>
<p>The words in capitals (SELECT, FROM, WHERE, AND, ORDER BY, LIMIT) can also be written in lowercase.</p>`,
  enigme: `<div class="note">
<p>📝 <b>The Ker's note</b></p>
<p>“My accomplice is hiding in the list: he's the only one over 100 years old. Last night, he stole <b>the most expensive present of a good child from his town</b>. Good luck finding it, hee hee!”</p>
</div>
<p>Query the <code>list</code> table to unmask the accomplice, then find the stolen present. <b>Which present was stolen?</b></p>`,
  widget: W.sql({
    tables: {
      list: {
        colonnes: ['name', 'city', 'age', 'good', 'gift', 'price'],
        lignes: [
          ['Zoe', 'Strasbourg', 8, 'yes', 'Telescope', 89],
          ['Harry', 'Strasbourg', 10, 'no', 'Games console', 299],
          ['Lily', 'Strasbourg', 6, 'yes', 'Doll', 25],
          ['Isla', 'York', 9, 'yes', 'Bike', 189],
          ['Adam', 'York', 5, 'yes', 'Spinning top', 12],
          ['Lucy', 'Leeds', 6, 'yes', 'Reindeer plush', 22],
          ['George', 'Leeds', 11, 'yes', 'Robot kit', 119],
          ['Noah', 'Strasbourg', 9, 'yes', 'Jigsaw puzzle', 18],
          ['Rose', 'York', 12, 'no', 'Drone', 149],
          ['Tom', 'Bath', 10, 'yes', 'Model boat', 49],
          ['Lou', 'Brighton', 8, 'yes', 'Roller skates', 69],
          ['Jade', 'Strasbourg', 7, 'no', 'Scooter', 79],
          ['Paul', 'Oxford', 9, 'yes', 'Skis', 159],
          ['Chloe', 'Leeds', 9, 'no', 'Ice skates', 59],
          ['Leo', 'York', 8, 'yes', 'Sledge', 45],
          ['Anna', 'Bath', 7, 'no', 'Raincoat', 35],
          ['Theo', 'Brighton', 11, 'no', 'Surfboard', 199],
          ['Max', 'Strasbourg', 11, 'yes', 'Magic book', 15],
          ['Megan', 'Oxford', 12, 'no', 'Snowboard', 249],
          ['Emma', 'York', 7, 'yes', 'Ukulele', 39],
          ['Jack', 'Bath', 12, 'yes', 'Camera', 129],
          ['Alice', 'Brighton', 5, 'yes', 'Toy kitchen', 34],
          ['Hailstone', 'Strasbourg', 1000, 'no', 'Bag of ice cubes', 0],
          ['Oliver', 'Leeds', 8, 'yes', 'Board game', 29],
          ['Ethan', 'Oxford', 6, 'yes', 'Bobble hat', 14],
          ['Sam', 'York', 10, 'no', 'Headphones', 99],
          ['Lena', 'Bath', 6, 'yes', 'Ugly sweater', 25],
          ['Ralph', 'Brighton', 10, 'yes', 'Microscope', 79],
          ['Amber', 'Strasbourg', 5, 'yes', 'Snowman plush', 30],
          ['Mila', 'Leeds', 4, 'yes', 'Xylophone', 19],
          ['Clara', 'Oxford', 8, 'yes', 'Snow globe', 17],
          ['Arthur', 'Bath', 9, 'no', 'Kite', 19],
          ['Iris', 'Brighton', 7, 'yes', 'Chemistry set', 44],
          ['Victor', 'Oxford', 10, 'yes', 'Head torch', 28],
        ],
      },
      reindeer: {
        colonnes: ['name', 'speed', 'red_nose', 'age'],
        lignes: [
          ['Dasher', 62, 'no', 7], ['Dancer', 55, 'no', 9], ['Prancer', 58, 'no', 6], ['Vixen', 49, 'no', 8], ['Comet', 71, 'no', 5],
          ['Cupid', 52, 'no', 10], ['Donner', 66, 'no', 7], ['Blitzen', 69, 'no', 4], ['Rudolph', 74, 'yes', 6],
        ],
      },
    },
  }),
  reponses: ['b0d60e51e5f662c02c1921910e0c803912582119882126275fc28dd9f87cfdd6', '2807bde9fc94820c3e250c545611b2782e21548bf98b69bb025702267a9631eb', 'eb21b9a52a2ac09f0cc74115c9c0c0aae4e2af57ed9ea742734e4d8efecac1ba'],
  placeholder: 'The stolen present…',
  indices: [
    'Start by unmasking the accomplice: SELECT * FROM list WHERE age > 100. Make a note of his town.',
    "You need two conditions joined by AND (the accomplice's town, and good = 'yes'), then ORDER BY price DESC to get the most expensive present first.",
  ],
  lecon: `<p>The accomplice was <b>Hailstone</b>, 1000 years old, from Strasbourg (<code>WHERE age > 100</code>). Then:</p>
<pre class="code">SELECT name, gift, price FROM list
WHERE city = 'Strasbourg' AND good = 'yes'
ORDER BY price DESC LIMIT 1</pre>
<p>→ Zoe's <b>Telescope</b> 🔭 (89)! If you'd forgotten <code>good = 'yes'</code>, you'd have landed on Harry's games console, and he wasn't good; and without the town, on Isla's bike, in York.</p>
<p>A <b>database</b> stores information in <b>tables</b>, and <b>SQL</b> lets you ask them questions: filter (<code>WHERE</code>), sort (<code>ORDER BY</code>), choose the columns (<code>SELECT</code>)… It was invented in the 1970s and is still used everywhere. A real database can hold <b>billions</b> of rows: the computer still answers in a fraction of a second.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your social media account, your school grades, your online orders, your bank account: they're all stored in databases.</li>
<li>A famous attack, <b>SQL injection</b>, means slipping SQL code into a form to trick the database. Developers must always protect against it!</li>
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
    ricane: "I locked the present safe with MY password. Ten characters, uncrackable. The elves tried brute force: they're still at it, hee hee.",
    piques: [
      "Wrong! The safe doesn't open with random words, nosy parker.",
      "No! And stop snooping on my profile, it's private. Well… public. But private all the same.",
      "Wrong! You'll NEVER find it. Nobody knows my favourite's name. Apart from my 312 followers.",
    ],
    fuite: "How did you guess?! I'm deleting my Kerebook account and running off to the other end of the ice!",
  },
  histoire: `<p>In the Vault, the Ker locked the <b>present safe</b> with her own password. The elves fired up their old computer to try every combination… with no luck.</p>
<p>But the Ker has one big flaw: she shares <b>her whole life</b> on her favourite social network, <b>Kerebook</b>. And her profile is public…</p>`,
  cours: `<p>The dumbest way to crack a password is called <b>brute force</b>: trying <b>every</b> combination, one by one. The number of combinations is:</p>
<p class="centre"><b>(number of possible characters)<sup>length</sup></b></p>
<p>Example: a 4-digit code is 10 × 10 × 10 × 10 = 10,000 combinations: a computer tries them in a split second. But with 10 characters chosen from the 26 letters and 10 digits, there are 36<sup>10</sup> of them: more than <b>3 million billion</b>!</p>
<p>So hackers are clever: before brute force, they try what the person <b>probably</b> chose. Their children's names, their cat's name, their date of birth… And lots of people post that information themselves on social media! That's <b>social engineering</b>: hacking the person rather than the machine.</p>`,
  enigme: `<p>Open the safe by finding <b>the Ker's password</b>. Investigate her Kerebook profile: every detail counts. (You can also launch the elves' brute-force attack… just to see.)</p>
<p>🚫 Nothing personal here: you guess this password, you don't make one up!</p>`,
  widget: W.kerebook({
    profil: { nom: 'The Safe Ker', avatar: '👹', bio: 'Keeper of safes · Ice cube fan · 312 followers' },
    longueur: 10, alphabet: 36, vitesse: 1000,
    posts: [
      { date: 'Dec 1, 2026', texte: 'New password for the present safe 🔐 10 characters, letters and numbers. The elves can keep trying 😎 #uncrackable', likes: 66,
        commentaires: [{ auteur: 'Snow Ker', texte: "Let me guess: you used your favourite again 😂" }, { auteur: 'The Safe Ker', texte: 'Shhh!!! 🤫' }] },
      { date: 'Nov 28, 2026', texte: 'My little family ❤️ Waddle, my favourite penguin, Blubber the seal, and Hooter the owl.', image: '🐧 🦭 🦉', likes: 128 },
      { date: 'Nov 20, 2026', texte: 'Hooter is 3 today! 🦉🎉 He got an ice mouse.', likes: 41 },
      { date: 'Oct 5, 2026', texte: "People who put their pet's name in their password… 🙄 Me? Never. Well… almost never. 🤭", likes: 23 },
      { date: 'Jul 14, 2026', texte: 'Blubber turns 11 🦭🎂 (he prefers fish to cake)', likes: 57 },
      { date: 'Feb 2, 2026', texte: "Pro tip: never any capital letters in my passwords, too tiring. And I write it all together, no spaces. 💅", likes: 19 },
      { date: 'Dec 3, 2025', texte: 'Happy birthday to my Waddle! 🎂 6 years old today, already… He grows up so fast 🥹', image: '🐧🎂', likes: 230 },
      { date: 'Jun 1, 2025', texte: "Ice cubes for breakfast, ice cubes for lunch, ice cubes for dinner. A champion's diet. 🧊", likes: 12 },
    ],
  }),
  reponses: ['000caaf6b7c12a596256614cc3b81ebba2191a198e59dde82610bb6f6c4accae'],
  placeholder: 'The safe password…',
  indices: [
    "One post says how the password is made (10 characters, letters and numbers, lowercase and all together). A comment tells you what she built it on. Who's her favourite?",
    'Her favourite is Waddle (6 letters). You need 4 more digits: his year of birth. He turned 6 on December 3, 2025…',
  ],
  lecon: `<p>The password was <b>waddle2019</b> 🐧: her favourite's name, plus his year of birth (6 in 2025 → born in 2019). Exactly 10 characters, lowercase and all together, just like she bragged!</p>
<p>The elves' brute force would have taken more than <b>100,000 years</b>. You took a few minutes, because the Ker chose a <b>guessable</b> password and left the clues herself. Real hackers do exactly the same: they dig through social media, then try names, pets, dates and the most common passwords (<code>123456</code>, <code>qwerty</code>…).</p>
<p><b>Length</b> matters much more than complicated symbols, but only if the password is <b>unpredictable</b>. A <b>passphrase</b> of several randomly chosen words (“sock-volcano-penguin-trumpet”) is both very strong and easy to remember.</p>
<h4>🌍 In real life: the 4 good habits</h4>
<ul>
<li>Nothing personal in a password: no names, no pets, no birthdays.</li>
<li>A <b>different password for every site</b>, and a <b>password manager</b> to remember them for you.</li>
<li><b>Two-factor authentication</b>: a code sent to your phone on top of the password.</li>
<li>Think about what you post publicly: hackers are interested in your dog's birthday too.</li>
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
    ricane: "I changed ONE word in ONE letter. Just one! Good luck finding which, with your little elf eyes.",
    piques: [
      "Wrong! That child will get a present they don't want. Thanks for your help.",
      "Wrong. My machine never lies. You, on the other hand…",
      "Wrong again! I'm starting to think YOU wrote my fake letters.",
    ],
    fuite: "Caught out by a fingerprint?! A simple string of numbers and letters?! I'm puffing… I'm panting…",
  },
  histoire: `<p>In Santa's Study, every child's letter is recorded in a <b>register</b>, as a <b>fingerprint</b>: a code calculated by a machine from the text of the letter.</p>
<p>Last night, the Ker sneaked into the study and changed <b>a single word</b> in <b>a single letter</b>, so that a child gets the wrong present. With the naked eye, it's impossible to tell which one…</p>`,
  cours: `<p>A <b>hash function</b> is a machine that turns any text into a <b>fingerprint</b>: a string of numbers and letters, always the same length. It has three superpowers:</p>
<ul>
<li>the <b>same text</b> always gives <b>the same fingerprint</b>;</li>
<li>the <b>tiniest change</b> (a letter, a comma, a capital) gives a <b>completely different</b> fingerprint;</li>
<li>you can't go backwards: the fingerprint doesn't let you find the text. To know which text gave a fingerprint, you have to <b>try</b> texts until you land on it.</li>
</ul>
<p>Example with <b>SHA-256</b>, the most widely used in the world: “Christmas” gives <code>a09948e8f6…</code>, and “christmas” gives <code>e718b2dd3e…</code>. Only one letter changed, and yet the two fingerprints have nothing in common!</p>
<p>It's perfect for checking that a text hasn't been changed: you compare its fingerprint with the one you noted down.</p>`,
  enigme: `<p>1. Find the <b>letter the Ker changed</b>: put the letters through the machine and compare with the register.</p>
<p>2. Find the present the child <b>really</b> asked for: it's in the workshop catalogue. You can edit the text in the machine and try as many times as you like.</p>
<p><b>Which present did the child really ask for?</b></p>`,
  widget: W.empreintes((() => {
    const originales = [
      ['Tom', 'Dear Santa, I have been very good this year. I would like a robot. Thank you! Tom'],
      ['Lea', 'Dear Santa, I tidied my room every single day. I would like a scooter. Thank you! Lea'],
      ['Isla', 'Dear Santa, I would like ice skates to glide with my friends. Thank you! Isla'],
      ['Harry', 'Dear Santa, I would like a jigsaw puzzle with a thousand pieces. Thank you very much! Harry'],
      ['Zoe', 'Dear Santa, I would like a ukulele to play songs. Thank you! Zoe'],
      ['Max', 'Dear Santa, I would like an electric train, with tracks. Thank you! Max'],
    ];
    return {
      // The Ker replaced “a scooter” with “a yo-yo” in Lea's letter
      lettres: originales.map(([enfant, texte]) => ({ enfant, texte: enfant === 'Lea' ? texte.replace('a scooter', 'a yo-yo') : texte })),
      registre: originales.map(([enfant, texte]) => ({ enfant, empreinte: empreinteCourte(texte) })).sort((a, b) => a.enfant.localeCompare(b.enfant)),
      catalogue: ['a robot', 'a sledge', 'a yo-yo', 'ice skates', 'a jigsaw puzzle', 'a spinning top', 'a scooter', 'a ukulele', 'roller skates', 'an electric train'],
    };
  })()),
  reponses: ['faf6b9057ea6e0df52a24338fd4475d74b662f798186dc56397e84a9609af573', '13ba14451e9ae03ba25251c022d1126ded6d0b28223be7b441afb728a3f797b9'],
  placeholder: 'The real present…',
  indices: [
    'Click “Put through the machine” under each letter: the changed letter is the only one whose fingerprint matches no row in the register.',
    "It's Lea's letter. In the machine, replace “a yo-yo” with each present from the catalogue, one at a time, without touching the rest, until the fingerprint matches Lea's.",
  ],
  lecon: `<p>It was <b>Lea</b>'s letter: the Ker had replaced “a scooter” with “a yo-yo”. With “a <b>scooter</b>” 🛴, the fingerprint lands exactly on the one in the register ✅.</p>
<p>You used a real <b>hash function</b>: <b>SHA-256</b>. Its fingerprints are 256 bits long (64 characters; the register only showed the first 10). For Lea's letter, you had to <b>try</b> the presents one by one: you can't “reverse” a fingerprint, only test texts. With 10 presents, that's quick. With a well-chosen real password, it would take billions of years.</p>
<p>🤫 <b>This calendar's secret</b>: the answers are never sent to your browser, and the North Pole server doesn't even keep them in plain text: only their <b>SHA-256 fingerprints</b>. When you suggest an answer, it calculates its fingerprint and compares. Even someone who stole the server couldn't read the answers!</p>
<h4>🌍 In real life</h4>
<ul>
<li>Serious websites never store your password: only its fingerprint (with some added “salt” for extra security).</li>
<li>When you download software, you can compare its fingerprint with the one on the official website to check a hacker hasn't tampered with it.</li>
<li><b>Git</b>, the tool programmers use to keep the history of their code, names every version (every <i>commit</i>) with… a fingerprint of its contents!</li>
</ul>`,
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
    ricane: "I reset the robot elf's brain. It knows nothing now, it thinks the reindeer like everything… or nothing. Just like you, really.",
    piques: [
      "Wrong! The reindeer are sulking. Sulking very hard. They bite, too.",
      "Wrong. Even a toaster would learn faster than your robot.",
      "Your robot learned by heart, like a parrot. Faced with a new toy, it's lost!",
    ],
    fuite: "It's learning… it's learning all by itself! It even figured me out! I'm off!",
  },
  histoire: `<p>In the Lab, the robot elf has to choose which toys to give the reindeer. Nobody gave it a rule: it has to <b>learn from examples</b>. But the Ker reset its brain…</p>
<p>Luckily, its brain is very simple: a few knobs to adjust. Time for you to play artificial intelligence engineer!</p>`,
  cours: `<p>An <b>artificial intelligence</b> doesn't learn the way you learn a lesson: you show it <b>examples</b> (here, toys and what the reindeer thought of them), and it adjusts itself until it stops making mistakes.</p>
<p>The robot elf's brain is an <b>artificial neuron</b>, the basic building block of AIs:</p>
<ul>
<li>each <b>criterion</b> (the toy makes noise, it sparkles…) gives <b>points</b> when it's true. Those points can be <b>negative</b> if the criterion tends to put the reindeer off;</li>
<li>the robot adds up the points; if the total reaches the <b>threshold</b>, it says “loved”, otherwise “meh”.</li>
</ul>
<p>Example: noise = +2, threshold = 2. A trumpet (noise) gets 2 points: loved. A ball (no noise) gets 0 points: meh.</p>
<p>The real test of an AI is when it meets cases <b>it has never seen</b>. A robot that only “learned its examples by heart” will get a new toy wrong.</p>`,
  enigme: `<p>Set the points for each criterion and the threshold so the robot guesses right on <b>every example</b>. The table updates with every adjustment.</p>
<p>Then test it on <b>the new toys</b>, which it has never seen: if it has understood what the reindeer really like (and not just learned by heart), it won't make a mistake.</p>`,
  widget: W.neurone({
    criteres: [
      { k: 'bruit', emoji: '🔔', nom: 'makes noise' },
      { k: 'brille', emoji: '✨', nom: 'sparkles' },
      { k: 'grand', emoji: '📏', nom: 'is big' },
      { k: 'rouge', emoji: '🔴', nom: 'is red' },
    ],
    exemples: [
      { emoji: '🔔', nom: 'Little bell', v: { bruit: 1, brille: 0, grand: 0, rouge: 1 }, aime: true },
      { emoji: '🛎️', nom: 'Golden sleigh bell', v: { bruit: 1, brille: 1, grand: 0, rouge: 0 }, aime: true },
      { emoji: '🪩', nom: 'Disco ball', v: { bruit: 0, brille: 1, grand: 0, rouge: 0 }, aime: true },
      { emoji: '🍭', nom: 'Glitter lollipop', v: { bruit: 0, brille: 1, grand: 0, rouge: 1 }, aime: true },
      { emoji: '📯', nom: 'Whistle', v: { bruit: 1, brille: 0, grand: 0, rouge: 0 }, aime: true },
      { emoji: '🎺', nom: 'Golden trumpet', v: { bruit: 1, brille: 1, grand: 0, rouge: 0 }, aime: true },
      { emoji: '🥁', nom: 'Giant drum', v: { bruit: 1, brille: 0, grand: 1, rouge: 1 }, aime: false },
      { emoji: '🎄', nom: 'Long fairy lights', v: { bruit: 0, brille: 1, grand: 1, rouge: 0 }, aime: false },
      { emoji: '🎹', nom: 'Giant glossy piano', v: { bruit: 1, brille: 1, grand: 1, rouge: 0 }, aime: false },
      { emoji: '🧱', nom: 'Wooden block', v: { bruit: 0, brille: 0, grand: 0, rouge: 1 }, aime: false },
      { emoji: '🧸', nom: 'Big teddy bear', v: { bruit: 0, brille: 0, grand: 1, rouge: 0 }, aime: false },
      { emoji: '⚽', nom: 'Ball', v: { bruit: 0, brille: 0, grand: 0, rouge: 0 }, aime: false },
    ],
    nouveaux: [
      { emoji: '🎻', nom: 'Little violin', v: { bruit: 1, brille: 0, grand: 0, rouge: 1 } },
      { emoji: '🛋️', nom: 'Big red armchair', v: { bruit: 0, brille: 0, grand: 1, rouge: 1 } },
      { emoji: '🔮', nom: 'Crystal ball', v: { bruit: 0, brille: 1, grand: 0, rouge: 0 } },
      { emoji: '🎠', nom: 'Big red musical, sparkly carousel', v: { bruit: 1, brille: 1, grand: 1, rouge: 1 } },
      { emoji: '🪇', nom: 'Maracas', v: { bruit: 1, brille: 0, grand: 0, rouge: 0 } },
      { emoji: '🧦', nom: 'Red stocking', v: { bruit: 0, brille: 0, grand: 0, rouge: 1 } },
      { emoji: '🌟', nom: 'Little twinkling star', v: { bruit: 0, brille: 1, grand: 0, rouge: 1 } },
    ],
  }),
  // What the reindeer really thought of the new toys (never leaves the server)
  verite: [true, false, true, false, true, false, true],
  indices: [
    'Start by giving points to noise and to sparkle, then set the threshold so silent, dull toys stay “meh”. Next, look at what makes the BIG toys go wrong: that criterion has to lose points.',
    'One setting that works: noise +2, sparkles +2, big −3, red 0, threshold 2. Colour doesn\'t matter at all to the reindeer!',
  ],
  lecon: `<p>The reindeer love toys <b>that make noise or sparkle</b>… <b>unless they're big</b> (they don't fit in the stable!). And colour doesn't matter at all. One setting that worked: noise +2, sparkles +2, big −3, red 0, threshold 2.</p>
<p>Among the new toys, the robot picked the little violin 🎻, the crystal ball 🔮, the maracas 🪇 and the little star 🌟. It left out the armchair, the stocking… and the big carousel, despite its music and sparkles: too big! The reindeer are delighted 🦌</p>
<p>You've just done what <b>artificial intelligence</b> engineers do: adjust the “weights” of an <b>artificial neuron</b> from <b>labelled examples</b>, then check that it <b>generalises</b> to cases it has never seen. A real AI does the same thing… with billions of neurons, adjusted automatically by the computer.</p>
<h4>⚠️ The danger of learning by heart</h4>
<p>If the robot had given points for red, it could have got every example right… and got the big red carousel wrong. An AI is never better than its examples: if they're incomplete or unfair, it learns a wrong or unfair rule. That's called a <b>bias</b>.</p>
<h4>🌍 In real life</h4>
<ul>
<li>Your email's spam filter learned from millions of emails marked “spam” or “not spam”.</li>
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
    fuite: "‘Eternal light’… Nothing is eternal, mortal. Not your light, not your victory. The day it flickers, the frost will return. And so will I.",
  },
  histoire: `<p>It's the big night! Here you are in the Great Hall, in front of the tree. But when you switch on the NOËL-OS screen to light the star, an icy laugh comes out of the speakers: <b>Kryos</b> has taken control of the North Pole's computer.</p>
<p>A thousand years ago, a <b>secret spell</b> locked him inside his glacier. He cut it into <b>23 fragments</b>… which his Keres left behind for you as they fled. Kryos put them away in a folder, and sealed it. This is the final duel: <b>you against him, in the terminal</b>.</p>`,
  cours: `<p>Remember the Hacker Elf's terminal (day 22)? <code>ls</code>, <code>ls -a</code> for hidden items, <code>cd</code> to go into a folder, <code>cat</code> to read a file. Tonight, you'll need three more weapons:</p>
<ul>
<li><code>rev</code> writes text <b>backwards</b>: <code>echo tree | rev</code> displays <code>eert</code>;</li>
<li><code>sort</code> <b>sorts</b> lines; with <code>sort -n</code>, it sorts them as <b>numbers</b> (otherwise “10” comes before “2”, like in a dictionary);</li>
<li>the <b>pipe</b> <code>|</code> sends the result of one command to the next, like a tube: <code>cat list.txt | sort</code> reads the list, then sorts it.</li>
</ul>
<p>And the wildcard <code>*</code> means “all files”: <code>cat *.txt</code> displays every file ending in <code>.txt</code>.</p>
<p>Kryos won't give up without a fight. Keep your cool… even if he freezes your screen.</p>`,
  enigme: `<p>Kryos has taken control of NOËL-OS. Get your fragments back, put them in order and <b>speak the spell</b> to light the star.</p>
<p>Click in the terminal and start by reading the message the elves left you: <code>cat readme.txt</code></p>`,
  widget: W.duelFinal({
    utilisateurParDefaut: 'saviour', maisonJoueur: 'saviour', motDePasse: 'miehlfin',
    cmdDeverrouiller: 'unlock', cmdEtoile: 'light-star', dossierSauvegarde: '.backup', fichierJournal: '.diary',
    racine: {
      home: {
        saviour: {
          'readme.txt': "Psst, it's us, the elves! We managed to log you into NOËL-OS… but Kryos is everywhere.\n\nYour 23 fragments are in the /glacier folder, and Kryos sealed it with HIS password.\n\nYour mission:\n  1. Find Kryos's password. He lives in /home/kryos.\n     Search EVERYTHING, even what's hidden (ls -a).\n  2. Open the glacier:           unlock <password>\n  3. Put the fragments back in order.\n  4. Speak the spell:            light-star <the spell>\n\nType help to see all the commands. We believe in you! 🧝",
        },
        kryos: {
          'trophies.txt': "🏆 KRYOS'S TROPHY ROOM 🏆\n\n- Cup of the Eternal Winter ........... year 1024\n- Medal for the Longest Blizzard ...... year 1025\n- Engraved plaque: “Here Kryos was imprisoned, in the glacier of NIFLHEIM, year 1026”\n      (I kept the plaque. A souvenir.)",
          'evil-plan.txt': "EVIL PLAN (version 47)\n\n1. Freeze Christmas ...................... ✅\n2. Capture the elves ...................... ✅\n3. Put out the star ....................... ✅\n4. Stop the Saviour of Christmas from\n   speaking the spell ..................... ⏳\n5. Eternal winter. Hot chocolate BANNED.",
          '.diary': "KRYOS'S SECRET DIARY — DO NOT READ (yes, I'm talking to YOU)\n\nDay 1. The glacier cracked. A thousand years of boredom, finally over.\nDay 2. I froze NOËL-OS. The elves are crying. Delicious.\nDay 3. I need a password to seal /glacier.\n       I'll take the name of the glacier where those wretched elves locked me up…\n       but written BACKWARDS, all lowercase. Absolute genius.\n       (The name is engraved on one of my trophies. Nobody reads trophies.)\nDay 4. Note for later: learn to make sorbet.",
        },
      },
      etc: {
        'noel-os.conf': "# NOËL-OS configuration\nsystem         = NOËL-OS v24.12\nstatus         = FROZEN ❄️\nadministrator  = kryos (stolen!)\nbackups        = enabled (the elves really insist)",
      },
    },
    sauvegarde: {
      'readme.txt': "Well done, you found our secret backup! 😄\nKryos deleted the fragments… but we keep a copy of EVERYTHING.\n\nEach .frag file contains one line:  “position letter”.\n  - cat *.frag      shows all the fragments at once;\n  - sort            sorts lines (add -n to sort numbers);\n  - the pipe |      sends the result of one command to the next.\n\nNow put it all together! Then read the letters from top to bottom:\nthat's the spell. It's in Latin and has 4 words.",
    },
    fragmentGele: '(frozen fragment: day {n} is not solved)',
    aide: "Available commands:\n  help                      show this help\n  ls   /   ls -a            list the folder (-a: including hidden items)\n  cd <folder>               go into a folder (cd .. to go back up)\n  pwd                       show the folder you're in\n  cat <file>                show a file (cat *.frag: all the .frag files)\n  echo <text>               write some text\n  rev                       write each line backwards\n  sort                      sort the lines (sort -n: as numbers)\n  grep <word>               keep the lines that contain a word\n  unlock <password>         open a sealed folder\n  light-star <spell>        speak the final spell\n  clear                     clear the screen\nThe pipe | sends the result of one command to the next. Example:  echo hello | rev\nTips: Tab completes names, ↑ and ↓ bring back previous commands.",
    systeme: ['NOËL-OS v24.12 — “{u}” is logging in…', '⚠ ALERT: user “kryos” has taken control of the system.'],
    kryosIntro: ['Well, well… {u}, the famous Saviour of Christmas. Welcome to MY system.', "Your precious fragments? Under lock and key, in /glacier. And you'll NEVER find the key."],
    invitation: 'The elves left you a message. Type:  cat readme.txt',
    verrouille: '🔒 Access denied: /glacier is sealed by kryos. Use:  unlock <password>',
    usageDeverrouiller: 'Usage:  unlock <password>',
    dejaOuvert: 'The glacier is already open.',
    mauvaisMdp: '❌ Wrong password.',
    kryosMauvaisMdp: ["Wrong! Do you really think I'd use such a silly password?", 'Hahaha! Again! Again! I love watching you fail.', "No. And you won't find it by typing at random, little elf."],
    ouvert: '🔓 /glacier unlocked!',
    kryosRiposte: ['WHAT?! You read my diary?! NOBODY reads my diary!', "Very well. If I can't keep the fragments… NOBODY will have them.  rm /glacier/*"],
    suppression: 'rm: removing “{f}”',
    kryosRire: 'No fragments, no spell, no Christmas! MWAHAHAHA!',
    lutinsSecours: ["Psst… don't panic! We elves make BACKUPS of everything.", "It's hidden in /glacier. You know how to see hidden things… 😉"],
    kryosFouille: 'Hey! Who said you could snoop around my place? Get out of there!',
    kryosJournal: "MY DIARY! Close that right now! I'm freezing your screen!",
    gel: '❄ Terminal frozen by kryos ❄',
    kryosApresGel: "… Right. You didn't see anything. And anyway, you won't understand a thing.",
    kryosOrdre: "No… no no no… Don't do that. Don't speak that spell!",
    lutinsTriNombres: 'Almost! Without -n, sort puts “10” before “2”, like in a dictionary. Try sort -n.',
    usageEtoile: 'Usage:  light-star <the spell>',
    prononce: '✨ You speak the spell: “{f}”…',
    kryosMauvaiseFormule: ['Hahaha! Nothing happens. Your Latin is as frozen as my heart.', 'Wrong! The star stays dark. It belongs to ME.', 'Not even a little twinkle. Pathetic.'],
    kryosFin: ['NOOOOO! That light… it… it burns!', 'Savor your victory, mortal. Every winter, when the frost bites at your windows… remember me. I WILL RETURN.'],
    victoire: ['☀ The spell echoes through the whole chalet.', '☀ NOËL-OS is thawing: system restored, user kryos deleted.', '⭐ The star on the tree lights up again!'],
    kryosSudo: "sudo? Around here, the only administrator is ME.",
    kryosRm: "rm? That's MY favourite command. Hands off.",
    kryosKill: "Delete me? With a command? I'm immortal, little elf.",
    kryosExit: "Leaving? But we're having so much fun together…",
    kryosAttente: ['Well? Are you asleep? The hot chocolate is getting cold… oh no, I froze it.', "Tick-tock… Christmas is coming… and you're just standing there.", 'Want a hint? Give up. That\'s my only advice.', "I'm getting bored. A thousand years in a glacier was more exciting."],
  }),
  reponses: ['22cbd35071bff0460b8fdd2c952cf7f9d3e2d7ca2fbc10d1dde07b318b647124'],
  sansChamp: true,
  indices: [
    "The password is in Kryos's SECRET diary: cd /home/kryos then ls -a to see it. The glacier's name is engraved on one of his trophies; write it backwards (for example: echo niflheim | rev).",
    "After Kryos's rm: cd /glacier then ls -a to find the elves' backup. Inside: cat *.frag | sort -n, then read the letters from top to bottom. 4 Latin words, and the first one means “light”.",
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
<p>For this final duel, you searched hidden files (day 22), read backwards with <code>rev</code>, recovered a <b>backup</b> (the best weapon against a hacker who deletes everything!) and sorted data with <code>sort</code>, sending it through a pipe. In 24 days, here is everything you discovered:</p>
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
