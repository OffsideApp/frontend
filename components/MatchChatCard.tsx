// components/MatchChatCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Mic } from 'lucide-react-native';
import { Colors } from '../constants/theme';

type ChatCardProps = {
  username: string;
  club: string;
  message?: string;
  time: string;
  avatar: string;
  hasAudio?: boolean;
  audioDuration?: string;
  isMe?: boolean; // If true, align to the right!
};

export default function MatchChatCard({ username, club, message, time, avatar, hasAudio, audioDuration, isMe }: ChatCardProps) {
  return (
    <View style={[styles.container, isMe ? styles.myContainer : styles.otherContainer]}>
      
      {!isMe && (
        <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
      )}

      <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
        {!isMe && (
          <View style={styles.header}>
            <Text style={styles.username}>{username}</Text>
            <View style={styles.clubBadge}>
              <Text style={styles.clubText}>{club}</Text>
            </View>
          </View>
        )}

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {hasAudio && (
          <View style={styles.audioBox}>
            <Mic size={16} color={isMe ? "#000" : Colors.primary} />
            <Text style={[styles.audioText, isMe && { color: "#000" }]}>Audio Rant • {audioDuration}</Text>
          </View>
        )}

        <Text style={[styles.time, isMe && { color: 'rgba(0,0,0,0.5)', alignSelf: 'flex-end' }]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginBottom: 16, paddingHorizontal: 16 },
  myContainer: { justifyContent: 'flex-end' },
  otherContainer: { justifyContent: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8, alignSelf: 'flex-end' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  myBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: '#1F1F1F', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  username: { color: '#FFF', fontSize: 13, fontWeight: 'bold', marginRight: 6 },
  clubBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  clubText: { color: '#A1A1A1', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  message: { color: '#E0E0E0', fontSize: 15, lineHeight: 20, marginBottom: 4 },
  time: { color: '#666', fontSize: 10, marginTop: 4 },
  audioBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 8, marginTop: 4 },
  audioText: { color: Colors.primary, fontSize: 13, fontWeight: 'bold', marginLeft: 6 },
});