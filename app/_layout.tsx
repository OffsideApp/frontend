import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router'; // <--- 1. Import this
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  // 2. Get the navigation state
  const navigationState = useRootNavigationState();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#0D0D0D");
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync("#00000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

 // 3. AUTH GATEKEEPER
  useEffect(() => {
    // A. Wait for the navigation tree to be fully initialized
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    // B. Wrap the redirect in a setTimeout to fix the "Before Mounting" error
    // This pushes the navigation action to the NEXT "tick" of the event loop
    const timer = setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        // If NOT logged in, and trying to access the app -> Kick to Login
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        // If LOGGED IN, and trying to see login screen -> Send to Feed
        router.replace('/(home)/feed');
      }
    }, 0); // 0ms delay is usually enough

    // Cleanup the timer if the component unmounts quickly
    return () => clearTimeout(timer);

  }, [isAuthenticated, segments, navigationState?.key]);

  // 5. IMPORTANT: Never return null here. 
  // If you want a loading screen, return a View containing a <Slot/>, 
  // but since you are using Stack, just returning the Stack is correct.
  return (
    <>
      <StatusBar style="light" backgroundColor="#0D0D0D" />
      <Stack screenOptions={{ headerShown: false, contentStyle:{backgroundColor:Colors.background} }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </>
  );
}