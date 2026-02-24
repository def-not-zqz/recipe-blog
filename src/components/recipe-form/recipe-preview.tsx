"use client";

import { useState } from "react";
import type { RecipeFormState } from "./recipe-form-types";
import {
  ServingSelector,
  IngredientsList,
  NutritionBlock,
  RecipeMeta,
} from "@/components/recipe-detail";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      <CardContent className="space-y-4">
        {state.title && (
          <>
            <section>
              <h3 className="mb-2 font-medium">原料</h3>
              <IngredientsList ingredients={state.ingredients} scale={scale} />
            </section>
            {state.steps.length > 0 && (
              <section>
                <h3 className="mb-2 font-medium">步骤</h3>
                <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                  {state.steps.map((s, i) => (
                    <li key={i} className="text-foreground">{s.content}</li>
                  ))}
                </ol>
              </section>
            )}
            {(state.changelog?.length ?? 0) > 0 && (
              <section>
                <h3 className="mb-2 font-medium">更新记录</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {state.changelog!.map((entry, i) => (
                    <li key={i} className="text-foreground">{entry}</li>
                  ))}
                </ul>
              </section>
            )}
            {state.nutrition && Object.values(state.nutrition).some((v) => typeof v === "number") && (
              <NutritionBlock nutrition={state.nutrition} scale={scale} />
            )}
          </>
        )}
        {!state.title && (
          <p className="text-sm text-muted-foreground">填写基本信息后即可预览。</p>
        )}
      </CardContent>
    </Card>
  );
}
