import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { View, ActivityIndicator } from 'react-native';
import '../global.css'; // Ensure your CSS is imported

export default function RootLayout() {
  const { isHydrated } = useAuthStore();

  // Simple hydration check (optional, but good for safety)
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D0D0D', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#0D0D0D" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        <Stack.Screen name="index" />      {/* Splash */}
        <Stack.Screen name="onboarding" /> {/* Onboarding */}
        <Stack.Screen name="(auth)" />     {/* Login/Signup Group */}
        <Stack.Screen name="(home)" />     {/* App Group */}
      </Stack>
    </>
  );
}