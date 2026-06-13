import { ShieldCheck } from "lucide-react";

import { DataError } from "@/components/dashboard/data-error";
import { SeverityBadge } from "@/components/dashboard/severity-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadDashboard } from "../../lib/ghl/data";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const result = await loadDashboard();
  if (!result.ok) return <DataError message={result.error} />;

  const { alerts } = result.data;

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-2">
          <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="font-medium">No risk flags right now</p>
            <p className="text-sm text-muted-foreground">
              Workload is balanced, the pipeline is fresh, and every opportunity
              has an owner.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Automatic flags from the current snapshot. Trend-based alerts (drops over
        time) arrive with the paid tier.
      </p>
      {alerts.map((alert) => (
        <Card key={alert.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3 text-base">
              <span>{alert.title}</span>
              <SeverityBadge severity={alert.severity} />
            </CardTitle>
            <CardDescription>{alert.detail}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
