import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accentClassName,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accentClassName?: string;
}) {
  return (
    <Card className="group transition-all hover:-translate-y-0.5 hover:[box-shadow:var(--shadow-card-hover)]">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {Icon ? (
            <span className="flex size-8 items-center justify-center rounded-xl bg-muted/70 ring-1 ring-border/60">
              <Icon
                className={cn("size-4 text-muted-foreground", accentClassName)}
              />
            </span>
          ) : null}
        </div>
        <span className="font-heading text-3xl font-semibold leading-none tracking-tight tabular-nums">
          {value}
        </span>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </CardContent>
    </Card>
  );
}
