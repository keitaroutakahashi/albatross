"use client";

import {
  BarChart3,
  type LucideIcon,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/shadcn/drawer";
import { cn } from "@/lib/utils";

type NavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "試合",
    items: [{ href: "/games", label: "試合一覧", icon: Trophy }],
  },
  {
    label: "メンバー",
    items: [{ href: "/members", label: "メンバー一覧", icon: Users }],
  },
  {
    label: "成績",
    items: [
      { href: "/batting-stats", label: "打者成績", icon: BarChart3 },
      { href: "/pitching-stats", label: "投手成績", icon: Target },
    ],
  },
];

type Props = {
  children: React.ReactNode;
};

export function SideNavigation({ children }: Props) {
  const pathname = usePathname();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="gap-0 border-white/10 bg-primary text-primary-foreground data-[vaul-drawer-direction=right]:sm:max-w-xs">
        <div className="flex items-center justify-between border-b border-white/10 px-5 pt-5 pb-4">
          <DrawerTitle className="text-base font-bold tracking-wide text-primary-foreground">
            メニュー
          </DrawerTitle>
          <DrawerClose asChild>
            <button
              type="button"
              aria-label="閉じる"
              className="rounded-full p-1.5 text-primary-foreground/70 transition-colors hover:bg-white/10 hover:text-primary-foreground"
            >
              <X className="size-4" />
            </button>
          </DrawerClose>
        </div>
        <nav className="no-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-xxs font-semibold tracking-widest text-primary-foreground/50 uppercase">
                {group.label}
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <DrawerClose asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-secondary text-secondary-foreground"
                              : "text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground",
                          )}
                        >
                          <Icon className="size-4 shrink-0" />
                          {item.label}
                        </Link>
                      </DrawerClose>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
