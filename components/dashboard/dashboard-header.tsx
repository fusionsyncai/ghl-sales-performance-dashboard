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
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <div className="flex flex-col">
        <h1 className="font-heading text-base font-semibold leading-none tracking-tight">
          {active.title}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {active.description}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 lg:inline-flex dark:text-emerald-300">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          Live · nothing stored
        </span>
        <span className="hidden text-xs text-muted-foreground xl:inline">
          <code className="font-mono">{locationId}</code>
        </span>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => router.refresh()}
        >
          <RefreshCw />
          Refresh
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          render={<a href="/api/auth/logout" />}
        >
          <LogOut />
          Disconnect
        </Button>
      </div>
    </header>
  );
}
