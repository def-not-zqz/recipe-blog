import { NextResponse } from "next/server";
import { getPublishedRecipes, saveRecipe } from "@/lib/supabase/recipes";
import type { Recipe } from "@/types/recipe";

/** GET /api/recipes — published recipes for gallery */
export async function GET() {
  try {
    const recipes = await getPublishedRecipes();
    return NextResponse.json(recipes);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

/** POST /api/recipes — create or update recipe (upsert) */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Recipe;
    await saveRecipe(body);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}
