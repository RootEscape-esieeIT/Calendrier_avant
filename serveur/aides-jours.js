/* =========================================================
   Petits outils pour écrire les énigmes (jours.js et jours.en.js)
   ========================================================= */
'use strict';
const crypto = require('crypto');
const L = require('../public/js/logique-jeux');

// « Pull moche » → ['01010000', '01110101', …] : l'étiquette imprimée en binaire (jour 2)
const enBinaire = (texte) => [...texte].map(c => c.charCodeAt(0).toString(2).padStart(8, '0'));

// La règle de l'alarme anti-Kère (jour 5), pour les 16 situations du tableau de tests :
// elle sonne si la porte est ouverte sans badge, ou si la fenêtre est ouverte pendant la nuit.
const tableAlarme = () => L.situations().map(e => (e.A && !e.B) || (e.C && e.D));

// Les 10 premiers caractères de l'empreinte SHA-256 d'une lettre (registre du Père Noël, jour 20)
const empreinteCourte = (texte) => crypto.createHash('sha256').update(texte, 'utf8').digest('hex').slice(0, 10);

module.exports = { enBinaire, tableAlarme, empreinteCourte };
