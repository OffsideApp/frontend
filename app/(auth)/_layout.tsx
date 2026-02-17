import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // 1. Default animation for normal screens (Verify, etc.)
        animation: 'slide_from_right', 
        // 2. Prevent white flash during transition
        contentStyle: { backgroundColor: '#0D0D0D' }, 
      }}
    >
      {/* Make switching between Login/Signup instant & subtle */}
      <Stack.Screen name="login" options={{ animation: 'fade_from_bottom', animationDuration:500 }} />
      <Stack.Screen name="signup" options={{ animation: 'fade_from_bottom', animationDuration:500 }} />
      
      {/* Verify Screen slides in normally */}
      <Stack.Screen name="verify" options={{ animation:'fade_from_bottom', animationDuration:500}} />

      {/* Select Club slides up from bottom (Like a VIP sheet) */}
      <Stack.Screen 
        name="select-club" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true, // Allow swiping down to close (on iOS)
        }} 
      />
    </Stack>
  );
}