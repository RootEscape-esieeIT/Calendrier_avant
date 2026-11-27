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
const { enBinaire, tableAlarme, empreinteCourte } = require('./aides-jours');
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
    ricane: "J'ai gelé l'imprimante à étiquettes et j'ai arraché le tableau du mur. Débrouille-toi avec des 0 et des 1, hi hi.",
    piques: [
      "Non. Même le facteur congelé dans la cour aurait trouvé.",
      "Faux ! Je renvoie ta réponse à l'expéditeur. C'est-à-dire toi.",
      "Tu lis le binaire comme je lis les cartes de vœux : en les déchirant.",
    ],
    fuite: "Tu as fait parler mon imprimante ?! Je me colle un timbre et je m'expédie très, très loin !",
  },
  histoire: `<p>Au Bureau du Courrier, la Kère a soufflé sur l'imprimante à étiquettes : gelée jusqu'aux circuits, elle n'imprime plus que des <b>0</b> et des <b>1</b>. Et pour corser le tout, elle a arraché le tableau des codes qui était punaisé au mur !</p>
<p>Heureusement, l'imprimante a gardé son <b>mode test</b> : tape n'importe quel texte, elle te montre comment elle l'écrit en binaire.</p>`,
  cours: `<p>Un ordinateur ne garde que des <b>nombres</b> (en binaire, comme au jour 1). Pour écrire du texte, le monde entier s'est mis d'accord sur un tableau : l'<b>ASCII</b>. Chaque caractère y reçoit un numéro, écrit avec 8 chiffres binaires (un <b>octet</b>).</p>
<div class="defilement"><table class="tableau compact">
<tr><th>Caractère</th><th>Numéro</th><th>Code binaire</th></tr>
<tr><td><b>A</b></td><td>65</td><td><code>010 00001</code></td></tr>
<tr><td><b>B</b></td><td>66</td><td><code>010 00010</code></td></tr>
<tr><td><b>a</b></td><td>97</td><td><code>011 00001</code></td></tr>
<tr><td><b>b</b></td><td>98</td><td><code>011 00010</code></td></tr>
<tr><td><b>espace</b></td><td>32</td><td><code>001 00000</code></td></tr>
</table></div>
<p>Regarde bien : le code est en deux morceaux.</p>
<ul>
<li>les <b>3 premiers chiffres</b> disent quel genre de caractère c'est : <code>010</code> = une <b>majuscule</b>, <code>011</code> = une <b>minuscule</b>, <code>001</code> = un espace ou un signe ;</li>
<li>les <b>5 derniers</b> donnent la <b>place de la lettre dans l'alphabet</b>, en binaire (16 · 8 · 4 · 2 · 1) : <code>00001</code> = 1 = A, <code>00010</code> = 2 = B…</li>
</ul>
<p>Exemple : <code>011 00011</code> → minuscule, place 2 + 1 = 3 → <b>c</b>.</p>`,
  enigme: `<p>Un colis est arrivé avec cette étiquette, imprimée en binaire. <b>Quel cadeau contient-il ?</b></p>
<p>Lis les groupes un par un grâce au petit cours… ou fais des essais avec l'imprimante : quand une lettre tapée donne exactement le même code que l'étiquette, à la même place, elle devient verte.</p>`,
  widget: W.imprimante(enBinaire('Pull moche')),
  reponses: ['2fb3991dc14d6fbce1298e4a15ab2116462bf45f60f2b4a5fa2606c3997299d6', 'e8d47d4e5b8496fede40f2df9262fdca7756ad2a984920db69b3304da643139d'],
  placeholder: 'Le cadeau…',
  indices: [
    "Premier groupe : 010 10000 → une majuscule (010), à la place 16 de l'alphabet (10000) : P. Le 5e groupe, 001 00000, est un espace : le cadeau tient en deux mots.",
    "P, u, l, l, espace, m, o… C'est un vêtement de Noël, souvent avec un renne qui clignote dessus 😄",
  ],
  lecon: `<p>L'étiquette disait <b>Pull moche</b> 🦌 : <code>01010000</code> = P (majuscule, 16ᵉ lettre), <code>01110101</code> = u (minuscule, 21ᵉ lettre)… et <code>00100000</code>, c'était l'espace entre les deux mots !</p>
<p>Ce tableau qui donne un <b>numéro à chaque caractère</b> s'appelle un <b>encodage</b>. L'<b>ASCII</b> (1963) contient 128 caractères. Ses inventeurs l'ont rangé exprès pour que les 5 derniers chiffres donnent la place de la lettre, et qu'il suffise de changer <b>un seul chiffre</b> pour passer de « A » à « a ».</p>
<p>Problème : l'ASCII a été inventé pour l'anglais. Pas de « é », pas de « ç », et encore moins d'emojis ! Aujourd'hui, on utilise <b>Unicode</b>, qui numérote près de <b>160 000 caractères</b> de toutes les langues du monde. Le sapin 🎄 porte le numéro <code>U+1F384</code>.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Si tu vois « NoÃ«l » au lieu de « Noël » sur un site, c'est un bug d'encodage : l'ordinateur a lu les numéros avec le mauvais tableau !</li>
<li>Quand tu envoies un emoji, ton téléphone n'envoie qu'un numéro : c'est le téléphone de ton ami qui dessine l'image. C'est pour ça qu'un même emoji n'a pas le même look sur iPhone et sur Android.</li>
<li>Passer d'une majuscule à une minuscule, c'est ajouter 32 : un seul chiffre change (<code>010</code> → <code>011</code>). Les vieux programmes utilisaient cette astuce pour mettre un texte en MAJUSCULES en un clin d'œil.</li>
</ul>`,
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
    ricane: "J'ai recâblé l'alarme de la Réserve. Maintenant, elle sonne quand un lutin entre avec son badge… et elle se tait quand j'entre, moi. Pratique, non ?",
    piques: [
      "Bzzzt ! Raté. Tu sens cette odeur de grillé ? C'est ton raisonnement.",
      "NON, NON et encore NON. C'est ma porte logique préférée.",
      "Continue de brancher au hasard. Un singe y arriverait aussi… un jour.",
    ],
    fuite: "L'alarme sonne pile quand il faut ?! Arrête, ça chatouille… ça grésille… je disjoncte !",
  },
  histoire: `<p>Au sous-sol, la Réserve aux Jouets est protégée par une <b>alarme anti-Kère</b> branchée sur quatre capteurs. Mais la Kère a tout recâblé : l'alarme sonne quand il ne faut pas, et se tait quand il faudrait hurler !</p>
<p>Les lutins ont retrouvé la règle d'origine, écrite sur le boîtier : à toi de rebrancher les quatre <b>portes logiques</b>… et de <b>tester</b> ton circuit avant de le valider.</p>`,
  cours: `<p>Pour prendre ses décisions, un ordinateur utilise des milliards de <b>portes logiques</b>. Une porte reçoit des signaux, chacun <b>allumé (1)</b> ou <b>éteint (0)</b>, et en laisse sortir un seul :</p>
<div class="defilement"><table class="tableau">
<tr><th>Porte</th><th>Elle s'allume si…</th><th>Dans la vie</th></tr>
<tr><td><b>ET</b></td><td class="gauche">les <b>deux</b> entrées sont allumées</td><td class="gauche">J'ai mon ticket ET le bus est là → je monte.</td></tr>
<tr><td><b>OU</b></td><td class="gauche"><b>au moins une</b> entrée est allumée</td><td class="gauche">On sonne devant OU derrière → ça sonne.</td></tr>
<tr><td><b>NON</b></td><td class="gauche">son entrée est <b>éteinte</b> : elle fait l'inverse</td><td class="gauche">Il ne fait PAS jour → la veilleuse s'allume.</td></tr>
</table></div>
<p>Un <b>fil</b> tout simple, lui, laisse passer le signal tel quel. En branchant des portes les unes derrière les autres, on traduit n'importe quelle phrase en circuit : « il pleut ET je n'ai PAS de parapluie » = <code>pluie ET (NON parapluie)</code>.</p>
<p>Les ingénieurs ne devinent jamais : ils <b>testent</b> toutes les situations possibles. Avec 4 capteurs qui valent chacun 0 ou 1, il y en a 2 × 2 × 2 × 2 = <b>16</b>.</p>`,
  enigme: `<div class="note">
<p>🔔 <b>La règle de l'alarme</b> (écrite sur le boîtier)</p>
<p>« L'alarme doit sonner si <b>la porte est ouverte sans badge de lutin</b>, OU si <b>la fenêtre est ouverte pendant la nuit</b>. »</p>
</div>
<p>Clique sur les portes P1 à P4 pour changer leur type, et sur les capteurs pour voir le courant passer. Quand tu penses avoir trouvé, lance les <b>16 tests</b> : si ton alarme réagit comme la règle dans les 16 situations, la Réserve est sauvée !</p>`,
  widget: W.circuit({
    titre: "Le circuit de l'alarme anti-Kère",
    entrees: [
      { k: 'A', emoji: '🚪', nom: 'porte ouverte' },
      { k: 'B', emoji: '🪪', nom: 'badge de lutin' },
      { k: 'C', emoji: '🪟', nom: 'fenêtre ouverte' },
      { k: 'D', emoji: '🌙', nom: 'il fait nuit' },
    ],
    depart: ['fil', 'OU', 'OU', 'ET'],
    attendu: tableAlarme(),
  }),
  indices: [
    "Découpe la règle en deux morceaux. « Porte ouverte SANS badge », c'est : A ET (NON B). Donc P1 doit inverser le badge, et P2 relie la porte à ce « pas de badge ».",
    "P1 = NON, P2 = ET. « Fenêtre ouverte pendant la nuit » : C ET D, donc P3 = ET. Et les deux morceaux sont reliés par un OU : P4 = OU.",
  ],
  lecon: `<p>Le bon circuit était : <b>P1 = NON</b> (pas de badge), <b>P2 = ET</b> (porte ouverte et pas de badge), <b>P3 = ET</b> (fenêtre ouverte et nuit), <b>P4 = OU</b> (l'un ou l'autre). En formule : <code>(A ET NON B) OU (C ET D)</code>.</p>
<p>Tu as fait exactement comme un ingénieur : traduire une phrase en <b>logique</b>, puis <b>tester</b> toutes les situations. Les portes ET, OU, NON suivent l'<b>algèbre de Boole</b>, inventée par George Boole en 1854… presque 100 ans avant le premier ordinateur !</p>
<p>Dans un processeur, chaque porte est faite de <b>transistors</b>, de minuscules interrupteurs commandés par l'électricité. En combinant des portes, on fabrique un circuit qui additionne deux nombres, puis une calculatrice, puis… un ordinateur entier.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Les programmeurs écrivent des <b>tests automatiques</b> : des milliers de petites situations rejouées à chaque modification, pour être sûrs de ne rien casser. Exactement comme ton tableau de 16 tests !</li>
<li>Le processeur de ton téléphone contient <b>des milliards de transistors</b>, chacun plus petit qu'un virus.</li>
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
  concept: 'Les algorithmes et les boucles (programmer un robot)',
  givrin: {
    ricane: "J'ai gelé ton robot-lutin. Il n'obéit plus qu'à un programme… et tu n'as jamais programmé, hein ? Hi hi.",
    piques: [
      "Boum ! Ton robot vient d'embrasser un bloc de glace. C'est presque romantique.",
      "Faux ! Même un pingouin les yeux bandés trouverait le traîneau.",
      "Répète après moi : je… ne… sais… pas… programmer. Tu vois, toi aussi tu sais faire des boucles !",
    ],
    fuite: "Il a tout ramassé ?! Avec si peu de lignes ?! Je retourne dans mon igloo, et je ferme à clé !",
  },
  histoire: `<p>Tout au fond de la Glacière, la Kère a semé <b>quatre cadeaux</b> sur la banquise, au milieu des blocs de glace. Le seul qui peut aller les chercher, c'est <b>le robot-lutin</b>… mais elle a gelé sa télécommande : désormais, il n'obéit plus qu'à un <b>programme</b> écrit à l'avance.</p>`,
  cours: `<p>Un <b>programme</b>, c'est une liste d'instructions que la machine exécute <b>dans l'ordre</b>, une par une, sans jamais réfléchir à ta place. Si tu te trompes, elle se trompe aussi !</p>
