/* =========================================================
   NOËL-OS — Le décor qui raconte la lettre
   Pendant que le Père Noël écrit (et lit) sa lettre, l'histoire se joue derrière elle,
   comme dans une lettre magique : le cachot à la bougie, le glacier qui se fend,
   Kryos et ses Kères, le chalet gelé, l'hiver sans fin, la boule de cristal qui montre
   le visage du joueur, le calendrier des 24 pièces… puis les yeux de Kryos dans le noir.
   Les scènes sont des vidéos AVEC LEUR SON (public/media, tirées de Media/asset) : pendant la
   lettre, il n'y a plus de musique, seulement le son des vidéos (demande de l'utilisateur,
   2026-11-16). Toute la lettre est en vidéos (25 clips) : une au début de chaque scène, et
   d'autres qui passent devant à des moments précis (data-evt dans la lettre). Les illustrations
   et les dessins d'origine ne servent plus qu'en secours, si une vidéo ne peut pas être lue.
   CINEMA.creer(conteneur, { prenom }) → { scene(nom), evenement(nom), detruire() }
   C'est la lettre qui mène (demande de l'utilisateur, 2026-11-16 : « ça doit être fluide, y a trop
   de pauses ») : la plume écrit sans jamais s'arrêter, et le décor suit. Une vidéo encore en cours
   est coupée en fondu par la suivante ; elle reste seulement au moins VUE_MIN à l'écran, pour que
   rien ne fasse que clignoter (le décor peut donc avoir au plus une seconde de retard sur le texte).
   Seuls transform et opacity sont animés, et jamais sur une vidéo en cours de lecture.
   ========================================================= */
