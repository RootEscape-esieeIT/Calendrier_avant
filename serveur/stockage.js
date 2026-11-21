/* =========================================================
   Stockage des comptes et de la progression.
   - MySQL si MYSQL_HOTE est défini dans .env ;
   - sinon en mémoire (pratique pour tester, tout est perdu
     au redémarrage).
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('./config');

/* ---------- MySQL ---------- */
function creerMysql() {
  const mysql = require('mysql2/promise');
  const pool = mysql.createPool({ ...config.mysql, connectionLimit: 10, charset: 'utf8mb4', dateStrings: true });
  const q = async (sql, params) => (await pool.execute(sql, params))[0];

  return {
    nom: 'MySQL',
    async init() {
      const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
      for (const requete of sql.split(';').map(s => s.replace(/^\s*--.*$/gm, '').trim()).filter(Boolean)) await pool.query(requete);
    },

    // --- Comptes
    async creerJoueur(nom, hache) {
      const id = crypto.randomUUID();
      try {
        await q('INSERT INTO joueurs (id, nom, mot_de_passe) VALUES (?, ?, ?)', [id, nom, hache]);
        return id;
      } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') return null; // pseudo déjà pris
        throw e;
      }
    },
    async trouverParNom(nom) {
      const [l] = await q('SELECT id, nom, mot_de_passe FROM joueurs WHERE nom = ?', [nom]);
      return l || null;
    },
    async joueur(id) {
      const [l] = await q('SELECT id, nom FROM joueurs WHERE id = ?', [id]);
      return l || null;
    },
    async changerMotDePasse(nom, hache) {
      const r = await q('UPDATE joueurs SET mot_de_passe = ? WHERE nom = ?', [hache, nom]);
      return r.affectedRows === 1;
    },
    async toucher(id) {
      await q('UPDATE joueurs SET vu_le = CURRENT_TIMESTAMP WHERE id = ?', [id]);
    },

    // --- Progression
    async ouvrir(joueur, jour) {
      await q('INSERT IGNORE INTO progression (joueur_id, jour) VALUES (?, ?)', [joueur, jour]);
    },
    async progression(joueur) {
      const lignes = await q('SELECT jour, tentatives, indices, resolu_le FROM progression WHERE joueur_id = ?', [joueur]);
      return new Map(lignes.map(l => [l.jour, { tentatives: l.tentatives, indices: l.indices, resolu: !!l.resolu_le }]));
    },
    async tentative(joueur, jour) {
      await this.ouvrir(joueur, jour);
      await q('UPDATE progression SET tentatives = tentatives + 1 WHERE joueur_id = ? AND jour = ?', [joueur, jour]);
    },
    async indice(joueur, jour, max) {
      await this.ouvrir(joueur, jour);
      await q('UPDATE progression SET indices = LEAST(indices + 1, ?) WHERE joueur_id = ? AND jour = ?', [max, joueur, jour]);
      const [l] = await q('SELECT indices FROM progression WHERE joueur_id = ? AND jour = ?', [joueur, jour]);
      return l ? l.indices : 0;
    },
    async resoudre(joueur, jour) {
      await this.ouvrir(joueur, jour);
      const r = await q('UPDATE progression SET resolu_le = CURRENT_TIMESTAMP WHERE joueur_id = ? AND jour = ? AND resolu_le IS NULL', [joueur, jour]);
      return r.affectedRows === 1;
    },
    async reinitialiser(joueur) {
      await q('DELETE FROM progression WHERE joueur_id = ?', [joueur]);
    },

    // --- Statistiques
    async listeJoueurs() {
      const lignes = await q('SELECT * FROM vue_joueurs ORDER BY derniere_visite DESC');
      return lignes.map(l => ({ ...l, portes_ouvertes: Number(l.portes_ouvertes), enigmes_resolues: Number(l.enigmes_resolues) }));
    },
    async statistiques() {
      const [[inscrits], [joueurs], [termines], [aujourdhui], jours] = await Promise.all([
        q('SELECT COUNT(*) AS n FROM joueurs'),
        q('SELECT COUNT(DISTINCT joueur_id) AS n FROM progression'),
        q('SELECT COUNT(*) AS n FROM progression WHERE jour = 24 AND resolu_le IS NOT NULL'),
        q('SELECT COUNT(*) AS n FROM joueurs WHERE vu_le >= CURDATE()'),
        q(`SELECT jour, COUNT(*) AS ouvertures, COUNT(resolu_le) AS reussites,
                  AVG(CASE WHEN resolu_le IS NOT NULL THEN tentatives END) AS tentatives_moy,
                  AVG(indices) AS indices_moy
           FROM progression GROUP BY jour ORDER BY jour`),
      ]);
      return {
        inscrits: inscrits.n, joueurs: joueurs.n, termines: termines.n, actifsAujourdhui: aujourdhui.n,
        jours: jours.map(j => ({ jour: j.jour, ouvertures: j.ouvertures, reussites: j.reussites, tentativesMoy: j.tentatives_moy == null ? null : Number(j.tentatives_moy), indicesMoy: Number(j.indices_moy) })),
      };
    },
  };
}

