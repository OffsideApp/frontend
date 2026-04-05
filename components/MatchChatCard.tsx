import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import { Colors } from '../constants/theme';

type MatchChatCardProps = {
  username: string;
  club: string;
  message?: string;
  time: string;
  avatar?: string;
  hasAudio?: boolean;
  audioDuration?: string;
  isMe: boolean;
};

export default function MatchChatCard({ username, club, message, time, avatar, hasAudio, audioDuration, isMe }: MatchChatCardProps) {
  return (
    <View style={[styles.container, isMe ? styles.myContainer : styles.theirContainer]}>
      
      {/* Avatar (Only show if it's someone else) */}
      {!isMe && (
        <Image 
          source={{ uri: avatar || 'https://ui-avatars.com/api/?name=' + username }} 
          style={styles.avatar} 
          contentFit="cover" 
        />
      )}

      <View style={[styles.contentBlock, isMe ? styles.myContentBlock : styles.theirContentBlock]}>
        
        {/* Username & Club Row (Only show for other people) */}
        {!isMe && (
          <View style={styles.headerRow}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.clubText}>• {club}</Text>
          </View>
        )}

        {/* The Chat Bubble */}
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          
          {/* Audio Rant UI */}
          {hasAudio && (
            <TouchableOpacity style={styles.audioContainer}>
              <View style={[styles.playBtn, isMe ? styles.myPlayBtn : styles.theirPlayBtn]}>
                <Play color={isMe ? "#FFF" : "#000"} size={16} fill={isMe ? "#FFF" : "#000"} />
              </View>
              {/* 🚀 FIXED: Black text for audio duration if it's your bubble */}
              <Text style={[styles.audioText, isMe ? styles.myText : styles.theirText]}>
                Audio Rant • {audioDuration}
              </Text>
            </TouchableOpacity>
          )}

          {/* Text Message UI */}
          {/* 🚀 FIXED: Black text if it's your bubble, White if it's theirs! */}
          {message && (
            <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
              {message}
            </Text>
          )}
        </View>

        {/* Time Stamp */}
        <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.theirTimeText]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginBottom: 16, paddingHorizontal: 16 },
  myContainer: { justifyContent: 'flex-end' },
  theirContainer: { justifyContent: 'flex-start' },
  
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12, marginTop: 4, backgroundColor: '#333' },
  contentBlock: { maxWidth: '80%' },
  myContentBlock: { alignItems: 'flex-end' },
  theirContentBlock: { alignItems: 'flex-start' },
  
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, marginLeft: 4 },
  username: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  clubText: { color: '#888', fontSize: 12, marginLeft: 4 },
  
  bubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  // 🚀 Neon background for your messages, dark grey for theirs
  myBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 }, 
  theirBubble: { backgroundColor: '#1A1A1A', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  
  // 🚀 The text color switch!
  messageText: { fontSize: 15, lineHeight: 22 },
  myText: { color: '#000000', fontWeight: '500' }, 
  theirText: { color: '#FFFFFF' }, 

  timeText: { fontSize: 11, color: '#666', marginTop: 4 },
  myTimeText: { marginRight: 4 },
  theirTimeText: { marginLeft: 4 },

  // Audio specific styles
  audioContainer: { flexDirection: 'row', alignItems: 'center', minWidth: 140 },
  playBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  myPlayBtn: { backgroundColor: '#000' }, // Black play button on Neon background
  theirPlayBtn: { backgroundColor: Colors.primary }, // Neon play button on dark background
  audioText: { fontSize: 14, fontWeight: '600' },
});