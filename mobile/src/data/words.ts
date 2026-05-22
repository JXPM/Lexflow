import type { Word } from "@/types";

/** Seed vocabulary — also used to seed Firestore on first run. */
export const SEED_WORDS: Word[] = [
  {
    id: "serendipite",
    term: "Sérendipité",
    pos: "n.f.",
    phon: "/se.ʁɛ̃.di.pi.te/",
    def: "Le fait de faire une découverte heureuse et inattendue par hasard.",
    ex: "Une simple sérendipité l’a conduite vers sa véritable vocation.",
    tag: "Rare",
    synonyms: ["hasard heureux", "aubaine"],
    antonyms: ["malchance"],
  },
  {
    id: "eloquence",
    term: "Éloquence",
    pos: "n.f.",
    phon: "/e.lɔ.kɑ̃s/",
    def: "L’art de s’exprimer avec aisance et de convaincre par la parole.",
    ex: "Son éloquence a captivé toute la salle en quelques minutes.",
    tag: "Soutenu",
    synonyms: ["verve", "facilité d’élocution"],
    antonyms: ["mutisme"],
  },
  {
    id: "resilience",
    term: "Résilience",
    pos: "n.f.",
    phon: "/ʁe.zi.ljɑ̃s/",
    def: "Capacité à surmonter une épreuve et à se reconstruire.",
    ex: "La résilience de l’équipe a impressionné tout le monde.",
    tag: "Courant",
    synonyms: ["endurance", "ténacité"],
    antonyms: ["fragilité"],
  },
  {
    id: "ephemere",
    term: "Éphémère",
    pos: "adj.",
    phon: "/e.fe.mɛʁ/",
    def: "Qui ne dure qu’un temps très court.",
    ex: "Le bonheur éphémère d’un matin d’été.",
    tag: "Poétique",
    synonyms: ["passager", "fugace"],
    antonyms: ["durable", "éternel"],
  },
  {
    id: "perspicace",
    term: "Perspicace",
    pos: "adj.",
    phon: "/pɛʁ.spi.kas/",
    def: "Qui comprend les choses avec finesse et rapidité.",
    ex: "Une remarque perspicace qui change tout le débat.",
    tag: "Soutenu",
    synonyms: ["clairvoyant", "fin"],
    antonyms: ["obtus"],
  },
  {
    id: "quietude",
    term: "Quiétude",
    pos: "n.f.",
    phon: "/kje.tyd/",
    def: "État de calme paisible et de tranquillité d’esprit.",
    ex: "Il retrouve la quiétude dès qu’il marche en forêt.",
    tag: "Rare",
    synonyms: ["sérénité", "paix"],
    antonyms: ["inquiétude", "agitation"],
  },
];

export const BADGES = [
  { id: "week1", name: "Première semaine", earned: true },
  { id: "w100", name: "100 mots", earned: true },
  { id: "streak10", name: "Série x10", earned: true },
  { id: "orator", name: "Orateur", earned: false },
  { id: "lvl10", name: "Niveau 10", earned: false },
  { id: "polyglot", name: "Polyglotte", earned: false },
];

export const MOTIVATION = [
  "Un mot par jour éloigne l’oubli.",
  "Le vocabulaire, c’est la liberté de penser plus loin.",
  "Tu n’apprends pas des mots, tu gagnes des nuances.",
  "La régularité bat l’intensité.",
];
