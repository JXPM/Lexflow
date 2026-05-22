# LexFlow — Prototype web

> **Apprends des mots sans avoir l'impression d'étudier.**
> Application web immersive, audio-first, pour enrichir son vocabulaire. Style minimaliste premium, clair, esthétique « Apple » (SF Pro, bleu #0071E3).

Prototype **cliquable, responsive et sans dépendance** (HTML/CSS/JS pur). Les mots se prononcent réellement via la **Web Speech API**.

---

## 1. Lancer le prototype

### Option A — ouvrir directement
Double-clique sur `index.html`. (L'audio et les polices Google nécessitent une connexion internet.)

### Option B — serveur local (recommandé, requis pour l'import Figma par URL)
```bash
cd /home/johan/Lexflow
python3 -m http.server 8080
# puis ouvre http://localhost:8080
```

**Écrans :** Splash → Onboarding (3 étapes) → l'app. Bouton « J'ai déjà un compte » pour aller direct au Dashboard.
**Astuce :** la page `design-system.html` montre tous les tokens & composants.

---

## 2. Importer le HTML dans Figma  ⭐

Aucun outil ne génère un `.fig` natif directement. La méthode standard des designers est un plugin qui **recrée le HTML en calques Figma éditables** (frames, textes, couleurs, auto-layout).

### Méthode recommandée — plugin **html.to.design** (gratuit)

1. Dans Figma : **menu → Plugins → Browse plugins** → cherche **« html.to.design »** → *Install*.
2. Lance le serveur local (Option B ci-dessus) **ou** déploie le dossier (Netlify Drop, GitHub Pages, Vercel) pour obtenir une URL publique.
3. Ouvre un fichier Figma → clic droit → **Plugins → html.to.design**.
4. Onglet **URL** : colle `http://localhost:8080` (mode local) ou ton URL publique → **Import**.
   - Onglet **Code/HTML** : tu peux aussi coller directement le contenu d'`index.html`.
5. Choisis la largeur de capture (**1440** desktop, **768** tablette, **375** mobile) → importe les 3 pour tes 3 variantes responsive.
6. Résultat : des **frames éditables** avec textes, couleurs et structure. Range-les en pages Figma (voir arborescence §4).

> 💡 Pour capturer un écran précis (ex. Session, Quiz), navigue jusqu'à lui dans le navigateur **avant** d'importer, ou importe écran par écran.

### Alternatives
- **Builder.io – Figma import** : même principe (URL → Figma).
- **Tokens Studio for Figma** : importe le fichier `tokens.json` (§3) pour avoir des **variables Figma** (couleurs, typo, espacements) liées à tes composants.

### Limites honnêtes de l'import
- Les **animations** (audio, flip, pulse) ne sont pas transférées : Figma est statique. Recrée-les avec Smart Animate dans le mode Prototype.
- Le glassmorphism (`backdrop-filter`) devient un fond + flou approximatif ; ré-applique un effet **Background blur** sur les surfaces.
- Vérifie/rebranche l'**auto-layout** sur les listes et cartes après import.

---

## 3. Design tokens (pour Tokens Studio)

Le fichier `tokens.json` contient couleurs, typographie, espacements et rayons au format **Tokens Studio**. Dans Figma : plugin **Tokens Studio → Import → JSON**.

---

## 4. Arborescence Figma proposée

```
LexFlow (fichier Figma)
├── 📄 00 · Cover
├── 📄 01 · Design System
│   ├── Couleurs · Typographie · Espacements/Radius
│   ├── Composants : Button, Input, Card, Tabs, Chip, Progress,
│   │   Badge, Toggle, Navbar, Bottom-nav, Modal, Player audio,
│   │   Flashcard, Quiz option, Chart, États
│   └── Tokens (variables liées)
├── 📄 02 · User Flow (FigJam ou frames + connecteurs)
├── 📄 03 · Wireframes (basse fidélité, gris)
├── 📄 04 · UI Desktop (1440)
│   └── Splash · Onboarding · Dashboard · Découverte · Session
│       · Carnet · Révisions · Stats · Profil · Paramètres
├── 📄 05 · UI Tablet (768)
├── 📄 06 · UI Mobile (375)
├── 📄 07 · États (vide / chargement / erreur / succès)
└── 📄 08 · Prototype (flows reliés)
```

---

## 5. User Flow

```
Splash ──▶ Onboarding (Objectif → Temps → Style)
   │                       │
   └──(déjà un compte)─────┴──▶ DASHBOARD ◀──────────────┐
                                  │                        │
        ┌──────────┬──────────────┼───────────┬───────────┤
        ▼          ▼              ▼            ▼           ▼
   Découverte   Apprendre       Carnet     Révisions     Stats
   (feed)       (session)       (recherche) (quiz)       (courbes)
        │          │              │            │
   Enregistrer  Audio+Micro    Filtres     Réponse        │
        │       +Feedback IA       │       ✓ / ✗          │
        ▼          ▼              ▼            ▼           ▼
     Carnet    Succès (+XP)    Détail mot   Score+XP     Profil
                                                          (badges, réglages)
                                                             │
                                                          Paramètres
```

**Principe UX :** Audio > Interaction > Lecture. Max ~30 mots visibles par écran.

---

## 6. Architecture du code (doc développeur)

| Fichier | Rôle |
|---|---|
| `index.html` | Shell : sprite d'icônes SVG, Splash, Onboarding, sidebar/bottom-nav, conteneur de vues, modal, toasts |
| `styles.css` | Design system complet : tokens (`:root`), composants, 3 breakpoints (1024 / 680), `prefers-reduced-motion` |
| `app.js` | Données mock, router de vues, audio, onboarding, quiz, flashcards, graphiques SVG, états, toasts, modal |
| `design-system.html` | Showcase tokens & composants |
| `tokens.json` | Tokens au format Tokens Studio |

### Concepts clés
- **Router** : `setView(name)` injecte `VIEWS[name]()` (string HTML) dans `#main` ; `VIEWS[name+'Init']()` exécute la logique post-rendu (ex. chargement du feed, quiz).
- **Audio** : `speak(text, btn)` via `SpeechSynthesis` (`lang=fr-FR`), avec onde animée.
- **Tokens** : tout passe par les variables CSS de `:root` → un seul endroit à modifier pour rethémer.
- **Accessibilité** : focus visibles, `aria-current`/`aria-pressed`/`role="switch"`, contrastes AA, cibles tactiles ≥ 44px, `prefers-reduced-motion`.
- **États** : `emptyState()`, skeleton (`.skeleton`), spinner, `successScreen()`, toasts `aria-live`.

### Breakpoints
| Device | Largeur | Navigation |
|---|---|---|
| Desktop | > 1024px | Sidebar large (260px) |
| Tablet | ≤ 1024px | Sidebar icônes (84px) |
| Mobile | ≤ 680px | Bottom-nav (5 items) |

---

## 7. Écrans livrés

Splash · Onboarding · Dashboard · Découverte (feed + skeleton) · Session d'apprentissage (mot géant, audio, micro, feedback IA) · Carnet (recherche, filtres, état vide) · Révisions (quiz audio, XP, score, succès) · Statistiques (courbe, barres, série, niveau) · Profil (avatar, badges) · Paramètres (toggles, objectif, action destructive + modal de confirmation).

---

*Prototype généré pour itération. Prochaine étape : import Figma (§2) puis ajout des micro-animations en mode Prototype.*
