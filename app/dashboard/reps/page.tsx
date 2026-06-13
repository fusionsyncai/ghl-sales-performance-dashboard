import { DataError } from "@/components/dashboard/data-error";
import { RepCell } from "@/components/dashboard/rep-cell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { loadDashboard } from "../../lib/ghl/data";
import {
  formatDays,
  formatMoney,
  formatNumber,
  formatPercent,
} from "../../lib/format";

export const dynamic = "force-dynamic";

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}

export default async function RepsPage() {
  const result = await loadDashboard();
  if (!result.ok) return <DataError message={result.error} />;

  const { reps } = result.data;
  const realReps = reps.filter((r) => !r.isUnassigned);
  const avgAssigned =
    realReps.length > 0
      ? realReps.reduce((s, r) => s + r.assigned, 0) / realReps.length
      : 0;
  const maxAssigned = Math.max(1, ...realReps.map((r) => r.assigned));

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Workload distribution</CardTitle>
          <CardDescription>
            Is it balanced? Overloaded reps kill conversions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {reps.map((rep) => {
            const overloaded =
              !rep.isUnassigned &&
              avgAssigned > 0 &&
              rep.assigned >= 10 &&
              rep.assigned / avgAssigned >= 1.4;
            return (
              <div key={rep.id} className="flex items-center gap-3">
                <div className="w-40 shrink-0">
                  <RepCell name={rep.name} muted={rep.isUnassigned} />
                </div>
                <Progress
                  value={(rep.assigned / maxAssigned) * 100}
                  className="h-2 flex-1"
                />
                <span className="w-10 text-right text-sm tabular-nums">
                  {formatNumber(rep.assigned)}
                </span>
                <div className="w-24 text-right">
                  {overloaded ? (
                    <Badge
                      variant="outline"
                      className="border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    >
                      Overloaded
                    </Badge>
                  ) : null}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {realReps.map((rep) => (
          <Card key={rep.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <RepCell name={rep.name} />
                <span className="text-sm font-normal text-muted-foreground tabular-nums">
                  {formatPercent(rep.closeRate)} close
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <Metric label="Assigned" value={formatNumber(rep.assigned)} />
                <Metric label="Active" value={formatNumber(rep.active)} />
                <Metric label="Stale" value={formatNumber(rep.staleCount)} />
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-3">
                <Metric label="Won" value={formatNumber(rep.won)} />
                <Metric label="Lost" value={formatNumber(rep.lost)} />
                <Metric
                  label="Avg cycle"
                  value={formatDays(rep.avgCloseTimeDays)}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Revenue" value={formatMoney(rep.revenue)} />
                <Metric
                  label="Avg deal"
                  value={
                    rep.avgDealSize !== null
                      ? formatMoney(rep.avgDealSize)
                      : "—"
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
