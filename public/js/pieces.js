/* =========================================================
   NOËL-OS — Les pièces du chalet (SVG générés)
   PIECES.interieur(piece, graine) → l'intérieur d'une pièce
   PIECES.fermee(n)                → une pièce encore fermée
   PIECES.toit()                   → le toit enneigé du chalet
   Une pièce = { mur, motif, sol, elements: [gauche, centre, droite],
                 meuble, objets: [emoji…] }
   ========================================================= */
(function (global) {
  'use strict';

  let compteur = 0;
  function hasard(graine) {
    let s = (graine * 9301 + 49297) % 233280 || 1;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  const entre = (r, a, b) => a + r() * (b - a);

  // Éclaircir / assombrir une couleur #rrggbb
  function teinte(hex, k) {
    const n = parseInt(hex.slice(1), 16);
    let rr = (n >> 16) & 255, gg = (n >> 8) & 255, bb = n & 255;
    const f = (c) => Math.max(0, Math.min(255, Math.round(k >= 0 ? c + (255 - c) * k : c * (1 + k))));
    return '#' + [f(rr), f(gg), f(bb)].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  const PLAFOND = 22, BAS = 188, W = 900, H = 250;
  const svg = (contenu) => `<svg class="decor-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${contenu}</svg>`;

  /* ---------- Murs ---------- */
  function motifs(id, mur) {
    const c = mur, cl = teinte(mur, 0.12), cf = teinte(mur, -0.25);
    return `
      <pattern id="m-bois-${id}" width="46" height="250" patternUnits="userSpaceOnUse"><rect width="46" height="250" fill="${c}"/><rect width="2" height="250" fill="${cf}"/><path d="M14 0 Q18 60 13 120 T15 250 M30 0 Q26 80 31 160 T28 250" stroke="${cf}" stroke-opacity=".35" fill="none"/></pattern>
      <pattern id="m-rayures-${id}" width="44" height="40" patternUnits="userSpaceOnUse"><rect width="44" height="40" fill="${c}"/><rect width="16" height="40" x="14" fill="${cl}"/><rect width="2" height="40" x="22" fill="${teinte(mur, 0.3)}" opacity=".5"/></pattern>
      <pattern id="m-papier-${id}" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="${c}"/><path d="M20 8 l5 7 -5 7 -5 -7z" fill="${teinte(mur, 0.2)}"/><circle cx="0" cy="34" r="2" fill="${teinte(mur, 0.25)}"/><circle cx="40" cy="34" r="2" fill="${teinte(mur, 0.25)}"/></pattern>
      <pattern id="m-pierre-${id}" width="90" height="44" patternUnits="userSpaceOnUse"><rect width="90" height="44" fill="${cf}"/><rect x="2" y="2" width="56" height="18" rx="6" fill="${c}"/><rect x="62" y="2" width="26" height="18" rx="6" fill="${cl}"/><rect x="2" y="24" width="28" height="18" rx="6" fill="${cl}"/><rect x="34" y="24" width="54" height="18" rx="6" fill="${c}"/></pattern>
      <pattern id="m-briques-${id}" width="60" height="30" patternUnits="userSpaceOnUse"><rect width="60" height="30" fill="${teinte(mur, -0.4)}"/><rect x="1" y="1" width="58" height="13" fill="${c}"/><rect x="-29" y="16" width="58" height="13" fill="${cl}"/><rect x="31" y="16" width="58" height="13" fill="${cl}"/></pattern>
      <pattern id="m-carreaux-${id}" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="${teinte(mur, 0.4)}"/><rect x="1" y="1" width="28" height="28" rx="2" fill="${c}"/><rect x="3" y="3" width="10" height="4" rx="2" fill="#fff" opacity=".2"/></pattern>
      <pattern id="m-metal-${id}" width="100" height="70" patternUnits="userSpaceOnUse"><rect width="100" height="70" fill="${cf}"/><rect x="2" y="2" width="96" height="66" rx="3" fill="${c}"/><circle cx="8" cy="8" r="2" fill="${cl}"/><circle cx="92" cy="8" r="2" fill="${cl}"/><circle cx="8" cy="62" r="2" fill="${cl}"/><circle cx="92" cy="62" r="2" fill="${cl}"/></pattern>
      <pattern id="m-glace-${id}" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="${c}"/><path d="M0 120 L120 0 M-30 60 L60 -30 M60 150 L150 60" stroke="#fff" stroke-opacity=".25" stroke-width="8"/></pattern>
      <pattern id="m-uni-${id}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${c}"/></pattern>`;
  }

  /* ---------- Sols ---------- */
  function sol(type, id) {
    let s = '';
    if (type === 'pierre' || type === 'metal' || type === 'glace' || type === 'carrelage') {
      const fond = { pierre: '#5b5f66', metal: '#2a3340', glace: '#bfe4f7', carrelage: '#e8dcc6' }[type];
      s += `<rect x="0" y="${BAS}" width="${W}" height="${H - BAS}" fill="${fond}"/>`;
      if (type === 'carrelage') for (let x = 0; x < W; x += 36) for (let y = BAS; y < H; y += 22) if (((x / 36) + Math.round((y - BAS) / 22)) % 2 === 0) s += `<rect x="${x}" y="${y}" width="36" height="22" fill="#b35a3a" opacity=".85"/>`;
      if (type === 'pierre') for (let x = 0; x < W; x += 70) s += `<line x1="${x}" y1="${BAS}" x2="${x - 20}" y2="${H}" stroke="#3b3e44" stroke-width="2"/>`;
      if (type === 'metal') for (let y = BAS + 8; y < H; y += 10) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#3d4a5c" stroke-width="2"/>`;
      if (type === 'glace') s += `<path d="M0 ${BAS + 20} L900 ${BAS + 5}" stroke="#fff" stroke-width="6" opacity=".5"/>`;
    } else {
      s += `<rect x="0" y="${BAS}" width="${W}" height="${H - BAS}" fill="#7a4a25"/>`;
      for (let y = BAS + 10; y < H; y += 12) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#5a3418" stroke-width="2"/>`;
      for (let x = 0, k = 0; x < W; x += 90, k++) for (let y = BAS; y < H; y += 12) s += `<line x1="${x + ((y / 12) % 2) * 45}" y1="${y}" x2="${x + ((y / 12) % 2) * 45}" y2="${y + 10}" stroke="#5a3418" stroke-width="1.5"/>`;
      if (type === 'tapis') s += `<ellipse cx="450" cy="${BAS + 34}" rx="300" ry="26" fill="#9b1b30"/><ellipse cx="450" cy="${BAS + 34}" rx="284" ry="20" fill="none" stroke="#f5c542" stroke-width="3" stroke-dasharray="10 6"/><ellipse cx="450" cy="${BAS + 34}" rx="200" ry="11" fill="none" stroke="#1f7a4d" stroke-width="4"/>`;
    }
    return s + `<rect x="0" y="${BAS}" width="${W}" height="5" fill="#000" opacity=".25"/>`;
  }

  /* ---------- Éléments du décor (centrés sur cx, posés au sol) ---------- */
  const flocons = (r, x1, x2, y1, y2, n) => { let s = ''; for (let i = 0; i < n; i++) s += `<circle class="d-flocon-fenetre" cx="${entre(r, x1, x2).toFixed(0)}" cy="${entre(r, y1, y2).toFixed(0)}" r="${entre(r, 1, 2.4).toFixed(1)}" fill="#fff" style="animation-delay:${entre(r, 0, 3).toFixed(1)}s"/>`; return s; };
  const etoilesCiel = (r, x1, x2, y1, y2, n) => { let s = ''; for (let i = 0; i < n; i++) s += `<circle class="d-etoile" cx="${entre(r, x1, x2).toFixed(0)}" cy="${entre(r, y1, y2).toFixed(0)}" r="${entre(r, .6, 1.4).toFixed(1)}" style="animation-delay:${entre(r, 0, 3).toFixed(1)}s"/>`; return s; };
  const emoji = (x, y, e, t = 28) => `<text x="${x}" y="${y}" font-size="${t}" text-anchor="middle">${e}</text>`;

  const E = {
    fenetre(cx, r, id) {
      return `<rect x="${cx - 68}" y="44" width="136" height="112" rx="6" fill="#5a3a1e"/>
        <rect x="${cx - 60}" y="52" width="120" height="96" fill="url(#nuit-${id})"/>${etoilesCiel(r, cx - 56, cx + 56, 56, 110, 10)}
        <circle cx="${cx + 34}" cy="72" r="10" fill="#fffbe0"/><path d="M${cx - 60} 136 Q${cx - 20} 120 ${cx + 10} 132 T${cx + 60} 128 L${cx + 60} 148 L${cx - 60} 148Z" fill="#eef6ff"/>
        ${flocons(r, cx - 56, cx + 56, 56, 140, 12)}
        <rect x="${cx - 3}" y="52" width="6" height="96" fill="#5a3a1e"/><rect x="${cx - 60}" y="97" width="120" height="6" fill="#5a3a1e"/>
        <path d="M${cx - 76} 40 Q${cx - 52} 100 ${cx - 70} 162 L${cx - 84} 162 L${cx - 84} 40Z" fill="#b3202f"/><path d="M${cx + 76} 40 Q${cx + 52} 100 ${cx + 70} 162 L${cx + 84} 162 L${cx + 84} 40Z" fill="#b3202f"/>
        <rect x="${cx - 88}" y="36" width="176" height="7" rx="3" fill="#c9a35a"/><rect x="${cx - 74}" y="156" width="148" height="8" rx="2" fill="#f4f9ff"/>`;
    },
    lucarne(cx, r, id) {
      return `<circle cx="${cx}" cy="98" r="54" fill="#5a3a1e"/><circle cx="${cx}" cy="98" r="46" fill="url(#nuit-${id})"/>${etoilesCiel(r, cx - 36, cx + 36, 62, 120, 8)}
        <circle cx="${cx - 18}" cy="78" r="8" fill="#fffbe0"/>${flocons(r, cx - 38, cx + 38, 60, 136, 10)}
        <rect x="${cx - 3}" y="52" width="6" height="92" fill="#5a3a1e"/><rect x="${cx - 46}" y="95" width="92" height="6" fill="#5a3a1e"/>
        <path d="M${cx - 46} 120 Q${cx} 108 ${cx + 46} 120 L${cx + 40} 134 Q${cx} 142 ${cx - 40} 134Z" fill="#eef6ff"/>`;
    },
    tableau(cx) {
      return `<rect x="${cx - 62}" y="58" width="124" height="88" rx="3" fill="#c9a35a"/><rect x="${cx - 54}" y="66" width="108" height="72" fill="#27466e"/>
        <polygon points="${cx - 54},138 ${cx - 20},92 ${cx + 6},120 ${cx + 26},100 ${cx + 54},138" fill="#eef6ff"/>
        <polygon points="${cx + 30},138 ${cx + 38},116 ${cx + 46},138" fill="#1f7a4d"/><circle cx="${cx + 34}" cy="80" r="6" fill="#fffbe0"/>
        <line x1="${cx}" y1="58" x2="${cx}" y2="38" stroke="#8a6a3a" stroke-width="2"/><circle cx="${cx}" cy="36" r="3" fill="#c9a35a"/>`;
    },
    horloge(cx) {
      return `<rect x="${cx - 30}" y="38" width="60" height="150" rx="6" fill="#4a2a12"/><rect x="${cx - 24}" y="46" width="48" height="48" rx="24" fill="#f6ecd2"/>
        <line x1="${cx}" y1="70" x2="${cx}" y2="54" stroke="#222" stroke-width="2.5"/><line x1="${cx}" y1="70" x2="${cx + 12}" y2="74" stroke="#222" stroke-width="2"/>
        <rect x="${cx - 18}" y="104" width="36" height="74" rx="4" fill="#2a170b"/>
        <g class="d-pendule" style="transform-origin:${cx}px 106px"><line x1="${cx}" y1="106" x2="${cx}" y2="160" stroke="#c9a35a" stroke-width="2"/><circle cx="${cx}" cy="162" r="8" fill="#f5c542"/></g>
        <path d="M${cx - 34} 40 Q${cx} 22 ${cx + 34} 40" fill="#2a8a4a" stroke="#1d5a32" stroke-width="2"/><circle cx="${cx}" cy="30" r="5" fill="#d62839"/>`;
    },
    etageres(cx, r, id, contenu) {
      let s = `<rect x="${cx - 100}" y="40" width="200" height="148" rx="4" fill="#4a2a12"/><rect x="${cx - 92}" y="48" width="184" height="134" fill="#2a170b"/>`;
      [84, 128, 172].forEach(y => { s += `<rect x="${cx - 92}" y="${y}" width="184" height="7" fill="#6b3f1f"/>`; });
      if (!contenu || contenu === 'livres') {
        [84, 128, 172].forEach(y => {
          for (let x = cx - 88; x < cx + 84;) {
            const l = entre(r, 9, 16), hh = entre(r, 22, 34);
            s += `<rect x="${x.toFixed(0)}" y="${(y - hh).toFixed(0)}" width="${l.toFixed(0)}" height="${hh.toFixed(0)}" rx="1.5" fill="${['#8a1020', '#1f5aa0', '#1f7a4d', '#c99410', '#6d2a73', '#a35a1a'][Math.floor(r() * 6)]}"/>`;
            x += l + 1.5;
          }
        });
      } else {
        const liste = Array.from(contenu.matchAll(/\p{Extended_Pictographic}️?/gu), m => m[0]);
        const items = liste.length ? liste : [contenu];
        [84, 128, 172].forEach((y, k) => { [-56, 0, 56].forEach((dx, i) => { s += emoji(cx + dx, y - 4, items[(k * 3 + i) % items.length], 30); }); });
      }
      return s;
    },
    casiers(cx) {
      let s = `<rect x="${cx - 96}" y="42" width="192" height="146" rx="4" fill="#5a3a1e"/>`;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const x = cx - 88 + j * 45, y = 50 + i * 34;
        s += `<rect x="${x}" y="${y}" width="40" height="29" fill="#2a170b"/>`;
        if ((i * 4 + j) % 3 !== 1) s += `<rect x="${x + 6}" y="${y + 10}" width="28" height="16" rx="1" fill="#f4f0e6" transform="rotate(${((i + j) % 3 - 1) * 4} ${x + 20} ${y + 18})"/><path d="M${x + 6} ${y + 10} l14 9 14 -9" stroke="#c9b37a" fill="none"/>`;
      }
      return s;
    },
    malles(cx) {
      const malle = (x, y, l, h, c) => `<rect x="${x}" y="${y}" width="${l}" height="${h}" rx="6" fill="${c}"/><path d="M${x} ${y + 12} Q${x + l / 2} ${y - 14} ${x + l} ${y + 12}" fill="${teinte(c, 0.1)}"/><rect x="${x + 14}" y="${y - 2}" width="8" height="${h + 2}" fill="#c9a35a"/><rect x="${x + l - 22}" y="${y - 2}" width="8" height="${h + 2}" fill="#c9a35a"/><rect x="${x + l / 2 - 8}" y="${y + 14}" width="16" height="14" rx="2" fill="#f5c542"/>`;
      return malle(cx - 95, 128, 120, 60, '#6b2a1a') + malle(cx + 5, 140, 90, 48, '#2a4a6b') + malle(cx - 70, 88, 90, 42, '#3a5a2a') + `<path d="M${cx - 25} 88 l0 42 M${cx - 70} 108 l90 0" stroke="#d62839" stroke-width="5"/><circle cx="${cx - 25}" cy="106" r="7" fill="#d62839"/>`;
    },
    caisses(cx) {
      const caisse = (x, y, t) => `<rect x="${x}" y="${y}" width="${t}" height="${t}" fill="#a0702f"/><rect x="${x + 4}" y="${y + 4}" width="${t - 8}" height="${t - 8}" fill="none" stroke="#6b4a1f" stroke-width="4"/><line x1="${x + 4}" y1="${y + 4}" x2="${x + t - 4}" y2="${y + t - 4}" stroke="#6b4a1f" stroke-width="5"/><text x="${x + t / 2}" y="${y + t / 2 + 5}" font-size="13" font-weight="700" text-anchor="middle" fill="#3a2508" font-family="monospace">P.N.</text>`;
      return caisse(cx - 100, 118, 70) + caisse(cx - 28, 118, 70) + caisse(cx - 64, 50, 68) + caisse(cx + 46, 138, 50) + `<path d="M${cx - 64} 84 l68 0" stroke="#d62839" stroke-width="5"/>`;
    },
    panneau(cx) {
      let s = `<rect x="${cx - 80}" y="44" width="160" height="124" rx="8" fill="#7d8794" stroke="#4a5260" stroke-width="4"/><rect x="${cx - 70}" y="54" width="140" height="104" rx="4" fill="#2b3440"/>`;
      ['A', 'B', 'C', 'D'].forEach((l, i) => {
        const x = cx - 52 + i * 35;
        s += `<rect x="${x - 9}" y="96" width="18" height="46" rx="4" fill="#1a2028"/><rect class="d-levier" x="${x - 6}" y="${i % 2 ? 99 : 118}" width="12" height="20" rx="3" fill="${i % 2 ? '#9aa8b8' : '#51e08a'}"/><text x="${x}" y="156" font-size="12" text-anchor="middle" fill="#cfd8e3" font-family="monospace">${l}</text>`;
      });
      s += `<text class="d-etoile-circuit" x="${cx}" y="86" font-size="28" text-anchor="middle" fill="#f5c542">★</text>`;
      s += `<path d="M${cx + 80} 80 C${cx + 120} 80 ${cx + 110} 30 ${cx + 150} 24" stroke="#d62839" stroke-width="4" fill="none"/><path d="M${cx - 80} 120 C${cx - 120} 120 ${cx - 110} 180 ${cx - 150} 186" stroke="#2e86de" stroke-width="4" fill="none"/>`;
      return s;
    },
    portail(cx) {
      let s = `<rect x="${cx - 130}" y="34" width="260" height="154" fill="#3a2a1e"/>`;
      for (let y = 40; y < 120; y += 14) s += `<rect x="${cx - 124}" y="${y}" width="248" height="11" fill="#6b4a2f"/>`;
      s += `<rect x="${cx - 124}" y="124" width="248" height="64" fill="#0d2240"/><path d="M${cx - 124} 172 Q${cx} 160 ${cx + 124} 172 L${cx + 124} 188 L${cx - 124} 188Z" fill="#eef6ff"/>`;
      s += `<text x="${cx + 8}" y="200" font-size="92" text-anchor="middle">🛷</text><text x="${cx - 96}" y="196" font-size="42" text-anchor="middle">🎁</text>`;
      return s;
    },
    carte(cx, r) {
      let s = `<rect x="${cx - 104}" y="46" width="208" height="128" rx="4" fill="#f0e2bd" stroke="#8a6a3a" stroke-width="3"/>`;
      s += `<path d="M${cx - 90} 150 C${cx - 60} 90 ${cx - 20} 150 ${cx + 10} 100 S${cx + 60} 70 ${cx + 84} 70" stroke="#b3202f" stroke-width="3" stroke-dasharray="6 6" fill="none"/>`;
      s += `<path d="M${cx + 76} 62 l16 16 M${cx + 92} 62 l-16 16" stroke="#b3202f" stroke-width="4"/>`;
      s += `<polygon points="${cx - 60},120 ${cx - 40},84 ${cx - 20},120" fill="#a8c3a0"/><polygon points="${cx + 20},140 ${cx + 40},108 ${cx + 60},140" fill="#a8c3a0"/><circle cx="${cx - 90}" cy="150" r="5" fill="#1f5aa0"/>`;
      [[cx - 98, 52], [cx + 98, 52], [cx - 98, 168], [cx + 98, 168]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="4" fill="#d62839"/>`; });
      return s;
    },
    telescope(cx, r, id) {
      return `<circle cx="${cx}" cy="96" r="76" fill="#4a2a12"/><circle cx="${cx}" cy="96" r="68" fill="url(#nuit-${id})"/>${etoilesCiel(r, cx - 55, cx + 55, 40, 150, 22)}
        <circle cx="${cx + 30}" cy="68" r="16" fill="#fffbe0"/><circle cx="${cx + 36}" cy="64" r="14" fill="#0d2240" opacity=".35"/>
        <rect x="${cx - 70}" y="92" width="140" height="7" fill="#4a2a12"/><rect x="${cx - 3}" y="28" width="6" height="136" fill="#4a2a12"/>
        <g transform="rotate(-28 ${cx - 40} 150)"><rect x="${cx - 70}" y="140" width="110" height="20" rx="6" fill="#c9a35a"/><rect x="${cx + 34}" y="136" width="18" height="28" rx="4" fill="#8a6a3a"/></g>
        <line x1="${cx - 30}" y1="160" x2="${cx - 60}" y2="${BAS}" stroke="#3a2508" stroke-width="5"/><line x1="${cx - 30}" y1="160" x2="${cx}" y2="${BAS}" stroke="#3a2508" stroke-width="5"/><line x1="${cx - 30}" y1="160" x2="${cx - 30}" y2="${BAS}" stroke="#3a2508" stroke-width="4"/>`;
    },
    glace(cx, r) {
      let s = '';
      [[cx - 90, 128, 80, 60], [cx - 6, 140, 90, 48], [cx - 60, 72, 86, 56]].forEach(([x, y, l, hh]) => {
        s += `<rect x="${x}" y="${y}" width="${l}" height="${hh}" rx="6" fill="#d6f1ff" stroke="#ffffff" stroke-width="2" opacity=".9"/><path d="M${x + 8} ${y + 10} l${l * 0.4} 0" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
      });
      return s + `<text x="${cx + 60}" y="120" font-size="30" text-anchor="middle">🐧</text>`;
    },
    flocon(cx) {
      let s = `<g class="d-flocon-geant" style="transform-origin:${cx}px 100px"><circle cx="${cx}" cy="100" r="66" fill="#ffffff" opacity=".12"/>`;
      for (let k = 0; k < 6; k++) {
        const a = k * 60;
        s += `<g transform="rotate(${a} ${cx} 100)"><line x1="${cx}" y1="100" x2="${cx}" y2="38" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/><path d="M${cx - 16} 58 L${cx} 70 L${cx + 16} 58 M${cx - 12} 80 L${cx} 88 L${cx + 12} 80" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
      }
      return s + `</g><rect x="${cx - 40}" y="170" width="80" height="18" rx="4" fill="#a8dcf5"/>`;
    },
    four(cx) {
      let s = `<rect x="${cx - 110}" y="30" width="220" height="30" rx="4" fill="#7a4a25"/><polygon points="${cx - 80},60 ${cx + 80},60 ${cx + 110},88 ${cx - 110},88" fill="#8a5a30"/>`;
      s += `<rect x="${cx - 100}" y="88" width="200" height="100" fill="#9b3d24"/>`;
      for (let y = 92; y < 188; y += 16) for (let x = cx - 100 + ((y / 16) % 2) * 20; x < cx + 100; x += 40) s += `<rect x="${x}" y="${y}" width="36" height="12" fill="#b4502e" opacity=".7"/>`;
      s += `<path d="M${cx - 60} 188 L${cx - 60} 140 Q${cx} 96 ${cx + 60} 140 L${cx + 60} 188Z" fill="#1a0d06"/>`;
      s += `<g class="d-flamme"><path d="M${cx - 40} 188 Q${cx - 30} 150 ${cx - 14} 168 Q${cx} 136 ${cx + 14} 166 Q${cx + 30} 148 ${cx + 40} 188Z" fill="#ff8a1a"/><path d="M${cx - 22} 188 Q${cx - 10} 162 ${cx} 172 Q${cx + 10} 158 ${cx + 22} 188Z" fill="#ffd23f"/></g>`;
      s += `<circle cx="${cx - 82}" cy="76" r="0"/>${emoji(cx - 70, 80, '🍳', 24)}${emoji(cx + 70, 80, '🫕', 24)}`;
      return s;
    },
    photos(cx) {
      let s = `<path d="M${cx - 110} 60 Q${cx} 84 ${cx + 110} 60" stroke="#c9b37a" stroke-width="2" fill="none"/>`;
      [['#4a8fd6', -80, 66], ['#d64a6a', -28, 76], ['#4ad68a', 24, 76], ['#d6b04a', 76, 66]].forEach(([c, dx, y], i) => {
        s += `<g transform="rotate(${(i % 2 ? 6 : -6)} ${cx + dx} ${y})"><rect x="${cx + dx - 22}" y="${y}" width="44" height="52" fill="#fff"/><rect x="${cx + dx - 18}" y="${y + 4}" width="36" height="34" fill="${c}"/><rect x="${cx + dx - 4}" y="${y - 6}" width="8" height="12" fill="#8a6a3a"/></g>`;
      });
      return s;
    },
    studio(cx) {
      return `<path d="M${cx - 100} 30 L${cx + 100} 30 L${cx + 100} 160 Q${cx} 200 ${cx - 100} 160 Z" fill="#d9dde3"/>
        <line x1="${cx + 90}" y1="${BAS}" x2="${cx + 90}" y2="70" stroke="#222" stroke-width="4"/><polygon points="${cx + 70},62 ${cx + 110},62 ${cx + 100},84 ${cx + 80},84" fill="#333"/>
        <polygon class="d-spot" points="${cx + 80},84 ${cx + 100},84 ${cx + 20},${BAS} ${cx - 60},${BAS}" fill="#fff6c8" opacity=".22"/>
        ${emoji(cx - 10, 150, '🧸', 46)}<line x1="${cx - 90}" y1="${BAS}" x2="${cx - 78}" y2="120" stroke="#222" stroke-width="3"/><line x1="${cx - 66}" y1="${BAS}" x2="${cx - 78}" y2="120" stroke="#222" stroke-width="3"/>${emoji(cx - 78, 124, '📷', 30)}`;
    },
    vitrine(cx) {
      return `<rect x="${cx - 110}" y="40" width="220" height="148" rx="6" fill="#5a3a1e"/><rect x="${cx - 100}" y="50" width="200" height="128" fill="#bfe4f7" opacity=".35"/>
        <rect x="${cx - 100}" y="114" width="200" height="6" fill="#5a3a1e"/>${emoji(cx - 60, 108, '🧸', 34)}${emoji(cx, 108, '🚂', 34)}${emoji(cx + 60, 108, '🎎', 34)}${emoji(cx - 50, 170, '🎁', 30)}${emoji(cx + 50, 170, '🪀', 30)}
        <path d="M${cx - 96} 54 l40 0 -60 60" fill="#fff" opacity=".25"/><path d="M${cx - 110} 44 Q${cx} 70 ${cx + 110} 44" stroke="#1d5a32" stroke-width="5" fill="none"/>`;
    },
    ecran(cx, r) {
      let s = `<rect x="${cx - 86}" y="46" width="172" height="110" rx="8" fill="#1a1f26" stroke="#3a4250" stroke-width="4"/><rect x="${cx - 76}" y="56" width="152" height="90" rx="3" fill="#03140a"/>`;
      for (let i = 0; i < 6; i++) s += `<rect x="${cx - 68}" y="${64 + i * 13}" width="${entre(r, 40, 130).toFixed(0)}" height="5" rx="2" fill="#3dff7a" opacity=".75"/>`;
      s += `<rect class="d-curseur" x="${cx - 68}" y="141" width="10" height="5" fill="#3dff7a"/><rect x="${cx - 12}" y="156" width="24" height="18" fill="#3a4250"/><rect x="${cx - 40}" y="172" width="80" height="6" rx="3" fill="#3a4250"/>`;
      return s;
    },
    convoyeur(cx) {
      let s = `<rect x="${cx - 140}" y="140" width="280" height="16" rx="8" fill="#2a2f36"/>`;
      for (let x = cx - 130; x <= cx + 130; x += 26) s += `<circle cx="${x}" cy="148" r="6" fill="#5b6470"/>`;
      s += `<g class="d-convoyeur">${[-120, -40, 40, 120].map(dx => `<rect x="${cx + dx - 22}" y="104" width="44" height="36" fill="#a0702f"/><rect x="${cx + dx - 4}" y="104" width="8" height="36" fill="#d6b04a"/>`).join('')}</g>`;
      s += `<rect x="${cx - 120}" y="156" width="10" height="32" fill="#3a4250"/><rect x="${cx + 110}" y="156" width="10" height="32" fill="#3a4250"/>`;
      return s;
    },
    serveurs(cx, r) {
      let s = '';
      [-52, 52].forEach(dx => {
        const x = cx + dx - 44;
        s += `<rect x="${x}" y="40" width="88" height="148" rx="4" fill="#0f1a2c" stroke="#2c4a6e" stroke-width="2"/>`;
        for (let y = 50; y < 180; y += 15) {
          s += `<rect x="${x + 6}" y="${y}" width="76" height="10" rx="2" fill="#16263f"/>`;
          for (let k = 0; k < 3; k++) s += `<circle class="d-led" cx="${x + 13 + k * 8}" cy="${y + 5}" r="2" fill="${r() > 0.5 ? '#3ddc84' : (r() > 0.5 ? '#ff5a5f' : '#4aa3ff')}" style="animation-delay:${entre(r, 0, 2).toFixed(2)}s"/>`;
        }
      });
      return s + `<path d="M${cx - 96} 44 Q${cx} 70 ${cx + 96} 44" stroke="#1d4d2b" stroke-width="4" fill="none"/>`;
    },
    pharmacie(cx) {
      return `<rect x="${cx - 70}" y="44" width="140" height="144" rx="6" fill="#f6f9fb" stroke="#b8c4cc" stroke-width="3"/><line x1="${cx}" y1="50" x2="${cx}" y2="182" stroke="#b8c4cc" stroke-width="2"/>
        <rect x="${cx - 12}" y="64" width="24" height="64" fill="#d62839"/><rect x="${cx - 32}" y="84" width="64" height="24" fill="#d62839"/>
        ${emoji(cx - 36, 170, '🩹', 22)}${emoji(cx, 170, '💊', 22)}${emoji(cx + 36, 170, '🧴', 22)}`;
    },
    coffre(cx) {
      let s = `<rect x="${cx - 90}" y="28" width="180" height="160" rx="10" fill="#5b6470" stroke="#3a4250" stroke-width="5"/><circle cx="${cx}" cy="104" r="62" fill="#7d8794" stroke="#3a4250" stroke-width="6"/>`;
      s += `<g class="d-volant" style="transform-origin:${cx}px 104px">`;
      for (let k = 0; k < 6; k++) s += `<line x1="${cx}" y1="104" x2="${(cx + 44 * Math.cos(k * Math.PI / 3)).toFixed(1)}" y2="${(104 + 44 * Math.sin(k * Math.PI / 3)).toFixed(1)}" stroke="#c9a35a" stroke-width="8" stroke-linecap="round"/>`;
      s += `<circle cx="${cx}" cy="104" r="14" fill="#c9a35a"/></g>`;
      [[-78, 40], [78, 40], [-78, 176], [78, 176]].forEach(([dx, y]) => { s += `<circle cx="${cx + dx}" cy="${y}" r="5" fill="#c9cfd6"/>`; });
      return s;
    },
    cheminee(cx, r) {
      let s = `<rect x="${cx - 112}" y="58" width="224" height="130" fill="#7d7066"/>`;
      for (let y = 62; y < 188; y += 18) for (let x = cx - 112 + ((y / 18) % 2) * 22; x < cx + 112; x += 44) s += `<rect x="${x}" y="${y}" width="40" height="14" rx="4" fill="#958778"/>`;
      s += `<rect x="${cx - 124}" y="50" width="248" height="16" rx="3" fill="#4a2a12"/>`;
      s += `<path d="M${cx - 64} 188 L${cx - 64} 128 Q${cx} 84 ${cx + 64} 128 L${cx + 64} 188Z" fill="#1a0d06"/>`;
      s += `<circle cx="${cx}" cy="170" r="60" fill="#ff9a2a" opacity=".18" class="d-lueur"/>`;
      s += `<g class="d-flamme"><path d="M${cx - 46} 186 Q${cx - 36} 140 ${cx - 16} 160 Q${cx} 116 ${cx + 16} 158 Q${cx + 36} 136 ${cx + 46} 186Z" fill="#ff7a1a"/><path d="M${cx - 26} 186 Q${cx - 12} 152 ${cx} 164 Q${cx + 12} 146 ${cx + 26} 186Z" fill="#ffd23f"/></g>`;
      s += `<rect x="${cx - 50}" y="178" width="100" height="10" rx="5" fill="#5a3418"/>`;
      s += `<path d="M${cx - 124} 54 Q${cx - 60} 78 ${cx} 54 T${cx + 124} 54" stroke="#1d5a32" stroke-width="7" fill="none"/>`;
      [-90, -40, 40, 90].forEach((dx, i) => { s += `<path d="M${cx + dx - 9} 66 l0 26 q0 10 12 10 l10 0 q6 0 6 -6 q0 -6 -6 -6 l-6 0 l0 -24z" fill="${i % 2 ? '#1f7a4d' : '#b3202f'}"/><rect x="${cx + dx - 10}" y="64" width="20" height="7" rx="2" fill="#fff"/>`; });
      s += `${emoji(cx - 100, 46, '🕯️', 18)}${emoji(cx + 100, 46, '🕯️', 18)}`;
      return s;
    },
    sapin(cx) {
      let s = '';
      [[30, 70, 40], [62, 120, 64], [100, 176, 90]].forEach(([haut, bas, demi]) => { s += `<polygon points="${cx},${haut} ${cx + demi},${bas} ${cx - demi},${bas}" fill="#1f7a4d" stroke="#145a34" stroke-width="2"/>`; });
      s += `<rect x="${cx - 10}" y="176" width="20" height="12" fill="#5a3418"/>`;
      [[-20, 62, '#d62839'], [18, 72, '#f5c542'], [-34, 108, '#2e86de'], [6, 100, '#e056fd'], [34, 114, '#d62839'], [-56, 160, '#f5c542'], [-18, 150, '#20bf6b'], [22, 158, '#2e86de'], [60, 164, '#e056fd']].forEach(([dx, y, c], i) => {
        s += `<circle class="d-ampoule" cx="${cx + dx}" cy="${y}" r="6" fill="${c}" style="animation-delay:${(i * 0.3).toFixed(1)}s"/>`;
      });
      s += `<text class="d-etoile-sapin" x="${cx}" y="38" font-size="34" text-anchor="middle" fill="#f5c542">★</text>`;
      s += `${emoji(cx - 70, 192, '🎁', 30)}${emoji(cx + 64, 192, '🎁', 30)}${emoji(cx - 30, 196, '🧸', 24)}`;
      return s;
    },
    robot(cx) {
      return `<rect x="${cx - 40}" y="56" width="80" height="60" rx="10" fill="#9aa8b8"/><circle class="d-led" cx="${cx - 18}" cy="84" r="8" fill="#4aa3ff"/><circle class="d-led" cx="${cx + 18}" cy="84" r="8" fill="#4aa3ff" style="animation-delay:.3s"/>
        <rect x="${cx - 14}" y="102" width="28" height="5" rx="2" fill="#3a4250"/><line x1="${cx}" y1="56" x2="${cx}" y2="34" stroke="#9aa8b8" stroke-width="4"/><circle class="d-balise" cx="${cx}" cy="30" r="6" fill="#ff5a5f"/>
        <rect x="${cx - 50}" y="120" width="100" height="68" rx="10" fill="#7d8794"/><circle cx="${cx}" cy="152" r="16" fill="#3a4250"/><path d="M${cx} 152 l10 -8" stroke="#f5c542" stroke-width="3"/>
        <rect x="${cx - 74}" y="126" width="20" height="48" rx="8" fill="#9aa8b8"/><rect x="${cx + 54}" y="126" width="20" height="48" rx="8" fill="#9aa8b8"/>
        <path d="M${cx - 44} 60 L${cx} 30 L${cx + 44} 60Z" fill="#d62839" opacity=".9"/><circle cx="${cx}" cy="28" r="7" fill="#fff"/>`;
    },
  };

  /* ---------- Meubles au premier plan ---------- */
  function meuble(type, objets) {
    if (!type) return '';
    const cfg = {
      etabli: { y: 186, l: 380, c: '#8a5a30', pieds: '#5a3418' },
      comptoir: { y: 176, l: 400, c: '#6b3f1f', pieds: null },
      bureau: { y: 188, l: 320, c: '#5a3418', pieds: '#3a2010' },
      table: { y: 190, l: 340, c: '#b3202f', pieds: '#5a3418' },
    }[type];
    const x = 450 - cfg.l / 2;
    let s = '';
    if (type === 'comptoir') s += `<rect x="${x}" y="${cfg.y}" width="${cfg.l}" height="${H - cfg.y}" fill="${cfg.c}"/><rect x="${x + 10}" y="${cfg.y + 14}" width="${cfg.l - 20}" height="${H - cfg.y - 14}" fill="${teinte(cfg.c, -0.2)}"/><path d="M${x} ${cfg.y + 30} Q${x + cfg.l / 2} ${cfg.y + 56} ${x + cfg.l} ${cfg.y + 30}" stroke="#1d5a32" stroke-width="6" fill="none"/>`;
    else {
      if (cfg.pieds) s += `<rect x="${x + 20}" y="${cfg.y}" width="14" height="${H - cfg.y}" fill="${cfg.pieds}"/><rect x="${x + cfg.l - 34}" y="${cfg.y}" width="14" height="${H - cfg.y}" fill="${cfg.pieds}"/>`;
      if (type === 'table') s += `<path d="M${x - 6} ${cfg.y} L${x + cfg.l + 6} ${cfg.y} L${x + cfg.l + 6} ${cfg.y + 26} ${Array.from({ length: 12 }, (_, i) => `Q${x + cfg.l + 6 - (i + 0.5) * (cfg.l + 12) / 12} ${cfg.y + 38} ${x + cfg.l + 6 - (i + 1) * (cfg.l + 12) / 12} ${cfg.y + 26}`).join(' ')} Z" fill="${cfg.c}"/><path d="M${x - 6} ${cfg.y + 20} L${x + cfg.l + 6} ${cfg.y + 20}" stroke="#fff" stroke-width="3" stroke-dasharray="8 8"/>`;
      if (type === 'bureau') s += `<rect x="${x + cfg.l - 110}" y="${cfg.y + 10}" width="90" height="${H - cfg.y - 10}" fill="${teinte(cfg.c, 0.1)}"/><rect x="${x + cfg.l - 76}" y="${cfg.y + 24}" width="22" height="5" rx="2" fill="#c9a35a"/>`;
    }
    s += `<rect x="${x - 8}" y="${cfg.y - 10}" width="${cfg.l + 16}" height="12" rx="3" fill="${type === 'table' ? '#f4f0e6' : teinte(cfg.c, 0.15)}"/>`;
    (objets || []).forEach((e, i, a) => { s += emoji(x + (cfg.l / (a.length + 1)) * (i + 1), cfg.y - 12, e, 34); });
    return s;
  }

  /* ---------- Plafond, lampes, guirlande ---------- */
  function plafond(r, motif) {
    let s = `<rect x="0" y="0" width="${W}" height="${PLAFOND}" fill="#2a170b"/><rect x="0" y="${PLAFOND}" width="${W}" height="4" fill="#000" opacity=".3"/>`;
    s += `<path d="M0 ${PLAFOND + 6} Q225 ${PLAFOND + 36} 450 ${PLAFOND + 6} T900 ${PLAFOND + 6}" stroke="#1d5a32" stroke-width="5" fill="none"/>`;
    for (let i = 0; i <= 18; i++) {
      const t = i / 18, x = t * W, y = PLAFOND + 6 + Math.abs(Math.sin(t * Math.PI * 2)) * 15;
      s += `<circle class="d-ampoule" cx="${x.toFixed(0)}" cy="${(y + 5).toFixed(0)}" r="4.5" fill="${['#ff5a5f', '#ffd23f', '#3ddc84', '#4aa3ff'][i % 4]}" style="animation-delay:${(i * 0.23).toFixed(2)}s"/>`;
    }
    const metal = motif === 'metal';
    [300, 600].forEach((x, i) => {
      if (metal) s += `<rect x="${x - 50}" y="${PLAFOND}" width="100" height="6" rx="3" fill="#cfe8ff" class="d-lampe" style="animation-delay:${i * 0.7}s"/><polygon points="${x - 50},${PLAFOND + 6} ${x + 50},${PLAFOND + 6} ${x + 110},${BAS} ${x - 110},${BAS}" fill="#cfe8ff" opacity=".06"/>`;
      else s += `<line x1="${x}" y1="${PLAFOND}" x2="${x}" y2="50" stroke="#222" stroke-width="2"/><path d="M${x - 16} 62 Q${x} 42 ${x + 16} 62 Z" fill="#2c3e50"/><circle class="d-lampe" cx="${x}" cy="65" r="6" fill="#fff1b8" style="animation-delay:${i * 0.7}s"/><polygon points="${x - 12},66 ${x + 12},66 ${x + 80},${BAS} ${x - 80},${BAS}" fill="#ffe9a0" opacity=".07"/>`;
    });
    return s;
  }

  function defs(id, piece) {
    return `<defs>${motifs(id, piece.mur)}
      <linearGradient id="nuit-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06122a"/><stop offset="1" stop-color="#1f4f85"/></linearGradient>
      <radialGradient id="vignette-${id}" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
    </defs>`;
  }

  /* Les calques d'une pièce, séparés : le fond (murs, sol, éléments), le plafond (guirlande, lampes)
     et la vignette. Les scènes des énigmes (public/js/scenes.js) glissent leur propre décor entre
     le fond et le plafond. el(type, cx, param) dessine un élément du décor où l'on veut. */
  function calques(piece, graine = 1) {
    const id = 'p' + (++compteur);
    const r = hasard(graine);
    const motif = piece.motif || 'bois';
    let fond = defs(id, piece);
    fond += `<rect width="${W}" height="${BAS}" fill="url(#m-${motif}-${id})"/>`;
    if (['rayures', 'papier', 'uni'].includes(motif)) fond += `<rect x="0" y="146" width="${W}" height="${BAS - 146}" fill="#4a2a12"/><rect x="0" y="146" width="${W}" height="5" fill="#6b3f1f"/>`;
    if (motif === 'glace') for (let x = 20; x < W; x += 46) fond += `<path d="M${x} ${PLAFOND} l8 ${entre(r, 18, 40).toFixed(0)} l8 -${entre(r, 18, 40).toFixed(0)}" fill="#e8fbff"/>`;
    fond += sol(piece.sol || 'parquet', id);
    const el = (type, cx, param) => (E[type] ? `<g class="el-${type}">${E[type](cx, r, id, param)}</g>` : '');
    (piece.elements || []).slice(0, 3).forEach((e, i) => {
      if (!e) return;
      const [type, param] = e.split(':');
      fond += el(type, 150 + i * 300, param);
    });
    return { id, fond, el, meuble: meuble(piece.meuble, piece.objets), plafond: plafond(r, motif), vignette: `<rect width="${W}" height="${H}" fill="url(#vignette-${id})"/>` };
  }

  function interieur(piece, graine = 1) {
    const c = calques(piece, graine);
    return svg(c.fond + c.meuble + c.plafond + c.vignette);
  }

  // Une pièce pas encore ouverte : porte fermée avec une couronne, dans la pénombre.
  function fermee(n) {
    const id = 'f' + (++compteur);
    const r = hasard(n * 7);
    const p = { mur: '#3a2414' };
    let s = defs(id, p) + `<rect width="${W}" height="${BAS}" fill="url(#m-bois-${id})"/>` + sol('parquet', id);
    s += E.fenetre(150, r, id) + `<rect x="0" y="0" width="${W}" height="${PLAFOND}" fill="#1a0d06"/>`;
    s += `<rect x="370" y="34" width="160" height="${BAS - 34}" rx="6" fill="#5a3418"/><rect x="382" y="46" width="136" height="${BAS - 46}" fill="#7a4a25"/>`;
    s += `<rect x="396" y="62" width="108" height="50" rx="4" fill="none" stroke="#5a3418" stroke-width="5"/><rect x="396" y="126" width="108" height="50" rx="4" fill="none" stroke="#5a3418" stroke-width="5"/>`;
    s += `<circle cx="450" cy="88" r="30" fill="none" stroke="#1f7a4d" stroke-width="12"/><circle cx="436" cy="72" r="3.5" fill="#d62839"/><circle cx="470" cy="94" r="3.5" fill="#f5c542"/><circle cx="440" cy="110" r="3.5" fill="#d62839"/><path d="M440 114 l10 -8 10 8 -4 14 -6 -10 -6 10z" fill="#d62839"/>`;
    s += `<circle cx="506" cy="140" r="6" fill="#f5c542"/><rect x="420" y="146" width="60" height="26" rx="4" fill="#f5c542"/><text x="450" y="166" font-size="18" font-weight="700" text-anchor="middle" fill="#3a2508" font-family="Georgia, serif">${n}</text>`;
    s += `<polygon points="530,${BAS} 560,${BAS} 545,${BAS + 4}" fill="#ffe9a0" opacity=".3"/><rect x="382" y="${BAS - 3}" width="136" height="3" fill="#ffd27a" opacity=".55"/>`;
    s += E.horloge(750) + `<rect width="${W}" height="${H}" fill="#020814" opacity=".45"/><rect width="${W}" height="${H}" fill="url(#vignette-${id})"/>`;
    return svg(s);
  }

  function toit() {
    let s = `<defs><pattern id="tuiles" width="40" height="22" patternUnits="userSpaceOnUse"><rect width="40" height="22" fill="#5a1f1a"/><path d="M0 22 Q10 8 20 22 Q30 8 40 22" fill="#7a2a22" stroke="#3a120e" stroke-width="2"/></pattern>
      <linearGradient id="neige-toit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfeaf7"/></linearGradient></defs>`;
    s += `<rect x="640" y="20" width="56" height="90" fill="#7d4a3a"/><rect x="632" y="12" width="72" height="16" rx="3" fill="#5a3428"/><path d="M630 14 Q668 0 706 14 L706 20 L630 20Z" fill="url(#neige-toit)"/>`;
    s += `<g class="d-fumee"><circle cx="668" cy="0" r="8"/><circle cx="674" cy="-14" r="11" style="animation-delay:.8s"/><circle cx="664" cy="-30" r="14" style="animation-delay:1.6s"/></g>`;
    s += `<polygon points="450,6 892,200 8,200" fill="url(#tuiles)" stroke="#3a120e" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<path d="M8 200 L450 6 L892 200 L872 204 Q840 196 820 214 Q800 196 770 206 L450 30 L130 206 Q100 196 80 214 Q60 196 28 204 Z" fill="url(#neige-toit)"/>`;
    for (let i = 0; i < 22; i++) { const x = 40 + i * 38; s += `<path d="M${x} 203 l5 ${10 + (i * 7) % 12} l5 -${10 + (i * 7) % 12}" fill="#e8fbff"/>`; }
    for (let i = 0; i <= 20; i++) {
      const t = i / 20, x = 8 + t * 884, y = 200 - (t < 0.5 ? t * 2 : (1 - t) * 2) * 194 + 10;
      s += `<circle class="d-ampoule" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" fill="${['#ff5a5f', '#ffd23f', '#3ddc84', '#4aa3ff'][i % 4]}" style="animation-delay:${(i * 0.21).toFixed(2)}s"/>`;
    }
    s += `<rect x="310" y="118" width="280" height="56" rx="8" fill="#6b3f1f" stroke="#3a2010" stroke-width="5"/><text x="450" y="154" font-size="25" text-anchor="middle" fill="#ffe7a3" font-family="Georgia, serif" font-weight="700">${t('Chalet du Père Noël')}</text>`;
    s += `<path d="M310 118 Q330 106 350 118 Q370 108 390 118 Q420 104 450 118 Q480 106 510 118 Q540 108 560 118 Q575 108 590 118" fill="#fff"/>`;
    s += `<circle cx="450" cy="72" r="26" fill="none" stroke="#1f7a4d" stroke-width="10"/><path d="M440 96 l10 -8 10 8 -4 14 -6 -10 -6 10z" fill="#d62839"/><circle cx="438" cy="58" r="3" fill="#d62839"/><circle cx="466" cy="76" r="3" fill="#f5c542"/>`;
    s += `<text class="d-etoile-sapin" x="450" y="8" font-size="34" text-anchor="middle" fill="#f5c542">★</text>`;
    return `<svg class="toit-svg" viewBox="0 -40 900 260" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${s}</svg>`;
  }

  // L'écran titre : le chalet, chaud et illuminé… et derrière lui, dans le brouillard, une ombre
  // immense qu'on devine à peine. Rien ne dit encore ce que c'est (on ne parle pas de Kryos avant la lettre).
  function chaletTitre() {
    return ombreTitre() + chaletGele({ gele: false });
  }

  // L'ombre : l'illustration de Kryos (public/media/kryos-ombre.webp, tirée de Media/asset), détourée
  // en fondu et les yeux éteints. Elle sort très lentement du brouillard, des bancs de brume passent
  // devant elle, et de temps en temps deux lueurs rouges s'allument là où seraient ses yeux.
  // Tout est en calques (image, brumes, yeux) : seuls transform et opacity bougent.
  function ombreTitre() {
    return `<div class="ombre-titre" aria-hidden="true">
      <div class="ombre-voile"></div>
      <img class="ombre-image" src="media/kryos-ombre.webp" alt="" draggable="false" decoding="async">
      <div class="ombre-yeux"><i></i><i></i></div>
      <div class="ombre-brume b1"></div><div class="ombre-brume b2"></div><div class="ombre-brume b3"></div>
    </div>`;
  }

  // Le chalet vu de face : la glace avance depuis la gauche (fenêtres gelées, guirlande éteinte,
  // stalactites, une Kère qui guette), le côté droit résiste encore (fenêtres chaudes, cheminée).
  // gele: false → le chalet d'avant l'attaque : toutes les fenêtres allumées, la guirlande et l'étoile aussi.
  function chaletGele({ gele = true } = {}) {
    const r = hasard(42);
    const FRONT = [[268, 0], [276, 46], [262, 70], [282, 96], [266, 124], [288, 150], [270, 178], [292, 206], [274, 234], [296, 262], [278, 290], [298, 318], [280, 346], [296, 374], [282, 402], [290, 420]];
    const front = FRONT.map(p => p.join(',')).join(' ');
    let s = `<defs>
      <pattern id="rondins" width="40" height="22" patternUnits="userSpaceOnUse"><rect width="40" height="22" fill="#6b3f1f"/><rect y="18" width="40" height="4" fill="#4a2a12"/><rect y="2" width="40" height="3" fill="#8a5a30" opacity=".5"/></pattern>
      <pattern id="tuiles-t" width="34" height="20" patternUnits="userSpaceOnUse"><rect width="34" height="20" fill="#5a1f1a"/><path d="M0 20 Q8.5 7 17 20 Q25.5 7 34 20" fill="#7a2a22" stroke="#3a120e" stroke-width="2"/></pattern>
      <pattern id="cristaux" width="70" height="70" patternUnits="userSpaceOnUse"><g fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".6"><path d="M18 8v20M9.3 13l17.4 10M9.3 23l17.4-10"/><path d="M0 62q22-6 34-28M8 59l-2-6M8 59l6 0M18 54l-2-6M18 54l6-1M26 46l-1-6M26 46l6-1"/><path d="M52 38v12M46.8 41l10.4 6M46.8 47l10.4-6"/></g></pattern>
      <radialGradient id="lumiere-fenetre" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#fff2b0"/><stop offset=".6" stop-color="#ffc35a"/><stop offset="1" stop-color="#e07a1a"/></radialGradient>
      <radialGradient id="vitre-gelee" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#2f6497"/><stop offset=".7" stop-color="#173a63"/><stop offset="1" stop-color="#0c2140"/></radialGradient>
      <linearGradient id="glace-degrade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef9ff" stop-opacity=".82"/><stop offset=".5" stop-color="#a9dcff" stop-opacity=".62"/><stop offset="1" stop-color="#6fb3e6" stop-opacity=".5"/></linearGradient>
      <radialGradient id="halo-chalet" cx=".62" cy=".6" r=".5"><stop offset="0" stop-color="#ffcf70" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf70" stop-opacity="0"/></radialGradient>
      <radialGradient id="halo-glace" cx=".3" cy=".6" r=".5"><stop offset="0" stop-color="#8fd0ff" stop-opacity=".3"/><stop offset="1" stop-color="#8fd0ff" stop-opacity="0"/></radialGradient>
      <radialGradient id="halo-etoile" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient>
      <clipPath id="moitie-gelee"><polygon points="0,0 ${front} 0,420"/></clipPath>
      <clipPath id="silhouette-chalet"><polygon points="300,42 486,204 114,204"/><rect x="144" y="186" width="312" height="198"/></clipPath>
    </defs>`;
    s += `<ellipse cx="300" cy="300" rx="300" ry="170" fill="url(#halo-chalet)"/>` + (gele ? `<ellipse cx="300" cy="300" rx="300" ry="170" fill="url(#halo-glace)"/>` : '');
    // Sapins de chaque côté (ceux de gauche, givrés)
    [[60, 380, 150], [120, 392, 110], [540, 380, 160], [480, 394, 105]].forEach(([x, base, hh]) => {
      const givre = gele && x < 300;
      for (let k = 0; k < 3; k++) {
        const haut = base - hh + k * hh * 0.26, bas = base - hh * 0.45 + k * hh * 0.22, demi = hh * 0.42 * (0.55 + k * 0.25);
        s += `<polygon points="${x},${haut.toFixed(0)} ${(x + demi).toFixed(0)},${bas.toFixed(0)} ${(x - demi).toFixed(0)},${bas.toFixed(0)}" fill="${givre ? '#24566a' : '#0f4a2a'}"/><polyline points="${(x - demi * 0.6).toFixed(0)},${(bas - 4).toFixed(0)} ${x},${(bas + 2).toFixed(0)} ${(x + demi * 0.6).toFixed(0)},${(bas - 4).toFixed(0)}" fill="none" stroke="#eef6ff" stroke-width="${givre ? 4 : 3}" stroke-linecap="round"/>`;
      }
    });
    // Cheminée qui fume encore (côté chaud)
    s += `<rect x="378" y="70" width="40" height="80" fill="#7d4a3a"/><rect x="372" y="62" width="52" height="14" rx="3" fill="#5a3428"/><path d="M370 64 Q398 52 426 64 L426 70 L370 70Z" fill="#fff"/>`;
    s += `<g class="d-fumee"><circle cx="398" cy="50" r="8"/><circle cx="404" cy="36" r="11" style="animation-delay:.8s"/><circle cx="394" cy="18" r="14" style="animation-delay:1.6s"/></g>`;
    // Murs et toit
    s += `<rect x="150" y="190" width="300" height="190" fill="url(#rondins)"/><rect x="146" y="186" width="10" height="196" fill="#3a2010"/><rect x="444" y="186" width="10" height="196" fill="#3a2010"/>`;
    s += `<polygon points="300,52 476,200 124,200" fill="url(#tuiles-t)" stroke="#3a120e" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<path d="M118 202 L300 46 L482 202 L466 206 Q448 198 434 212 Q420 198 404 208 L300 72 L196 208 Q180 198 166 212 Q152 198 134 206Z" fill="#fff"/>`;
    // La glace qui recouvre la moitié gauche du chalet
    if (gele) s += `<g class="glace-chalet" clip-path="url(#moitie-gelee)"><g clip-path="url(#silhouette-chalet)"><rect x="100" y="40" width="400" height="350" fill="url(#glace-degrade)"/><rect x="100" y="40" width="400" height="350" fill="url(#cristaux)"/></g></g>`;
    // La guirlande : éteinte et givrée du côté de la glace
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, x = 124 + t * 352, y = 200 - (t < 0.5 ? t * 2 : (1 - t) * 2) * 148 + 8;
      s += gele && x < 272 ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4.5" fill="#7f9fbf" stroke="#dff4ff" stroke-width="1"/>`
        : `<circle class="d-ampoule" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4.5" fill="${['#ff5a5f', '#ffd23f', '#3ddc84', '#4aa3ff'][i % 4]}" style="animation-delay:${(i * 0.2).toFixed(1)}s"/>`;
    }
    // Lucarne du grenier
    s += `<circle cx="300" cy="140" r="26" fill="#3a2010"/><circle class="d-fenetre" cx="300" cy="140" r="20" fill="url(#lumiere-fenetre)"/><rect x="298" y="120" width="4" height="40" fill="#3a2010"/><rect x="280" y="138" width="40" height="4" fill="#3a2010"/>`;
    // Fenêtres : gelées à gauche (une Kère y guette), encore chaudes à droite
    const fenetre = (x, y, gelee, yeux) => {
      let f = `<rect x="${x - 4}" y="${y - 4}" width="64" height="58" rx="4" fill="#3a2010"/>`;
      if (gelee) {
        f += `<rect x="${x}" y="${y}" width="56" height="50" fill="url(#vitre-gelee)"/><rect x="${x}" y="${y}" width="56" height="50" fill="url(#cristaux)" opacity=".8"/>`;
        if (yeux) f += `<g class="d-yeux-kere"><ellipse cx="${x + 16}" cy="${y + 19}" rx="7" ry="5" fill="#7fe8ff" opacity=".28"/><ellipse cx="${x + 40}" cy="${y + 19}" rx="7" ry="5" fill="#7fe8ff" opacity=".28"/><ellipse cx="${x + 16}" cy="${y + 19}" rx="3.4" ry="1.7" fill="#c4f8ff" transform="rotate(16 ${x + 16} ${y + 19})"/><ellipse cx="${x + 40}" cy="${y + 19}" rx="3.4" ry="1.7" fill="#c4f8ff" transform="rotate(-16 ${x + 40} ${y + 19})"/></g>`;
      } else {
        f += `<rect class="d-fenetre" x="${x}" y="${y}" width="56" height="50" fill="url(#lumiere-fenetre)" style="animation-delay:${entre(r, 0, 5).toFixed(1)}s"/>`;
      }
      const rideau = gelee ? '#4a5f7a' : '#b3202f';
      f += `<rect x="${x + 26}" y="${y}" width="4" height="50" fill="#3a2010"/><rect x="${x}" y="${y + 23}" width="56" height="4" fill="#3a2010"/><path d="M${x - 6} ${y + 54} l68 0 l-4 8 l-60 0z" fill="#fff"/>`;
      f += `<path d="M${x} ${y} q14 18 0 50" fill="${rideau}" opacity=".85"/><path d="M${x + 56} ${y} q-14 18 0 50" fill="${rideau}" opacity=".85"/>`;
      if (gelee) for (let k = 0; k < 6; k++) f += `<path d="M${x - 2 + k * 11} ${y + 61} l5 0 l-2.5 ${6 + ((k * 5) % 7)}z" fill="#e3f6ff"/>`;
      return f;
    };
    s += fenetre(176, 220, gele, true) + fenetre(368, 220) + fenetre(176, 300, gele) + fenetre(368, 300);
    // Porte d'entrée avec couronne
    s += `<rect x="266" y="270" width="68" height="110" rx="8" fill="#3a2010"/><rect x="272" y="276" width="56" height="104" rx="5" fill="#8a1d1d"/><rect x="278" y="284" width="44" height="36" rx="3" fill="none" stroke="#5a1010" stroke-width="4"/><rect x="278" y="328" width="44" height="40" rx="3" fill="none" stroke="#5a1010" stroke-width="4"/>`;
    s += `<circle cx="300" cy="302" r="17" fill="none" stroke="#1f7a4d" stroke-width="7"/><path d="M293 316 l7 -6 7 6 -3 10 -4 -7 -4 7z" fill="#f5c542"/><circle cx="321" cy="332" r="4" fill="#f5c542"/>`;
    s += `<rect x="252" y="378" width="96" height="8" fill="#6b4a2f"/><polygon points="290,250 310,250 300,240" fill="#f5c542"/>`;
    // Stalactites sous le bord du toit, côté glace
    if (gele) for (let x = 128; x < 270; x += 8) s += `<path d="M${x - 3} 203 L${x + 3} 203 L${x} ${203 + 7 + ((x * 13) % 15)}Z" fill="#e6f7ff"/>`;
    // Le front de la glace, qui scintille
    if (gele) s += `<g class="front-glace" clip-path="url(#silhouette-chalet)"><polyline points="${front}" fill="none" stroke="#8fd8ff" stroke-width="7" opacity=".35" stroke-linejoin="round"/><polyline points="${front}" fill="none" stroke="#f4fcff" stroke-width="2.2" stroke-linejoin="round"/></g>`;
    if (gele) FRONT.forEach(([x, y], k) => {
      if (y > 90 && y < 390 && k % 2 === 1) s += `<path class="d-cristal" d="M${x} ${y - 7}L${x + 1.6} ${y - 1.6}L${x + 7} ${y}L${x + 1.6} ${y + 1.6}L${x} ${y + 7}L${x - 1.6} ${y + 1.6}L${x - 7} ${y}L${x - 1.6} ${y - 1.6}Z" fill="#fff" style="animation-delay:${(k * 0.37).toFixed(2)}s"/>`;
    });
    // L'étoile du sommet, éteinte (elle se rallume en or quand on survole « Commencer l'aventure »)
    const branches = Array.from({ length: 10 }, (_, k) => { const a = (-90 + k * 36) * Math.PI / 180, rr = k % 2 ? 7.2 : 17; return `${(300 + rr * Math.cos(a)).toFixed(1)},${(25 + rr * Math.sin(a)).toFixed(1)}`; }).join(' ');
    s += gele ? `<circle class="lueur-etoile" cx="300" cy="25" r="34" fill="url(#halo-etoile)"/><polygon class="etoile-titre" points="${branches}" fill="#4b5f7e" stroke="#b8d4ec" stroke-width="1.6" stroke-linejoin="round"/>`
      : `<circle class="lueur-etoile allumee" cx="300" cy="25" r="34" fill="url(#halo-etoile)"/><polygon class="etoile-titre allumee" points="${branches}" fill="#ffd54a" stroke="#fff3c4" stroke-width="1.6" stroke-linejoin="round"/>`;
    // Neige au sol et rayon de lumière sous la porte
    s += `<ellipse cx="300" cy="394" rx="296" ry="28" fill="#dfeaf7"/><ellipse cx="300" cy="392" rx="270" ry="22" fill="#f4f9ff"/><ellipse cx="300" cy="396" rx="150" ry="12" fill="#ffffff"/><path d="M272 384 L328 384 L352 404 L248 404Z" fill="#ffd27a" opacity=".3"/>`;
    for (let i = 0; i < 8; i++) s += `<circle class="d-etoile" cx="${entre(r, 20, 580).toFixed(0)}" cy="${entre(r, 10, 120).toFixed(0)}" r="${entre(r, 0.8, 1.8).toFixed(1)}"/>`;
    return `<svg class="chalet-titre${gele ? '' : ' chaud'}" viewBox="0 0 600 420" aria-hidden="true">${s}</svg>`;
  }

  global.PIECES = { interieur, calques, fermee, toit, chaletTitre, chaletGele };
})(window);
