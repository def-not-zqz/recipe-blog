"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { RecipeForm } from "@/components/recipe-form";
import { getRecipeBySlug, saveRecipe } from "@/lib/store";
import type { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const r = getRecipeBySlug(slug);
    setRecipe(r);
    setMounted(true);
  }, [slug]);

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        加载中…
      </div>
    );
  }

  if (!recipe) {
    notFound();
  }

  const handleSave = (updated: Recipe) => {
    saveRecipe(updated);
    router.push(`/recipes/${updated.slug}`);
  };

  const handleCancel = () => {
    router.push(`/recipes/${slug}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/recipes/${slug}`} aria-label="返回">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">编辑食谱</h1>
      </div>
      <RecipeForm
        initialRecipe={recipe}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
