import type { Recipe } from "@/types/recipe";

export type SaveRecipeResult =
  | { success: true }
  | { success: false; error: string };

/** Save recipe via POST /api/recipes (body is small when images are already URLs). */
export async function saveRecipeViaApi(
  recipe: Recipe
): Promise<SaveRecipeResult> {
  try {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(recipe),
    });
    if (res.ok) return { success: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { success: false, error: data.error ?? res.statusText };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
