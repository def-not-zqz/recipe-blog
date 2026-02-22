import { NextResponse } from "next/server";
import { deleteRecipe } from "@/lib/supabase/recipes";

/** DELETE /api/recipes/id/[id] — delete recipe by id */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
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
