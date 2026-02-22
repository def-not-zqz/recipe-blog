import { NextResponse } from "next/server";
import { getDraftRecipes } from "@/lib/supabase/recipes";

/** GET /api/recipes/drafts — draft recipes (admin list) */
export async function GET() {
  try {
    const recipes = await getDraftRecipes();
    return NextResponse.json(recipes);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    );
  }
}
