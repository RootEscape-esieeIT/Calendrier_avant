/* =========================================================
   NOËL-OS — Serveur
   - sert le site (dossier public/) ;
   - n'envoie une énigme qu'à partir de sa date (heure du serveur) ;
   - vérifie les réponses ;
   - enregistre la progression (MySQL) pour les statistiques.
   ========================================================= */
'use strict';
const path = require('path');
const express = require('express');
const config = require('./config');
// Le contenu des 24 jours, dans chaque langue
const CONTENU = { fr: require('./jours'), en: require('./jours.en') };
const JOURS = CONTENU.fr;
const { langueDe, textes } = require('./textes');
const stockage = require('./stockage');
const { verifier, dichotomie } = require('./verification');
const { etatCalendaire, prochaineOuverture } = require('./dates');
const admin = require('./admin');
const comptes = require('./comptes');

const app = express();
app.disable('x-powered-by');
if (config.derriereProxy) app.set('trust proxy', 1);

/* ---------- En-têtes de sécurité ---------- */
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
    'X-Frame-Options': 'DENY',
  });
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '10m', index: 'index.html' }));
app.use('/api', express.json({ limit: '16kb' }));

/* ---------- Qui est connecté ? (cookie de session signé) ---------- */
app.use('/api', async (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Vary', 'X-Langue');
  req.langue = langueDe(req);
  req.jours = CONTENU[req.langue];
  req.t = textes(req);
  req.joueur = null;
  const id = comptes.lireSession(req);
  if (id) {
    const j = await stockage.joueur(id);
    if (j) { req.joueur = j.id; req.nomJoueur = j.nom; }
  }
  next();
});

/* ---------- Anti force brute (en mémoire) ---------- */
function limiteur(max, cle) {
  const compteurs = new Map();
  setInterval(() => compteurs.clear(), 60 * 1000).unref();
  return (req, res, next) => {
    const k = cle(req);
    const n = (compteurs.get(k) || 0) + 1;
    compteurs.set(k, n);
    if (n > max) return res.status(429).json({ ok: false, message: textes(req).trop });
    next();
  };
}
const limiteJoueur = limiteur(30, req => (req.joueur || req.ip) + '|' + req.params.n); // 30 essais / minute / énigme
const limiteIP = limiteur(600, req => req.ip);
const limiteConnexionIP = limiteur(20, req => req.ip);                       // 20 connexions / minute / IP
const limiteConnexionNom = limiteur(8, req => 'nom|' + String((req.body && req.body.nom) || '').toLowerCase().trim()); // 8 essais / minute / pseudo

/* ---------- Outils ---------- */
const jourValide = (n) => Number.isInteger(n) && n >= 1 && n <= 24;

function etatPourJoueur(n, prog) {
  const resolu = !!(prog.get(n) && prog.get(n).resolu);
  const cal = etatCalendaire(n);
  if (resolu && cal !== 'verrouille') return 'resolu';
  return cal;
}

function fragment(J) {
  if (!J.fragment) return null;
  const [position, binaire] = J.fragment;
  return { jour: J.jour, position, positionBinaire: position.toString(2).padStart(5, '0'), lettre: String.fromCharCode(parseInt(binaire, 2)) };
}

function resultat(J, jours) {
  const recap = '<div class="recap">' + jours.slice(0, 23).map(j => `<div><span>${j.emoji}</span> <b>J${j.jour}</b> ${j.concept}</div>`).join('') + '</div>';
  return { lecon: J.lecon.replace('{{RECAP}}', recap), apres: J.apresReussite || null, fragment: fragment(J) };
}

const PUBLIC = ['jour', 'univers', 'emoji', 'couleurs', 'concept', 'piece', 'particules', 'givrin', 'histoire', 'cours', 'enigme', 'widget', 'placeholder'];
function versionPublique(J) {
  const o = {};
  for (const k of PUBLIC) if (J[k] !== undefined) o[k] = J[k];
  o.champ = !!(J.reponses && !J.sansChamp);
  o.nbIndices = J.indices.length;
  return o;
}

// Charge le jour demandé et vérifie qu'il est accessible pour ce joueur.
async function chargerJour(req, res) {
  const n = Number(req.params.n);
  if (!jourValide(n)) { res.status(404).json({ erreur: 'introuvable' }); return null; }
  if (!req.joueur) { res.status(401).json({ erreur: 'connexion', message: req.t.connexion }); return null; }
  const prog = await stockage.progression(req.joueur);
  const etat = etatPourJoueur(n, prog);
  if (etat === 'verrouille') { res.status(403).json({ erreur: 'verrouille', message: req.t.verrouille(req.t.date(n)) }); return null; }
  if (etat === 'ferme') { res.status(403).json({ erreur: 'ferme', message: req.t.ferme }); return null; }
  return { n, J: req.jours[n - 1], prog, etat };
}

/* ---------- API ---------- */
app.get('/api/etat', async (req, res) => {
  let prog = new Map();
  if (req.joueur) {
    await stockage.toucher(req.joueur);
    prog = await stockage.progression(req.joueur);
  }
  const jours = req.jours.map(J => {
    const etat = etatPourJoueur(J.jour, prog);
    // Une pièce encore fermée reste un mystère : on n'envoie que son numéro.
    if (etat === 'verrouille') return { jour: J.jour, etat };
    return { jour: J.jour, etat, univers: J.univers, emoji: J.emoji, piece: J.piece, ...(etat === 'resolu' ? { concept: J.concept } : {}) };
  });
  res.json({
    connecte: !!req.joueur,
    nom: req.nomJoueur || null,
    annee: config.annee,
    modeTest: config.modeTest,
    rattrapage: config.rattrapage,
    prochaine: prochaineOuverture(),
    jours,
    langue: req.langue,
    // (la position d'un fragment pas encore gagné est connue : seule sa lettre reste cachée)
    fragments: req.jours.filter(J => J.fragment).map(J => (etatPourJoueur(J.jour, prog) === 'resolu' ? fragment(J) : { jour: J.jour, position: J.fragment[0] })),
  });
});

