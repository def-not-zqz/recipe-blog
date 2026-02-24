import type {
  Recipe,
  IngredientsSection,
  StepsSection,
  Nutrition,
} from "@/types/recipe";

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
  ingredients: IngredientsSection[];
  steps: StepsSection[];
  tips?: string[];
  changelog?: string[];
  notes?: string;
  nutrition?: Nutrition;
}

export const defaultFormState: RecipeFormState = {
  title: "",
  description: "",
  baseServings: 4,
  ingredients: [{ items: [] }],
  steps: [{ items: [] }],
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
    ingredients: recipe.ingredients.map((sec) => ({
      name: sec.name,
      items: sec.items.map((i) => ({ ...i })),
    })),
    steps: recipe.steps.map((sec) => ({
      name: sec.name,
      items: sec.items.map((s) => ({ ...s })),
    })),
    tips: recipe.tips?.length ? [...recipe.tips] : undefined,
    changelog: recipe.changelog?.length ? [...recipe.changelog] : undefined,
    notes: recipe.notes,
    nutrition: recipe.nutrition
      ? { ...recipe.nutrition }
      : undefined,
  };
}
