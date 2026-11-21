/* Le calendrier suit l'heure du SERVEUR, dans le fuseau choisi :
   changer l'horloge de son ordinateur ne sert à rien. */
'use strict';
const config = require('./config');

function partiesLocales(instant, fuseau) {
  const p = {};
  new Intl.DateTimeFormat('en-US', {
    timeZone: fuseau, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(instant)).forEach(x => { p[x.type] = x.value; });
  return { annee: +p.year, mois: +p.month, jour: +p.day, heure: +p.hour, minute: +p.minute, seconde: +p.second };
}

// Instant (en ms) du minuit local du jour donné.
function minuitLocal(annee, mois, jour, fuseau) {
  const approx = Date.UTC(annee, mois - 1, jour);
  const p = partiesLocales(approx, fuseau);
  const decalage = Date.UTC(p.annee, p.mois - 1, p.jour, p.heure, p.minute, p.seconde) - approx;
  return approx - decalage;
}

const cle = (a, m, j) => a * 10000 + m * 100 + j;

// 'verrouille' (pas encore), 'disponible', ou 'ferme' (passé, sans rattrapage)
function etatCalendaire(n, maintenant = Date.now()) {
  if (config.modeTest) return 'disponible';
  const t = partiesLocales(maintenant, config.fuseau);
  const aujourdHui = cle(t.annee, t.mois, t.jour);
  const ouverture = cle(config.annee, 12, n);
  if (aujourdHui < ouverture) return 'verrouille';
  if (aujourdHui === ouverture || config.rattrapage) return 'disponible';
  return 'ferme';
}

function prochaineOuverture(maintenant = Date.now()) {
  if (config.modeTest) return null;
  for (let n = 1; n <= 24; n++) {
    if (etatCalendaire(n, maintenant) === 'verrouille') {
      return { jour: n, dans: minuitLocal(config.annee, 12, n, config.fuseau) - maintenant };
    }
  }
  return null;
}

const dateTexte = (n) => `${n === 1 ? '1er' : n} décembre`;

module.exports = { etatCalendaire, prochaineOuverture, dateTexte, partiesLocales, minuitLocal };
