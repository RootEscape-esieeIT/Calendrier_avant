/* =========================================================
   Comptes des joueurs : pseudo + mot de passe.
   - les mots de passe sont hachés avec scrypt (jamais stockés en clair) ;
   - la session est un cookie signé (HMAC) : impossible à fabriquer
     sans le secret du serveur.
   ========================================================= */
'use strict';
const crypto = require('crypto');
const config = require('./config');

/* ---------- Mots de passe ---------- */
const N = 16384, R = 8, P = 1, LONGUEUR = 64;

function hacher(motDePasse) {
  return new Promise((ok, ko) => {
    const sel = crypto.randomBytes(16);
    crypto.scrypt(motDePasse, sel, LONGUEUR, { N, r: R, p: P }, (err, cle) => {
      if (err) return ko(err);
      ok(`scrypt$${N}$${R}$${P}$${sel.toString('base64')}$${cle.toString('base64')}`);
    });
  });
}

function verifierMotDePasse(motDePasse, stocke) {
  return new Promise((ok) => {
    const morceaux = String(stocke || '').split('$');
    if (morceaux.length !== 6 || morceaux[0] !== 'scrypt') return ok(false);
    const [, n, r, p, sel, attendu] = morceaux;
    const cleAttendue = Buffer.from(attendu, 'base64');
    crypto.scrypt(motDePasse, Buffer.from(sel, 'base64'), cleAttendue.length, { N: +n, r: +r, p: +p }, (err, cle) => {
      ok(!err && crypto.timingSafeEqual(cle, cleAttendue));
    });
  });
}

// Faux hachage pour que « pseudo inconnu » prenne autant de temps que « mauvais mot de passe ».
let leurre = null;
const hachageLeurre = async () => (leurre = leurre || (await hacher('leurre-' + Math.random())));

/* ---------- Validation ---------- */
function nettoyerNom(nom) {
  if (typeof nom !== 'string') return null;
  const t = nom.normalize('NFC').replace(/[\u0000-\u001f\u007f<>"]/g, '').replace(/\s+/g, ' ').trim();
  return t.length >= 2 && t.length <= 40 ? t : null;
}

function erreurMotDePasse(mdp) {
  if (typeof mdp !== 'string' || [...mdp].length < 6) return 'mdpCourt';
  if (mdp.length > 200) return 'mdpLong';
  return null;
}

/* ---------- Session (cookie signé) ---------- */
const COOKIE = 'noelos_session';
const DUREE = 120 * 24 * 3600 * 1000;
const secret = config.secretSession || crypto.randomBytes(32).toString('hex');
const signer = (texte) => crypto.createHmac('sha256', secret).update(texte).digest('base64url');

function creerSession(res, req, joueurId) {
  const expire = Date.now() + DUREE;
  const valeur = `${joueurId}.${expire}.${signer(joueurId + '.' + expire)}`;
  res.cookie(COOKIE, valeur, { httpOnly: true, sameSite: 'lax', secure: req.secure, maxAge: DUREE, path: '/' });
}

function lireSession(req) {
  const brut = (req.headers.cookie || '').split(';').map(c => c.trim()).find(c => c.startsWith(COOKIE + '='));
  if (!brut) return null;
  const [id, expire, signature] = decodeURIComponent(brut.slice(COOKIE.length + 1)).split('.');
  if (!id || !expire || !signature || Number(expire) < Date.now()) return null;
  const attendu = Buffer.from(signer(id + '.' + expire));
  const recu = Buffer.from(signature);
  return attendu.length === recu.length && crypto.timingSafeEqual(attendu, recu) ? id : null;
}

function fermerSession(res) {
  res.clearCookie(COOKIE, { path: '/' });
}

module.exports = { hacher, verifierMotDePasse, hachageLeurre, nettoyerNom, erreurMotDePasse, creerSession, lireSession, fermerSession, secretAleatoire: !config.secretSession };
