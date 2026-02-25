import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getRecipeBySlug } from "@/lib/supabase/recipes";

const CACHE_REVALIDATE_SECONDS = 60;

/** GET /api/recipes/slug/[slug] — one recipe by slug (cached, ISR) */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    // keep slug as-is if not valid %-encoding
  }

  try {
    const recipe = await unstable_cache(
      () => getRecipeBySlug(decodedSlug),
      ["recipe-slug", decodedSlug],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )();

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
