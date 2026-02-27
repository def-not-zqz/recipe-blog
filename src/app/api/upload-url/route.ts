import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isServerAdmin } from "@/lib/auth";

function getPublicUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  const baseUrl = base.replace(/\/$/, "");
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/** POST /api/upload-url — get signed upload URL for direct browser→Supabase upload. Admin only. */
export async function POST(request: Request) {
  try {
    const admin = await isServerAdmin();
    if (!admin) {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });
    }
    const body = (await request.json()) as { bucket: string; path: string };
    const { bucket, path } = body;
    if (!bucket || typeof path !== "string" || !path.trim()) {
      return NextResponse.json(
        { error: "bucket and path are required" },
        { status: 400 }
      );
    }
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path.trim(), { upsert: true });
    if (error) {
      console.error("[upload-url]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const publicUrl = getPublicUrl(bucket, path.trim());
    return NextResponse.json({
      path: data.path,
      token: data.token,
      publicUrl,
    });
  } catch (e) {
    console.error("[upload-url]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create upload URL" },
      { status: 500 }
    );
  }
}
