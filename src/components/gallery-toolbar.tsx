"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { RecipeCategory, Difficulty } from "@/types/recipe";

const CATEGORY_OPTIONS: { value: RecipeCategory | "all"; label: string }[] = [
  { value: "all", label: "全部分类" },
  { value: "main", label: "主菜" },
  { value: "dessert", label: "甜点" },
  { value: "soup", label: "汤" },
  { value: "salad", label: "沙拉" },
  { value: "snack", label: "小吃" },
  { value: "beverage", label: "饮品" },
  { value: "other", label: "其他" },
];

const TIME_OPTIONS = [
  { value: "all", label: "全部时间" },
  { value: "30", label: "30 分钟内" },
  { value: "60", label: "1 小时内" },
  { value: "120", label: "2 小时内" },
] as const;

const DIFFICULTY_OPTIONS: { value: Difficulty | "all"; label: string }[] = [
  { value: "all", label: "全部难度" },
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "困难" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "最新" },
  { value: "oldest", label: "最久" },
  { value: "time-asc", label: "时间从短到长" },
  { value: "time-desc", label: "时间从长到短" },
] as const;

export interface GalleryFilters {
  search: string;
  category: RecipeCategory | "all";
  maxTimeMinutes: number | null;
  difficulty: Difficulty | "all";
  sort: (typeof SORT_OPTIONS)[number]["value"];
}

const defaultFilters: GalleryFilters = {
  search: "",
  category: "all",
  maxTimeMinutes: null,
  difficulty: "all",
  sort: "newest",
};

interface GalleryToolbarProps {
  filters: GalleryFilters;
  onFiltersChange: (f: GalleryFilters) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  resultCount?: number;
}

export function GalleryToolbar({
  filters,
  onFiltersChange,
  hasActiveFilters,
  onClearFilters,
  resultCount,
}: GalleryToolbarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onFiltersChange({ ...filters, search: searchInput.trim() });
    },
    [filters, searchInput, onFiltersChange]
  );

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索食谱..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
            aria-label="搜索"
          />
        </div>
        <Button type="submit" variant="secondary">
          搜索
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.category}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              category: v as GalleryFilters["category"],
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="分类" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            filters.maxTimeMinutes === null
              ? "all"
              : String(filters.maxTimeMinutes)
          }
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              maxTimeMinutes: v === "all" ? null : Number(v),
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="时间" />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.difficulty}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              difficulty: v as GalleryFilters["difficulty"],
            })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="难度" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sort}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              sort: v as GalleryFilters["sort"],
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            清空筛选
          </Button>
        )}
      </div>

      {resultCount !== undefined && (
        <p className="text-sm text-muted-foreground">
          共 {resultCount} 道食谱
        </p>
      )}
    </div>
  );
}

export { defaultFilters };
