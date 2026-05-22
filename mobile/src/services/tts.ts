import * as Speech from "expo-speech";

import { useAppStore } from "@/store/useAppStore";

interface SpeakOpts {
  onDone?: () => void;
  rate?: number;
}

/** Speak French text aloud. Respects the user's audio-speed setting. */
export function speak(text: string, opts: SpeakOpts = {}) {
  Speech.stop();
  const rate = opts.rate ?? useAppStore.getState().settings.audioRate;
  Speech.speak(text, {
    language: "fr-FR",
    rate,
    onDone: opts.onDone,
    onStopped: opts.onDone,
    onError: opts.onDone,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
