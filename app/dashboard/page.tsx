import {
  CircleDollarSign,
  Clock,
  Layers,
  Percent,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

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
import { loadDashboard } from "../lib/ghl/data";
import {
  formatDays,
  formatMoney,
  formatMoneyCompact,
  formatNumber,
  formatPercent,
} from "../lib/format";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const result = await loadDashboard();
  if (!result.ok) return <DataError message={result.error} />;

  const { kpis, reps } = result.data;
  const teamRows = reps.filter((r) => !r.isUnassigned || r.assigned > 0);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total opps"
          value={formatNumber(kpis.totalOpps)}
          icon={Layers}
        />
        <StatCard
          label="Open"
          value={formatNumber(kpis.openOpps)}
          icon={Target}
          hint={`${formatNumber(kpis.abandonedOpps)} abandoned`}
        />
        <StatCard
          label="Won"
          value={formatNumber(kpis.wonOpps)}
          icon={Trophy}
          accentClassName="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Lost"
          value={formatNumber(kpis.lostOpps)}
          icon={XCircle}
          accentClassName="text-red-600 dark:text-red-400"
        />
        <StatCard
          label="Revenue closed"
          value={formatMoneyCompact(kpis.revenueClosed)}
          icon={CircleDollarSign}
          accentClassName="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Pipeline value"
          value={formatMoneyCompact(kpis.pipelineValue)}
          icon={CircleDollarSign}
        />
        <StatCard
          label="Team close rate"
          value={formatPercent(kpis.closeRate)}
          icon={Percent}
          hint={
            kpis.avgDealSize !== null
              ? `Avg deal ${formatMoneyCompact(kpis.avgDealSize)}`
              : undefined
          }
        />
        <StatCard
          label="Avg close time"
          value={formatDays(kpis.avgCloseTimeDays)}
          icon={Clock}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Team snapshot</CardTitle>
          <CardDescription>
            Who&apos;s crushing, who needs coaching, who deserves more leads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rep</TableHead>
                <TableHead className="text-right">Active</TableHead>
                <TableHead className="text-right">Won</TableHead>
                <TableHead className="text-right">Lost</TableHead>
                <TableHead className="text-right">Close rate</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Stale</TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Avg response
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamRows.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell>
                    <RepCell name={rep.name} muted={rep.isUnassigned} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(rep.active)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatNumber(rep.won)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(rep.lost)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPercent(rep.closeRate)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatMoney(rep.revenue)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rep.staleCount > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400">
                        {formatNumber(rep.staleCount)}
                      </span>
                    ) : (
                      "0"
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    —
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-xs text-muted-foreground">
            Avg response time lands in a later phase (needs the Conversations
            API). Everything else is live from GHL.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
