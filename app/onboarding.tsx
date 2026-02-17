// app/onboarding.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/theme'; // Ensure this exists
import { useAuthStore } from '@/store/useAuthStore';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();

  const handleGetStarted = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* 1. TOP IMAGE SECTION */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/images/icon.png')} // Or a dedicated illustration
          style={styles.image} 
        />
      </View>

      {/* 2. BOTTOM CONTENT SECTION */}
      <View style={styles.contentContainer}>
        <View>
            <Text style={styles.title}>
            Welcome to <Text style={styles.highlight}>Offside</Text>
            </Text>
            
            <Text style={styles.subtitle}>
            Connect with fans, follow your club, and never miss a match moment.
            </Text>
        </View>

        <TouchableOpacity 
          onPress={handleGetStarted}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  imageContainer: {
    flex: 0.55, // Takes 55% of screen height
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  image: {
    width: width * 0.8, // 80% of screen width
    height: width * 0.8,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 0.45, // Takes 45% of screen height
    paddingHorizontal: 24,
    justifyContent: 'space-between', // Pushes button to bottom
    paddingBottom: 40, 
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  highlight: {
    color: Colors.primary || '#39FF14', // Neon Green
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA', // Light Gray
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: Colors.primary || '#39FF14',
    height: 56,
    borderRadius: 28, // Fully rounded
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: Colors.primary || '#39FF14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});