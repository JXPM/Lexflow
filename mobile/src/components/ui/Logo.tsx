import { LinearGradient } from "expo-linear-gradient";
import { BookA } from "lucide-react-native";
import { View, Text } from "react-native";

import { gradients } from "@/theme/tokens";

/**
 * LexFlow brand mark — a dictionary (lucide BookA icon) inside the
 * signature blue gradient rounded square.
 */
export function Logo({ size = 44 }: { size?: number }) {
  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BookA size={size * 0.56} color="#FFFFFF" strokeWidth={2.2} />
    </LinearGradient>
  );
}

export function BrandRow({ size = 36 }: { size?: number }) {
  return (
    <View className="flex-row items-center gap-3">
      <Logo size={size} />
      <Text className="text-text text-h3 font-bold tracking-tight">LexFlow</Text>
    </View>
  );
}
