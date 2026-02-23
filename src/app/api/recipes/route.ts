import { NextResponse } from "next/server";
import { getPublishedRecipes, saveRecipe } from "@/lib/supabase/recipes";
import { isServerAdmin } from "@/lib/auth";
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

/** POST /api/recipes — create or update recipe (upsert). Admin only. */
export async function POST(request: Request) {
  try {
    const admin = await isServerAdmin();
    if (!admin) {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });
    }
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
