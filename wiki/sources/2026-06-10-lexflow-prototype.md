---
title: LexFlow — Spécification du prototype
type: source
created: 2026-06-10
url: raw/lexflow-prototype-spec.md
tags: [produit, ux, technique]
---

## Résumé
Snapshot fondateur de [[lexflow]] : une app d'apprentissage du vocabulaire **audio-first**,
esthétique premium « Apple ». Prototype web (HTML/CSS/JS pur) + app mobile Expo/RN. Le
cœur produit : transformer l'apprentissage en feed addictif type TikTok.

## Claims clés
- Principe UX directeur : **Audio > Interaction > Lecture**, ~30 mots max par écran. → [[audio-first-learning]]
- La découverte se fait via un **feed type TikTok** avec un visuel généré par mot. → [[feed-decouverte]]
- Les révisions reposent sur un **quiz audio** avec réponse ✓/✗. → [[rappel-actif]], [[repetition-espacee]]
- La progression est gamifiée : **XP, niveau, série, badges**. → [[gamification]]
- Feedback IA sur la prononciation (micro → analyse) via [[openai]] / [[gemini]].

## Entités
[[lexflow]] · [[openai]] · [[gemini]] · [[expo]] · [[firestore]] · [[pexels]]

## Concepts
[[audio-first-learning]] · [[repetition-espacee]] · [[rappel-actif]] · [[gamification]] · [[feed-decouverte]]

## Citations
> « Apprends des mots sans avoir l'impression d'étudier. »
> « Audio > Interaction > Lecture »

## Questions ouvertes
- L'algorithme de répétition espacée est-il un vrai SM-2/FSRS ou un simple quiz aléatoire ?
- Le feed découverte a-t-il une logique de recommandation, ou est-il séquentiel ?
- Comment le feedback IA de prononciation est-il scoré (OpenAI vs Gemini) ?