/* ---------- Mémoire ---------- */
function creerMemoire() {
  const joueurs = new Map();      // id -> { id, nom, mot_de_passe, cree, vu }
  const prog = new Map();         // id -> Map(jour -> { tentatives, indices, resolu })
  // Même règle que MySQL (utf8mb4_unicode_ci) : « Léa » = « lea »
  const cle = (nom) => nom.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const parNom = (nom) => [...joueurs.values()].find(j => cle(j.nom) === cle(nom));
  const ligne = (j, n) => {
    if (!prog.has(j)) prog.set(j, new Map());
    const m = prog.get(j);
    if (!m.has(n)) m.set(n, { tentatives: 0, indices: 0, resolu: false });
    return m.get(n);
  };
  const texteDate = (t) => { const d = new Date(t); const p = (x) => String(x).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; };

  return {
    nom: 'mémoire (données perdues au redémarrage)',
    async init() {},
    async creerJoueur(nom, hache) {
      if (parNom(nom)) return null;
      const id = crypto.randomUUID();
      joueurs.set(id, { id, nom, mot_de_passe: hache, cree: Date.now(), vu: Date.now() });
      return id;
    },
    async trouverParNom(nom) { const j = parNom(nom); return j ? { id: j.id, nom: j.nom, mot_de_passe: j.mot_de_passe } : null; },
    async joueur(id) { const j = joueurs.get(id); return j ? { id: j.id, nom: j.nom } : null; },
    async changerMotDePasse(nom, hache) { const j = parNom(nom); if (!j) return false; j.mot_de_passe = hache; return true; },
    async toucher(id) { const j = joueurs.get(id); if (j) j.vu = Date.now(); },
    async ouvrir(j, n) { ligne(j, n); },
    async progression(j) { return new Map(prog.get(j) || []); },
    async tentative(j, n) { ligne(j, n).tentatives++; },
    async indice(j, n, max) { const l = ligne(j, n); l.indices = Math.min(l.indices + 1, max); return l.indices; },
    async resoudre(j, n) { const l = ligne(j, n); if (l.resolu) return false; l.resolu = true; return true; },
    async reinitialiser(j) { prog.delete(j); },
    async listeJoueurs() {
      return [...joueurs.values()]
        .sort((a, b) => b.vu - a.vu)
        .map(v => {
          const m = prog.get(v.id) || new Map();
          const lignes = [...m.values()];
          return {
            joueur: v.id, nom: v.nom, inscrit_le: texteDate(v.cree), derniere_visite: texteDate(v.vu),
            portes_ouvertes: lignes.length, enigmes_resolues: lignes.filter(l => l.resolu).length,
            fini: m.get(24) && m.get(24).resolu ? 'oui' : 'non',
          };
        });
    },
    async statistiques() {
      const debutJour = new Date(); debutJour.setHours(0, 0, 0, 0);
      const parJour = [];
      for (let n = 1; n <= 24; n++) {
        const lignes = [...prog.values()].map(m => m.get(n)).filter(Boolean);
        if (!lignes.length) continue;
        const ok = lignes.filter(l => l.resolu);
        parJour.push({
          jour: n, ouvertures: lignes.length, reussites: ok.length,
          tentativesMoy: ok.length ? ok.reduce((s, l) => s + l.tentatives, 0) / ok.length : null,
          indicesMoy: lignes.reduce((s, l) => s + l.indices, 0) / lignes.length,
        });
      }
      return {
        inscrits: joueurs.size,
        joueurs: [...prog.values()].filter(m => m.size).length,
        termines: [...prog.values()].filter(m => m.get(24) && m.get(24).resolu).length,
        actifsAujourdhui: [...joueurs.values()].filter(v => v.vu >= debutJour.getTime()).length,
        jours: parJour,
      };
    },
  };
}

module.exports = config.mysql ? creerMysql() : creerMemoire();
