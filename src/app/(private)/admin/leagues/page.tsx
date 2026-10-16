import type { Metadata } from "next";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getLeagueList } from "@/app/(private)/admin/_data/league";

export const metadata: Metadata = {
  title: "リーグ",
};

export default async function Page() {
  const rows = await getLeagueList();

  return (
    <>
      <PageHeader
        title="リーグ"
        backHref="/admin"
        addHref="/admin/leagues/new"
      />
      {rows.length === 0 ? (
        <EmptyState message="リーグがまだ登録されていません" />
      ) : (
        <ul>
          {rows.map((r) => (
            <ListCard
              key={r.id}
              href={`/admin/leagues/${r.id}`}
              title={r.name}
              trailing={<Badge tone="muted">{`${r._count.games}試合`}</Badge>}
            />
          ))}
        </ul>
      )}
    </>
  );
}
