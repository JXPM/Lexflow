import type { User } from "firebase/auth";
import { useEffect, useRef } from "react";

import { useAppStore } from "@/store/useAppStore";
import { watchAuth } from "./auth";
import { fetchNotebook, fetchSnapshot, saveEntry, saveSnapshot } from "./firestore";
import { captureError, setMonitoringUser, trackEvent } from "./monitoring";

const PUSH_DEBOUNCE_MS = 1500;

/**
 * Two-way "last-write-wins" sync between the local Zustand store and Firestore.
 *
 * On sign-in:
 *  - If a cloud snapshot exists → cloud overwrites local (handles new-device login).
 *  - If no cloud snapshot exists → keep local and push it (handles users who had
 *    local-only progress before sync was wired up).
 *
 * While signed in:
 *  - Any store change pushes a debounced snapshot + the changed notebook entries.
 */
export function useCloudSync() {
  const syncedUidRef = useRef<string | null>(null);
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubAuth = watchAuth(async (user: User | null) => {
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current);
        pushTimerRef.current = null;
      }

      if (!user) {
        syncedUidRef.current = null;
        setMonitoringUser(null);
        return;
      }

      const uid = user.uid;
      setMonitoringUser(uid);
      trackEvent("auth.sign_in", { uid });
      try {
        const [cloudSnap, cloudNotebook] = await Promise.all([
          fetchSnapshot(uid),
          fetchNotebook(uid),
        ]);

        if (cloudSnap) {
          // Cloud wins: user is logging back in (possibly on a new device).
          const notebookByKey: Record<string, (typeof cloudNotebook)[number]> = {};
          for (const entry of cloudNotebook) notebookByKey[entry.wordId] = entry;
          useAppStore.setState({
            profile: cloudSnap.profile,
            name: cloudSnap.name,
            // Restore onboarding flag from the cloud. Legacy docs lack the field
            // (undefined) → fall back to whatever the local store already has.
            onboarded: cloudSnap.onboarded ?? useAppStore.getState().onboarded,
            xp: cloudSnap.xp,
            level: cloudSnap.level,
            streak: cloudSnap.streak,
            todayLearned: cloudSnap.todayLearned,
            notebook: notebookByKey,
          });
        }

        // Push current state — covers brand-new users with local data but no cloud doc.
        const fresh = useAppStore.getState();
        await saveSnapshot(uid, {
          profile: fresh.profile,
          name: fresh.name,
          onboarded: fresh.onboarded,
          xp: fresh.xp,
          level: fresh.level,
          streak: fresh.streak,
          todayLearned: fresh.todayLearned,
        });
        await Promise.all(Object.values(fresh.notebook).map((e) => saveEntry(uid, e)));

        syncedUidRef.current = uid;
      } catch (e) {
        captureError(e, { stage: "initial-sync", uid });
      }
    });

    const unsubStore = useAppStore.subscribe((state, prev) => {
      const uid = syncedUidRef.current;
      if (!uid) return;

      const snapshotChanged =
        state.profile !== prev.profile ||
        state.name !== prev.name ||
        state.onboarded !== prev.onboarded ||
        state.xp !== prev.xp ||
        state.level !== prev.level ||
        state.streak !== prev.streak ||
        state.todayLearned !== prev.todayLearned;
      const notebookChanged = state.notebook !== prev.notebook;

      if (!snapshotChanged && !notebookChanged) return;

      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      pushTimerRef.current = setTimeout(async () => {
        const fresh = useAppStore.getState();
        try {
          if (snapshotChanged) {
            await saveSnapshot(uid, {
              profile: fresh.profile,
              name: fresh.name,
              onboarded: fresh.onboarded,
              xp: fresh.xp,
              level: fresh.level,
              streak: fresh.streak,
              todayLearned: fresh.todayLearned,
            });
          }
          if (notebookChanged) {
            for (const entry of Object.values(state.notebook)) {
              if (prev.notebook[entry.wordId] !== entry) {
                await saveEntry(uid, entry);
              }
            }
          }
        } catch (e) {
          captureError(e, { stage: "push", uid });
        }
      }, PUSH_DEBOUNCE_MS);
    });

    return () => {
      unsubAuth();
      unsubStore();
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    };
  }, []);
}
