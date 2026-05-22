import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn";

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      className={cn(
        "h-[30px] w-[52px] rounded-full border justify-center px-[3px]",
        value ? "bg-primary border-primary" : "bg-surface2 border-borderStrong",
      )}
    >
      <View
        className={cn("h-[22px] w-[22px] rounded-full", value ? "bg-white self-end" : "bg-muted self-start")}
      />
    </Pressable>
  );
}
