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
// Le tableau ASCII des majuscules (lettre + code binaire), affiché au mur du Bureau du Courrier (jour 2).
const tableAscii = () => '<div class="table-ascii">' + [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(l => `<span><b>${l}</b><code>${l.charCodeAt(0).toString(2).padStart(8, '0')}</code></span>`).join('') + '</div>';
// L'alphabet numéroté (A = 1 … Z = 26), en rappel sous l'énigme du sceau (jour 20).
const tableAlphabet = () => '<div class="table-ascii rangs">' + [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((l, i) => `<span><b>${l}</b><code>${i + 1}</code></span>`).join('') + '</div>';

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
  histoire: `<p>Ce matin, impossible d'entrer dans l'atelier : une <b>Kère</b> de Kryos a remplacé la serrure par une <b>guirlande de 8 ampoules</b>. Pour ouvrir, il faut allumer les bonnes ampoules… dans la langue des ordinateurs : le <b>binaire</b> !</p>`,
  cours: `<p>Pour écrire nos nombres, on utilise <b>10 chiffres</b> (de 0 à 9), et la <b>place</b> d'un chiffre change sa valeur. Dans <code>352</code>, le 3 vaut 300, le 5 vaut 50 et le 2 vaut 2.</p>
<p>Un ordinateur, lui, est rempli de minuscules interrupteurs qui n'ont que deux positions : <b>allumé</b> ou <b>éteint</b>. Il écrit donc tout avec seulement <b>deux chiffres</b> : <b>1</b> pour allumé, <b>0</b> pour éteint. C'est le <b>binaire</b>.</p>
<p>Imagine une guirlande de 8 ampoules. Chaque ampoule a sa valeur, et chacune vaut <b>le double</b> de sa voisine de droite : 1, 2, 4, 8, 16, 32, 64, 128. Le nombre écrit, c'est <b>le total des ampoules allumées</b> :</p>
<div class="defilement"><table class="tableau compact">
<tr><th>128</th><th>64</th><th>32</th><th>16</th><th>8</th><th>4</th><th>2</th><th>1</th><th>Total</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td class="allume">1</td><td>0</td><td class="allume">1</td><td>4 + 1 = <b>5</b></td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td class="allume">1</td><td>0</td><td class="allume">1</td><td>0</td><td>8 + 2 = <b>10</b></td></tr>
<tr><td class="allume">1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td><b>128</b></td></tr>
</table></div>
<p><b>Pour écrire un nombre</b>, c'est comme rendre la monnaie avec des pièces de 128, 64, 32, 16, 8, 4, 2 et 1 : prends la plus grande ampoule qui ne dépasse pas ton nombre, allume-la, et recommence avec ce qui reste.</p>
<p>Exemple avec <b>6</b> : la plus grande ampoule qui ne dépasse pas 6, c'est 4. Il reste 6 − 4 = 2 : on allume la 2. Il ne reste rien ! Donc 6 = 4 + 2 = <code>00000110</code>.</p>`,
  enigme: `<p>Sur la porte de l'atelier, la Kère a épinglé ce mot :</p>
<blockquote class="note">« Le code de ma serrure ? Le <b>jour de Noël</b>, tout simplement. Enfin… si Noël arrive un jour cette année. Hi hi hi ! » <br><i>— La Kère de l'atelier</i></blockquote>
<p>Le jour de Noël, c'est le <b>25 décembre</b>. Allume les ampoules pour que leur total fasse <b>25</b>, puis essaie d'ouvrir la porte !</p>
<div class="rappel">📌 <b>Rappel</b> : de gauche à droite, les ampoules valent <code>128 · 64 · 32 · 16 · 8 · 4 · 2 · 1</code>. Chaque ampoule allumée ajoute sa valeur au total.</div>`,
  widget: W.ampoules(),
  indices: [
    "Commence par la plus grande ampoule qui ne dépasse pas 25 : c'est la 16. Il reste alors 25 − 16 = 9 à trouver.",
    "9 = 8 + 1. Allume donc les ampoules 16, 8 et 1 : 16 + 8 + 1 = 25.",
  ],
  lecon: `<p>Bravo ! Le jour de Noël, en binaire, s'écrit :</p>
<div class="schema"><code>0 0 0 1 1 0 0 1</code> = 16 + 8 + 1 = <b>25</b></div>
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
  histoire: `<p>Au Bureau du Courrier du chalet, la Kère a soufflé sur l'imprimante à étiquettes. Gelée jusqu'aux circuits, elle n'imprime plus de lettres… seulement des <b>0</b> et des <b>1</b> !</p>`,
  cours: `<p>Tu l'as vu au jour 1 : un ordinateur ne sait garder que des <b>nombres</b>, écrits en binaire. Alors comment fait-il pour retenir des lettres, comme ton prénom ?</p>
<p>Le monde entier s'est mis d'accord sur un grand tableau de correspondance, le <b>tableau ASCII</b> : chaque lettre y reçoit un code de 8 chiffres binaires (un <b>octet</b>). C'est comme un code secret de cour de récré, partagé par tous les ordinateurs de la planète !</p>
<div class="defilement"><table class="tableau compact">
<tr><th>Lettre</th><th>Numéro</th><th>Code binaire</th></tr>
<tr><td><b>A</b></td><td>65</td><td><code>01000001</code></td></tr>
<tr><td><b>B</b></td><td>66</td><td><code>01000010</code></td></tr>
<tr><td><b>C</b></td><td>67</td><td><code>01000011</code></td></tr>
<tr><td colspan="3">… et ainsi de suite, dans l'ordre de l'alphabet, jusqu'à Z</td></tr>
</table></div>
<p>Pour lire un mot écrit en binaire, on le découpe en groupes de 8 chiffres : <b>un groupe = une lettre</b>. Puis on cherche chaque groupe dans le tableau.</p>
<p>Exemple : <code>01000010 · 01000001 · 01000011</code> → B, A, C → <b>BAC</b>.</p>`,
  enigme: `<p>Il faut absolument savoir quel cadeau se cache dans ce colis. Voici son étiquette : <b>5 groupes de 8 chiffres, donc 5 lettres</b>.</p>
<div class="etiquette-colis binaire">01010010 · 01001111 · 01000010 · 01001111 · 01010100</div>
<p>Heureusement, le tableau ASCII des lutins est affiché au mur du bureau :</p>
${tableAscii()}
<p>Cherche chaque groupe de l'étiquette dans le tableau. <b>Quel est le cadeau ?</b></p>`,
  reponses: ['1746b0affbe4a8883e44fede0b5d3f7c691c0f93de62516a959119a7466583e2', '363f0118362bc2065d10f66edfd019c3308903b9e1f9330ad9ab2bd14d8499e6'],
  placeholder: 'Le cadeau…',
  indices: [
    "Le premier groupe de l'étiquette, 01010010, est dans le tableau à côté de la lettre R. Fais pareil avec les 4 autres groupes.",
    "R, O, B, O… Il ne manque que la dernière lettre : cherche 01010100 dans le tableau. C'est un jouet qui marche tout seul !",
  ],
  lecon: `<p>Il suffisait de chercher chaque groupe dans le tableau : <code>01010010</code> = R, <code>01001111</code> = O, <code>01000010</code> = B, <code>01001111</code> = O, <code>01010100</code> = T → <b>ROBOT</b> !</p>
<p>As-tu remarqué que tous les groupes commencent par <code>010</code> ? Pour les majuscules, les 5 derniers chiffres donnent directement la place de la lettre dans l'alphabet : R = <code>10010</code> = 16 + 2 = 18, la 18ᵉ lettre. Les inventeurs du tableau l'ont fait exprès !</p>
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
    ricane: "Une roue, une lettre d'enfant, zéro espoir. J'adore les vœux qui ne se réalisent jamais.",
    piques: [
      "Faux. Ce gamin recevra des chaussettes. Par ta faute.",
      "Tourne, tourne ma jolie roue… et tourne en rond.",
      "Même César abandonnerait. Remarque, lui, il a fini poignardé : il avait l'habitude des mauvaises surprises.",
    ],
    fuite: "Ma roue, brisée comme du verre ! Je file à la cave chiffrer mon testament.",
  },
  histoire: `<p>Dans le Grenier aux Lettres, entre deux vieilles malles, on a retrouvé la lettre d'un enfant au Père Noël… mais la <b>Kère</b> du grenier l'a <b>chiffrée</b> avec le code de César : chaque lettre a avancé du même nombre de crans dans l'alphabet. Plus personne ne peut la lire !</p>`,
  cours: `<p><b>Chiffrer</b> un message, c'est le transformer pour que seuls ceux qui connaissent le secret puissent le relire. Ce secret s'appelle la <b>clé</b>.</p>
<p>La méthode de la Kère est l'une des plus anciennes : on fait avancer chaque lettre dans l'alphabet du même nombre de crans. Avec une clé de 3 :</p>
<div class="schema"><code>A → D &nbsp; B → E &nbsp; C → F &nbsp; … &nbsp; X → A &nbsp; Y → B &nbsp; Z → C</code></div>
<p>Arrivé au Z, on repart au début de l'alphabet, comme sur une <b>roue</b>. Avec cette clé, <code>NOEL</code> devient <code>QRHO</code>.</p>
<p>Pour <b>déchiffrer</b>, on fait le chemin inverse : on recule chaque lettre du même nombre de crans.</p>
<p>Et si on ne connaît pas la clé ? On peut essayer les 25 clés une par une… ou être malin : si on devine <b>un seul mot</b> du message, on trouve la clé tout de suite !</p>`,
  enigme: `<p>Voici la lettre chiffrée par la Kère. Bonne nouvelle : on sait comment commencent les lettres au Père Noël !</p>
<blockquote class="note">💡 Le premier mot de la lettre est <b>CHER</b>. Le premier K chiffré doit donc redevenir un <b>C</b>.</blockquote>
<p>Tourne la roue jusqu'à ce que le premier mot devienne <b>CHER</b> : tout le message apparaîtra. <b>Quel cadeau l'enfant a-t-il demandé ?</b></p>`,
  widget: W.cesar('KPMZ XMZM VWMT, KMBBM IVVMM RM DWCLZIQA CVM OCQBIZM MTMKBZQYCM XWCZ RWCMZ LC ZWKS LIVA UI KPIUJZM. UMZKQ ! TWC', 1),
  reponses: ['8c7d9ed08f8a5ac97b1a43e480c52dc8fde6f010858680f3fccf0a3914a7bf51', 'd92902f496b0162d259e8ec84265b39d66cdd357827b0d5c8c01432b9dc2b3bd', '723c64647a2ecb32dcc93edbfaf34cdde384d13f6a197053d6da5aba50569227', '69e4c83b0f7ecf172e9b01696f844e03d99a96197060febd8567624c2b89930c'],
  placeholder: 'Le cadeau demandé…',
  indices: [
    "Le premier mot chiffré est KPMZ. Tourne la roue jusqu'à ce qu'il devienne CHER : le K doit redevenir C.",
    "Il faut reculer chaque lettre de 8 crans, comme les 8 rennes du Père Noël ! Le cadeau est écrit juste après « JE VOUDRAIS UNE ».",
  ],
  lecon: `<p>La clé était <b>8</b>, comme les rennes du traîneau ! Avec le code de César, il n'y a que <b>25</b> clés possibles : on peut toutes les essayer en quelques minutes. Alors on a inventé mieux : le <b>chiffre de Vigenère</b> (1586) utilise plusieurs clés à tour de rôle. Il a été surnommé pendant près de 300 ans « le chiffre indéchiffrable » !</p>
<h4>🕵️ Comment l'as-tu cassé ?</h4>
<p>Grâce à une erreur de la Kère : toutes les lettres au Père Noël commencent par « CHER ». Connaître un morceau du message permet de retrouver la clé : c'est une <b>attaque par texte connu</b>. C'est ainsi qu'Alan Turing et son équipe ont cassé la machine allemande <b>Enigma</b> pendant la Seconde Guerre mondiale : beaucoup de messages commençaient par le bulletin météo !</p>
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
  concept: 'Les pixels et les couleurs (RVB)',
  givrin: {
    ricane: "J'ai vidé la machine de ses couleurs. Ton sapin sera gris, ta neige grise, et ton Noël… gris comme mon âme.",
    piques: [
      "Raté ! Encore une boule fichue : je la garde pour ma collection d'horreurs.",
      "Tu mélanges les couleurs comme un lutin daltonien. Remarque, ils sont tous congelés : ils ne voient plus rien.",
      "Cette couleur s'appelle « gris défaite ». Très tendance cette année.",
    ],
    fuite: "Trop de couleurs ! Mes yeux ! Je retourne dans la nuit polaire, au moins elle est noire…",
  },
  histoire: `<p>Dans l'Atelier de Peinture, la Kère a effacé tous les réglages de la machine qui peint les boules du sapin : elles sortent toutes <b>grises</b> ! Pour la relancer, il faut lui donner le bon <b>code couleur</b>.</p>`,
  cours: `<p>Regarde ton écran de très près (avec une loupe, c'est encore mieux) : il est fait de millions de petits points, les <b>pixels</b>. Chaque pixel contient <b>3 minuscules lampes</b> : une <span class="r">rouge</span>, une <span class="g">verte</span> et une <span class="b">bleue</span>. En les allumant plus ou moins fort, l'écran fabrique toutes les couleurs.</p>
<p>⚠️ Ici, on mélange de la <b>lumière</b>, pas de la peinture : les règles ne sont pas celles des pots de gouache ! Voici ce que donnent les lampes allumées à fond :</p>
<div class="defilement"><table class="tableau compact">
<tr><th>Lampes allumées</th><th>Couleur obtenue</th></tr>
<tr><td><span class="r">rouge</span> + <span class="g">vert</span></td><td>🟡 <b>jaune</b></td></tr>
<tr><td><span class="r">rouge</span> + <span class="b">bleu</span></td><td>🟣 <b>magenta</b> (rose violet)</td></tr>
<tr><td><span class="g">vert</span> + <span class="b">bleu</span></td><td>🩵 <b>cyan</b> (bleu ciel)</td></tr>
<tr><td>les trois</td><td>⚪ <b>blanc</b></td></tr>
<tr><td>aucune</td><td>⚫ <b>noir</b></td></tr>
</table></div>
<p>Pour régler les lampes, l'ordinateur utilise un <b>code couleur</b> de 3 paires de caractères, toujours dans l'ordre <span class="r">rouge</span>, <span class="g">vert</span>, <span class="b">bleu</span>. Pas besoin de calculer : <code>00</code> = lampe <b>éteinte</b> et <code>FF</code> = lampe <b>à fond</b>.</p>
<p>Exemples : <code>#0000FF</code> = rouge éteint, vert éteint, bleu à fond → du <b>bleu</b>. Et <code>#FF00FF</code> = rouge à fond, vert éteint, bleu à fond → du <b>magenta</b>.</p>`,
  enigme: `<p>La commande du jour est épinglée sur la machine :</p>
<blockquote class="note">🎄 « Une boule <b>JAUNE</b>, bien brillante, pour le sommet du sapin ! » <br><i>— Les lutins décorateurs</i></blockquote>
<div class="rappel">📌 <b>Rappel</b> : un code couleur = 3 paires, dans l'ordre <span class="r">Rouge</span>, <span class="g">Vert</span>, <span class="b">Bleu</span>. <code>00</code> = lampe éteinte, <code>FF</code> = lampe à fond.</div>
<p>Tape un code dans le champ : la boule d'essai prend la couleur en direct. <b>Quel code donne une boule jaune ?</b></p>`,
  widget: W.couleur(),
  reponses: ['67bc6c9e0281772c053b894fec941c34e8e09f1a25c618442013a3114b28d6b9', '566f54f819dabdb3f4c66f13bee24db3df0b00a635270a90077e4c8a530512e4'],
  placeholder: '#RRVVBB',
  indices: [
    "Regarde le tableau du petit cours : avec de la lumière, le jaune s'obtient en allumant le rouge et le vert.",
    "Rouge à fond (FF), vert à fond (FF), bleu éteint (00) : le code est #FFFF00.",
  ],
  lecon: `<p>Il fallait taper <code>#FFFF00</code> : <span class="r">rouge à fond</span>, <span class="g">vert à fond</span>, <span class="b">bleu éteint</span>. Surprenant, non ? Avec de la peinture, rouge + vert donnerait du marron ; avec de la lumière, ça donne du <b>jaune</b> !</p>
<p>On parle de synthèse <b>additive</b> pour la lumière (on ajoute des lumières : ça s'éclaircit, jusqu'au blanc) et <b>soustractive</b> pour la peinture (on mélange des pigments : ça s'assombrit). Ce système à 3 lampes s'appelle le <b>RVB</b> (<i>RGB</i> en anglais).</p>
<p>Les codes sont écrits en <b>hexadécimal</b> : on y compte avec 16 chiffres, de 0 à 9 puis A, B, C, D, E, F. <code>FF</code> vaut 255, le plus grand nombre à 2 caractères (comme 99 pour nous). Chaque lampe a donc 256 niveaux, un octet comme au jour 1 ! Et 256 × 256 × 256 = <b>16 777 216</b> couleurs possibles.</p>
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
    ricane: "Trois interrupteurs, un circuit, et moi au milieu. Touche le mauvais fil, et on rira. Surtout moi.",
    piques: [
      "Bzzzt ! Raté. Tu sens cette odeur de grillé ? C'est ton raisonnement.",
      "NON, NON et encore NON. C'est ma porte logique préférée.",
      "Continue d'essayer au hasard. Un singe y arriverait aussi… un jour.",
    ],
    fuite: "Le courant passe ?! Arrête, ça chatouille… ça grésille… je disjoncte !",
  },
  histoire: `<p>Au sous-sol, la porte blindée de la Réserve aux Jouets est protégée par un <b>circuit électronique</b>. La Kère l'a recâblé : <b>trois interrupteurs</b> (A, B et C) envoient du courant dans <b>trois portes logiques</b>. Il faut que les trois s'allument en même temps pour que l'étoile s'éclaire et que la porte s'ouvre.</p>`,
  cours: `<p>Pour prendre ses décisions, un ordinateur utilise des milliards de <b>portes logiques</b>. Une porte logique reçoit un ou deux signaux, chacun <b>allumé (1)</b> ou <b>éteint (0)</b>, et n'en laisse sortir qu'un seul, selon une règle très simple. Tu utilises déjà ces règles tous les jours sans le savoir :</p>
<div class="defilement"><table class="tableau">
<tr><th>Porte</th><th>Elle s'allume si…</th><th>Dans la vie</th></tr>
<tr><td><b>ET</b></td><td class="gauche">les <b>deux</b> entrées sont allumées</td><td class="gauche">J'ai mon ticket ET le bus est là → je monte.</td></tr>
<tr><td><b>OU</b></td><td class="gauche"><b>au moins une</b> entrée est allumée (ou les deux)</td><td class="gauche">On sonne à la porte de devant OU à celle de derrière → ça sonne.</td></tr>
<tr><td><b>NON</b></td><td class="gauche">son entrée est <b>éteinte</b> : elle fait l'inverse</td><td class="gauche">Il ne fait PAS jour → la veilleuse s'allume.</td></tr>
</table></div>
<p>Exemple : la porte <code>A ET B</code> ne s'allume que si l'interrupteur A <b>et</b> l'interrupteur B sont allumés tous les deux.</p>`,
  enigme: `<p>Allume les <b>trois portes</b> en même temps pour rallumer l'étoile ! Lis bien chaque porte : elle te dit quels interrupteurs il faut allumer… ou éteindre.</p>`,
  widget: W.portes(),
  indices: [
    "P1 (A ET B) ne s'allume que si A et B sont allumés tous les deux. Et P2 (NON C) veut que C soit éteint.",
    "A allumé, B allumé, C éteint : P1, P2 et P3 s'allument toutes les trois !",
  ],
  lecon: `<p>La solution était <b>A = 1, B = 1, C = 0</b>. P1 (une porte ET) exigeait A et B allumés ; P2 (une porte NON) exigeait C éteint ; et P3 (une porte OU) se contentait de B allumé.</p>
<p>Les portes ET, OU, NON suivent l'<b>algèbre de Boole</b>, inventée par George Boole en 1854… presque 100 ans avant le premier ordinateur !</p>
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
    ricane: "J'ai siphonné le carburant du traîneau. Il en reste juste assez pour quelqu'un de malin. Pas pour toi.",
    piques: [
      "Panne sèche ! Le traîneau reste au garage et les enfants pleurent. Délicieux.",
      "Tu échanges les paquets comme on bat les cartes : au hasard, et en perdant.",
      "Encore en panne ! Je vais finir par te vendre du carburant… très, très cher.",
    ],
    fuite: "Tout est rangé et il reste du carburant ?! Je file, avant que tu me ranges dans un carton moi aussi !",
  },
  histoire: `<p>Dans le Garage du Traîneau, les cadeaux doivent monter dans le traîneau <b>du plus léger au plus lourd</b>. Mais le tapis roulant est à moitié gelé : la seule chose possible est d'<b>échanger deux paquets voisins</b>. Et chaque échange consomme du précieux carburant de traîneau…</p>`,
  cours: `<p>Un <b>algorithme</b>, c'est une <b>méthode précise</b>, étape par étape, pour résoudre un problème. Une recette de cuisine ou la notice d'un meuble en kit sont des algorithmes !</p>
<p>Pour ranger des objets du plus petit au plus grand, il existe une méthode toute simple, le <b>tri à bulles</b> : on parcourt la rangée de gauche à droite, et chaque fois que deux voisins sont dans le mauvais ordre, on les échange. Le plus gros « remonte » alors tout au bout, comme une bulle dans une limonade. Puis on recommence avec les autres.</p>
<p>Exemple avec 3 paquets <code>3 kg · 1 kg · 2 kg</code> : on échange 3 et 1 → <code>1 · 3 · 2</code>, puis 3 et 2 → <code>1 · 2 · 3</code>. Rangé en 2 échanges !</p>
<p>Ici, une seule opération est permise : <b>échanger deux paquets voisins</b>, avec le bouton <b>⇄</b> placé entre eux.</p>`,
  enigme: `<p>Trie les paquets du plus léger (à gauche) au plus lourd (à droite). Il reste du carburant pour <b>12 échanges</b> : pas besoin d'être parfait, mais évite les échanges inutiles !</p>`,
  widget: W.tri([
    { emoji: '🧸', poids: 4 }, { emoji: '🎈', poids: 1 }, { emoji: '🚂', poids: 6 },
    { emoji: '📚', poids: 3 }, { emoji: '🛷', poids: 5 }, { emoji: '🎁', poids: 2 },
  ], 12),
  indices: [
    "Commence par amener le plus lourd (le train, 6 kg) tout à droite : échange-le avec son voisin de droite, encore et encore.",
    "Puis recommence avec le suivant (la luge, 5 kg), et ainsi de suite. N'échange jamais deux paquets déjà dans le bon ordre !",
  ],
  lecon: `<p>Tu viens d'appliquer le <b>tri à bulles</b> : les gros paquets « remontent » vers la droite comme des bulles dans une limonade.</p>
<p>Le minimum possible était de <b>8 échanges</b> : il y avait 8 paires de paquets dans le mauvais ordre (par exemple 4 kg placé avant 1 kg), et chaque échange entre voisins n'en corrige qu'une.</p>
<p>Le problème : pour 1 000 cadeaux, le tri à bulles peut demander près de <b>500 000 échanges</b>. Les informaticiens ont inventé des tris bien plus malins, comme le <b>tri fusion</b> : couper la pile en deux, trier chaque moitié, puis fusionner les deux. Pour 1 000 cadeaux : environ <b>10 000 opérations</b> seulement.</p>
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
    ricane: "Cent maisons, une seule cheminée qui attend, et le soleil qui se lève bientôt. J'adore les courses perdues d'avance.",
    piques: [
      "Raté ! Le cadeau finira chez un dentiste qui déteste Noël.",
      "Tu tires au hasard ? Moi aussi : sur les rennes, avec des glaçons.",
      "Le soleil se lève, la neige fond, et toi tu tournes en rond. C'est presque poétique.",
    ],
    fuite: "Trouvée en si peu d'essais ?! Tu coupes tout en deux… Je file avant que tu me coupes moi aussi !",
  },
  histoire: `<p>Dans l'Observatoire, la radio grésille : la Kère a soufflé sur le GPS du traîneau ! Le Père Noël survole l'Avenue des Cheminées : <b>100 maisons</b>, numérotées de 1 à 100. Une seule attend son cadeau ce soir. La radio peut seulement te dire si la bonne maison a un numéro <b>plus grand</b> ou <b>plus petit</b> que celui que tu proposes.</p>`,
  cours: `<p>Tu connais sûrement le jeu du « plus grand, plus petit » : quelqu'un pense à un nombre, tu en proposes un, et il te répond « plus grand » ou « plus petit ».</p>
<p>La méthode la plus simple consiste à essayer les nombres un par un : 1, 2, 3… Elle finit toujours par marcher, mais avec 100 maisons, elle pourrait demander jusqu'à <b>100 essais</b> !</p>
<p>La méthode maligne : proposer toujours le nombre <b>du milieu</b>. Quelle que soit la réponse, tu élimines <b>la moitié</b> des possibilités d'un coup !</p>
<p>Exemple avec 20 maisons : tu proposes 10, on te répond « plus grand ». Il reste les maisons 11 à 20 : tu proposes le milieu, 15. Et ainsi de suite…</p>`,
  enigme: `<p>Trouve la bonne maison en <b>10 essais maximum</b>, avant le lever du soleil. À chaque partie, la maison change : utilise la méthode du milieu, et regarde la zone dorée se réduire !</p>`,
  widget: W.dichotomie(100, 10),
  indices: [
    "Commence par la maison 50 : quelle que soit la réponse, tu élimines la moitié des maisons d'un coup.",
    "Vise toujours le milieu des maisons encore possibles (la zone dorée). Par exemple, s'il reste les maisons 51 à 100, essaie 75.",
  ],
  lecon: `<p>En visant toujours le milieu, tu élimines <b>la moitié des maisons</b> à chaque essai :</p>
<div class="schema"><code>100 → 50 → 25 → 13 → 7 → 4 → 2 → 1</code></div>
<p><b>7 essais</b> suffisent toujours pour 100 maisons ! C'est la <b>recherche dichotomique</b> (« couper en deux »).</p>
<p>Le plus fou : pour <b>un million</b> de maisons, il ne faudrait que <b>20 essais</b>, et pour un milliard, <b>30</b>. En les essayant une par une, il en faudrait jusqu'à un milliard…</p>
<p>⚠️ Mais attention : ça ne marche que si les maisons sont <b>rangées dans l'ordre</b>. C'est pour ça que le tri (jour 6) est si important !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>C'est la méthode naturelle pour chercher un mot dans un dictionnaire papier.</li>
<li>Les bases de données retrouvent une information parmi des milliards en quelques millisecondes grâce à cette idée.</li>
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
  histoire: `<p>Dans la Salle des Cartes, la grande carte de la tournée est punaisée au mur. Le Père Noël doit livrer un cadeau urgent à la <b>Maison de Léa</b>. Sur la carte, chaque route indique son temps de vol en minutes. Les rennes sont fatigués : il faut le trajet <b>le plus rapide</b>… et la Kère a tendu un fil rouge sur la carte pour te souffler un « raccourci ».</p>`,
  cours: `<p>Une carte comme celle-ci, avec des lieux reliés par des routes, les informaticiens l'appellent un <b>graphe</b>. Le Père Noël ne peut voler <b>que le long des routes dessinées</b>, et chaque route indique son temps de vol en minutes.</p>
<p>La durée d'un trajet, c'est la <b>somme</b> des temps de toutes les routes empruntées. Par exemple, si une route de 3 min va de la Ferme au Pont, puis une route de 4 min du Pont à l'Église, le trajet Ferme → Pont → Église dure 3 + 4 = <b>7 minutes</b>.</p>
<p>Pour trouver le trajet le plus rapide, il suffit de comparer les différents chemins possibles. Attention : un chemin avec peu d'étapes n'est pas toujours le plus court !</p>`,
  enigme: `<p>Clique sur les lieux, un par un, pour tracer le trajet depuis le <b>Pôle Nord</b> jusqu'à la <b>Maison de Léa</b>. Le Père Noël n'acceptera que le trajet le plus rapide. Le temps total s'affiche sous la carte : compare les trajets !</p>`,
  widget: W.graphe(
    {
      A: { nom: 'Pôle Nord', emoji: '🎅', x: 60, y: 190, dxNom: 6 },
      B: { nom: 'Lac Gelé', emoji: '🧊', x: 220, y: 80 },
      C: { nom: 'Forêt', emoji: '🌲', x: 220, y: 310 },
      D: { nom: 'Cabane du Trappeur', emoji: '🛖', x: 360, y: 200 },
      E: { nom: 'Mont Givré', emoji: '🏔️', x: 430, y: 70 },
      I: { nom: 'Maison de Léa', emoji: '🏡', x: 550, y: 200, dxNom: -16 },
    },
    [['A', 'B', 3], ['A', 'C', 2], ['B', 'D', 2], ['C', 'D', 5], ['B', 'E', 6], ['E', 'I', 2], ['D', 'I', 3], ['C', 'I', 9]],
    'A', 'I'
  ),
  indices: [
    "Additionne les minutes de chaque trajet et compare. Méfie-toi : la route la plus courte au départ (vers la Forêt) ne mène pas forcément au trajet le plus rapide !",
    "Compare ces trois trajets : Lac Gelé → Cabane → Maison, Forêt → Cabane → Maison, et la route directe Forêt → Maison du fil rouge de la Kère.",
  ],
  lecon: `<p>Le trajet le plus rapide était <b>Pôle Nord → Lac Gelé → Cabane du Trappeur → Maison de Léa</b> : 3 + 2 + 3 = <b>8 minutes</b>. Par la Forêt, la première route est plus courte (2 min)… mais la suite coûte cher : 2 + 5 + 3 = 10 minutes. Et le fil rouge de la Kère (Forêt puis route directe) : 2 + 9 = <b>11 minutes</b> !</p>
<p>Pour un informaticien, cette carte est un <b>graphe</b> : des <b>sommets</b> (les lieux) reliés par des <b>arêtes</b> (les routes), chacune avec un <b>poids</b> (la durée).</p>
<p>Pour trouver le plus court chemin sur une très grande carte, on utilise l'<b>algorithme de Dijkstra</b>. L'idée : partir du départ et calculer, de proche en proche, le temps minimum pour atteindre chaque lieu. Edsger Dijkstra l'a imaginé en 1956… en 20 minutes, à la terrasse d'un café d'Amsterdam !</p>
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
      "Faux ! Tu as compté avec tes moufles ?",
      "Recommence. Et recommence. Et recommence… Tu vois ? C'est ça, la récursivité.",
      "Même mon reflet dans mon reflet dans mon reflet se moque de toi.",
    ],
    fuite: "Tu as trouvé la sortie de ma boucle ?! Impossible… impossi… impo…",
  },
  histoire: `<p>Tout au fond de la Glacière, le Maître des Flocons fabrique chaque flocon avec une seule règle magique, qu'il répète encore et encore…</p>`,
  cours: `<p>Un <b>segment</b>, c'est simplement un <b>trait droit</b> qui relie deux points. Un triangle, par exemple, est fait de 3 segments.</p>
<p>La règle du Maître transforme <b>chaque segment en 4 segments</b> plus petits (avec une pointe au milieu). Et elle ne s'applique pas qu'une fois : à chaque nouvelle étape, on l'applique à <b>tous</b> les segments du dessin, y compris ceux qui viennent d'être créés.</p>
<p>Une règle qui s'applique à son propre résultat, encore et encore, s'appelle une règle <b>récursive</b>. C'est comme deux miroirs face à face : l'image contient une image, qui contient une image…</p>
<p>Exemple avec une autre règle : « chaque branche donne 2 nouvelles branches ». 1 branche → 2 branches → 4 → 8… À chaque étape, on <b>multiplie par 2</b>. Inutile de dessiner : il suffit de répéter la multiplication !</p>`,
  enigme: `<div class="note">
<p>❄️ <b>La règle du Maître</b></p>
<p>« Prends chaque segment. Coupe-le en 3 parts égales. Remplace la part du milieu par une pointe faite de deux segments. »</p>
<p>Chaque segment devient donc <b>4 segments</b>.</p>
</div>
<p>À l'étape 0, le flocon est un triangle : <b>3 segments</b>. À l'étape 1, il a <b>12 segments</b>. Observe les étapes avec le curseur.</p>
<p>Pour décorer le sapin, le Maître veut coudre une perle de glace au milieu de <b>chaque segment</b> du flocon de l'<b>étape 3</b>. <b>Combien de perles lui faut-il ?</b></p>
<div class="rappel">📌 <b>Rappel</b> : à chaque étape, le nombre de segments est <b>multiplié par 4</b>.</div>`,
  widget: W.koch(3),
  reponses: ['36186cbd223297452539e6957db32c6be1d13e472abddac62f6ec1563a77fc69', '793fc5a63f273f79a18b9e8a14a97ab95beffc448d166cbdb2ef168da2804b0d', 'bbb938f4ab252e849db3ed79efc88513b314c3730f8c10918b4ed12cc6d9adf7'],
  placeholder: 'Nombre de perles',
  indices: [
    "Étape 0 : 3 segments. Étape 1 : 3 × 4 = 12 segments. Continue de multiplier par 4 pour l'étape 2, puis l'étape 3.",
    "Étape 2 : 12 × 4 = 48 segments. Il ne reste qu'une multiplication pour l'étape 3 !",
  ],
  lecon: `<p>À chaque étape, chaque segment devient 4 segments : 3 → 12 → 48 → <b>192</b>. Il fallait donc <b>192 perles</b> ! À l'étape 10, il en faudrait plus de 3 millions…</p>
<p>Ce flocon s'appelle le <b>flocon de Koch</b> (1904). Sa règle s'applique à elle-même : c'est la <b>récursivité</b>. En programmation, une fonction récursive est une fonction qui <b>s'appelle elle-même</b> sur un problème plus petit :</p>
<pre class="code">fonction dessinerSegment(segment, étape) :
    si étape == 0 :
        tracer le segment          ← condition d'arrêt !
    sinon :
        couper en 4 petits segments (avec la pointe)
        pour chaque petit segment :
            dessinerSegment(petit, étape − 1)</pre>
<p>La <b>condition d'arrêt</b> est essentielle : sans elle, la fonction s'appellerait à l'infini et le programme planterait.</p>
<p>Fait étonnant : si on continuait à l'infini, le contour du flocon deviendrait <b>infiniment long</b>… alors que le flocon tient toujours sur une feuille !</p>
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
    ricane: "J'ai reprogrammé le robot-cuisinier. Il fait des sablés… et il m'en garde dès qu'il y en a trop.",
    piques: [
      "Faux ! Le robot a brûlé la fournée. Et ta fierté avec.",
      "Tu as sauté une ligne. Les robots, eux, n'en sautent jamais. C'est pour ça qu'on les préfère.",
      "Encore raté. Je mange un sablé à ta santé. Il a un goût délicieux… le goût de ton échec.",
    ],
    fuite: "Ça sent le sablé chaud… Je foooonds !",
  },
  histoire: `<p>Dans la Cuisine de Mère Noël, le robot-cuisinier prépare les sablés en suivant un <b>programme</b>. Mais la Kère s'est glissée dans ses circuits et l'a réécrit… en prenant soin de se servir au passage.</p>`,
  cours: `<p>Un <b>programme</b>, c'est une liste d'instructions que l'ordinateur suit à la lettre, de haut en bas, sans jamais réfléchir à ta place. Pour lire celui du robot, il te faut connaître 3 choses.</p>
<p><b>1. La flèche <code>←</code></b> veut dire « range cette valeur dans la boîte ». <code>sablés</code> est une boîte (on dit une <b>variable</b>) qui contient un nombre. Exemple :</p>
<pre class="code">bonbons ← 10
bonbons ← bonbons + 5</pre>
<p>La boîte <code>bonbons</code> contient d'abord 10, puis 10 + 5 = <b>15</b>.</p>
<p><b>2. <code>RÉPÈTE 3 FOIS</code></b> veut dire « fais 3 fois de suite les lignes <b>décalées</b> juste en dessous ». Chaque passage s'appelle un <b>tour</b> (on dit une <b>boucle</b>).</p>
<p><b>3. <code>SI</code></b> veut dire « fais les lignes décalées en dessous <b>seulement si</b> c'est vrai ». Sinon, on les saute.</p>
<p>Exemple complet :</p>
<pre class="code">bonbons ← 2
RÉPÈTE 3 FOIS :
    bonbons ← bonbons × 3
    SI bonbons > 10 :
        bonbons ← bonbons − 4
AFFICHER bonbons</pre>
<p>Tour 1 : 2 × 3 = 6 (pas plus de 10). Tour 2 : 6 × 3 = 18, plus de 10 → 18 − 4 = 14. Tour 3 : 14 × 3 = 42 → 42 − 4 = 38. Le programme affiche <b>38</b>.</p>`,
  enigme: `<p>Voici le nouveau programme du robot-cuisinier :</p>
<pre class="code">sablés ← 3
RÉPÈTE 5 FOIS :
    sablés ← sablés × 2
    SI sablés > 20 :
        sablés ← sablés − 10
AFFICHER sablés</pre>
<p class="petit">(Ce « − 10 », c'est la Kère qui croque 10 sablés chaque fois qu'il y en a plus de 20.)</p>
<p><b>Quel nombre le robot affichera-t-il à la fin ?</b></p>
<p class="petit">Tu peux remplir ce tableau de suivi pour t'aider (c'est ton brouillon, il n'est pas corrigé).</p>`,
  widget: W.tableauSuivi(['tour', 'sablés × 2', 'plus de 20 ? (− 10)', 'sablés en fin de tour'], 5),
  reponses: ['0f682726d71182328e89841c9fbec9494109b9162e63d576966243ab215dcb99', '5c2b34d3e8a3be9f329c4a3f4d8096100da9b7e0be3a66a70a4282e7432945ca'],
  placeholder: 'Nombre affiché',
  indices: [
    "Avance tour par tour, comme le robot. Tour 1 : 3 × 2 = 6, ce n'est pas plus de 20, donc la Kère ne touche à rien : 6 sablés.",
    "Tour 2 : 6 × 2 = 12. Tour 3 : 12 × 2 = 24, c'est plus de 20 → 24 − 10 = 14. Continue pour les tours 4 et 5 !",
  ],
  lecon: `<p>Le robot affiche <b>26</b> :</p>
<div class="defilement"><table class="tableau"><tr><th>tour</th><th>× 2</th><th>plus de 20 ?</th><th>sablés</th></tr>
<tr><td>1</td><td>6</td><td>non</td><td>6</td></tr><tr><td>2</td><td>12</td><td>non</td><td>12</td></tr>
<tr><td>3</td><td>24</td><td>oui (− 10)</td><td>14</td></tr><tr><td>4</td><td>28</td><td>oui (− 10)</td><td>18</td></tr>
<tr><td>5</td><td>36</td><td>oui (− 10)</td><td>26</td></tr></table></div>
<p>Tu viens d'utiliser les briques de base de <b>tous</b> les programmes :</p>
<ul>
<li>une <b>variable</b> (<code>sablés</code>) : une boîte avec une étiquette, dont le contenu change ;</li>
<li>une <b>boucle</b> (<code>RÉPÈTE</code>) : répéter des instructions ;</li>
<li>une <b>condition</b> (<code>SI</code>) : faire des choix.</li>
</ul>
<p>Et tu as fait ce que font les développeurs pour comprendre un programme : le suivre à la main, étape par étape. Voici le même programme en <b>Python</b>, un vrai langage de programmation :</p>
<pre class="code">sables = 3
for tour in range(5):
    sables = sables * 2
    if sables &gt; 20:
        sables = sables - 10
print(sables)</pre>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Une recette de cuisine est déjà un algorithme : des étapes, des répétitions (« remuer 5 minutes »), des conditions (« si la pâte est trop sèche, ajouter du lait »).</li>
<li>Un jeu vidéo tourne dans une grande boucle, répétée environ 60 fois par seconde : lire les touches, déplacer les personnages, dessiner l'image.</li>
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
      "Raté ! Tu as mangé la pile par le mauvais bout. Comme ton pull : à l'envers.",
      "Non. Les invités ont mangé tes erreurs : ils ont une indigestion.",
      "Faux ! Je garde la dernière crêpe pour moi. Et la tienne aussi.",
    ],
    fuite: "Dernière crêpe posée, première mangée… et moi, la première à filer !",
  },
  histoire: `<p>Dans la Salle à Manger, c'est l'heure du goûter : sur chaque crêpe, une lettre en chocolat. Mais la Kère, gloutonne, rôde autour de l'assiette…</p>`,
  cours: `<p>Les ordinateurs passent leur temps à mettre des informations de côté en attendant de s'en servir. Il existe deux grandes façons de les ranger… et l'ordre dans lequel on les ressort change tout !</p>
<p>🥞 La <b>pile</b>, comme une pile d'assiettes : on ne peut toucher <b>que celle du dessus</b>. La dernière posée est donc la première ressortie.</p>
<p>🚶 La <b>file</b>, comme la file d'attente à la boulangerie : on arrive <b>au bout</b>, on est servi <b>au début</b>. Le premier arrivé est le premier servi.</p>
<p>Exemple : on empile les crêpes <b>A</b>, puis <b>B</b>, puis <b>C</b>. C est tout en haut : si on les mange en prenant toujours celle du dessus, on mange <b>C</b>, puis <b>B</b>, puis <b>A</b>. L'ordre est retourné !</p>`,
  enigme: `<p>Le cuisinier empile les crêpes sur l'assiette. Voici ce qui s'est passé, dans l'ordre :</p>
<ol class="operations">
<li>Poser <b>N</b> (tout en bas de l'assiette)</li><li>Poser <b>I</b></li><li>Poser <b>P</b></li><li>Poser <b>A</b></li><li>Poser <b>S</b></li><li>Poser <b>K</b></li><li>😈 La Kère vole la crêpe du dessus de la pile</li>
</ol>
<p>Ensuite, les invités mangent toutes les crêpes qui restent, en prenant toujours <b>celle du dessus</b>. Les lettres, dans l'ordre où elles sont mangées, forment le mot de passe. <b>Lequel ?</b></p>`,
  reponses: ['ff576bb28b232dcd209933d0df5a753b8cfafb176a1995f5c4c84f21a88ce2ed'],
  placeholder: 'Le mot formé…',
  indices: [
    "La Kère prend la crêpe du dessus : c'est la dernière posée, le K. Il reste N, I, P, A, S, avec S tout en haut.",
    "Les invités mangent d'abord la crêpe du dessus (S), puis celle d'en dessous (A)… jusqu'à la dernière, tout en bas (N).",
  ],
  lecon: `<p>La Kère a chipé le <b>K</b>, la dernière crêpe posée. Puis les invités ont mangé <b>S, A, P, I, N</b> : le <b>SAPIN</b> ! Dans une <b>pile</b> (<i>stack</i>), c'est <b>dernier arrivé, premier sorti</b> : l'ordre est retourné.</p>
<p>Dans une <b>file</b> (<i>queue</i>), au contraire, c'est <b>premier arrivé, premier servi</b> : si les crêpes avaient attendu sur un tapis roulant, on les aurait mangées dans l'ordre où elles ont été posées.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li><b>Ctrl+Z</b> (annuler) utilise une pile : la dernière action faite est la première annulée.</li>
<li>Le bouton « Retour » de ton navigateur est une pile des pages visitées.</li>
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
    ricane: "J'ai effacé les couleurs du code. Il ne reste que des nombres. Bonne chance pour deviner où commence le vert…",
    piques: [
      "Raté ! Ton chef-d'œuvre ressemble à un flocon écrasé sous une botte.",
      "Blanc, vert, blanc, vert… Tu as perdu le compte ? Pas moi : je compte tes erreurs.",
      "Faux. Même un écran fracassé à coups de marteau afficherait mieux.",
    ],
    fuite: "L'image réapparaît ?! Je disparais… dans le blanc…",
  },
  histoire: `<p>Dans le Studio Photo, le photographe avait compressé un dessin secret pour qu'il voyage plus vite. La Kère est passée par là, gomme à la main : elle a effacé <b>toutes les lettres</b> du code. Il ne reste que des nombres…</p>`,
  cours: `<p>Une image numérique, c'est une <b>grille de petits carrés</b> de couleur : les <b>pixels</b> (souviens-toi du jour 4). Pour l'enregistrer, l'ordinateur note la couleur de chaque pixel, ligne par ligne.</p>
<p>Problème : une photo contient des millions de pixels, et le fichier devient vite très lourd. On la <b>compresse</b> donc : on écrit la même information <b>en plus court</b>, pour qu'elle prenne moins de place et voyage plus vite.</p>
<p>L'astuce du photographe : au lieu de dire « blanc, blanc, blanc, vert, vert », il dit « <b>3 blancs, 2 verts</b> ». Pour retrouver l'image, on fait l'inverse : <code>3 blancs, 2 verts</code> → ⬜⬜⬜🟩🟩</p>
<p>On peut faire encore plus court ! L'image n'a que deux couleurs, qui <b>alternent</b> forcément : chaque ligne commence par du blanc, puis vient du vert, puis du blanc… Plus besoin d'écrire les couleurs : <code>3 2 1</code> veut dire 3 blancs, 2 verts, 1 blanc → ⬜⬜⬜🟩🟩⬜</p>`,
  enigme: `<div class="note">
<p>📸 <b>Le code, après le passage de la Kère</b></p>
<p>Chaque ligne commence par des pixels <b>blancs</b>, puis les nombres alternent : blancs, verts, blancs, verts… <code>5 1 5</code> = 5 blancs, 1 vert, 5 blancs.</p>
<p>L'image fait <b>11 pixels</b> de large et 9 de haut. Chaque ligne du code correspond à une ligne de l'image.</p>
</div>
<p>Peins la grille (clique ou glisse sur les cases) pour révéler le dessin secret. <b>Que représente-t-il ?</b></p>`,
  widget: W.pixels(['5 1 5', '4 3 4', '3 5 3', '4 3 4', '3 5 3', '2 7 2', '1 9 1', '5 1 5', '5 1 5'], 11, 'vert'),
  reponses: ['e31a29c5cc0415f23e84cc9a35ab1da113b89bc30c6523aeef048343d037f6c4', '73bca229c19a81b0c4ebce205091d74f2da5ce16355ae4a196a97f7660a3ad83', 'eb0b0d304d44392d619ab5b758fe2c9d6a7fc9d3553788a4f47824e2e17f78bf', '92109c407d6b5dd9659530308a228774e38a65ad3683e639fc774eaa9321afe2', '8b126daf4a1743f458f2945d1fc686b06698f57363fb98891b10d1569a0a6c5a', '1b549f1cf3c96e4b2b2531b1ab26eb0c84a018a2356a24626c0893592ff00ecf', '74dde700f93b51479c816bca84cedb9e39b10abac76d50bc5569ac5c8a5c9244', 'fe9057cb474a10e91146268db682c96c324dd795f36db4515c5d274aa97fe158', '436c7c9761cf52390f2bc14770305060b7c70b404e58319dc6e754fa76e2fa3c', 'eef978d73ad89387dcbff8456d98a029d1fef9a6bb078bcf43164ce01c25a23a'],
  placeholder: 'Le dessin…',
  indices: [
    "Ligne 1 : 5 blancs, 1 vert, 5 blancs. Ligne 2 : 4 blancs, 3 verts, 4 blancs. Chaque ligne fait bien 11 cases au total.",
    "Le dessin est pointu en haut, s'élargit vers le bas, et a un petit tronc… C'est la star de Noël !",
  ],
  lecon: `<p>C'était un <b>sapin</b> 🎄 !</p>
<p>Ce codage s'appelle le <b>RLE</b> (<i>Run-Length Encoding</i>, « codage par plages ») : au lieu d'écrire 5 fois « blanc », on écrit <code>5</code>.</p>
<p>Le code tenait en 27 nombres, alors que l'image brute compte 99 cases (11 × 9) : presque <b>4 fois plus court</b> ! Les <b>télécopieurs</b> (les fax) utilisaient exactement cette astuce : une page de texte, c'est surtout du blanc, avec des plages de noir qui alternent.</p>
<p>Le RLE est excellent pour les grandes zones unies (un ciel, une page blanche), mais mauvais pour les photos pleines de détails, où les couleurs changent à chaque pixel. C'est une compression <b>sans perte</b> : on retrouve l'image exacte. Le format <b>JPEG</b>, lui, compresse <b>avec perte</b> : il jette des détails que l'œil remarque à peine, pour obtenir des fichiers environ 10 fois plus légers.</p>
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
  histoire: `<p>À la Boutique du Chalet, trois cadeaux attendent d'être emballés. Mais la Kère est passée par là, un feutre à la main : elle a <b>changé un chiffre</b> sur deux étiquettes sur trois. Une seule étiquette est encore authentique… et la caisse peut le vérifier !</p>`,
  cours: `<p>Un scanner peut se tromper, et une étiquette peut s'abîmer. Pour repérer les erreurs, on ajoute à la fin du code un chiffre spécial : la <b>clé de contrôle</b>. Elle ne dit rien sur le produit : elle est <b>calculée</b> à partir des autres chiffres.</p>
<p>À la Boutique du Chalet, la règle est simple :</p>
<div class="schema">La clé = le <b>dernier chiffre</b> de la somme des autres chiffres</div>
<p>Exemple avec le code <code>2 3 4 | 9</code> : 2 + 3 + 4 = 9, la clé doit être <b>9</b> ✅.</p>
<p>Autre exemple, <code>5 6 7 | 8</code> : 5 + 6 + 7 = 1<b>8</b>, on garde le dernier chiffre : la clé doit être <b>8</b> ✅.</p>
<p>Si un chiffre a été mal lu ou trafiqué, la somme change, et la clé ne correspond plus : la caisse fait « BIP ✗ » !</p>`,
  enigme: `<div class="rappel">📌 <b>La règle</b> : additionne les 4 premiers chiffres. Le <b>dernier chiffre</b> de cette somme doit être égal à la clé (le 5ᵉ chiffre, en doré).</div>
<p>Vérifie les trois étiquettes. <b>Quel cadeau porte le seul code authentique ?</b></p>`,
  widget: W.codesBarres([
    { code: '52714', nom: '🛷 Luge' },
    { code: '36246', nom: '🧩 Puzzle' },
    { code: '43816', nom: '⛸️ Patins' },
  ], true),
  reponses: ['627248359ff436e3507d0407e91a556998fede8181aaf97ee74404bf7b2a335b', 'da23cdb73eaca46acb52dfd44ce523f2eb09ce85ec2b491d1d4e533a0b775b6b', '97bfa62ee949caf03d81d4d6a626dc35da08d41254026af5e1157eca24ca4a0a', '52097ed65c819cc10cbe512709d34e6bdce2ef12bea7baedd0ca917127fcfd00'],
  placeholder: 'Le cadeau authentique…',
  indices: [
    "Luge : 5 + 2 + 7 + 1 = 15. Le dernier chiffre de 15 est 5… mais la clé de la Luge est 4. Raté pour la Luge ! Fais pareil pour les deux autres.",
    "Puzzle : 3 + 6 + 2 + 4 = 15, la clé devrait être 5, or c'est 6. Il ne reste qu'une étiquette à vérifier…",
  ],
  lecon: `<p>Le seul code authentique était celui des <b>Patins</b> : 4 + 3 + 8 + 1 = 1<b>6</b>, et la clé est bien <b>6</b> ✅. La Luge (15 → clé 4 au lieu de 5) et le Puzzle (15 → clé 6 au lieu de 5) ont été trafiqués ❌.</p>
<p>La clé de contrôle sert à <b>détecter les erreurs</b> : si un seul chiffre change, la somme change, et la clé ne correspond plus.</p>
<p>Les vrais codes-barres (13 chiffres, appelés <b>EAN-13</b>) utilisent une règle un peu plus maligne : ils multiplient un chiffre sur deux par 3 avant d'additionner. Pourquoi ? Pour attraper aussi l'erreur la plus fréquente quand on recopie un code à la main : <b>inverser deux chiffres voisins</b> (avec une simple somme, 2 + 8 et 8 + 2, c'est pareil !).</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Ton numéro de <b>carte bancaire</b> a un dernier chiffre de contrôle : un site repère tout de suite une faute de frappe.</li>
<li>Le numéro de sécurité sociale, l'<b>IBAN</b> et les numéros de livres (<b>ISBN</b>) ont aussi une clé de contrôle.</li>
<li>Les <b>QR codes</b> vont encore plus loin : ils peuvent <b>corriger</b> les erreurs. On peut abîmer jusqu'à 30 % d'un QR code, il reste lisible !</li>
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
    ricane: "J'ai lâché les paquets dans une tempête de neige. Ils sont tous mélangés… Joyeux puzzle !",
    piques: [
      "Raté ! Le Pôle Sud vient de recevoir « MINUIT DÉCOLLAGE À ». Les pingouins n'ont rien compris.",
      "Faux ! Tu as remis les paquets dans l'ordre où ils sont tombés. Moi aussi je sais faire ça.",
      "Encore raté ! Relis les numéros : en binaire, 011 c'est pas onze, gros bêta.",
    ],
    fuite: "Message transmis ?! Je me découpe en petits paquets et je disparais !",
  },
  histoire: `<p>Le Père Noël envoie un message au Pôle Sud. Mais sur Internet, un message ne voyage jamais en un seul morceau : il est découpé en petits <b>paquets</b>, qui prennent chacun leur propre route ! La Kère les a lâchés dans une tempête : ils sont arrivés au Centre de Tri <b>dans le désordre</b>.</p>`,
  cours: `<p>Sur Internet, un message n'est jamais envoyé d'un seul bloc : il est découpé en petits morceaux, les <b>paquets</b>. Chaque paquet voyage seul, par le chemin le moins encombré du moment… si bien qu'ils n'arrivent pas forcément dans l'ordre !</p>
<p>Pour s'y retrouver, chaque paquet porte un <b>numéro</b>, comme les pages d'un livre. À l'arrivée, on remet les paquets dans l'ordre des numéros, et le message réapparaît.</p>
<p>Ici, les numéros sont écrits en <b>binaire</b> sur 3 places. Souviens-toi du jour 1 : les places valent 4, 2 et 1, et il suffit d'additionner les places où il y a un 1.</p>
<div class="defilement"><table class="tableau compact">
<tr><th>4</th><th>2</th><th>1</th><th>Numéro</th></tr>
<tr><td>0</td><td>0</td><td class="allume">1</td><td><b>1</b></td></tr>
<tr><td>0</td><td class="allume">1</td><td>0</td><td><b>2</b></td></tr>
<tr><td class="allume">1</td><td>0</td><td class="allume">1</td><td>4 + 1 = <b>5</b></td></tr>
</table></div>`,
  enigme: `<p>Chaque paquet porte son <b>numéro</b>, écrit en binaire. Clique sur les paquets <b>dans l'ordre des numéros</b> (1, 2, 3…) pour reconstituer le message, puis transmets-le. Le symbole ␣ représente une espace.</p>
<div class="rappel">📌 <b>Rappel</b> : en binaire sur 3 places, les places valent <code>4 · 2 · 1</code>. Exemple : <code>110</code> = 4 + 2 = 6.</div>`,
  widget: W.paquets([
    { seq: '100', data: ' À ' }, { seq: '010', data: 'OLL' }, { seq: '110', data: 'UIT' },
    { seq: '001', data: 'DÉC' }, { seq: '101', data: 'MIN' }, { seq: '011', data: 'AGE' },
  ]),
  indices: [
    "Convertis d'abord chaque numéro : 001 = 1, 010 = 2, 011 = 2 + 1 = 3, 100 = 4… Le paquet n° 1 est celui qui porte 001.",
    "Dans l'ordre : 001, 010, 011, 100, 101, 110. Le message commence par « DÉC »…",
  ],
  lecon: `<p>Le message était : <b>« DÉCOLLAGE À MINUIT »</b> 🦌🛷.</p>
<p>Sur Internet, toutes les données (messages, photos, vidéos) sont découpées en <b>paquets</b> d'environ 1 500 octets. Chaque paquet porte :</p>
<ul>
<li>l'<b>adresse IP</b> de l'expéditeur et celle du destinataire (comme sur une enveloppe) ;</li>
<li>un <b>numéro de séquence</b>, pour remettre les morceaux dans l'ordre.</li>
</ul>
<p>Les paquets traversent des dizaines de <b>routeurs</b> et peuvent prendre des chemins différents : ils arrivent parfois dans le désordre, en double, ou se perdent. Le protocole <b>TCP</b> fait exactement ce que tu viens de faire : il remet les paquets dans l'ordre… et redemande ceux qui se sont perdus.</p>
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
      "Raté ! Erreur 500 : ton cerveau a planté.",
    ],
    fuite: "Tu comprends les codes ?! Erreur 503 : Kère indisponible, je m'en vais !",
  },
  histoire: `<p>Dans la Salle des Serveurs, le site web du Pôle Nord (<code>www.pole-nord.noel</code>) répond avec de drôles de <b>codes à 3 chiffres</b>. Chaque code a un sens précis, compris par tous les sites du monde… et la Kère s'amuse à les provoquer.</p>`,
  cours: `<p>Quand tu ouvres un site web, ton <b>navigateur</b> (Chrome, Firefox, Safari…) envoie une <b>demande</b> à un ordinateur allumé jour et nuit quelque part dans le monde : le <b>serveur</b>. C'est lui qui garde les pages du site.</p>
<p>Le serveur répond avec la page… et avec un <b>code à 3 chiffres</b> qui dit comment ça s'est passé. Tu as sûrement déjà croisé le plus célèbre d'entre eux : « <b>Erreur 404</b> » (page introuvable).</p>
<p>Ces codes sont les mêmes pour tous les sites du monde. Le <b>premier chiffre</b> donne la famille :</p>
<div class="defilement"><table class="tableau compact">
<tr><th>Famille</th><th>Ça veut dire…</th></tr>
<tr><td><b>2</b>xx</td><td>✅ ça a marché</td></tr>
<tr><td><b>3</b>xx</td><td>↪️ la page a déménagé : va voir ailleurs</td></tr>
<tr><td><b>4</b>xx</td><td>🙋 c'est la faute du visiteur (page inconnue, accès interdit…)</td></tr>
<tr><td><b>5</b>xx</td><td>🔥 c'est la faute du serveur (il a planté)</td></tr>
</table></div>`,
  enigme: `<p>Associe chaque situation au bon code de réponse du serveur. Lis bien le sens de chaque code ! (L'un d'eux est une vraie blague d'informaticiens : il ne sert à rien ici.)</p>`,
  widget: W.http(
    [
      "Un enfant ouvre la page <code>/liste-des-cadeaux</code> : tout fonctionne, la page s'affiche.",
      "L'ancienne page <code>/lettres</code> a déménagé pour toujours à l'adresse <code>/courrier</code>.",
      "La Kère essaie d'ouvrir <code>/coffre-du-pere-noel</code>, réservé au Père Noël : c'est non !",
      "Quelqu'un tape <code>/cadeaux-de-l-an-3000</code> : cette page n'a jamais existé.",
      "Une erreur dans le programme du serveur le fait planter.",
    ],
    [
      { code: 200, sens: '« OK » : tout va bien, voici la page' },
      { code: 301, sens: '« Déplacé définitivement » : la page a changé d\'adresse pour toujours' },
      { code: 403, sens: '« Interdit » : tu n\'as pas le droit d\'entrer' },
      { code: 404, sens: '« Introuvable » : cette page n\'existe pas' },
      { code: 418, sens: '« Je suis une théière » ☕ (oui, il existe vraiment !)' },
      { code: 500, sens: '« Erreur interne » : le serveur a planté' },
    ]
  ),
  indices: [
    "Lis le sens de chaque code dans la liste, puis cherche la situation qui lui correspond. Le 418 (la théière) ne va avec aucune situation !",
    "La page qui s'affiche normalement → 200. Le déménagement → 301. Il ne reste que la page interdite, la page qui n'existe pas et le serveur qui plante.",
  ],
  lecon: `<p>Les réponses : <b>200</b> (tout va bien), <b>301</b> (déménagement), <b>403</b> (interdit), <b>404</b> (introuvable) et <b>500</b> (le serveur a planté).</p>
<p>Quand tu visites un site, ton navigateur (le <b>client</b>) envoie une <b>requête</b> à un ordinateur distant (le <b>serveur</b>) : « donne-moi la page <code>/liste-des-cadeaux</code> ». Le serveur répond avec la page… et un <b>code</b>. Ce langage s'appelle <b>HTTP</b> (le « http » au début des adresses).</p>
<p>Et le code <b>418 « Je suis une théière »</b> ? Il vient d'un poisson d'avril de 1998… qui a été gardé, par amour de la blague !</p>
<p>Avant même la requête, ton ordinateur demande à un <b>serveur DNS</b> l'adresse de <code>www.pole-nord.noel</code> : le DNS est l'annuaire d'Internet, qui traduit les noms en numéros.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Les pages « 404 » de certains sites sont de petites œuvres d'art : cherche-en quelques-unes !</li>
<li>Les jours de soldes ou de vente de billets de concert, beaucoup de sites affichent des erreurs : trop de monde à la fois.</li>
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
  histoire: `<p>Dans l'Atelier d'Emballage, un robot trie les étiquettes des cadeaux. La Kère lui a donné un <b>motif</b> très strict : les étiquettes qui ne lui ressemblent pas partent à la déchiqueteuse ! Le motif est écrit dans un langage étrange : une <b>expression régulière</b>.</p>`,
  cours: `<p>Une <b>expression régulière</b>, c'est un <b>portrait-robot</b> de texte : elle ne dit pas quel texte exact on attend, mais à quoi il doit <b>ressembler</b>.</p>
