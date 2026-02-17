import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import FeedCard from '../../components/FeedCard'; // Import the component we just made
import { Colors } from '@/constants/theme';

// Dummy Data
const RANTS = [
  { id: '1', user: '@PochettinoSon', club: 'Chelsea', time: '2m ago', content: 'Omo this Chelsea defense is looking shaky o! Need to tighten up.' },
  { id: '2', user: '@WengerOut', club: 'Arsenal', time: '15m ago', content: 'Saka is the best winger in the world right now. Argue with your keypad.' },
  { id: '3', user: '@TenHagBall', club: 'Man Utd', time: '1h ago', content: 'Why is Onana standing in the midfield? Is he a CDM now?' },
 
];

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>OFFSIDE</Text>
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
     textAlign:"center",
    fontStyle: 'italic',
  },
  logoDot: {
    color: 'white',
  },
  listContent: {
    padding: 16,
  },
});