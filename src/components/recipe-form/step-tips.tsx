"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RecipeFormState } from "./recipe-form-types";
import { Plus, Trash2 } from "lucide-react";

interface StepTipsProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

export function StepTips({ state, onChange }: StepTipsProps) {
  const tips = state.tips ?? [];

  const add = () => {
    onChange({ tips: [...tips, ""] });
  };

  const remove = (i: number) => {
    onChange({ tips: tips.filter((_, idx) => idx !== i) });
  };

  const update = (i: number, value: string) => {
    const next = [...tips];
    next[i] = value;
    onChange({ tips: next });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>小贴士 (可选)</Label>
        <div className="mt-2 flex flex-col gap-2">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={tip}
                onChange={(e) => update(i, e.target.value)}
                placeholder={`小贴士 ${i + 1}`}
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
          添加小贴士
        </Button>
      </div>
      <div>
        <Label htmlFor="notes">额外说明 (可选)</Label>
        <Textarea
          id="notes"
          value={state.notes ?? ""}
          onChange={(e) => onChange({ notes: e.target.value || undefined })}
          placeholder="其他说明"
          rows={4}
          className="mt-1"
        />
      </div>
    </div>
  );
}
