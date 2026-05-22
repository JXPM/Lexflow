import { Pressable, Text } from "react-native";

import { cn } from "@/lib/cn";

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "rounded-full border px-3 py-2",
        active ? "border-primary bg-[rgba(0,113,227,0.10)]" : "border-border bg-surface2",
      )}
    >
      <Text className={cn("text-caption font-semibold", active ? "text-text" : "text-muted")}>{label}</Text>
    </Pressable>
  );
}
