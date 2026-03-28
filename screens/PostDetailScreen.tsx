// screens/PostDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react-native';
import { Colors } from '../constants/theme';
import FeedCard from '../components/FeedCard';
import { useFeedQueries } from '../services/feed/feed.queries';

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

export default function PostDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { postId } = route.params;

  const { postQuery } = useFeedQueries(postId);

  if (postQuery.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // 🚀 SAFETY CHECK: If the post was deleted or network drops
  if (postQuery.isError || !postQuery.data?.data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thread Not Found</Text>
          <View style={{ width: 40 }} /> 
        </View>
      </SafeAreaView>
    );
  }

  const post = postQuery.data.data;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thread</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <FlatList
        data={post?.comments || []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <FeedCard
              username={post.author.username}
              club={post.author.club}
              content={post.content}
              time={timeAgo(post.createdAt)}
              hasAudio={post.hasAudio}
              audioUrl={post.audioUrl}
              audioDuration={post.audioDuration}
              hasImage={post.hasImage}
              imageUrl={post.imageUrl}
              commentsCount={post.comments?.length || 0}
              postId={post.id}
              avatar={post.avatar}
            />
            <View style={styles.divider} />
            <Text style={styles.repliesTitle}>Replies</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ marginLeft: 20 }}>
            <FeedCard
              username={item.author.username}
              club={item.author.club || "Unknown"}
              content={item.content || ""}
              time={timeAgo(item.createdAt)}
              hasAudio={item.hasAudio}
              audioUrl={item.audioUrl}
              audioDuration={item.audioDuration}
              hasImage={item.hasImage}
              imageUrl={item.imageUrl}
              isComment={true}
              postId={item.id}
              avatar={item.author?.avatar}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No banter yet. Be the first to drop a take!</Text>
        }
      />

      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate("CreateComment", { postId: post.id })}
      >
        <MessageSquarePlus size={28} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  loadingContainer: { flex: 1, backgroundColor: '#0D0D0D', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  iconButton: { padding: 8 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 10 },
  repliesTitle: { color: '#A1A1A1', fontSize: 14, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  emptyText: { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 16 },
  
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#CCFF00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});