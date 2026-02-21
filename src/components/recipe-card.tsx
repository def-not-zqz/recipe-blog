import Link from "next/link";
import Image from "next/image";
import type { Recipe } from "@/types/recipe";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
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

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const totalMinutes = recipe.totalTimeMinutes ?? (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  return (
    <Link href={`/recipes/${recipe.slug}`} className={cn("block", className)}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {recipe.image ? (
              recipe.image.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <span className="text-4xl">🍳</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-2 px-4 pt-4">
          <CardTitle className="line-clamp-2 text-lg">{recipe.title}</CardTitle>
          {recipe.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {recipe.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap items-center gap-2 px-4 pb-4">
          {totalMinutes > 0 && (
            <Badge variant="secondary" className="gap-1 font-normal">
              <Clock className="h-3 w-3" />
              {totalMinutes} 分钟
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1 font-normal">
            <Users className="h-3 w-3" />
            {recipe.baseServings} 人份
          </Badge>
          {recipe.difficulty && (
            <Badge variant="outline">
              {DIFFICULTY_LABELS[recipe.difficulty]}
            </Badge>
          )}
          {recipe.category && recipe.category !== "other" && (
            <Badge variant="outline">
              {CATEGORY_LABELS[recipe.category]}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
