/* Remet un nouveau mot de passe à un joueur qui l'a oublié.
   Usage : npm run mot-de-passe -- "Léa" "nouveau-mot-de-passe" */
'use strict';
const config = require('./config');
const stockage = require('./stockage');
const comptes = require('./comptes');

(async () => {
  const [nom, mdp] = process.argv.slice(2);
  if (!nom || !mdp) { console.log('Usage : npm run mot-de-passe -- "<pseudo>" "<nouveau mot de passe>"'); process.exit(1); }
  if (!config.mysql) { console.log('Pas de base MySQL configurée dans .env : rien à modifier.'); process.exit(1); }
  const erreur = comptes.erreurMotDePasse(mdp);
  if (erreur) { console.log(require('./textes').TEXTES.fr[erreur]); process.exit(1); }
  await stockage.init();
  const ok = await stockage.changerMotDePasse(nom, await comptes.hacher(mdp));
  console.log(ok ? `✅ Mot de passe de « ${nom} » changé. Transmets-le au joueur.` : `❌ Aucun joueur nommé « ${nom} ».`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e.message); process.exit(1); });
