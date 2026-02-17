// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, ActivityIndicator } from 'react-native'; // Import View & ActivityIndicator
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { Colors } from '@/constants/theme';
import { useProtectedRoute } from '@/hooks/useProtectedRoute'; // Import the hook
import { useAuthStore } from '@/store/useAuthStore';

export default function RootLayout() {
  // 1. Run the Protection Logic
  useProtectedRoute();
  
  // 2. Access hydration state for the UI
  const { isHydrated } = useAuthStore();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#0D0D0D");
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync("#00000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  // 3. SHOW A SPLASH/LOADING SCREEN while hydrating
  // This is the "Slot" fix. Instead of returning null (which crashes Expo Router),
  // we return a simple View. This gives Expo Router something to render
  // while we wait for the store to be ready.
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0D0D' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // 4. Render the App
  return (
    <>
      <StatusBar style="light" backgroundColor="#0D0D0D" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </>
  );
}