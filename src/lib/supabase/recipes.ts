import { createServerSupabaseClient } from "./server";
import { rowToRecipe, recipeToRow } from "./recipe-row";
import type { Recipe } from "@/types/recipe";

/** All recipes (published + draft). Server-side only. */
export async function getRecipes(): Promise<Recipe[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => rowToRecipe(row as Parameters<typeof rowToRecipe>[0]));
}

/** Only published recipes (for Gallery). */
export async function getPublishedRecipes(): Promise<Recipe[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => rowToRecipe(row as Parameters<typeof rowToRecipe>[0]));
}

/** Only draft recipes (for Drafts page). */
export async function getDraftRecipes(): Promise<Recipe[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("status", "draft")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => rowToRecipe(row as Parameters<typeof rowToRecipe>[0]));
}

/** Get one recipe by slug. Returns undefined if not found. */
export async function getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToRecipe(data as Parameters<typeof rowToRecipe>[0]) : undefined;
}

/** Get one recipe by id. Returns undefined if not found. */
export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToRecipe(data as Parameters<typeof rowToRecipe>[0]) : undefined;
}

/** Insert or update a recipe. */
export async function saveRecipe(recipe: Recipe): Promise<void> {
  const supabase = createServerSupabaseClient();
  const row = recipeToRow(recipe);
  const payload = {
    ...row,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("recipes").upsert(payload, {
    onConflict: "id",
  });
  if (error) {
    console.error("[saveRecipe] Supabase error:", error.message, error.details);
    throw error;
  }
}

/** Delete a recipe by id. */
export async function deleteRecipe(id: string): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
}

/** Check if a slug is already used by another recipe (optional excludeId for edit). */
export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return false;
  return data.id !== excludeId;
}
