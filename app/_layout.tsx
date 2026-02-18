// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isHydrated } = useAuthStore();

  useEffect(() => {
    // 1. Set System UI to Dark Mode
    SystemUI.setBackgroundColorAsync("#0D0D0D");
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#00000000"); // Transparent
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  // 2. Show a blank black screen while waiting for storage (Hydration)
  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0D0D0D",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary || "#39FF14"} />
      </View>
    );
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* FIXED: StatusBar is now OUTSIDE the Stack */}
        <StatusBar style="light" backgroundColor="#0D0D0D" translucent />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0D0D0D" },
          }}
        >
          <Stack.Screen name="index" /> {/* Splash Logic */}
          <Stack.Screen name="onboarding" /> {/* Onboarding UI */}
          <Stack.Screen name="(auth)" /> {/* Login Flow */}
          <Stack.Screen name="(home)" /> {/* Main App */}
        </Stack>
      </QueryClientProvider>
    </>
  );
}
