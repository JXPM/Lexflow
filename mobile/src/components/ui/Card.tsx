import { View, type ViewProps } from "react-native";

import { cn } from "@/lib/cn";
import { shadows } from "@/theme/tokens";

interface CardProps extends ViewProps {
  /** "tile" = recessed light fill, "card" = elevated white surface. */
  variant?: "card" | "tile";
}

export function Card({ variant = "card", className, style, children, ...rest }: CardProps) {
  return (
    <View
      className={cn(
        variant === "card"
          ? "bg-surface border border-border rounded-lg p-5"
          : "bg-surface2 border border-border rounded-md p-4",
        className,
      )}
      style={[variant === "card" ? shadows.card : undefined, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
