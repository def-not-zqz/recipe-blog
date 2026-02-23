"use server";

import {
  saveRecipe as dbSaveRecipe,
  deleteRecipe as dbDeleteRecipe,
  isSlugTaken as dbIsSlugTaken,
} from "@/lib/supabase/recipes";
import { isServerAdmin } from "@/lib/auth";
import type { Recipe } from "@/types/recipe";

export type RecipeActionResult = { success: true } | { success: false; error: string };

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  const o = e as { message?: string; details?: string };
  if (typeof o?.message === "string") return o.message;
  if (typeof o?.details === "string") return o.details;
  return String(e) || "Failed to save recipe";
}

/** Server Action: create or update a recipe. Only admins. */
export async function saveRecipeAction(recipe: Recipe): Promise<RecipeActionResult> {
  try {
    const admin = await isServerAdmin();
    if (!admin) return { success: false, error: "需要管理员权限" };
    await dbSaveRecipe(recipe);
    return { success: true };
  } catch (e) {
    console.error("[saveRecipeAction]", e);
    return { success: false, error: getErrorMessage(e) };
  }
}

/** Server Action: delete a recipe by id. Only admins. */
export async function deleteRecipeAction(id: string): Promise<RecipeActionResult> {
  try {
    const admin = await isServerAdmin();
    if (!admin) return { success: false, error: "需要管理员权限" };
    await dbDeleteRecipe(id);
    return { success: true };
  } catch (e) {
    console.error("[deleteRecipeAction]", e);
    return { success: false, error: getErrorMessage(e) };
  }
}

/** Server Action: check if slug is taken (optional excludeId for edit). Used in recipe form (admin only). */
export async function isSlugTakenAction(
  slug: string,
  excludeId?: string
): Promise<{ taken: boolean }> {
  try {
    const taken = await dbIsSlugTaken(slug, excludeId);
    return { taken };
  } catch (e) {
    console.error(e);
    return { taken: true };
  }
}
