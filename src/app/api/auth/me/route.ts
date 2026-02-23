import { NextResponse } from "next/server";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerAuthClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ user: null, isAdmin: false });
    }
    const serviceSupabase = createServerSupabaseClient();
    const { data: adminRow } = await serviceSupabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    return NextResponse.json({
      user: { id: user.id, email: user.email ?? undefined },
      isAdmin: !!adminRow,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ user: null, isAdmin: false });
  }
}
