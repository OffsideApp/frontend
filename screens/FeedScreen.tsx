// screens/FeedScreen.tsx
import React from 'react';
import { 
  View, Text, StyleSheet, FlatList, 
  StatusBar, ActivityIndicator, RefreshControl 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import FeedCard from '../components/FeedCard'; 
import StickyFooter from '../components/StickyFooter'; 
import { Colors } from '../constants/theme'; 
import { useAuthStore } from '../store/useAuthStore';
import { useFeedQueries } from '../services/feed/feed.queries';

// Helper function to format timestamps into "2m ago", "1h ago"
const timeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `Just now`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function FeedScreen() {
  const logout = useAuthStore((state) => state.logout);
  const navigation = useNavigation<any>(); 
  const insets = useSafeAreaInsets();
  
  // 🚀 Pull in the real data from your backend!
  const { feedQuery } = useFeedQueries();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>OFFSIDE</Text>
      </View>

      {/* Main Content Area */}
      {feedQuery.isLoading ? (
        // Show loading spinner while fetching the initial feed
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : feedQuery.isError ? (
        // Show error state if the network fails
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load the feed.</Text>
        </View>
      ) : feedQuery.data?.length === 0 ? (
        // Show empty state if there are no posts yet
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>The stadium is empty. Start a rant!</Text>
        </View>
      ) : (
        // Render the actual posts from the database
        <FlatList
          data={feedQuery.data}
          keyExtractor={(item) => item.id}
          // Add Pull-to-Refresh functionality
          refreshControl={
            <RefreshControl 
              refreshing={feedQuery.isRefetching} 
              onRefresh={feedQuery.refetch}
              tintColor={Colors.primary} 
            />
          }
          renderItem={({ item }) => (
            <FeedCard 
              // Map the nested backend data to your FeedCard props
              username={item.author?.username || "Unknown"} 
              club={item.author?.club || "Unknown"} 
              content={item.content} 
              time={timeAgo(item.createdAt)} 
              hasAudio={item.hasAudio} 
              audioDuration={item.audioDuration} 
              audioUrl={item.audioUrl}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Sticky Footer */}
      <StickyFooter onPress={() => navigation.navigate("CreatePost")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D', 
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#CCFF00', 
    textAlign: "center",
    fontStyle: 'italic',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  emptyText: {
    color: '#A1A1A1',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120, // Enough padding so the StickyFooter doesn't cover the last post
  },
});