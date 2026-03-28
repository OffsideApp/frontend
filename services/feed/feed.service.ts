// import { CreatePostPayload } from "@/types/feed.types";
import { api } from "../axios";

export class FeedService {
  // 1. Create a Post
  static async createPost(formData: FormData) {
    const response = await api.post('/feed/create-post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data; 
  }

  // 2. Fetch the Feed
  static async getFeed(limit = 20, offset = 0) {
    const response = await api.get(`/feed/get-feed?limit=${limit}&offset=${offset}`);
    return response.data.data;
  }

  static async getPost(postId: string) {
    const response = await api.get(`/feed/get-post/${postId}`);
    return response.data; 
  }
  
  static async createComment(data: FormData)  {
    const response = await api.post('/feed/comment', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
  
  static async interactWithPost (dto: { postId: string; action: 'COOK' | 'OFFSIDE' })  {
    const { data } = await api.post('/feed/interact', dto);
    return data;
  }
}
