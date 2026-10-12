import {
  Building2,
  Calendar,
  CalendarDays,
  type LucideIcon,
  MapPin,
  Shield,
  User,
  Users,
} from "lucide-react";
import type { Metadata, Route } from "next";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { getMasterCounts } from "@/app/(private)/admin/_data/dashboard";

export const metadata: Metadata = {
  title: "管理トップ",
};

type Item = {
  href: Route;
  label: string;
  icon: LucideIcon;
  count: number;
};

type Group = {
  title: string;
  items: Item[];
};

export default async function Page() {
  const counts = await getMasterCounts();
  const groups: Group[] = [
    {
      title: "試合・練習",
      items: [
        {
          href: "/admin/events",
          label: "イベント",
          icon: CalendarDays,
          count: counts.events,
        },
      ],
    },
    {
      title: "マスタ管理",
      items: [
        {
          href: "/admin/members",
          label: "メンバー",
          icon: Users,
          count: counts.members,
        },
        {
          href: "/admin/seasons",
          label: "シーズン",
          icon: Calendar,
          count: counts.seasons,
        },
        {
          href: "/admin/leagues",
          label: "リーグ",
          icon: Shield,
          count: counts.leagues,
        },
        {
          href: "/admin/opponents",
          label: "対戦相手",
          icon: Building2,
          count: counts.opponents,
        },
        {
          href: "/admin/grounds",
          label: "グラウンド",
          icon: MapPin,
          count: counts.grounds,
        },
        {
          href: "/admin/users",
          label: "ユーザー",
          icon: User,
          count: counts.users,
        },
      ],
    },
  ];

  return (
    <div>
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="px-4 py-4 text-lg font-bold">{group.title}</h2>
          <ul className="border-t">
            {group.items.map(({ href, label, icon: Icon, count }) => (
              <ListCard
                key={href}
                href={href}
                title={
                  <span className="flex items-center gap-3">
                    <Icon className="size-5 text-muted-foreground" />
                    {label}
                  </span>
                }
                trailing={<Badge tone="muted">{`${count}件`}</Badge>}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
