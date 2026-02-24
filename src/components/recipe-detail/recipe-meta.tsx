import type { Recipe } from "@/types/recipe";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

const DIFFICULTY_LABELS: Record<NonNullable<Recipe["difficulty"]>, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

const CATEGORY_LABELS: Record<NonNullable<Recipe["category"]>, string> = {
  main: "主菜",
  dessert: "甜点",
  soup: "汤",
  salad: "沙拉",
  snack: "小吃",
  beverage: "饮品",
  other: "其他",
};

interface RecipeMetaProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeMeta({ recipe, className }: RecipeMetaProps) {
  const totalMinutes =
    recipe.totalTimeMinutes ??
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2 text-sm", className)}
      aria-label="食谱信息"
    >
      <Badge variant="secondary" className="gap-1 font-normal">
        <Users className="h-3.5 w-3" />
        {recipe.baseServings} 人份
      </Badge>
      {totalMinutes > 0 && (
        <Badge variant="secondary" className="gap-1 font-normal">
          <Clock className="h-3.5 w-3" />
          {totalMinutes} 分钟
        </Badge>
      )}
      {recipe.category && (
        <Badge variant="outline" className="font-normal">
          {CATEGORY_LABELS[recipe.category]}
        </Badge>
      )}
      {recipe.difficulty && (
        <Badge variant="outline" className="gap-1 font-normal">
          <ChefHat className="h-3.5 w-3" />
          {DIFFICULTY_LABELS[recipe.difficulty]}
        </Badge>
      )}
    </div>
  );
}
