import { collection, doc, getDocs, setDoc } from "firebase/firestore";

import type { LearningProfile, NotebookEntry } from "@/types";
import { db } from "./firebase";

/**
 * Best-effort cloud sync. All functions no-op gracefully when Firebase
 * isn't configured, so the app stays fully usable offline.
 */
export async function saveProfile(uid: string, profile: LearningProfile) {
  if (!db) return;
  await setDoc(doc(db, "users", uid), { profile }, { merge: true });
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
