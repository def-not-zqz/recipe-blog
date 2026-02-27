"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RecipeFormState } from "./recipe-form-types";
import type { Step, StepsSection } from "@/types/recipe";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { resizeImageFileToDataUrl } from "@/lib/image-resize";
import {
  SortableList,
  type SortableItemData,
} from "./dnd/sortable-list";

interface StepStepsProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

interface SectionItem extends SortableItemData {
  section: StepsSection;
}

interface StepItem extends SortableItemData {
  step: Step;
}

export function StepSteps({ state, onChange }: StepStepsProps) {
  const { steps: sections } = state;

  const updateSection = (sectionIdx: number, patch: Partial<StepsSection>) => {
    const next = sections.map((sec, i) =>
      i === sectionIdx ? { ...sec, ...patch } : sec
    );
    onChange({ steps: next });
  };

  const updateSectionName = (sectionIdx: number, name: string) => {
    updateSection(sectionIdx, { name: name || undefined });
  };

  const updateItem = (sectionIdx: number, itemIdx: number, patch: Partial<Step>) => {
    const sec = sections[sectionIdx]!;
    const next = [...sec.items];
    next[itemIdx] = { ...next[itemIdx]!, ...patch };
    updateSection(sectionIdx, { items: next });
  };

  const addItem = (sectionIdx: number) => {
    const sec = sections[sectionIdx]!;
    updateSection(sectionIdx, { items: [...sec.items, { content: "" }] });
  };

  const removeItem = (sectionIdx: number, itemIdx: number) => {
    const sec = sections[sectionIdx]!;
    updateSection(sectionIdx, {
      items: sec.items.filter((_, i) => i !== itemIdx),
    });
  };

  const addSection = () => {
    onChange({ steps: [...sections, { name: "", items: [] }] });
  };

  const removeSection = (sectionIdx: number) => {
    if (sections.length <= 1) return;
    onChange({
      steps: sections.filter((_, i) => i !== sectionIdx),
    });
  };

  return (
    <div className="space-y-4">
      <Label>步骤</Label>
      <SortableList<SectionItem>
        items={sections.map((section, index) => ({
          id: String(index),
          section,
        }))}
        onReorder={(items) =>
          onChange({
            steps: items.map((item) => item.section),
          })
        }
        renderItem={(item, sortable, sectionIdx) => {
          const { section } = item;
          return (
            <div className="space-y-3 rounded-md border border-border bg-background p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:border-border hover:bg-muted"
                  aria-label="拖动调整步骤分组顺序"
                  {...sortable.attributes}
                  {...sortable.listeners}
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                <Input
                  placeholder="步骤分组（选填）"
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
              <ol className="space-y-3">
                <SortableList<StepItem>
                  items={section.items.map((step, i) => ({
                    id: `${sectionIdx}-${i}`,
                    step,
                  }))}
                  onReorder={(items) =>
                    updateSection(sectionIdx, {
                      items: items.map((it) => it.step),
                    })
                  }
                  renderItem={(item, innerSortable, i) => {
                    const step = item.step;
                    const hasImage = !!step.image;
                    return (
                      <li className="flex gap-2 rounded-md border border-border/60 bg-muted/20 p-3">
                        <button
                          type="button"
                          className="mt-1 flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:border-border hover:bg-muted"
                          aria-label="拖动调整步骤顺序"
                          {...innerSortable.attributes}
                          {...innerSortable.listeners}
                        >
                          <GripVertical className="h-3 w-3" />
                        </button>
                        <span className="flex h-9 shrink-0 items-center font-medium text-muted-foreground">
                          {i + 1}.
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <Textarea
                            placeholder="步骤说明*"
                            value={step.content}
                            onChange={(e) =>
                              updateItem(sectionIdx, i, { content: e.target.value })
                            }
                            rows={2}
                            className="min-w-0"
                          />
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="inline-flex cursor-pointer items-center rounded-md border border-border px-3 py-2 text-xs hover:bg-muted whitespace-nowrap">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      const dataUrl =
                                        await resizeImageFileToDataUrl(
                                          file,
                                          960,
                                          720
                                        );
                                      updateItem(sectionIdx, i, {
                                        image: dataUrl,
                                      });
                                    } catch {
                                      // keep previous image if resize fails
                                    }
                                  }}
                                />
                                上传图片
                              </label>
                              {hasImage && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateItem(sectionIdx, i, { image: undefined })
                                  }
                                >
                                  移除图片
                                </Button>
                              )}
                            </div>
                            {hasImage && (
                              <div className="flex items-center gap-3">
                                <div className="relative h-24 w-40 overflow-hidden rounded-md border border-border bg-background">
                                  <img
                                    src={step.image}
                                    alt="步骤图片预览"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => removeItem(sectionIdx, i)}
                          aria-label="删除步骤"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    );
                  }}
                />
              </ol>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem(sectionIdx)}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                添加步骤
              </Button>
              {section.items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  暂无步骤，点击「添加步骤」添加。
                </p>
              )}
            </div>
          );
        }}
      />
      <Button type="button" variant="outline" size="sm" onClick={addSection}>
        <Plus className="h-4 w-4" />
        添加步骤分组
      </Button>
    </div>
  );
}