<p>Le robot-lutin connaît trois instructions (une par ligne) :</p>
<ul>
<li><code>avancer</code> : une case tout droit, dans la direction où il regarde (<code>avancer 3</code> : trois cases) ;</li>
<li><code>gauche</code> et <code>droite</code> : il pivote sur place d'un quart de tour, sans avancer.</li>
</ul>
<p>Et une instruction magique : la <b>boucle</b>. Tout ce qui est entre <code>répéter</code> et <code>fin</code> est répété plusieurs fois. Par exemple, pour faire le tour d'un carré :</p>
<pre class="code">répéter 4
  avancer 2
  droite
fin</pre>
<p>3 lignes au lieu de 8 ! Quand un programme ne marche pas du premier coup (c'est normal !), on regarde où le robot se trompe, on corrige, et on relance : c'est le <b>débogage</b>.</p>`,
  enigme: `<p>Écris un programme pour que le robot ramasse les <b>4 cadeaux 🎁</b> et termine <b>sur le traîneau 🛷</b>, sans foncer dans un bloc de glace 🧊. Il part en bas à gauche, tourné vers la droite.</p>
<p>⚠️ La Kère a gelé presque toute sa mémoire : ton programme ne doit pas dépasser <b>9 lignes</b>. Tu peux le lancer autant de fois que tu veux pour le tester.</p>`,
  widget: W.robot({
    titre: 'La banquise de la Glacière',
    grille: [
      '..#.C..',
      '#..C.#.',
      '..C...S',
      '.C..#..',
      'R.....#',
    ],
    maxLignes: 9,
    exemple: "# Une instruction par ligne (les lignes qui commencent par # sont ignorées)\navancer\n",
  }),
  indices: [
    "Regarde où sont les cadeaux : ils forment un escalier ! Pour passer d'une marche à la suivante, le robot fait toujours le même petit mouvement : avancer, gauche, avancer, droite. Mets-le dans une boucle.",
    "répéter 4 / avancer / gauche / avancer / droite / fin : le robot a les 4 cadeaux et regarde vers la droite. Il te reste 3 lignes pour rejoindre le traîneau (avancer de combien ? puis tourner de quel côté ?).",
  ],
  lecon: `<p>Un programme qui marchait :</p>
<pre class="code">répéter 4
  avancer
  gauche
  avancer
  droite
fin
avancer 2
droite
avancer 2</pre>
<p>Sans la boucle, il aurait fallu <b>19 lignes</b> ! Repérer ce qui se répète, c'est le cœur de l'<b>algorithmique</b> : une suite d'instructions précises pour résoudre un problème. Le mot vient d'Al-Khwârizmî, un savant de Bagdad du IXᵉ siècle.</p>
<p>Et si ton robot s'est cogné une ou deux fois avant d'y arriver : bravo, tu as <b>débogué</b>. Même les meilleurs programmeurs passent plus de temps à tester et corriger qu'à écrire !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Les robots aspirateurs, les robots des entrepôts et le rover Perseverance sur Mars suivent des programmes écrits à l'avance (Mars est trop loin pour une télécommande : un ordre met jusqu'à 20 minutes à arriver !).</li>
<li>Dans <b>Scratch</b> (scratch.mit.edu), tu programmes exactement comme ça, avec des blocs « répéter ».</li>
<li>Ton lave-linge aussi exécute un programme : « répéter 30 fois : tourner à gauche, tourner à droite »…</li>
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
    ricane: "J'ai déréglé la cuisine : les crêpes sortent dans le désordre. Tes invités vont manger de la soupe de lettres. Bon appétit !",
    piques: [
      "Raté ! Tu as pris la pile par le mauvais bout. Comme ton pull : à l'envers.",
      "Non. Les invités ont mangé tes erreurs : ils ont une indigestion.",
      "Faux ! Je garde la dernière crêpe pour moi. Et la tienne aussi.",
    ],
    fuite: "Le mot est servi dans l'ordre ?! Dernière crêpe posée, première mangée… et moi, la première à filer !",
  },
  histoire: `<p>Dans la Salle à Manger, c'est l'heure du goûter ! Sur chaque crêpe, une lettre en chocolat : les invités veulent les manger <b>dans l'ordre</b>, pour lire le mot du jour. Mais la Kère a déréglé la cuisine, et les crêpes sortent dans le désordre…</p>
<p>Pour remettre de l'ordre, tu as deux rangements : <b>l'assiette</b> et <b>le passe-plat</b>. Et ils ne marchent pas du tout pareil.</p>`,
  cours: `<p>En informatique, on range souvent les données en attente de deux façons :</p>
<div class="defilement"><table class="tableau">
<tr><th>Rangement</th><th>Comment ça marche</th><th>Dans la vie</th></tr>
<tr><td><b>Pile</b></td><td class="gauche">on pose <b>dessus</b>, on reprend <b>dessus</b> : <b>dernier arrivé, premier sorti</b></td><td class="gauche">une pile d'assiettes, une pile de crêpes</td></tr>
<tr><td><b>File</b></td><td class="gauche">on entre <b>derrière</b>, on sort <b>devant</b> : <b>premier arrivé, premier servi</b></td><td class="gauche">la file d'attente de la boulangerie</td></tr>
</table></div>
<p>Exemple : les crêpes A, puis B, puis C arrivent. Sur une <b>pile</b>, elles ressortent C, B, A (l'ordre est <b>retourné</b>). Dans une <b>file</b>, elles ressortent A, B, C (l'ordre est <b>gardé</b>).</p>
<p>En mélangeant les deux, on peut remettre en ordre beaucoup de choses… à condition de bien réfléchir avant de poser chaque crêpe !</p>`,
  enigme: `<p>Les crêpes sortent de la cuisine une par une, dans l'ordre affiché. Chacune doit aller soit sur <b>l'assiette</b> (une pile), soit dans <b>le passe-plat</b> (une file). Tu peux servir aux invités le <b>dessus de l'assiette</b> ou la <b>première crêpe du passe-plat</b>, quand tu veux.</p>
<p>Sers les crêpes pour que les invités lisent le mot <b>CHOCOLAT</b>. Tu peux annuler et recommencer autant que tu veux.</p>`,
  widget: W.crepes({ arrivee: 'TOCOALCH', mot: 'CHOCOLAT' }),
  indices: [
    "Une crêpe qui doit attendre longtemps, en gardant sa place parmi d'autres, va dans le passe-plat (elle ressortira dans le même ordre). Une crêpe qui doit passer AVANT celles d'avant va sur l'assiette. Le T, servi en tout dernier, peut attendre au fond de l'assiette.",
    "Début de la solution : T sur l'assiette ; O, C, O, A dans le passe-plat ; L et C sur l'assiette. Sers le C (dessus de l'assiette). Le H arrive : sur l'assiette, et sers-le aussitôt. Le passe-plat contient alors O, C, O, A dans le bon ordre…",
  ],
  lecon: `<p>Une solution : le <b>T</b> attend au fond de l'assiette, <b>O, C, O, A</b> patientent dans le passe-plat (dans le même ordre), <b>L</b> et <b>C</b> vont sur l'assiette… On sert C, H, puis O, C, O du passe-plat, le L de l'assiette, le A du passe-plat et enfin le T : <b>CHOCOLAT</b> 🍫 !</p>
<p>Dans une <b>pile</b> (<i>stack</i>), c'est <b>dernier arrivé, premier sorti</b> : l'ordre est retourné. Dans une <b>file</b> (<i>queue</i>), c'est <b>premier arrivé, premier servi</b> : l'ordre est gardé. Avec une seule des deux, ce mot était impossible à servir. Avec les deux, tout devient possible !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li><b>Ctrl+Z</b> (annuler) utilise une pile : la dernière action faite est la première annulée. Le bouton « Annuler » de ce mini-jeu aussi !</li>
<li>Le bouton « Retour » de ton navigateur est une pile des pages visitées.</li>
<li>Les documents envoyés à une imprimante, les messages d'un serveur, les joueurs qui attendent une partie en ligne : tout ça attend dans des <b>files</b>.</li>
</ul>`,
  fragment: [16, '01000101'],
},

