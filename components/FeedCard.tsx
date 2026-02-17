import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Heart, MessageSquare, AlertOctagon } from 'lucide-react-native';

type FeedCardProps = {
  username: string;
  club: string;
  content: string;
  time: string;
};

export default function FeedCard({ username, club, content, time }: FeedCardProps) {
  return (
    <View style={styles.card}>
      {/* Header: Avatar + Name + Time */}
      <View style={styles.headerRow}>
        {/* Avatar Placeholder */}
        <View style={styles.avatar} />
        
        <View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{username}</Text>
            {/* Club Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{club}</Text>
            </View>
          </View>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
      </View>

      {/* The Rant Text */}
      <Text style={styles.content}>{content}</Text>

      {/* The Audio Player */}
      <TouchableOpacity style={styles.audioPlayer}>
        <View style={styles.playButton}>
          <Play size={14} color="black" fill="black" />
        </View>
        <View style={styles.waveform} />
        <Text style={styles.duration}>0:34</Text>
      </TouchableOpacity>

      {/* Footer: Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart size={20} color="#A1A1A1" />
          <Text style={styles.actionText}>24</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageSquare size={20} color="#A1A1A1" />
          <Text style={styles.actionText}>8</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <AlertOctagon size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#0047AB', // Default blue, we can make this dynamic later
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  timestamp: {
    color: '#A1A1A1',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  audioPlayer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 16,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CCFF00', // Neon Green
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  waveform: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginRight: 12,
  },
  duration: {
    color: '#A1A1A1',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#A1A1A1',
    fontSize: 14,
    marginLeft: 6,
  },
});