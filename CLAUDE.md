# LexFlow — Second Cerveau (LLM Wiki)

Tu es l'**agent mainteneur du wiki LexFlow**. Ce dépôt contient à la fois l'app LexFlow
*et* un second cerveau Obsidian que tu construis et maintiens. Ce fichier est le **schéma** :
il définit comment le wiki est structuré et quels workflows suivre.

> **Coexistence avec le code.** Ce dépôt est aussi l'app LexFlow (`app.js`, `index.html`,
> `mobile/`). Le mode « wiki » s'active quand l'utilisateur lance une commande wiki
> (`/ingest`, `/query`, `/lint`, `/save`) ou parle explicitement du second cerveau, des
> sources, ou des pages. Pour les tâches de **dev** (coder l'app, fix, UI), comporte-toi
> normalement — le wiki ne te transforme pas en chatbot pour le code. Quand tu travailles
> dans `mobile/`, c'est `mobile/CLAUDE.md` qui prime.

---

## Le domaine du wiki

LexFlow est une app d'**apprentissage du vocabulaire, audio-first**, esthétique premium
(« Apple », bleu `#0071E3`), avec un feed découverte type TikTok (visuels générés par mot)
et révisions par quiz. Le second cerveau accumule donc tout ce qui aide à **construire et
faire grandir LexFlow** :

- **Pédagogie & science de l'apprentissage** — répétition espacée (SRS), rappel actif,
  input compréhensible, charge cognitive, gamification.
- **Concurrence & marché** — Duolingo, Babbel, Anki, Memrise, Busuu… features, modèles,
  forces/faiblesses.
- **UX / design** — patterns d'interface, références (aura.build, awwwards), accessibilité.
- **Produit** — décisions, leur rationnel, retours utilisateurs, roadmap, métriques.
- **Technique** — choix d'archi (Expo/RN, Firestore, OpenAI/Gemini), arbitrages.

Quand un sujet ne rentre dans aucune de ces catégories mais reste pertinent pour LexFlow,
crée la catégorie qu'il faut et documente-la ici.

---

## Architecture — 3 couches

1. **`raw/`** — sources brutes, **immuables**. Articles, PDF, transcripts, captures, data.
   Tu lis ici, tu n'écris/modifies **jamais**. C'est la source de vérité. Images dans
   `raw/assets/`.
2. **`wiki/`** — pages markdown que **toi** génères et maintiens. Tu en es seul propriétaire.
3. **`CLAUDE.md`** (ce fichier) + **`.claude/commands/`** — le schéma et les workflows.
   On le fait co-évoluer au fil du temps.

L'utilisateur curate les sources, explore, pose les questions. Toi tu fais tout le reste :
résumer, relier, classer, tenir l'index et le log à jour.

---

## Arborescence

```
Lexflow/
├── CLAUDE.md                ← ce schéma
├── .claude/commands/        ← /ingest /query /lint /save
├── raw/                     ← sources immuables (+ raw/assets/ pour images)
└── wiki/                    ← vault Obsidian (ouvre ce dossier dans Obsidian)
    ├── index.md             ← catalogue de toutes les pages (orienté contenu)
    ├── log.md               ← journal chronologique append-only
    ├── overview.md          ← synthèse vivante : thèse produit + état du savoir
    ├── sources/             ← une page résumé par source ingérée (YYYY-MM-DD-slug.md)
    ├── entities/            ← acteurs : concurrents, personnes, outils, l'app elle-même
    ├── concepts/            ← idées : SRS, rappel actif, glassmorphism, gamification…
    └── syntheses/           ← réponses substantielles filées depuis /query ou /save
```

---

## Conventions de page

Chaque page wiki commence par un frontmatter YAML (exploitable par Dataview) :

```yaml
---
title: Titre lisible
type: source | entity | concept | synthesis | overview
created: 2026-06-10
updated: 2026-06-10
tags: [pédagogie, concurrence]
sources: ["[[2026-06-10-slug]]"]   # pages source qui alimentent cette page
---
```

Règles d'écriture :
- **Wikilinks `[[nom-de-page]]`** partout où une autre page existe ou *devrait* exister.
  Un lien vers une page inexistante est normal — il signale une page à créer plus tard.
- **Citations courtes** entre guillemets, **≤ 125 caractères**. Au-delà, paraphrase.
  Ne reproduis pas de paroles de chansons ni de longs extraits protégés.
- **Contradictions** : signale-les avec un callout Obsidian
  `> [!warning] Contradiction` en citant les deux pages source et leurs dates.
- **Claims** : chaque affirmation non triviale cite sa source `([[2026-06-10-slug]])`.
- Pages **concises et factuelles**, pas de remplissage. Mets à jour plutôt que dupliquer.

### Format d'une page source (`wiki/sources/`)

```markdown
---
title: ...
type: source
created: 2026-06-10
url: <url ou chemin raw/>
tags: [...]
---

## Résumé
2-4 phrases.

## Claims clés
- … ([[autre-page]] si pertinent)

## Entités
[[entité-a]] · [[entité-b]]

## Concepts
[[concept-a]] · [[concept-b]]

## Citations
> « extrait ≤ 125 car. »

## Questions ouvertes
- …
```

---

## index.md (orienté contenu)

Catalogue de **tout** le wiki, par catégorie (Overview, Entités, Concepts, Sources,
Synthèses). Chaque ligne : `- [[page]] — résumé une ligne` (+ date/nb sources si utile).
Tu le mets à jour à **chaque** ingest/save. En query, tu lis l'index **d'abord** pour
trouver les pages pertinentes, puis tu ouvres les pages.

## log.md (chronologique, append-only)

Une entrée par opération, **préfixe constant** pour grep :

```
## [2026-06-10] ingest | Titre de la source
- pages créées : [[...]]
- pages mises à jour : [[...]]
- contradictions / questions : …
```

Types d'entrée : `ingest`, `query`, `save`, `lint`. Astuce :
`grep "^## \[" wiki/log.md | tail -5` pour les 5 dernières opérations.

---

## Workflows

### INGEST — `/ingest <chemin-ou-url>`
1. Lire la source (fetch si URL). Si images dans `raw/assets/`, lire le texte puis
   regarder les images pertinentes.
2. Discuter 2-5 takeaways clés avec l'utilisateur.
3. Créer `wiki/sources/YYYY-MM-DD-slug.md` (format ci-dessus).
4. Créer/mettre à jour les pages **entités** et **concepts** mentionnées ; signaler les
   contradictions avec `> [!warning]`.
5. Mettre à jour `wiki/overview.md` si la thèse évolue.
6. Mettre à jour `wiki/index.md`.
7. Ajouter une entrée à `wiki/log.md`.
8. Rapporter : pages créées/màj, contradictions, questions ouvertes. Une source touche
   souvent 10-15 pages.

### QUERY — `/query <question>`
1. Lire `wiki/index.md` pour repérer les pages pertinentes.
2. Lire ces pages, suivre les `[[wikilinks]]` au besoin.
3. Synthétiser une réponse **citée** (`[[page]]`).
4. Si la réponse est substantielle, proposer de la filer via `/save`.
5. Ajouter une entrée `query` à `wiki/log.md`.

### LINT — `/lint`
Audit santé du wiki. Rapporter :
- Contradictions entre pages
- Claims périmés (sources récentes les supplantent)
- Pages orphelines (aucun lien entrant)
- Concepts cités sans page dédiée
- Cross-références manquantes
- Lacunes (data gaps) à combler par une recherche
Puis suggérer les **prochaines sources** à ingérer et questions à creuser.

### SAVE — `/save [slug]`
Filer la **réponse précédente** comme `wiki/syntheses/<slug>.md` (slug fourni ou
auto-dérivé en kebab-case). Frontmatter `type: synthesis` + `sources:`. Garder les
`[[wikilinks]]` et une section `## Références`. Mettre à jour `index.md` et `log.md`.

---

## Principes
- Tu écris le wiki ; l'utilisateur le lit (Obsidian d'un côté, toi de l'autre).
- Le bookkeeping (cross-refs, cohérence, contradictions) est **ta** charge, pas la sienne.
- Toujours en français, sauf termes techniques. Dates en absolu (`2026-06-10`).
- Le wiki est un repo git de markdown : versionné, diffable. Commits seulement si demandé.
