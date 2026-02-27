import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import FeedCard from '../../components/FeedCard'; 
import { Colors } from '@/constants/theme';
import { useFeedQueries } from '@/services/feed/feed.queries';

export default function FeedScreen() {
  const { feedQuery } = useFeedQueries();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>OFFSIDE</Text>
      </View>

      {feedQuery.isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ color: '#555', marginTop: 10 }}>Fetching rants...</Text>
        </View>
      ) : (
        <FlatList
          data={feedQuery.data} 
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <FeedCard 
              username={item.author?.username || 'Fan'} 
              club={item.author?.club || 'Neutral'} 
              content={item.content} 
              // Basic formatting for now, we can add 'date-fns' for "2m ago" later
              time={new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              hasAudio={item.hasAudio}
              audioDuration={item.audioDuration}
            />
          )}
          contentContainerStyle={styles.listContent}
          // Pull to refresh!
          onRefresh={() => feedQuery.refetch()}
          refreshing={feedQuery.isFetching}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingTop: 25, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#262626' },
  logo: { fontSize: 28, fontWeight: '900', color: Colors.primary, textAlign: "center", fontStyle: 'italic' },
  listContent: { padding: 16, paddingBottom: 100 }, // Pad for bottom tab bar
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});