"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RecipeFormState } from "./recipe-form-types";
import type { Ingredient } from "@/types/recipe";
import { Plus, Trash2 } from "lucide-react";

interface StepIngredientsProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

function updateIngredients(
  ingredients: Ingredient[],
  index: number,
  patch: Partial<Ingredient>
): Ingredient[] {
  const next = [...ingredients];
  next[index] = { ...next[index]!, ...patch };
  return next;
}

export function StepIngredients({ state, onChange }: StepIngredientsProps) {
  const { baseServings, ingredients } = state;

  const add = () => {
    onChange({ ingredients: [...ingredients, { name: "" }] });
  };

  const remove = (i: number) => {
    onChange({
      ingredients: ingredients.filter((_, idx) => idx !== i),
    });
  };

  const update = (i: number, patch: Partial<Ingredient>) => {
    onChange({
      ingredients: updateIngredients(ingredients, i, patch),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>基准份数 (人份)</Label>
        <Input
          type="number"
          min={1}
          max={99}
          value={baseServings}
          onChange={(e) =>
            onChange({ baseServings: Math.max(1, Number(e.target.value) || 1) })
          }
          className="mt-1 w-24"
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>原料</Label>
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus className="h-4 w-4" />
            添加
          </Button>
        </div>
        <ul className="mt-2 space-y-2">
          {ingredients.map((ing, i) => (
            <li
              key={i}
              className="flex flex-wrap items-center gap-2 rounded-md border border-border p-2"
            >
              <Input
                type="number"
                min={0}
                step={0.25}
                placeholder="量"
                value={ing.amount ?? ""}
                onChange={(e) =>
                  update(i, {
                    amount: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-20 shrink-0"
              />
              <Input
                placeholder="单位"
                value={ing.unit ?? ""}
                onChange={(e) => update(i, { unit: e.target.value || undefined })}
                className="w-24 shrink-0"
              />
              <Input
                placeholder="名称 *"
                value={ing.name}
                onChange={(e) => update(i, { name: e.target.value })}
                className="min-w-0 flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => remove(i)}
                aria-label="删除"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        {ingredients.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            暂无原料，点击「添加」添加一条。留空「量」表示适量等。
          </p>
        )}
      </div>
    </div>
  );
}
