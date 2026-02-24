import { MarkdownContent } from "./markdown-content";

interface NotesSectionProps {
  notes?: string;
}

export function NotesSection({ notes }: NotesSectionProps) {
  if (!notes?.trim()) return null;
  return (
    <>
      <hr className="my-4 border-border" />
      <section aria-label="说明">
        <h2 className="mb-3 text-xl font-semibold">说明</h2>
        <div className="text-muted-foreground whitespace-pre-wrap">
          <MarkdownContent>{notes}</MarkdownContent>
        </div>
      </section>
    </>
  );
}

