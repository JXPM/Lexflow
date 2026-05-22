import { useRouter } from "expo-router";
import { ArrowLeft, BookOpen, Clock, Flame, Zap } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { BarsChart, LineChart } from "@/components/ui/Charts";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Screen } from "@/components/ui/Screen";
import { StatTile } from "@/components/ui/StatTile";
import { levelProgress, useAppStore } from "@/store/useAppStore";

export default function StatsScreen() {
  const router = useRouter();
  const { streak, level, xp } = useAppStore();
  const progress = levelProgress(xp);

  return (
    <Screen>
      <View className="flex-row items-center gap-3 mb-6 mt-1">
        <Pressable onPress={() => router.back()} className="w-11 h-11 rounded-full bg-surface2 items-center justify-center">
          <ArrowLeft size={20} color="#1D1D1F" />
        </Pressable>
        <View>
          <Text className="text-eyebrow uppercase font-semibold text-secondary">Progression</Text>
          <Text className="text-h2 font-bold text-text">Statistiques</Text>
        </View>
      </View>

      <View className="flex-row gap-3 mb-3">
        <StatTile label="Série" value={streak} sub="record : 21 j" icon={<Flame size={18} color="#0077ED" />} />
        <StatTile label="Niveau" value={level} sub={`${Math.round(progress * 100)}% vers ${level + 1}`} icon={<Zap size={18} color="#0077ED" />} />
      </View>
      <View className="flex-row gap-3 mb-4">
        <StatTile label="Mots maîtrisés" value="342" sub="+24 / semaine" icon={<BookOpen size={18} color="#0077ED" />} />
        <StatTile label="Temps total" value="18h" sub="depuis le début" icon={<Clock size={18} color="#0077ED" />} />
      </View>

      <Card className="mb-4">
        <Text className="text-h3 font-semibold text-text mb-4">Mots appris (ce mois)</Text>
        <LineChart data={[6, 9, 7, 12, 10, 15, 13, 18]} />
      </Card>

      <Card className="mb-4 gap-3">
        <Text className="text-h3 font-semibold text-text">Progression du niveau</Text>
        <View className="flex-row justify-between">
          <Text className="text-caption text-muted">Niveau {level}</Text>
          <Text className="text-caption text-muted">Niveau {level + 1}</Text>
        </View>
        <ProgressBar value={progress} />
        <Text className="text-caption text-muted">
          Encore {Math.round((1 - progress) * 500)} XP pour atteindre le niveau {level + 1}.
        </Text>
      </Card>

      <Card>
        <Text className="text-h3 font-semibold text-text mb-4">Régularité</Text>
        <BarsChart data={[3, 5, 2, 6, 4, 7, 5]} labels={["L", "M", "M", "J", "V", "S", "D"]} />
      </Card>
    </Screen>
  );
}
