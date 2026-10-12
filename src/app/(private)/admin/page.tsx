import {
  Calendar,
  CalendarDays,
  Flag,
  type LucideIcon,
  MapPin,
  Trophy,
  User,
  Users,
} from "lucide-react";
import type { Metadata, Route } from "next";
import { DashboardLink } from "@/app/(private)/admin/_components/dashboard-link";
import { getMasterCounts } from "@/app/(private)/admin/_data/dashboard";
import { getCurrentRole } from "@/app/(private)/admin/_utils/auth";
import {
  type AdminFeature,
  canAccess,
} from "@/app/(private)/admin/_utils/permissions";

export const metadata: Metadata = {
  title: "管理メニュー",
};

type Item = {
  href: Route;
  icon: LucideIcon;
  label: string;
  count: string;
  feature: AdminFeature;
};

type Section = {
  title: string;
  description?: string;
  items: Item[];
};

export default async function Page() {
  const [role, counts] = await Promise.all([
    getCurrentRole(),
    getMasterCounts(),
  ]);

  const allSections: Section[] = [
    {
      title: "イベント",
      items: [
        {
          href: "/admin/events",
          icon: CalendarDays,
          label: "イベント一覧",
          count: `${counts.events}件`,
          feature: "events",
        },
      ],
    },
    {
      title: "選手・ユーザー",
      items: [
        {
          href: "/admin/members",
          icon: Users,
          label: "メンバー",
          count: `${counts.members}人`,
          feature: "members",
        },
        {
          href: "/admin/users",
          icon: User,
          label: "ユーザー",
          count: `${counts.users}人`,
          feature: "users",
        },
      ],
    },
    {
      title: "登録するときの選択肢",
      description: "イベントの登録画面で選べる項目です。",
      items: [
        {
          href: "/admin/opponents",
          icon: Flag,
          label: "対戦相手",
          count: `${counts.opponents}チーム`,
          feature: "options",
        },
        {
          href: "/admin/grounds",
          icon: MapPin,
          label: "グラウンド",
          count: `${counts.grounds}か所`,
          feature: "options",
        },
        {
          href: "/admin/leagues",
          icon: Trophy,
          label: "リーグ",
          count: `${counts.leagues}件`,
          feature: "options",
        },
        {
          href: "/admin/seasons",
          icon: Calendar,
          label: "シーズン（年度）",
          count: `${counts.seasons}年度`,
          feature: "options",
        },
      ],
    },
  ];

  // 使えない機能は表示せず、項目が残らないまとまりも出さない
  const sections = allSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccess(role, item.feature)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="flex flex-col gap-8 px-4 py-6">
      <h1 className="text-2xl font-bold">管理メニュー</h1>

      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-lg font-bold">{section.title}</h2>
          {section.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {section.description}
            </p>
          )}
          <ul className="mt-3 overflow-hidden rounded-xl border bg-background">
            {section.items.map((item) => (
              <DashboardLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                count={item.count}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
