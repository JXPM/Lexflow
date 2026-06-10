import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { User } from "firebase/auth";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { isFirebaseConfigured, watchAuth } from "@/services/auth";
import { useAppStore } from "@/store/useAppStore";

export default function Splash() {
  const router = useRouter();
  const { hydrated, onboarded } = useAppStore();
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = watchAuth((u) => {
      setUser(u);
      setAuthReady(true);
    });
    // Anti-blocage : si Firebase Auth ne répond pas (réseau, config), on ne
    // reste pas figé sur le splash — on débloque pour router vers /welcome.
    const timeout = setTimeout(() => setAuthReady(true), 8000);
    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !authReady) return;
    if (isFirebaseConfigured) {
      if (user) router.replace(onboarded ? "/(tabs)" : "/onboarding");
      else router.replace("/welcome");
    }
    // Firebase non configuré : on reste sur ce splash (mode démo).
  }, [hydrated, authReady, user, onboarded, router]);

  return (
    <View className="flex-1 bg-bg items-center justify-center px-8">
      <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-4 flex-1 justify-center">
        <Logo size={88} />
        <Text className="text-h1 font-bold text-text">LexFlow</Text>
        <Text className="text-muted text-center text-[17px] max-w-[320px] leading-6">
          Apprends des mots sans avoir l’impression d’étudier.
        </Text>
      </Animated.View>

      {!isFirebaseConfigured && (
        <View className="w-full max-w-[340px] gap-3 pb-8">
          <Button
            title="Commencer"
            size="lg"
            block
            icon={<ArrowRight size={20} color="#fff" />}
            onPress={() => router.push("/onboarding")}
          />
          <Button title="Mode démo (sans compte)" variant="ghost" block onPress={() => router.replace("/(tabs)")} />
          <Text className="text-caption text-muted text-center">
            Renseigne <Text className="font-mono">.env</Text> pour activer la connexion par e-mail.
          </Text>
        </View>
      )}
    </View>
  );
}
