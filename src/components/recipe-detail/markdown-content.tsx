"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

const blockMarkdownComponents = {
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p className={cn("mb-2 last:mb-0", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul className={cn("list-inside list-disc space-y-1", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol className={cn("list-inside list-decimal space-y-1", className)} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("pl-1", className)} {...props} />
  ),
  strong: ({ className, ...props }: React.ComponentProps<"strong">) => (
    <strong className={cn("font-semibold", className)} {...props} />
  ),
  a: ({ className, ...props }: React.ComponentProps<"a">) => (
    <a className={cn("text-primary underline underline-offset-2", className)} {...props} />
  ),
  code: ({ className, ...props }: React.ComponentProps<"code">) => (
    <code className={cn("rounded bg-muted px-1.5 py-0.5 text-sm font-mono", className)} {...props} />
  ),
};

/** Inline variant: p renders as span so content stays on one line inside list items. */
const inlineMarkdownComponents = {
  ...blockMarkdownComponents,
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <span className={cn("mb-0", className)} {...props} />
  ),
};

interface MarkdownContentProps {
  children: string;
  className?: string;
  /** Use inside list items so bullet and text stay on the same line. */
  inline?: boolean;
}

/** Renders markdown with consistent recipe styling. Safe for user content (no raw HTML). */
export function MarkdownContent({ children, className, inline }: MarkdownContentProps) {
  if (!children?.trim()) return null;
  const components = inline ? inlineMarkdownComponents : blockMarkdownComponents;
  const Wrapper = inline ? "span" : "div";
  return (
    <Wrapper className={cn("markdown-content", className)}>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </Wrapper>
  );
}
