# Prompts pour la vidéo de la lettre, Kryos et les Kères

Ce dossier `Media/` n'est pas servi par le site : tu peux y garder tes essais.

## Comment ça va s'intégrer (à lire avant de générer)

- **Le texte de la lettre reste écrit par le site**, par-dessus la vidéo : il contient le prénom du joueur, il existe en
  deux langues, et la plume suit la voix du Père Noël. La vidéo, c'est **le décor derrière la lettre**.
- **Un clip par scène**, pas une seule longue vidéo : la lettre dure entre 1 min 50 et 2 min 45 selon la voix, donc le site
  lance chaque clip au moment où la plume arrive au bon paragraphe. Certains moments (le glacier qui explose, la boule de
  cristal qui révèle le Sauveur…) sont des clips courts, joués à l'instant exact.
- **Format** : 16:9, 1280×720 suffit (1920×1080 si ton outil le permet), 8 à 10 s, **sans texte, sans lettres, sans logo,
  sans son**. Les clips « boucle » doivent pouvoir tourner en boucle (fin ≈ début, caméra presque fixe).
- **Cadrage** : garde **toute l'action dans les 60 % du milieu de l'image**. Sur ordinateur, la lettre occupe la droite de
  l'écran et l'image est rognée sur les côtés ; sur téléphone, la vidéo devient un bandeau en haut. Bords sombres = idéal.
- **Poids** : vise moins de 4 Mo par clip (MP4 H.264). Je m'occupe de la compression si besoin.
- **Noms de fichiers** (à mettre dans `Media/video/`, je les branche ensuite) : indiqués avant chaque prompt.

**Méthode conseillée** : génère d'abord les images de Kryos et d'une Kère (partie 2), choisis tes préférées, puis donne-les
comme **image de référence** à l'outil vidéo (image-to-video : Runway, Kling, Veo, Sora, Pika…). C'est la seule façon d'avoir
le même Kryos et les mêmes Kères d'un clip à l'autre.

---

## 1. Le style (à coller au début de CHAQUE prompt)