(function (global) {
  'use strict';

  const echapper = (s) => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const svg = (contenu, classe = '') => `<svg class="cin-svg ${classe}" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${contenu}</svg>`;
  // Un calque : un dessin cadré exactement comme les autres. Ce qui bouge sur une grande surface
  // (halo, aurore, rayons, éclair) a son propre calque, que le navigateur anime sans rien redessiner.
  const calque = (contenu, classe = '') => `<div class="cin-calque ${classe}">${svg(contenu)}</div>`;
  const anglais = () => !!(global.I18N && I18N.langue === 'en');
  const alea = (graine) => { let s = graine; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
  const mouvementReduit = () => !!(global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* Les vidéos et les images de public/media. Une vidéo : WebM (plus léger), sinon MP4 (Safari) ;
     son affiche (la première image) s'affiche tout de suite. data-quand dit quand elle part : au
     début de la scène, ou à un moment de la lettre (« envol »…).
     Le son des fichiers est déjà ramené à un niveau commun (ambiances -22 LUFS, moments forts
     -19 LUFS) ; il suit le curseur « Musique » du panneau 🔊, avec la même courbe que la musique.
     Au réglage par défaut, il sort à peu près au niveau de l'ancienne musique de la lettre.
     Le dessin d'origine reste dans un <template> (rien n'est dessiné) : il ne sert que si la vidéo
     ne peut pas être lue. */
  const MEDIA = 'media/';
  let reglage = 0.7; // le curseur « Musique » (0 à 1), donné par app.js
  const gainVideo = () => Math.min(1, reglage * reglage * 0.72);
  // Les fondus du son en cours (une vidéo qui s'efface, ou qui laisse la place à celle d'un moment)
  const fondus = new WeakMap();
  function fondreSon(v, duree, cible, puis) {
    clearInterval(fondus.get(v));
    const depart = v.volume, t0 = performance.now();
    const id = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / duree);
      v.volume = Math.min(1, depart + (cible - depart) * k);
      if (k >= 1) { clearInterval(id); fondus.delete(v); if (puis) puis(); }
    }, 50);
    fondus.set(v, id);
  }
  function arreterEnFondu(v, duree) {
    if (v.paused) return;
    fondreSon(v, duree, 0, () => v.pause());
  }
  // Le volume des vidéos qui jouent (pas celles en train de s'éteindre), et le silence quand l'onglet est caché
  function appliquerVolume(v) {
    if (fondus.has(v)) return;
    v.volume = gainVideo();
    v.muted = !(reglage > 0) || document.hidden;
  }
  // cadre : une classe qui décale l'image quand l'action n'est pas au milieu (le décor, presque
  // carré sur ordinateur, ne montre que le centre d'une vidéo 16:9)
  // retour : une vidéo de moment qui, une fois finie, rend la place à la boucle de la scène.
  // reprise : à la fin, la vidéo repart à cet instant (une boucle sur la fin seulement).
  function video(nom, { quand = 'scene', boucle = false, vitesse = 1, cadre = '', retour = false, reprise = 0 } = {}) {
    return `<video class="cin-video${quand === 'scene' ? '' : ' cin-video-evt'}${cadre ? ' cadre-' + cadre : ''}" data-quand="${quand}" data-vitesse="${vitesse}"${boucle ? ' loop' : ''}${retour ? ' data-retour="1"' : ''}${reprise ? ` data-reprise="${reprise}"` : ''} muted playsinline disablepictureinpicture preload="auto" poster="${MEDIA}${nom}.webp" aria-hidden="true">`
      + `<source src="${MEDIA}${nom}.webm" type="video/webm"><source src="${MEDIA}${nom}.mp4" type="video/mp4"></video>`;
  }
  const image = (nom, classe = '') => `<img class="cin-image ${classe}" src="${MEDIA}${nom}.webp" alt="" decoding="async" draggable="false">`;
  const secours = (dessin) => `<template class="cin-secours">${dessin}</template>`;
  const KERE_IMG = `<img class="cin-kere-img" src="${MEDIA}kere.webp" alt="" draggable="false">`;

  // Le ciel de nuit, commun à presque toutes les scènes : dégradé, étoiles, aurore.
  // Le ciel de nuit (dégradé et étoiles), puis l'aurore dans son propre calque.
  function ciel(r, { aurore = true, haut = '#020814', bas = '#123a66' } = {}) {
    let s = `<defs><linearGradient id="cin-ciel-${haut.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haut}"/><stop offset="1" stop-color="${bas}"/></linearGradient></defs>`;
    s += `<rect width="1000" height="700" fill="url(#cin-ciel-${haut.slice(1)})"/>`;
    for (let i = 0; i < 70; i++) s += `<circle cx="${(r() * 1000).toFixed(0)}" cy="${(r() * 420).toFixed(0)}" r="${(0.6 + r() * 1.6).toFixed(1)}" fill="#fff" opacity="${(0.35 + r() * 0.6).toFixed(2)}"/>`;
    return calque(s) + (aurore ? calque(`<path d="M-50 210 C150 120 300 260 500 170 S820 90 1050 190 L1050 260 C820 160 650 300 500 240 S150 200 -50 280Z" fill="#3ddc97" opacity=".2"/><path d="M-50 150 C200 70 380 200 560 120 S860 60 1050 120 L1050 170 C850 110 700 230 540 170 S180 130 -50 210Z" fill="#7fd6ff" opacity=".13"/>`, 'cin-aurore') : '');
  }
  const sol = (couleur = '#dfeaf7', y = 600) => `<path d="M0 ${y} Q250 ${y - 30} 500 ${y - 8} T1000 ${y - 14} L1000 700 L0 700Z" fill="${couleur}"/>`;

  /* ---------- 1. Le cachot de glace : le Père Noël écrit à la lueur d'une bougie ----------
     (vidéo ; au moment « elle a traversé la tempête », la lettre s'envole par la lucarne) */
  function cachot() {
    return secours(dessinCachot()) + video('cachot') + video('envol', { quand: 'envol' });
  }
  function dessinCachot() {
    const r = alea(11);
    let s = `<defs>
      <linearGradient id="cin-mur-cachot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2645"/><stop offset="1" stop-color="#06111f"/></linearGradient>
      <radialGradient id="cin-bougie" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffbe5a" stop-opacity=".62"/><stop offset=".45" stop-color="#ff9a3a" stop-opacity=".2"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient>
      <linearGradient id="cin-barreau" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6f8ff"/><stop offset=".45" stop-color="#9ad3f5"/><stop offset="1" stop-color="#3f7fb3"/></linearGradient>
      <linearGradient id="cin-manteau" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d42a3c"/><stop offset="1" stop-color="#7c0f1d"/></linearGradient>
      <clipPath id="cin-lucarne"><rect x="600" y="96" width="170" height="120" rx="10"/></clipPath>
    </defs>`;
    s += `<rect width="1000" height="700" fill="url(#cin-mur-cachot)"/>`;
    // Les blocs de glace du mur
    let blocs = '';
    for (let y = 40, rang = 0; y < 600; y += 86, rang++) {
      blocs += `<line x1="0" y1="${y}" x2="1000" y2="${y}"/>`;
      for (let x = (rang % 2) * 70; x < 1000; x += 140) blocs += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 86}"/>`;
    }
    s += `<g stroke="#7cc4f4" stroke-opacity=".13" stroke-width="3">${blocs}</g>`;
    // La lucarne : la tempête passe dehors
    s += `<rect x="590" y="86" width="190" height="140" rx="14" fill="#1c3a5e"/><g clip-path="url(#cin-lucarne)"><rect x="600" y="96" width="170" height="120" fill="#020812"/>`;
    for (let i = 0; i < 24; i++) {
      const x = 590 + r() * 220, y = 92 + r() * 124, l = 18 + r() * 22;
      s += `<line class="cin-rafale" x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x - l).toFixed(0)}" y2="${(y + l * 0.3).toFixed(0)}" stroke="#dff4ff" stroke-width="${(1 + r() * 1.6).toFixed(1)}" stroke-linecap="round" opacity=".75" style="animation-delay:-${(r() * 0.9).toFixed(2)}s"/>`;
    }
    s += `</g>`;
    for (let k = 0; k < 4; k++) s += `<rect x="${630 + k * 36}" y="96" width="8" height="120" rx="3" fill="url(#cin-barreau)"/>`;
    // La lettre magique s'envole par la lucarne
    s += `<g class="cin-lettre-vole"><rect x="-22" y="-15" width="44" height="30" rx="3" fill="#fbf1d6"/><path d="M-22 -15 L0 3 L22 -15" fill="none" stroke="#c49a52" stroke-width="2"/><circle r="5" cy="2" fill="#b3202f"/><circle r="34" fill="#ffe08a" opacity=".22"/></g>`;
    // Le sol et la lueur de la bougie
    s += `<path d="M0 560 L1000 548 L1000 700 L0 700Z" fill="#0a1a30"/><path d="M0 560 L1000 548" stroke="#9ad3f5" stroke-opacity=".25" stroke-width="3"/>`;
    const fond = s;
    s = `<defs><radialGradient id="cin-bougie2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffbe5a" stop-opacity=".62"/><stop offset=".45" stop-color="#ff9a3a" stop-opacity=".2"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient></defs>
      <circle cx="560" cy="420" r="300" fill="url(#cin-bougie2)"/>`;
    const halo = s;
    s = `<defs><linearGradient id="cin-barreau2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6f8ff"/><stop offset=".45" stop-color="#9ad3f5"/><stop offset="1" stop-color="#3f7fb3"/></linearGradient>
      <linearGradient id="cin-manteau2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d42a3c"/><stop offset="1" stop-color="#7c0f1d"/></linearGradient></defs>`;
    // Le tabouret, la table, le parchemin, l'encrier, la bougie
    s += `<rect x="300" y="480" width="110" height="16" rx="5" fill="#3e2410"/><rect x="314" y="494" width="12" height="70" fill="#2e1a0b"/><rect x="384" y="494" width="12" height="70" fill="#2e1a0b"/>`;
    s += `<rect x="440" y="452" width="270" height="18" rx="4" fill="#6b3f1f"/><rect x="456" y="468" width="14" height="96" fill="#4a2a12"/><rect x="680" y="468" width="14" height="96" fill="#4a2a12"/>`;
    s += `<path d="M500 450 L600 446 L604 452 L498 456Z" fill="#f3e3bf"/><g opacity=".7" stroke="#b08a4a" stroke-width="1.4"><line x1="512" y1="450" x2="586" y2="447.5"/></g>`;
    s += `<path d="M622 436 h22 l-3 16 h-16z" fill="#1d1d2b"/>`;
    s += `<rect x="664" y="402" width="18" height="52" rx="3" fill="#f4ecd8"/><path d="M664 410 q9 6 18 0" fill="none" stroke="#e2d6b8" stroke-width="3"/><line x1="673" y1="402" x2="673" y2="394" stroke="#222" stroke-width="2"/>`;
    s += `<path class="cin-flamme" d="M673 366 C684 380 682 392 673 396 C664 392 662 380 673 366Z" fill="#ffd36b"/><path class="cin-flamme" d="M673 378 C678 385 677 391 673 393 C669 391 668 385 673 378Z" fill="#fff6d0"/>`;
    // Le Père Noël, voûté sur sa lettre
    s += `<g class="cin-pere-noel">
      <path d="M298 488 C286 420 300 352 352 326 C400 304 452 318 470 362 C486 402 484 452 470 490 Z" fill="url(#cin-manteau2)"/>
      <path d="M300 470 C340 478 420 480 474 470 L472 490 L298 490Z" fill="#f4f1ea"/>
      <rect x="300" y="430" width="176" height="20" fill="#1b1b1f"/><rect x="380" y="426" width="30" height="28" rx="4" fill="none" stroke="#f5c542" stroke-width="5"/>
      <circle cx="450" cy="292" r="38" fill="#f1c39c"/>
      <path d="M420 292 C412 336 432 372 462 386 C496 372 508 336 500 300 C488 312 470 318 452 316 C438 314 428 306 420 292Z" fill="#f8f8f8"/>
      <path d="M440 312 q14 -8 30 0" fill="none" stroke="#e8e8e8" stroke-width="7" stroke-linecap="round"/>
      <circle cx="468" cy="290" r="4" fill="#3b2a1a"/>
      <path d="M408 284 C410 238 450 214 494 232 C522 244 540 270 548 300 C538 292 524 284 512 280 C506 266 492 258 480 258 C460 256 440 268 430 286Z" fill="#c8202f"/>
      <rect x="402" y="270" width="104" height="22" rx="11" fill="#f4f1ea" transform="rotate(-8 454 281)"/>
      <circle cx="552" cy="306" r="13" fill="#f4f1ea"/>
      <g class="cin-bras"><path d="M440 350 C478 372 516 404 548 440 L532 456 C500 428 466 404 432 384Z" fill="#b51d2c"/><rect x="530" y="430" width="26" height="22" rx="8" fill="#f4f1ea" transform="rotate(42 543 441)"/><circle cx="556" cy="452" r="11" fill="#f1c39c"/>
        <path d="M556 452 C566 420 584 396 612 380 C600 404 584 428 560 452Z" fill="#fbf4e2" stroke="#c9b48a" stroke-width="1.5"/></g>
    </g>`;
    // Les barreaux de glace et les stalactites au premier plan
    [60, 170, 830, 940].forEach((x) => { s += `<rect x="${x - 13}" y="0" width="26" height="700" rx="10" fill="url(#cin-barreau2)" opacity=".92"/><rect x="${x - 6}" y="0" width="6" height="700" fill="#fff" opacity=".35"/>`; });
    s += `<rect x="0" y="0" width="1000" height="34" fill="#cfeeff" opacity=".85"/>`;
    for (let x = 6; x < 1000; x += 22) s += `<path d="M${x} 32 l9 0 l-4.5 ${12 + (x * 7) % 26}z" fill="#e6f8ff"/>`;
    return calque(fond) + calque(halo, 'cin-halo-bougie') + calque(s);
  }

  /* ---------- 2. Le glacier : Kryos y dort depuis mille ans… jusqu'à cette nuit ---------- */
  function glacier() {
    const r = alea(23);
    const fond = ciel(r, { haut: '#01050d', bas: '#0d2b52' });
    let s = `<defs>
      <linearGradient id="cin-glace" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2fbff"/><stop offset=".45" stop-color="#9fd4f4"/><stop offset="1" stop-color="#3f79ad"/></linearGradient>
      <radialGradient id="cin-yeux-rouges" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff4d6a" stop-opacity=".9"/><stop offset="1" stop-color="#ff4d6a" stop-opacity="0"/></radialGradient>
    </defs>`;
    s += `<path d="M0 520 L120 380 L210 450 L320 330 L380 400 L0 600Z" fill="#0b2140"/><path d="M1000 520 L880 360 L800 440 L700 350 L640 420 L1000 600Z" fill="#0b2140"/>`;
    s += `<g class="cin-glacier">
      <path d="M140 630 L300 330 L410 250 L500 150 L610 230 L740 320 L880 630Z" fill="url(#cin-glace)"/>
      <path d="M300 330 L410 250 L470 420 L360 520Z" fill="#fff" opacity=".22"/><path d="M500 150 L610 230 L560 380 L470 420Z" fill="#fff" opacity=".14"/>
      <path d="M610 230 L740 320 L700 520 L560 380Z" fill="#0b3a66" opacity=".2"/><path d="M360 520 L470 420 L560 380 L700 520 L620 630 L300 630Z" fill="#0b3a66" opacity=".12"/>
      <g class="cin-kryos-dort">
        <path d="M430 300 L438 262 L452 284 L466 246 L480 280 L494 240 L508 280 L522 246 L536 284 L550 262 L558 300Z" fill="#132849"/>
        <path d="M440 300 C440 270 548 270 548 300 C562 330 560 380 548 400 L610 430 C640 450 650 520 650 560 L338 560 C338 520 348 450 378 430 L440 400 C428 380 426 330 440 300Z" fill="#132849"/>
        <path d="M466 336 l20 6 M522 336 l-20 6" stroke="#5f86b8" stroke-width="4" stroke-linecap="round" class="cin-yeux-fermes"/>
        <g class="cin-yeux-ouverts"><circle cx="476" cy="340" r="26" fill="url(#cin-yeux-rouges)"/><circle cx="512" cy="340" r="26" fill="url(#cin-yeux-rouges)"/><ellipse cx="476" cy="340" rx="9" ry="5" fill="#ff2a48"/><ellipse cx="512" cy="340" rx="9" ry="5" fill="#ff2a48"/><circle cx="478" cy="339" r="2" fill="#fff"/><circle cx="514" cy="339" r="2" fill="#fff"/></g>
      </g>
      <path d="M140 630 L300 330 L410 250 L500 150 L610 230 L740 320 L880 630Z" fill="#dff3ff" opacity=".38"/>
    </g>`;
    s += sol('#cfe3f5', 640);
    const montagne = s;
    s = '';
    // Les fissures, qui apparaissent l'une après l'autre
    const fissures = ['M500 150 L486 210 L512 250 L490 300', 'M490 300 L452 330 L470 380 L430 430', 'M490 300 L540 340 L524 400 L572 460', 'M430 430 L380 470 L396 530 L340 600', 'M572 460 L630 500 L612 560 L680 620', 'M470 380 L520 420 L500 480 L530 560'];
    s += `<g class="cin-fissures">${fissures.map((d, k) => `<g class="cin-fissure" style="--k:${k}"><path d="${d}" fill="none" stroke="#7cc8ff" stroke-width="9" opacity=".4"/><path d="${d}" fill="none" stroke="#fff" stroke-width="3"/></g>`).join('')}</g>`;
    // Les éclats de glace projetés
    let eclats = '';
    for (let k = 0; k < 14; k++) {
      const a = (k / 14) * Math.PI * 2 + r() * 0.4, d = 260 + r() * 260;
      eclats += `<path class="cin-eclat" d="M0 -18 L12 0 L0 22 L-10 2Z" fill="${k % 3 ? '#dff4ff' : '#9fd4f4'}" style="--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d * 0.7).toFixed(0)}px;--r:${(r() * 720 - 360).toFixed(0)}deg;transform:translate(500px,380px)"/>`;
    }
    s += `<g class="cin-eclats">${eclats}</g>`;
    // Les vidéos : il y a mille ans, les lutins enferment Kryos (le flashback) ; « Cette nuit », le
    // glacier où il dort, derrière un voile de glace qui tremble et se fend ; « il est revenu » : le
    // glacier explose et Kryos se dresse. (Sans vidéo, le dessin du glacier reprend sa place sous
    // les mêmes fissures.)
    return secours(fond + calque(montagne, 'cin-glacier-calque'))
      + video('flashback')
      + `<div class="cin-tremble">${video('glacier', { quand: 'nuit', boucle: true })}<div class="cin-voile-glace"></div></div>`
      + calque(s) + video('glacier-eveil', { quand: 'revenu' }) + '<div class="cin-flash"></div>';
  }

  /* ---------- 3. Le souffle de Kryos réveille les Kères ----------
     (Kryos en grand ; l'essaim de Kères jaillit de sa bouche, vers 58 % de la hauteur de l'image) */
  function keres() {
    const r = alea(31);
    let vol = '';
    for (let k = 0; k < 11; k++) {
      const a = -Math.PI * (0.05 + 0.9 * (k / 10)) + (r() - 0.5) * 0.2;
      const d = 40 + r() * 22;
      vol += `<div class="cin-kere-essaim" style="--dx:${(Math.cos(a) * d).toFixed(1)}cqw;--dy:${(Math.sin(a) * d * 0.9 + 6).toFixed(1)}cqh;--d:${(k * 0.55).toFixed(2)}s;--t:${(48 + r() * 44).toFixed(0)}px">${KERE_IMG}</div>`;
    }
    const noelos = `<svg class="cin-noelos" viewBox="0 0 200 150" aria-hidden="true"><rect x="10" y="6" width="180" height="112" rx="10" fill="#1d2735" stroke="#56657a" stroke-width="4"/><rect x="22" y="18" width="156" height="88" rx="4" fill="#062a18"/>
      <text x="100" y="58" text-anchor="middle" font-family="Consolas, monospace" font-size="20" font-weight="700" fill="#3ddc84">NOËL-OS</text><text class="cin-noelos-etat" x="100" y="86" text-anchor="middle" font-family="Consolas, monospace" font-size="14" fill="#3ddc84">● OK</text>
      <g class="cin-noelos-gel"><rect x="22" y="18" width="156" height="88" rx="4" fill="#bfe6ff" opacity=".78"/><path d="M22 18 l40 30 l-14 22 l34 36 M178 18 l-30 40 l18 18 l-36 30" stroke="#fff" stroke-width="2.5" fill="none"/><text x="100" y="70" text-anchor="middle" font-family="Consolas, monospace" font-size="18" font-weight="700" fill="#b3202f">${anglais() ? 'FROZEN' : 'GELÉ'}</text></g>
      <rect x="80" y="118" width="40" height="14" fill="#56657a"/><rect x="56" y="130" width="88" height="10" rx="5" fill="#56657a"/></svg>`;
    let lutins = '';
    for (let k = 0; k < 4; k++) lutins += `<g transform="translate(${36 + k * 34} ${70 + (k % 2) * 6})"><circle r="10" fill="#f1c39c"/><path d="M-11 -4 L0 -30 L11 -4Z" fill="#1f8a4d"/><circle cy="-30" r="3.5" fill="#fff"/><rect x="-9" y="9" width="18" height="22" rx="6" fill="#1f8a4d"/><circle cx="-3.5" cy="-1" r="1.6" fill="#222"/><circle cx="3.5" cy="-1" r="1.6" fill="#222"/></g>`;
    const cage = `<svg class="cin-cage" viewBox="0 0 200 150" aria-hidden="true">${lutins}<g class="cin-barreaux"><rect x="16" y="20" width="168" height="10" rx="5" fill="#bfe6ff"/>${[24, 56, 88, 120, 152, 176].map(x => `<rect x="${x}" y="26" width="8" height="112" rx="4" fill="#a9dcff"/>`).join('')}<rect x="16" y="134" width="168" height="10" rx="5" fill="#bfe6ff"/></g></svg>`;
    // Les vidéos : le souffle de Kryos fait jaillir les Kères ; elles gèlent NOËL-OS, capturent les
    // lutins ; Kryos jette le Père Noël au cachot. (Sans vidéo : l'illustration et l'essaim dessiné.)
    return secours(image('kryos-souffle', 'cin-fond-image') + `<div class="cin-souffle"></div>${vol}${noelos}${cage}`)
      + video('keres-souffle') + video('noelos-gel', { quand: 'noelos' })
      + video('lutins-captures', { quand: 'lutins' }) + video('pere-noel-capture', { quand: 'capture' });
  }

  /* ---------- 4. Le chalet tombe : une Kère dans chaque pièce, l'étoile s'éteint ---------- */
  function chalet() {
    const etoile = Array.from({ length: 10 }, (_, k) => { const a = (-90 + k * 36) * Math.PI / 180, rr = k % 2 ? 7.2 : 17; return `${(300 + rr * Math.cos(a)).toFixed(1)},${(25 + rr * Math.sin(a)).toFixed(1)}`; }).join(' ');
    const doree = `<svg class="cin-etoile-or" viewBox="0 0 600 420" aria-hidden="true"><defs><radialGradient id="cin-halo-or" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe27a" stop-opacity=".85"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient></defs><circle cx="300" cy="25" r="52" fill="url(#cin-halo-or)"/><polygon points="${etoile}" fill="#ffd54a" stroke="#fff3c4" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
    let plongeons = '';
    [[18, 52], [70, 52], [18, 72], [70, 72], [50, 34]].forEach(([x, y], k) => {
      plongeons += `<div class="cin-kere-plonge" style="--x:${x}cqw;--y:${y}cqh;--d:${(0.6 + k * 0.6).toFixed(1)}s">${KERE_IMG}</div>`;
    });
    // Vidéos : les Kères plongent dans les fenêtres (joué une fois), Kryos sur son trône dans le Grand
    // Salon, puis l'étoile du sapin s'éteint
    return secours(`<div class="cin-boite cin-boite-chalet">${PIECES.chaletGele()}${doree}${plongeons}</div>`)
      + video('chalet-keres', { cadre: 'chalet-keres' }) + video('kryos-trone', { quand: 'salon', cadre: 'kryos-trone' })
      + video('chalet-etoile', { quand: 'etoile', cadre: 'chalet-etoile' });
  }

  /* ---------- 5. Un hiver qui ne finira jamais ----------
     (l'essentiel tient entre x = 250 et 750 : sur un écran moyen, les bords du dessin sont rognés) */
  function hiver() {
    const r = alea(53);
    let s = `<defs><linearGradient id="cin-mur-hiver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26324a"/><stop offset="1" stop-color="#121a2a"/></linearGradient>
      <linearGradient id="cin-vitre-hiver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4a63"/><stop offset="1" stop-color="#8797ad"/></linearGradient>
      <clipPath id="cin-vitre"><rect x="652" y="104" width="136" height="176"/></clipPath></defs>`;
    s += `<rect width="1000" height="700" fill="url(#cin-mur-hiver)"/>`;
    for (let x = 0; x < 1000; x += 64) s += `<rect x="${x}" y="0" width="2" height="560" fill="#0d1422" opacity=".5"/>`;
    // La fenêtre : la neige tombe, encore et encore
    s += `<rect x="640" y="92" width="160" height="200" rx="8" fill="#2a3448"/><rect x="652" y="104" width="136" height="176" fill="url(#cin-vitre-hiver)"/><g clip-path="url(#cin-vitre)"><g class="cin-neige-fenetre">`;
    for (let i = 0; i < 34; i++) s += `<circle cx="${(652 + r() * 136).toFixed(0)}" cy="${(96 + r() * 190).toFixed(0)}" r="${(1.2 + r() * 2.4).toFixed(1)}" fill="#fff" opacity=".85"/>`;
    s += `</g></g><rect x="716" y="104" width="8" height="176" fill="#2a3448"/><rect x="652" y="188" width="136" height="8" fill="#2a3448"/><path d="M652 280 Q690 250 722 266 T788 258 L788 280Z" fill="#e8eef6"/>`;
    // Le calendrier : le 24 sous la glace
    s += `<g transform="translate(236 110)"><rect width="120" height="140" rx="8" fill="#e9e4d8"/><rect width="120" height="34" rx="8" fill="#7a1622"/><rect y="24" width="120" height="10" fill="#7a1622"/>
      <text x="60" y="23" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#fff">${anglais() ? 'DECEMBER' : 'DÉCEMBRE'}</text>
      <text x="60" y="108" text-anchor="middle" font-family="Georgia, serif" font-size="66" font-weight="700" fill="#4a4f5a">24</text>
      <rect class="cin-glace-24" x="0" y="34" width="120" height="106" fill="#bfe6ff" opacity=".7"/><path class="cin-glace-24" d="M8 50 l32 32 l-8 24 l40 26 M112 42 l-24 40 l16 16" stroke="#fff" stroke-width="2.5" fill="none"/></g>`;
    // La cheminée éteinte et la chaussette vide
    s += `<rect x="330" y="310" width="300" height="250" fill="#4a4f5a"/><rect x="312" y="292" width="336" height="28" rx="4" fill="#5d6370"/><path d="M380 560 V430 A100 100 0 0 1 580 430 V560Z" fill="#0b0f18"/>`;
    s += `<path d="M380 560 Q405 524 440 542 Q468 518 505 542 Q545 522 580 560Z" fill="#2c3038"/>`;
    for (let x = 320; x < 648; x += 20) s += `<path d="M${x} 320 l8 0 l-4 ${8 + (x * 3) % 16}z" fill="#d8eefc"/>`;
    s += `<g class="cin-chaussette"><path d="M560 320 L560 336" stroke="#888" stroke-width="2"/><path d="M544 336 h36 v60 q0 18 -18 26 l-34 12 q-16 4 -18 -10 q-2 -12 12 -18 l22 -10z" fill="#7a2b34"/><rect x="540" y="332" width="44" height="14" rx="4" fill="#d9d4ca"/><path d="M544 358 h36" stroke="#bfe6ff" stroke-width="3" opacity=".7"/></g>`;
    s += `<path d="M0 560 L1000 560 L1000 700 L0 700Z" fill="#1b2232"/><path d="M0 560 L1000 560" stroke="#3a455c" stroke-width="3"/>`;
    // Le givre qui envahit les coins
    s += `<g class="cin-givre-coins" fill="#dff3ff"><path d="M0 0 L420 0 Q300 50 250 140 Q190 190 0 300Z" opacity=".2"/><path d="M1000 700 L580 700 Q700 650 760 570 Q830 520 1000 400Z" opacity=".2"/></g>`;
    return secours(calque(s)) + video('hiver', { boucle: true });
  }

  /* ---------- 6. La prophétie : la boule de cristal montre le Sauveur de Noël ---------- */
  function prophetie(prenom) {
    const r = alea(67);
    const fond = ciel(r, { aurore: false, haut: '#0a0418', bas: '#2a0f45' });
    const rayons = calque(Array.from({ length: 16 }, (_, k) => { const a = k * Math.PI / 8; return `<path d="M500 330 L${(500 + 700 * Math.cos(a - 0.05)).toFixed(0)} ${(330 + 700 * Math.sin(a - 0.05)).toFixed(0)} L${(500 + 700 * Math.cos(a + 0.05)).toFixed(0)} ${(330 + 700 * Math.sin(a + 0.05)).toFixed(0)}Z" fill="#ffe6a0" opacity=".13"/>`; }).join(''), 'cin-rayons-or');
    const aura = calque(`<defs><radialGradient id="cin-aura2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe6a0" stop-opacity=".7"/><stop offset="1" stop-color="#ffe6a0" stop-opacity="0"/></radialGradient></defs><circle cx="500" cy="330" r="300" fill="url(#cin-aura2)"/>`, 'cin-aura');
    let s = `<defs>
      <radialGradient id="cin-boule" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#e9d8ff" stop-opacity=".95"/><stop offset=".4" stop-color="#8a5cd6" stop-opacity=".8"/><stop offset="1" stop-color="#2a0f55" stop-opacity=".95"/></radialGradient>
      <radialGradient id="cin-aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe6a0" stop-opacity=".7"/><stop offset="1" stop-color="#ffe6a0" stop-opacity="0"/></radialGradient>
      <linearGradient id="cin-socle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a6a1e"/><stop offset=".5" stop-color="#f5d27a"/><stop offset="1" stop-color="#7a5a14"/></linearGradient>
      <clipPath id="cin-dans-boule"><circle cx="500" cy="330" r="160"/></clipPath>
    </defs>`;
    s += `<circle cx="500" cy="330" r="160" fill="url(#cin-boule)"/>`;
    s += `<g clip-path="url(#cin-dans-boule)"><g class="cin-brume-boule"><path d="M340 330 C400 260 460 400 520 320 S620 260 660 340 L660 420 C600 360 560 460 500 400 S380 380 340 420Z" fill="#c9a8ff" opacity=".35"/><path d="M340 280 C420 230 470 330 540 270 S640 230 660 280 L660 320 C600 280 560 360 500 320 S400 300 340 330Z" fill="#fff" opacity=".18"/></g>
      <g class="cin-heros"><circle cx="500" cy="300" r="34" fill="#ffe6a0"/><path d="M430 420 C430 360 466 344 500 344 C534 344 570 360 570 420Z" fill="#ffe6a0"/><path d="M462 290 C470 250 530 250 538 290 C526 278 474 278 462 290Z" fill="#fff6d0" opacity=".7"/></g></g>`;
    s += `<ellipse cx="452" cy="262" rx="40" ry="22" fill="#fff" opacity=".35" transform="rotate(-30 452 262)"/>`;
    s += `<path d="M420 488 L580 488 L610 560 L390 560Z" fill="url(#cin-socle)"/><rect x="370" y="556" width="260" height="26" rx="8" fill="url(#cin-socle)"/><ellipse cx="500" cy="488" rx="92" ry="14" fill="#5a4210"/>`;
    for (let i = 0; i < 18; i++) { const a = r() * Math.PI * 2, d = 200 + r() * 120; s += `<text class="cin-scintille" x="${(500 + Math.cos(a) * d).toFixed(0)}" y="${(330 + Math.sin(a) * d * 0.8).toFixed(0)}" font-size="${(12 + r() * 16).toFixed(0)}" fill="#ffe6a0" text-anchor="middle" style="animation-delay:${(r() * 2).toFixed(1)}s">✦</text>`; }
    s += `<g class="cin-etoile-espoir"><circle cx="500" cy="110" r="70" fill="url(#cin-aura)"/><path d="M500 64 L512 98 L548 98 L519 119 L530 154 L500 133 L470 154 L481 119 L452 98 L488 98Z" fill="#ffd54a" stroke="#fff3c4" stroke-width="2"/></g>`;
    // Vidéos : le vieux livre de la prophétie ; à « son visage », la boule de cristal montre la silhouette
    // dorée, et le prénom s'affiche par-dessus comme une plaque sous la boule ; « Tu es notre seul
    // espoir » : les lutins prisonniers lèvent les yeux vers la lumière.
    return secours(fond + rayons + aura + calque(s)) + video('prophetie-livre', { cadre: 'prophetie-livre' })
      + video('boule-revelation', { quand: 'visage' }) + video('seul-espoir', { quand: 'espoir' })
      + `<p class="cin-prenom" aria-hidden="true">${echapper(prenom) || (anglais() ? 'You' : 'Toi')}</p>`;
  }

  /* ---------- 7. La mission : le chalet, comme un grand calendrier de l'Avent ----------
     (24 portes numérotées, entre x = 250 et 750 ; l'étoile au sommet du toit) */
  function mission() {
    const r = alea(79);
    const fond = ciel(r, { haut: '#030a1a', bas: '#173d6b' });
    let s = `<defs><pattern id="cin-rondins" width="40" height="22" patternUnits="userSpaceOnUse"><rect width="40" height="22" fill="#6b3f1f"/><rect y="18" width="40" height="4" fill="#4a2a12"/></pattern>
      <radialGradient id="cin-lueur-porte" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>`;
    // Le sapin, à droite (on ne le voit en entier que sur les grands écrans)
    s += `<g transform="translate(820 0)"><rect x="-12" y="520" width="24" height="60" fill="#5a3418"/>`;
    [[300, 400, 60], [360, 470, 84], [420, 560, 108]].forEach(([hh, b, d]) => { s += `<polygon points="0,${hh} ${d},${b} ${-d},${b}" fill="#1c7a44"/>`; });
    [[-30, 450], [24, 436], [-50, 530], [8, 516], [52, 540]].forEach(([x, y], k) => { s += `<circle class="cin-boule${k === 0 ? ' cin-boule-1' : ''}" cx="${x}" cy="${y}" r="10" fill="${['#d62839', '#f5c542', '#2e86de', '#e056fd', '#20bf6b'][k]}"/>`; });
    s += `</g>`;
    // Le chalet et ses 24 portes
    s += `<polygon points="500,96 762,250 238,250" fill="#5a1f1a" stroke="#3a120e" stroke-width="6" stroke-linejoin="round"/><path d="M228 254 L500 90 L772 254 L752 258 L500 116 L248 258Z" fill="#fff"/>`;
    s += `<rect x="258" y="250" width="484" height="330" fill="url(#cin-rondins)"/><rect x="252" y="244" width="496" height="10" fill="#3a2010"/>`;
    const ordre = [3, 22, 23, 8, 7, 12, 20, 17, 18, 1, 4, 16, 2, 10, 11, 24, 21, 13, 5, 6, 9, 14, 15, 19];
    ordre.forEach((n, k) => {
      const x = 272 + (k % 6) * 77, y = 266 + Math.floor(k / 6) * 76;
      s += `<g class="cin-porte${n === 1 ? ' cin-porte-1' : ''}"><circle class="cin-lueur" cx="${x + 30}" cy="${y + 30}" r="50" fill="url(#cin-lueur-porte)"/><rect x="${x}" y="${y}" width="60" height="62" rx="6" fill="#3a2010"/><rect x="${x + 4}" y="${y + 4}" width="52" height="54" rx="4" fill="${['#9b1b30', '#1f6a3d', '#1d4f86', '#8a5a1e'][k % 4]}"/><text x="${x + 30}" y="${y + 41}" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-weight="700" fill="#ffe7a3">${n}</text></g>`;
    });
    // La porte 1 est la 10e de la liste : son centre est en (533, 373)
    s += `<g class="cin-kere-fuit"><circle cx="0" cy="0" r="16" fill="#dff3ff" stroke="#3a86c0" stroke-width="3"/><circle cx="-5" cy="-2" r="2.6" fill="#0e3556"/><circle cx="5" cy="-2" r="2.6" fill="#0e3556"/><path d="M-6 7 q6 4 12 0" stroke="#0e3556" stroke-width="2" fill="none"/></g>`;
    s += `<g class="cin-guirlande">`;
    for (let i = 0; i <= 15; i++) s += `<circle cx="${(266 + i * 31).toFixed(0)}" cy="${(262 + Math.sin(i * 0.9) * 4).toFixed(0)}" r="6" fill="${['#ff5a5f', '#ffd23f', '#3ddc84', '#4aa3ff'][i % 4]}" style="animation-delay:${(i * 0.12).toFixed(2)}s"/>`;
    s += `</g>`;
    // L'étoile au sommet du toit : éteinte, puis rallumée
    const etoile = 'M500 44 L509 64 L531 64 L513 77 L520 98 L500 85 L480 98 L487 77 L469 64 L491 64Z';
    s += `<path class="cin-etoile-eteinte" d="${etoile}" fill="#4b5f7e" stroke="#b8d4ec" stroke-width="2"/>`;
    s += `<g class="cin-etoile-sapin"><circle cx="500" cy="72" r="54" fill="url(#cin-lueur-porte)"/><path d="${etoile}" fill="#ffd54a" stroke="#fff3c4" stroke-width="2"/></g>`;
    s += `<g class="cin-fragment"><path d="M-22 -22 h14 a8 8 0 1 1 16 0 h14 v14 a8 8 0 1 0 0 16 v14 h-44z" fill="#f5c542" stroke="#8a5a10" stroke-width="3"/><text y="8" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-weight="700" fill="#5a3a08">?</text></g>`;
    s += sol('#e4eef8', 600);
    // Vidéos : la lettre ouvre un portail vers le chalet ; « Chaque jour de décembre » : la façade gelée
    // en boucle ; la Kère chassée et le fragment passent devant, puis on revient à la façade ;
    // à « rallumera l'étoile », tout s'illumine
    return secours(fond + calque(s)) + video('portail') + video('calendrier', { quand: 'decembre', boucle: true })
      + video('kere-chassee', { quand: 'kere', retour: true }) + video('fragment', { quand: 'fragment', retour: true })
      + video('calendrier-etoile', { quand: 'etoile' });
  }

  /* ---------- 8. Le secret des lutins : un crayon, du papier, et le projecteur du petit cours ---------- */
  function cours() {
    let s = `<defs><linearGradient id="cin-atelier" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2210"/><stop offset="1" stop-color="#1d1008"/></linearGradient>
      <radialGradient id="cin-ampoule" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2a8" stop-opacity=".9"/><stop offset="1" stop-color="#fff2a8" stop-opacity="0"/></radialGradient></defs>`;
    s += `<rect width="1000" height="700" fill="url(#cin-atelier)"/>`;
    for (let x = 0; x < 1000; x += 50) s += `<rect x="${x}" y="0" width="3" height="520" fill="#1d1008" opacity=".6"/>`;
    // L'écran du petit cours
    s += `<rect x="452" y="110" width="290" height="200" rx="6" fill="#f4f1e8"/><rect x="448" y="100" width="298" height="14" rx="7" fill="#9a9a9a"/>
      <g class="cin-diapo" font-family="Consolas, monospace" font-weight="700"><text x="597" y="182" text-anchor="middle" font-size="40" fill="#2e86de">1 0 1</text><text x="597" y="236" text-anchor="middle" font-size="24" fill="#555">= 4 + 1 = 5</text><text x="597" y="286" text-anchor="middle" font-size="22">💡</text></g>`;
    const fond = s;
    const faisceau = `<defs><linearGradient id="cin-faisceau2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6d0" stop-opacity=".75"/><stop offset="1" stop-color="#fff6d0" stop-opacity=".08"/></linearGradient></defs><path d="M338 330 L452 114 L452 306Z" fill="url(#cin-faisceau2)"/>`;
    s = '';
    // Le projecteur
    s += `<g><rect x="250" y="310" width="96" height="56" rx="10" fill="#2a2f3a"/><circle cx="276" cy="300" r="30" fill="#3a404d" stroke="#1d2027" stroke-width="5"/><circle cx="330" cy="298" r="26" fill="#3a404d" stroke="#1d2027" stroke-width="5"/>
      <g class="cin-bobine"><path d="M276 276 v48 M252 300 h48" stroke="#1d2027" stroke-width="5"/></g><g class="cin-bobine b2"><path d="M330 276 v44 M308 298 h44" stroke="#1d2027" stroke-width="5"/></g>
      <rect x="340" y="320" width="20" height="20" rx="4" fill="#1d2027"/><circle cx="360" cy="330" r="8" fill="#fff6d0"/><rect x="268" y="366" width="12" height="40" fill="#1d2027"/><rect x="316" y="366" width="12" height="40" fill="#1d2027"/></g>`;
    // Le bureau, le papier, le crayon, l'ampoule des indices
    s += `<rect x="60" y="420" width="880" height="26" rx="6" fill="#7a4a25"/><rect x="60" y="446" width="880" height="254" fill="#4a2a12"/>`;
    s += `<path d="M430 410 L600 404 L606 420 L424 424Z" fill="#fbf4e2"/><g stroke="#9a8a6a" stroke-width="2"><line x1="446" y1="412" x2="584" y2="408"/></g>`;
    s += `<g class="cin-crayon"><rect x="0" y="-6" width="130" height="12" rx="2" fill="#f5c542"/><path d="M130 -6 L154 0 L130 6Z" fill="#e8c9a0"/><path d="M146 -2 L154 0 L146 2Z" fill="#333"/><rect x="-14" y="-6" width="14" height="12" rx="2" fill="#e88a9a"/></g>`;
    s += `<g transform="translate(700 372)"><circle class="cin-halo-ampoule" r="60" fill="url(#cin-ampoule)"/><path d="M-16 0 a16 16 0 1 1 32 0 c0 9 -7 13 -7 22 h-18 c0 -9 -7 -13 -7 -22z" fill="#fff2a8" stroke="#c9a35a" stroke-width="2"/><rect x="-9" y="23" width="18" height="9" rx="3" fill="#9a9a9a"/></g>`;
    // Les bonnets des lutins qui regardent (en silhouette, au premier plan)
    [[260, 700], [350, 712], [690, 706], [780, 700]].forEach(([x, y]) => { s += `<path d="M${x - 44} ${y} C${x - 40} ${y - 70} ${x + 40} ${y - 70} ${x + 44} ${y}Z" fill="#0d0805"/><path d="M${x - 30} ${y - 50} L${x + 6} ${y - 130} L${x + 30} ${y - 50}Z" fill="#0d0805"/>`; });
    return secours(calque(fond) + calque(faisceau, 'cin-faisceau') + calque(s)) + video('atelier', { boucle: true, cadre: 'atelier' });
  }

  /* ---------- 9. La menace : dans le noir, Kryos sort de l'ombre (ses yeux rouges d'abord) ---------- */
  function menace() {
    return secours(image('kryos-face', 'cin-kryos-surgit') + `<div class="cin-givre-montant"></div>`) + video('kryos-surgit');
  }

  /* ---------- 10. Le gel : Kryos règne, le chalet est à lui ---------- */
  // (vidéo : Kryos referme ses griffes sur le chalet ; elle reste jusqu'au bouton « J'accepte la
  // mission ! » : à la fin du fichier, elle repart à 3,5 s, cf. encoder2.sh)
  function gel() {
    return secours(image('kryos-chalet', 'cin-fond-image')) + video('gel', { reprise: 3.5 })
      + `<div class="cin-givre-montant plein"></div><div class="cin-eclair"></div>`;
  }

  const SCENES = { cachot, glacier, keres, chalet, hiver, prophetie, mission, cours, menace, gel };
  /* Une vidéo qui vient d'apparaître reste au moins VUE_MIN (ms) à l'écran avant qu'une autre ne la
     remplace ; la plume, elle, continue d'écrire. (Mesuré à 30 caractères/s, minutage.js : les
     moments les plus serrés arrivaient à 1,5 s d'écart et le décor avait au plus ≈ 1,1 s de retard ;
     depuis le passage à 20 caractères/s avec de vraies pauses, ils sont plus espacés.) Les moments sans vidéo
     (la fissure, la lueur, les guirlandes) passent tout de suite, par-dessus la vidéo en cours. */
  const VUE_MIN = 2000;
  // Les scènes qui chargent des vidéos ou de grandes images : préparées dès le début de la lettre
  // (cachées), pour que tout soit prêt quand la plume y arrive : une toutes les 1,5 s, dans l'ordre
  // de la lettre, pour ne pas tout charger d'un coup.
  const AVEC_MEDIAS = ['glacier', 'keres', 'chalet', 'hiver', 'prophetie', 'mission', 'cours', 'menace', 'gel'];

  // fondu : le son monte en douceur (une boucle qui reprend après une vidéo « retour »)
  function jouer(v, { fondu = 0 } = {}) {
    if (!v || v.dataset.echec) return;
    v.defaultPlaybackRate = v.playbackRate = Number(v.dataset.vitesse) || 1;
    clearInterval(fondus.get(v)); fondus.delete(v);
    appliquerVolume(v);
    const sc = v.closest('.cin-scene');
    if (v.loop && sc) sc._boucle = v; // la boucle que retrouvera une vidéo « retour »
    // Le gel final : à la fin du fichier, on repart à l'instant « reprise » (même image, cf. encoder2.sh)
    if (v.dataset.reprise && !v._reprise) {
      v._reprise = true;
      v.addEventListener('ended', () => { v.currentTime = Number(v.dataset.reprise); v.play().catch(() => {}); });
    }
    if (mouvementReduit()) return; // l'affiche suffit
    if (fondu && !v.muted) { const cible = v.volume; v.volume = 0; fondreSon(v, fondu, cible); }
    const p = v.play();
    // Si le navigateur refuse le son (aucun clic avant), la vidéo joue quand même, sans le son
    if (p && p.catch) p.catch(() => { if (!v.muted) { v.muted = true; v.play().catch(() => {}); } });
  }

  // Si une vidéo ne peut pas être lue (aucun format accepté, fichier absent) : la vidéo de la scène
  // laisse la place au dessin d'origine ; une vidéo d'un moment précis disparaît simplement.
  function surveiller(el) {
    el.querySelectorAll('video').forEach((v) => {
      const sources = v.querySelectorAll('source');
      const derniere = sources[sources.length - 1];
      const echec = () => {
        if (v.dataset.echec) return;
        v.dataset.echec = '1';
        if (v.dataset.quand !== 'scene') { v.remove(); return; }
        const modele = el.querySelector('template.cin-secours');
        el.querySelectorAll('video').forEach(x => x.remove());
        if (modele) modele.replaceWith(modele.content);
        el.classList.add('secours');
      };
      // (pas de test de networkState ici : juste après sa création, une vidéo passe un instant
      // par NETWORK_NO_SOURCE avant de choisir sa source)
      if (derniere) derniere.addEventListener('error', echec);
      v.addEventListener('error', echec);
    });
  }

  function creer(conteneur, { prenom } = {}) {
    const cinema = document.createElement('div');
    cinema.className = 'cinema';
    cinema.setAttribute('aria-hidden', 'true');
    cinema.innerHTML = '<div class="cin-scene-vide"></div><div class="cin-bord"></div>';
    conteneur.prepend(cinema);
    const faites = new Map();
    let active = null;
    let prechargement = 0;
    let apparue = -Infinity; // l'instant où la dernière vidéo est apparue
    const file = [];         // les moments demandés par la plume, pas encore joués (dans l'ordre)
    let minuteurFile = 0;

    function construire(nom) {
      let el = faites.get(nom);
      if (!el) {
        el = document.createElement('div');
        el.className = 'cin-scene cin-' + nom;
        el.dataset.nom = nom;
        el.innerHTML = SCENES[nom](prenom);
        faites.set(nom, el);
        cinema.insertBefore(el, cinema.lastChild);
        surveiller(el);
        // Les grandes images sont décodées à l'avance : sinon, le décodage tombe au moment du fondu
        el.querySelectorAll('img').forEach(i => { if (i.decode) i.decode().catch(() => {}); });
      }
      return el;
    }

    // La plume demande un moment : il est joué tout de suite, ou dès que la vidéo à l'écran y est
    // restée VUE_MIN. Un moment sans vidéo (une fissure, une lueur) ne fait pas attendre, sauf s'il
    // y a déjà des moments en attente (l'ordre de la lettre est gardé).
    function demander(type, nom) {
      file.push({ type, nom });
      vider();
    }
    function avecVideo(m) {
      if (m.type === 'scene') return true;
      return !!(active && [...active.querySelectorAll(`video[data-quand="${m.nom}"]`)].some(v => !v.dataset.echec));
    }
    function vider() {
      clearTimeout(minuteurFile);
      while (file.length) {
        const m = file[0];
        const video = avecVideo(m);
        const reste = video && !mouvementReduit() ? apparue + VUE_MIN - performance.now() : 0;
        if (reste > 0) { minuteurFile = setTimeout(vider, reste); return; }
        file.shift();
        if (video) apparue = performance.now();
        if (m.type === 'scene') jouerScene(m.nom); else jouerEvenement(m.nom);
      }
    }

    function scene(nom) {
      if (nom === 'fin') nom = 'gel';
      if (!SCENES[nom]) return;
      const derniere = file.filter(m => m.type === 'scene').pop();
      if ((derniere ? derniere.nom : active && active.dataset.nom) === nom) return;
      demander('scene', nom);
    }
    function jouerScene(nom) {
      if (active && active.dataset.nom === nom) return;
      const el = construire(nom);
      // Dès la première scène (le cachot), les suivantes commencent à charger, un peu après la vidéo du cachot
      if (nom === 'cachot' && !prechargement) {
        let k = 0;
        const suivante = () => {
          if (!cinema.isConnected || k >= AVEC_MEDIAS.length) return;
          construire(AVEC_MEDIAS[k++]);
          prechargement = setTimeout(suivante, 1500);
        };
        prechargement = setTimeout(suivante, 1200);
      }
      const ancienne = active;
      active = el;
      el.classList.add('sortie'); // affichée mais transparente…
      void el.offsetWidth;
      el.classList.remove('sortie');
      el.classList.add('active'); // …puis le fondu
      el.querySelectorAll('video[data-quand="scene"]').forEach(v => jouer(v));
      if (ancienne) {
        ancienne.classList.remove('active');
        ancienne.classList.add('sortie');
        // Le son de la scène qui s'efface s'éteint vite, puis ses vidéos s'arrêtent sur leur image
        // pendant la fin du fondu (deux vidéos décodées en même temps faisaient tomber Firefox à
        // 15-20 images/s à chaque changement de scène) ; elle est retirée du rendu ensuite (sinon ses
        // animations continuent de tourner)
        ancienne.querySelectorAll('video').forEach(v => arreterEnFondu(v, 450));
        setTimeout(() => {
          if (ancienne === active) return;
          ancienne.classList.remove('sortie');
          ancienne.querySelectorAll('video').forEach(v => v.pause());
        }, 1600);
      }
    }
    // Un moment de la scène en cours (la fissure du glacier, la lettre qui s'envole…)
    function evenement(nom) {
      if (active || file.length) demander('evt', nom);
    }
    function jouerEvenement(nom) {
      if (!active) return;
      active.classList.add('evt-' + nom);
      const scene = active, videos = [...scene.querySelectorAll(`video[data-quand="${nom}"]`)].filter(x => !x.dataset.echec);
      // La vidéo du moment passe par-dessus : le son des autres (celle du début de la scène, celle du
      // moment précédent) s'éteint pendant que la nouvelle apparaît, puis elles s'arrêtent
      if (videos.length) scene.querySelectorAll('video').forEach(x => { if (!videos.includes(x)) arreterEnFondu(x, 450); });
      videos.forEach((v) => { v.classList.add('visible'); jouer(v); });
      const v = videos[0];
      // Une vidéo « retour » (la Kère chassée, le fragment), une fois finie, rend la place à la boucle,
      // sauf si la vidéo d'un autre moment joue déjà (l'étoile qui s'allume, par exemple)
      if (v && v.dataset.retour) v.addEventListener('ended', () => {
        const boucle = scene._boucle;
        if (active !== scene || [...scene.querySelectorAll('video')].some(x => x !== v && x !== boucle && !x.paused)) return;
        if (boucle && boucle !== v && !boucle.dataset.echec) jouer(boucle, { fondu: 600 });
        v.classList.remove('visible');
      }, { once: true });
    }
    return {
      element: cinema,
      scene,
      evenement,
      // Tout de suite à la fin (relecture de la lettre déjà écrite)
      finale() { file.length = 0; apparue = -Infinity; scene('gel'); if (active) active.classList.add('immediat'); },
      detruire() {
        clearTimeout(prechargement);
        clearTimeout(minuteurFile);
        file.length = 0;
        cinema.querySelectorAll('video').forEach(v => v.pause());
        cinema.remove(); faites.clear(); active = null;
      },
    };
  }

  // Le curseur « Musique » du panneau 🔊 règle aussi le son des vidéos (app.js l'appelle à chaque changement)
  function reglerVolume(v) {
    reglage = Math.max(0, Math.min(1, Number(v) || 0));
    document.querySelectorAll('.cinema video').forEach(appliquerVolume);
  }
  // Onglet caché : la plume s'arrête, les vidéos se taisent (comme la musique)
  document.addEventListener('visibilitychange', () => document.querySelectorAll('.cinema video').forEach(appliquerVolume));

  global.CINEMA = { creer, reglerVolume, scenes: Object.keys(SCENES) };
})(window);
