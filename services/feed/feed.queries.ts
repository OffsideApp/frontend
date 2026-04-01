// services/feed.queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedService } from './feed.service';
import { Alert } from 'react-native';

// 🚀 Add club parameter here
export const useFeedQueries = (postId?: string, club?: string) => {
  const queryClient = useQueryClient();

  const feedQuery = useQuery({
    // 🚀 Cache them separately so swapping tabs is instant
    queryKey: ['feed', club || 'all'], 
    // 🚀 Pass the club to the service
    queryFn: () => FeedService.getFeed(20, 0, club), 
    refetchInterval: 10000, 
    refetchIntervalInBackground: false,
  });

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => FeedService.getPost(postId!),
    enabled: !!postId, 
  });

  const createPostMutation = useMutation({
    mutationFn: FeedService.createPost,
    onSuccess: () => {
      // 🚀 Invalidate BOTH feeds so the new post shows up everywhere
      queryClient.invalidateQueries({ queryKey: ['feed'] }); 
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to create post");
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: FeedService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to post reply");
    }
  });

  const interactMutation = useMutation({
    mutationFn: (dto: { postId: string; action: 'COOK' | 'OFFSIDE' }) => 
      FeedService.interactWithPost(dto),
  });

  return { feedQuery, postQuery, createPostMutation, createCommentMutation, interactMutation };
};