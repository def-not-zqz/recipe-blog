import { NextResponse } from "next/server";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

export async function POST() {
  try {
    const supabase = await createServerAuthClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "退出失败" }, { status: 500 });
  }
}