<p>Par exemple, le portrait-robot <code>[0-9][0-9][0-9]</code> veut dire « 3 chiffres ». Il accepte <code>007</code> et <code>123</code>, mais refuse <code>12</code> (trop court) et <code>abc</code> (pas des chiffres).</p>
<p>Quelques morceaux à connaître :</p>
<ul>
<li><code>[A-Z]</code> = une lettre majuscule, <code>[a-z]</code> = une lettre minuscule, <code>[0-9]</code> = un chiffre ;</li>
<li><code>+</code> = « le morceau d'avant, une fois ou plus » : <code>[a-z]+</code> accepte <code>a</code>, <code>noel</code> ou <code>sapin</code> ;</li>
<li><code>^</code> = le début et <code>$</code> = la fin : rien ne doit dépasser !</li>
</ul>
<p>Pour vérifier une étiquette, on avance <b>en même temps</b> dans le motif et dans l'étiquette, morceau par morceau, de gauche à droite. Si un seul morceau ne correspond pas, l'étiquette est refusée.</p>`,
  enigme: `<div class="motif"><code>^[A-Z][a-z]+-[0-9][0-9]$</code></div>
<table class="tableau legende-regex">
<tr><td><code>^</code></td><td>début de l'étiquette</td></tr>
<tr><td><code>[A-Z]</code></td><td>une lettre majuscule</td></tr>
<tr><td><code>[a-z]+</code></td><td>une ou plusieurs lettres minuscules</td></tr>
<tr><td><code>-</code></td><td>un tiret</td></tr>
<tr><td><code>[0-9][0-9]</code></td><td>deux chiffres</td></tr>
<tr><td><code>$</code></td><td>fin de l'étiquette (plus rien après !)</td></tr>
</table>
<p>En clair : <b>un prénom qui commence par une majuscule</b> (et seulement la première lettre), un tiret, puis <b>exactement deux chiffres</b>. Voici les étiquettes, dans l'ordre d'arrivée :</p>
<div class="etiquettes"><span>Nael-05</span><span>lea-12</span><span>Emma-12</span><span>TOM-03</span><span>Ines-24</span><span>Sam-7</span><span>Gael-09</span><span>Elio-17</span></div>
<p>Les <b>premières lettres</b> des étiquettes acceptées par le robot, dans l'ordre, forment le mot de passe.</p>`,
  reponses: ['323f10c007faf32d3f56490a1879c815874867b9a1fcf13046f2f0ff7aa84100'],
  placeholder: 'Le mot formé…',
  indices: [
    "Trois étiquettes ont un défaut : une commence par une minuscule, une est tout en majuscules, et une n'a qu'un seul chiffre.",
    "lea-12 (pas de majuscule), TOM-03 (majuscules en trop) et Sam-7 (un seul chiffre) partent à la déchiqueteuse. Lis les premières lettres des 5 autres !",
  ],
  lecon: `<p>Les étiquettes acceptées étaient <b>N</b>ael-05, <b>E</b>mma-12, <b>I</b>nes-24, <b>G</b>ael-09 et <b>E</b>lio-17 → <b>NEIGE</b> ❄️</p>
<p>Les refusées : <code>lea-12</code> (pas de majuscule au début), <code>TOM-03</code> (des majuscules là où le motif attend des minuscules) et <code>Sam-7</code> (un seul chiffre au lieu de deux).</p>
<p>Les <b>expressions régulières</b> (ou <i>regex</i>) sont un mini-langage pour décrire des motifs de texte. Elles existent dans presque tous les langages de programmation.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Quand un formulaire te dit « adresse e-mail invalide », c'est souvent une regex qui a vérifié.</li>
<li>Un code postal français s'écrit <code>^[0-9]{5}$</code> (« exactement 5 chiffres »).</li>
<li>Les développeurs s'en servent pour chercher et remplacer du texte dans des milliers de fichiers d'un coup.</li>
</ul>
<h4>🧪 Essaie toi-même</h4>`,
  apresReussite: W.terrainRegex('^[A-Z][a-z]+-[0-9][0-9]$', ['Nael-05', 'lea-12', 'Emma-12', 'TOM-03', 'Ines-24', 'Sam-7', 'Gael-09', 'Elio-17']),
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
    ricane: "J'ai mélangé toute la liste des enfants sages et pas sages. Bonne chance pour t'y retrouver.",
    piques: [
      "Faux ! Tu viens d'offrir une luge à un garnement. Je commence à t'apprécier.",
      "Erreur de requête ! Tu as lu la liste à l'envers, comme un lutin qui a trop bu de chocolat chaud.",
      "Non. La base de données a soupiré. Si, si, je l'ai entendue.",
    ],
    fuite: "SELECT sortie FROM chalet… Je disparais de la base !",
  },
  histoire: `<p>Dans la Bibliothèque, la liste des enfants n'est plus un vieux grimoire : c'est une <b>base de données</b>. La Kère a caché le mot de passe dedans… et elle a laissé sur l'écran la <b>requête</b> qui permet de le retrouver.</p>`,
  cours: `<p>Une <b>base de données</b>, c'est un grand tableau bien rangé, une <b>table</b> : chaque <b>ligne</b> décrit une chose (ici, un cadeau) et chaque <b>colonne</b> une information sur elle (un prénom, un prix…).</p>
<p>Pour lui poser une question, on écrit une <b>requête</b> en <b>SQL</b>. Ses mots-clés sont de l'anglais tout simple :</p>
<div class="defilement"><table class="tableau compact">
<tr><td><code>SELECT</code></td><td class="gauche">choisis (la colonne à afficher)</td></tr>
<tr><td><code>FROM</code></td><td class="gauche">dans (quelle table)</td></tr>
<tr><td><code>WHERE</code></td><td class="gauche">seulement les lignes où…</td></tr>
<tr><td><code>ORDER BY … DESC</code></td><td class="gauche">range le résultat par… du plus grand au plus petit</td></tr>
</table></div>
<p>Exemple : <code>SELECT prenom FROM eleves WHERE classe = 'CM2' ORDER BY age DESC</code> veut dire « donne-moi le prénom des élèves de CM2, du plus âgé au plus jeune ».</p>`,
  enigme: `<p>Voici la requête laissée par la Kère :</p>
<pre class="code sql"><span class="mot">SELECT</span> cadeau
<span class="mot">FROM</span> liste
<span class="mot">WHERE</span> sage = 'oui'
<span class="mot">ORDER BY</span> prix <span class="mot">DESC</span>;</pre>
<p class="petit">Traduction : « Dans la table liste, garde seulement les cadeaux des enfants sages, range-les du plus cher au moins cher, et affiche le nom des cadeaux. »</p>
<p>Table <code>liste</code> :</p>
<div class="defilement"><table class="tableau table-sql">
<tr><th>enfant</th><th>cadeau</th><th>prix</th><th>sage</th></tr>
<tr><td>Zoé</td><td>Nounours</td><td>9</td><td>oui</td></tr>
<tr><td>Hugo</td><td>Luge</td><td>26</td><td>non</td></tr>
<tr><td>Adam</td><td>Toupie</td><td>19</td><td>oui</td></tr>
<tr><td>Inès</td><td>Ukulélé</td><td>25</td><td>oui</td></tr>
<tr><td>Malo</td><td>Igloo en kit</td><td>12</td><td>non</td></tr>
<tr><td>Rose</td><td>Lampe frontale</td><td>28</td><td>oui</td></tr>
<tr><td>Léo</td><td>Igloo gonflable</td><td>14</td><td>oui</td></tr>
</table></div>
<p>Les <b>initiales des cadeaux</b> obtenus, dans l'ordre du résultat, forment le mot de passe.</p>`,
  reponses: ['c12fd5047c181d7d4784e29127da729b8aa4b23fb1415f4b3f72ffb1a1aa34e4'],
  placeholder: 'Le mot formé…',
  indices: [
    "Barre d'abord les lignes des enfants pas sages (sage = 'non') : la Luge de Hugo et l'Igloo en kit de Malo. Il reste 5 cadeaux.",
    "Range les 5 cadeaux restants du plus cher au moins cher : la Lampe frontale (28) en premier, le Nounours (9) en dernier. Lis leurs initiales !",
  ],
  lecon: `<p>La requête renvoie 5 lignes : <b>L</b>ampe frontale (28 €), <b>U</b>kulélé (25 €), <b>T</b>oupie (19 €), <b>I</b>gloo gonflable (14 €) et <b>N</b>ounours (9 €) → <b>LUTIN</b> 🧝</p>
<p>Une <b>base de données</b> range les informations dans des <b>tables</b>, et le <b>SQL</b> permet de leur poser des questions : filtrer (<code>WHERE</code>), trier (<code>ORDER BY</code>), choisir les colonnes (<code>SELECT</code>)… Il a été inventé dans les années 1970 et il est toujours utilisé partout aujourd'hui.</p>
<p>Avec 7 lignes, tu peux le faire à la main. Une vraie base peut contenir des <b>milliards</b> de lignes : l'ordinateur répond quand même en une fraction de seconde.</p>
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
    ricane: "Mon ordinateur de glace teste 10 milliards de mots de passe par seconde. Ton petit secret tiendra… le temps d'un éternuement.",
    piques: [
      "Cassé ! Même ma grand-mère, congelée depuis l'an mil, l'aurait deviné.",
      "Ha ! Ce mot de passe, je l'ai trouvé avant que tu aies fini de le taper.",
      "Plus long, voyons ! Ton mot de passe est aussi court que ta victoire.",
    ],
    fuite: "Mille ans ?! Je n'ai pas le temps d'attendre, j'ai d'autres Noëls à gâcher !",
  },
  histoire: `<p>Dans la Salle des Coffres, la <b>Kère</b> des coffres a branché un ordinateur de glace qui teste <b>10 milliards de mots de passe par seconde</b> ! Il faut protéger le coffre aux cadeaux avec un nouveau mot de passe, bien solide.</p>`,
  cours: `<p>Un pirate qui ne connaît pas ton mot de passe peut demander à un ordinateur de les <b>essayer tous</b>, un par un, jusqu'à tomber sur le bon : c'est l'<b>attaque par force brute</b>.</p>
