export type Difficulty = "easy" | "medium" | "hard";

export type RecipeCategory =
  | "main"
  | "dessert"
  | "soup"
  | "salad"
  | "snack"
  | "beverage"
  | "other";

export type RecipeStatus = "draft" | "published";

export interface Ingredient {
  amount?: number;
  unit?: string;
  name: string;
}

export interface Step {
  content: string;
  image?: string;
}

export interface IngredientsSection {
  name?: string;
  items: Ingredient[];
}

export interface StepsSection {
  name?: string;
  items: Step[];
}

export interface Nutrition {
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  fiber?: number;
  sodium?: number;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  baseServings: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  totalTimeMinutes?: number;
  difficulty?: Difficulty;
  category?: RecipeCategory;
  ingredients: IngredientsSection[];
  steps: StepsSection[];
  tips?: string[];
  changelog?: string[];
  notes?: string;
  nutrition?: Nutrition;
  status: RecipeStatus;
  createdAt: string;
  updatedAt: string;
}
