import { NextResponse } from "next/server";
import { getRecipeBySlug } from "@/lib/supabase/recipes";

/** GET /api/recipes/slug/[slug] — one recipe by slug */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const recipe = await getRecipeBySlug(slug);
    if (!recipe) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(recipe);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}
