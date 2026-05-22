import { useRouter } from "expo-router";
import { BookOpen, Camera, Clock, Flame, Play, Sparkles, Zap } from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { AudioButton } from "@/components/ui/AudioButton";
import { Badge } from "@/components/ui/Badge";
import { BarsChart } from "@/components/ui/Charts";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { Screen } from "@/components/ui/Screen";
import { StatTile } from "@/components/ui/StatTile";
import { Eyebrow } from "@/components/ui/Typography";
import { MOTIVATION, SEED_WORDS } from "@/data/words";
import { useAppStore } from "@/store/useAppStore";

function greet() {
  const h = new Date().getHours();
  return h < 12 ? "Bonne matinée" : h < 18 ? "Bel après-midi" : "Bonne soirée";
}

export default function DashboardScreen() {
  const router = useRouter();
  const { name, streak, xp, todayLearned, profile } = useAppStore();
  const goal = profile.dailyWordGoal;
  const pct = Math.min(100, Math.round((todayLearned / goal) * 100));
  const word = SEED_WORDS[0];
  const quote = useMemo(() => MOTIVATION[new Date().getDate() % MOTIVATION.length], []);

  return (
    <Screen>
      <View className="flex-row items-start justify-between mb-6 mt-1">
        <View className="flex-1">
          <Eyebrow>{greet()}</Eyebrow>
          <Text className="text-h1 font-bold text-text mt-1">Bonjour, {name}</Text>
        </View>
        <Badge tone="streak" label={`${streak} jours`} icon={<Flame size={14} color="#BF5AF2" />} />
      </View>

      {/* Objectif du jour */}
      <Card className="flex-row items-center justify-between gap-4 mb-4">
        <View className="flex-1 gap-3">
          <Eyebrow>Objectif du jour</Eyebrow>
          <Text className="text-h2 font-semibold text-text">
            {todayLearned} / {goal} mots
          </Text>
          <Text className="text-muted text-caption">
            Plus que {Math.max(0, goal - todayLearned)} mots pour valider ta journée.
          </Text>
          <Button
            title="Continuer"
            icon={<Play size={18} color="#fff" />}
            onPress={() => router.push("/(tabs)/learn")}
          />
        </View>
        <Ring percent={pct} size={120} />
      </Card>

      {/* Mot du jour */}
      <Card className="mb-4 gap-3">
        <View className="flex-row items-center justify-between">
          <Eyebrow>Mot du jour</Eyebrow>
          <Sparkles size={18} color="#BF5AF2" />
        </View>
        <View className="flex-row items-center gap-3">
          <Text className="text-h3 font-extrabold text-text">{word.term}</Text>
          <AudioButton text={word.term} size={40} />
        </View>
        <Text className="text-caption text-secondary font-mono">{word.phon}</Text>
        <Text className="text-muted">{word.def}</Text>
        <Button title="Découvrir d’autres mots" variant="secondary" block onPress={() => router.push("/(tabs)/discover")} />
      </Card>

      {/* Quick actions IA */}
      <View className="flex-row gap-3 mb-4">
        <Pressable onPress={() => router.push("/coach")} className="flex-1">
          <Card variant="tile" className="items-center gap-2 py-4">
            <Sparkles size={22} color="#0077ED" />
            <Text className="font-semibold text-text text-caption">Coach IA</Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => router.push("/capture")} className="flex-1">
          <Card variant="tile" className="items-center gap-2 py-4">
            <Camera size={22} color="#0077ED" />
            <Text className="font-semibold text-text text-caption">Capturer un mot</Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => router.push("/review")} className="flex-1">
          <Card variant="tile" className="items-center gap-2 py-4">
            <Zap size={22} color="#0077ED" />
            <Text className="font-semibold text-text text-caption">Réviser</Text>
          </Card>
        </Pressable>
      </View>

      {/* Stats */}
      <View className="flex-row gap-3 mb-4">
        <StatTile label="XP total" value={xp.toLocaleString("fr-FR")} sub="+120 aujourd’hui" icon={<Zap size={18} color="#0077ED" />} />
        <StatTile label="Mots appris" value="342" sub="sur 6 thèmes" icon={<BookOpen size={18} color="#0077ED" />} />
      </View>

      {/* Quote */}
      <Card variant="tile" className="mb-4">
        <Text className="text-text italic">« {quote} »</Text>
      </Card>

      {/* Week chart */}
      <Card>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-h3 font-semibold text-text">Cette semaine</Text>
          <Clock size={18} color="#6E6E73" />
        </View>
        <BarsChart data={[4, 7, 3, 8, 6, 9, 6]} labels={["L", "M", "M", "J", "V", "S", "D"]} />
      </Card>
    </Screen>
  );
}
