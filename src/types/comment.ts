export interface Comment {
  id: string;
  recipe_id: string;
  author_name: string;
  author_email?: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

/** Payload for creating a comment (no id, created_at). */
export interface CreateCommentPayload {
  author_name: string;
  author_email?: string;
  content: string;
}
