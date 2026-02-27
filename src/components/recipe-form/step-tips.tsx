"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RecipeFormState } from "./recipe-form-types";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import {
  SortableList,
  type SortableItemData,
} from "./dnd/sortable-list";

interface StepTipsProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

interface TipItem extends SortableItemData {
  value: string;
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
          <SortableList<TipItem>
            items={tips.map((tip, index) => ({
              id: String(index),
              value: tip,
            }))}
            onReorder={(items) =>
              onChange({
                tips: items.map((it) => it.value),
              })
            }
            renderItem={(item, sortable, i) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:border-border hover:bg-muted"
                  aria-label="拖动调整小贴士顺序"
                  {...sortable.attributes}
                  {...sortable.listeners}
                >
                  <GripVertical className="h-3 w-3" />
                </button>
                <Input
                  value={item.value}
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
            )}
          />
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
