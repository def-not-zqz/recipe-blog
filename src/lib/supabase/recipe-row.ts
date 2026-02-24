import type {
  Recipe,
  IngredientsSection,
  StepsSection,
} from "@/types/recipe";

function isLegacyIngredientArray(arr: unknown): arr is { name: string }[] {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  const first = arr[0];
  return (
    first != null &&
    typeof first === "object" &&
    "name" in first &&
    typeof (first as { name: unknown }).name === "string" &&
    !("items" in first)
  );
}

function isLegacyStepsArray(arr: unknown): arr is { content: string }[] {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  const first = arr[0];
  return (
    first != null &&
    typeof first === "object" &&
    "content" in first &&
    !("items" in first)
  );
}

function normalizeIngredientsJson(raw: unknown): IngredientsSection[] {
  if (isLegacyIngredientArray(raw)) return [{ items: raw }];
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];
    if (
      first != null &&
      typeof first === "object" &&
      "items" in first &&
      Array.isArray((first as { items: unknown }).items)
    ) {
      return raw as IngredientsSection[];
    }
  }
  return [{ items: [] }];
}

function normalizeStepsJson(raw: unknown): StepsSection[] {
  if (isLegacyStepsArray(raw)) return [{ items: raw }];
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];
    if (
      first != null &&
      typeof first === "object" &&
      "items" in first &&
      Array.isArray((first as { items: unknown }).items)
    ) {
      return raw as StepsSection[];
    }
  }
  return [{ items: [] }];
}

/** DB row shape for public.recipes (snake_case). */
export interface RecipeRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  base_servings: number;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  total_time_minutes: number | null;
  difficulty: string | null;
  category: string | null;
  status: string;
  ingredients_json: unknown;
  steps_json: unknown;
  tips_json: unknown;
  changelog_json: unknown;
  nutrition_json: unknown;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function rowToRecipe(row: RecipeRow): Recipe {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image_url ?? undefined,
    baseServings: row.base_servings,
    prepTimeMinutes: row.prep_time_minutes ?? undefined,
    cookTimeMinutes: row.cook_time_minutes ?? undefined,
    totalTimeMinutes: row.total_time_minutes ?? undefined,
    difficulty: (row.difficulty as Recipe["difficulty"]) ?? undefined,
    category: (row.category as Recipe["category"]) ?? undefined,
    status: row.status as Recipe["status"],
    ingredients: normalizeIngredientsJson(row.ingredients_json),
    steps: normalizeStepsJson(row.steps_json),
    tips: Array.isArray(row.tips_json) ? (row.tips_json as string[]) : undefined,
    changelog: Array.isArray(row.changelog_json) ? (row.changelog_json as string[]) : undefined,
    notes: row.notes ?? undefined,
    nutrition: row.nutrition_json && typeof row.nutrition_json === "object" && !Array.isArray(row.nutrition_json)
      ? (row.nutrition_json as Recipe["nutrition"])
      : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function recipeToRow(recipe: Recipe): Omit<RecipeRow, "created_at" | "updated_at"> {
  return {
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    description: recipe.description,
    image_url: recipe.image ?? null,
    base_servings: recipe.baseServings,
    prep_time_minutes: recipe.prepTimeMinutes ?? null,
    cook_time_minutes: recipe.cookTimeMinutes ?? null,
    total_time_minutes: recipe.totalTimeMinutes ?? null,
    difficulty: recipe.difficulty ?? null,
    category: recipe.category ?? null,
    status: recipe.status,
    ingredients_json: recipe.ingredients ?? [],
    steps_json: recipe.steps ?? [],
    tips_json: recipe.tips ?? [],
    changelog_json: recipe.changelog ?? [],
    nutrition_json: recipe.nutrition ?? null,
    notes: recipe.notes ?? null,
  };
}
