/* =========================================================
   NOËL-OS — La musique du jeu (fichiers dans public/musique/)
   Un seul morceau à la fois, en fondu enchaîné :
   (rien sur l'écran titre, « Qui es-tu ? » ni pendant la lettre : seul le son des vidéos du décor) ;
   - gelee    : « Façade gelée », devant le chalet pendant les 11 premières pièces ;
   - espoir   : « Façade espoir », la même façade à partir de la 12e pièce : le chalet commence à dégeler ;
   - cours    : « Petit cours », pendant le projecteur des lutins ;
   - tictac   : l'horloge des énigmes, pendant le défi de la Kère ;
   - kryos    : « Kryos, le défi final », pendant le défi du 24 (à la place du tic-tac) ;
   - victoire : la fanfare (10 s, jouée une fois) quand la Kère est vaincue ;
   - funk     : « Jingle Bells Tamil Funk » : Noël sauvé (dégel du 24).
   Les boucles (fin, reprise) ont été choisies pour que les temps forts de la fin et de la reprise
   tombent ensemble pendant le fondu enchaîné (attaques comparées, scratchpad boucle.js).
   La musique est un fond sonore : elle reste discrète, et baisse encore quand
   le Père Noël parle. Le volume général se règle dans le panneau 🔊.
   Les navigateurs interdisent le son avant le premier clic : un morceau bloqué
   démarre au clic suivant. La musique se tait quand l'onglet est caché.
   ========================================================= */
