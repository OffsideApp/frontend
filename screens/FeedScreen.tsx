// screens/FeedScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, Button } from 'react-native';
// 👇 Notice the updated path: going up one level to find components
import FeedCard from '../components/FeedCard'; 
import StickyFooter from '../components/StickyFooter'; 
import { Colors } from '../constants/theme'; // Check this path too!
import { useAuthStore } from '../store/useAuthStore';

// Dummy Data mapped with audio attributes
const RANTS = [
  { 
    id: '1', 
    user: '@PochettinoSon', 
    club: 'Chelsea', 
    time: '2m ago', 
    content: 'Omo this Chelsea defense is looking shaky o! Need to tighten up.' 
  },
  { 
    id: '2', 
    user: '@WengerOut', 
    club: 'Arsenal', 
    time: '15m ago', 
    content: 'Saka is the best winger in the world right now. Argue with your keypad.',
    hasAudio: true,
    audioDuration: '0:34'
  },
  { 
    id: '3', 
    user: '@TenHagBall', 
    club: 'Man Utd', 
    time: '1h ago', 
    content: 'Why is Onana standing in the midfield? Is he a CDM now?' 
  },
];

export default function FeedScreen() {
  const logout = useAuthStore((state) => state.logout);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>OFFSIDE</Text>
        {/* 👇 Click this in the app to clear your ghost session! */}
        <Button title="FORCE LOGOUT" onPress={logout} color="red" />
      </View>

      {/* The List */}
      <FlatList
        data={RANTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FeedCard 
            username={item.user} 
            club={item.club} 
            content={item.content} 
            time={item.time} 
            hasAudio={item.hasAudio} 
            audioDuration={item.audioDuration} 
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* 👇 Added your StickyFooter here */}
      <StickyFooter 
        title="Start a Rant" 
        onPress={() => console.log("Navigate to Create Rant Screen")} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D', // Use direct hex if Colors.background is failing
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#CCFF00', // Neon Green
    textAlign: "center",
    fontStyle: 'italic',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Make sure the list scrolls completely past the StickyFooter
  },
});