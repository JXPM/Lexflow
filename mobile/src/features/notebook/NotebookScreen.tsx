import { useRouter } from "expo-router";
import { Inbox, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { AudioButton } from "@/components/ui/AudioButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Screen } from "@/components/ui/Screen";
import { PageHeader } from "@/components/ui/Typography";
import { SEED_WORDS } from "@/data/words";
import { useAppStore } from "@/store/useAppStore";
import type { WordStatus } from "@/types";

const FILTERS = ["Tous", "Enregistrés", "Compris", "Maîtrisés"] as const;
const STATUS_LABEL: Record<WordStatus, string> = {
  discovered: "Découvert",
  understood: "Compris",
  mastered: "Maîtrisé",
};

export default function NotebookScreen() {
  const router = useRouter();
  const notebook = useAppStore((s) => s.notebook);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Tous");

  const items = useMemo(() => {
    return SEED_WORDS.filter((w) => w.term.toLowerCase().includes(query.toLowerCase())).filter((w) => {
      const entry = notebook[w.id];
      if (filter === "Enregistrés") return entry?.saved;
      if (filter === "Compris") return entry?.status === "understood";
      if (filter === "Maîtrisés") return entry?.status === "mastered";
      return true;
    });
  }, [query, filter, notebook]);

  return (
    <Screen>
      <PageHeader eyebrow="Mon vocabulaire" title="Carnet" />

      <View className="flex-row items-center gap-3 bg-surface border border-borderStrong rounded-full px-4 h-[52px] mb-4">
        <Search size={20} color="#6E6E73" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher un mot…"
          placeholderTextColor="#6E6E73"
          className="flex-1 text-text"
        />
      </View>

      <View className="flex-row gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>

      {items.length === 0 ? (
        <View className="items-center gap-4 py-16">
          <View className="w-[72px] h-[72px] rounded-lg bg-surface2 items-center justify-center">
            <Inbox size={32} color="#6E6E73" />
          </View>
          <Text className="text-h3 font-semibold text-text">Aucun mot trouvé</Text>
          <Text className="text-muted text-center">Explore le feed Découverte pour remplir ton carnet.</Text>
          <Button title="Aller à Découverte" onPress={() => router.push("/(tabs)/discover")} />
        </View>
      ) : (
        <View className="gap-3">
          {items.map((w) => {
            const entry = notebook[w.id];
            return (
              <Card key={w.id} variant="tile" className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-h3 font-bold text-text">{w.term}</Text>
                  <AudioButton text={w.term} size={38} />
                </View>
                <Text className="text-caption text-secondary font-mono">{w.phon}</Text>
                <Text className="text-muted text-caption">{w.def}</Text>
                <View className="flex-row gap-2 mt-1">
                  <Badge tone="muted" label={w.tag} />
                  {entry ? <Badge tone="accent" label={STATUS_LABEL[entry.status]} /> : null}
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
