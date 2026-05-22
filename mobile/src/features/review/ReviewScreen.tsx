import { useRouter } from "expo-router";
import { Trophy, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AudioButton } from "@/components/ui/AudioButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { SEED_WORDS } from "@/data/words";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";
import type { Word } from "@/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL = 4;

export default function ReviewScreen() {
  const router = useRouter();
  const reviewWord = useAppStore((s) => s.reviewWord);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const correct = SEED_WORDS[i % SEED_WORDS.length];
  const options = useMemo(
    () => shuffle([correct, ...shuffle(SEED_WORDS.filter((w) => w.id !== correct.id)).slice(0, 2)]),
    [i], // eslint-disable-line react-hooks/exhaustive-deps
  );

  function answer(opt: Word) {
    if (picked) return;
    setPicked(opt.id);
    const ok = opt.id === correct.id;
    if (ok) setScore((s) => s + 1);
    reviewWord(correct.id, ok);
    setTimeout(() => {
      setPicked(null);
      setI((n) => n + 1);
    }, 1100);
  }

  if (i >= TOTAL) {
    const perfect = score === TOTAL;
    return (
      <Screen scroll={false}>
        <View className="flex-1 items-center justify-center gap-5">
          <View className="w-24 h-24 rounded-full bg-[rgba(52,199,89,0.14)] items-center justify-center">
            <Trophy size={44} color="#34C759" />
          </View>
          <Text className="text-h2 font-semibold text-text">{perfect ? "Sans-faute !" : "Quiz terminé"}</Text>
          <Text className="text-muted">
            Score {score}/{TOTAL} · +{score * 20} XP
          </Text>
          <View className="flex-row gap-3">
            <Button title="Fermer" variant="secondary" onPress={() => router.back()} />
            <Button
              title="Rejouer"
              onPress={() => {
                setI(0);
                setScore(0);
              }}
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View className="flex-row items-center justify-between mt-2 mb-6">
        <View>
          <Text className="text-eyebrow uppercase font-semibold text-secondary">Révisions</Text>
          <Text className="text-h2 font-bold text-text">Quiz du jour</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Badge tone="accent" label={`${score * 20} XP`} />
          <Pressable onPress={() => router.back()} className="w-11 h-11 rounded-full bg-surface2 items-center justify-center">
            <X size={20} color="#1D1D1F" />
          </Pressable>
        </View>
      </View>

      <Animated.View key={i} entering={FadeIn.duration(280)}>
        <Card className="gap-5">
          <View className="items-center gap-3">
            <Text className="text-caption text-muted">Quel mot correspond à cette définition ?</Text>
            <AudioButton text={correct.term} size={88} />
            <Text className="text-center text-text">{correct.def}</Text>
          </View>
          <View className="gap-3">
            {options.map((o) => {
              const state =
                picked == null
                  ? "idle"
                  : o.id === correct.id
                    ? "correct"
                    : o.id === picked
                      ? "wrong"
                      : "idle";
              return (
                <Pressable
                  key={o.id}
                  onPress={() => answer(o)}
                  className={cn(
                    "flex-row items-center justify-between rounded-md border px-4 min-h-[56px]",
                    state === "correct" && "bg-[rgba(52,199,89,0.14)] border-success",
                    state === "wrong" && "bg-[rgba(255,59,48,0.12)] border-error",
                    state === "idle" && "bg-surface border-borderStrong",
                  )}
                >
                  <Text className="font-semibold text-text">{o.term}</Text>
                  <Text className="text-muted text-caption">{o.pos}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      </Animated.View>
    </Screen>
  );
}
