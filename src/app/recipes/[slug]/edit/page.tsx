"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { RecipeForm } from "@/components/recipe-form";
import { saveRecipeAction } from "@/app/actions/recipes";
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
    if (!slug) {
      setMounted(true);
      return;
    }
    let cancelled = false;
    fetch(`/api/recipes/slug/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (res.status === 404) return null;
        return res.ok ? res.json() : null;
      })
      .then((data: Recipe | null) => {
        if (!cancelled) setRecipe(data ?? undefined);
      })
      .catch(() => {
        if (!cancelled) setRecipe(undefined);
      })
      .finally(() => {
        if (!cancelled) setMounted(true);
      });
    return () => {
      cancelled = true;
    };
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

  const handleSave = async (updated: Recipe) => {
    try {
      const result = await saveRecipeAction(updated);
      if (result.success) {
        router.push(updated.status === "published" ? "/" : "/drafts");
      } else {
        console.error(result.error);
        alert("保存失败: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("保存失败: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleCancel = () => {
    router.push("/");
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
