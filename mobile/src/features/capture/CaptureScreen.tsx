import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImagePlus, Sparkles, Wand2, X } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AudioButton } from "@/components/ui/AudioButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { extractHardWords } from "@/services/openai";

export default function CaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ word: string; def: string }[] | null>(null);

  async function analyze(input: string) {
    if (!input.trim()) return;
    setLoading(true);
    setResults(null);
    const words = await extractHardWords(input.trim());
    setResults(words);
    setLoading(false);
  }

  async function pickPhoto(useCamera: boolean) {
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.6 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if (!res.canceled) {
      // OCR serveur recommandé ; en démo on guide l'utilisateur vers la saisie texte.
      setText((t) => t || "Colle ici le texte de ta photo pour détecter les mots difficiles.");
    }
  }

  return (
    <View className="flex-1 bg-bg px-5" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-eyebrow uppercase font-semibold text-secondary">Capture de mots</Text>
          <Text className="text-h2 font-bold text-text">Détecte un mot</Text>
        </View>
        <Pressable onPress={() => router.back()} className="w-11 h-11 rounded-full bg-surface2 items-center justify-center">
          <X size={20} color="#1D1D1F" />
        </Pressable>
      </View>

      <View className="flex-row gap-3 mb-4">
        <Pressable onPress={() => pickPhoto(true)} className="flex-1">
          <Card variant="tile" className="items-center gap-2 py-5">
            <Camera size={24} color="#0077ED" />
            <Text className="text-caption font-semibold text-text">Caméra</Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => pickPhoto(false)} className="flex-1">
          <Card variant="tile" className="items-center gap-2 py-5">
            <ImagePlus size={24} color="#0077ED" />
            <Text className="text-caption font-semibold text-text">Photo</Text>
          </Card>
        </Pressable>
      </View>

      <Card className="gap-3 mb-4">
        <Text className="font-semibold text-text">Colle ou écris un texte</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Ex : un extrait de livre, un article, une phrase entendue…"
          placeholderTextColor="#6E6E73"
          multiline
          className="bg-surface2 rounded-md p-3 text-text min-h-[100px]"
        />
        <Button
          title={loading ? "Analyse…" : "Détecter les mots difficiles"}
          icon={<Wand2 size={18} color="#fff" />}
          block
          loading={loading}
          onPress={() => analyze(text)}
        />
      </Card>

      {loading ? <ActivityIndicator color="#0071E3" /> : null}

      {results?.map((r) => (
        <Card key={r.word} variant="tile" className="gap-2 mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Sparkles size={16} color="#BF5AF2" />
              <Text className="text-h3 font-bold text-text">{r.word}</Text>
            </View>
            <AudioButton text={r.word} size={38} />
          </View>
          <Text className="text-muted text-caption">{r.def}</Text>
        </Card>
      ))}
    </View>
  );
}
