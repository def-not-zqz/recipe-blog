"use client";

import { useState } from "react";
import Image from "next/image";
import type { RecipeFormState } from "./recipe-form-types";
import {
  ServingSelector,
  IngredientsList,
  NutritionBlock,
  RecipeMeta,
} from "@/components/recipe-detail";
import { StepsSectionView } from "@/components/recipe-detail/steps-section";
import { TipsSection } from "@/components/recipe-detail/tips-section";
import { NotesSection } from "@/components/recipe-detail/notes-section";
import { ChangelogSection } from "@/components/recipe-detail/changelog-section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Recipe } from "@/types/recipe";

/** Build a minimal Recipe from form state for preview rendering. */
function formStateToRecipe(state: RecipeFormState): Recipe {
  const now = new Date().toISOString();
  return {
    id: "preview",
    slug: "preview",
    title: state.title || "（未命名）",
    description: state.description ?? "",
    image: state.image,
    baseServings: state.baseServings,
    prepTimeMinutes: state.prepTimeMinutes,
    cookTimeMinutes: state.cookTimeMinutes,
    totalTimeMinutes:
      state.totalTimeMinutes ??
      (state.prepTimeMinutes ?? 0) + (state.cookTimeMinutes ?? 0),
    difficulty: state.difficulty,
    category: state.category,
    ingredients: state.ingredients,
    steps: state.steps,
    tips: state.tips?.length ? state.tips : undefined,
    changelog: state.changelog?.length ? state.changelog : undefined,
    notes: state.notes,
    nutrition: state.nutrition,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

interface RecipePreviewProps {
  state: RecipeFormState;
}

export function RecipePreview({ state }: RecipePreviewProps) {
  const [servings, setServings] = useState(state.baseServings);
  const recipe = formStateToRecipe(state);
  const scale = servings / state.baseServings;

  return (
    <Card>
      <CardHeader className="space-y-2">
        <h2 className="text-xl font-semibold">预览</h2>
        <RecipeMeta recipe={recipe} />
        <ServingSelector
          value={servings}
          onChange={setServings}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {state.title ? (
          <>
            {state.nutrition && Object.values(state.nutrition).some((v) => typeof v === "number") && (
              <NutritionBlock nutrition={state.nutrition} scale={scale} />
            )}

            <section aria-label="原料">
              <h2 className="mb-3 text-xl font-semibold">原料</h2>
              <IngredientsList ingredients={state.ingredients} scale={scale} />
            </section>

            <Separator />

            <StepsSectionView steps={state.steps} />

            <TipsSection tips={state.tips} />

            <NotesSection notes={state.notes} />

            <ChangelogSection changelog={state.changelog} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">填写基本信息后即可预览。</p>
        )}
      </CardContent>
    </Card>
  );
}
