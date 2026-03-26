import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedService} from './feed.service';
import { CreatePostPayload } from '../../types/feed.types';

export const useFeedQueries = () => {
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

  // 2. Hook to create a post
  const createPostMutation = useMutation({
    mutationFn: (data: FormData) => FeedService.createPost(data),
    onSuccess: () => {
      // Instantly refresh the feed when a new post is successfully created!
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      
    },
  });

  return { feedQuery, createPostMutation };
};