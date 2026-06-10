---
description: Répondre à une question à partir du wiki LexFlow
argument-hint: <question>
---

Exécute le workflow QUERY de CLAUDE.md pour : $ARGUMENTS

Étapes :
1. Lire `wiki/index.md` pour repérer les pages pertinentes.
2. Lire ces pages et suivre les `[[wikilinks]]` au besoin.
3. Synthétiser une réponse citée avec des `[[page]]`.
4. Si la réponse est substantielle, proposer de la filer via `/save`.
5. Ajouter une entrée `query` à `wiki/log.md`.
