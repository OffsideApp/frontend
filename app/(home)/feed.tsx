// app/(home)/feed.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, Button } from 'react-native';
import FeedCard from '../../components/FeedCard'; 
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

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
    hasAudio: true, // This post will show the audio player
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
  const { logout } = useAuthStore();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>OFFSIDE</Text>
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
            hasAudio={item.hasAudio} // Pass audio prop down
            audioDuration={item.audioDuration} // Pass duration prop down
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Offside Black
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
    color: Colors.primary, // Neon Green
    textAlign: "center",
    fontStyle: 'italic',
  },
  listContent: {
    padding: 16,
  },
});