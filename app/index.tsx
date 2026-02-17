import { useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors } from '@/constants/theme';

export default function Splash() {
  const router = useRouter();
  const { isHydrated, isAuthenticated, hasSeenOnboarding } = useAuthStore();

  useEffect(() => {
    // 1. Wait for hydration (reading from storage)
    if (!isHydrated) return;

    // 2. Add a small delay for user experience (optional, but looks nice)
    const timer = setTimeout(() => {
      
      if (isAuthenticated) {
        // A. If logged in -> Go Home
        router.replace('/(home)/feed');
      } else if (!hasSeenOnboarding) {
        // B. If new user -> Go to Onboarding
        router.replace('/onboarding');
      } else {
        // C. If returning user (logged out) -> Go to Login
        router.replace('/(auth)/login');
      }
      
    }, 1500); // 1.5 seconds splash screen

    return () => clearTimeout(timer);
  }, [isHydrated, isAuthenticated, hasSeenOnboarding]);

  return (
    <View className="flex-1 bg-[#0D0D0D] items-center justify-center">
      {/* Your Logo Here */}
      <Image 
        source={require('../assets/images/splash-icon.png')} 
        style={{ width: 150, height: 150, resizeMode: 'contain' }}
      />
      
      {/* Loading Spinner */}
      <View className="absolute bottom-20">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    </View>
  );
}