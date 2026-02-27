"use client";

import { useRouter } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { saveRecipeViaApi } from "@/lib/api/recipes";
import type { Recipe } from "@/types/recipe";

export default function NewRecipePage() {
  const router = useRouter();

  const handleSave = async (recipe: Recipe) => {
    try {
      const result = await saveRecipeViaApi(recipe);
      if (result.success) {
        router.push(recipe.status === "published" ? "/" : "/drafts");
      } else {
        console.error(result.error);
        alert("保存失败: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("保存失败: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">创建食谱</h1>
      <RecipeForm onSave={handleSave} />
    </div>
  );
}
