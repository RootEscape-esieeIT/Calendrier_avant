/* =========================================================
   NOËL-OS — La visite du chalet, de l'intérieur
   Après la téléportation, on est DANS le chalet : un couloir par étage (Grenier, Étage,
   Rez-de-chaussée, Sous-sol), six portes numérotées par couloir, comme les cases d'un
   calendrier de l'Avent. On se promène d'un étage à l'autre par l'escalier, on choisit
   une porte… et elle s'ouvre sur sa pièce.
   VISITE.construire(racine, options) · VISITE.maj(etat) · VISITE.aller(etage)
   VISITE.entrer(n) → Promise · VISITE.secouer(n) · VISITE.etageDe(n)
   Seuls transform et opacity sont animés.
   ========================================================= */
(function (global) {
  'use strict';

  const h = (...a) => global.h(...a);
  const t = (...a) => global.t(...a);
  const mouvementReduit = () => global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Chaque étage a son décor : la classe du couloir, et les objets accrochés entre les portes.
  const THEMES = ['grenier', 'etage', 'rdc', 'soussol'];
  const COULEURS_PORTES = ['#9b1b30', '#1f6a3d', '#1d4f86', '#8a5a1e', '#6a2c7a', '#a0522d'];

  /* ---------- Les décors entre les portes (petits dessins) ---------- */
  const DECO = {
    lucarne: () => `<svg viewBox="0 0 100 100" class="deco-svg"><path d="M10 92 V40 Q50 4 90 40 V92Z" fill="#2a170b"/><path d="M18 88 V43 Q50 14 82 43 V88Z" fill="#081a33"/><circle cx="62" cy="40" r="9" fill="#fff6c8"/><circle cx="34" cy="34" r="1.6" fill="#fff"/><circle cx="44" cy="60" r="1.2" fill="#fff"/><circle cx="70" cy="66" r="1.4" fill="#fff"/><path d="M50 14 V88 M18 58 H82" stroke="#2a170b" stroke-width="5"/><path d="M18 88 Q40 70 82 80 V88Z" fill="#dfeaf7"/></svg>`,
    malle: () => `<svg viewBox="0 0 100 60" class="deco-svg sol"><rect x="8" y="16" width="84" height="42" rx="6" fill="#6b3f1f"/><path d="M8 26 Q50 2 92 26" fill="#7a4a25"/><rect x="8" y="24" width="84" height="6" fill="#3a2010"/><rect x="44" y="26" width="12" height="14" rx="2" fill="#f5c542"/><rect x="20" y="16" width="6" height="42" fill="#3a2010"/><rect x="74" y="16" width="6" height="42" fill="#3a2010"/></svg>`,
    lanterne: () => `<svg viewBox="0 0 60 120" class="deco-svg plafond"><line x1="30" y1="0" x2="30" y2="40" stroke="#222" stroke-width="2"/><path d="M18 42 H42 L46 50 H14Z" fill="#2c3e50"/><rect x="18" y="50" width="24" height="34" rx="3" fill="#ffd27a" class="deco-flamme"/><path d="M18 50 H42 M30 50 V84 M18 84 H42" stroke="#2c3e50" stroke-width="3"/><path d="M14 84 H46 L42 92 H18Z" fill="#2c3e50"/></svg>`,
    portrait: (k) => {
      const sujets = [
        '<circle cx="50" cy="52" r="16" fill="#f1c39c"/><path d="M34 54 Q50 92 66 54 Q58 64 50 64 Q42 64 34 54Z" fill="#fff"/><path d="M33 46 Q50 18 70 40 L66 46Z" fill="#c8202f"/><circle cx="72" cy="40" r="5" fill="#fff"/>',
        '<circle cx="50" cy="50" r="15" fill="#f1c39c"/><path d="M33 46 Q50 22 67 46 Q66 34 50 30 Q34 34 33 46Z" fill="#e8e8e8"/><circle cx="44" cy="52" r="4" fill="none" stroke="#555" stroke-width="1.5"/><circle cx="56" cy="52" r="4" fill="none" stroke="#555" stroke-width="1.5"/><path d="M30 92 Q50 64 70 92Z" fill="#b3202f"/>',
        '<ellipse cx="50" cy="58" rx="16" ry="20" fill="#8a5a30"/><path d="M36 42 L28 22 M34 32 L24 30 M64 42 L72 22 M66 32 L76 30" stroke="#5a3418" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="72" r="6" fill="#d62839"/><circle cx="44" cy="54" r="2.5" fill="#222"/><circle cx="56" cy="54" r="2.5" fill="#222"/>',
      ];
      return `<svg viewBox="0 0 100 110" class="deco-svg"><rect x="10" y="6" width="80" height="98" rx="6" fill="#c9a35a"/><rect x="18" y="14" width="64" height="82" rx="3" fill="#24384f"/>${sujets[k % 3]}</svg>`;
    },
    applique: () => `<svg viewBox="0 0 60 90" class="deco-svg"><rect x="24" y="40" width="12" height="30" rx="3" fill="#c9a35a"/><path d="M14 70 H46 L40 78 H20Z" fill="#c9a35a"/><rect x="26" y="24" width="8" height="18" rx="2" fill="#f4ecd8"/><path class="deco-flamme" d="M30 8 C36 16 35 22 30 24 C25 22 24 16 30 8Z" fill="#ffd36b"/><circle class="deco-halo" cx="30" cy="20" r="26" fill="#ffd27a" opacity=".25"/></svg>`,
    fenetre: () => `<svg viewBox="0 0 100 120" class="deco-svg"><rect x="8" y="6" width="84" height="100" rx="5" fill="#3a2010"/><rect x="16" y="14" width="68" height="84" fill="#0b2547"/><circle cx="62" cy="34" r="8" fill="#fff6c8"/><path d="M16 80 Q40 64 84 74 V98 H16Z" fill="#e8f1fa"/><path d="M50 14 V98 M16 56 H84" stroke="#3a2010" stroke-width="5"/><path d="M8 6 Q30 40 14 106 H8Z M92 6 Q70 40 86 106 H92Z" fill="#9b1b30"/><rect x="4" y="104" width="92" height="8" rx="3" fill="#5a3418"/></svg>`,
    cheminee: () => `<svg viewBox="0 0 140 120" class="deco-svg sol"><rect x="10" y="20" width="120" height="100" fill="#7a6a5e"/><rect x="2" y="10" width="136" height="16" rx="3" fill="#5a3418"/><path d="M36 120 V74 A34 34 0 0 1 104 74 V120Z" fill="#0b0f18"/><path class="deco-feu" d="M52 120 C48 100 62 98 60 84 C72 96 70 104 76 96 C82 108 92 106 88 120Z" fill="#7fd0ff" opacity=".85"/><path d="M48 120 h44" stroke="#3a2a20" stroke-width="6"/><path d="M40 26 v14 M60 26 v18 M80 26 v12 M100 26 v16" stroke="#dff4ff" stroke-width="3" stroke-linecap="round"/><g fill="#9b1b30"><path d="M30 26 h12 v20 l-6 6 h-8 v-6 h4z"/><path d="M98 26 h12 v20 l-6 6 h-8 v-6 h4z"/></g></svg>`,
    horloge: () => `<svg viewBox="0 0 50 140" class="deco-svg sol"><rect x="8" y="10" width="34" height="128" rx="6" fill="#5a3418"/><circle cx="25" cy="36" r="13" fill="#f4ecd8" stroke="#c9a35a" stroke-width="3"/><path d="M25 36 V27 M25 36 L31 40" stroke="#222" stroke-width="2"/><rect x="16" y="58" width="18" height="60" rx="3" fill="#3a2010"/><g class="deco-balancier"><line x1="25" y1="60" x2="25" y2="100" stroke="#c9a35a" stroke-width="2"/><circle cx="25" cy="104" r="6" fill="#f5c542"/></g></svg>`,
    portemanteau: () => `<svg viewBox="0 0 70 150" class="deco-svg sol"><rect x="32" y="20" width="6" height="126" fill="#3a2010"/><path d="M14 146 H56" stroke="#3a2010" stroke-width="6" stroke-linecap="round"/><path d="M35 26 L16 18 M35 26 L54 18" stroke="#3a2010" stroke-width="4" stroke-linecap="round"/><path d="M14 22 C4 40 8 80 12 96 H40 C42 80 40 40 30 24Z" fill="#c8202f"/><rect x="12" y="90" width="28" height="7" fill="#f4f1ea"/><path d="M44 18 C40 30 44 40 52 44 C60 40 64 30 58 18Z" fill="#c8202f"/><circle cx="62" cy="40" r="5" fill="#fff"/></svg>`,
    serveur: () => `<svg viewBox="0 0 80 150" class="deco-svg sol"><rect x="6" y="6" width="68" height="142" rx="5" fill="#1d2735" stroke="#56657a" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map(k => `<rect x="14" y="${16 + k * 21}" width="52" height="15" rx="2" fill="#2a3648"/><circle class="deco-led" cx="22" cy="${23.5 + k * 21}" r="2.6" fill="${k % 3 ? '#4aa3ff' : '#3ddc84'}" style="animation-delay:${(k * 0.37).toFixed(2)}s"/><rect x="30" y="${21 + k * 21}" width="30" height="4" rx="2" fill="#3d4a5c"/>`).join('')}<text x="40" y="144" text-anchor="middle" font-family="Consolas, monospace" font-size="9" fill="#7fd0ff">NOËL-OS</text><path d="M6 6 h68 v24 q-34 10 -68 0z" fill="#bfe6ff" opacity=".55"/></svg>`,
    tonneau: () => `<svg viewBox="0 0 70 80" class="deco-svg sol"><path d="M12 6 Q4 40 12 76 H58 Q66 40 58 6Z" fill="#7a4a25"/><path d="M8 22 H62 M6 58 H64" stroke="#3a3a3a" stroke-width="5"/><path d="M24 6 Q20 40 24 76 M46 6 Q50 40 46 76" stroke="#5a3418" stroke-width="2" fill="none"/></svg>`,
    tuyaux: () => `<svg viewBox="0 0 100 120" class="deco-svg plafond"><path d="M0 18 H70 Q86 18 86 34 V120" fill="none" stroke="#56657a" stroke-width="10"/><path d="M0 36 H40 Q52 36 52 48 V120" fill="none" stroke="#7d8794" stroke-width="7"/><rect x="80" y="54" width="12" height="8" fill="#3d4a5c"/><path d="M60 10 l4 10 l4 -10 M30 28 l3 8 l3 -8" fill="#dff4ff"/></svg>`,
  };
  const DECOS_ETAGE = [
    ['lucarne', 'malle', 'lanterne', 'lucarne', 'malle', 'lanterne'],
    ['portrait', 'applique', 'fenetre', 'portrait', 'applique', 'fenetre'],
    ['cheminee', 'horloge', 'fenetre', 'portemanteau', 'applique', 'cheminee'],
    ['serveur', 'tonneau', 'tuyaux', 'serveur', 'tonneau', 'tuyaux'],
  ];

  /* Les objets à découvrir en se promenant : trois par étage. Un petit scintillement les signale ;
     un clic révèle un secret du chalet (souvenirs des lutins, traces de Kryos, un brin d'informatique).
     [étage, numéro de la baie] → texte en français et en anglais. */
  const DECOUVERTES = [
    { id: 'lucarne', etage: 0, baie: 0, emoji: '🔭', fr: ['L\'étoile polaire', 'Par la lucarne, on voit l\'étoile polaire. Les lutins s\'en servaient pour régler l\'horloge de NOËL-OS. Un ordinateur, lui, compte le temps en secondes… depuis le 1er janvier 1970 à minuit !'], en: ['The North Star', 'Through the skylight you can see the North Star. The elves used it to set NOËL-OS\'s clock. A computer counts time in seconds… since midnight on January 1, 1970!'] },
    { id: 'malle', etage: 0, baie: 1, emoji: '📔', fr: ['Le journal d\'un lutin', '« 3e jour de l\'hiver : le Père Noël a encore oublié son mot de passe. C\'était motdepasse. On lui a expliqué que c\'est le premier que les pirates essaient. »'], en: ['An elf\'s diary', '“Day 3 of winter: Santa forgot his password again. It was password. We told him it\'s the very first one hackers try.”'] },
    { id: 'lanterne', etage: 0, baie: 2, emoji: '🏮', fr: ['La lanterne qui clignote', 'Court, court, court… long, long, long… court, court, court. Un lutin prisonnier envoie un message en morse : S.O.S. ! Chaque lettre devient une suite de signaux, comme les 0 et les 1 d\'un ordinateur.'], en: ['The blinking lantern', 'Short, short, short… long, long, long… short, short, short. A captive elf is sending a Morse code message: S.O.S.! Each letter becomes a series of signals, like a computer\'s 0s and 1s.'] },
    { id: 'portrait', etage: 1, baie: 0, emoji: '🖼️', fr: ['Le portrait du Père Noël', 'Sous le cadre, une étiquette : « Premier ordinateur du Pôle Nord, 1946. Il pesait 30 tonnes et remplissait tout le grenier. » Aujourd\'hui, un téléphone est des millions de fois plus puissant.'], en: ['Santa\'s portrait', 'A label under the frame: “The North Pole\'s first computer, 1946. It weighed 30 tons and filled the whole attic.” Today, a phone is millions of times more powerful.'] },
    { id: 'fenetre', etage: 1, baie: 2, emoji: '❄️', fr: ['Un mot dans le givre', 'Quelqu\'un a écrit du bout d\'une griffe dans le givre de la vitre : « K. était là. » Les Kères laissent toujours une trace… comme un pirate qui oublie d\'effacer son passage.'], en: ['A message in the frost', 'Someone wrote on the frosted glass with the tip of a claw: “K. was here.” The Keres always leave a trace… like a hacker who forgets to cover their tracks.'] },
    { id: 'applique', etage: 1, baie: 4, emoji: '🕯️', fr: ['La bougie qui ne fond jamais', 'Une bougie magique des lutins : elle brûle depuis cent ans sans fondre. Les lutins disent qu\'elle s\'éteindra le jour où plus personne ne croira en Noël. Elle brille encore.'], en: ['The candle that never melts', 'A magic elf candle: it has been burning for a hundred years without melting. The elves say it will go out the day nobody believes in Christmas anymore. It\'s still shining.'] },
    { id: 'cheminee', etage: 2, baie: 0, emoji: '🔥', fr: ['Le feu bleu', 'Le feu de la cheminée est bleu et glacé : c\'est le feu de Kryos. Tant que l\'étoile reste éteinte, il ne réchauffera personne.'], en: ['The blue fire', 'The fire in the hearth is blue and icy cold: it\'s Kryos\'s fire. As long as the star stays dark, it won\'t warm anyone.'] },
    { id: 'horloge', etage: 2, baie: 1, emoji: '🕰️', fr: ['L\'horloge arrêtée', 'Elle s\'est arrêtée à minuit pile, le 1er décembre : l\'instant exact où Kryos s\'est échappé de son glacier. Les lutins disent qu\'elle repartira quand l\'étoile se rallumera.'], en: ['The stopped clock', 'It stopped at midnight sharp on December 1: the exact moment Kryos escaped from his glacier. The elves say it will start again when the star lights up.'] },
    { id: 'portemanteau', etage: 2, baie: 3, emoji: '🧥', fr: ['Le manteau du Père Noël', 'Dans la poche, une liste de cadeaux de deux kilomètres… rangée par ordre alphabétique. Pour retrouver un prénom, le Père Noël ouvre la liste au milieu, puis au milieu de la bonne moitié : en 21 coups, il trouve n\'importe qui parmi deux millions d\'enfants !'], en: ['Santa\'s coat', 'In the pocket, a gift list two kilometers long… in alphabetical order. To find a name, Santa opens it in the middle, then in the middle of the right half: in 21 steps, he can find anyone among two million children!'] },
    { id: 'serveur', etage: 3, baie: 0, emoji: '🖥️', fr: ['Le cœur de NOËL-OS', 'Une petite diode verte clignote encore sous la glace : NOËL-OS n\'est pas mort, il dort. Chaque énigme résolue relance un de ses programmes.'], en: ['The heart of NOËL-OS', 'A tiny green light is still blinking under the ice: NOËL-OS isn\'t dead, it\'s asleep. Every puzzle you solve restarts one of its programs.'] },
    { id: 'tonneau', etage: 3, baie: 1, emoji: '🍫', fr: ['Le tonneau de chocolat chaud', 'Réserve secrète des lutins : 10 000 litres. Sur l\'étiquette, quelqu\'un a noté le mot de passe du cadenas… en clair. Mauvaise idée : un mot de passe ne s\'écrit jamais à côté de ce qu\'il protège !'], en: ['The hot chocolate barrel', 'The elves\' secret stash: 10,000 liters. On the label, someone wrote the padlock\'s password… in plain sight. Bad idea: never write a password next to what it protects!'] },
    { id: 'tuyaux', etage: 3, baie: 2, emoji: '🔊', fr: ['Les tuyaux qui chuchotent', 'Colle ton oreille contre les tuyaux : on entend des 0 et des 1 qui filent. C\'est le réseau du chalet ! Chaque message y voyage découpé en petits paquets, puis il est remis dans l\'ordre à l\'arrivée.'], en: ['The whispering pipes', 'Put your ear against the pipes: you can hear 0s and 1s rushing by. It\'s the chalet\'s network! Every message travels in small packets, then gets put back in order when it arrives.'] },
  ];
  const decouverteDe = (i, k) => DECOUVERTES.find(d => d.etage === i && d.baie === k);
  const texteDecouverte = (d) => (global.I18N && I18N.langue === 'en' ? d.en : d.fr);

  // L'escalier au bout du couloir : il monte (à droite) ou descend (à gauche).
  const ESCALIER = (monte) => `<svg viewBox="0 0 120 200" class="escalier-svg" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    ${Array.from({ length: 7 }, (_, k) => { const y = monte ? 190 - k * 26 : 30 + k * 24; const x = monte ? 6 + k * 15 : 6 + k * 15; return `<rect x="${x}" y="${y}" width="${120 - x}" height="${monte ? 26 : 24}" fill="${k % 2 ? '#5a3418' : '#6b3f1f'}"/><rect x="${x}" y="${y}" width="${120 - x}" height="4" fill="#8a5a30"/>`; }).join('')}
    <path d="${monte ? 'M10 150 L110 0' : 'M10 40 L110 200'}" stroke="#3a2010" stroke-width="7" stroke-linecap="round"/>
    ${Array.from({ length: 6 }, (_, k) => { const x = 18 + k * 17; const y = monte ? 150 - (x - 10) * 1.5 : 40 + (x - 10) * 1.6; return `<line x1="${x}" y1="${y.toFixed(0)}" x2="${x}" y2="${(y + 34).toFixed(0)}" stroke="#3a2010" stroke-width="3"/>`; }).join('')}
  </svg>`;

  let racine = null, tour = null, couloirs = [], options = {};
  let etageCourant = -1;
  const portes = new Map(); // jour → { el, etage }

  function construire(r, opts) {
    racine = r;
    options = opts;
    racine.innerHTML = '';
    const niveaux = opts.niveaux;

    // La barre de l'escalier : descendre, les quatre étages (avec leur avancement), monter
    const plan = h('div', { class: 'plan-etages', role: 'group', 'aria-label': t("Les étages du chalet") },
      niveaux.map((nv, i) => h('button', { type: 'button', class: 'pastille-etage', 'data-etage': i, onclick: () => aller(i) },
        h('span', { class: 'pastille-nom' }, t(nv.titre)), h('span', { class: 'pastille-court', 'aria-hidden': 'true' }, t(nv.court || nv.titre)), h('span', { class: 'pastille-compte' }))));
    const monter = h('button', { type: 'button', class: 'btn-escalier monter', onclick: () => aller(etageCourant - 1) });
    const descendre = h('button', { type: 'button', class: 'btn-escalier descendre', onclick: () => aller(etageCourant + 1) });
    const barre = h('div', { class: 'visite-barre' }, monter, plan, descendre);
    const guide = h('button', { type: 'button', class: 'btn-guide', title: t('Me guider jusqu\'à ma prochaine porte'), onclick: () => guider() }, t('🧭 Me guider'));
    const compteur = h('span', { class: 'compteur-decouvertes', title: t('Objets découverts dans le chalet') });
    const basVisite = h('div', { class: 'visite-bas' }, guide, compteur, opts.boutonDehors || null);

    tour = h('div', { class: 'visite-tour' });
    couloirs = niveaux.map((nv, i) => {
      const piste = h('div', { class: 'couloir-piste' });
      // Au bout à gauche : l'escalier qui descend (sauf au sous-sol)
      piste.append(i < niveaux.length - 1
        ? h('button', { type: 'button', class: 'couloir-bout escalier descend', onclick: () => aller(i + 1), 'aria-label': t("Descendre : {etage}", { etage: t(niveaux[i + 1].titre) }) },
          h('span', { class: 'escalier-dessin', html: ESCALIER(false) }), h('span', { class: 'panneau-escalier' }, '⬇ ' + t(niveaux[i + 1].titre)))
        : h('div', { class: 'couloir-bout mur' }));
      nv.jours.forEach((n, k) => {
        const porte = h('button', { type: 'button', class: 'porte', 'data-jour': n, style: '--couleur:' + COULEURS_PORTES[(n + k) % COULEURS_PORTES.length], onclick: () => options.surPorte(n, porte) },
          h('span', { class: 'porte-aura', 'aria-hidden': 'true' }),
          h('span', { class: 'porte-lumiere', 'aria-hidden': 'true' }),
          h('span', { class: 'porte-cadre', 'aria-hidden': 'true' },
            h('span', { class: 'porte-interieur' }),
            h('span', { class: 'porte-battant' },
              h('span', { class: 'porte-numero' }, n),
              h('span', { class: 'porte-poignee' }),
              h('span', { class: 'porte-chaines', html: '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M6 18 L94 82 M94 18 L6 82" stroke="#9aa8b8" stroke-width="5" stroke-dasharray="7 4"/></svg>' }),
              h('span', { class: 'porte-cadenas' }, '🔒')),
            h('span', { class: 'porte-givre' })),
          h('span', { class: 'porte-kere', 'aria-hidden': 'true', html: options.kereHTML(n === 24) }),
          h('span', { class: 'porte-panneau' }),
          h('span', { class: 'porte-prochaine', 'aria-hidden': 'true' }, t('✨ Ta prochaine porte')));
        portes.set(n, { el: porte, etage: i });
        const deco = DECOS_ETAGE[i][k];
        const secret = decouverteDe(i, k);
        const objet = secret
          ? h('button', { type: 'button', class: 'deco decouverte deco-' + deco, 'data-decouverte': secret.id, 'aria-label': t('Examiner : {objet}', { objet: texteDecouverte(secret)[0] }), onclick: () => options.surDecouverte(secret, texteDecouverte(secret)) },
            h('span', { class: 'deco-dessin', html: DECO[deco](k) }), h('span', { class: 'scintillement', 'aria-hidden': 'true' }, '✦'))
          : h('span', { class: 'deco deco-' + deco, 'aria-hidden': 'true', html: DECO[deco](k) });
        piste.append(h('div', { class: 'baie' + (n === 24 ? ' baie-24' : '') }, porte, objet));
      });
      // Au bout à droite : l'escalier qui monte (sauf au grenier)
      piste.append(i > 0
        ? h('button', { type: 'button', class: 'couloir-bout escalier monte', onclick: () => aller(i - 1), 'aria-label': t("Monter : {etage}", { etage: t(niveaux[i - 1].titre) }) },
          h('span', { class: 'escalier-dessin', html: ESCALIER(true) }), h('span', { class: 'panneau-escalier' }, '⬆ ' + t(niveaux[i - 1].titre)))
        : h('div', { class: 'couloir-bout mur' }));
      const defil = h('div', { class: 'couloir-defil' }, piste);
      const pasG = h('button', { type: 'button', class: 'pas-couloir gauche', 'aria-label': t('Avancer vers la gauche'), onclick: () => marcher(i, -1) }, '‹');
      const pasD = h('button', { type: 'button', class: 'pas-couloir droite', 'aria-label': t('Avancer vers la droite'), onclick: () => marcher(i, 1) }, '›');
      defil.addEventListener('scroll', () => majPas(i), { passive: true });
      marcherALaSouris(defil);
      const couloir = h('section', { class: 'couloir couloir-' + THEMES[i], 'data-etage': i, 'aria-label': t(nv.titre) },
        h('div', { class: 'couloir-givre', 'aria-hidden': 'true' }),
        h('div', { class: 'couloir-guirlande', 'aria-hidden': 'true' }), defil, pasG, pasD);
      tour.append(couloir);
      return { couloir, defil, piste, pasG, pasD };
    });
    const cadre = h('div', { class: 'visite-cadre' }, tour, barre, basVisite);
    racine.append(cadre);
    racine._barre = { monter, descendre, plan, guide, compteur };
    window.addEventListener('resize', () => couloirs.forEach((c, i) => majPas(i)));
    // Le clavier : ↑ ↓ (ou Page précédente / suivante) changent d'étage
    racine.addEventListener('keydown', (e) => {
      if (e.key === 'PageUp' || (e.key === 'ArrowUp' && e.altKey)) { e.preventDefault(); aller(etageCourant - 1); }
      if (e.key === 'PageDown' || (e.key === 'ArrowDown' && e.altKey)) { e.preventDefault(); aller(etageCourant + 1); }
    });
  }

  /* À la souris, on avance dans le couloir en le faisant glisser, ou avec la molette (qui, sinon,
     ferait défiler la page vers le bas). Au doigt, le navigateur fait déjà glisser tout seul. */
  function marcherALaSouris(defil) {
    let depart = null, deplace = false;
    defil.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      depart = { x: e.clientX, gauche: defil.scrollLeft };
      deplace = false;
    });
    defil.addEventListener('pointermove', (e) => {
      if (!depart) return;
      const dx = e.clientX - depart.x;
      if (!deplace && Math.abs(dx) > 6) { deplace = true; defil.classList.add('glisse'); defil.style.scrollSnapType = 'none'; }
      if (deplace) defil.scrollLeft = depart.gauche - dx;
    });
    const lacher = () => {
      if (!depart) return;
      depart = null;
      defil.classList.remove('glisse');
      defil.style.scrollSnapType = '';
      // Un glisser n'est pas un clic : la porte sous la souris ne s'ouvre pas
      if (deplace) { const bloque = (ev) => { ev.stopPropagation(); ev.preventDefault(); }; defil.addEventListener('click', bloque, { capture: true, once: true }); setTimeout(() => defil.removeEventListener('click', bloque, { capture: true }), 50); }
    };
    defil.addEventListener('pointerup', lacher);
    defil.addEventListener('pointerleave', lacher);
    defil.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = defil.scrollWidth - defil.clientWidth;
      if (max < 8) return;
      const cible = defil.scrollLeft + e.deltaY;
      if ((cible <= 0 && defil.scrollLeft <= 0) || (cible >= max && defil.scrollLeft >= max - 1)) return; // au bout : la page défile
      e.preventDefault();
      defil.scrollLeft = cible;
    }, { passive: false });
  }

  // Les flèches pour avancer dans le couloir n'apparaissent que s'il dépasse de l'écran
  function majPas(i) {
    const c = couloirs[i];
    if (!c) return;
    const max = c.defil.scrollWidth - c.defil.clientWidth;
    c.pasG.hidden = max < 8 || c.defil.scrollLeft < 8;
    c.pasD.hidden = max < 8 || c.defil.scrollLeft > max - 8;
  }
  function marcher(i, sens) {
    const c = couloirs[i];
    const baie = c.piste.querySelector('.baie');
    c.defil.scrollBy({ left: sens * (baie ? baie.offsetWidth : 200), behavior: mouvementReduit() ? 'auto' : 'smooth' });
    if (options.son) options.son('pas');
  }

  function aller(i, { anime = true, porte = null } = {}) {
    if (i < 0 || i >= couloirs.length) return;
    const change = i !== etageCourant;
    const ecart = Math.abs(i - etageCourant);
    if (change && etageCourant >= 0 && anime && options.son) options.son('escalier');
    etageCourant = i;
    tour.style.transitionDuration = anime && !mouvementReduit() && change ? Math.min(1.4, 0.6 + ecart * 0.25) + 's' : '0s';
    tour.style.transform = `translateY(${-i * 25}%)`;
    couloirs.forEach((c, k) => { c.couloir.inert = k !== i; c.couloir.classList.toggle('actif', k === i); });
    const { monter, descendre, plan } = racine._barre;
    const nv = options.niveaux;
    monter.hidden = i === 0;
    descendre.hidden = i === nv.length - 1;
    if (i > 0) monter.textContent = '⬆ ' + t(nv[i - 1].titre);
    if (i < nv.length - 1) descendre.textContent = '⬇ ' + t(nv[i + 1].titre);
    plan.querySelectorAll('.pastille-etage').forEach(b => { b.classList.toggle('actif', +b.dataset.etage === i); b.setAttribute('aria-pressed', String(+b.dataset.etage === i)); });
    // Une porte précise : on marche jusqu'à elle
    requestAnimationFrame(() => {
      majPas(i);
      if (porte) centrer(porte, anime && !change);
    });
    if (options.surEtage) options.surEtage(i);
  }

  function centrer(n, doux = true) {
    const p = portes.get(n);
    if (!p) return;
    const c = couloirs[p.etage];
    const baie = p.el.parentElement;
    const cible = baie.offsetLeft + baie.offsetWidth / 2 - c.defil.clientWidth / 2;
    c.defil.scrollTo({ left: Math.max(0, cible), behavior: doux && !mouvementReduit() ? 'smooth' : 'auto' });
  }

  /* Met les portes à jour. etat = { etatDe(n), info(n) → { univers, piece }, interieur(piece, n),
     prochaine : le jour de la prochaine porte à ouvrir, dateCourte(n) } */
  let prochaine = null;
  function maj(etat) {
    prochaine = etat.prochaine;
    racine._barre.guide.hidden = !prochaine;
    majDecouvertes(etat.decouvertes || []);
    for (const [n, { el }] of portes) {
      const e = etat.etatDe(n);
      const info = etat.info(n) || {};
      el.classList.remove('resolue', 'disponible', 'verrouillee', 'fermee');
      el.classList.add({ resolu: 'resolue', disponible: 'disponible', ferme: 'fermee' }[e] || 'verrouillee');
      el.classList.toggle('prochaine', etat.prochaine === n);
      // Derrière une porte déjà ouverte (pièce réparée) : la pièce, dessinée une seule fois. Les autres
      // portes restent fermées : inutile de dessiner ce qu'elles cachent.
      const interieur = el.querySelector('.porte-interieur');
      const version = info.piece && e === 'resolu' ? 'ouverte' : 'fermee';
      if (interieur.dataset.version !== version) {
        interieur.innerHTML = version === 'ouverte' ? etat.interieur(info.piece, n) : '';
        interieur.dataset.version = version;
      }
      const panneau = el.querySelector('.porte-panneau');
      panneau.textContent = e === 'verrouille' ? '🔒 ' + etat.dateCourte(n) : e === 'ferme' ? t('⌛ Fermée') : (e === 'resolu' ? '✓ ' : '✨ ') + (info.univers || '');
      el.title = info.univers || '';
      el.setAttribute('aria-label', etat.libelle(n));
    }
    // Les étages : combien de pièces réparées, guirlande allumée quand tout est réparé, givre qui recule
    options.niveaux.forEach((nv, i) => {
      const faites = nv.jours.filter(n => etat.etatDe(n) === 'resolu').length;
      const c = couloirs[i];
      c.couloir.classList.toggle('complet', faites === nv.jours.length);
      c.couloir.style.setProperty('--givre', (1 - faites / nv.jours.length).toFixed(2));
      const pastille = racine.querySelector(`.pastille-etage[data-etage="${i}"]`);
      pastille.querySelector('.pastille-compte').textContent = `${faites}/${nv.jours.length}`;
      pastille.classList.toggle('complet', faites === nv.jours.length);
      pastille.classList.toggle('a-jouer', nv.jours.some(n => etat.etatDe(n) === 'disponible'));
    });
  }

  function majDecouvertes(faites) {
    racine.querySelectorAll('.decouverte').forEach(b => b.classList.toggle('vue', faites.includes(b.dataset.decouverte)));
    const n = DECOUVERTES.filter(d => faites.includes(d.id)).length;
    racine._barre.compteur.textContent = `🔍 ${n}/${DECOUVERTES.length}`;
    racine._barre.compteur.classList.toggle('complet', n === DECOUVERTES.length);
  }

  // « Me guider » : on prend l'escalier jusqu'au bon étage, on marche jusqu'à la porte, elle s'illumine.
  function guider(n = prochaine) {
    const p = portes.get(n);
    if (!p) return;
    const change = p.etage !== etageCourant;
    aller(p.etage, { porte: n });
    setTimeout(() => {
      centrer(n, true);
      p.el.classList.remove('guidee');
      void p.el.offsetWidth;
      p.el.classList.add('guidee');
      if (options.son) options.son('note', 7);
      setTimeout(() => p.el.classList.remove('guidee'), 3200);
    }, change ? 900 : 100);
  }

  /* Une pièce réparée, de retour dans le couloir : la Kère s'enfuit de sa porte, la porte s'illumine
     et s'entrouvre sur la pièce rallumée, des étincelles d'or jaillissent. */
  function celebrer(n) {
    const p = portes.get(n);
    if (!p || mouvementReduit()) return Promise.resolve();
    aller(p.etage, { anime: false, porte: n });
    const fuite = h('span', { class: 'kere-fuite', 'aria-hidden': 'true', html: options.kereHTML(n === 24) });
    const gerbe = h('span', { class: 'gerbe-porte', 'aria-hidden': 'true' }, Array.from({ length: 14 }, (_, k) => {
      const a = (k / 14) * Math.PI * 2, d = 9 + Math.random() * 7;
      return h('i', { style: `--dx:${(Math.cos(a) * d).toFixed(1)}cqh;--dy:${(Math.sin(a) * d * 0.8).toFixed(1)}cqh;animation-delay:${(0.5 + Math.random() * 0.25).toFixed(2)}s` });
    }));
    p.el.append(fuite, gerbe);
    p.el.classList.add('celebree');
    if (options.son) { options.son('eclat'); setTimeout(() => options.son('victoire'), 550); }
    return new Promise(ok => setTimeout(() => { p.el.classList.remove('celebree'); fuite.remove(); gerbe.remove(); ok(); }, 2300));
  }

  /* Tout un étage réparé : le givre fond sur les murs, la guirlande s'allume d'un bout à l'autre,
     une vague dorée traverse le couloir et une bannière annonce la libération. */
  function liberer(i) {
    const c = couloirs[i];
    if (!c || mouvementReduit()) return Promise.resolve();
    aller(i, { anime: false });
    const banniere = h('div', { class: 'banniere-liberation', role: 'status' },
      h('span', { class: 'banniere-titre' }, t('✨ {etage} est libéré !', { etage: (x => x.charAt(0).toUpperCase() + x.slice(1))(t(options.niveaux[i].nom)) })),
      h('span', { class: 'banniere-sous-titre' }, t('Le givre fond, les guirlandes se rallument !')));
    const vague = h('div', { class: 'vague-doree', 'aria-hidden': 'true' });
    c.couloir.append(vague, banniere);
    c.couloir.classList.add('liberation');
    if (options.son) { options.son('degel'); setTimeout(() => options.son('victoire'), 1500); }
    return new Promise(ok => setTimeout(() => { c.couloir.classList.remove('liberation'); vague.remove(); banniere.remove(); ok(); }, 4200));
  }

  /* On entre dans une pièce : la caméra s'approche de la porte, la porte s'ouvre en grand,
     la lumière de la pièce envahit l'écran. La promesse se résout au plus fort de la lumière. */
  function entrer(n) {
    const p = portes.get(n);
    if (!p || mouvementReduit()) return Promise.resolve();
    const c = couloirs[p.etage];
    if (p.etage !== etageCourant) aller(p.etage, { anime: false });
    const r = p.el.getBoundingClientRect();
    const rp = c.piste.getBoundingClientRect();
    c.piste.style.transformOrigin = `${(r.left + r.width / 2 - rp.left).toFixed(0)}px ${(r.top + r.height * 0.55 - rp.top).toFixed(0)}px`;
    p.el.classList.add('ouvre');
    void c.piste.offsetWidth;
    c.piste.classList.add('camera-entre');
    const voile = h('div', { class: 'voile-entree', 'aria-hidden': 'true' });
    voile.style.setProperty('--x', (r.left + r.width / 2).toFixed(0) + 'px');
    voile.style.setProperty('--y', (r.top + r.height * 0.55).toFixed(0) + 'px');
    document.body.append(voile);
    return new Promise(ok => setTimeout(() => {
      ok();
      // La pièce s'est ouverte par-dessus : on remet le couloir en place, sans animation, et la lumière se dissipe
      setTimeout(() => {
        c.piste.classList.remove('camera-entre');
        p.el.classList.remove('ouvre');
        voile.classList.add('dissipe');
        setTimeout(() => voile.remove(), 700);
      }, 120);
    }, 820));
  }

  // Une porte encore verrouillée : elle tremble, les chaînes cliquettent
  function secouer(n) {
    const p = portes.get(n);
    if (!p) return;
    p.el.classList.remove('secouee');
    void p.el.offsetWidth;
    p.el.classList.add('secouee');
  }

  // L'arrivée par téléportation : la caméra recule doucement dans le couloir
  function arrivee() {
    if (!racine || mouvementReduit()) return;
    racine.classList.remove('arrivee');
    void racine.offsetWidth;
    racine.classList.add('arrivee');
    setTimeout(() => racine.classList.remove('arrivee'), 1800);
  }

  global.VISITE = {
    construire, maj, aller, entrer, secouer, centrer, arrivee, guider, celebrer, liberer, majDecouvertes,
    nbDecouvertes: DECOUVERTES.length,
    etage: () => etageCourant,
    etageDe: (n) => (portes.get(n) || {}).etage,
    porte: (n) => (portes.get(n) || {}).el,
  };
})(window);
