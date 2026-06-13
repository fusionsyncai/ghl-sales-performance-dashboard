import { DataError } from "@/components/dashboard/data-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { loadDashboard } from "../../lib/ghl/data";
import { formatMoney, formatNumber } from "../../lib/format";
import type { StageBucket } from "../../lib/metrics";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const result = await loadDashboard();
  if (!result.ok) return <DataError message={result.error} />;

  const { stages } = result.data;

  if (stages.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          No open opportunities with a pipeline stage were found.
        </CardContent>
      </Card>
    );
  }

  const byPipeline = new Map<string, StageBucket[]>();
  for (const stage of stages) {
    const list = byPipeline.get(stage.pipelineName) ?? [];
    list.push(stage);
    byPipeline.set(stage.pipelineName, list);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Where open opportunities sit right now. (Movement{" "}
        <em>over time</em> needs history — that&apos;s the paid tier.)
      </p>
      {[...byPipeline.entries()].map(([pipelineName, pipelineStages]) => {
        const maxCount = Math.max(...pipelineStages.map((s) => s.count), 1);
        const totalCount = pipelineStages.reduce((s, x) => s + x.count, 0);
        const totalValue = pipelineStages.reduce((s, x) => s + x.value, 0);
        return (
          <Card key={pipelineName}>
            <CardHeader>
              <CardTitle>{pipelineName}</CardTitle>
              <CardDescription>
                {formatNumber(totalCount)} open ·{" "}
                {formatMoney(totalValue)} pipeline value
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {pipelineStages.map((stage) => (
                <div key={stage.stageId} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{stage.name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {formatNumber(stage.count)} · {formatMoney(stage.value)}
                    </span>
                  </div>
                  <Progress
                    value={(stage.count / maxCount) * 100}
                    className="h-2.5 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-emerald-500 [&_[data-slot=progress-indicator]]:to-teal-500"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