/* ======================= JOUR 12 ====================== */
{
  jour: 12,
  piece: {"mur":"#1d3b2a","motif":"bois","sol":"parquet","elements":["fenetre","tableau","etageres:📻🎧📡"],"meuble":"bureau","objets":["📻","🎙️","📜"]},
  particules: ['📻', '❄️', '🦌'],
  univers: "La Cabine Radio",
  emoji: '📻',
  couleurs: ['#1d3b2a', '#3f7d5a'],
  concept: 'Le code Morse',
  givrin: {
    ricane: "J'ai gelé le micro de la radio : plus un seul mot ne sortira de ce poste ! Il ne reste que des bips ridicules… ti, taa, ti. Personne ne comprend ce charabia !",
    piques: [
      "Faux ! Ce renne-là n'existe même pas dans tes rêves.",
      "Raté. Tu confonds les ti et les taa, on dirait.",
      "Non ! Le traîneau va rester coincé dans le brouillard…",
    ],
    fuite: "Tu comprends les bips ?! Alors c'est LUI qui va guider le traîneau… Je file avant qu'il m'éblouisse avec son nez !",
  },
  histoire: `<p>Ce soir, un épais brouillard couvre le Pôle Nord, et le traîneau doit faire un vol d'essai. Le Père Noël a choisi le renne qui guidera l'attelage… mais la Kère a <b>gelé le micro</b> de la Cabine Radio : plus aucune voix ne passe !</p>
<p>Heureusement, le vieux poste sait encore faire une chose : <b>biper</b>. Le Père Noël a tapoté son message en <b>code Morse</b>, et la radio l'a imprimé sur une bande de papier.</p>`,
  cours: `<p>Avant le téléphone, comment envoyer un message très loin, par un simple fil ou par radio ? En 1838, Samuel Morse et Alfred Vail inventent un code avec seulement <b>deux signaux</b> :</p>
<ul>
<li><b>•</b> un bip <b>court</b>, qu'on appelle « ti » ;</li>
<li><b>—</b> un bip <b>long</b> (trois fois plus long), qu'on appelle « taa ».</li>
</ul>
<p>Chaque lettre a sa petite mélodie de ti et de taa. Entre deux lettres, on fait une pause.</p>
<div class="schema">S = <code>•••</code> &nbsp; O = <code>———</code><br>SOS = <code>••• ——— •••</code></div>
<p>SOS, c'est le célèbre appel au secours des bateaux : ti ti ti, taa taa taa, ti ti ti. Facile à reconnaître, même dans le bruit !</p>
<p>L'astuce de Morse : les lettres qu'on utilise le plus ont les codes les plus courts. Le <b>E</b>, la lettre la plus fréquente, c'est juste <code>•</code>. Le <b>T</b>, juste <code>—</code>. Ça fait gagner du temps !</p>
<p>Deux signaux seulement… ça ne te rappelle rien ? C'est comme le <b>binaire</b> du jour 1, avec ses 0 et ses 1 !</p>`,
  enigme: `<p>Voici la bande imprimée par la radio. Chaque groupe de signaux est <b>une lettre</b>. Retrouve-les une par une dans le tableau du Morse, et lis le message du Père Noël.</p>
<div class="rappel">📌 <b>•</b> = un ti (court), <b>—</b> = un taa (long). Compte bien les signaux de chaque groupe : <code>••</code> (I) n'est pas <code>•••</code> (S) !</div>
<p><b>Quel renne guidera le traîneau ce soir ?</b></p>`,
  widget: W.morse({ message: 'RUDOLPH' }),
  reponses: ['ca6e917aa0c1f1e8b46d60115e3bc4d1535024556f7391ec76f03bb9a2aeeed5', 'f38fcfe6add69dfa0a1e0f201dc632c8b0d70e5586b925ca120ecf925612c61a', '7d00c5839826c09db5948a05194d8ad184e2ecd75d3f569b442d5ddedc0d5fce', '8bf49d514b57bc2033bb00e2b75f32bd9df48a898d4e7a8dfbcc1935a85ddc0d', 'b19889f8f4d1d262dd0336fb1ead5b1642cb088536a9d1035920b82ccb9d5fd4'],
  placeholder: 'Le nom du renne…',
  indices: [
    "Prends les groupes un par un. Le premier, • — •, c'est « ti taa ti » : dans le tableau, c'est la lettre R. Continue avec le deuxième !",
    "Pas sûr d'un groupe ? Tape-le sur le manipulateur (court, long…) : la radio affiche la lettre. Et compte bien les ti : • • • • (quatre) n'est pas • • • (trois).",
  ],
  lecon: `<p>Le message disait <b>RUDOLPH</b> 🦌🔴 : avec son nez rouge qui brille, c'est lui qui guide le traîneau dans le brouillard !</p>
<p>Tu viens de lire du <b>code Morse</b> : chaque lettre devient une suite de signaux courts et longs. Avec seulement deux signaux, on peut tout écrire… exactement comme le <b>binaire</b> des ordinateurs, qui n'utilise que des 0 et des 1.</p>
<p>Et l'astuce « lettre fréquente = code court » sert encore aujourd'hui : c'est une idée de <b>compression</b>, qu'on retrouve dans les fichiers ZIP et les photos JPEG.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Le Morse a été le premier « Internet » : dès les années 1840, le télégraphe envoyait des messages d'une ville à l'autre en quelques minutes, au lieu de plusieurs jours à cheval.</li>
<li>Le <b>Titanic</b> a appelé au secours en Morse en 1912. Aujourd'hui encore, des radioamateurs s'en servent : un bip passe là où une voix se perd dans le bruit.</li>
<li>Les balises radio qui guident les avions répètent leur nom en Morse, pour que les pilotes vérifient qu'ils écoutent la bonne.</li>
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
  piece: {"mur":"#8a1538","motif":"rayures","sol":"parquet","elements":["etageres:🎀🎁🧶","fenetre","tableau"],"meuble":"table","objets":["🎁","🏷️","✂️","🎀"]},
  particules: ['🏷️', '🎀', '✨'],
  univers: "L'Atelier d'Emballage",
  emoji: '🏷️',
  couleurs: ['#760c43', '#c2185b'],
  concept: 'Les expressions régulières',
  givrin: {
    ricane: "J'ai glissé mes fausses étiquettes parmi les vraies. Le robot trieur a perdu son motif : tous les cadeaux vont finir à la déchiqueteuse !",
    piques: [
      "Raté ! Un vrai cadeau vient de finir en confettis.",
      "Faux. Tu lis les motifs comme une poule lit le journal.",
      "Non ! Mon étiquette KERE_666 est passée. J'adore ce chiffre.",
    ],
    fuite: "Tu écris des expressions régulières ?! Personne ne sait écrire ça ! Je m'enfuis !",
  },
  histoire: `<p>Dans l'Atelier d'Emballage, un robot trie les étiquettes des cadeaux : les vraies partent vers le traîneau, les fausses à la déchiqueteuse. Mais la Kère a effacé son <b>motif</b> de tri… et a glissé ses propres étiquettes parmi les vraies !</p>
<p>Il faut réécrire le motif dans le langage du robot : une <b>expression régulière</b>.</p>`,
  cours: `<p>Une <b>expression régulière</b> (ou <i>regex</i>) décrit à quoi doit ressembler un texte. On l'écrit avec des petites briques :</p>
<div class="defilement"><table class="tableau">
<tr><th>Brique</th><th>Veut dire</th></tr>
<tr><td><code>[A-Z]</code></td><td class="gauche">une lettre <b>majuscule</b> (de A à Z)</td></tr>
<tr><td><code>[a-z]</code></td><td class="gauche">une lettre <b>minuscule</b></td></tr>
<tr><td><code>[0-9]</code></td><td class="gauche">un <b>chiffre</b></td></tr>
<tr><td><code>+</code></td><td class="gauche">la brique d'avant, <b>une ou plusieurs fois</b> : <code>[0-9]+</code> = un nombre</td></tr>
<tr><td><code>{3}</code></td><td class="gauche">la brique d'avant, <b>exactement 3 fois</b> : <code>[a-z]{3}</code> = 3 minuscules</td></tr>
<tr><td><code>^</code> et <code>$</code></td><td class="gauche">le <b>début</b> et la <b>fin</b> du texte (rien avant, rien après)</td></tr>
<tr><td><code>-</code> ou <code>_</code></td><td class="gauche">les autres caractères se cherchent tels quels</td></tr>
</table></div>
<p>Exemple : un prénom avec une majuscule puis des minuscules s'écrit <code>^[A-Z][a-z]+$</code>. « Lou » passe ; « lou » et « LOU » ne passent pas.</p>
<p>Attention au piège : sans <code>^</code> et <code>$</code>, le motif cherche <b>un morceau</b> du texte. <code>[0-9]{2}</code> trouve deux chiffres… même dans « 12345 » !</p>`,
  enigme: `<p>Écris un motif qui <b>accepte toutes les vraies étiquettes</b> et <b>refuse toutes les fausses</b>. Le tri se met à jour à chaque lettre que tu tapes : regarde quelles étiquettes passent, et corrige ton motif jusqu'à ce que tout soit vert. Puis lance le tri !</p>`,
  widget: W.trieuse({
    garder: ['LUTIN-042', 'RENNE-117', 'ELFE-008', 'TRAINEAU-300', 'NEIGE-999', 'SAPIN-024'],
    jeter: ['lutin-042', 'RENNE-17', 'ELFE-0089', 'KERE_666', 'SAPIN-12A', '-123', 'NOEL-12!', 'ELFE-O42'],
    depart: '',
  }),
  indices: [
    "Une vraie étiquette, c'est : des MAJUSCULES, un tiret, puis exactement 3 chiffres. Traduis chaque morceau avec une brique : [A-Z]+ puis - puis [0-9]{3}.",
    "Sans ^ au début et $ à la fin, ELFE-0089 passe (il contient bien « ELFE-008 »). Le motif complet : ^[A-Z]+-[0-9]{3}$",
  ],
  lecon: `<p>Un motif qui marchait : <code>^[A-Z]+-[0-9]{3}$</code>, c'est-à-dire « du début à la fin : des majuscules, un tiret, exactement trois chiffres ».</p>
<p>Les fausses étiquettes de la Kère ont toutes été refusées : <code>lutin-042</code> (minuscules), <code>RENNE-17</code> (2 chiffres), <code>ELFE-0089</code> (4 chiffres), <code>KERE_666</code> (un tiret bas), <code>SAPIN-12A</code> (une lettre à la fin), <code>-123</code> (pas de nom), <code>NOEL-12!</code> et <code>ELFE-O42</code>… avec la <b>lettre O</b> à la place du zéro. Bien vu, le robot !</p>
<p>Les <b>expressions régulières</b> sont un mini-langage qui existe dans presque tous les langages de programmation. Il y a souvent plusieurs bons motifs : <code>^[A-Z]+-\\d{3}$</code> marche aussi (<code>\\d</code> = un chiffre).</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Quand un formulaire te dit « adresse e-mail invalide », c'est souvent une regex qui a vérifié.</li>
<li>Un code postal français s'écrit <code>^[0-9]{5}$</code> (« exactement 5 chiffres »).</li>
<li>Les développeurs s'en servent pour chercher et remplacer du texte dans des milliers de fichiers d'un coup.</li>
</ul>`,
  fragment: [12, '01001100'],
},

