"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ServingSelectorProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const MIN = 1;
const MAX = 24;

export function ServingSelector({
  value,
  onChange,
  min = MIN,
  max = MAX,
  className,
}: ServingSelectorProps) {
  const clampedMin = Math.max(1, min);
  const clampedMax = Math.min(MAX, max);

  return (
    <div
      className={className}
      role="group"
      aria-label="份数选择"
    >
      <span className="mr-2 text-sm text-muted-foreground">份数：</span>
      <div className="inline-flex items-center gap-1 rounded-md border border-border">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.max(clampedMin, value - 1))}
          disabled={value <= clampedMin}
          aria-label="减少份数"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-[2rem] text-center font-medium tabular-nums">
          {value}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.min(clampedMax, value + 1))}
          disabled={value >= clampedMax}
          aria-label="增加份数"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
