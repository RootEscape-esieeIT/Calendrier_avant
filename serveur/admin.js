/* =========================================================
   Page de statistiques pour l'organisateur : /admin
   Protégée par un identifiant + mot de passe (fichier .env).
   ========================================================= */
'use strict';
const crypto = require('crypto');
const config = require('./config');
const stockage = require('./stockage');
const JOURS = require('./jours');

const egal = (a, b) => crypto.timingSafeEqual(crypto.createHash('sha256').update(String(a)).digest(), crypto.createHash('sha256').update(String(b)).digest());

function authentification(req, res, next) {
  if (!config.admin.motDePasse) return res.status(404).send('Page désactivée : définis ADMIN_MOT_DE_PASSE dans .env');
  const [type, valeur] = (req.headers.authorization || '').split(' ');
  if (type === 'Basic' && valeur) {
    const texte = Buffer.from(valeur, 'base64').toString('utf8');
    const i = texte.indexOf(':');
    if (i > 0 && egal(texte.slice(0, i), config.admin.utilisateur) && egal(texte.slice(i + 1), config.admin.motDePasse)) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="NOEL-OS organisateur", charset="UTF-8"');
  res.status(401).send('Authentification requise');
}

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const arrondi = (x) => (x == null ? '—' : x.toLocaleString('fr-FR', { maximumFractionDigits: 1 }));
const echapper = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function tableJoueurs(liste) {
  if (!liste.length) return '<p class="note">Aucun joueur inscrit pour l\'instant.</p>';
  const lignes = liste.slice(0, 500).map(j => `<tr>
    <td class="g"><b>${echapper(j.nom)}</b></td>
    <td><div class="barre"><span class="r" style="width:${(j.enigmes_resolues / 24) * 100}%"></span></div>${j.enigmes_resolues} / 24</td>
    <td>${j.fini === 'oui' ? '⭐ oui' : 'non'}</td>
    <td>${j.portes_ouvertes}</td>
    <td><small>${echapper(j.inscrit_le)}</small></td>
    <td><small>${echapper(j.derniere_visite)}</small></td></tr>`).join('');
  return `<table><tr><th>Nom</th><th>Énigmes résolues</th><th>Fini ?</th><th>Portes ouvertes</th><th>Inscrit le</th><th>Dernière visite</th></tr>${lignes}</table>
  ${liste.length > 500 ? `<p class="note">Seuls les 500 joueurs les plus récents sont affichés : l'export CSV les contient tous.</p>` : ''}`;
}

function page(s, joueurs) {
  const max = Math.max(1, ...s.jours.map(j => j.ouvertures));
  const lignes = JOURS.map(J => {
    const j = s.jours.find(x => x.jour === J.jour) || { ouvertures: 0, reussites: 0, tentativesMoy: null, indicesMoy: 0 };
    return `<tr>
      <td>${J.emoji} <b>${J.jour}</b></td><td class="g">${J.univers}<br><small>${J.concept}</small></td>
      <td>${j.ouvertures}</td><td>${j.reussites}</td>
      <td><div class="barre"><span class="o" style="width:${(j.ouvertures / max) * 100}%"></span><span class="r" style="width:${(j.reussites / max) * 100}%"></span></div>${pct(j.reussites, j.ouvertures)} %</td>
      <td>${arrondi(j.tentativesMoy)}</td><td>${arrondi(j.indicesMoy)}</td></tr>`;
  }).join('');
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="60"><title>NOËL-OS · Statistiques</title><link rel="icon" href="data:,">
<style>
body{font-family:"Segoe UI",system-ui,sans-serif;background:#0b1a2e;color:#eef3fa;margin:0;padding:1.5rem}
h1{font-family:Georgia,serif;margin:.2rem 0 1rem}h2{font-family:Georgia,serif;margin:2rem 0 .8rem}h2 small{color:#a9b8cc;font-size:1rem}.cartes{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}
.carte{background:#13304f;border:1px solid #2a4d75;border-radius:14px;padding:1rem 1.4rem;min-width:160px}
.carte b{display:block;font-size:2.2rem;color:#f5c542}table{border-collapse:collapse;width:100%;max-width:1100px;background:#10243f;border-radius:12px;overflow:hidden}
th,td{padding:.45rem .7rem;border-bottom:1px solid #1f3b5f;text-align:center}td.g{text-align:left}th{background:#163257}small{color:#a9b8cc}
.barre{display:inline-block;position:relative;width:120px;height:10px;background:#1f3b5f;border-radius:6px;margin-right:.5rem;vertical-align:middle}
.barre span{position:absolute;left:0;top:0;bottom:0;border-radius:6px}.o{background:#4aa3ff66}.r{background:#20bf6b}
p.note{color:#a9b8cc;font-size:.9rem}</style></head><body>
<h1>🎄 NOËL-OS · Statistiques</h1>
<div class="cartes">
<div class="carte"><b>${s.inscrits}</b>joueurs inscrits</div>
<div class="carte"><b>${s.joueurs}</b>ont ouvert au moins une porte</div>
<div class="carte"><b>${s.actifsAujourdhui}</b>actifs aujourd'hui</div>
<div class="carte"><b>${s.termines}</b>ont rallumé l'étoile ⭐</div>
</div>
<h2>👥 Les joueurs <small>(${joueurs.length})</small> · <a style="color:#f5c542;font-size:1rem" href="/admin/joueurs.csv">⬇️ Export CSV (Excel)</a></h2>
${tableJoueurs(joueurs)}
<h2>📅 Par jour</h2>
<table><tr><th>Jour</th><th>Univers</th><th>Ouvertures</th><th>Réussites</th><th>Taux de réussite</th><th>Essais moyens<br><small>pour réussir</small></th><th>Indices moyens</th></tr>${lignes}</table>
<p class="note">Stockage : ${stockage.nom} · Mise à jour automatique toutes les minutes · Données au format JSON : <a style="color:#f5c542" href="/admin/stats.json">/admin/stats.json</a></p>
</body></html>`;
}

// CSV lisible par Excel en français : séparateur « ; » et BOM UTF-8 pour les accents.
function csv(liste) {
  const cellule = (v) => {
    let t = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; // pas de formules Excel injectées par un nom de joueur
    return '"' + t.replace(/"/g, '""') + '"';
  };
  const entetes = ['nom', 'enigmes_resolues', 'fini', 'portes_ouvertes', 'inscrit_le', 'derniere_visite'];
  return '﻿' + [entetes.join(';'), ...liste.map(j => entetes.map(k => cellule(j[k])).join(';'))].join('\r\n');
}

function routes(app) {
  app.get('/admin', authentification, async (req, res) => {
    const [s, joueurs] = await Promise.all([stockage.statistiques(), stockage.listeJoueurs()]);
    res.type('html').send(page(s, joueurs));
  });
  app.get('/admin/stats.json', authentification, async (req, res) => { res.json(await stockage.statistiques()); });
  app.get('/admin/joueurs.csv', authentification, async (req, res) => {
    res.set('Content-Disposition', 'attachment; filename="noelos-joueurs.csv"');
    res.type('text/csv; charset=utf-8').send(csv(await stockage.listeJoueurs()));
  });
}

module.exports = { routes };
