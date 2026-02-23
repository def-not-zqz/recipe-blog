import { NextResponse } from "next/server";
import { deleteRecipe } from "@/lib/supabase/recipes";
import { isServerAdmin } from "@/lib/auth";

/** DELETE /api/recipes/id/[id] — delete recipe by id. Admin only. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const admin = await isServerAdmin();
    if (!admin) {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });
    }
    await deleteRecipe(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
