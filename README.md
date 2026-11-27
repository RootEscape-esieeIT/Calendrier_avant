# 🎄 NOËL-OS · Opération Dégel

Un calendrier de l'Avent façon *escape game* pour **comprendre l'informatique en s'amusant**.
**Kryos**, le Tyran de Glace (en anglais *the Ice Tyrant*), échappé de son glacier, a lâché ses **Kères** (*Keres*) dans le chalet du Père Noël et gelé NOËL-OS, l'ordinateur du Pôle Nord. Chaque jour de décembre, une nouvelle **pièce du chalet** s'allume :
on y entre (atelier, cuisine, bibliothèque, grenier, salle des coffres…) et on y trouve une énigme qui fait découvrir une notion d'informatique.

- 👹 Chaque pièce est gardée par une **Kère** (une par jour, sans nom propre, avec ses répliques : champ `givrin` de `serveur/jours.js` et `jours.en.js`). Résoudre l'énigme la fait voler en éclats.
- 🎬 Chaque pièce a sa **scène animée** (`public/js/scenes.js`) qui montre la situation de l'énigme, la Kère en pleine bêtise : la porte et sa guirlande-serrure au jour 1, l'imprimante gelée au jour 2… Le fond est immobile et seuls de petits calques bougent (Firefox reste fluide). La même scène, figée et sans Kère, décore la case de la façade.
- 😈 Les Kères ont l'humour noir : une réplique d'accueil, une **pique différente à chaque erreur** (`givrin.piques`), une dernière en s'enfuyant.
- 💡 Chaque énigme résolue **rallume la lumière dans sa pièce** et une **boule du sapin du jardin**.
- ✨ Quand tout un **niveau du chalet** est réparé, ses guirlandes s'illuminent (et un cadeau apparaît sous le sapin).
- 🧩 Chaque énigme donne un **fragment** : une lettre et sa position dans la formule finale.
- ⭐ Le 24, on assemble les 23 fragments pour **rallumer l'étoile** et chasser Kryos.
- 📜 Le joueur donne d'abord son prénom. Le Père Noël, enfermé avec tous ses lutins dans un cachot de glace par Kryos, lui écrit alors une lettre à son nom : une prophétie annonce que c'est lui, le Sauveur de Noël, leur seul espoir. Kryos gèle la lettre juste avant la fin. Quand le joueur accepte la mission, la magie de la lettre le téléporte au chalet. Le 24, la fin dégèle et le Père Noël, libéré, écrit une dernière lettre (dans la leçon du jour 24, où `{{PRENOM}}` est remplacé par le prénom du joueur).

Après chaque énigme : une leçon « 📚 Ce que tu as appris », des exemples « 🌍 Dans la vraie vie », et
parfois un petit terrain de jeu (encodeur ASCII, testeur de regex, calculateur SHA-256).

🇫🇷 / 🇬🇧 **Le jeu existe en français et en anglais** (*Operation Thaw*). La langue est choisie d'après le navigateur,
et le bouton 🌐 permet d'en changer à tout moment. Les énigmes sont **adaptées**, pas seulement traduites : quand la réponse
dépend de la langue, elle change. Seule la formule finale est la même partout, en latin.
Un même compte peut jouer dans les deux langues :
la progression est partagée.

## 🧱 Comment ça marche

```
Navigateur  ──►  Node.js (Express)  ──►  MySQL / MariaDB
 public/          serveur/                 tables joueurs + progression
```

- **Le serveur suit sa propre horloge**, dans le fuseau `Europe/Paris` : le 1er décembre, il n'envoie que l'énigme du 1er.
  Changer l'heure de son ordinateur ou lire le code de la page ne sert à rien.
- **Les réponses restent sur le serveur** : il ne stocke que leurs empreintes SHA-256, et vérifie tout, mini-jeux compris.
  La leçon et le fragment ne sont envoyés qu'après une bonne réponse.
- **Chaque joueur a un compte** : un prénom unique (on ajoute l'initiale de son nom s'il est déjà pris) et un mot de passe, créés à sa première visite, juste avant la lettre du Père Noël.
  Sa progression est enregistrée **sur son compte**, en base, à chaque action : portes ouvertes, essais, indices, réussites.
  Il la retrouve **depuis n'importe quel appareil** en se reconnectant, même après avoir supprimé ses cookies.
