import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { auth, isFirebaseConfigured } from "./firebase";

export function watchAuth(cb: (user: User | null) => void) {
  if (!auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

export async function signInGuest() {
  if (!auth) return null;
  const cred = await signInAnonymously(auth);
  return cred.user;
}

export async function signInEmail(email: string, password: string) {
  if (!auth) throw new Error("Firebase non configuré");
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signUpEmail(email: string, password: string) {
  if (!auth) throw new Error("Firebase non configuré");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  if (auth) await signOut(auth);
}

export { isFirebaseConfigured };
