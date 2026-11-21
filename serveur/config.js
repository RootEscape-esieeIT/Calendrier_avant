/* Réglages lus dans le fichier .env (voir .env.example). */
'use strict';
const path = require('path');

try { process.loadEnvFile(path.join(__dirname, '..', '.env')); } catch (e) { /* pas de .env : valeurs par défaut */ }

const env = process.env;
const oui = (v, defaut = false) => (v === undefined || v === '' ? defaut : ['1', 'true', 'oui', 'yes'].includes(String(v).toLowerCase()));

module.exports = {
  port: Number(env.PORT) || 3000,
  annee: Number(env.ANNEE) || new Date().getFullYear(),
  fuseau: env.FUSEAU || 'Europe/Paris',
  // true : les jours passés restent ouverts (on peut rattraper une énigme manquée).
  // false : seule l'énigme du jour est ouverte (les énigmes déjà résolues restent consultables).
  rattrapage: oui(env.RATTRAPAGE, true),
  // Ouvre toutes les portes. À ne JAMAIS laisser activé en production.
  modeTest: oui(env.MODE_TEST, false),
  // À activer si nginx / Apache est placé devant Node (pour la vraie IP et le HTTPS).
  derriereProxy: oui(env.DERRIERE_PROXY, false),
  mysql: env.MYSQL_HOTE ? {
    host: env.MYSQL_HOTE,
    port: Number(env.MYSQL_PORT) || 3306,
    user: env.MYSQL_UTILISATEUR,
    password: env.MYSQL_MOT_DE_PASSE,
    database: env.MYSQL_BASE,
  } : null,
  // Sert à signer les cookies de connexion. Une longue chaîne aléatoire, à garder secrète.
  secretSession: env.SECRET_SESSION || '',
  admin: {
    utilisateur: env.ADMIN_UTILISATEUR || 'admin',
    motDePasse: env.ADMIN_MOT_DE_PASSE || '',
  },
};
