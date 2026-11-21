/* =========================================================
   NOËL-OS — Les 24 énigmes (fichier SERVEUR, jamais envoyé tel quel)

   Ce que le navigateur reçoit, et quand :
     - à partir du jour J : univers, histoire, énigme, mini-jeu ;
     - indice par indice, sur demande : « indices » ;
     - seulement après une bonne réponse : « lecon », « apresReussite »
       et « fragment ».
   « reponses » ne quitte jamais le serveur. Ce sont des empreintes
   SHA-256 : pour en changer une, lance
       npm run empreinte -- 3 "ma nouvelle réponse"
   Les mini-jeux sont vérifiés dans serveur/verification.js.

   piece      : la décoration de la pièce du chalet (voir public/js/decors.js)
                murs, sol, 3 éléments au fond, un meuble et ses objets
   particules : ce qui flotte dans la pièce
   ========================================================= */

// W.nom(…) décrit un mini-jeu du navigateur (public/js/widgets.js)
// sous la forme { type: 'nom', params: [...] }.
const W = new Proxy({}, { get: (_, type) => (...params) => ({ type, params }) });

const JOURS = [

/* ======================= JOUR 1 ======================= */
{
  jour: 1,
  piece: {"mur":"#6b3f1f","motif":"bois","sol":"parquet","elements":["fenetre","etageres:🧸🚂🪀","tableau"],"meuble":"etabli","objets":["🔨","🪚","💡"]},
  particules: ['⚙️', '🔨', '✨'],
  univers: "L'Atelier des Lutins",
  emoji: '🔨',
  couleurs: ['#6b2f12', '#c0612b'],
  concept: 'Le binaire',
  givrin: {
    ricane: "J'ai fait fondre toute une bande de bonshommes de neige cette nuit. Toi, je te garde pour le petit-déjeuner.",
    piques: [
      "Raté ! Je grave ton échec sur la porte, juste à côté de mes bonshommes fondus.",
      "Encore faux. À ce rythme, tu ouvriras cette porte… à Pâques.",
      "Continue de tripoter mes ampoules, ça me réchauffe le cœur. Enfin, façon de parler : je n'en ai pas.",
    ],
    fuite: "Mes ampoules brillent… je fonds ! Dites aux bonshommes de neige que je suis désolée. Non, je plaisante.",
  },
  chrono: 900,
  histoire: `<p>Ce matin, impossible d'entrer dans l'atelier : une <b>Kère</b> de Kryos a remplacé la serrure par une <b>guirlande de 8 ampoules</b>, et elle a gravé un nombre en binaire sur la porte, du bout de ses griffes de glace.</p>`,
  cours: `<p>Pour écrire nos nombres, on utilise <b>10 chiffres</b> (de 0 à 9), et la <b>place</b> d'un chiffre change sa valeur. Dans <code>352</code>, le 3 vaut 300, le 5 vaut 50 et le 2 vaut 2 : chaque place vaut <b>10 fois</b> plus que celle de sa droite.</p>
<p>Un ordinateur, lui, est rempli de minuscules interrupteurs qui n'ont que deux positions : <b>allumé</b> ou <b>éteint</b>. Il écrit donc tout avec seulement <b>deux chiffres</b> : <b>1</b> pour allumé, <b>0</b> pour éteint. C'est le <b>binaire</b>.</p>
<p>Avec deux chiffres seulement, chaque place vaut <b>2 fois</b> plus que celle de sa droite : 1, 2, 4, 8, 16, 32, 64, 128. Pour lire un nombre binaire, il suffit d'<b>additionner les places où il y a un 1</b> :</p>
<div class="defilement"><table class="tableau compact">
<tr><th>128</th><th>64</th><th>32</th><th>16</th><th>8</th><th>4</th><th>2</th><th>1</th><th>Total</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td class="allume">1</td><td>0</td><td class="allume">1</td><td>4 + 1 = <b>5</b></td></tr>
<tr><td class="allume">1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td><b>128</b></td></tr>
<tr><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td class="allume">1</td><td><b>255</b></td></tr>
</table></div>
<p>Pourquoi <code>10000000</code> vaut 128 ? Parce que seule la place qui vaut 128 est allumée. Et <code>11111111</code> = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = <b>255</b> : c'est le plus grand nombre qu'on peut écrire avec 8 places.</p>
<p class="petit">💡 Pourquoi justement le double ? Si tu allumes toutes les places à droite d'une place, tu obtiens toujours 1 de moins qu'elle (1 + 2 + 4 = 7, juste avant 8). Ainsi, chaque nombre de 0 à 255 s'écrit d'<b>une seule</b> façon, sans trou ni doublon.</p>`,
  enigme: `<p>Sur la porte de l'atelier, la Kère a épinglé ce mot :</p>
<blockquote class="note">« Cette nuit, j'ai fait fondre des bonshommes de neige. Leur nombre est gravé sur la porte, en binaire bien sûr : <code class="gros">0 0 0 1 0 0 0 1</code><br>Pour ouvrir, allume ce nombre <b>plus</b> le nombre de cases du calendrier de l'Avent de ce chalet. Bonne chance… tu en auras besoin. » <br><i>— La Kère de l'atelier</i></blockquote>
<p>Clique sur les ampoules pour les allumer ou les éteindre, puis essaie d'ouvrir la porte.</p>`,
  widget: W.ampoules(),
  indices: [
    "D'abord, lis le nombre gravé : additionne les places où il y a un 1 (regarde le tableau du petit cours). Ensuite, compte les cases du calendrier de l'Avent : ce sont les cases de la façade du chalet.",
    "0 0 0 1 0 0 0 1 = 16 + 1 = 17 bonshommes de neige. Le calendrier de l'Avent a 24 cases : 17 + 24 = 41. Écris 41 avec les ampoules, en commençant par la plus grande qui ne dépasse pas.",
  ],
  lecon: `<p>Bravo ! Il fallait d'abord <b>lire</b> du binaire, puis en <b>écrire</b> :</p>
<div class="schema"><code>0 0 0 1 0 0 0 1</code> = 16 + 1 = <b>17</b> bonshommes fondus<br>17 + 24 cases = <b>41</b><br><code>0 0 1 0 1 0 0 1</code> = 32 + 8 + 1 = <b>41</b></div>
<p>Chaque 0 ou 1 s'appelle un <b>bit</b> (de l'anglais <i>binary digit</i>, « chiffre binaire »). 8 bits forment un <b>octet</b>, qui peut représenter 256 valeurs (de 0 à 255). Dans un ordinateur, <b>tout</b> est fait de bits : les textes, les photos, la musique, les vidéos… Tu vas le voir dans les prochaines pièces !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Une photo de téléphone pèse environ 3 Mo, soit à peu près <b>24 millions de bits</b> : 24 millions d'ampoules !</li>
<li>Le « Go » de ton forfait mobile, c'est un milliard d'octets.</li>
</ul>`,
  fragment: [15, '01001001'],
},

/* ======================= JOUR 2 ======================= */
{
  jour: 2,
  piece: {"mur":"#2c4a73","motif":"rayures","sol":"parquet","elements":["casiers","fenetre","horloge"],"meuble":"comptoir","objets":["✉️","📦","📮"]},
  particules: ['✉️', '❄️', '✉️'],
  univers: "Le Bureau du Courrier",
  emoji: '✉️',
  couleurs: ['#1e3a5f', '#3b6ea5'],
  concept: "L'encodage des caractères (ASCII)",
  givrin: {
    ricane: "J'ai transformé tout le courrier en 0 et en 1. Cette année, les enfants recevront des factures d'électricité.",
    piques: [
      "Non. Même le facteur congelé dans la cour aurait trouvé.",
      "Faux ! Je renvoie ta réponse à l'expéditeur. C'est-à-dire toi.",
      "Tu lis le binaire comme je lis les cartes de vœux : en les déchirant.",
    ],
    fuite: "Mon beau courrier binaire… lu par un humain ?! Je me colle un timbre et je m'expédie très, très loin !",
  },
  chrono: 900,
  histoire: `<p>Au Bureau du Courrier du chalet, la Kère a soufflé sur l'imprimante à étiquettes. Gelée jusqu'aux circuits, elle n'imprime plus de lettres… seulement des <b>0</b> et des <b>1</b> !</p>`,
  cours: `<p>Tu l'as vu au jour 1 : un ordinateur ne sait garder que des <b>nombres</b> (écrits en binaire). Alors comment fait-il pour retenir des lettres, comme ton prénom ?</p>
<p>C'est simple : on s'est mis d'accord, dans le monde entier, sur un grand <b>tableau de correspondance</b> où chaque caractère reçoit un numéro. Quand tu tapes une lettre, l'ordinateur range son numéro. Quand il doit l'afficher, il cherche ce numéro dans le tableau et dessine la lettre qui va avec.</p>
<p>C'est comme un code secret de cour de récré où A = 1, B = 2, C = 3… avec une différence : dans le tableau des ordinateurs, les premiers numéros sont déjà pris par d'autres signes (l'espace, la ponctuation, les chiffres…). Les lettres commencent donc un peu plus loin, mais elles se suivent toujours dans l'ordre de l'alphabet.</p>
<p>Et dans la mémoire, chaque numéro est rangé… en binaire, bien sûr, sur 8 ampoules (un <b>octet</b>), comme au jour 1. Par exemple, le numéro 5 s'y écrit <code>00000101</code> (4 + 1).</p>`,
  enigme: `<p>Il faut absolument savoir quel cadeau se cache dans ce colis. Voici son étiquette :</p>
<div class="etiquette-colis binaire">01010010 · 01001111 · 01000010 · 01001111 · 01010100</div>
<p>Sur le côté de l'imprimante, un autocollant à moitié arraché par la Kère indique :</p>
<div class="schema"><code>A = 65 = 01000001</code></div>
<p>Quel est le cadeau ?</p>`,
  reponses: ['1746b0affbe4a8883e44fede0b5d3f7c691c0f93de62516a959119a7466583e2', '363f0118362bc2065d10f66edfd019c3308903b9e1f9330ad9ab2bd14d8499e6'],
  placeholder: 'Le cadeau…',
  indices: [
    "Transforme chaque groupe de 8 chiffres en nombre, comme les ampoules du jour 1 (128, 64, 32, 16, 8, 4, 2, 1). Puis cherche la lettre qui va avec : A = 65, B = 66, C = 67…",
    "01010010 = 64 + 16 + 2 = 82, et 82 − 65 = 17 : c'est la lettre qui vient 17 places après le A, la 18ᵉ de l'alphabet. Astuce : tous les groupes commencent par 010, qui vaut 64 ; seuls les 5 derniers chiffres changent.",
  ],
  lecon: `<p>Il fallait décoder <b>deux fois</b> : le binaire en nombres (82, 79, 66, 79, 84), puis les nombres en lettres : <b>ROBOT</b>.</p>
<p>As-tu remarqué que tous les groupes commençaient par <code>010</code> ? Les majuscules vont de 65 à 90 : elles commencent toutes par 010, et les 5 derniers chiffres donnent directement leur place dans l'alphabet (R = <code>10010</code> = 18, la 18ᵉ lettre). Les inventeurs du tableau l'ont fait exprès !</p>
<p>Ce tableau qui donne un <b>numéro à chaque caractère</b> s'appelle un <b>encodage</b>. Le plus célèbre, l'<b>ASCII</b> (1963), contient 128 caractères : <code>A</code> = 65, <code>a</code> = 97, l'espace = 32, le chiffre <code>0</code> = 48…</p>
<p>Problème : l'ASCII a été inventé pour l'anglais. Pas de « é », pas de « ç », et encore moins d'emojis ! Aujourd'hui, on utilise <b>Unicode</b>, qui numérote près de <b>160 000 caractères</b> de toutes les langues du monde. Le sapin 🎄 porte le numéro <code>U+1F384</code>.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Si tu vois « NoÃ«l » au lieu de « Noël » sur un site, c'est un bug d'encodage : l'ordinateur a lu les numéros avec le mauvais tableau !</li>
<li>Quand tu envoies un emoji, ton téléphone n'envoie qu'un numéro : c'est le téléphone de ton ami qui dessine l'image. C'est pour ça qu'un même emoji n'a pas le même look sur iPhone et sur Android.</li>
</ul>
<h4>🧪 Essaie toi-même</h4>`,
  apresReussite: W.terrainAscii(),
  fragment: [22, '01001001'],
},

/* ======================= JOUR 3 ======================= */
{
  jour: 3,
  piece: {"mur":"#5b4636","motif":"bois","sol":"parquet","elements":["malles","lucarne","etageres:📜🕯️📜"],"meuble":"bureau","objets":["📜","🪶","🕯️"]},
  particules: ['📜', '✒️', '❄️'],
  univers: "Le Grenier aux Lettres",
  emoji: '📜',
  couleurs: ['#3d2352', '#7b4f9d'],
  concept: 'Le chiffrement (code de César)',
  givrin: {
    ricane: "Deux clés, une lettre d'enfant, zéro espoir. J'adore les vœux qui ne se réalisent jamais.",
    piques: [
      "Faux. Ce gamin recevra des chaussettes. Par ta faute.",
      "Tourne, tourne mes jolies roues… et tourne en rond.",
      "Même César abandonnerait. Remarque, lui, il a fini poignardé : il avait l'habitude des mauvaises surprises.",
    ],
    fuite: "Mes deux clés, brisées comme du verre ! Je file à la cave chiffrer mon testament.",
  },
  chrono: 900,
  histoire: `<p>Dans le Grenier aux Lettres, entre deux vieilles malles, on a retrouvé la lettre d'un enfant… mais la <b>Kère</b> du grenier l'a <b>chiffrée</b>. Elle connaît le code de César, et elle sait qu'il se casse en 25 essais. Alors elle a été plus maligne : elle a utilisé <b>deux clés</b>, à tour de rôle !</p>`,
  cours: `<p><b>Chiffrer</b> un message, c'est le transformer pour que seuls ceux qui connaissent le secret puissent le relire. Ce secret s'appelle la <b>clé</b>.</p>
<p>La méthode de la Kère est l'une des plus anciennes : on fait avancer chaque lettre dans l'alphabet du même nombre de crans. Avec une clé de 3 :</p>
<div class="schema"><code>A → D &nbsp; B → E &nbsp; C → F &nbsp; … &nbsp; X → A &nbsp; Y → B &nbsp; Z → C</code></div>
<p>Arrivé au Z, on repart au début de l'alphabet, comme sur une <b>roue</b>. Avec cette clé, <code>NOEL</code> devient <code>QRHO</code>.</p>
<p>Pour <b>déchiffrer</b>, on fait le chemin inverse : on recule chaque lettre du même nombre de crans.</p>
<p>Une Kère maligne peut aussi utiliser <b>deux clés</b> à tour de rôle : la 1ʳᵉ lettre avec la première clé, la 2ᵉ avec la seconde, la 3ᵉ de nouveau avec la première… (on ne compte que les lettres). Avec les clés 1 et 2, <code>NOEL</code> devient <code>OQFN</code>. Pour déchiffrer, il faut retrouver les <b>deux</b> clés… et cette fois, tu ne les connais pas.</p>`,
  enigme: `<p>La 1ʳᵉ lettre a été décalée avec la <b>clé dorée</b>, la 2ᵉ avec la <b>clé argentée</b>, la 3ᵉ de nouveau avec la dorée, et ainsi de suite (on ne compte que les lettres, pas les espaces ni la ponctuation).</p>
<p>Règle les deux roues pour retrouver le message. <b>Quel cadeau l'enfant a-t-il demandé ?</b></p>`,
  widget: W.cesar('KGMQ XDZD VNMK, KDBSM ZVMMD RD DNCCZZQR CMM FCHBZZD MKMBBQQPCD XNCQ RNCDZ CC QWBS CIMA LI BPZUAZD. UDZBQ ! KWT', 2),
  reponses: ['8c7d9ed08f8a5ac97b1a43e480c52dc8fde6f010858680f3fccf0a3914a7bf51', 'd92902f496b0162d259e8ec84265b39d66cdd357827b0d5c8c01432b9dc2b3bd', '723c64647a2ecb32dcc93edbfaf34cdde384d13f6a197053d6da5aba50569227', '69e4c83b0f7ecf172e9b01696f844e03d99a96197060febd8567624c2b89930c'],
  placeholder: 'Le cadeau demandé…',
  indices: [
    "Une roue à la fois : règle la roue dorée jusqu'à ce que les lettres dorées du début aient l'air françaises, sans t'occuper des argentées. Puis fais pareil avec la roue argentée.",
    "Toutes les lettres au Père Noël commencent par « CHER PÈRE NOËL » ! La 1ʳᵉ lettre chiffrée, K, doit redevenir C (roue dorée) ; la 2ᵉ, G, doit redevenir H (roue argentée).",
  ],
  lecon: `<p>Les clés étaient <b>8</b> (comme les rennes du traîneau) pour les lettres dorées et <b>25</b> pour les argentées. Chiffrer avec plusieurs clés à tour de rôle, c'est le principe du <b>chiffre de Vigenère</b> (1586), surnommé pendant près de 300 ans « le chiffre indéchiffrable » !</p>
<p>Avec une seule clé, il n'y a que 25 essais. Avec deux, il y en a 25 × 25 = <b>625</b>. Et avec une clé de 10 lettres, près de <b>100 000 milliards</b> : bien trop pour tout essayer à la main.</p>
<h4>🕵️ Comment l'as-tu cassé ?</h4>
<p>Grâce à une erreur de la Kère : toutes les lettres au Père Noël commencent par « CHER PÈRE NOËL ». Connaître un morceau du message permet de retrouver les clés une par une : c'est une <b>attaque par texte connu</b>. C'est ainsi qu'Alan Turing et son équipe ont cassé la machine allemande <b>Enigma</b> pendant la Seconde Guerre mondiale : beaucoup de messages commençaient par le bulletin météo !</p>
<p>Les chiffrements modernes (comme <b>AES</b>, qui protège tes messages et tes paiements) résistent à ce genre d'attaque, avec des clés à 2<sup>256</sup> possibilités : un nombre de 78 chiffres.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Le petit cadenas 🔒 à côté de l'adresse d'un site signifie que la connexion est chiffrée.</li>
<li>Les messageries comme Signal ou WhatsApp chiffrent tes messages « de bout en bout » : même l'entreprise ne peut pas les lire.</li>
</ul>`,
  fragment: [18, '01010110'],
},

/* ======================= JOUR 4 ======================= */
{
  jour: 4,
  piece: {"mur":"#e9dcc0","motif":"papier","sol":"parquet","elements":["tableau","fenetre","etageres:🔴🟡🔵"],"meuble":"table","objets":["🎨","🖌️","🎄"]},
  particules: ['🎨', '✨', '🖌️'],
  univers: "L'Atelier de Peinture",
  emoji: '🎨',
  couleurs: ['#7a1631', '#d6336c'],
  concept: 'Les pixels et les couleurs (RVB, hexadécimal)',
  givrin: {
    ricane: "J'ai passé la machine en négatif. Ton sapin sortira rose bonbon, et ta neige… noire comme mon âme.",
    piques: [
      "Raté ! Encore une boule fichue : je la garde pour ma collection d'horreurs.",
      "Tu mélanges les couleurs comme un lutin daltonien. Remarque, ils sont tous congelés : ils ne voient plus rien.",
      "Cette couleur s'appelle « gris défaite ». Très tendance cette année.",
    ],
    fuite: "Trop de couleurs ! Mes yeux ! Je retourne dans la nuit polaire, au moins elle est noire…",
  },
  chrono: 900,
  histoire: `<p>Dans l'Atelier de Peinture, la Kère a trafiqué la machine qui peint les boules du sapin : maintenant, elle peint tout <b>en négatif</b> ! Chaque lampe fait l'inverse de ce qu'on lui demande.</p>`,
  cours: `<p>Regarde ton écran de très près (avec une loupe, c'est encore mieux) : il est fait de millions de petits points, les <b>pixels</b>. Chaque pixel contient <b>3 minuscules lampes</b> : une <span class="r">rouge</span>, une <span class="g">verte</span> et une <span class="b">bleue</span>. En réglant la force de chacune, l'écran fabrique toutes les couleurs.</p>
<p>⚠️ Ici, on mélange de la <b>lumière</b>, pas de la peinture : les règles ne sont pas celles des pots de gouache ! Par exemple, les 3 lampes à fond donnent du <b>blanc</b>, et les 3 lampes éteintes donnent du <b>noir</b>.</p>
<p>Pour régler chaque lampe, l'ordinateur utilise 2 caractères écrits en <b>hexadécimal</b> : une façon de compter avec <b>16 chiffres</b> au lieu de 10. Après le 9, comme il n'existe plus de chiffre, on continue avec des lettres :</p>
<div class="schema"><code>0 1 2 3 4 5 6 7 8 9 A B C D E F</code><br><span class="petit">A vaut 10, B vaut 11… et F vaut 15</span></div>
<p>Pas besoin de calculer : retiens que <code>00</code> = lampe <b>éteinte</b>, <code>80</code> = lampe <b>à moitié</b> et <code>FF</code> = lampe <b>à fond</b> (c'est le plus grand nombre à 2 caractères, comme 99 pour nous).</p>
<p><b>Retirer une paire de FF</b> est très simple : remplace chaque chiffre par « F moins ce chiffre », en comptant sur la liste ci-dessus. Exemple : FF − <code>3A</code> = <code>C5</code>, car F − 3 = C (15 − 3 = 12) et F − A = 5 (15 − 10 = 5).</p>
<p>Un code couleur colle les réglages des 3 lampes, toujours dans l'ordre <span class="r">rouge</span>, <span class="g">vert</span>, <span class="b">bleu</span>. Exemple : <code>#0000FF</code> = rouge éteint, vert éteint, bleu à fond → du bleu pur.</p>`,
  enigme: `<p>Les lutins avaient laissé une notice… que la Kère a complétée :</p>
<div class="note">
<p>📘 <b>Notice de la machine</b></p>
<p>Un code couleur = <b>3 paires</b> de caractères : <span class="r">Rouge</span>, <span class="g">Vert</span>, <span class="b">Bleu</span>. Chaque paire va de <code>00</code> (lumière éteinte) à <code>FF</code> (lumière à fond). La machine mélange de la <b>lumière</b>, pas de la peinture.</p>
<p>✏️ <i>Nouveau réglage : chaque paire est inversée. La machine peint <b>FF moins</b> ce que tu tapes. Tu tapes <code>00</code> → elle peint <code>FF</code>. Tu tapes <code>FF</code> → elle peint <code>00</code>. Bisous glacés. — La Kère</i></p>
</div>
<p>Commande urgente : une boule <b>ORANGE</b> pour le sapin, c'est-à-dire <span class="r">rouge à fond</span>, <span class="g">vert à moitié</span> (<code>80</code>) et <span class="b">bleu éteint</span>. Quel code faut-il taper pour que la machine la peigne vraiment ?</p>`,
  widget: W.couleur(true),
  reponses: ['11d9c66df32acc61307a1733c8b7894db9469a3f448a585da7510f6b334496c2'],
  placeholder: '#RRVVBB',
  indices: [
    "Écris d'abord le code de l'orange voulu (rouge FF, vert 80, bleu 00), puis inverse chaque paire. Vérifie avec la boule d'essai : elle montre ce que la machine peint vraiment.",
    "Pour inverser une paire, remplace chaque chiffre par F moins ce chiffre : F → 0, 8 → 7, 0 → F. Donc FF → 00, 80 → 7F, 00 → FF.",
  ],
  lecon: `<p>Il fallait taper <code>#007FFF</code> : la machine trafiquée peint FF − 00 = <span class="r">FF</span>, FF − 7F = <span class="g">80</span> et FF − FF = <span class="b">00</span>… c'est-à-dire l'orange <code>#FF8000</code> commandé !</p>
<p>L'inverse d'une couleur s'appelle son <b>négatif</b>, comme sur les vieilles pellicules photo : l'orange devient bleu ciel, le vert devient rose. Tous les logiciels de dessin ont un bouton « Inverser les couleurs » qui fait exactement ce calcul.</p>
<p>En mélangeant de la lumière, rouge + vert = <b>jaune</b>, et rouge + un peu de vert = <b>orange</b> ! (Avec de la peinture, ça ferait plutôt du marron : on parle de synthèse <i>additive</i> pour la lumière et <i>soustractive</i> pour la peinture.) Ce système à 3 lampes s'appelle le <b>RVB</b> (<i>RGB</i> en anglais).</p>
<p>Chaque lampe a 256 niveaux (un octet, comme au jour 1 !). En hexadécimal, le premier caractère compte les « paquets de 16 » : <code>FF</code> = 15 × 16 + 15 = <b>255</b>, <code>80</code> = 8 × 16 = 128 et <code>7F</code> = 7 × 16 + 15 = 127. Et 128 + 127 = 255 : une paire et son négatif font toujours FF.</p>
<p>256 × 256 × 256 = <b>16 777 216</b> couleurs possibles !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Tous les sites web utilisent ces codes : le doré de l'étoile de cette page s'écrit <code>#F5C542</code> dans son code.</li>
<li>Approche une loupe (ou une goutte d'eau) d'un écran : tu verras les petites lumières rouges, vertes et bleues !</li>
</ul>`,
  fragment: [2, '01010101'],
},

/* ======================= JOUR 5 ======================= */
{
  jour: 5,
  piece: {"mur":"#3a3f47","motif":"pierre","sol":"pierre","elements":["caisses","panneau","caisses"],"meuble":null,"objets":[]},
  particules: ['⚡', '✨', '🔒'],
  univers: "La Réserve aux Jouets",
  emoji: '🔒',
  couleurs: ['#22292f', '#5a6872'],
  concept: 'La logique et les portes logiques',
  givrin: {
    ricane: "Cinq interrupteurs, un circuit, et moi au milieu. Touche le mauvais fil, et on rira. Surtout moi.",
    piques: [
      "Bzzzt ! Raté. Tu sens cette odeur de grillé ? C'est ton raisonnement.",
      "NON, NON et encore NON. C'est ma porte logique préférée.",
      "Continue d'essayer au hasard. Un singe y arriverait aussi… en quelques millions d'années.",
    ],
    fuite: "Le courant passe ?! Arrête, ça chatouille… ça grésille… je disjoncte !",
  },
  chrono: 900,
  histoire: `<p>Au sous-sol, la porte blindée de la Réserve aux Jouets est protégée par un <b>circuit électronique</b>. La Kère l'a recâblé : désormais, <b>cinq interrupteurs</b> (A à E) envoient du courant dans <b>cinq portes logiques</b>. Il faut que les cinq s'allument en même temps pour que l'étoile s'éclaire et que la porte s'ouvre.</p>`,
  cours: `<p>Pour prendre ses décisions, un ordinateur utilise des milliards de <b>portes logiques</b>. Une porte logique reçoit un ou deux signaux, chacun <b>allumé (1)</b> ou <b>éteint (0)</b>, et n'en laisse sortir qu'un seul, selon une règle très simple. Tu utilises déjà ces règles tous les jours sans le savoir :</p>
<div class="defilement"><table class="tableau">
<tr><th>Porte</th><th>Elle s'allume si…</th><th>Dans la vie</th></tr>
<tr><td><b>ET</b></td><td class="gauche">les <b>deux</b> entrées sont allumées</td><td class="gauche">J'ai mon ticket ET le bus est là → je monte.</td></tr>
<tr><td><b>OU</b></td><td class="gauche"><b>au moins une</b> entrée est allumée (ou les deux)</td><td class="gauche">On sonne à la porte de devant OU à celle de derrière → ça sonne.</td></tr>
<tr><td><b>NON</b></td><td class="gauche">son entrée est <b>éteinte</b> : elle fait l'inverse</td><td class="gauche">Il ne fait PAS jour → la veilleuse s'allume.</td></tr>
<tr><td><b>OU-EXCLUSIF</b></td><td class="gauche"><b>exactement une</b> des deux entrées est allumée (pas les deux)</td><td class="gauche">Au menu : fromage OU dessert, mais pas les deux !</td></tr>
</table></div>
<p>Comme en maths, on calcule d'abord ce qui est <b>entre parenthèses</b> : dans <code>(NON A) OU C</code>, on regarde d'abord NON A, puis on fait le OU avec C.</p>`,
  enigme: `<p>Trouve la <b>seule</b> position des interrupteurs qui allume les cinq portes. Il y a 32 positions possibles : <b>raisonne</b> au lieu de tout essayer, un vrai ingénieur lit son circuit ! Astuce : commence par la porte qui t'en dit le plus.</p>`,
  widget: W.portes(),
  indices: [
    "Commence par P2 : elle contient « NON D », donc D doit être éteint. Avec D éteint, que faut-il pour allumer P4 ?",
    "D = 0 oblige E = 1 (pour P4). P5 interdit alors A allumé : A = 0. Pour P2, il faut donc C = 1. Il ne reste que B, à régler grâce à P3.",
  ],
  lecon: `<p>La solution était <b>A = 0, B = 0, C = 1, D = 0, E = 1</b>… la seule sur les 32 positions possibles ! Le raisonnement : P2 impose D = 0 ; alors P4 exige E = 1 ; P5 interdit d'allumer A en même temps que E, donc A = 0 ; P2 réclame alors C = 1 ; enfin P3 veut B différent de C : B = 0.</p>
<p>Tu as fait comme un vrai ingénieur : partir de ce qui est <b>certain</b>, puis en tirer les conséquences une par une. C'est ce qu'on appelle une <b>déduction</b>.</p>
<p>Les portes ET, OU, NON s'appellent des <b>portes logiques</b>. Elles suivent l'<b>algèbre de Boole</b>, inventée par George Boole en 1854… presque 100 ans avant le premier ordinateur !</p>
<p>Dans un processeur, chaque porte est construite avec des <b>transistors</b> : de minuscules interrupteurs commandés par l'électricité. En combinant des portes, on fabrique un circuit qui additionne deux nombres binaires, puis une calculatrice, puis… un ordinateur entier.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Le processeur de ton téléphone contient <b>des milliards de transistors</b>, chacun plus petit qu'un virus.</li>
<li>Les mêmes mots servent pour chercher sur Internet ou dans une base de données : « chats ET chiens », « NON cher »…</li>
<li>Dans Minecraft, la « redstone » permet de construire de vraies portes logiques… et même des ordinateurs entiers !</li>
</ul>`,
  fragment: [11, '01000111'],
},

/* ======================= JOUR 6 ======================= */
{
  jour: 6,
  piece: {"mur":"#4a3b2f","motif":"briques","sol":"pierre","elements":["caisses","portail","etageres:🔧🪛🧰"],"meuble":null,"objets":[]},
  particules: ['🎁', '📦', '❄️'],
  univers: "Le Garage du Traîneau",
  emoji: '🎁',
  couleurs: ['#0b4d40', '#148f77'],
  concept: 'Les algorithmes de tri',
  givrin: {
    ricane: "J'ai siphonné le carburant du traîneau. Il en reste pile assez pour un génie. Pas pour toi.",
    piques: [
      "Panne sèche ! Le traîneau reste au garage et les enfants pleurent. Délicieux.",
      "Tu échanges les paquets comme on bat les cartes : au hasard, et en perdant.",
      "Encore en panne ! Je vais finir par te vendre du carburant… très, très cher.",
    ],
    fuite: "Tout est rangé et il reste du carburant ?! Je file, avant que tu me ranges dans un carton moi aussi !",
  },
  chrono: 900,
  histoire: `<p>Dans le Garage du Traîneau, les cadeaux doivent monter dans le traîneau <b>du plus léger au plus lourd</b>. Mais le tapis roulant est à moitié gelé : la seule chose possible est d'<b>échanger deux paquets voisins</b>. Et chaque échange consomme du précieux carburant de traîneau…</p>`,
  cours: `<p>Un <b>algorithme</b>, c'est une <b>méthode précise</b>, étape par étape, pour résoudre un problème. Une recette de cuisine ou la notice d'un meuble en kit sont des algorithmes !</p>
<p>Il existe souvent plusieurs méthodes pour arriver au même résultat… mais certaines sont bien plus rapides que d'autres. Les informaticiens cherchent donc toujours celle qui fait <b>le moins d'opérations possible</b>.</p>
<p>Ici, une seule opération est permise : <b>échanger deux paquets voisins</b>, avec le bouton <b>⇄</b> placé entre eux. Chaque échange coûte du carburant : réfléchis avant de cliquer !</p>`,
  enigme: `<p>Trie les paquets du plus léger (à gauche) au plus lourd (à droite) en <b>14 échanges maximum</b> : c'est le minimum possible, pas un de plus ! Attention : la Kère a glissé dans la rangée deux paquets qui pèsent <b>exactement le même poids</b>…</p>`,
  widget: W.tri([
    { emoji: '🧸', poids: 5 }, { emoji: '🎈', poids: 2 }, { emoji: '🚂', poids: 7 }, { emoji: '📚', poids: 3 },
    { emoji: '🛷', poids: 8 }, { emoji: '🎁', poids: 3 }, { emoji: '🪀', poids: 1 }, { emoji: '🎸', poids: 6 },
  ], 14),
  indices: [
    "Avant de cliquer, compte les paires dans le mauvais ordre (un paquet plus lourd placé quelque part à gauche d'un plus léger) : c'est le nombre minimum d'échanges. N'échange jamais deux paquets déjà bien rangés… ni deux paquets de même poids !",
    "Méthode du tri à bulles : parcours la rangée de gauche à droite et échange chaque paire où le plus lourd est à gauche. Le plus lourd « remonte » jusqu'au bout comme une bulle. Puis recommence, sans jamais échanger les deux paquets de 3 kg entre eux.",
  ],
  lecon: `<p>Tu viens d'appliquer le <b>tri à bulles</b> : les gros paquets « remontent » vers la droite comme des bulles dans une limonade.</p>
<p>Pourquoi 14 échanges ? Il y avait exactement 14 <b>inversions</b> : 14 paires de paquets dans le mauvais ordre (par exemple 5 kg placé avant 2 kg). Un échange entre voisins corrige au maximum une inversion : impossible de faire mieux !</p>
<p>Et les deux paquets de 3 kg ? Ils ne sont jamais « dans le mauvais ordre » l'un par rapport à l'autre : les échanger ne corrige aucune inversion. C'était le piège de la Kère : du carburant jeté par la fenêtre !</p>
<p>Le problème : pour 1 000 cadeaux, le tri à bulles peut demander près de <b>500 000 échanges</b>. Les informaticiens ont inventé des tris bien plus malins, comme le <b>tri fusion</b> : couper la pile en deux, trier chaque moitié, puis fusionner les deux. Pour 1 000 cadeaux : environ <b>10 000 opérations</b> seulement.</p>
<p>Compter combien d'opérations demande un algorithme, ça s'appelle étudier sa <b>complexité</b>. C'est l'une des grandes questions de l'informatique.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Trier est partout : les résultats d'un moteur de recherche, ton fil d'actualité, ta playlist, tes contacts…</li>
<li>Les algorithmes de tri sont si importants qu'on les étudie dans toutes les écoles d'informatique du monde.</li>
</ul>`,
  fragment: [23, '01010100'],
},

/* ======================= JOUR 7 ======================= */
{
  jour: 7,
  piece: {"mur":"#1d2b4f","motif":"bois","sol":"parquet","elements":["carte","telescope","fenetre"],"meuble":"bureau","objets":["📻","📡","☕"]},
  particules: ['⭐', '❄️', '🏠'],
  univers: "L'Observatoire",
  emoji: '🏠',
  couleurs: ['#4e342e', '#8d6e63'],
  concept: 'La recherche dichotomique',
  givrin: {
    ricane: "Un million de maisons, une seule cheminée qui attend, et le soleil qui se lève bientôt. J'adore les courses perdues d'avance.",
    piques: [
      "Raté ! Le cadeau finira chez un dentiste qui déteste Noël.",
      "Tu tires au hasard ? Moi aussi : sur les rennes, avec des glaçons.",
      "Le soleil se lève, la neige fond, et toi tu tournes en rond. C'est presque poétique.",
    ],
    fuite: "Trouvée en si peu d'essais ?! Tu coupes tout en deux… Je file avant que tu me coupes moi aussi !",
  },
  chrono: 900,
  histoire: `<p>Dans l'Observatoire, la radio grésille : la Kère a soufflé sur le GPS du traîneau ! Le Père Noël survole la plus longue rue du monde, l'Avenue des Cheminées : <b>un million de maisons</b>, numérotées de 1 à 1&#8239;000&#8239;000. Une seule attend son cadeau ce soir. La radio peut seulement te dire si la bonne maison a un numéro <b>plus grand</b> ou <b>plus petit</b> que celui que tu proposes.</p>`,
  cours: `<p>Tu connais sûrement le jeu du « plus grand, plus petit » : quelqu'un pense à un nombre, tu en proposes un, et il te répond « plus grand » ou « plus petit ».</p>
<p>La méthode la plus simple consiste à essayer les nombres un par un : 1, 2, 3… Elle finit toujours par marcher, mais avec un million de maisons, elle pourrait demander jusqu'à <b>un million d'essais</b> !</p>
<p>Avec 20 essais seulement, il faut être bien plus malin : chaque réponse doit te permettre d'<b>éliminer le plus de maisons possible</b> d'un coup. Avant chaque essai, demande-toi : « Quel numéro me fera éliminer le plus de maisons, quelle que soit la réponse ? »</p>
<p>Exemple avec 100 maisons : si tu proposes 10 et qu'on te répond « plus grand », tu n'as éliminé que 10 maisons. Si on te répond « plus petit », tu en as éliminé 90… mais tu ne peux pas compter sur la chance !</p>`,
  enigme: `<p>Trouve la bonne maison en <b>20 essais maximum</b>, avant le lever du soleil. À chaque partie, la maison change : la chance ne suffira pas, il te faut une <b>méthode</b>… et de la précision. 20 essais, c'est tout juste assez, à condition de n'en gâcher aucun !</p>`,
  widget: W.dichotomie(1000000, 20),
  indices: [
    "Commence par la maison 500 000 : quelle que soit la réponse, tu élimines la moitié des maisons d'un coup.",
    "Vise toujours le milieu EXACT des maisons encore possibles (la zone dorée) : (plus petit + plus grand) ÷ 2. Par exemple, s'il reste les maisons 500 001 à 1 000 000, essaie 750 000. Un essai « à peu près au milieu » peut te coûter la victoire !",
  ],
  lecon: `<p>En visant toujours le milieu, tu élimines <b>la moitié des maisons</b> à chaque essai :</p>
<div class="schema"><code>1&#8239;000&#8239;000 → 500&#8239;000 → 250&#8239;000 → 125&#8239;000 → 62&#8239;500 → 31&#8239;250 → 15&#8239;625 → 7&#8239;813 → 3&#8239;907 → 1&#8239;954 → 977 → 489 → 245 → 123 → 62 → 31 → 16 → 8 → 4 → 2 → 1</code></div>
<p>20 essais suffisent toujours, car 2<sup>20</sup> = 1&#8239;048&#8239;576, qui dépasse tout juste un million. Il n'y avait presque aucune marge : un seul essai mal placé, et le soleil se levait ! C'est la <b>recherche dichotomique</b> (« couper en deux »).</p>
<p>Le plus fou : pour <b>un milliard</b> de maisons, il ne faudrait que <b>30 essais</b>. En les essayant une par une, il en faudrait jusqu'à un milliard…</p>
<p>⚠️ Mais attention : ça ne marche que si les maisons sont <b>rangées dans l'ordre</b>. C'est pour ça que le tri (jour 6) est si important !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>C'est la méthode naturelle pour chercher un mot dans un dictionnaire papier.</li>
<li>Les bases de données retrouvent une information parmi des milliards en quelques millisecondes grâce à cette idée.</li>
<li>Les développeurs utilisent l'outil <code>git bisect</code> pour retrouver, par dichotomie, la modification qui a introduit un bug.</li>
</ul>`,
  fragment: [20, '01001110'],
},

/* ======================= JOUR 8 ======================= */
{
  jour: 8,
  piece: {"mur":"#6b4e2e","motif":"rayures","sol":"tapis","elements":["etageres:🧭📜🗺️","carte","horloge"],"meuble":"table","objets":["🗺️","🧭","📍"]},
  particules: ['🦌', '❄️', '⭐'],
  univers: "La Salle des Cartes",
  emoji: '🗺️',
  couleurs: ['#0d3b66', '#1d6fa3'],
  concept: 'Les graphes et le plus court chemin',
  givrin: {
    ricane: "Les rennes sont à bout de souffle. Un seul détour, et l'un d'eux finira en descente de lit.",
    piques: [
      "Trop long ! Rudolph vient de tomber en panne de nez.",
      "Ce trajet-là ? Même un pingouin perdu ferait mieux. Et les pingouins, ils vivent au pôle Sud.",
      "Encore un détour. Les rennes te maudissent en lapon.",
    ],
    fuite: "Le plus court chemin ? Je le prends… pour m'enfuir !",
  },
  chrono: 900,
  histoire: `<p>Dans la Salle des Cartes, la grande carte de la tournée est punaisée au mur. Le Père Noël doit livrer un cadeau urgent à la <b>Maison de Léa</b>. Sur la carte, chaque route indique son temps de vol en minutes. Les rennes sont à bout de forces : il faut absolument le trajet <b>le plus rapide</b>… et la Kère a tendu un fil rouge sur la carte pour te souffler un « raccourci ».</p>`,
  cours: `<p>Une carte comme celle-ci, avec des lieux reliés par des routes, les informaticiens l'appellent un <b>graphe</b>. Le Père Noël ne peut voler <b>que le long des routes dessinées</b>, et chaque route indique son temps de vol en minutes.</p>
<p>La durée d'un trajet, c'est la <b>somme</b> des temps de toutes les routes empruntées. Par exemple, si une route de 3 min va de la Ferme au Pont, puis une route de 4 min du Pont à l'Église, le trajet Ferme → Pont → Église dure 3 + 4 = <b>7 minutes</b>.</p>
<p>Pour trouver le trajet le plus rapide, il faut donc comparer les différents chemins possibles… sans en oublier !</p>`,
  enigme: `<p>Clique sur les lieux, un par un, pour tracer le trajet depuis le <b>Pôle Nord</b> jusqu'à la <b>Maison de Léa</b>. Le Père Noël n'acceptera que le trajet le plus court en temps. Ne te fie ni au nombre d'étapes, ni aux conseils de la Kère !</p>`,
  widget: W.graphe(
    {
      A: { nom: 'Pôle Nord', emoji: '🎅', x: 60, y: 190, dxNom: 6 },
      B: { nom: 'Lac Gelé', emoji: '🧊', x: 170, y: 70 },
      C: { nom: 'Forêt', emoji: '🌲', x: 170, y: 310 },
      D: { nom: 'Cabane du Trappeur', emoji: '🛖', x: 290, y: 190 },
      E: { nom: 'Village des Rennes', emoji: '🦌', x: 400, y: 335 },
      F: { nom: 'Moulin', emoji: '🌬️', x: 330, y: 60 },
      G: { nom: 'Mont Givré', emoji: '🏔️', x: 470, y: 70 },
      H: { nom: 'Pont de Glace', emoji: '🌉', x: 455, y: 220, dxNom: -38 },
      I: { nom: 'Maison de Léa', emoji: '🏡', x: 560, y: 170, dxNom: -16 },
    },
    [['A', 'B', 3], ['A', 'C', 4], ['A', 'D', 7], ['B', 'D', 3], ['B', 'F', 6], ['C', 'D', 4], ['C', 'E', 5], ['D', 'F', 2], ['D', 'H', 6], ['D', 'E', 2], ['E', 'H', 2], ['F', 'G', 3], ['G', 'I', 6], ['G', 'H', 2], ['H', 'I', 4], ['E', 'I', 9]],
    'A', 'I'
  ),
  indices: [
    "Le trajet avec le moins d'étapes n'est pas forcément le plus rapide… et le premier tronçon le plus court non plus ! Il faut comparer des trajets complets.",
    "Calcule pour chaque lieu le temps minimum depuis le Pôle Nord, en partant des lieux les plus proches. Exemple : la Cabane du Trappeur est à 7 min en direct… mais à 3 + 3 = 6 min par le Lac Gelé. Fais pareil pour le Village, puis le Pont, puis la Maison de Léa.",
  ],
  lecon: `<p>Le trajet le plus rapide était <b>Pôle Nord → Lac Gelé → Cabane du Trappeur → Village des Rennes → Pont de Glace → Maison de Léa</b> : 3 + 3 + 2 + 2 + 4 = <b>14 minutes</b>, en 5 étapes. Les pièges valaient tous une minute de plus ou davantage : tout droit vers la Cabane (7 + 2 + 2 + 4 = 15), par la Forêt et le Pont (4 + 5 + 2 + 4 = 15)… et le fil rouge de la Kère, par la Forêt et la route directe du Village : 4 + 5 + 9 = <b>18 minutes</b> !</p>
<p>Pour un informaticien, cette carte est un <b>graphe</b> : des <b>sommets</b> (les lieux) reliés par des <b>arêtes</b> (les routes), chacune avec un <b>poids</b> (la durée).</p>
<p>Pour trouver le plus court chemin, on utilise l'<b>algorithme de Dijkstra</b>. L'idée : partir du départ et calculer, de proche en proche, le temps minimum pour atteindre chaque lieu, en traitant toujours d'abord le lieu le plus proche. Edsger Dijkstra l'a imaginé en 1956… en 20 minutes, à la terrasse d'un café d'Amsterdam !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Ton GPS fait exactement ça, sur un graphe de millions de routes.</li>
<li>Sur Internet, les « routeurs » choisissent le chemin de tes données avec des algorithmes semblables.</li>
<li>Dans les jeux vidéo, les personnages trouvent leur chemin avec une variante appelée A* (« A étoile »).</li>
</ul>`,
  fragment: [17, '01001101'],
},

/* ======================= JOUR 9 ======================= */
{
  jour: 9,
  piece: {"mur":"#7fb8dd","motif":"glace","sol":"glace","elements":["glace","flocon","glace"],"meuble":null,"objets":[]},
  particules: ['❄️', '❅', '❆'],
  univers: "La Glacière",
  emoji: '❄️',
  couleurs: ['#1c4e80', '#5b9bd5'],
  concept: 'La récursivité',
  givrin: {
    ricane: "Un flocon dans un flocon dans un flocon… Ta cervelle va geler dès l'étape 2.",
    piques: [
      "Faux ! Tu viens de mesurer ton échec : il est infini.",
      "Recommence. Et recommence. Et recommence… Tu vois ? C'est ça, la récursivité.",
      "Même mon reflet dans mon reflet dans mon reflet se moque de toi.",
    ],
    fuite: "Tu as trouvé la sortie de ma boucle ?! Impossible… impossi… impo…",
  },
  chrono: 900,
  histoire: `<p>Tout au fond de la Glacière, le Maître des Flocons fabrique chaque flocon avec une seule règle magique, qu'il répète encore et encore…</p>`,
  cours: `<p>Un <b>segment</b>, c'est simplement un <b>trait droit</b> qui relie deux points. Un triangle, par exemple, est fait de 3 segments.</p>
<p>La règle du Maître ne s'applique pas qu'une fois : à chaque nouvelle étape, on l'applique à <b>tous</b> les segments du dessin, y compris ceux qui viennent d'être créés. Le dessin devient de plus en plus détaillé… avec toujours la même règle.</p>
<p>Une règle qui s'applique à son propre résultat, encore et encore, s'appelle une règle <b>récursive</b>. C'est comme deux miroirs face à face : l'image contient une image, qui contient une image…</p>
<p>Le Maître mesure aussi ses flocons. Quand on coupe un segment en 3 parts égales, chaque morceau est <b>3 fois plus court</b> : un segment de 30 cm donne des morceaux de 10 cm. Et la longueur totale d'un contour, c'est simplement le <b>nombre de segments × la longueur d'un segment</b> (s'ils ont tous la même).</p>
<p>Pour répondre, inutile de dessiner les étapes suivantes (il y aurait bien trop de traits !) : observe plutôt comment le <b>nombre</b> de segments et leur <b>longueur</b> changent d'une étape à la suivante.</p>`,
  enigme: `<div class="note">
<p>❄️ <b>La règle du Maître</b></p>
<p>« Prends chaque segment. Coupe-le en 3 parts égales. Remplace la part du milieu par une pointe faite de deux segments. »</p>
<p>À l'étape 0, le flocon n'est qu'un simple triangle, dont chaque côté mesure <b>243 cm</b>.</p>
</div>
<p>Observe les premières étapes avec le curseur. Pour décorer le sapin, le Maître veut poser un ruban doré tout le long du contour du flocon de l'<b>étape 4</b>. <b>Quelle longueur de ruban lui faut-il, en centimètres ?</b></p>`,
  widget: W.koch(4),
  reponses: ['6bf63f09896f65dab16105d6aff12f2a947c79bcd76082f32c16b6dda9abea79', 'ea874bb366254527ecc224b6c403e162cc188ec2abb96190b144db621393cdb7', 'd1ae83fef8653cd5fef25d76fb891d28576ed57a6015ef8db24f9ce0228cd0b2', '3053505e2ed70bb1cdbcc45def22bcaecbcfd02795466b8183d0a6708d132eb7'],
  placeholder: 'Longueur en cm',
  indices: [
    "Deux choses changent à chaque étape : le nombre de segments (chacun est remplacé par 4) et la longueur de chaque segment (3 fois plus court). Calcule les deux pour l'étape 4.",
    "Étape 4 : 3 × 4 × 4 × 4 × 4 = 768 segments. Chaque segment mesure 243 ÷ 3 ÷ 3 ÷ 3 ÷ 3 = 3 cm. Il ne reste qu'une multiplication !",
  ],
  lecon: `<p>À l'étape 4, le flocon a 3 × 4 × 4 × 4 × 4 = <b>768 segments</b>, et chacun mesure 243 ÷ 81 = <b>3 cm</b>. Il faut donc 768 × 3 = <b>2 304 cm</b> de ruban : plus de 23 mètres ! Le triangle de départ, lui, n'en demandait que 3 × 243 = 729 cm.</p>
<p>À chaque étape, le nombre de segments est multiplié par 4 et leur longueur divisée par 3 : le contour est donc multiplié par 4/3, soit un tiers de plus à chaque fois (729 → 972 → 1 296 → 1 728 → 2 304).</p>
<p>Ce flocon s'appelle le <b>flocon de Koch</b> (1904). Sa règle s'applique à elle-même : c'est la <b>récursivité</b>. En programmation, une fonction récursive est une fonction qui <b>s'appelle elle-même</b> sur un problème plus petit :</p>
<pre class="code">fonction dessinerSegment(segment, étape) :
    si étape == 0 :
        tracer le segment          ← condition d'arrêt !
    sinon :
        couper en 4 petits segments (avec la pointe)
        pour chaque petit segment :
            dessinerSegment(petit, étape − 1)</pre>
<p>La <b>condition d'arrêt</b> est essentielle : sans elle, la fonction s'appellerait à l'infini et le programme planterait.</p>
<p>Fait étonnant : si on continuait à l'infini, le flocon aurait un <b>périmètre infini</b>… mais une surface qui tient sur une feuille !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Les montagnes, nuages et arbres des films d'animation et des jeux vidéo sont souvent générés par des fractales récursives.</li>
<li>Pour chercher un fichier sur ton ordinateur, le programme explore un dossier, puis ses sous-dossiers, puis leurs sous-dossiers… récursivement !</li>
</ul>`,
  fragment: [4, '01000001'],
},

/* ======================= JOUR 10 ====================== */
{
  jour: 10,
  piece: {"mur":"#c98f5a","motif":"carreaux","sol":"carrelage","elements":["etageres:🍯🥫🧂","four","fenetre"],"meuble":"comptoir","objets":["🍪","🥛","🥣"]},
  particules: ['🍪', '✨', '🥛'],
  univers: "La Cuisine de Mère Noël",
  emoji: '🍪',
  couleurs: ['#8a4520', '#d39050'],
  concept: 'Variables, boucles et conditions',
  givrin: {
    ricane: "J'ai reprogrammé le robot-cuisinier. Il fait des sablés… et il en jette dès que ça m'amuse.",
    piques: [
      "Faux ! Le robot a brûlé la fournée. Et ta fierté avec.",
      "Tu as sauté une ligne. Les robots, eux, n'en sautent jamais. C'est pour ça qu'on les préfère.",
      "Encore raté. Je mange un sablé à ta santé. Il a un goût délicieux… le goût de ton échec.",
    ],
    fuite: "Ça sent le sablé chaud… Je foooonds !",
  },
  chrono: 1200,
  histoire: `<p>Dans la Cuisine de Mère Noël, le robot-cuisinier prépare les sablés en suivant un <b>programme</b>. Mais la Kère s'est glissée dans ses circuits et l'a réécrit… en prenant soin de se servir au passage.</p>`,
  cours: `<p>Un <b>programme</b>, c'est une liste d'instructions que l'ordinateur suit à la lettre, de haut en bas, sans jamais réfléchir à ta place. Pour lire celui du robot, il te faut connaître 4 choses.</p>
<p><b>1. La flèche <code>←</code></b> veut dire « range cette valeur dans la boîte ». <code>sablés</code> est une boîte (on dit une <b>variable</b>) qui contient un nombre. Exemple :</p>
<pre class="code">bonbons ← 10
bonbons ← bonbons + 5</pre>
<p>La boîte <code>bonbons</code> contient d'abord 10, puis 10 + 5 = <b>15</b>.</p>
<p><b>2. <code>TANT QUE</code></b> veut dire « répète les lignes <b>décalées</b> juste en dessous, tant que c'est vrai ». On vérifie la condition <b>avant chaque tour</b> : dès qu'elle est fausse, on arrête de répéter et on passe à la suite. Exemple :</p>
<pre class="code">bonbons ← 1
TANT QUE bonbons &lt; 10 :
    bonbons ← bonbons × 3
AFFICHER bonbons</pre>
<p>1 → 3 → 9 → 27. Après 27, la condition « 27 &lt; 10 » est fausse : la boucle s'arrête et le programme affiche <b>27</b> (pas 9 !).</p>
<p><b>3. <code>SI</code> … <code>SINON</code></b> veut dire « si c'est vrai, fais les lignes décalées sous SI ; sinon, fais celles sous SINON ». Une seule des deux est faite, jamais les deux. Un <code>SI</code> tout seul, sans <code>SINON</code>, ne fait rien quand c'est faux.</p>
<p><b>4. Petits rappels</b> : un nombre <b>pair</b> se partage en deux sans reste (2, 4, 6…), un nombre <b>impair</b> non (1, 3, 5…). Un <b>multiple de 4</b> est un nombre de la table de 4 : 4, 8, 12, 16, 20…</p>`,
  enigme: `<p>Voici le nouveau programme du robot-cuisinier :</p>
<pre class="code">sablés ← 3
tour ← 0
TANT QUE sablés &lt; 60 :
    tour ← tour + 1
    SI tour est impair :
        sablés ← sablés × 2
    SINON :
        sablés ← sablés + tour
    SI sablés multiple de 4 :
        sablés ← sablés − 5
AFFICHER sablés</pre>
<p class="petit">(Ce « − 5 », c'est la Kère qui chipe 5 sablés chaque fois que le compte tombe dans la table de 4.)</p>
<p><b>Quel nombre le robot affichera-t-il à la fin ?</b></p>
<p class="petit">Tu peux remplir ce tableau de suivi pour t'aider (c'est ton brouillon, il n'est pas corrigé).</p>`,
  widget: W.tableauSuivi(['tour', 'sablés après × 2 ou + tour', 'multiple de 4 ? (− 5)', 'sablés en fin de tour'], 10),
  reponses: ['579f9b6fccd619b99dcfcc21f07e9388776a9860e45a7802f41d766051f9b582'],
  placeholder: 'Nombre affiché',
  indices: [
    "Avance ligne par ligne, exactement comme le robot, et note tour et sablés à chaque passage. Au début : sablés = 3 et tour = 0. Vérifie la condition « sablés < 60 » avant chaque nouveau tour, jamais au milieu.",
    "Tour 1 (impair) : 3 × 2 = 6, pas dans la table de 4 → 6. Tour 2 (pair) : 6 + 2 = 8, multiple de 4 → 8 − 5 = 3. Tour 3 : 3 × 2 = 6. Tour 4 : 6 + 4 = 10… Continue jusqu'à ce que sablés atteigne 60 ou plus en fin de tour !",
  ],
  lecon: `<p>Le robot affiche <b>95</b>, après 9 tours :</p>
<div class="defilement"><table class="tableau"><tr><th>tour</th><th>× 2 ou + tour</th><th>table de 4 ?</th><th>sablés</th></tr>
<tr><td>1</td><td>6</td><td>non</td><td>6</td></tr><tr><td>2</td><td>8</td><td>oui (− 5)</td><td>3</td></tr>
<tr><td>3</td><td>6</td><td>non</td><td>6</td></tr><tr><td>4</td><td>10</td><td>non</td><td>10</td></tr>
<tr><td>5</td><td>20</td><td>oui (− 5)</td><td>15</td></tr><tr><td>6</td><td>21</td><td>non</td><td>21</td></tr>
<tr><td>7</td><td>42</td><td>non</td><td>42</td></tr><tr><td>8</td><td>50</td><td>non</td><td>50</td></tr>
<tr><td>9</td><td>100</td><td>oui (− 5)</td><td>95</td></tr></table></div>
<p>Le piège : au tour 9, on dépasse 60… mais la boucle ne s'arrête qu'au moment de <b>revérifier</b> la condition, après avoir fini tout le tour (y compris le vol de la Kère).</p>
<p>Tu viens d'utiliser les briques de base de <b>tous</b> les programmes :</p>
<ul>
<li>des <b>variables</b> (<code>sablés</code>, <code>tour</code>) : des boîtes avec une étiquette, dont le contenu change ;</li>
<li>une <b>boucle</b> (<code>TANT QUE</code>) : répéter des instructions tant qu'une condition est vraie ;</li>
<li>des <b>conditions</b> (<code>SI</code>, <code>SINON</code>) : faire des choix.</li>
</ul>
<p>Et tu as fait ce que font les développeurs pour comprendre un programme : le <b>tracer</b> à la main, étape par étape. Voici le même programme en <b>Python</b>, un vrai langage de programmation :</p>
<pre class="code">sables = 3
tour = 0
while sables &lt; 60:
    tour = tour + 1
    if tour % 2 == 1:
        sables = sables * 2
    else:
        sables = sables + tour
    if sables % 4 == 0:
        sables = sables - 5
print(sables)</pre>
<p class="petit"><code>%</code> donne le reste de la division : <code>tour % 2 == 1</code> veut dire « le reste de tour ÷ 2 vaut 1 », donc « tour est impair ».</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Une recette de cuisine est déjà un algorithme : des étapes, des répétitions (« remuer tant que ça colle »), des conditions (« si la pâte est trop sèche, ajouter du lait, sinon… »).</li>
<li>Un jeu vidéo tourne dans une grande boucle « tant que la partie n'est pas finie », répétée environ 60 fois par seconde : lire les touches, déplacer les personnages, dessiner l'image.</li>
</ul>`,
  fragment: [3, '01011000'],
},

/* ======================= JOUR 11 ====================== */
{
  jour: 11,
  piece: {"mur":"#7b1e2b","motif":"papier","sol":"parquet","elements":["fenetre","tableau","horloge"],"meuble":"table","objets":["🥞","🍫","🕯️","🍰"]},
  particules: ['🥞', '🍫', '❄️'],
  univers: "La Salle à Manger",
  emoji: '🥞',
  couleurs: ['#a8650a', '#e8a923'],
  concept: 'Les piles et les files',
  givrin: {
    ricane: "Je vole les crêpes, je mélange les assiettes, et je ne laisse que les miettes. Bon appétit !",
    piques: [
      "Raté ! Tu confonds la pile et la file. Comme ton pull : à l'envers.",
      "Non. Les invités ont mangé tes erreurs : ils ont une indigestion.",
      "Faux ! Je garde la dernière crêpe pour moi. Et la tienne aussi.",
    ],
    fuite: "Dernière crêpe posée, première mangée… et moi, la première à filer !",
  },
  chrono: 1200,
  histoire: `<p>Dans la Salle à Manger, c'est l'heure du goûter, et le service tourne comme une usine : sur chaque crêpe, une lettre en chocolat. Mais la Kère, gloutonne, rôde autour de l'assiette…</p>`,
  cours: `<p>Les ordinateurs passent leur temps à mettre des informations de côté en attendant de s'en servir. Il existe deux grandes façons de les ranger… et l'ordre dans lequel on les ressort change tout !</p>
<p>🥞 La <b>pile</b>, comme une pile d'assiettes : on ne peut toucher <b>que celle du dessus</b>. La dernière posée est la première ressortie.</p>
<p>🚶 La <b>file</b>, comme la file d'attente à la boulangerie : on arrive <b>au bout</b>, on est servi <b>au début</b>. Le premier arrivé est le premier servi.</p>
<p>Exemple : on pose <b>A</b>, puis <b>B</b> sur une pile, puis on déplace les crêpes une par une, toujours celle du dessus, sur un tapis roulant (une file). Le tapis reçoit d'abord <b>B</b>, puis <b>A</b> : c'est donc <b>B</b> qui arrivera en premier au bout du tapis.</p>`,
  enigme: `<p>Le cuisinier pose les crêpes sur une <b>assiette</b> (une pile). Pour <b>servir</b>, il prend la crêpe du dessus de l'assiette et la pose au bout d'un petit <b>tapis roulant</b> (une file). Les invités <b>mangent</b> toujours la crêpe qui se trouve au début du tapis. Voici ce qui s'est passé, dans l'ordre :</p>
<ol class="operations">
<li>Poser <b>R</b></li><li>Poser <b>U</b></li><li>Poser <b>O</b></li><li>Poser <b>B</b></li><li>➡️ Servir</li><li>➡️ Servir</li><li>Poser <b>T</b></li><li>😈 La Kère vole la crêpe du dessus de l'assiette</li><li>➡️ Servir</li><li>🍴 Manger</li><li>Poser <b>E</b></li><li>Poser <b>I</b></li><li>Poser <b>G</b></li><li>➡️ Servir</li><li>➡️ Servir</li><li>🍴 Manger</li><li>🍴 Manger</li><li>➡️ Servir</li><li>🍴 Manger</li><li>🍴 Manger</li><li>🍴 Manger</li>
</ol>
<p>Les lettres des crêpes <b>mangées par les invités</b>, dans l'ordre où elles ont été mangées, forment le mot de passe. Lequel ?</p>`,
  reponses: ['6a8f814d29ebfa24054747cc4a78f3afa3d232b476c73cc9194a434d8189ea7f'],
  placeholder: 'Le mot formé…',
  indices: [
    "Dessine deux choses sur un papier : l'assiette (une colonne, de bas en haut) et le tapis (une ligne, de gauche à droite). Mets-les à jour après chaque opération, sans en sauter une.",
    "Après les 4 premières crêpes posées, l'assiette contient (de bas en haut) R, U, O, B. « Servir » envoie B au bout du tapis, puis O derrière lui. Les invités mangeront donc B avant O.",
  ],
  lecon: `<p>Les invités ont mangé <b>B, O, U, G, I, E</b>. La crêpe <b>T</b> a fini dans le ventre de la Kère, et la crêpe <b>R</b> est restée seule au fond de l'assiette.</p>
<p>Tu as fait travailler ensemble les deux grandes façons de ranger : la <b>pile</b> (<i>stack</i>), <b>dernier arrivé, premier sorti</b> ; et la <b>file</b> (<i>queue</i>), <b>premier arrivé, premier servi</b>. L'assiette chamboule l'ordre (elle le retourne), le tapis le respecte.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li><b>Ctrl+Z</b> (annuler) utilise une pile : la dernière action faite est la première annulée.</li>
<li>Le bouton « Retour » de ton navigateur est une pile des pages visitées.</li>
<li>Quand une fonction en appelle une autre (comme le flocon récursif du jour 9 !), l'ordinateur range les appels dans une pile : la <b>pile d'appels</b>.</li>
<li>Les documents envoyés à une imprimante attendent sagement dans une <b>file</b>.</li>
</ul>`,
  fragment: [16, '01000101'],
},

/* ======================= JOUR 12 ====================== */
{
  jour: 12,
  piece: {"mur":"#2f3d44","motif":"uni","sol":"parquet","elements":["photos","studio","fenetre"],"meuble":null,"objets":[]},
  particules: ['📸', '✨', '🖼️'],
  univers: "Le Studio Photo",
  emoji: '📸',
  couleurs: ['#2f3d44', '#6f8894'],
  concept: 'Les images et la compression',
  givrin: {
    ricane: "J'ai effacé les couleurs du code. Il ne reste que des nombres. Bonne chance pour deviner où commence le rouge…",
    piques: [
      "Raté ! Ton chef-d'œuvre ressemble à un flocon écrasé sous une botte.",
      "Blanc, rouge, blanc, rouge… Tu as perdu le compte ? Pas moi : je compte tes erreurs.",
      "Faux. Même un écran fracassé à coups de marteau afficherait mieux.",
    ],
    fuite: "L'image réapparaît ?! Je disparais… dans le blanc…",
  },
  chrono: 1200,
  histoire: `<p>Dans le Studio Photo, le photographe avait compressé une image secrète pour qu'elle voyage plus vite. La Kère est passée par là, gomme à la main : elle a effacé <b>toutes les lettres</b> du code. Il ne reste que des nombres…</p>`,
  cours: `<p>Une image numérique, c'est une <b>grille de petits carrés</b> de couleur : les <b>pixels</b> (souviens-toi du jour 4). Pour l'enregistrer, l'ordinateur note la couleur de chaque pixel, ligne par ligne.</p>
<p>Problème : une photo contient des millions de pixels, et le fichier devient vite très lourd. On la <b>compresse</b> donc : on écrit la même information <b>en plus court</b>, pour qu'elle prenne moins de place et voyage plus vite.</p>
<p>L'astuce du photographe : au lieu de dire « blanc, blanc, blanc, blanc, rouge, rouge », il dit « <b>4 blancs, 2 rouges</b> », ce qu'il écrit <code>4B2R</code>. Pour retrouver l'image, on fait l'inverse : <code>4B2R</code> → ⬜⬜⬜⬜🟥🟥</p>
<p>On peut faire encore plus court ! Si l'image n'a que deux couleurs qui <b>alternent</b> forcément (après des blancs viennent des rouges, après des rouges des blancs…) et si chaque ligne commence par du blanc, les lettres ne servent plus à rien : <code>4B2R1B</code> s'écrit simplement <code>4 2 1</code> (4 blancs, 2 rouges, 1 blanc).</p>`,
  enigme: `<div class="note">
<p>📸 <b>Le code, après le passage de la Kère</b></p>
<p>Chaque ligne commence par des pixels <b>blancs</b>, puis les nombres alternent : blancs, rouges, blancs, rouges… <code>1 2 3</code> = 1 blanc, 2 rouges, 3 blancs.</p>
<p>L'image fait <b>21 pixels</b> de large et 7 de haut. Chaque ligne du code correspond à une ligne de l'image.</p>
</div>
<p>Peins la grille (clique ou glisse sur les cases) pour révéler le message secret. <b>Que dit-il ?</b></p>`,
  widget: W.pixels(['21', '1 1 2 1 2 2 2 4 1 1 4', '1 2 1 1 1 1 2 1 1 1 4 1 4', '1 1 1 2 1 1 2 1 1 3 2 1 4', '1 1 2 1 1 1 2 1 1 1 4 1 4', '1 1 2 1 2 2 2 4 1 4 1', '21'], 21),
  reponses: ['c611bddf955aeeb994ec3a540a832992d2627cbefa8d3d1b674cba57b4a5ded0'],
  placeholder: 'Le message…',
  indices: [
    "Chaque ligne commence par du blanc : le 1er nombre compte des cases blanches, le 2e des rouges, le 3e des blanches, et ainsi de suite. Vérifie que chaque ligne fait bien 21 cases au total.",
    "Ligne 2 : 1 blanc, 1 rouge, 2 blancs, 1 rouge, 2 blancs, 2 rouges… Le message fait 4 lettres. Quand toute la grille est peinte, prends un peu de recul !",
  ],
  lecon: `<p>Le message était <b>NOËL</b> 🎄 !</p>
<p>Une image numérique est une <b>grille de pixels</b>. Ce codage s'appelle le <b>RLE</b> (<i>Run-Length Encoding</i>, « codage par plages ») : au lieu d'écrire 21 fois « blanc », on écrit <code>21</code>.</p>
<p>En effaçant les lettres, la Kère a même rendu le code <b>plus court</b> : 65 chiffres en tout, contre 147 cases pour l'image brute (21 × 7). Les <b>télécopieurs</b> (les fax) utilisaient exactement cette astuce : une page de texte, c'est surtout du blanc, avec des plages de noir qui alternent.</p>
<p>Leçon : <b>aucune compression ne marche sur tout</b>. Le RLE est excellent pour les grandes zones unies (un ciel, une page blanche), mauvais pour les images pleines de détails, où les couleurs changent à chaque pixel.</p>
<p>Le RLE est une compression <b>sans perte</b> : on retrouve l'image exacte. Le format <b>JPEG</b>, lui, compresse <b>avec perte</b> : il jette des détails que l'œil remarque à peine, pour obtenir des fichiers environ 10 fois plus légers.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Les fichiers <b>.zip</b> et les images <b>.png</b> utilisent des compressions sans perte, plus malines que le RLE.</li>
<li>Les photos (<b>.jpg</b>), la musique (<b>.mp3</b>) et les vidéos en streaming utilisent des compressions avec perte.</li>
</ul>`,
  fragment: [19, '01001001'],
},

/* ======================= JOUR 13 ====================== */
{
  jour: 13,
  piece: {"mur":"#5a1784","motif":"rayures","sol":"carrelage","elements":["etageres:🧸🚂🪀","vitrine","etageres:🎁🎲🪁"],"meuble":"comptoir","objets":["🧾","🎁","🛎️"]},
  particules: ['🎁', '🧾', '❄️'],
  univers: "La Boutique du Chalet",
  emoji: '🧾',
  couleurs: ['#5a1784', '#ab47bc'],
  concept: 'Détecter les erreurs (clé de contrôle)',
  givrin: {
    ricane: "J'ai trafiqué deux étiquettes sur trois. La troisième ? Peut-être. Peut-être pas. J'adore le suspense.",
    piques: [
      "Faux ! Tu viens d'emballer un cadeau contrefait. Bravo, complice.",
      "Raté. Même la caisse enregistreuse se moque de toi : bip, bip, NUL.",
      "Recompte. Ou ne recompte pas : j'adore te voir paniquer.",
    ],
    fuite: "Démasquée par une simple addition ?! Je rends la monnaie et je file !",
  },
  chrono: 1200,
  histoire: `<p>À la Boutique du Chalet, trois cadeaux attendent d'être emballés. Mais la Kère est passée par là, un feutre à la main : elle a <b>trafiqué les codes-barres</b> de deux étiquettes sur trois. Sur l'une, elle a changé un chiffre. Sur une autre, plus sournoise, elle a <b>inversé deux chiffres voisins</b>. Une seule étiquette est encore authentique.</p>`,
  cours: `<p>Un code-barres, ce sont simplement <b>13 chiffres</b> (écrits en dessous des barres), dessinés aussi sous forme de barres pour que la caisse puisse les lire en un éclair.</p>
<p>Mais un scanner peut se tromper, et une étiquette peut s'abîmer. Pour repérer les erreurs, le <b>dernier chiffre</b> ne dit rien sur le produit : c'est une <b>clé de contrôle</b>, calculée à partir des autres. C'est comme recompter sa monnaie : si le compte n'est pas bon, on sait qu'il y a une erreur quelque part.</p>
<p>La règle utilise deux idées simples :</p>
<ul>
<li><b>Multiplier alternativement par 1 et par 3</b> : le 1er chiffre × 1, le 2e × 3, le 3e × 1, le 4e × 3… Par exemple, pour les chiffres <code>5 2 7</code> : 5 × 1 + 2 × 3 + 7 × 1 = 5 + 6 + 7 = <b>18</b>.</li>
<li>Un <b>multiple de 10</b>, c'est un nombre qui se termine par 0 : 10, 20, 30… 100, 110, 120…</li>
</ul>
<p>Pour un code-barres <b>valide</b>, quand on additionne tous les chiffres multipliés alternativement par 1 et par 3 (le dernier compris), on tombe toujours sur un multiple de 10. Si ce n'est pas le cas, c'est qu'un chiffre a été mal lu… ou trafiqué !</p>`,
  enigme: `<div class="note">
<p>🧾 <b>La règle des codes-barres (EAN-13)</b></p>
<ol>
<li>Multiplie les chiffres <b>alternativement par 1 et par 3</b> : le 1er × 1, le 2e × 3, le 3e × 1, etc.</li>
<li>Additionne tous les résultats (clé de contrôle comprise).</li>
<li>Pour un code-barres valide, le total est toujours un <b>multiple de 10</b>.</li>
</ol>
</div>
<p>Vérifie les trois étiquettes. <b>Quel cadeau porte le seul code-barres authentique ?</b></p>`,
  widget: W.codesBarres([
    { code: '3760147582399', nom: '🛷 Luge' },
    { code: '3760127528399', nom: '🧩 Puzzle' },
    { code: '3760147528399', nom: '⛸️ Patins' },
  ]),
  reponses: ['627248359ff436e3507d0407e91a556998fede8181aaf97ee74404bf7b2a335b', 'da23cdb73eaca46acb52dfd44ce523f2eb09ce85ec2b491d1d4e533a0b775b6b', '97bfa62ee949caf03d81d4d6a626dc35da08d41254026af5e1157eca24ca4a0a', '52097ed65c819cc10cbe512709d34e6bdce2ef12bea7baedd0ca917127fcfd00'],
  placeholder: 'Le cadeau authentique…',
  indices: [
    "Fais le calcul complet pour chaque étiquette : chiffres de rang impair × 1, chiffres de rang pair × 3, puis additionne les 13 produits. Une seule étiquette donne un multiple de 10.",
    "Attention, les trois codes se ressemblent beaucoup ! Les deux premières étiquettes donnent 118 et 124. Et si tu fais juste la somme des chiffres, sans les × 3, la Luge a l'air aussi bonne que la vraie… c'est le piège de la Kère.",
  ],
  lecon: `<p>Le seul code authentique était celui des <b>Patins</b> : son total fait <b>130</b>, un multiple de 10 ✅. La Luge donne 118 et le Puzzle 124 ❌.</p>
<div class="schema">Puzzle : un chiffre changé (le 6ᵉ : 4 → 2)<br>Luge : deux chiffres voisins inversés (… 2 8 … → … 8 2 …)</div>
<p>La clé de contrôle sert à <b>détecter les erreurs</b>. Si le scanner lit mal un seul chiffre, le total ne tombe plus sur un multiple de 10 : la caisse refuse le code.</p>
<p>Et pourquoi multiplier une fois sur deux par 3 ? Pour attraper l'erreur la plus fréquente quand on recopie un code à la main : <b>inverser deux chiffres voisins</b>. Avec une simple somme des chiffres, la Luge et les Patins donnent le même total (64) : l'inversion passerait inaperçue ! Avec les poids 1 et 3, les deux chiffres échangés ne « pèsent » plus pareil, et le total change.</p>
<p>Petit secret : les 3 premiers chiffres, <code>376</code>, indiquent le pays de l'organisme qui a attribué le code. De 300 à 379, c'est… la <b>France</b> !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Ton numéro de <b>carte bancaire</b> a un dernier chiffre de contrôle (algorithme de Luhn) : un site repère tout de suite une faute de frappe.</li>
<li>Le numéro de sécurité sociale, l'<b>IBAN</b> et les numéros de livres (<b>ISBN</b>) ont aussi une clé de contrôle.</li>
<li>Les <b>QR codes</b> vont encore plus loin : ils peuvent <b>corriger</b> les erreurs. On peut abîmer jusqu'à 30 % d'un QR code, il reste lisible !</li>
<li>Sur Internet, chaque paquet de données porte une « somme de contrôle » pour vérifier qu'il n'a pas été abîmé en route.</li>
</ul>`,
  fragment: [9, '01001110'],
},

/* ======================= JOUR 14 ====================== */
{
  jour: 14,
  piece: {"mur":"#2f4a2a","motif":"metal","sol":"metal","elements":["ecran","convoyeur","caisses"],"meuble":null,"objets":[]},
  particules: ['0', '1', '📦'],
  univers: "Le Centre de Tri",
  emoji: '📦',
  couleurs: ['#2f5c1a', '#7cb342'],
  concept: 'Internet et les paquets',
  givrin: {
    ricane: "J'ai lâché les paquets dans une tempête de neige. Doublons, miettes, paquets abîmés… Joyeux puzzle !",
    piques: [
      "Raté ! Le Pôle Sud vient de recevoir « LES RENNES SONT DES CHÈVRES ».",
      "Tu as recollé un paquet abîmé. Les pingouins se roulent par terre.",
      "Encore un doublon ! Toi aussi, tu radotes ?",
    ],
    fuite: "Message transmis ?! Je me découpe en petits paquets et je disparais !",
  },
  chrono: 1200,
  histoire: `<p>Le Père Noël envoie un message au Pôle Sud. Mais sur Internet, un message ne voyage jamais en un seul morceau : il est découpé en petits <b>paquets</b>, qui prennent chacun leur propre route ! La Kère les a lâchés dans une tempête : ils sont arrivés au Centre de Tri <b>dans le désordre</b>, l'un d'eux <b>en double</b>… et un autre <b>abîmé</b>, avant qu'une copie toute neuve n'arrive.</p>`,
  cours: `<p>Sur Internet, un message n'est jamais envoyé d'un seul bloc : il est découpé en petits morceaux, les <b>paquets</b>. Chaque paquet voyage seul, par le chemin le moins encombré du moment… si bien qu'ils n'arrivent pas forcément dans l'ordre, ni en bon état.</p>
<p>Chaque paquet porte une petite <b>étiquette</b> (on dit un <b>en-tête</b>) avec :</p>
<ul>
<li>un <b>numéro</b>, comme les pages d'un livre, pour remettre les morceaux dans l'ordre ;</li>
<li>sa <b>taille</b> : le nombre de caractères qu'il transporte (les espaces comptent !). Si le contenu ne correspond pas à la taille annoncée, le paquet a été abîmé en route : on le jette.</li>
</ul>
<p>Ici, ces nombres sont écrits en <b>binaire</b> sur 4 places. Souviens-toi du jour 1 : il suffit d'additionner les places où il y a un 1.</p>
<div class="defilement"><table class="tableau compact">
<tr><th>8</th><th>4</th><th>2</th><th>1</th><th>Nombre</th></tr>
<tr><td class="allume">1</td><td>0</td><td class="allume">1</td><td>0</td><td>8 + 2 = <b>10</b></td></tr>
</table></div>`,
  enigme: `<p>Chaque paquet porte un <b>numéro de séquence</b> et une <b>taille</b>, écrits en binaire. Clique sur les bons paquets <b>dans le bon ordre</b> pour reconstituer le message, puis transmets-le. Le symbole ␣ représente une espace.</p>`,
  widget: W.paquets([
    { seq: '0101', taille: '0011', data: 'ÉCO' }, { seq: '0010', taille: '0011', data: ' RE' }, { seq: '1001', taille: '0011', data: 'IU' },
    { seq: '0111', taille: '0011', data: 'NT ' }, { seq: '0001', taille: '0011', data: 'LES' }, { seq: '1010', taille: '0010', data: 'IT' },
    { seq: '0011', taille: '0011', data: 'NNE' }, { seq: '0110', taille: '0011', data: 'LLE' }, { seq: '1000', taille: '0011', data: 'À M' },
    { seq: '0011', taille: '0011', data: 'NNE' }, { seq: '0100', taille: '0011', data: 'S D' }, { seq: '1001', taille: '0011', data: 'INU' },
  ]),
  indices: [
    "Convertis d'abord tous les numéros : 0001 = 1, 0010 = 2, 0011 = 3… jusqu'à 1010 = 10. Deux numéros apparaissent deux fois : pour l'un, les deux paquets sont identiques (garde-en un seul) ; pour l'autre, ils sont différents.",
    "Quand deux paquets portent le même numéro mais pas le même contenu, compte les caractères de chacun (espaces comprises) et compare avec sa taille annoncée (0011 = 3). Le paquet abîmé ne fait pas la bonne taille.",
  ],
  lecon: `<p>Le message était : <b>« LES RENNES DÉCOLLENT À MINUIT »</b> 🦌. Il fallait garder un seul des deux paquets n° 3, et jeter le paquet n° 9 abîmé (« IU » : 2 caractères au lieu des 3 annoncés), remplacé par sa copie intacte « INU ».</p>
<p>Sur Internet, toutes les données (messages, photos, vidéos) sont découpées en <b>paquets</b> d'environ 1 500 octets. Chaque paquet porte :</p>
<ul>
<li>l'<b>adresse IP</b> de l'expéditeur et celle du destinataire (comme sur une enveloppe) ;</li>
<li>un <b>numéro de séquence</b>, pour remettre les morceaux dans l'ordre.</li>
</ul>
<p>Les paquets traversent des dizaines de <b>routeurs</b> et peuvent prendre des chemins différents : ils arrivent parfois dans le désordre, en double, ou se perdent. Le protocole <b>TCP</b> fait exactement ce que tu viens de faire : il remet les paquets dans l'ordre, jette les doublons… et redemande les paquets perdus.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Une vidéo en streaming, c'est des milliers de paquets par seconde.</li>
<li>Pour les jeux en ligne et les appels vidéo, on utilise souvent un autre protocole, <b>UDP</b>, qui ne redemande pas les paquets perdus : mieux vaut une image qui saute qu'une conversation qui attend ! C'est l'origine de certains « lags ».</li>
</ul>`,
  fragment: [8, '01010010'],
},

/* ======================= JOUR 15 ====================== */
{
  jour: 15,
  piece: {"mur":"#10202f","motif":"metal","sol":"metal","elements":["serveurs","serveurs","serveurs"],"meuble":null,"objets":[]},
  particules: ['0', '1', '🖥️'],
  univers: "La Salle des Serveurs",
  emoji: '🖥️',
  couleurs: ['#00413a', '#00897b'],
  concept: 'Le Web : clients, serveurs et HTTP',
  givrin: {
    ricane: "J'ai mis le site du Pôle Nord sens dessus dessous. Des erreurs partout, et moi, je suis en pleine forme.",
    piques: [
      "Faux ! Erreur 404 : intelligence introuvable.",
      "Non, non. Erreur 403 : accès à la victoire interdit.",
      "Raté ! Erreur 429 : trop d'erreurs, calme-toi un peu.",
    ],
    fuite: "Tu comprends les codes ?! Erreur 503 : Kère indisponible, je m'en vais !",
  },
  chrono: 1200,
  histoire: `<p>Dans la Salle des Serveurs, le site web du Pôle Nord (<code>www.pole-nord.noel</code>) répond avec de drôles de <b>codes à 3 chiffres</b>. Chaque code a un sens précis, compris par tous les sites du monde… et la Kère s'amuse à les provoquer tous.</p>`,
  cours: `<p>Quand tu ouvres un site web, ton <b>navigateur</b> (Chrome, Firefox, Safari…) envoie une <b>demande</b> à un ordinateur allumé jour et nuit quelque part dans le monde : le <b>serveur</b>. C'est lui qui garde les pages du site.</p>
<p>Le serveur répond avec la page… et avec un <b>code à 3 chiffres</b> qui dit comment ça s'est passé : tout va bien, la page a déménagé, tu n'as pas le droit d'entrer, le serveur a un problème… Tu as sûrement déjà croisé le plus célèbre d'entre eux : « <b>Erreur 404</b> ».</p>
<p>Ces codes sont les mêmes pour tous les sites du monde : c'est ce qui permet à n'importe quel navigateur de comprendre n'importe quel serveur. Le <b>premier chiffre</b> donne la famille : <b>2</b>xx = ça a marché, <b>3</b>xx = va voir ailleurs, <b>4</b>xx = c'est la faute du visiteur, <b>5</b>xx = c'est la faute du serveur.</p>
<p>Deux nuances piégeuses : être <b>authentifié</b>, c'est avoir prouvé <b>qui</b> on est (en se connectant) ; être <b>autorisé</b>, c'est avoir le <b>droit</b> d'entrer. Et une adresse peut déménager <b>pour toujours</b>… ou seulement <b>pour un moment</b>.</p>`,
  enigme: `<p>Associe chaque situation au bon code de réponse du serveur. Attention : certains codes se ressemblent beaucoup, et deux codes de la liste ne servent à rien.</p>`,
  widget: W.http(
    [
      "Un enfant envoie sa lettre au Père Noël : le serveur crée une nouvelle fiche à son nom.",
      "L'ancienne page <code>/lettres</code> a déménagé pour toujours à l'adresse <code>/courrier</code>.",
      "Pendant l'inventaire, la page <code>/boutique</code> renvoie pour quelques heures vers <code>/ferme-pour-inventaire</code>.",
      "La Kère, qui ne s'est pas connectée, demande la page <code>/mon-compte</code>.",
      "La Kère s'est connectée avec le compte d'un apprenti, et essaie d'ouvrir <code>/coffre-du-pere-noel</code>.",
      "Quelqu'un tape <code>/cadeaux-de-l-an-3000</code> : cette page n'a jamais existé.",
      "La Kère envoie 10 000 demandes par seconde pour faire tomber le site : le serveur lui dit de ralentir.",
      "Une erreur dans le programme du serveur le fait planter.",
      "Le 24 décembre au soir, des millions d'enfants se connectent en même temps : le serveur est débordé.",
    ],
    [
      { code: 200, sens: '« OK » : tout va bien, voici la page' },
      { code: 201, sens: '« Créé » : c\'est fait, une nouvelle chose vient d\'être créée' },
      { code: 301, sens: '« Déplacé définitivement » : la page a changé d\'adresse pour toujours' },
      { code: 302, sens: '« Trouvé ailleurs » : la page est, pour l\'instant, à une autre adresse' },
      { code: 401, sens: '« Non authentifié » : qui es-tu ? Connecte-toi d\'abord' },
      { code: 403, sens: '« Interdit » : je sais qui tu es, mais tu n\'as pas le droit d\'entrer' },
      { code: 404, sens: '« Introuvable » : cette page n\'existe pas' },
      { code: 418, sens: '« Je suis une théière » ☕ (oui, il existe vraiment !)' },
      { code: 429, sens: '« Trop de requêtes » : doucement, tu en demandes trop' },
      { code: 500, sens: '« Erreur interne » : le serveur a planté' },
      { code: 503, sens: '« Service indisponible » : le serveur est surchargé' },
    ]
  ),
  indices: [
    "Classe d'abord chaque situation dans sa famille : succès (2xx), déménagement (3xx), faute du visiteur (4xx) ou faute du serveur (5xx). Il ne reste ensuite que 2 ou 3 codes possibles à chaque fois.",
    "401 = le serveur ne sait pas qui tu es ; 403 = il le sait, mais c'est non. 301 = déménagement pour toujours ; 302 = pour un moment. 500 = le serveur a un bug ; 503 = il est débordé. 201 = quelque chose de nouveau a été créé.",
  ],
  lecon: `<p>Quand tu visites un site, ton navigateur (le <b>client</b>) envoie une <b>requête</b> à un ordinateur distant (le <b>serveur</b>) : « donne-moi la page <code>/liste-des-enfants-sages</code> ». Le serveur répond avec la page… et un <b>code</b>.</p>
<table class="tableau"><tr><th>Famille</th><th>Signification</th></tr>
<tr><td><b>2xx</b></td><td>✅ Succès</td></tr>
<tr><td><b>3xx</b></td><td>↪️ Redirection : va voir ailleurs</td></tr>
<tr><td><b>4xx</b></td><td>🙋 Erreur du client (adresse fausse, accès interdit…)</td></tr>
<tr><td><b>5xx</b></td><td>🔥 Erreur du serveur</td></tr></table>
<p>Les réponses : 201, 301, 302, 401, 403, 404, 429, 500, 503. Les codes 200 (tout va bien) et 418 ne servaient à rien ici.</p>
<p>Ce langage s'appelle <b>HTTP</b> (le « http » au début des adresses). Et le code <b>418 « Je suis une théière »</b> vient d'un poisson d'avril de 1998… qui a été gardé, par amour de la blague.</p>
<p>Le code <b>429</b> protège les sites contre les attaques comme celle de la Kère : quand quelqu'un envoie trop de demandes, le serveur le fait patienter au lieu de s'effondrer.</p>
<p>Avant même la requête, ton ordinateur demande à un <b>serveur DNS</b> l'adresse IP de <code>www.pole-nord.noel</code> : le DNS est l'annuaire d'Internet, qui traduit les noms en numéros.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Les pages « 404 » de certains sites sont de petites œuvres d'art : cherche-en quelques-unes !</li>
<li>Les jours de soldes ou de vente de billets de concert, beaucoup de sites renvoient des erreurs 503 : trop de monde à la fois.</li>
</ul>`,
  fragment: [12, '01001100'],
},

/* ======================= JOUR 16 ====================== */
{
  jour: 16,
  piece: {"mur":"#8a1538","motif":"rayures","sol":"parquet","elements":["etageres:🎀🎁🧶","fenetre","tableau"],"meuble":"table","objets":["🎁","🏷️","✂️","🎀"]},
  particules: ['🏷️', '🎀', '✨'],
  univers: "L'Atelier d'Emballage",
  emoji: '🏷️',
  couleurs: ['#760c43', '#c2185b'],
  concept: 'Les expressions régulières',
  givrin: {
    ricane: "Mon robot ne comprend qu'une formule de sorcière. Une étiquette de travers, et hop : le cadeau part à la déchiqueteuse.",
    piques: [
      "Raté ! Ton étiquette vient de finir en confettis.",
      "Faux. Tu lis les motifs comme une poule lit le journal.",
      "Non ! Relis le motif : mon robot ne pardonne rien. Il tient de moi.",
    ],
    fuite: "Tu lis les expressions régulières ?! Personne ne lit ça ! Je m'enfuis !",
  },
  chrono: 1200,
  histoire: `<p>Dans l'Atelier d'Emballage, un robot trie les étiquettes des cadeaux. La Kère a réglé son <b>motif</b> pour qu'il refuse presque tout : l'étiquette doit porter un prénom de la bonne longueur et un <b>jour de décembre avant Noël</b>, de 01 à 24. Le motif est écrit dans un langage étrange : une <b>expression régulière</b>.</p>`,
  cours: `<p>Une <b>expression régulière</b>, c'est un <b>portrait-robot</b> de texte : elle ne dit pas quel texte exact on attend, mais à quoi il doit <b>ressembler</b>.</p>
<p>Par exemple, le portrait-robot « exactement 3 chiffres » accepte <code>007</code> et <code>123</code>, mais refuse <code>12</code> (trop court), <code>1234</code> (trop long) et <code>abc</code> (pas des chiffres).</p>
<p>Pour vérifier une étiquette, on avance <b>en même temps</b> dans le motif et dans l'étiquette, morceau par morceau, de gauche à droite. Si un seul morceau ne correspond pas, l'étiquette est refusée. Le tableau sous le motif t'explique ce que veut dire chaque morceau.</p>
<p>Deux outils en plus : <code>{2,5}</code> veut dire « entre 2 et 5 fois » (<code>[0-9]{2,5}</code> accepte <code>12</code> et <code>12345</code>, mais pas <code>1</code> ni <code>123456</code>). Et <code>(chat|chien)</code> veut dire « au choix, chat ou chien » : le morceau doit correspondre à l'une des possibilités.</p>`,
  enigme: `<div class="motif"><code>^[A-Z][a-z]{2,5}-(0[1-9]|1[0-9]|2[0-4])$</code></div>
<table class="tableau legende-regex">
<tr><td><code>^</code></td><td>début de l'étiquette</td></tr>
<tr><td><code>[A-Z]</code></td><td>une lettre majuscule (de A à Z)</td></tr>
<tr><td><code>[a-z]{2,5}</code></td><td>de 2 à 5 lettres minuscules (de a à z, sans accent)</td></tr>
<tr><td><code>-</code></td><td>un tiret</td></tr>
<tr><td><code>( … | … | … )</code></td><td>au choix : l'un des morceaux séparés par <code>|</code></td></tr>
<tr><td><code>0[1-9]</code></td><td>un 0 suivi d'un chiffre de 1 à 9 (01 à 09)</td></tr>
<tr><td><code>1[0-9]</code></td><td>un 1 suivi d'un chiffre de 0 à 9 (10 à 19)</td></tr>
<tr><td><code>2[0-4]</code></td><td>un 2 suivi d'un chiffre de 0 à 4 (20 à 24)</td></tr>
<tr><td><code>$</code></td><td>fin de l'étiquette (plus rien après !)</td></tr>
</table>
<p>Voici les étiquettes, dans l'ordre d'arrivée :</p>
<div class="etiquettes"><span>Ophelie-11</span><span>Nael-05</span><span>Lea-25</span><span>Emma-12</span><span>Al-03</span><span>Tom-7</span><span>Ines-24</span><span>Zoé-14</span><span>Gaspard-08</span><span>Gael-09</span><span>Ugo-00</span><span>Sam-31</span><span>Elio-17</span><span>RAY-10</span></div>
<p>Les <b>premières lettres</b> des étiquettes acceptées par le robot, dans l'ordre, forment le mot de passe.</p>`,
  reponses: ['323f10c007faf32d3f56490a1879c815874867b9a1fcf13046f2f0ff7aa84100'],
  placeholder: 'Le mot formé…',
  indices: [
    "Vérifie chaque étiquette morceau par morceau : 1 majuscule, puis 2 à 5 minuscules sans accent (donc un prénom de 3 à 6 lettres en tout), puis un tiret, puis un nombre de 01 à 24 écrit avec 2 chiffres, puis plus rien.",
    "Pièges : un prénom trop court (Al) ou trop long (Ophelie, Gaspard), un accent (Zoé), un jour impossible (00, 25, 31), un seul chiffre (7), des majuscules en trop (RAY). 5 étiquettes sont acceptées.",
  ],
  lecon: `<p>Les étiquettes acceptées étaient <b>N</b>ael-05, <b>E</b>mma-12, <b>I</b>nes-24, <b>G</b>ael-09 et <b>E</b>lio-17 → <b>NEIGE</b> ❄️</p>
<p>Les refusées : <code>Ophelie-11</code> et <code>Gaspard-08</code> (trop de minuscules : 6), <code>Lea-25</code> et <code>Sam-31</code> (jours au-delà de 24), <code>Al-03</code> (une seule minuscule), <code>Tom-7</code> (un seul chiffre), <code>Zoé-14</code> (le « é » n'est pas entre a et z !), <code>Ugo-00</code> (00 n'est dans aucun des trois choix), <code>RAY-10</code> (majuscules après le R).</p>
<p>Les <b>expressions régulières</b> (ou <i>regex</i>) sont un mini-langage pour décrire des motifs de texte. Elles existent dans presque tous les langages de programmation.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Quand un formulaire te dit « adresse e-mail invalide », c'est souvent une regex qui a vérifié.</li>
<li>Un code postal français s'écrit <code>^[0-9]{5}$</code>.</li>
<li>Les développeurs s'en servent pour chercher et remplacer du texte dans des milliers de fichiers d'un coup.</li>
</ul>
<h4>🧪 Essaie toi-même</h4>`,
  apresReussite: W.terrainRegex('^[A-Z][a-z]{2,5}-(0[1-9]|1[0-9]|2[0-4])$', ['Ophelie-11', 'Nael-05', 'Lea-25', 'Emma-12', 'Al-03', 'Tom-7', 'Ines-24', 'Zoé-14', 'Gaspard-08', 'Gael-09', 'Ugo-00', 'Sam-31', 'Elio-17', 'RAY-10']),
  fragment: [13, '01000001'],
},

/* ======================= JOUR 17 ====================== */
{
  jour: 17,
  piece: {"mur":"#3e2723","motif":"bois","sol":"tapis","elements":["etageres:livres","etageres:livres","etageres:livres"],"meuble":"bureau","objets":["📚","🕯️","🔍"]},
  particules: ['📚', '✨', '❄️'],
  univers: "La Bibliothèque",
  emoji: '📚',
  couleurs: ['#3a241c', '#795548'],
  concept: 'Les bases de données (SQL)',
  givrin: {
    ricane: "J'ai coupé le registre en deux : les enfants d'un côté, leurs cadeaux de l'autre. Bonne chance pour recoller les morceaux.",
    piques: [
      "Faux ! Tu viens d'offrir une luge à un garnement. Je commence à t'apprécier.",
      "Erreur de requête ! Ta jointure ressemble à un nœud de guirlande.",
      "Non. La base de données a soupiré. Si, si, je l'ai entendue.",
    ],
    fuite: "SELECT sortie FROM chalet… Je disparais de la base !",
  },
  chrono: 1200,
  histoire: `<p>Dans la Bibliothèque, le registre des enfants n'est plus un vieux grimoire : c'est une <b>base de données</b>. Mais la Kère l'a coupé en <b>deux tables</b> : les enfants d'un côté, les cadeaux de l'autre. Pour retrouver le mot de passe, il faut les recoller… avec la requête qu'elle a laissée sur l'écran.</p>`,
  cours: `<p>Une <b>base de données</b>, c'est un ensemble de grands tableaux bien rangés, les <b>tables</b> : chaque <b>ligne</b> décrit une chose (un enfant, un cadeau) et chaque <b>colonne</b> une information sur elle (un prénom, un prix…).</p>
<p>Pour lui poser une question, on écrit une <b>requête</b> en <b>SQL</b>. Ses mots-clés sont de l'anglais tout simple :</p>
<div class="defilement"><table class="tableau compact">
<tr><td><code>SELECT</code></td><td class="gauche">choisis (la colonne à afficher)</td></tr>
<tr><td><code>FROM</code></td><td class="gauche">dans (quelle table)</td></tr>
<tr><td><code>JOIN … ON …</code></td><td class="gauche">recolle une deuxième table : chaque ligne est associée aux lignes de l'autre table qui vérifient la condition après ON</td></tr>
<tr><td><code>WHERE</code></td><td class="gauche">seulement les lignes où…</td></tr>
<tr><td><code>AND</code></td><td class="gauche">et (les deux conditions doivent être vraies)</td></tr>
<tr><td><code>ORDER BY … DESC</code></td><td class="gauche">range le résultat par… en ordre décroissant (du plus grand au plus petit)</td></tr>
</table></div>
<p>Avec deux tables, on donne souvent un <b>surnom</b> (un <i>alias</i>) à chacune : <code>FROM enfants e</code> veut dire « la table enfants, que j'appellerai e ». Ensuite, <code>e.sage</code> désigne la colonne sage de la table enfants.</p>
<p>Exemple de jointure : si un cadeau a <code>enfant_id = 4</code>, il est destiné à l'enfant dont l'<code>id</code> vaut 4.</p>`,
  enigme: `<p>Voici la requête laissée par la Kère :</p>
<pre class="code sql"><span class="mot">SELECT</span> c.cadeau
<span class="mot">FROM</span> enfants e
<span class="mot">JOIN</span> cadeaux c <span class="mot">ON</span> c.enfant_id = e.id
<span class="mot">WHERE</span> e.sage = 'oui'
  <span class="mot">AND</span> c.prix &lt; 30
<span class="mot">ORDER BY</span> c.prix <span class="mot">DESC</span>;</pre>
<p class="petit">Traduction : « Recolle chaque cadeau à l'enfant à qui il est destiné. Garde seulement les cadeaux des enfants sages qui coûtent moins de 30 €, et range-les du plus cher au moins cher. Affiche le nom des cadeaux. »</p>
<div class="deux-tables">
<div><p>Table <code>enfants</code> (alias <code>e</code>) :</p>
<div class="defilement"><table class="tableau table-sql">
<tr><th>id</th><th>prenom</th><th>ville</th><th>sage</th></tr>
<tr><td>1</td><td>Zoé</td><td>Lyon</td><td>oui</td></tr>
<tr><td>2</td><td>Hugo</td><td>Paris</td><td>non</td></tr>
<tr><td>3</td><td>Adam</td><td>Lille</td><td>oui</td></tr>
<tr><td>4</td><td>Inès</td><td>Nantes</td><td>oui</td></tr>
<tr><td>5</td><td>Malo</td><td>Lyon</td><td>non</td></tr>
<tr><td>6</td><td>Rose</td><td>Paris</td><td>oui</td></tr>
</table></div></div>
<div><p>Table <code>cadeaux</code> (alias <code>c</code>) :</p>
<div class="defilement"><table class="tableau table-sql">
<tr><th>id</th><th>enfant_id</th><th>cadeau</th><th>prix</th></tr>
<tr><td>1</td><td>3</td><td>Toupie</td><td>19</td></tr>
<tr><td>2</td><td>2</td><td>Luge</td><td>26</td></tr>
<tr><td>3</td><td>1</td><td>Nounours</td><td>9</td></tr>
<tr><td>4</td><td>6</td><td>Console</td><td>250</td></tr>
<tr><td>5</td><td>4</td><td>Ukulélé</td><td>25</td></tr>
<tr><td>6</td><td>5</td><td>Igloo en kit</td><td>12</td></tr>
<tr><td>7</td><td>6</td><td>Lampe frontale</td><td>28</td></tr>
<tr><td>8</td><td>1</td><td>Igloo gonflable</td><td>14</td></tr>
<tr><td>9</td><td>3</td><td>Robot</td><td>45</td></tr>
</table></div></div>
</div>
<p>Les <b>initiales des cadeaux</b> obtenus, dans l'ordre du résultat, forment le mot de passe.</p>`,
  reponses: ['c12fd5047c181d7d4784e29127da729b8aa4b23fb1415f4b3f72ffb1a1aa34e4'],
  placeholder: 'Le mot formé…',
  indices: [
    "Pour chaque cadeau, trouve son enfant grâce à enfant_id (c'est l'id de l'enfant). Barre les cadeaux des enfants qui ne sont pas sages, puis ceux qui coûtent 30 € ou plus.",
    "Il reste 5 cadeaux. Range-les du plus cher au moins cher (DESC), puis lis leurs initiales. Méfie-toi de la Luge et de l'Igloo en kit : ils sont destinés à des enfants pas sages.",
  ],
  lecon: `<p>La requête renvoie 5 lignes : <b>L</b>ampe frontale (28 €, Rose), <b>U</b>kulélé (25 €, Inès), <b>T</b>oupie (19 €, Adam), <b>I</b>gloo gonflable (14 €, Zoé) et <b>N</b>ounours (9 €, Zoé) → <b>LUTIN</b> 🧝</p>
<p>Écartés : la Luge et l'Igloo en kit (destinés à Hugo et Malo, pas sages), la Console et le Robot (30 € ou plus).</p>
<p>Une <b>base de données</b> range les informations dans des <b>tables</b>. Plutôt que de tout écrire dans un seul immense tableau (et de recopier la ville de Zoé à côté de chacun de ses cadeaux), on sépare les informations et on les relie par un numéro : c'est une base de données <b>relationnelle</b>, et la <b>jointure</b> (<code>JOIN</code>) sert à recoller les morceaux au moment de poser la question.</p>
<p>Le <b>SQL</b> a été inventé dans les années 1970… et il est toujours utilisé partout aujourd'hui. Avec 10 lignes, tu peux le faire à la main. Une vraie base peut contenir des <b>milliards</b> de lignes : l'ordinateur répond quand même en une fraction de seconde.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Ton compte sur un réseau social, tes notes au collège ou au lycée, tes achats en ligne, ton compte en banque : tout est rangé dans des bases de données.</li>
<li>Une attaque célèbre, l'<b>injection SQL</b>, consiste à glisser du code SQL dans un formulaire pour tromper la base. Les développeurs doivent toujours s'en protéger !</li>
</ul>`,
  fragment: [6, '01010100'],
},

/* ======================= JOUR 18 ====================== */
{
  jour: 18,
  piece: {"mur":"#d9ecef","motif":"carreaux","sol":"carrelage","elements":["pharmacie","fenetre","tableau"],"meuble":"table","objets":["🧸","🩹","🔧"]},
  particules: ['🐞', '⚙️', '🩹'],
  univers: "L'Infirmerie des Jouets",
  emoji: '🐞',
  couleurs: ['#8f1515', '#e53935'],
  concept: 'Les bugs et le débogage',
  givrin: {
    ricane: "Je me suis cachée dans une seule ligne de ce programme. Une seule. Trouve-moi, si tu peux…",
    piques: [
      "Raté ! Cette ligne est innocente. Comme moi.",
      "Tu accuses n'importe qui ! Il te faut des preuves, inspecteur.",
      "Non. Explique le programme à un canard en plastique : lui, au moins, réfléchit.",
    ],
    fuite: "Déboguée ! Je suis déboguée ! Aaaaah !",
  },
  chrono: 1200,
  histoire: `<p>Le <b>9 septembre 1947</b>, l'équipe de l'informaticienne <b>Grace Hopper</b> trouve un vrai papillon de nuit coincé dans l'ordinateur Mark II. Ils le collent dans leur cahier avec la mention : « premier cas réel de bug trouvé ». Aujourd'hui, à l'Infirmerie des Jouets, c'est le robot de chargement du traîneau qui a un bug… et la Kère se cache dedans !</p>`,
  cours: `<p>Un <b>bug</b>, c'est une erreur dans un programme : l'ordinateur fait exactement ce qu'on lui a écrit… mais ce n'est pas ce qu'on voulait ! Pour le trouver, il faut savoir lire le programme. Voici ce qu'il te faut :</p>
<ul>
<li>Une <b>liste</b> range plusieurs valeurs dans des cases numérotées. ⚠️ Les informaticiens commencent à compter à <b>0</b> ! Avec <code>noms = ["Léo", "Ana", "Tom"]</code> : <code>noms[0]</code> vaut "Léo", <code>noms[1]</code> vaut "Ana" et <code>noms[2]</code> vaut "Tom".</li>
<li><code>pour i allant de 0 à 2</code> répète les lignes <b>décalées</b> juste en dessous, avec <code>i</code> qui vaut 0, puis 1, puis 2. Une ligne qui n'est pas décalée n'est faite qu'<b>une fois</b>, après la boucle.</li>
<li>Ici, <code>=</code> joue le même rôle que la flèche <code>←</code> du jour 10 : <code>total = total + 2</code> ajoute 2 au total.</li>
<li><code>si … :</code> et <code>sinon :</code> font un choix, comme au jour 10. <code>&gt;</code> veut dire « plus grand que ».</li>
</ul>
<p>La meilleure méthode pour trouver un bug : <b>jouer l'ordinateur</b>. Suis le programme ligne par ligne, en notant sur un papier ce que contient chaque boîte après chaque ligne.</p>`,
  enigme: `<p>Le robot doit additionner les poids des cadeaux à charger dans le traîneau, et prévenir s'ils dépassent 20 kg. Il y a 5 cadeaux (4, 1, 5, 2 et 3 kg) : le total devrait faire <b>15 kg</b>… mais le robot affiche <b>3</b> !</p>
<p><b>Clique sur la ligne qui contient le bug.</b></p>`,
  widget: W.debogage([
    'poids = [4, 1, 5, 2, 3]',
    'pour i allant de 0 à 4 :',
    '    total = 0',
    '    total = total + poids[i]',
    'si total > 20 :',
    '    afficher("Trop lourd !")',
    'sinon :',
    '    afficher(total)',
  ]),
  indices: [
    "Joue l'ordinateur : écris sur un papier la valeur de total après chaque ligne, tour après tour. Que vaut total à la fin du 1er tour ? Et à la fin du 2e ?",
    "Au 2e tour (i = 1), total devrait passer de 4 à 5… Regarde quelle ligne est faite juste avant l'addition, à chaque tour. Elle est décalée : elle est donc DANS la boucle.",
  ],
  lecon: `<p>Le bug était à la <b>ligne 3</b> : <code>total = 0</code> est décalée, donc <b>dans</b> la boucle. À chaque tour, le total est remis à zéro avant d'ajouter le poids suivant ! À la fin, il ne contient que le dernier poids : 3. La correction : sortir cette ligne de la boucle, pour qu'elle ne soit faite qu'une fois, au début.</p>
<pre class="code">total = 0
pour i allant de 0 à 4 :
    total = total + poids[i]</pre>
<p>C'est un bug très courant : une ligne <b>au mauvais endroit</b>. Chaque ligne, prise seule, est juste… c'est leur place qui ne l'est pas. Et la ligne 2, que beaucoup soupçonnent (on croirait qu'elle oublie une case), était parfaitement correcte : 5 cases, numérotées de 0 à 4.</p>
<p>Le <b>débogage</b>, c'est l'art de trouver et corriger les erreurs. Les développeurs y passent souvent plus de temps qu'à écrire du code neuf. Une technique célèbre : la <b>méthode du canard en plastique</b> 🦆. On explique son programme ligne par ligne à un canard en plastique… et rien qu'en l'expliquant à voix haute, on trouve souvent l'erreur !</p>
<p>Grace Hopper a aussi créé l'un des premiers <b>compilateurs</b> : un programme qui traduit un langage proche de l'anglais en instructions pour la machine.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>En 1996, la fusée <b>Ariane 5</b> a explosé 37 secondes après son décollage à cause d'un bug : un nombre trop grand pour la « boîte » où le programme voulait le ranger.</li>
<li>Les mises à jour de ton téléphone corrigent souvent des dizaines de bugs à la fois.</li>
</ul>`,
  fragment: [10, '01000001'],
},

/* ======================= JOUR 19 ====================== */
{
  jour: 19,
  piece: {"mur":"#263238","motif":"metal","sol":"metal","elements":["casiers","coffre","casiers"],"meuble":null,"objets":[]},
  particules: ['🔑', '🔐', '✨'],
  univers: "La Salle des Coffres",
  emoji: '🔐',
  couleurs: ['#1f2a30', '#546e7a'],
  concept: 'Les mots de passe et la force brute',
  givrin: {
    ricane: "Mon ordinateur de glace teste 10 000 milliards de mots de passe par seconde. Ton petit secret tiendra… le temps d'un éternuement.",
    piques: [
      "Cassé ! Même ma grand-mère, congelée depuis l'an mil, l'aurait deviné.",
      "Ha ! Ce mot de passe, je l'ai trouvé avant que tu aies fini de le taper.",
      "Plus long, voyons ! Ton mot de passe est aussi court que ta victoire.",
    ],
    fuite: "Un million d'années ?! Je n'ai pas le temps d'attendre, j'ai d'autres Noëls à gâcher !",
  },
  chrono: 1200,
  histoire: `<p>Dans la Salle des Coffres, la <b>Kère</b> des coffres a branché un ordinateur de glace mille fois plus puissant qu'un ordinateur de pirate ordinaire : il teste <b>10 000 milliards de mots de passe par seconde</b> ! Il faut protéger le coffre aux cadeaux avec un nouveau mot de passe.</p>`,
  cours: `<p>Un pirate qui ne connaît pas ton mot de passe peut demander à un ordinateur de les <b>essayer tous</b>, un par un, jusqu'à tomber sur le bon : c'est l'<b>attaque par force brute</b> (tu l'as déjà utilisée contre le code de César, au jour 3 !).</p>
<p>Pour lui résister, il faut que le nombre de <b>combinaisons possibles</b> soit gigantesque. Pense à un cadenas à chiffres :</p>
<ul>
<li>avec 3 roues de 10 chiffres : 10 × 10 × 10 = <b>1 000</b> combinaisons ;</li>
<li>avec 4 roues : 10 × 10 × 10 × 10 = <b>10 000</b> combinaisons.</li>
</ul>
<p>Chaque roue de plus multiplie le nombre de combinaisons. Pour un mot de passe, c'est pareil : chaque caractère est une « roue », et le nombre de symboles possibles (minuscules, majuscules, chiffres, signes…) est le nombre de crans sur chaque roue. À toi de découvrir ce qui compte le plus !</p>`,
  enigme: `<p>Invente un mot de passe que l'ordinateur de glace de la Kère mettrait <b>au moins un million d'années</b> à trouver en essayant toutes les combinaisons. Observe bien ce qui fait grimper le temps le plus vite !</p>
<p class="alerte">🚫 N'écris surtout pas un de tes vrais mots de passe ici : invente-en un nouveau !</p>`,
  widget: W.motDePasse(1e13, 1e6, ['123456', '123456789', '12345678', 'azerty', 'qwerty', 'motdepasse', 'password', 'soleil', 'doudou', 'loulou', 'noel', 'joyeuxnoel', 'perenoel', '000000', '111111', 'abc123', 'azertyuiop', 'chocolat', 'bonjour']),
  indices: [
    "Compare : qu'est-ce qui augmente le plus le temps ? Ajouter un type de caractère… ou ajouter des caractères ? Il faudra bien plus de 12 caractères !",
    "Une phrase de 4 ou 5 mots qui n'ont rien à voir entre eux, séparés par des espaces, devient vite incassable, même tout en minuscules. Mais la Kère refuse les mots de passe trop répétitifs (« aaaa »).",
  ],
  lecon: `<p>Le nombre de combinaisons d'un mot de passe = <b>(nombre de caractères possibles)<sup>longueur</sup></b>. Avec 10 000 milliards d'essais par seconde :</p>
<ul>
<li>8 lettres minuscules : 26<sup>8</sup> ≈ 200 milliards → cassé en <b>2 centièmes de seconde</b> ;</li>
<li>8 caractères de tous types : 95<sup>8</sup> ≈ 6 600 000 milliards → environ <b>11 minutes</b> ;</li>
<li>20 lettres minuscules : 26<sup>20</sup> → environ <b>63 millions d'années</b> !</li>
</ul>
<p>Pour tenir un million d'années, il faut environ <b>19 minuscules</b>… ou <b>14 caractères</b> de tous types. Chaque caractère ajouté multiplie le temps, alors qu'un nouveau type de caractère ne fait que l'augmenter un peu.</p>
<p>La <b>longueur</b> compte bien plus que les symboles compliqués. Une <b>phrase de passe</b> de plusieurs mots choisis au hasard (« chaussette-volcan-pingouin-trompette ») est à la fois très solide et facile à retenir.</p>
<p>⚠️ Notre calcul est simplifié : les pirates n'essaient pas les combinaisons dans n'importe quel ordre. Ils testent d'abord les mots de passe les plus courants (<code>123456</code>, <code>azerty</code>…), les mots du dictionnaire et ceux qui ont déjà fuité sur Internet.</p>
<h4>🌍 Dans la vraie vie : les 4 bons réflexes</h4>
<ul>
<li>Un mot de passe <b>différent pour chaque site</b> (sinon, une seule fuite suffit à tout ouvrir).</li>
<li>Un <b>gestionnaire de mots de passe</b> pour les retenir à ta place.</li>
<li>La <b>double authentification</b> : un code reçu sur ton téléphone en plus du mot de passe.</li>
<li>Ne jamais donner ton mot de passe, même à un « copain » ou à un prétendu « support technique ».</li>
</ul>`,
  fragment: [14, '01000011'],
},

/* ======================= JOUR 20 ====================== */
{
  jour: 20,
  piece: {"mur":"#4a1c1c","motif":"papier","sol":"tapis","elements":["etageres:livres","cheminee","fenetre"],"meuble":"bureau","objets":["🕯️","📜","🪶","☕"]},
  particules: ['🕯️', '✨', '❄️'],
  univers: "Le Bureau du Père Noël",
  emoji: '🕯️',
  couleurs: ['#3e1277', '#7e57c2'],
  concept: 'Les fonctions de hachage',
  givrin: {
    ricane: "J'ai glissé de fausses commandes parmi les vraies. Ton sceau ridicule n'y verra que du feu… enfin, de la glace.",
    piques: [
      "Faux ! Tom recevra une niche. Sans chien dedans.",
      "Raté. Tu as compté avec tes moufles ?",
      "Encore faux ! Je finis par croire que c'est toi qui as écrit mes fausses commandes.",
    ],
    fuite: "Démasquée par un simple nombre ?! Je souffle… je m'essouffle…",
  },
  chrono: 1200,
  histoire: `<p>Dans le Bureau du Père Noël, chaque commande est protégée par un <b>sceau magique</b> : un nombre calculé à partir du texte. Avant, on additionnait simplement les lettres… jusqu'au jour où la Kère a découvert comment tromper ce sceau. Le Père Noël a donc inventé une recette plus maligne.</p>`,
  cours: `<p>Comment être sûr qu'un message n'a pas été modifié en chemin ? On peut lui ajouter une <b>empreinte</b> : un petit nombre calculé à partir du texte, un peu comme une empreinte digitale.</p>
<p>Le destinataire refait le même calcul sur le texte qu'il a reçu. S'il trouve la même empreinte, le texte est intact. Sinon, quelqu'un l'a modifié !</p>
<p>Pour faire le calcul, tu auras besoin du <b>rang</b> de chaque lettre dans l'alphabet (A est la 1re lettre, B la 2e…) et du <b>reste d'une division</b> : c'est ce qui reste quand on a enlevé un nombre autant de fois que possible. Par exemple, le reste de 130 divisé par 50 : 130 − 50 − 50 = <b>30</b> (on ne peut plus enlever 50).</p>
<p>Un piège : deux mots qui ont exactement les mêmes lettres dans un autre ordre (des <b>anagrammes</b>, comme ROMA et AMOR) donnent le même total si on additionne simplement les lettres. Pour les distinguer, on peut multiplier chaque lettre par sa <b>place</b> dans le mot : dans ROMA, le R est 1er (× 1) ; dans AMOR, il est 4e (× 4).</p>`,
  enigme: `<div class="note">
<p>🕯️ <b>La nouvelle recette du sceau</b></p>
<ol>
<li>Remplace chaque lettre par son rang dans l'alphabet : A = 1, B = 2, … Z = 26.</li>
<li>Multiplie chaque rang par la <b>place</b> de la lettre dans le mot : la 1re lettre × 1, la 2e × 2, la 3e × 3…</li>
<li>Additionne tout, puis garde seulement le <b>reste de la division par 100</b> (enlève 100 autant de fois que possible).</li>
</ol>
<p>Exemple : <code>NOEL</code> → 14 × 1 + 15 × 2 + 5 × 3 + 12 × 4 = 14 + 30 + 15 + 48 = 107 → 107 − 100 = <b>7</b>.</p>
</div>
<p>La commande originale de Tom portait le <b>sceau 36</b>. La Kère l'a interceptée et a envoyé plusieurs fausses versions, dont une qui ressemble terriblement à la vraie. <b>Quel cadeau Tom a-t-il vraiment commandé ?</b></p>
<div class="etiquettes"><span>ROBOT</span><span>NICHE</span><span>TRAIN</span><span>CHIEN</span><span>POUPEE</span><span>LUGE</span></div>`,
  reponses: ['d313fdc7b98aa7e30efd970ca306a525fa52c1ef272b80619105dec48ec6f416', '6b815f6bf0eb07744c0db989473206959d337dc7231bdc0a2d6a418c4ff2dfa8'],
  placeholder: 'Le vrai cadeau…',
  indices: [
    "Calcule le sceau de chaque cadeau, comme dans l'exemple de NOEL. N'oublie pas de multiplier chaque lettre par sa place !",
    "Aide-mémoire : B = 2, C = 3, E = 5, G = 7, H = 8, I = 9, L = 12, N = 14, O = 15, P = 16, R = 18, T = 20, U = 21. CHIEN et NICHE ont les mêmes lettres… mais pas aux mêmes places.",
  ],
  lecon: `<p>Le vrai cadeau était le <b>CHIEN</b> 🐶 : 3 × 1 + 8 × 2 + 9 × 3 + 5 × 4 + 14 × 5 = 3 + 16 + 27 + 20 + 70 = 136 → <b>36</b> ✅. La NICHE de la Kère, elle, donne 98.</p>
<p>Avec l'ancienne recette (une simple addition), CHIEN et NICHE avaient le même total (39) : la Kère aurait pu remplacer le chien par une niche sans que personne ne s'en aperçoive ! En tenant compte de la <b>place</b> des lettres, on repère les lettres échangées.</p>
<p>Ce sceau est une <b>fonction de hachage</b> : elle transforme n'importe quel texte en une <b>empreinte</b> de taille fixe. Mais la nôtre reste faible : <code>POUPEE</code> et <code>VELO</code> ont toutes les deux le sceau 28 ! Deux textes différents avec la même empreinte, c'est une <b>collision</b>.</p>
<p>Les vraies fonctions de hachage, comme <b>SHA-256</b>, produisent une empreinte de 256 bits et sont conçues pour que :</p>
<ul>
<li>la moindre modification du texte change <b>complètement</b> l'empreinte ;</li>
<li>il soit impossible de retrouver le texte à partir de l'empreinte ;</li>
<li>personne ne puisse trouver deux textes avec la même empreinte.</li>
</ul>
<p>🤫 <b>Le secret de ce calendrier</b> : les réponses ne sont jamais envoyées à ton navigateur. Elles restent sur le serveur du Pôle Nord… et même là, elles ne sont pas écrites en clair : le serveur ne garde que leurs <b>empreintes SHA-256</b>. Quand tu proposes une réponse, il calcule son empreinte et la compare. Même quelqu'un qui volerait le serveur ne pourrait pas lire les réponses !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Les sites sérieux ne stockent jamais ton mot de passe : seulement son empreinte (avec un « sel » ajouté pour plus de sécurité).</li>
<li>Quand on télécharge un logiciel, on peut comparer son empreinte avec celle du site officiel pour vérifier qu'un pirate ne l'a pas modifié.</li>
<li>Les cryptomonnaies comme le Bitcoin utilisent SHA-256 en permanence.</li>
</ul>
<h4>🧪 Essaie toi-même</h4>`,
  apresReussite: W.terrainHachage(),
  fragment: [5, '01000101'],
},

/* ======================= JOUR 21 ====================== */
{
  jour: 21,
  piece: {"mur":"#1d4f6e","motif":"rayures","sol":"tapis","elements":["fenetre","ecran","tableau"],"meuble":"bureau","objets":["💻","📧","☕"]},
  particules: ['📧', '✉️', '🎣'],
  univers: "Le Salon des Lutins",
  emoji: '📧',
  couleurs: ['#0b3d8c', '#3d8fe0'],
  concept: 'Déjouer le hameçonnage (phishing)',
  givrin: {
    ricane: "J'ai écrit cinq messages. Les faux sont parfaits, les vrais sont suspects. Tu vas adorer douter de tout.",
    piques: [
      "Ferré ! Tu viens de mordre à l'hameçon comme une truite au réveil.",
      "Raté ! Ton mot de passe ? Merci, je le garde précieusement. Dans un glaçon.",
      "Non. Tu cliques sur tout ce qui brille, toi. Comme une pie. Une pie congelée.",
    ],
    fuite: "Tu as repéré mes pièges ?! Plus personne ne mord à l'hameçon… Je range ma canne à pêche.",
  },
  chrono: 1200,
  histoire: `<p>Dans le Salon des Lutins, sur l'ordinateur de la messagerie, 5 messages viennent d'arriver. Mais la <b>Kère</b> du salon a envoyé des <b>faux messages</b> pour voler les mots de passe ! Et elle est rusée : ses faux ne sont pas tous urgents ni pleins de fautes… Le seul vrai site du Père Noël est <code>pere-noel.noel</code>.</p>`,
  cours: `<p>Le <b>hameçonnage</b> (<i>phishing</i> en anglais), c'est un faux message qui se fait passer pour quelqu'un de confiance (ta banque, un jeu, ton école…) pour te faire cliquer sur un lien et te voler ton mot de passe ou ta carte bancaire.</p>
<p>Le meilleur moyen de le démasquer : <b>lire l'adresse du lien</b>. Une adresse web se découpe ainsi :</p>
<div class="schema"><code>https://</code> <code>www.meteo-exemple.fr</code> <code>/previsions/paris</code><br><span class="petit">le protocole &nbsp;·&nbsp; <b>le nom du site</b> &nbsp;·&nbsp; la page dans le site</span></div>
<p>Le <b>nom du site</b> (tout ce qui va jusqu'au premier « / ») est unique au monde : seul son propriétaire peut l'utiliser. C'est donc lui qu'il faut vérifier, lettre par lettre !</p>
<p>Attention, il se lit <b>en partant de la fin</b> : dans <code>www.meteo-exemple.fr</code>, le vrai site est <code>meteo-exemple.fr</code>. Ce qui se trouve devant, séparé par des points, ce sont des « sous-parties » choisies par le propriétaire : <code>neige.meteo-exemple.fr</code> appartient aussi à meteo-exemple.fr. Mais <code>meteo-exemple.fr.pirate.com</code> appartient à… <code>pirate.com</code> !</p>`,
  enigme: `<p>Examine chaque message comme un détective, <b>surtout l'adresse du lien</b>. Un seul est authentique : lequel ? Ne te fie ni au ton, ni à la politesse, ni à l'urgence.</p>`,
  widget: W.phishing([
    { de: 'Père Noël &lt;<code>securite@pere-noeI.noel</code>&gt;', objet: '⚠️ URGENT !!! Votre compte sera supprimé dans 1 heure', corps: 'Cliquez immédiatement sur le lien ci-dessous et entrez votre mot de passe pour éviter la suppression de votre compte.', lien: 'https://pere-noeI.noel/connexion' },
    { de: 'Service des Lutins &lt;<code>info@pere-noel.noel.verif-compte.com</code>&gt;', objet: 'Confirmez vos identifiants pour recevoir votre prime de Noël', corps: 'Pour recevoir votre prime de 500 sucres d\'orge, confirmez simplement votre identifiant et votre mot de passe sur notre page sécurisée.', lien: 'https://pere-noel.noel.verif-compte.com/prime' },
    { de: 'Sécurité du Pôle Nord &lt;<code>securite@pere-noel.noel</code>&gt;', objet: '🔔 Nouvelle connexion à ton compte… depuis un glacier', corps: 'Quelqu\'un s\'est connecté à ton compte cette nuit, depuis un appareil inconnu. Si c\'était toi, ignore ce message. Sinon, va vérifier la liste de tes appareils dans ton espace habituel. Nous ne te demanderons jamais ton mot de passe par message.', lien: 'https://compte.pere-noel.noel/mes-appareils' },
    { de: 'Le Père Noël &lt;<code>atelier@pere-noel-noel.com</code>&gt;', objet: 'Planning de l\'atelier pour la semaine', corps: 'Bonjour à tous ! Le planning de la semaine est disponible : connectez-vous pour le consulter. Merci pour votre super travail. 🎅', lien: 'https://pere-noel-noel.com/atelier/planning' },
    { de: 'Père Noël Officiel &lt;<code>pere.noel.officiel@courriel-gratuit.net</code>&gt;', objet: 'FÉLICITATIONS !!! Vous avez gagné un traîneau électrique 🎁', corps: 'Vous êtes notre 1 000 000e visiteur ! Pour recevoir votre cadeau, payez seulement les frais de livraison (2 €) avec votre carte bancaire.', lien: 'http://pere-noel-cadeaux.com/gagner' },
  ]),
  indices: [
    "Pour chaque lien, isole le nom du site (jusqu'au premier « / »), puis lis-le en partant de la fin. Le vrai site doit se terminer exactement par pere-noel.noel, avec un point juste avant (ou rien du tout).",
    "Méfie-toi des lettres qui se ressemblent (un i majuscule I ressemble à un l minuscule), des tirets qui remplacent un point, et des noms où pere-noel.noel n'est qu'au début. Le vrai message peut avoir l'air inquiétant… mais il ne te demande jamais ton mot de passe.",
  ],
  lecon: `<p>Le seul vrai message était l'<b>alerte de connexion</b> : son lien mène à <code>compte.pere-noel.noel</code>, qui se termine bien par <code>.pere-noel.noel</code> (« compte » n'est qu'une sous-partie du vrai site). Et il ne demande pas de mot de passe : il te conseille d'aller vérifier toi-même.</p>
<p>Le piège le plus sournois était le <b>planning</b> : un message calme et poli, qui menait pourtant à <code>pere-noel-noel.com</code>, un tout autre site ! Un faux message n'est pas forcément urgent, ni plein de fautes.</p>
<p>Les faux messages s'appellent du <b>hameçonnage</b> (<i>phishing</i>) : des pirates imitent une banque, un jeu ou un ami pour te faire cliquer et voler tes informations.</p>
<h4>🔍 Comment lire une adresse</h4>
<div class="schema"><code>https://pere-noel.noel.verif-compte.com/prime</code><br>→ le vrai propriétaire est <b>verif-compte.com</b> (juste avant le premier « / »)</div>
<h4>🚩 Les signaux d'alerte</h4>
<ul>
<li>L'<b>urgence</b> ou la menace (« votre compte sera supprimé ! »)</li>
<li>Un cadeau <b>trop beau</b> pour être vrai</li>
<li>Une demande de <b>mot de passe</b> ou de <b>carte bancaire</b></li>
<li>Des lettres qui se ressemblent : l / I, 0 / O, rn / m</li>
</ul>
<p>⚠️ Le petit cadenas 🔒 (https) veut dire que la connexion est <b>chiffrée</b>… pas que le site est honnête ! Les pirates peuvent aussi avoir un cadenas.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>En cas de doute, ne clique pas : va sur le site officiel en tapant toi-même son adresse.</li>
<li>Une vraie banque ne te demandera jamais ton mot de passe par message.</li>
</ul>`,
  fragment: [7, '01000101'],
},

/* ======================= JOUR 22 ====================== */
{
  jour: 22,
  piece: {"mur":"#132a1a","motif":"bois","sol":"parquet","elements":["ecran","ecran","lucarne"],"meuble":"bureau","objets":["💻","⌨️","🥤"]},
  particules: ['0', '1', '❄️'],
  univers: "Le Repaire de l'Elfe Hacker",
  emoji: '💻',
  couleurs: ['#06150a', '#1b5e20'],
  concept: 'Le terminal et les fichiers',
  givrin: {
    ricane: "J'ai coupé le mot de passe en deux et j'ai caché les morceaux. Un écran noir, pas d'icônes… Tu vas pleurer en vert fluo.",
    piques: [
      "Raté ! Même une souris perdue dans ce terminal aurait trouvé. Ah non, il n'y a pas de souris.",
      "Faux ! Tu as oublié la moitié du mot de passe. Comme la moitié de ton cerveau ?",
      "Non. Tape « help », pauvre petit être. Ou pleure. Les deux marchent.",
    ],
    fuite: "cd /sortie… rm kère… Nooon, pas la commande rm !",
  },
  chrono: 1200,
  histoire: `<p>Dans le Repaire de l'Elfe Hacker, sous les toits du chalet, pas de souris, pas de fenêtres, pas d'icônes : seulement un écran noir et du texte vert. C'est un <b>terminal</b> ! On y donne des ordres à l'ordinateur en tapant des <b>commandes</b>. La <b>Kère</b> tapie sous les toits a volé le mot de passe du jour, l'a <b>coupé en deux</b>… et a caché chaque moitié dans un recoin différent du disque.</p>`,
  cours: `<p>Dans un ordinateur, les fichiers (textes, photos…) sont rangés dans des <b>dossiers</b>, eux-mêmes rangés dans d'autres dossiers, comme des boîtes dans des boîtes.</p>
<p>D'habitude, on ouvre ces dossiers avec la souris, en double-cliquant. Dans un <b>terminal</b>, il n'y a pas de souris : on tape des <b>commandes</b> au clavier, puis on appuie sur <b>Entrée</b> pour les lancer. L'ordinateur répond par écrit, juste en dessous.</p>
<p>À chaque instant, tu te trouves « dans » un dossier, comme dans une pièce : tu peux regarder ce qu'il contient, entrer dans un sous-dossier ou revenir en arrière. La commande <code>help</code> te donnera la liste des commandes possibles.</p>
<p>Deux secrets des terminaux : un nom qui commence par un <b>point</b> (comme <code>.secret</code>) est <b>caché</b> : seule la commande <code>ls -a</code> le montre. Et un chemin qui commence par <code>/</code> part tout en haut, de la <b>racine</b> : <code>/var/log</code> veut dire « le dossier log, dans le dossier var, à la racine », d'où que tu sois.</p>`,
  enigme: `<p>Explore l'ordinateur de l'Elfe pour retrouver les <b>deux moitiés</b> du mot de passe, puis tape-le en entier dans le champ de réponse. Clique dans le terminal, tape <code>help</code> puis appuie sur <b>Entrée</b>.</p>`,
  widget: W.terminal({
    home: {
      elfe: {
        'lisez-moi.txt': "Salut, c'est l'Elfe Hacker ! 👋\n\nLa Kère a volé le mot de passe du jour. Je l'ai suivie à la trace : elle l'a coupé en DEUX moitiés, et elle a caché chaque moitié dans un endroit différent.\n\nRappel des commandes :\n  ls           → voir ce que contient le dossier\n  ls -a        → voir aussi les éléments cachés\n  cd atelier   → entrer dans le dossier « atelier »\n  cd ..        → remonter au dossier parent\n  cat fichier  → lire un fichier\n\nCommence par fouiller mon atelier. Et souviens-toi : cette Kère adore les choses CACHÉES…",
        atelier: {
          'jouets.txt': "Jouets en cours de fabrication :\n- 120 trains en bois\n- 85 peluches\n- 42 robots\n\n(Rien ici… mais tu chauffes !)",
          outils: { 'marteau.txt': 'Un marteau. Juste un marteau. 🔨', 'tournevis.txt': "Un tournevis cruciforme. Rien d'intéressant." },
          '.cachette': { 'note.txt': "Bravo, tu as trouvé ma cachette secrète ! 🕵️\n\nJ'ai sauvé la 1re moitié du mot de passe avant que la Kère ne l'efface :\n\n    GUIR\n\nPour la 2e moitié, la Kère s'est vantée dans le journal du système. Les journaux sont rangés dans le dossier log, lui-même dans le dossier var, tout en haut :\n\n    /var/log\n\nAstuce : un chemin qui commence par / part de la racine. Et la Kère signe toujours ses fichiers… en les cachant." },
        },
        photos: { 'renne.txt': "[Photo floue d'un renne qui fait une grimace] 🦌", '.selfie-gene.txt': "[Selfie de l'Elfe avec un bonnet ridicule]\nFichier caché… mais rien d'utile ici. 😳" },
      },
    },
    etc: {
      'noel-os.conf': "# Configuration de NOËL-OS\nsysteme       = NOËL-OS v24.12\nstatut        = GELÉ ❄️\nsortilege     = KRYOS\nmot_de_passe  = ********  (effacé par la Kère, hi hi)\n",
      hosts: "127.0.0.1     localhost\n10.24.12.25   atelier.pole-nord.noel",
    },
    var: {
      log: {
        'systeme.log': "[22:00] NOËL-OS démarré\n[22:14] Atelier : 120 trains fabriqués\n[23:02] Alerte : température −42 °C\n[23:58] Connexion inconnue depuis le glacier…",
        'traineau.log': "[21:00] Plein de carburant : fait\n[21:30] Rudolph : nez rechargé à 100 %",
        '.kere.log': "[23:59] Kère : hé hé, personne ne lira jamais ce journal caché.\n[23:59] Kère : la 2e moitié du mot de passe ? Planquée dans ma glacière secrète :\n            /tmp/.glaciere/moitie.txt\n[00:00] Kère : qu'ils essaient donc de la trouver ! ❄️😈",
      },
    },
    tmp: {
      'brouillon.txt': 'Liste de courses de la Kère : glaçons, glaçons, glaçons, un bonnet de lutin (pour la collection).',
      '.glaciere': { 'moitie.txt': "Bien joué, petit malin… Voici la 2e moitié :\n\n    LANDE\n\nRecolle les deux moitiés dans l'ordre, et tape le mot de passe complet.\n— La Kère (furieuse)" },
    },
    bin: { ls: '[programme binaire] 01101100 01110011', cat: '[programme binaire] 🐱' },
  }, ['home', 'elfe']),
  reponses: ['c23d9d61e02b11c3981510901060ee53c02d0c3d24d017f4549e5b8a20e24ba8'],
  placeholder: 'Le mot de passe trouvé…',
  indices: [
    "Tape « cat lisez-moi.txt », puis « cd atelier » et « ls -a » : les éléments qui commencent par un point sont cachés. La 1re moitié est dans un dossier caché de l'atelier.",
    "Pour la 2e moitié : « ls -a /var/log » montre un journal caché de la Kère ; lis-le avec « cat », il t'indique le chemin complet de sa cachette. Un chemin qui commence par / se tape tel quel, d'où que tu sois.",
  ],
  lecon: `<p>Le mot de passe était <b>GUIRLANDE</b> ✨ : <code>GUIR</code> dans la cachette de l'atelier, <code>LANDE</code> dans la glacière secrète de la Kère. Tu as utilisé un <b>terminal</b>, comme les informaticiens professionnels !</p>
<p>Les fichiers d'un ordinateur sont rangés dans une <b>arborescence</b> : des dossiers dans des dossiers, comme les branches d'un arbre… à l'envers 🙃</p>
<pre class="code">/                     ← la racine
├── home/
│   └── elfe/         ← « ~ »
│       └── atelier/
│           └── .cachette/
│               └── note.txt
├── var/
│   └── log/
│       └── .kere.log
└── tmp/
    └── .glaciere/
        └── moitie.txt</pre>
<ul>
<li><code>/var/log/.kere.log</code> est un <b>chemin absolu</b> (il part de la racine) ; <code>atelier/jouets.txt</code> est un <b>chemin relatif</b> (il part du dossier où tu te trouves).</li>
<li><code>..</code> désigne le dossier parent.</li>
<li>Les fichiers qui commencent par un point sont <b>cachés</b> : ce sont souvent des réglages qu'on ne veut pas voir tout le temps… ou des cachettes de Kère.</li>
<li>Le dossier <code>/var/log</code> contient les <b>journaux</b> (<i>logs</i>) : le carnet de bord où l'ordinateur note tout ce qui se passe. C'est le premier endroit où regardent les enquêteurs informatiques !</li>
</ul>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>La grande majorité des serveurs d'Internet tournent sous <b>Linux</b>… et on les pilote avec un terminal.</li>
<li>Ton ordinateur a aussi un terminal : « Terminal » sur Mac et Linux, « PowerShell » sur Windows. Essaie <code>ls</code> (ou <code>dir</code>) !</li>
<li>Les commandes <code>ls</code>, <code>cd</code> et <code>cat</code> existent depuis les années 1970 (système Unix) et n'ont presque pas changé.</li>
</ul>`,
  fragment: [21, '01000011'],
},

/* ======================= JOUR 23 ====================== */
{
  jour: 23,
  piece: {"mur":"#0f3a5a","motif":"metal","sol":"metal","elements":["etageres:⚗️🧪🔋","ecran","robot"],"meuble":"table","objets":["🔬","⚙️","🤖"]},
  particules: ['🤖', '⚙️', '✨'],
  univers: "Le Laboratoire du Lutin-Robot",
  emoji: '🤖',
  couleurs: ['#014a80', '#29a8e0'],
  concept: "L'intelligence artificielle (apprendre par l'exemple)",
  givrin: {
    ricane: "Ton lutin-robot n'a aucune règle. Il ne devinera jamais rien… comme toi. Vous allez bien vous entendre.",
    piques: [
      "Faux ! Les rennes boudent. Ils boudent très fort. Ils mordent, aussi.",
      "Raté. Même un grille-pain apprendrait plus vite que toi.",
      "Non ! Ta règle marche pour la moitié des exemples. Moi aussi, je suis gentille la moitié du temps. C'est-à-dire jamais.",
    ],
    fuite: "Il apprend… il apprend tout seul ! Même moi, il m'a devinée ! Je file !",
  },
  chrono: 1200,
  histoire: `<p>Au Laboratoire, un <b>robot intelligent</b> doit deviner quels jouets plaisent aux rennes. Personne ne lui a donné de règle : on lui a seulement montré des <b>exemples</b>. La Kère ricane : cette fois, la règle n'est pas toute simple… À toi de faire comme le robot : trouve la règle cachée !</p>`,
  cours: `<p>D'habitude, pour qu'un ordinateur fasse quelque chose, un humain lui écrit des <b>règles</b> précises. Mais certaines règles sont presque impossibles à écrire : comment expliquer à une machine ce qui fait qu'une photo montre un chat ?</p>
<p>Avec l'<b>apprentissage automatique</b>, on fait autrement : on montre à la machine plein d'<b>exemples avec la bonne réponse</b> (« ceci est un chat », « ceci n'est pas un chat »), et c'est elle qui cherche une règle qui marche pour tous ces exemples. Exactement comme un petit enfant qui apprend à reconnaître les chiens après en avoir vu beaucoup.</p>
<p>Pour trouver une règle cachée, compare les exemples : qu'ont en commun ceux qui ont la même réponse ? Et qu'est-ce qui les distingue des autres ?</p>
<p>Parfois, une seule question ne suffit pas, et la règle ressemble à un petit jeu de questions en chaîne : « Est-ce qu'il pleut ? Si oui, est-ce que j'ai un parapluie ? Si non, est-ce qu'il fait froid ? » La deuxième question <b>dépend</b> de la réponse à la première. Une astuce : sépare les exemples en deux groupes selon une caractéristique, puis cherche une règle <b>dans chaque groupe</b>.</p>`,
  enigme: `<p><b>Les exemples montrés au robot :</b></p>
<div class="defilement"><table class="tableau table-ia">
<tr><th>Jouet</th><th>Couleur</th><th>Fait du bruit ?</th><th>Taille</th><th>Les rennes…</th></tr>
<tr><td>🔔 Clochette</td><td>rouge</td><td>oui</td><td>petite</td><td>❤️ adorent</td></tr>
<tr><td>🥁 Tambour</td><td>bleu</td><td>oui</td><td>grand</td><td>😐 bof</td></tr>
<tr><td>🧸 Peluche</td><td>rouge</td><td>non</td><td>grande</td><td>❤️ adorent</td></tr>
<tr><td>🛎️ Grelot</td><td>vert</td><td>oui</td><td>petit</td><td>❤️ adorent</td></tr>
<tr><td>⚽ Ballon</td><td>vert</td><td>non</td><td>petit</td><td>😐 bof</td></tr>
<tr><td>🎺 Trompette</td><td>rouge</td><td>oui</td><td>grande</td><td>😐 bof</td></tr>
<tr><td>🎹 Petit piano</td><td>bleu</td><td>oui</td><td>petit</td><td>❤️ adorent</td></tr>
<tr><td>🧊 Cube</td><td>bleu</td><td>non</td><td>petit</td><td>😐 bof</td></tr>
<tr><td>🍎 Pomme en bois</td><td>rouge</td><td>non</td><td>petite</td><td>❤️ adorent</td></tr>
<tr><td>📯 Grande corne</td><td>verte</td><td>oui</td><td>grande</td><td>😐 bof</td></tr>
</table></div>
<p><b>Les nouveaux jouets</b> (chacun porte une lettre) :</p>
<div class="defilement"><table class="tableau table-ia">
<tr><th>Lettre</th><th>Jouet</th><th>Couleur</th><th>Fait du bruit ?</th><th>Taille</th></tr>
<tr><td><b>L</b></td><td>🎷 Saxophone</td><td>bleu</td><td>oui</td><td>petit</td></tr>
<tr><td><b>X</b></td><td>🔔 Grosse cloche</td><td>verte</td><td>oui</td><td>grande</td></tr>
<tr><td><b>U</b></td><td>🪀 Yoyo</td><td>rouge</td><td>non</td><td>petit</td></tr>
<tr><td><b>A</b></td><td>📕 Livre</td><td>bleu</td><td>non</td><td>grand</td></tr>
<tr><td><b>G</b></td><td>🎻 Violon</td><td>rouge</td><td>oui</td><td>petit</td></tr>
<tr><td><b>T</b></td><td>🎸 Guitare</td><td>rouge</td><td>oui</td><td>grande</td></tr>
<tr><td><b>E</b></td><td>🧣 Écharpe</td><td>rouge</td><td>non</td><td>grande</td></tr>
</table></div>
<p>Quels nouveaux jouets les rennes vont-ils adorer ? <b>Leurs lettres, dans l'ordre, forment le mot de passe.</b></p>`,
  reponses: ['8aed39df1ddd3e19ed1d58a7b4c154df840f93147d46cd12d3cd8c347082c523'],
  placeholder: 'Le mot formé…',
  indices: [
    "Sépare les exemples en deux groupes : ceux qui font du bruit et ceux qui n'en font pas. Dans chacun des deux groupes, cherche ce qui distingue les ❤️ des 😐 (ce n'est pas la même chose dans les deux groupes !).",
    "Parmi les jouets bruyants, seuls les petits sont adorés. Parmi les silencieux, seuls les rouges sont adorés. Applique cette double règle aux nouveaux jouets.",
  ],
  lecon: `<p>La règle cachée était un petit <b>arbre de décision</b> :</p>
<pre class="code">Il fait du bruit ?
├── oui → adoré s'il est PETIT
└── non → adoré s'il est ROUGE</pre>
<p>Les jouets adorés sont donc L (saxophone, bruyant et petit), U (yoyo, silencieux et rouge), G (violon, bruyant et petit) et E (écharpe, silencieuse et rouge) → <b>LUGE</b> 🛷. Les pièges : la guitare est rouge… mais bruyante et grande ; le saxophone est bleu… mais ça ne compte pas pour un jouet bruyant !</p>
<p>Tu viens de faire ce que fait une <b>intelligence artificielle</b> : de l'<b>apprentissage automatique</b> (<i>machine learning</i>). Au lieu d'écrire la règle à la main, on montre à la machine des <b>exemples étiquetés</b> (« adorent » / « bof »), et elle trouve elle-même une règle qui les explique. Puis elle l'applique à des cas qu'elle n'a jamais vus.</p>
<ul>
<li>Les informations sur chaque jouet (couleur, bruit, taille) s'appellent des <b>caractéristiques</b>.</li>
<li>Les <b>arbres de décision</b> comme celui-ci sont l'une des méthodes d'apprentissage les plus utilisées : on peut les lire et comprendre pourquoi la machine a décidé.</li>
</ul>
<h4>⚠️ Le danger des biais</h4>
<p>Si on n'avait montré au robot que des jouets bleus et silencieux, il n'aurait jamais pu savoir si les rennes détestent le bleu ou le silence. Une IA n'est jamais meilleure que ses exemples : s'ils sont incomplets ou injustes, elle apprendra une règle fausse ou injuste. C'est ce qu'on appelle un <b>biais</b>.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Le filtre anti-spam de ta messagerie a appris à partir de millions d'e-mails marqués « spam » ou « pas spam ».</li>
<li>Les recommandations de vidéos et de musique apprennent à partir de ce que tu as aimé.</li>
<li>Les assistants conversationnels ont appris à partir d'immenses quantités de textes, grâce à des « réseaux de neurones » de milliards de paramètres.</li>
</ul>`,
  fragment: [1, '01001100'],
},

/* ======================= JOUR 24 ====================== */
{
  jour: 24,
  piece: {"mur":"#5c1a1a","motif":"papier","sol":"tapis","elements":["fenetre","sapin","cheminee"],"meuble":null,"objets":[]},
  particules: ['⭐', '✨', '❄️'],
  univers: "Le Grand Salon",
  emoji: '⭐',
  couleurs: ['#8a6100', '#e8b923'],
  concept: 'La grande finale',
  givrin: {
    nom: "Kryos",
    ricane: "Mes Kères ont fui ? Tant mieux : je n'aurai pas à partager. L'étoile est à moi… et toi, tu feras une très jolie statue de glace dans mon salon.",
    piques: [
      "Faux. Encore une erreur, et je te range à côté des lutins, dans mon congélateur.",
      "Tu trembles ? C'est normal : il fait −80 °C dans mon cœur. Quand j'en avais un.",
      "Mille ans dans un glacier pour finir face à toi… J'en pleurerais de rire, si mes larmes ne gelaient pas.",
    ],
    fuite: "Nooon ! Cette lumière… Je reviendrai… dans mille ans… avec un manteau plus chaud !",
  },
  histoire: `<p>C'est le grand soir ! Te voici dans le Grand Salon, devant le sapin. <b>Kryos</b> est là, drapé dans un manteau de glace, une main posée sur <b>l'étoile éteinte</b>. Il y a mille ans, c'est une <b>formule secrète</b> qui l'a enfermé dans son glacier, la seule capable de rallumer l'étoile. Alors il l'a découpée en <b>23 fragments</b> et l'a confiée à ses Kères… sans savoir que chaque Kère, en s'enfuyant, t'en a laissé un !</p>`,
  cours: `<p>Dernière ligne droite ! Chaque fragment que tu as gagné contient une lettre et sa <b>position</b> dans la formule secrète, écrite en <b>binaire</b> sur 5 places. Comme au jour 1, additionne les places où il y a un 1 :</p>
<div class="defilement"><table class="tableau compact">
<tr><th>16</th><th>8</th><th>4</th><th>2</th><th>1</th><th>Position</th></tr>
<tr><td>0</td><td class="allume">1</td><td>0</td><td>0</td><td class="allume">1</td><td>8 + 1 = <b>9</b></td></tr>
<tr><td class="allume">1</td><td>0</td><td class="allume">1</td><td>0</td><td>0</td><td>16 + 4 = <b>20</b></td></tr>
</table></div>
<p>Place ensuite chaque lettre dans la case qui porte ce numéro. Les cases ne contiennent que des lettres, sans espaces : quand tout sera en place, à toi de repérer les mots !</p>`,
  enigme: `<p>Chaque fragment est une lettre accompagnée de sa <b>position</b> dans la formule secrète… écrite en <b>binaire</b> (merci le jour 1 !). Remets les lettres dans l'ordre pour reconstituer la formule, puis rallume l'étoile.</p>`,
  widget: W.finale(23),
  reponses: ['22cbd35071bff0460b8fdd2c952cf7f9d3e2d7ca2fbc10d1dde07b318b647124'],
  sansChamp: true,
  indices: [
    "Convertis chaque position binaire en nombre : 00001 = 1, 00010 = 2, 00011 = 3, 00100 = 4… (les ampoules valent 16, 8, 4, 2, 1).",
    "C'est une formule magique en latin, la langue des vieux grimoires. Elle fait 4 mots, et le premier veut dire « lumière ».",
  ],
  lecon: `<p class="grand">🌟 « Lux aeterna glaciem vincit ! » 🌟</p>
<p class="centre petit">« La lumière éternelle triomphe de la glace » : la formule latine qui avait déjà enfermé Kryos il y a mille ans ✨</p>
<div class="fin-de-lettre">
<h4>📜 La glace fond… et la fin de la lettre du Père Noël réapparaît !</h4>
<div class="scene-lettre"><div class="lettre-pole-nord lettre-degel">
<p><span class="deja">Mais surtout, quoi qu'il arrive, ne</span> perds jamais courage. Kryos se nourrit de découragement : chaque fois que quelqu'un abandonne, l'hiver gagne un peu de terrain. Mais chaque fois que quelqu'un comprend une chose nouvelle, une étincelle s'allume, et le froid recule.</p>
<p class="appel">Je compte sur toi. Tous les enfants du monde comptent sur toi.</p>
<div class="bas-lettre"><div class="sceau" aria-hidden="true">PN</div><div class="signature"><span class="nom-signature">Le Père Noël</span>{{PARAPHE}}</div></div>
<p class="ps">P.-S. : Méfie-toi de Kryos. Il est rusé… et il déteste perdre.</p>
</div></div>
<h4>✉️ Et ce soir, le Père Noël t'écrit une dernière lettre…</h4>
<div class="scene-lettre"><div class="lettre-pole-nord lettre-finale">
<p class="entete-lettre">Pôle Nord, le 24 décembre,<br>au pied du sapin</p>
<p class="salutation">{{PRENOM}},</p>
<p>Tu l'as fait ! L'étoile brille de nouveau au sommet du sapin. En la voyant s'allumer, <b>Kryos</b> a poussé un hurlement terrible, puis il s'est enfui dans son glacier, qui s'est refermé sur lui. Pour mille ans, au moins !</p>
<p>Ses Kères ont fondu comme neige au soleil, et les murs de nos cachots avec elles : mes lutins sont libres, et moi aussi ! NOËL-OS ronronne, l'atelier tourne à plein régime, et mes rennes piaffent d'impatience devant le traîneau.</p>
<p>Tu n'as jamais perdu courage, même quand Kryos a gelé la fin de ma lettre. La prophétie disait vrai : tu es bien le Sauveur de Noël. Et en chemin, tu as appris des choses que les meilleurs lutins mettent des années à comprendre.</p>
<p>Cette nuit, quand le traîneau passera au-dessus de chez toi, lève les yeux : je ferai sonner mes clochettes rien que pour toi.</p>
<p class="appel">Joyeux Noël, et merci pour tout !</p>
<div class="bas-lettre"><div class="sceau" aria-hidden="true">PN</div><div class="signature"><span class="nom-signature">Le Père Noël</span>{{PARAPHE}}</div></div>
<p class="ps">P.-S. : Les lutins ont voté à l'unanimité : tu deviens Grand Lutin d'Honneur du Pôle Nord ! 🎖️</p>
</div></div>
</div>
<p>Pour cette dernière énigme, tu as converti du binaire (jour 1) et remis des morceaux dans l'ordre comme le fait TCP (jour 14). En 24 jours, voici tout ce que tu as découvert :</p>
{{RECAP}}
<h4>🧑‍🔬 Deux pionniers à connaître</h4>
<ul>
<li><b>Ada Lovelace</b> écrit en 1843 le premier programme informatique de l'histoire… pour une machine qui n'a jamais été construite !</li>
<li><b>Alan Turing</b> décrit en 1936 une machine imaginaire capable de calculer tout ce qui est calculable : l'idée même de l'ordinateur.</li>
</ul>
<h4>🚀 Et maintenant ?</h4>
<ul>
<li><b>Scratch</b> (scratch.mit.edu) pour créer des jeux en assemblant des blocs ;</li>
<li><b>France-IOI</b> (france-ioi.org) pour apprendre Python et l'algorithmique pas à pas ;</li>
<li>le <b>concours Castor</b> et <b>Algoréa</b>, des défis d'informatique ludiques ;</li>
<li><b>Root-Me</b> (root-me.org) pour les challenges de cybersécurité, quand tu voudras devenir un vrai hacker éthique 🕵️</li>
</ul>
<p class="grand">Joyeux Noël ! 🎄</p>`,
  fragment: null,
},

];

module.exports = JOURS;
