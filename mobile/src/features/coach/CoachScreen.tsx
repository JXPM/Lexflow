import { useRouter } from "expo-router";
import { Send, Sparkles, X } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/lib/cn";
import { coachReply, isOpenAIConfigured } from "@/services/openai";
import type { ChatMessage } from "@/types";

const SUGGESTIONS = [
  "Explique « pragmatique » comme à un enfant",
  "Donne-moi un exercice avec « éloquence »",
  "Reformule : « C’est un truc compliqué »",
];

export default function CoachScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Salut ! Je suis ton coach LexFlow. Demande-moi d’expliquer un mot, de le reformuler, ou un mini-exercice. 💬",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    const reply = await coachReply(next);
    setMessages([...next, { role: "assistant", content: reply }]);
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-border">
        <View className="flex-row items-center gap-2">
          <Sparkles size={20} color="#0077ED" />
          <Text className="text-h3 font-semibold text-text">Coach IA</Text>
        </View>
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface2 items-center justify-center">
          <X size={20} color="#1D1D1F" />
        </Pressable>
      </View>

      {!isOpenAIConfigured ? (
        <Text className="text-caption text-muted px-5 py-2 bg-surface2">
          Mode démo — ajoute EXPO_PUBLIC_OPENAI_API_KEY pour activer le vrai coach.
        </Text>
      ) : null}

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView ref={scrollRef} className="flex-1 px-5" contentContainerClassName="py-4 gap-3">
          {messages.map((m, idx) => (
            <View
              key={idx}
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-3",
                m.role === "user" ? "self-end bg-primary" : "self-start bg-surface border border-border",
              )}
            >
              <Text className={cn(m.role === "user" ? "text-white" : "text-text")}>{m.content}</Text>
            </View>
          ))}
          {loading ? <ActivityIndicator color="#0071E3" className="self-start mt-1" /> : null}

          {messages.length <= 1 ? (
            <View className="gap-2 mt-2">
              {SUGGESTIONS.map((s) => (
                <Pressable key={s} onPress={() => send(s)} className="bg-surface border border-border rounded-full px-4 py-2.5 self-start">
                  <Text className="text-caption text-primary font-semibold">{s}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View
          className="flex-row items-center gap-2 px-5 pt-2 border-t border-border"
          style={{ paddingBottom: insets.bottom + 8 }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Pose ta question…"
            placeholderTextColor="#6E6E73"
            className="flex-1 bg-surface2 rounded-full px-4 h-12 text-text"
            onSubmitEditing={() => send(input)}
          />
          <Pressable onPress={() => send(input)} className="w-12 h-12 rounded-full bg-primary items-center justify-center">
            <Send size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
