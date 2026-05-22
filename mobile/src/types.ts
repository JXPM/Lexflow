export type WordStatus = "discovered" | "understood" | "mastered";

export interface Word {
  id: string;
  term: string;
  pos: string; // part of speech, e.g. "n.f."
  phon: string; // phonetic
  def: string;
  ex: string; // real-life example
  tag: string; // register/level label
  synonyms?: string[];
  antonyms?: string[];
}

/** A word the user is learning, with spaced-repetition scheduling. */
export interface NotebookEntry {
  wordId: string;
  status: WordStatus;
  saved: boolean;
  /** SM-2 style box (0..4) mapping to 1/3/7/14/30 day intervals. */
  box: number;
  dueAt: number; // epoch ms
  addedAt: number;
}

export interface LearningProfile {
  goalMinutes: number; // daily time budget
  dailyWordGoal: number;
  reason: string; // why they want to progress
  modes: string[]; // listen / speak / play / read / video
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
