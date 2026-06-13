"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { activeNavItem } from "./nav";

export function DashboardHeader({ locationId }: { locationId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = activeNavItem(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <div className="flex flex-col">
        <h1 className="text-sm font-semibold leading-none">{active.title}</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {active.description}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Location <code className="font-mono">{locationId}</code>
        </span>
        <Button variant="outline" size="sm" onClick={() => router.refresh()}>
          <RefreshCw />
          Refresh
        </Button>
        <Button variant="ghost" size="sm" render={<a href="/api/auth/logout" />}>
          <LogOut />
          Disconnect
        </Button>
      </div>
    </header>
  );
}
