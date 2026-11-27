/* =========================================================
   NOËL-OS — Les mini-jeux « à tester » (version plus dure)
   Le joueur essaie, observe, corrige : chaque outil répond tout
   de suite (terminal, console SQL, trieuse, circuit, robot…).
   Les règles communes avec le serveur sont dans logique-jeux.js ;
   c'est toujours le serveur qui décide si c'est gagné.
   ========================================================= */
(function (global) {
  'use strict';
  const h = global.h, W = global.W, L = global.LOGIQUE;
  const SVG = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, ...enfants) {
    const e = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null) e.setAttribute(k, v);
    for (const c of enfants) if (c != null) e.append(c.nodeType ? c : document.createTextNode(String(c)));
    return e;
  }
  const EN = I18N.langue === 'en';
  const reduit = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pause = (ms) => new Promise(r => setTimeout(r, ms));

  /* ---------- Les textes fixes de ces mini-jeux, dans les deux langues ---------- */
  const TXT = {
    // Terminal
    commande: ['Commande', 'Command'],
    introuvable: ['{c} : commande introuvable. Tape « help » pour voir la liste des commandes.', '{c}: command not found. Type “help” to see the list of commands.'],
    tube_vide: ['Il manque une commande de chaque côté du « | ».', 'There must be a command on each side of the “|”.'],
    sort_usage: ['sort trie des lignes. Exemple : cat liste.txt | sort   (ajoute -n pour trier des nombres, -r pour inverser)', 'sort sorts lines. Example: cat list.txt | sort   (add -n to sort numbers, -r to reverse)'],
    rev_usage: ['rev écrit chaque ligne à l\'envers. Exemple : echo bonjour | rev', 'rev writes each line backwards. Example: echo hello | rev'],
    grep_usage: ['grep garde les lignes qui contiennent un mot. Exemple : grep sapin liste.txt', 'grep keeps the lines that contain a word. Example: grep tree list.txt'],
    // Imprimante (jour 2)
    etiquette: ['🏷️ L\'étiquette du colis', '🏷️ The parcel label'],
    imprimante: ['🖨️ L\'imprimante, en mode test : tape ce que tu veux, elle l\'imprime en binaire', '🖨️ The printer, in test mode: type anything, it prints it in binary'],
    a_imprimer: ['Texte à imprimer', 'Text to print'],
    ex_imprimer: ['Essaie A, puis B, puis a…', 'Try A, then B, then a…'],
    identiques: ['{n} groupe(s) sur {t} identiques à l\'étiquette, à la même place', '{n} of {t} groups identical to the label, in the same place'],
    espace: ['espace', 'space'],
    // Circuit (jour 5)
    capteurs: ['Clique sur les capteurs pour les allumer ou les éteindre, et sur les portes pour changer leur type :', 'Click the sensors to switch them on or off, and the gates to change their type:'],
    alarme: ['ALARME', 'ALARM'],
    fil: ['fil', 'wire'],
    lancer_tests: ['🧪 Lancer les 16 tests', '🧪 Run the 16 tests'],
    situation: ['Situation', 'Situation'],
    attendu: ['La règle dit', 'Rule says'],
    ton_circuit: ['Ton circuit', 'Your circuit'],
    sonne: ['🔔 sonne', '🔔 rings'],
    silence: ['🔕 silence', '🔕 silent'],
    tests_ok: ['{n} / 16 tests réussis', '{n} / 16 tests passed'],
    tests_tous: ['16 / 16 : ton alarme est parfaite ! Envoi au serveur…', '16 / 16: your alarm is perfect! Sending to the server…'],
    porte: ['Porte {n} : clique pour changer', 'Gate {n}: click to change'],
    // Robot (jour 9)
    programme: ['📝 Ton programme', '📝 Your program'],
    lignes: ['{n} / {max} lignes', '{n} / {max} lines'],
    trop_lignes: ['Trop long : {n} lignes pour {max} autorisées. Une boucle « répéter » peut raccourcir ton programme !', 'Too long: {n} lines for {max} allowed. A “repeat” loop can shorten your program!'],
    lancer: ['▶ Lancer le robot', '▶ Run the robot'],
    stop: ['⏹ Arrêter', '⏹ Stop'],
    effacer: ['🗑️ Tout effacer', '🗑️ Clear all'],
    ajouter: ['Ajouter une ligne :', 'Add a line:'],
    ins_avancer: ['avancer', 'forward'], ins_gauche: ['gauche', 'left'], ins_droite: ['droite', 'right'],
    ins_repeter: ['répéter 3', 'repeat 3'], ins_fin: ['fin', 'end'],
    err_inconnu: ['Ligne {l} : je ne comprends pas « {x} ». Les mots possibles : avancer, gauche, droite, répéter, fin.', 'Line {l}: I don\'t understand “{x}”. Possible words: forward, left, right, repeat, end.'],
    err_nombre: ['Ligne {l} : choisis un nombre entre 1 et 20.', 'Line {l}: pick a number between 1 and 20.'],
    err_repeter_nombre: ['Ligne {l} : répéter combien de fois ? Exemple : répéter 3', 'Line {l}: repeat how many times? Example: repeat 3'],
    err_fin_seule: ['Ligne {l} : ce « fin » ne ferme aucun « répéter ».', 'Line {l}: this “end” doesn\'t close any “repeat”.'],
    err_fin_manquante: ['Ligne {l} : ce « répéter » n\'a pas de « fin ». Ajoute une ligne « fin » après les instructions à répéter.', 'Line {l}: this “repeat” has no “end”. Add an “end” line after the instructions to repeat.'],
    vide_prog: ['Ton programme est vide : ajoute des instructions !', 'Your program is empty: add some instructions!'],
    crash: ['💥 Ligne {l} : le robot fonce dans un bloc de glace (ou sort de la Glacière) !', '💥 Line {l}: the robot crashes into an ice block (or leaves the Ice House)!'],
    trop_long: ['Le robot tourne en rond depuis trop longtemps… Vérifie tes boucles.', 'The robot has been going round in circles for too long… Check your loops.'],
    manque_cadeaux: ['Le robot s\'arrête avec {p} cadeau(x) sur {t}. Il en reste à ramasser !', 'The robot stops with {p} of {t} presents. There are still some to pick up!'],
    pas_traineau: ['Tous les cadeaux sont ramassés… mais le robot n\'est pas sur le traîneau 🛷.', 'All the presents are picked up… but the robot isn\'t on the sleigh 🛷.'],
    robot_ok: ['🎉 Tous les cadeaux sont sur le traîneau ! Envoi au serveur…', '🎉 All the presents are on the sleigh! Sending to the server…'],
    ligne_en_cours: ['ligne {l}', 'line {l}'],
    // Crêpes (jour 11)
    cuisine: ['🍳 Sortie de la cuisine (la prochaine est à gauche)', '🍳 Coming out of the kitchen (next one on the left)'],
    assiette: ['🍽️ L\'assiette (une pile)', '🍽️ The plate (a stack)'],
    passe: ['🚪 Le passe-plat (une file)', '🚪 The serving hatch (a queue)'],
    servies: ['👪 Servies aux invités', '👪 Served to the guests'],
    b_poser: ['⬇ Poser sur l\'assiette', '⬇ Put on the plate'],
    b_passe: ['➡ Mettre dans le passe-plat', '➡ Put in the hatch'],
    b_servir_p: ['🍴 Servir le dessus de l\'assiette', '🍴 Serve the top of the plate'],
    b_servir_f: ['🍴 Servir la 1re du passe-plat', '🍴 Serve the 1st in the hatch'],
    annuler: ['↩ Annuler', '↩ Undo'],
    recommencer: ['🔄 Recommencer', '🔄 Start again'],
    mauvaise_lettre: ['Oups : les invités attendaient un « {a} », pas un « {b} » ! Annule et essaie autrement.', 'Oops: the guests were waiting for a “{a}”, not a “{b}”! Undo and try another way.'],
    crepes_ok: ['🎉 Le mot est servi ! Envoi au serveur…', '🎉 The word is served! Sending to the server…'],
    mot_attendu: ['Le mot que les invités attendent :', 'The word the guests are waiting for:'],
    // Trieuse (jour 15)
    motif: ['Ton motif (expression régulière)', 'Your pattern (regular expression)'],
    garder: ['✅ À garder (vraies étiquettes)', '✅ To keep (real labels)'],
    jeter: ['🗑️ À jeter (fausses étiquettes de la Kère)', '🗑️ To throw away (the Ker\'s fake labels)'],
    motif_invalide: ['⚠️ Ce motif n\'est pas valide : {e}', '⚠️ This pattern isn\'t valid: {e}'],
    bien_triees: ['{n} / {t} étiquettes bien triées', '{n} / {t} labels sorted correctly'],
    envoyer_motif: ['📦 Lancer le tri avec ce motif', '📦 Run the sorting with this pattern'],
    accepte: ['acceptée', 'accepted'], refuse: ['refusée', 'rejected'],
    // SQL (jour 17)
    sql_accueil: ['Console de la base de données des lutins. Tables : {t}. Tape une requête puis Entrée (exemple : SELECT * FROM rennes).', 'The elves\' database console. Tables: {t}. Type a query then Enter (example: SELECT * FROM reindeer).'],
    sql_lignes: ['{n} ligne(s)', '{n} row(s)'],
    sql_coupe: ['(seules les {n} premières lignes sont affichées)', '(only the first {n} rows are shown)'],
    sql_err: ['Erreur : {e}', 'Error: {e}'],
    sql_select: ['une requête commence par SELECT.', 'a query starts with SELECT.'],
    sql_from: ['il manque FROM et le nom de la table (exemple : SELECT * FROM rennes).', 'FROM and the table name are missing (example: SELECT * FROM reindeer).'],
    sql_table: ['je ne connais pas la table « {x} ». Tables : {t}.', 'I don\'t know the table “{x}”. Tables: {t}.'],
    sql_colonne: ['je ne connais pas la colonne « {x} ». Colonnes de {tb} : {c}.', 'I don\'t know the column “{x}”. Columns of {tb}: {c}.'],
    sql_attendu: ['je m\'attendais à {a} vers « {x} ».', 'I expected {a} near “{x}”.'],
    sql_fin: ['la requête s\'arrête trop tôt.', 'the query ends too early.'],
    sql_guillemet: ['un texte doit être entre guillemets : \'Lyon\'. Il manque un guillemet fermant.', 'text must be in quotes: \'York\'. A closing quote is missing.'],
    sql_valeur: ['une valeur (un nombre ou un texte entre guillemets)', 'a value (a number or text in quotes)'],
    sql_operateur: ['un opérateur (=, <, >, <=, >=, != ou LIKE)', 'an operator (=, <, >, <=, >=, != or LIKE)'],
    sql_limit: ['LIMIT doit être suivi d\'un nombre.', 'LIMIT must be followed by a number.'],
    sql_trop: ['il reste « {x} » à la fin, que je ne comprends pas.', 'there\'s “{x}” left at the end, which I don\'t understand.'],
    sql_aide: ['Exemples :\n  SELECT * FROM rennes\n  SELECT prenom, vitesse FROM rennes WHERE vitesse > 50\n  SELECT * FROM rennes ORDER BY vitesse DESC LIMIT 3\n  SELECT COUNT(*) FROM rennes WHERE nez_rouge = \'oui\'', 'Examples:\n  SELECT * FROM reindeer\n  SELECT name, speed FROM reindeer WHERE speed > 50\n  SELECT * FROM reindeer ORDER BY speed DESC LIMIT 3\n  SELECT COUNT(*) FROM reindeer WHERE red_nose = \'yes\''],
    // Kèrebook (jour 19)
    publications: ['Publications', 'Posts'],
    jaime: ['J\'aime', 'Like'],
    force_titre: ['💻 L\'ordinateur des lutins peut tenter une attaque par force brute sur le coffre', '💻 The elves\' computer can try a brute-force attack on the safe'],
    force_lancer: ['⚡ Lancer l\'attaque', '⚡ Launch the attack'],
    force_calcul: ['Mot de passe de {l} caractères, {a} caractères possibles (a-z et 0-9) : {c} combinaisons. À {v} essais par seconde, il faudrait {d}.', 'A {l}-character password, {a} possible characters (a-z and 0-9): {c} combinations. At {v} tries per second, it would take {d}.'],
    force_abandon: ['❌ Abandon : les lutins n\'ont pas {d} devant eux. Il faut deviner le mot de passe autrement…', '❌ Giving up: the elves don\'t have {d} to spare. The password must be guessed another way…'],
    // Empreintes (jour 20)
    lettres_matin: ['📜 Les lettres arrivées ce matin', '📜 The letters that arrived this morning'],
    machine: ['⚙️ La machine à empreintes (SHA-256)', '⚙️ The fingerprint machine (SHA-256)'],
    passer_machine: ['⚙️ Passer à la machine', '⚙️ Put through the machine'],
    texte_machine: ['Texte à passer à la machine (tu peux le modifier)', 'Text to put through the machine (you can edit it)'],
    empreinte: ['Empreinte :', 'Fingerprint:'],
    registre: ['📒 Le registre du Père Noël (empreintes des vraies lettres)', '📒 Santa\'s register (fingerprints of the real letters)'],
    enfant: ['Enfant', 'Child'],
    correspond: ['✅ Correspond à l\'empreinte de {e} dans le registre.', '✅ Matches {e}\'s fingerprint in the register.'],
    correspond_aucun: ['❌ Aucune empreinte du registre ne correspond à ce texte.', '❌ No fingerprint in the register matches this text.'],
    catalogue: ['🎁 Le catalogue de l\'atelier (écrit exactement comme dans les lettres)', '🎁 The workshop catalogue (written exactly as in the letters)'],
    // Le code Morse (jour 12)
    mo_bande: ['📻 La bande imprimée par la radio cette nuit (un groupe = une lettre) :', '📻 The strip printed by the radio tonight (one group = one letter):'],
    mo_ecouter: ['🔊 Écouter le message', '🔊 Listen to the message'],
    mo_ecoute: ['🔊 Ça bipe…', '🔊 Beeping…'],
    mo_table: ['📖 Le tableau du Morse (• = ti, court ; — = taa, long) :', '📖 The Morse table (• = dit, short; — = dah, long):'],
    mo_manip: ['🎛️ Le manipulateur, pour t\'entraîner ou vérifier un groupe : appui court = ti (•), appui long = taa (—). La lettre s\'affiche quand tu t\'arrêtes. Essaie SOS !', '🎛️ The telegraph key, to practise or check a group: short press = dit (•), long press = dah (—). The letter appears when you stop. Try SOS!'],
    mo_touche: ['Appuie', 'Press'],
    mo_touche_aria: ['Touche du manipulateur Morse : appui court ou long', 'Morse key: short or long press'],
    mo_encours: ['En cours :', 'Now:'],
    mo_ti: ['• ti', '• dit'],
    mo_taa: ['— taa', '— dah'],
    mo_effacer: ['🧽 Effacer', '🧽 Clear'],
    mo_rien: ['Les lettres que tu tapes s\'affichent ici.', 'The letters you tap show up here.'],
    // Affiche en pixels (jour 16)
    palette: ['🎨 Ta palette : choisis une couleur, puis clique ou glisse sur les cases.', '🎨 Your palette: pick a color, then click or drag over the squares.'],
    code_recu: ['📜 Le code, ligne par ligne (une ligne bien peinte s\'allume ✓) :', '📜 The code, row by row (a correctly painted row lights up ✓):'],
    lignes_justes: ['{n} / {t} lignes justes', '{n} / {t} rows correct'],
    affiche_ok: ['🎬 L\'affiche est complète ! Lis bien le titre…', '🎬 The poster is complete! Read the title carefully…'],
    effacer: ['🧽 Tout effacer', '🧽 Clear everything'],
    ligne: ['Ligne {n}', 'Row {n}'],
    ligne_aide: ['👆 Touche une case : le code de sa ligne s\'affiche ici.', '👆 Touch a square: the code for its row shows up here.'],
    // Neurone (jour 23)
    reglages: ['🎛️ Les réglages du robot : combien de points rapporte chaque critère ?', '🎛️ The robot\'s settings: how many points does each criterion give?'],
    seuil: ['Seuil : le robot dit « adoré » à partir de', 'Threshold: the robot says “loved” from'],
    points: ['points', 'points'],
    exemples: ['📚 Les exemples (ce que les rennes ont vraiment pensé)', '📚 The examples (what the reindeer really thought)'],
    jouet: ['Jouet', 'Toy'], total: ['Total', 'Total'], robot_dit: ['Le robot dit', 'Robot says'], verite: ['Les rennes', 'Reindeer'],
    adore: ['❤️ adoré', '❤️ loved'], bof: ['😐 bof', '😐 meh'],
    bien_devines: ['{n} / {t} exemples bien devinés', '{n} / {t} examples guessed right'],
    tester_nouveaux: ['🧪 Tester le robot sur les nouveaux jouets', '🧪 Test the robot on the new toys'],
    nouveaux: ['🎁 Les nouveaux jouets (le robot ne les a jamais vus)', '🎁 The new toys (the robot has never seen them)'],
    moins: ['−', '−'], plus: ['+', '+'],
  };
  function tt(cle, vars) {
    const e = TXT[cle];
    let x = e ? e[EN ? 1 : 0] : cle;
    if (vars) x = x.replace(/\{(\w+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(vars, k) ? vars[k] : m));
    return x;
  }

  /* =========================================================
     Le terminal : un vrai petit interpréteur de commandes,
     avec des fichiers, des tubes ( | ) et des jokers ( * ).
     Sert au Repaire de l'Elfe Hacker (jour 22) et au duel final.
     ========================================================= */
  const AIDE_DE_BASE = () => (EN ? t('TERMINAL_AIDE') : [
    'Commandes disponibles :',
    '  help            affiche cette aide',
    '  ls              liste le contenu du dossier actuel',
    '  ls -a           liste aussi les éléments cachés (qui commencent par un point)',
    '  cd <dossier>    entre dans un dossier',
    '  cd ..           remonte au dossier parent',
    '  cd /            va à la racine (tout en haut)',
    '  pwd             affiche le chemin du dossier actuel',
    '  cat <fichier>   affiche le contenu d\'un fichier',
    '  clear           efface l\'écran',
    'Astuces : la touche Tab complète les noms, ↑ et ↓ rappellent les commandes précédentes.',
  ].join('\n'));

  function creerShell(zone, o) {
    const racine = JSON.parse(JSON.stringify(o.racine));
    const MAISON = o.depart.slice();
    let cwd = MAISON.slice();
    const UTILISATEUR = o.utilisateur || MAISON[MAISON.length - 1];
    const HOTE = o.hote || t('pole-nord');
    const CHEMIN_MAISON = '/' + MAISON.join('/');
    const sortie = h('div', { class: 'term-sortie', 'aria-live': 'polite' });
    const invite = h('span', { class: 'term-invite' });
    const champ = h('input', { class: 'term-champ', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', 'aria-label': tt('commande') });
    const form = h('form', { class: 'term-ligne' }, invite, champ);
    const voile = h('div', { class: 'term-voile', 'aria-hidden': 'true' });
    const ecran = h('div', { class: 'terminal' + (o.classe ? ' ' + o.classe : '') }, sortie, form, voile);
    ecran.addEventListener('click', () => { if (!window.getSelection().toString() && !champ.disabled) champ.focus({ preventScroll: true }); });
    const historique = [];
    let posHist = 0, occupe = 0;

    const texteChemin = (p) => {
      const c = '/' + p.join('/');
      if (c === CHEMIN_MAISON) return '~';
      if (c.startsWith(CHEMIN_MAISON + '/')) return '~' + c.slice(CHEMIN_MAISON.length);
      return c;
    };
    const majInvite = () => { invite.textContent = `${UTILISATEUR}@${HOTE}:${texteChemin(cwd)}$ `; };
    function noeud(p) {
      let n = racine;
      for (const part of p) {
        if (typeof n !== 'object' || n === null || !Object.prototype.hasOwnProperty.call(n, part)) return undefined;
        n = n[part];
      }
      return n;
    }
    function resoudre(arg) {
      let parts, reste = arg;
      if (arg.startsWith('/')) parts = [];
      else if (arg === '~' || arg.startsWith('~/')) { parts = MAISON.slice(); reste = arg.slice(1); }
      else parts = cwd.slice();
      for (const seg of reste.split('/')) {
        if (!seg || seg === '.') continue;
        if (seg === '..') parts.pop(); else parts.push(seg);
      }
      return parts;
    }
    const refus = (p) => (o.verrou ? o.verrou(p) : null);
    function ecrire(contenu, classe) {
      const l = h('div', { class: 'term-l ' + (classe || '') });
      if (contenu && contenu.nodeType) l.append(contenu); else l.textContent = contenu;
      sortie.append(l);
      sortie.scrollTop = sortie.scrollHeight;
      return l;
    }
    // Une ligne qui s'écrit lettre à lettre (Kryos qui tape, les lutins qui répondent)
    async function ecrireLent(texte, classe, vitesse = 22) {
      occupe++;
      champ.disabled = true;
      const l = ecrire('', classe);
      if (reduit()) l.textContent = texte;
      else for (let i = 0; i < texte.length; i++) {
        if (!zone.isConnected) break;
        l.textContent += texte[i];
        if (i % 3 === 0) sortie.scrollTop = sortie.scrollHeight;
        await pause(vitesse);
      }
      sortie.scrollTop = sortie.scrollHeight;
      if (--occupe === 0 && !ecran.classList.contains('fige')) { champ.disabled = false; if (zone.isConnected && document.activeElement !== champ && o.focusApres !== false) champ.focus({ preventScroll: true }); }
    }
    async function geler(ms, texte) {
      occupe++;
      champ.disabled = true;
      voile.textContent = texte || '';
      ecran.classList.add('gele');
      await pause(reduit() ? Math.min(ms, 800) : ms);
      ecran.classList.remove('gele');
      if (--occupe === 0 && !ecran.classList.contains('fige')) { champ.disabled = false; champ.focus({ preventScroll: true }); }
    }
    function lire(arg, cmd) {
      const p = resoudre(arg);
      const r = refus(p);
      if (r) return { erreur: r };
      const n = noeud(p);
      if (n === undefined) return { erreur: t('cat: {c}: Aucun fichier ou dossier de ce nom', { c: arg }).replace(/^cat/, cmd) };
      if (typeof n === 'object') return { erreur: t('cat: {c}: Est un dossier (utilise cd pour y entrer)', { c: arg }).replace(/^cat/, cmd) };
      return { texte: n };
    }
    // Le texte d'entrée d'une commande : les fichiers donnés, sinon ce qui arrive par le tube
    function entreeDe(fichiers, entree, cmd) {
      if (!fichiers.length) return { texte: entree };
      const parts = [];
      for (const f of fichiers) { const r = lire(f, cmd); if (r.erreur) return r; parts.push(r.texte); }
      return { texte: parts.join('\n') };
    }
    const erreur = (texte) => ({ texte, classe: 'term-erreur' });
    const commandes = {
      help: () => o.aide || AIDE_DE_BASE(),
      aide: () => commandes.help(),
      ls(args) {
        const tous = args.some(a => /^-[a-zA-Z]*a/.test(a));
        const cible = args.find(a => !a.startsWith('-'));
        const p = cible ? resoudre(cible) : cwd;
        const r = refus(p);
        if (r) return erreur(r);
        const n = noeud(p);
        if (n === undefined) return erreur(t("ls: impossible d'accéder à '{c}': Aucun fichier ou dossier de ce nom", { c: cible }));
        if (typeof n === 'string') return cible;
        const noms = Object.keys(n).filter(k => tous || !k.startsWith('.')).sort((a, b) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, '')));
        const ligne = h('div', { class: 'term-ls' });
        if (tous) ligne.append(h('span', { class: 'dossier' }, '.'), h('span', { class: 'dossier' }, '..'));
        noms.forEach(k => ligne.append(h('span', { class: typeof n[k] === 'object' ? 'dossier' : 'fichier' }, k + (typeof n[k] === 'object' ? '/' : ''))));
        if (!noms.length && !tous) return t('(dossier vide… vraiment ?)');
        return { dom: ligne, texte: noms.join('\n') };
      },
      dir(args) { return commandes.ls(args); },
      cd(args) {
        const cible = args[0] || '~';
        const p = resoudre(cible);
        const r = refus(p);
        if (r) return erreur(r);
        const n = noeud(p);
        if (n === undefined) return erreur(t('cd: {c}: Aucun fichier ou dossier de ce nom', { c: cible }));
        if (typeof n === 'string') return erreur(t("cd: {c}: N'est pas un dossier (c'est un fichier : utilise cat pour le lire)", { c: cible }));
        cwd = p; majInvite();
        return '';
      },
      pwd: () => '/' + cwd.join('/'),
      cat(args, { entree }) {
        if (!args.length && entree != null) return entree;
        if (!args.length) return erreur(t('cat: indique un nom de fichier, par exemple : cat lisez-moi.txt'));
        const parts = [];
        for (const a of args) { const r = lire(a, 'cat'); if (r.erreur) return erreur(r.erreur); parts.push(r.texte); }
        return parts.join('\n');
      },
      sort(args, { entree }) {
        const options = args.filter(a => /^-/.test(a)).join('');
        const r = entreeDe(args.filter(a => !/^-/.test(a)), entree, 'sort');
        if (r.erreur) return erreur(r.erreur);
        if (r.texte == null) return { texte: tt('sort_usage'), classe: 'term-info' };
        const lignes = r.texte.split('\n').filter(l => l.trim() !== '');
        const nombre = (l) => { const m = l.match(/^\s*(-?\d+(?:[.,]\d+)?)/); return m ? parseFloat(m[1].replace(',', '.')) : 0; };
        lignes.sort(/n/.test(options) ? (a, b) => nombre(a) - nombre(b) || a.localeCompare(b) : (a, b) => (a < b ? -1 : a > b ? 1 : 0));
        if (/r/.test(options)) lignes.reverse();
        return lignes.join('\n');
      },
      rev(args, { entree }) {
        let texte = entree;
        if (args.length) {
          const r = entreeDe(args, entree, 'rev');
          texte = r.erreur ? args.join(' ') : r.texte; // « rev bonjour » marche aussi, pour ne pas se décourager
        }
        if (texte == null) return { texte: tt('rev_usage'), classe: 'term-info' };
        return texte.split('\n').map(l => [...l].reverse().join('')).join('\n');
      },
      grep(args, { entree }) {
        const mots = args.filter(a => !/^-/.test(a));
        if (!mots.length) return { texte: tt('grep_usage'), classe: 'term-info' };
        const r = entreeDe(mots.slice(1), entree, 'grep');
        if (r.erreur) return erreur(r.erreur);
        if (r.texte == null) return { texte: tt('grep_usage'), classe: 'term-info' };
        const cherche = L.sansAccents(mots[0]).toLowerCase();
        return r.texte.split('\n').filter(l => L.sansAccents(l).toLowerCase().includes(cherche)).join('\n');
      },
      clear() { sortie.innerHTML = ''; return ''; },
      whoami: () => UTILISATEUR,
      echo: (args) => args.join(' '),
      date: () => new Date().toLocaleString(I18N.locale),
      sudo: () => t("Bien essayé 😏 mais la Kère a confisqué les droits d'administrateur."),
      rm: () => t('rm: Hé ! On ne supprime rien au Pôle Nord. 🎅'),
      exit: () => t('Impossible de quitter : le Pôle Nord a besoin de toi !'),
      ...(o.commandes || {}),
    };
    const texteDe = (r) => (r == null ? '' : typeof r === 'string' ? r : r.nodeType ? r.textContent : (r.texte != null ? r.texte : ''));
    function afficher(r) {
      if (r == null || r === '') return;
      if (typeof r === 'string') ecrire(r);
      else if (r.nodeType) ecrire(r);
      else if (r.dom) ecrire(r.dom, r.classe);
      else if (r.texte) ecrire(r.texte, r.classe);
    }
    // Découpe « cat a b | sort -n » en commandes et en mots (les guillemets gardent les espaces)
    function decouper(ligne) {
      const segments = [[]];
      let cur = '', guillemet = null, enCours = false, cite = false;
      const pousser = () => { if (enCours) segments[segments.length - 1].push({ v: cur, cite }); cur = ''; enCours = false; cite = false; };
      for (const c of ligne) {
        if (guillemet) { if (c === guillemet) guillemet = null; else cur += c; continue; }
        if (c === '"') { guillemet = c; enCours = true; cite = true; continue; }
        if (c === '|') { pousser(); segments.push([]); continue; }
        if (/\s/.test(c)) { pousser(); continue; }
        cur += c; enCours = true;
      }
      pousser();
      return segments;
    }
    function etendre(arg) {
      if (!arg.includes('*')) return [arg];
      const coupe = arg.lastIndexOf('/');
      const dossierTxt = coupe >= 0 ? arg.slice(0, coupe + 1) : '';
      const motif = arg.slice(coupe + 1);
      const p = dossierTxt ? resoudre(dossierTxt) : cwd;
      if (refus(p)) return [arg];
      const dossier = noeud(p);
      if (!dossier || typeof dossier !== 'object') return [arg];
      const re = new RegExp('^' + motif.split('*').map(x => x.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
      const noms = Object.keys(dossier).filter(k => typeof dossier[k] === 'string' && re.test(k) && (motif.startsWith('.') || !k.startsWith('.'))).sort();
      return noms.length ? noms.map(k => dossierTxt + k) : [arg];
    }
    async function executer(ligne) {
      ecrire(invite.textContent + ligne, 'term-cmd');
      const segments = decouper(ligne);
      if (!segments[0].length) return;
      let entree = null, res = null;
      const noms = [];
      for (let k = 0; k < segments.length; k++) {
        const morceaux = segments[k];
        if (!morceaux.length) { ecrire(tt('tube_vide'), 'term-erreur'); return; }
        const nom = morceaux[0].v.toLowerCase();
        noms.push(nom);
        const args = morceaux.slice(1).flatMap(m => (m.cite ? [m.v] : etendre(m.v)));
        const f = commandes[nom];
        if (!f) { ecrire(tt('introuvable', { c: morceaux[0].v }), 'term-erreur'); return; }
        res = await f(args, { entree, tube: k < segments.length - 1, ligne });
        if (res && res.classe === 'term-erreur') break;
        entree = texteDe(res);
      }
      afficher(res);
      if (o.apres) o.apres({ ligne, noms, sortie: texteDe(res), cwd: cwd.slice() });
    }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (champ.disabled) return;
      const ligne = champ.value;
      champ.value = '';
      if (ligne.trim()) historique.push(ligne);
      posHist = historique.length;
      if (o.activite) o.activite();
      await executer(ligne);
    });
    champ.addEventListener('keydown', (e) => {
      if (o.activite) o.activite();
      if (e.key === 'ArrowUp') { e.preventDefault(); if (posHist > 0) champ.value = historique[--posHist]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (posHist < historique.length - 1) champ.value = historique[++posHist]; else { posHist = historique.length; champ.value = ''; } }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const val = champ.value;
        const debut = Math.max(val.lastIndexOf(' '), val.lastIndexOf('|')) + 1;
        const mot = val.slice(debut);
        const coupe = mot.lastIndexOf('/');
        const dossierTxt = coupe >= 0 ? mot.slice(0, coupe + 1) : '';
        const prefixe = coupe >= 0 ? mot.slice(coupe + 1) : mot;
        const p = dossierTxt ? resoudre(dossierTxt) : cwd;
        if (refus(p)) return;
        const dossier = noeud(p);
        if (!dossier || typeof dossier !== 'object') return;
        const choix = Object.keys(dossier).filter(k => k.startsWith(prefixe) && (prefixe.startsWith('.') || !k.startsWith('.')));
        if (choix.length === 1) {
          const k = choix[0];
          champ.value = val.slice(0, debut) + dossierTxt + k + (typeof dossier[k] === 'object' ? '/' : ' ');
        } else if (choix.length > 1) {
          ecrire(invite.textContent + val, 'term-cmd');
          ecrire(choix.join('   '));
        }
      }
    });
    majInvite();
    zone.append(ecran);
    return {
      ecrire, ecrireLent, geler, racine, noeud, resoudre, champ, ecran, commandes, majInvite,
      cwd: () => cwd.slice(), allerA(p) { cwd = p.slice(); majInvite(); }, occupe: () => occupe > 0,
      figer() { ecran.classList.add('fige'); champ.disabled = true; },
    };
  }

  /* ---------- Jour 22 : le Repaire de l'Elfe Hacker ---------- */
  W.terminal = (racine, depart) => (zone) => {
    const sh = creerShell(zone, { racine, depart, focusApres: false });
    sh.ecrire(t('NOËL-OS terminal v24.12 — connecté en tant que « {u} »', { u: depart[depart.length - 1] }), 'term-info');
    sh.ecrire(t('Tape « help » puis Entrée pour voir les commandes disponibles.'), 'term-info');
  };

  /* =========================================================
     Jour 24 : le duel final dans le terminal de NOËL-OS.
     Kryos a pris le contrôle : il répond, gèle l'écran, efface
     des fichiers. c = textes et fichiers (voir serveur/jours.js).
     ========================================================= */
  W.duelFinal = (c) => (zone, api) => {
    const prenom = String((api.prenom && api.prenom()) || c.utilisateurParDefaut).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9_-]/g, '') || c.utilisateurParDefaut;
    // Les fragments gagnés pendant le mois, rangés par Kryos dans /glacier sous des noms brouillés
    const nomFragment = (jour) => 'kryos-' + ((jour * 7919) % 997).toString(36) + '.frag';
    const fichiers = {};
    for (const f of api.fragments()) {
      fichiers[nomFragment(f.jour)] = f.lettre ? `${f.position} ${f.lettre}` : `${f.position != null ? f.position : '?'} ❄  ${c.fragmentGele.replace('{n}', f.jour)}`;
    }
    // Noms des commandes et des fichiers, dans la langue du joueur
    const DEVERROUILLER = c.cmdDeverrouiller || 'deverrouiller', ETOILE = c.cmdEtoile || 'allumer-etoile';
    const SAUVEGARDE = c.dossierSauvegarde || '.sauvegarde', JOURNAL = c.fichierJournal || '.journal';
    const racine = JSON.parse(JSON.stringify(c.racine));
    racine.home[prenom] = racine.home[c.maisonJoueur];
    if (prenom !== c.maisonJoueur) delete racine.home[c.maisonJoueur];
    racine.glacier = { ...fichiers, [SAUVEGARDE]: { ...fichiers, ...c.sauvegarde } };

    let deverrouille = false, journalLu = false, fouille = false, ordreVu = false, fini = false;
    let derniere = Date.now(), piques = 0;
    const kryos = (texte) => sh.ecrireLent('kryos> ' + texte, 'term-kryos', 26);
    const lutins = (texte) => sh.ecrireLent('lutins> ' + texte, 'term-lutins', 18);
    const auHasard = (liste) => liste[Math.floor(Math.random() * liste.length)];

    const sh = creerShell(zone, {
      racine, depart: ['home', prenom], hote: 'noel-os', classe: 'duel', aide: c.aide,
      activite: () => { derniere = Date.now(); },
      verrou: (p) => (!deverrouille && p[0] === 'glacier' ? c.verrouille : null),
      commandes: {
        [DEVERROUILLER]: async (args) => {
          if (deverrouille) return c.dejaOuvert;
          if (!args.length) return { texte: c.usageDeverrouiller, classe: 'term-info' };
          const essai = L.sansAccents(args.join('')).toLowerCase();
          if (essai !== c.motDePasse) {
            sh.ecrire(c.mauvaisMdp, 'term-erreur');
            await kryos(auHasard(c.kryosMauvaisMdp));
            return null;
          }
          deverrouille = true;
          sh.ecrire(c.ouvert, 'term-ok');
          for (const l of c.kryosRiposte) await kryos(l);
          // Kryos efface tous les fragments… sauf la sauvegarde cachée des lutins
          const noms = Object.keys(sh.racine.glacier).filter(k => !k.startsWith('.'));
          for (const k of noms) { sh.ecrire(c.suppression.replace('{f}', '/glacier/' + k), 'term-kryos-rm'); delete sh.racine.glacier[k]; if (!reduit()) await pause(60); }
          await kryos(c.kryosRire);
          await pause(reduit() ? 0 : 900);
          for (const l of c.lutinsSecours) await lutins(l);
          return null;
        },
        [ETOILE]: async (args) => {
          if (fini) return null;
          const formule = args.join(' ').trim();
          if (!formule) return { texte: c.usageEtoile, classe: 'term-info' };
          sh.ecrire(c.prononce.replace('{f}', formule.toUpperCase()), 'term-ok');
          // Si la formule est la bonne, Kryos fond dans le terminal AVANT que la fête ne commence
          api.avantReussite = async () => {
            fini = true;
            for (const l of c.kryosFin) await kryos(l);
            sh.ecran.classList.add('degele');
            for (const l of c.victoire) { sh.ecrire(l, 'term-ok'); await pause(reduit() ? 0 : 500); }
            sh.figer();
            await pause(reduit() ? 300 : 1500);
          };
          const r = await api.verifier(formule);
          api.avantReussite = null;
          if (r && !r.ok && !r.erreur) await kryos(auHasard(c.kryosMauvaiseFormule));
          return null;
        },
        sudo: async () => { await kryos(c.kryosSudo); return null; },
        rm: async () => { await kryos(c.kryosRm); return null; },
        kill: async () => { await kryos(c.kryosKill); return null; },
        exit: async () => { await kryos(c.kryosExit); return null; },
      },
      apres: async ({ ligne, noms, sortie, cwd }) => {
        const dansMaison = cwd[0] === 'home' && cwd[1] === 'kryos';
        if (!fouille && noms[0] === 'ls' && /-[a-z]*a/i.test(ligne) && (dansMaison || /kryos/.test(ligne))) { fouille = true; await kryos(c.kryosFouille); }
        if (!journalLu && noms.includes('cat') && ligne.includes(JOURNAL) && sortie) {
          journalLu = true;
          await kryos(c.kryosJournal);
          await sh.geler(2600, c.gel);
          await kryos(c.kryosApresGel);
        }
        if (!ordreVu && noms.includes('sort')) {
          const lignes = sortie.split('\n').filter(Boolean);
          const nombres = lignes.map(l => parseInt(l, 10)).filter(n => !isNaN(n));
          if (nombres.length >= 20 && nombres.every((n, i) => i === 0 || nombres[i - 1] <= n)) { ordreVu = true; await kryos(c.kryosOrdre); }
          else if (nombres.length >= 20 && !/-[a-z]*n/.test(ligne)) await lutins(c.lutinsTriNombres);
        }
      },
    });

    // Kryos s'impatiente quand le joueur ne fait rien
    const minuterie = setInterval(() => {
      if (!zone.isConnected) { clearInterval(minuterie); return; }
      if (fini || sh.occupe() || piques >= c.kryosAttente.length || Date.now() - derniere < 55000) return;
      derniere = Date.now();
      kryos(c.kryosAttente[piques++]);
    }, 5000);

    (async () => {
      for (const l of c.systeme) sh.ecrire(l.replace('{u}', prenom), 'term-info');
      await pause(reduit() ? 0 : 500);
      for (const l of c.kryosIntro) await kryos(l.replace('{u}', prenom));
      sh.ecrire(c.invitation, 'term-info');
    })();
  };

  /* ---------- Jour 2 : l'imprimante à étiquettes, en mode test ---------- */
  W.imprimante = (etiquette) => (zone) => {
    const octet = (c) => c.charCodeAt(0).toString(2).padStart(8, '0');
    const cases = etiquette.map((b, i) => h('span', { class: 'octet-etiquette' }, h('small', {}, i + 1), h('code', {}, b)));
    const champ = h('input', { type: 'text', class: 'champ-libre mono', maxlength: '24', placeholder: tt('ex_imprimer'), 'aria-label': tt('a_imprimer'), autocomplete: 'off', spellcheck: 'false' });
    const ticket = h('div', { class: 'ticket-imprime' });
    const bilan = h('p', { class: 'petit centre bilan-imprime' });
    function maj() {
      const texte = [...champ.value].filter(ch => ch.charCodeAt(0) < 128);
      ticket.innerHTML = '';
      let pareils = 0;
      texte.forEach((ch, i) => {
        const b = octet(ch), ok = etiquette[i] === b;
        if (ok) pareils++;
        ticket.append(h('span', { class: 'octet-imprime' + (ok ? ' pareil' : '') }, h('b', {}, ch === ' ' ? '␣' : ch), h('code', {}, b)));
      });
      cases.forEach((c, i) => c.classList.toggle('pareil', texte[i] !== undefined && etiquette[i] === octet(texte[i])));
      bilan.textContent = texte.length ? tt('identiques', { n: pareils, t: etiquette.length }) : '';
    }
    champ.addEventListener('input', maj);
    zone.append(
      h('p', { class: 'petit' }, tt('etiquette')), h('div', { class: 'etiquette-octets' }, cases),
      h('div', { class: 'imprimante' }, h('p', { class: 'petit' }, tt('imprimante')), champ, ticket, bilan));
  };

  /* ---------- Jour 5 : l'alarme anti-Kère, à câbler puis à tester ---------- */
  W.circuit = (cfg) => (zone, api) => {
    const entrees = { A: false, B: false, C: false, D: false };
    const portes = cfg.depart.slice();
    const svg = s('svg', { viewBox: '-34 0 594 272', class: 'schema-circuit', role: 'img', 'aria-label': cfg.titre });
    const Y = { A: 40, B: 100, C: 175, D: 235 };
    const fils = {};
    const fil = (cle, d) => { const p = s('path', { d, class: 'fil' }); svg.append(p); (fils[cle] = fils[cle] || []).push(p); };
    // Les fils (dessinés d'abord, sous les portes)
    fil('A', `M70 ${Y.A} H200 V75 H232`);
    fil('B', `M70 ${Y.B} H112`);
    fil('s1', `M180 ${Y.B} H200 V91 H232`);
    fil('C', `M70 ${Y.C} H200 V199 H232`);
    fil('D', `M70 ${Y.D} H200 V215 H232`);
    fil('s2', `M302 83 H330 V128 H362`);
    fil('s3', `M302 207 H330 V152 H362`);
    fil('s4', 'M432 140 H468');
    // Les capteurs (cliquables)
    const capteurs = {};
    cfg.entrees.forEach(({ k, emoji, nom }) => {
      const g = s('g', { class: 'capteur', tabindex: '0', role: 'button', 'aria-pressed': 'false', 'aria-label': `${k} : ${nom}` });
      g.append(s('rect', { x: 6, y: Y[k] - 20, width: 64, height: 40, rx: 10 }), s('text', { x: 24, y: Y[k] + 6, class: 'emoji' }, emoji), s('text', { x: 52, y: Y[k] + 6, class: 'lettre' }, k));
      const basculer = () => { entrees[k] = !entrees[k]; maj(); };
      g.addEventListener('click', basculer);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); basculer(); } });
      svg.append(g, s('text', { x: 38, y: Y[k] + 31, class: 'legende-capteur' }, nom));
      capteurs[k] = g;
    });
    // Les portes (cliquables : on change leur type)
    const POS = [[112, Y.B - 20], [232, 61], [232, 185], [362, 118]];
    const boutonsPortes = POS.map(([x, y], i) => {
      const g = s('g', { class: 'porte-schema', tabindex: '0', role: 'button', 'aria-label': tt('porte', { n: i + 1 }) });
      const etiquette = s('text', { x: x + 35, y: y + 27 });
      g.append(s('rect', { x, y, width: 70, height: 44, rx: 9 }), etiquette, s('text', { x: x + 35, y: y - 5, class: 'num-porte' }, 'P' + (i + 1)));
      const changer = () => {
        const choix = L.PORTES_POSSIBLES[i];
        portes[i] = choix[(choix.indexOf(portes[i]) + 1) % choix.length];
        tests.hidden = true;
        maj();
      };
      g.addEventListener('click', changer);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); changer(); } });
      svg.append(g);
      return { g, etiquette };
    });
    const cloche = s('g', { class: 'cloche-alarme' }, s('rect', { x: 468, y: 112, width: 84, height: 56, rx: 12 }), s('text', { x: 510, y: 138, class: 'emoji' }, '🔔'), s('text', { x: 510, y: 159, class: 'lettre-petite' }, tt('alarme')));
    svg.append(cloche);
    const nomPorte = (p) => (p === 'fil' ? tt('fil') : t(p));

    const tests = h('div', { class: 'tests-circuit', hidden: true });
    const boutonTests = h('button', { type: 'button', class: 'btn btn-principal' }, tt('lancer_tests'));
    let envoye = false;
    function maj() {
      const r = L.evaluerCircuit(portes, entrees);
      const v = { A: entrees.A, B: entrees.B, C: entrees.C, D: entrees.D, s1: r.s1, s2: r.s2, s3: r.s3, s4: r.s4 };
      for (const [k, liste] of Object.entries(fils)) liste.forEach(p => p.classList.toggle('on', !!v[k]));
      for (const k of Object.keys(capteurs)) { capteurs[k].classList.toggle('on', entrees[k]); capteurs[k].setAttribute('aria-pressed', String(entrees[k])); }
      boutonsPortes.forEach((b, i) => { b.etiquette.textContent = nomPorte(portes[i]); b.g.classList.toggle('non', portes[i] === 'NON'); });
      cloche.classList.toggle('on', r.s4);
    }
    boutonTests.addEventListener('click', () => {
      const lignes = L.situations().map((e, k) => {
        const obtenu = L.evaluerCircuit(portes, e).s4, ok = obtenu === cfg.attendu[k];
        return { e, obtenu, ok, voulu: cfg.attendu[k] };
      });
      const reussis = lignes.filter(l => l.ok).length;
      const bit = (b) => (b ? '1' : '0');
      tests.innerHTML = '';
      tests.append(h('p', { class: 'bilan-tests ' + (reussis === 16 ? 'tous' : '') }, reussis === 16 ? tt('tests_tous') : tt('tests_ok', { n: reussis })),
        h('div', { class: 'defilement' }, h('table', { class: 'tableau compact table-tests' },
          h('tr', {}, h('th', {}, 'A'), h('th', {}, 'B'), h('th', {}, 'C'), h('th', {}, 'D'), h('th', {}, tt('attendu')), h('th', {}, tt('ton_circuit')), h('th', {}, '')),
          lignes.map(l => h('tr', { class: l.ok ? 'ok' : 'rate' }, h('td', {}, bit(l.e.A)), h('td', {}, bit(l.e.B)), h('td', {}, bit(l.e.C)), h('td', {}, bit(l.e.D)),
            h('td', {}, l.voulu ? tt('sonne') : tt('silence')), h('td', {}, l.obtenu ? tt('sonne') : tt('silence')), h('td', {}, l.ok ? '✅' : '❌'))))));
      tests.hidden = false;
      if (reussis === 16 && !envoye) { envoye = true; setTimeout(() => api.soumettre({ portes: portes.slice() }).then(r => { if (!r.ok) envoye = false; }), 700); }
      else if (reussis < 16) api.message(tt('tests_ok', { n: reussis }), 'info');
    });
    maj();
    // (sur téléphone, le schéma rapetisse : la légende des capteurs passe en dessous, en clair)
    const legende = h('p', { class: 'legende-circuit petit' }, cfg.entrees.map(({ k, emoji, nom }) => h('span', {}, `${emoji} ${k} : ${nom}`)));
    zone.append(h('p', { class: 'petit' }, tt('capteurs')), h('div', { class: 'cadre-circuit' }, svg), legende, h('div', { class: 'centre' }, boutonTests), tests);
  };

  /* ---------- Jour 9 : programmer le robot-lutin de la Glacière ---------- */
  W.robot = (cfg) => (zone, api) => {
    const grille = cfg.grille, H = grille.length, Wd = grille[0].length, T = 52;
    const svg = s('svg', { viewBox: `0 0 ${Wd * T} ${H * T}`, class: 'grille-robot', role: 'img', 'aria-label': cfg.titre });
    const cadeaux = {};
    let depart = null;
    grille.forEach((ligne, j) => [...ligne].forEach((c, i) => {
      svg.append(s('rect', { x: i * T + 1, y: j * T + 1, width: T - 2, height: T - 2, rx: 6, class: 'case-glace' + ((i + j) % 2 ? ' b' : '') }));
      if (c === '#') svg.append(s('text', { x: i * T + T / 2, y: j * T + T * 0.68, class: 'emoji-grille' }, '🧊'));
      if (c === 'S') svg.append(s('text', { x: i * T + T / 2, y: j * T + T * 0.68, class: 'emoji-grille' }, '🛷'));
      if (c === 'C') { const e = s('text', { x: i * T + T / 2, y: j * T + T * 0.68, class: 'emoji-grille cadeau' }, '🎁'); svg.append(e); cadeaux[i + ',' + j] = e; }
      if (c === 'R') depart = { x: i, y: j };
    }));
    // Le robot glisse de case en case ; seule la petite flèche tourne (le robot reste debout)
    const fleche = s('path', { d: 'M18 -7 L28 0 L18 7 Z', class: 'fleche' });
    const robot = s('g', { class: 'robot-lutin' }, s('circle', { r: 19, class: 'corps' }), s('text', { y: 8, class: 'emoji-grille' }, '🤖'), fleche);
    const boom = s('text', { class: 'emoji-grille boom', 'aria-hidden': 'true' }, '💥');
    svg.append(robot, boom);
    let angle = 0;
    const placer = (x, y, dir) => {
      robot.style.transform = `translate(${x * T + T / 2}px, ${y * T + T / 2}px)`;
      angle += ((dir * 90 - angle) % 360 + 540) % 360 - 180; // le plus court chemin : jamais de tour complet
      fleche.style.transform = `rotate(${angle}deg)`;
    };

    const editeur = h('textarea', { class: 'editeur-robot mono', rows: '9', spellcheck: 'false', autocapitalize: 'off', 'aria-label': tt('programme') });
    editeur.value = cfg.exemple || '';
    const compteur = h('span', { class: 'compteur-lignes' });
    const etat = h('p', { class: 'etat-robot petit', 'aria-live': 'polite' });
    const ajouter = (txt) => {
      const v = editeur.value;
      editeur.value = v + (v && !v.endsWith('\n') ? '\n' : '') + txt;
      editeur.focus(); majCompteur();
    };
    const palette = h('div', { class: 'palette-robot' }, h('span', { class: 'petit' }, tt('ajouter')),
      ['ins_avancer', 'ins_gauche', 'ins_droite', 'ins_repeter', 'ins_fin'].map(k => h('button', { type: 'button', class: 'btn btn-discret mono', onclick: () => ajouter(tt(k)) }, tt(k))));
    const boutonLancer = h('button', { type: 'button', class: 'btn btn-principal' }, tt('lancer'));
    const boutonEffacer = h('button', { type: 'button', class: 'btn btn-discret' }, tt('effacer'));
    function majCompteur() {
      const a = L.analyserProgramme(editeur.value);
      const n = a.erreur ? editeur.value.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).length : a.lignes;
      compteur.textContent = tt('lignes', { n, max: cfg.maxLignes });
      compteur.classList.toggle('trop', n > cfg.maxLignes);
    }
    editeur.addEventListener('input', majCompteur);
    let enCours = null, envoye = false;
    function arreter() {
      if (enCours) { clearTimeout(enCours.minuteur); enCours = null; }
      boutonLancer.textContent = tt('lancer');
    }
    function remettre() {
      Object.values(cadeaux).forEach(e => e.classList.remove('pris'));
      boom.classList.remove('visible');
      robot.classList.remove('secoue');
      placer(depart.x, depart.y, 0);
    }
    boutonEffacer.addEventListener('click', () => { arreter(); editeur.value = ''; remettre(); majCompteur(); etat.textContent = ''; });
    boutonLancer.addEventListener('click', () => {
      if (enCours) { arreter(); return; }
      remettre();
      const a = L.analyserProgramme(editeur.value);
      if (a.erreur) { etat.textContent = tt('err_' + a.erreur.code, { l: a.erreur.ligne + 1, x: a.erreur.texte || '' }); etat.className = 'etat-robot petit erreur'; return; }
      if (!a.lignes) { etat.textContent = tt('vide_prog'); etat.className = 'etat-robot petit erreur'; return; }
      const r = L.executerProgramme(a.prog, grille);
      const lignesSrc = editeur.value.split('\n');
      let k = 0;
      boutonLancer.textContent = tt('stop');
      etat.className = 'etat-robot petit';
      const vitesse = reduit() ? 60 : 320;
      const etape = () => {
        if (!zone.isConnected) return;
        const p = r.trace[k];
        placer(p.x, p.y, p.dir);
        const c = cadeaux[p.x + ',' + p.y];
        if (c) c.classList.add('pris');
        if (p.ligne >= 0) etat.textContent = tt('ligne_en_cours', { l: p.ligne + 1 }) + ' : ' + (lignesSrc[p.ligne] || '').trim();
        k++;
        if (k < r.trace.length) { enCours.minuteur = setTimeout(etape, vitesse); return; }
        arreter();
        if (r.crash) {
          boom.setAttribute('x', r.crash.x * T + T / 2); boom.setAttribute('y', r.crash.y * T + T * 0.68);
          boom.classList.add('visible'); robot.classList.add('secoue');
          etat.textContent = tt('crash', { l: r.crash.ligne + 1 }); etat.className = 'etat-robot petit erreur';
        } else if (r.tropLong) { etat.textContent = tt('trop_long'); etat.className = 'etat-robot petit erreur'; }
        else if (r.pris < r.total) { etat.textContent = tt('manque_cadeaux', { p: r.pris, t: r.total }); etat.className = 'etat-robot petit erreur'; }
        else if (!r.surTraineau) { etat.textContent = tt('pas_traineau'); etat.className = 'etat-robot petit erreur'; }
        else if (a.lignes > cfg.maxLignes) { etat.textContent = tt('trop_lignes', { n: a.lignes, max: cfg.maxLignes }); etat.className = 'etat-robot petit erreur'; }
        else {
          etat.textContent = tt('robot_ok'); etat.className = 'etat-robot petit ok';
          if (!envoye) { envoye = true; api.soumettre({ programme: editeur.value }).then(x => { if (!x.ok) envoye = false; }); }
        }
      };
      enCours = { minuteur: setTimeout(etape, 50) };
    });
    remettre();
    majCompteur();
    zone.append(h('div', { class: 'atelier-robot' },
      h('div', { class: 'cadre-grille' }, svg),
      h('div', { class: 'cote-programme' }, h('p', { class: 'petit' }, tt('programme'), ' ', compteur), editeur, palette,
        h('div', { class: 'boutons-robot' }, boutonLancer, boutonEffacer), etat)));
  };

  /* ---------- Jour 11 : l'assiette (pile) et le passe-plat (file) ---------- */
  W.crepes = (cfg) => (zone, api) => {
    const ops = [];
    const cuisine = h('div', { class: 'file-crepes cuisine' });
    const assiette = h('div', { class: 'pile-crepes' });
    const passe = h('div', { class: 'file-crepes passe' });
    const servies = h('div', { class: 'mot-servi' });
    const crepe = (l, classe) => h('span', { class: 'crepe ' + (classe || '') }, l);
    const b = (cle, op) => h('button', { type: 'button', class: 'btn', onclick: () => jouer(op) }, tt(cle));
    const bPoser = b('b_poser', 'P'), bPasse = b('b_passe', 'F'), bServirP = b('b_servir_p', 'p'), bServirF = b('b_servir_f', 'f');
    const bAnnuler = h('button', { type: 'button', class: 'btn btn-discret', onclick: () => { ops.pop(); maj(); } }, tt('annuler'));
    const bRecommencer = h('button', { type: 'button', class: 'btn btn-discret', onclick: () => { ops.length = 0; maj(); } }, tt('recommencer'));
    let envoye = false;
    function jouer(op) { ops.push(op); maj(op); }
    function maj(dernier) {
      const r = L.simulerCrepes(cfg.arrivee, ops);
      if (r.erreur) { ops.pop(); return; }
      cuisine.innerHTML = ''; assiette.innerHTML = ''; passe.innerHTML = ''; servies.innerHTML = '';
      [...cfg.arrivee.slice(r.suivante)].forEach((l, i) => cuisine.append(crepe(l, i === 0 ? 'prochaine' : '')));
      r.pile.forEach((l, i) => assiette.append(crepe(l, i === r.pile.length - 1 ? 'dessus' : '')));
      r.file.forEach((l, i) => passe.append(crepe(l, i === 0 ? 'premier' : '')));
      let faute = -1;
      [...cfg.mot].forEach((l, i) => {
        const servi = r.servi[i];
        if (servi !== undefined && servi !== l && faute < 0) faute = i;
        servies.append(h('span', { class: 'lettre-servie' + (servi === undefined ? '' : servi === l && (faute < 0 || i < faute) ? ' bonne' : ' fausse') }, servi || '·'));
      });
      if (faute >= 0 && (dernier === 'p' || dernier === 'f') && r.servi.length === faute + 1) api.message(tt('mauvaise_lettre', { a: cfg.mot[faute], b: r.servi[faute] }), 'erreur');
      const reste = r.suivante < cfg.arrivee.length;
      bPoser.disabled = bPasse.disabled = !reste;
      bServirP.disabled = !r.pile.length;
      bServirF.disabled = !r.file.length;
      bAnnuler.disabled = bRecommencer.disabled = !ops.length;
      if (r.servi === cfg.mot && !envoye) {
        envoye = true;
        api.message(tt('crepes_ok'), 'info');
        api.soumettre({ ops: ops.join('') }).then(x => { if (!x.ok) envoye = false; });
      }
    }
    maj();
    zone.append(h('div', { class: 'cuisine-crepes' },
      h('p', { class: 'petit' }, tt('mot_attendu'), ' ', h('b', { class: 'mono' }, cfg.mot)),
      h('div', { class: 'zone-crepes' }, h('p', { class: 'petit' }, tt('cuisine')), cuisine),
      h('div', { class: 'deux-rangements' },
        h('div', { class: 'zone-crepes' }, h('p', { class: 'petit' }, tt('assiette')), h('div', { class: 'assiette-crepes' }, assiette)),
        h('div', { class: 'zone-crepes' }, h('p', { class: 'petit' }, tt('passe')), passe)),
      h('div', { class: 'boutons-crepes' }, bPoser, bPasse, bServirP, bServirF),
      h('div', { class: 'zone-crepes' }, h('p', { class: 'petit' }, tt('servies')), servies),
      h('div', { class: 'centre' }, bAnnuler, ' ', bRecommencer)));
  };

  /* ---------- Jour 15 : la trieuse d'étiquettes (expressions régulières) ---------- */
  W.trieuse = (cfg) => (zone, api) => {
    const champ = h('input', { type: 'text', class: 'champ-libre mono', value: cfg.depart || '', 'aria-label': tt('motif'), autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off' });
    const alerte = h('p', { class: 'petit erreur-motif', hidden: true });
    const bilan = h('p', { class: 'bilan-tests' });
    const liste = (titre, etiquettes, garder) => {
      const items = etiquettes.map(e => ({ e, garder, li: h('li', {}, h('code', {}, e), h('span', { class: 'verdict' })) }));
      return { items, bloc: h('div', { class: 'colonne-tri' }, h('p', { class: 'petit' }, titre), h('ul', { class: 'liste-tri' }, items.map(x => x.li))) };
    };
    const g = liste(tt('garder'), cfg.garder, true), j = liste(tt('jeter'), cfg.jeter, false);
    const tous = [...g.items, ...j.items];
    const bouton = h('button', { type: 'button', class: 'btn btn-principal' }, tt('envoyer_motif'));
    function maj() {
      let re = null;
      alerte.hidden = true;
      try { if (champ.value) re = new RegExp(champ.value); } catch (e) { alerte.textContent = tt('motif_invalide', { e: e.message.replace(/^Invalid regular expression: /, '') }); alerte.hidden = false; }
      let bons = 0;
      tous.forEach(x => {
        const accepte = re ? re.test(x.e) : false;
        const juste = accepte === x.garder;
        if (juste && re) bons++;
        x.li.className = !re ? '' : juste ? 'juste' : 'faux';
        x.li.querySelector('.verdict').textContent = !re ? '' : (accepte ? tt('accepte') : tt('refuse')) + (juste ? ' ✅' : ' ❌');
      });
      bilan.textContent = re ? tt('bien_triees', { n: bons, t: tous.length }) : '';
      bilan.classList.toggle('tous', bons === tous.length);
    }
    champ.addEventListener('input', maj);
    bouton.addEventListener('click', () => { if (champ.value.trim()) api.soumettre({ motif: champ.value }); else api.message(t('Écris une réponse avant de valider.'), 'info'); });
    maj();
    zone.append(h('label', { class: 'petit' }, tt('motif')), champ, alerte, bilan, h('div', { class: 'deux-colonnes-tri' }, g.bloc, j.bloc), h('div', { class: 'centre' }, bouton));
  };

  /* ---------- Jour 17 : la console SQL de la Bibliothèque ---------- */
  // Un petit moteur SQL : SELECT … FROM … [WHERE …] [ORDER BY …] [LIMIT n]
  function moteurSQL(tables) {
    const norm = (v) => L.sansAccents(String(v)).toLowerCase();
    const noms = Object.keys(tables);
    class ErreurSQL extends Error {}
    const err = (cle, vars) => { throw new ErreurSQL(tt(cle, vars)); };
    function jetons(sql) {
      const r = [];
      const re = /\s*(?:(\d+(?:\.\d+)?)|'((?:[^']|'')*)'|"([^"]*)"|([A-Za-z_][A-Za-z0-9_]*)|(<=|>=|!=|<>|[=<>*(),;]))/y;
      let i = 0;
      while (i < sql.length) {
        if (/^\s*$/.test(sql.slice(i))) break;
        re.lastIndex = i;
        const m = re.exec(sql);
        if (!m) { if (/['"]/.test(sql.slice(i).trim()[0])) err('sql_guillemet'); err('sql_trop', { x: sql.slice(i).trim().slice(0, 20) }); }
        if (m[1] !== undefined) r.push({ t: 'nombre', v: Number(m[1]) });
        else if (m[2] !== undefined) r.push({ t: 'texte', v: m[2].replace(/''/g, "'") });
        else if (m[3] !== undefined) r.push({ t: 'texte', v: m[3] });
        else if (m[4] !== undefined) r.push({ t: 'mot', v: m[4], u: m[4].toUpperCase() });
        else r.push({ t: 'sym', v: m[5] === '<>' ? '!=' : m[5] });
        i = re.lastIndex;
      }
      return r;
    }
    function executer(sql) {
      const tk = jetons(sql.trim());
      let p = 0;
      const voir = () => tk[p];
      const estMot = (u) => tk[p] && tk[p].t === 'mot' && tk[p].u === u;
      const estSym = (v) => tk[p] && tk[p].t === 'sym' && tk[p].v === v;
      const montrer = () => (tk[p] ? String(tk[p].v) : '…');
      const attendreMot = (u, quoi) => { if (!estMot(u)) err(tk[p] ? 'sql_attendu' : 'sql_fin', { a: quoi || u, x: montrer() }); p++; };
      if (!estMot('SELECT')) err('sql_select');
      p++;
      // Ce qu'on affiche
      const colonnesDemandees = [];
      let compter = false;
      if (estSym('*')) { p++; colonnesDemandees.push('*'); }
      else {
        for (;;) {
          if (estMot('COUNT')) { p++; if (!estSym('(')) err('sql_attendu', { a: '(', x: montrer() }); p++; if (!estSym('*')) err('sql_attendu', { a: '*', x: montrer() }); p++; if (!estSym(')')) err('sql_attendu', { a: ')', x: montrer() }); p++; compter = true; }
          else if (voir() && voir().t === 'mot' && !['FROM'].includes(voir().u)) { colonnesDemandees.push(voir().v); p++; }
          else err(tk[p] ? 'sql_attendu' : 'sql_fin', { a: EN ? 'a column name' : 'un nom de colonne', x: montrer() });
          if (estSym(',')) { p++; continue; }
          break;
        }
      }
      if (!estMot('FROM')) err('sql_from');
      p++;
      if (!voir() || voir().t !== 'mot') err('sql_from');
      const nomTable = noms.find(n => n.toLowerCase() === voir().v.toLowerCase());
      if (!nomTable) err('sql_table', { x: voir().v, t: noms.join(', ') });
      p++;
      const table = tables[nomTable];
      const indexCol = (nom) => {
        const i = table.colonnes.findIndex(c => c.toLowerCase() === String(nom).toLowerCase());
        if (i < 0) err('sql_colonne', { x: nom, tb: nomTable, c: table.colonnes.join(', ') });
        return i;
      };
      colonnesDemandees.filter(c => c !== '*').forEach(indexCol);
      // WHERE : expressions avec AND, OR, NOT et parenthèses
      function valeur() {
        const x = voir();
        if (!x) err('sql_fin');
        if (x.t === 'nombre' || x.t === 'texte') { p++; return { c: x.v }; }
        if (x.t === 'mot') { p++; return { col: indexCol(x.v) }; }
        err('sql_attendu', { a: tt('sql_valeur'), x: montrer() });
      }
      function comparaison() {
        if (estSym('(')) { p++; const e = ou(); if (!estSym(')')) err('sql_attendu', { a: ')', x: montrer() }); p++; return e; }
        if (estMot('NOT')) { p++; const e = comparaison(); return (l) => !e(l); }
        const a = valeur();
        let op;
        if (estMot('LIKE')) op = 'LIKE';
        else if (voir() && voir().t === 'sym' && ['=', '!=', '<', '>', '<=', '>='].includes(voir().v)) op = voir().v;
        else err(tk[p] ? 'sql_attendu' : 'sql_fin', { a: tt('sql_operateur'), x: montrer() });
        p++;
        const b = valeur();
        const lire = (v, l) => (v.col !== undefined ? l[v.col] : v.c);
        return (l) => {
          const x = lire(a, l), y = lire(b, l);
          if (op === 'LIKE') {
            const re = new RegExp('^' + norm(y).split('').map(ch => (ch === '%' ? '.*' : ch === '_' ? '.' : ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).join('') + '$');
            return re.test(norm(x));
          }
          const nombres = typeof x === 'number' && typeof y === 'number';
          const u = nombres ? x : norm(x), v = nombres ? y : norm(y);
          return op === '=' ? u === v : op === '!=' ? u !== v : op === '<' ? u < v : op === '>' ? u > v : op === '<=' ? u <= v : u >= v;
        };
      }
      function et() { let e = comparaison(); while (estMot('AND')) { p++; const a = e, b = comparaison(); e = (l) => a(l) && b(l); } return e; }
      function ou() { let e = et(); while (estMot('OR')) { p++; const a = e, b = et(); e = (l) => a(l) || b(l); } return e; }
      let lignes = table.lignes.slice();
      if (estMot('WHERE')) { p++; const f = ou(); lignes = lignes.filter(f); }
      if (estMot('ORDER')) {
        p++; attendreMot('BY');
        const cles = [];
        for (;;) {
          if (!voir() || voir().t !== 'mot') err(tk[p] ? 'sql_attendu' : 'sql_fin', { a: EN ? 'a column name' : 'un nom de colonne', x: montrer() });
          const i = indexCol(voir().v); p++;
          let sens = 1;
          if (estMot('DESC')) { sens = -1; p++; } else if (estMot('ASC')) p++;
          cles.push([i, sens]);
          if (estSym(',')) { p++; continue; }
          break;
        }
        lignes.sort((a, b) => {
          for (const [i, sens] of cles) {
            const x = a[i], y = b[i];
            const c = typeof x === 'number' && typeof y === 'number' ? x - y : norm(x).localeCompare(norm(y));
            if (c) return c * sens;
          }
          return 0;
        });
      }
      if (estMot('LIMIT')) { p++; if (!voir() || voir().t !== 'nombre') err('sql_limit'); lignes = lignes.slice(0, voir().v); p++; }
      if (estSym(';')) p++;
      if (p < tk.length) err('sql_trop', { x: tk.slice(p).map(x => x.v).join(' ').slice(0, 30) });
      if (compter) return { colonnes: ['COUNT(*)'], lignes: [[lignes.length]] };
      const idx = colonnesDemandees.flatMap(c => (c === '*' ? table.colonnes.map((_, i) => i) : [indexCol(c)]));
      return { colonnes: idx.map(i => table.colonnes[i]), lignes: lignes.map(l => idx.map(i => l[i])) };
    }
    return { executer, ErreurSQL };
  }
  W.sql = (cfg) => (zone) => {
    const moteur = moteurSQL(cfg.tables);
    const sortie = h('div', { class: 'term-sortie sql-sortie', 'aria-live': 'polite' });
    const champ = h('textarea', { class: 'term-champ sql-champ', rows: '2', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', 'aria-label': tt('commande'), placeholder: 'SELECT …' });
    const bouton = h('button', { type: 'submit', class: 'btn btn-principal sql-executer' }, '▶');
    const form = h('form', { class: 'sql-ligne' }, h('span', { class: 'term-invite' }, 'sql>'), champ, bouton);
    const ecran = h('div', { class: 'terminal console-sql' }, sortie, form);
    const ecrire = (contenu, classe) => { const l = h('div', { class: 'term-l ' + (classe || '') }); if (contenu.nodeType) l.append(contenu); else l.textContent = contenu; sortie.append(l); sortie.scrollTop = sortie.scrollHeight; };
    const historique = [];
    let pos = 0;
    const MAX = 40;
    function lancer(sql) {
      ecrire('sql> ' + sql, 'term-cmd');
      if (/^\s*(help|aide)\s*;?\s*$/i.test(sql)) { ecrire(tt('sql_aide'), 'term-info'); return; }
      if (/^\s*clear\s*;?\s*$/i.test(sql)) { sortie.innerHTML = ''; return; }
      try {
        const r = moteur.executer(sql);
        const table = h('table', { class: 'tableau compact table-sql' }, h('tr', {}, r.colonnes.map(c => h('th', {}, c))),
          r.lignes.slice(0, MAX).map(l => h('tr', {}, l.map(v => h('td', {}, String(v))))));
        ecrire(h('div', { class: 'defilement' }, table));
        ecrire(tt('sql_lignes', { n: r.lignes.length }) + (r.lignes.length > MAX ? ' ' + tt('sql_coupe', { n: MAX }) : ''), 'term-info');
      } catch (e) {
        if (e instanceof moteur.ErreurSQL) ecrire(tt('sql_err', { e: e.message }), 'term-erreur');
        else throw e;
      }
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sql = champ.value.trim();
      if (!sql) return;
      historique.push(sql); pos = historique.length;
      champ.value = '';
      lancer(sql);
    });
    champ.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
      else if (e.key === 'ArrowUp' && !champ.value.includes('\n')) { e.preventDefault(); if (pos > 0) champ.value = historique[--pos]; }
      else if (e.key === 'ArrowDown' && !champ.value.includes('\n')) { e.preventDefault(); if (pos < historique.length - 1) champ.value = historique[++pos]; else { pos = historique.length; champ.value = ''; } }
    });
    ecran.addEventListener('click', () => { if (!window.getSelection().toString()) champ.focus({ preventScroll: true }); });
    ecrire(tt('sql_accueil', { t: Object.keys(cfg.tables).join(', ') }), 'term-info');
    ecrire(tt('sql_aide'), 'term-info');
    zone.append(ecran);
  };

  /* ---------- Jour 19 : le profil Kèrebook de la Kère + l'attaque par force brute ---------- */
  W.kerebook = (cfg) => (zone) => {
    const p = cfg.profil;
    const profil = h('div', { class: 'kb-profil' },
      h('div', { class: 'kb-couverture' }, h('span', { class: 'kb-logo' }, 'kèrebook')),
      h('div', { class: 'kb-identite' }, h('span', { class: 'kb-avatar', 'aria-hidden': 'true' }, p.avatar), h('div', {}, h('b', {}, p.nom), h('small', {}, p.bio))));
    const fil = h('div', { class: 'kb-fil' }, h('p', { class: 'petit' }, tt('publications')), cfg.posts.map(x => h('article', { class: 'kb-post' },
      h('header', {}, h('span', { class: 'kb-mini', 'aria-hidden': 'true' }, p.avatar), h('div', {}, h('b', {}, p.nom), h('small', {}, x.date))),
      h('p', {}, x.texte),
      x.image ? h('div', { class: 'kb-image', 'aria-hidden': 'true' }, x.image) : null,
      h('footer', {}, h('small', {}, '❤️ ' + x.likes + ' · ' + tt('jaime'))),
      (x.commentaires || []).map(c => h('div', { class: 'kb-commentaire' }, h('b', {}, c.auteur), ' ', c.texte)))));
    // L'attaque par force brute : le calcul, puis un compteur qui défile… et l'abandon
    const resultat = h('div', { class: 'kb-force', 'aria-live': 'polite' });
    const bouton = h('button', { type: 'button', class: 'btn' }, tt('force_lancer'));
    bouton.addEventListener('click', async () => {
      bouton.disabled = true;
      const comb = Math.pow(cfg.alphabet, cfg.longueur);
      const annees = comb / cfg.vitesse / 31557600;
      const duree = annees >= 1e6 ? (EN ? `${I18N.nombre(Math.round(annees / 1e6))} million years` : `${I18N.nombre(Math.round(annees / 1e6))} millions d'années`) : (EN ? `${I18N.nombre(Math.round(annees))} years` : `${I18N.nombre(Math.round(annees))} ans`);
      resultat.innerHTML = '';
      resultat.append(h('p', {}, tt('force_calcul', { l: cfg.longueur, a: cfg.alphabet, c: I18N.nombre(comb), v: I18N.nombre(cfg.vitesse), d: duree })));
      const compteur = h('code', { class: 'kb-compteur' }, 'a'.repeat(cfg.longueur));
      resultat.append(compteur);
      const lettres = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let n = 0;
      const t0 = performance.now();
      await new Promise(fin => {
        const pas = () => {
          if (!zone.isConnected) return fin();
          n += 37;
          let x = n, mot = '';
          for (let i = 0; i < cfg.longueur; i++) { mot = lettres[x % 36] + mot; x = Math.floor(x / 36); }
          compteur.textContent = mot;
          if (performance.now() - t0 < (reduit() ? 300 : 3200)) requestAnimationFrame(pas); else fin();
        };
        requestAnimationFrame(pas);
      });
      resultat.append(h('p', { class: 'kb-abandon' }, tt('force_abandon', { d: duree })));
      bouton.disabled = false;
    });
    zone.append(h('div', { class: 'kerebook' }, profil, fil), h('div', { class: 'kb-attaque' }, h('p', { class: 'petit' }, tt('force_titre')), bouton, resultat));
  };

  /* ---------- Jour 20 : la machine à empreintes (SHA-256) ---------- */
  W.empreintes = (cfg) => (zone) => {
    const texte = h('textarea', { class: 'champ-libre machine-texte', rows: '4', spellcheck: 'false', 'aria-label': tt('texte_machine') });
    const sortie = h('div', { class: 'machine-sortie' });
    function maj() {
      const v = texte.value.replace(/\r\n/g, '\n').trim();
      if (!v) { sortie.innerHTML = ''; return; }
      const e = global.sha256(v);
      const court = e.slice(0, 10);
      const trouve = cfg.registre.find(r => r.empreinte === court);
      sortie.innerHTML = '';
      sortie.append(h('p', {}, tt('empreinte'), ' ', h('code', { class: 'empreinte-courte' }, court), h('code', { class: 'empreinte-reste' }, e.slice(10))),
        h('p', { class: trouve ? 'ok' : 'non' }, trouve ? tt('correspond', { e: trouve.enfant }) : tt('correspond_aucun')));
    }
    texte.addEventListener('input', maj);
    const lettres = h('div', { class: 'lettres-matin' }, cfg.lettres.map(l => h('div', { class: 'lettre-enfant' },
      h('p', {}, l.texte),
      h('button', { type: 'button', class: 'btn btn-discret', onclick: () => { texte.value = l.texte; maj(); texte.scrollIntoView({ block: 'nearest', behavior: reduit() ? 'auto' : 'smooth' }); } }, tt('passer_machine')))));
    const registre = h('table', { class: 'tableau compact registre' }, h('tr', {}, h('th', {}, tt('enfant')), h('th', {}, tt('empreinte').replace(/\s*:$/, ''))),
      cfg.registre.map(r => h('tr', {}, h('td', {}, r.enfant), h('td', {}, h('code', {}, r.empreinte)))));
    zone.append(
      h('p', { class: 'petit' }, tt('lettres_matin')), lettres,
      h('div', { class: 'machine-empreintes' }, h('p', { class: 'petit' }, tt('machine')), texte, sortie),
      h('div', { class: 'deux-colonnes-tri' },
        h('div', {}, h('p', { class: 'petit' }, tt('registre')), h('div', { class: 'defilement' }, registre)),
        h('div', {}, h('p', { class: 'petit' }, tt('catalogue')), h('ul', { class: 'catalogue' }, cfg.catalogue.map(c => h('li', {}, h('code', {}, c)))))));
  };

  /* ---------- Jour 12 : le code Morse (la radio qui bipe) ----------
     cfg = { message: 'RUDOLPH' }
     Le message est imprimé sur la bande de papier, un groupe de signaux par lettre ; « Écouter » le
     rejoue (bips, voyant, groupe en cours allumé). Le tableau du Morse reste sous les yeux.
     Le manipulateur sert à s'entraîner ou à vérifier un groupe : appui court = ti (•), appui long = taa (—),
     la lettre s'affiche après un petit silence. Rien n'est envoyé au serveur : la réponse se tape. */
  const MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--',
    N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..' };
  W.morse = (cfg) => (zone, api) => {
    const INVERSE = Object.fromEntries(Object.entries(MORSE).map(([l, c]) => [c, l]));
    const signes = (code) => code.replace(/\./g, '•').replace(/-/g, '—');
    const UNITE = 110;      // durée d'un ti à l'écoute (ms) ; un taa = 3 ti
    const SEUIL = 230;      // manipulateur : appui plus court = ti, plus long = taa
    const FIN_LETTRE = 850; // manipulateur : silence qui termine la lettre

    /* Le bip : un son continu tant que la touche est enfoncée (volume des bruitages du jeu) */
    let ctx = null, osc = null, gain = null;
    const volume = () => (api && api.volumeSons ? api.volumeSons() : 0.7);
    const bipDebut = () => {
      const v = volume();
      if (!(v > 0) || osc) return;
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        osc = ctx.createOscillator(); gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = 660;
        const t = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.22 * v * v, t + 0.01);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
      } catch (e) { osc = null; }
    };
    const bipFin = () => {
      if (!osc) return;
      const t = ctx.currentTime, o = osc;
      gain.gain.setTargetAtTime(0.0001, t, 0.01);
      o.stop(t + 0.06);
      osc = null;
    };

    /* 1. La bande imprimée par la radio, et l'écoute */
    const lettres = [...cfg.message];
    const voyant = h('span', { class: 'voyant-morse', 'aria-hidden': 'true' });
    const groupes = lettres.map((l, i) => h('span', { class: 'groupe-morse' },
      h('b', {}, signes(MORSE[l])), h('small', {}, String(i + 1))));
    const bEcouter = h('button', { type: 'button', class: 'btn' }, tt('mo_ecouter'));
    let enLecture = false;
    bEcouter.addEventListener('click', async () => {
      if (enLecture) return;
      enLecture = true; bEcouter.disabled = true; bEcouter.textContent = tt('mo_ecoute');
      for (let i = 0; i < lettres.length && zone.isConnected; i++) {
        groupes.forEach((g, k) => g.classList.toggle('joue', k === i));
        for (const s of MORSE[lettres[i]]) {
          voyant.classList.add('allume'); bipDebut();
          await pause(s === '.' ? UNITE : 3 * UNITE);
          voyant.classList.remove('allume'); bipFin();
          await pause(UNITE);
        }
        await pause(4 * UNITE);
      }
      groupes.forEach(g => g.classList.remove('joue'));
      enLecture = false; bEcouter.disabled = false; bEcouter.textContent = tt('mo_ecouter');
    });

    /* 2. Le tableau du Morse */
    const table = h('div', { class: 'table-morse' }, Object.entries(MORSE).map(([l, c]) =>
      h('span', { class: 'case-morse' }, h('b', {}, l), h('span', {}, signes(c)))));

    /* 3. Le manipulateur */
    const touche = h('button', { type: 'button', class: 'touche-morse', 'aria-label': tt('mo_touche_aria') }, tt('mo_touche'));
    const encours = h('span', { class: 'encours-morse mono' });
    const tape = h('div', { class: 'tape-morse', 'aria-live': 'polite' });
    const tapees = [];
    let code = '', debut = 0, minuteur = null;
    const majTape = () => {
      encours.textContent = code ? signes(code) : '';
      tape.replaceChildren(...(tapees.length ? tapees.map(([l, c]) =>
        h('span', { class: 'lettre-tapee' + (l === '?' ? ' inconnue' : '') }, h('b', {}, l), h('small', {}, signes(c))))
        : [h('span', { class: 'petit' }, tt('mo_rien'))]));
    };
    const finirLettre = () => {
      if (!code) return;
      tapees.push([INVERSE[code] || '?', code]);
      if (tapees.length > 14) tapees.shift();
      code = '';
      majTape();
    };
    const ajouter = (s) => {
      clearTimeout(minuteur);
      code += s;
      if (code.length > 5) { finirLettre(); return; }
      majTape();
      minuteur = setTimeout(finirLettre, FIN_LETTRE);
    };
    const appuyer = () => {
      if (debut) return;
      debut = performance.now();
      clearTimeout(minuteur);
      touche.classList.add('enfoncee');
      bipDebut();
    };
    const relacher = () => {
      if (!debut) return;
      const duree = performance.now() - debut;
      debut = 0;
      touche.classList.remove('enfoncee');
      bipFin();
      ajouter(duree < SEUIL ? '.' : '-');
    };
    touche.addEventListener('pointerdown', (e) => { e.preventDefault(); try { touche.setPointerCapture(e.pointerId); } catch (x) { /* rien */ } appuyer(); });
    touche.addEventListener('pointerup', relacher);
    touche.addEventListener('pointercancel', relacher);
    touche.addEventListener('contextmenu', (e) => e.preventDefault());
    touche.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) appuyer(); } });
    touche.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); relacher(); } });
    touche.addEventListener('blur', relacher);
    // Pour qui préfère cliquer : un bouton ti, un bouton taa
    const bTi = h('button', { type: 'button', class: 'btn btn-discret' }, tt('mo_ti'));
    const bTaa = h('button', { type: 'button', class: 'btn btn-discret' }, tt('mo_taa'));
    const bEffacer = h('button', { type: 'button', class: 'btn btn-discret' }, tt('mo_effacer'));
    bTi.addEventListener('click', () => ajouter('.'));
    bTaa.addEventListener('click', () => ajouter('-'));
    bEffacer.addEventListener('click', () => { clearTimeout(minuteur); code = ''; tapees.length = 0; majTape(); });
    majTape();

    zone.append(h('div', { class: 'poste-morse' },
      h('div', { class: 'recepteur-morse' },
        h('p', { class: 'petit' }, voyant, ' ', tt('mo_bande')),
        h('div', { class: 'bande-morse' }, groupes),
        h('div', { class: 'centre' }, bEcouter)),
      h('p', { class: 'petit' }, tt('mo_table')), table,
      h('div', { class: 'manip-morse' },
        h('p', { class: 'petit' }, tt('mo_manip')),
        h('div', { class: 'ligne-manip' }, touche, h('div', { class: 'cote-manip' }, h('p', { class: 'petit' }, tt('mo_encours'), ' ', encours), h('div', { class: 'boutons-manip' }, bTi, bTaa, bEffacer))),
        tape)));
  };

  /* ---------- Jour 16 : l'affiche en pixels, en plusieurs couleurs (le vrai RLE : « 3B 2R ») ----------
     cfg = { lignes: ['7B 1G 7B', …], largeur: 15, palette: [{ l: 'B', nom: 'blanc', c: '#ffffff' }, …] }
     La 1re couleur de la palette est le fond : toutes les cases commencent de cette couleur.
     Rien n'est envoyé au serveur : la réponse, c'est ce que montre l'image. */
  W.pixelsCouleurs = (cfg) => (zone) => {
    const { lignes, largeur, palette } = cfg;
    const fond = palette[0].l;
    const teinte = Object.fromEntries(palette.map(p => [p.l, p.c]));
    // Ce que chaque ligne doit donner, case par case
    const attendu = lignes.map(l => l.trim().split(/\s+/).map(m => /^(\d+)([A-Z])$/.exec(m)).map(x => x[2].repeat(+x[1])).join(''));
    const etat = lignes.map(() => Array(largeur).fill(fond));
    let pinceau = palette[1].l;

    const boutons = palette.map(p => {
      const b = h('button', { type: 'button', class: 'couleur-palette', 'aria-pressed': String(p.l === pinceau), title: p.nom },
        h('span', { class: 'pastille', style: { background: p.c } }), h('b', {}, p.l), ' ', p.nom);
      b.addEventListener('click', () => { pinceau = p.l; boutons.forEach((x, k) => x.setAttribute('aria-pressed', String(palette[k].l === pinceau))); });
      return b;
    });
    const codes = lignes.map((l, i) => h('li', { title: tt('ligne', { n: i + 1 }) }, h('code', {}, l), h('span', { class: 'coche' }, '✓')));
    const bilan = h('p', { class: 'bilan-tests' });
    const grille = h('div', { class: 'grille-pixels grille-affiche', style: { gridTemplateColumns: `repeat(${largeur}, 1fr)` } });
    const cases = [];
    lignes.forEach((_, i) => { for (let j = 0; j < largeur; j++) {
      const c = h('div', { class: 'pixel', 'data-i': i, 'data-j': j, style: { background: teinte[fond] } });
      cases.push(c); grille.append(c);
    } });

    // Le bandeau au-dessus de la grille : le code de la ligne qu'on touche (sur téléphone, la liste est loin)
    const courante = h('p', { class: 'ligne-courante' }, tt('ligne_aide'));
    let montree = -1;
    const montrer = (i) => {
      montree = i;
      courante.replaceChildren(h('b', {}, tt('ligne', { n: i + 1 }) + ' : '), h('code', {}, lignes[i]), codes[i].classList.contains('juste') ? h('span', { class: 'coche' }, ' ✓') : '');
    };
    const verifierLigne = (i) => {
      codes[i].classList.toggle('juste', etat[i].join('') === attendu[i]);
      if (i === montree) montrer(i);
    };
    const majBilan = () => {
      const n = codes.filter(li => li.classList.contains('juste')).length;
      bilan.textContent = n === lignes.length ? tt('affiche_ok') : tt('lignes_justes', { n, t: lignes.length });
      bilan.classList.toggle('tous', n === lignes.length);
    };
    const peindre = (c, couleur) => {
      const i = +c.dataset.i, j = +c.dataset.j;
      if (etat[i][j] === couleur) return;
      etat[i][j] = couleur;
      c.style.background = teinte[couleur];
      verifierLigne(i);
      majBilan();
    };

    // Un trait : sur une case déjà de la couleur du pinceau, il efface (remet le fond)
    let trait = null;
    grille.addEventListener('pointerdown', (e) => {
      const c = e.target.closest('.pixel');
      if (!c) return;
      e.preventDefault();
      trait = etat[+c.dataset.i][+c.dataset.j] === pinceau ? fond : pinceau;
      montrer(+c.dataset.i);
      peindre(c, trait);
    });
    grille.addEventListener('pointermove', (e) => {
      if (trait === null) return;
      const c = document.elementFromPoint(e.clientX, e.clientY);
      if (c && c.classList.contains('pixel') && grille.contains(c)) peindre(c, trait);
    });
    const stop = () => { trait = null; };
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    // Survoler une case montre sa ligne dans le code (pour ne pas perdre le fil)
    let survolee = -1;
    grille.addEventListener('pointerover', (e) => {
      const c = e.target.closest('.pixel');
      const i = c ? +c.dataset.i : -1;
      if (i === survolee) return;
      if (survolee >= 0) codes[survolee].classList.remove('survol');
      survolee = i;
      if (i >= 0) { codes[i].classList.add('survol'); montrer(i); }
    });
    grille.addEventListener('pointerleave', () => { if (survolee >= 0) codes[survolee].classList.remove('survol'); survolee = -1; });

    const effacer = h('button', { type: 'button', class: 'btn' }, tt('effacer'));
    effacer.addEventListener('click', () => {
      cases.forEach(c => { etat[+c.dataset.i][+c.dataset.j] = fond; c.style.background = teinte[fond]; });
      lignes.forEach((_, i) => verifierLigne(i));
      majBilan();
    });
    lignes.forEach((_, i) => verifierLigne(i));
    majBilan();
    zone.append(
      h('p', { class: 'petit' }, tt('palette')), h('div', { class: 'palette-pixels' }, boutons),
      h('div', { class: 'atelier-pixels' },
        h('div', {}, h('p', { class: 'petit' }, tt('code_recu')), h('ol', { class: 'codes-rle codes-couleurs' }, codes)),
        h('div', { class: 'zone-grille' }, courante, grille, bilan, h('div', { class: 'centre' }, effacer))));
  };

  /* ---------- Jour 23 : régler le « neurone » du robot ---------- */
  W.neurone = (cfg) => (zone, api) => {
    const poids = Object.fromEntries(cfg.criteres.map(c => [c.k, 0]));
    let seuil = 1, envoye = false;
    const reglage = (libelle, lire, ecrire, min, max) => {
      const valeur = h('output', { class: 'valeur-reglage' });
      const moins = h('button', { type: 'button', class: 'btn btn-discret', 'aria-label': libelle + ' −' }, tt('moins'));
      const plus = h('button', { type: 'button', class: 'btn btn-discret', 'aria-label': libelle + ' +' }, tt('plus'));
      const majV = () => { const v = lire(); valeur.textContent = (v > 0 ? '+' : '') + v; moins.disabled = v <= min; plus.disabled = v >= max; };
      moins.addEventListener('click', () => { ecrire(Math.max(min, lire() - 1)); majV(); maj(); });
      plus.addEventListener('click', () => { ecrire(Math.min(max, lire() + 1)); majV(); maj(); });
      majV();
      return h('div', { class: 'reglage' }, h('span', { class: 'libelle-reglage' }, libelle), moins, valeur, plus);
    };
    const reglages = h('div', { class: 'reglages-neurone' },
      cfg.criteres.map(c => reglage(`${c.emoji} ${c.nom}`, () => poids[c.k], (v) => { poids[c.k] = v; }, -3, 3)),
      reglage(tt('seuil'), () => seuil, (v) => { seuil = v; }, -3, 6));
    const tbody = h('tbody');
    const bilan = h('p', { class: 'bilan-tests' });
    const bouton = h('button', { type: 'button', class: 'btn btn-principal', disabled: true }, tt('tester_nouveaux'));
    const nouveaux = h('div', { class: 'nouveaux-jouets', hidden: true });
    const icones = (v) => cfg.criteres.map(c => h('span', { class: 'critere' + (v[c.k] ? ' oui' : ''), title: c.nom }, c.emoji)).concat();
    function maj() {
      tbody.innerHTML = '';
      let bons = 0;
      cfg.exemples.forEach(x => {
        const r = L.predire(poids, seuil, x.v);
        const juste = r.aime === x.aime;
        if (juste) bons++;
        tbody.append(h('tr', { class: juste ? 'ok' : 'rate' }, h('td', { class: 'gauche' }, x.emoji + ' ' + x.nom), h('td', {}, icones(x.v)), h('td', {}, String(r.total)),
          h('td', {}, r.aime ? tt('adore') : tt('bof')), h('td', {}, x.aime ? tt('adore') : tt('bof')), h('td', {}, juste ? '✅' : '❌')));
      });
      bilan.textContent = tt('bien_devines', { n: bons, t: cfg.exemples.length });
      bilan.classList.toggle('tous', bons === cfg.exemples.length);
      bouton.disabled = bons !== cfg.exemples.length;
      nouveaux.hidden = true;
      envoye = false;
    }
    bouton.addEventListener('click', async () => {
      if (envoye) return;
      envoye = true;
      nouveaux.innerHTML = '';
      nouveaux.append(h('p', { class: 'petit' }, tt('nouveaux')), h('div', { class: 'cartes-nouveaux' }, cfg.nouveaux.map(x => {
        const r = L.predire(poids, seuil, x.v);
        return h('div', { class: 'carte-nouveau' + (r.aime ? ' aime' : '') }, h('span', { class: 'emoji-nouveau' }, x.emoji), h('b', {}, x.nom), h('span', {}, icones(x.v)), h('small', {}, r.aime ? tt('adore') : tt('bof')));
      })));
      nouveaux.hidden = false;
      const r = await api.soumettre({ poids: { ...poids }, seuil });
      if (!r.ok) envoye = false;
    });
    maj();
    zone.append(h('p', { class: 'petit' }, tt('reglages')), reglages, h('p', { class: 'petit' }, tt('exemples')),
      h('div', { class: 'defilement' }, h('table', { class: 'tableau compact table-neurone' },
        h('thead', {}, h('tr', {}, h('th', {}, tt('jouet')), h('th', {}, cfg.criteres.map(c => c.emoji).join(' ')), h('th', {}, tt('total')), h('th', {}, tt('robot_dit')), h('th', {}, tt('verite')), h('th', {}, ''))), tbody)),
      bilan, h('div', { class: 'centre' }, bouton), nouveaux);
  };

  global.TXT_DUR = TXT;
})(window);
