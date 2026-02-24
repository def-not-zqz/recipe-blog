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
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          {tips.map((tip, i) => (
            <li key={i} className="text-foreground">
              <MarkdownContent inline>{tip}</MarkdownContent>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

