import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, StatusBar, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { io, Socket } from 'socket.io-client'; // 🚀 IMPORT SOCKET.IO
import { Mic, Send } from 'lucide-react-native';

import MatchHeader from '../components/MatchHeader';
import MatchChatCard from '../components/MatchChatCard';
import { useAuthStore } from '../store/useAuthStore';
import { Colors } from '../constants/theme';

export default function MatchDayScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const { user } = useAuthStore();
  
  // 🚀 Catch the match data passed from the Lobby
  const match = route.params?.match; 

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // 1. Connect to the NestJS WebSocket Gateway
    // Make sure this URL matches your backend!
    const wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3000';
    socketRef.current = io(wsUrl, {
      transports: ['websocket'],
    });

    // 2. Join the specific Match Room
    socketRef.current.emit('joinMatch', { matchId: match.id });

    // 3. Listen for incoming messages
    socketRef.current.on('newMessage', (message) => {
      setMessages((prev) => [message, ...prev]); // Add new message to the TOP of the array
    });

    return () => {
      // Cleanup when user leaves the screen
      socketRef.current?.emit('leaveMatch', { matchId: match.id });
      socketRef.current?.disconnect();
    };
  }, [match.id]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;

    const messagePayload = {
      matchId: match.id,
      userId: user?.userId,
      username: user?.username,
      club: user?.club,
      avatar: user?.avatar,
      message: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Broadcast to backend
    socketRef.current.emit('sendMessage', messagePayload);
    
    setInputText(''); // Clear input
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      
      {/* 🚀 Dynamic Match Header */}
      <MatchHeader 
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        homeLogo={match.homeLogo}
        awayLogo={match.awayLogo}
        matchTime={match.status === 'FT' ? 'FT' : match.matchTime || 'VS'}
      />

      {/* The Live Chat Trench */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id || index.toString()}
        inverted // 🚀 THIS IS CRUCIAL: Makes the list start from the bottom!
        renderItem={({ item }) => (
          <MatchChatCard 
            username={item.username}
            club={item.club}
            message={item.message}
            time={item.time}
            avatar={item.avatar}
            isMe={item.userId === user?.userId} // Highlights user's own messages
          />
        )}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />

      {/* 🚀 Integrated Input Footer */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.inputBox}>
            <TextInput 
              style={styles.input}
              placeholder="Talk your shit..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={200}
            />
            <TouchableOpacity style={styles.micBtn}>
              <Mic color="#FFF" size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.sendBtn, inputText.length > 0 && { backgroundColor: Colors.primary }]}
            disabled={inputText.length === 0}
            onPress={handleSendMessage}
          >
            <Send color={inputText.length > 0 ? "#000" : "#666"} size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  chatList: { paddingVertical: 16 },
  
  // Input Styles
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingTop: 12, backgroundColor: '#0D0D0D', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  inputBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, minHeight: 44, maxHeight: 100 },
  input: { flex: 1, color: '#FFF', fontSize: 15, paddingTop: 8, paddingBottom: 8 },
  micBtn: { padding: 4, marginLeft: 8 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginLeft: 12, marginBottom: 2 },
});