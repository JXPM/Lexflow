import { Volume2 } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";

import { speak } from "@/services/tts";
import { shadows } from "@/theme/tokens";

/** Round blue play button that speaks a word via TTS. */
export function AudioButton({ text, size = 52 }: { text: string; size?: number }) {
  const [playing, setPlaying] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Écouter ${text}`}
      onPress={() => {
        setPlaying(true);
        speak(text, { onDone: () => setPlaying(false) });
      }}
      className="items-center justify-center rounded-full bg-primary active:scale-90"
      style={[{ width: size, height: size, opacity: playing ? 0.85 : 1 }, shadows.glowPrimary]}
    >
      <Volume2 size={size * 0.42} color="#FFFFFF" strokeWidth={2} />
    </Pressable>
  );
}
