import type { IngredientsSection } from "@/types/recipe";
import { formatIngredient } from "@/lib/format";
import { cn } from "@/lib/utils";

interface IngredientsListProps {
  /** Sections of ingredients (each may have an optional name). */
  ingredients: IngredientsSection[];
  scale?: number;
  className?: string;
}

export function IngredientsList({
  ingredients: sections,
  scale = 1,
  className,
}: IngredientsListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="space-y-1">
          {section.name?.trim() && (
            <h3 className="text-md font-semibold text-foreground">
              {section.name}
            </h3>
          )}
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            {section.items.map((ing, i) => (
              <li key={i} className="text-foreground">
                {formatIngredient(ing, scale)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
