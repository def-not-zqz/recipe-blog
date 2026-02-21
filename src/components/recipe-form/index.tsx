"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StepBasic } from "./step-basic";
import { StepIngredients } from "./step-ingredients";
import { StepSteps } from "./step-steps";
import { StepTips } from "./step-tips";
import { StepNutrition } from "./step-nutrition";
import { RecipePreview } from "./recipe-preview";
import {
  defaultFormState,
  recipeToFormState,
  type RecipeFormState,
} from "./recipe-form-types";
import type { Recipe } from "@/types/recipe";
import { slugify } from "@/lib/utils";
import { isSlugTaken } from "@/lib/store";

const STEPS = [
  { id: "basic", label: "基本信息" },
  { id: "ingredients", label: "原料" },
  { id: "steps", label: "步骤" },
  { id: "tips", label: "小贴士" },
  { id: "nutrition", label: "营养" },
  { id: "preview", label: "预览" },
] as const;

interface RecipeFormProps {
  initialRecipe?: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel?: () => void;
}

export function RecipeForm({
  initialRecipe,
  onSave,
  onCancel,
}: RecipeFormProps) {
  const [state, setState] = useState<RecipeFormState>(
    initialRecipe ? recipeToFormState(initialRecipe) : defaultFormState
  );
  const [activeStep, setActiveStep] = useState(0);

  const update = useCallback((updates: Partial<RecipeFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSaveDraft = () => {
    const recipe = formStateToRecipe(state, "draft", initialRecipe);
    onSave(recipe);
  };

  const handleSavePublish = () => {
    const recipe = formStateToRecipe(state, "published", initialRecipe);
    onSave(recipe);
  };

  const stepId = STEPS[activeStep]?.id ?? "basic";

  return (
    <div className="space-y-6">
      <Tabs
        value={stepId}
        onValueChange={(v) => {
          const idx = STEPS.findIndex((s) => s.id === v);
          if (idx >= 0) setActiveStep(idx);
        }}
      >
        <TabsList className="flex w-full flex-wrap gap-1">
          {STEPS.map((s, i) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="flex-1 min-w-0 sm:flex-none"
            >
              {i + 1}. {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <StepBasic state={state} onChange={update} />
        </TabsContent>
        <TabsContent value="ingredients" className="mt-4">
          <StepIngredients state={state} onChange={update} />
        </TabsContent>
        <TabsContent value="steps" className="mt-4">
          <StepSteps state={state} onChange={update} />
        </TabsContent>
        <TabsContent value="tips" className="mt-4">
          <StepTips state={state} onChange={update} />
        </TabsContent>
        <TabsContent value="nutrition" className="mt-4">
          <StepNutrition state={state} onChange={update} />
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <RecipePreview state={state} />
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
        )}
        <Button type="button" variant="outline" onClick={handleSaveDraft}>
          存为草稿
        </Button>
        <Button type="button" onClick={handleSavePublish}>
          发布
        </Button>
      </div>
    </div>
  );
}

function formStateToRecipe(
  state: RecipeFormState,
  status: Recipe["status"],
  existing?: Recipe
): Recipe {
  const now = new Date().toISOString();
  const id = existing?.id ?? crypto.randomUUID();
  let finalSlug: string;
  if (existing) {
    finalSlug = existing.slug;
  } else {
    const baseSlug = slugify(state.title) || "recipe";
    finalSlug = baseSlug;
    let counter = 0;
    while (isSlugTaken(finalSlug, id)) {
      counter += 1;
      finalSlug = `${baseSlug}-${counter}`;
    }
  }

  return {
    id,
    slug: finalSlug,
    title: state.title || "未命名食谱",
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
    notes: state.notes,
    nutrition: state.nutrition,
    status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
