"use client";

import type { Nutrition } from "@/types/recipe";
import { scaleNutrition } from "@/lib/format";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const NUTRITION_LABELS: Record<keyof Nutrition, string> = {
  calories: "总热量 (kcal)",
  protein: "蛋白质 (g)",
  carbs: "碳水 (g)",
  fat: "脂肪 (g)",
  fiber: "纤维 (g)",
  sodium: "钠 (mg)",
};

const NUTRITION_ORDER: readonly (keyof Nutrition)[] = [
  "calories",
  "protein",
  "carbs",
  "fat",
  "fiber",
  "sodium",
] as const;

interface NutritionBlockProps {
  nutrition: Nutrition;
  scale?: number;
  className?: string;
}

export function NutritionBlock({
  nutrition,
  scale = 1,
  className,
}: NutritionBlockProps) {
  const [open, setOpen] = useState(false);
  const scaled = scaleNutrition(nutrition, scale);
  const entries = NUTRITION_ORDER
    .map((key) => [key, scaled[key]] as [keyof Nutrition, number])
    .filter(([_, v]) => typeof v === "number" && !Number.isNaN(v));

  if (entries.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border bg-muted/50 px-4 py-3 text-left text-sm font-medium hover:bg-muted">
        营养成分
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-2 space-y-1.5 rounded-md border border-border bg-muted/30 px-4 py-3 text-sm">
          {entries.map(([key, value]) => (
            <li key={key} className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                {NUTRITION_LABELS[key]}
              </span>
              <span className="font-medium tabular-nums">{value}</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
