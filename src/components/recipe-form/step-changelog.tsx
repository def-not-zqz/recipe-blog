"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RecipeFormState } from "./recipe-form-types";
import { Plus, Trash2 } from "lucide-react";

interface StepChangelogProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

export function StepChangelog({ state, onChange }: StepChangelogProps) {
  const changelog = state.changelog ?? [];

  const add = () => {
    onChange({ changelog: [...changelog, ""] });
  };

  const remove = (i: number) => {
    onChange({ changelog: changelog.filter((_, idx) => idx !== i) });
  };

  const update = (i: number, value: string) => {
    const next = [...changelog];
    next[i] = value;
    onChange({ changelog: next });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>更新记录 (可选)</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          按时间顺序记录食谱的修改说明，例如「2024-01 调整了烘烤温度」。
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {changelog.map((entry, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={entry}
                onChange={(e) => update(i, e.target.value)}
                placeholder={`更新记录 ${i + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(i)}
                aria-label="删除"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={add}
        >
          <Plus className="h-4 w-4" />
          添加更新记录
        </Button>
      </div>
    </div>
  );
}
