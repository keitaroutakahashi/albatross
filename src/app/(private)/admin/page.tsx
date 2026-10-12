import {
  Calendar,
  CalendarDays,
  Flag,
  MapPin,
  Trophy,
  User,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardLink } from "@/app/(private)/admin/_components/dashboard-link";
import { getMasterCounts } from "@/app/(private)/admin/_data/dashboard";

export const metadata: Metadata = {
  title: "管理メニュー",
};

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const Section = ({ title, description, children }: SectionProps) => (
  <section>
    <h2 className="text-lg font-bold">{title}</h2>
    {description && (
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    )}
    {children}
  </section>
);

const LinkList = ({ children }: { children: ReactNode }) => (
  <ul className="mt-3 overflow-hidden rounded-xl border bg-background">
    {children}
  </ul>
);

export default async function Page() {
  const counts = await getMasterCounts();

  return (
    <div className="flex flex-col gap-8 px-4 py-6">
      <h1 className="text-2xl font-bold">管理メニュー</h1>

      <Section title="イベント">
        <LinkList>
          <DashboardLink
            href="/admin/events"
            icon={CalendarDays}
            label="イベント一覧"
            count={`${counts.events}件`}
          />
        </LinkList>
      </Section>

      <Section title="選手・ユーザー">
        <LinkList>
          <DashboardLink
            href="/admin/members"
            icon={Users}
            label="メンバー"
            count={`${counts.members}人`}
          />
          <DashboardLink
            href="/admin/users"
            icon={User}
            label="ユーザー"
            count={`${counts.users}人`}
          />
        </LinkList>
      </Section>

      <Section
        title="登録するときの選択肢"
        description="イベントの登録画面で選べる項目です。"
      >
        <LinkList>
          <DashboardLink
            href="/admin/opponents"
            icon={Flag}
            label="対戦相手"
            count={`${counts.opponents}チーム`}
          />
          <DashboardLink
            href="/admin/grounds"
            icon={MapPin}
            label="グラウンド"
            count={`${counts.grounds}か所`}
          />
          <DashboardLink
            href="/admin/leagues"
            icon={Trophy}
            label="リーグ"
            count={`${counts.leagues}件`}
          />
          <DashboardLink
            href="/admin/seasons"
            icon={Calendar}
            label="シーズン（年度）"
            count={`${counts.seasons}年度`}
          />
        </LinkList>
      </Section>
    </div>
  );
}
