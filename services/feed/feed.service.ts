import { CreatePostPayload } from "@/types/feed.types";
import { api } from "../axios";

export class FeedService {
  // 1. Create a Post
  static async createPost(data: CreatePostPayload) {
    const response = await api.post('/feed/create-post', data);
    return response.data.data; 
  }

  // 2. Fetch the Feed
  static async getFeed(limit = 20, offset = 0) {
    const response = await api.get(`/feed/get-feed?limit=${limit}&offset=${offset}`);
    return response.data.data;
  }
}