/* ======================= JOUR 16 ====================== */
{
  jour: 16,
  piece: {"mur":"#2f3d44","motif":"uni","sol":"parquet","elements":["photos","studio","fenetre"],"meuble":null,"objets":[]},
  particules: ['📸', '🎬', '🍿'],
  univers: "Le Studio Photo",
  emoji: '🎬',
  couleurs: ['#2f3d44', '#6f8894'],
  concept: 'Les images et la compression',
  givrin: {
    ricane: "Le 16 décembre, tout le monde court au cinéma voir les Avengers. Pff. Le VRAI film de l'hiver, c'est celui de mon idole. J'ai fait l'affiche moi-même… et je l'ai compressée. Bonne chance pour la voir !",
    piques: [
      "Raté ! Mon idole n'a jamais ressemblé à un bonhomme de neige écrasé.",
      "Faux. Recompte tes cases. Moi, je compte tes erreurs… et j'adore ça.",
      "Non ! Même un projecteur tombé dans un lac gelé afficherait mieux.",
    ],
    fuite: "Tu as vu l'affiche ?! Alors tu sais ce qui t'attend le 24… Je file réserver ma place au premier rang !",
  },
  histoire: `<p>Au Studio Photo, on préparait l'affiche du grand film de l'hiver : celui qui sort au cinéma le <b>16 décembre</b>, et que tout le monde attend. La Kère a piraté l'ordinateur du photographe. Elle a remplacé l'affiche par celle du film de <b>son idole</b>… puis elle l'a <b>compressée</b>, pour que personne ne puisse la voir sans la repeindre case par case.</p>`,
  cours: `<p>Une image numérique, c'est une <b>grille de petits carrés</b> de couleur : les <b>pixels</b> (souviens-toi du jour 4). Pour l'enregistrer, l'ordinateur note la couleur de chaque pixel, ligne par ligne.</p>
<p>Problème : une photo contient des millions de pixels, et le fichier devient vite très lourd. On la <b>compresse</b> donc : on écrit la même information <b>en plus court</b>, pour qu'elle prenne moins de place et voyage plus vite.</p>
<p>L'astuce la plus simple : au lieu de dire « blanc, blanc, blanc, rouge, rouge », on dit « <b>3 blancs, 2 rouges</b> ». En abrégé, chaque couleur a sa lettre : <code>3B 2R</code>. D'abord un <b>nombre</b> (combien de pixels à la suite), puis une <b>lettre</b> (de quelle couleur).</p>
<p>Pour retrouver l'image, on fait l'inverse : <code>3B 2R 1B</code> → ⬜⬜⬜🟥🟥⬜</p>`,
  enigme: `<div class="note">
<p>🎬 <b>L'affiche, compressée par la Kère</b></p>
<p>Chaque ligne du code est une ligne de l'image, lue de gauche à droite : <code>7B 1G 7B</code> = 7 pixels blancs, 1 bleu glace, 7 blancs.</p>
<p>Les couleurs : <b>B</b> = blanc, <b>G</b> = bleu glace, <b>M</b> = bleu marine, <b>R</b> = rouge, <b>N</b> = noir. L'image fait <b>15 pixels</b> de large et <b>20</b> de haut, et toutes les cases sont blanches au départ.</p>
</div>
<p>Repeins l'affiche. <b>Quel titre est écrit en bas de l'affiche ?</b></p>`,
  widget: W.pixelsCouleurs({
    lignes: [
      '7B 1G 7B',
      '3B 1G 3B 1G 3B 1G 3B',
      '1B 1G 1B 1G 2B 3G 2B 1G 1B 1G 1B',
      '1B 4G 1B 3G 1B 4G 1B',
      '1B 13G 1B',
      '2B 11M 2B',
      '1B 1M 2B 7M 2B 1M 1B',
      '1B 2M 3B 3M 3B 2M 1B',
      '1B 3M 2R 3M 2R 3M 1B',
      '1B 13M 1B',
      '2B 1M 1N 1B 1N 1B 1N 1B 1N 1B 1N 1M 2B',
      '2B 1M 1B 1N 1B 1N 1B 1N 1B 1N 1B 1M 2B',
      '3B 9M 3B',
      '4B 1M 1B 1M 1B 1M 1B 1M 4B',
      '15B',
      '1B 3R 1B 3R 1B 1R 2B 1R 2B',
      '1B 1R 4B 1R 2B 2R 1B 1R 2B',
      '1B 2R 3B 1R 2B 1R 1B 2R 2B',
      '1B 1R 4B 1R 2B 1R 2B 1R 2B',
      '1B 1R 3B 3R 1B 1R 2B 1R 2B',
    ],
    largeur: 15,
    palette: [
      { l: 'B', nom: 'blanc', c: '#ffffff' },
      { l: 'G', nom: 'bleu glace', c: '#8fd3fb' },
      { l: 'M', nom: 'bleu marine', c: '#1c2d5a' },
      { l: 'R', nom: 'rouge', c: '#d62839' },
      { l: 'N', nom: 'noir', c: '#111318' },
    ],
  }),
  reponses: ['afd0b3ea9a5a55880d7bf40dea5de6f166950845918e4f2773c97b9bf985a1bf', '340c71c1b973d85c68e8bd48c3d8f406e6d5bf089870423eb84503f1a6947239', '979e9b64947f903267a59838685bc4fb3f869861c7d91ca99eb89ecf9a4b7a18', '5a3c8989726332563ae87eef863393ed603e8f205cf4da2a2a13377a3813aed1', 'add224d5c309ce50a463682f90a49630555b67768bdf288736ad317b2577b4b0', 'e16079d82df984a62b5f4ace7933e5e0b7c18da1d2427086c6a531256f91ec17'],
  placeholder: 'Le titre…',
  indices: [
    "Commence par le haut. Ligne 2 : 3B 1G 3B 1G 3B 1G 3B, soit 3 blancs, 1 bleu glace, 3 blancs… Chaque ligne fait bien 15 cases. Survole une case : sa ligne s'éclaire dans le code, et une ligne juste s'allume ✓.",
    "En haut, une couronne de glace, des yeux rouges et des crocs : c'est Kryos, l'idole de la Kère ! Le titre est peint en rouge dans les 5 dernières lignes : 3 lettres, le mot qu'on voit à la toute fin des films.",
  ],
  lecon: `<p>« <b>KRYOS : LA FIN</b> » 🎬 ! L'idole de la Kère, évidemment… Rendez-vous le 24 pour lui montrer qui écrit vraiment la fin de l'histoire.</p>
<p>Ce codage s'appelle le <b>RLE</b> (<i>Run-Length Encoding</i>, « codage par plages ») : au lieu d'écrire 7 fois « blanc », on écrit <code>7B</code>.</p>
<p>L'image brute compte <b>300 pixels</b> (15 × 20). Le code, lui, ne décrit que <b>142 plages</b> : deux fois moins de choses à écrire, et le gain est énorme sur une grande image pleine de zones unies ! Et quand une image n'a que <b>2 couleurs</b>, on peut même se passer des lettres, puisque les couleurs alternent forcément. Les <b>fax</b> faisaient exactement ça : une page de texte, c'est surtout du blanc, avec des plages de noir.</p>
<p>Le RLE est excellent pour les grandes zones unies (un ciel, une page blanche), mais mauvais pour les photos pleines de détails, où la couleur change à chaque pixel. C'est une compression <b>sans perte</b> : on retrouve l'image exacte. Le format <b>JPEG</b>, lui, compresse <b>avec perte</b> : il jette des détails que l'œil remarque à peine, pour obtenir des fichiers environ 10 fois plus légers.</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Les fichiers <b>.zip</b> et les images <b>.png</b> utilisent des compressions sans perte, plus malines que le RLE.</li>
<li>Les photos (<b>.jpg</b>), la musique (<b>.mp3</b>) et les films en streaming utilisent des compressions avec perte.</li>
<li>🍿 Et le vrai film du 16 décembre ? <i>Avengers: Doomsday</i> sort ce jour-là au cinéma, en France. La Kère, elle, boycotte.</li>
</ul>`,
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
    ricane: "Mon complice s'est caché dans la liste des enfants, et il a déjà volé un cadeau. Des milliers de lignes… enfin, beaucoup. Bonne chance !",
    piques: [
      "Faux ! Ce cadeau-là dort encore bien au chaud. Cherche mieux.",
      "Erreur ! Tu as lu la liste à l'envers, comme un lutin qui a trop bu de chocolat chaud.",
      "Non. La base de données a soupiré. Si, si, je l'ai entendue.",
    ],
    fuite: "SELECT sortie FROM chalet WHERE kere = 'moi'… Je disparais de la base !",
  },
  histoire: `<p>Dans la Bibliothèque, la grande liste des enfants n'est plus un vieux grimoire : c'est une <b>base de données</b>. La Kère y a glissé un <b>complice</b>… qui a déjà volé un cadeau ! Sur le bureau, elle a laissé un petit mot pour narguer les lutins.</p>
<p>Pour interroger la base, une seule solution : la <b>console SQL</b> des lutins.</p>`,
  cours: `<p>Une <b>base de données</b> range les informations dans des <b>tables</b>, comme un tableur : une ligne par enfant, une colonne par information. Pour lui poser une question, on écrit une <b>requête</b> en <b>SQL</b>. Exemples avec la table <code>rennes</code> :</p>
<pre class="code">SELECT * FROM rennes</pre>
<p>« Montre toutes les colonnes (<code>*</code>) de la table rennes. »</p>
<pre class="code">SELECT prenom, vitesse FROM rennes
WHERE vitesse > 60 AND nez_rouge = 'non'</pre>
<p>« Seulement le prénom et la vitesse, des rennes plus rapides que 60 <b>et</b> sans nez rouge. » Les textes s'écrivent entre guillemets : <code>'non'</code>.</p>
<pre class="code">SELECT * FROM rennes
ORDER BY vitesse DESC LIMIT 1</pre>
<p>« Range du plus rapide au plus lent (<code>DESC</code>), et garde seulement la première ligne. »</p>
<p>Les mots en majuscules (SELECT, FROM, WHERE, AND, ORDER BY, LIMIT) peuvent aussi s'écrire en minuscules.</p>`,
  enigme: `<div class="note">
<p>📝 <b>Le mot de la Kère</b></p>
<p>« Mon complice se cache dans la liste : c'est le seul à avoir plus de 100 ans. Cette nuit, il a volé <b>le cadeau le plus cher d'un enfant sage de sa ville</b>. Bonne chance pour le retrouver, hi hi ! »</p>
</div>
<p>Interroge la table <code>liste</code> pour démasquer le complice, puis trouve le cadeau volé. <b>Quel cadeau a été volé ?</b></p>`,
  widget: W.sql({
    tables: {
      liste: {
        colonnes: ['prenom', 'ville', 'age', 'sage', 'cadeau', 'prix'],
        lignes: [
          ['Zoé', 'Strasbourg', 8, 'oui', 'Télescope', 89],
          ['Hugo', 'Strasbourg', 10, 'non', 'Console de jeu', 299],
          ['Lina', 'Strasbourg', 6, 'oui', 'Poupée', 25],
          ['Inès', 'Lyon', 9, 'oui', 'Vélo', 189],
          ['Adam', 'Lyon', 5, 'oui', 'Toupie', 12],
          ['Louise', 'Lille', 6, 'oui', 'Peluche renne', 22],
          ['Gabin', 'Lille', 11, 'oui', 'Robot à construire', 119],
          ['Noah', 'Strasbourg', 9, 'oui', 'Puzzle', 18],
          ['Rose', 'Lyon', 12, 'non', 'Drone', 149],
          ['Tom', 'Brest', 10, 'oui', 'Maquette de bateau', 49],
          ['Lou', 'Nice', 8, 'oui', 'Rollers', 69],
          ['Jade', 'Strasbourg', 7, 'non', 'Trottinette', 79],
          ['Paul', 'Annecy', 9, 'oui', 'Skis', 159],
          ['Chloé', 'Lille', 9, 'non', 'Patins à glace', 59],
          ['Léo', 'Lyon', 8, 'oui', 'Luge', 45],
          ['Anna', 'Brest', 7, 'non', 'Ciré jaune', 35],
          ['Timéo', 'Nice', 11, 'non', 'Planche de surf', 199],
          ['Malo', 'Strasbourg', 11, 'oui', 'Livre de magie', 15],
          ['Margot', 'Annecy', 12, 'non', 'Snowboard', 249],
          ['Emma', 'Lyon', 7, 'oui', 'Ukulélé', 39],
          ['Yanis', 'Brest', 12, 'oui', 'Appareil photo', 129],
          ['Alice', 'Nice', 5, 'oui', 'Dînette', 34],
          ['Grêlon', 'Strasbourg', 1000, 'non', 'Sac de glaçons', 0],
          ['Nolan', 'Lille', 8, 'oui', 'Jeu de société', 29],
          ['Ethan', 'Annecy', 6, 'oui', 'Bonnet à pompon', 14],
          ['Sacha', 'Lyon', 10, 'non', 'Casque audio', 99],
          ['Léna', 'Brest', 6, 'oui', 'Pull moche', 25],
          ['Raphaël', 'Nice', 10, 'oui', 'Microscope', 79],
          ['Ambre', 'Strasbourg', 5, 'oui', 'Bonhomme de neige en peluche', 30],
          ['Mila', 'Lille', 4, 'oui', 'Xylophone', 19],
          ['Clara', 'Annecy', 8, 'oui', 'Boule à neige', 17],
          ['Arthur', 'Brest', 9, 'non', 'Cerf-volant', 19],
          ['Iris', 'Nice', 7, 'oui', 'Kit de chimie', 44],
          ['Victor', 'Annecy', 10, 'oui', 'Lampe frontale', 28],
        ],
      },
      rennes: {
        colonnes: ['prenom', 'vitesse', 'nez_rouge', 'age'],
        lignes: [
          ['Tornade', 62, 'non', 7], ['Danseur', 55, 'non', 9], ['Furie', 49, 'non', 8], ['Fringant', 58, 'non', 6], ['Comète', 71, 'non', 5],
          ['Cupidon', 52, 'non', 10], ['Tonnerre', 66, 'non', 7], ['Éclair', 69, 'non', 4], ['Rodolphe', 74, 'oui', 6],
        ],
      },
    },
  }),
  reponses: ['b0d60e51e5f662c02c1921910e0c803912582119882126275fc28dd9f87cfdd6', 'f313b0eaff14d474d52b59db00ab11a4efb5c67bc455292dbf02996570333090', '09bf79e131d439e9631761b72626a5844e31d35b6c59a8b81728a247ec30ffac'],
  placeholder: 'Le cadeau volé…',
  indices: [
    "Commence par démasquer le complice : SELECT * FROM liste WHERE age > 100. Note bien sa ville.",
    "Il te faut deux conditions reliées par AND (la ville du complice, et sage = 'oui'), puis ORDER BY prix DESC pour avoir le cadeau le plus cher en premier.",
  ],
  lecon: `<p>Le complice, c'était <b>Grêlon</b>, 1000 ans, de Strasbourg (<code>WHERE age > 100</code>). Puis :</p>
<pre class="code">SELECT prenom, cadeau, prix FROM liste
WHERE ville = 'Strasbourg' AND sage = 'oui'
ORDER BY prix DESC LIMIT 1</pre>
<p>→ le <b>Télescope</b> 🔭 de Zoé (89 €) ! Si tu avais oublié <code>sage = 'oui'</code>, tu serais tombé sur la console de Hugo, qui n'a pas été sage ; et sans la ville, sur le vélo d'Inès, à Lyon.</p>
<p>Une <b>base de données</b> range les informations dans des <b>tables</b>, et le <b>SQL</b> permet de leur poser des questions : filtrer (<code>WHERE</code>), trier (<code>ORDER BY</code>), choisir les colonnes (<code>SELECT</code>)… Il a été inventé dans les années 1970 et il est toujours utilisé partout. Une vraie base peut contenir des <b>milliards</b> de lignes : l'ordinateur répond quand même en une fraction de seconde.</p>
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
    ricane: "J'ai fermé le coffre aux cadeaux avec MON mot de passe. Dix caractères, incassable. Les lutins ont essayé la force brute : ils y sont encore, hi hi.",
    piques: [
      "Raté ! Le coffre ne s'ouvre pas avec des mots au hasard, petit curieux.",
      "Non ! Et arrête de fouiller mon profil, c'est privé. Enfin… public. Mais privé quand même.",
      "Faux ! Tu ne trouveras JAMAIS. Personne ne connaît le nom de mon chouchou. À part mes 312 abonnés.",
    ],
    fuite: "Comment tu as deviné ?! J'efface mon compte Kèrebook et je m'enfuis à l'autre bout de la banquise !",
  },
  histoire: `<p>Dans la Salle des Coffres, la Kère a verrouillé le <b>coffre aux cadeaux</b> avec son propre mot de passe. Les lutins ont lancé leur vieil ordinateur pour essayer toutes les combinaisons… sans succès.</p>
