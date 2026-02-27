import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getPublishedRecipes, saveRecipe } from "@/lib/supabase/recipes";
import {
  uploadRecipeImages,
  StepImageTooLargeError,
} from "@/lib/supabase/recipe-images";
import { isServerAdmin } from "@/lib/auth";
import type { Recipe } from "@/types/recipe";

const CACHE_REVALIDATE_SECONDS = 60;

/** GET /api/recipes — published recipes for gallery (cached, ISR) */
export async function GET() {
  try {
    const recipes = await unstable_cache(
      getPublishedRecipes,
      ["recipes-published"],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )();
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
    const recipeWithUrls = await uploadRecipeImages(body);
    await saveRecipe(recipeWithUrls);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof StepImageTooLargeError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}