<p>Pour lui résister, il faut que le nombre de <b>combinaisons possibles</b> soit gigantesque. Pense à un cadenas à chiffres :</p>
<ul>
<li>avec 3 roues de 10 chiffres : 10 × 10 × 10 = <b>1 000</b> combinaisons ;</li>
<li>avec 4 roues : 10 × 10 × 10 × 10 = <b>10 000</b> combinaisons.</li>
</ul>
<p>Chaque roue de plus <b>multiplie</b> le nombre de combinaisons. Pour un mot de passe, c'est pareil : chaque caractère est une « roue ». Conclusion : <b>la longueur, c'est ce qui compte le plus !</b></p>`,
  enigme: `<p>Invente un mot de passe que l'ordinateur de glace de la Kère mettrait <b>au moins mille ans</b> à trouver en essayant toutes les combinaisons. La jauge te montre en direct combien de temps il tiendrait !</p>
<p class="alerte">🚫 N'écris surtout pas un de tes vrais mots de passe ici : invente-en un nouveau !</p>`,
  widget: W.motDePasse(1e10, 1e3, ['123456', '123456789', '12345678', 'azerty', 'qwerty', 'motdepasse', 'password', 'soleil', 'doudou', 'loulou', 'noel', 'joyeuxnoel', 'perenoel', '000000', '111111', 'abc123', 'azertyuiop', 'chocolat', 'bonjour']),
  indices: [
    "Allonge ton mot de passe : chaque caractère en plus multiplie le temps ! Une quinzaine de lettres suffit.",
    "Astuce de pro : une petite phrase de 3 ou 4 mots sans rapport, séparés par des espaces (« pingouin volcan chaussette »). Solide et facile à retenir !",
  ],
  lecon: `<p>Le nombre de combinaisons d'un mot de passe = <b>(nombre de caractères possibles)<sup>longueur</sup></b>. Avec 10 milliards d'essais par seconde :</p>
<ul>
<li>8 lettres minuscules → cassé en <b>21 secondes</b> ;</li>
<li>8 caractères de tous types (majuscules, chiffres, symboles…) → environ <b>8 jours</b> ;</li>
<li>15 lettres minuscules → environ <b>5 000 ans</b> !</li>
</ul>
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
      "Faux ! Tom recevra une poupée. Il voulait un dinosaure, mais bon.",
      "Raté. Tu as compté avec tes moufles ?",
      "Encore faux ! Je finis par croire que c'est toi qui as écrit mes fausses commandes.",
    ],
    fuite: "Démasquée par un simple nombre ?! Je souffle… je m'essouffle…",
  },
  histoire: `<p>Dans le Bureau du Père Noël, chaque commande est protégée par un <b>sceau magique</b> : un nombre calculé à partir du nom du cadeau. La Kère a intercepté la commande de Tom et l'a noyée parmi de fausses commandes. Heureusement, le sceau, lui, n'a pas bougé !</p>`,
  cours: `<p>Comment être sûr qu'un message n'a pas été modifié en chemin ? On peut lui ajouter une <b>empreinte</b> : un petit nombre calculé à partir du texte, un peu comme une empreinte digitale.</p>
