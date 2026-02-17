// app/index.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors } from '@/constants/theme';

export default function Splash() {
  const router = useRouter();
  const { isHydrated, isAuthenticated, hasSeenOnboarding } = useAuthStore();
  
  // Animation Value
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade In Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Navigation Logic
    const navigate = () => {
      if (!isHydrated) return; // Wait for store

      if (isAuthenticated) {
        router.replace('/(home)/feed');
      } else if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(auth)/login');
      }
    };

    // Wait 2 seconds for the splash effect, then navigate
    const timer = setTimeout(navigate, 2000);

    return () => clearTimeout(timer);
  }, [isHydrated, isAuthenticated, hasSeenOnboarding]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        {/* YOUR LOGO */}
        <Image 
          source={require('../assets/images/splash-icon.png')} 
          style={styles.logo}
        />
        
        {/* OPTIONAL: Loading Spinner below logo */}
        <View style={{ marginTop: 50 }}>
             <ActivityIndicator size="large" color={Colors.primary || "#39FF14"} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D', // Matches Splash Background
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
});