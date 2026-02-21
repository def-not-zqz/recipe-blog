"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RecipeFormState } from "./recipe-form-types";
import type { Step } from "@/types/recipe";
import { Plus, Trash2 } from "lucide-react";

interface StepStepsProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

export function StepSteps({ state, onChange }: StepStepsProps) {
  const { steps } = state;

  const add = () => {
    onChange({ steps: [...steps, { content: "" }] });
  };

  const remove = (i: number) => {
    onChange({ steps: steps.filter((_, idx) => idx !== i) });
  };

  const update = (i: number, patch: Partial<Step>) => {
    const next = [...steps];
    next[i] = { ...next[i]!, ...patch };
    onChange({ steps: next });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>步骤</Label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-4 w-4" />
          添加步骤
        </Button>
      </div>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li
            key={i}
            className="flex gap-2 rounded-md border border-border p-3"
          >
            <span className="flex h-9 shrink-0 items-center font-medium text-muted-foreground">
              {i + 1}.
            </span>
            <Textarea
              placeholder="步骤说明"
              value={step.content}
              onChange={(e) => update(i, { content: e.target.value })}
              rows={2}
              className="min-w-0 flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => remove(i)}
              aria-label="删除步骤"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ol>
      {steps.length === 0 && (
        <p className="text-sm text-muted-foreground">
          暂无步骤，点击「添加步骤」添加。
        </p>
      )}
    </div>
  );
}