<p>Le destinataire refait le même calcul sur le texte qu'il a reçu. S'il trouve la même empreinte, le texte est intact. Sinon, quelqu'un l'a modifié !</p>
<p>La recette du sceau du Père Noël est toute simple : on remplace chaque lettre par son <b>rang dans l'alphabet</b> (A = 1, B = 2, C = 3… Z = 26), puis on <b>additionne</b> tout.</p>
<p>Exemple : <code>NOEL</code> → N = 14, O = 15, E = 5, L = 12 → 14 + 15 + 5 + 12 = <b>46</b>.</p>`,
  enigme: `<p>La commande originale de Tom portait le <b>sceau 39</b>. Voici les commandes trouvées sur le bureau : une seule est la vraie !</p>
<div class="etiquettes"><span>ROBOT</span><span>TRAIN</span><span>CHIEN</span><span>POUPEE</span><span>LUGE</span><span>BALLON</span></div>
<p><b>Quel cadeau Tom a-t-il vraiment commandé ?</b></p>
<div class="rappel">📌 <b>Rappel</b> : additionne les rangs des lettres dans l'alphabet.</div>
${tableAlphabet()}`,
  reponses: ['d313fdc7b98aa7e30efd970ca306a525fa52c1ef272b80619105dec48ec6f416', '6b815f6bf0eb07744c0db989473206959d337dc7231bdc0a2d6a418c4ff2dfa8'],
  placeholder: 'Le vrai cadeau…',
  indices: [
    "Calcule le sceau de chaque cadeau, comme dans l'exemple de NOEL. Par exemple, LUGE = 12 + 21 + 7 + 5 = 45 : ce n'est pas 39, ce n'est donc pas la luge.",
    "ROBOT = 70, TRAIN = 62, POUPEE = 78, BALLON = 56… Il ne reste plus qu'un cadeau à vérifier !",
  ],
  lecon: `<p>Le vrai cadeau était le <b>CHIEN</b> 🐶 : C + H + I + E + N = 3 + 8 + 9 + 5 + 14 = <b>39</b> ✅.</p>
