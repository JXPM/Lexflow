import type { NotebookEntry, WordStatus } from "@/types";

const DAY = 24 * 60 * 60 * 1000;

/** Box index → review interval in days (1, 3, 7, 14, 30). */
export const INTERVALS_DAYS = [1, 3, 7, 14, 30];

export function intervalForBox(box: number): number {
  return INTERVALS_DAYS[Math.min(box, INTERVALS_DAYS.length - 1)];
}

function statusForBox(box: number): WordStatus {
  if (box >= 3) return "mastered";
  if (box >= 1) return "understood";
  return "discovered";
}

/** Apply a review result, advancing or resetting the spaced-repetition box. */
export function review(entry: NotebookEntry, correct: boolean): NotebookEntry {
  const box = correct ? Math.min(entry.box + 1, INTERVALS_DAYS.length - 1) : 0;
  return {
    ...entry,
    box,
    status: statusForBox(box),
    dueAt: Date.now() + intervalForBox(box) * DAY,
  };
}

export function newEntry(wordId: string, saved = true): NotebookEntry {
  return {
    wordId,
    saved,
    status: "discovered",
    box: 0,
    dueAt: Date.now() + intervalForBox(0) * DAY,
    addedAt: Date.now(),
  };
}

/** Entries due for review now (or overdue). */
export function dueEntries(entries: NotebookEntry[], now = Date.now()): NotebookEntry[] {
  return entries.filter((e) => e.dueAt <= now);
}
