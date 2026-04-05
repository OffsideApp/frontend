/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { io, Socket } from 'socket.io-client';

import MatchHeader from '../components/MatchHeader';
import MatchChatCard from '../components/MatchChatCard';
import ChatInput from '../components/ChatInput'; // 🚀 IMPORT YOUR COMPONENT
import { useAuthStore } from '../store/useAuthStore';
import { Colors } from '../constants/theme';

export default function MatchDayScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  
  const match = route.params?.match; 

  if (!match) {
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

  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3000';
    socketRef.current = io(wsUrl, { transports: ['websocket'] });

    socketRef.current.emit('joinMatch', { matchId: match.id });

    socketRef.current.on('newMessage', (message) => {
      setMessages((prev) => [message, ...prev]); 
    });

    return () => {
      socketRef.current?.emit('leaveMatch', { matchId: match.id });
      socketRef.current?.disconnect();
    };
  }, [match.id]);

  // 🚀 THE NEW SEND HANDLER
  const handleSendMessage = async (text: string, audioUri?: string, audioDuration?: number) => {
    if (!socketRef.current) return;

    // TODO FOR PRODUCTION: If audioUri exists, you will upload it to Cloudinary here first!
    // For now, we are passing the local URI so you can test the UI instantly.
    
    const messagePayload = {
      matchId: match.id,
      userId: user?.userId,
      username: user?.username || "Unknown Fan",
      club: user?.club || "Neutral",
      avatar: user?.avatar,
      message: text || undefined,
      hasAudio: !!audioUri,
      audioUrl: audioUri, 
      audioDuration: audioDuration ? `${audioDuration}s` : undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socketRef.current.emit('sendMessage', messagePayload);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      
      <MatchHeader 
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        homeLogo={match.homeLogo}
        awayLogo={match.awayLogo}
        matchTime={match.status === 'FT' ? 'FT' : match.matchTime || 'VS'}
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

      {/* 🚀 PLUG IN THE CHAT INPUT HERE */}
      <View style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <ChatInput onSend={handleSendMessage} />
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