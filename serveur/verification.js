/* =========================================================
   Vérification des réponses, entièrement côté serveur.
   Chaque fonction reçoit ce que le navigateur envoie et
   renvoie { ok: true } ou { ok: false, message?, ... }.
   ========================================================= */
'use strict';
const crypto = require('crypto');
// Les règles des mini-jeux « à tester » : le même fichier que celui du navigateur
const L = require('../public/js/logique-jeux');

function normaliser(texte) {
  return String(texte)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

const empreinte = (jour, texte) => crypto.createHash('sha256').update('noel-os|' + jour + '|' + normaliser(texte)).digest('hex');

const estObjet = (r) => r !== null && typeof r === 'object' && !Array.isArray(r);

/* ---------- Messages, en français et en anglais ---------- */
const M = {
  fr: {
    tropEchanges: '⛽ Trop d\'échanges : recommence !',
    trajet: (t) => `🦌 Arrivé en <b>${t} minutes</b>… Le Père Noël a calculé qu'il existe un trajet plus rapide. Recommence !`,
    message14: 'DÉCOLLAGE À MINUIT',
    paquets: '📭 Le message reconstitué ne veut rien dire… Convertis chaque numéro binaire (4 · 2 · 1) et clique sur les paquets dans l\'ordre : 1, 2, 3…',
    explications: [
      'Ligne 1 : la liste contient bien les 5 poids. Rien à signaler.',
      'Ligne 2 : la liste a 5 cases, numérotées de 0 à 4 : la boucle les parcourt toutes. Correct !',
      null,
      'Ligne 4 : on ajoute le poids de la case i au total. C\'est bien ce qu\'il faut faire… encore faut-il que le total ne soit pas effacé entre deux tours.',
      'Ligne 5 : « plus de 20 kg » s\'écrit bien « > 20 ». Correct.',
      'Ligne 6 : le message d\'alerte, seulement si c\'est trop lourd. Rien à redire.',
      'Ligne 7 : « sinon », c\'est-à-dire quand le traîneau n\'est pas trop lourd. Correct.',
      'Ligne 8 : on affiche le total. C\'est bien lui qu\'on veut voir.',
    ],
    mdpFaible: "💥 Ce mot de passe ne résisterait pas à l'ordinateur de glace.",
    pieges: [
      'Regarde bien : <code>pere-noeI</code> s\'écrit avec un <b>i majuscule</b> à la place du <b>L minuscule</b> ! C\'est un faux site au nom presque identique. Et l\'urgence (« dans 1 heure ») sert à t\'empêcher de réfléchir.',
      'Le vrai propriétaire d\'une adresse, c\'est la <b>fin du nom</b>, juste avant le premier « / » : ici, c\'est <code>verif-compte.com</code> ! Le début <code>pere-noel.noel</code> n\'est qu\'un déguisement.',
      null,
      'Un message calme et poli… mais regarde l\'adresse : <code>pere-noel-noel.com</code>, avec un <b>tiret</b> à la place du point ! C\'est un tout autre site, qui imite le vrai. Un faux message n\'est pas forcément urgent, ni plein de fautes.',
      'Trop beau pour être vrai ! L\'expéditeur utilise une messagerie gratuite, le lien mène à <code>pere-noel-cadeaux.com</code> (pas le vrai site), sans le « s » de https… et on te demande ta carte bancaire.',
    ],
    piege: '🎣 Raté, c\'était un faux ! Lis l\'explication sur le message, puis continue ton enquête.',
    vide: 'Écris une réponse avant de valider.',
    numero: (max) => `Choisis un numéro entre 1 et ${max.toLocaleString('fr-FR')}.`,
    circuit: (n) => `🔔 Ton alarme ne réagit comme la règle que dans <b>${n} situations sur 16</b>. Lance les tests et regarde les lignes en rouge !`,
    robotErreur: '🤖 Le robot ne comprend pas ton programme. Relance-le pour voir quelle ligne pose problème.',
    robotLong: (n, max) => `🤖 Ton programme fait ${n} lignes : la mémoire gelée du robot n'en accepte que ${max}.`,
    robotRate: '🤖 Le robot ne ramasse pas tous les cadeaux, ou ne finit pas sur le traîneau.',
    crepes: '🥞 Les invités ne lisent pas le bon mot… Recommence !',
    motifLong: 'Écris un motif (80 caractères au maximum).',
    motifInvalide: "⚠️ Ce motif n'est pas une expression régulière valide.",
    tri: (b, n) => `📦 Le robot a bien trié <b>${b} étiquettes sur ${n}</b>. Regarde celles qui sont en rouge !`,
    neuroneExemples: (n) => `🤖 Ton robot se trompe encore sur ${n} exemple(s). Règle-le pour qu'il ait tout juste avant de le tester.`,
    neuroneNouveaux: (n) => `🤖 Ton robot ne se trompe sur aucun exemple… mais il se trompe sur <b>${n} nouveau(x) jouet(s)</b> ! Il a appris par cœur au lieu de comprendre ce que les rennes aiment. Un des critères ne compte peut-être pas du tout…`,
  },
  en: {
    tropEchanges: '⛽ Too many swaps: start again!',
    trajet: (t) => `🦌 You arrived in <b>${t} minutes</b>… Santa worked out that there's a faster route. Try again!`,
    message14: 'SLEIGH AT MIDNIGHT',
    paquets: "📭 The rebuilt message doesn't make sense… Convert each binary number (4 · 2 · 1) and click the packets in order: 1, 2, 3…",
    explications: [
      'Line 1: the list does contain the 5 weights. Nothing wrong here.',
      'Line 2: the list has 5 boxes, numbered 0 to 4: the loop goes through all of them. Correct!',
      null,
      'Line 4: we add the weight in box i to the total. That\'s exactly what we need… as long as the total isn\'t wiped out between two rounds.',
      'Line 5: “more than 20 kg” is indeed written “> 20”. Correct.',
      'Line 6: the warning message, only if it\'s too heavy. Nothing to say.',
      'Line 7: “else”, meaning when the sleigh isn\'t too heavy. Correct.',
      'Line 8: we display the total. That\'s what we want to see.',
    ],
    mdpFaible: "💥 This password wouldn't stand up to the ice computer.",
    pieges: [
      'Look closely: <code>santa-cIaus</code> is written with a <b>capital i</b> instead of a <b>lowercase L</b>! It\'s a fake website with an almost identical name. And the urgency (“in 1 hour”) is there to stop you from thinking.',
      'A web address\'s real owner is the <b>end of the name</b>, just before the first “/”: here it\'s <code>account-check.com</code>! The beginning, <code>santa-claus.xmas</code>, is just a disguise.',
      null,
      'A calm, polite message… but look at the address: <code>santa-claus-xmas.com</code>, with a <b>hyphen</b> instead of the dot! It\'s a completely different website imitating the real one. A fake message isn\'t necessarily urgent, or full of mistakes.',
      'Too good to be true! The sender uses a free email service, the link leads to <code>santa-gifts.com</code> (not the real website), without the “s” of https… and you\'re asked for your credit card.',
    ],
    piege: '🎣 Wrong, that was a fake! Read the explanation on the message, then keep investigating.',
    vide: 'Type an answer before checking.',
    numero: (max) => `Pick a number between 1 and ${max.toLocaleString('en-US')}.`,
    circuit: (n) => `🔔 Your alarm only follows the rule in <b>${n} situations out of 16</b>. Run the tests and look at the red rows!`,
    robotErreur: "🤖 The robot doesn't understand your program. Run it again to see which line is the problem.",
    robotLong: (n, max) => `🤖 Your program has ${n} lines: the robot's frozen memory only accepts ${max}.`,
    robotRate: "🤖 The robot doesn't pick up all the presents, or doesn't end on the sleigh.",
    crepes: "🥞 The guests aren't reading the right word… Start again!",
    motifLong: 'Type a pattern (80 characters at most).',
    motifInvalide: "⚠️ This pattern isn't a valid regular expression.",
    tri: (b, n) => `📦 The robot sorted <b>${b} labels out of ${n}</b> correctly. Look at the red ones!`,
    neuroneExemples: (n) => `🤖 Your robot is still wrong about ${n} example(s). Adjust it until it gets everything right before testing it.`,
    neuroneNouveaux: (n) => `🤖 Your robot doesn't get a single example wrong… but it's wrong about <b>${n} new toy(s)</b>! It learned by heart instead of understanding what the reindeer like. Maybe one of the criteria doesn't matter at all…`,
  },
};

// Algorithme de Dijkstra : la durée du trajet le plus court entre deux lieux.
function plusCourt(aretes, depart, arrivee) {
  const dist = { [depart]: 0 };
  const faits = new Set();
  for (;;) {
    let u = null;
    for (const k of Object.keys(dist)) if (!faits.has(k) && (u === null || dist[k] < dist[u])) u = k;
    if (u === null || u === arrivee) return dist[arrivee];
    faits.add(u);
    for (const [a, b, w] of aretes) {
      const v = a === u ? b : b === u ? a : null;
      if (v !== null && !faits.has(v) && (dist[v] === undefined || dist[u] + w < dist[v])) dist[v] = dist[u] + w;
    }
  }
}

const MINI_JEUX = {
  // Guirlande binaire : les ampoules allumées doivent valoir 25 (le jour de Noël).
  1(r) {
    if (!estObjet(r) || !Array.isArray(r.bits) || r.bits.length !== 8) return { ok: false };
    return { ok: r.bits.reduce((s, b, i) => s + (b === true ? 128 >> i : 0), 0) === 25 };
  },

  // Alarme anti-Kère : le circuit doit réagir comme la règle dans les 16 situations.
  5(r, J, m) {
    const p = estObjet(r) ? r.portes : null;
    if (!L.circuitValide(p)) return { ok: false };
    const n = L.testerCircuit(p, J.widget.params[0].attendu);
    return n === 16 ? { ok: true } : { ok: false, message: m.circuit(n) };
  },

  // Robot-lutin : on relit le programme et on le rejoue sur la banquise.
  9(r, J, m) {
    const src = estObjet(r) ? r.programme : null;
    if (typeof src !== 'string' || src.length > 1000) return { ok: false };
    const cfg = J.widget.params[0];
    const a = L.analyserProgramme(src);
    if (a.erreur) return { ok: false, message: m.robotErreur };
    if (a.lignes > cfg.maxLignes) return { ok: false, message: m.robotLong(a.lignes, cfg.maxLignes) };
    return L.executerProgramme(a.prog, cfg.grille).ok ? { ok: true } : { ok: false, message: m.robotRate };
  },

  // Crêpes : on rejoue les gestes (assiette = pile, passe-plat = file).
  11(r, J, m) {
    const ops = estObjet(r) ? r.ops : null;
    if (typeof ops !== 'string' || ops.length > 40 || !/^[PFpf]*$/.test(ops)) return { ok: false };
    const cfg = J.widget.params[0];
    const x = L.simulerCrepes(cfg.arrivee, ops);
    return !x.erreur && x.servi === cfg.mot ? { ok: true } : { ok: false, message: m.crepes };
  },

  // Trieuse : le motif doit accepter toutes les vraies étiquettes et refuser toutes les fausses.
  // (Les étiquettes font 12 caractères au plus : même un motif mal écrit reste rapide à tester.)
  15(r, J, m) {
    const motif = estObjet(r) ? r.motif : null;
    if (typeof motif !== 'string' || !motif || motif.length > 80) return { ok: false, message: m.motifLong };
    let re;
    try { re = new RegExp(motif); } catch (e) { return { ok: false, message: m.motifInvalide }; }
    const { garder, jeter } = J.widget.params[0];
    const bons = garder.filter(x => re.test(x)).length + jeter.filter(x => !re.test(x)).length;
    const total = garder.length + jeter.length;
    return bons === total ? { ok: true } : { ok: false, message: m.tri(bons, total) };
  },

  // Tri : on rejoue les échanges sur le serveur.
  6(r, J, m) {
    const [objets, max] = J.widget.params;
    if (!estObjet(r) || !Array.isArray(r.echanges) || r.echanges.length > max) return { ok: false, message: m.tropEchanges };
    const poids = objets.map(o => o.poids);
    for (const i of r.echanges) {
      if (!Number.isInteger(i) || i < 0 || i >= poids.length - 1) return { ok: false };
      [poids[i], poids[i + 1]] = [poids[i + 1], poids[i]];
    }
    return { ok: poids.every((p, k) => k === 0 || poids[k - 1] <= p) };
  },

  // Plus court chemin : le trajet doit exister et durer le minimum possible (calculé par Dijkstra).
  8(r, J, m) {
    const [noeuds, aretes, depart, arrivee] = J.widget.params;
    const c = estObjet(r) ? r.chemin : null;
    if (!Array.isArray(c) || c.length < 2 || c.length > 10 || c[0] !== depart || c[c.length - 1] !== arrivee || new Set(c).size !== c.length) return { ok: false };
    let total = 0;
    for (let i = 1; i < c.length; i++) {
      const a = aretes.find(([x, y]) => (x === c[i - 1] && y === c[i]) || (y === c[i - 1] && x === c[i]));
      if (!a) return { ok: false };
      total += a[2];
    }
    if (total === plusCourt(aretes, depart, arrivee)) return { ok: true };
    return { ok: false, message: m.trajet(total) };
  },

  // Paquets réseau : l'ordre choisi doit reformer le message.
  14(r, J, m) {
    const paquets = J.widget.params[0];
    const o = estObjet(r) ? r.ordre : null;
    if (!Array.isArray(o) || o.length > paquets.length || new Set(o).size !== o.length || !o.every(i => Number.isInteger(i) && paquets[i])) return { ok: false };
    if (o.map(i => paquets[i].data).join('') === m.message14) return { ok: true };
    return { ok: false, message: m.paquets };
  },

  // Débogage : la ligne 3 (indice 2) contient le bug (le total remis à zéro à chaque tour).
  18(r, J, m) {
    const i = estObjet(r) ? r.ligne : -1;
    if (i === 2) return { ok: true };
    if (m.explications[i]) return { ok: false, type: 'info', message: '✅ ' + m.explications[i] };
    return { ok: false };
  },

  // Hameçonnage : seul le 3e message (indice 2, l'alerte de connexion) est authentique.
  21(r, J, m) {
    const i = estObjet(r) ? r.choix : -1;
    if (i === 2) return { ok: true };
    if (m.pieges[i]) return { ok: false, piege: m.pieges[i], message: m.piege };
    return { ok: false };
  },

  // Neurone : tout juste sur les exemples… ET sur les nouveaux jouets (la vérité reste sur le serveur).
  23(r, J, m) {
    if (!estObjet(r) || !estObjet(r.poids)) return { ok: false };
    const cfg = J.widget.params[0];
    const poids = {};
    for (const c of cfg.criteres) {
      const v = r.poids[c.k];
      if (!Number.isInteger(v) || v < -3 || v > 3) return { ok: false };
      poids[c.k] = v;
    }
    const seuil = r.seuil;
    if (!Number.isInteger(seuil) || seuil < -3 || seuil > 6) return { ok: false };
    const fautesExemples = cfg.exemples.filter(x => L.predire(poids, seuil, x.v).aime !== x.aime).length;
    if (fautesExemples) return { ok: false, message: m.neuroneExemples(fautesExemples) };
    const fautes = cfg.nouveaux.filter((x, i) => L.predire(poids, seuil, x.v).aime !== J.verite[i]).length;
    return fautes ? { ok: false, message: m.neuroneNouveaux(fautes) } : { ok: true };
  },
};

function verifier(n, reponse, J, langue = 'fr') {
  const m = M[langue] || M.fr;
  if (MINI_JEUX[n]) return MINI_JEUX[n](reponse, J, m);
  if (typeof reponse !== 'string' || reponse.length > 200 || !J.reponses) return { ok: false };
  if (!normaliser(reponse)) return { ok: false, type: 'info', message: m.vide };
  return { ok: J.reponses.includes(empreinte(n, reponse)) };
}

/* ---------- Jour 7 : la maison mystère est tirée par le serveur ---------- */
const MAISONS = 100, ESSAIS = 10; // (les mêmes que W.dichotomie dans serveur/jours.js)
const parties = new Map();
setInterval(() => {
  const limite = Date.now() - 2 * 3600 * 1000;
  for (const [k, p] of parties) if (p.debut < limite) parties.delete(k);
}, 15 * 60 * 1000).unref();

const nouvellePartie = () => ({ cible: 1 + crypto.randomInt(MAISONS), essais: 0, debut: Date.now() });

function dichotomie(joueur, corps, langue = 'fr') {
  if (!estObjet(corps)) return { erreur: true };
  if (corps.nouvelle || !parties.has(joueur)) {
    if (parties.size > 100000) parties.clear();
    parties.set(joueur, nouvellePartie());
    if (corps.nouvelle) return { essaisRestants: ESSAIS };
  }
  const p = parties.get(joueur);
  const n = Number(corps.essai);
  if (!Number.isInteger(n) || n < 1 || n > MAISONS) return { message: (M[langue] || M.fr).numero(MAISONS) };
  p.essais++;
  if (n === p.cible) { parties.delete(joueur); return { indication: 'trouve', essaisRestants: ESSAIS - p.essais, gagne: true }; }
  const indication = n < p.cible ? 'plus' : 'moins';
  if (p.essais >= ESSAIS) { parties.delete(joueur); return { indication, essaisRestants: 0, perdu: true, cible: p.cible }; }
  return { indication, essaisRestants: ESSAIS - p.essais };
}

module.exports = { verifier, dichotomie, normaliser, empreinte };
