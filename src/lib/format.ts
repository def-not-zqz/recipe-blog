import type { Ingredient, Nutrition } from "@/types/recipe";

/**
 * Format amount for display (e.g. 0.5 -> "½", 1.5 -> "1½").
 * Falls back to rounded number for values that don't have a common fraction.
 */
export function formatAmount(value: number): string {
  if (Number.isInteger(value)) return String(value);
  const int = Math.floor(value);
  const frac = value - int;
  const fracStr =
    frac <= 0.34 ? "¼" : frac <= 0.34 + 0.33 ? "½" : frac <= 0.8 ? "¾" : null;
  if (fracStr) return int === 0 ? fracStr : `${int}${fracStr}`;
  return value.toFixed(1).replace(/\.0$/, "");
}

/**
 * Format a single ingredient line for display, with optional scale factor.
 */
export function formatIngredient(ing: Ingredient, scale: number = 1): string {
  if (ing.amount == null) {
    return [ing.unit, ing.name].filter(Boolean).join(" ") || ing.name;
  }
  const scaled = ing.amount * scale;
  const amountStr = formatAmount(scaled);
  const parts = [amountStr, ing.unit, ing.name].filter(Boolean);
  return parts.join(" ");
}

/**
 * Scale nutrition by factor (e.g. userServings / baseServings).
 */
export function scaleNutrition(
  nutrition: Nutrition,
  scale: number
): Record<keyof Nutrition, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(nutrition)) {
    if (typeof value === "number") {
      out[key] = Math.round(value * scale);
    }
  }
  return out as Record<keyof Nutrition, number>;
}
