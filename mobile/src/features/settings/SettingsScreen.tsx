import { useRouter } from "expo-router";
import { Bell, Globe, Moon, Target, Volume2, X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";
import { logout } from "@/services/auth";
import { useAppStore } from "@/store/useAppStore";

function Row({ icon, title, sub, right }: { icon: React.ReactNode; title: string; sub: string; right: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-4 py-4 border-b border-border">
      <View className="w-6 items-center">{icon}</View>
      <View className="flex-1">
        <Text className="font-semibold text-text">{title}</Text>
        <Text className="text-caption text-muted">{sub}</Text>
      </View>
      {right}
    </View>
  );
}

const SPEEDS = [
  { label: "0.8×", value: 0.8 },
  { label: "1×", value: 0.92 },
  { label: "1.2×", value: 1.1 },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, setSetting, profile, completeOnboarding, reset } = useAppStore();

  return (
    <Screen>
      <View className="flex-row items-center justify-between mb-6 mt-1">
        <View>
          <Text className="text-eyebrow uppercase font-semibold text-secondary">Préférences</Text>
          <Text className="text-h2 font-bold text-text">Paramètres</Text>
        </View>
        <Pressable onPress={() => router.back()} className="w-11 h-11 rounded-full bg-surface2 items-center justify-center">
          <X size={20} color="#1D1D1F" />
        </Pressable>
      </View>

      <Card className="mb-4">
        <Text className="text-h3 font-semibold text-text mb-1">Apprentissage</Text>
        <Row
          icon={<Bell size={22} color="#0077ED" />}
          title="Rappel quotidien"
          sub={`Chaque jour à ${settings.dailyReminder}`}
          right={<Toggle value={settings.notifications} onChange={(v) => setSetting("notifications", v)} />}
        />
        <Row
          icon={<Volume2 size={22} color="#0077ED" />}
          title="Vitesse audio"
          sub="Lecture des mots"
          right={
            <View className="flex-row bg-surface2 rounded-full p-1 gap-1">
              {SPEEDS.map((s) => (
                <Pressable
                  key={s.label}
                  onPress={() => setSetting("audioRate", s.value)}
                  className={cn("px-3 py-1.5 rounded-full", settings.audioRate === s.value && "bg-[rgba(0,113,227,0.16)]")}
                >
                  <Text className={cn("text-caption font-semibold", settings.audioRate === s.value ? "text-text" : "text-muted")}>
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          }
        />
        <View className="flex-row items-center gap-4 py-4">
          <View className="w-6 items-center">
            <Target size={22} color="#0077ED" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-text">Objectif quotidien</Text>
            <Text className="text-caption text-muted">{profile.dailyWordGoal} mots / jour</Text>
          </View>
          <View className="flex-row bg-surface2 rounded-full p-1 gap-1">
            {[5, 10, 15].map((n) => (
              <Pressable
                key={n}
                onPress={() => completeOnboarding({ dailyWordGoal: n })}
                className={cn("px-3 py-1.5 rounded-full", profile.dailyWordGoal === n && "bg-[rgba(0,113,227,0.16)]")}
              >
                <Text className={cn("text-caption font-semibold", profile.dailyWordGoal === n ? "text-text" : "text-muted")}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Card>

      <Card className="mb-4">
        <Text className="text-h3 font-semibold text-text mb-1">Apparence & langue</Text>
        <Row
          icon={<Moon size={22} color="#0077ED" />}
          title="Thème sombre"
          sub="Recommandé le soir"
          right={<Toggle value={settings.darkMode} onChange={(v) => setSetting("darkMode", v)} />}
        />
        <Row
          icon={<Globe size={22} color="#0077ED" />}
          title="Langue d’apprentissage"
          sub={settings.language}
          right={<Button title="Changer" variant="secondary" onPress={() => {}} />}
        />
      </Card>

      <Card className="gap-3">
        <Button
          title="Se déconnecter"
          variant="secondary"
          block
          onPress={async () => {
            await logout();
            reset();
            router.replace("/");
          }}
        />
        <Button title="Réinitialiser ma progression" variant="ghost" block onPress={reset} />
      </Card>
    </Screen>
  );
}
