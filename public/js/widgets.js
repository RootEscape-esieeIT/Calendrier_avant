/* =========================================================
   NOËL-OS — Les mini-jeux interactifs des énigmes
   Chaque widget est une fonction (zone, api) qui dessine
   l'énigme dans « zone ». C'est TOUJOURS le serveur qui décide
   si c'est gagné. L'objet api permet de :
     api.soumettre(donnees) → envoyer une proposition au serveur
                              (renvoie une promesse { ok, message… })
     api.action(donnees)    → jouer un coup (jour 7)
     api.verifier(texte)    → envoyer une réponse écrite
     api.message(html)      → afficher un message
     api.champ              → le champ de réponse (s'il existe)
     api.fragments()        → les fragments récupérés (jour 24)
     api.prenom()           → le prénom du joueur (jour 24)
   Les mini-jeux « à tester » (terminal, circuit, robot…) sont
   dans widgets-dur.js.
   ========================================================= */
(function (global) {
  'use strict';

  // Petit utilitaire pour fabriquer des éléments HTML.
  function h(tag, props, ...enfants) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const c of enfants.flat()) {
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return e;
  }

  const SVG = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, ...enfants) {
    const e = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v);
    for (const c of enfants) e.append(c.nodeType ? c : document.createTextNode(String(c)));
    return e;
  }

  const echapper = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const W = {};

  /* ---------- Jour 1 : la guirlande binaire ---------- */
  W.ampoules = () => (zone, api) => {
    const valeurs = [128, 64, 32, 16, 8, 4, 2, 1];
    const etats = valeurs.map(() => false);
    const affichage = h('div', { class: 'affichage-binaire' });
    const guirlande = h('div', { class: 'guirlande' });
    valeurs.forEach((v, i) => {
      const b = h('button', { type: 'button', class: 'ampoule', 'aria-pressed': 'false', 'aria-label': t('Ampoule {v}', { v }) },
        h('span', { class: 'culot' }), h('span', { class: 'verre' }), h('span', { class: 'valeur' }, v));
      b.addEventListener('click', () => {
        etats[i] = !etats[i];
        b.classList.toggle('allumee', etats[i]);
        b.setAttribute('aria-pressed', String(etats[i]));
        maj();
      });
      guirlande.append(b);
    });
    function maj() {
      const allumees = valeurs.filter((v, i) => etats[i]);
      const total = allumees.reduce((a, v) => a + v, 0);
      affichage.innerHTML = t("Ce que voit l'ordinateur :") + ' <code>' + etats.map(e => (e ? '1' : '0')).join(' ') + '</code>' +
        ' <span class="total-binaire">= ' + (allumees.length > 1 ? allumees.join(' + ') + ' = ' : '') + '<b>' + total + '</b></span>';
    }
    maj();
    const bouton = h('button', { type: 'button', class: 'btn btn-principal' }, t("🔓 Essayer d'ouvrir la porte"));
    bouton.addEventListener('click', async () => {
      const total = valeurs.reduce((acc, v, i) => acc + (etats[i] ? v : 0), 0);
      const r = await api.soumettre({ bits: etats.slice() });
      if (!r.ok && !r.message && !r.erreur) api.message(t("🔒 La porte reste fermée. Tes ampoules allumées valent <b>{total}</b> au total… ce n'est pas le bon nombre.", { total }));
    });
    zone.append(guirlande, affichage, h('div', { class: 'centre' }, bouton));
  };

  /* ---------- Jour 3 : la roue de César (ou deux roues, quand la Kère alterne deux clés) ----------
     Avec deux clés : la 1re lettre est décalée avec la roue dorée, la 2e avec la roue argentée, la 3e
     de nouveau avec la dorée… (on ne compte que les lettres). */
  W.cesar = (texte, nbCles = 1) => (zone) => {
    const deux = nbCles === 2;
    const roue = (nom) => ({ curseur: h('input', { type: 'range', min: '0', max: '25', value: '0', class: 'curseur', 'aria-label': nom }), valeur: h('b', { class: 'valeur-curseur' }, '0') });
    const roues = deux ? [roue(t('Roue dorée')), roue(t('Roue argentée'))] : [roue(t('Décalage'))];
    const sortie = h('pre', { class: 'parchemin' + (deux ? ' deux-cles' : '') });
    const table = h('div', { class: 'alphabet' });
    const reculer = (c, k) => String.fromCharCode((c.charCodeAt(0) - 65 - k + 26) % 26 + 65);
    const lettres = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const ligne = (classe, etiquette, f) => `<div class="ligne-alpha ${classe}"><span class="etiquette-alpha">${etiquette}</span>${lettres.map(l => `<span>${f(l)}</span>`).join('')}</div>`;
    function maj() {
      const ks = roues.map(r => +r.curseur.value);
      roues.forEach((r, i) => { r.valeur.textContent = ks[i]; });
      if (deux) {
        let n = 0;
        sortie.innerHTML = texte.replace(/[A-Z]|[^A-Z]+/g, m => (/^[A-Z]$/.test(m) ? `<span class="${n % 2 ? 'argent' : 'or'}">${reculer(m, ks[(n++) % 2])}</span>` : echapper(m)));
        table.innerHTML = ligne('', t('Lettre chiffrée'), l => l) + ligne('clair or', t('🥇 Roue dorée'), l => reculer(l, ks[0])) + ligne('clair argent', t('🥈 Roue argentée'), l => reculer(l, ks[1]));
      } else {
        sortie.textContent = texte.replace(/[A-Z]/g, c => reculer(c, ks[0]));
        table.innerHTML = ligne('', t('Lettre chiffrée'), l => l) + ligne('clair', t("Lettre d'origine"), l => reculer(l, ks[0]));
      }
    }
    roues.forEach(r => r.curseur.addEventListener('input', maj));
    maj();
    const titres = deux ? [t('🥇 Roue dorée (lettres n° 1, 3, 5…) :'), t('🥈 Roue argentée (lettres n° 2, 4, 6…) :')] : [t('🎡 Décalage de la roue :')];
    zone.append(...roues.map((r, i) => h('div', { class: 'reglage' + (deux ? (i ? ' argent' : ' or') : '') }, h('label', {}, titres[i] + ' ', r.valeur), r.curseur)), table, sortie);
  };

  /* ---------- Jour 4 : la machine à peindre (la boule d'essai prend la couleur du code tapé) ---------- */
  W.couleur = () => (zone, api) => {
    const nuancier = h('div', { class: 'nuancier' },
      [['#FF0000', 'rouge'], ['#00FF00', 'vert'], ['#0000FF', 'bleu'], ['#FFFFFF', 'blanc'], ['#000000', 'noir']].map(([c, n]) =>
        h('div', { class: 'pastille' }, h('span', { class: 'rond', style: { background: c } }), h('code', {}, c), h('small', {}, t(n)))));
    const boule = h('div', { class: 'boule-apercu', 'aria-hidden': 'true' }, h('span', { class: 'attache' }));
    const detail = h('div', { class: 'detail-rvb' });
    const deux = (n) => n.toString(16).toUpperCase().padStart(2, '0');
    function maj() {
      const v = (api.champ ? api.champ.value : '').trim().replace(/^#/, '');
      let hex = null;
      if (/^[0-9a-f]{6}$/i.test(v)) hex = v;
      else if (/^[0-9a-f]{3}$/i.test(v)) hex = v.split('').map(c => c + c).join('');
      if (!hex) {
        boule.style.setProperty('--teinte', '#4a5568');
        detail.innerHTML = t("Tape un code dans le champ de réponse : la boule d'essai change de couleur en direct.");
        return;
      }
      hex = hex.toUpperCase();
      const tape = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
      boule.style.setProperty('--teinte', '#' + tape.map(deux).join(''));
      const noms = [['r', t('Rouge')], ['g', t('Vert')], ['b', t('Bleu')]];
      const niveau = (x) => (x === 0 ? t('éteinte') : x === 255 ? t('à fond') : t('à {p} %', { p: Math.round(x / 2.55) }));
      detail.innerHTML = noms.map(([c, nom], i) => `<span class="${c}">${nom} <code>${deux(tape[i])}</code> ${niveau(tape[i])}</span>`).join('');
    }
    if (api.champ) api.champ.addEventListener('input', maj);
    maj();
    zone.append(h('p', { class: 'petit centre' }, t("Quelques couleurs de base, pour t'inspirer :")), nuancier, h('div', { class: 'atelier-peinture' }, boule, detail));
  };

  /* ---------- Jour 6 : le tri des cadeaux ---------- */
  W.tri = (objets, maxEchanges) => (zone, api) => {
    let ordre, echanges, termine, historique;
    const compteur = h('div', { class: 'compteur' });
    const rangee = h('div', { class: 'rangee-tri' });
    const recommencer = h('button', { type: 'button', class: 'btn' }, t('↺ Recommencer'));
    function init() { ordre = objets.map(o => ({ ...o })); echanges = 0; historique = []; termine = false; rendre(); }
    function rendre(flash) {
      rangee.innerHTML = '';
      ordre.forEach((o, i) => {
        rangee.append(h('div', { class: 'colis' + (flash === i || flash === i - 1 ? ' bouge' : '') },
          h('span', { class: 'emoji' }, o.emoji), h('span', { class: 'poids' }, o.poids + ' kg')));
        if (i < ordre.length - 1) {
          const b = h('button', { type: 'button', class: 'echange', title: t('Échanger ces deux paquets'), 'aria-label': t('Échanger {a} kg et {b} kg', { a: o.poids, b: ordre[i + 1].poids }) }, '⇄');
          b.disabled = termine;
          b.addEventListener('click', () => echanger(i));
          rangee.append(b);
        }
      });
      const reste = maxEchanges - echanges;
      compteur.innerHTML = t(I18N.pluriel(reste) ? '⛽ Carburant : <b>{n}</b> échanges restants sur {max}' : '⛽ Carburant : <b>{n}</b> échange restant sur {max}', { n: reste, max: maxEchanges });
    }
    function echanger(i) {
      if (termine) return;
      [ordre[i], ordre[i + 1]] = [ordre[i + 1], ordre[i]];
      echanges++;
      historique.push(i);
      const trie = ordre.every((o, k) => k === 0 || ordre[k - 1].poids <= o.poids);
      if (trie) { termine = true; rendre(i + 1); api.soumettre({ echanges: historique.slice() }); return; }
      if (echanges >= maxEchanges) {
        termine = true; rendre(i + 1);
        api.message(t('⛽ Plus de carburant ! Les cadeaux ne sont pas encore triés. Clique sur « Recommencer ».'));
        return;
      }
      rendre(i + 1);
    }
    recommencer.addEventListener('click', init);
    init();
    zone.append(compteur, rangee, h('div', { class: 'centre' }, recommencer));
  };

  /* ---------- Jour 7 : la recherche dichotomique ---------- */
  W.dichotomie = (max, essaisMax) => (zone, api) => {
    let essais, fini, bas, haut;
    const statut = h('div', { class: 'compteur' });
    const rue = h('div', { class: 'rue' });
    const champ = h('input', { type: 'number', min: '1', max: String(max), class: 'champ-nombre', placeholder: t('N° de maison'), 'aria-label': t('Numéro de maison') });
    const bouton = h('button', { type: 'submit', class: 'btn btn-principal' }, t('📡 Envoyer le lutin'));
    const form = h('form', { class: 'ligne-form' }, champ, bouton);
    const journal = h('ol', { class: 'journal' });
    const rejouer = h('button', { type: 'button', class: 'btn', hidden: true }, t('🔁 Nouvelle partie'));
    // La maison mystère est tirée au sort par le serveur : impossible de la lire dans la page.
    async function init() {
      essais = 0; fini = false; bas = 1; haut = max;
      journal.innerHTML = ''; champ.disabled = false; bouton.disabled = false; rejouer.hidden = true;
      maj();
      await api.action({ nouvelle: true });
    }
    function maj() {
      statut.innerHTML = t("🌙 Essais restants avant l'aube : <b>{n}</b> / {max}", { n: essaisMax - essais, max: essaisMax });
      const n = haut - bas + 1;
      const nb = I18N.nombre;
      // (la zone dorée garde une largeur visible, même quand il ne reste qu'une poignée de maisons sur un million)
      rue.innerHTML =
        `<div class="rue-barre"><div class="rue-zone" style="left:${((bas - 1) / max) * 100}%;width:max(3px, ${(n / max) * 100}%)"></div></div>` +
        `<div class="rue-legende"><span>1</span><span>${t(I18N.pluriel(n) ? 'Maisons encore possibles : <b>{bas}</b> à <b>{haut}</b> ({n} maisons)' : 'Maisons encore possibles : <b>{bas}</b> à <b>{haut}</b> ({n} maison)', { bas: nb(bas), haut: nb(haut), n: nb(n) })}</span><span>${nb(max)}</span></div>`;
    }
    let enCours = false;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (fini || enCours) return;
      const n = parseInt(champ.value, 10);
      if (!(n >= 1 && n <= max)) { api.message(t('Choisis un numéro entre 1 et {max}.', { max: I18N.nombre(max) }), 'info'); return; }
      enCours = true;
      const r = await api.action({ essai: n });
      enCours = false;
      if (!r.indication) return;
      essais = essaisMax - r.essaisRestants;
      let txt;
      const nn = I18N.nombre(n);
      if (r.indication === 'trouve') { txt = t("🎯 {n} : c'est ici ! Cadeau livré !", { n: nn }); fini = true; bas = haut = n; }
      else if (r.indication === 'plus') { txt = t('{n} : ⬆️ plus haut !', { n: nn }); bas = Math.max(bas, n + 1); }
      else { txt = t('{n} : ⬇️ plus bas !', { n: nn }); haut = Math.min(haut, n - 1); }
      journal.append(h('li', {}, txt));
      maj();
      champ.value = '';
      if (r.indication === 'trouve') { champ.disabled = bouton.disabled = true; rejouer.hidden = false; return; }
      if (r.perdu) {
        fini = true; champ.disabled = bouton.disabled = true; rejouer.hidden = false;
        api.message(t("🌅 Le soleil se lève… C'était la maison n°<b>{c}</b>. Retente ta chance avec une meilleure méthode !", { c: I18N.nombre(r.cible) }));
        return;
      }
      champ.focus();
    });
    rejouer.addEventListener('click', init);
    init();
    zone.append(statut, rue, form, journal, h('div', { class: 'centre' }, rejouer));
  };

  /* ---------- Jour 8 : le plus court chemin ---------- */
  W.graphe = (noeuds, aretes, depart, arrivee) => (zone, api) => {
    const voisins = {};
    for (const [a, b, w] of aretes) {
      (voisins[a] = voisins[a] || {})[b] = w;
      (voisins[b] = voisins[b] || {})[a] = w;
    }
    let chemin = [depart];
    const svg = s('svg', { viewBox: '0 0 600 380', class: 'carte', role: 'img', 'aria-label': t('Carte de la tournée') });
    const elAretes = {};
    const cle = (a, b) => [a, b].sort().join('-');
    for (const [a, b, w] of aretes) {
      const A = noeuds[a], B = noeuds[b];
      const g = s('g', { class: 'arete' });
      g.append(s('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y }));
      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      g.append(s('circle', { cx: mx, cy: my, r: 14, class: 'pastille-poids' }));
      g.append(s('text', { x: mx, y: my + 5, 'text-anchor': 'middle', class: 'poids' }, String(w)));
      svg.append(g);
      elAretes[cle(a, b)] = g;
    }
    const elNoeuds = {};
    for (const [id, n] of Object.entries(noeuds)) {
      const g = s('g', { class: 'noeud', tabindex: '0', role: 'button', 'aria-label': n.nom });
      g.append(s('circle', { cx: n.x, cy: n.y, r: 24 }));
      g.append(s('text', { x: n.x, y: n.y + 8, 'text-anchor': 'middle', class: 'emoji' }, n.emoji));
      g.append(s('text', { x: n.x + (n.dxNom || 0), y: n.y + 42, 'text-anchor': 'middle', class: 'nom' }, n.nom));
      g.addEventListener('click', () => cliquer(id));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cliquer(id); } });
      svg.append(g);
      elNoeuds[id] = g;
    }
    const trajet = h('div', { class: 'trajet' });
    const annuler = h('button', { type: 'button', class: 'btn' }, t('↩ Annuler la dernière étape'));
    const recommencer = h('button', { type: 'button', class: 'btn' }, t('↺ Recommencer'));
    const total = () => chemin.slice(1).reduce((acc, id, i) => acc + voisins[chemin[i]][id], 0);
    function cliquer(id) {
      const dernier = chemin[chemin.length - 1];
      if (dernier === arrivee) return;
      const idx = chemin.indexOf(id);
      if (idx >= 0) { chemin = chemin.slice(0, idx + 1); maj(); return; }
      if (!voisins[dernier][id]) { api.message(t('Pas de route directe entre {a} et {b}.', { a: noeuds[dernier].nom, b: noeuds[id].nom })); return; }
      chemin.push(id);
      maj();
      if (id === arrivee) api.soumettre({ chemin: chemin.slice() });
    }
    function maj() {
      Object.values(elAretes).forEach(g => g.classList.remove('choisie'));
      Object.values(elNoeuds).forEach(g => g.classList.remove('dans-chemin', 'accessible', 'actuel'));
      for (let i = 1; i < chemin.length; i++) elAretes[cle(chemin[i - 1], chemin[i])].classList.add('choisie');
      chemin.forEach(id => elNoeuds[id].classList.add('dans-chemin'));
      const dernier = chemin[chemin.length - 1];
      elNoeuds[dernier].classList.add('actuel');
      if (dernier !== arrivee) Object.keys(voisins[dernier]).forEach(id => { if (!chemin.includes(id)) elNoeuds[id].classList.add('accessible'); });
      let txt = noeuds[chemin[0]].nom;
      for (let i = 1; i < chemin.length; i++) txt += ` → ${noeuds[chemin[i]].nom} <small>(+${voisins[chemin[i - 1]][chemin[i]]})</small>`;
      trajet.innerHTML = `🛷 ${txt}<br>${t('⏱️ Temps total :')} <b>${total()} min</b>`;
      annuler.disabled = chemin.length <= 1;
    }
    annuler.addEventListener('click', () => { if (chemin.length > 1) { chemin.pop(); maj(); } });
    recommencer.addEventListener('click', () => { chemin = [depart]; maj(); });
    maj();
    zone.append(h('p', { class: 'petit centre seulement-mobile' }, t('↔ Fais glisser la carte pour voir tous les lieux.')), h('div', { class: 'cadre-carte' }, svg), trajet, h('div', { class: 'centre' }, annuler, recommencer));
  };

  /* ---------- Jour 10 : tableau de suivi (brouillon) ---------- */
  W.tableauSuivi = (colonnes, nbLignes) => (zone) => {
    const table = h('table', { class: 'tableau suivi' });
    table.append(h('tr', {}, colonnes.map(c => h('th', {}, c))));
    for (let i = 1; i <= nbLignes; i++) {
      table.append(h('tr', {}, h('td', {}, h('b', {}, i)), colonnes.slice(1).map(() => h('td', {}, h('input', { type: 'text', class: 'case-suivi', 'aria-label': t('brouillon') })))));
    }
    zone.append(h('div', { class: 'defilement' }, table));
  };

  /* ---------- Pixels et RLE à 2 couleurs, version simple (couleur : 'rouge' ou 'vert') ---------- */
  W.pixels = (lignesRLE, largeur, couleur = 'rouge') => (zone) => {
    const hauteur = lignesRLE.length;
    const codes = h('ol', { class: 'codes-rle' }, lignesRLE.map(l => h('li', {}, h('code', {}, l))));
    const grille = h('div', { class: 'grille-pixels', style: { gridTemplateColumns: `repeat(${largeur}, 1fr)` } });
    const cases = [];
    for (let i = 0; i < largeur * hauteur; i++) {
      const c = h('div', { class: 'pixel', 'data-i': i });
      cases.push(c);
      grille.append(c);
    }
    let peinture = null;
    const appliquer = (c) => { if (c && c.classList.contains('pixel')) c.classList.toggle(couleur, peinture); };
    grille.addEventListener('pointerdown', (e) => {
      const c = e.target.closest('.pixel');
      if (!c) return;
      e.preventDefault();
      peinture = !c.classList.contains(couleur);
      appliquer(c);
    });
    grille.addEventListener('pointermove', (e) => {
      if (peinture === null) return;
      appliquer(document.elementFromPoint(e.clientX, e.clientY));
    });
    const stop = () => { peinture = null; };
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    const effacer = h('button', { type: 'button', class: 'btn' }, t('🧽 Tout effacer'));
    effacer.addEventListener('click', () => cases.forEach(c => c.classList.remove(couleur)));
    zone.append(h('div', { class: 'atelier-pixels' }, h('div', {}, h('p', { class: 'petit' }, t('Code reçu, ligne par ligne :')), codes), h('div', { class: 'zone-grille' }, grille, h('div', { class: 'centre' }, effacer))));
  };

  /* ---------- Jour 13 : le code-barres ---------- */
  W.codeBarres = (chiffres, cache) => (zone) => {
    const d = chiffres.split('').map(Number);
    // Barres décoratives (pas un vrai encodage EAN, juste pour l'ambiance).
    const svg = s('svg', { viewBox: '0 0 300 90', class: 'code-barres', 'aria-hidden': 'true' });
    svg.append(s('rect', { x: 0, y: 0, width: 300, height: 90, fill: '#fff', rx: 6 }));
    let x = 14;
    const motif = (n) => [1 + (n % 3), 1 + ((n + 1) % 2), 2 + (n % 2), 1 + ((n * 7) % 3)];
    d.forEach((n, i) => {
      motif(n).forEach((w, j) => {
        if (j % 2 === 0) svg.append(s('rect', { x, y: 8, width: w * 1.6, height: 62, fill: '#111' }));
        x += w * 1.6 + 0.6;
      });
      if (i === 0 || i === 6) x += 3;
    });
    svg.append(s('ellipse', { cx: 14 + (cache + 0.5) * ((x - 14) / d.length), cy: 40, rx: 26, ry: 34, fill: '#f4f8ff', class: 'tache-neige' }));
    d.forEach((n, i) => svg.append(s('text', { x: 14 + (i + 0.5) * ((x - 14) / d.length), y: 84, 'text-anchor': 'middle', 'font-size': '11', 'font-family': 'monospace', fill: '#111' }, i === cache ? '?' : String(n))));
    const table = h('table', { class: 'tableau calcul-ean' });
    table.append(h('tr', {}, h('th', {}, t('Position')), d.map((_, i) => h('th', {}, i + 1))));
    table.append(h('tr', {}, h('th', {}, t('Chiffre')), d.map((n, i) => h('td', { class: i === cache ? 'inconnu' : (i === 12 ? 'cle' : '') }, i === cache ? '?' : n))));
    table.append(h('tr', {}, h('th', {}, t('× poids')), d.map((_, i) => h('td', {}, '× ' + (i % 2 === 0 ? 1 : 3)))));
    table.append(h('tr', {}, h('th', {}, t('Produit')), d.map(() => h('td', {}, h('input', { type: 'text', class: 'case-suivi petite', 'aria-label': t('brouillon') })))));
    zone.append(h('div', { class: 'centre' }, svg), h('div', { class: 'defilement' }, table), h('p', { class: 'petit centre' }, t('La dernière case (en doré) est la clé de contrôle. La ligne « Produit » est ton brouillon.')));
  };

  /* ---------- Jour 13 : trois étiquettes, un seul code authentique ----------
     etiquettes : [{ code: '52714', nom: '🛷 Luge' }, …]. Le brouillon n'est pas corrigé.
     simple : la clé (dernier chiffre) = le dernier chiffre de la somme des autres ; sinon, règle EAN-13 (poids 1 et 3). */
  W.codesBarres = (etiquettes, simple = false) => (zone) => {
    const dessin = (chiffres) => {
      const d = chiffres.split('').map(Number);
      const svg = s('svg', { viewBox: '0 0 300 90', class: 'code-barres', 'aria-hidden': 'true' });
      svg.append(s('rect', { x: 0, y: 0, width: 300, height: 90, fill: '#fff', rx: 6 }));
      // Barres décoratives, étirées pour occuper toute l'étiquette quel que soit le nombre de chiffres
      const motif = (n) => [1 + (n % 3), 1 + ((n + 1) % 2), 2 + (n % 2), 1 + ((n * 7) % 3)];
      const brut = d.reduce((acc, n, i) => acc + motif(n).reduce((a, w) => a + w * 1.6 + 0.6, 0) + (i === 0 || i === 6 ? 3 : 0), 0);
      const k = 272 / brut;
      let x = 14;
      d.forEach((n, i) => {
        motif(n).forEach((w, j) => { if (j % 2 === 0) svg.append(s('rect', { x, y: 8, width: w * 1.6 * k, height: 62, fill: '#111' })); x += (w * 1.6 + 0.6) * k; });
        if (i === 0 || i === 6) x += 3 * k;
      });
      d.forEach((n, i) => svg.append(s('text', { x: 14 + (i + 0.5) * ((x - 14) / d.length), y: 84, 'text-anchor': 'middle', 'font-size': simple ? '14' : '11', 'font-weight': simple && i === d.length - 1 ? '700' : '400', 'font-family': 'monospace', fill: simple && i === d.length - 1 ? '#a07a10' : '#111' }, String(n))));
      return svg;
    };
    if (simple) {
      const cartes = h('div', { class: 'etiquettes-ean' }, etiquettes.map((e, k) => h('div', { class: 'etiquette-ean' },
        h('div', { class: 'etiquette-ean-titre' }, h('b', {}, t('Étiquette {n}', { n: k + 1 })), ' · ', e.nom), dessin(e.code))));
      const n = etiquettes[0].code.length;
      const table = h('table', { class: 'tableau calcul-ean' });
      table.append(h('tr', {}, h('th', {}, ''), Array.from({ length: n - 1 }, (_, i) => h('th', {}, i + 1)), h('th', {}, t('Clé')), h('th', {}, t('Somme (brouillon)'))));
      etiquettes.forEach((e) => {
        table.append(h('tr', { class: 'ligne-chiffres' }, h('th', {}, e.nom), e.code.split('').map((c, i) => h('td', { class: i === n - 1 ? 'cle' : '' }, c)),
          h('td', {}, h('input', { type: 'text', class: 'case-suivi', 'aria-label': t('brouillon') }))));
      });
      zone.append(cartes, h('div', { class: 'defilement' }, table), h('p', { class: 'petit centre' }, t('La dernière case (en doré) est la clé de contrôle. La colonne « Somme » est ton brouillon.')));
      return;
    }
    const cartes = h('div', { class: 'etiquettes-ean' }, etiquettes.map((e, k) => h('div', { class: 'etiquette-ean' },
      h('div', { class: 'etiquette-ean-titre' }, h('b', {}, t('Étiquette {n}', { n: k + 1 })), ' · ', e.nom), dessin(e.code))));
    const table = h('table', { class: 'tableau calcul-ean' });
    const n = etiquettes[0].code.length;
    table.append(h('tr', {}, h('th', {}, t('Position')), Array.from({ length: n }, (_, i) => h('th', {}, i + 1)), h('th', {}, t('Total'))));
    table.append(h('tr', {}, h('th', {}, t('× poids')), Array.from({ length: n }, (_, i) => h('td', {}, '× ' + (i % 2 === 0 ? 1 : 3))), h('td', {})));
    etiquettes.forEach((e, k) => {
      table.append(h('tr', { class: 'ligne-chiffres' }, h('th', {}, t('Étiquette {n}', { n: k + 1 })), e.code.split('').map((c, i) => h('td', { class: i === n - 1 ? 'cle' : '' }, c)), h('td', {})));
      table.append(h('tr', {}, h('th', { class: 'petit' }, t('Produits')), Array.from({ length: n }, () => h('td', {}, h('input', { type: 'text', class: 'case-suivi petite', 'aria-label': t('brouillon') }))), h('td', {}, h('input', { type: 'text', class: 'case-suivi', 'aria-label': t('brouillon') }))));
    });
    zone.append(cartes, h('div', { class: 'defilement' }, table), h('p', { class: 'petit centre' }, t('La dernière case (en doré) est la clé de contrôle. Les lignes « Produits » sont ton brouillon.')));
  };

  /* ---------- Jour 14 : les paquets réseau ---------- */
  W.paquets = (paquets) => (zone, api) => {
    let choisis = [];
    const boutons = [];
    const zonePaquets = h('div', { class: 'paquets' });
    const visible = (t) => t.replace(/ /g, '␣');
    paquets.forEach((p, i) => {
      const b = h('button', { type: 'button', class: 'paquet', 'aria-label': t('Paquet numéro {seq}', { seq: p.seq }) },
        h('span', { class: 'entete-paquet' }, 'SEQ ', h('code', {}, p.seq), p.taille ? [' · ' + t('TAILLE') + ' ', h('code', {}, p.taille)] : null),
        h('span', { class: 'donnees' }, visible(p.data)));
      b.addEventListener('click', () => {
        if (b.disabled) return;
        b.disabled = true;
        choisis.push(i);
        maj();
      });
      boutons.push(b);
      zonePaquets.append(b);
    });
    const reassemblage = h('div', { class: 'reassemblage', 'aria-live': 'polite' });
    const vider = h('button', { type: 'button', class: 'btn' }, t('🗑️ Vider le message'));
    const transmettre = h('button', { type: 'button', class: 'btn btn-principal' }, t('📨 Transmettre au Pôle Sud'));
    vider.addEventListener('click', () => { choisis = []; boutons.forEach(b => (b.disabled = false)); maj(); });
    transmettre.addEventListener('click', () => {
      if (!choisis.length) { api.message(t("Clique d'abord sur les paquets pour reconstituer le message."), 'info'); return; }
      api.soumettre({ ordre: choisis.slice() });
    });
    function maj() {
      const texte = choisis.map(i => paquets[i].data).join('');
      reassemblage.innerHTML = '<span class="petit">' + t('Message reconstitué :') + '</span> <code>' + (texte ? echapper(visible(texte)) : '…') + '</code>';
    }
    maj();
    zone.append(h('p', { class: 'petit' }, t("Paquets reçus (dans l'ordre d'arrivée) :")), zonePaquets, reassemblage, h('div', { class: 'centre' }, vider, transmettre));
  };

  /* ---------- Codes HTTP (version simple : jour 15 sur la branche dev) ---------- */
  W.http = (situations, codes) => (zone, api) => {
    const legende = h('div', { class: 'legende-http' }, codes.map(c => h('div', {}, h('code', {}, c.code), ' ', h('span', { html: c.sens }))));
    const liste = h('ol', { class: 'situations' });
    const selects = situations.map((sit) => {
      const sel = h('select', { 'aria-label': t('Code de réponse') }, h('option', { value: '' }, t('— code ? —')), codes.map(c => h('option', { value: c.code }, c.code)));
      liste.append(h('li', {}, h('span', { html: sit }), sel));
      return sel;
    });
    const verifier = h('button', { type: 'button', class: 'btn btn-principal' }, t('🖥️ Envoyer au serveur'));
    verifier.addEventListener('click', () => {
      if (selects.some(sl => !sl.value)) { api.message(t('Choisis un code pour chaque situation.'), 'info'); return; }
      api.soumettre({ codes: selects.map(sl => Number(sl.value)) });
    });
    zone.append(h('p', { class: 'petit' }, t('Les codes possibles :')), legende, liste, h('div', { class: 'centre' }, verifier));
  };

  /* ---------- Jour 18 : le débogage ---------- */
  W.debogage = (lignes) => (zone, api) => {
    const bloc = h('div', { class: 'code-cliquable', role: 'list' });
    lignes.forEach((l, i) => {
      const b = h('button', { type: 'button', class: 'ligne-code', role: 'listitem' }, h('span', { class: 'numero' }, i + 1), h('code', {}, l));
      b.addEventListener('click', async () => {
        const r = await api.soumettre({ ligne: i });
        if (r.ok) b.classList.add('bug');
        else if (r.message) b.classList.add('saine');
      });
      bloc.append(b);
    });
    zone.append(bloc);
  };

  /* ---------- Jour 21 : le hameçonnage ---------- */
  W.phishing = (messages) => (zone, api) => {
    const boite = h('div', { class: 'boite-mail' });
    messages.forEach((m, i) => {
      const verdict = h('div', { class: 'verdict', hidden: true });
      const bouton = h('button', { type: 'button', class: 'btn' }, t("✅ C'est le vrai !"));
      const carte = h('article', { class: 'courriel' },
        h('div', { class: 'entete-mail' }, h('div', { html: '<b>' + t('De :') + '</b> ' + m.de }), h('div', { html: '<b>' + t('Objet :') + '</b> ' + m.objet })),
        h('p', { html: m.corps }),
        h('div', { class: 'lien-mail' }, '🔗 ', h('code', {}, m.lien)),
        h('div', { class: 'droite' }, bouton),
        verdict);
      bouton.addEventListener('click', async () => {
        const r = await api.soumettre({ choix: i });
        if (r.ok) carte.classList.add('authentique');
        else if (r.piege) {
          carte.classList.add('piege');
          verdict.hidden = false;
          verdict.innerHTML = '🎣 <b>' + t('Piège !') + '</b> ' + r.piege;
        }
      });
      boite.append(carte);
    });
    zone.append(boite);
  };

  global.h = h;
  global.W = W;
})(window);
