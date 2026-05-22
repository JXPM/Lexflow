import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { newEntry, review } from "@/services/spacedRepetition";
import type { LearningProfile, NotebookEntry, WordStatus } from "@/types";

interface Settings {
  audioRate: number; // 0.5 – 1.0
  darkMode: boolean;
  notifications: boolean;
  dailyReminder: string; // "20:00"
  voiceAccent: string;
  language: string;
}

interface AppState {
  hydrated: boolean;
  onboarded: boolean;
  name: string;
  level: number;
  xp: number;
  streak: number;
  todayLearned: number;
  profile: LearningProfile;
  settings: Settings;
  /** keyed by wordId */
  notebook: Record<string, NotebookEntry>;

  setHydrated: (v: boolean) => void;
  completeOnboarding: (profile: Partial<LearningProfile>, name?: string) => void;
  toggleSave: (wordId: string) => void;
  markLearned: (wordId: string) => void;
  setStatus: (wordId: string, status: WordStatus) => void;
  reviewWord: (wordId: string, correct: boolean) => void;
  addXp: (amount: number) => void;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

const XP_PER_LEVEL = 500;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboarded: false,
      name: "Johan",
      level: 7,
      xp: 2480,
      streak: 12,
      todayLearned: 6,
      profile: { goalMinutes: 10, dailyWordGoal: 10, reason: "", modes: ["listen"] },
      settings: {
        audioRate: 0.92,
        darkMode: false,
        notifications: true,
        dailyReminder: "20:00",
        voiceAccent: "fr-FR",
        language: "Français",
      },
      notebook: {},

      setHydrated: (v) => set({ hydrated: v }),

      completeOnboarding: (profile, name) =>
        set((s) => ({
          onboarded: true,
          name: name ?? s.name,
          profile: { ...s.profile, ...profile },
        })),

      toggleSave: (wordId) =>
        set((s) => {
          const existing = s.notebook[wordId];
          const entry = existing
            ? { ...existing, saved: !existing.saved }
            : newEntry(wordId, true);
          return { notebook: { ...s.notebook, [wordId]: entry } };
        }),

      markLearned: (wordId) =>
        set((s) => {
          const entry = s.notebook[wordId] ?? newEntry(wordId, true);
          return {
            todayLearned: s.todayLearned + 1,
            xp: s.xp + 20,
            level: Math.floor((s.xp + 20) / XP_PER_LEVEL) + 1,
            notebook: { ...s.notebook, [wordId]: { ...entry, status: "understood" } },
          };
        }),

      setStatus: (wordId, status) =>
        set((s) => {
          const entry = s.notebook[wordId] ?? newEntry(wordId, true);
          return { notebook: { ...s.notebook, [wordId]: { ...entry, status } } };
        }),

      reviewWord: (wordId, correct) =>
        set((s) => {
          const entry = s.notebook[wordId] ?? newEntry(wordId, true);
          const xp = correct ? s.xp + 20 : s.xp;
          return {
            xp,
            level: Math.floor(xp / XP_PER_LEVEL) + 1,
            notebook: { ...s.notebook, [wordId]: review(entry, correct) },
          };
        }),

      addXp: (amount) =>
        set((s) => ({ xp: s.xp + amount, level: Math.floor((s.xp + amount) / XP_PER_LEVEL) + 1 })),

      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),

      reset: () =>
        set({
          onboarded: false,
          xp: 0,
          level: 1,
          streak: 0,
          todayLearned: 0,
          notebook: {},
        }),
    }),
    {
      name: "lexflow-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

/** XP progress (0..1) toward the next level. */
export function levelProgress(xp: number) {
  return (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
}
