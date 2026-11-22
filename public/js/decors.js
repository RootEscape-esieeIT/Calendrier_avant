/* =========================================================
   NOËL-OS — Les décors illustrés (SVG générés)
   DECORS.bandeau(jour)  → la scène en haut de chaque énigme
   DECORS.paysage()      → le paysage enneigé de la page d'accueil
   ========================================================= */
(function (global) {
  'use strict';

  let compteur = 0;
  // Pseudo-hasard reproductible : un même jour a toujours le même décor.
  function hasard(graine) {
    let s = (graine * 9301 + 49297) % 233280 || 1;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  const entre = (r, a, b) => a + r() * (b - a);

  /* ---------- Briques de décor ---------- */
  function etoiles(r, n, hMax) {
    let s = '';
    for (let i = 0; i < n; i++) {
      s += `<circle class="d-etoile" cx="${entre(r, 0, 900).toFixed(0)}" cy="${entre(r, 4, hMax).toFixed(0)}" r="${entre(r, 0.6, 1.8).toFixed(1)}" style="animation-delay:${entre(r, 0, 4).toFixed(1)}s"/>`;
    }
    return s;
  }

  const lune = (x, y) => `<circle cx="${x}" cy="${y}" r="34" fill="#fff8dc" opacity="0.12"/><circle cx="${x}" cy="${y}" r="22" fill="#fff8e1" opacity="0.18"/><circle cx="${x}" cy="${y}" r="15" fill="#fffbea"/><circle cx="${x + 5}" cy="${y - 3}" r="13" fill="url(#ombre-lune-${compteur})" opacity="0.5"/>`;

  function aurore(id) {
    return `<g class="d-aurore">
      <path d="M-50 70 C150 10 300 120 470 50 S760 0 950 60 L950 105 C760 50 600 150 450 95 S150 60 -50 115 Z" fill="url(#aur1-${id})" opacity="0.55"/>
      <path d="M-50 40 C200 90 350 0 520 40 S800 90 950 20 L950 55 C780 110 620 30 500 70 S180 120 -50 75 Z" fill="url(#aur2-${id})" opacity="0.4"/>
    </g>`;
  }

  function sapin(x, base, h, couleur, neige = true) {
    const l = h * 0.42;
    let s = '';
    for (let k = 0; k < 3; k++) {
      const haut = base - h + k * h * 0.26;
      const bas = base - h * 0.45 + k * h * 0.22;
      const demi = l * (0.55 + k * 0.25);
      s += `<polygon points="${x},${haut.toFixed(1)} ${(x + demi).toFixed(1)},${bas.toFixed(1)} ${(x - demi).toFixed(1)},${bas.toFixed(1)}" fill="${couleur}"/>`;
      if (neige) s += `<polyline points="${(x - demi * 0.55).toFixed(1)},${(bas - (bas - haut) * 0.28).toFixed(1)} ${x},${(bas - (bas - haut) * 0.12).toFixed(1)} ${(x + demi * 0.55).toFixed(1)},${(bas - (bas - haut) * 0.28).toFixed(1)}" fill="none" stroke="#eef6ff" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>`;
    }
    s += `<rect x="${(x - h * 0.04).toFixed(1)}" y="${(base - h * 0.08).toFixed(1)}" width="${(h * 0.08).toFixed(1)}" height="${(h * 0.08).toFixed(1)}" fill="#2a1a10"/>`;
    return s;
  }

  function foret(r, base, n, hMin, hMax, couleur, neige) {
    let s = '';
    for (let i = 0; i < n; i++) s += sapin(entre(r, -20, 920), base + entre(r, -4, 4), entre(r, hMin, hMax), couleur, neige);
    return s;
  }

  function crete(r, base, hMin, hMax, pas, couleur, neige) {
    const pts = [[-20, base]];
    const sommets = [];
    for (let x = -20; x <= 940; x += pas * entre(r, 0.6, 1.4)) {
      const y = base - entre(r, hMin, hMax);
      pts.push([x, y]);
      sommets.push([x, y]);
    }
    pts.push([940, base]);
    let s = `<polygon points="${pts.map(p => p.map(v => v.toFixed(0)).join(',')).join(' ')}" fill="${couleur}"/>`;
    if (neige) {
      for (let i = 1; i < sommets.length - 1; i++) {
        const [x, y] = sommets[i];
        if (y < sommets[i - 1][1] && y < sommets[i + 1][1]) {
          const g = sommets[i - 1], d = sommets[i + 1];
          const t = 0.28;
          s += `<polygon points="${x.toFixed(0)},${y.toFixed(0)} ${(x + (d[0] - x) * t).toFixed(0)},${(y + (d[1] - y) * t).toFixed(0)} ${(x + (d[0] - x) * t * 0.5).toFixed(0)},${(y + (d[1] - y) * t * 0.75).toFixed(0)} ${x.toFixed(0)},${(y + (base - y) * 0.16).toFixed(0)} ${(x + (g[0] - x) * t * 0.5).toFixed(0)},${(y + (g[1] - y) * t * 0.75).toFixed(0)} ${(x + (g[0] - x) * t).toFixed(0)},${(y + (g[1] - y) * t).toFixed(0)}" fill="#f1f7ff" opacity="0.9"/>`;
        }
      }
    }
    return s;
  }

  function maison(r, x, base, l, h, teinte) {
    const toit = h * 0.65;
    let s = `<rect x="${x}" y="${base - h}" width="${l}" height="${h}" fill="${teinte}"/>`;
    if (r() > 0.35) s += `<rect x="${(x + l * 0.68).toFixed(0)}" y="${(base - h - toit * 0.75).toFixed(0)}" width="${(l * 0.12).toFixed(0)}" height="${(toit * 0.6).toFixed(0)}" fill="${teinte}"/>` + fumee(x + l * 0.74, base - h - toit * 0.8);
    s += `<polygon points="${x - 6},${base - h} ${x + l / 2},${base - h - toit} ${x + l + 6},${base - h}" fill="#141a2b"/>`;
    s += `<polyline points="${x - 7},${base - h + 1} ${x + l / 2},${base - h - toit} ${x + l + 7},${base - h + 1}" fill="none" stroke="#f4f9ff" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
    const nb = l > 70 ? 2 : 1;
    for (let k = 0; k < nb; k++) {
      const fx = x + (l / (nb + 1)) * (k + 1) - 7;
      const allumee = r() > 0.2;
      s += `<rect class="${allumee ? 'd-fenetre' : ''}" x="${fx.toFixed(0)}" y="${(base - h * 0.72).toFixed(0)}" width="14" height="14" rx="2" fill="${allumee ? '#ffd27a' : '#2b3550'}" style="animation-delay:${entre(r, 0, 6).toFixed(1)}s"/>`;
    }
    s += `<rect x="${(x + l / 2 - 6).toFixed(0)}" y="${base - 20}" width="12" height="20" rx="5" fill="#3b2416"/>`;
    return s;
  }

  const fumee = (x, y) => `<g class="d-fumee"><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5"/><circle cx="${(x + 4).toFixed(0)}" cy="${(y - 9).toFixed(0)}" r="7" style="animation-delay:.8s"/><circle cx="${(x + 1).toFixed(0)}" cy="${(y - 20).toFixed(0)}" r="9" style="animation-delay:1.6s"/></g>`;

  function village(r, base, teinte) {
    let s = '';
    let x = entre(r, -30, 10);
    while (x < 900) {
      const l = entre(r, 55, 105), h = entre(r, 38, 64);
      s += maison(r, x.toFixed(0) * 1, base, Math.round(l), Math.round(h), teinte);
      x += l + entre(r, 18, 60);
      if (r() > 0.55 && x < 880) { s += sapin(x - 10, base, entre(r, 40, 70), '#173d2a'); x += 22; }
    }
    return s;
  }

  function sol(couleur = '#eef5ff', y = 214) {
    return `<path d="M-10 ${y} C120 ${y - 12} 260 ${y + 6} 420 ${y - 6} S720 ${y - 14} 910 ${y - 2} L910 250 L-10 250 Z" fill="${couleur}"/>
            <path d="M-10 ${y + 10} C200 ${y + 2} 380 ${y + 18} 560 ${y + 8} S800 ${y + 4} 910 ${y + 12} L910 250 L-10 250 Z" fill="#ffffff" opacity="0.7"/>`;
  }

  function chateau(base, teinte) {
    const tour = (x, l, h, c) => `<rect x="${x}" y="${base - h}" width="${l}" height="${h}" fill="${c}"/><polygon points="${x - 6},${base - h} ${x + l / 2},${base - h - l * 1.3} ${x + l + 6},${base - h}" fill="#141a2b"/><polyline points="${x - 6},${base - h} ${x + l / 2},${base - h - l * 1.3} ${x + l + 6},${base - h}" fill="none" stroke="#f4f9ff" stroke-width="3"/><line x1="${x + l / 2}" y1="${base - h - l * 1.3}" x2="${x + l / 2}" y2="${base - h - l * 1.3 - 16}" stroke="#ccc" stroke-width="1.5"/><polygon points="${x + l / 2},${base - h - l * 1.3 - 16} ${x + l / 2 + 13},${base - h - l * 1.3 - 12} ${x + l / 2},${base - h - l * 1.3 - 8}" fill="#d62839"/>`;
    const fen = (x, y) => `<rect class="d-fenetre" x="${x}" y="${y}" width="9" height="14" rx="4" fill="#ffd27a"/>`;
    let s = `<rect x="330" y="${base - 90}" width="240" height="90" fill="${teinte}"/>`;
    for (let x = 330; x < 570; x += 20) s += `<rect x="${x}" y="${base - 100}" width="12" height="12" fill="${teinte}"/>`;
    s += tour(300, 48, 130, teinte) + tour(552, 48, 130, teinte) + tour(425, 50, 160, teinte);
    s += `<path d="M430 ${base} L430 ${base - 40} Q450 ${base - 62} 470 ${base - 40} L470 ${base} Z" fill="#3b2416"/>`;
    [[315, base - 100], [567, base - 100], [440, base - 135], [460, base - 135], [360, base - 60], [390, base - 60], [510, base - 60], [540, base - 60]].forEach(([x, y]) => { s += fen(x, y); });
    return s;
  }

  function palaisGlace(r, base) {
    let s = '';
    const pics = [[450, 175, 34], [380, 130, 26], [520, 130, 26], [320, 95, 20], [580, 95, 20], [265, 60, 16], [635, 60, 16]];
    pics.forEach(([x, h, l]) => {
      s += `<polygon points="${x - l},${base} ${x - l * 0.6},${base - h * 0.75} ${x},${base - h} ${x + l * 0.6},${base - h * 0.75} ${x + l},${base}" fill="url(#glace-${compteur})" stroke="#e8fbff" stroke-width="1.5" opacity="0.92"/>`;
      s += `<line x1="${x}" y1="${base - h}" x2="${x}" y2="${base}" stroke="#ffffff" stroke-width="1" opacity="0.5"/>`;
    });
    for (let i = 0; i < 18; i++) {
      const x = entre(r, 0, 900), h = entre(r, 10, 40);
      if (x > 240 && x < 660) continue;
      s += `<polygon points="${(x - h / 4).toFixed(0)},${base} ${x.toFixed(0)},${(base - h).toFixed(0)} ${(x + h / 4).toFixed(0)},${base}" fill="#bfe9ff" opacity="0.7"/>`;
    }
    return s;
  }

  function atelier(r, id) {
    let s = `<rect x="0" y="0" width="900" height="250" fill="url(#bois-${id})"/>`;
    for (let x = 0; x < 900; x += 46) s += `<line x1="${x}" y1="0" x2="${x}" y2="250" stroke="#000" stroke-opacity="0.22" stroke-width="2"/>`;
    s += `<rect x="0" y="0" width="900" height="26" fill="#3a2212"/><rect x="0" y="26" width="900" height="4" fill="#000" opacity="0.25"/>`;
    // Fenêtre ronde sur la nuit enneigée
    s += `<circle cx="140" cy="105" r="48" fill="#0d2240" stroke="#5a3a1e" stroke-width="10"/>`;
    for (let i = 0; i < 14; i++) s += `<circle class="d-flocon-fenetre" cx="${entre(r, 100, 180).toFixed(0)}" cy="${entre(r, 65, 145).toFixed(0)}" r="${entre(r, 1, 2.4).toFixed(1)}" fill="#fff" style="animation-delay:${entre(r, 0, 3).toFixed(1)}s"/>`;
    s += `<line x1="92" y1="105" x2="188" y2="105" stroke="#5a3a1e" stroke-width="6"/><line x1="140" y1="57" x2="140" y2="153" stroke="#5a3a1e" stroke-width="6"/>`;
    // Lampes suspendues
    [330, 560, 790].forEach((x, i) => {
      s += `<line x1="${x}" y1="26" x2="${x}" y2="70" stroke="#222" stroke-width="2"/><path d="M${x - 18} 84 Q${x} 62 ${x + 18} 84 Z" fill="#2c3e50"/>`;
      s += `<circle class="d-lampe" cx="${x}" cy="88" r="7" fill="#fff1b8" style="animation-delay:${i * 0.7}s"/><polygon points="${x - 14},90 ${x + 14},90 ${x + 70},250 ${x - 70},250" fill="#ffe9a0" opacity="0.08"/>`;
    });
    // Étagère avec des jouets
    s += `<rect x="250" y="170" width="620" height="10" fill="#4a2c16"/><rect x="250" y="180" width="620" height="4" fill="#000" opacity="0.3"/>`;
    ['🧸', '🚂', '🪀', '🎁', '🥁', '🪁', '🎁', '🧩'].forEach((e, i) => { s += `<text x="${290 + i * 75}" y="166" font-size="30" text-anchor="middle">${e}</text>`; });
    // Guirlande
    s += `<path d="M0 34 Q225 70 450 34 T900 34" fill="none" stroke="#1d4d2b" stroke-width="5"/>`;
    for (let i = 0; i <= 18; i++) {
      const t = i / 18, x = t * 900;
      const y = 34 + Math.abs(Math.sin(t * Math.PI * 2)) * 18;
      s += `<circle class="d-ampoule" cx="${x.toFixed(0)}" cy="${(y + 6).toFixed(0)}" r="4.5" fill="${['#ff5a5f', '#ffd23f', '#3ddc84', '#4aa3ff'][i % 4]}" style="animation-delay:${(i * 0.23).toFixed(2)}s"/>`;
    }
    s += `<rect x="0" y="228" width="900" height="22" fill="#2a170b"/>`;
    return s;
  }

  function tech(r, base) {
    let s = '';
    const tours = [[70, 70, 120], [190, 60, 90], [640, 64, 110], [770, 80, 140]];
    tours.forEach(([x, l, h]) => {
      s += `<rect x="${x}" y="${base - h}" width="${l}" height="${h}" rx="4" fill="#0f1a2c" stroke="#2c4a6e" stroke-width="2"/>`;
      s += `<polyline points="${x - 3},${base - h + 2} ${x + l / 2},${base - h - 6} ${x + l + 3},${base - h + 2}" fill="none" stroke="#f4f9ff" stroke-width="5" stroke-linecap="round"/>`;
      for (let y = base - h + 14; y < base - 10; y += 16) {
        s += `<rect x="${x + 8}" y="${y}" width="${l - 16}" height="9" rx="2" fill="#16263f"/>`;
        for (let k = 0; k < 3; k++) s += `<circle class="d-led" cx="${x + 14 + k * 8}" cy="${y + 4.5}" r="2" fill="${r() > 0.5 ? '#3ddc84' : (r() > 0.5 ? '#ff5a5f' : '#4aa3ff')}" style="animation-delay:${entre(r, 0, 2).toFixed(2)}s"/>`;
      }
    });
    // Antenne
    s += `<line x1="450" y1="${base}" x2="450" y2="${base - 150}" stroke="#7a8aa0" stroke-width="4"/><line x1="420" y1="${base}" x2="450" y2="${base - 100}" stroke="#7a8aa0" stroke-width="3"/><line x1="480" y1="${base}" x2="450" y2="${base - 100}" stroke="#7a8aa0" stroke-width="3"/>`;
    s += `<circle class="d-balise" cx="450" cy="${base - 154}" r="6" fill="#ff5a5f"/>`;
    [1, 2, 3].forEach(k => { s += `<path class="d-onde" d="M${450 - 18 * k} ${base - 160 - 6 * k} Q450 ${base - 178 - 12 * k} ${450 + 18 * k} ${base - 160 - 6 * k}" fill="none" stroke="#7fd3ff" stroke-width="2" style="animation-delay:${k * 0.4}s"/>`; });
    // Guirlande entre les tours
    s += `<path d="M130 ${base - 118} Q190 ${base - 80} 220 ${base - 90}" fill="none" stroke="#1d4d2b" stroke-width="3"/><path d="M672 ${base - 108} Q730 ${base - 70} 810 ${base - 138}" fill="none" stroke="#1d4d2b" stroke-width="3"/>`;
    // Pistes de circuit lumineuses
    for (let i = 0; i < 7; i++) {
      const y = base + 6 + i * 4, x = entre(r, 0, 500);
      s += `<path class="d-piste" d="M${x.toFixed(0)} ${y} h${entre(r, 80, 200).toFixed(0)} l12 -6 h${entre(r, 40, 120).toFixed(0)}" fill="none" stroke="#3ddc84" stroke-width="1.5" opacity="0.6" style="animation-delay:${(i * 0.5).toFixed(1)}s"/>`;
    }
    return s;
  }

  function cabane(r, base) {
    let s = foret(r, base - 6, 10, 70, 120, '#10301f', true);
    const x = 560, l = 170, h = 80;
    s += `<rect x="${x}" y="${base - h}" width="${l}" height="${h}" fill="#5a341a"/>`;
    for (let y = base - h + 8; y < base; y += 12) s += `<line x1="${x}" y1="${y}" x2="${x + l}" y2="${y}" stroke="#3a2010" stroke-width="3"/>`;
    s += `<polygon points="${x - 14},${base - h} ${x + l / 2},${base - h - 56} ${x + l + 14},${base - h}" fill="#2a1a10"/><polyline points="${x - 14},${base - h} ${x + l / 2},${base - h - 56} ${x + l + 14},${base - h}" fill="none" stroke="#f4f9ff" stroke-width="7" stroke-linejoin="round"/>`;
    s += `<rect x="${x + 120}" y="${base - h - 60}" width="16" height="34" fill="#3a2010"/>` + fumee(x + 128, base - h - 66);
    s += `<rect class="d-ecran" x="${x + 26}" y="${base - 58}" width="44" height="32" rx="3" fill="#3dff7a"/><rect x="${x + 100}" y="${base - 48}" width="26" height="48" rx="3" fill="#2a1a10"/>`;
    return s;
  }

  /* ---------- Assemblage ---------- */
  const EXTERIEURS = ['village', 'foret', 'montagnes', 'chateau', 'glace', 'tech', 'cabane'];

  function defs(id, c1, c2) {
    return `<defs>
      <linearGradient id="ciel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      <linearGradient id="aur1-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3dffa8" stop-opacity="0"/><stop offset=".3" stop-color="#3dffa8"/><stop offset=".7" stop-color="#7ad7ff"/><stop offset="1" stop-color="#b98cff" stop-opacity="0"/></linearGradient>
      <linearGradient id="aur2-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b98cff" stop-opacity="0"/><stop offset=".5" stop-color="#ff8ad8"/><stop offset="1" stop-color="#3dffa8" stop-opacity="0"/></linearGradient>
      <linearGradient id="glace-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#a8e6ff"/><stop offset="1" stop-color="#4fa9d9"/></linearGradient>
      <linearGradient id="bois-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b3f1f"/><stop offset="1" stop-color="#3d2312"/></linearGradient>
      <radialGradient id="ombre-lune-${id}"><stop offset="0" stop-color="#d9cfa8"/><stop offset="1" stop-color="#d9cfa8" stop-opacity="0"/></radialGradient>
      <filter id="flou-${id}"><feGaussianBlur stdDeviation="8"/></filter>
    </defs>`;
  }

  function scene(decor, graine, c1, c2) {
    const id = ++compteur;
    const r = hasard(graine);
    const base = 214;
    let s = defs(id, c1, c2);
    if (decor === 'atelier') return `<svg class="decor-svg" viewBox="0 0 900 250" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${s}${atelier(r, id)}</svg>`;
    s += `<rect width="900" height="250" fill="url(#ciel-${id})"/>` + etoiles(r, 45, 150);
    if (['montagnes', 'glace', 'tech'].includes(decor)) s += `<g filter="url(#flou-${id})">${aurore(id)}</g>`;
    if (!['glace'].includes(decor)) s += lune(800, 48);
    switch (decor) {
      case 'village':
        s += crete(r, base, 40, 80, 120, '#ffffff14', false) + foret(r, base - 18, 14, 40, 70, '#0e2a22', true) + village(r, base, '#233052');
        break;
      case 'foret':
        s += crete(r, base, 60, 110, 140, '#ffffff12', true) + foret(r, base - 30, 18, 60, 100, '#0d2a20', true) + foret(r, base - 6, 12, 90, 150, '#082016', true);
        s += `<text x="700" y="${base - 6}" font-size="40" text-anchor="middle">🛷</text>`;
        break;
      case 'montagnes':
        s += crete(r, base, 90, 170, 110, '#3b5b86', true) + crete(r, base, 50, 100, 90, '#25406a', true) + foret(r, base - 4, 16, 40, 80, '#0b241c', true);
        break;
      case 'chateau':
        s += crete(r, base, 40, 80, 130, '#ffffff12', false) + chateau(base, '#2a3760') + foret(r, base - 2, 8, 50, 90, '#0b241c', true);
        break;
      case 'glace':
        s += `<g filter="url(#flou-${id})">${aurore(id)}</g>` + crete(r, base, 50, 90, 120, '#9fd4ff22', false) + palaisGlace(r, base);
        break;
      case 'tech':
        s += tech(r, base);
        break;
      case 'cabane':
        s += cabane(r, base);
        break;
      default:
        s += foret(r, base, 14, 50, 100, '#0d2a20', true);
    }
    s += sol();
    return `<svg class="decor-svg" viewBox="0 0 900 250" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${s}</svg>`;
  }

  function particules(liste, graine, n = 14) {
    const r = hasard(graine + 77);
    let s = '<div class="particules" aria-hidden="true">';
    for (let i = 0; i < n; i++) {
      const p = liste[i % liste.length];
      const chiffre = p === '0' || p === '1';
      s += `<span class="${chiffre ? 'p-chiffre' : ''}" style="left:${entre(r, 2, 96).toFixed(1)}%;font-size:${entre(r, 12, 26).toFixed(0)}px;animation-duration:${entre(r, 6, 13).toFixed(1)}s;animation-delay:-${entre(r, 0, 12).toFixed(1)}s;--derive:${entre(r, -40, 40).toFixed(0)}px">${p}</span>`;
    }
    return s + '</div>';
  }

  /* ---------- API publique ---------- */
  global.DECORS = {
    bandeau(J) {
      return scene(J.decor || 'foret', J.jour || 1, J.couleurs[0], J.couleurs[1]) + particules(J.particules || ['❄️'], J.jour || 1);
    },
    scene,
    particules,
    paysage() {
      const id = ++compteur;
      const r = hasard(2026);
      const base = 214;
      return `<svg class="paysage" viewBox="0 0 900 250" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${defs(id, '#000', '#000')}
        ${crete(r, base, 110, 190, 120, '#1b3458', true)}
        ${crete(r, base, 60, 120, 90, '#142a49', true)}
        ${foret(r, base - 20, 26, 35, 70, '#0c2620', true)}
        ${village(r, base - 2, '#1c2846')}
        ${sol('#dfeaf7', 220)}
      </svg>`;
    },
  };
})(window);
