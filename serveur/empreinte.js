/* Calcule l'empreinte d'une réponse, à coller dans « reponses » (serveur/jours.js).
   Usage : npm run empreinte -- 3 "un télescope" */
'use strict';
const { empreinte, normaliser } = require('./verification');

const [jour, ...mots] = process.argv.slice(2);
const reponse = mots.join(' ');
if (!jour || !reponse) {
  console.log('Usage : npm run empreinte -- <jour> "<réponse>"');
  process.exit(1);
}
console.log(`Jour ${jour} · réponse normalisée : ${normaliser(reponse)}`);
console.log(`'${empreinte(Number(jour), reponse)}'`);
