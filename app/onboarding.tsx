// app/onboarding.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  SafeAreaView,
  StatusBar as RNStatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();

  const handleGetStarted = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Image with Overlay */}
      <Image
        source={require('@/assets/images/stadium.jpg')} // You'll need a stadium background image
        style={styles.backgroundImage}
      />
      
      {/* Dark Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
        style={styles.overlay}
        locations={[0, 0.3, 0.7]}
      />
      
      {/* Content */}
      <SafeAreaView style={styles.content}>
        {/* Top Section with SKIP */}
        <View style={styles.topSection}>
          <TouchableOpacity 
            onPress={() => router.replace('/(auth)/login')}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>
            Join the{' '}
            <Text style={styles.warZone}>War Zone</Text>
          </Text>
          
          <Text style={styles.description}>
            The pitch is quiet, but the banter never stops. Clash with rivals in real-time.
          </Text>
        </View>

        {/* Bottom Section with Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#CCFF00', '#CCFF00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                Next Step <Text style={styles.arrow}>→</Text>
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    paddingTop: RNStatusBar.currentHeight || 0,
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    paddingHorizontal: 24,
    marginTop: -100, // Adjust based on your layout
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 52,
  },
  warZone: {
    color: Colors.primary, // Orange/War zone color
    textShadowColor: 'rgba(249, 115, 22, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 28,
    maxWidth: width * 0.85,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  button: {
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '300',
  },
});