import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

import MatchHeader from '../components/MatchHeader';
import MatchChatCard from '../components/MatchChatCard';
import ChatInput from '../components/ChatInput'; 
import { useAuthStore } from '../store/useAuthStore';
import { useMatchSocket } from '../hooks/useMatchSocket'; // 🚀 IMPORT YOUR NEW HOOK
import { Colors } from '../constants/theme';

export default function MatchDayScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  
  const initialMatch = route.params?.match; 

  // 🚀 THE MAGIC: All WebSocket logic is perfectly abstracted away!
  const { currentMatch, messages, sendMessage } = useMatchSocket(initialMatch, user);
  
  const flatListRef = useRef<FlatList>(null);

  // Safety Net
  if (!currentMatch) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>No match data found.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("MatchLobby")} style={styles.goBackBtn}>
          <Text style={styles.goBackText}>Go Back to Lobby</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      <MatchHeader 
        homeTeam={currentMatch.homeTeam}
        awayTeam={currentMatch.awayTeam}
        homeScore={currentMatch.homeScore}
        awayScore={currentMatch.awayScore}
        homeLogo={currentMatch.homeLogo}
        awayLogo={currentMatch.awayLogo}
        matchTime={currentMatch.status === 'FT' ? 'FT' : currentMatch.matchTime || 'VS'}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id || index.toString()}
        inverted 
        renderItem={({ item }) => (
          <MatchChatCard 
            username={item.username}
            club={item.club}
            message={item.message}
            time={item.time}
            avatar={item.avatar}
            hasAudio={item.hasAudio}
            audioDuration={item.audioDuration}
            isMe={item.userId === user?.userId} 
          />
        )}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />

      <View style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <ChatInput onSend={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  errorText: { color: '#FFF', fontSize: 16, marginBottom: 20 },
  goBackBtn: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#1A1A1A', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  goBackText: { color: Colors.primary, fontWeight: 'bold', fontSize: 16 },
  chatList: { paddingVertical: 16 },
});