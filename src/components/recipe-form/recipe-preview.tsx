"use client";

import { useState } from "react";
import type { RecipeFormState } from "./recipe-form-types";
import {
  ServingSelector,
  IngredientsList,
  NutritionBlock,
  RecipeMeta,
  MarkdownContent,
} from "@/components/recipe-detail";
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

            <section aria-label="步骤">
              <h2 className="mb-3 text-xl font-semibold">步骤</h2>
              <div className="space-y-4">
                {state.steps.map((sec, sectionIdx) => (
                  <div key={sectionIdx} className="space-y-2">
                    {sec.name?.trim() && (
                      <h3 className="text-sm font-medium text-foreground">
                        {sec.name}
                      </h3>
                    )}
                    <ol className="list-inside list-decimal space-y-4 text-muted-foreground">
                      {sec.items.map((step, i) => (
                        <li key={i} className="pl-2 text-foreground">
                          <MarkdownContent inline>{step.content}</MarkdownContent>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>

            {(state.tips?.length ?? 0) > 0 && (
              <>
                <Separator />
                <section aria-label="小贴士">
                  <h2 className="mb-3 text-xl font-semibold">小贴士</h2>
                  <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                    {state.tips!.map((tip, i) => (
                      <li key={i} className="text-foreground">
                        <MarkdownContent inline>{tip}</MarkdownContent>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {state.notes && (
              <>
                <Separator />
                <section aria-label="说明">
                  <h2 className="mb-3 text-xl font-semibold">说明</h2>
                  <div className="text-muted-foreground whitespace-pre-wrap">
                    <MarkdownContent>{state.notes}</MarkdownContent>
                  </div>
                </section>
              </>
            )}

            {(state.changelog?.length ?? 0) > 0 && (
              <>
                <Separator />
                <section aria-label="更新记录">
                  <h2 className="mb-3 text-xl font-semibold">更新记录</h2>
                  <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                    {state.changelog!.map((entry, i) => (
                      <li key={i} className="text-foreground">
                        <MarkdownContent inline>{entry}</MarkdownContent>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">填写基本信息后即可预览。</p>
        )}
      </CardContent>
    </Card>
  );
}
