"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { RecipeFormState } from "./recipe-form-types";
import type { Ingredient, IngredientsSection } from "@/types/recipe";
import {
  SortableList,
  type SortableItemData,
  type SortableRenderProps,
} from "./dnd/sortable-list";

interface StepIngredientsProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

interface SectionItem extends SortableItemData {
  section: IngredientsSection;
}

interface IngredientItem extends SortableItemData {
  ingredient: Ingredient;
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
        <SortableList<SectionItem>
          items={sections.map((section, index) => ({
            id: String(index),
            section,
          }))}
          onReorder={(items) =>
            onChange({
              ingredients: items.map((item) => item.section),
            })
          }
          renderItem={(item, sortable, sectionIdx) => {
            const { section } = item;
            return (
              <div
                className="space-y-2 rounded-md border border-border bg-background p-3"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:border-border hover:bg-muted"
                    aria-label="拖动调整原料分组顺序"
                    {...sortable.attributes}
                    {...sortable.listeners}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <Input
                    placeholder="原料分组（选填）"
                    value={section.name ?? ""}
                    onChange={(e) => updateSectionName(sectionIdx, e.target.value)}
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
                  <SortableList<IngredientItem>
                    items={section.items.map((ing, i) => ({
                      id: `${sectionIdx}-${i}`,
                      ingredient: ing,
                    }))}
                    onReorder={(items) =>
                      updateSection(sectionIdx, {
                        items: items.map((it) => it.ingredient),
                      })
                    }
                    renderItem={(item, innerSortable, i) => (
                      <li
                        className="flex flex-wrap items-center gap-2 rounded border border-border/60 bg-muted/20 p-2"
                      >
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:border-border hover:bg-muted"
                          aria-label="拖动调整原料顺序"
                          {...innerSortable.attributes}
                          {...innerSortable.listeners}
                        >
                          <GripVertical className="h-3 w-3" />
                        </button>
                        <Input
                          type="number"
                          min={0}
                          step={0.25}
                          placeholder="量"
                          value={item.ingredient.amount ?? ""}
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
                          value={item.ingredient.unit ?? ""}
                          onChange={(e) =>
                            updateItem(sectionIdx, i, {
                              unit: e.target.value || undefined,
                            })
                          }
                          className="w-24 shrink-0"
                        />
                        <Input
                          placeholder="名称 *"
                          value={item.ingredient.name}
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
                    )}
                  />
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
            );
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={addSection}>
          <Plus className="h-4 w-4" />
          添加原料分组
        </Button>
      </div>
    </div>
  );
}
