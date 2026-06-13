import {
  Clock,
  DollarSign,
  GitBranch,
  LayoutDashboard,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "The 5-second morning scan",
  },
  {
    title: "Reps",
    href: "/dashboard/reps",
    icon: Users,
    description: "Per-rep performance & workload",
  },
  {
    title: "Pipeline",
    href: "/dashboard/pipeline",
    icon: GitBranch,
    description: "Where open opportunities sit",
  },
  {
    title: "Aging",
    href: "/dashboard/aging",
    icon: Clock,
    description: "Stale & dying opportunities",
  },
  {
    title: "Revenue",
    href: "/dashboard/revenue",
    icon: DollarSign,
    description: "Revenue attribution by rep",
  },
  {
    title: "Alerts",
    href: "/dashboard/alerts",
    icon: TriangleAlert,
    description: "Automatic risk flags",
  },
];

export function activeNavItem(pathname: string): NavItem {
  const match = navItems.find((item) =>
    item.href === "/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href),
  );
  return match ?? navItems[0];
}
