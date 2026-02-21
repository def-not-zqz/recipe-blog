"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileEdit, Settings, Info } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "食谱", icon: BookOpen },
  { href: "/drafts", label: "草稿箱", icon: FileEdit },
  { href: "/settings", label: "设置", icon: Settings },
  { href: "/about", label: "关于", icon: Info },
];

export function SiteHeader() {
  const pathname = usePathname();

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
          {navItems.map(({ href, label, icon: Icon }) => {
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
          <div className="ml-2 border-l border-border pl-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
