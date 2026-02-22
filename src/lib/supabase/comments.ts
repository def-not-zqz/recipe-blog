import { createServerSupabaseClient } from "./server";
import type { Comment } from "@/types/comment";
import type { CreateCommentPayload } from "@/types/comment";

/** Get approved comments for a recipe, newest first. */
export async function getCommentsByRecipeId(recipeId: string): Promise<Comment[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, recipe_id, author_name, author_email, content, is_approved, created_at")
    .eq("recipe_id", recipeId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Comment[];
}

/** Create a comment (anon). */
export async function createComment(
  recipeId: string,
  payload: CreateCommentPayload
): Promise<Comment> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({
      recipe_id: recipeId,
      author_name: payload.author_name.trim() || "匿名",
      author_email: payload.author_email?.trim() || null,
      content: payload.content.trim(),
      is_approved: true,
    })
    .select("id, recipe_id, author_name, author_email, content, is_approved, created_at")
    .single();
  if (error) throw error;
  return data as Comment;
}
