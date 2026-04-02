import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useMatches } from '../services/match/matches.queries';
import { Colors } from '../constants/theme';

export default function MatchLobbyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { data: matches, isLoading, isError } = useMatches();

  const renderMatchCard = ({ item }: { item: any }) => {
    const isLive = ['1H', 'HT', '2H'].includes(item.status);
    const isFinished = item.status === 'FT';

    return (
      <TouchableOpacity 
        style={styles.matchCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("MatchDay", { match: item })} // 🚀 Pass the match data to the chat!
      >
        {/* Status Badge */}
        <View style={styles.statusRow}>
          {isLive ? (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{item.matchTime}</Text>
            </View>
          ) : (
            <Text style={styles.statusText}>
              {isFinished ? 'Full Time' : new Date(item.fixtureDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>

        {/* Scoreboard */}
        <View style={styles.scoreboard}>
          <View style={styles.team}>
            <Image source={{ uri: item.homeLogo }} style={styles.logo} contentFit="contain" />
            <Text style={styles.teamName} numberOfLines={1}>{item.homeTeam}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{item.homeScore} - {item.awayScore}</Text>
          </View>

          <View style={styles.team}>
            <Image source={{ uri: item.awayLogo }} style={styles.logo} contentFit="contain" />
            <Text style={styles.teamName} numberOfLines={1}>{item.awayTeam}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Matchday Lobby</Text>
        <Text style={styles.subtitle}>Pick a trench. Start cooking.</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator color={Colors.primary} size="large" /></View>
      ) : isError ? (
        <View style={styles.center}><Text style={{ color: 'red' }}>Failed to load matches.</Text></View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={renderMatchCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  subtitle: { color: '#A1A1A1', fontSize: 14, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 40 },
  matchCard: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statusRow: { alignItems: 'center', marginBottom: 12 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 59, 48, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.3)' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30', marginRight: 6 },
  liveText: { color: '#FF3B30', fontSize: 12, fontWeight: 'bold' },
  statusText: { color: '#A1A1A1', fontSize: 12, fontWeight: 'bold' },
  scoreboard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  team: { flex: 1, alignItems: 'center' },
  logo: { width: 40, height: 40, marginBottom: 8 },
  teamName: { color: '#FFF', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  scoreContainer: { paddingHorizontal: 20 },
  scoreText: { color: Colors.primary, fontSize: 28, fontWeight: '900', fontStyle: 'italic' },
});