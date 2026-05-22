import { ScrollView, View, type ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/lib/cn";

/**
 * Page wrapper: bg color + safe-area top padding + optional scroll.
 * Responsive: centres content in a max-width reading column on large screens
 * (override with `maxWidth`). The sidebar offset is handled by the tabs layout.
 */
export function Screen({
  children,
  scroll = true,
  className,
  contentClassName,
  maxWidth = 760,
  ...rest
}: {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
  /** Max content width on large screens. Use a larger value for dashboards. */
  maxWidth?: number;
} & ScrollViewProps) {
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: insets.top + 8 };
  const column = { width: "100%" as const, maxWidth, alignSelf: "center" as const };

  if (!scroll) {
    return (
      <View className={cn("flex-1 bg-bg", className)} style={pad}>
        <View className="flex-1 px-5" style={column}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className={cn("flex-1 bg-bg", className)}
      contentContainerClassName={cn("pb-28", contentClassName)}
      contentContainerStyle={pad}
      showsVerticalScrollIndicator={false}
      {...rest}
    >
      <View className="px-5" style={column}>
        {children}
      </View>
    </ScrollView>
  );
}
