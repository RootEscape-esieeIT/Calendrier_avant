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

  /* ---------- Jour 5 : les portes logiques (3 interrupteurs, 3 portes) ---------- */
  W.portes = () => (zone, api) => {
    const etat = { A: false, B: false, C: false };
    const memo = h('div', { class: 'memo-portes', html:
      '<div>' + t('<b>ET</b> : allumée si les <b>deux</b> entrées sont allumées') + '</div>' +
      '<div>' + t('<b>OU</b> : allumée si <b>au moins une</b> entrée est allumée') + '</div>' +
      '<div>' + t("<b>NON</b> : fait l'<b>inverse</b> (allumé ↔ éteint)") + '</div>' });
    const interrupteurs = h('div', { class: 'interrupteurs' });
    for (const k of Object.keys(etat)) {
      const b = h('button', { type: 'button', class: 'interrupteur', 'aria-pressed': 'false', 'aria-label': t('Interrupteur {k}', { k }) },
        h('span', { class: 'levier' }), h('b', {}, k), h('small', { class: 'etat' }, '0'));
      b.addEventListener('click', () => {
        etat[k] = !etat[k];
        b.classList.toggle('on', etat[k]);
        b.setAttribute('aria-pressed', String(etat[k]));
        b.querySelector('.etat').textContent = etat[k] ? '1' : '0';
        maj();
      });
      interrupteurs.append(b);
    }
    // Le circuit (même logique dans serveur/verification.js) : une seule position allume l'étoile.
    const [ET, OU, NON] = [t('ET'), t('OU'), t('NON')];
    const portes = [
      { nom: 'P1', formule: `A  ${ET}  B`, f: () => etat.A && etat.B },
      { nom: 'P2', formule: `${NON} C`, f: () => !etat.C },
      { nom: 'P3', formule: `B  ${OU}  C`, f: () => etat.B || etat.C },
    ];
    const lignes = portes.map(p => {
      const lampe = h('span', { class: 'lampe', 'aria-hidden': 'true' });
      return { p, lampe, el: h('div', { class: 'porte-logique' }, h('b', {}, p.nom), h('code', {}, p.formule), lampe) };
    });
    const etoile = h('span', { class: 'etoile-circuit', 'aria-hidden': 'true' }, '★');
    const sortie = h('div', { class: 'porte-logique sortie' }, h('b', {}, t('ÉTOILE')), h('code', {}, t('P1, P2 et P3 toutes allumées')), etoile);
    let dejaGagne = false;
    function maj() {
      const valeurs = lignes.map(({ p, lampe }) => { const r = p.f(); lampe.classList.toggle('on', r); return r; });
      const allumee = valeurs.every(Boolean);
      etoile.classList.toggle('on', allumee);
      if (allumee && !dejaGagne) { dejaGagne = true; setTimeout(() => api.soumettre({ ...etat }), 600); }
    }
    maj();
    zone.append(memo, interrupteurs, h('div', { class: 'circuit' }, lignes.map(l => l.el), sortie));
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

  /* ---------- Jour 9 : le flocon de Koch ---------- */
  W.koch = (niveauMax) => (zone) => {
    const taille = 420;
    const canvas = h('canvas', { class: 'toile-koch', width: taille, height: taille, 'aria-label': t('Flocon de Koch') });
    const curseur = h('input', { type: 'range', min: '0', max: String(niveauMax), value: '0', class: 'curseur', 'aria-label': t('Étape') });
    const label = h('b', {}, '0');
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = taille * ratio; canvas.height = taille * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    function flocon(n) {
      const cx = taille / 2, cy = taille / 2, r = 150;
      let pts = [0, 1, 2].map(i => {
        const a = -Math.PI / 2 + i * (2 * Math.PI / 3);
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      });
      pts.push(pts[0]);
      const cos = Math.cos(-Math.PI / 3), sin = Math.sin(-Math.PI / 3);
      for (let k = 0; k < n; k++) {
        const nv = [pts[0]];
        for (let i = 0; i < pts.length - 1; i++) {
          const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
          const dx = (x2 - x1) / 3, dy = (y2 - y1) / 3;
          const a = [x1 + dx, y1 + dy], c = [x1 + 2 * dx, y1 + 2 * dy];
          const b = [a[0] + dx * cos - dy * sin, a[1] + dx * sin + dy * cos];
          nv.push(a, b, c, [x2, y2]);
        }
        pts = nv;
      }
      return pts;
    }
    function dessiner() {
      const n = +curseur.value;
      label.textContent = n;
      ctx.clearRect(0, 0, taille, taille);
      const pts = flocon(n);
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = 'rgba(160, 210, 255, 0.18)';
      ctx.fill();
      ctx.lineWidth = n < 3 ? 2.2 : 1.4;
      ctx.strokeStyle = '#e8f4ff';
      ctx.shadowColor = '#7fc8ff';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    curseur.addEventListener('input', dessiner);
    dessiner();
    zone.append(h('div', { class: 'reglage' }, h('label', {}, t('❄️ Étape :') + ' ', label, t(" (le curseur s'arrête à {max}, le Maître est fatigué)", { max: niveauMax })), curseur), h('div', { class: 'centre' }, canvas));
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

  /* ---------- Jour 12 : pixels et RLE (couleur : 'rouge' ou 'vert') ---------- */
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

  /* ---------- Jour 15 : les codes HTTP ---------- */
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

  /* ---------- Jour 19 : la force des mots de passe ---------- */
  W.motDePasse = (vitesse, ansMin, interdits) => (zone, api) => {
    const champ = h('input', { type: 'text', class: 'champ-mdp', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', placeholder: t('Invente un mot de passe…'), 'aria-label': t('Mot de passe inventé') });
    const criteres = h('ul', { class: 'criteres' });
    const resultat = h('div', { class: 'resultat-mdp' });
    const remplissage = h('div', { class: 'jauge-remplissage' });
    const jauge = h('div', { class: 'jauge' }, remplissage);
    const bouton = h('button', { type: 'button', class: 'btn btn-principal' }, t('🔐 Verrouiller le coffre'));
    const types = [
      { nom: t('minuscules (a-z)'), taille: 26, test: /[a-z]/ },
      { nom: t('majuscules (A-Z)'), taille: 26, test: /[A-Z]/ },
      { nom: t('chiffres (0-9)'), taille: 10, test: /[0-9]/ },
      { nom: t('symboles, espaces, accents…'), taille: 33, test: /[^a-zA-Z0-9]/ },
    ];
    const AN = 31557600;
    function analyser(mdp) {
      const presents = types.filter(t => t.test.test(mdp));
      const alphabet = presents.reduce((a, t) => a + t.taille, 0);
      const L = [...mdp].length;
      const log10comb = L && alphabet ? L * Math.log10(alphabet) : 0;
      const log10sec = log10comb - Math.log10(vitesse);
      return { presents, alphabet, L, log10comb, log10sec, log10ans: log10sec - Math.log10(AN) };
    }
    function nombre(log10) {
      if (log10 < 15) return I18N.nombre(Math.round(Math.pow(10, log10)));
      return t('environ 10<sup>{e}</sup> (un nombre de {c} chiffres)', { e: Math.floor(log10), c: Math.floor(log10) + 1 });
    }
    function duree(log10sec) {
      if (log10sec < -3) return t("un instant (moins d'un millième de seconde)");
      const sec = Math.pow(10, log10sec);
      const unite = (valeur, mot, pluriel = mot + 's') => { const v = Math.round(valeur); return `${I18N.nombre(v)} ${t(I18N.pluriel(v) ? pluriel : mot)}`; };
      if (sec < 1) return t("moins d'une seconde");
      if (sec < 60) return unite(sec, 'seconde');
      if (sec < 3600) return unite(sec / 60, 'minute');
      if (sec < 86400) return unite(sec / 3600, 'heure');
      if (sec < AN) return unite(sec / 86400, 'jour');
      const ans = sec / AN;
      if (ans < 1e3) return unite(ans, 'an');
      if (ans < 1e6) return t('{n} mille ans', { n: I18N.nombre(Math.round(ans / 1e3)) });
      if (ans < 1e9) return unite(ans / 1e6, 'million d\'années', 'millions d\'années');
      if (ans < 1.38e10) return unite(ans / 1e9, 'milliard d\'années', 'milliards d\'années');
      return t("plus que l'âge de l'univers ! (environ 10<sup>{e}</sup> ans)", { e: Math.floor(Math.log10(ans)) });
    }
    function maj() {
      const mdp = champ.value;
      const a = analyser(mdp);
      criteres.innerHTML = `<li>${t(I18N.pluriel(a.L) ? '📏 Longueur : <b>{n}</b> caractères' : '📏 Longueur : <b>{n}</b> caractère', { n: a.L })}</li>` +
        types.map(ty => `<li class="${ty.test.test(mdp) ? 'ok' : ''}">${ty.test.test(mdp) ? '✅' : '⬜'} ${ty.nom} <small>${t('(+{n} possibilités)', { n: ty.taille })}</small></li>`).join('') +
        `<li>${t('🔤 Caractères possibles à chaque position : <b>{n}</b>', { n: a.alphabet })}</li>`;
      if (!a.L) { resultat.innerHTML = t("Commence à taper pour voir combien de temps l'ordinateur de glace mettrait à le casser."); remplissage.style.width = '0%'; return; }
      resultat.innerHTML = `${t('Combinaisons possibles :')} ${a.alphabet}<sup>${a.L}</sup> = <b>${nombre(a.log10comb)}</b><br>${t('⏱️ Temps pour toutes les essayer :')} <b>${duree(a.log10sec)}</b>`;
      const objectif = Math.log10(ansMin);
      const pct = Math.max(2, Math.min(100, ((a.log10ans + 8) / (objectif + 8)) * 100));
      remplissage.style.width = pct + '%';
      remplissage.classList.toggle('fort', a.log10ans >= objectif);
    }
    bouton.addEventListener('click', () => {
      const mdp = champ.value;
      const a = analyser(mdp);
      if (!a.L) { api.message(t("Tape d'abord un mot de passe.")); return; }
      if (interdits.includes(mdp.toLowerCase())) { api.message(t("💥 Ce mot de passe fait partie des plus utilisés au monde : l'ordinateur de glace le teste en tout premier. Cassé instantanément !")); return; }
      if (new Set(mdp.toLowerCase()).size < 5) { api.message(t('💥 Trop répétitif ! Les pirates testent en premier les motifs comme « aaaa » ou « abab ». Utilise des caractères plus variés.')); return; }
      if (a.log10ans >= Math.log10(ansMin)) api.soumettre({ longueur: a.L, alphabet: a.alphabet, uniques: new Set(mdp).size, courant: false });
      else api.message(t("💥 L'ordinateur de glace le casserait en <b>{d}</b>. Il faut tenir au moins {ans} ans !", { d: duree(a.log10sec), ans: I18N.nombre(ansMin) }));
    });
    champ.addEventListener('input', maj);
    maj();
    zone.append(champ, jauge, resultat, criteres, h('div', { class: 'centre' }, bouton));
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

  /* ---------- Jour 22 : le terminal ---------- */
  W.terminal = (racine, depart) => (zone) => {
    let cwd = depart.slice();
    const sortie = h('div', { class: 'term-sortie', 'aria-live': 'polite' });
    const invite = h('span', { class: 'term-invite' });
    const champ = h('input', { class: 'term-champ', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', 'aria-label': t('Commande') });
    const form = h('form', { class: 'term-ligne' }, invite, champ);
    const ecran = h('div', { class: 'terminal' }, sortie, form);
    ecran.addEventListener('click', () => { if (!window.getSelection().toString()) champ.focus(); });
    const historique = [];
    let posHist = 0;
    const MAISON = depart.slice();
    const UTILISATEUR = MAISON[MAISON.length - 1];
    const CHEMIN_MAISON = '/' + MAISON.join('/');

    const texteChemin = (p) => {
      const c = '/' + p.join('/');
      if (c === CHEMIN_MAISON) return '~';
      if (c.startsWith(CHEMIN_MAISON + '/')) return '~' + c.slice(CHEMIN_MAISON.length);
      return c;
    };
    const majInvite = () => { invite.textContent = `${UTILISATEUR}@${t('pole-nord')}:${texteChemin(cwd)}$ `; };
    function noeud(p) {
      let n = racine;
      for (const part of p) {
        if (typeof n !== 'object' || !Object.prototype.hasOwnProperty.call(n, part)) return undefined;
        n = n[part];
      }
      return n;
    }
    function resoudre(arg) {
      let parts, reste = arg;
      if (arg.startsWith('/')) parts = [];
      else if (arg === '~' || arg.startsWith('~/')) { parts = MAISON.slice(); reste = arg.slice(1); }
      else parts = cwd.slice();
      for (const seg of reste.split('/')) {
        if (!seg || seg === '.') continue;
        if (seg === '..') parts.pop(); else parts.push(seg);
      }
      return parts;
    }
    function ecrire(contenu, classe) {
      const l = h('div', { class: 'term-l ' + (classe || '') });
      if (contenu && contenu.nodeType) l.append(contenu); else l.textContent = contenu;
      sortie.append(l);
      sortie.scrollTop = sortie.scrollHeight;
    }
    const AIDE = I18N.langue === 'en' ? t('TERMINAL_AIDE') : [
      'Commandes disponibles :',
      '  help            affiche cette aide',
      '  ls              liste le contenu du dossier actuel',
      '  ls -a           liste aussi les éléments cachés (qui commencent par un point)',
      '  cd <dossier>    entre dans un dossier',
      '  cd ..           remonte au dossier parent',
      '  cd /            va à la racine (tout en haut)',
      '  pwd             affiche le chemin du dossier actuel',
      '  cat <fichier>   affiche le contenu d\'un fichier',
      '  clear           efface l\'écran',
      'Astuces : la touche Tab complète les noms, ↑ et ↓ rappellent les commandes précédentes.',
    ].join('\n');
    const commandes = {
      help: () => AIDE,
      aide: () => AIDE,
      ls(args) {
        const tous = args.some(a => /^-[a-zA-Z]*a/.test(a));
        const cible = args.find(a => !a.startsWith('-'));
        const p = cible ? resoudre(cible) : cwd;
        const n = noeud(p);
        if (n === undefined) return t("ls: impossible d'accéder à '{c}': Aucun fichier ou dossier de ce nom", { c: cible });
        if (typeof n === 'string') return cible;
        const noms = Object.keys(n).filter(k => tous || !k.startsWith('.')).sort((a, b) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, '')));
        const ligne = h('div', { class: 'term-ls' });
        if (tous) ligne.append(h('span', { class: 'dossier' }, '.'), h('span', { class: 'dossier' }, '..'));
        noms.forEach(k => ligne.append(h('span', { class: typeof n[k] === 'object' ? 'dossier' : 'fichier' }, k + (typeof n[k] === 'object' ? '/' : ''))));
        if (!noms.length && !tous) return t('(dossier vide… vraiment ?)');
        return ligne;
      },
      dir(args) { return commandes.ls(args); },
      cd(args) {
        const cible = args[0] || '~';
        const p = resoudre(cible);
        const n = noeud(p);
        if (n === undefined) return t('cd: {c}: Aucun fichier ou dossier de ce nom', { c: cible });
        if (typeof n === 'string') return t("cd: {c}: N'est pas un dossier (c'est un fichier : utilise cat pour le lire)", { c: cible });
        cwd = p; majInvite();
        return '';
      },
      pwd: () => '/' + cwd.join('/'),
      cat(args) {
        if (!args[0]) return t('cat: indique un nom de fichier, par exemple : cat lisez-moi.txt');
        const p = resoudre(args[0]);
        const n = noeud(p);
        if (n === undefined) return t('cat: {c}: Aucun fichier ou dossier de ce nom', { c: args[0] });
        if (typeof n === 'object') return t('cat: {c}: Est un dossier (utilise cd pour y entrer)', { c: args[0] });
        return n;
      },
      clear() { sortie.innerHTML = ''; return ''; },
      whoami: () => UTILISATEUR,
      echo: (args) => args.join(' '),
      date: () => new Date().toLocaleString(I18N.locale),
      sudo: () => t("Bien essayé 😏 mais la Kère a confisqué les droits d'administrateur."),
      rm: () => t('rm: Hé ! On ne supprime rien au Pôle Nord. 🎅'),
      exit: () => t('Impossible de quitter : le Pôle Nord a besoin de toi !'),
    };
    function executer(ligne) {
      ecrire(invite.textContent + ligne, 'term-cmd');
      const morceaux = ligne.trim().split(/\s+/);
      const cmd = (morceaux[0] || '').toLowerCase();
      if (!cmd) return;
      const f = commandes[cmd];
      if (!f) { ecrire(t('{c} : commande introuvable. Tape « help » pour voir la liste des commandes.', { c: morceaux[0] }), 'term-erreur'); return; }
      const r = f(morceaux.slice(1));
      if (r) ecrire(r);
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ligne = champ.value;
      champ.value = '';
      if (ligne.trim()) historique.push(ligne);
      posHist = historique.length;
      executer(ligne);
    });
    champ.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); if (posHist > 0) champ.value = historique[--posHist]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (posHist < historique.length - 1) champ.value = historique[++posHist]; else { posHist = historique.length; champ.value = ''; } }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const val = champ.value;
        const debut = val.lastIndexOf(' ') + 1;
        const mot = val.slice(debut);
        const coupe = mot.lastIndexOf('/');
        const dossierTxt = coupe >= 0 ? mot.slice(0, coupe + 1) : '';
        const prefixe = coupe >= 0 ? mot.slice(coupe + 1) : mot;
        const dossier = noeud(dossierTxt ? resoudre(dossierTxt) : cwd);
        if (!dossier || typeof dossier !== 'object') return;
        const choix = Object.keys(dossier).filter(k => k.startsWith(prefixe) && (prefixe.startsWith('.') || !k.startsWith('.')));
        if (choix.length === 1) {
          const k = choix[0];
          champ.value = val.slice(0, debut) + dossierTxt + k + (typeof dossier[k] === 'object' ? '/' : ' ');
        } else if (choix.length > 1) {
          ecrire(invite.textContent + val, 'term-cmd');
          ecrire(choix.join('   '));
        }
      }
    });
    majInvite();
    ecrire(t('NOËL-OS terminal v24.12 — connecté en tant que « {u} »', { u: UTILISATEUR }), 'term-info');
    ecrire(t('Tape « help » puis Entrée pour voir les commandes disponibles.'), 'term-info');
    zone.append(ecran);
  };

  /* ---------- Jour 24 : la finale ---------- */
  W.finale = (longueur) => (zone, api) => {
    const frags = api.fragments();
    const manquants = frags.filter(f => !f.lettre).length;
    const inventaire = h('div', { class: 'inventaire' }, frags.map(f =>
      h('div', { class: 'carte-fragment' + (f.lettre ? '' : ' vide') },
        h('small', {}, t('Jour {n}', { n: f.jour })),
        f.lettre ? h('code', {}, f.positionBinaire) : h('code', {}, '?????'),
        h('b', {}, f.lettre || '❓'))));
    const cases = [];
    const rangee = h('div', { class: 'cases-finales' });
    // Seules les lettres comptent (un espace entre deux mots ne doit pas décaler toute la formule) ;
    // une case déjà remplie prend la nouvelle lettre (avec maxlength=1, on ne pouvait plus corriger
    // une faute : la frappe était ignorée) ; un texte collé remplit les cases suivantes.
    const lettresDe = (s) => Array.from(String(s || '').toUpperCase()).filter(ch => /\p{L}/u.test(ch));
    function remplir(i, texte) {
      const lettres = lettresDe(texte).slice(0, longueur - i);
      if (!lettres.length) { cases[i].value = cases[i].dataset.v || ''; return; }
      lettres.forEach((l, k) => { cases[i + k].value = cases[i + k].dataset.v = l; });
      const suivante = cases[Math.min(i + lettres.length, longueur - 1)];
      suivante.focus();
      suivante.select();
    }
    for (let i = 0; i < longueur; i++) {
      const c = h('input', { type: 'text', class: 'case-finale', 'aria-label': t('Lettre {n}', { n: i + 1 }), autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false' });
      c.addEventListener('focus', () => c.select());
      c.addEventListener('beforeinput', (e) => {
        if (!e.cancelable || !/^insert(Text|FromPaste|FromDrop|ReplacementText)$/.test(e.inputType)) return;
        e.preventDefault();
        remplir(i, e.data ?? (e.dataTransfer ? e.dataTransfer.getData('text/plain') : ''));
      });
      // Claviers de téléphone : la saisie passe par une composition qu'on ne peut pas annuler, on
      // garde alors seulement ce qui vient d'être ajouté.
      c.addEventListener('input', () => {
        const avant = c.dataset.v || '', apres = c.value;
        if (!apres) { c.dataset.v = ''; return; }
        const ajout = apres.startsWith(avant) ? apres.slice(avant.length) : apres.endsWith(avant) ? apres.slice(0, apres.length - avant.length) : apres;
        remplir(i, ajout || apres);
      });
      c.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !c.value && i > 0) { cases[i - 1].focus(); }
        else if (e.key === 'ArrowLeft' && i > 0) cases[i - 1].focus();
        else if (e.key === 'ArrowRight' && i < longueur - 1) cases[i + 1].focus();
        else if (e.key === 'Enter') bouton.click();
      });
      cases.push(c);
      rangee.append(h('label', { class: 'case' }, c, h('small', {}, i + 1)));
    }
    const bouton = h('button', { type: 'button', class: 'btn btn-principal btn-etoile' }, t("⭐ Rallumer l'étoile"));
    bouton.addEventListener('click', () => {
      const texte = cases.map(c => c.value || ' ').join('');
      if (cases.some(c => !c.value)) { api.message(t('Il reste des cases vides : remplis les {n} lettres.', { n: longueur })); return; }
      api.verifier(texte);
    });
    if (manquants) zone.append(h('p', { class: 'alerte' }, t(I18N.pluriel(manquants) ? '⚠️ Il te manque encore {n} fragments. Retourne résoudre les jours manquants… ou tente de deviner les lettres manquantes !' : '⚠️ Il te manque encore {n} fragment. Retourne résoudre les jours manquants… ou tente de deviner les lettres manquantes !', { n: manquants })));
    zone.append(h('p', { class: 'petit' }, t('🧩 Tes fragments (position en binaire → lettre) :')), inventaire,
      h('p', { class: 'petit' }, t('✍️ Place chaque lettre à sa position :')), h('div', { class: 'defilement' }, rangee), h('div', { class: 'centre' }, bouton));
  };

  /* ---------- Terrains de jeu (après réussite) ---------- */
  W.terrainAscii = () => (zone) => {
    const champ = h('input', { type: 'text', class: 'champ-libre', value: 'Noël 🎄', 'aria-label': t('Texte à encoder') });
    const sortie = h('div', { class: 'defilement' });
    function maj() {
      const lignes = [...champ.value].slice(0, 30).map(c => {
        const code = c.codePointAt(0);
        const octets = [...new TextEncoder().encode(c)].map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
        return `<tr><td class="gros">${echapper(c === ' ' ? '␣' : c)}</td><td>${code}</td><td><code>${code < 256 ? code.toString(2).padStart(8, '0') : '—'}</code></td><td><code>${octets}</code></td></tr>`;
      }).join('');
      sortie.innerHTML = `<table class="tableau"><tr><th>${t('Caractère')}</th><th>${t('Numéro')}</th><th>${t('En binaire')}</th><th>${t('Octets UTF-8')}</th></tr>${lignes}</table>`;
    }
    champ.addEventListener('input', maj);
    maj();
    zone.append(h('p', { class: 'petit' }, t("Tape n'importe quoi (même un emoji) et regarde comment l'ordinateur le stocke :")), champ, sortie);
  };

  W.terrainRegex = (motif, exemples) => (zone) => {
    const champMotif = h('input', { type: 'text', class: 'champ-libre mono', value: motif, 'aria-label': t('Expression régulière') });
    const champTextes = h('textarea', { class: 'champ-libre mono', rows: '6', 'aria-label': t('Textes à tester') });
    champTextes.value = exemples.join('\n');
    const sortie = h('ul', { class: 'resultats-regex' });
    function maj() {
      let re;
      try { re = new RegExp(champMotif.value); champMotif.classList.remove('invalide'); }
      catch (e) { champMotif.classList.add('invalide'); sortie.innerHTML = '<li>' + t('⚠️ Motif invalide') + '</li>'; return; }
      sortie.innerHTML = champTextes.value.split('\n').filter(Boolean).map(t => `<li class="${re.test(t) ? 'ok' : 'non'}">${re.test(t) ? '✅' : '❌'} <code>${echapper(t)}</code></li>`).join('');
    }
    champMotif.addEventListener('input', maj);
    champTextes.addEventListener('input', maj);
    maj();
    zone.append(h('p', { class: 'petit' }, t('Modifie le motif ou les textes (un par ligne). Essaie par exemple ^[0-9]{5}$ avec ton code postal !')), champMotif, h('div', { class: 'deux-colonnes' }, champTextes, sortie));
  };

  W.terrainHachage = () => (zone) => {
    const champ = h('input', { type: 'text', class: 'champ-libre', value: t('Joyeux Noël'), 'aria-label': t('Texte à hacher') });
    const sortie = h('div', { class: 'empreinte' });
    function maj() { sortie.innerHTML = t('Empreinte SHA-256 :') + '<br><code>' + global.sha256(champ.value) + '</code>'; }
    champ.addEventListener('input', maj);
    maj();
    zone.append(h('p', { class: 'petit' }, t("Remplace « Noël » par « noël » : un seul caractère change, et toute l'empreinte est bouleversée !")), champ, sortie);
  };

  global.h = h;
  global.W = W;
})(window);
