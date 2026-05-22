import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

type Tone = "muted" | "success" | "accent" | "streak";

const tones: Record<Tone, { bg: string; text: string }> = {
  muted: { bg: "bg-surface2", text: "text-muted" },
  success: { bg: "bg-[rgba(52,199,89,0.14)]", text: "text-[#248A3D]" },
  accent: { bg: "bg-[rgba(191,90,242,0.12)]", text: "text-accent" },
  streak: { bg: "bg-[rgba(191,90,242,0.12)]", text: "text-accent" },
};

export function Badge({
  label,
  tone = "muted",
  icon,
}: {
  label: string;
  tone?: Tone;
  icon?: React.ReactNode;
}) {
  const t = tones[tone];
  return (
    <View className={cn("flex-row items-center gap-1.5 rounded-full px-2.5 py-1", t.bg)}>
      {icon}
      <Text className={cn("text-xs font-semibold", t.text)}>{label}</Text>
    </View>
  );
}
