import { MarkdownContent } from "./markdown-content";

interface ChangelogSectionProps {
  changelog?: string[];
}

export function ChangelogSection({ changelog }: ChangelogSectionProps) {
  if (!changelog || changelog.length === 0) return null;
  return (
    <>
      <hr className="my-4 border-border" />
      <section aria-label="更新记录">
        <h2 className="mb-3 text-xl font-semibold">更新记录</h2>
        <ul className="space-y-1 text-muted-foreground">
          {changelog.map((entry, i) => (
            <li key={i} className="flex gap-2 text-foreground">
              <span className="mt-1 w-5 shrink-0 text-right font-medium text-muted-foreground">
                {i + 1}.
              </span>
              <div>
                <MarkdownContent inline>{entry}</MarkdownContent>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

