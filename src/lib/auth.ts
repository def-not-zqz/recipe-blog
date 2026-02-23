import { createServerAuthClient } from "@/lib/supabase/server-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthUser = { id: string; email?: string } | null;

/** Get current session user on the server. Returns null if not logged in. */
export async function getServerUser(): Promise<AuthUser> {
  const supabase = await createServerAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email ?? undefined };
}

/** Check if the current user (from session) is in the admins table. */
export async function isServerAdmin(): Promise<boolean> {
  const user = await getServerUser();
  if (!user) return false;
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return false;
  return !!data;
}
