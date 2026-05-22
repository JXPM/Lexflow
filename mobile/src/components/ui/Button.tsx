import { ActivityIndicator, Pressable, Text, View, type PressableProps } from "react-native";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "md" | "lg";

interface Props extends PressableProps {
  title: string;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const container: Record<Variant, string> = {
  primary: "bg-primary",
  secondary: "bg-surface border border-borderStrong",
  ghost: "bg-transparent",
  accent: "bg-accent",
  danger: "bg-error",
};

const label: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-primary",
  ghost: "text-primary",
  accent: "text-white",
  danger: "text-white",
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  block,
  loading,
  icon,
  disabled,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        "flex-row items-center justify-center gap-2 rounded-full px-6 active:scale-[0.97]",
        size === "lg" ? "h-14" : "h-12",
        container[variant],
        block && "w-full",
        isDisabled && "opacity-40",
      )}
      style={
        variant === "primary"
          ? { boxShadow: "0px 6px 16px rgba(0,113,227,0.25)" }
          : undefined
      }
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" || variant === "ghost" ? "#0071E3" : "#fff"} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className={cn("font-semibold", size === "lg" ? "text-[18px]" : "text-body", label[variant])}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
