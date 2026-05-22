import { Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import { colors } from "@/theme/tokens";

/** Circular progress ring matching the dashboard "Objectif du jour". */
export function Ring({
  percent,
  size = 132,
  stroke = 12,
}: {
  percent: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (c * Math.max(0, Math.min(100, percent))) / 100;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={colors.primary} />
            <Stop offset="100%" stopColor={colors.secondary} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surface2} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text className="text-h3 font-bold text-text">{Math.round(percent)}%</Text>
        <Text className="text-caption text-muted">complété</Text>
      </View>
    </View>
  );
}