<p>Mais la Kère a un gros défaut : elle raconte <b>toute sa vie</b> sur son réseau social préféré, <b>Kèrebook</b>. Et son profil est public…</p>`,
  cours: `<p>Pour casser un mot de passe, la méthode la plus bête s'appelle la <b>force brute</b> : essayer <b>toutes</b> les combinaisons, une par une. Le nombre de combinaisons, c'est :</p>
<p class="centre"><b>(nombre de caractères possibles)<sup>longueur</sup></b></p>
<p>Exemple : un code à 4 chiffres, c'est 10 × 10 × 10 × 10 = 10 000 combinaisons : un ordinateur les essaie en une fraction de seconde. Mais avec 10 caractères parmi les 26 lettres et les 10 chiffres, il y en a 36<sup>10</sup>, soit plus de <b>3 millions de milliards</b> !</p>
<p>Alors les pirates sont malins : avant la force brute, ils essaient ce que la personne a <b>probablement</b> choisi. Le prénom de ses enfants, le nom de son chat, sa date de naissance… Et ces informations, beaucoup de gens les publient eux-mêmes sur les réseaux sociaux ! C'est l'<b>ingénierie sociale</b> : pirater la personne plutôt que la machine.</p>`,
  enigme: `<p>Ouvre le coffre en retrouvant <b>le mot de passe de la Kère</b>. Mène l'enquête sur son profil Kèrebook : chaque détail compte. (Tu peux aussi lancer l'attaque par force brute des lutins… pour voir.)</p>
