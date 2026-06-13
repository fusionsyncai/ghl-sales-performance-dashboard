import { CircleDollarSign, TrendingUp, Wallet } from "lucide-react";

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
import { formatMoney, formatMoneyCompact, formatNumber } from "../../lib/format";

export const dynamic = "force-dynamic";

export default async function RevenuePage() {
  const result = await loadDashboard();
  if (!result.ok) return <DataError message={result.error} />;

  const { kpis, reps } = result.data;
  const rows = reps
    .filter((r) => r.revenue > 0 || r.pipelineValue > 0)
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue closed"
          value={formatMoneyCompact(kpis.revenueClosed)}
          icon={CircleDollarSign}
          accentClassName="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Open pipeline"
          value={formatMoneyCompact(kpis.pipelineValue)}
          icon={Wallet}
        />
        <StatCard
          label="Total potential"
          value={formatMoneyCompact(kpis.revenueClosed + kpis.pipelineValue)}
          icon={TrendingUp}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Revenue attribution by rep</CardTitle>
          <CardDescription>
            Payroll vs output — mathematically, not emotionally.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rep</TableHead>
                <TableHead className="text-right">Closed revenue</TableHead>
                <TableHead className="text-right">Open pipeline</TableHead>
                <TableHead className="text-right">Total potential</TableHead>
                <TableHead className="text-right">Won</TableHead>
                <TableHead className="text-right">Avg deal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell>
                    <RepCell name={rep.name} muted={rep.isUnassigned} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                    {formatMoney(rep.revenue)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(rep.pipelineValue)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(rep.revenue + rep.pipelineValue)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(rep.won)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rep.avgDealSize !== null
                      ? formatMoney(rep.avgDealSize)
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No revenue or pipeline yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
          <p className="mt-4 text-xs text-muted-foreground">
            Monthly revenue trends need stored history — coming in the paid tier.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
