/* Messages renvoyés par le serveur, en français et en anglais. */
'use strict';

const TEXTES = {
  fr: {
    date: (n) => `${n === 1 ? '1er' : n} décembre`,
    verrouille: (date) => `🔒 Patience ! Cette pièce s'ouvrira le <b>${date}</b>.`,
    ferme: '⌛ Trop tard ! Chaque pièce ne reste ouverte que le jour J.',
    connexion: '🔑 Connecte-toi d\'abord !',
    trop: '🐢 Doucement ! Trop d\'essais en une minute. Souffle un peu et réessaie.',
    hoquet: '📡 Le serveur du Pôle Nord a eu un hoquet. Réessaie dans un instant.',
    pseudo: 'Écris ton prénom (de 2 à 40 caractères).',
    mdpCourt: 'Le mot de passe doit faire au moins 6 caractères.',
    mdpLong: 'Ce mot de passe est trop long.',
    pris: (nom) => `Le prénom « ${nom} » est déjà pris. Si c'est toi, clique sur « J'ai déjà un compte ». Sinon, ajoute l'initiale de ton nom (par exemple « ${nom} B. »).`,
    identifiants: 'Prénom ou mot de passe incorrect.',
  },
  en: {
    date: (n) => `December ${n}`,
    verrouille: (date) => `🔒 Patience! This room opens on <b>${date}</b>.`,
    ferme: '⌛ Too late! Each room is only open on its own day.',
    connexion: '🔑 Log in first!',
    trop: '🐢 Easy there! Too many tries in one minute. Take a breath and try again.',
    hoquet: '📡 The North Pole server had a hiccup. Try again in a moment.',
    pseudo: 'Write your first name (between 2 and 40 characters).',
    mdpCourt: 'Your password must be at least 6 characters long.',
    mdpLong: 'This password is too long.',
    pris: (nom) => `The name “${nom}” is already taken. If it's you, click “I already have an account”. Otherwise, add the initial of your last name (for example “${nom} B.”).`,
    identifiants: 'Wrong name or password.',
  },
};

// La langue est envoyée par le navigateur dans l'en-tête « X-Langue ».
const langueDe = (req) => (String(req.get('x-langue') || '').toLowerCase() === 'en' ? 'en' : 'fr');
const textes = (req) => TEXTES[langueDe(req)];

module.exports = { TEXTES, langueDe, textes };
