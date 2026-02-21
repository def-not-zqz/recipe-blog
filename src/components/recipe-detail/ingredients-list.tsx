import type { Ingredient } from "@/types/recipe";
import { formatIngredient } from "@/lib/format";
import { cn } from "@/lib/utils";

interface IngredientsListProps {
  ingredients: Ingredient[];
  scale?: number;
  className?: string;
}

export function IngredientsList({
  ingredients,
  scale = 1,
  className,
}: IngredientsListProps) {
  return (
    <ul className={cn("list-inside list-disc space-y-1 text-muted-foreground", className)}>
      {ingredients.map((ing, i) => (
        <li key={i} className="text-foreground">
          {formatIngredient(ing, scale)}
        </li>
      ))}
    </ul>
  );
}
