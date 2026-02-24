import type { StepsSection } from "@/types/recipe";
import { MarkdownContent } from "./markdown-content";
import Image from "next/image";

interface StepsSectionProps {
  steps: StepsSection[];
}

export function StepsSectionView({ steps }: StepsSectionProps) {
  return (
    <section aria-label="步骤">
      <h2 className="mb-3 text-xl font-semibold">步骤</h2>
      <div className="space-y-4">
        {steps.map((sec, sectionIdx) => (
          <div key={sectionIdx} className="space-y-2">
            {sec.name?.trim() && (
              <h3 className="text-sm font-medium text-foreground">
                {sec.name}
              </h3>
            )}
            <ol className="space-y-4 text-muted-foreground">
              {sec.items.map((step, i) => (
                <li key={i} className="flex gap-2 text-foreground">
                  <span className="mt-1 w-5 shrink-0 text-right font-medium text-muted-foreground">
                    {i + 1}.
                  </span>
                  <div className="space-y-2">
                    <MarkdownContent inline>{step.content}</MarkdownContent>
                    {step.image && (
                      <div className="relative mt-1 aspect-[4/3] w-full max-w-md overflow-hidden rounded-md bg-muted">
                        {step.image.startsWith("data:") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={step.image}
                            alt={`步骤 ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Image
                            src={step.image}
                            alt={`步骤 ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

