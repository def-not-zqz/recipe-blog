"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, FileEdit, Settings, Info, PlusCircle, LogIn, LogOut } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "食谱", icon: BookOpen },
  { href: "/drafts", label: "草稿箱", icon: FileEdit, adminOnly: true },
  { href: "/settings", label: "设置", icon: Settings },
  { href: "/about", label: "关于", icon: Info },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading, refresh } = useAuth();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    refresh();
    router.push("/");
    router.refresh();
  };

  const visibleNavItems = navItems.filter(
    (item) => !("adminOnly" in item && item.adminOnly) || isAdmin
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <BookOpen className="h-5 w-5" />
          <span className="hidden sm:inline">Recipe Blog</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="主导航">
          {visibleNavItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
          {!loading && (
            isAdmin ? (
              <Link
                href="/recipes/new"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                )}
              >
                <PlusCircle className="h-4 w-4" />
                <span>创建食谱</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                )}
              >
                <LogIn className="h-4 w-4" />
                <span>登录</span>
              </Link>
            )
          )}
          {!loading && user && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>退出</span>
            </Button>
          )}
          <div className="ml-2 border-l border-border pl-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
