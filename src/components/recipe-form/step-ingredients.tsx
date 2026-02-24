"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RecipeFormState } from "./recipe-form-types";
import type { Ingredient, IngredientsSection } from "@/types/recipe";
import { Plus, Trash2 } from "lucide-react";

interface StepIngredientsProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

function updateItems(
  items: Ingredient[],
  index: number,
  patch: Partial<Ingredient>
): Ingredient[] {
  const next = [...items];
  next[index] = { ...next[index]!, ...patch };
  return next;
}

export function StepIngredients({ state, onChange }: StepIngredientsProps) {
  const { baseServings, ingredients: sections } = state;

  const updateSection = (sectionIdx: number, patch: Partial<IngredientsSection>) => {
    const next = sections.map((sec, i) =>
      i === sectionIdx ? { ...sec, ...patch } : sec
    );
    onChange({ ingredients: next });
  };

  const updateSectionName = (sectionIdx: number, name: string) => {
    updateSection(sectionIdx, { name: name || undefined });
  };

  const updateItem = (
    sectionIdx: number,
    itemIdx: number,
    patch: Partial<Ingredient>
  ) => {
    const sec = sections[sectionIdx]!;
    updateSection(sectionIdx, {
      items: updateItems(sec.items, itemIdx, patch),
    });
  };

  const addItem = (sectionIdx: number) => {
    const sec = sections[sectionIdx]!;
    updateSection(sectionIdx, { items: [...sec.items, { name: "" }] });
  };

  const removeItem = (sectionIdx: number, itemIdx: number) => {
    const sec = sections[sectionIdx]!;
    updateSection(sectionIdx, {
      items: sec.items.filter((_, i) => i !== itemIdx),
    });
  };

  const addSection = () => {
    onChange({ ingredients: [...sections, { name: "", items: [] }] });
  };

  const removeSection = (sectionIdx: number) => {
    if (sections.length <= 1) return;
    onChange({
      ingredients: sections.filter((_, i) => i !== sectionIdx),
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
      <div className="space-y-4">
        <Label>原料</Label>
        {sections.map((section, sectionIdx) => (
          <div
            key={sectionIdx}
            className="rounded-md border border-border p-3 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Input
                placeholder="原料分组（选填）"
                value={section.name ?? ""}
                onChange={(e) =>
                  updateSectionName(sectionIdx, e.target.value)
                }
                className="flex-1"
              />
              {sections.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSection(sectionIdx)}
                  aria-label="删除分组"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <ul className="space-y-2">
              {section.items.map((ing, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-center gap-2 rounded border border-border/60 bg-muted/20 p-2"
                >
                  <Input
                    type="number"
                    min={0}
                    step={0.25}
                    placeholder="量"
                    value={ing.amount ?? ""}
                    onChange={(e) =>
                      updateItem(sectionIdx, i, {
                        amount: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-20 shrink-0"
                  />
                  <Input
                    placeholder="单位"
                    value={ing.unit ?? ""}
                    onChange={(e) =>
                      updateItem(sectionIdx, i, {
                        unit: e.target.value || undefined,
                      })
                    }
                    className="w-24 shrink-0"
                  />
                  <Input
                    placeholder="名称 *"
                    value={ing.name}
                    onChange={(e) =>
                      updateItem(sectionIdx, i, { name: e.target.value })
                    }
                    className="min-w-0 flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(sectionIdx, i)}
                    aria-label="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem(sectionIdx)}
              className="w-full"
            >
              <Plus className="h-4 w-4" />
              添加
            </Button>
            {section.items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                暂无原料，点击「添加」添加一条。留空「量」表示适量等。
              </p>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addSection}>
          <Plus className="h-4 w-4" />
          添加原料分组
        </Button>
      </div>
    </div>
  );
}
