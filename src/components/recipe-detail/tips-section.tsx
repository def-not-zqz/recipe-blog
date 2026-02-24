import { MarkdownContent } from "./markdown-content";

interface TipsSectionProps {
  tips?: string[];
}

export function TipsSection({ tips }: TipsSectionProps) {
  if (!tips || tips.length === 0) return null;
  return (
    <>
      <hr className="my-4 border-border" />
      <section aria-label="小贴士">
        <h2 className="mb-3 text-xl font-semibold">小贴士</h2>
        <ol className="space-y-2 text-muted-foreground">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-foreground">
              <span className="mt-1 w-5 shrink-0 text-right font-medium text-muted-foreground">
                {i + 1}.
              </span>
              <div>
                <MarkdownContent inline>{tip}</MarkdownContent>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

