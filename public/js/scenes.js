/* =========================================================
   NOËL-OS — La scène de chaque énigme
   SCENES.dessiner(n, piece, { chassee, sansKere }) → le décor animé de la pièce n
   La scène ne se contente pas d'illustrer : elle MONTRE la situation de l'énigme
   (la porte et sa guirlande au jour 1, l'imprimante gelée au jour 2…), avec la Kère
   en pleine bêtise.

   Fluidité (Firefox dessine sans carte graphique chez le joueur) : le fond est un
   seul grand SVG IMMOBILE ; tout ce qui bouge est un petit calque HTML posé par-dessus
   (« sp »), qui n'anime que transform et opacity. Firefox ne redessine alors que ces
   petits calques, jamais le grand dessin.

   Coordonnées : la scène fait 900 × 250 et couvre toujours sa boîte (comme un fond
   « cover »), centrée. Une case de la façade n'en montre que le milieu (x ≈ 300 à 600),
   un téléphone x ≈ 240 à 660 : le cœur de l'énigme se tient au centre, les gags sur
   les côtés. En bas à gauche, le titre de la pièce recouvre le dessin.
   ========================================================= */
(function (global) {
  'use strict';

  const W = 900, H = 250, SOL = 188;
  const pct = (v, total) => +(v / total * 100).toFixed(3) + '%';
  const boite = (x, y, w, h) => `left:${pct(x, W)};top:${pct(y, H)};width:${pct(w, W)};height:${pct(h, H)}`;
  const tr = (texte) => (global.t ? global.t(texte) : texte);
  const ech = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Un calque animé : un petit SVG posé au-dessus du fond, dessiné dans les coordonnées de la scène */
  const calque = (classe, x, y, w, h, contenu) =>
    `<div class="sp ${classe}" style="${boite(x, y, w, h)}"><svg viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${contenu}</svg></div>`;

  /* La Kère en personne (les mêmes images que sur sa carte). « objet » : un petit SVG (viewBox 0 0 100 100)
     posé sur sa griffe droite (droite = à droite de l'écran) ou gauche. */
  const GRIFFE = { d: [62, 50], g: [-8, 50] };
  function kere({ x, y, taille, classe = '', objet = '', main = 'd', tailleObjet = 46, retourne = false, boss = false }) {
    const [ox, oy] = GRIFFE[main];
    const o = objet ? `<svg class="ka-objet ka-objet-${main}" viewBox="0 0 100 100" style="left:${ox}%;top:${oy}%;width:${tailleObjet}%;height:${tailleObjet}%" aria-hidden="true">${objet}</svg>` : '';
    return `<div class="sp kere-acteur ${classe}" style="${boite(x, y, taille, taille)}"><div class="ka-vol"><div class="ka-pose${retourne ? ' retourne' : ''}">` +
      (boss ? '<img class="corps" src="media/kryos-tete.webp" alt="" draggable="false">' // (au 24 : Kryos en personne)
        : '<img class="aile aile-g" src="media/kere-aile-g.webp" alt="" draggable="false"><img class="aile aile-d" src="media/kere-aile-d.webp" alt="" draggable="false"><img class="corps" src="media/kere-corps.webp" alt="" draggable="false">') +
      `${o}</div></div></div>`;
  }
  // Ce qu'il reste de la Kère une fois chassée : une flaque et sa petite couronne de glace
  const flaque = (x) => calque('flaque-scene', x - 30, SOL - 12, 60, 16,
    `<ellipse cx="${x}" cy="${SOL - 3}" rx="27" ry="5" fill="#cfeaff" opacity=".85"/><ellipse cx="${x - 6}" cy="${SOL - 4}" rx="10" ry="1.6" fill="#fff" opacity=".8"/>` +
    `<path d="M${x + 6} ${SOL - 4} l3 -7 2 5 3 -8 2 8 3 -6 1 8z" fill="#e8f7ff" stroke="#9fd2f0" stroke-width=".8"/>`);

  /* ---------- Petites briques ---------- */
  const texte = (x, y, s, { taille = 10, couleur = '#3a2508', ancre = 'middle', police = 'Georgia, serif', gras = false, extra = '' } = {}) =>
    `<text x="${x}" y="${y}" font-size="${taille}" fill="${couleur}" text-anchor="${ancre}" font-family="${police}"${gras ? ' font-weight="700"' : ''} ${extra}>${ech(s)}</text>`;
  const MONO = 'ui-monospace, Consolas, monospace';
  const ombreSol = (x, l, o = 0.25) => `<ellipse cx="${x}" cy="${SOL + 2}" rx="${l}" ry="4" fill="#000" opacity="${o}"/>`;
  const clou = (x, y) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#c9a35a" stroke="#5a3a1e" stroke-width=".8"/>`;
  function papier(x, y, l, h, rot, contenu = '') {
    return `<g transform="rotate(${rot} ${x + l / 2} ${y + h / 2})"><rect x="${x + 2}" y="${y + 2}" width="${l}" height="${h}" fill="#000" opacity=".2"/><rect x="${x}" y="${y}" width="${l}" height="${h}" fill="#fff8e6"/>${contenu}</g>`;
  }
  const lignes = (x, y, l, n, pas = 5, couleur = '#8a7a5a') => Array.from({ length: n }, (_, i) => `<line x1="${x}" y1="${y + i * pas}" x2="${x + l * (i === n - 1 ? 0.6 : 1)}" y2="${y + i * pas}" stroke="${couleur}" stroke-width="1.1" stroke-linecap="round"/>`).join('');
  const etincelle = (x, y, r, couleur = '#fff6c8') => `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z" fill="${couleur}"/>`;
  const glacons = (x1, x2, y, pas = 9, long = 12) => { let s = ''; for (let x = x1, i = 0; x < x2; x += pas, i++) s += `<path d="M${x} ${y} l${pas / 2} ${long * (0.5 + ((i * 37) % 10) / 14)} l${pas / 2} -${long * (0.5 + ((i * 37) % 10) / 14)}z" fill="#e8f7ff" opacity=".92"/>`; return s; };
  // Une ampoule de guirlande (culot en haut), centrée sur x, y = haut du culot
  const ampoule = (x, y, couleur, classe = '', retard = 0) =>
    `<g class="${classe}" style="animation-delay:${retard}s"><circle cx="${x}" cy="${y + 12}" r="8" fill="${couleur}" opacity=".35" class="halo"/><rect x="${x - 2.6}" y="${y}" width="5.2" height="5" rx="1" fill="#6d6f73"/><path d="M${x - 4} ${y + 5} Q${x - 5.5} ${y + 12} ${x} ${y + 17} Q${x + 5.5} ${y + 12} ${x + 4} ${y + 5}Z" fill="${couleur}"/><ellipse cx="${x - 1.4}" cy="${y + 9}" rx="1.1" ry="2.4" fill="#fff" opacity=".7"/></g>`;

  // Un bonhomme de neige (pied au sol en x), qui transpire
  function bonhomme(x, base, s = 1) {
    const r1 = 17 * s, r2 = 12 * s, r3 = 9 * s;
    const y1 = base - r1, y2 = y1 - r1 - r2 + 4 * s, y3 = y2 - r2 - r3 + 3 * s;
    return `<circle cx="${x}" cy="${y1}" r="${r1}" fill="#f4f9ff"/><circle cx="${x}" cy="${y2}" r="${r2}" fill="#eef6ff"/><circle cx="${x}" cy="${y3}" r="${r3}" fill="#f8fbff"/>` +
      `<circle cx="${x}" cy="${y2 - 3 * s}" r="1.6" fill="#222"/><circle cx="${x}" cy="${y2 + 3 * s}" r="1.6" fill="#222"/>` +
      `<path d="M${x - 4 * s} ${y3 - 3 * s} l3 1.5 M${x + 4 * s} ${y3 - 3 * s} l-3 1.5" stroke="#222" stroke-width="1.2"/><circle cx="${x - 3 * s}" cy="${y3 - 0.5 * s}" r="1.4" fill="#222"/><circle cx="${x + 3 * s}" cy="${y3 - 0.5 * s}" r="1.4" fill="#222"/>` +
      `<path d="M${x} ${y3 + 1.5 * s} l${9 * s} 1.5 -${9 * s} 1.5z" fill="#f08a24"/><path d="M${x - 3.5 * s} ${y3 + 5.5 * s} q3.5 -2.5 7 0" stroke="#222" stroke-width="1.2" fill="none"/>` +
      `<path d="M${x - r2 + 2} ${y2} l-${12 * s} -${8 * s} M${x + r2 - 2} ${y2} l${12 * s} -${10 * s}" stroke="#6b4423" stroke-width="2" stroke-linecap="round"/>`;
  }

  /* =======================================================
     Les 24 scènes. Chaque fonction reçoit c = PIECES.calques(…) et renvoie
     { piece, fond, calques, kere }.
       piece   : la pièce de base (murs, sol, éléments du fond qu'on garde)
       fond    : le décor de l'énigme, dans le grand SVG immobile
       calques : les petits calques animés
       kere    : où se tient la Kère et ce qu'elle tient
     ======================================================= */
  const SC = {};

  /* ---- Jour 1 : la porte de l'atelier, verrouillée par une guirlande de 8 ampoules.
     Sur la porte, la Kère a gravé le code à écrire en binaire : 25, le jour de Noël ;
     au mur, le calendrier de l'Avent et ses cases. ---- */
  SC[1] = {
    piece: { mur: '#6b3f1f', motif: 'bois', sol: 'parquet', elements: ['fenetre', null, null] },
    dessin() {
      const valeurs = [128, 64, 32, 16, 8, 4, 2, 1];
      const xa = (i) => 395 + i * 15.7;
      let f = '';
      // Le calendrier de l'Avent accroché au mur, à droite
      f += `<rect x="688" y="46" width="134" height="110" rx="4" fill="#000" opacity=".25"/><rect x="684" y="42" width="134" height="110" rx="4" fill="#f4ead2"/><rect x="684" y="42" width="134" height="20" rx="4" fill="#b3202f"/>`;
      f += clou(751, 38) + `<path d="M751 38 L700 42 M751 38 L802 42" stroke="#5a3a1e" stroke-width="1"/>`;
      f += texte(751, 56, tr('CALENDRIER DE L\'AVENT'), { taille: 8.2, couleur: '#fff4d6', gras: true, police: MONO });
      for (let i = 0; i < 24; i++) {
        const col = i % 6, lig = Math.floor(i / 6);
        const x = 690 + col * 21.3, y = 66 + lig * 21.3;
        f += `<rect x="${x}" y="${y}" width="18.5" height="18.5" rx="2" fill="${['#1f6a3d', '#9b1b30', '#1d4f86', '#8a5a1e'][(i * 5) % 4]}"/>` + texte(x + 9.2, y + 12.6, i + 1, { taille: 8.5, couleur: '#fff4d6', gras: true });
      }
      // La porte de l'atelier
      f += `<rect x="374" y="30" width="152" height="${SOL - 30}" rx="5" fill="#3b2210"/><rect x="384" y="38" width="132" height="${SOL - 38}" fill="#8a5530"/>`;
      for (let x = 405; x < 516; x += 22) f += `<line x1="${x}" y1="38" x2="${x}" y2="${SOL}" stroke="#6e4120" stroke-width="1.6"/>`;
      f += `<rect x="384" y="${SOL - 4}" width="132" height="4" fill="#ffd27a" opacity=".35"/>`;
      // Le code gravé dans la glace, de la griffe de la Kère : le jour de Noël, à écrire en binaire
      f += `<rect x="394" y="48" width="112" height="36" rx="5" fill="#5e3618"/><path d="M398 52 l8 5 M500 79 l-6 -4 M400 80 l9 -6 M502 51 l-7 6" stroke="#cfefff" stroke-width="1.4" opacity=".7"/>`;
      f += texte(450, 73, '25 = ?', { taille: 17, couleur: '#8fd6ff', police: MONO, gras: true, extra: 'letter-spacing="1.2" stroke="#e6f8ff" stroke-width=".5"' });
      // Le fil de la guirlande, les nombres gravés sous chaque ampoule
      f += `<path d="M386 108 Q450 116 514 108" stroke="#1d5a32" stroke-width="2.5" fill="none"/>`;
      valeurs.forEach((v, i) => { f += texte(xa(i), 142, v, { taille: 6.8, couleur: '#ffe9b0', police: MONO, gras: true }); });
      // Le mot épinglé sur la porte
      f += papier(414, 150, 72, 30, -3, lignes(421, 158, 56, 3, 5.5) + texte(476, 177, '— K.', { taille: 7, couleur: '#2a5d8a', ancre: 'end' })) + clou(450, 151);
      // Ce qu'il reste des bonshommes de neige : une flaque, une carotte, un chapeau
      f += `<ellipse cx="598" cy="${SOL - 1}" rx="30" ry="5.5" fill="#dff1ff"/><ellipse cx="590" cy="${SOL - 2}" rx="10" ry="1.6" fill="#fff"/>`;
      f += `<path d="M584 ${SOL - 4} l18 -2 -18 4z" fill="#f08a24"/><circle cx="607" cy="${SOL - 3}" r="2" fill="#222"/><circle cx="612" cy="${SOL - 1}" r="2" fill="#222"/>`;
      f += `<rect x="566" y="${SOL - 10}" width="16" height="9" fill="#1b1b1f" transform="rotate(-20 574 ${SOL - 6})"/><rect x="562" y="${SOL - 4}" width="24" height="3" fill="#1b1b1f" transform="rotate(-20 574 ${SOL - 3})"/>`;
      f += ombreSol(665, 26);
      // Calques animés
      let a = '';
      a += calque('s1-guirlande', 384, 104, 132, 32, valeurs.map((_, i) => ampoule(xa(i), 109, ['#ff5a5f', '#ffd23f', '#3ddc84', '#4aa3ff'][i % 4], 's1-amp', (i * 0.37) % 1.6)).join(''));
      a += calque('s1-griffe', 396, 52, 14, 14, etincelle(403, 59, 6, '#e6f8ff'));
      a += calque('s1-bonhomme', 636, 104, 60, 86, bonhomme(665, SOL));
      a += calque('s1-sueur', 650, 118, 30, 30, `<path d="M672 126 q2.6 4 0 6 q-2.6 -2 0 -6z" fill="#bfe6ff"/><path d="M657 128 q2 3 0 4.6 q-2 -1.6 0 -4.6z" fill="#bfe6ff"/>`);
      a += calque('s1-case', 793, 130, 22, 22, `<rect x="796.5" y="133.9" width="18.5" height="18.5" rx="2" fill="none" stroke="#ffe27a" stroke-width="2"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 262, y: 40, taille: 84, classe: 's1-kere', objet: ampoule(50, 18, '#ffd23f', 's1-amp-volee'), tailleObjet: 40 },
  };

  /* ---- Jour 2 : l'imprimante à étiquettes gelée crache un ruban de 0 et de 1 ; la Kère, assise
     dessus, tamponne le courrier « GELÉ ». ---- */
  SC[2] = {
    piece: { mur: '#2c4a73', motif: 'rayures', sol: 'parquet', elements: ['casiers', null, 'horloge'] },
    dessin() {
      let f = '';
      // La table et l'imprimante, prise dans la glace
      f += `<rect x="352" y="150" width="196" height="9" rx="3" fill="#8a5a30"/><rect x="364" y="159" width="10" height="${SOL - 159}" fill="#5a3418"/><rect x="526" y="159" width="10" height="${SOL - 159}" fill="#5a3418"/>`;
      f += `<rect x="386" y="86" width="128" height="64" rx="9" fill="#aab6c4"/><rect x="386" y="86" width="128" height="18" rx="9" fill="#c9d3de"/><rect x="400" y="132" width="100" height="7" rx="3" fill="#222a33"/>`;
      f += `<rect x="470" y="108" width="34" height="16" rx="3" fill="#1b2430"/>` + texte(487, 120, 'ERR', { taille: 9, couleur: '#ff5a5f', police: MONO, gras: true });
      f += `<circle cx="402" cy="116" r="4" fill="#3ddc84" opacity=".35"/><circle cx="416" cy="116" r="4" fill="#ff5a5f"/>`;
      f += `<path d="M386 92 Q400 80 420 88 Q440 78 462 87 Q486 79 514 92 L514 98 L386 98Z" fill="#eef8ff"/>` + glacons(390, 512, 97, 10, 10);
      // Le ruban de papier qui sort de la fente et s'enroule par terre
      f += `<path d="M426 139 L426 ${SOL - 6} Q426 ${SOL} 438 ${SOL} L590 ${SOL} Q604 ${SOL} 600 ${SOL - 10} Q596 ${SOL - 18} 586 ${SOL - 12}" stroke="#fffdf4" stroke-width="13" fill="none"/>`;
      f += texte(520, SOL + 3.5, '01001111 01000010 01001111', { taille: 7, couleur: '#3a4a5a', police: MONO });
      // Les colis, étiquetés en binaire
      const colis = (x, y, l, h, c, etiq) => `<rect x="${x}" y="${y}" width="${l}" height="${h}" fill="${c}"/><rect x="${x + l / 2 - 3}" y="${y}" width="6" height="${h}" fill="#d62839" opacity=".8"/><rect x="${x + 5}" y="${y + h / 2 - 5}" width="${l - 10}" height="10" fill="#f4f0e6"/>` + texte(x + l / 2, y + h / 2 + 2.6, etiq, { taille: 6, couleur: '#222', police: MONO });
      f += ombreSol(632, 50) + colis(592, 150, 80, 38, '#b07a42', '01010100') + colis(602, 118, 62, 32, '#9a6a38', '01010010') + colis(614, 94, 40, 24, '#c48a4e', '0100…');
      // Une enveloppe sur la table, déjà tamponnée
      f += `<rect x="358" y="134" width="40" height="16" fill="#fff8e6" transform="rotate(-6 378 142)"/><path d="M358 134 l20 9 20 -9" stroke="#c9b48a" stroke-width="1" fill="none" transform="rotate(-6 378 142)"/>`;
      let a = '';
      a += calque('s2-ruban clip', 419, 139, 14, 44, `<g class="s2-defile">${Array.from({ length: 12 }, (_, i) => texte(426, 146 + i * 7, i % 2 ? '1' : '0', { taille: 6.5, couleur: '#3a4a5a', police: MONO, gras: true })).join('')}</g>`);
      a += calque('s2-tampon-marque', 356, 130, 44, 22, `<g transform="rotate(-12 378 141)"><rect x="362" y="135" width="32" height="12" rx="2" fill="none" stroke="#2a7fd4" stroke-width="1.6"/>${texte(378, 144.5, tr('GELÉ'), { taille: 8.5, couleur: '#2a7fd4', police: MONO, gras: true })}</g>`);
      a += calque('s2-enveloppe', -40, 34, 30, 20, `<rect x="-38" y="38" width="26" height="15" fill="#fff8e6"/><path d="M-38 38 l13 8 13 -8" stroke="#c9b48a" stroke-width="1.2" fill="none"/><rect x="-18" y="40" width="5" height="5" fill="#d62839"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 404, y: 10, taille: 82, classe: 's2-kere', main: 'g', tailleObjet: 44,
      objet: `<rect x="36" y="4" width="20" height="34" rx="9" fill="#8a5a30"/><rect x="26" y="36" width="40" height="12" rx="3" fill="#5a3418"/><rect x="24" y="48" width="44" height="10" rx="2" fill="#2a7fd4"/>` },
  };

  /* ---- Jour 3 : la roue de chiffrement dorée sur le bureau du grenier, à côté de l'encrier ; la Kère
     griffonne sur la lettre de l'enfant, qui se brouille sous nos yeux. ---- */
  SC[3] = {
    piece: { mur: '#5b4636', motif: 'bois', sol: 'parquet', elements: ['malles', null, 'etageres:📜🕯️📜'] },
    dessin() {
      let f = '';
      // Le bureau
      f += `<rect x="330" y="158" width="240" height="10" rx="3" fill="#6e4120"/><rect x="342" y="168" width="12" height="${SOL - 168}" fill="#4a2a12"/><rect x="546" y="168" width="12" height="${SOL - 168}" fill="#4a2a12"/>`;
      // Le pied de la roue, et un encrier avec sa plume à l'autre bout du bureau
      f += `<path d="M376 150 L385 96 L394 150Z" fill="#7a5a2a"/><rect x="366" y="148" width="38" height="10" rx="3" fill="#5a3a1e"/>`;
      f += `<path d="M512 158 L514 140 Q522 134 530 140 L532 158Z" fill="#1d2a44"/><rect x="514" y="136" width="16" height="5" rx="2" fill="#2c3d60"/><path d="M524 138 Q536 104 552 92 Q544 112 528 138Z" fill="#f4f0e6" stroke="#bdb39a" stroke-width="1"/>`;
      // Une bougie
      f += `<rect x="337" y="134" width="12" height="24" rx="2" fill="#f4ead2"/><rect x="332" y="155" width="22" height="4" rx="2" fill="#c9a35a"/>`;
      // La roue (elle tourne : calque)
      const roue = (cx, cy, metal, fonce, sens) => {
        let s = `<circle cx="${cx}" cy="${cy}" r="44" fill="${fonce}"/><circle cx="${cx}" cy="${cy}" r="41" fill="${metal}"/><circle cx="${cx}" cy="${cy}" r="29" fill="${fonce}" opacity=".55"/><circle cx="${cx}" cy="${cy}" r="8" fill="${fonce}"/>`;
        for (let i = 0; i < 26; i++) {
          const ang = (i / 26) * 360;
          s += `<text x="${cx}" y="${cy - 32}" font-size="7.5" font-family="${MONO}" font-weight="700" text-anchor="middle" fill="#2a1e0e" transform="rotate(${ang} ${cx} ${cy})">${String.fromCharCode(65 + ((i + sens) % 26))}</text>`;
        }
        for (let i = 0; i < 6; i++) s += `<line x1="${cx}" y1="${cy}" x2="${cx + 27 * Math.cos(i * 1.047)}" y2="${cy + 27 * Math.sin(i * 1.047)}" stroke="${fonce}" stroke-width="2"/>`;
        return s;
      };
      // La lettre de l'enfant, sur le bureau
      const lettre = papier(392, 126, 116, 32, -2, '');
      f += lettre;
      let a = '';
      a += calque('s3-roue-or', 340, 40, 90, 90, roue(385, 85, '#e9c46a', '#a07a2a', 0));
      // Le message en clair, puis brouillé (toutes les lettres avec la même clé)
      a += calque('s3-lettre', 392, 126, 116, 32, `<g transform="rotate(-2 450 142)"><g class="s3-clair"><text x="400" y="139" font-size="9" font-family="${MONO}" font-weight="700" fill="#3a2508">${ech(tr('CHER PÈRE NOËL,'))}</text></g><g class="s3-chiffre"><text x="400" y="139" font-size="9" font-family="${MONO}" font-weight="700" fill="#a87a1a">${ech(tr('KPMZ XMZM VWMT,'))}</text></g>${lignes(400, 147, 98, 2, 5)}</g>`);
      a += calque('s3-flamme', 335, 118, 16, 18, `<path d="M343 120 Q349 128 343 135 Q337 128 343 120Z" fill="#ffcf5a"/><path d="M343 125 Q346 130 343 134 Q340 130 343 125Z" fill="#fff4c4"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 560, y: 70, taille: 76, classe: 's3-kere', main: 'g', tailleObjet: 56,
      objet: `<path d="M88 6 Q60 30 40 70 L46 74 Q66 36 92 10Z" fill="#f4f0e6" stroke="#bdb39a" stroke-width="2"/><path d="M40 70 L34 86 L46 74Z" fill="#2a1e0e"/>` },
  };

  /* ---- Jour 4 : la machine à peindre les boules, vidée de ses couleurs par la Kère : tout sort gris,
     même le portrait du Père Noël au mur. Sur l'écran, la commande : une boule jaune. ---- */
  SC[4] = {
    piece: { mur: '#e9dcc0', motif: 'papier', sol: 'parquet', elements: [null, null, 'etageres:🔴🟡🔵'] },
    dessin() {
      let f = '';
      // Le portrait du Père Noël, tout gris (la Kère a aussi pompé ses couleurs)
      f += `<rect x="96" y="40" width="104" height="96" rx="3" fill="#c9a35a"/><rect x="104" y="48" width="88" height="80" fill="#5b6066"/>`;
      f += `<circle cx="148" cy="92" r="20" fill="#b9bdc2"/><path d="M126 96 Q148 132 170 96 Q160 110 148 112 Q136 110 126 96Z" fill="#e6e8ea"/><path d="M128 78 Q148 52 172 80Z" fill="#8a8f95"/><circle cx="172" cy="80" r="5" fill="#f2f3f4"/><rect x="126" y="76" width="46" height="7" rx="3" fill="#f2f3f4"/><circle cx="141" cy="90" r="2" fill="#2a2d31"/><circle cx="155" cy="90" r="2" fill="#2a2d31"/>`;
      f += texte(148, 147, tr('« Portrait du patron »'), { taille: 7.5, couleur: '#5a3a1e' });
      // La machine
      f += `<rect x="392" y="40" width="116" height="104" rx="10" fill="#5d6b7a"/><rect x="392" y="40" width="116" height="20" rx="10" fill="#7d8b9a"/>`;
      f += `<rect x="404" y="66" width="92" height="34" rx="4" fill="#0e1a24"/>` + texte(450, 80, tr('COMMANDE : JAUNE'), { taille: 7.4, couleur: '#ffe27a', police: MONO, gras: true }) + texte(450, 93, '#??????', { taille: 7.5, couleur: '#7fd0ff', police: MONO });
      // Les trois réservoirs de lumière R, V, B
      [['#ff4d4d', 'R'], ['#3ddc84', tr('V')], ['#4aa3ff', 'B']].forEach(([c, l], i) => { const x = 410 + i * 30; f += `<rect x="${x}" y="108" width="20" height="26" rx="4" fill="#1b2430"/><rect x="${x + 3}" y="116" width="14" height="15" rx="2" fill="${c}"/>` + texte(x + 10, 114.5, l, { taille: 6.5, couleur: '#fff', police: MONO, gras: true }); });
      f += `<path d="M440 144 L460 144 L456 158 L444 158Z" fill="#3d4a58"/>`;
      // Le fil où sèchent les boules, et les taches de peinture par terre
      f += `<path d="M450 162 Q600 172 760 160" stroke="#5a3a1e" stroke-width="1.6" fill="none"/>`;
      f += `<ellipse cx="452" cy="${SOL - 1}" rx="22" ry="4" fill="#8a8f95" opacity=".75"/><ellipse cx="520" cy="${SOL}" rx="12" ry="3" fill="#b9bdc2" opacity=".7"/><ellipse cx="378" cy="${SOL - 1}" rx="9" ry="2.5" fill="#8a8f95" opacity=".6"/>`;
      let a = '';
      // Les boules qui sortent toutes grises, et qui défilent
      const boule = (x, c) => `<line x1="${x}" y1="160" x2="${x}" y2="166" stroke="#5a3a1e" stroke-width="1.2"/><rect x="${x - 3}" y="165" width="6" height="4" rx="1" fill="#c9a35a"/><circle cx="${x}" cy="177" r="9" fill="${c}"/><ellipse cx="${x - 3}" cy="173" rx="2.2" ry="3.2" fill="#fff" opacity=".55"/>`;
      a += calque('s4-boules', 450, 156, 320, 34, `<g class="s4-defile">${[['#9aa0a6', 470], ['#c3c7cc', 530], ['#80868c', 590], ['#aeb3b8', 650], ['#9aa0a6', 710], ['#c3c7cc', 770]].map(([c, x]) => boule(x, c)).join('')}</g>`);
      a += calque('s4-goutte', 444, 152, 12, 30, `<path d="M450 156 q3 5 0 7.5 q-3 -2.5 0 -7.5z" fill="#9aa0a6"/>`);
      a += calque('s4-voyant', 404, 66, 92, 34, `<rect x="406" y="68" width="88" height="15" rx="3" fill="#ff5a7a" opacity=".25"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 292, y: 40, taille: 84, classe: 's4-kere', tailleObjet: 52,
      objet: `<rect x="12" y="10" width="10" height="56" rx="4" fill="#8a5a30" transform="rotate(25 17 38)"/><rect x="24" y="56" width="18" height="12" fill="#c9cfd6" transform="rotate(25 33 62)"/><path d="M30 66 Q38 82 32 92 Q22 84 30 66Z" fill="#9aa0a6" transform="rotate(25 30 78)"/>` },
  };

  /* ---- Jour 5 : la porte blindée de la Réserve, et son circuit : 3 interrupteurs (A, B, C), 3 portes
     logiques, une étoile éteinte. La Kère ronge un fil… et s'électrocute. ---- */
  SC[5] = {
    piece: { mur: '#3a3f47', motif: 'pierre', sol: 'pierre', elements: ['caisses', null, 'caisses'] },
    dessin() {
      let f = '';
      // La porte blindée
      f += `<rect x="366" y="28" width="168" height="${SOL - 28}" rx="8" fill="#2a3038"/><rect x="374" y="36" width="152" height="${SOL - 36}" rx="6" fill="#5d6873"/>`;
      for (let y = 46; y < SOL; y += 30) f += `<circle cx="382" cy="${y}" r="2.5" fill="#8a96a3"/><circle cx="518" cy="${y}" r="2.5" fill="#8a96a3"/>`;
      // L'étoile (éteinte) en haut, les 3 portes logiques, les 3 interrupteurs en bas
      f += `<polygon points="450,40 455,52 468,52 458,60 462,72 450,64 438,72 442,60 432,52 445,52" fill="#4a4f57" stroke="#8a96a3" stroke-width="1"/>`;
      const gx = [410, 450, 490];
      gx.forEach((x, i) => { f += `<rect x="${x - 12}" y="92" width="24" height="16" rx="3" fill="#1b2430" stroke="#8a96a3" stroke-width="1"/>` + texte(x, 103, 'P' + (i + 1), { taille: 7.5, couleur: '#cfe8ff', police: MONO, gras: true }); f += `<line x1="${x}" y1="92" x2="450" y2="72" stroke="#c48a2a" stroke-width="1.4"/>`; });
      const ix = [410, 450, 490];
      // Les fils : A et B → P1, C → P2, B et C → P3
      const fils = [[0, 0], [1, 0], [2, 1], [1, 2], [2, 2]];
      fils.forEach(([k, g]) => { f += `<line x1="${ix[k]}" y1="146" x2="${gx[g]}" y2="108" stroke="#c48a2a" stroke-width="1.2" opacity=".85"/>`; });
      ['A', 'B', 'C'].forEach((l, i) => { const x = ix[i]; f += `<rect x="${x - 9}" y="146" width="18" height="24" rx="3" fill="#1b2430"/><rect x="${x - 3}" y="${i % 2 ? 158 : 149}" width="6" height="9" rx="2" fill="${i % 2 ? '#7d8794' : '#ffd23f'}"/>` + texte(x, 180, l, { taille: 8, couleur: '#ffe9b0', police: MONO, gras: true }); });
      // Le fil arraché que ronge la Kère
      f += `<path d="M374 120 Q340 118 330 104" stroke="#c48a2a" stroke-width="2" fill="none"/>`;
      let a = '';
      // Des étincelles qui courent dans les fils
      a += calque('s5-courant c1', 406, 104, 8, 8, `<circle cx="410" cy="108" r="2.6" fill="#fff3a0"/>`);
      a += calque('s5-courant c2', 486, 104, 8, 8, `<circle cx="490" cy="108" r="2.6" fill="#fff3a0"/>`);
      a += calque('s5-etoile', 430, 38, 40, 36, `<polygon points="450,40 455,52 468,52 458,60 462,72 450,64 438,72 442,60 432,52 445,52" fill="#ffd23f" opacity=".9"/>`);
      a += calque('s5-zap', 300, 70, 70, 70, `${etincelle(326, 102, 15, '#fffbd0')}<path d="M318 82 l8 10 -6 3 10 12" stroke="#fff3a0" stroke-width="2" fill="none"/><path d="M340 90 l-6 8 6 2 -8 10" stroke="#fff3a0" stroke-width="2" fill="none"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 286, y: 60, taille: 82, classe: 's5-kere' },
  };

  /* ---- Jour 6 : le tapis roulant gelé et ses 6 paquets ; le traîneau qui attend, la jauge de
     carburant presque vide… parce que la Kère le boit à la paille. ---- */
  SC[6] = {
    piece: { mur: '#4a3b2f', motif: 'briques', sol: 'pierre', elements: ['etageres:🔧🪛🧰', null, null] },
    dessin() {
      let f = '';
      // Le tapis roulant, pris par la glace
      f += `<rect x="286" y="150" width="344" height="14" rx="7" fill="#2a2f36"/>`;
      for (let x = 296; x < 626; x += 22) f += `<circle cx="${x}" cy="157" r="5" fill="#59616b"/>`;
      f += `<rect x="296" y="164" width="10" height="${SOL - 164}" fill="#1b1f24"/><rect x="610" y="164" width="10" height="${SOL - 164}" fill="#1b1f24"/>`;
      f += `<path d="M300 150 Q330 144 360 150 Q420 142 470 150 Q530 144 590 150 L590 153 L300 153Z" fill="#dff1ff" opacity=".9"/>` + glacons(300, 620, 163, 12, 9);
      // Le traîneau et la jauge de carburant
      f += `<path d="M650 120 Q648 156 678 158 L800 158 Q822 156 820 130 L812 112 L700 112 Q690 92 668 98 Q652 104 650 120Z" fill="#b3202f"/><path d="M664 108 Q676 100 690 106" stroke="#f5c542" stroke-width="3" fill="none"/>`;
      f += `<path d="M640 172 L816 172 Q836 172 836 156" stroke="#c9a35a" stroke-width="4" fill="none"/><line x1="680" y1="158" x2="680" y2="172" stroke="#c9a35a" stroke-width="3"/><line x1="790" y1="158" x2="790" y2="172" stroke="#c9a35a" stroke-width="3"/>`;
      f += `<circle cx="636" cy="62" r="26" fill="#1b2430" stroke="#8a96a3" stroke-width="3"/><path d="M616 72 A24 24 0 0 1 656 72" stroke="#3ddc84" stroke-width="3" fill="none"/><path d="M616 72 A24 24 0 0 1 621 52" stroke="#ff5a5f" stroke-width="3.5" fill="none"/>`;
      f += texte(616, 82, tr('vide'), { taille: 6, couleur: '#ff5a5f', police: MONO, gras: true }) + texte(657, 82, tr('plein'), { taille: 6, couleur: '#3ddc84', police: MONO, gras: true }) + texte(636, 100, tr('CARBURANT'), { taille: 6.5, couleur: '#ffe9b0', police: MONO, gras: true });
      // Le bidon de carburant, à côté du traîneau
      f += `<rect x="830" y="150" width="30" height="38" rx="4" fill="#d62839"/><rect x="836" y="144" width="12" height="8" rx="2" fill="#8a1a24"/>`;
      let a = '';
      // Les 6 paquets, coincés, qui tressautent
      const paquets = [[312, 26, 26, '#c0612b'], [348, 18, 18, '#1d4f86'], [376, 32, 32, '#1f6a3d'], [418, 24, 22, '#8a5a1e'], [452, 30, 28, '#9b1b30'], [492, 22, 20, '#5a1784']];
      paquets.forEach(([x, l, h, c], i) => {
        a += calque('s6-paquet' + (i % 2 ? ' impair' : ''), x, 150 - h - 2, l, h + 2, `<rect x="${x}" y="${150 - h}" width="${l}" height="${h}" fill="${c}"/><rect x="${x + l / 2 - 2}" y="${150 - h}" width="4" height="${h}" fill="#f5c542" opacity=".85"/><rect x="${x}" y="${150 - h + h / 2 - 2}" width="${l}" height="4" fill="#f5c542" opacity=".85"/>` + texte(x + l / 2, 150 - h - 3 + 1, '?', { taille: 7, couleur: '#ffe9b0', gras: true }));
      });
      a += calque('s6-aiguille', 616, 42, 40, 40, `<line x1="636" y1="62" x2="618" y2="56" stroke="#ffe9b0" stroke-width="2.2" stroke-linecap="round"/><circle cx="636" cy="62" r="3" fill="#ffe9b0"/>`);
      a += calque('s6-bulles', 836, 128, 20, 22, `<circle cx="844" cy="144" r="1.8" fill="#ffd8a0"/><circle cx="848" cy="136" r="1.4" fill="#ffd8a0"/><circle cx="843" cy="130" r="1" fill="#ffd8a0"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 712, y: 44, taille: 84, classe: 's6-kere', tailleObjet: 100,
      objet: `<path d="M4 10 Q40 20 62 40 Q80 56 94 60" stroke="#ffffff" stroke-width="3.5" fill="none"/><path d="M4 10 Q40 20 62 40 Q80 56 94 60" stroke="#ff5a5f" stroke-width="3.5" stroke-dasharray="5 5" fill="none"/>` },
  };

  /* ---- Jour 7 : par la grande fenêtre de l'Observatoire, l'avenue de 100 maisons ; le
     traîneau tourne en rond au-dessus, la radio crie « plus haut ! », « plus bas ! », et la Kère
     souffle du givre sur la vitre. ---- */
  SC[7] = {
    piece: { mur: '#1d2b4f', motif: 'bois', sol: 'parquet', elements: [null, null, null] },
    dessin(c) {
      let f = c.el('telescope', 165);
      // La grande fenêtre et l'avenue qui file à l'horizon
      f += `<rect x="326" y="30" width="248" height="142" rx="8" fill="#4a2a12"/><rect x="336" y="40" width="228" height="122" fill="url(#nuit-${c.id})"/>`;
      for (let i = 0; i < 26; i++) f += `<circle cx="${342 + ((i * 89) % 216)}" cy="${46 + ((i * 53) % 52)}" r="${i % 3 ? 0.8 : 1.3}" fill="#fff" opacity=".8"/>`;
      f += `<path d="M336 140 Q450 128 564 134 L564 162 L336 162Z" fill="#e8f2ff"/>`;
      // Les maisons, de plus en plus petites vers l'horizon
      let x = 342;
      for (let i = 0; i < 14; i++) {
        const k = Math.pow(0.86, i), l = 22 * k, hh = 16 * k, base = 146 - i * 0.6;
        f += `<rect x="${x}" y="${base - hh}" width="${l}" height="${hh}" fill="${['#8a4b2a', '#6e3b22', '#9a5a32'][i % 3]}"/><path d="M${x - 2 * k} ${base - hh} L${x + l / 2} ${base - hh - 10 * k} L${x + l + 2 * k} ${base - hh}Z" fill="#f4f9ff"/>`;
        f += `<rect x="${x + l * 0.62}" y="${base - hh - 9 * k}" width="${3.5 * k}" height="${7 * k}" fill="#5a2a1a"/><rect x="${x + l * 0.3}" y="${base - hh * 0.6}" width="${5 * k}" height="${5 * k}" fill="#ffd27a"/>`;
        x += l + 4 * k;
      }
      f += texte(352, 158, 'n° 1', { taille: 6.5, couleur: '#3a4a5a', police: MONO, gras: true }) + texte(556, 158, 'n° 100', { taille: 6.5, couleur: '#3a4a5a', police: MONO, gras: true, ancre: 'end' });
      f += `<rect x="446" y="40" width="8" height="122" fill="#4a2a12"/><rect x="336" y="96" width="228" height="6" fill="#4a2a12" opacity=".0"/>`;
      // La radio, sur un petit bureau à droite
      f += `<rect x="640" y="140" width="150" height="9" rx="3" fill="#5a3418"/><rect x="652" y="149" width="9" height="${SOL - 149}" fill="#3a2010"/><rect x="770" y="149" width="9" height="${SOL - 149}" fill="#3a2010"/>`;
      f += `<rect x="662" y="88" width="104" height="52" rx="8" fill="#6e4a2a"/><rect x="670" y="96" width="40" height="36" rx="4" fill="#3a2010"/>`;
      for (let i = 0; i < 5; i++) f += `<line x1="674" y1="${101 + i * 7}" x2="706" y2="${101 + i * 7}" stroke="#8a6a4a" stroke-width="2"/>`;
      f += `<rect x="716" y="98" width="44" height="18" rx="3" fill="#0e1a24"/><circle cx="728" cy="126" r="6" fill="#c9a35a"/><circle cx="748" cy="126" r="6" fill="#c9a35a"/><line x1="756" y1="88" x2="776" y2="54" stroke="#8a96a3" stroke-width="2.5"/><circle cx="776" cy="53" r="3" fill="#ff5a5f"/>`;
      let a = '';
      a += calque('s7-traineau', 346, 66, 40, 18, `<path d="M350 78 Q352 84 360 84 L376 84" stroke="#c9a35a" stroke-width="1.5" fill="none"/><path d="M356 70 L374 70 L372 80 L358 80Z" fill="#d62839"/><circle cx="381" cy="72" r="3" fill="#8a5a30"/><path d="M380 70 l3 -4 M382 70 l4 -3" stroke="#8a5a30" stroke-width="1"/>` + texte(365, 66, '?', { taille: 9, couleur: '#ffe27a', gras: true }));
      a += calque('s7-ondes', 776, 40, 30, 26, `<path d="M782 46 Q788 53 782 60" stroke="#ffe27a" stroke-width="1.6" fill="none"/><path d="M788 42 Q797 53 788 64" stroke="#ffe27a" stroke-width="1.6" fill="none"/>`);
      a += calque('s7-haut', 716, 98, 44, 18, texte(738, 110, tr('↑ PLUS HAUT'), { taille: 6.2, couleur: '#3ddc84', police: MONO, gras: true }));
      a += calque('s7-bas', 716, 98, 44, 18, texte(738, 110, tr('↓ PLUS BAS'), { taille: 6.2, couleur: '#ff8a5a', police: MONO, gras: true }));
      a += calque('s7-givre', 470, 44, 60, 40, `<circle cx="512" cy="56" r="9" fill="#e8f7ff" opacity=".8"/><circle cx="498" cy="64" r="11" fill="#e8f7ff" opacity=".7"/><circle cx="482" cy="74" r="10" fill="#e8f7ff" opacity=".6"/>${etincelle(490, 60, 5, '#ffffff')}`);
      return { fond: f, calques: a };
    },
    kere: { x: 520, y: 16, taille: 66, classe: 's7-kere' },
  };

  /* ---- Jour 8 : la grande carte de la tournée punaisée au mur ; la Kère y épingle un faux
     raccourci au fil rouge, et un petit traîneau le suit… ---- */
  SC[8] = {
    piece: { mur: '#6b4e2e', motif: 'rayures', sol: 'tapis', elements: ['etageres:🧭📜🗺️', null, 'horloge'] },
    dessin() {
      const N = { A: [60, 190], B: [170, 70], C: [170, 310], D: [290, 190], E: [400, 335], F: [330, 60], G: [470, 70], H: [455, 220], I: [560, 170] };
      const P = (k) => [330 + N[k][0] * 0.4, 44 + N[k][1] * 0.33];
      const routes = ['AB', 'AC', 'AD', 'BD', 'BF', 'CD', 'CE', 'DF', 'DH', 'DE', 'EH', 'FG', 'GI', 'GH', 'HI', 'EI'];
      let f = `<rect x="318" y="34" width="264" height="140" rx="4" fill="#000" opacity=".25"/><rect x="314" y="30" width="264" height="140" rx="4" fill="#f0e2bd" stroke="#8a6a3a" stroke-width="3"/>`;
      f += `<path d="M330 150 Q360 140 380 156 M520 50 Q540 60 560 52" stroke="#c9b48a" stroke-width="2" fill="none"/>`;
      routes.forEach(r => { const [x1, y1] = P(r[0]), [x2, y2] = P(r[1]); f += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8a6a3a" stroke-width="1.6"/>`; });
      // Le faux raccourci de la Kère, au fil rouge : par la Forêt et la route directe
      const faux = ['A', 'C', 'E', 'I'].map(P);
      f += `<polyline points="${faux.map(p => p.join(',')).join(' ')}" stroke="#d62839" stroke-width="2.2" stroke-dasharray="5 3" fill="none"/>`;
      const em = { A: '🎅', B: '🧊', C: '🌲', D: '🛖', E: '🦌', F: '🌬️', G: '🏔️', H: '🌉', I: '🏡' };
      Object.keys(N).forEach(k => { const [x, y] = P(k); f += `<circle cx="${x}" cy="${y}" r="7.5" fill="#fff8e6" stroke="#8a6a3a" stroke-width="1.2"/><text x="${x}" y="${y + 3.6}" font-size="9" text-anchor="middle">${em[k]}</text>`; });
      [[318, 34], [574, 34], [318, 166], [574, 166]].forEach(([x, y]) => { f += `<circle cx="${x}" cy="${y}" r="3.5" fill="#d62839"/>`; });
      // Une boussole et des cartes roulées par terre
      f += `<rect x="600" y="${SOL - 10}" width="46" height="9" rx="4" fill="#e8d7a8" transform="rotate(-8 623 ${SOL - 6})"/><rect x="606" y="${SOL - 18}" width="40" height="8" rx="4" fill="#d9c48f" transform="rotate(6 626 ${SOL - 14})"/>`;
      let a = '';
      const [ax, ay] = faux[0];
      a += calque('s8-traineau', ax - 8, ay - 5, 16, 10, `<path d="M${ax - 6} ${ay + 3} L${ax + 5} ${ay + 3} Q${ax + 8} ${ay + 3} ${ax + 8} ${ay}" stroke="#c9a35a" stroke-width="1.2" fill="none"/><path d="M${ax - 5} ${ay - 4} L${ax + 5} ${ay - 4} L${ax + 4} ${ay + 1} L${ax - 4} ${ay + 1}Z" fill="#d62839"/>`);
      const [ix, iy] = faux[3];
      a += calque('s8-epingle', ix - 6, iy - 20, 12, 22, `<line x1="${ix}" y1="${iy - 2}" x2="${ix}" y2="${iy - 14}" stroke="#555" stroke-width="1.4"/><circle cx="${ix}" cy="${iy - 15}" r="4" fill="#d62839"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 486, y: 6, taille: 66, classe: 's8-kere', main: 'g', tailleObjet: 40,
      objet: `<line x1="50" y1="40" x2="50" y2="96" stroke="#555" stroke-width="6"/><circle cx="50" cy="30" r="20" fill="#d62839"/><circle cx="44" cy="24" r="6" fill="#fff" opacity=".6"/>` },
  };

  /* ---- Jour 9 : sur le mur de glace, la banquise en petit (l'escalier de cadeaux, le traîneau) où le
     robot-lutin grimpe de marche en marche ; à droite, son programme affiché au mur. La Kère brandit
     la télécommande qu'elle a gelée. ---- */
  const S9 = { x: 318, y: 40, c: 34, l: 24 }; // la petite grille : 7 colonnes × 5 lignes
  SC[9] = {
    piece: { mur: '#7fb8dd', motif: 'glace', sol: 'glace', elements: [null, null, null] },
    dessin() {
      let f = '';
      const grille = ['..#.C..', '#..C.#.', '..C...S', '.C..#..', 'R.....#'];
      f += `<rect x="${S9.x - 8}" y="${S9.y - 8}" width="${7 * S9.c + 16}" height="${5 * S9.l + 16}" rx="6" fill="#0f2c44" opacity=".88" stroke="#e8f7ff" stroke-width="2"/>`;
      grille.forEach((ligne, j) => [...ligne].forEach((ch, i) => {
        const x = S9.x + i * S9.c, y = S9.y + j * S9.l;
        f += `<rect x="${x + 1}" y="${y + 1}" width="${S9.c - 2}" height="${S9.l - 2}" rx="3" fill="${(i + j) % 2 ? '#b9dcf3' : '#cfe9fb'}"/>`;
        if (ch === '#') f += `<rect x="${x + 7}" y="${y + 4}" width="${S9.c - 14}" height="${S9.l - 8}" rx="3" fill="#7cc6ee" stroke="#e8f7ff" stroke-width="1.2"/>`;
        if (ch === 'C') f += `<rect x="${x + 11}" y="${y + 6}" width="12" height="12" fill="#d62839"/><rect x="${x + 16}" y="${y + 6}" width="2.4" height="12" fill="#f5c542"/><rect x="${x + 11}" y="${y + 10.5}" width="12" height="2.4" fill="#f5c542"/>`;
        if (ch === 'S') f += `<path d="M${x + 6} ${y + 15} h20 q4 0 5 -4 M${x + 8} ${y + 15} v-6 h14 v6" stroke="#d62839" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      }));
      // Le programme du robot, affiché au mur
      f += `<rect x="612" y="40" width="128" height="104" rx="6" fill="#06150a" stroke="#1e5a2a" stroke-width="2"/>`;
      [tr('répéter 4'), '  ' + tr('avancer'), '  ' + tr('gauche'), '  ' + tr('avancer'), '  ' + tr('droite'), tr('fin')].forEach((l, i) => {
        f += texte(622, 58 + i * 14, l, { taille: 9, couleur: i === 0 || i === 5 ? '#f5c542' : '#7dff9b', police: MONO, ancre: 'start', extra: 'xml:space="preserve"' });
      });
      // Le robot-lutin grimpe l'escalier (calque : seul le robot bouge)
      const rx = S9.x + S9.c / 2, ry = S9.y + 4 * S9.l + S9.l / 2;
      const robot = `<g class="s9-robot"><circle cx="${rx}" cy="${ry}" r="9" fill="#f4f9ff" stroke="#2a6fb0" stroke-width="1.6"/><rect x="${rx - 5}" y="${ry - 4}" width="10" height="6" rx="2" fill="#2a6fb0"/><circle cx="${rx - 2.4}" cy="${ry - 1}" r="1.2" fill="#9fe7ff"/><circle cx="${rx + 2.4}" cy="${ry - 1}" r="1.2" fill="#9fe7ff"/><path d="M${rx} ${ry - 9} v-4" stroke="#d62839" stroke-width="1.6"/><circle cx="${rx}" cy="${ry - 14}" r="1.8" fill="#d62839"/></g>`;
      let a = calque('s9-banquise', S9.x, S9.y - 10, 7 * S9.c, 5 * S9.l + 10, robot);
      a += calque('s9-flocon f1', 250, 30, 12, 12, etincelle(256, 36, 5, '#ffffff'));
      a += calque('s9-flocon f2', 600, 26, 12, 12, etincelle(606, 32, 4, '#ffffff'));
      return { fond: f, calques: a };
    },
    kere: {
      x: 214, y: 44, taille: 72, classe: 's9-kere', main: 'd', tailleObjet: 40,
      // la télécommande du robot, prise dans un bloc de glace
      objet: '<rect x="34" y="14" width="32" height="72" rx="9" fill="#3a3f47"/><circle cx="50" cy="32" r="7" fill="#d62839"/><rect x="42" y="50" width="16" height="6" rx="2" fill="#9aa4b0"/><rect x="42" y="62" width="16" height="6" rx="2" fill="#9aa4b0"/><rect x="24" y="6" width="52" height="88" rx="12" fill="#cfeaff" opacity=".55" stroke="#ffffff" stroke-width="2"/>',
    },
  };

  /* ---- Jour 10 : le robot-cuisinier déroule son programme sur son écran, le four fume, et la
     Kère grignote les sablés en semant des miettes. ---- */
  SC[10] = {
    piece: { mur: '#c98f5a', motif: 'carreaux', sol: 'carrelage', elements: ['etageres:🍯🥫🧂', null, null] },
    dessin(c) {
      let f = c.el('four', 760);
      // Le plan de travail
      f += `<rect x="330" y="156" width="250" height="10" rx="3" fill="#e8dcc6"/><rect x="336" y="166" width="238" height="${SOL - 166}" fill="#8a5a30"/><rect x="346" y="172" width="100" height="12" rx="2" fill="#6e4120"/><rect x="464" y="172" width="100" height="12" rx="2" fill="#6e4120"/>`;
      // Le robot-cuisinier
      f += `<line x1="450" y1="36" x2="450" y2="24" stroke="#8a96a3" stroke-width="2.5"/>`;
      f += `<rect x="402" y="36" width="96" height="62" rx="10" fill="#c9d3de"/><rect x="410" y="44" width="80" height="46" rx="4" fill="#0e1a24"/>`;
      f += `<rect x="416" y="100" width="68" height="56" rx="8" fill="#aab6c4"/><rect x="426" y="108" width="48" height="16" rx="3" fill="#1b2430"/>` + texte(450, 120, tr('sablés : ?'), { taille: 7, couleur: '#ffd23f', police: MONO, gras: true });
      f += `<circle cx="436" cy="138" r="5" fill="#ff5a5f"/><circle cx="452" cy="138" r="5" fill="#ffd23f"/><circle cx="468" cy="138" r="5" fill="#3ddc84"/>`;
      // Les bras et la plaque de sablés
      f += `<path d="M416 110 Q396 122 388 140" stroke="#8a96a3" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M484 110 Q504 122 512 140" stroke="#8a96a3" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      f += `<rect x="372" y="140" width="156" height="7" rx="2" fill="#5d6873"/>`;
      for (let i = 0; i < 7; i++) f += `<ellipse cx="${384 + i * 22}" cy="138" rx="8" ry="3.6" fill="#e0a95a"/><circle cx="${382 + i * 22}" cy="137" r="1" fill="#7a4a1a"/>`;
      let a = '';
      const lignesCode = [tr('sablés ← 3'), tr('RÉPÈTE 5 FOIS :'), tr('  sablés ← × 2'), tr('  SI sablés > 20 :'), tr('    sablés ← − 10'), tr('AFFICHER sablés'), '']; // (7 lignes : le défilement avance de 7 × 7)
      const bloc = (dy) => lignesCode.map((l, i) => texte(414, 52 + dy + i * 7, l, { taille: 5.2, couleur: '#3dff7a', police: MONO, ancre: 'start', extra: 'xml:space="preserve"' })).join('');
      a += calque('s10-code clip', 410, 44, 80, 46, `<g class="s10-defile">${bloc(0)}${bloc(49)}</g>`);
      a += calque('s10-antenne', 445, 18, 10, 10, `<circle cx="450" cy="23" r="3.5" fill="#ff5a5f"/>`);
      a += calque('s10-vapeur', 730, 70, 60, 40, `<circle cx="748" cy="100" r="7" fill="#fff" opacity=".55"/><circle cx="762" cy="88" r="9" fill="#fff" opacity=".45"/><circle cx="776" cy="78" r="7" fill="#fff" opacity=".35"/>`);
      a += calque('s10-miettes', 586, 116, 24, 40, `<circle cx="594" cy="122" r="1.6" fill="#e0a95a"/><circle cx="600" cy="128" r="1.3" fill="#e0a95a"/><circle cx="592" cy="134" r="1.1" fill="#e0a95a"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 540, y: 60, taille: 70, classe: 's10-kere', main: 'g', tailleObjet: 40,
      objet: `<circle cx="50" cy="50" r="40" fill="#e0a95a"/><circle cx="50" cy="50" r="40" fill="none" stroke="#b07a3a" stroke-width="4"/><path d="M78 22 A40 40 0 0 1 90 50 L70 46 L76 34Z" fill="#c98f5a"/><circle cx="38" cy="40" r="5" fill="#7a4a1a"/><circle cx="58" cy="62" r="5" fill="#7a4a1a"/><circle cx="34" cy="64" r="4" fill="#7a4a1a"/>` },
  };

  /* ---- Jour 11 : la pile de crêpes sur l'assiette, le petit tapis roulant (la file) vers les
     invités ; la Kère chipe la crêpe du dessus. ---- */
  SC[11] = {
    piece: { mur: '#7b1e2b', motif: 'papier', sol: 'parquet', elements: ['fenetre', null, 'horloge'] },
    dessin() {
      let f = '';
      // La table et sa nappe
      f += `<rect x="300" y="148" width="350" height="10" rx="3" fill="#f4f0e6"/><path d="M300 158 L650 158 L650 176 ${Array.from({ length: 14 }, (_, i) => `Q${650 - (i + 0.5) * 25} 184 ${650 - (i + 1) * 25} 176`).join(' ')} Z" fill="#b3202f"/><rect x="316" y="176" width="10" height="${SOL - 176}" fill="#5a3418"/><rect x="624" y="176" width="10" height="${SOL - 176}" fill="#5a3418"/>`;
      // L'assiette et sa pile de crêpes
      f += `<ellipse cx="370" cy="146" rx="40" ry="6" fill="#e9eef5"/><ellipse cx="370" cy="145" rx="30" ry="4" fill="#cfd8e3"/>`;
      for (let i = 0; i < 5; i++) f += `<ellipse cx="370" cy="${140 - i * 6}" rx="${28 - i}" ry="5" fill="#e6b468" stroke="#b9823a" stroke-width="1"/>`;
      f += `<path d="M352 114 Q370 108 388 114" stroke="#5a2e10" stroke-width="2.4" fill="none"/>`;
      f += texte(370, 100, tr('PILE'), { taille: 7, couleur: '#ffe9b0', police: MONO, gras: true });
      // Le tapis roulant (la file) qui va vers les invités
      f += `<rect x="420" y="138" width="200" height="9" rx="4.5" fill="#2a2f36"/>`;
      for (let x = 426; x < 618; x += 14) f += `<circle cx="${x}" cy="142.5" r="3" fill="#59616b"/>`;
      f += texte(520, 128, tr('FILE →'), { taille: 7, couleur: '#ffe9b0', police: MONO, gras: true });
      // Au bout du tapis : la place de l'invité, couverts dressés
      f += `<ellipse cx="626" cy="146" rx="20" ry="4" fill="#e9eef5"/><path d="M604 130 L604 148 M600 130 L600 136 Q604 140 608 136 L608 130" stroke="#c9cfd6" stroke-width="1.5" fill="none"/>`;
      // Des bougies sur la table
      f += `<rect x="460" y="112" width="6" height="22" fill="#f4ead2"/><rect x="560" y="116" width="6" height="18" fill="#f4ead2"/>`;
      let a = '';
      const crepe = (x, lettre) => `<ellipse cx="${x}" cy="135" rx="11" ry="2.6" fill="#e9eef5"/><ellipse cx="${x}" cy="132" rx="9" ry="3" fill="#e6b468" stroke="#b9823a" stroke-width=".8"/>` + texte(x, 133.5, lettre, { taille: 4.5, couleur: '#5a2e10', gras: true });
      a += calque('s11-tapis', 420, 124, 200, 14, `<g class="s11-defile">${crepe(436, '•')}${crepe(486, '•')}${crepe(536, '•')}</g>`);
      a += calque('s11-flamme f1', 458, 102, 10, 12, `<path d="M463 104 Q467 109 463 113 Q459 109 463 104Z" fill="#ffcf5a"/>`);
      a += calque('s11-flamme f2', 558, 106, 10, 12, `<path d="M563 108 Q567 113 563 117 Q559 113 563 108Z" fill="#ffcf5a"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 312, y: 26, taille: 70, classe: 's11-kere', tailleObjet: 46,
      objet: `<ellipse cx="50" cy="56" rx="44" ry="18" fill="#e6b468" stroke="#b9823a" stroke-width="3"/><path d="M80 44 A44 18 0 0 1 94 56 L76 54Z" fill="#c98f5a"/><text x="48" y="64" font-size="22" font-weight="700" text-anchor="middle" fill="#5a2e10" font-family="Georgia, serif">K</text>` },
  };

  /* ---- Jour 12 : la Cabine Radio ; le poste bipe (ondes de l'antenne, voyant), l'affiche du code
     Morse au mur, la bande de papier imprime les bips, et la Kère brandit le micro qu'elle a gelé. ---- */
  SC[12] = {
    piece: { mur: '#1d3b2a', motif: 'bois', sol: 'parquet', elements: ['fenetre', null, null] },
    dessin() {
      let f = '';
      // Le bureau et le poste radio, à gauche
      f += `<rect x="236" y="150" width="140" height="8" rx="3" fill="#5a3418"/><rect x="246" y="158" width="8" height="${SOL - 158}" fill="#3a2010"/><rect x="358" y="158" width="8" height="${SOL - 158}" fill="#3a2010"/>`;
      f += `<rect x="252" y="108" width="104" height="42" rx="6" fill="#6b4a2b" stroke="#3a2010" stroke-width="2"/><rect x="260" y="116" width="44" height="26" rx="3" fill="#2a1a0e"/>`;
      for (let y = 119; y < 141; y += 4) f += `<line x1="263" y1="${y}" x2="301" y2="${y}" stroke="#7a5a3a" stroke-width="1.4"/>`;
      f += `<circle cx="320" cy="124" r="7" fill="#c9a35a" stroke="#5a3a1e" stroke-width="1.2"/><line x1="320" y1="124" x2="324" y2="119" stroke="#3a2010" stroke-width="1.5"/><circle cx="340" cy="124" r="5" fill="#c9a35a" stroke="#5a3a1e" stroke-width="1.2"/>`;
      f += `<rect x="314" y="134" width="34" height="8" rx="2" fill="#f5e6b0"/><line x1="330" y1="134" x2="330" y2="142" stroke="#d62839" stroke-width="1.5"/>`;
      // L'antenne
      f += `<line x1="344" y1="108" x2="362" y2="46" stroke="#9aa5b1" stroke-width="2.5"/><circle cx="362" cy="45" r="3" fill="#d62839"/>`;
      // L'affiche du code Morse, au centre
      f += papier(404, 46, 92, 92, 0);
      f += texte(450, 62, tr('CODE MORSE'), { taille: 8, couleur: '#5a2e10', police: MONO, gras: true });
      ['A •—', 'E •', 'O ———', 'S •••', 'T —'].forEach((l, i) => { f += texte(450, 78 + i * 11, l, { taille: 8, couleur: '#1d3b2a', police: MONO, gras: true }); });
      f += texte(450, 133, '…', { taille: 8, couleur: '#5a2e10', police: MONO });
      f += clou(450, 49);
      // Les bips imprimés par le poste sur une bande de papier
      f += `<path d="M356 146 Q370 152 384 148 L560 148 L560 162 L384 162 Q370 166 356 158 Z" fill="#fff8e6" stroke="#c9b48a" stroke-width="1"/>`;
      f += texte(472, 158, '•—•  ••—  —••  ———  •—••  …', { taille: 7.5, couleur: '#3a2508', police: MONO, gras: true });
      let a = '';
      // Les ondes de l'antenne et le voyant du poste
      const onde = (r, k) => `<path class="onde o${k}" d="M${362 - r} ${45 - r * 0.6} A${r} ${r} 0 0 1 ${362 + r} ${45 - r * 0.6}" stroke="#7fe0a8" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      a += calque('s12-ondes', 336, 14, 52, 34, onde(8, 1) + onde(15, 2) + onde(22, 3));
      a += calque('s12-voyant', 345, 133, 10, 10, `<circle cx="350" cy="138" r="3" fill="#3ddc84"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 566, y: 66, taille: 70, classe: 's12-kere', main: 'g', tailleObjet: 46,
      // Le micro de la radio, pris dans un bloc de glace : elle le brandit en ricanant
      objet: `<rect x="40" y="22" width="20" height="34" rx="10" fill="#3a4250" stroke="#1b2430" stroke-width="2"/><line x1="43" y1="31" x2="57" y2="31" stroke="#8a96a3" stroke-width="1.5"/><line x1="42" y1="38" x2="58" y2="38" stroke="#8a96a3" stroke-width="1.5"/><line x1="43" y1="45" x2="57" y2="45" stroke="#8a96a3" stroke-width="1.5"/>` +
        `<path d="M35 44 Q35 64 50 64 Q65 64 65 44" stroke="#5a6470" stroke-width="3" fill="none"/><rect x="48" y="64" width="4" height="12" fill="#5a6470"/><rect x="39" y="76" width="22" height="4" rx="2" fill="#5a6470"/>` +
        `<rect x="22" y="12" width="56" height="74" rx="9" fill="#bfe6ff" fill-opacity=".5" stroke="#e8f6ff" stroke-width="3"/><path d="M29 22 L38 17 M29 30 L33 28" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>` },
  };

  /* ---- Jour 13 : trois cadeaux et leurs étiquettes sur le comptoir ; la caisse refuse un code,
     le laser du scanner balaie, et la Kère trafique une étiquette au feutre. ---- */
  SC[13] = {
    piece: { mur: '#5a1784', motif: 'rayures', sol: 'carrelage', elements: ['etageres:🧸🚂🪀', null, 'etageres:🎁🎲🪁'] },
    dessin() {
      let f = '';
      // Le comptoir
      f += `<rect x="300" y="146" width="300" height="12" rx="3" fill="#8a5a30"/><rect x="310" y="158" width="280" height="${SOL - 158}" fill="#6b3f1f"/><path d="M310 168 Q450 186 590 168" stroke="#1d5a32" stroke-width="5" fill="none"/>`;
      // Trois cadeaux, chacun avec son étiquette à code-barres
      const cadeau = (x, l, h, c, ruban) => {
        let s = `<rect x="${x}" y="${146 - h}" width="${l}" height="${h}" fill="${c}"/><rect x="${x + l / 2 - 3}" y="${146 - h}" width="6" height="${h}" fill="${ruban}"/><path d="M${x + l / 2} ${146 - h} q-10 -10 -14 -2 q4 6 14 2 q10 -10 14 -2 q-4 6 -14 2" fill="${ruban}"/>`;
        s += `<rect x="${x + 6}" y="${146 - h * 0.62}" width="${l - 12}" height="${h * 0.36}" fill="#fff"/>`;
        for (let i = 0; i < 12; i++) s += `<rect x="${x + 9 + i * ((l - 18) / 12)}" y="${146 - h * 0.58}" width="${i % 3 ? 1.2 : 2}" height="${h * 0.22}" fill="#111"/>`;
        return s;
      };
      f += cadeau(320, 56, 46, '#1d4f86', '#f5c542') + cadeau(392, 52, 40, '#1f6a3d', '#d62839') + cadeau(462, 60, 52, '#9b1b30', '#f5c542');
      // La caisse enregistreuse
      f += `<rect x="534" y="110" width="58" height="36" rx="5" fill="#3a4250"/><rect x="540" y="100" width="46" height="16" rx="3" fill="#0e1a24"/>`;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) f += `<rect x="${542 + i * 15}" y="${122 + j * 10}" width="11" height="7" rx="1.5" fill="#8a96a3"/>`;
      let a = '';
      a += calque('s13-ecran', 540, 100, 46, 16, texte(563, 112, tr('BIP ✗'), { taille: 9, couleur: '#ff5a5f', police: MONO, gras: true }));
      a += calque('s13-laser', 312, 92, 214, 6, `<rect x="314" y="94" width="210" height="2" fill="#ff2a2a" opacity=".85"/>`);
      a += calque('s13-scanner', 296, 80, 24, 26, `<path d="M300 84 L316 84 L318 96 L308 104 L302 104Z" fill="#2a2f36"/><rect x="314" y="92" width="6" height="6" fill="#ff5a5f"/>`);
      a += calque('s13-gribouille', 470, 112, 44, 14, `<path d="M474 120 q4 -6 8 0 t8 0 t8 0 t8 0 t8 0" stroke="#1d4fd6" stroke-width="2" fill="none"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 500, y: 34, taille: 70, classe: 's13-kere', main: 'g', tailleObjet: 40,
      objet: `<rect x="30" y="10" width="20" height="70" rx="6" fill="#1d4fd6" transform="rotate(25 40 45)"/><path d="M30 78 L40 96 L50 78Z" fill="#111" transform="rotate(25 40 45)"/>` },
  };

  /* ---- Jour 14 : la tempête de paquets au Centre de Tri : ils tombent pêle-mêle, la Kère jongle
     avec ; l'écran du tri attend le bon ordre. ---- */
  SC[14] = {
    piece: { mur: '#2f4a2a', motif: 'metal', sol: 'metal', elements: [null, null, 'caisses'] },
    dessin(c) {
      let f = c.el('ecran', 160);
      // Le grand bac de tri et ses casiers numérotés en binaire
      f += `<rect x="330" y="110" width="240" height="${SOL - 110}" rx="4" fill="#3d4a58"/>`;
      ['001', '010', '011', '100', '101', '110'].forEach((n, i) => { const x = 338 + i * 38; f += `<rect x="${x}" y="122" width="32" height="34" rx="2" fill="#1b2430"/>` + texte(x + 16, 168, n, { taille: 6.5, couleur: '#cfe8ff', police: MONO, gras: true }); });
      f += `<rect x="330" y="104" width="240" height="8" rx="3" fill="#59616b"/>`;
      // Un paquet déchiré par terre, des flocons de tempête
      f += `<path d="M600 ${SOL - 2} l14 -16 l10 6 l8 -8 l12 18 z" fill="#c9a35a"/><path d="M612 ${SOL - 10} l6 -4 4 6" stroke="#5a3a1e" stroke-width="1" fill="none"/>`;
      let a = '';
      const paquet = (x, y, n, rot = 0, dechire = false) => `<g transform="rotate(${rot} ${x + 13} ${y + 9})"><rect x="${x}" y="${y}" width="26" height="18" rx="2" fill="${dechire ? '#a8885a' : '#e8d7a8'}"/><path d="M${x} ${y} l13 9 13 -9" stroke="#b39a6a" stroke-width="1" fill="none"/>` + texte(x + 13, y + 15.5, n, { taille: 5.2, couleur: '#3a2a10', police: MONO, gras: true }) + (dechire ? `<path d="M${x + 18} ${y} l4 6 -3 4 5 8" stroke="#2f4a2a" stroke-width="2" fill="none"/>` : '') + '</g>';
      a += calque('s14-chute c1', 360, 26, 30, 24, paquet(362, 28, '011', -10));
      a += calque('s14-chute c2', 420, 20, 30, 24, paquet(422, 22, '101', 12));
      a += calque('s14-chute c3', 486, 30, 30, 24, paquet(488, 32, '110', -6));
      a += calque('s14-chute c4', 536, 24, 30, 24, paquet(538, 26, '010', 8));
      a += calque('s14-neige', 330, 30, 240, 70, Array.from({ length: 10 }, (_, i) => `<circle cx="${338 + i * 23}" cy="${40 + (i * 37) % 50}" r="1.6" fill="#fff" opacity=".85"/>`).join(''));
      return { fond: f, calques: a };
    },
    kere: { x: 250, y: 50, taille: 72, classe: 's14-kere', tailleObjet: 46,
      objet: `<g><rect x="20" y="10" width="44" height="30" rx="3" fill="#e8d7a8"/><path d="M20 10 l22 15 22 -15" stroke="#b39a6a" stroke-width="2" fill="none"/></g>` },
  };

  /* ---- Jour 15 : le robot trieur d'étiquettes et sa déchiqueteuse ; les cadeaux défilent, le voyant
     passe du vert au rouge, et la Kère nourrit la machine en confettis. ---- */
  SC[15] = {
    piece: { mur: '#8a1538', motif: 'rayures', sol: 'parquet', elements: ['etageres:🎀🎁🧶', null, null] },
    dessin() {
      let f = '';
      // Le tapis roulant
      f += `<rect x="300" y="146" width="250" height="10" rx="5" fill="#2a2f36"/>`;
      for (let x = 308; x < 548; x += 16) f += `<circle cx="${x}" cy="151" r="3.4" fill="#59616b"/>`;
      f += `<rect x="310" y="156" width="8" height="${SOL - 156}" fill="#1b1f24"/><rect x="532" y="156" width="8" height="${SOL - 156}" fill="#1b1f24"/>`;
      // Le robot trieur, en arche au-dessus du tapis
      f += `<rect x="404" y="56" width="92" height="22" rx="6" fill="#aab6c4"/><rect x="408" y="78" width="10" height="68" fill="#8a96a3"/><rect x="482" y="78" width="10" height="68" fill="#8a96a3"/>`;
      f += `<rect x="414" y="60" width="72" height="14" rx="3" fill="#0e1a24"/>` + texte(450, 70.5, '^[A-Z][a-z]+-…$', { taille: 6.2, couleur: '#3dff7a', police: MONO });
      f += `<circle cx="450" cy="90" r="7" fill="#1b2430"/>`;
      // La déchiqueteuse, à droite
      f += `<rect x="580" y="112" width="70" height="${SOL - 112}" rx="5" fill="#5d6873"/><rect x="574" y="104" width="82" height="12" rx="3" fill="#3a4250"/><rect x="590" y="108" width="50" height="4" fill="#111"/>`;
      f += texte(615, 140, tr('DÉCHIQUETEUSE'), { taille: 5.6, couleur: '#ffe9b0', police: MONO, gras: true });
      f += `<path d="M590 ${SOL} l6 -10 4 6 5 -9 4 8 6 -6 5 11z" fill="#f5c542" opacity=".8"/>`;
      let a = '';
      const colis = (x, c) => `<rect x="${x}" y="128" width="22" height="18" fill="${c}"/><rect x="${x + 9}" y="128" width="4" height="18" fill="#f5c542"/><rect x="${x + 3}" y="133" width="16" height="6" fill="#fff"/>`;
      a += calque('s15-tapis', 300, 126, 250, 22, `<g class="s15-defile">${colis(310, '#1d4f86')}${colis(370, '#1f6a3d')}${colis(430, '#9b1b30')}${colis(490, '#5a1784')}</g>`);
      a += calque('s15-vert', 443, 83, 14, 14, `<circle cx="450" cy="90" r="5.5" fill="#3ddc84"/>`);
      a += calque('s15-rouge', 443, 83, 14, 14, `<circle cx="450" cy="90" r="5.5" fill="#ff5a5f"/>`);
      a += calque('s15-confettis', 584, 72, 60, 40, `<rect x="596" y="96" width="4" height="7" fill="#f5c542"/><rect x="610" y="88" width="4" height="7" fill="#ff5a5f"/><rect x="624" y="94" width="4" height="7" fill="#4aa3ff"/><rect x="604" y="80" width="4" height="7" fill="#3ddc84"/><rect x="630" y="82" width="4" height="7" fill="#fff"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 590, y: 20, taille: 70, classe: 's15-kere', main: 'g', tailleObjet: 40,
      objet: `<rect x="16" y="24" width="64" height="40" rx="4" fill="#fff" transform="rotate(-12 48 44)"/><rect x="24" y="34" width="40" height="6" fill="#999" transform="rotate(-12 48 44)"/><rect x="24" y="46" width="28" height="6" fill="#999" transform="rotate(-12 48 44)"/>` },
  };

  /* ---- Jour 16 : l'affiche « Bientôt au cinéma » du Studio ; la couronne de glace et les yeux rouges
     de l'idole se peignent pixel par pixel (le titre reste secret), le code en couleurs défile sur la
     bande de film, le flash crépite, et la Kère attend la séance avec son pop-corn. ---- */
  SC[16] = {
    piece: { mur: '#2f3d44', motif: 'uni', sol: 'parquet', elements: [null, null, 'photos'] },
    dessin() {
      let f = '';
      // L'appareil photo sur son trépied
      f += `<line x1="196" y1="120" x2="176" y2="${SOL}" stroke="#222" stroke-width="3"/><line x1="196" y1="120" x2="216" y2="${SOL}" stroke="#222" stroke-width="3"/><line x1="196" y1="120" x2="196" y2="${SOL}" stroke="#222" stroke-width="3"/>`;
      f += `<rect x="172" y="96" width="50" height="30" rx="5" fill="#2a2f36"/><circle cx="197" cy="111" r="10" fill="#111"/><circle cx="197" cy="111" r="6" fill="#3a5a8a"/><rect x="178" y="90" width="14" height="7" rx="2" fill="#c9cfd6"/>`;
      // L'affiche en pixels, accrochée au mur : 9 × 12 cases, sous la guirlande (y < 44 est caché par elle)
      const NX = 9, NY = 12, T = 6.5, X0 = 450 - NX * T / 2, Y0 = 58;
      f += `<rect x="${X0 - 5}" y="44" width="${NX * T + 10}" height="${Y0 - 44 + NY * T + 4}" rx="3" fill="#1b2430"/><rect x="${X0}" y="${Y0}" width="${NX * T}" height="${NY * T}" fill="#ffffff"/>`;
      f += texte(450, 54, tr('BIENTÔT AU CINÉMA'), { taille: 5.6, couleur: '#ffd23f', police: MONO, gras: true });
      for (let i = 1; i < NX; i++) f += `<line x1="${X0 + i * T}" y1="${Y0}" x2="${X0 + i * T}" y2="${Y0 + NY * T}" stroke="#d5dbe2" stroke-width=".5"/>`;
      for (let j = 1; j < NY; j++) f += `<line x1="${X0}" y1="${Y0 + j * T}" x2="${X0 + NX * T}" y2="${Y0 + j * T}" stroke="#d5dbe2" stroke-width=".5"/>`;
      // La bande de film avec le code en couleurs
      f += `<rect x="330" y="146" width="240" height="18" fill="#111"/>`;
      for (let x = 334; x < 568; x += 10) f += `<rect x="${x}" y="148" width="5" height="3" fill="#555"/><rect x="${x}" y="159" width="5" height="3" fill="#555"/>`;
      f += texte(450, 158.5, tr('7B 1G 7B · 3B 1G 3B …'), { taille: 7.5, couleur: '#ffe9b0', police: MONO, gras: true });
      let a = '';
      // La couronne de glace, puis les yeux rouges, se peignent un à un (le titre de l'affiche reste secret)
      const couronne = [[4, 0], [1, 1], [4, 1], [7, 1], [1, 2], [3, 2], [4, 2], [5, 2], [7, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]];
      const yeux = [[2, 6], [3, 6], [5, 6], [6, 6]];
      const px = ([i, j], k, c) => `<rect class="px" style="animation-delay:${(k * 0.16).toFixed(2)}s" x="${X0 + i * T + 0.4}" y="${Y0 + j * T + 0.4}" width="${T - 0.8}" height="${T - 0.8}" fill="${c}"/>`;
      a += calque('s16-pixels', X0, Y0, NX * T, NY * T, couronne.map((p, k) => px(p, k, '#8fd3fb')).join('') + yeux.map((p, k) => px(p, couronne.length + k, '#d62839')).join(''));
      a += calque('s16-flash', 150, 70, 60, 60, `<circle cx="185" cy="93" r="22" fill="#fffbe0" opacity=".7"/>${etincelle(185, 93, 14, '#ffffff')}`);
      // Le pop-corn qui saute du seau de la Kère
      const grain = (x, y) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff3c4"/><circle cx="${x + 2.6}" cy="${y - 1.6}" r="2.6" fill="#fff8de"/><circle cx="${x - 2.2}" cy="${y - 1.8}" r="2.2" fill="#ffe9a0"/>`;
      a += calque('s16-mais m1', 540, 92, 14, 14, grain(547, 100));
      a += calque('s16-mais m2', 552, 86, 14, 14, grain(559, 94));
      return { fond: f, calques: a };
    },
    kere: { x: 560, y: 70, taille: 70, classe: 's16-kere', main: 'g', tailleObjet: 40,
      objet: `<path d="M24 42 H76 L68 96 H32 Z" fill="#ffffff" stroke="#b81d2c" stroke-width="2"/><path d="M36 42 H45 L44 96 H38 Z M55 42 H64 L62 96 H56 Z" fill="#d62839"/>` +
        `<g fill="#fff3c4" stroke="#e8b923" stroke-width="1.5"><circle cx="30" cy="40" r="8"/><circle cx="43" cy="36" r="9"/><circle cx="57" cy="37" r="9"/><circle cx="70" cy="40" r="8"/><circle cx="37" cy="28" r="7"/><circle cx="52" cy="25" r="8"/><circle cx="64" cy="29" r="7"/></g>` },
  };

  /* ---- Jour 17 : la Bibliothèque ; le gros registre de la LISTE et celui des CADEAUX, l'ordinateur et
     sa requête ; la Kère fait voler les fiches du fichier. ---- */
  SC[17] = {
    piece: { mur: '#3e2723', motif: 'bois', sol: 'tapis', elements: ['etageres:livres', null, 'etageres:livres'] },
    dessin() {
      let f = '';
      // Le bureau et l'ordinateur
      f += `<rect x="330" y="150" width="240" height="10" rx="3" fill="#5a3418"/><rect x="342" y="160" width="12" height="${SOL - 160}" fill="#3a2010"/><rect x="546" y="160" width="12" height="${SOL - 160}" fill="#3a2010"/>`;
      f += `<rect x="404" y="58" width="92" height="66" rx="6" fill="#1a1f26" stroke="#3a4250" stroke-width="3"/><rect x="410" y="64" width="80" height="54" rx="2" fill="#03140a"/>`;
      [['SELECT cadeau', '#4aa3ff'], ['FROM liste', '#4aa3ff'], ["WHERE sage = 'oui'", '#ffd23f'], ['ORDER BY prix', '#4aa3ff'], ['  DESC;', '#4aa3ff']].forEach(([l, c], i) => { f += texte(414, 74 + i * 9.5, tr(l), { taille: 6, couleur: c, police: MONO, ancre: 'start' }); });
      f += `<rect x="440" y="124" width="20" height="18" fill="#3a4250"/><rect x="420" y="142" width="60" height="8" rx="3" fill="#3a4250"/>`;
      // Les deux registres
      const registre = (x, c, titre) => `<rect x="${x}" y="106" width="46" height="44" rx="3" fill="${c}"/><rect x="${x + 4}" y="110" width="38" height="36" rx="2" fill="none" stroke="#f5c542" stroke-width="1.2"/>` + texte(x + 23, 131, titre, { taille: 6, couleur: '#ffe9b0', police: MONO, gras: true });
      f += registre(340, '#1d4f86', tr('LISTE')) + registre(514, '#9b1b30', tr('CADEAUX'));
      // Le meuble à fiches, ouvert
      f += `<rect x="590" y="132" width="50" height="${SOL - 132}" fill="#6e4120"/><rect x="596" y="138" width="38" height="14" rx="2" fill="#8a5a30"/><rect x="596" y="158" width="38" height="14" rx="2" fill="#8a5a30"/><circle cx="615" cy="145" r="2" fill="#c9a35a"/><circle cx="615" cy="165" r="2" fill="#c9a35a"/>`;
      let a = '';
      const fiche = (x, y, r) => `<g transform="rotate(${r} ${x + 9} ${y + 6})"><rect x="${x}" y="${y}" width="18" height="12" fill="#fff8e6"/><line x1="${x + 2}" y1="${y + 4}" x2="${x + 15}" y2="${y + 4}" stroke="#8a7a5a" stroke-width="1"/><line x1="${x + 2}" y1="${y + 8}" x2="${x + 11}" y2="${y + 8}" stroke="#8a7a5a" stroke-width="1"/></g>`;
      a += calque('s17-fiche f1', 600, 112, 22, 16, fiche(602, 114, -10));
      a += calque('s17-fiche f2', 612, 108, 22, 16, fiche(614, 110, 14));
      a += calque('s17-fiche f3', 624, 114, 22, 16, fiche(626, 116, -4));
      a += calque('s17-curseur', 480, 107, 8, 8, `<rect x="482" y="108" width="5" height="6" fill="#3dff7a"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 590, y: 50, taille: 66, classe: 's17-kere' },
  };

  /* ---- Jour 18 : l'Infirmerie des Jouets ; le robot de chargement allongé sur la table d'examen,
     son écran de code, une loupe qui inspecte, un canard en plastique… et la Kère, le bug, qui se cache
     dans la trappe du robot. Un papillon de nuit voltige (le tout premier bug, en 1947). ---- */
  SC[18] = {
    piece: { mur: '#d9ecef', motif: 'carreaux', sol: 'carrelage', elements: ['pharmacie', null, null] },
    dessin() {
      let f = '';
      // La table d'examen et le robot allongé
      f += `<rect x="330" y="150" width="250" height="10" rx="3" fill="#e8eef2"/><rect x="342" y="160" width="10" height="${SOL - 160}" fill="#8a96a3"/><rect x="558" y="160" width="10" height="${SOL - 160}" fill="#8a96a3"/>`;
      f += `<rect x="360" y="116" width="150" height="34" rx="10" fill="#aab6c4"/><rect x="512" y="120" width="40" height="28" rx="8" fill="#c9d3de"/><circle cx="526" cy="132" r="4" fill="#4aa3ff"/><circle cx="540" cy="132" r="4" fill="#4aa3ff"/><path d="M524 142 q9 4 18 0" stroke="#3a4250" stroke-width="2" fill="none"/>`;
      f += `<rect x="410" y="122" width="40" height="22" rx="3" fill="#3a4250"/>`; // la trappe ouverte
      f += `<rect x="350" y="124" width="12" height="20" rx="4" fill="#8a96a3"/><rect x="380" y="146" width="10" height="6" fill="#8a96a3"/><rect x="480" y="146" width="10" height="6" fill="#8a96a3"/>`;
      // L'écran de code au mur (8 lignes, sans dire laquelle est fautive)
      f += `<rect x="430" y="30" width="120" height="74" rx="6" fill="#1a1f26" stroke="#3a4250" stroke-width="3"/><rect x="436" y="36" width="108" height="62" rx="2" fill="#03140a"/>`;
      for (let i = 0; i < 8; i++) f += `<rect x="${442 + (i % 4 === 0 ? 0 : i % 2 ? 8 : 16)}" y="${41 + i * 7}" width="${30 + ((i * 29) % 50)}" height="3.4" rx="1.5" fill="#3dff7a" opacity=".75"/>`;
      // Le canard en plastique sur la table
      let a = '';
      a += calque('s18-loupe', 360, 60, 40, 40, `<circle cx="376" cy="76" r="12" fill="#cfefff" opacity=".35" stroke="#5a3a1e" stroke-width="3.5"/><line x1="385" y1="85" x2="396" y2="96" stroke="#5a3a1e" stroke-width="4" stroke-linecap="round"/>`);
      a += calque('s18-papillon', 600, 40, 20, 16, `<path d="M610 48 q-9 -10 -9 0 q0 6 9 0 q9 -10 9 0 q0 6 -9 0" fill="#7a6a5a"/><line x1="610" y1="44" x2="610" y2="52" stroke="#3a2a1a" stroke-width="1.5"/>`);
      a += calque('s18-canard', 552, 126, 36, 26, `<ellipse cx="566" cy="145" rx="12" ry="7" fill="#ffd23f"/><circle cx="574" cy="134" r="6" fill="#ffd23f"/><path d="M579 134 l6 1 -6 2z" fill="#f08a24"/><circle cx="575" cy="132" r="1.2" fill="#111"/>`);
      a += calque('s18-ligne', 436, 62, 108, 6, `<rect x="438" y="62.5" width="104" height="5" fill="#ff5a5f" opacity=".35"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 404, y: 84, taille: 52, classe: 's18-kere' },
  };

  /* ---- Jour 19 : la porte du coffre aux cadeaux, et le vieil ordinateur des lutins qui essaie les
     mots de passe un par un (la force brute… qui n'aboutira jamais) ; la Kère tape comme une forcenée. ---- */
  SC[19] = {
    piece: { mur: '#263238', motif: 'metal', sol: 'metal', elements: ['casiers', null, null] },
    dessin() {
      let f = '';
      // La porte du coffre
      f += `<circle cx="420" cy="104" r="72" fill="#3a4250"/><circle cx="420" cy="104" r="62" fill="#5d6873"/><circle cx="420" cy="104" r="24" fill="#3a4250"/>`;
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; f += `<line x1="${420 + 26 * Math.cos(a)}" y1="${104 + 26 * Math.sin(a)}" x2="${420 + 40 * Math.cos(a)}" y2="${104 + 40 * Math.sin(a)}" stroke="#aab6c4" stroke-width="5" stroke-linecap="round"/>`; }
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; f += `<circle cx="${420 + 54 * Math.cos(a)}" cy="${104 + 54 * Math.sin(a)}" r="3" fill="#8a96a3"/>`; }
      f += texte(420, 108, '🎁', { taille: 16 });
      // L'ordinateur de glace, sur un bloc de glace
      f += `<rect x="520" y="140" width="110" height="${SOL - 140}" rx="4" fill="#bfe6ff" opacity=".85"/><path d="M526 150 l30 0 M580 166 l40 0" stroke="#fff" stroke-width="3" opacity=".7"/>`;
      f += `<rect x="524" y="58" width="102" height="72" rx="6" fill="#a9dcff" opacity=".9"/><rect x="532" y="66" width="86" height="56" rx="3" fill="#06121c"/>`;
      f += `<rect x="560" y="130" width="30" height="10" fill="#a9dcff"/><rect x="534" y="132" width="82" height="8" rx="3" fill="#d6f1ff"/>`;
      f += texte(575, 54, tr('1 000 essais / s'), { taille: 6.5, couleur: '#cfefff', police: MONO, gras: true });
      let a = '';
      const essais = ['aaaaaa', 'aaaaab', 'azerty', '123456', 'noel24', 'sapin!', 'Rudolf9', 'mdp2026', 'motdepasse', 'hohoho', 'qwerty'];
      const bloc = (dy) => essais.map((e, i) => texte(538, 76 + dy + i * 7, e + ' ✗', { taille: 5.6, couleur: '#ff6b6b', police: MONO, ancre: 'start' })).join('');
      a += calque('s19-essais clip', 532, 66, 86, 56, `<g class="s19-defile">${bloc(0)}${bloc(77)}</g>`);
      a += calque('s19-voyant', 412, 32, 16, 10, `<rect x="414" y="34" width="12" height="6" rx="2" fill="#ff5a5f"/>`);
      return { fond: f, calques: a };
    },
    kere: { x: 548, y: 108, taille: 56, classe: 's19-kere' },
  };

  /* ---- Jour 20 : le bureau du Père Noël : la lettre de Léa, cachetée d'un sceau douteux, et le
     registre des empreintes ; la Kère tamponne une fausse lettre. ---- */
  SC[20] = {
    piece: { mur: '#4a1c1c', motif: 'papier', sol: 'tapis', elements: ['cheminee', null, 'etageres:livres'] },
    dessin() {
      let f = '';
      // Le bureau
      f += `<rect x="320" y="146" width="270" height="12" rx="3" fill="#5a3418"/><rect x="332" y="158" width="14" height="${SOL - 158}" fill="#3a2010"/><rect x="564" y="158" width="14" height="${SOL - 158}" fill="#3a2010"/>`;
      // Une lettre d'enfant au sceau douteux, et le registre des empreintes
      f += papier(360, 96, 70, 48, -5, texte(395, 112, tr('LÉA'), { taille: 10, couleur: '#3a2508', police: MONO, gras: true }) + lignes(368, 122, 54, 2, 5) + `<circle cx="416" cy="136" r="8" fill="#9b1b30"/>` + texte(416, 139, '?', { taille: 7, couleur: '#ffe9b0', gras: true }));
      f += papier(450, 92, 76, 54, 4, texte(488, 104, tr('REGISTRE'), { taille: 7.5, couleur: '#3a2508', police: MONO, gras: true }) +
        ['876dfb61a5', '9a781fbda9', '6c97cbad8d', 'd8fbe8af7c'].map((e, i) => texte(458, 116 + i * 8, e, { taille: 6, couleur: i === 2 ? '#9b1b30' : '#5a1784', police: MONO, ancre: 'start' })).join(''));
      // La bougie, l'encrier
      f += `<rect x="540" y="118" width="10" height="28" rx="2" fill="#f4ead2"/><rect x="534" y="143" width="22" height="5" rx="2" fill="#c9a35a"/><rect x="336" y="132" width="16" height="14" rx="3" fill="#1b2430"/>`;
      let a = '';
      a += calque('s20-flamme', 537, 102, 16, 18, `<path d="M545 104 Q551 112 545 119 Q539 112 545 104Z" fill="#ffcf5a"/><path d="M545 109 Q548 114 545 118 Q542 114 545 109Z" fill="#fff4c4"/>`);
      a += calque('s20-cire', 538, 118, 14, 14, `<path d="M546 120 q2 4 0 6 q-2 -2 0 -6z" fill="#f4ead2"/>`);
      a += calque('s20-marque', 496, 124, 24, 24, `<circle cx="508" cy="136" r="9" fill="#5a1784"/><text x="508" y="139.5" font-size="8" text-anchor="middle" fill="#fff" font-weight="700">K</text>`);
      return { fond: f, calques: a };
    },
    kere: { x: 500, y: 40, taille: 66, classe: 's20-kere', main: 'g', tailleObjet: 40,
      objet: `<rect x="38" y="6" width="22" height="46" rx="8" fill="#8a5a30"/><rect x="28" y="50" width="42" height="14" rx="4" fill="#5a1784"/>` },
  };

  /* ---- Jour 21 : sur l'écran de la messagerie, cinq messages arrivent ; la Kère pêche à la ligne,
     une enveloppe en guise d'appât. ---- */
  SC[21] = {
    piece: { mur: '#1d4f6e', motif: 'rayures', sol: 'tapis', elements: ['fenetre', null, null] },
    dessin() {
      let f = '';
      // Le bureau et l'ordinateur
      f += `<rect x="330" y="150" width="250" height="10" rx="3" fill="#5a3418"/><rect x="342" y="160" width="12" height="${SOL - 160}" fill="#3a2010"/><rect x="556" y="160" width="12" height="${SOL - 160}" fill="#3a2010"/>`;
      f += `<rect x="370" y="44" width="170" height="96" rx="6" fill="#1a1f26" stroke="#3a4250" stroke-width="3"/><rect x="376" y="50" width="158" height="84" rx="2" fill="#eef3f8"/>`;
      f += `<rect x="376" y="50" width="158" height="12" fill="#2a7fd4"/>` + texte(382, 59, tr('📥 Boîte de réception (5)'), { taille: 6.5, couleur: '#fff', ancre: 'start', gras: true });
      ['⚠️ URGENT !!!', '🔔 Nouvelle connexion…', 'Planning de l\'atelier', 'Prime de Noël', '🎁 FÉLICITATIONS'].forEach((o, i) => { f += `<rect x="380" y="${66 + i * 13}" width="150" height="11" rx="2" fill="${i % 2 ? '#ffffff' : '#e3ebf3'}"/>` + texte(384, 74 + i * 13, tr(o), { taille: 6, couleur: '#1b2430', ancre: 'start' }); });
      f += `<rect x="444" y="140" width="22" height="10" fill="#3a4250"/>`;
      // Le fil de la canne à pêche
      f += `<path d="M560 32 Q600 40 610 70" stroke="#c9a35a" stroke-width="3" fill="none"/>`;
      let a = '';
      a += calque('s21-appat', 596, 66, 30, 70, `<line x1="610" y1="68" x2="610" y2="108" stroke="#ddd" stroke-width="1"/><path d="M610 108 q0 8 -6 8 q-4 0 -4 -4" stroke="#aab6c4" stroke-width="2" fill="none"/><rect x="598" y="114" width="24" height="16" fill="#fff8e6" transform="rotate(8 610 122)"/><path d="M598 114 l12 8 12 -8" stroke="#c9b48a" stroke-width="1.2" fill="none" transform="rotate(8 610 122)"/>`);
      a += calque('s21-notif', 524, 40, 16, 16, `<circle cx="532" cy="48" r="7" fill="#ff5a5f"/>${texte(532, 51, '5', { taille: 8, couleur: '#fff', gras: true })}`);
      return { fond: f, calques: a };
    },
    kere: { x: 520, y: 4, taille: 60, classe: 's21-kere', tailleObjet: 70,
      objet: `<line x1="0" y1="80" x2="80" y2="10" stroke="#8a5a30" stroke-width="6" stroke-linecap="round"/>` },
  };

  /* ---- Jour 22 : le repaire de l'Elfe Hacker, terminaux verts et dossiers fantômes ; la Kère se faufile
     pour cacher une moitié du mot de passe dans un dossier caché. ---- */
  SC[22] = {
    piece: { mur: '#132a1a', motif: 'bois', sol: 'parquet', elements: [null, null, 'lucarne'] },
    dessin() {
      let f = '';
      // Le bureau et deux écrans de terminal
      f += `<rect x="290" y="150" width="320" height="10" rx="3" fill="#3a2414"/><rect x="300" y="160" width="12" height="${SOL - 160}" fill="#24160c"/><rect x="588" y="160" width="12" height="${SOL - 160}" fill="#24160c"/>`;
      const ecran = (x, lignesTxt) => `<rect x="${x}" y="50" width="140" height="92" rx="6" fill="#1a1f26" stroke="#3a4250" stroke-width="3"/><rect x="${x + 6}" y="56" width="128" height="80" rx="2" fill="#020a04"/>` + lignesTxt.map((l, i) => texte(x + 10, 68 + i * 9, tr(l), { taille: 6.2, couleur: '#3dff7a', police: MONO, ancre: 'start', extra: 'xml:space="preserve"' })).join('') + `<rect x="${x + 60}" y="142" width="20" height="8" fill="#3a4250"/>`;
      f += ecran(306, ['elfe@pole-nord:~$ ls -a', '.  ..  atelier/  photos/', 'lisez-moi.txt', 'elfe@pole-nord:~$ cd /var/log', 'elfe@pole-nord:/var/log$ ls', 'systeme.log  traineau.log', '…']);
      f += ecran(454, ['$ cat note.txt', 'La 1re moitié :', '    ????', '', '$ ls -a /tmp', 'brouillon.txt', '…']);
      // Des canettes, des câbles
      f += `<rect x="612" y="134" width="10" height="16" rx="2" fill="#d62839"/><rect x="626" y="138" width="10" height="12" rx="2" fill="#3ddc84"/>`;
      let a = '';
      a += calque('s22-curseur', 352, 120, 8, 8, `<rect x="354" y="121" width="5" height="6" fill="#3dff7a"/>`);
      a += calque('s22-fantome f1', 300, 30, 28, 24, `<path d="M304 50 L304 36 L312 36 L315 39 L326 39 L326 50Z" fill="#3dff7a" opacity=".5"/>${texte(315, 47, '.', { taille: 10, couleur: '#020a04', gras: true })}`);
      a += calque('s22-fantome f2', 560, 26, 28, 24, `<path d="M564 46 L564 32 L572 32 L575 35 L586 35 L586 46Z" fill="#3dff7a" opacity=".5"/>${texte(575, 43, '.', { taille: 10, couleur: '#020a04', gras: true })}`);
      return { fond: f, calques: a };
    },
    kere: { x: 596, y: 70, taille: 64, classe: 's22-kere', main: 'g', tailleObjet: 44,
      objet: `<path d="M10 30 L10 80 L90 80 L90 40 L46 40 L38 30Z" fill="#3dff7a" opacity=".85"/><text x="50" y="68" font-size="24" text-anchor="middle" fill="#020a04" font-family="monospace" font-weight="700">.ab</text>` },
  };

  /* ---- Jour 23 : le laboratoire ; au tableau, un arbre de décision dont les cases sont encore vides,
     des jouets qui défilent devant le robot (❤️ ou 😐 ?), et la Kère qui échange les étiquettes. ---- */
  SC[23] = {
    piece: { mur: '#0f3a5a', motif: 'metal', sol: 'metal', elements: ['etageres:⚗️🧪🔋', null, 'robot'] },
    dessin() {
      let f = '';
      // Le tableau et l'arbre de décision (questions encore inconnues)
      f += `<rect x="330" y="34" width="190" height="96" rx="4" fill="#1d3b2a" stroke="#8a6a3a" stroke-width="4"/>`;
      const boite = (x, y, t) => `<rect x="${x - 22}" y="${y - 8}" width="44" height="16" rx="4" fill="none" stroke="#f4f0e6" stroke-width="1.4"/>` + texte(x, y + 3.5, t, { taille: 8, couleur: '#f4f0e6', police: MONO, gras: true });
      f += boite(425, 52, '???') + `<path d="M415 60 L380 82 M435 60 L470 82" stroke="#f4f0e6" stroke-width="1.4"/>` + texte(392, 72, tr('oui'), { taille: 6, couleur: '#f4f0e6' }) + texte(460, 72, tr('non'), { taille: 6, couleur: '#f4f0e6' });
      f += boite(375, 92, '??') + boite(475, 92, '??');
      f += texte(358, 120, '❤️ 😐', { taille: 8 }) + texte(492, 120, '❤️ 😐', { taille: 8 });
      // Le tapis devant le robot
      f += `<rect x="320" y="156" width="300" height="9" rx="4.5" fill="#2a2f36"/>`;
      for (let x = 326; x < 618; x += 15) f += `<circle cx="${x}" cy="160.5" r="3" fill="#59616b"/>`;
      let a = '';
      a += calque('s23-tapis', 320, 132, 300, 26, `<g class="s23-defile">${texte(340, 152, '🔔', { taille: 16 })}${texte(400, 152, '🪀', { taille: 16 })}${texte(460, 152, '🎸', { taille: 16 })}${texte(520, 152, '🧣', { taille: 16 })}</g>`);
      a += calque('s23-avis', 560, 100, 40, 30, `<g class="s23-coeur">${texte(580, 122, '❤️', { taille: 16 })}</g>`);
      a += calque('s23-avis2', 560, 100, 40, 30, `<g>${texte(580, 122, '😐', { taille: 16 })}</g>`);
      a += calque('s23-craie', 470, 84, 12, 12, etincelle(476, 90, 4, '#ffffff'));
      return { fond: f, calques: a };
    },
    kere: { x: 246, y: 50, taille: 70, classe: 's23-kere', tailleObjet: 40,
      objet: `<rect x="10" y="20" width="80" height="50" rx="6" fill="#fff8e6"/><text x="50" y="58" font-size="34" text-anchor="middle">😐</text>` },
  };

  /* ---- Jour 24 : le Grand Salon ; le sapin et son étoile éteinte, que Kryos lui-même tient sous sa
     griffe de glace. Le givre court sur les branches. ---- */
  SC[24] = {
    piece: { mur: '#5c1a1a', motif: 'papier', sol: 'tapis', elements: ['fenetre', null, 'cheminee'] },
    dessin(c) {
      let f = c.el('sapin', 450);
      // Le givre sur le sapin
      f += `<path d="M390 160 q20 -10 40 0 q20 -10 40 0 q20 -10 40 0" stroke="#e8f7ff" stroke-width="4" fill="none" opacity=".8"/><path d="M410 120 q20 -8 40 0 q20 -8 40 0" stroke="#e8f7ff" stroke-width="3" fill="none" opacity=".7"/>`;
      f += `<polygon points="450,18 456,32 471,32 459,41 464,55 450,46 436,55 441,41 429,32 444,32" fill="#4a4f57" stroke="#8a96a3" stroke-width="1.2"/>`;
      let a = '';
      a += calque('s24-etoile', 428, 16, 44, 42, `<polygon points="450,18 456,32 471,32 459,41 464,55 450,46 436,55 441,41 429,32 444,32" fill="#ffd23f"/>`);
      a += calque('s24-givre', 380, 60, 140, 110, Array.from({ length: 9 }, (_, i) => etincelle(392 + (i * 41) % 128, 70 + (i * 29) % 92, 3, '#e8f7ff')).join(''));
      return { fond: f, calques: a };
    },
    kere: { x: 470, y: 4, taille: 74, classe: 's24-kryos', boss: true },
  };

  /* ---------- Assemblage ---------- */
  function dessiner(n, piece, { chassee = false, sansKere = false } = {}) {
    const S = SC[n];
    if (!S || !global.PIECES || !PIECES.calques) return null;
    const c = PIECES.calques(S.piece || piece || {}, n);
    const { fond, calques } = S.dessin(c);
    const k = S.kere;
    const laKere = k && !sansKere ? kere(k) + flaque(k.x + k.taille / 2) : '';
    return `<div class="scene-enigme scene-${n}${chassee ? ' chassee' : ''}" aria-hidden="true"><div class="scene-cadre">` +
      `<svg class="scene-fond" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${c.fond}${fond}${c.plafond}${c.vignette}</svg>` +
      `${calques}${laKere}</div></div>`;
  }

  global.SCENES = { dessiner, existe: (n) => !!SC[n] };
})(window);
