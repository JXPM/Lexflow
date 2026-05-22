import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#F5F5F7" },
            animation: "fade",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="review" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
          <Stack.Screen name="coach" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
          <Stack.Screen name="capture" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
          <Stack.Screen name="stats" />
          <Stack.Screen name="settings" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
