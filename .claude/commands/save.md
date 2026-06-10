---
description: Filer la réponse précédente comme page de synthèse dans le wiki
argument-hint: [slug]
---

Exécute le workflow SAVE de CLAUDE.md.

Filer la **réponse précédente** comme `wiki/syntheses/<slug>.md` :
1. Slug = $ARGUMENTS si fourni, sinon auto-dérivé en kebab-case du contenu.
2. Créer la page avec frontmatter `type: synthesis`, `created`, `updated`, `tags`, `sources`.
3. Conserver les `[[wikilinks]]` et inclure une section `## Références`.
   Citations ≤125 car. entre guillemets ; paraphraser au-delà.
4. Mettre à jour `wiki/index.md`.
5. Ajouter une entrée `save` à `wiki/log.md`.
