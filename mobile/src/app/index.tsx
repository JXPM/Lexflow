import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/store/useAppStore";

export default function Splash() {
  const router = useRouter();
  const { hydrated, onboarded } = useAppStore();

  useEffect(() => {
    if (hydrated && onboarded) router.replace("/(tabs)");
  }, [hydrated, onboarded, router]);

  return (
    <View className="flex-1 bg-bg items-center justify-center px-8">
      <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-4 flex-1 justify-center">
        <Logo size={88} />
        <Text className="text-h1 font-bold text-text">LexFlow</Text>
        <Text className="text-muted text-center text-[17px] max-w-[320px] leading-6">
          Apprends des mots sans avoir l’impression d’étudier.
        </Text>
      </Animated.View>

      <View className="w-full max-w-[340px] gap-3 pb-8">
        <Button
          title="Commencer"
          size="lg"
          block
          icon={<ArrowRight size={20} color="#fff" />}
          onPress={() => router.push("/onboarding")}
        />
        <Button title="J’ai déjà un compte" variant="ghost" block onPress={() => router.replace("/(tabs)")} />
      </View>
    </View>
  );
}
