import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Zap } from 'lucide-react-native';

interface StickyFooterProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  showIcon?: boolean; // Option to hide the lightning bolt
}

export default function StickyFooter({ 
  onPress, 
  title, 
  disabled = false,
  showIcon = true 
}: StickyFooterProps) {
  
  // This hook instantly tells us how tall the bottom bar is on ANY phone
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      { paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 20 }
    ]}>
      <TouchableOpacity 
        style={[styles.button, disabled && styles.disabled]} 
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>{title}</Text>
        {showIcon && (
          <Zap size={20} color="black" fill="black" style={{ marginLeft: 8 }} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0D0D0D', // Matches App Background
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 20,
    paddingHorizontal: 20,
    zIndex: 100, // Always on top
  },
  button: {
    backgroundColor: Colors.primary, // Neon Green
    height: 56,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Premium Glow
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  disabled: {
    backgroundColor: '#333',
    shadowOpacity: 0,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});