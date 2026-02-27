"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StepBasic } from "./step-basic";
import { StepIngredients } from "./step-ingredients";
import { StepSteps } from "./step-steps";
import { StepTips } from "./step-tips";
import { StepChangelog } from "./step-changelog";
import { StepNutrition } from "./step-nutrition";
import { RecipePreview } from "./recipe-preview";
import {
  defaultFormState,
  recipeToFormState,
  type RecipeFormState,
} from "./recipe-form-types";
import type { Recipe } from "@/types/recipe";
import { slugify } from "@/lib/utils";
import { isSlugTakenAction } from "@/app/actions/recipes";

const STEPS = [
  { id: "basic", label: "基本信息" },
  { id: "ingredients", label: "原料" },
  { id: "steps", label: "步骤" },
  { id: "tips", label: "小贴士" },
  { id: "changelog", label: "更新记录" },
  { id: "nutrition", label: "营养" },
  { id: "preview", label: "预览" },
] as const;

interface RecipeFormProps {
  initialRecipe?: Recipe;
  onSave: (recipe: Recipe) => void | Promise<void>;
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
  const [saving, setSaving] = useState(false);

  // Stable recipeId for new recipe so upload paths are consistent before save
  useEffect(() => {
    if (!initialRecipe && !state.id) {
      setState((prev) => ({ ...prev, id: crypto.randomUUID() }));
    }
  }, [initialRecipe, state.id]);

  const update = useCallback((updates: Partial<RecipeFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const recipe = await formStateToRecipe(state, "draft", initialRecipe);
      await onSave(recipe);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePublish = async () => {
    setSaving(true);
    try {
      const recipe = await formStateToRecipe(state, "published", initialRecipe);
      await onSave(recipe);
    } finally {
      setSaving(false);
    }
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
          <StepBasic
            state={state}
            onChange={update}
            recipeId={state.id ?? initialRecipe?.id}
          />
        </TabsContent>
        <TabsContent value="ingredients" className="mt-4">
          <StepIngredients state={state} onChange={update} />
        </TabsContent>
        <TabsContent value="steps" className="mt-4">
          <StepSteps
            state={state}
            onChange={update}
            recipeId={state.id ?? initialRecipe?.id}
          />
        </TabsContent>
        <TabsContent value="tips" className="mt-4">
          <StepTips state={state} onChange={update} />
        </TabsContent>
        <TabsContent value="changelog" className="mt-4">
          <StepChangelog state={state} onChange={update} />
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
        <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={saving}>
          {saving ? "保存中…" : "存为草稿"}
        </Button>
        <Button type="button" onClick={handleSavePublish} disabled={saving}>
          {saving ? "发布中…" : "发布"}
        </Button>
      </div>
    </div>
  );
}

async function formStateToRecipe(
  state: RecipeFormState,
  status: Recipe["status"],
  existing?: Recipe
): Promise<Recipe> {
  const now = new Date().toISOString();
  const id = state.id ?? existing?.id ?? crypto.randomUUID();
  let finalSlug: string;
  if (existing) {
    finalSlug = existing.slug;
  } else {
    const baseSlug = slugify(state.title) || "recipe";
    finalSlug = baseSlug;
    let counter = 0;
    while ((await isSlugTakenAction(finalSlug, id)).taken) {
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
    changelog: state.changelog?.length ? state.changelog : undefined,
    notes: state.notes,
    nutrition: state.nutrition,
    status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
