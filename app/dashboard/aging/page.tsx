import { AlarmClock, Clock, Hourglass, Timer } from "lucide-react";

import { DataError } from "@/components/dashboard/data-error";
import { RepCell } from "@/components/dashboard/rep-cell";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { loadDashboard } from "../../lib/ghl/data";
import { formatDays, formatMoney, formatNumber } from "../../lib/format";

export const dynamic = "force-dynamic";

export default async function AgingPage() {
  const result = await loadDashboard();
  if (!result.ok) return <DataError message={result.error} />;

  const { aging, staleOpps, reps } = result.data;
  const repsWithStale = reps
    .filter((r) => r.staleCount > 0 || r.untouched48 > 0)
    .sort((a, b) => b.staleCount - a.staleCount);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Untouched >24h"
          value={formatNumber(aging.over24)}
          icon={Clock}
          accentClassName="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Untouched >48h"
          value={formatNumber(aging.over48)}
          icon={Timer}
          accentClassName="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Stagnant >7d"
          value={formatNumber(aging.over7d)}
          icon={Hourglass}
          accentClassName="text-red-600 dark:text-red-400"
        />
        <StatCard
          label="Stagnant >14d"
          value={formatNumber(aging.over14d)}
          icon={AlarmClock}
          accentClassName="text-red-600 dark:text-red-400"
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Stale by rep</CardTitle>
          <CardDescription>
            Who is letting opportunities die. Intervene here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rep</TableHead>
                <TableHead className="text-right">&gt;24h</TableHead>
                <TableHead className="text-right">&gt;48h</TableHead>
                <TableHead className="text-right">Stale (7d+)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repsWithStale.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell>
                    <RepCell name={rep.name} muted={rep.isUnassigned} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(rep.untouched24)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(rep.untouched48)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium text-red-600 dark:text-red-400">
                    {formatNumber(rep.staleCount)}
                  </TableCell>
                </TableRow>
              ))}
              {repsWithStale.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Nothing stale. Clean floor.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dying opportunities</CardTitle>
          <CardDescription>
            Open 7+ days with no activity, oldest first ·{" "}
            {formatNumber(staleOpps.length)} shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Rep</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staleOpps.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell className="max-w-[220px] truncate font-medium">
                    {opp.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {opp.repName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {opp.stageName}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(opp.value)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-red-600 dark:text-red-400">
                    {formatDays(opp.ageDays)}
                  </TableCell>
                </TableRow>
              ))}
              {staleOpps.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No dying opportunities.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
