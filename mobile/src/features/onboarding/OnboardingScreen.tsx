import { useRouter } from "expo-router";
import {
  BookOpen,
  Clock,
  Ear,
  Gamepad2,
  GraduationCap,
  Mic,
  PenLine,
  Target,
  Video,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Screen } from "@/components/ui/Screen";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

type Opt = { id: string; label: string; sub: string; icon: React.ReactNode };
type Step = { q: string; key: string; multi?: boolean; opts: Opt[] };

const C = "#0077ED";
const STEPS: Step[] = [
  {
    q: "Quel âge as-tu ?",
    key: "age",
    opts: [
      { id: "-18", label: "Moins de 18 ans", sub: "Contenus adaptés", icon: <Target size={22} color={C} /> },
      { id: "18-30", label: "18 – 30 ans", sub: "Le plus courant", icon: <Target size={22} color={C} /> },
      { id: "30+", label: "Plus de 30 ans", sub: "À ton rythme", icon: <Target size={22} color={C} /> },
    ],
  },
  {
    q: "Quel est ton niveau de vocabulaire ?",
    key: "level",
    opts: [
      { id: "debutant", label: "Débutant", sub: "On part des bases", icon: <GraduationCap size={22} color={C} /> },
      { id: "intermediaire", label: "Intermédiaire", sub: "J’élargis", icon: <GraduationCap size={22} color={C} /> },
      { id: "avance", label: "Avancé", sub: "Mots rares & soutenus", icon: <GraduationCap size={22} color={C} /> },
    ],
  },
  {
    q: "Pourquoi veux-tu progresser ?",
    key: "reason",
    opts: [
      { id: "perso", label: "Enrichir mon vocabulaire", sub: "Le plus populaire", icon: <BookOpen size={22} color={C} /> },
      { id: "exam", label: "Réussir un examen", sub: "Niveau soutenu", icon: <GraduationCap size={22} color={C} /> },
      { id: "pro", label: "Mieux m’exprimer au travail", sub: "Impact pro", icon: <Mic size={22} color={C} /> },
    ],
  },
  {
    q: "Combien de temps par jour ?",
    key: "time",
    opts: [
      { id: "5", label: "5 minutes", sub: "Tranquille", icon: <Clock size={22} color={C} /> },
      { id: "10", label: "10 minutes", sub: "Recommandé", icon: <Clock size={22} color={C} /> },
      { id: "20", label: "20 minutes", sub: "Intensif", icon: <Clock size={22} color={C} /> },
    ],
  },
  {
    q: "Comment préfères-tu apprendre ?",
    key: "modes",
    multi: true,
    opts: [
      { id: "listen", label: "Écouter", sub: "Audio d’abord", icon: <Ear size={22} color={C} /> },
      { id: "read", label: "Lire", sub: "Définitions & exemples", icon: <BookOpen size={22} color={C} /> },
      { id: "speak", label: "Parler", sub: "Prononciation", icon: <Mic size={22} color={C} /> },
      { id: "write", label: "Écrire", sub: "Reformuler", icon: <PenLine size={22} color={C} /> },
      { id: "video", label: "Vidéos courtes", sub: "Feed découverte", icon: <Video size={22} color={C} /> },
      { id: "play", label: "Jouer", sub: "Mini-jeux & quiz", icon: <Gamepad2 size={22} color={C} /> },
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const current = STEPS[step];
  const value = answers[current.key];
  const canContinue = current.multi ? Array.isArray(value) && value.length > 0 : value != null;
  const isLast = step === STEPS.length - 1;

  function pick(id: string) {
    setAnswers((prev) => {
      if (current.multi) {
        const arr = Array.isArray(prev[current.key]) ? [...(prev[current.key] as string[])] : [];
        const i = arr.indexOf(id);
        if (i >= 0) arr.splice(i, 1);
        else arr.push(id);
        return { ...prev, [current.key]: arr };
      }
      return { ...prev, [current.key]: id };
    });
  }

  const isSelected = (id: string) =>
    current.multi ? Array.isArray(value) && value.includes(id) : value === id;

  function advance() {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    const minutes = Number(answers.time ?? 10);
    completeOnboarding({
      goalMinutes: minutes,
      dailyWordGoal: minutes === 5 ? 5 : minutes === 20 ? 15 : 10,
      reason: String(answers.reason ?? ""),
      modes: (answers.modes as string[]) ?? ["listen"],
    });
    router.replace("/(tabs)");
  }

  const progress = useMemo(() => (step + 1) / STEPS.length, [step]);

  return (
    <Screen scroll={false}>
      <View className="flex-row items-center justify-between mt-2 mb-2">
        <Text className="text-caption text-muted">
          Étape {step + 1} / {STEPS.length}
        </Text>
        <Pressable onPress={() => router.replace("/(tabs)")}>
          <Text className="text-caption text-primary font-semibold">Passer</Text>
        </Pressable>
      </View>
      <ProgressBar value={progress} thin />

      <Animated.View key={step} entering={FadeIn.duration(280)} className="flex-1 mt-6">
        <Text className="text-h2 font-semibold text-text mb-5">{current.q}</Text>
        <View className="gap-3">
          {current.opts.map((o) => {
            const sel = isSelected(o.id);
            return (
              <Pressable
                key={o.id}
                onPress={() => pick(o.id)}
                className={cn(
                  "flex-row items-center gap-4 p-4 rounded-md border min-h-[72px]",
                  sel ? "border-primary bg-[rgba(0,113,227,0.10)]" : "border-borderStrong bg-surface",
                )}
              >
                <View className="w-11 h-11 rounded-md bg-surface2 items-center justify-center">{o.icon}</View>
                <View className="flex-1">
                  <Text className="font-semibold text-text">{o.label}</Text>
                  <Text className="text-caption text-muted">{o.sub}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <View className="pb-8">
        <Button
          title={isLast ? "Lancer LexFlow" : "Continuer"}
          size="lg"
          block
          disabled={!canContinue}
          onPress={advance}
        />
      </View>
    </Screen>
  );
}
