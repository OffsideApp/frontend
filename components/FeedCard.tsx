// components/FeedCard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { Image } from 'expo-image';
import { Play, Pause, Flame, FlagTriangleRight, MessageSquare, Tv } from 'lucide-react-native';
import { Audio } from 'expo-av'; 
import { CLUBS } from "@/constants/clubs"; 
import { Colors } from '@/constants/theme';

type FeedCardProps = {
  username: string;
  club: string;
  content: string;
  time: string;
  hasAudio?: boolean;
  audioDuration?: string;
  audioUrl?: string | null;
  initialCooks?: number; 
  initialOffsides?: number;
  commentsCount?: number;
  hasImage?: boolean;
  imageUrl?: string | null;
  onPress?: () => void; 
  isComment?: boolean; // 👈 NEW: Added the isComment prop
};

export default function FeedCard({ 
  username, club, content, time, hasAudio, audioDuration, audioUrl,
  initialCooks = 0, initialOffsides = 0, commentsCount = 0, hasImage, imageUrl, onPress,
  isComment = false // 👈 NEW: Defaulted to false so regular posts still show the button
}: FeedCardProps) {
  
  const clubData = CLUBS.find(c => c.name === club);
  const clubLogo = clubData?.logo;

  const [cooks, setCooks] = useState(initialCooks);
  const [offsides, setOffsides] = useState(initialOffsides);
  const [userAction, setUserAction] = useState<'cooked' | 'offside' | null>(null);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  async function togglePlay() {
    if (!audioUrl) return;
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true, isLooping: false } 
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            await newSound.pauseAsync();       
            await newSound.setPositionAsync(0); 
          }
        });
      }
    } catch (error) {
      console.error("Error playing audio", error);
    }
  }

  const handleCook = () => {
    Vibration.vibrate(50); 
    if (userAction === 'cooked') {
      setCooks(prev => prev - 1);
      setUserAction(null);
    } else {
      setCooks(prev => prev + 1);
      if (userAction === 'offside') setOffsides(prev => prev - 1);
      setUserAction('cooked');
    }
  };

  const handleOffside = () => {
    Vibration.vibrate(50);
    if (userAction === 'offside') {
      setOffsides(prev => prev - 1);
      setUserAction(null);
    } else {
      setOffsides(prev => prev + 1);
      if (userAction === 'cooked') setCooks(prev => prev - 1);
      setUserAction('offside');
    }
  };

  const handleVAR = () => {
    alert("Sent to VAR room for review! (Reported)");
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.9}
      disabled={!onPress} 
    >
      <View style={styles.headerRow}>
        <View style={styles.avatar} />
        <View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{username}</Text>
            <View>
               {clubLogo ? (
                 <Image source={{ uri: clubLogo }} style={styles.clubLogo} contentFit="contain" transition={200}/>
               ) : null}
            </View>
          </View>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
      </View>

      {content ? <Text style={styles.content}>{content}</Text> : null}

      {hasImage && imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.postImage} 
          contentFit="cover" 
          transition={200}
        />
      )}

      {hasAudio && audioUrl && (
        <TouchableOpacity 
          style={[styles.audioPlayer, isPlaying && styles.audioPlayerActive]} 
          onPress={togglePlay}
          activeOpacity={0.7}
        >
          <View style={styles.playButton}>
            {isPlaying ? (
              <Pause size={14} color="black" fill="black" />
            ) : (
              <Play size={14} color="black" fill="black" />
            )}
          </View>
          <View style={styles.waveformContainer}>
             <View style={[styles.waveform, isPlaying && styles.waveformPlaying]} />
          </View>
          <Text style={[styles.duration, isPlaying && { color: Colors.primary }]}>
            {isPlaying ? "Playing..." : audioDuration || "0:00"}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <View style={styles.interactionGroup}>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleCook}>
            <Flame 
              size={20} 
              color={userAction === 'cooked' ? Colors.primary : "#A1A1A1"} 
              fill={userAction === 'cooked' ? "rgba(204, 255, 0, 0.2)" : "transparent"} 
            />
            <Text style={[styles.actionText, userAction === 'cooked' && { color: Colors.primary, fontWeight: 'bold' }]}>
              {cooks > 0 ? cooks : 'Cook'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleOffside}>
            <FlagTriangleRight 
              size={20} 
              color={userAction === 'offside' ? "#FF3B30" : "#A1A1A1"} 
              fill={userAction === 'offside' ? "rgba(255, 59, 48, 0.2)" : "transparent"} 
            />
            <Text style={[styles.actionText, userAction === 'offside' && { color: '#FF3B30', fontWeight: 'bold' }]}>
              {offsides > 0 ? offsides : 'Offside'}
            </Text>
          </TouchableOpacity>

          {/* 🚀 HIDDEN IF IT IS A COMMENT */}
          {!isComment && (
            <TouchableOpacity style={styles.actionButton} onPress={onPress}>
              <MessageSquare size={20} color="#A1A1A1" />
              <Text style={styles.actionText}>
                {commentsCount > 0 ? commentsCount : 'Banter'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={handleVAR}>
          <Tv size={20} color="#A1A1A1" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1F1F1F', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333', marginRight: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  username: { color: 'white', fontWeight: 'bold', fontSize: 16, marginRight: 8 },
  clubLogo: { width: 18, height: 18, marginRight: 6 },
  timestamp: { color: '#A1A1A1', fontSize: 12, marginTop: 2 },
  content: { color: '#E0E0E0', fontSize: 16, lineHeight: 24, marginBottom: 16 },
  
  audioPlayer: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 30, padding: 8, paddingRight: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  audioPlayerActive: { borderColor: 'rgba(204, 255, 0, 0.3)', backgroundColor: 'rgba(204, 255, 0, 0.05)' },
  playButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  waveformContainer: { flex: 1, height: 4, backgroundColor: '#333', borderRadius: 2, marginRight: 12, overflow: 'hidden' },
  waveform: { width: '100%', height: '100%', backgroundColor: '#555' },
  waveformPlaying: { backgroundColor: Colors.primary },
  duration: { color: '#A1A1A1', fontSize: 12, fontWeight: '600' },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  interactionGroup: { flexDirection: 'row', alignItems: 'center', gap: 20 }, 
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { color: '#A1A1A1', fontSize: 14, marginLeft: 6 },
  postImage: { width: '100%', height: 250, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
});