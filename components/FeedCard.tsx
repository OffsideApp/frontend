import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image'; // Using expo-image as you did in select-club
import { Play, Heart, MessageSquare, AlertOctagon } from 'lucide-react-native';
import { CLUBS } from "@/constants/clubs"; // Import your existing constants

type FeedCardProps = {
  username: string;
  club: string;
  content: string;
  time: string;
  hasAudio?: boolean;
  audioDuration?: string;
};

export default function FeedCard({ 
  username, 
  club, 
  content, 
  time, 
  hasAudio, 
  audioDuration 
}: FeedCardProps) {
  
  // Find the club object to get the ESPN logo URL
  const clubData = CLUBS.find(c => c.name === club);
  const clubLogo = clubData?.logo;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {/* User Avatar */}
        <View style={styles.avatar} />
        
        <View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{username}</Text>
            
            {/* Club Badge with ESPN Logo */}
            <View >
               {clubLogo ? (
                 <Image 
                  source={{ uri: clubLogo }} 
                  style={styles.clubLogo} 
                  contentFit="contain"
                  transition={200}
                />
               ) : null}
              {/* <Text style={styles.badgeText}>{club}</Text> */}
            </View>
          </View>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
      </View>

      <Text style={styles.content}>{content}</Text>

      {hasAudio && (
        <TouchableOpacity style={styles.audioPlayer}>
          <View style={styles.playButton}>
            <Play size={14} color="black" fill="black" />
          </View>
          <View style={styles.waveform} />
          <Text style={styles.duration}>{audioDuration || "0:00"}</Text>
        </TouchableOpacity>
      )}

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
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  clubLogo: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  badgeText: {
    color: '#E0E0E0',
    fontSize: 11,
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
    backgroundColor: '#CCFF00',
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