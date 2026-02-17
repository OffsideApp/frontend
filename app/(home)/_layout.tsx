import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Mic2, User } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';
// 1. Import this hook to detect the safe area (notch/home bar)
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  // 2. Get the safe area values
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D0D0D',
          borderTopWidth: 1,
          borderTopColor: '#262626',
          
          // 3. DYNAMIC HEIGHT: Base height (60) + whatever space the phone needs (insets.bottom)
          height: 70 + insets.bottom, 
          
          // 4. PUSH ICONS UP: This ensures the icons don't sit behind the swipe bar
          paddingBottom: insets.bottom, 
          paddingTop: 5,
          
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: '#CCFF00',
        tabBarInactiveTintColor: '#555555',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="matchday"
        options={{
          tabBarIcon: () => (
            <View style={styles.floatingButton}>
              <Mic2 size={30} color="black" fill="black" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <User size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    backgroundColor: '#CCFF00',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // You might need to tweak this slightly depending on the new height, 
    // but -30 usually lands it right in the middle of the border.
    marginTop: -30, 
    
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#0D0D0D',
  },
});