(function (global) {
  'use strict';

  // volume : de 0 à 1, multiplié ensuite par le curseur du joueur (0,7 par défaut, soit ×0,49).
  // Niveaux mesurés à la sortie (médiane, MUSIQUE.etat().niveau) au réglage par défaut : environ -39 dB,
  // 4 dB de moins que la première version (jugée « trop forte »). À -44 dB, on ne l'entendait plus
  // du tout pendant la lettre (« pas de son joyeux »). Le tic-tac, lui, est enregistré très bas.
  // fin, reprise, fondu (en secondes) : « fondu » secondes avant « fin », le morceau repart
  // à « reprise » en fondu enchaîné (la fin des fichiers s'éteint en fondu : on ne l'entend jamais).
  // Les volumes compensent le niveau de chaque fichier (mesuré en LUFS) : façades, cours et Kryos ≈ -24 comme
  // l'ancienne version sad (on réfléchit longtemps sur le défi du 24 : Kryos n'est pas plus fort), fanfare ≈ -21.
  // Sortie mesurée au réglage par défaut (niveaux.js) : façades -33 à -36 dB, Kryos ≈ -35, fanfare ≈ -31, funk -29.
  const PISTES = {
    funk: { url: 'musique/melody.mp3', volume: 0.55, fin: 167.5, reprise: 0, fondu: 3 },
    gelee: { url: 'musique/facade_gelee.mp3', volume: 0.36, fin: 160.54, reprise: 0.04, fondu: 5 },
    espoir: { url: 'musique/facade_espoir.mp3', volume: 0.35, fin: 151.14, reprise: 2.14, fondu: 5 },
    cours: { url: 'musique/petit_cours.mp3', volume: 0.38, fin: 150.1, reprise: 1.7, fondu: 3 },
    kryos: { url: 'musique/kryos_final.mp3', volume: 0.3, fin: 156.7, reprise: 0.82, fondu: 2.5 },
    // 28 mesures à 120 BPM = 56 s : chargée en mémoire, la boucle retombe pile sur le temps.
    tictac: { url: 'musique/tic_tac.mp3', volume: 1.6, enMemoire: true, fin: 56 },
    // Extrait de « Victoire » (0,98 s → 10,98 s, 5 mesures à 120 BPM, fondu sur la dernière) :
    // en mémoire pour partir à l'instant même de la victoire.
    victoire: { url: 'musique/victoire.mp3', volume: 0.45, enMemoire: true, uneFois: true },
  };
  const ATTENUATION = 0.7; // quand le Père Noël (ou Kryos) parle, la musique descend d'environ 3 dB (elle reste audible)

  const AC = global.AudioContext || global.webkitAudioContext;
  let ctx = null, maitre = null, analyseur = null;
  let actif = true;     // la musique n'est pas coupée
  let reglage = 0.7;    // le curseur « Musique » du panneau 🔊 (0 à 1)
  let attenue = false;  // une voix parle par-dessus
  let voulue = null;    // { nom, volume } : le morceau qui devrait jouer
  let bloque = false;   // le navigateur a refusé de lancer un morceau : on réessaie au prochain clic
  const lecteurs = {};
  const arrets = {};    // minuteurs qui mettent en pause un morceau une fois son fondu terminé

  const nomVoulu = () => (actif && reglage > 0 && !document.hidden && voulue ? voulue.nom : null);
  // Le curseur suit l'oreille plutôt qu'une règle droite : la moitié du curseur ≈ -12 dB
  const gainMaitre = () => reglage * reglage * (attenue ? ATTENUATION : 1);

  // Fait glisser un volume vers une valeur, en partant de là où il en est. On suit soi-même
  // les fondus en cours : une rampe Web Audio part du dernier évènement programmé (pas de
  // « maintenant »), et la valeur lue pendant un fondu n'est pas fiable dans tous les navigateurs.
  const fondus = new WeakMap();
  function glisser(param, valeur, duree) {
    const t = ctx.currentTime;
    const f = fondus.get(param);
    const v = !f ? param.value : t >= f.t1 ? f.a : f.de + (f.a - f.de) * Math.max(0, t - f.t0) / (f.t1 - f.t0);
    param.cancelScheduledValues(t);
    if (duree > 0.02) {
      param.setValueAtTime(v, t);
      param.linearRampToValueAtTime(valeur, t + duree);
      fondus.set(param, { de: v, a: valeur, t0: t, t1: t + duree });
    } else {
      param.setValueAtTime(valeur, t);
      fondus.set(param, { de: valeur, a: valeur, t0: t, t1: t });
    }
  }

  function lire(el) {
    const p = el.play();
    if (p && p.catch) p.catch((e) => { if (e && e.name === 'NotAllowedError') bloque = true; });
  }

  // Un long morceau, lu en continu depuis le serveur. Deux lecteurs se relaient
  // pour que la boucle passe en fondu enchaîné.
  function lecteurFlux(p) {
    const sortie = ctx.createGain();
    sortie.gain.value = 0;
    sortie.connect(maitre);
    const voix = [0, 1].map(() => {
      const el = new Audio();
      el.preload = 'none';
      el.src = p.url;
      // Quand Kryos fige la musique, elle doit descendre dans les graves comme un disque qui ralentit
      el.preservesPitch = false;
      el.webkitPreservesPitch = false;
      const g = ctx.createGain();
      ctx.createMediaElementSource(el).connect(g).connect(sortie);
      return { el, g };
    });
    let i = 0, relais = false, minuteur = 0;
    const L = { sortie, joue: false, gel: 0 };

    function surveiller() {
      const v = voix[i];
      if (!L.joue || relais || v.el.paused) return;
      if (v.el.currentTime < p.fin - p.fondu && !v.el.ended) return;
      relais = true;
      const autre = voix[1 - i];
      i = 1 - i;
      autre.el.currentTime = p.reprise;
      autre.el.playbackRate = 1;
      glisser(autre.g.gain, 0, 0);
      lire(autre.el);
      glisser(autre.g.gain, 1, p.fondu);
      glisser(v.g.gain, 0, p.fondu);
      setTimeout(() => { if (voix[i] !== v) v.el.pause(); relais = false; }, p.fondu * 1000 + 100);
    }

    L.lancer = (depuis) => {
      const v = voix[i];
      if (depuis !== undefined) { try { v.el.currentTime = depuis; } catch (e) { /* pas encore chargé */ } }
      glisser(v.g.gain, 1, 0);
      lire(v.el);
      L.joue = true;
      if (!minuteur) minuteur = setInterval(surveiller, 250);
    };
    L.pause = () => {
      L.joue = false;
      voix.forEach(v => v.el.pause());
      clearInterval(minuteur);
      minuteur = 0;
    };
    L.vitesse = (r) => voix.forEach(v => { v.el.playbackRate = r; });
    L.info = () => ({ temps: +voix[i].el.currentTime.toFixed(1), vitesse: +voix[i].el.playbackRate.toFixed(2), enPause: voix[i].el.paused, relais });
    return L;
  }

  // Un morceau court, chargé en mémoire : sa boucle tombe juste à l'échantillon près.
  function lecteurEnMemoire(p) {
    const sortie = ctx.createGain();
    sortie.gain.value = 0;
    sortie.connect(maitre);
    const L = { sortie, joue: false, gel: 0 };
    let tampon = null, chargement = null, source = null, rythme = 1;

    // On ne garde que la boucle, en mono (deux fois moins de mémoire) ; un morceau joué une seule fois
    // (la fanfare, 10 s) garde sa stéréo.
    function boucle(b) {
      const n = p.fin ? Math.min(b.length, Math.round(p.fin * b.sampleRate)) : b.length;
      const canaux = p.uneFois ? b.numberOfChannels : 1;
      const m = ctx.createBuffer(canaux, n, b.sampleRate);
      for (let c = 0; c < b.numberOfChannels; c++) {
        const s = b.getChannelData(c);
        const d = m.getChannelData(canaux > 1 ? c : 0);
        const part = canaux > 1 ? 1 : b.numberOfChannels;
        for (let k = 0; k < n; k++) d[k] += s[k] / part;
      }
      return m;
    }
    const charger = () => chargement || (chargement = fetch(p.url)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
      .then(ab => ctx.decodeAudioData(ab))
      .then(b => { tampon = boucle(b); })
      .catch(() => { chargement = null; }));

    L.charger = charger;
    L.lancer = () => {
      L.joue = true;
      charger().then(() => {
        if (!L.joue || !tampon || (source && !p.uneFois)) return;
        // Un morceau joué une fois repart du début à chaque appel
        if (source) { try { source.stop(); } catch (e) { /* déjà finie */ } source.disconnect(); }
        const s = source = ctx.createBufferSource();
        s.buffer = tampon;
        s.loop = !p.uneFois;
        s.playbackRate.value = rythme;
        s.connect(sortie);
        s.onended = () => { if (source === s) { s.disconnect(); source = null; } };
        s.start();
      });
    };
    L.pause = () => {
      L.joue = false;
      if (!source) return;
      try { source.stop(); } catch (e) { /* déjà arrêtée */ }
      source.disconnect();
      source = null;
    };
    // Le tic-tac s'emballe dans les dernières secondes du compte à rebours
    L.vitesse = (r) => { rythme = r; if (source) source.playbackRate.setTargetAtTime(r, ctx.currentTime, 0.4); };
    L.info = () => ({ charge: !!tampon, enCours: !!source, rythme });
    return L;
  }

  function lecteur(nom) {
    if (!lecteurs[nom]) lecteurs[nom] = PISTES[nom].enMemoire ? lecteurEnMemoire(PISTES[nom]) : lecteurFlux(PISTES[nom]);
    return lecteurs[nom];
  }

  // Met le son en accord avec ce qui est voulu : un seul morceau, les autres s'éteignent en fondu.
  function appliquer(fondu, depuis) {
    if (!ctx) return; // pas encore de clic : on attend
    const nom = nomVoulu();
    for (const [k, L] of Object.entries(lecteurs)) {
      if (k === nom || !L.joue) continue;
      glisser(L.sortie.gain, 0, fondu);
      clearTimeout(arrets[k]);
      arrets[k] = setTimeout(() => { if (nomVoulu() !== k) L.pause(); }, fondu * 1000 + 80);
    }
    if (!nom) return;
    const L = lecteur(nom);
    clearTimeout(arrets[nom]);
    if (L.gel) { clearInterval(L.gel); L.gel = 0; L.vitesse(1); }
    if (!L.joue || depuis !== undefined) {
      glisser(L.sortie.gain, 0, 0);
      L.lancer(depuis);
    }
    glisser(L.sortie.gain, voulue.volume ?? PISTES[nom].volume, fondu);
  }

  // Kryos gèle la musique : elle ralentit comme un disque qu'on arrête, puis se tait.
  function figer(duree = 1.8) {
    const nom = nomVoulu();
    voulue = null;
    const L = nom && lecteurs[nom];
    if (!ctx || !L || !L.joue) { appliquer(0.3); return; }
    clearTimeout(arrets[nom]);
    glisser(L.sortie.gain, 0, duree);
    const debut = performance.now();
    L.gel = setInterval(() => {
      const x = Math.min(1, (performance.now() - debut) / (duree * 1000));
      L.vitesse(1 - 0.72 * x);
      if (x < 1) return;
      clearInterval(L.gel);
      L.gel = 0;
      L.pause();
      L.vitesse(1);
    }, 40);
  }

  // Chaque clic ou touche « débloque » le son : création du contexte audio au premier geste,
  // et relance d'un morceau que le navigateur avait refusé de démarrer.
  function geste() {
    if (!ctx) {
      if (!AC) return;
      try {
        ctx = new AC();
        maitre = ctx.createGain();
        maitre.gain.value = gainMaitre();
        maitre.connect(ctx.destination);
      } catch (e) { ctx = null; return; }
      appliquer(1.5);
      return;
    }
    if (ctx.state !== 'running') ctx.resume().catch(() => {}); // « interrupted » sur iPhone après un appel
    if (bloque) {
      bloque = false;
      const L = lecteurs[nomVoulu()];
      if (L && L.joue) L.lancer();
    }
  }
  ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click'].forEach(e => document.addEventListener(e, geste, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => appliquer(document.hidden ? 0.25 : 1.5));

  global.MUSIQUE = {
    // nom : une clé de PISTES ('gelee', 'espoir', 'cours', 'tictac', 'kryos', 'victoire', 'funk'), ou null pour le silence.
    // options : fondu (s), depuis (s : repart de là), volume (remplace celui de la piste).
    jouer(nom, options = {}) {
      voulue = nom && PISTES[nom] ? { nom, volume: options.volume } : null;
      appliquer(options.fondu ?? 2.5, options.depuis);
    },
    // Télécharge et décode à l'avance un morceau court (la fanfare doit partir à l'instant de la victoire).
    precharger(nom) {
      if (!ctx || !PISTES[nom] || !PISTES[nom].enMemoire || !actif || reglage <= 0) return;
      lecteur(nom).charger();
    },
    // Vrai si un morceau lancé maintenant s'entendrait (sinon, on garde les bruitages à la place).
    audible: () => !!ctx && actif && reglage > 0,
    figer,
    // Les 30 dernières secondes du compte à rebours : le tic-tac accélère (true), puis revient (false).
    presser(oui) { const L = lecteurs.tictac; if (L && L.vitesse) L.vitesse(oui ? 1.3 : 1); },
    activer(oui) {
      if (actif === !!oui) return;
      actif = !!oui;
      appliquer(actif ? 1.5 : 0.4);
    },
    // Le curseur du panneau 🔊 (0 à 1). À 0, la musique s'arrête vraiment (rien n'est téléchargé).
    reglerVolume(v) {
      const avant = reglage;
      reglage = Math.max(0, Math.min(1, +v || 0));
      if (ctx) glisser(maitre.gain, gainMaitre(), 0.12);
      if ((avant > 0) !== (reglage > 0)) appliquer(reglage > 0 ? 1 : 0.3);
    },
    // Baisse la musique sous une voix (true), puis la remonte (false).
    attenuer(oui) {
      if (attenue === !!oui) return;
      attenue = !!oui;
      if (ctx) glisser(maitre.gain, gainMaitre(), oui ? 0.5 : 1.6);
    },
    // Pour les tests et le débogage (dans la console : MUSIQUE.etat()). « niveau » : le volume
    // qui sort vraiment, en dB (-180 = silence).
    etat() {
      const e = { contexte: ctx ? ctx.state : 'aucun', voulue: voulue && voulue.nom, actif, reglage, attenue, bloque, niveau: null, lecteurs: {} };
      if (!ctx) return e;
      if (!analyseur) { analyseur = ctx.createAnalyser(); analyseur.fftSize = 4096; maitre.connect(analyseur); }
      const d = new Float32Array(analyseur.fftSize);
      analyseur.getFloatTimeDomainData(d);
      let s = 0;
      for (const x of d) s += x * x;
      e.niveau = Math.round(20 * Math.log10(Math.sqrt(s / d.length) + 1e-9));
      const volume = (param) => { const f = fondus.get(param), t = ctx.currentTime; return !f ? param.value : t >= f.t1 ? f.a : f.de + (f.a - f.de) * (t - f.t0) / (f.t1 - f.t0); };
      for (const [k, L] of Object.entries(lecteurs)) e.lecteurs[k] = Object.assign({ joue: L.joue, volume: +volume(L.sortie.gain).toFixed(3) }, L.info());
      return e;
    },
  };
})(window);