<p>🚫 Rien de personnel ici : ce mot de passe-là, tu le devines, tu ne l'inventes pas !</p>`,
  widget: W.kerebook({
    profil: { nom: 'La Kère des Coffres', avatar: '👹', bio: 'Gardienne de coffres · Fan de glaçons · 312 abonnés' },
    longueur: 10, alphabet: 36, vitesse: 1000,
    posts: [
      { date: '1er déc. 2026', texte: "Nouveau mot de passe pour le coffre aux cadeaux 🔐 10 caractères, des lettres et des chiffres. Les lutins peuvent toujours essayer 😎 #incassable", likes: 66,
        commentaires: [{ auteur: 'Kère des Neiges', texte: "Laisse-moi deviner : tu as encore utilisé ton chouchou 😂" }, { auteur: 'La Kère des Coffres', texte: 'Chut !!! 🤫' }] },
      { date: '28 nov. 2026', texte: "Ma petite famille ❤️ Glagla, mon pingouin chouchou, Frimas le phoque, et Grésil le hibou.", image: '🐧 🦭 🦉', likes: 128 },
      { date: '20 nov. 2026', texte: "Grésil a 3 ans aujourd'hui ! 🦉🎉 Il a eu une souris en glace.", likes: 41 },
      { date: '5 oct. 2026', texte: "Les gens qui mettent le nom de leur animal dans leur mot de passe… 🙄 Moi ? Jamais. Enfin… presque jamais. 🤭", likes: 23 },
      { date: '14 juil. 2026', texte: "Frimas fête ses 11 ans 🦭🎂 (il préfère le poisson au gâteau)", likes: 57 },
      { date: '2 fév. 2026', texte: "Astuce de pro : jamais de majuscules dans mes mots de passe, c'est trop fatigant. Et je colle tout, sans espace. 💅", likes: 19 },
      { date: '3 déc. 2025', texte: "Joyeux anniversaire à mon Glagla ! 🎂 6 ans aujourd'hui, déjà… Il grandit trop vite 🥹", image: '🐧🎂', likes: 230 },
      { date: '1er juin 2025', texte: "Glaçons au petit-déj, glaçons au déj, glaçons au dîner. Régime de championne. 🧊", likes: 12 },
    ],
  }),
  reponses: ['21f091dd09c06547386219f81dc81f23922cf1614857460de7027033e75d287f'],
  placeholder: 'Le mot de passe du coffre…',
  indices: [
    "Une publication dit comment le mot de passe est fait (10 caractères, des lettres et des chiffres, en minuscules et collés). Un commentaire dit sur quoi elle l'a construit. Qui est son chouchou ?",
    "Son chouchou, c'est Glagla (6 lettres). Il manque 4 chiffres : son année de naissance. Il a eu 6 ans le 3 décembre 2025…",
  ],
  lecon: `<p>Le mot de passe était <b>glagla2019</b> 🐧 : le nom de son chouchou, plus son année de naissance (6 ans en 2025 → né en 2019). Pile 10 caractères, en minuscules et collés, comme elle s'en vantait !</p>
<p>La force brute des lutins aurait mis plus de <b>100 000 ans</b>. Toi, tu as mis quelques minutes, parce que la Kère a choisi un mot de passe <b>devinable</b> et qu'elle a semé les indices elle-même. Les vrais pirates font exactement pareil : ils fouillent les réseaux sociaux, puis testent les prénoms, les animaux, les dates et les mots de passe les plus courants (<code>123456</code>, <code>azerty</code>…).</p>
<p>La <b>longueur</b> compte bien plus que les symboles compliqués, mais seulement si le mot de passe est <b>imprévisible</b>. Une <b>phrase de passe</b> de plusieurs mots choisis au hasard (« chaussette-volcan-pingouin-trompette ») est à la fois très solide et facile à retenir.</p>
<h4>🌍 Dans la vraie vie : les 4 bons réflexes</h4>
<ul>
<li>Rien de personnel dans un mot de passe : ni prénom, ni animal, ni date de naissance.</li>
<li>Un mot de passe <b>différent pour chaque site</b>, et un <b>gestionnaire de mots de passe</b> pour les retenir à ta place.</li>
<li>La <b>double authentification</b> : un code reçu sur ton téléphone en plus du mot de passe.</li>
<li>Réfléchis à ce que tu publies en public : la date d'anniversaire de ton chien intéresse aussi les pirates.</li>
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
    ricane: "J'ai changé UN mot dans UNE lettre. Un seul ! Bonne chance pour trouver lequel, avec tes petits yeux de lutin.",
    piques: [
      "Faux ! Cet enfant recevra un cadeau dont il ne veut pas. Merci pour ton aide.",
      "Raté. Ma machine ne ment jamais. Toi, par contre…",
      "Encore faux ! Je finis par croire que c'est toi qui as écrit mes fausses lettres.",
    ],
    fuite: "Démasquée par une empreinte ?! Une simple suite de chiffres et de lettres ?! Je souffle… je m'essouffle…",
  },
  histoire: `<p>Dans le Bureau du Père Noël, chaque lettre d'enfant est enregistrée dans un <b>registre</b>, sous la forme d'une <b>empreinte</b> : un code calculé par une machine à partir du texte de la lettre.</p>
