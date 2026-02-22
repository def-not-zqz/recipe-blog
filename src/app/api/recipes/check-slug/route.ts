import { NextResponse } from "next/server";
import { isSlugTaken } from "@/lib/supabase/recipes";

/** GET /api/recipes/check-slug?slug=...&excludeId=... — check if slug is taken */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug" },
      { status: 400 }
    );
  }
  const excludeId = searchParams.get("excludeId") ?? undefined;
  try {
    const taken = await isSlugTaken(slug, excludeId);
    return NextResponse.json({ taken });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to check slug" },
      { status: 500 }
    );
  }
}
