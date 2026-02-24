"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RecipeFormState } from "./recipe-form-types";
import type { Step, StepsSection } from "@/types/recipe";
import { Plus, Trash2 } from "lucide-react";
import { resizeImageFileToDataUrl } from "@/lib/image-resize";

interface StepStepsProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
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
      {sections.map((section, sectionIdx) => (
        <div
          key={sectionIdx}
          className="rounded-md border border-border p-3 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Input
              placeholder="步骤分组（选填）"
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
          <ol className="space-y-3">
            {section.items.map((step, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-md border border-border/60 bg-muted/20 p-3"
              >
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
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded-md border border-border px-3 py-2 text-xs hover:bg-muted whitespace-nowrap">
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              // Limit step images to at most ~720p for bandwidth.
                              const dataUrl = await resizeImageFileToDataUrl(
                                file,
                                960,
                                720
                              );
                              updateItem(sectionIdx, i, {
                                image: dataUrl,
                              });
                            } catch {
                              // Fallback: if resize fails, keep previous image unchanged.
                            }
                          }}
                        />
                        上传图片
                      </label>
                    </div>
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
            ))}
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
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addSection}>
        <Plus className="h-4 w-4" />
        添加步骤分组
      </Button>
    </div>
  );
}
