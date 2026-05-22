import { useRouter } from "expo-router";
import { ArrowLeft, Check, Mic, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AudioButton } from "@/components/ui/AudioButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Screen } from "@/components/ui/Screen";
import { SEED_WORDS } from "@/data/words";
import { cn } from "@/lib/cn";
import { analyzeUsage } from "@/services/openai";
import { useAppStore } from "@/store/useAppStore";

const SESSION = SEED_WORDS.slice(0, 5);

export default function LearnScreen() {
  const router = useRouter();
  const markLearned = useAppStore((s) => s.markLearned);
  const [i, setI] = useState(0);
  const [sentence, setSentence] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; text: string } | null>(null);
  const [done, setDone] = useState(false);

  const word = SESSION[i];

  async function analyze() {
    if (!sentence.trim()) return;
    setAnalyzing(true);
    const res = await analyzeUsage(word.term, sentence.trim());
    setFeedback({ score: res.score, text: res.feedback });
    setAnalyzing(false);
  }

  function next() {
    markLearned(word.id);
    setSentence("");
    setFeedback(null);
    if (i < SESSION.length - 1) setI(i + 1);
    else setDone(true);
  }

  if (done) {
    return (
      <Screen scroll={false}>
        <View className="flex-1 items-center justify-center gap-5">
          <View className="w-24 h-24 rounded-full bg-[rgba(52,199,89,0.14)] items-center justify-center">
            <Check size={44} color="#34C759" />
          </View>
          <Text className="text-h2 font-semibold text-text">Session terminée !</Text>
          <Text className="text-muted text-center">
            {SESSION.length} mots ajoutés à ton carnet · +{SESSION.length * 20} XP
          </Text>
          <View className="flex-row gap-3">
            <Button title="Accueil" variant="secondary" onPress={() => router.replace("/(tabs)")} />
            <Button title="Réviser" onPress={() => router.push("/review")} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center gap-3 mb-6 mt-1">
        <Pressable onPress={() => router.back()} className="w-11 h-11 rounded-full bg-surface2 items-center justify-center">
          <ArrowLeft size={20} color="#1D1D1F" />
        </Pressable>
        <View className="flex-1">
          <ProgressBar value={(i + 1) / SESSION.length} />
        </View>
        <Badge tone="muted" label={`${i + 1} / ${SESSION.length}`} />
      </View>

      <Animated.View key={word.id} entering={FadeIn.duration(280)} className="items-center gap-5">
        <Text className="text-eyebrow font-semibold uppercase text-secondary">Répète après l’audio</Text>
        <Text className="text-[64px] font-semibold text-primary tracking-tight text-center leading-none">
          {word.term}
        </Text>
        <Text className="text-secondary font-mono">
          {word.phon} · <Text className="text-muted">{word.pos}</Text>
        </Text>
        <AudioButton text={word.term} size={96} />
        <Text className="text-muted text-center max-w-[420px]">{word.def}</Text>

        {/* Usage actif */}
        <Card className="w-full gap-3 mt-2">
          <View className="flex-row items-center gap-2">
            <Mic size={18} color="#0077ED" />
            <Text className="font-semibold text-text">Utilise « {word.term} » dans une phrase</Text>
          </View>
          <TextInput
            value={sentence}
            onChangeText={setSentence}
            placeholder="Écris (ou dicte) ta phrase…"
            placeholderTextColor="#6E6E73"
            multiline
            className="bg-surface2 rounded-md p-3 text-text min-h-[64px]"
          />
          <Button
            title={analyzing ? "Analyse…" : "Analyser avec l’IA"}
            variant="secondary"
            block
            loading={analyzing}
            onPress={analyze}
          />
          {feedback ? (
            <Animated.View entering={FadeIn} className="border-l-[3px] border-secondary bg-[rgba(0,113,227,0.10)] rounded-md p-4">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-1.5">
                  <Sparkles size={16} color="#0077ED" />
                  <Text className="font-semibold text-text">Feedback IA</Text>
                </View>
                <Badge tone={feedback.score >= 80 ? "success" : "accent"} label={`${feedback.score}%`} />
              </View>
              <Text className="text-caption text-muted">{feedback.text}</Text>
            </Animated.View>
          ) : null}
        </Card>
      </Animated.View>

      <View className="flex-row gap-3 mt-5">
        <Button title="Réécouter" variant="secondary" block onPress={() => {}} />
        <View className="flex-1">
          <Button title="Je connais" icon={<Check size={18} color="#fff" />} block onPress={next} />
        </View>
      </View>
      {analyzing ? <ActivityIndicator className="mt-4" color="#0071E3" /> : null}
    </Screen>
  );
}