> Stylized 3D animated feature-film look, cozy-yet-ominous Christmas fantasy, painterly textures, soft volumetric light,
> drifting snow particles, rich contrast between warm golden candlelight (#f5c542) and icy blue (#a9dcff) on deep night-blue
> shadows (#0b1a2e). Family-friendly, magical, cinematic, slow camera movement. No text, no letters, no logos, no watermark.

Négatif (si ton outil a un champ « negative prompt ») :

> text, letters, words, subtitles, watermark, logo, gore, blood, realistic human horror, photorealistic, extra fingers,
> deformed hands, flickering, jump cuts, fast camera shake

---

## 2. Les personnages (images fixes)

Pour le jeu, demande des **PNG sur fond transparent** (ou fond uni vert/blanc que je détourerai), carrés 1024×1024.

### Kryos, le Tyran de Glace

`Media/images/kryos-portrait.png`

> [STYLE] Character design of KRYOS, the Ice Tyrant, an ancient towering winter spirit made of dark obsidian ice. Deep
> navy-black glassy body with faint blue light glowing inside its cracks, a jagged crown of tall pale-blue ice shards, a high
> spiked collar, icicle pauldrons on the shoulders, a long tattered cloak of frost. Long skeletal hands with sharp ice talons.
> Furrowed angular brows of white frost, a wide grin of icy fangs, and two glowing crimson eyes — the only warm color on him.
> Cold mist pours from his mouth and shoulders. Menacing but family-friendly villain, epic, regal. Bust portrait, facing camera,
> centered, isolated on a plain background.

Variantes utiles (même prompt, remplace la dernière phrase) :
- `kryos-entier.png` : « Full body, standing tall, arms spread with claws open, isolated on a plain background. »
- `kryos-ombre.png` : « Huge silhouette looming in a stormy night sky behind a small snowy chalet, only the crimson eyes and
  the edges of the ice crown lit. »
- `kryos-vaincu.png` (pour le 24) : « Cracking apart into falling ice shards, eyes fading from crimson to grey, golden light
  bursting through the cracks. »

### Une Kère (les 23 sbires, au féminin)

`Media/images/kere-face.png`

> [STYLE] Character design of a KER: a small winged ice spirit inspired by the Keres of Greek mythology, the spirits of doom,
> reimagined as a mischievous Christmas villain. Ghost-like rounded body of translucent pale white-blue ice that ends in a
> jagged, tattered icicle hem, a tiny crown of ice spikes, sharp frowning white eyebrows, big dark-navy eyes with a glint,
> a wicked grin with two little fangs, small arms ending in ice claws, and translucent bat-like wings of frosted ice. Faint
> cyan glow around her. Feminine, cheeky, menacing-cute, family-friendly. Front view, centered, isolated on a plain background.

Variantes (même personnage) :
- `kere-vol.png` : « Flying sideways, wings fully spread, motion trail of snowflakes. »
- `kere-ricane.png` : « Laughing mockingly, head thrown back, claws on her belly. »
- `kere-defi.png` : « Pointing a claw at the viewer with a smug grin, presenting a challenge, a glowing frozen padlock
  floating beside her. »
- `kere-eclats.png` : « Shattering into sparkling ice shards with a surprised face. »
- `kere-flaque.png` : « Melted into a small shiny puddle of water with two tiny ice spikes floating in it. »

### Le Père Noël prisonnier (optionnel)

`Media/images/pere-noel-cachot.png`

> [STYLE] Santa Claus imprisoned in a dungeon carved in blue ice, sitting hunched at a small wooden table, writing a letter
> with a white quill by the light of a single dying candle. Tired but determined eyes, red coat dusted with frost, ice bars in
> the foreground, a small barred window showing a blizzard. Warm candle glow against cold blue walls. Medium shot, centered.

---

## 3. Les clips de la lettre

### 0. L'enveloppe arrive — `00-enveloppe.mp4` (8 s, joué une fois)

> [STYLE] A glowing golden envelope sealed with a red wax seal flies through a raging night snowstorm toward the camera,
> spinning gently, leaving a trail of golden sparks. It slows down and stops in the center of the frame, hovering. Dark stormy
> background, swirling snow.

### 1. Le cachot de glace — `01-cachot-boucle.mp4` (10 s, boucle)

> [STYLE] (reference: pere-noel-cachot) Slow push-in on Santa in his ice dungeon writing a letter with a quill by candlelight.
> The flame flickers, his hand moves steadily, frost slowly creeps on the walls, snow streaks past the small barred window.
> Seamless loop, almost static camera.

### 1b. La lettre s'envole par la lucarne — `01-cachot-envol.mp4` (6 s, joué au moment « elle a traversé la tempête »)

> [STYLE] In the ice dungeon, a folded letter glows golden on Santa's table, lifts into the air by magic, flies through the
> bars of the small window and disappears into the blizzard as a shooting star.

### 2. Le glacier endormi — `02-glacier-boucle.mp4` (10 s, boucle)

> [STYLE] (reference: kryos-entier) Under a green aurora borealis, a colossal glacier of translucent blue ice stands in a
> frozen wasteland. Deep inside the ice, the dark silhouette of KRYOS is trapped, eyes closed, crown of ice shards visible.
> Faint blue pulses of light inside the glacier. Very slow camera drift. Seamless loop.

### 2b. Le glacier se fend… et il revient — `02-glacier-eveil.mp4` (8 s, joué au moment « le glacier s'est fendu »)

> [STYLE] (reference: kryos-entier) Bright white cracks race across the colossal glacier, the ground shakes, the glacier
> explodes outward in a storm of glittering ice shards and a flash of light. KRYOS rises from the debris, his crimson eyes snap
> open and glow, cold mist pours around him. End on a powerful hero shot of Kryos, held still.

### 3. Le souffle de Kryos réveille les Kères — `03-keres.mp4` (10 s, boucle)

> [STYLE] (references: kryos-portrait, kere-vol) KRYOS looms huge in the night sky, his crimson eyes glowing. He exhales a
> freezing breath of blue mist, and from it a swarm of small winged ice spirits (Keres) bursts out and flies past the camera in
> all directions, laughing. Ice crystals spark in the air.

### 4. Le chalet tombe — `04-chalet.mp4` (10 s)

> [STYLE] (reference: kere-vol) A cozy wooden Christmas chalet in the snow at night, its windows glowing warm. Keres dive
> one by one into each window; each window goes dark and frosts over, with two glowing ice-blue eyes appearing behind the
> glass. Ice spreads across the walls from the left. At the end, the golden star on the rooftop flickers and goes out.

### 5. Un hiver qui ne finira jamais — `05-hiver.mp4` (10 s, boucle)

> [STYLE] Inside a silent, dark living room: a cold fireplace with grey ashes, an empty red stocking hanging from the mantel
> and slowly freezing over, a wall calendar showing a covered date under a layer of ice, heavy snow falling endlessly behind a
> frosted window. Desaturated, melancholic blue light. Seamless loop.

### 6. La prophétie — `06-boule-boucle.mp4` (10 s, boucle)

> [STYLE] A crystal ball on an ornate golden stand glows in a dark purple room; violet and golden mist swirls slowly inside
> it; golden sparkles float around it; soft light rays rotate behind. Seamless loop.

### 6b. Le Sauveur apparaît — `06-boule-revelation.mp4` (6 s, joué au moment « ma boule de cristal m'a montré son visage »)

> [STYLE] The mist inside the crystal ball parts and reveals the glowing golden silhouette of a person, head and shoulders,
> face not visible, standing heroically; the ball shines brighter and brighter until golden light rays burst out, and a bright
> star forms above it.

(Le prénom du joueur s'affiche par-dessus grâce au site : ne pas mettre de texte dans la vidéo.)

### 7. La mission, le calendrier des 24 portes — `07-mission.mp4` (10 s)

> [STYLE] The façade of a snowy wooden chalet designed like a giant Advent calendar: 24 small colorful doors (red, green,
> blue, gold) with golden numbers, frosted over. One door creaks open, a tiny Ker flees from it shrieking, warm golden light
> spills out, and a string of Christmas lights along the floor turns on. Finally the star on top of the roof lights up gold.

### 8. Le secret des lutins — `08-cours.mp4` (10 s, boucle)

> [STYLE] A cozy elf workshop at night: an old film projector with spinning reels throws a flickering beam of light onto a
> small screen showing simple glowing shapes; a pencil and paper lie on a wooden desk; a lightbulb glows softly; silhouettes
> of pointy elf hats watch in the foreground. Warm, hopeful. Seamless loop.

### 9. La menace — `09-menace.mp4` (8 s)

> [STYLE] Total darkness. Frost slowly creeps in from the edges of the frame. Two enormous crimson eyes slowly open in the
> dark, glowing, staring at the camera; faint shape of an ice crown above them.

### 10. Kryos gèle la lettre — `10-gel.mp4` (10 s, boucle finale)

> [STYLE] (reference: kryos-ombre) KRYOS's giant shadow towers over the small half-frozen chalet, his skeletal clawed hands
> closing around it, crimson eyes blinking slowly, cold light rays behind his ice crown, Keres circling the chalet, ice
> covering everything, blizzard. Epic, ominous final shot. Seamless loop.

---

## 4. En bonus (si tu veux aller plus loin)

- **La téléportation** — `11-teleportation.mp4` (4 s) : « [STYLE] Golden magic rings expand from the center, streaks of
  starlight rush past the camera like warp speed, a white flash. »
- **Entrée dans le chalet** — `12-entree-chalet.mp4` (6 s) : « [STYLE] First-person view: the front door of a wooden Christmas
  chalet swings open, revealing a warm but frost-covered hallway with numbered doors and a wooden staircase; the camera steps
  inside. »

Quand tu as tes fichiers, dépose-les dans `Media/video/` et `Media/images/` avec ces noms : je les compresse, je les branche
sur les scènes (les dessins actuels restent en secours si une vidéo manque) et je remplace les Kères et Kryos du jeu par tes
images.
