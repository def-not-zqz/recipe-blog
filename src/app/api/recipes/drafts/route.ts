import { NextResponse } from "next/server";
import { getDraftRecipes } from "@/lib/supabase/recipes";
import { isServerAdmin } from "@/lib/auth";

/** GET /api/recipes/drafts — draft recipes (admin list). Admin only. */
export async function GET() {
  try {
    const admin = await isServerAdmin();
    if (!admin) {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });
    }
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