<p>Ce sceau est une <b>fonction de hachage</b> : elle transforme un texte en une <b>empreinte</b>. Mais la nôtre a un gros défaut… Calcule le sceau de <code>NICHE</code> : 14 + 9 + 3 + 8 + 5 = <b>39</b>, lui aussi ! Avec les mêmes lettres dans un autre ordre, on obtient le même total. La Kère aurait pu remplacer le chien par une niche sans que personne ne s'en aperçoive ! Deux textes différents avec la même empreinte, c'est une <b>collision</b>.</p>
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
      "Non ! Ta règle ne marche pas pour tous les exemples. Regarde mieux !",
    ],
    fuite: "Il apprend… il apprend tout seul ! Même moi, il m'a devinée ! Je file !",
  },
  histoire: `<p>Au Laboratoire, un <b>robot intelligent</b> doit deviner quels jouets plaisent aux rennes. Personne ne lui a donné de règle : on lui a seulement montré des <b>exemples</b>. À toi de faire comme le robot : trouve la règle cachée !</p>`,
  cours: `<p>D'habitude, pour qu'un ordinateur fasse quelque chose, un humain lui écrit des <b>règles</b> précises. Mais certaines règles sont presque impossibles à écrire : comment expliquer à une machine ce qui fait qu'une photo montre un chat ?</p>
<p>Avec l'<b>apprentissage automatique</b>, on fait autrement : on montre à la machine plein d'<b>exemples avec la bonne réponse</b> (« ceci est un chat », « ceci n'est pas un chat »), et c'est elle qui cherche une règle qui marche pour tous ces exemples. Exactement comme un petit enfant qui apprend à reconnaître les chiens après en avoir vu beaucoup.</p>
<p>Pour trouver une règle cachée, compare les exemples : qu'ont en commun <b>tous</b> ceux qui ont la même réponse ? Une règle n'est bonne que si elle marche pour <b>tous</b> les exemples, sans exception.</p>`,
  enigme: `<p><b>Les exemples montrés au robot :</b></p>
<div class="defilement"><table class="tableau table-ia">
<tr><th>Jouet</th><th>Couleur</th><th>Fait du bruit ?</th><th>Taille</th><th>Les rennes…</th></tr>
<tr><td>🔔 Clochette</td><td>rouge</td><td>oui</td><td>petite</td><td>❤️ adorent</td></tr>
<tr><td>🧸 Peluche</td><td>rouge</td><td>non</td><td>grande</td><td>😐 bof</td></tr>
<tr><td>🥁 Tambour</td><td>bleu</td><td>oui</td><td>grand</td><td>❤️ adorent</td></tr>
<tr><td>⚽ Ballon</td><td>vert</td><td>non</td><td>petit</td><td>😐 bof</td></tr>
<tr><td>🎺 Trompette</td><td>verte</td><td>oui</td><td>grande</td><td>❤️ adorent</td></tr>
<tr><td>🧊 Cube</td><td>bleu</td><td>non</td><td>petit</td><td>😐 bof</td></tr>
<tr><td>🍎 Pomme en bois</td><td>rouge</td><td>non</td><td>petite</td><td>😐 bof</td></tr>
<tr><td>🛎️ Grelot</td><td>vert</td><td>oui</td><td>petit</td><td>❤️ adorent</td></tr>
</table></div>
<p><b>Les nouveaux jouets</b> (chacun porte une lettre) :</p>
<div class="defilement"><table class="tableau table-ia">
<tr><th>Lettre</th><th>Jouet</th><th>Couleur</th><th>Fait du bruit ?</th><th>Taille</th></tr>
<tr><td><b>L</b></td><td>🎷 Saxophone</td><td>bleu</td><td>oui</td><td>petit</td></tr>
<tr><td><b>X</b></td><td>🧣 Écharpe</td><td>rouge</td><td>non</td><td>grande</td></tr>
<tr><td><b>U</b></td><td>🔔 Grosse cloche</td><td>verte</td><td>oui</td><td>grande</td></tr>
<tr><td><b>A</b></td><td>📕 Livre</td><td>bleu</td><td>non</td><td>grand</td></tr>
<tr><td><b>G</b></td><td>🎸 Guitare</td><td>rouge</td><td>oui</td><td>grande</td></tr>
<tr><td><b>T</b></td><td>🪀 Yoyo</td><td>rouge</td><td>non</td><td>petit</td></tr>
<tr><td><b>E</b></td><td>📯 Sifflet</td><td>vert</td><td>oui</td><td>petit</td></tr>
</table></div>
<p>Quels nouveaux jouets les rennes vont-ils adorer ? <b>Leurs lettres, dans l'ordre, forment le mot de passe.</b></p>`,
  reponses: ['8aed39df1ddd3e19ed1d58a7b4c154df840f93147d46cd12d3cd8c347082c523'],
  placeholder: 'Le mot formé…',
  indices: [
    "La couleur ? Il y a des jouets rouges adorés et d'autres « bof ». La taille ? Pareil. Regarde la colonne qui reste…",
    "Tous les jouets adorés font du bruit, et aucun jouet silencieux n'est adoré : les rennes adorent les jouets qui font du bruit ! Applique cette règle aux nouveaux jouets.",
  ],
  lecon: `<p>La règle cachée : <b>les rennes adorent les jouets qui font du bruit</b> 🔔 (ça leur rappelle les grelots de leur harnais !). Ni la couleur, ni la taille ne comptaient.</p>
<p>Les jouets adorés sont donc L (saxophone), U (grosse cloche), G (guitare) et E (sifflet) → <b>LUGE</b> 🛷.</p>
<p>Tu viens de faire ce que fait une <b>intelligence artificielle</b> : de l'<b>apprentissage automatique</b> (<i>machine learning</i>). Au lieu d'écrire la règle à la main, on montre à la machine des <b>exemples étiquetés</b> (« adorent » / « bof »), et elle trouve elle-même une règle qui les explique. Puis elle l'applique à des cas qu'elle n'a jamais vus.</p>
<p>Les informations sur chaque jouet (couleur, bruit, taille) s'appellent des <b>caractéristiques</b>. Le travail de la machine, c'est de trouver lesquelles comptent vraiment.</p>
<h4>⚠️ Le danger des biais</h4>
<p>Si on n'avait montré au robot que des jouets rouges et bruyants, il n'aurait jamais pu savoir si les rennes aiment le rouge ou le bruit. Une IA n'est jamais meilleure que ses exemples : s'ils sont incomplets ou injustes, elle apprendra une règle fausse ou injuste. C'est ce qu'on appelle un <b>biais</b>.</p>
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
  enigme: `<p>Chaque fragment est une lettre accompagnée de sa <b>position</b> dans la formule secrète… écrite en <b>binaire</b> (merci le jour 1 !). Remets les lettres dans l'ordre pour reconstituer la formule, puis rallume l'étoile.</p>
<div class="rappel">📌 <b>Rappel</b> : les positions sont écrites sur 5 places, qui valent <code>16 · 8 · 4 · 2 · 1</code>. Exemple : <code>00110</code> = 4 + 2 = 6.</div>`,
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
