import type { Metadata } from "next";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getSeasonList } from "@/app/(private)/admin/_data/season";

export const metadata: Metadata = {
  title: "シーズン（年度）",
};

export default async function Page() {
  const rows = await getSeasonList();

  return (
    <>
      <PageHeader
        title="シーズン（年度）"
        backHref="/admin"
        addHref="/admin/seasons/new"
      />
      {rows.length === 0 ? (
        <EmptyState message="シーズンがまだ登録されていません" />
      ) : (
        <ul>
          {rows.map((r) => (
            <ListCard
              key={r.id}
              href={`/admin/seasons/${r.id}`}
              title={`${r.season}年度`}
              description={r.name}
              trailing={<Badge tone="muted">{`${r._count.events}件`}</Badge>}
            />
          ))}
        </ul>
      )}
    </>
  );
}
