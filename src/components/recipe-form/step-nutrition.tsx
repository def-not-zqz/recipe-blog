"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RecipeFormState } from "./recipe-form-types";
import type { Nutrition } from "@/types/recipe";

const FIELDS: { key: keyof Nutrition; label: string; unit: string }[] = [
  { key: "calories", label: "热量", unit: "kcal" },
  { key: "protein", label: "蛋白质", unit: "g" },
  { key: "fat", label: "脂肪", unit: "g" },
  { key: "carbs", label: "碳水", unit: "g" },
  { key: "fiber", label: "纤维", unit: "g" },
  { key: "sodium", label: "钠", unit: "mg" },
];

interface StepNutritionProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

export function StepNutrition({ state, onChange }: StepNutritionProps) {
  const nutrition = state.nutrition ?? {} as Nutrition;

  const update = (key: keyof Nutrition, value: string) => {
    const num = value ? Number(value) : undefined;
    onChange({
      nutrition: { ...nutrition, [key]: num },
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        营养数据为「每 {state.baseServings} 人份」的总量，展示时会按份数自动换算。
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, unit }) => (
          <div key={key}>
            <Label htmlFor={key}>
              {label} ({unit})
            </Label>
            <Input
              id={key}
              type="number"
              min={0}
              value={nutrition[key] ?? ""}
              onChange={(e) => update(key, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
