/* =========================================================
   NOËL-OS — Le moteur du calendrier (navigateur)
   Tout ce qui compte (dates, réponses, progression) est
   décidé par le serveur : ce fichier ne fait que l'afficher.
   ========================================================= */
(function () {
  'use strict';

  // Le chalet : 4 niveaux de 6 pièces, du haut vers le bas.
  // Quand un niveau est entièrement réparé, ses guirlandes s'allument (et celles du sapin).
  const NIVEAUX = [
    { nom: 'le Grenier', titre: 'Grenier', jours: [3, 22, 23, 8, 7, 12] },
    { nom: "l'Étage", titre: 'Étage', jours: [20, 17, 18, 1, 4, 16] },
    { nom: 'le Rez-de-chaussée', titre: 'Rez-de-chaussée', court: 'Rez-de-ch.', jours: [2, 10, 11, 24, 21, 13] },
    { nom: 'le Sous-sol', titre: 'Sous-sol', jours: [5, 6, 9, 14, 15, 19] },
  ];
  const majuscule = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const COULEURS_BOULES = ['#d62839', '#f5c542', '#2e86de', '#e056fd', '#20bf6b', '#ff9f43', '#00d2d3'];
  const POSITIONS_BOULES = [
    [60, 445], [118, 440], [176, 446], [234, 440], [292, 446], [345, 440], [130, 385], [200, 378], [270, 386],
    [100, 340], [175, 332], [230, 346], [300, 336], [150, 292], [250, 288],
    [130, 246], [200, 240], [268, 248], [160, 200], [240, 196],
    [225, 150], [178, 127], [203, 97],
  ];
  const MESSAGES_ERREUR = [
    '❄️ Le système reste gelé… Ce n\'est pas la bonne réponse.',
    '🦌 Les rennes secouent la tête. Essaie encore !',
    '🧊 Dans les câbles, {givrin} ricane… Mauvaise réponse.',
    '👹 « Raté ! » se moque {givrin}. Essaie encore !',
    '🎅 « Ho ho… non ! » Réessaie, tu n\'es peut-être pas loin.',
    '🔒 Accès refusé. Relis bien l\'énigme !',
  ];

  /* ---------- Préférences locales (le reste est sur le serveur) ---------- */
  const CLE = 'noelos-preferences';
  const prefs = (() => { try { return Object.assign({ introVue: false }, JSON.parse(localStorage.getItem(CLE)) || {}); } catch (e) { return { introVue: false }; } })();
  const sauverPrefs = () => { try { localStorage.setItem(CLE, JSON.stringify(prefs)); } catch (e) { /* tant pis */ } };
  // Les deux curseurs du panneau 🔊 (de 0 à 1). Les anciens boutons 🔔 et 🎵 étaient de simples
  // interrupteurs : un son coupé avant reste coupé. (Les voix du Père Noël et des Kères, par la synthèse
  // vocale du navigateur, ont été retirées le 2026-11-12 : jugées « terrifiantes ».)
  const VOLUMES_DEFAUT = { volMusique: 0.7, volSons: 0.7 };
  if (prefs.volMusique === undefined) prefs.volMusique = prefs.musique === false ? 0 : VOLUMES_DEFAUT.volMusique;
  if (prefs.volSons === undefined) prefs.volSons = prefs.son === false ? 0 : VOLUMES_DEFAUT.volSons;
  delete prefs.musique; delete prefs.son; delete prefs.volVoix;

  let S = null; // état renvoyé par le serveur

  async function appel(methode, url, corps) {
    let r;
    try {
      r = await fetch(url, { method: methode, credentials: 'same-origin', headers: Object.assign({ 'X-Langue': I18N.langue }, corps ? { 'Content-Type': 'application/json' } : {}), body: corps ? JSON.stringify(corps) : undefined });
    } catch (e) {
      const err = new Error(t('📡 Impossible de joindre le Pôle Nord. Vérifie ta connexion !'));
      err.reseau = true;
      throw err;
    }
    let data = null;
    try { data = await r.json(); } catch (e) { /* pas de JSON */ }
    if (!r.ok) {
      const err = new Error((data && data.message) || t('📡 Le serveur du Pôle Nord ne répond pas correctement.'));
      err.status = r.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  const etatDe = (n) => (S ? S.jours[n - 1].etat : 'verrouille');
  const estResolu = (n) => etatDe(n) === 'resolu';
  const nbResolus = () => (S ? S.jours.filter(j => j.etat === 'resolu').length : 0);
  const dateTexte = I18N.dateTexte;

  /* ---------- Petits outils d'interface ---------- */
  const $ = (sel) => document.querySelector(sel);
  let minuteurToast;
  function toast(html) {
    const t = $('#toast');
    t.innerHTML = html;
    t.classList.add('visible');
    clearTimeout(minuteurToast);
    minuteurToast = setTimeout(() => t.classList.remove('visible'), 3800);
  }

  // Sons de clochettes, synthétisés (aucun fichier audio). Tout passe par une sortie commune,
  // réglée par le curseur « Bruitages » : avec un casque, les anciens niveaux faisaient mal.
  let ctxAudio, sortieSons;
  const BASE_SONS = 0.8;
  const gainSons = () => BASE_SONS * prefs.volSons * prefs.volSons;
  function reglerSons() { if (sortieSons) sortieSons.gain.setTargetAtTime(gainSons(), ctxAudio.currentTime, 0.03); }
  function son(type, i = 0) {
    if (!(prefs.volSons > 0)) return;
    try {
      if (!ctxAudio) {
        ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
        sortieSons = ctxAudio.createGain();
        sortieSons.gain.value = gainSons();
        sortieSons.connect(ctxAudio.destination);
      }
      if (ctxAudio.state === 'suspended') ctxAudio.resume().catch(() => {});
      const t0 = ctxAudio.currentTime + 0.02;
      const cloche = (f, t, duree, volume) => {
        [[1, 1], [2.76, 0.35], [5.4, 0.15]].forEach(([mult, part]) => {
          const o = ctxAudio.createOscillator();
          const g = ctxAudio.createGain();
          o.type = 'sine';
          o.frequency.value = f * mult;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(volume * part, t + 0.008);
          g.gain.exponentialRampToValueAtTime(0.0001, t + duree / mult);
          o.connect(g).connect(sortieSons);
          o.start(t);
          o.stop(t + duree + 0.05);
        });
      };
      // Un souffle de bruit filtré : vent, glace qui craque, éclats
      const bruit = (t, duree, volume, { type = 'bandpass', freq = 800, q = 0.7, attaque = 0.01 } = {}) => {
        const n = Math.max(1, Math.floor(ctxAudio.sampleRate * duree));
        const tampon = ctxAudio.createBuffer(1, n, ctxAudio.sampleRate);
        const d = tampon.getChannelData(0);
        for (let k = 0; k < n; k++) d[k] = Math.random() * 2 - 1;
        const src = ctxAudio.createBufferSource();
        src.buffer = tampon;
        const filtre = ctxAudio.createBiquadFilter();
        filtre.type = type; filtre.frequency.value = freq; filtre.Q.value = q;
        const g = ctxAudio.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(volume, t + attaque);
        g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
        src.connect(filtre).connect(g).connect(sortieSons);
        src.start(t);
        src.stop(t + duree + 0.05);
        return filtre;
      };
      if (type === 'victoire') [1318.5, 1568, 2093, 2637].forEach((f, i) => cloche(f, t0 + i * 0.1, 1.4, 0.12));
      // Le vent glacé de Kryos qui se lève
      else if (type === 'vent') {
        const f = bruit(t0, 3.4, 0.11, { freq: 380, q: 1.4, attaque: 1.1 });
        f.frequency.setValueAtTime(320, t0);
        f.frequency.linearRampToValueAtTime(950, t0 + 1.7);
        f.frequency.linearRampToValueAtTime(420, t0 + 3.4);
      }
      // La glace qui craque : un claquement sec et un coup sourd
      else if (type === 'craque') {
        bruit(t0, 0.28, 0.13, { type: 'highpass', freq: 1700, attaque: 0.006 });
        bruit(t0 + 0.06, 0.2, 0.07, { type: 'highpass', freq: 3200, attaque: 0.005 });
        cloche(68, t0, 0.35, 0.24);
      }
      // Le ricanement du tyran : « Ha… ha… ha… ha ! », de plus en plus grave
      else if (type === 'ricane') {
        [0, 1, 2, 3].forEach(k => {
          const t = t0 + k * 0.19;
          const o = ctxAudio.createOscillator();
          const filtre = ctxAudio.createBiquadFilter();
          const g = ctxAudio.createGain();
          o.type = 'sawtooth';
          o.frequency.setValueAtTime(205 - k * 16, t);
          o.frequency.exponentialRampToValueAtTime(150 - k * 14, t + 0.15);
          filtre.type = 'lowpass'; filtre.frequency.value = 1000; filtre.Q.value = 5;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.09, t + 0.025);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
          o.connect(filtre).connect(g).connect(sortieSons);
          o.start(t);
          o.stop(t + 0.2);
        });
      }
      // Une Kère qui vole en éclats : une pluie de petits cristaux
      else if (type === 'eclat') {
        bruit(t0, 0.35, 0.09, { type: 'highpass', freq: 2500, attaque: 0.005 });
        for (let k = 0; k < 9; k++) cloche(2200 + Math.random() * 2600, t0 + Math.random() * 0.3, 0.45, 0.035);
      }
      // La glace qui fond : un carillon qui monte
      else if (type === 'degel') [1046.5, 1318.5, 1568, 2093, 2637, 3136].forEach((f, k) => cloche(f, t0 + k * 0.22, 1.6, 0.06));
      else if (type === 'erreur') [392, 311].forEach((f, i) => cloche(f, t0 + i * 0.14, 0.5, 0.1));
      // Une note par boule qui s'allume : la gamme monte avec le sapin
      else if (type === 'note') cloche([523.25, 587.33, 659.25, 783.99, 880][i % 5] * 2 ** (Math.floor(i / 5) % 3), t0, 0.9, 0.05);
      // Le givre qui craque : une cascade de notes aiguës qui descend
      else if (type === 'givre') [3136, 2637, 2217, 1865, 1568].forEach((f, k) => cloche(f, t0 + k * 0.045, 0.7, 0.035));
      // Le sceau de cire qu'on appose : un coup sourd
      else if (type === 'tampon') cloche(98, t0, 0.35, 0.22);
      // La lettre magique qui arrive de loin à travers la tempête : un souffle qui enfle, des clochettes
      else if (type === 'envol') {
        const f = bruit(t0, 2, 0.08, { freq: 420, q: 1.3, attaque: 1.5 });
        f.frequency.setValueAtTime(380, t0);
        f.frequency.exponentialRampToValueAtTime(1700, t0 + 1.9);
        [2637, 3136, 3520, 4186].forEach((fr, k) => cloche(fr, t0 + 0.35 + k * 0.4, 0.6, 0.025));
      }
      // Le changement d'ambiance (« J'accepte la mission ! ») : un coup sourd qui fait trembler le sol
      else if (type === 'boum') {
        const o = ctxAudio.createOscillator(), g = ctxAudio.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(95, t0);
        o.frequency.exponentialRampToValueAtTime(38, t0 + 1.1);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.42, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.6);
        o.connect(g).connect(sortieSons);
        o.start(t0);
        o.stop(t0 + 1.7);
        bruit(t0, 0.9, 0.1, { type: 'lowpass', freq: 260, q: 0.8, attaque: 0.01 });
      }
      // Un pas sur le parquet du couloir
      else if (type === 'pas') { bruit(t0, 0.09, 0.09, { type: 'lowpass', freq: 420, attaque: 0.004 }); bruit(t0 + 0.24, 0.08, 0.07, { type: 'lowpass', freq: 380, attaque: 0.004 }); }
      // Monter ou descendre l'escalier : des pas sur les marches en bois
      else if (type === 'escalier') for (let k = 0; k < 5; k++) { bruit(t0 + k * 0.17, 0.08, 0.08, { type: 'lowpass', freq: 360 + k * 50, attaque: 0.004 }); cloche(70 + k * 6, t0 + k * 0.17, 0.12, 0.05); }
      // Une porte qui s'ouvre : le loquet, puis le grincement des gonds
      else if (type === 'porte') {
        bruit(t0, 0.05, 0.12, { type: 'bandpass', freq: 2400, q: 3, attaque: 0.002 });
        const f = bruit(t0 + 0.08, 0.7, 0.05, { type: 'bandpass', freq: 600, q: 9, attaque: 0.08 });
        f.frequency.setValueAtTime(520, t0 + 0.08);
        f.frequency.linearRampToValueAtTime(980, t0 + 0.5);
        f.frequency.linearRampToValueAtTime(760, t0 + 0.78);
      }
      // Une porte verrouillée : les chaînes et le cadenas cliquettent
      else if (type === 'verrou') { [0, 0.07, 0.15, 0.26].forEach((d, k) => cloche(1900 + k * 260, t0 + d, 0.18, 0.05)); bruit(t0, 0.3, 0.05, { type: 'highpass', freq: 3000, attaque: 0.003 }); }
      // Le projecteur des lutins qui s'allume : le moteur ronronne, la pellicule cliquette
      else if (type === 'projecteur') {
        const o = ctxAudio.createOscillator(), g = ctxAudio.createGain();
        o.type = 'sawtooth'; o.frequency.value = 55;
        const filtre = ctxAudio.createBiquadFilter(); filtre.type = 'lowpass'; filtre.frequency.value = 240;
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.8);
        o.connect(filtre).connect(g).connect(sortieSons); o.start(t0); o.stop(t0 + 1.9);
        for (let k = 0; k < 26; k++) bruit(t0 + 0.1 + k * 0.06, 0.02, 0.04 * (1 - k / 30), { type: 'bandpass', freq: 3200, q: 2, attaque: 0.002 });
      }
      // Le projecteur passe à la diapo suivante : le clac du passe-vues
      else if (type === 'diapo') { bruit(t0, 0.04, 0.1, { type: 'bandpass', freq: 1500, q: 2, attaque: 0.002 }); bruit(t0 + 0.09, 0.05, 0.07, { type: 'bandpass', freq: 900, q: 2, attaque: 0.002 }); }
      // La Kère surgit : un souffle glacé qui siffle, et des cristaux
      else if (type === 'apparition') {
        const f = bruit(t0, 0.9, 0.08, { freq: 1800, q: 1.2, attaque: 0.25 });
        f.frequency.setValueAtTime(2600, t0);
        f.frequency.exponentialRampToValueAtTime(700, t0 + 0.85);
        [3136, 2637, 2349, 1976].forEach((fr, k) => cloche(fr, t0 + 0.15 + k * 0.06, 0.6, 0.03));
      }
      // La téléportation : la magie monte en tourbillon, une pluie de clochettes, puis l'éclair d'arrivée
      else if (type === 'teleport') {
        const f = bruit(t0, 1.9, 0.12, { freq: 300, q: 2.2, attaque: 1.3 });
        f.frequency.setValueAtTime(260, t0);
        f.frequency.exponentialRampToValueAtTime(4200, t0 + 1.75);
        for (let k = 0; k < 14; k++) cloche(880 * 2 ** (k / 7), t0 + 0.25 + k * 0.095, 0.8, 0.03);
        [1046.5, 1568, 2093, 2637].forEach((fr, k) => cloche(fr, t0 + 1.75 + k * 0.04, 2.2, 0.07));
        cloche(65, t0 + 1.75, 1.2, 0.22);
      }
      else cloche(1760, t0, 0.5, 0.06);
    } catch (e) { /* pas de son */ }
  }

  /* ---------- La musique (le lecteur est dans js/musique.js) ----------
     Pas de musique sur l'écran titre ni sur « Qui es-tu ? », ni pendant la lettre du Père Noël :
     seul le son des vidéos du décor l'accompagne (demande de l'utilisateur, 2026-11-16 : « laisser
     le son des vidéos, enlever le fond pendant la lettre, enlever la musique joyeuse au début »).
     La version sad commence dans le chalet, à l'arrivée, et y reste tant que Kryos règne. Dans une
     pièce, le tic-tac tourne pendant le défi de la Kère (il s'arrête net quand on trouve). Le funk
     revient pour de bon au dégel du 24. */
  let enigmeEnCours = false;   // une pièce est ouverte et son énigme n'est pas résolue
  let sequenceMusicale = null; // 'victoire' ou 'finale' : la scène choisit elle-même la musique
  let coursEnCours = false;    // le projecteur des lutins montre le petit cours
  let jourOuvert = 0;          // la dernière pièce ouverte (le 24, c'est Kryos lui-même : sa propre musique)
  let fonduPrevu = null;
  function majMusique(fondu) {
    const dejaPrevu = fonduPrevu !== null;
    fonduPrevu = fondu ?? fonduPrevu ?? 2.5;
    if (dejaPrevu) return;
    // On attend la fin du clic en cours : la scène qui s'ouvre peut encore choisir sa musique.
    queueMicrotask(() => {
      const f = fonduPrevu;
      fonduPrevu = null;
      if (sequenceMusicale) return;
      const modale = $('#modale');
      // (titreRetenu : le compte vient d'être créé ou ouvert, mais on n'est pas encore arrivé au chalet)
      const connecte = !!(S && S.connecte) && !titreRetenu;
      const dansUnePiece = !modale.hidden && modale.classList.contains('piece-ouverte');
      const lettreOuverte = !modale.hidden && modale.classList.contains('cinema-actif');
      // Devant le chalet : la façade gelée, puis, à partir de la 12e pièce, la façade qui reprend espoir
      const facade = estResolu(24) ? 'funk' : nbResolus() >= 11 ? 'espoir' : 'gelee';
      MUSIQUE.jouer(dansUnePiece && enigmeEnCours ? (jourOuvert === 24 ? 'kryos' : 'tictac')
        : !connecte || lettreOuverte ? null // l'écran titre, « Qui es-tu ? » et la lettre : pas de musique
          : dansUnePiece && coursEnCours ? 'cours'
            : facade, { fondu: f });
    });
  }

  const mouvementReduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Une fenêtre qui se ferme ou change : le décor de la lettre disparaît et la voix se tait.
  function quitterLaLettre() {
    const modale = $('#modale');
    modale.classList.remove('cinema-actif');
    modale.querySelectorAll(':scope > .cinema').forEach(e => e.remove());
  }
  function confettis(nombre = 60) {
    if (mouvementReduit()) return;
    const symboles = ['❄', '★', '✦', '●', '◆', '❅'];
    const couche = h('div', { class: 'confettis', 'aria-hidden': 'true' });
    for (let i = 0; i < nombre; i++) {
      const c = h('span', {}, symboles[i % symboles.length]);
      c.style.left = Math.random() * 100 + 'vw';
      c.style.color = COULEURS_BOULES[i % COULEURS_BOULES.length];
      c.style.fontSize = 10 + Math.random() * 18 + 'px';
      c.style.animationDelay = Math.random() * 0.6 + 's';
      c.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
      c.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
      couche.append(c);
    }
    document.body.append(couche);
    setTimeout(() => couche.remove(), 4000);
  }

  /* ---------- Le sapin ---------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, ...enfants) {
    const e = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v);
    enfants.forEach(c => e.append(c.nodeType ? c : document.createTextNode(String(c))));
    return e;
  }

  /* ---------- Le sapin du jardin (décoratif : il reflète la progression) ---------- */
  // [haut, bas, demi-largeur, nombre de boules], du sommet vers le bas
  const PALIERS = [[62, 132, 50, 1], [96, 182, 76, 2], [134, 236, 102, 3], [176, 292, 126, 3], [222, 348, 148, 4], [268, 404, 168, 5], [314, 460, 186, 5]];
  // Les guirlandes lumineuses du sapin suivent les niveaux du chalet (le bas du sapin = le sous-sol)
  const GROUPE_PALIER = [3, 2, 2, 1, 1, 0, 0];

  const assombrir = (hex, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - k)).toString(16).padStart(2, '0')).join('');

  function cheminPalier(haut, bas, demi, pointes) {
    const g = 200 - demi, d = 200 + demi, pas = (d - g) / pointes;
    let p = `M200 ${haut} Q${(200 + demi * 0.3).toFixed(1)} ${(haut + (bas - haut) * 0.62).toFixed(1)} ${d} ${bas}`;
    for (let i = 0; i < pointes; i++) {
      const x1 = d - pas * i, xm = x1 - pas / 2, x2 = x1 - pas;
      p += ` Q${(x1 - pas * 0.12).toFixed(1)} ${bas + 7} ${xm.toFixed(1)} ${bas + 11} Q${(x2 + pas * 0.12).toFixed(1)} ${bas + 7} ${x2.toFixed(1)} ${bas}`;
    }
    return p + ` Q${(200 - demi * 0.3).toFixed(1)} ${(haut + (bas - haut) * 0.62).toFixed(1)} 200 ${haut} Z`;
  }

  function construireSapin() {
    const svg = $('#sapin');
    svg.setAttribute('viewBox', '0 -26 400 586'); // le haut laisse de la place aux rayons de l'étoile
    svg.innerHTML = '';
    const alea = (() => { let s = 2412; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
    const degradesBoules = COULEURS_BOULES.map((c, i) => `<radialGradient id="boule-${i}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".24" stop-color="${c}"/><stop offset="1" stop-color="${assombrir(c, 0.55)}"/></radialGradient>`).join('');
    const defs = sv('defs', {});
    defs.innerHTML = `
      <linearGradient id="aiguilles" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stop-color="#3fbf74"/><stop offset=".45" stop-color="#1c8048"/><stop offset="1" stop-color="#0a4224"/></linearGradient>
      <linearGradient id="tronc-sapin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a30"/><stop offset="1" stop-color="#4a2a12"/></linearGradient>
      <linearGradient id="or-etoile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".5" stop-color="#f5c542"/><stop offset="1" stop-color="#b8860b"/></linearGradient>
      <radialGradient id="boule-eteinte" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#9aa8b8" stop-opacity=".7"/><stop offset=".25" stop-color="#4a5868"/><stop offset="1" stop-color="#1a2230"/></radialGradient>
      <radialGradient id="halo-sapin" cx="0.5" cy="0.55" r="0.5"><stop offset="0" stop-color="#ffe9a8" stop-opacity="0.3"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
      ${degradesBoules}
      <filter id="ombre-palier" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
      <filter id="lueur" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.5" result="flou"/><feMerge><feMergeNode in="flou"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    svg.append(defs);

    svg.append(sv('ellipse', { cx: 200, cy: 285, rx: 200, ry: 285, fill: 'url(#halo-sapin)', class: 'halo-sapin' }));
    svg.append(sv('ellipse', { cx: 200, cy: 532, rx: 196, ry: 22, class: 'sol-neige' }));

    // Pied du sapin : tronc et pot
    svg.append(sv('rect', { x: 186, y: 452, width: 28, height: 40, fill: 'url(#tronc-sapin)' }));
    svg.append(sv('path', { d: 'M150 480 L250 480 L240 528 L160 528 Z', fill: '#a81828', stroke: '#6d0f1b', 'stroke-width': 2 }));
    svg.append(sv('rect', { x: 146, y: 474, width: 108, height: 12, rx: 3, fill: '#c9a35a' }));
    svg.append(sv('rect', { x: 156, y: 500, width: 88, height: 6, fill: '#f5c542', opacity: 0.8 }));

    // Les branches, du bas vers le haut (chaque palier recouvre celui du dessous)
    const groupes = [...PALIERS.keys()].reverse();
    const positions = [];
    groupes.forEach(k => {
      const [haut, bas, demi, nb] = PALIERS[k];
      const pointes = Math.round(demi / 14);
      const chemin = cheminPalier(haut, bas, demi, pointes);
      svg.append(sv('path', { d: chemin, fill: '#03140a', opacity: 0.55, transform: 'translate(0 7)', filter: 'url(#ombre-palier)' }));
      svg.append(sv('path', { d: chemin, fill: 'url(#aiguilles)', stroke: '#083a1e', 'stroke-width': 1.5, 'stroke-linejoin': 'round', class: 'palier' }));
      // Texture d'aiguilles
      for (let i = 0; i < 9; i++) {
        const t = (i + 0.5) / 9, x = 200 - demi * 0.85 + t * demi * 1.7, y1 = haut + (bas - haut) * 0.55, y2 = bas - 4;
        svg.append(sv('path', { d: `M${(200 + (x - 200) * 0.4).toFixed(1)} ${y1.toFixed(1)} Q${x.toFixed(1)} ${(y1 + 14).toFixed(1)} ${x.toFixed(1)} ${y2}`, stroke: t < 0.45 ? '#5fd68f' : '#06351a', 'stroke-width': 1.4, fill: 'none', opacity: 0.45 }));
      }
      // Neige sur le bout des branches et sur le dessus
      const pas = (2 * demi) / pointes;
      for (let i = 0; i < pointes; i += 2) svg.append(sv('ellipse', { cx: (200 + demi - pas * (i + 0.5)).toFixed(1), cy: bas + 7, rx: 7, ry: 3.4, fill: '#f4f9ff', opacity: 0.95 }));
      svg.append(sv('path', { d: `M${200 - demi * 0.25} ${haut + (bas - haut) * 0.32} Q${200 - demi * 0.5} ${haut + (bas - haut) * 0.62} ${200 - demi * 0.82} ${bas - 6}`, stroke: '#ffffff', 'stroke-width': 3.2, 'stroke-linecap': 'round', fill: 'none', opacity: 0.55 }));
      // Guirlande de perles dorées
      const sens = k % 2 ? 1 : -1;
      svg.append(sv('path', { d: `M${200 - sens * demi * 0.78} ${bas - (bas - haut) * 0.42} Q200 ${bas - 4} ${200 + sens * demi * 0.86} ${bas - (bas - haut) * 0.12}`, stroke: '#f5c542', 'stroke-width': 4.2, 'stroke-dasharray': '0.1 7.5', 'stroke-linecap': 'round', fill: 'none', class: 'perles' }));
      // Lumières de la guirlande (allumées quand le niveau du chalet correspondant est complet)
      const n = Math.round(demi / 18);
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n, x = 200 - demi * 0.8 + t * demi * 1.6, y = bas - (bas - haut) * 0.25 + Math.sin(t * Math.PI) * 10;
        const l = sv('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 3.4, class: 'lumiere-sapin', 'data-groupe': GROUPE_PALIER[k] });
        l.style.setProperty('--couleur', COULEURS_BOULES[(i + k) % COULEURS_BOULES.length]);
        l.style.animationDelay = (alea() * 2).toFixed(2) + 's';
        svg.append(l);
      }
      // Emplacements des boules, accrochées sous les branches
      for (let i = 0; i < nb; i++) {
        const t = nb === 1 ? 0.5 : i / (nb - 1);
        positions.push({ x: 200 - demi * 0.62 + t * demi * 1.24, y: bas - 10 - (i % 2) * 16, r: k < 2 ? 9 : k < 4 ? 10.5 : 12 });
      }
    });

    // Paillettes qui scintillent
    for (let i = 0; i < 30; i++) {
      const k = Math.floor(alea() * PALIERS.length), [haut, bas, demi] = PALIERS[k];
      const y = haut + (bas - haut) * (0.5 + alea() * 0.45), x = 200 + (alea() * 2 - 1) * demi * ((y - haut) / (bas - haut)) * 0.8;
      const p = sv('text', { x: x.toFixed(0), y: y.toFixed(0), class: 'paillette', 'text-anchor': 'middle' }, '✦');
      p.style.animationDelay = (alea() * 4).toFixed(2) + 's';
      svg.append(p);
    }

    // Les boules : une par énigme (jours 1 à 23), du bas vers le haut
    positions.slice(0, 23).forEach((pos, i) => {
      const jour = i + 1;
      const couleur = i % COULEURS_BOULES.length;
      const g = sv('g', { class: 'boule-sapin', 'data-jour': jour, 'data-couleur': couleur });
      g.append(sv('line', { x1: pos.x, y1: pos.y - pos.r - 7, x2: pos.x, y2: pos.y - pos.r, stroke: '#d9bf73', 'stroke-width': 1.2 }));
      g.append(sv('rect', { x: pos.x - 3.5, y: pos.y - pos.r - 3, width: 7, height: 4.5, rx: 1, fill: '#d9bf73' }));
      g.append(sv('circle', { cx: pos.x, cy: pos.y, r: pos.r, class: 'sphere', fill: 'url(#boule-eteinte)' }));
      g.append(sv('ellipse', { cx: pos.x - pos.r * 0.35, cy: pos.y - pos.r * 0.4, rx: pos.r * 0.28, ry: pos.r * 0.18, fill: '#fff', opacity: 0.55, class: 'reflet-boule' }));
      svg.append(g);
    });

    // Cadeaux au pied du sapin (un par niveau du chalet terminé)
    [[96, 506, 44, 34, '#2e86de', '#f5c542'], [150, 516, 36, 28, '#d62839', '#ffffff'], [252, 514, 40, 30, '#20bf6b', '#d62839'], [306, 504, 46, 36, '#e056fd', '#f5c542']].forEach(([x, y, l, hh, c, ruban], i) => {
      const g = sv('g', { class: 'cadeau-sapin', 'data-etage': i });
      g.append(sv('rect', { x: x - l / 2, y: y - hh, width: l, height: hh, rx: 3, fill: c }));
      g.append(sv('rect', { x: x - 3, y: y - hh, width: 6, height: hh, fill: ruban }));
      g.append(sv('rect', { x: x - l / 2, y: y - hh / 2 - 3, width: l, height: 6, fill: ruban }));
      g.append(sv('path', { d: `M${x} ${y - hh} q-12 -12 -14 -2 q4 6 14 2 q12 -12 14 -2 q-4 6 -14 2`, fill: ruban }));
      svg.append(g);
    });

    // L'étoile (jour 24)
    const etoile = sv('g', { class: 'etoile-sapin2' });
    for (let k = 0; k < 12; k++) {
      const a = k * Math.PI / 6, l = k % 2 ? 46 : 70;
      etoile.append(sv('line', { x1: 200, y1: 48, x2: (200 + l * Math.cos(a)).toFixed(1), y2: (48 + l * Math.sin(a)).toFixed(1), class: 'rayon' }));
    }
    let pts = '';
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 13 : 32;
      pts += `${(200 + r * Math.cos(a)).toFixed(1)},${(48 + r * Math.sin(a)).toFixed(1)} `;
    }
    etoile.append(sv('polygon', { points: pts.trim(), class: 'branches' }));
    svg.append(etoile);
  }

  const classeEtat = (n) => ({ resolu: 'resolue', disponible: 'disponible', ferme: 'fermee' }[etatDe(n)] || 'verrouillee');

  function majSapin(nouveau) {
    let allumees = 0;
    document.querySelectorAll('#sapin .boule-sapin').forEach(el => {
      const n = +el.dataset.jour;
      const allumee = estResolu(n);
      if (allumee) allumees++;
      el.classList.toggle('allumee', allumee);
      el.querySelector('.sphere').setAttribute('fill', allumee ? `url(#boule-${el.dataset.couleur})` : 'url(#boule-eteinte)');
      if (nouveau === n) { el.classList.add('vient-de-s-allumer'); setTimeout(() => el.classList.remove('vient-de-s-allumer'), 1600); }
    });
    const etoile = document.querySelector('#sapin .etoile-sapin2');
    if (etoile) etoile.classList.toggle('allumee', estResolu(24));
    NIVEAUX.forEach((nv, i) => {
      const complet = nv.jours.every(estResolu);
      const groupe = 3 - i;
      document.querySelectorAll(`#sapin .lumiere-sapin[data-groupe="${groupe}"]`).forEach(l => l.classList.toggle('allumee', complet));
      const cadeau = document.querySelector(`#sapin .cadeau-sapin[data-etage="${groupe}"]`);
      if (cadeau) cadeau.classList.toggle('visible', complet);
      const niveau = document.querySelector(`#chalet .niveau[data-niveau="${i}"]`);
      if (niveau) niveau.classList.toggle('complet', complet);
    });
    $('#sapin').setAttribute('aria-label', t(I18N.pluriel(allumees) ? 'Sapin de Noël : {n} boules allumées sur 23' : 'Sapin de Noël : {n} boule allumée sur 23', { n: allumees }) + (estResolu(24) ? t(", et l'étoile brille") : ''));
    document.body.classList.toggle('noel-sauve', estResolu(24));
  }

  // Renvoie le numéro du niveau du chalet si toutes ses pièces sont réparées, sinon -1.
  function etageComplete(n) {
    const i = NIVEAUX.findIndex(nv => nv.jours.includes(n));
    return i >= 0 && NIVEAUX[i].jours.every(estResolu) ? i : -1;
  }

  /* ---------- Le sapin en grand : il prend tout l'écran pour qu'on voie son animation ----------
     - après chaque pièce réparée (en revenant au chalet) : la nouvelle boule s'allume ;
     - avec le bouton « Admirer le sapin » ou le 24 décembre : tout le sapin se rallume, du bas vers l'étoile. */
  let vitrine = null;         // { fermer } quand le sapin est affiché en grand
  let jourACelebrer = null;   // pièce tout juste réparée : sa boule s'allumera en grand au retour au chalet

  // Gerbe d'étincelles autour d'un point du sapin (coordonnées du dessin)
  function eclat(svg, x, y, couleur, grand) {
    const g = sv('g', { class: 'eclat' });
    g.append(sv('circle', { cx: x, cy: y, r: grand ? 34 : 15, class: 'onde', stroke: couleur }));
    const nb = grand ? 18 : 10;
    for (let i = 0; i < nb; i++) {
      const a = (i / nb) * Math.PI * 2 + Math.random() * 0.5, d = (grand ? 80 : 32) + Math.random() * (grand ? 50 : 20);
      const p = sv('circle', { cx: x, cy: y, r: ((grand ? 3.4 : 2.2) + Math.random() * 1.6).toFixed(1), class: 'etincelle', fill: i % 3 ? couleur : '#fff8d6' });
      p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
      p.style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
      g.append(p);
    }
    svg.append(g);
    setTimeout(() => g.remove(), 1500);
  }

  function admirerSapin(options = {}) {
    if (vitrine) return;
    const svg = $('#sapin');
    const avant = document.activeElement;
    const animer = !mouvementReduit();
    const nouveau = options.nouveau || null;

    // Une place vide garde la mise en page pendant que le sapin est « sorti »
    const place = h('div', { class: 'place-sapin', 'aria-hidden': 'true' });
    place.style.height = svg.getBoundingClientRect().height + 'px';
    svg.replaceWith(place);

    const compte = h('p', { class: 'vitrine-compte' });
    const message = h('p', { class: 'vitrine-message' });
    const bouton = h('button', { type: 'button', class: 'btn btn-principal' }, t('🏡 Retour au chalet'));
    const couche = h('div', { class: 'vitrine-sapin', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('Le sapin du jardin') },
      h('div', { class: 'vitrine-cadre' },
        h('div', { class: 'vitrine-scene' }, svg),
        h('div', { class: 'vitrine-legende' }, compte, message, bouton)));

    // Ce qui va s'allumer sous nos yeux (le reste est déjà allumé)
    const boules = [...svg.querySelectorAll('.boule-sapin.allumee')].sort((a, b) => a.dataset.jour - b.dataset.jour);
    const boulesARejouer = nouveau ? boules.filter(b => +b.dataset.jour === nouveau) : boules;
    const etage = nouveau ? etageComplete(nouveau) : -1;
    const groupes = nouveau ? (etage >= 0 ? [3 - etage] : []) : [0, 1, 2, 3].filter(g => NIVEAUX[3 - g].jours.every(estResolu));
    const etoile = svg.querySelector('.etoile-sapin2.allumee');
    const etoileARejouer = etoile && (!nouveau || nouveau === 24) ? etoile : null;

    let allumees = boules.length - (animer ? boulesARejouer.length : 0);
    const majCompte = () => {
      compte.innerHTML = t(I18N.pluriel(allumees) ? '<b>{n}</b> / 23 boules allumées' : '<b>{n}</b> / 23 boule allumée', { n: allumees });
    };
    const reste = 24 - nbResolus();
    const texteFinal = () => {
      if (estResolu(24)) return t("🌟 <b>L'étoile est rallumée ! NOËL EST SAUVÉ !</b>");
      let texte = nouveau ? t('✨ La boule n°{n} brille à nouveau !', { n: nouveau })
        : boules.length ? t("🎄 Chaque boule allumée, c'est une pièce du chalet réparée !") : t('Répare une pièce du chalet pour rallumer la première boule !');
      if (etage >= 0) texte += `<span class="petit">${t('✨ Tout {niveau} est réparé : ses guirlandes brillent !', { niveau: t(NIVEAUX[etage].nom) })}</span>`;
      else if (boules.length) texte += `<span class="petit">${t(I18N.pluriel(reste) ? "Encore {r} pièces à réparer pour rallumer l'étoile." : "Encore {r} pièce à réparer pour rallumer l'étoile.", { r: reste })}</span>`;
      return texte;
    };
    // (espaces insécables avant « ! : ; ? » pour qu'ils ne restent jamais seuls en début de ligne)
    const montrerMessage = () => { message.innerHTML = texteFinal().replace(/ ([!?:;])/g, ' $1'); message.classList.add('visible'); };
    majCompte();

    const minuteurs = [];
    const plus = (ms, f) => minuteurs.push(setTimeout(f, ms));
    let ferme = false;
    const fermer = () => {
      if (ferme) return;
      ferme = true;
      minuteurs.forEach(clearTimeout);
      svg.querySelectorAll('.en-attente').forEach(el => el.classList.remove('en-attente'));
      couche.classList.add('sortie');
      const fin = () => {
        svg.querySelectorAll('.eclat').forEach(el => el.remove());
        svg.querySelectorAll('.vient-de-s-allumer, .tombe').forEach(el => el.classList.remove('vient-de-s-allumer', 'tombe'));
        svg.classList.remove('zoom-boule');
        svg.style.transformOrigin = '';
        place.replaceWith(svg);
        couche.remove();
        $('#jeu').inert = false;
        document.body.classList.remove('vitrine-ouverte');
        vitrine = null;
        if (avant && avant.focus && document.contains(avant)) avant.focus({ preventScroll: true });
      };
      animer ? setTimeout(fin, 380) : fin();
    };
    vitrine = { fermer };
    couche.addEventListener('click', fermer);

    if (animer) {
      // On éteint ce qui doit se rallumer, puis on le rallume pas à pas
      boulesARejouer.forEach(b => b.classList.add('en-attente'));
      groupes.forEach(g => {
        svg.querySelectorAll(`.lumiere-sapin.allumee[data-groupe="${g}"]`).forEach(l => l.classList.add('en-attente'));
        const cadeau = svg.querySelector(`.cadeau-sapin.visible[data-etage="${g}"]`);
        if (cadeau) cadeau.classList.add('en-attente');
      });
      if (etoileARejouer) etoileARejouer.classList.add('en-attente');

      let instant = 750;
      // Une seule boule (la pièce du jour) : la caméra s'approche d'elle pendant qu'elle s'allume
      const zoom = boulesARejouer.length === 1;
      if (zoom) {
        const s = boulesARejouer[0].querySelector('.sphere');
        svg.style.transformOrigin = `${(+s.getAttribute('cx') / 400 * 100).toFixed(1)}% ${((+s.getAttribute('cy') + 26) / 586 * 100).toFixed(1)}%`;
        plus(350, () => svg.classList.add('zoom-boule'));
        instant = 1150;
      }
      const pas = boulesARejouer.length > 1 ? Math.max(90, Math.min(220, 2600 / boulesARejouer.length)) : 0;
      boulesARejouer.forEach((b, i) => {
        plus(instant + i * pas, () => {
          b.classList.remove('en-attente');
          b.classList.add('vient-de-s-allumer');
          const s = b.querySelector('.sphere');
          eclat(svg, +s.getAttribute('cx'), +s.getAttribute('cy'), COULEURS_BOULES[b.dataset.couleur], boulesARejouer.length === 1);
          son('note', boulesARejouer.length === 1 ? 7 : i);
          allumees++;
          majCompte();
          plus(1600, () => b.classList.remove('vient-de-s-allumer'));
        });
      });
      instant += boulesARejouer.length * pas + (boulesARejouer.length ? 500 : 0);
      if (zoom) instant = 3200; // on attend que la caméra recule (pour voir les guirlandes, et ne pas cacher le texte)
      if (nouveau) plus(instant, montrerMessage);

      // Les guirlandes s'allument niveau par niveau, du bas vers le haut, et leur cadeau tombe au pied du sapin
      groupes.forEach((g, k) => {
        const debut = instant + k * 450;
        const lumieres = [...svg.querySelectorAll(`.lumiere-sapin.en-attente[data-groupe="${g}"]`)].sort((a, b) => a.getAttribute('cx') - b.getAttribute('cx'));
        lumieres.forEach((l, i) => plus(debut + i * 28, () => l.classList.remove('en-attente')));
        const cadeau = svg.querySelector(`.cadeau-sapin.en-attente[data-etage="${g}"]`);
        if (cadeau) plus(debut + 150, () => { cadeau.classList.remove('en-attente'); cadeau.classList.add('tombe'); });
        plus(debut, () => son('note', 10 + k));
      });
      instant += groupes.length ? groupes.length * 450 + 400 : 0;

      // Pour finir, l'étoile
      if (etoileARejouer) {
        plus(instant, () => {
          etoileARejouer.classList.remove('en-attente');
          etoileARejouer.classList.add('vient-de-s-allumer');
          eclat(svg, 200, 48, '#f5c542', true);
          couche.classList.add('etoile');
          son('victoire');
          if (options.finale) confettis(120);
        });
        instant += 900;
      }
      if (!nouveau) plus(instant, montrerMessage);
    } else {
      montrerMessage();
      if (etoile) couche.classList.add('etoile');
    }

    document.body.append(couche);
    $('#toast').classList.remove('visible'); // le message du sapin dit déjà la même chose
    document.body.classList.add('vitrine-ouverte');
    $('#jeu').inert = true;
    bouton.focus({ preventScroll: true });
  }

  /* ---------- Le chalet du Père Noël ---------- */
  function construireChalet() {
    const c = $('#chalet');
    c.innerHTML = '';
    c.append(h('div', { class: 'toit', html: PIECES.toit() }));
    calqueAnime(c.querySelector('.toit-svg'), '.d-fumee');
    const facade = h('div', { class: 'facade' });
    NIVEAUX.forEach((nv, i) => {
      if (i === NIVEAUX.length - 1) facade.append(h('div', { class: 'sol-exterieur', 'aria-hidden': 'true' }));
      const pieces = h('div', { class: 'pieces' });
      nv.jours.forEach(n => {
        const b = h('button', { type: 'button', class: 'piece-chalet' + (n === 24 ? ' piece-24' : ''), 'data-jour': n },
          h('span', { class: 'piece-scene' }),
          h('span', { class: 'piece-lueur', 'aria-hidden': 'true' }),
          // La Kère qui hante la pièce tant qu'elle n'est pas réparée (Kryos en personne au 24)
          h('span', { class: 'piece-givrin', 'aria-hidden': 'true', html: kereHTML(n === 24) }),
          h('span', { class: 'piece-numero' }, n),
          h('span', { class: 'piece-etiquette' }));
        b.addEventListener('click', () => ouvrirJour(n, b));
        pieces.append(b);
      });
      facade.append(h('section', { class: 'niveau' + (i === NIVEAUX.length - 1 ? ' sous-sol' : ''), 'data-niveau': i, 'aria-label': t(nv.titre) },
        h('div', { class: 'guirlande-niveau', 'aria-hidden': 'true' }),
        h('div', { class: 'nom-niveau' }, t(nv.titre)),
        pieces));
    });
    c.append(facade);
  }

  // La prochaine case du calendrier à ouvrir : la plus petite pièce ouverte et pas encore réparée.
  const prochainePorte = () => { for (let n = 1; n <= 24; n++) if (etatDe(n) === 'disponible') return n; return null; };

  const dejaDessinee = new Map(); // évite de redessiner les pièces à chaque rafraîchissement
  function majChalet() {
    const prochaine = prochainePorte();
    document.querySelectorAll('#chalet .piece-chalet').forEach(b => {
      const n = +b.dataset.jour;
      const c = classeEtat(n);
      const info = S && S.jours[n - 1];
      b.classList.remove('resolue', 'disponible', 'verrouillee', 'fermee');
      b.classList.add(c);
      b.classList.toggle('prochaine', n === prochaine); // (en mode économe, seule celle-ci s'anime)
      const version = info && info.piece ? 'ouverte' : 'fermee';
      if (dejaDessinee.get(n) !== version) {
        // La scène de l'énigme, immobile et sans sa Kère (la case a déjà la sienne, qui la hante)
        b.querySelector('.piece-scene').innerHTML = info && info.piece ? ((window.SCENES && SCENES.dessiner(n, info.piece, { sansKere: true })) || PIECES.interieur(info.piece, n)) : PIECES.fermee(n);
        dejaDessinee.set(n, version);
      }
      const etiquette = b.querySelector('.piece-etiquette');
      etiquette.innerHTML = '';
      if (c === 'verrouillee') etiquette.append('🔒 ' + I18N.dateCourte(n));
      else if (c === 'fermee') etiquette.append(t('⌛ Fermée'));
      else etiquette.append(h('span', { class: 'piece-icone' }, c === 'resolue' ? '✓' : '✨'), h('span', { class: 'piece-nom' }, info.univers));
      b.title = info && info.univers ? info.univers : '';
      b.setAttribute('aria-label', `${t('Pièce {n}', { n })}${info && info.univers ? ' : ' + info.univers : ''} — ${{ resolue: t('réparée'), disponible: t('ouverte, entre !'), fermee: t('fermée'), verrouillee: t("s'ouvre le {d}", { d: dateTexte(n) }) }[c]}`);
    });
  }

  function majProgression() {
    const n = nbResolus();
    $('#barre').style.width = (n / 24 * 100) + '%';
    $('#progression-texte').textContent = `${n} / 24`;
    $('.hud-progression').title = t(I18N.pluriel(n) ? '{n} pièces réparées sur 24' : '{n} pièce réparée sur 24', { n });
    const statut = $('#statut-noelos');
    if (n === 24) { statut.textContent = t('🟢 NOËL-OS : opérationnel — Noël est sauvé !'); statut.className = 'statut ok'; }
    else if (n > 0) { statut.textContent = t('🟠 NOËL-OS : dégel en cours ({p} %)', { p: Math.round(n / 24 * 100) }); statut.className = 'statut moyen'; }
    else { statut.textContent = t('🔴 NOËL-OS : système gelé par Kryos'); statut.className = 'statut gele'; }
    $('#btn-fragments').querySelector('.nb').textContent = S ? S.fragments.filter(f => f.lettre).length : 0;
    $('#btn-reinitialiser').hidden = !(S && S.modeTest);
  }

  let cibleRebours = null;
  function majCompteRebours() {
    const zone = $('#compte-rebours');
    const titre = $('#rebours-titre');
    titre.hidden = !(S && cibleRebours && cibleRebours.jour === 1);
    if (!S) { zone.hidden = true; return; }
    if (S.modeTest) { zone.hidden = false; zone.innerHTML = t('🧪 <b>Mode test</b> (serveur) : toutes les pièces sont ouvertes.'); return; }
    if (!cibleRebours) { zone.hidden = true; return; }
    const ms = cibleRebours.instant - Date.now();
    if (ms <= 0) { cibleRebours = null; rafraichir(); return; }
    const j = Math.floor(ms / 86400000), hh = Math.floor((ms % 86400000) / 3600000), mm = Math.floor((ms % 3600000) / 60000);
    const quand = j > 0 ? `${j} ${I18N.langue === 'en' ? 'd' : 'j'} ${hh} h` : `${hh} h ${mm} min`;
    zone.hidden = false;
    titre.innerHTML = t("⏳ La première pièce s'ouvre le <b>1er décembre</b>, dans <b>{quand}</b>", { quand });
    zone.innerHTML = cibleRebours.jour === 1
      ? t("⏳ La première pièce du chalet s'ouvre le <b>1er décembre {annee}</b>, dans <b>{quand}</b>.", { annee: S.annee, quand })
      : t('⏳ Prochaine pièce (jour {j}) dans <b>{quand}</b>.', { j: cibleRebours.jour, quand });
  }

  async function rafraichir(nouveau) {
    try {
      S = await appel('GET', '/api/etat');
      cibleRebours = S.prochaine ? { jour: S.prochaine.jour, instant: Date.now() + S.prochaine.dans } : null;
      majSapin(nouveau);
      majChalet();
      majProgression();
      majCompteRebours();
      majSalut();
      majEcrans();
      majMusique();
      document.body.classList.remove('hors-ligne');
    } catch (e) {
      document.body.classList.add('hors-ligne');
      toast(e.message);
    }
  }

  /* ---------- Les fenêtres ---------- */
  let dernierFocus = null;
  function ouvrirModale(contenu, options = {}) {
    if (vitrine) vitrine.fermer();
    quitterLaLettre();
    const modale = $('#modale');
    modale.classList.toggle('piece-ouverte', !!options.piece);
    modale.querySelector('.fermer').textContent = options.piece ? t('🏡 Chalet') : '✕';
    modale.querySelector('.fermer').setAttribute('aria-label', options.piece ? t('Retour au chalet') : t('Fermer'));
    const zone = $('#contenu-modale');
    zone.innerHTML = '';
    zone.append(contenu);
    if (modale.hidden) dernierFocus = document.activeElement;
    modale.hidden = false;
    document.body.classList.add('modale-ouverte');
    modale.scrollTop = 0;
    setTimeout(() => modale.querySelector('.fermer').focus({ preventScroll: true }), 30);
    if (!options.piece) { enigmeEnCours = false; coursEnCours = false; }
    majMusique();
  }
  function fermerModale() {
    const modale = $('#modale');
    if (modale.hidden) return;
    modale.hidden = true;
    document.body.classList.remove('modale-ouverte');
    quitterLaLettre();
    if (titreRetenu) { titreRetenu = false; majEcrans(); }
    enigmeEnCours = false;
    coursEnCours = false;
    majMusique();
    $('#contenu-modale').innerHTML = '';
    if (dernierFocus && dernierFocus.focus) dernierFocus.focus({ preventScroll: true });
    // De retour au chalet après une réparation : le sapin passe en grand pour montrer la nouvelle boule
    if (jourACelebrer) {
      const n = jourACelebrer;
      jourACelebrer = null;
      setTimeout(async () => {
        if (!$('#modale').hidden || document.querySelector('.entree-chalet')) return;
        await celebrerCase(n);
        if ($('#modale').hidden) admirerSapin({ nouveau: n });
      }, 250);
    }
  }

  function bandeau(J, sur, titre, sousTitre) {
    return h('header', { class: 'bandeau-jour' },
      // La scène de l'énigme (scenes.js) : elle montre la situation du défi, la Kère en pleine bêtise
      h('div', { class: 'bandeau-scene', html: (J.piece && window.SCENES && SCENES.dessiner(J.jour, J.piece, { chassee: !!J.resolu })) || (J.piece ? PIECES.interieur(J.piece, J.jour) + DECORS.particules(J.particules || ['✨'], J.jour) : DECORS.bandeau(J)) }),
      h('div', { class: 'bandeau-heros', 'aria-hidden': 'true' }, J.emoji),
      h('div', { class: 'bandeau-texte' },
        h('div', { class: 'bandeau-sur' }, sur),
        h('h2', { id: 'titre-modale' }, titre),
        sousTitre ? h('div', { class: 'bandeau-concept' }, sousTitre) : null));
  }

  /* On entre dans le chalet par la case du calendrier : la caméra s'approche de la case, qui devient
     une grande porte de calendrier de l'Avent avec son numéro ; la porte s'ouvre à deux battants sur
     la pièce, la lumière dorée envahit l'écran… et l'on se retrouve dans la pièce.
     Renvoie { pret, dissiper } : pret se résout au plus fort de la lumière (la pièce peut s'afficher
     dessous), dissiper() fait disparaître la lumière une fois la pièce affichée.
     Seuls transform et opacity sont animés ; le dessin de la pièce, figé, est copié de la case. */
  const COULEURS_PORTES = ['#9b1b30', '#1f6a3d', '#1d4f86', '#8a5a1e'];
  function entrerDansLeChalet(n, tuile) {
    const rien = { pret: Promise.resolve(), dissiper() {} };
    if (!tuile || mouvementReduit()) return rien;
    const r = tuile.getBoundingClientRect();
    if (!r.width) return rien;
    // La grande porte, au milieu de l'écran (aux proportions de la case)
    const ratio = r.width / r.height;
    const l = Math.min(innerWidth * 0.78, innerHeight * 0.72 * ratio), ht = l / ratio;
    const x = (innerWidth - l) / 2, y = (innerHeight - ht) / 2;
    const echelle = r.width / l;
    const depart = `translate(${(r.left - x).toFixed(1)}px, ${(r.top - y).toFixed(1)}px) scale(${echelle.toFixed(4)})`;
    const numero = () => h('span', { class: 'ec-numero' }, n);
    const battant = (cote) => h('div', { class: 'ec-battant ' + cote }, h('span', { class: 'ec-moulure' }), numero());
    const piece = h('div', { class: 'ec-piece', html: tuile.querySelector('.piece-scene').innerHTML });
    const cadre = h('div', { class: 'ec-cadre', style: { left: x + 'px', top: y + 'px', width: l + 'px', height: ht + 'px', transform: depart } },
      piece, h('div', { class: 'ec-lumiere' }), battant('g'), battant('d'), h('span', { class: 'ec-couronne', 'aria-hidden': 'true' }));
    cadre.style.setProperty('--porte', COULEURS_PORTES[n % 4]);
    const voile = h('div', { class: 'ec-voile' });
    voile.style.setProperty('--x', (r.left + r.width / 2).toFixed(0) + 'px');
    voile.style.setProperty('--y', (r.top + r.height / 2).toFixed(0) + 'px');
    const couche = h('div', { class: 'entree-chalet', 'aria-hidden': 'true' }, voile, cadre, h('div', { class: 'ec-flash' }));
    document.body.append(couche);
    tuile.classList.add('on-y-entre');
    void cadre.offsetWidth;
    // 1. La caméra s'approche de la case : elle grandit jusqu'à devenir une porte, le chalet s'efface autour
    couche.classList.add('approche');
    son('pas');
    const etapes = [];
    const plus = (ms, f) => etapes.push(setTimeout(f, ms));
    // 2. La porte s'ouvre à deux battants, la lumière de la pièce passe par l'ouverture
    plus(640, () => { couche.classList.add('ouverte'); son('porte'); });
    // 3. On passe la porte : la lumière dorée remplit l'écran
    plus(1200, () => couche.classList.add('passage'));
    let dissipee = false;
    const dissiper = () => {
      if (dissipee) return;
      dissipee = true;
      etapes.forEach(clearTimeout);
      tuile.classList.remove('on-y-entre');
      couche.classList.add('arrivee');
      setTimeout(() => couche.remove(), 650);
    };
    // (au cas où la pièce ne s'afficherait jamais, la lumière se dissipe d'elle-même)
    plus(6000, dissiper);
    return { pret: new Promise(ok => setTimeout(ok, 1580)), dissiper };
  }

  // Retour sur la façade après une pièce réparée : la case s'illumine, sa Kère partie.
  function celebrerCase(n) {
    const tuile = document.querySelector(`#chalet .piece-chalet[data-jour="${n}"]`);
    if (!tuile || mouvementReduit()) return Promise.resolve();
    const r = tuile.getBoundingClientRect();
    if (r.bottom < 60 || r.top > innerHeight - 40) tuile.scrollIntoView({ block: 'center', behavior: 'instant' });
    tuile.classList.remove('vient-d-etre-reparee');
    void tuile.offsetWidth;
    tuile.classList.add('vient-d-etre-reparee');
    son('note', 7);
    return new Promise(ok => setTimeout(() => { tuile.classList.remove('vient-d-etre-reparee'); ok(); }, 1500));
  }

  async function ouvrirJour(n, tuile) {
    const e = etatDe(n);
    if (e === 'verrouille' || e === 'ferme') {
      son('verrou');
      if (tuile) { tuile.classList.remove('secouee'); void tuile.offsetWidth; tuile.classList.add('secouee'); }
      toast(e === 'verrouille' ? t("🔒 Patience ! Cette pièce s'ouvrira le <b>{d}</b>.", { d: dateTexte(n) }) : t('⌛ Trop tard ! Chaque pièce ne reste ouverte que le jour J.'));
      return;
    }
    const demanderConnexion = () => ouvrirIntro({ raison: t("🔑 Pour entrer dans une pièce du chalet, inscris-toi ou connecte-toi : ta progression sera sauvegardée et tu pourras la reprendre sur n'importe quel appareil."), ensuite: n });
    if (S && !S.connecte) { demanderConnexion(); return; }

    let J;
    // Depuis la façade : on entre dans le chalet par la case du calendrier (depuis une pièce voisine : directement)
    const entree = entrerDansLeChalet(n, tuile);
    try { J = await appel('GET', `/api/jours/${n}`); await entree.pret; }
    catch (err) {
      entree.dissiper();
      if (err.data && err.data.erreur === 'connexion') { if (S) S.connecte = false; majSalut(); demanderConnexion(); return; }
      toast(err.message);
      if (err.status === 403) rafraichir();
      return;
    }

    const message = h('div', { class: 'message', role: 'status', 'aria-live': 'polite' });
    const zoneResultat = h('div', { class: 'resultat' });
    const zoneWidget = h('div', { class: 'widget' });
    let champ = null;
    let form = null;
    let lancerFinale = null; // jour 24 : le dégel de la lettre et le dernier message du Père Noël
    /* Le compteur de tentatives (à la place d'un chrono : on prend le temps qu'il faut).
       C'est le serveur qui compte, la partie suit donc le joueur d'un appareil à l'autre.
       Toutes les 3 erreurs, le bouton d'indice clignote pour se proposer. */
    let tentatives = J.tentatives || 0;
    let tentativesVictoire = 0; // affiché dans le bandeau de victoire
    const nbTentatives = h('b', { class: 'tentatives-nombre' }, String(tentatives));
    const compteurTentatives = h('div', { class: 'tentatives-defi', role: 'status', 'aria-live': 'polite' },
      h('span', { class: 'tentatives-icone', 'aria-hidden': 'true' }, '🎯'), h('span', {}, t('Tentatives :')), nbTentatives);
    function majTentatives(nb, reussi) {
      if (typeof nb !== 'number' || nb <= tentatives) return;
      tentatives = nb;
      nbTentatives.textContent = String(nb);
      compteurTentatives.classList.remove('compte');
      void compteurTentatives.offsetWidth;
      compteurTentatives.classList.add('compte');
      if (!reussi && nb % 3 === 0 && !boutonIndice.hidden) {
        boutonIndice.classList.remove('propose');
        void boutonIndice.offsetWidth;
        boutonIndice.classList.add('propose');
      }
    }

    // La Kère qui hante la pièce (au 24 : Kryos en personne). Elle ricane quand on se trompe
    // et vole en éclats quand l'énigme est résolue.
    const G = J.givrin;
    const boss = n === 24;
    const guillemets = (texte) => t('« {texte} »', { texte });
    const titreCarte = h('div', { class: 'givrin-titre' });
    const bulle = h('p', { class: 'givrin-bulle' });
    const carteGivrin = G ? h('aside', { class: 'givrin-carte' + (boss ? ' boss' : '') },
      h('div', { class: 'givrin-avatar', html: kereHTML(boss) + '<span class="flaque"></span>' }),
      h('div', { class: 'givrin-texte' }, titreCarte, G.nom ? h('b', { class: 'givrin-nom' }, G.nom) : null, bulle)) : null;
    // La Kère lance sa réplique (par défaut, sa phrase d'accueil) : la bulle s'écrit lettre à lettre et sa bouche bouge.
    let ecritureKere = 0;
    function parlerKere(replique) {
      if (!carteGivrin || !G) return;
      const texte = guillemets(replique || G.ricane);
      clearInterval(ecritureKere);
      if (mouvementReduit()) { bulle.textContent = texte; return; }
      bulle.textContent = '';
      carteGivrin.classList.add('parle');
      let k = 0;
      const lettres = Array.from(texte);
      const ecrire = ecritureKere = setInterval(() => {
        if (!contenu.isConnected) { clearInterval(ecrire); return; }
        bulle.textContent += lettres[k++] || '';
        if (k >= lettres.length) { clearInterval(ecrire); setTimeout(() => carteGivrin.classList.remove('parle'), 300); }
      }, 32);
    }
    // À chaque erreur, elle a une nouvelle pique en réserve (et se tord de rire dans la scène)
    let pique = 0;
    // (contenu n'existe pas encore au tout premier appel de majCarte)
    const sceneEnigme = () => { try { return contenu.querySelector('.bandeau-scene .scene-enigme'); } catch (e) { return null; } };
    function moquerieKere() {
      const scene = sceneEnigme();
      if (scene) { scene.classList.remove('ricane'); void scene.offsetWidth; scene.classList.add('ricane'); }
      if (G && Array.isArray(G.piques) && G.piques.length) parlerKere(G.piques[pique++ % G.piques.length]);
    }

    function majCarte(chasse) {
      if (!carteGivrin) return;
      clearInterval(ecritureKere);
      carteGivrin.classList.remove('parle');
      carteGivrin.classList.toggle('chasse', chasse);
      // Dans la scène aussi, la Kère prend la fuite : il ne reste qu'une flaque
      const scene = sceneEnigme();
      if (scene) scene.classList.toggle('chassee', chasse);
      titreCarte.textContent = chasse ? (boss ? t('✓ Vaincu !') : t('✓ Kère chassée')) : (boss ? t('😈 Le maître des Kères') : t('👹 La Kère qui garde cette pièce'));
      bulle.textContent = guillemets(chasse ? G.fuite : G.ricane);
    }
    majCarte(!!J.resolu);

    function afficherMessage(html, type = 'erreur') {
      message.className = 'message visible ' + type;
      message.innerHTML = html;
      if (type === 'erreur') {
        son('erreur');
        message.classList.remove('secousse');
        void message.offsetWidth;
        message.classList.add('secousse');
        if (carteGivrin) { carteGivrin.classList.remove('ricane'); void carteGivrin.offsetWidth; carteGivrin.classList.add('ricane'); }
        moquerieKere();
      }
    }

    function rendreResultat(res, nouveau) {
      zoneResultat.innerHTML = '';
      const etageI = nouveau ? etageComplete(n) : -1;
      const enDirect = nouveau && !mouvementReduit();
      const exploit = tentativesVictoire === 1 ? t('🎯 Du premier coup !')
        : t(I18N.pluriel(tentativesVictoire) ? '🎯 Défi relevé en {n} tentatives' : '🎯 Défi relevé en {n} tentative', { n: tentativesVictoire });
      zoneResultat.append(h('div', { class: 'bandeau-succes', html: (tentativesVictoire && nouveau ? `<span class="tentatives-victoire">${exploit}</span> ` : '') + (
        n === 24 ? t("🌟 <b>L'étoile est rallumée ! NOËL EST SAUVÉ !</b>")
          : t('🎉 <b>Pièce réparée !</b> La lumière revient dans « {piece} » et la boule n°{n} du sapin se rallume.', { piece: J.univers, n }) + (etageI >= 0 ? ` <span class="petit">${t('✨ Tout {niveau} est réparé : ses guirlandes brillent !', { niveau: t(NIVEAUX[etageI].nom) })}</span>` : '')) }));
      if (G) {
        // Des éclats de glace qui partent dans tous les sens, puis il ne reste qu'une flaque
        const eclats = Array.from({ length: 9 }, (_, k) => {
          const a = (k / 9) * 6.283 + Math.random() * 0.5, d = 46 + Math.random() * 34;
          return `<i class="eclat" style="--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d)}px;--r:${Math.round(Math.random() * 540 - 270)}deg"></i>`;
        }).join('');
        const titre = nouveau ? (boss ? t('💥 {nom} est vaincu !', { nom: G.nom }) : t('💨 La Kère prend la fuite !'))
          : (boss ? t('🏔️ {nom} est enfermé dans son glacier pour mille ans.', { nom: G.nom }) : t("💧 La Kère n'est plus qu'une petite flaque."));
        zoneResultat.append(h('div', { class: 'givrin-chasse' + (enDirect ? ' en-direct' : '') + (boss ? ' boss' : '') },
          h('div', { class: 'givrin-avatar', 'aria-hidden': 'true', html: kereHTML(boss) + '<span class="flaque"></span>' + eclats }),
          h('div', {}, h('b', {}, titre), h('p', {}, guillemets(G.fuite)))));
      }
      const f = res.fragment;
      if (f) {
        zoneResultat.append(h('div', { class: 'fragment-gagne', html:
          `<div class="ticket"><span class="ticket-titre">${t('🧩 Fragment récupéré')}</span><span class="ticket-lettre">${f.lettre}</span><span class="ticket-position">${t('position')} <code>${f.positionBinaire}</code></span></div>` +
          '<small>' + (G ? t("En s'enfuyant, {nom} a laissé tomber ce fragment. Garde-le précieusement pour le 24 décembre ! (Bouton 🧩 en haut de la page.)", { nom: G.nom || t('la Kère') }) : t('Garde-le précieusement pour le 24 décembre ! (Bouton 🧩 en haut de la page.)')) + '</small>' }));
      }
      const section = h('section', { class: 'lecon' }, h('h3', {}, n === 24 ? t('🎓 Bravo, Sauveur de Noël !') : t('📚 Ce que tu as appris : {c}', { c: J.concept })),
        h('div', { html: res.lecon.split('{{PARAPHE}}').join(PARAPHE).split('{{PRENOM}}').join(prenomHTML() || t('Sauveur de Noël')) }));
      if (res.apres && W[res.apres.type]) {
        const terrain = h('div', { class: 'terrain' });
        section.append(terrain);
        W[res.apres.type](...res.apres.params)(terrain, api);
      }
      zoneResultat.append(section);
      const fin = section.querySelector('.fin-de-lettre');
      if (fin) lancerFinale = preparerFinale(fin, enDirect);
    }

    async function traiterReussite(r) {
      message.className = 'message';
      message.innerHTML = '';
      if (form) form.hidden = true;
      majTentatives(r.tentatives, true);
      compteurTentatives.classList.add('vaincu');
      if (r.premiereFois) tentativesVictoire = tentatives;
      let fanfare = false;
      if (enigmeEnCours) {
        // L'horloge s'arrête net : la Kère est vaincue, la fanfare éclate. Le 24, le funk attendra
        // le dégel de la lettre ; sinon la musique de la façade revient pendant que la fanfare s'éteint.
        enigmeEnCours = false;
        sequenceMusicale = n === 24 ? 'finale' : 'victoire';
        fanfare = MUSIQUE.audible();
        MUSIQUE.jouer('victoire', { fondu: 0.06, depuis: 0 });
        if (n !== 24) setTimeout(() => { if (sequenceMusicale === 'victoire') { sequenceMusicale = null; majMusique(4); } }, 7000);
      }
      if (r.premiereFois) {
        if (n !== 24) jourACelebrer = n; // le 24, c'est la grande fête qui ouvre le sapin
        await rafraichir(n);
        if (!fanfare) son('victoire'); // les clochettes, seulement si la musique est coupée
        setTimeout(() => son('eclat'), 1400); // au moment où la Kère vole en éclats
        confettis(n === 24 ? 160 : 60);
      }
      majCarte(true);
      rendreResultat(r.resultat, r.premiereFois);
      if (r.premiereFois) {
        const e2 = etageComplete(n);
        if (e2 >= 0 && n !== 24) setTimeout(() => toast(t("✨ {niveau} du chalet s'illumine !", { niveau: majuscule(t(NIVEAUX[e2].nom)) })), 900);
        // Le 24 : la grande célébration, puis la fin de la lettre dégèle sous les yeux du joueur
        if (n === 24) setTimeout(() => celebrationFinale(() => {
          // Noël est sauvé : le Jingle Bells funk revient avec le dégel, et ne repartira plus
          sequenceMusicale = null;
          MUSIQUE.jouer('funk', { depuis: 0, fondu: 2 });
          if (lancerFinale) lancerFinale();
          else { const fin = zoneResultat.querySelector('.fin-de-lettre'); if (fin) fin.scrollIntoView({ block: 'start' }); }
        }), 900);
        setTimeout(() => zoneResultat.scrollIntoView({ behavior: mouvementReduit() ? 'auto' : 'smooth', block: 'start' }), 350);
      }
    }

    const api = {
      jour: n,
      champ: null,
      message: afficherMessage,
      async soumettre(reponse) {
        try {
          const r = await appel('POST', `/api/jours/${n}/reponse`, { reponse });
          if (r.ok) await traiterReussite(r);
          else {
            majTentatives(r.tentatives);
            if (r.message) afficherMessage(r.message, r.type || 'erreur');
          }
          return r;
        } catch (err) {
          afficherMessage(err.message);
          return { ok: false, erreur: true };
        }
      },
      async verifier(texte) {
        if (!normaliser(texte)) { afficherMessage(t('Écris une réponse avant de valider.'), 'info'); return { ok: false }; }
        const r = await api.soumettre(texte);
        if (!r.ok && !r.message && !r.erreur) afficherMessage(t(MESSAGES_ERREUR[Math.floor(Math.random() * MESSAGES_ERREUR.length)], { givrin: G && G.nom ? G.nom : t('la Kère') }));
        return r;
      },
      async action(donnees) {
        try {
          const r = await appel('POST', `/api/jours/${n}/action`, donnees);
          if (r.message && !r.indication) afficherMessage(r.message, 'info');
          if (r.ok && r.resultat) await traiterReussite(r);
          else majTentatives(r.tentatives);
          return r;
        } catch (err) {
          afficherMessage(err.message);
          return { erreur: true };
        }
      },
      fragments: () => (S ? S.fragments : []),
    };

    if (J.champ) {
      champ = h('input', { type: 'text', class: 'champ-reponse', placeholder: J.placeholder || t('Ta réponse…'), autocomplete: 'off', spellcheck: 'false', maxlength: '120', 'aria-label': t('Ta réponse') });
      form = h('form', { class: 'formulaire-reponse' }, champ, h('button', { type: 'submit', class: 'btn btn-principal' }, t('✔ Valider')));
      let envoi = false;
      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        if (envoi) return;
        envoi = true;
        await api.verifier(champ.value);
        envoi = false;
      });
      api.champ = champ;
    }

    // Indices progressifs (comptés sur le serveur)
    const listeIndices = h('ol', { class: 'liste-indices' });
    const boutonIndice = h('button', { type: 'button', class: 'btn btn-discret' });
    function majIndices(vus) {
      listeIndices.innerHTML = '';
      vus.forEach(t => listeIndices.append(h('li', {}, t)));
      boutonIndice.hidden = vus.length >= J.nbIndices;
      boutonIndice.textContent = vus.length === 0 ? t("💡 Besoin d'un indice ? ({n} disponibles)", { n: J.nbIndices }) : t('💡 Un autre indice ({i}/{n})', { i: vus.length + 1, n: J.nbIndices });
    }
    boutonIndice.addEventListener('click', async () => {
      try { const r = await appel('POST', `/api/jours/${n}/indice`); majIndices(r.indices); son('clic'); }
      catch (err) { afficherMessage(err.message); }
    });
    majIndices(J.indicesVus || []);

    // Des portes mènent aux pièces voisines (dans l'ordre des jours)
    const nav = h('nav', { class: 'navigation-jours portes-voisines' });
    const accessible = (k) => k >= 1 && k <= 24 && ['disponible', 'resolu'].includes(etatDe(k));
    const porteVers = (k, sens) => accessible(k)
      ? h('button', { type: 'button', class: 'btn btn-discret porte-voisine', onclick: () => ouvrirJour(k) }, sens < 0 ? `🚪 ← ${S.jours[k - 1].univers}` : `${S.jours[k - 1].univers} → 🚪`)
      : h('span');
    nav.append(porteVers(n - 1, -1), h('button', { type: 'button', class: 'btn', onclick: fermerModale }, t('🏡 Retour au chalet')), porteVers(n + 1, 1));

    /* La pièce se joue en deux temps :
       1. le projecteur des lutins s'allume et projette le petit cours (la notion du jour expliquée
          à quelqu'un qui n'y connaît rien), si on ne l'a pas encore vu ;
       2. la Kère surgit et présente son défi : l'histoire, l'énigme, le compteur de tentatives (et la musique du tic-tac).
       Une pièce déjà réparée (ou un cours déjà vu) s'ouvre directement sur le défi ; le bouton
       « Revoir le petit cours » rallume le projecteur. */
    const coursVus = Array.isArray(prefs.coursVus) ? prefs.coursVus : (prefs.coursVus = []);
    let acteDefi = null;
    // Le cours projeté en diapositives : chaque diapo garde un tableau ou un exemple entier.
    const diapos = J.cours ? decouperCours(J.cours) : [];
    let diapo = 0;
    const zoneDiapos = h('div', { class: 'diapos' }, diapos.map((html, k) => h('div', { class: 'diapo contenu-cours', 'data-k': k, html })));
    const precedente = h('button', { type: 'button', class: 'btn btn-discret diapo-nav', onclick: () => montrerDiapo(diapo - 1) }, t('◀ Précédente'));
    const suivante = h('button', { type: 'button', class: 'btn btn-principal diapo-nav', onclick: () => montrerDiapo(diapo + 1) }, t('Suivante ▶'));
    const points = h('div', { class: 'diapo-points', 'aria-hidden': 'true' }, diapos.map((_, k) => h('i', { onclick: () => montrerDiapo(k) })));
    const numero = h('span', { class: 'diapo-numero' });
    const fini = h('p', { class: 'centre suite-projection' }, h('button', { type: 'button', class: 'btn btn-principal btn-geant', onclick: () => versDefi() }, boss ? t("⚔️ J'ai compris : à moi, Kryos !") : t("⚔️ J'ai compris : à moi la Kère !")));
    function montrerDiapo(k, premiere = false) {
      if (!diapos.length) return;
      k = Math.max(0, Math.min(diapos.length - 1, k));
      const change = k !== diapo;
      diapo = k;
      zoneDiapos.querySelectorAll('.diapo').forEach((d, i) => { d.hidden = i !== k; });
      points.querySelectorAll('i').forEach((p, i) => p.classList.toggle('actif', i === k));
      numero.textContent = t('Diapo {k} / {n}', { k: k + 1, n: diapos.length });
      precedente.disabled = k === 0;
      suivante.hidden = k === diapos.length - 1;
      fini.hidden = k !== diapos.length - 1;
      if (change && !premiere) {
        son('diapo');
        zoneDiapos.classList.remove('change');
        void zoneDiapos.offsetWidth;
        zoneDiapos.classList.add('change');
      }
    }
    const projection = J.cours ? h('section', { class: 'projection', 'aria-labelledby': 'titre-projection' },
      h('div', { class: 'projecteur', 'aria-hidden': 'true', html: PROJECTEUR }),
      h('div', { class: 'faisceau-projection', 'aria-hidden': 'true' }, Array.from({ length: 9 }, (_, k) => h('i', { style: `left:${10 + Math.random() * 80}%;animation-delay:-${(Math.random() * 6).toFixed(1)}s;animation-duration:${(5 + Math.random() * 4).toFixed(1)}s` }))),
      h('div', { class: 'ecran-projection' },
        h('div', { class: 'enrouleur', 'aria-hidden': 'true' }),
        h('button', { type: 'button', class: 'lien passer-cours', onclick: () => versDefi() }, t('Je connais déjà : passer →')),
        h('h3', { id: 'titre-projection', class: 'titre-projection', tabindex: '-1' }, t('📽️ Le petit cours des lutins')),
        h('p', { class: 'sous-titre-projection' }, t("Avant d'affronter la Kère, regarde bien : tout ce qu'il faut savoir pour la battre est là.")),
        zoneDiapos,
        h('div', { class: 'diapo-pied' }, precedente, h('div', { class: 'diapo-milieu' }, points, numero), suivante),
        fini)) : null;
    if (projection) {
      montrerDiapo(0, true);
      projection.addEventListener('keydown', (e) => {
        if (e.target.closest('input, textarea')) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); montrerDiapo(diapo + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); montrerDiapo(diapo - 1); }
      });
    }

    const titreDefi = h('h3', { class: 'titre-defi', tabindex: '-1' }, boss ? t('😈 Le défi de Kryos') : t('👹 Le défi de la Kère'));
    const revoirCours = J.cours ? h('button', { type: 'button', class: 'btn btn-discret revoir-cours', onclick: () => versCours() }, t('📽️ Revoir le petit cours')) : null;
    const eclatsEntree = Array.from({ length: 10 }, (_, k) => {
      const a = (k / 10) * 6.283 + Math.random() * 0.4, d = 50 + Math.random() * 40;
      return `<i class="eclat" style="--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d)}px;--r:${Math.round(Math.random() * 540 - 270)}deg"></i>`;
    }).join('');
    if (carteGivrin) carteGivrin.querySelector('.givrin-avatar').insertAdjacentHTML('beforeend', `<span class="eclats-entree">${eclatsEntree}</span>`);
    const defi = h('section', { class: 'defi' },
      J.resolu ? null : compteurTentatives,
      carteGivrin,
      titreDefi,
      h('section', { class: 'histoire', html: J.histoire }),
      revoirCours,
      h('section', { class: 'enigme', html: J.enigme }),
      J.widget ? zoneWidget : null,
      form,
      message,
      h('div', { class: 'indices' }, listeIndices, boutonIndice),
      zoneResultat);

    const contenu = h('article', { class: 'jour' },
      bandeau(J, `${t(NIVEAUX[NIVEAUX.findIndex(nv => nv.jours.includes(n))].titre)} · ${t('Jour {n}', { n })} · ${dateTexte(n)}`, J.univers, '💡 ' + J.concept),
      h('div', { class: 'corps-jour' }, projection, defi, nav));

    // 1. Le projecteur s'allume : la pièce est plongée dans la pénombre, le cours se déroule sur l'écran.
    function versCours() {
      if (!projection) return;
      acteDefi = false;
      contenu.classList.add('en-projection');
      projection.hidden = false;
      projection.classList.remove('repli');
      defi.hidden = true;
      enigmeEnCours = false; // pas de tic-tac pendant le cours : la musique du petit cours
      coursEnCours = true;
      majMusique(1.5);
      son('projecteur');
      $('#modale').scrollTop = 0;
      projection.classList.remove('allume');
      void projection.offsetWidth;
      projection.classList.add('allume');
      setTimeout(() => { const h3 = projection.querySelector('.titre-projection'); if (h3 && contenu.isConnected) h3.focus({ preventScroll: true }); }, 60);
    }
    // 2. La Kère surgit dans un éclat de glace et lance son défi ; le compteur de tentatives s'affiche.
    function versDefi(immediat = false) {
      const depuisCours = acteDefi === false;
      acteDefi = true;
      if (!coursVus.includes(n)) { coursVus.push(n); sauverPrefs(); }
      const montrer = () => {
        if (!contenu.isConnected) return;
        contenu.classList.remove('en-projection');
        if (projection) projection.hidden = true;
        defi.hidden = false;
        coursEnCours = false;
        if (!J.resolu && !estResolu(n)) {
          enigmeEnCours = true; // le tic-tac (ou Kryos, le 24) tourne tant que l'énigme résiste
          MUSIQUE.precharger('victoire');
        }
        majMusique(depuisCours ? 0.8 : undefined);
        if (!immediat && !mouvementReduit() && !estResolu(n)) {
          defi.classList.remove('surgit');
          void defi.offsetWidth;
          defi.classList.add('surgit');
          son('apparition');
          setTimeout(() => { if (contenu.isConnected) { son('ricane'); parlerKere(); } }, 650);
        } else if (!J.resolu && !estResolu(n)) parlerKere();
        if (depuisCours) { $('#modale').scrollTop = 0; titreDefi.focus({ preventScroll: true }); }
      };
      // L'écran du projecteur s'enroule avant que la Kère n'apparaisse
      if (depuisCours && !mouvementReduit()) { projection.classList.add('repli'); setTimeout(montrer, 420); }
      else montrer();
    }

    if (J.widget && W[J.widget.type]) W[J.widget.type](...J.widget.params)(zoneWidget, api);
    son('clic');
    enigmeEnCours = false;
    coursEnCours = false;
    jourOuvert = n;
    ouvrirModale(contenu, { piece: true });
    entree.dissiper(); // la lumière de la porte se dissipe sur la pièce
    if (projection && !J.resolu && !coursVus.includes(n)) versCours();
    else versDefi(true);

    if (J.resolu && J.resultat) {
      if (form) form.hidden = true;
      rendreResultat(J.resultat, false);
    }
  }

  /* ---------- Compte du joueur ---------- */
  // Pas connecté : écran titre. Connecté : le chalet, vu de dehors, avec ses 24 cases de calendrier.
  // Pendant la lettre d'un nouveau joueur, l'écran titre (le chalet gelé) reste derrière :
  // il découvre le chalet en s'y téléportant.
  let titreRetenu = false;
  function majEcrans() {
    const connecte = !!(S && S.connecte) && !titreRetenu;
    $('#ecran-titre').hidden = connecte;
    $('#jeu').hidden = !connecte;
    document.body.classList.toggle('sur-ecran-titre', !connecte);
  }

  function majSalut() {
    const z = $('#salut');
    z.innerHTML = '';
    if (!S || !S.connecte) return;
    z.append(h('span', { class: 'nom-joueur' }, '🎅 ', h('b', {}, S.nom)), h('button', { type: 'button', class: 'lien btn-deconnexion', onclick: seDeconnecter, title: t('Se déconnecter'), 'aria-label': t('Se déconnecter') }, h('span', { class: 'texte' }, t('Déconnexion')), h('span', { class: 'icone', 'aria-hidden': 'true' }, '🚪')));
  }

  async function seDeconnecter() {
    try { await appel('POST', '/api/deconnexion'); } catch (e) { /* tant pis */ }
    fermerModale();
    await rafraichir();
    window.scrollTo(0, 0);
    toast(t('👋 À bientôt au Pôle Nord ! Ta progression est bien gardée.'));
  }

  /* Le petit cours, découpé en diapositives : on remplit une diapo jusqu'à environ 420 caractères ;
     un tableau, un exemple de code ou une liste ne sont jamais coupés et terminent leur diapo
     (avec la phrase qui les annonce, si elle finit par « : »). */
  function decouperCours(html) {
    const boite = document.createElement('div');
    boite.innerHTML = html;
    const blocs = [...boite.childNodes].filter(nd => nd.nodeType === 1 || (nd.nodeType === 3 && nd.textContent.trim()));
    const diapos = [];
    let cur = [], longueur = 0;
    const fermer = () => { if (cur.length) diapos.push(cur.map(b => (b.nodeType === 1 ? b.outerHTML : `<p>${b.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`)).join('')); cur = []; longueur = 0; };
    blocs.forEach((b) => {
      const gros = b.nodeType === 1 && (b.matches('table, pre, ul, ol, .tableau, .terrain, figure') || b.querySelector('table, pre'));
      const lg = (b.textContent || '').length;
      if (gros) {
        // la phrase d'annonce (« … : ») reste avec son tableau
        const annonce = cur.length && /:\s*$/.test((cur[cur.length - 1].textContent || '').trim()) ? cur.pop() : null;
        fermer();
        if (annonce) cur.push(annonce);
        cur.push(b);
        fermer();
        return;
      }
      if (longueur && longueur + lg > 420) fermer();
      cur.push(b);
      longueur += lg;
    });
    fermer();
    return diapos.length ? diapos : [html];
  }

  // Le projecteur des lutins, qui projette le petit cours dans chaque pièce (les bobines tournent).
  const PROJECTEUR = `<svg viewBox="0 0 140 110" aria-hidden="true">
    <circle cx="44" cy="34" r="27" fill="#3a404d" stroke="#1d2027" stroke-width="5"/><circle cx="96" cy="32" r="23" fill="#3a404d" stroke="#1d2027" stroke-width="5"/>
    <g class="bobine"><path d="M44 12 v44 M22 34 h44" stroke="#1d2027" stroke-width="5"/><circle cx="44" cy="34" r="6" fill="#c9a35a"/></g>
    <g class="bobine b2"><path d="M96 13 v38 M77 32 h38" stroke="#1d2027" stroke-width="5"/><circle cx="96" cy="32" r="5" fill="#c9a35a"/></g>
    <rect x="22" y="56" width="96" height="40" rx="9" fill="#2a2f3a"/><rect x="30" y="64" width="40" height="6" rx="3" fill="#56657a"/>
    <path d="M60 96 L50 110 M84 96 L94 110" stroke="#1d2027" stroke-width="6" stroke-linecap="round"/>
    <circle cx="70" cy="98" r="9" fill="#1d2027"/><circle class="lentille" cx="70" cy="98" r="5.5" fill="#fff6d0"/>
  </svg>`;

  // Le paraphe sous la signature (tracé à la plume pendant l'animation) et la plume elle-même.
  const PARAPHE = '<svg class="paraphe" viewBox="0 0 240 46" aria-hidden="true"><path pathLength="1" d="M6 30 C 38 6, 62 44, 98 26 S 150 4, 176 20 S 214 38, 234 12"/></svg>';
  const PLUME = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M45 2C30 5 17 15 11 30l-2 7 7-2C31 29 42 16 45 2z" fill="#fbf4e2" stroke="#7a5a2a" stroke-width="1.3"/><path d="M45 2 9 38" stroke="#7a5a2a" stroke-width="1.1" fill="none"/><path d="M9 38 3 46" stroke="#22160a" stroke-width="2.4" stroke-linecap="round"/></svg>';

  /* Une Kère : esprit de la mort de la mythologie grecque, faite de glace (illustration de
     public/media, détourée). Elle est en trois calques — le corps et les deux ailes — pour que ses
     ailes battent quand elle se présente dans une pièce. Au 24, c'est Kryos en personne : sa tête,
     les bords fondus dans le noir. */
  function kereHTML(boss) {
    const img = (fichier, classe) => `<img class="${classe}" src="media/${fichier}.webp" alt="" draggable="false">`;
    return boss
      ? `<span class="givrin-svg givrin-img kryos-img">${img('kryos-tete', 'corps')}</span>`
      : `<span class="givrin-svg givrin-img">${img('kere-aile-g', 'aile aile-g')}${img('kere-aile-d', 'aile aile-d')}${img('kere-corps', 'corps')}</span>`;
  }

  /* La lettre du Père Noël, écrite en cachette depuis le cachot de glace où Kryos l'a enfermé
     avec tous ses lutins. Elle est adressée au joueur, par son prénom : la prophétie dit que
     c'est lui, le Sauveur de Noël. Elle s'écrit sous ses yeux… jusqu'à ce que Kryos la gèle,
     juste avant la fin. La fin (et la signature) ne réapparaissent que le 24 décembre.
     nom : le prénom du joueur, déjà échappé pour le HTML (ou une chaîne vide). */
  const LETTRE_EN = (nom) => `
    <p class="entete-lettre" data-scene="cachot">North Pole, deep in an ice dungeon,<br>December 1, long past midnight</p>
    <p class="salutation" data-scene="cachot">${nom ? nom + ',' : 'To you, reading these words,'}</p>
    <p data-scene="cachot">If you're reading this letter, my last spell has worked: <span data-evt="envol">it flew through the storm to reach you</span>. I'm writing in secret, by the light of a dying candle.</p>
    <p data-scene="glacier">A thousand years ago, the elves locked Christmas's worst enemy deep inside a glacier: <b class="mot-givre" data-dire="Kryos">KRYOS</b>, the Ice Tyrant. <span data-evt="nuit">Last night,</span> <span data-evt="fendu">the glacier cracked open</span>… <span data-evt="revenu">and he came back.</span></p>
    <p data-scene="keres">With a single breath, he awoke his <b>Keres</b>: twenty-three winged creatures with claws of ice, whom the ancient Greeks called the spirits of death. <span data-evt="noelos">They froze <b data-dire="Noel O.S.">NOËL-OS</b></span>, the computer that runs the whole North Pole, <span data-evt="lutins">then captured my elves</span>, every last one of them. <span data-evt="capture">And Kryos threw me into this dungeon too.</span></p>
    <p data-scene="chalet">Each Ker has taken up her post in a room of the chalet and locked it with a computer puzzle. <span data-evt="salon">As for Kryos, he guards the Great Hall:</span> <span data-evt="etoile">he has put out the star on the tree.</span></p>
    <p data-scene="hiver">If it isn't lit again by Christmas Eve, <b>there will be no Christmas this year</b>. Not one present. Not one stocking filled. Just a winter that never ends.</p>
    <p data-scene="prophetie">But an old elven prophecy says: “When the star goes out, someone will come from far away to light Christmas up again.” <span data-evt="visage">Tonight, my crystal ball showed me their face.</span> <b data-evt="toi">The Savior of Christmas${nom ? ', ' + nom : ''}… is you.</b></p>
    <p class="appel" data-scene="prophetie" data-evt="espoir">You are our only hope.</p>
    <p data-scene="mission">If you accept the mission, this letter will carry you to the chalet. <b data-evt="decembre">Every day in December</b>, a new room will open. Each puzzle you solve:</p>
    <div class="regles" data-scene="mission">
      <div data-evt="kere"><span>👹</span> <b>drives out the Ker</b> guarding the room;</div>
      <div data-evt="lumiere"><span>💡</span> <b>turns its light back on</b>… and lights a <b>bauble on the tree</b>;</div>
      <div data-evt="guirlandes"><span>✨</span> makes the <b>lights</b> of a whole floor shine, once it's fully repaired;</div>
      <div data-evt="fragment"><span>🧩</span> gives you a <b>fragment</b> of the secret phrase…</div>
      <div data-evt="etoile"><span>⭐</span> …which, on December 24, will <b>light up the star</b>, drive Kryos away and set us all free!</div>
    </div>
    <p data-scene="cours">You don't need to be a computer genius: a little curiosity, <b>a pencil and some paper</b> will do. Before they were captured, my elves hid a <b>mini-lesson</b> in front of each puzzle, and some <b>hints</b> in case you get stuck.</p>
    <p class="interrompu" data-scene="menace">But above all, whatever happens, never</p>
    <div class="fin-gelee">
      <p class="gravure">Too late, old beard.<br>This Christmas is mine.${nom ? `<br>And you, ${nom}… I'll be waiting.` : ''}<br><span class="signe-gravure">— K.</span></p>
    </div>`;
  const LETTRE_FR = (nom) => `
    <p class="entete-lettre" data-scene="cachot">Pôle Nord, au fond d'un cachot de glace,<br>le 1er décembre, bien après minuit</p>
    <p class="salutation" data-scene="cachot">${nom ? nom + ',' : 'À toi qui lis ces mots,'}</p>
    <p data-scene="cachot">Si tu lis cette lettre, c'est que ma dernière magie a fonctionné : <span data-evt="envol">elle a traversé la tempête pour arriver jusqu'à toi</span>. Je t'écris en cachette, à la lueur d'une bougie qui faiblit.</p>
    <p data-scene="glacier">Il y a mille ans, les lutins ont enfermé au cœur d'un glacier le pire ennemi de Noël : <b class="mot-givre" data-dire="Kryos">KRYOS</b>, le Tyran de Glace. <span data-evt="nuit">Cette nuit,</span> <span data-evt="fendu">le glacier s'est fendu</span>… <span data-evt="revenu">et il est revenu.</span></p>
    <p data-scene="keres">D'un seul souffle, il a réveillé ses <b>Kères</b> : vingt-trois créatures ailées aux griffes de glace, que les Grecs anciens appelaient les esprits de la mort. <span data-evt="noelos">Elles ont gelé <b data-dire="Noël O.S.">NOËL-OS</b></span>, l'ordinateur qui fait tourner tout le Pôle Nord, <span data-evt="lutins">puis elles ont capturé mes lutins</span>, jusqu'au dernier. <span data-evt="capture">Et Kryos m'a jeté dans ce cachot, moi aussi.</span></p>
    <p data-scene="chalet">Chaque Kère s'est postée dans une pièce du chalet et l'a verrouillée avec une énigme d'informatique. <span data-evt="salon">Kryos, lui, garde le Grand Salon :</span> <span data-evt="etoile">il a éteint l'étoile du sapin.</span></p>
    <p data-scene="hiver">Si elle ne se rallume pas avant le soir du 24 décembre, <b>il n'y aura pas de Noël cette année</b>. Pas un cadeau. Pas une chaussette remplie. Juste un hiver qui ne finira jamais.</p>
    <p data-scene="prophetie">Mais une vieille prophétie des lutins annonce : « Quand l'étoile s'éteindra, quelqu'un viendra de très loin pour rallumer Noël. » <span data-evt="visage">Cette nuit, ma boule de cristal m'a montré son visage.</span> <b data-evt="toi">Le Sauveur de Noël, ${nom ? nom + ', ' : ''}c'est toi.</b></p>
    <p class="appel" data-scene="prophetie" data-evt="espoir">Tu es notre seul espoir.</p>
    <p data-scene="mission">Si tu acceptes la mission, cette lettre te transportera jusqu'au chalet. <b data-evt="decembre">Chaque jour de décembre</b>, une nouvelle pièce s'ouvrira. Chaque énigme résolue :</p>
    <div class="regles" data-scene="mission">
      <div data-evt="kere"><span>👹</span> <b>chasse la Kère</b> qui garde la pièce ;</div>
      <div data-evt="lumiere"><span>💡</span> <b>rallume sa lumière</b>… et une <b>boule du sapin</b> ;</div>
      <div data-evt="guirlandes"><span>✨</span> fait briller les <b>guirlandes</b> d'un niveau entier, une fois qu'il est réparé ;</div>
      <div data-evt="fragment"><span>🧩</span> te donne un <b>fragment</b> de la phrase secrète…</div>
      <div data-evt="etoile"><span>⭐</span> …qui, le 24 décembre, <b>rallumera l'étoile</b>, chassera Kryos et nous rendra la liberté !</div>
    </div>
    <p data-scene="cours">Pas besoin d'être un génie de l'informatique : un peu de curiosité, <b>un crayon et du papier</b> suffiront. Avant d'être capturés, mes lutins ont caché un <b>petit cours</b> devant chaque énigme, et des <b>indices</b> si tu bloques.</p>
    <p class="interrompu" data-scene="menace">Mais surtout, quoi qu'il arrive, ne</p>
    <div class="fin-gelee">
      <p class="gravure">Trop tard, vieux barbu.<br>Ce Noël m'appartient.${nom ? `<br>Et toi, ${nom}… je t'attends.` : ''}<br><span class="signe-gravure">— K.</span></p>
    </div>`;
  // Le prénom du joueur, prêt à être glissé dans du HTML
  const prenomHTML = () => (S && S.nom ? String(S.nom).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '');

  // Les fissures qui zèbrent la lettre gelée (coordonnées en % de la lettre).
  const FISSURES = '<svg class="fissures" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
    ['M100 18 88 23 84 19 73 30 67 27 58 38 61 45 50 52', 'M50 52 38 57 31 53 20 62 13 60 0 70', 'M50 52 54 63 47 71 52 82 45 91 48 100',
      'M58 38 66 46 78 47 86 56 100 58', 'M31 53 27 44 30 36 22 30', 'M47 71 34 76 26 86 14 88', 'M73 30 75 15 70 8 72 0']
      .map(d => `<path d="${d}"/>`).join('') + '</svg>';

  // La neige qui tombe sur la lettre : une neige douce, et une tempête qui se lève quand Kryos attaque.
  function neigeLettre(scene) {
    if (mouvementReduit()) return;
    let couche = scene.querySelector('.neige-lettre');
    const hauteur = Math.max(scene.offsetHeight, 400) + 40;
    if (!couche) {
      const flocons = (nombre, tempete) => Array.from({ length: nombre }, () => {
        const glyphe = !tempete && Math.random() < 0.3;
        const taille = glyphe ? 9 + Math.random() * 9 : (tempete ? 1.5 + Math.random() * 3 : 2 + Math.random() * 3.5);
        const vitesse = tempete ? 380 + Math.random() * 300 : 45 + Math.random() * 55; // pixels par seconde
        const f = h('i', { class: glyphe ? 'glyphe' : '' }, glyphe ? '❄' : '');
        f.style.cssText = `left:${Math.random() * 100}%;width:${taille}px;height:${taille}px;font-size:${taille}px;` +
          `--dx:${Math.round((tempete ? -160 - Math.random() * 220 : Math.random() * 80 - 40))}px;--vitesse:${vitesse}`;
        return f;
      });
      couche = h('div', { class: 'neige-lettre', 'aria-hidden': 'true' },
        h('div', { class: 'douce' }, flocons(46, false)), h('div', { class: 'tempete' }, flocons(70, true)));
      scene.prepend(couche);
    }
    // La durée de chute dépend de la hauteur de la lettre (vitesse constante, départs étalés)
    couche.style.setProperty('--h', hauteur + 'px');
    couche.querySelectorAll('i').forEach(f => {
      const duree = hauteur / Number(f.style.getPropertyValue('--vitesse'));
      f.style.animationDuration = duree + 's';
      f.style.animationDelay = -(Math.random() * duree) + 's';
    });
  }

  /* La lettre s'écrit toute seule, à l'encre dorée d'une plume magique, sous la neige.
     - Intro (la lettre contient .fin-gelee) : l'enveloppe arrive, le sceau saute, la lettre sort,
       la plume écrit. Quand le nom de Kryos apparaît, la lettre frissonne et le givre gagne
       les coins. Puis, juste avant la fin, la plume hésite… la tempête se lève, le givre envahit
       toute la lettre, la plume gèle et tombe, la glace se fissure et Kryos grave sa menace.
     - Jour 24 (options.enveloppe = false) : la dernière lettre du Père Noël, signée et scellée.
     instantane : tout s'affiche d'un coup (lettre déjà lue, ou animations réduites).
     surScene(nom) / surEvenement(nom) : la plume arrive dans un paragraphe marqué data-scene,
     ou sur un passage marqué data-evt (le décor derrière la lettre raconte l'histoire).
     La plume écrit à un rythme régulier et ne s'arrête jamais pour le décor : c'est le décor qui
     suit la lettre (demande de l'utilisateur, 2026-11-16).
     Renvoie une fonction qui termine l'animation tout de suite. */
  function animerLettre(scene, lettre, { instantane, complet, enveloppe = true, surGel = () => {}, surScene = () => {}, surEvenement = () => {} }) {
    const modale = $('#modale');
    const finGelee = lettre.querySelector('.fin-gelee');
    const corps = [...lettre.children].filter(el => !el.matches('.bas-lettre, .ps, .fin-gelee'));
    const ps = lettre.querySelector('.ps');
    const bas = lettre.querySelector('.bas-lettre');
    const signature = lettre.querySelector('.signature');
    const sceau = lettre.querySelector('.sceau');
    const plume = h('div', { class: 'plume', 'aria-hidden': 'true', html: PLUME });
    const halo = h('div', { class: 'halo-plume', 'aria-hidden': 'true' }); // la lumière dorée sous la pointe de la plume
    const poussiere = []; // les étincelles d'or, réutilisées
    let observateur = null;
    const minuteurs = [];
    let fini = false, raf = 0, suivre = true, dernierDefilement = 0;

    if (finGelee) lettre.append(h('div', { class: 'couche-givre', 'aria-hidden': 'true' }), h('div', { html: FISSURES }).firstChild);
    neigeLettre(scene);

    const arreterSuivi = () => { suivre = false; };
    const nettoyer = () => {
      minuteurs.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      ['wheel', 'touchmove', 'keydown'].forEach(e => modale.removeEventListener(e, arreterSuivi));
      if (observateur) observateur.disconnect();
    };
    const vivant = () => { if (!fini && !lettre.isConnected) { fini = true; nettoyer(); } return !fini; };
    const plusTard = (f, ms) => minuteurs.push(setTimeout(() => { if (vivant()) f(); }, ms));

    function finir() {
      if (fini) return;
      fini = true;
      nettoyer();
      surScene('fin');
      scene.querySelectorAll('.enveloppe').forEach(e => e.remove());
      plume.remove();
      halo.remove();
      poussiere.forEach(e => e.remove());
      scene.classList.remove('blizzard');
      lettre.classList.remove('sortie', 'en-ecriture', 'frisson', 'assaut', 'tension', 'tampon');
      lettre.classList.add('tout-ecrit');
      if (finGelee) { lettre.classList.add('givree', 'gelee', 'fissure', 'fige'); finGelee.classList.add('gravee'); }
      complet();
    }
    if (instantane) { finir(); return finir; }

    // Chaque caractère devient un petit <span> invisible, qui apparaîtra sous la plume.
    const segmenteur = window.Intl && Intl.Segmenter ? new Intl.Segmenter(I18N.langue, { granularity: 'grapheme' }) : null;
    function decouper(racines) {
      const caracteres = [];
      for (const racine of racines) {
        if (!racine) continue;
        const parcours = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
        const noeuds = [];
        while (parcours.nextNode()) noeuds.push(parcours.currentNode);
        for (const n of noeuds) {
          // Les blancs entre deux paragraphes ne s'écrivent pas ; un espace entre deux mots mis en forme, si
          // (sinon la voix lirait « visage.Le Sauveur » d'une traite).
          if (!n.nodeValue.trim() && !n.parentElement.closest('p, .regles > div')) continue;
          const morceaux = segmenteur ? [...segmenteur.segment(n.nodeValue)].map(s => s.segment) : Array.from(n.nodeValue);
          const fragment = document.createDocumentFragment();
          for (const c of morceaux) {
            const s = document.createElement('span');
            s.className = 'encre';
            s.textContent = c;
            fragment.append(s);
            caracteres.push(s);
          }
          n.replaceWith(fragment);
        }
      }
      return caracteres;
    }
    const texteCorps = decouper(corps);
    const textePs = decouper([ps]);
    const texteGravure = finGelee ? decouper([finGelee]) : [];
    lettre.classList.add('en-ecriture');
    if (enveloppe) lettre.classList.add('sortie');
    ['wheel', 'touchmove', 'keydown'].forEach(e => modale.addEventListener(e, arreterSuivi, { passive: true }));

    function placerPlume(x, y, duree = 0) {
      plume.style.transitionDuration = duree + 's';
      plume.style.transform = `translate(${x - 2}px, ${y - 38}px)`;
      halo.style.transitionDuration = duree + 's';
      halo.style.transform = `translate(${x - 55}px, ${y - 62}px)`;
    }
    function suivrePlume(el, toujours) {
      if (!suivre || (!toujours && Date.now() - dernierDefilement < 700)) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > innerHeight - 120) { dernierDefilement = Date.now(); modale.scrollBy({ top: r.bottom - innerHeight + 260, behavior: 'smooth' }); }
    }
    // La poussière d'or de la plume : un petit stock d'étincelles et d'étoiles réutilisées,
    // animées par le navigateur sans recalcul de la mise en page.
    let prochaineEtincelle = 0;
    function etincelle(x, y, fort = false) {
      if (!lettre.animate) return;
      let e = poussiere[prochaineEtincelle];
      if (!e) {
        const etoile = prochaineEtincelle % 4 === 1;
        e = h('span', { class: 'poussiere-or' + (etoile ? ' etoile-or' : ''), 'aria-hidden': 'true' }, etoile ? '✦' : '');
        poussiere[prochaineEtincelle] = e;
        lettre.append(e);
      }
      prochaineEtincelle = (prochaineEtincelle + 1) % 28;
      const dx = Math.random() * 36 - 14, monte = 8 + Math.random() * 22, tombe = 22 + Math.random() * 34;
      const taille = fort ? 1.5 : 0.7 + Math.random() * 0.7;
      e.animate([
        { transform: `translate(${x}px, ${y}px) scale(${taille})`, opacity: 1 },
        { transform: `translate(${x + dx * 0.6}px, ${y - monte}px) scale(${taille * 0.9})`, opacity: 0.95, offset: 0.35 },
        { transform: `translate(${x + dx}px, ${y - monte + tombe}px) scale(0.15)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 800, easing: 'cubic-bezier(.2, .6, .4, 1)', fill: 'both' });
    }
    // Le nom de Kryos : la lettre frissonne, le givre gagne les coins, une rafale passe
    function frisson() {
      lettre.classList.remove('frisson');
      void lettre.offsetWidth;
      lettre.classList.add('frisson', 'givree', 'bougie-faible');
      scene.classList.add('blizzard');
      son('givre');
      son('vent');
      plusTard(() => { scene.classList.remove('blizzard'); lettre.classList.remove('bougie-faible'); }, 2600);
    }
    // Les derniers mots : la plume hésite, la tempête se lève
    let tensionLancee = false;
    function tension() {
      tensionLancee = true;
      lettre.classList.add('tension');
      plume.classList.add('tremble');
      scene.classList.add('blizzard');
      son('vent');
    }

    const blocDe = (s) => s.closest('p, .regles > div');
    const pauseApres = (c) => (/[.!?…]/.test(c) ? 280 : /[,;:]/.test(c) ? 130 : 0);
    const VITESSE = 1000 / 30; // 30 caractères par seconde : on lit au rythme de la plume

    // Les positions des caractères sont mesurées en une seule fois (et de nouveau si la fenêtre
    // change de taille) : les relire à chaque caractère forçait le navigateur à refaire toute
    // la mise en page, et c'était une des causes des saccades.
    const positions = new Map();
    let positionsAJour = false, repere = 0, defilement = null;
    if (window.ResizeObserver) { observateur = new ResizeObserver(() => { positionsAJour = false; }); observateur.observe(lettre); }
    function mesurer(caracteres) {
      for (const s of caracteres) positions.set(s, { x: s.offsetLeft + s.offsetWidth, y: s.offsetTop + s.offsetHeight * 0.85, ligne: s.offsetTop });
      repere = lettre.getBoundingClientRect().top - modale.getBoundingClientRect().top + modale.scrollTop;
      positionsAJour = true;
    }
    // La fenêtre défile toute seule, en douceur, pour garder la plume vers le milieu de l'écran
    // (jusqu'à ce que le joueur fasse défiler lui-même).
    function suivreEnDouceur(y) {
      if (!suivre) return;
      if (defilement === null || Math.abs(modale.scrollTop - defilement) > 3) defilement = modale.scrollTop;
      const cible = repere + y - innerHeight * 0.58;
      if (cible <= defilement + 1) return;
      defilement += (cible - defilement) * 0.07;
      modale.scrollTop = defilement;
    }
    const douce = (t) => t * t * (3 - 2 * t);

    // rythme(k) : délai (ms) avant le caractère k, calculé au dernier moment (la plume suit la voix).
    let derniereScene = null, dernierEvt = null;
    function ecrire(caracteres, ensuite, rythme = null) {
      if (!caracteres.length) { ensuite(); return; }
      positionsAJour = false;
      // Tout ce qui ne change pas pendant l'écriture est préparé d'avance
      const infos = caracteres.map((s, k) => {
        const avant = caracteres[k - 1];
        const interrompu = !!s.closest('.interrompu');
        const nouveauBloc = !!avant && blocDe(s) !== blocDe(avant);
        let delai = 0;
        // La phrase interrompue s'écrit lentement, en tremblant : quelque chose approche…
        if (k > 0) delai = interrompu ? VITESSE * 3.2 + Math.random() * 90 + (nouveauBloc ? 900 : 0)
          : VITESSE + pauseApres(avant.textContent) + (nouveauBloc ? 420 : 0);
        const marqueScene = s.closest('[data-scene]'), marqueEvt = s.closest('[data-evt]');
        return {
          delai, interrompu, regle: s.closest('.regles > div'), visible: !!s.textContent.trim(),
          nomDuMechant: s.parentElement.classList.contains('mot-givre') && s === s.parentElement.firstElementChild,
          glisse: interrompu ? delai : Math.min(delai, VITESSE * 1.5), // la plume ne se déplace qu'à la fin des pauses
          scene: marqueScene ? marqueScene.dataset.scene : null, evt: marqueEvt,
        };
      });
      const majDelai = (k) => {
        if (!rythme || k === 0) return;
        const d = Math.max(0, rythme(k));
        infos[k].delai = d;
        infos[k].glisse = Math.min(d, VITESSE * 1.5);
      };
      plume.style.transitionDuration = halo.style.transitionDuration = '0s';
      let i = 0, prochain = performance.now();
      const pas = (maintenant) => {
        if (!vivant()) return;
        if (!positionsAJour) mesurer(caracteres);
        let n = 0;
        while (i < caracteres.length && maintenant >= prochain + infos[i].delai && n++ < 8) {
          const s = caracteres[i], info = infos[i];
          // (La plume ne s'arrête jamais pour le décor : c'est lui qui suit la lettre, cf. cinema.js.)
          prochain += info.delai;
          i++;
          s.classList.add('ecrit');
          if (info.scene && info.scene !== derniereScene) { derniereScene = info.scene; surScene(info.scene); }
          if (info.evt && info.evt !== dernierEvt) { dernierEvt = info.evt; surEvenement(info.evt.dataset.evt); }
          if (info.regle) info.regle.classList.add('commence');
          if (info.nomDuMechant) frisson();
          if (!tensionLancee && info.interrompu) tension();
          if (info.visible && Math.random() < 0.42) { const p = positions.get(s); etincelle(p.x, p.y); }
          if (i < caracteres.length) majDelai(i);
        }
        // La plume glisse en continu du dernier caractère écrit vers le suivant
        const a = positions.get(caracteres[Math.max(0, i - 1)]);
        let x = a.x, y = a.y;
        if (i < caracteres.length && i > 0) {
          const b = positions.get(caracteres[i]), info = infos[i];
          const t = Math.min(1, Math.max(0, 1 - (prochain + info.delai - maintenant) / Math.max(info.glisse, 1)));
          if (t > 0) {
            if (b.ligne === a.ligne) { x = a.x + (b.x - a.x) * t; y = a.y + (b.y - a.y) * t; }
            else { const e = douce(t); x = a.x + (b.x - a.x) * e; y = a.y + (b.y - a.y) * e; } // retour à la ligne
          }
        }
        placerPlume(x, y, 0);
        suivreEnDouceur(y);
        if (i < caracteres.length) raf = requestAnimationFrame(pas);
        else ensuite();
      };
      raf = requestAnimationFrame(pas);
    }

    const ecrireLu = ecrire; // (la lettre était lue à voix haute : voix retirées, jugées terrifiantes)

    // Kryos gèle la lettre et grave sa menace dans la glace.
    function geler() {
      surGel();
      surScene('gel');
      lettre.classList.remove('frisson');
      lettre.classList.add('assaut', 'givree');
      // La tempête se fige avec la lettre (ses 70 flocons, par-dessus le givre qui gagne, faisaient
      // tomber Firefox à 20 images/s pendant tout le gel)
      scene.classList.remove('blizzard');
      son('craque');
      plusTard(() => {
        // Le givre envahit tout, l'encre devient bleue, la plume gèle et tombe
        lettre.classList.add('gelee');
        plume.classList.remove('tremble');
        plume.classList.add('gelee');
        const r = plume.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
        if (r) placerPlume(+r[1] + 2, +r[2] + 38 + 160, 1.6);
        son('vent');
      }, 700);
      plusTard(() => { lettre.classList.add('fissure'); son('craque'); }, 2900);
      plusTard(() => son('craque'), 3250);
      plusTard(() => { finGelee.classList.add('visible'); suivrePlume(finGelee, true); }, 3700);
      plusTard(() => graver(texteGravure, () => {
        son('ricane');
        plusTard(() => { lettre.classList.remove('assaut', 'tension'); scene.classList.remove('blizzard'); lettre.classList.add('fige'); }, 900);
        plusTard(finir, 2200);
      }), 4500);
    }
    // La menace apparaît lettre par lettre, comme griffée dans la glace
    function graver(caracteres, ensuite) {
      let k = 0;
      const suivant = () => {
        if (k >= caracteres.length) { finGelee.classList.add('gravee'); ensuite(); return; }
        const s = caracteres[k++];
        s.classList.add('ecrit');
        const finDeLigne = s.nextSibling && s.nextSibling.nodeName === 'BR';
        plusTard(suivant, /[.,]/.test(s.textContent) || finDeLigne ? 420 : 75);
      };
      suivant();
    }

    // Pour la lettre d'intro : 1. l'enveloppe, adressée au joueur, arrive de très loin à travers
    // la tempête et vole vers lui en tournoyant ; son sceau saute, la lettre en sort et se déplie.
    if (enveloppe) {
      scene.prepend(h('div', { class: 'enveloppe', 'aria-hidden': 'true' },
        h('div', { class: 'env-lueur' }),
        h('div', { class: 'env-dos' }), h('div', { class: 'env-face' }),
        S && S.nom ? h('div', { class: 'env-adresse' }, t('Pour {nom}', { nom: S.nom })) : null,
        h('div', { class: 'env-rabat' }),
        h('div', { class: 'env-sceau' }, I18N.langue === 'en' ? 'SC' : 'PN'),
        ['a', 'b', 'c', 'd'].map(k => h('i', { class: 'env-etoile ' + k }, '✦'))));
      son('envol');
      plusTard(() => son('clic'), 2050);
    }
    // 2. La plume écrit le corps de la lettre.
    plusTard(() => {
      scene.querySelectorAll('.enveloppe').forEach(e => e.remove());
      lettre.classList.remove('sortie');
      lettre.append(halo, plume);
      ecrireLu(texteCorps, () => {
        // 3a. Intro : Kryos gèle la lettre avant la fin.
        if (finGelee) { plusTard(geler, 650); return; }
        // 3b. Sinon : la signature se trace, puis le sceau est apposé, puis le post-scriptum.
        plusTard(() => {
          signature.classList.add('ecrite');
          placerPlume(bas.offsetLeft + signature.offsetLeft + signature.offsetWidth, bas.offsetTop + signature.offsetTop + signature.offsetHeight * 0.7, 1.6);
          suivrePlume(bas, true);
        }, 350);
        plusTard(() => { plume.classList.add('levee'); halo.classList.add('eteint'); sceau.classList.add('appose'); lettre.classList.add('tampon'); son('tampon'); }, 2300);
        plusTard(() => lettre.classList.remove('tampon'), 2900);
        plusTard(() => { plume.classList.remove('levee'); halo.classList.remove('eteint'); ecrireLu(textePs, () => plusTard(finir, 500)); }, 3100);
      });
    }, enveloppe ? 3900 : 400);
    return finir;
  }

  // Jour 24 : la fin de la lettre du 1er décembre dégèle, puis le Père Noël écrit sa dernière lettre.
  // enDirect : première réussite (sinon tout s'affiche d'un coup). Renvoie la fonction qui lance
  // le spectacle (appelée quand le joueur quitte la grande célébration), ou null.
  function preparerFinale(fin, enDirect) {
    const degel = fin.querySelector('.lettre-degel');
    const finale = fin.querySelector('.lettre-finale');
    if (!degel || !finale) return null;
    degel.append(h('div', { class: 'couche-givre', 'aria-hidden': 'true' }));
    const bouton = h('button', { type: 'button', class: 'btn btn-principal btn-geant', onclick: () => { fermerModale(); admirerSapin({ finale: true }); } }, t('✨ Admirer le sapin illuminé'));
    fin.append(h('p', { class: 'centre admirer-final' }, bouton));
    if (!enDirect) {
      degel.classList.add('degele');
      animerLettre(finale.parentElement, finale, { instantane: true, enveloppe: false, complet: () => {} });
      return null;
    }
    bouton.hidden = true;
    finale.classList.add('en-attente');
    return () => {
      if (!degel.isConnected) return;
      fin.scrollIntoView({ behavior: 'smooth', block: 'start' });
      son('degel');
      degel.classList.add('degel');
      setTimeout(() => {
        if (!finale.isConnected) return;
        degel.classList.add('degele');
        finale.classList.remove('en-attente');
        animerLettre(finale.parentElement, finale, {
          instantane: false, enveloppe: false,
          complet: () => { bouton.hidden = false; son('victoire'); bouton.focus({ preventScroll: true }); bouton.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
        });
      }, 3800);
    };
  }

  /* L'arrivée dans l'aventure, en trois temps :
     1. « Qui es-tu ? » : le joueur donne son prénom et un mot de passe (ou se connecte) ;
     2. la lettre du Père Noël, prisonnier de Kryos, arrive jusqu'à lui et s'écrit à son prénom ;
     3. il accepte la mission… et la magie de la lettre le téléporte au chalet.
     Une fois connecté, le bouton 📜 rouvre la lettre (déjà écrite) avec « Retour au chalet ».
     options.mode : 'inscription' ou 'connexion' ; options.raison : message en haut ;
     options.ensuite : jour à ouvrir une fois arrivé au chalet. */
  function ouvrirIntro(options = {}) {
    const J = { jour: 99, decor: 'village', particules: ['✉️', '❄️', '⭐'], couleurs: ['#0a1a33', '#1f4f85'], emoji: '📜' };
    const connecte = !!(S && S.connecte);
    let mode = options.mode || 'inscription';
    let recrue = false; // vient de créer son compte : la lettre se termine sur « J'accepte la mission ! »

    const lettre = h('div', { class: 'lettre-pole-nord' });
    const scene = h('div', { class: 'scene-lettre' }, lettre);
    let cinema = null; // le décor qui raconte l'histoire derrière la lettre
    // Pas de bouton pour passer : la lettre se savoure jusqu'au bout. Juste un petit signe qu'elle s'écrit.
    const ecritEnCours = h('p', { class: 'ecriture-en-cours', 'aria-hidden': 'true' }, t("✒️ Le Père Noël t'écrit…"));
    const boutonMission = h('button', { type: 'button', class: 'btn btn-principal' }, t('🏡 Retour au chalet'));
    boutonMission.addEventListener('click', () => {
      if (!recrue) { fermerModale(); return; }
      boutonMission.disabled = true;
      teleporter(() => arriverAuChalet('inscription'), boutonMission, lettre);
    });
    const revoir = h('button', { type: 'button', class: 'lien revoir-lettre' }, t("✒️ Regarder le Père Noël l'écrire"));
    // Sous la lettre gelée : la promesse du 24 décembre (ou, une fois Noël sauvé, le lien vers la fin dégelée).
    const noelSauve = !!(S && S.connecte && estResolu(24));
    const legende = noelSauve
      ? h('button', { type: 'button', class: 'lien legende-gel', onclick: async () => { await ouvrirJour(24); const fin = document.querySelector('.fin-de-lettre'); if (fin) fin.scrollIntoView({ block: 'start' }); } }, t('🌟 Lire la fin de la lettre, dégelée le 24 décembre'))
      : h('p', { class: 'legende-gel' }, t("❄️ La fin de la lettre est prisonnière de la glace… Seule l'étoile du 24 décembre pourra la faire fondre."));
    const pied = h('div', { class: 'centre pied-intro' }, ecritEnCours, legende, boutonMission, h('div', {}, revoir));
    const etapeLettre = h('div', { class: 'etape-lettre' }, scene, pied);
    const raison = options.raison ? h('p', { class: 'message visible info' }, options.raison) : null;

    let lettreLancee = false;
    let finirLettre = () => {};
    function lancerLettre(instantane) {
      lettre.className = 'lettre-pole-nord';
      lettre.innerHTML = (I18N.langue === 'en' ? LETTRE_EN : LETTRE_FR)(prenomHTML());
      pied.classList.toggle('en-cours', !instantane);
      pied.classList.remove('termine');
      revoir.hidden = true;
      boutonMission.textContent = recrue ? t("🎅 J'accepte la mission !") : t('🏡 Retour au chalet');
      boutonMission.classList.toggle('btn-geant', recrue);
      ecritEnCours.textContent = t("✒️ Le Père Noël t'écrit…");
      // Le décor derrière la lettre : il raconte l'histoire au fil de la plume
      if (cinema) cinema.detruire();
      cinema = window.CINEMA ? CINEMA.creer($('#modale'), { prenom: S && S.nom }) : null;
      $('#modale').classList.add('cinema-actif');
      if (cinema) { if (instantane) cinema.finale(); else cinema.scene('cachot'); } // l'enveloppe part du cachot du Père Noël
      // La lettre arrive : boum, puis plus de musique (celle du chalet s'efface aussi quand on la
      // relit) : seul le son des vidéos du décor accompagne la lettre.
      if (!instantane && recrue) son('boum');
      MUSIQUE.jouer(null, { fondu: 0.6 });
      finirLettre = animerLettre(scene, lettre, {
        instantane,
        surScene: (nom) => { if (cinema) cinema.scene(nom); },
        surEvenement: (nom) => { if (cinema) cinema.evenement(nom); },
        surGel: () => { ecritEnCours.textContent = t('❄️ Quelque chose gèle la lettre…'); },
        complet: () => {
          pied.classList.remove('en-cours');
          pied.classList.add('termine');
          revoir.hidden = !instantane;
          prefs.lettreGelee = true; // la lettre où Kryos gèle la fin (l'ancienne s'appelait lettreLue)
          sauverPrefs();
        },
      });
    }
    revoir.addEventListener('click', () => { $('#modale').scrollTop = 0; lancerLettre(false); });

    // Le joueur arrive au chalet (après la téléportation)
    function arriverAuChalet(accueil) {
      fermerModale();
      window.scrollTo(0, 0);
      montrerProchaineCase();
      const nom = String((S && S.nom) || '').replace(/[&<>]/g, '');
      toast(accueil === 'inscription'
        ? t('🎄 Bienvenue au chalet, <b>{nom}</b> ! Retiens bien ton prénom et ton mot de passe.', { nom })
        : t('🎄 Content de te revoir, <b>{nom}</b> ! Ta progression est restaurée.', { nom }));
      if (options.ensuite) ouvrirJour(options.ensuite);
    }

    let etapeCompte = null;
    let champNom = null;
    if (!connecte) {
      const ongletNouveau = h('button', { type: 'button', class: 'onglet', role: 'tab' }, t('🎄 Première visite'));
      const ongletRetour = h('button', { type: 'button', class: 'onglet', role: 'tab' }, t("🔑 J'ai déjà un compte"));
      champNom = h('input', { type: 'text', class: 'champ-nom', maxlength: '40', autocomplete: 'username', placeholder: t('Ton prénom'), 'aria-label': t('Ton prénom'), spellcheck: 'false' });
      const champMdp = h('input', { type: 'password', class: 'champ-nom', maxlength: '200', placeholder: t('Ton mot de passe'), 'aria-label': t('Ton mot de passe') });
      const voir = h('button', { type: 'button', class: 'voir-mdp', 'aria-label': t('Afficher le mot de passe'), title: t('Afficher le mot de passe') }, '👁️');
      voir.addEventListener('click', () => { champMdp.type = champMdp.type === 'password' ? 'text' : 'password'; });
      const titre = h('h3', { class: 'titre-carnet' });
      const aide = h('small', {});
      const erreur = h('p', { class: 'erreur-nom', role: 'alert' });
      const bouton = h('button', { type: 'submit', class: 'btn btn-principal btn-geant' });
      const carnet = h('form', { class: 'signature-lutin' },
        h('div', { class: 'onglets', role: 'tablist' }, ongletNouveau, ongletRetour),
        titre, champNom, h('div', { class: 'ligne-mdp' }, champMdp, voir), aide, erreur, bouton);
      etapeCompte = h('div', { class: 'etape-compte' }, carnet);

      const majMode = () => {
        ongletNouveau.classList.toggle('actif', mode === 'inscription');
        ongletRetour.classList.toggle('actif', mode === 'connexion');
        ongletNouveau.setAttribute('aria-selected', String(mode === 'inscription'));
        ongletRetour.setAttribute('aria-selected', String(mode === 'connexion'));
        champMdp.autocomplete = mode === 'inscription' ? 'new-password' : 'current-password';
        titre.textContent = mode === 'inscription' ? t('Avant tout… qui es-tu ?') : t('Content de te revoir !');
        aide.textContent = mode === 'inscription'
          ? t("Le Père Noël a une lettre pour toi. Écris ton prénom, puis choisis un mot de passe (6 caractères minimum) que tu n'utilises nulle part ailleurs : ils te permettront de reprendre ta partie sur n'importe quel appareil.")
          : t('Entre le prénom (ou le pseudo) et le mot de passe choisis à ton inscription. Mot de passe oublié ? Demande aux organisateurs.');
        bouton.textContent = mode === 'inscription' ? t("✉️ C'est moi !") : t('🔑 Reprendre ma partie');
        erreur.textContent = '';
      };
      ongletNouveau.addEventListener('click', () => { mode = 'inscription'; majMode(); champNom.focus(); });
      ongletRetour.addEventListener('click', () => { mode = 'connexion'; majMode(); champNom.focus(); });
      majMode();

      let envoi = false;
      carnet.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (envoi) return;
        envoi = true;
        erreur.textContent = '';
        const inscription = mode === 'inscription';
        titreRetenu = true; // le chalet n'apparaîtra qu'à la téléportation
        try {
          await appel('POST', inscription ? '/api/inscription' : '/api/connexion', { nom: champNom.value, motDePasse: champMdp.value });
          await rafraichir();
          if (inscription) { recrue = true; montrer('lettre'); }
          else { bouton.disabled = true; teleporter(() => arriverAuChalet('connexion'), bouton); }
        } catch (err) {
          titreRetenu = false;
          erreur.textContent = (err.data && err.data.message) || err.message;
          champMdp.value = '';
          champNom.focus();
        } finally {
          envoi = false;
        }
      });
    }

    function montrer(etape) {
      etapeLettre.hidden = etape !== 'lettre';
      if (etapeCompte) etapeCompte.hidden = etape !== 'compte';
      if (etape !== 'lettre') { $('#modale').classList.remove('cinema-actif'); if (cinema) { cinema.detruire(); cinema = null; } }
      if (raison) raison.hidden = recrue; // une fois inscrit, le message du début n'a plus lieu d'être
      $('#modale').scrollTop = 0;
      // La lettre s'écrit sous les yeux du nouveau venu ; ensuite elle s'affiche directement
      // (sauf la toute première fois sur cet appareil).
      if (etape === 'lettre' && !lettreLancee) { lettreLancee = true; lancerLettre(mouvementReduit() || (!recrue && !!prefs.lettreGelee)); }
      if (etape === 'compte' && champNom) setTimeout(() => champNom.focus(), 60);
    }

    const c = h('article', { class: 'jour intro' },
      bandeau(J, t('Message urgent du Pôle Nord'), t('Opération Dégel'), null),
      h('div', { class: 'corps-jour' }, raison, etapeLettre, etapeCompte));
    ouvrirModale(c);
    montrer(connecte ? 'lettre' : 'compte');
  }

  // Devant le chalet : la case du jour est mise en vue (si elle est plus bas sur la façade) et brille un instant
  function montrerProchaineCase() {
    const n = prochainePorte();
    const tuile = n && document.querySelector(`#chalet .piece-chalet[data-jour="${n}"]`);
    if (!tuile) return;
    const r = tuile.getBoundingClientRect();
    if (r.bottom > innerHeight - 30) window.scrollTo({ top: Math.max(0, scrollY + r.top - innerHeight * 0.45), behavior: mouvementReduit() ? 'auto' : 'smooth' });
    setTimeout(() => { tuile.classList.add('a-ouvrir'); setTimeout(() => tuile.classList.remove('a-ouvrir'), 2600); }, 600);
  }

  /* La téléportation : la magie de la lettre emporte le joueur jusqu'au chalet.
     Deux anneaux de lumière dorée partent du bouton, des traînées d'étoiles filent vers les bords
     de l'écran, un éclair blanc envahit tout… et le chalet apparaît quand il se dissipe.
     arrivee() est appelée au plus fort de l'éclair. Seuls transform et opacity sont animés. */
  function teleporter(arrivee, depuis, lettre) {
    if (mouvementReduit()) { arrivee(); return; }
    const r = depuis && depuis.getBoundingClientRect();
    const x = r && r.width ? r.left + r.width / 2 : innerWidth / 2;
    const y = r && r.height ? Math.min(Math.max(r.top + r.height / 2, 0), innerHeight) : innerHeight / 2;
    son('teleport');
    if (lettre) lettre.classList.add('magie');
    const traits = Array.from({ length: 44 }, (_, k) => {
      const i = h('i');
      i.style.cssText = `--angle:${(k * 360 / 44 + Math.random() * 7).toFixed(1)}deg;` +
        `animation-delay:${(0.2 + Math.random() * 1.1).toFixed(2)}s;animation-duration:${(0.5 + Math.random() * 0.35).toFixed(2)}s`;
      return i;
    });
    const couche = h('div', { class: 'teleportation', 'aria-hidden': 'true' },
      h('div', { class: 'tp-voile' }),
      h('div', { class: 'tp-centre', style: { left: x + 'px', top: y + 'px' } },
        h('div', { class: 'tp-traits' }, traits), h('div', { class: 'tp-anneau' }), h('div', { class: 'tp-anneau deux' }), h('div', { class: 'tp-eclair' })));
    document.body.append(couche);
    // Au plus fort de l'éclair, le chalet s'affiche derrière (c'est l'image la plus lourde à dessiner) ;
    // l'éclair ne se dissipe qu'une fois le navigateur redevenu fluide (trois images rapides de suite,
    // 1,2 s au plus), pour ne pas saccader ni dévoiler un chalet à moitié dessiné.
    setTimeout(() => {
      arrivee();
      quandFluide(() => {
        couche.classList.add('arrivee');
        setTimeout(() => confettis(40), 250); // une poussière d'étoiles retombe sur le chalet
        setTimeout(() => couche.remove(), 1500);
      });
    }, 1750);
  }
  function quandFluide(f, max = 1200) {
    const t0 = performance.now();
    let avant = t0, calmes = 0;
    requestAnimationFrame(function image(n) {
      calmes = n - avant < 40 ? calmes + 1 : 0;
      avant = n;
      if (calmes >= 3 || n - t0 > max) f(); else requestAnimationFrame(image);
    });
  }

  function ouvrirFragments() {
    const frags = S ? S.fragments : [];
    const liste = frags.map(f => h('div', { class: 'carte-fragment' + (f.lettre ? '' : ' vide') },
      h('small', {}, t('Jour {n}', { n: f.jour })),
      h('code', {}, f.lettre ? f.positionBinaire : '?????'),
      h('b', {}, f.lettre || '❓')));
    const nb = frags.filter(f => f.lettre).length;
    const J = { jour: 98, decor: 'montagnes', particules: ['✨', '⭐', '❄️'], couleurs: ['#2a1d00', '#7a5a10'], emoji: '🧩' };
    const c = h('article', { class: 'jour' },
      bandeau(J, t('{n} / 23 fragments', { n: nb }), t('Tes fragments'), null),
      h('div', { class: 'corps-jour' },
        h('p', {}, t('Chaque fragment est une lettre de la phrase secrète du 24 décembre. Le nombre écrit en binaire est sa position dans la phrase.')),
        h('div', { class: 'inventaire' }, liste)));
    ouvrirModale(c);
  }

  // ensuite : ce qui se passe quand le joueur quitte la célébration (le dégel de la lettre du Père Noël).
  function celebrationFinale(ensuite) {
    const couche = h('div', { class: 'celebration', role: 'dialog', 'aria-label': t('Noël est sauvé') },
      h('div', { class: 'celebration-contenu' },
        h('div', { class: 'grande-etoile', 'aria-hidden': 'true' }, '★'),
        h('h2', {}, t('NOËL EST SAUVÉ !')),
        h('p', {}, t("L'étoile brille… Kryos s'enfuit en hurlant dans son glacier… Le traîneau décolle ! 🛷✨")),
        h('p', { class: 'petit' }, S && S.nom ? t('Merci, {nom}, Sauveur de Noël. Joyeux Noël ! 🎄', { nom: S.nom }) : t('Merci, Sauveur de Noël. Joyeux Noël ! 🎄')),
        h('button', { type: 'button', class: 'btn btn-principal' }, ensuite ? t('📜 Lire la fin de la lettre du Père Noël') : t('Admirer le sapin'))));
    couche.querySelector('button').addEventListener('click', () => {
      couche.remove();
      if (ensuite) ensuite();
      else { fermerModale(); admirerSapin({ finale: true }); }
    });
    document.body.append(couche);
    confettis(200);
    couche.querySelector('button').focus();
  }

  /* ---------- Ambiance : neige, traîneau, paillettes ---------- */
  // Les étoiles du ciel : de petits points (une étoile en dégradé couvrait tout le ciel, et Firefox
  // les recalculait toutes dès que quelque chose bougeait devant). La moitié scintille, chacune à son rythme.
  function cielEtoile() {
    const E = [[8, 12, 1.4], [18, 32, 1], [27, 8, 1.6], [36, 22, 1, '#cfe4ff'], [44, 40, 1.3], [52, 14, 1], [61, 30, 1.8, '#fff6d8'], [69, 6, 1],
      [77, 26, 1.2], [86, 16, 1, '#cfe4ff'], [93, 36, 1.5], [4, 44, 1], [14, 58, 1], [32, 52, 1.2], [57, 54, 1], [82, 50, 1.3]];
    const point = ([x, y, r, c], scintille, i) => `<i${scintille ? ' class="scintille"' : ''} style="left:${x}%;top:${y}%;--t:${(r * 2).toFixed(1)}px${c ? ';--c:' + c : ''}${scintille ? ';animation-delay:-' + ((i * 1.37) % 8).toFixed(2) + 's' : ''}"></i>`;
    $('.etoiles').innerHTML = E.map(e => point(e, false)).join('') + E.map(([x, y, r, c], i) => point([x + 3, y + 4, r, c], true, i)).join('');
  }

  // Firefox redessine tout un dessin SVG dès qu'une seule de ses formes bouge. Les petites animations
  // d'un grand dessin (la fumée des cheminées) passent donc dans un calque SVG transparent posé
  // exactement par-dessus (même viewBox, même cadrage) : seul ce calque presque vide est redessiné.
  // Le dessin d'origine doit remplir son parent positionné (voir .calque-anime).
  function calqueAnime(svg, selecteur) {
    const formes = svg ? svg.querySelectorAll(selecteur) : [];
    if (!formes.length) return;
    const calque = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    for (const a of ['viewBox', 'preserveAspectRatio']) if (svg.hasAttribute(a)) calque.setAttribute(a, svg.getAttribute(a));
    calque.setAttribute('class', 'calque-anime');
    calque.setAttribute('aria-hidden', 'true');
    calque.append(...formes);
    svg.after(calque);
  }

  function neige() {
    const c = $('#neige');
    const ctx = c.getContext('2d');
    let l, ht;
    const taille = () => { l = c.width = window.innerWidth; ht = c.height = window.innerHeight; };
    taille();
    window.addEventListener('resize', taille);
    if (mouvementReduit()) return;
    const nouveau = (debut) => ({ x: Math.random() * l, y: debut ? Math.random() * ht : -10, r: 0.7 + Math.random() * 2.8, v: 0.25 + Math.random() * 1, d: Math.random() * 6.28, a: 0.35 + Math.random() * 0.6 });
    const flocons = Array.from({ length: Math.min(170, Math.floor(window.innerWidth / 8)) }, () => nouveau(true));
    (function image() {
      // Une fenêtre ouverte recouvre la neige : inutile de la dessiner (et la lettre reste fluide)
      if (document.body.classList.contains('modale-ouverte')) { requestAnimationFrame(image); return; }
      ctx.clearRect(0, 0, l, ht);
      ctx.fillStyle = '#fff';
      for (const f of flocons) {
        f.y += f.v; f.d += 0.012; f.x += Math.sin(f.d) * 0.35;
        if (f.y > ht + 5) Object.assign(f, nouveau(false));
        ctx.globalAlpha = f.a;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 6.283);
        ctx.fill();
      }
      requestAnimationFrame(image);
    })();
  }

  // Mode économe. Certains navigateurs dessinent sans l'aide de la carte graphique (Firefox sur
  // beaucoup de PC portables) : les animations d'ambiance éparpillées sur l'écran (aurores, fumées,
  // scintillements, lueurs des cases, paillettes du sapin) les obligent alors à redessiner presque
  // tout l'écran à chaque image, et le jeu tombait à 2 images/s. On mesure donc la cadence réelle
  // pendant le jeu (lettre comprise) ; si elle reste sous 40 images/s, html.econome fige ces
  // animations-là (style.css, « Mode économe ») et on s'en souvient pour les prochaines visites.
  function surveillerFluidite() {
    const racine = document.documentElement;
    if (prefs.econome) { racine.classList.add('econome'); return; }
    let lentes = 0;
    const plusTard = (ms) => setTimeout(mesurer, ms);
    function mesurer() {
      // (pas pendant une transition ni dans un onglet caché : la mesure serait faussée)
      if (document.hidden || document.querySelector('.entree-chalet, .teleportation')) return plusTard(3000);
      let n = 0, precedente = performance.now();
      const debut = precedente;
      requestAnimationFrame(function image(t) {
        // (une image de plus d'une seconde : l'onglet a été caché entre-temps, on recommence plus tard)
        if (document.hidden || t - precedente > 1000) return plusTard(3000);
        precedente = t;
        n++;
        if (t - debut < 1500) return requestAnimationFrame(image);
        lentes = n * 1000 / (t - debut) < 40 ? lentes + 1 : 0;
        if (lentes < 2) return plusTard(lentes ? 500 : 4000); // (une mesure lente : on vérifie aussitôt)
        racine.classList.add('econome');
        prefs.econome = true;
        sauverPrefs();
      });
    }
    plusTard(2000);
  }

  function traineau() {
    if (mouvementReduit()) return;
    const t = $('#traineau');
    const voler = () => {
      t.classList.remove('vole');
      void t.offsetWidth;
      t.style.top = (6 + Math.random() * 18) + 'vh';
      t.classList.add('vole');
    };
    setTimeout(voler, 4000);
    setInterval(voler, 45000);
  }

  function paillettes() {
    if (mouvementReduit() || window.matchMedia('(pointer: coarse)').matches) return;
    let dernier = 0;
    document.addEventListener('pointermove', (e) => {
      const t = performance.now();
      if (t - dernier < 45) return;
      dernier = t;
      const p = h('span', { class: 'paillette-curseur', 'aria-hidden': 'true' }, Math.random() > 0.5 ? '✦' : '❄');
      p.style.left = e.clientX + 'px';
      p.style.top = e.clientY + 'px';
      p.style.color = COULEURS_BOULES[Math.floor(Math.random() * COULEURS_BOULES.length)];
      document.body.append(p);
      setTimeout(() => p.remove(), 900);
    }, { passive: true });
  }

  /* ---------- Démarrage ---------- */
  /* Le panneau 🔊 : trois curseurs (musique, bruitages, voix du Père Noël). Deux boutons l'ouvrent :
     celui de la barre du jeu, et celui en haut à gauche (écran titre, fenêtres). */
  function appliquerVolumes() {
    MUSIQUE.reglerVolume(prefs.volMusique);
    if (window.CINEMA) CINEMA.reglerVolume(prefs.volMusique); // le son des vidéos de la lettre suit le curseur « Musique »
    reglerSons();
  }
  function majBoutonsSon() {
    const silence = !(prefs.volMusique > 0) && !(prefs.volSons > 0);
    document.querySelectorAll('.btn-son').forEach(b => {
      b.textContent = silence ? '🔇' : '🔊';
      b.setAttribute('aria-label', t('Réglages du son'));
      b.setAttribute('aria-expanded', String(!$('#panneau-son').hidden));
      b.title = t('Réglages du son');
    });
    document.querySelectorAll('#panneau-son input').forEach(c => {
      const v = Math.round((prefs[c.dataset.reglage] || 0) * 100);
      c.value = v;
      c.nextElementSibling.textContent = v ? v + ' %' : t('coupé');
      c.setAttribute('aria-valuetext', v ? v + ' %' : t('coupé'));
    });
    $('#panneau-son .btn-silence').textContent = silence ? t('🔊 Tout remettre') : t('🔇 Tout couper');
  }
  function ouvrirPanneauSon(bouton) {
    const p = $('#panneau-son');
    if (!p.hidden) { fermerPanneauSon(); return; }
    p.hidden = false;
    // Sous le bouton qui l'ouvre, sans sortir de l'écran
    const r = bouton.getBoundingClientRect();
    const largeur = Math.min(300, innerWidth - 16);
    p.style.top = Math.round(r.bottom + 8) + 'px';
    p.style.left = Math.round(Math.max(8, Math.min(r.left + r.width / 2 - largeur / 2, innerWidth - largeur - 8))) + 'px';
    p.style.width = largeur + 'px';
    p.dataset.bouton = bouton.id;
    majBoutonsSon();
    p.querySelector('input').focus({ preventScroll: true });
  }
  function fermerPanneauSon() {
    const p = $('#panneau-son');
    if (p.hidden) return;
    p.hidden = true;
    majBoutonsSon();
    const b = document.getElementById(p.dataset.bouton);
    if (b && b.offsetParent) b.focus({ preventScroll: true });
  }
  function brancherPanneauSon() {
    document.querySelectorAll('.btn-son').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); ouvrirPanneauSon(b); }));
    document.querySelectorAll('#panneau-son input').forEach(c => {
      c.addEventListener('input', () => {
        prefs[c.dataset.reglage] = c.value / 100;
        appliquerVolumes();
        majBoutonsSon();
      });
      c.addEventListener('change', () => {
        sauverPrefs();
        if (c.dataset.reglage === 'volSons') son('clic');
      });
    });
    $('#panneau-son .btn-silence').addEventListener('click', () => {
      const silence = !(prefs.volMusique > 0) && !(prefs.volSons > 0);
      Object.assign(prefs, silence ? VOLUMES_DEFAUT : { volMusique: 0, volSons: 0 });
      sauverPrefs();
      appliquerVolumes();
      majBoutonsSon();
    });
    $('#panneau-son').addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', fermerPanneauSon);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#panneau-son').hidden) { e.stopImmediatePropagation(); fermerPanneauSon(); } }, true);
    window.addEventListener('resize', fermerPanneauSon);
  }

  // Bouton de langue : il affiche l'autre langue disponible
  // (nom complet sur grand écran, « EN » / « FR » sur téléphone).
  function majBoutonsLangue() {
    document.querySelectorAll('.btn-langue').forEach(b => {
      const [long, court] = I18N.langue === 'fr' ? ['English', 'EN'] : ['Français', 'FR'];
      b.replaceChildren(h('span', { 'aria-hidden': 'true' }, '🌐 '), h('span', { class: 'langue-long' }, long), h('span', { class: 'langue-court', 'aria-hidden': 'true' }, court));
      b.setAttribute('aria-label', I18N.langue === 'fr' ? 'Switch to English' : 'Passer en français');
      b.setAttribute('lang', I18N.langue === 'fr' ? 'en' : 'fr');
      b.addEventListener('click', () => I18N.changer(I18N.langue === 'fr' ? 'en' : 'fr'));
    });
  }

  async function demarrer() {
    I18N.traduirePage();
    majBoutonsLangue();
    cielEtoile();
    $('#paysage').innerHTML = DECORS.paysage();
    calqueAnime($('#paysage svg'), '.d-fumee');
    $('#illustration-titre').innerHTML = PIECES.chaletTitre();
    calqueAnime($('#illustration-titre .chalet-titre'), '.d-fumee');
    $('#btn-commencer').addEventListener('click', () => ouvrirIntro({ mode: 'inscription' }));
    $('#btn-reprendre').addEventListener('click', () => ouvrirIntro({ mode: 'connexion' }));
    construireSapin();
    construireChalet();
    majSapin();
    majChalet();
    neige();
    surveillerFluidite();
    traineau();
    paillettes();
    appliquerVolumes();
    brancherPanneauSon();
    majBoutonsSon();
    sauverPrefs(); // les anciens réglages 🔔 / 🎵 sont convertis une fois pour toutes

    $('#btn-histoire').addEventListener('click', () => ouvrirIntro());
    $('#btn-fragments').addEventListener('click', ouvrirFragments);
    $('#btn-reinitialiser').addEventListener('click', async () => {
      if (!window.confirm(t('Mode test : effacer ta progression sur le serveur ?'))) return;
      try { await appel('POST', '/api/reinitialiser'); await rafraichir(); toast(t('🧹 Progression effacée.')); }
      catch (err) { toast(err.message); }
    });
    $('#modale').addEventListener('click', (e) => { if (e.target.id === 'modale') fermerModale(); });
    $('#modale .fermer').addEventListener('click', fermerModale);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (vitrine) vitrine.fermer(); else fermerModale(); } });
    $('#sapin').addEventListener('click', () => { if (!vitrine) admirerSapin(); });
    $('#btn-admirer').addEventListener('click', () => admirerSapin());

    await rafraichir();
    setInterval(majCompteRebours, 30000);
    setInterval(() => rafraichir(), 10 * 60 * 1000);
  }

  document.addEventListener('DOMContentLoaded', demarrer);
})();