- **Les mots de passe sont hachés avec scrypt** : ils ne sont jamais stockés en clair. La connexion est gardée dans un cookie signé
  (`noelos_session`, valable 120 jours) qu'on ne peut pas fabriquer sans `SECRET_SESSION`.
- **Anti force brute** :
  - énigmes : 30 essais par minute et par énigme pour un même joueur, 600 par minute pour une même adresse IP ;
  - connexion : 8 essais par minute sur un même pseudo, 20 par minute pour une même adresse IP.

## ▶️ Lancer en local (pour tester)

```bash
npm install
cp .env.example .env      # puis, dans .env : MODE_TEST=1 et MYSQL_HOTE= (vide)
npm run dev               # http://localhost:3000
```

Si `MYSQL_HOTE` est vide, la progression est gardée **en mémoire**, et perdue au redémarrage. C'est pratique pour tester sans base.
`MODE_TEST=1` ouvre toutes les portes et affiche un bouton « Réinitialiser » en bas de page.
`npm run dev` redémarre le serveur tout seul quand tu modifies un fichier de `serveur/` **ou le `.env`** (avec `npm start`,
il faut relancer à la main). Attention : en stockage mémoire, chaque redémarrage efface les comptes, il faut recréer son compte.

La lettre du Père Noël arrive dans une enveloppe à son nom, puis s'écrit à la plume juste après l'inscription (environ
1 min 50, on ne peut pas la passer : c'est voulu). Ensuite elle s'affiche directement (bouton 📜), avec un lien
« Regarder le Père Noël l'écrire ».
Pour revoir l'animation depuis le début : efface la clé `noelos-preferences` du stockage local du navigateur.

## 🚀 Mettre en ligne sur le VPS

**1. La base MySQL / MariaDB** (les tables sont créées automatiquement au premier démarrage) :

```sql
CREATE DATABASE noelos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'noelos'@'localhost' IDENTIFIED BY 'un-mot-de-passe-solide';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, CREATE VIEW, REFERENCES ON noelos.* TO 'noelos'@'localhost';
```

**2. Le code** (Node.js 20.12 ou plus récent) :

```bash
cd /var/www/noelos            # le dossier du projet, copié sur le serveur
npm ci --omit=dev
cp .env.example .env          # remplir MYSQL_*, SECRET_SESSION, ADMIN_MOT_DE_PASSE ; MODE_TEST=0 ; DERRIERE_PROXY=1
npm start                     # vérifier que « Stockage : MySQL » s'affiche
```

**3. Le garder allumé** avec systemd (`/etc/systemd/system/noelos.service`) :

```ini
[Unit]
Description=NOEL-OS, calendrier de l'Avent
After=network.target mysql.service

[Service]
WorkingDirectory=/var/www/noelos
ExecStart=/usr/bin/node serveur/index.js
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now noelos
```

**4. nginx devant Node, avec HTTPS** :

```nginx
server {
    server_name calendrier.ton-domaine.fr;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo certbot --nginx -d calendrier.ton-domaine.fr
```

## 📊 Combien de personnes ont joué ?

Ouvre **`https://ton-domaine/admin`** avec l'identifiant et le mot de passe définis dans `.env`
(`ADMIN_UTILISATEUR` / `ADMIN_MOT_DE_PASSE`). Tu y verras :

- les joueurs inscrits, ceux qui ont ouvert au moins une porte, ceux actifs aujourd'hui, et ceux qui ont rallumé l'étoile ;
- **la liste des joueurs** : pseudo, énigmes résolues sur 24, fini ou pas, date d'inscription et dernière visite, avec un **export CSV** pour Excel ;
- pour chaque jour : les ouvertures, les réussites, le taux de réussite, le nombre moyen d'essais et d'indices.

Tu peux aussi interroger directement la base. La vue `vue_joueurs` donne un joueur par ligne :

```sql
-- Qui a joué, sa progression, fini ou pas
SELECT nom, enigmes_resolues, fini, inscrit_le, derniere_visite FROM vue_joueurs ORDER BY enigmes_resolues DESC;

-- Nombre de joueurs
SELECT COUNT(DISTINCT joueur_id) FROM progression;

-- Ouvertures et réussites par jour
SELECT jour, COUNT(*) AS ouvertures, COUNT(resolu_le) AS reussites
FROM progression GROUP BY jour ORDER BY jour;

-- Joueurs qui ont tout terminé
SELECT nom FROM vue_joueurs WHERE fini = 'oui';
```

## ⚙️ Réglages (`.env`)

| Variable | Effet |
|---|---|
| `ANNEE`, `FUSEAU` | Année du mois de décembre joué, et fuseau horaire de l'ouverture des portes (minuit). |
| `RATTRAPAGE` | `1` : les jours passés restent ouverts. `0` : seule l'énigme du jour est ouverte (les énigmes déjà résolues restent consultables). |
| `MODE_TEST` | `1` : toutes les portes ouvertes. **À ne jamais laisser en production.** |
| `DERRIERE_PROXY` | `1` si nginx / Apache est devant Node. |
| `MYSQL_*` | Connexion à la base. `MYSQL_HOTE` vide = stockage en mémoire. |
| `SECRET_SESSION` | Longue chaîne aléatoire qui signe les cookies de connexion. Vide = les joueurs sont déconnectés à chaque redémarrage du serveur (leur progression reste). |
| `ADMIN_UTILISATEUR`, `ADMIN_MOT_DE_PASSE` | Accès à `/admin`. Mot de passe vide = page désactivée. |

## ✏️ Modifier le contenu

- **Textes, énigmes, indices, leçons, pièces** : `serveur/jours.js`. Le champ `piece` décrit la pièce du chalet :
  `mur` (couleur), `motif` (`bois`, `rayures`, `papier`, `pierre`, `briques`, `carreaux`, `metal`, `glace`, `uni`), `sol`
  (`parquet`, `tapis`, `pierre`, `carrelage`, `metal`, `glace`), 3 `elements` au fond (`fenetre`, `cheminee`, `sapin`,
  `etageres:livres` ou `etageres:🧸🚂`, `horloge`, `coffre`, `telescope`, `four`, `serveurs`, `ecran`…), un `meuble`
  (`etabli`, `comptoir`, `bureau`, `table`) et les `objets` posés dessus. `particules` = ce qui flotte dans la pièce.
- **Ordre d'affichage d'un jour** : sur la façade du chalet (le calendrier de l'Avent), on clique sur le numéro du jour ;
  la case devient une porte de calendrier qui s'ouvre, et l'on entre dans la pièce. Le projecteur des
  lutins projette d'abord le `cours` (« 📽️ Le petit cours des lutins » : la notion du jour expliquée à quelqu'un qui n'y
  connaît rien, avec un exemple qui ne donne pas la réponse) ; on peut le passer, et il ne revient pas tout seul une fois
  vu (bouton « Revoir le petit cours »). Puis la Kère surgit et présente son défi : `histoire` (la mise en situation),
  `enigme` et le mini-jeu, avec le tic-tac en musique et un **compteur de tentatives** (pas de chrono : on prend son
  temps ; c'est le serveur qui compte, et toutes les 3 erreurs le bouton d'indice clignote). `lecon` ne s'affiche
  qu'après la bonne réponse : elle approfondit, sans répéter le cours. Chaque énigme doit pouvoir se résoudre avec le
  seul contenu du cours, en une ou deux étapes simples : le but est de passer un bon moment, pas de coincer le joueur.
  Quand une énigme demande de convertir ou de calculer, on remet le pense-bête sous les yeux (bloc `<div class="rappel">`,
  tableau ASCII du jour 2, alphabet numéroté du jour 20).
- **Version anglaise des énigmes** : `serveur/jours.en.js`, même structure que `jours.js`. Si tu modifies une énigme,
  pense à modifier les deux fichiers. Les réponses ont leurs propres empreintes dans chaque fichier.
- **Textes de l'interface** (boutons, messages, mini-jeux) : écrits en français dans le code, traduits dans le dictionnaire
  `EN` de `public/js/i18n.js`. Un texte absent du dictionnaire s'affiche en français. Les messages renvoyés par le serveur
  sont dans `serveur/textes.js` et `serveur/verification.js`.
- **Place des pièces dans le chalet** (grenier, étage, rez-de-chaussée, sous-sol) : tableau `NIVEAUX` en haut de `public/js/app.js`.
  Il sert à la façade du chalet, qui est le calendrier. (`public/js/visite.js`, l'ancienne visite par les couloirs, n'est
  plus chargé par la page.)
- **Changer une réponse écrite** :
  `npm run empreinte -- 3 "ma nouvelle réponse"`, puis colle le résultat dans le tableau `reponses` du jour
  (dans `jours.js` pour le français, `jours.en.js` pour l'anglais).
  Les réponses sont normalisées : majuscules et minuscules sont équivalentes, et les accents, espaces et ponctuation ignorés.
- **Règles des mini-jeux** (ampoules, tri, carte, paquets…) : `serveur/verification.js`. Celles des mini-jeux « à tester »
  (circuit, robot, crêpes, neurone) sont dans `public/js/logique-jeux.js`, un seul fichier lu par le navigateur ET par le serveur.
- **Musique** : les fichiers sont dans `public/musique/` (copies sans pochette des originaux de `Media/`, qui n'est pas
  servi). Pas de musique sur l'écran titre, « Qui es-tu ? » ni pendant la lettre (seul le son des vidéos). Ensuite :
  `facade_gelee.mp3` devant le chalet pendant les 11 premières pièces, `facade_espoir.mp3` à partir de la 12e,
  `petit_cours.mp3` pendant le projecteur des lutins, le tic-tac (`tic_tac.mp3`) pendant le défi de la Kère,
  `kryos_final.mp3` pendant le défi du 24, la fanfare `victoire.mp3` (10 s) quand une Kère est vaincue, et le Jingle Bells
  funk (`melody.mp3`) au dégel du 24. `sad_melody.mp3` n'est plus utilisée. Les volumes
  et les points de boucle sont dans le tableau `PISTES` en haut de `public/js/musique.js` (la musique est un fond sonore :
  environ -39 dB au réglage par défaut, mesuré avec `MUSIQUE.etat().niveau`). Pour remplacer un morceau, garde
  le même nom de fichier et ajuste `fin` (le moment où il commence à s'éteindre). Le bouton 🔊 ouvre deux curseurs :
  musique et bruitages (réglages gardés dans le navigateur du joueur).
- **Le décor qui raconte la lettre** (`public/js/cinema.js`) : chaque paragraphe de la lettre porte `data-scene="…"`
  (cachot, glacier, keres, chalet, hiver, prophetie, mission, cours, menace) et certains passages `data-evt="…"` (le
  glacier se fend, le prénom apparaît dans la boule de cristal…). Une nouvelle scène = une fonction dans `SCENES`.
  L'histoire se joue derrière la lettre, sur tout l'écran. C'est la lettre qui mène : la plume écrit sans jamais
  s'arrêter, chaque vidéo démarre quand la plume arrive à son passage et coupe en fondu celle d'avant, qui reste
  seulement au moins `VUE_MIN` (2 s) à l'écran (le décor a donc au plus une seconde de retard sur le texte).
  Les clips sont en 1280×720 (sources 640×360 agrandies et accentuées) avec leur son.
- **L'écran titre** : le chalet illuminé et, derrière lui dans le brouillard, l'ombre de Kryos qu'on devine à peine
  (`public/media/kryos-ombre.webp`, tirée de l'illustration de `Media/asset`, yeux éteints : deux lueurs CSS les
  rallument de temps en temps). Rien n'y parle de Kryos : on le découvre dans la lettre.
- Après une modification, redémarre le serveur (`sudo systemctl restart noelos`).

## 🔑 Un joueur a oublié son mot de passe

Il n'y a pas d'e-mail, donc pas de lien « mot de passe oublié ». C'est l'organisateur qui remet un mot de passe, sur le VPS :

```bash
npm run mot-de-passe -- "Léa" "nouveau-mot-de-passe"
```

Transmets-le au joueur, il retrouvera toute sa progression.

## 🔐 Données personnelles

La base contient **le pseudo choisi par le joueur**, son mot de passe **haché** (illisible, même pour les organisateurs) et
sa progression. Elle ne contient ni e-mail ni adresse IP. Un pseudo peut rester une donnée personnelle :
- on peut conseiller aux joueurs un pseudo plutôt que leur nom complet ;
- pense à effacer les données après l'événement : `DELETE FROM joueurs;` (la progression est effacée avec, grâce à la clé étrangère) ;
- mentionne le jeu dans les mentions légales / la politique de confidentialité du site (à voir avec la personne en charge du RGPD).

Le cookie `noelos_session` sert uniquement à rester connecté. Un cookie strictement nécessaire au service est en principe
dispensé de consentement.

## 🗂️ Structure

```
public/                 ce que reçoit le navigateur
  index.html
  css/style.css         tout le style (ciel, sapin, calendrier, décors)
  js/i18n.js            traductions de l'interface (français / anglais) et choix de la langue
  js/app.js             sapin, calendrier, fenêtres, appels au serveur
  js/musique.js         le lecteur de musique (fondus, boucles, volume)
  js/cinema.js          le décor qui raconte l'histoire derrière la lettre
  js/visite.js          (plus chargé) l'ancienne visite du chalet par les couloirs
  musique/              les morceaux (façades, petit cours, tic-tac, Kryos, fanfare, funk)
  js/widgets.js         les mini-jeux (ampoules, roue de César, carte, paquets…)
  js/widgets-dur.js     les mini-jeux « à tester » (terminal, circuit, robot, console SQL, duel final…)
  js/logique-jeux.js    leurs règles, partagées avec le serveur (qui rejoue tout pour vérifier)
  js/pieces.js          les pièces du chalet et le toit, dessinés en SVG
  js/decors.js          les paysages extérieurs (village, montagnes…)
  js/sha256.js          SHA-256 pour la machine à empreintes du jour 20
serveur/                jamais envoyé au navigateur
  index.js              l'API et le serveur web
  jours.js              le contenu des 24 jours + empreintes des réponses (français)
  jours.en.js           la même chose en anglais
  textes.js             messages du serveur (français / anglais) et langue de la requête
  verification.js       vérification des réponses et des mini-jeux
  aides-jours.js        petits outils pour écrire les énigmes (binaire d'une étiquette, table de l'alarme, empreintes)
  dates.js              ouverture des portes (heure du serveur)
  stockage.js           MySQL (ou mémoire)
  schema.sql            les tables
  admin.js              la page /admin
  comptes.js            comptes joueurs : mots de passe (scrypt) et sessions
  empreinte.js          outil pour changer une réponse
  mot-de-passe.js       outil pour remettre le mot de passe d'un joueur
SOLUTIONS.md            ⚠️ les réponses (gardé hors du dépôt, voir .gitignore)
```

## 📅 Le programme

| Jour | Univers | Notion |
|---|---|---|
| 1 | L'Atelier des Lutins | Le binaire |
| 2 | Le Bureau de Poste | L'encodage des caractères (ASCII, Unicode) |
| 3 | La Tour aux Lettres | Le chiffrement (César) et la force brute |
| 4 | La Fabrique de Boules | Pixels, couleurs RVB, hexadécimal |
| 5 | L'Entrepôt Verrouillé | Logique booléenne et portes logiques |
| 6 | Le Quai de Chargement | Algorithmes de tri, complexité |
| 7 | L'Avenue des Cheminées | Recherche dichotomique |
| 8 | La Carte de la Tournée | Graphes, plus court chemin (Dijkstra) |
| 9 | Le Palais des Flocons | Algorithmes et boucles (programmer un robot) |
| 10 | La Cuisine de Mère Noël | Variables, boucles, conditions |
| 11 | Le Goûter des Lutins | Piles et files |
| 12 | La Cabine Radio | Le code Morse (bande de bips, tableau, manipulateur) |
| 13 | Le Magasin de Jouets | Détection d'erreurs (clé de contrôle EAN-13) |
| 14 | Le Centre de Tri du Réseau | Internet, paquets, TCP |
| 15 | Le Bureau des Étiquettes | Expressions régulières |
| 16 | Le Studio Photo | Images et compression (RLE en couleurs : l'affiche de Kryos) |
| 17 | La Grande Bibliothèque | Bases de données et SQL |
| 18 | L'Infirmerie des Jouets | Bugs et débogage |
| 19 | La Salle des Coffres | Mots de passe et force brute |
| 20 | Le Cabinet des Sceaux | Fonctions de hachage |
| 21 | La Messagerie des Lutins | Hameçonnage (phishing) |
| 22 | La Cabane de l'Elfe Hacker | Terminal, fichiers, arborescence |
| 23 | Le Laboratoire du Lutin-Robot | Intelligence artificielle, apprentissage, biais |
| 24 | L'Étoile du Sapin | Grande finale : duel contre Kryos dans le terminal |
