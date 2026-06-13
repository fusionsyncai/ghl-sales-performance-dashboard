import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { initialsFromName } from "@/app/lib/format";

export function RepCell({ name, muted }: { name: string; muted?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-6">
        <AvatarFallback className="text-[10px]">
          {initialsFromName(name)}
        </AvatarFallback>
      </Avatar>
      <span className={cn("font-medium", muted && "text-muted-foreground")}>
        {name}
      </span>
    </div>
  );
}
