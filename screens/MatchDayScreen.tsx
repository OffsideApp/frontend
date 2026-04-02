// screens/MatchDayScreen.tsx
import React from 'react';
import { View, StyleSheet, FlatList, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MatchHeader from '../components/MatchHeader';
import MatchChatCard from '../components/MatchChatCard';
import ChatInput from '../components/ChatInput';

// DUMMY DATA FOR UI TESTING
const DUMMY_CHAT = [
  { id: '1', username: 'Gooner4Life', club: 'ARS', message: 'If we concede now I am deleting the app.', time: '12:04', avatar: 'https://i.pravatar.cc/150?u=1', isMe: false },
  { id: '2', username: 'ChelsBoy', club: 'CHE', message: 'Jackson is moving like a prime R9 right now what is going on???', time: '12:05', avatar: 'https://i.pravatar.cc/150?u=2', isMe: false },
  { id: '3', username: 'Ozzy', club: 'ARS', message: 'Calm down bro, it was one pass.', time: '12:06', avatar: 'https://i.pravatar.cc/150?u=3', isMe: true }, // This will be green and on the right!
  { id: '4', username: 'Gooner4Life', club: 'ARS', hasAudio: true, audioDuration: '12s', time: '12:07', avatar: 'https://i.pravatar.cc/150?u=1', isMe: false },
];

export default function MatchDayScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      
      <MatchHeader 
        homeTeam="Arsenal"
        awayTeam="Chelsea"
        homeScore={2}
        awayScore={1}
        homeLogo="https://media.api-sports.io/football/teams/42.png" // Arsenal
        awayLogo="https://media.api-sports.io/football/teams/49.png" // Chelsea
        matchTime="67'"
      />

      {/* The Chat Trench */}
      <FlatList
        data={DUMMY_CHAT}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MatchChatCard 
            username={item.username}
            club={item.club}
            message={item.message}
            time={item.time}
            avatar={item.avatar}
            hasAudio={item.hasAudio}
            audioDuration={item.audioDuration}
            isMe={item.isMe}
          />
        )}
        contentContainerStyle={styles.chatList}
        inverted={false} // Set to true later when we do WebSockets so new messages push from the bottom
      />

      <ChatInput />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  chatList: { paddingVertical: 16 },
});