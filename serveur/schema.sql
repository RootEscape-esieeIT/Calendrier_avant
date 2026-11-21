-- NOËL-OS : tables créées automatiquement au démarrage du serveur.

-- Un joueur = un compte : pseudo unique + mot de passe haché (scrypt).
CREATE TABLE IF NOT EXISTS joueurs (
  id            CHAR(36) NOT NULL PRIMARY KEY,
  nom           VARCHAR(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  mot_de_passe  VARCHAR(255) NOT NULL,
  cree_le       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vu_le         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Une ligne par joueur et par porte ouverte.
CREATE TABLE IF NOT EXISTS progression (
  joueur_id   CHAR(36) NOT NULL,
  jour        TINYINT UNSIGNED NOT NULL,
  ouvert_le   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tentatives  INT UNSIGNED NOT NULL DEFAULT 0,
  indices     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  resolu_le   DATETIME NULL,
  PRIMARY KEY (joueur_id, jour),
  KEY idx_jour (jour),
  CONSTRAINT fk_progression_joueur FOREIGN KEY (joueur_id) REFERENCES joueurs (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Un joueur par ligne : sa progression, fini ou pas.  →  SELECT * FROM vue_joueurs;
CREATE OR REPLACE VIEW vue_joueurs AS
SELECT
  j.id                                   AS joueur,
  j.nom                                  AS nom,
  j.cree_le                              AS inscrit_le,
  j.vu_le                                AS derniere_visite,
  COUNT(p.jour)                          AS portes_ouvertes,
  COUNT(p.resolu_le)                     AS enigmes_resolues,
  IF(SUM(p.jour = 24 AND p.resolu_le IS NOT NULL) > 0, 'oui', 'non') AS fini
FROM joueurs j
LEFT JOIN progression p ON p.joueur_id = j.id
GROUP BY j.id, j.nom, j.cree_le, j.vu_le;
