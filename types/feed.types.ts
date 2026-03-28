export interface CreatePostPayload {
  content: string;
  hasAudio?: boolean;
  audioUrl?: string | null;
  audioDuration?: string;
}


// types/feed.types.ts

export interface Comment {
  id: string;
  content?: string;
  hasAudio: boolean;
  audioUrl?: string | null;
  audioDuration?: string;
  hasImage: boolean;
  imageUrl?: string | null;
  authorId: string;
  postId: string;
  author: {
    username: string;
    club?: string;
    avatar?: string;
  };
  createdAt: string;
}

// Update your existing Post interface to include comments:
export interface Post {
  id: string;
  content: string;
  hasAudio: boolean;
  audioUrl?: string;
  audioDuration?: string;
  hasImage?: boolean;
  imageUrl?: string | null;
  authorId: string;
  createdAt: string;
  author: {
    username: string;
    club: string;
    avatar?: string;
  };
  comments?: Comment[]; // 👈 NEW
}