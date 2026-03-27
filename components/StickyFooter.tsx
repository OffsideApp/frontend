// components/StickyFooter.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Mic } from 'lucide-react-native';

interface StickyFooterProps {
  onPress: () => void;
}

export default function StickyFooter({ onPress }: StickyFooterProps) {
  return (
    <TouchableOpacity 
      style={styles.fab} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Mic size={28} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20, // Sits right above your bottom tab nav!
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CCFF00', // Neon Green
    justifyContent: 'center',
    alignItems: 'center',
    // Premium Glow Effect
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100, 
  },
});