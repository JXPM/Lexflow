import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

import type { LearningProfile, NotebookEntry } from "@/types";
import { db } from "./firebase";

/**
 * Cloud-synced subset of the local store. Notebook entries live in a
 * subcollection (one doc per word) so we can write them individually.
 */
export interface CloudSnapshot {
  profile: LearningProfile;
  name: string;
  onboarded: boolean;
  xp: number;
  level: number;
  streak: number;
  todayLearned: number;
  updatedAt: number;
}

/**
 * Best-effort cloud sync. All functions no-op gracefully when Firebase
 * isn't configured, so the app stays fully usable offline.
 */
export async function fetchSnapshot(uid: string): Promise<CloudSnapshot | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as CloudSnapshot) : null;
}

export async function saveSnapshot(uid: string, snapshot: Omit<CloudSnapshot, "updatedAt">) {
  if (!db) return;
  await setDoc(doc(db, "users", uid), { ...snapshot, updatedAt: Date.now() }, { merge: true });
}

export async function saveEntry(uid: string, entry: NotebookEntry) {
  if (!db) return;
  await setDoc(doc(db, "users", uid, "notebook", entry.wordId), entry, { merge: true });
}

export async function fetchNotebook(uid: string): Promise<NotebookEntry[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, "users", uid, "notebook"));
  return snap.docs.map((d) => d.data() as NotebookEntry);
}
