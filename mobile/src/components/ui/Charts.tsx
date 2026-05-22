import { Text, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Polygon, Polyline, Stop } from "react-native-svg";
import { LinearGradient as ExpoGradient } from "expo-linear-gradient";

import { colors, gradients } from "@/theme/tokens";

/** Vertical bars (weekly regularity), last bar highlighted. */
export function BarsChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <View>
      <View className="flex-row items-end gap-3 h-40">
        {data.map((v, i) => {
          const last = i === data.length - 1;
          return (
            <View key={i} className="flex-1 justify-end">
              {last ? (
                <ExpoGradient
                  colors={gradients.primary}
                  style={{ height: `${(v / max) * 100}%`, minHeight: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                />
              ) : (
                <View
                  className="bg-surface2"
                  style={{ height: `${(v / max) * 100}%`, minHeight: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                />
              )}
            </View>
          );
        })}
      </View>
      <View className="flex-row mt-2">
        {labels.map((l, i) => (
          <Text key={i} className="flex-1 text-center text-caption text-muted">
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

/** Smooth-ish area line chart for progression. */
export function LineChart({ data }: { data: number[] }) {
  const W = 320;
  const H = 180;
  const p = 16;
  const max = Math.max(...data, 1);
  const x = (i: number) => p + (i * (W - p * 2)) / (data.length - 1);
  const y = (v: number) => H - p - (v / max) * (H - p * 2);
  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${p},${H - p} ${pts} ${W - p},${H - p}`;

  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.18} />
          <Stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {[0, 1, 2, 3].map((i) => (
        <Line
          key={i}
          x1={p}
          y1={p + (i * (H - p * 2)) / 3}
          x2={W - p}
          y2={p + (i * (H - p * 2)) / 3}
          stroke={colors.border}
          strokeWidth={1}
        />
      ))}
      <Polygon points={area} fill="url(#areaGrad)" />
      <Polyline points={pts} fill="none" stroke={colors.secondary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <Circle key={i} cx={x(i)} cy={y(v)} r={4} fill={colors.bg} stroke={colors.secondary} strokeWidth={3} />
      ))}
    </Svg>
  );
}
