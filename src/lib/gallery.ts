import type { Recipe } from "@/types/recipe";
import type { GalleryFilters } from "@/components/gallery-toolbar";

function matchesSearch(recipe: Recipe, search: string): boolean {
  if (!search.trim()) return true;
  const q = search.trim().toLowerCase();
  const title = recipe.title.toLowerCase();
  const desc = (recipe.description ?? "").toLowerCase();
  const category = (recipe.category ?? "").toLowerCase();
  return title.includes(q) || desc.includes(q) || category.includes(q);
}

function matchesCategory(recipe: Recipe, category: Recipe["category"] | "all"): boolean {
  if (category === "all") return true;
  return recipe.category === category;
}

function matchesTime(recipe: Recipe, maxMinutes: number | null): boolean {
  if (maxMinutes === null) return true;
  const total = recipe.totalTimeMinutes ?? (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);
  return total > 0 && total <= maxMinutes;
}

function matchesDifficulty(recipe: Recipe, difficulty: Recipe["difficulty"] | "all"): boolean {
  if (difficulty === "all") return true;
  return recipe.difficulty === difficulty;
}

export function filterRecipes(recipes: Recipe[], filters: GalleryFilters): Recipe[] {
  return recipes.filter(
    (r) =>
      matchesSearch(r, filters.search) &&
      matchesCategory(r, filters.category) &&
      matchesTime(r, filters.maxTimeMinutes) &&
      matchesDifficulty(r, filters.difficulty)
  );
}

export function sortRecipes(recipes: Recipe[], sort: GalleryFilters["sort"]): Recipe[] {
  const list = [...recipes];
  switch (sort) {
    case "newest":
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return list.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "time-asc": {
      const total = (r: Recipe) =>
        r.totalTimeMinutes ?? (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0);
      return list.sort((a, b) => total(a) - total(b));
    }
    case "time-desc": {
      const total = (r: Recipe) =>
        r.totalTimeMinutes ?? (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0);
      return list.sort((a, b) => total(b) - total(a));
    }
    default:
      return list;
  }
}

export function filterAndSortRecipes(
  recipes: Recipe[],
  filters: GalleryFilters
): Recipe[] {
  const filtered = filterRecipes(recipes, filters);
  return sortRecipes(filtered, filters.sort);
}
