"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        aria-label="Toggle theme"
      >
        —
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const label =
    theme === "system" ? "系统" : theme === "dark" ? "深色" : "浅色";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
      aria-label={`Theme: ${label}`}
    >
      {label}
    </button>
  );
}
