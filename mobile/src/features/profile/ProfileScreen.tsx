import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart3, BookOpen, Flame, Globe, Settings, Trophy, Zap } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Screen } from "@/components/ui/Screen";
import { StatTile } from "@/components/ui/StatTile";
import { PageHeader } from "@/components/ui/Typography";
import { BADGES } from "@/data/words";
import { gradients } from "@/theme/tokens";
import { levelProgress, useAppStore } from "@/store/useAppStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { name, level, xp, streak, settings } = useAppStore();
  const progress = levelProgress(xp);

  return (
    <Screen>
      <PageHeader
        eyebrow="Mon compte"
        title="Profil"
        right={
          <Pressable onPress={() => router.push("/settings")} className="w-11 h-11 rounded-full bg-surface2 items-center justify-center">
            <Settings size={20} color="#1D1D1F" />
          </Pressable>
        }
      />

      <Card className="flex-row items-center gap-5 mb-4">
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 80, height: 80, borderRadius: 999, alignItems: "center", justifyContent: "center" }}
        >
          <Text className="text-white text-[32px] font-bold">{name.charAt(0)}</Text>
        </LinearGradient>
        <View className="flex-1 gap-2">
          <Text className="text-h2 font-semibold text-text">{name}</Text>
          <View className="flex-row gap-2 flex-wrap">
            <Badge tone="accent" label={`Niveau ${level}`} icon={<Trophy size={14} color="#BF5AF2" />} />
            <Badge tone="streak" label={`${streak} j`} icon={<Flame size={14} color="#BF5AF2" />} />
            <Badge tone="muted" label={settings.language} icon={<Globe size={14} color="#6E6E73" />} />
          </View>
          <ProgressBar value={progress} thin />
          <Text className="text-caption text-muted">
            {xp.toLocaleString("fr-FR")} XP · {Math.round(progress * 100)}% vers niveau {level + 1}
          </Text>
        </View>
      </Card>

      <Card className="mb-4">
        <Text className="text-h3 font-semibold text-text mb-4">Badges</Text>
        <View className="flex-row flex-wrap gap-y-4">
          {BADGES.map((b) => (
            <View key={b.id} className="w-1/2 flex-row items-center gap-3">
              <View
                className={
                  b.earned
                    ? "w-14 h-14 rounded-md items-center justify-center bg-[rgba(191,90,242,0.12)] border border-[rgba(191,90,242,0.4)]"
                    : "w-14 h-14 rounded-md items-center justify-center bg-surface2 border border-border opacity-40"
                }
              >
                <Trophy size={24} color={b.earned ? "#BF5AF2" : "#6E6E73"} />
              </View>
              <View className="flex-1">
                <Text className="text-caption font-semibold text-text">{b.name}</Text>
                <Text className="text-caption text-muted">{b.earned ? "Débloqué" : "À débloquer"}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <View className="flex-row gap-3 mb-4">
        <StatTile label="XP total" value={xp.toLocaleString("fr-FR")} sub="rang argent" icon={<Zap size={18} color="#0077ED" />} />
        <StatTile label="Mots" value="342" sub="6 thèmes" icon={<BookOpen size={18} color="#0077ED" />} />
        <StatTile label="Record" value={21} sub="jours" icon={<Flame size={18} color="#0077ED" />} />
      </View>

      <Button
        title="Voir mes statistiques"
        variant="secondary"
        block
        icon={<BarChart3 size={18} color="#0071E3" />}
        onPress={() => router.push("/stats")}
      />
    </Screen>
  );
}
