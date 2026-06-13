import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@/app/lib/metrics";

const styles: Record<AlertSeverity, string> = {
  high: "bg-red-500/10 text-red-600 dark:text-red-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  low: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent capitalize", styles[severity])}
    >
      {severity}
    </Badge>
  );
}
