import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../theme/colors';

const { height } = Dimensions.get('window');

const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      {/* --- Background Image Section --- */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1518605348400-43ded601201d?q=80&w=2500&auto=format&fit=crop' }} 
        style={styles.imageBg}
        resizeMode="cover"
      >
        {/* Gradient Fade to Black */}
        <LinearGradient 
          colors={['transparent', COLORS.background]} 
          style={styles.gradient}
          start={{x: 0, y: 0}} 
          end={{x: 0, y: 1}}
        />
      </ImageBackground>

      {/* --- Content Section --- */}
      <View style={styles.contentContainer}>
        
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>

        {/* Green Soccer Icon Circle */}
        <View style={styles.iconCircle}>
             <MaterialCommunityIcons name="soccer" size={32} color={COLORS.primary} />
        </View>

        {/* Main Title */}
        <Text style={styles.heading}>
            Join the <Text style={{ color: COLORS.primary }}>War Zone</Text>
        </Text>

        <Text style={styles.description}>
            The pitch is quiet, but the banter never stops. Clash with rivals in real-time.
        </Text>

        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Next Step</Text>
            <Ionicons name="arrow-forward" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageBg: {
    height: height * 0.55, // Takes top 55% of screen
    width: '100%',
  },
  gradient: {
    flex: 1,
    // Gradient starts fading to black halfway down the image
    top: '40%', 
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  skipButton: {
    position: 'absolute',
    top: -100, // Visual adjustment relative to content flow
    right: 24,
  },
  skipText: {
    color: COLORS.text.secondary,
    fontWeight: '700',
    fontSize: 12,
  },
  iconCircle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(57, 255, 20, 0.1)', // Low opacity green
    padding: 16,
    borderRadius: 50,
    marginBottom: 24,
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.ui.barBg,
  },
  activeDot: {
    width: 32,
    backgroundColor: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 18,
  },
});

export default OnboardingScreen;