<p>Cette nuit, la Kère s'est glissée dans le bureau et a modifié <b>un seul mot</b> dans <b>une seule lettre</b>, pour qu'un enfant reçoive le mauvais cadeau. À l'œil nu, impossible de voir laquelle…</p>`,
  cours: `<p>Une <b>fonction de hachage</b> est une machine qui transforme n'importe quel texte en une <b>empreinte</b> : une suite de chiffres et de lettres, toujours de la même longueur. Elle a trois super-pouvoirs :</p>
<ul>
<li>le <b>même texte</b> donne <b>toujours la même empreinte</b> ;</li>
<li>la <b>moindre modification</b> (une lettre, une virgule, une majuscule) donne une empreinte <b>complètement différente</b> ;</li>
<li>impossible de faire le chemin inverse : l'empreinte ne permet pas de retrouver le texte. Pour savoir quel texte a donné une empreinte, il faut <b>essayer</b> des textes jusqu'à retomber dessus.</li>
</ul>
<p>Exemple avec <b>SHA-256</b>, la plus utilisée au monde : « Noël » donne <code>0b6e6252a4…</code>, et « noël » donne <code>5e75674763…</code>. Une seule lettre a changé, et pourtant les deux empreintes n'ont rien à voir !</p>
<p>C'est parfait pour vérifier qu'un texte n'a pas été modifié : on compare son empreinte à celle qu'on avait notée.</p>`,
  enigme: `<p>1. Trouve la <b>lettre modifiée</b> par la Kère : passe les lettres à la machine et compare avec le registre.</p>
<p>2. Retrouve le cadeau que l'enfant avait <b>vraiment</b> demandé : il fait partie du catalogue de l'atelier. Tu peux modifier le texte dans la machine et essayer autant de fois que tu veux.</p>
<p><b>Quel cadeau l'enfant avait-il vraiment demandé ?</b></p>`,
  widget: W.empreintes((() => {
    const originales = [
      ['Tom', "Cher Père Noël, cette année j'ai été très sage. Je voudrais un robot. Merci ! Tom"],
      ['Léa', "Cher Père Noël, j'ai rangé ma chambre tous les jours. Je voudrais une trottinette. Merci ! Léa"],
      ['Inès', "Cher Père Noël, je voudrais des patins pour glisser avec mes amis. Merci ! Inès"],
      ['Hugo', "Cher Père Noël, je voudrais un puzzle de mille pièces. Merci beaucoup ! Hugo"],
      ['Zoé', "Cher Père Noël, je voudrais un ukulele pour jouer des chansons. Merci ! Zoé"],
      ['Malo', "Cher Père Noël, je voudrais un train électrique, avec des rails. Merci ! Malo"],
    ];
    return {
      // La Kère a remplacé « une trottinette » par « un yoyo » dans la lettre de Léa
      lettres: originales.map(([enfant, texte]) => ({ enfant, texte: enfant === 'Léa' ? texte.replace('une trottinette', 'un yoyo') : texte })),
      registre: originales.map(([enfant, texte]) => ({ enfant, empreinte: empreinteCourte(texte) })).sort((a, b) => a.enfant.localeCompare(b.enfant)),
      catalogue: ['un robot', 'une luge', 'un yoyo', 'des patins', 'un puzzle', 'une toupie', 'une trottinette', 'un ukulele', 'des rollers', 'un train électrique'],
    };
  })()),
  reponses: ['10670e704d25b3dd418be64841d64a4739395e8aa7a31b47b636faa745fb5085', 'ff937daecf99eb551ef11db4c05821e4d806583f67ebea59d726cf20c03fe597'],
  placeholder: 'Le vrai cadeau…',
  indices: [
    "Clique sur « Passer à la machine » sous chaque lettre : la lettre modifiée est la seule dont l'empreinte ne correspond à aucune ligne du registre.",
    "C'est la lettre de Léa. Dans la machine, remplace « un yoyo » par chaque cadeau du catalogue, un par un, sans toucher au reste, jusqu'à ce que l'empreinte corresponde à celle de Léa.",
  ],
  lecon: `<p>C'était la lettre de <b>Léa</b> : la Kère avait remplacé « une trottinette » par « un yoyo ». Avec « une <b>trottinette</b> » 🛴, l'empreinte retombe pile sur celle du registre ✅.</p>
<p>Tu as utilisé une vraie <b>fonction de hachage</b> : <b>SHA-256</b>. Ses empreintes font 256 bits (64 caractères ; le registre n'en montrait que les 10 premiers). Pour la lettre de Léa, tu as dû <b>essayer</b> les cadeaux un par un : on ne peut pas « remonter » une empreinte, seulement tester des textes. Avec 10 cadeaux, c'est rapide. Avec un vrai mot de passe bien choisi, ce serait des milliards d'années.</p>
<p>🤫 <b>Le secret de ce calendrier</b> : les réponses ne sont jamais envoyées à ton navigateur, et le serveur du Pôle Nord ne les garde même pas en clair : seulement leurs <b>empreintes SHA-256</b>. Quand tu proposes une réponse, il calcule son empreinte et la compare. Même quelqu'un qui volerait le serveur ne pourrait pas lire les réponses !</p>
<h4>🌍 Dans la vraie vie</h4>
<ul>
<li>Les sites sérieux ne stockent jamais ton mot de passe : seulement son empreinte (avec un « sel » ajouté pour plus de sécurité).</li>
<li>Quand on télécharge un logiciel, on peut comparer son empreinte avec celle du site officiel pour vérifier qu'un pirate ne l'a pas modifié.</li>
<li><b>Git</b>, l'outil des programmeurs pour garder l'historique de leur code, donne à chaque version (chaque <i>commit</i>) un nom qui est… une empreinte de son contenu !</li>
</ul>`,
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
    ricane: "J'ai remis le cerveau du lutin-robot à zéro. Il ne sait plus rien, il croit que les rennes aiment tout… ou rien. Comme toi, en somme.",
    piques: [
      "Faux ! Les rennes boudent. Ils boudent très fort. Ils mordent, aussi.",
      "Raté. Même un grille-pain apprendrait plus vite que ton robot.",
      "Ton robot a appris par cœur, comme un perroquet. Devant un nouveau jouet, il est perdu !",
    ],
    fuite: "Il apprend… il apprend tout seul ! Même moi, il m'a devinée ! Je file !",
  },
  histoire: `<p>Au Laboratoire, le lutin-robot doit choisir les jouets à offrir aux rennes. Personne ne lui a donné de règle : il doit <b>apprendre à partir d'exemples</b>. Mais la Kère a remis son cerveau à zéro…</p>
<p>Heureusement, son cerveau est tout simple : quelques boutons à régler. À toi de jouer les ingénieurs en intelligence artificielle !</p>`,
  cours: `<p>Une <b>intelligence artificielle</b> n'apprend pas comme on apprend une leçon : on lui montre des <b>exemples</b> (ici, des jouets et ce que les rennes en ont pensé), et elle se règle toute seule jusqu'à ne plus se tromper.</p>
<p>Le cerveau du lutin-robot est un <b>neurone artificiel</b>, la brique de base des IA :</p>
<ul>
<li>chaque <b>critère</b> (le jouet fait du bruit, il brille…) rapporte des <b>points</b> quand il est vrai. Ces points peuvent être <b>négatifs</b> si le critère fait plutôt baisser l'envie ;</li>
<li>le robot additionne les points ; si le total atteint le <b>seuil</b>, il dit « adoré », sinon « bof ».</li>
</ul>
<p>Exemple : bruit = +2, seuil = 2. Une trompette (bruit) a 2 points : adorée. Un ballon (pas de bruit) a 0 point : bof.</p>
<p>Le vrai test d'une IA, c'est quand elle découvre des cas <b>qu'elle n'a jamais vus</b>. Un robot qui a seulement « appris par cœur » ses exemples se trompera devant un nouveau jouet.</p>`,
  enigme: `<p>Règle les points de chaque critère et le seuil pour que le robot devine juste sur <b>tous les exemples</b>. Le tableau se met à jour à chaque réglage.</p>
<p>Puis teste-le sur <b>les nouveaux jouets</b>, qu'il n'a jamais vus : s'il a compris ce que les rennes aiment vraiment (et pas juste appris par cœur), il ne se trompera pas.</p>`,
  widget: W.neurone({
    criteres: [
      { k: 'bruit', emoji: '🔔', nom: 'fait du bruit' },
      { k: 'brille', emoji: '✨', nom: 'brille' },
      { k: 'grand', emoji: '📏', nom: 'est grand' },
      { k: 'rouge', emoji: '🔴', nom: 'est rouge' },
    ],
    exemples: [
      { emoji: '🔔', nom: 'Clochette', v: { bruit: 1, brille: 0, grand: 0, rouge: 1 }, aime: true },
      { emoji: '🛎️', nom: 'Grelot doré', v: { bruit: 1, brille: 1, grand: 0, rouge: 0 }, aime: true },
      { emoji: '🪩', nom: 'Boule à facettes', v: { bruit: 0, brille: 1, grand: 0, rouge: 0 }, aime: true },
      { emoji: '🍭', nom: 'Sucette pailletée', v: { bruit: 0, brille: 1, grand: 0, rouge: 1 }, aime: true },
      { emoji: '📯', nom: 'Sifflet', v: { bruit: 1, brille: 0, grand: 0, rouge: 0 }, aime: true },
      { emoji: '🎺', nom: 'Trompette dorée', v: { bruit: 1, brille: 1, grand: 0, rouge: 0 }, aime: true },
      { emoji: '🥁', nom: 'Tambour géant', v: { bruit: 1, brille: 0, grand: 1, rouge: 1 }, aime: false },
      { emoji: '🎄', nom: 'Grande guirlande lumineuse', v: { bruit: 0, brille: 1, grand: 1, rouge: 0 }, aime: false },
      { emoji: '🎹', nom: 'Piano géant vernis', v: { bruit: 1, brille: 1, grand: 1, rouge: 0 }, aime: false },
      { emoji: '🧱', nom: 'Cube en bois', v: { bruit: 0, brille: 0, grand: 0, rouge: 1 }, aime: false },
      { emoji: '🧸', nom: 'Grosse peluche', v: { bruit: 0, brille: 0, grand: 1, rouge: 0 }, aime: false },
      { emoji: '⚽', nom: 'Ballon', v: { bruit: 0, brille: 0, grand: 0, rouge: 0 }, aime: false },
    ],
    nouveaux: [
      { emoji: '🎻', nom: 'Petit violon', v: { bruit: 1, brille: 0, grand: 0, rouge: 1 } },
      { emoji: '🛋️', nom: 'Gros fauteuil rouge', v: { bruit: 0, brille: 0, grand: 1, rouge: 1 } },
      { emoji: '🔮', nom: 'Boule de cristal', v: { bruit: 0, brille: 1, grand: 0, rouge: 0 } },
      { emoji: '🎠', nom: 'Grand manège rouge, musical et brillant', v: { bruit: 1, brille: 1, grand: 1, rouge: 1 } },
      { emoji: '🪇', nom: 'Maracas', v: { bruit: 1, brille: 0, grand: 0, rouge: 0 } },
      { emoji: '🧦', nom: 'Chaussette rouge', v: { bruit: 0, brille: 0, grand: 0, rouge: 1 } },
      { emoji: '🌟', nom: 'Petite étoile scintillante', v: { bruit: 0, brille: 1, grand: 0, rouge: 1 } },
    ],
  }),
  // Ce que les rennes ont vraiment pensé des nouveaux jouets (ne quitte jamais le serveur)
  verite: [true, false, true, false, true, false, true],
  indices: [
    "Commence par donner des points au bruit et à ce qui brille, puis règle le seuil pour que les jouets silencieux et ternes restent « bof ». Ensuite, regarde ce qui fait rater les jouets GRANDS : il faut que ce critère fasse perdre des points.",
    "Un réglage qui marche : bruit +2, brille +2, grand −3, rouge 0, seuil 2. La couleur ne compte pas du tout pour les rennes !",
  ],
  lecon: `<p>Les rennes adorent les jouets <b>qui font du bruit ou qui brillent</b>… <b>sauf s'ils sont grands</b> (ils ne rentrent pas dans l'écurie !). Et la couleur ne compte pas du tout. Un réglage qui marchait : bruit +2, brille +2, grand −3, rouge 0, seuil 2.</p>
<p>Parmi les nouveaux jouets, le robot a choisi le petit violon 🎻, la boule de cristal 🔮, les maracas 🪇 et la petite étoile 🌟. Il a laissé de côté le fauteuil, la chaussette… et le grand manège, malgré sa musique et ses paillettes : trop grand ! Les rennes sont ravis 🦌</p>
<p>Tu viens de faire ce que font les ingénieurs en <b>intelligence artificielle</b> : régler les « poids » d'un <b>neurone artificiel</b> à partir d'<b>exemples étiquetés</b>, puis vérifier qu'il <b>généralise</b> à des cas jamais vus. Une vraie IA fait la même chose… avec des milliards de neurones, réglés automatiquement par l'ordinateur.</p>
<h4>⚠️ Le danger d'apprendre par cœur</h4>
<p>Si le robot avait donné des points au rouge, il aurait pu réussir tous les exemples… et se tromper sur le grand manège rouge. Une IA n'est jamais meilleure que ses exemples : s'ils sont incomplets ou injustes, elle apprend une règle fausse ou injuste. C'est ce qu'on appelle un <b>biais</b>.</p>
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
    fuite: "“Lumière éternelle”… Rien n'est éternel, mortel. Ni ta lumière, ni ta victoire. Le jour où elle vacillera, le givre reviendra. Et moi avec.",
  },
  histoire: `<p>C'est le grand soir ! Te voici dans le Grand Salon, devant le sapin. Mais quand tu allumes l'écran de NOËL-OS pour rallumer l'étoile, un rire glacé sort des haut-parleurs : <b>Kryos</b> a pris le contrôle de l'ordinateur du Pôle Nord.</p>
<p>Il y a mille ans, une <b>formule secrète</b> l'a enfermé dans son glacier. Il l'a découpée en <b>23 fragments</b>… que ses Kères t'ont laissés en s'enfuyant. Kryos les a rangés dans un dossier, et il l'a scellé. C'est le duel final : <b>toi contre lui, dans le terminal</b>.</p>`,
  cours: `<p>Tu te souviens du terminal de l'Elfe Hacker (jour 22) ? <code>ls</code>, <code>ls -a</code> pour les éléments cachés, <code>cd</code> pour entrer dans un dossier, <code>cat</code> pour lire un fichier. Ce soir, tu auras besoin de trois armes de plus :</p>
