// components/MatchHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Colors } from '../constants/theme';

type MatchHeaderProps = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeLogo: string;
  awayLogo: string;
  matchTime: string; // e.g., "67'", "HT", "FT"
};

export default function MatchHeader({ 
  homeTeam, awayTeam, homeScore, awayScore, homeLogo, awayLogo, matchTime 
}: MatchHeaderProps) {
  // 🚀 Added <any> to keep TypeScript happy when passing string routes!
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Top Row: Back Button & League */}
      <View style={styles.topRow}>
        
        {/* 🚀 THE FIX: Wired to "MatchLobby" and added the "Lobby" text label */}
        <TouchableOpacity 
          onPress={() => navigation.navigate("MatchLobby")} 
          style={styles.backBtnContainer}
        >
          <ChevronLeft color="#FFF" size={24} />
          <Text style={styles.backBtnText}>Lobby</Text>
        </TouchableOpacity>

        <Text style={styles.leagueText}>Premier League</Text>
        
        {/* Spacer to perfectly center the league text (matches the width of the back button) */}
        <View style={{ width: 65 }} /> 
      </View>

      {/* Scoreboard */}
      <View style={styles.scoreBoard}>
        {/* Home Team */}
        <View style={styles.teamBox}>
          <Image source={{ uri: homeLogo }} style={styles.logo} contentFit="contain" />
          <Text style={styles.teamName} numberOfLines={1}>{homeTeam}</Text>
        </View>

        {/* Score & Time */}
        <View style={styles.centerBox}>
          <Text style={styles.scoreText}>{homeScore} - {awayScore}</Text>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{matchTime}</Text>
          </View>
        </View>

        {/* Away Team */}
        <View style={styles.teamBox}>
          <Image source={{ uri: awayLogo }} style={styles.logo} contentFit="contain" />
          <Text style={styles.teamName} numberOfLines={1}>{awayTeam}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1A1A1A', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, marginBottom: 16 },
  
  // 🚀 Updated Styles for the Back Button
  backBtnContainer: { flexDirection: 'row', alignItems: 'center', width: 65 }, 
  backBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginLeft: 2 },
  
  leagueText: { color: '#A1A1A1', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  scoreBoard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  teamBox: { flex: 1, alignItems: 'center' },
  logo: { width: 48, height: 48, marginBottom: 8 },
  teamName: { color: '#FFF', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  centerBox: { alignItems: 'center', paddingHorizontal: 20 },
  scoreText: { color: Colors.primary, fontSize: 32, fontWeight: '900', fontStyle: 'italic', marginBottom: 4 },
  timeBadge: { backgroundColor: 'rgba(255, 59, 48, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.3)' },
  timeText: { color: '#FF3B30', fontSize: 12, fontWeight: 'bold' },
});