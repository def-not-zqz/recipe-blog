import { redirect } from "next/navigation";
import { isServerAdmin } from "@/lib/auth";

export default async function NewRecipeLayout({
  children,
}: { children: React.ReactNode }) {
  const admin = await isServerAdmin();
  if (!admin) redirect("/");
  return <>{children}</>;
}
