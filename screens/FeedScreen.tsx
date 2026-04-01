// screens/FeedScreen.tsx
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, 
  StatusBar, ActivityIndicator, RefreshControl, TouchableOpacity 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { User, Settings } from 'lucide-react-native'; // 🚀 Added your Lucide icons

import FeedCard from '../components/FeedCard'; 
import StickyFooter from '../components/StickyFooter'; 
import { Colors } from '../constants/theme'; 
import { useAuthStore } from '../store/useAuthStore';
import { useFeedQueries } from '../services/feed/feed.queries';

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
  const { user } = useAuthStore();
  const navigation = useNavigation<any>(); 
  const insets = useSafeAreaInsets();
  
  // 🚀 TABS STATE
  const [activeTab, setActiveTab] = useState<'all' | 'club'>('all');
  
  // 🚀 PASS THE DYNAMIC CLUB TO THE HOOK
  const { feedQuery } = useFeedQueries(
    undefined, 
    activeTab === 'club' ? user?.club || undefined : undefined
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      
      {/* 🚀 CUSTOM TWITTER-STYLE HEADER */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
          ) : (
            <View style={styles.headerAvatarPlaceholder}>
              <User color="#A1A1A1" size={20} />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.logo}>OFFSIDE</Text>

        <TouchableOpacity>
          <Settings color="#FFF" size={24} />
        </TouchableOpacity>
      </View>

      {/* 🚀 TAB SWITCHER */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('all')}>
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            General
          </Text>
          {activeTab === 'all' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('club')}>
          <Text style={[styles.tabText, activeTab === 'club' && styles.activeTabText]}>
            My Club
          </Text>
          {activeTab === 'club' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      {feedQuery.isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : feedQuery.isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load the feed.</Text>
        </View>
      ) : feedQuery.data?.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {activeTab === 'club' ? `No posts from ${user?.club} fans yet.` : 'The stadium is empty. Start a rant!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={feedQuery.data}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={feedQuery.isRefetching} 
              onRefresh={feedQuery.refetch}
              tintColor={Colors.primary} 
            />
          }
          renderItem={({ item }) => (
            <FeedCard 
              postId={item.id}
              content={item.content} 
              time={timeAgo(item.createdAt)} 
              authorId={item.author?.id || item.authorId}
              username={item.author?.username || "Unknown"} 
              club={item.author?.club || "Unknown"} 
              avatar={item.author?.avatar} 
              hasAudio={item.hasAudio} 
              audioDuration={item.audioDuration} 
              audioUrl={item.audioUrl}
              hasImage={item.hasImage}
              imageUrl={item.imageUrl}
              initialCooks={item.likesCount || 0}
              initialOffsides={item.dislikesCount || 0}
              commentsCount={item.commentsCount || 0}
              onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
              onAvatarPress={() => {
                if (item.author?.username) {
                  navigation.navigate("UserProfile", { username: item.author.username });
                }
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <StickyFooter onPress={() => navigation.navigate("CreatePost")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  
  // 🚀 Header Styles
  customHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 15 },
  headerAvatar: { width: 32, height: 32, borderRadius: 16 },
  headerAvatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 24, fontWeight: '900', color: '#CCFF00', fontStyle: 'italic' },
  
  // 🚀 Tab Styles
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' },
  tabText: { color: '#A1A1A1', fontSize: 16, fontWeight: '600' },
  activeTabText: { color: '#FFF', fontWeight: 'bold' },
  activeTabIndicator: { position: 'absolute', bottom: 0, width: 60, height: 3, backgroundColor: '#CCFF00', borderTopLeftRadius: 3, borderTopRightRadius: 3 },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#FF3B30', fontSize: 16 },
  emptyText: { color: '#A1A1A1', fontSize: 16 },
  listContent: { padding: 16, paddingBottom: 120 },
});