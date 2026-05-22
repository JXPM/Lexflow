import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { gradients } from "@/theme/tokens";

export function ProgressBar({ value, thin }: { value: number; thin?: boolean }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(Math.max(0, Math.min(1, value)), { duration: 600 });
  }, [value, w]);

  const style = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));

  return (
    <View className={`w-full overflow-hidden rounded-full bg-surface2 ${thin ? "h-1.5" : "h-2.5"}`}>
      <Animated.View style={style} className="h-full rounded-full overflow-hidden">
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
      </Animated.View>
    </View>
  );
}
