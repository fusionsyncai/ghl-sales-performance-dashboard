import { TriangleAlert } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function DataError({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 py-2">
        <TriangleAlert className="mt-0.5 size-5 text-destructive" />
        <div>
          <p className="font-medium">Couldn&apos;t load your GHL data</p>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
