import { NextResponse } from "next/server";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email as string | undefined;
    const password = body.password as string | undefined;
    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }
    const supabase = await createServerAuthClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      return NextResponse.json(
        { error: error.message === "Invalid login credentials" ? "邮箱或密码错误" : error.message },
        { status: 401 }
      );
    }
    return NextResponse.json({ user: { id: data.user.id, email: data.user.email } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
