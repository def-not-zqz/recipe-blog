import { NextResponse } from "next/server";
import { getCommentsByRecipeId, createComment } from "@/lib/supabase/comments";
import type { CreateCommentPayload } from "@/types/comment";

/** GET /api/recipes/id/[id]/comments — list approved comments */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: recipeId } = await params;
  try {
    const comments = await getCommentsByRecipeId(recipeId);
    return NextResponse.json(comments);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/** POST /api/recipes/id/[id]/comments — create a comment */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: recipeId } = await params;
  try {
    const body = (await request.json()) as CreateCommentPayload;
    if (!body.content?.trim()) {
      return NextResponse.json(
        { error: "评论内容不能为空" },
        { status: 400 }
      );
    }
    const comment = await createComment(recipeId, {
      author_name: body.author_name ?? "",
      author_email: body.author_email,
      content: body.content.trim(),
    });
    return NextResponse.json(comment);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
