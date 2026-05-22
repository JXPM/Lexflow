import { Tabs } from "expo-router";
import { BookMarked, Compass, GraduationCap, Home, User } from "lucide-react-native";

import { AppTabBar } from "@/components/nav/AppTabBar";
import { useResponsive } from "@/lib/responsive";
import { colors } from "@/theme/tokens";

export default function TabsLayout() {
  const { sidebarWidth } = useResponsive();
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.muted,
        sceneStyle: { paddingLeft: sidebarWidth },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Accueil", tabBarIcon: ({ color }) => <Home size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="discover"
        options={{ title: "Découverte", tabBarIcon: ({ color }) => <Compass size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: "Apprendre", tabBarIcon: ({ color }) => <GraduationCap size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="notebook"
        options={{ title: "Carnet", tabBarIcon: ({ color }) => <BookMarked size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profil", tabBarIcon: ({ color }) => <User size={24} color={color} /> }}
      />
    </Tabs>
  );
}
