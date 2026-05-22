import { Platform, Pressable, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrandRow, Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { useResponsive } from "@/lib/responsive";
import { colors } from "@/theme/tokens";

/** Minimal structural shape of the props expo-router/React Navigation passes to `tabBar`. */
type TabRoute = { key: string; name: string };
type TabIconArgs = { focused: boolean; color: string; size: number };
export interface AppTabBarProps {
  state: { index: number; routes: TabRoute[] };
  descriptors: Record<
    string,
    { options: { title?: string; tabBarIcon?: (a: TabIconArgs) => React.ReactNode } }
  >;
  navigation: {
    emit: (e: { type: "tabPress"; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

/**
 * Adaptive primary navigation:
 *  - mobile  → bottom tab bar (reserves bottom space, measured by the navigator)
 *  - tablet  → compact icon rail on the left
 *  - desktop → full sidebar (icon + label) on the left
 *
 * On tablet/desktop the bar is absolutely positioned and the wrapper has zero
 * height, so the navigator gives screens the full height; screens add a matching
 * `paddingLeft` (see Screen / useResponsive) so content clears the sidebar.
 */
export function AppTabBar({ state, descriptors, navigation }: AppTabBarProps) {
  const { hasSidebar, isDesktop, sidebarWidth } = useResponsive();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const items = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label = (options.title ?? route.name) as string;
    const focused = state.index === index;
    const color = focused ? colors.secondary : colors.muted;
    const icon = options.tabBarIcon?.({ focused, color, size: 24 }) ?? null;

    const onPress = () => {
      const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
    };

    return { key: route.key, label, focused, color, icon, onPress };
  });

  // --- Sidebar (tablet + desktop) ---
  if (hasSidebar) {
    return (
      <View style={{ height: 0 }} pointerEvents="box-none">
        <View
          style={{ position: "absolute", left: 0, bottom: 0, width: sidebarWidth, height, paddingTop: insets.top + 16 }}
          className="border-r border-border bg-surface px-3"
        >
          <View className={cn("mb-8 mt-2", isDesktop ? "px-2" : "items-center")}>
            {isDesktop ? <BrandRow size={32} /> : <Logo size={36} />}
          </View>

          <View className="gap-1">
            {items.map((it) => (
              <Pressable
                key={it.key}
                onPress={it.onPress}
                accessibilityRole="button"
                accessibilityState={{ selected: it.focused }}
                className={cn(
                  "flex-row items-center gap-3 rounded-2xl py-3 active:opacity-70",
                  isDesktop ? "px-3" : "justify-center px-0",
                  it.focused && "bg-[rgba(0,113,227,0.10)]",
                )}
              >
                {it.icon}
                {isDesktop && (
                  <Text
                    className={cn("text-body font-semibold", it.focused ? "text-secondary" : "text-muted")}
                  >
                    {it.label}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // --- Bottom bar (mobile) ---
  return (
    <View
      className="flex-row border-t border-border bg-surface"
      style={{ paddingBottom: insets.bottom, paddingTop: 8, height: 64 + insets.bottom }}
    >
      {items.map((it) => (
        <Pressable
          key={it.key}
          onPress={it.onPress}
          accessibilityRole="button"
          accessibilityState={{ selected: it.focused }}
          className="flex-1 items-center justify-start gap-1"
          style={Platform.OS === "web" ? { cursor: "pointer" } : undefined}
        >
          {it.icon}
          <Text
            className={cn("text-[11px] font-semibold", it.focused ? "text-secondary" : "text-muted")}
          >
            {it.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
