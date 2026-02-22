"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Recipe } from "@/types/recipe";
import { filterAndSortRecipes } from "@/lib/gallery";
import {
  GalleryToolbar,
  defaultFilters,
  type GalleryFilters,
} from "@/components/gallery-toolbar";
import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

function hasActiveFilters(f: GalleryFilters): boolean {
  return (
    f.search !== "" ||
    f.category !== "all" ||
    f.maxTimeMinutes !== null ||
    f.difficulty !== "all"
  );
}

export default function GalleryPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState<GalleryFilters>(defaultFilters);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/recipes")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Recipe[]) => {
        if (!cancelled) setRecipes(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setRecipes([]);
      })
      .finally(() => {
        if (!cancelled) setMounted(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAndSorted = useMemo(
    () => (mounted ? filterAndSortRecipes(recipes, filters) : []),
    [recipes, filters, mounted]
  );

  const activeFilters = hasActiveFilters(filters);

  const handleClearFilters = () => setFilters(defaultFilters);

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        加载中…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">食谱</h1>
        <Button asChild>
          <Link href="/recipes/new" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            创建食谱
          </Link>
        </Button>
      </div>

      <GalleryToolbar
        filters={filters}
        onFiltersChange={setFilters}
        hasActiveFilters={activeFilters}
        onClearFilters={handleClearFilters}
        resultCount={filteredAndSorted.length}
      />

      {recipes.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">还没有食谱，创建第一篇吧</p>
          <Button asChild>
            <Link href="/recipes/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              创建第一篇食谱
            </Link>
          </Button>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">没有匹配的食谱</p>
          <Button variant="outline" onClick={handleClearFilters}>
            清空筛选
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((recipe) => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
