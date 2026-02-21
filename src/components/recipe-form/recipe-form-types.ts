import type { Recipe, Ingredient, Step, Nutrition } from "@/types/recipe";

/** Editable form state for create/edit. Same as Recipe but id/slug/dates optional for new. */
export interface RecipeFormState {
  title: string;
  description: string;
  image?: string;
  baseServings: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  totalTimeMinutes?: number;
  difficulty?: Recipe["difficulty"];
  category?: Recipe["category"];
  ingredients: Ingredient[];
  steps: Step[];
  tips?: string[];
  notes?: string;
  nutrition?: Nutrition;
}

export const defaultFormState: RecipeFormState = {
  title: "",
  description: "",
  baseServings: 4,
  ingredients: [],
  steps: [],
};

export function recipeToFormState(recipe: Recipe): RecipeFormState {
  return {
    title: recipe.title,
    description: recipe.description,
    image: recipe.image,
    baseServings: recipe.baseServings,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    totalTimeMinutes: recipe.totalTimeMinutes,
    difficulty: recipe.difficulty,
    category: recipe.category,
    ingredients: recipe.ingredients.map((i) => ({ ...i })),
    steps: recipe.steps.map((s) => ({ ...s })),
    tips: recipe.tips?.length ? [...recipe.tips] : undefined,
    notes: recipe.notes,
    nutrition: recipe.nutrition
      ? { ...recipe.nutrition }
      : undefined,
  };
}
