"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RecipeFormState } from "./recipe-form-types";
import type { RecipeCategory, Difficulty } from "@/types/recipe";

const CATEGORIES: { value: RecipeCategory; label: string }[] = [
  { value: "main", label: "主菜" },
  { value: "dessert", label: "甜点" },
  { value: "soup", label: "汤" },
  { value: "salad", label: "沙拉" },
  { value: "snack", label: "小吃" },
  { value: "beverage", label: "饮品" },
  { value: "other", label: "其他" },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "困难" },
];

interface StepBasicProps {
  state: RecipeFormState;
  onChange: (updates: Partial<RecipeFormState>) => void;
}

export function StepBasic({ state, onChange }: StepBasicProps) {
  const total =
    state.totalTimeMinutes ??
    (state.prepTimeMinutes ?? 0) + (state.cookTimeMinutes ?? 0);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">标题 *</Label>
        <Input
          id="title"
          value={state.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="食谱名称"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">简介</Label>
        <Textarea
          id="description"
          value={state.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="简短描述"
          rows={3}
          className="mt-1"
        />
      </div>
      <div>
        <Label>主图 (URL 或上传)</Label>
        <div className="mt-1 flex gap-2">
          <Input
            value={state.image ?? ""}
            onChange={(e) => onChange({ image: e.target.value || undefined })}
            placeholder="图片 URL"
          />
          <label className="flex cursor-pointer items-center rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () =>
                    onChange({ image: reader.result as string });
                  reader.readAsDataURL(file);
                }
              }}
            />
            上传
          </label>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>分类</Label>
          <Select
            value={state.category ?? "other"}
            onValueChange={(v) => onChange({ category: v as RecipeFormState["category"] })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>难度</Label>
          <Select
            value={state.difficulty ?? ""}
            onValueChange={(v) =>
              onChange({ difficulty: (v || undefined) as RecipeFormState["difficulty"] })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="选择" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="prep">准备时间 (分钟)</Label>
          <Input
            id="prep"
            type="number"
            min={0}
            value={state.prepTimeMinutes ?? ""}
            onChange={(e) =>
              onChange({
                prepTimeMinutes: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cook">烹饪时间 (分钟)</Label>
          <Input
            id="cook"
            type="number"
            min={0}
            value={state.cookTimeMinutes ?? ""}
            onChange={(e) =>
              onChange({
                cookTimeMinutes: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="total">总时间 (分钟)</Label>
          <Input
            id="total"
            type="number"
            min={0}
            value={(state.totalTimeMinutes ?? total) || ""}
            onChange={(e) =>
              onChange({
                totalTimeMinutes: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            placeholder="可自动计算"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
