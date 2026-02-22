// app/index.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors } from '@/constants/theme';

export default function Splash() {
  const router = useRouter();
  // 👇 Added user here to check status
  const { isHydrated, isAuthenticated, hasSeenOnboarding, user } = useAuthStore(); 
  
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const navigate = () => {
      if (!isHydrated) return;

      if (isAuthenticated && user) {
        // 👇 ADDED: Traffic Control for Initial App Open
        if (!user.hasUsername) {
          router.replace('/(auth)/select-club'); // Change to set-profile later
        } else if (!user.hasSelectedClub) {
          router.replace('/(auth)/select-club');
        } else {
          router.replace('/(home)/feed');
        }
      } else if (hasSeenOnboarding) {
        router.replace('/(auth)/login'); // Used to say onboarding, fixed it.
      } else {
        router.replace('/onboarding'); // Used to say login, fixed it.
      }
    };

    const timer = setTimeout(navigate, 2000);
    return () => clearTimeout(timer);
  }, [isHydrated, isAuthenticated, hasSeenOnboarding, user]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Image 
          source={require('../assets/images/splash-icon.png')} 
          style={styles.logo}
        />
        <View style={{ marginTop: 50 }}>
             <ActivityIndicator size="large" color={Colors.primary || "#39FF14"} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 180, height: 180, resizeMode: 'contain' },
});