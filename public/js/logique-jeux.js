/* =========================================================
   NOËL-OS — Les règles des mini-jeux « à tester »
   Ce fichier est chargé PAR LE NAVIGATEUR (pour faire jouer et
   tester librement) ET PAR LE SERVEUR (serveur/verification.js),
   qui rejoue tout pour décider si c'est gagné. Une seule source,
   donc jamais de désaccord entre les deux.
   ========================================================= */
(function (racine, fabrique) {
  if (typeof module === 'object' && module.exports) module.exports = fabrique();
  else racine.LOGIQUE = fabrique();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const sansAccents = (x) => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* ---------- Jour 5 : le circuit de l'alarme anti-Kère ----------
     A = porte ouverte, B = badge de lutin, C = fenêtre ouverte, D = il fait nuit.
     portes = [p1, p2, p3, p4] : p1 agit sur B (« fil » ou « NON »),
     p2 relie A et p1, p3 relie C et D, p4 relie p2 et p3 (« ET » ou « OU »). */
  const PORTES_POSSIBLES = [['fil', 'NON'], ['ET', 'OU'], ['ET', 'OU'], ['ET', 'OU']];
  function evaluerCircuit(portes, e) {
    const g = (op, a, b) => (op === 'ET' ? a && b : a || b);
    const s1 = portes[0] === 'NON' ? !e.B : !!e.B;
    const s2 = g(portes[1], !!e.A, s1);
    const s3 = g(portes[2], !!e.C, !!e.D);
    return { s1, s2, s3, s4: g(portes[3], s2, s3) };
  }
  // Les 16 situations possibles, dans l'ordre du tableau de tests (A est le chiffre de gauche)
  const situations = () => Array.from({ length: 16 }, (_, k) => ({ A: !!(k & 8), B: !!(k & 4), C: !!(k & 2), D: !!(k & 1) }));
  function circuitValide(portes) {
    return Array.isArray(portes) && portes.length === 4 && portes.every((p, i) => PORTES_POSSIBLES[i].includes(p));
  }
  // attendu : 16 booléens (la règle de l'alarme). Renvoie le nombre de situations où le circuit a raison.
  function testerCircuit(portes, attendu) {
    return situations().filter((e, k) => evaluerCircuit(portes, e).s4 === attendu[k]).length;
  }

  /* ---------- Jour 9 : le robot-lutin de la Glacière ----------
     Un mini-langage, en français ou en anglais :
       avancer [n] · gauche · droite · répéter n … fin  (forward, left, right, repeat n … end) */
  function analyserProgramme(src) {
    const lignes = String(src || '').split(/\r?\n/);
    const prog = [];
    const pile = [{ corps: prog, ligne: -1 }];
    const cur = () => pile[pile.length - 1].corps;
    let compte = 0;
    for (let i = 0; i < lignes.length; i++) {
      const l = sansAccents(lignes[i]).toLowerCase().replace(/#.*$/, '').replace(/[:;.,!]+\s*$/, '').replace(/\s+/g, ' ').trim();
      if (!l) continue;
      compte++;
      let m;
      if ((m = l.match(/^(?:avancer|avance|forward|move|go)(?: de)?(?: (\d+))?(?: (?:fois|cases?|pas|times|steps?|squares?))?$/))) {
        const n = m[1] ? Number(m[1]) : 1;
        if (n < 1 || n > 20) return { erreur: { ligne: i, code: 'nombre' } };
        cur().push({ op: 'A', n, ligne: i });
      } else if (/^(?:tourner |tourne |turn )?(?:a |to the |to )?(?:gauche|left)$/.test(l)) cur().push({ op: 'G', ligne: i });
      else if (/^(?:tourner |tourne |turn )?(?:a |to the |to )?(?:droite|right)$/.test(l)) cur().push({ op: 'D', ligne: i });
      else if ((m = l.match(/^(?:repeter|repete|repeat)(?: (\d+))?(?: (?:fois|times))?$/))) {
        if (!m[1]) return { erreur: { ligne: i, code: 'repeter_nombre' } };
        const n = Number(m[1]);
        if (n < 1 || n > 20) return { erreur: { ligne: i, code: 'nombre' } };
        const bloc = { op: 'R', n, corps: [], ligne: i };
        cur().push(bloc);
        pile.push(bloc);
      } else if (/^(?:fin|end)(?: (?:repeter|repeat|de la boucle|boucle|du bloc|loop))?$/.test(l)) {
        if (pile.length === 1) return { erreur: { ligne: i, code: 'fin_seule' } };
        pile.pop();
      } else return { erreur: { ligne: i, code: 'inconnu', texte: lignes[i].trim() } };
    }
    if (pile.length > 1) return { erreur: { ligne: pile[pile.length - 1].ligne, code: 'fin_manquante' } };
    return { prog, lignes: compte };
  }
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // est, sud, ouest, nord
  // grille : tableau de chaînes ; R = départ (tourné vers l'est), C = cadeau, S = traîneau, # = bloc de glace
  function executerProgramme(prog, grille) {
    let x = 0, y = 0, dir = 0;
    const cadeaux = new Set();
    grille.forEach((ligne, j) => [...ligne].forEach((c, i) => { if (c === 'R') { x = i; y = j; } if (c === 'C') cadeaux.add(i + ',' + j); }));
    const pris = new Set();
    const trace = [{ x, y, dir, ligne: -1, pris: 0 }];
    let crash = null, tropLong = false, pas = 0;
    const libre = (i, j) => j >= 0 && j < grille.length && i >= 0 && i < grille[j].length && grille[j][i] !== '#';
    function jouer(liste) {
      for (const ins of liste) {
        if (crash || tropLong) return;
        if (ins.op === 'R') { for (let k = 0; k < ins.n && !crash && !tropLong; k++) jouer(ins.corps); continue; }
        if (ins.op === 'G' || ins.op === 'D') {
          dir = (dir + (ins.op === 'G' ? 3 : 1)) % 4;
          trace.push({ x, y, dir, ligne: ins.ligne, pris: pris.size });
        } else {
          for (let k = 0; k < ins.n; k++) {
            const nx = x + DIRS[dir][0], ny = y + DIRS[dir][1];
            if (!libre(nx, ny)) { crash = { x: nx, y: ny, ligne: ins.ligne }; return; }
            x = nx; y = ny;
            if (cadeaux.has(x + ',' + y)) pris.add(x + ',' + y);
            trace.push({ x, y, dir, ligne: ins.ligne, pris: pris.size });
          }
        }
        if (++pas > 400) { tropLong = true; return; }
      }
    }
    jouer(prog);
    const surTraineau = grille[y] && grille[y][x] === 'S';
    return { trace, crash, tropLong, pris: pris.size, total: cadeaux.size, surTraineau, ok: !crash && !tropLong && pris.size === cadeaux.size && surTraineau };
  }

  /* ---------- Jour 11 : l'assiette (pile) et le passe-plat (file) ----------
     ops : P = la crêpe qui sort de la cuisine va sur l'assiette, F = dans le passe-plat,
           p = on sert le dessus de l'assiette, f = on sert la première crêpe du passe-plat. */
  function simulerCrepes(arrivee, ops) {
    let i = 0, servi = '';
    const pile = [], file = [];
    for (const o of ops) {
      if (o === 'P' || o === 'F') {
        if (i >= arrivee.length) return { erreur: true };
        (o === 'P' ? pile : file).push(arrivee[i++]);
      } else if (o === 'p') {
        if (!pile.length) return { erreur: true };
        servi += pile.pop();
      } else if (o === 'f') {
        if (!file.length) return { erreur: true };
        servi += file.shift();
      } else return { erreur: true };
    }
    return { servi, suivante: i, pile, file };
  }

  /* ---------- Jour 23 : le neurone du robot ----------
     Chaque critère rapporte « poids » points quand il est vrai ; le robot dit « adoré »
     quand le total atteint le seuil. */
  function predire(poids, seuil, valeurs) {
    let total = 0;
    for (const k of Object.keys(valeurs)) total += (Number(poids[k]) || 0) * (valeurs[k] ? 1 : 0);
    return { total, aime: total >= seuil };
  }

  return { sansAccents, PORTES_POSSIBLES, evaluerCircuit, situations, circuitValide, testerCircuit, analyserProgramme, executerProgramme, simulerCrepes, predire };
});
