import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedService} from './feed.service';
import { CreatePostPayload } from '../../types/feed.types';
import { Alert } from 'react-native';


// We now accept an optional postId so we can fetch a specific thread!
export const useFeedQueries = (postId?: string) => {
  const queryClient = useQueryClient();

  // 1. Hook to fetch the feed
  const feedQuery = useQuery({
    queryKey: ['feed'],
    queryFn: () => FeedService.getFeed(),
    // Refetch every 10 seconds if the app is active
      refetchInterval: 10000, 
      // Ensure it doesn't refetch when the user is away from the app
      refetchIntervalInBackground: false,
  });

  // 👇 NEW: Fetch a single post & its comments
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => FeedService.getPost(postId!),
    enabled: !!postId, // Only run this if a postId was passed in
  });

  const createPostMutation = useMutation({
    mutationFn: FeedService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to create post");
    }
  });

  //  NEW: Create a comment mutation
  const createCommentMutation = useMutation({
    mutationFn: FeedService.createComment,
    onSuccess: () => {
      // Refresh both the main feed AND the specific thread we are looking at
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
    // We don't invalidate the feed immediately because we handle the UI optimistically 
    // inside the FeedCard component for instant visual feedback!
  });

  return { feedQuery, postQuery, createPostMutation, createCommentMutation, interactMutation };
};