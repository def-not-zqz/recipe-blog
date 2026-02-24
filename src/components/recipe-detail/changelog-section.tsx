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
        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
          {changelog.map((entry, i) => (
            <li key={i} className="text-foreground">
              <MarkdownContent inline>{entry}</MarkdownContent>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