/* ---------- Comptes : inscription, connexion, déconnexion ---------- */
app.post('/api/inscription', limiteConnexionIP, async (req, res) => {
  const nom = comptes.nettoyerNom(req.body && req.body.nom);
  if (!nom) return res.status(400).json({ ok: false, message: req.t.pseudo });
  const erreur = comptes.erreurMotDePasse(req.body && req.body.motDePasse);
  if (erreur) return res.status(400).json({ ok: false, message: req.t[erreur] });
  const id = await stockage.creerJoueur(nom, await comptes.hacher(req.body.motDePasse));
  if (!id) return res.status(409).json({ ok: false, message: req.t.pris(nom) });
  comptes.creerSession(res, req, id);
  res.json({ ok: true, nom });
});

app.post('/api/connexion', limiteConnexionIP, limiteConnexionNom, async (req, res) => {
  const nom = comptes.nettoyerNom(req.body && req.body.nom);
  const mdp = req.body && req.body.motDePasse;
  const j = nom && typeof mdp === 'string' ? await stockage.trouverParNom(nom) : null;
  let bon = false;
  if (j) bon = await comptes.verifierMotDePasse(mdp, j.mot_de_passe);
  else await comptes.verifierMotDePasse('x', await comptes.hachageLeurre()); // même durée qu'un vrai essai
  if (!bon) return res.status(401).json({ ok: false, message: req.t.identifiants });
  comptes.creerSession(res, req, j.id);
  await stockage.toucher(j.id);
  res.json({ ok: true, nom: j.nom });
});

app.post('/api/deconnexion', (req, res) => {
  comptes.fermerSession(res);
  res.json({ ok: true });
});

app.get('/api/jours/:n', async (req, res) => {
  const c = await chargerJour(req, res);
  if (!c) return;
  await stockage.ouvrir(req.joueur, c.n);
  const p = c.prog.get(c.n) || { indices: 0, tentatives: 0 };
  res.json({
    ...versionPublique(c.J),
    indicesVus: c.J.indices.slice(0, p.indices),
    tentatives: p.tentatives || 0,
    resolu: c.etat === 'resolu',
    resultat: c.etat === 'resolu' ? resultat(c.J, req.jours) : null,
  });
});

app.post('/api/jours/:n/indice', limiteIP, limiteJoueur, async (req, res) => {
  const c = await chargerJour(req, res);
  if (!c) return;
  const vus = await stockage.indice(req.joueur, c.n, c.J.indices.length);
  res.json({ indices: c.J.indices.slice(0, vus) });
});

async function reussite(req, c, tentatives) {
  const premiereFois = await stockage.resoudre(req.joueur, c.n);
  return { ok: true, premiereFois, tentatives, resultat: resultat(c.J, req.jours) };
}

app.post('/api/jours/:n/reponse', limiteIP, limiteJoueur, async (req, res) => {
  const c = await chargerJour(req, res);
  if (!c) return;
  const tentatives = await stockage.tentative(req.joueur, c.n);
  const v = verifier(c.n, req.body && req.body.reponse, c.J, req.langue);
  if (!v.ok) return res.json({ ...v, ok: false, tentatives });
  res.json(await reussite(req, c, tentatives));
});

app.post('/api/jours/:n/action', limiteIP, limiteJoueur, async (req, res) => {
  const c = await chargerJour(req, res);
  if (!c) return;
  if (c.n !== 7) return res.status(404).json({ erreur: 'introuvable' });
  const r = dichotomie(req.joueur, req.body, req.langue);
  // Une partie (gagnée ou perdue) compte pour une tentative, pas chaque maison essayée
  const tentatives = r.gagne || r.perdu ? await stockage.tentative(req.joueur, c.n) : undefined;
  if (r.gagne) return res.json({ ...r, ...(await reussite(req, c, tentatives)) });
  res.json({ ...r, tentatives });
});

app.post('/api/reinitialiser', async (req, res) => {
  if (!config.modeTest || !req.joueur) return res.status(403).json({ erreur: 'interdit' });
  await stockage.reinitialiser(req.joueur);
  res.json({ ok: true });
});

admin.routes(app);

app.use('/api', (req, res) => res.status(404).json({ erreur: 'introuvable' }));
app.use((err, req, res, next) => {
  console.error('[erreur]', err);
  if (res.headersSent) return next(err);
  res.status(err.status && err.status < 500 ? err.status : 500).json({ ok: false, message: textes(req).hoquet });
});

/* ---------- Démarrage ---------- */
(async () => {
  await stockage.init();
  app.listen(config.port, () => {
    console.log(`🎄 NOËL-OS en ligne sur http://localhost:${config.port}`);
    console.log(`   Stockage : ${stockage.nom}`);
    console.log(`   Décembre ${config.annee}, fuseau ${config.fuseau}, rattrapage ${config.rattrapage ? 'oui' : 'non'}`);
    if (config.modeTest) console.log('   ⚠️  MODE_TEST actif : toutes les portes sont ouvertes !');
    if (!config.admin.motDePasse) console.log('   ℹ️  Page /admin désactivée (ADMIN_MOT_DE_PASSE vide).');
    if (comptes.secretAleatoire) console.log('   ⚠️  SECRET_SESSION vide : les joueurs seront déconnectés à chaque redémarrage.');
  });
})().catch((e) => { console.error('Impossible de démarrer :', e.message); process.exit(1); });