<ul>
<li><code>rev</code> écrit un texte <b>à l'envers</b> : <code>echo sapin | rev</code> affiche <code>nipas</code> ;</li>
<li><code>sort</code> <b>trie</b> des lignes ; avec <code>sort -n</code>, il les trie comme des <b>nombres</b> (sinon « 10 » passe avant « 2 », comme dans un dictionnaire) ;</li>
<li>le <b>tube</b> <code>|</code> envoie le résultat d'une commande à la suivante, comme un tuyau : <code>cat liste.txt | sort</code> lit la liste, puis la trie.</li>
</ul>
<p>Et le joker <code>*</code> veut dire « tous les fichiers » : <code>cat *.txt</code> affiche tous les fichiers qui finissent par <code>.txt</code>.</p>
<p>Kryos ne se laissera pas faire. Garde ton sang-froid… même s'il gèle ton écran.</p>`,
  enigme: `<p>Kryos a pris le contrôle de NOËL-OS. Retrouve tes fragments, remets-les dans l'ordre et <b>prononce la formule</b> pour rallumer l'étoile.</p>
<p>Clique dans le terminal et commence par lire le message que les lutins t'ont laissé : <code>cat lisez-moi.txt</code></p>`,
  widget: W.duelFinal({
    utilisateurParDefaut: 'sauveur', maisonJoueur: 'sauveur', motDePasse: 'miehlfin',
    racine: {
      home: {
        sauveur: {
          'lisez-moi.txt': "Psst, c'est nous, les lutins ! On a réussi à te connecter à NOËL-OS… mais Kryos est partout.\n\nTes 23 fragments sont dans le dossier /glacier, et Kryos l'a scellé avec SON mot de passe.\n\nTa mission :\n  1. Trouve le mot de passe de Kryos. Il habite dans /home/kryos.\n     Fouille TOUT, même ce qui est caché (ls -a).\n  2. Ouvre le glacier :            deverrouiller <mot de passe>\n  3. Remets les fragments dans l'ordre.\n  4. Prononce la formule :         allumer-etoile <la formule>\n\nTape help pour voir toutes les commandes. On croit en toi ! 🧝",
        },
        kryos: {
          'trophees.txt': "🏆 SALLE DES TROPHÉES DE KRYOS 🏆\n\n- Coupe de l'Hiver Éternel ............. an 1024\n- Médaille du Blizzard le plus long .... an 1025\n- Plaque gravée : « Ici fut enfermé Kryos, dans le glacier de NIFLHEIM, an 1026 »\n      (j'ai gardé la plaque. Souvenir.)",
          'plan-machiavelique.txt': "PLAN MACHIAVÉLIQUE (version 47)\n\n1. Geler Noël ............................ ✅\n2. Capturer les lutins ..................... ✅\n3. Éteindre l'étoile ....................... ✅\n4. Empêcher le Sauveur de Noël de prononcer\n   la formule ............................. ⏳\n5. Hiver éternel. Chocolat chaud INTERDIT.",
          '.journal': "JOURNAL SECRET DE KRYOS — NE PAS LIRE (oui, c'est à TOI que je parle)\n\nJour 1. Le glacier s'est fendu. Mille ans d'ennui, enfin terminés.\nJour 2. J'ai gelé NOËL-OS. Les lutins pleurent. Délicieux.\nJour 3. Il me faut un mot de passe pour sceller /glacier.\n        Je prends le nom du glacier où ces maudits lutins m'ont enfermé…\n        mais écrit À L'ENVERS, tout en minuscules. Génie absolu.\n        (Le nom est gravé sur un de mes trophées. Personne ne lit les trophées.)\nJour 4. Note pour plus tard : apprendre à faire des sorbets.",
        },
      },
      etc: {
        'noel-os.conf': "# Configuration de NOËL-OS\nsysteme        = NOËL-OS v24.12\nstatut         = GELÉ ❄️\nadministrateur = kryos (usurpé !)\nsauvegardes    = activées (les lutins y tiennent beaucoup)",
      },
    },
    sauvegarde: {
      'lisez-moi.txt': "Bravo, tu as trouvé notre sauvegarde secrète ! 😄\nKryos a effacé les fragments… mais nous, on garde une copie de TOUT.\n\nChaque fichier .frag contient une ligne :  « position lettre ».\n  - cat *.frag      affiche tous les fragments d'un coup ;\n  - sort            trie des lignes (ajoute -n pour trier des nombres) ;\n  - le tube |       envoie le résultat d'une commande à la suivante.\n\nÀ toi d'assembler tout ça ! Lis ensuite les lettres de haut en bas :\nc'est la formule. Elle est en latin et fait 4 mots.",
    },
    fragmentGele: "(fragment gelé : le jour {n} n'est pas résolu)",
    aide: "Commandes disponibles :\n  help                       affiche cette aide\n  ls   /   ls -a             liste le dossier (-a : avec les éléments cachés)\n  cd <dossier>               entre dans un dossier (cd .. pour remonter)\n  pwd                        affiche le dossier où tu es\n  cat <fichier>              affiche un fichier (cat *.frag : tous les .frag)\n  echo <texte>               écrit un texte\n  rev                        écrit chaque ligne à l'envers\n  sort                       trie les lignes (sort -n : comme des nombres)\n  grep <mot>                 garde les lignes qui contiennent un mot\n  deverrouiller <mot>        ouvre un dossier scellé\n  allumer-etoile <formule>   prononce la formule finale\n  clear                      efface l'écran\nLe tube | envoie le résultat d'une commande à la suivante. Exemple :  echo bonjour | rev\nAstuces : Tab complète les noms, ↑ et ↓ rappellent les commandes précédentes.",
    systeme: ['NOËL-OS v24.12 — connexion de « {u} »…', "⚠ ALERTE : l'utilisateur « kryos » a pris le contrôle du système."],
    kryosIntro: ['Tiens, tiens… {u}, le fameux Sauveur de Noël. Bienvenue dans MON système.', 'Tes petits fragments ? Sous clé, dans /glacier. Et la clé, tu ne la trouveras JAMAIS.'],
    invitation: "Les lutins t'ont laissé un message. Tape :  cat lisez-moi.txt",
    verrouille: '🔒 Accès refusé : /glacier est scellé par kryos. Utilise :  deverrouiller <mot de passe>',
    usageDeverrouiller: 'Utilisation :  deverrouiller <mot de passe>',
    dejaOuvert: 'Le glacier est déjà ouvert.',
    mauvaisMdp: '❌ Mot de passe incorrect.',
    kryosMauvaisMdp: ["Raté ! Tu crois vraiment que j'utiliserais un mot de passe aussi bête ?", "Hahaha ! Encore ! Encore ! J'adore te regarder échouer.", 'Non. Et tu ne trouveras pas en tapant au hasard, petit lutin.'],
    ouvert: '🔓 /glacier déverrouillé !',
    kryosRiposte: ['QUOI ?! Tu as lu mon journal ?! PERSONNE ne lit mon journal !', 'Très bien. Si je ne peux pas garder les fragments… PERSONNE ne les aura.  rm /glacier/*'],
    suppression: 'rm : suppression de « {f} »',
    kryosRire: 'Plus de fragments, plus de formule, plus de Noël ! MOUAHAHAHA !',
    lutinsSecours: ['Psst… pas de panique ! Nous, les lutins, on fait des SAUVEGARDES de tout.', 'Elle est cachée dans /glacier. Tu sais comment voir ce qui est caché… 😉'],
    kryosFouille: "Hé ! Qui t'a permis de fouiller chez moi ? Sors de là !",
    kryosJournal: 'MON JOURNAL ! Ferme ça tout de suite ! Je gèle ton écran !',
    gel: '❄ Terminal gelé par kryos ❄',
    kryosApresGel: "… Bon. Tu n'as rien vu. Et de toute façon, tu ne comprendras rien.",
    kryosOrdre: 'Non… non non non… Ne fais pas ça. Ne prononce pas cette formule !',
    lutinsTriNombres: 'Presque ! Sans -n, sort range « 10 » avant « 2 », comme dans un dictionnaire. Essaie sort -n.',
    usageEtoile: 'Utilisation :  allumer-etoile <la formule>',
    prononce: '✨ Tu prononces la formule : « {f} »…',
    kryosMauvaiseFormule: ['Hahaha ! Rien ne se passe. Ton latin est aussi gelé que mon cœur.', "Raté ! L'étoile reste éteinte. Elle est à MOI.", 'Même pas un petit scintillement. Pathétique.'],
    kryosFin: ['NOOOOON ! Cette lumière… elle… elle brûle !', 'Savoure ta victoire, mortel. Chaque hiver, quand le givre mordra tes fenêtres… souviens-toi de moi. JE REVIENDRAI.'],
    victoire: ['☀ La formule résonne dans tout le chalet.', '☀ NOËL-OS dégèle : système restauré, utilisateur kryos supprimé.', "⭐ L'étoile du sapin se rallume !"],
    kryosSudo: "sudo ? Ici, le seul administrateur, c'est MOI.",
    kryosRm: "rm ? C'est MA commande préférée. Pas touche.",
    kryosKill: 'Me supprimer ? Avec une commande ? Je suis immortel, petit lutin.',
    kryosExit: "Partir ? Mais on s'amuse tellement, tous les deux…",
    kryosAttente: ["Alors ? Tu dors ? Le chocolat chaud refroidit… ah non, je l'ai gelé.", 'Tic-tac… Noël approche… et toi, tu restes planté là.', "Tu veux un indice ? Abandonne. C'est mon seul conseil.", "Je commence à m'ennuyer. Mille ans dans un glacier, c'était plus palpitant."],
  }),
  reponses: ['22cbd35071bff0460b8fdd2c952cf7f9d3e2d7ca2fbc10d1dde07b318b647124'],
  sansChamp: true,
  indices: [
    "Le mot de passe est dans le journal SECRET de Kryos : cd /home/kryos puis ls -a pour le voir. Le nom du glacier est gravé sur un de ses trophées ; écris-le à l'envers (par exemple : echo niflheim | rev).",
    "Après le rm de Kryos : cd /glacier puis ls -a pour trouver la sauvegarde des lutins. Dedans : cat *.frag | sort -n, puis lis les lettres de haut en bas. 4 mots latins, et le premier veut dire « lumière ».",
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
<p>Pour ce duel final, tu as fouillé des fichiers cachés (jour 22), lu à l'envers avec <code>rev</code>, retrouvé une <b>sauvegarde</b> (la meilleure arme contre un pirate qui efface tout !) et trié des données avec <code>sort</code>, en les faisant passer dans un tube. En 24 jours, voici tout ce que tu as découvert :</p>
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
