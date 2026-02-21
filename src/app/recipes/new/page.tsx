"use client";

import { useRouter } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { saveRecipe } from "@/lib/store";
import type { Recipe } from "@/types/recipe";

export default function NewRecipePage() {
  const router = useRouter();

  const handleSave = (recipe: Recipe) => {
    saveRecipe(recipe);
    router.push(recipe.status === "published" ? `/recipes/${recipe.slug}` : "/drafts");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">创建食谱</h1>
      <RecipeForm onSave={handleSave} />
    </div>
  );
}
