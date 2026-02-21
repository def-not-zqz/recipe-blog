import type { Recipe } from "@/types/recipe";

const STORAGE_KEY = "recipe-blog-recipes";

function readRecipes(): Recipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Recipe[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecipes(recipes: Recipe[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch {
    // ignore
  }
}

/** All recipes (published + draft). Use in client components only. */
export function getRecipes(): Recipe[] {
  return readRecipes();
}

/** Only published recipes (for Gallery). */
export function getPublishedRecipes(): Recipe[] {
  return readRecipes().filter((r) => r.status === "published");
}

/** Only draft recipes (for Drafts page). */
export function getDraftRecipes(): Recipe[] {
  return readRecipes().filter((r) => r.status === "draft");
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return readRecipes().find((r) => r.slug === slug);
}

export function getRecipeById(id: string): Recipe | undefined {
  return readRecipes().find((r) => r.id === id);
}

export function saveRecipe(recipe: Recipe): void {
  const recipes = readRecipes();
  const index = recipes.findIndex((r) => r.id === recipe.id);
  if (index >= 0) {
    recipes[index] = recipe;
  } else {
    recipes.push(recipe);
  }
  writeRecipes(recipes);
}

export function deleteRecipe(id: string): void {
  const recipes = readRecipes().filter((r) => r.id !== id);
  writeRecipes(recipes);
}

/** Check if a slug is already used by another recipe (optional excludeId for edit). */
export function isSlugTaken(slug: string, excludeId?: string): boolean {
  const existing = readRecipes().find((r) => r.slug === slug);
  if (!existing) return false;
  return existing.id !== excludeId;
}
