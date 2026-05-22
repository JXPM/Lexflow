import {
  Anchor,
  Brain,
  Compass,
  Feather,
  Flame,
  Gem,
  Leaf,
  Lightbulb,
  Sparkles,
  Star,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react-native";

import type { Word } from "@/types";

/** Vivid gradient pairs — used as full-screen backgrounds in the discover feed. */
const GRADIENTS: readonly [string, string][] = [
  ["#0071E3", "#5E5CE6"],
  ["#BF5AF2", "#0071E3"],
  ["#FF2D55", "#FF9500"],
  ["#34C759", "#0AB6BC"],
  ["#5E5CE6", "#BF5AF2"],
  ["#FF9F0A", "#FF375F"],
  ["#0AB6BC", "#0071E3"],
  ["#AF52DE", "#FF2D55"],
];

const ICONS: readonly LucideIcon[] = [
  Sparkles,
  Feather,
  Brain,
  Lightbulb,
  Gem,
  Star,
  Compass,
  Waves,
  Leaf,
  Wind,
  Flame,
  Anchor,
];

/** Map a register/level tag to a meaningful icon when we have one. */
const TAG_ICONS: Record<string, LucideIcon> = {
  Rare: Gem,
  Soutenu: Feather,
  Littéraire: Feather,
  Familier: Wind,
  Courant: Compass,
  Scientifique: Brain,
  Philosophie: Lightbulb,
  Nature: Leaf,
};

/** Stable string hash → non-negative int. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export interface WordVisual {
  gradient: [string, string];
  Icon: LucideIcon;
}

/** Deterministic visual identity for a word: same word → same gradient & icon. */
export function wordVisual(word: Word): WordVisual {
  const h = hash(word.id);
  const gradient = GRADIENTS[h % GRADIENTS.length];
  const Icon = TAG_ICONS[word.tag] ?? ICONS[h % ICONS.length];
  return { gradient, Icon };
}
