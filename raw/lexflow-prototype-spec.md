# LexFlow — Spécification du prototype (snapshot 2026-06-10)

Source #1 du second cerveau : snapshot de ce qu'est LexFlow à ce jour, tiré du `README.md`
du prototype web et de l'app mobile Expo.

## Pitch
« Apprends des mots sans avoir l'impression d'étudier. » App d'enrichissement du
vocabulaire, **audio-first**, immersive. Esthétique minimaliste premium « Apple »
(police SF Pro, bleu `#0071E3`). Principe UX : **Audio > Interaction > Lecture**,
max ~30 mots visibles par écran.

## Écrans livrés
Splash · Onboarding (Objectif → Temps → Style) · Dashboard · Découverte (feed type TikTok
avec visuels générés par mot + skeleton de chargement) · Session d'apprentissage (mot géant,
audio, micro, feedback IA) · Carnet (recherche, filtres, état vide) · Révisions (quiz audio,
XP, score, succès) · Statistiques (courbes, barres, série, niveau) · Profil (avatar, badges) ·
Paramètres (toggles, objectif, action destructive + modal de confirmation).

## User flow
Splash → Onboarding → Dashboard → {Découverte, Apprendre, Carnet, Révisions, Stats} → Profil/Paramètres.

## Stack technique
- **Prototype web** : HTML/CSS/JS pur, sans dépendance. Audio réel via Web Speech API
  (`SpeechSynthesis`, `lang=fr-FR`). Router maison `setView(name)`. Tokens via variables CSS `:root`.
- **App mobile** : Expo / React Native (SDK 56), TypeScript. Services : Firestore (persistance),
  OpenAI + Gemini (feedback IA / génération), Pexels (visuels), monitoring, cloud sync.
- Accessibilité : focus visibles, ARIA, contrastes AA, cibles ≥44px, `prefers-reduced-motion`.

## Mécaniques d'apprentissage présentes
- **Répétition espacée** implicite via l'écran Révisions (quiz).
- **Rappel actif** : quiz audio, réponse ✓/✗.
- **Gamification** : XP, niveau, série (streak), badges.
- **Feedback IA** sur la prononciation (micro → analyse).

## Direction produit
Responsive desktop + feed découverte type TikTok, avec un visuel généré par mot.
Cible : rendre l'apprentissage du vocabulaire aussi addictif et fluide qu'un feed social.
