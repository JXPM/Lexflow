import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
// @ts-expect-error getReactNativePersistence is exported but missing from some type bundles
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from "firebase/auth";
import { initializeFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** True only when real credentials are present in the environment. */
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  const app = getApps().length ? getApp() : initializeApp(config as Record<string, string>);
  try {
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // Already initialized (fast refresh) — reuse existing instance.
    auth = getAuth(app);
  }
  // En React Native / Expo Go, le transport WebChannel par défaut de Firestore
  // pend souvent à la connexion. Forcer le long-polling règle ce blocage.
  db = initializeFirestore(app, { experimentalForceLongPolling: true });
  storage = getStorage(app);
}

export { auth, db, storage };
