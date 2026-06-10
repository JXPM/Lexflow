---
description: Ingérer une source de raw/ dans le wiki LexFlow
argument-hint: <chemin-dans-raw-ou-url>
---

Exécute le workflow INGEST de CLAUDE.md sur : $ARGUMENTS

Étapes :
1. Lire la source à $ARGUMENTS (fetch si URL ; lire le texte puis les images de `raw/assets/` si présentes).
2. Discuter 2-5 takeaways clés avec l'utilisateur.
3. Créer `wiki/sources/YYYY-MM-DD-slug.md` (résumé, claims, entités, concepts, citations ≤125 car., questions).
4. Créer/mettre à jour les pages entités et concepts mentionnées ; signaler les contradictions avec `> [!warning]`.
5. Mettre à jour `wiki/overview.md` si la thèse produit évolue.
6. Mettre à jour `wiki/index.md`.
7. Ajouter une entrée `ingest` à `wiki/log.md`.
8. Rapporter : pages créées/màj, contradictions, questions ouvertes.
