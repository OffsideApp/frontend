export interface CreatePostPayload {
  content: string;
  hasAudio?: boolean;
  audioUrl?: string | null;
  audioDuration?: string;
}
